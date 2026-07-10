import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { fetchJobsFromAdzuna } from "./adzuna.js";
import { logger } from "./logger.js";

type AiIntent = "updateFilters" | "searchJobs" | "help";
type AiTool = "updateFilters" | "searchJobs" | "help";

type FilterUpdates = {
  role?: string;
  skills?: string; // comma-separated on frontend
  datePosted?: string;
  jobType?: string;
  workMode?: string;
  location?: string;
  minMatchScore?: number;
};

type AiGraphState = {
  message: string;
  history: any[];
  intent: AiIntent;
  tool: AiTool;
  filterUpdates: FilterUpdates;
  reply: string;
  action: string;
  jobRecommendations: any[];
};

const AiState = Annotation.Root({
  message: Annotation<string>(),
  history: Annotation<any[]>(),
  intent: Annotation<AiIntent>(),
  tool: Annotation<AiTool>(),
  filterUpdates: Annotation<any>(),
  reply: Annotation<string>(),
  action: Annotation<string>(),
  jobRecommendations: Annotation<any[]>(),
});

const openaiKey = process.env.OPENAI_API_KEY;

const model = openaiKey
  ? new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
      apiKey: openaiKey,
    })
  : null;

function buildResetFilterUpdates(): FilterUpdates {
  return {
    role: "",
    skills: "",
    datePosted: "",
    jobType: "",
    workMode: "",
    location: "",
    minMatchScore: 0,
  };
}

function heuristicIntentAndFilters(message: string) {
  const lower = message.toLowerCase();

  const filterUpdates: FilterUpdates = {};

  if (
    lower.includes("help") ||
    lower.includes("how upload") ||
    lower.includes("how do i") ||
    lower.includes("where")
  ) {
    return {
      intent: "help" as AiIntent,
      filterUpdates: {},
      reply:
        "Sure. Upload your resume on the `Resume` page, then ask like `React remote jobs` (text or mic).",
      action: "help",
      jobRecommendations: [],
    };
  }

  if (lower.includes("clear") || lower.includes("reset")) {
    return {
      intent: "updateFilters" as AiIntent,
      filterUpdates: buildResetFilterUpdates(),
      reply: "Filters cleared. Tell me the role you want, e.g. `React remote jobs`.",
      action: "updateFilters",
      jobRecommendations: [],
    };
  }

  if (lower.includes("remote")) filterUpdates.workMode = "remote";
  if (lower.includes("hybrid")) filterUpdates.workMode = "hybrid";
  if (lower.includes("on-site") || lower.includes("onsite"))
    filterUpdates.workMode = "onsite";

  if (lower.includes("full")) filterUpdates.jobType = "full-time";
  if (lower.includes("contract")) filterUpdates.jobType = "contract";
  if (lower.includes("part")) filterUpdates.jobType = "part-time";

  if (lower.includes("high match")) filterUpdates.minMatchScore = 80;

  const locMatch = lower.match(/in\s+([a-z\s]+)/);
  if (locMatch) filterUpdates.location = locMatch[1].trim();

  const roleKeywords: Array<[string, string]> = [
    ["react", "React developer"],
    ["node", "Node developer"],
    ["python", "Python developer"],
    ["java", "Java developer"],
    ["ml engineer", "Machine Learning Engineer"],
    ["ml", "Machine Learning"],
    ["data", "Data Engineer"],
  ];
  for (const [needle, value] of roleKeywords) {
    if (lower.includes(needle)) {
      filterUpdates.role = value;
      break;
    }
  }

  const wantsJobs =
    lower.includes("jobs") || lower.includes("job listings") || lower.includes("openings");
  const intent: AiIntent = wantsJobs ? "searchJobs" : "updateFilters";
  const roleText = filterUpdates.role || "software roles";

  return {
    intent,
    filterUpdates,
    reply:
      intent === "searchJobs"
        ? `Searching jobs for ${roleText}...`
        : `Got it. Updated filters for ${roleText}.`,
    action: intent === "searchJobs" ? "searchJobs" : "updateFilters",
    jobRecommendations: [],
  };
}

