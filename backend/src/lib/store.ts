export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  jobType: string;
  workMode: string;
  salary?: string;
  postedAt: string;
  applyUrl: string;
  /**
   * Required skills for the job when available.
   * When not provided, matching logic will infer using job description + resume skills.
   */
  skills?: string[];
  matchScore?: number;
  matchExplanation?: {
    matchingSkills: string[];
    experience: string;
    keywordAlignment: string;
  };
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  status: "applied" | "interview" | "offer" | "rejected";
  appliedAt: string;
  timeline: {
    status: string;
    date: string;
    note: string;
  }[];
}

const store = {
  resume: {
    hasResume: false,
    filename: "",
    extractedText: "",
    skills: [] as string[],
    uploadedAt: "",
  },

  jobs: [] as Job[],
  jobsFetchedAt: null as Date | null,

  applications: [] as Application[],

  conversations: new Map<string, any[]>(),
};

export default store;