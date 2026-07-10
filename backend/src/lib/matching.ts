import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { logger } from "./logger.js";
import type { Job } from "./store.js";

const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey,
  ...(baseURL ? { configuration: { baseURL } } : {}),
});

export async function matchJobToResume(
  job: Job,
  resumeText: string,
  resumeSkills: string[]
): Promise<{ score: number; matchingSkills: string[]; experience: string; keywordAlignment: string }> {
  try {
    const jobRequiredSkills =
      (job.skills && job.skills.length > 0
        ? job.skills
        : resumeSkills.filter((rs) => job.description.toLowerCase().includes(rs.toLowerCase())).slice(0, 15)) ||
      [];

    const prompt = `You are an expert job matching AI. Analyze how well a candidate's technical skills match a job description.

CANDIDATE TECHNICAL SKILLS: ${resumeSkills.join(", ")}

JOB TITLE: ${job.title}
JOB COMPANY: ${job.company}
JOB DESCRIPTION:
${job.description.slice(0, 800)}

Focus ONLY on technical skill matching. Do not assume experience levels or years of experience.

Provide a match analysis in JSON format:
{
  "score": <number 0-100>,
  "matchingSkills": [<list of technical skills that match>],
  "experience": "Technical skill alignment analysis",
  "keywordAlignment": "Technical keyword and domain alignment"
}

Score guidelines based on technical skills only:
- 70-100: Strong technical match (most required technical skills present)
- 40-69: Moderate technical match (some technical skills match)
- 0-39: Weak technical match (few technical skills match)

Return ONLY the JSON object, no other text.`;

    const response = await model.invoke([
      new SystemMessage("You are a job matching expert. Return only valid JSON."),
      new HumanMessage(prompt),
    ]);

    const content = response.content as string;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const result = JSON.parse(jsonMatch[0]);
    return {
      score: Math.max(0, Math.min(100, Number(result.score) || 0)),
      matchingSkills: Array.isArray(result.matchingSkills) ? result.matchingSkills : [],
      experience: result.experience || "",
      keywordAlignment: result.keywordAlignment || "",
    };
  } catch (err) {
    logger.error({ err }, "Failed to match job to resume");
    const jobSkillPool = (job.skills && job.skills.length > 0 ? job.skills : resumeSkills) || [];
    const matching = jobSkillPool.filter((s) =>
      resumeSkills.some((rs) => rs.toLowerCase() === s.toLowerCase())
    );
    const score = Math.min(
      100,
      Math.round((matching.length / Math.max(jobSkillPool.length, 1)) * 100)
    );
    return {
      score,
      matchingSkills: matching,
      experience: "Unable to analyze experience alignment",
      keywordAlignment: "Unable to analyze keyword alignment",
    };
  }
}

export async function batchMatchJobs(
  jobs: Job[],
  resumeText: string,
  resumeSkills: string[]
): Promise<Job[]> {
  const results = await Promise.all(
    jobs.map(async (job) => {
      const match = await matchJobToResume(job, resumeText, resumeSkills);
      return {
        ...job,
        matchScore: match.score,
        matchExplanation: {
          matchingSkills: match.matchingSkills,
          experience: match.experience,
          keywordAlignment: match.keywordAlignment,
        },
      };
    })
  );
  return results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}