async function intentNode(state: AiGraphState): Promise<Partial<AiGraphState>> {
  if (!model) {
    const fallback = heuristicIntentAndFilters(state.message);
    return {
      intent: fallback.intent,
      filterUpdates: fallback.filterUpdates,
      reply: fallback.reply,
      action: fallback.action,
      jobRecommendations: [],
    };
  }

  const systemPrompt = `
You are Smart AI Job Assistant.

Extract the user's intent and filter updates from the message.
Respond with JSON only (no markdown, no extra text).

Return this schema:
{
  "intent": "updateFilters" | "searchJobs" | "help",
  "action": "updateFilters" | "searchJobs" | "help",
  "reply": "short text to show the user",
  "filterUpdates": {
    "role"?: string,
    "skills"?: string,
    "datePosted"?: string,
    "jobType"?: string,
    "workMode"?: string,
    "location"?: string,
    "minMatchScore"?: number
  }
}

Rules:
- If user asks for help/how-to, intent MUST be "help".
- If user asks for jobs/search/listings, intent MUST be "searchJobs".
- Otherwise, intent MUST be "updateFilters".
- When clearing filters, set all fields to empty/default values.
`;

  const historyText = (state.history || [])
    .slice(-6)
    .map((m: any) => `${m.role}: ${m.content}`)
    .join("\n");

  try {
    const resp = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `Conversation history:\n${historyText}\n\nUser message:\n${state.message}`
      ),
    ]);

    const text = resp.content as string;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    const intent = (parsed.intent || "updateFilters") as AiIntent;
    return {
      intent,
      filterUpdates: parsed.filterUpdates || {},
      reply: parsed.reply || "Okay.",
      action: parsed.action || intent,
      jobRecommendations: [],
    };
  } catch (e) {
    logger.warn({ e }, "AI intent failed, using heuristic fallback");
    const fallback = heuristicIntentAndFilters(state.message);
    return {
      intent: fallback.intent,
      filterUpdates: fallback.filterUpdates,
      reply: fallback.reply,
      action: fallback.action,
      jobRecommendations: [],
    };
  }
}

async function routerNode(state: AiGraphState): Promise<Partial<AiGraphState>> {
  const tool: AiTool =
    state.intent === "help"
      ? "help"
      : state.intent === "searchJobs"
        ? "searchJobs"
        : "updateFilters";
  return { tool };
}

async function updateFiltersNode(state: AiGraphState): Promise<Partial<AiGraphState>> {
  return {
    action: "updateFilters",
    reply: state.reply || "Filters updated. Showing results based on your filters.",
    jobRecommendations: [],
  };
}

async function searchJobsNode(state: AiGraphState): Promise<Partial<AiGraphState>> {
  const updates = state.filterUpdates || {};
  const role = updates.role || "";
  const skills = updates.skills || "";
  const location = updates.location || "india";

  const roleQuery = [role, skills].filter(Boolean).join(" ").trim() || "developer";

  try {
    const jobs = await fetchJobsFromAdzuna(roleQuery, location);

    // Enhanced job recommendations with detailed information
    const jobRecommendations = jobs.slice(0, 5).map((j: any) => {
      // Extract technical skills from job description
      const technicalSkillsInJob = extractTechnicalSkillsFromDescription(j.description);
      
      return {
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        applyUrl: j.applyUrl,
        description: j.description,
        technicalSkills: technicalSkillsInJob,
        // Add job analysis
        analysis: {
          seniority: estimateSeniority(j.title, j.description),
          techStack: identifyTechStack(j.description),
          requirements: extractRequirements(j.description)
        }
      };
    });

    // Create detailed reply with job insights
    const detailedReply = generateDetailedJobReply(roleQuery, jobRecommendations);

    return {
      action: "searchJobs",
      reply: detailedReply,
      jobRecommendations,
    };
  } catch (e) {
    logger.error({ e }, "Search jobs failed in searchJobsNode");
    return {
      action: "searchJobs",
      reply: "I couldn't fetch jobs right now. Try again later.",
      jobRecommendations: [],
    };
  }
}

// Helper functions for enhanced job analysis
function extractTechnicalSkillsFromDescription(description: string): string[] {
  const technicalKeywords = [
    'react', 'angular', 'vue', 'node', 'express', 'python', 'java', 'javascript', 'typescript',
    'aws', 'azure', 'docker', 'kubernetes', 'mongodb', 'postgresql', 'mysql', 'redis',
    'git', 'ci/cd', 'agile', 'scrum', 'rest api', 'graphql', 'microservices', 'cloud',
    'machine learning', 'ai', 'data science', 'devops', 'testing', 'unit testing'
  ];
  
  const desc = description.toLowerCase();
  return technicalKeywords.filter(skill => desc.includes(skill)).slice(0, 8);
}

function estimateSeniority(title: string, description: string): string {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal') ||
      descLower.includes('5+ years') || descLower.includes('senior level')) {
    return 'Senior';
  } else if (titleLower.includes('junior') || titleLower.includes('entry') || titleLower.includes('associate') ||
             descLower.includes('0-2 years') || descLower.includes('entry level')) {
    return 'Junior';
  } else if (titleLower.includes('mid') || titleLower.includes('middle') ||
             descLower.includes('3-5 years') || descLower.includes('mid level')) {
    return 'Mid-level';
  }
  return 'Not specified';
}

