import { logger } from "./logger.js"; // ✅ ADD THIS

export function extractTextFromTxt(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

/**
 * Extract text from PDF using pdf-parse
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const mod: any = await import("pdf-parse");
    const pdfParse = mod?.default ?? mod;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    logger.error({ err }, "Failed to parse PDF");
    return buffer.toString("utf-8");
  }
}

/**
 * List of common technical skills to filter against
 */
const TECHNICAL_SKILLS_KEYWORDS = [
  // Programming Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
  'scala', 'perl', 'r', 'matlab', 'dart', 'lua', 'objective-c', 'assembly', 'cobol', 'fortran',
  
  // Frontend Technologies
  'react', 'angular', 'vue', 'svelte', 'next.js', 'gatsby', 'nuxt.js', 'webpack', 'vite', 'parcel',
  'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material-ui', 'ant-design', 'chakra-ui',
  'jquery', 'redux', 'mobx', 'context api', 'hooks', 'jsx', 'tsx', 'styled-components', 'emotion',
  
  // Backend Technologies
  'node.js', 'express', 'nest.js', 'fastify', 'koa', 'django', 'flask', 'spring', 'laravel', 'rails',
  'asp.net', 'play', 'fiber', 'echo', 'gin', 'actix', 'rocket', 'phoenix', 'elixir',
  
  // Databases
  'mysql', 'postgresql', 'mongodb', 'redis', 'cassandra', 'dynamodb', 'neo4j', 'oracle', 'sql server',
  'sqlite', 'firebase', 'supabase', 'prisma', 'typeorm', 'sequelize', 'mongoose', 'hibernate',
  'sql', 'nosql', 'graphql', 'rest api', 'grpc', 'soap',
  
  // Cloud & DevOps
  'aws', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions',
  'terraform', 'ansible', 'puppet', 'chef', 'vagrant', 'nginx', 'apache', 'microservices', 'serverless',
  'lambda', 'functions', 'cloudflare', 'heroku', 'vercel', 'netlify', 'digitalocean',
  
  // Tools & Frameworks
  'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'discord', 'vs code', 'intellij',
  'eclipse', 'postman', 'swagger', 'openapi', 'jest', 'mocha', 'cypress', 'selenium', 'testing',
  'ci/cd', 'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'unit testing', 'integration testing',
  
  // Machine Learning & AI
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'jupyter', 'machine learning',
  'deep learning', 'nlp', 'computer vision', 'data science', 'artificial intelligence', 'ml', 'ai',
  'opencv', 'nltk', 'spacy', 'huggingface', 'langchain', 'openai', 'gpt', 'llm',
  
  // Mobile Development
  'react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'xamarin', 'cordova', 'ionic',
  'expo', 'native', 'mobile', 'pwa', 'progressive web app',
  
  // Other Technical Skills
  'blockchain', 'web3', 'ethereum', 'smart contracts', 'solidity', 'rust', 'webassembly',
  'cybersecurity', 'penetration testing', 'security', 'encryption', 'authentication', 'authorization',
  'oauth', 'jwt', 'ssl', 'tls', 'https', 'networking', 'tcp/ip', 'dns', 'http', 'api design'
];

/**
 * Check if a skill is technical
 */
function isTechnicalSkill(skill: string): boolean {
  const normalizedSkill = skill.toLowerCase().trim();
  
  // Check if it matches any technical keywords
  const hasTechnicalKeyword = TECHNICAL_SKILLS_KEYWORDS.some(keyword => 
    normalizedSkill.includes(keyword) || keyword.includes(normalizedSkill)
  );
  
  // Additional patterns for technical skills
  const technicalPatterns = [
    /^[a-z]+(\.js|\.ts|\.py|\.java|\.cpp|\.cs|\.php|\.rb|\.go|\.rs)$/i, // Languages with extensions
    /^[a-z]+(js|ts|py|java|cpp|cs|php|rb|go|rs)$/i, // Languages without dots
    /^(react|vue|angular|node|express|django|flask|spring|laravel|rails)\b/i, // Frameworks
    /^(html|css|sql|nosql|api|rest|graphql|git|docker|aws|azure|gcp)\b/i, // Common tech terms
    /\.(js|ts|py|java|cpp|cs|php|rb|go|rs|html|css|sql)$/i, // File extensions
  ];
  
  const matchesPattern = technicalPatterns.some(pattern => pattern.test(normalizedSkill));
  
  // Exclude non-technical terms
  const nonTechnicalTerms = [
    'communication', 'leadership', 'management', 'teamwork', 'problem solving', 'critical thinking',
    'creativity', 'innovation', 'strategy', 'planning', 'organization', 'time management',
    'presentation', 'writing', 'documentation', 'training', 'mentoring', 'collaboration',
    'negotiation', 'analytical', 'detail-oriented', 'fast-paced', 'dynamic', 'proactive',
    'self-motivated', 'results-driven', 'goal-oriented', 'customer service', 'sales',
    'marketing', 'finance', 'accounting', 'human resources', 'recruiting', 'project management'
  ];
  
  const isNonTechnical = nonTechnicalTerms.some(term => 
    normalizedSkill.includes(term) || term.includes(normalizedSkill)
  );
  
  return (hasTechnicalKeyword || matchesPattern) && !isNonTechnical;
}

/**
 * Normalize common variations in skills
 */
function normalizeSkill(skill: string): string {
  return skill
    .replace(/java script/gi, "JavaScript")
    .replace(/react\.js/gi, "React.js")
    .replace(/reactjs/gi, "React.js")
    .replace(/node\.js/gi, "Node.js")
    .replace(/nodejs/gi, "Node.js")
    .replace(/type script/gi, "TypeScript")
    .replace(/typescript/gi, "TypeScript")
    .replace(/vue\.js/gi, "Vue.js")
    .replace(/vuejs/gi, "Vue.js")
    .replace(/angular\.js/gi, "Angular.js")
    .replace(/angularjs/gi, "Angular.js")
    .replace(/\.js$/gi, ".js")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract skills exactly from the "Technical Skills" section and filter for the specific requested skills
 */
export function extractSkillsFromText(text: string): string[] {
  const normalizedText = text.replace(/\r/g, "").toLowerCase();

  // Define the specific technical skills we're looking for
  const targetSkills = [
    { keywords: ['react', 'react.js', 'reactjs'], name: 'React' },
    { keywords: ['node.js', 'nodejs', 'node'], name: 'Node.js' },
    { keywords: ['typescript', 'type script'], name: 'TypeScript' },
    { keywords: ['machine learning', 'ml', 'artificial intelligence', 'ai', 'deep learning', 'tensorflow', 'pytorch', 'keras'], name: 'Machine Learning' }
  ];

  // Look for Technical Skills section with various patterns
  const patterns = [
    /(?:Technical Skills|Skills|TECHNICAL SKILLS|SKILLS)[:\s]+([^\n]+)/i,
    /(?:Technical Skills|Skills|TECHNICAL SKILLS|SKILLS)[:\s\n]+((?:[^.\n]*[,;\/][^.\n]*){1,3})/i,
    /(?:Technical Skills|Skills|TECHNICAL SKILLS|SKILLS)[:\s\n]+([^\n]*?(?:[,;\/][^\n]*?){0,5})/i
  ];

  let rawSkillsText = "";
  for (const pattern of patterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      rawSkillsText = (match[1] || "").trim();
      break;
    }
  }

  // If no specific skills section found, search the entire text
  if (!rawSkillsText) {
    rawSkillsText = normalizedText;
  }

  const foundSkills: string[] = [];
  
  // Check for each target skill
  for (const skill of targetSkills) {
    const hasSkill = skill.keywords.some(keyword => 
      rawSkillsText.includes(keyword) || 
      normalizedText.includes(keyword)
    );
    
    if (hasSkill) {
      foundSkills.push(skill.name);
    }
  }

  // Return only the first 3 found skills
  return foundSkills.slice(0, 3);
}

/**
 * Parse resume and extract text + skills
 */
export async function parseResume(
  buffer: Buffer,
  mimetype: string,
  filename: string
): Promise<{ text: string; skills: string[] }> {
  let text = "";

  if (mimetype === "application/pdf" || filename.toLowerCase().endsWith(".pdf")) {
    text = await extractTextFromPdf(buffer);
  } else {
    text = extractTextFromTxt(buffer);
  }

  const skills = extractSkillsFromText(text);
  return { text, skills };
}