function identifyTechStack(description: string): string[] {
  const techStacks = {
    'Frontend': ['react', 'angular', 'vue', 'html', 'css', 'javascript', 'typescript', 'next.js'],
    'Backend': ['node', 'express', 'python', 'java', 'c#', 'php', 'ruby', 'go', 'rust'],
    'Database': ['mongodb', 'postgresql', 'mysql', 'redis', 'oracle', 'sql server'],
    'Cloud': ['aws', 'azure', 'google cloud', 'gcp', 'heroku', 'vercel'],
    'DevOps': ['docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible']
  };
  
  const desc = description.toLowerCase();
  const identifiedStacks: string[] = [];
  
  for (const [stack, technologies] of Object.entries(techStacks)) {
    if (technologies.some(tech => desc.includes(tech))) {
      identifiedStacks.push(stack);
    }
  }
  
  return identifiedStacks;
}

function extractRequirements(description: string): string[] {
  const requirements = [];
  const desc = description.toLowerCase();
  
  if (desc.includes('degree') || desc.includes('bachelor') || desc.includes('master')) {
    requirements.push('Education');
  }
  if (desc.includes('experience') || desc.includes('years')) {
    requirements.push('Experience');
  }
  if (desc.includes('remote') || desc.includes('work from home')) {
    requirements.push('Remote Work');
  }
  if (desc.includes('team') || desc.includes('collaboration')) {
    requirements.push('Team Collaboration');
  }
  if (desc.includes('project') || desc.includes('deadline')) {
    requirements.push('Project Management');
  }
  
  return requirements;
}

function generateDetailedJobReply(roleQuery: string, jobs: any[]): string {
  if (jobs.length === 0) {
    return `I couldn't find any ${roleQuery} positions at the moment. Try adjusting your search criteria.`;
  }
  
  let reply = `Found ${jobs.length} great ${roleQuery} opportunities for you!\n\n`;
  
  jobs.forEach((job, index) => {
    reply += `${index + 1}. **${job.title}** at ${job.company}\n`;
    reply += `   📍 Location: ${job.location}\n`;
    reply += `   🎯 Seniority: ${job.analysis.seniority}\n`;
    
    if (job.technicalSkills.length > 0) {
      reply += `   💻 Technical Skills: ${job.technicalSkills.join(', ')}\n`;
    }
    
    if (job.analysis.techStack.length > 0) {
      reply += `   🏗️ Tech Stack: ${job.analysis.techStack.join(', ')}\n`;
    }
    
    if (job.analysis.requirements.length > 0) {
      reply += `   📋 Requirements: ${job.analysis.requirements.join(', ')}\n`;
    }
    
    reply += '\n';
  });
  
  reply += `💡 **Tip**: Make sure your resume highlights these technical skills to increase your match score!`;
  
  return reply;
}

async function helpNode(state: AiGraphState): Promise<Partial<AiGraphState>> {
  return {
    action: "help",
    reply:
      "How to use Smart AI:\n- Upload resume on `Resume` page (PDF/TXT).\n- Ask jobs like `React remote jobs` using text or mic.\n- Open `Applications` to track your job statuses.",
    jobRecommendations: [],
  };
}

// LangGraph workflow: Intent -> Router -> Tool Nodes
const graph = new StateGraph(AiState)
  .addNode("intent_node", intentNode)
  .addNode("router", routerNode)
  .addNode("updateFilters", updateFiltersNode)
  .addNode("searchJobs", searchJobsNode)
  .addNode("help", helpNode)
  .addEdge(START, "intent_node")
  .addEdge("intent_node", "router")
  .addConditionalEdges("router", (s: AiGraphState) => s.tool, {
    updateFilters: "updateFilters",
    searchJobs: "searchJobs",
    help: "help",
  })
  .addEdge("updateFilters", END)
  .addEdge("searchJobs", END)
  .addEdge("help", END)
  .compile();

export async function processAiChat(message: string, history: any[]) {
  const initial: AiGraphState = {
    message,
    history: history || [],
    intent: "updateFilters",
    tool: "updateFilters",
    filterUpdates: {},
    reply: "",
    action: "updateFilters",
    jobRecommendations: [],
  };

  const out = await graph.invoke(initial);

  return {
    reply: out.reply || "Okay.",
    action: out.action || out.intent || "updateFilters",
    filterUpdates: out.filterUpdates || {},
    jobRecommendations: out.jobRecommendations || [],
  };
}