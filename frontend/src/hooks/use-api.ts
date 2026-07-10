import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { JobFilters } from "../store";

// ✅ Use environment variable (works for Vercel + local)
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://jobtracker-backend-1tar.onrender.com";

// ---------------- TYPES ----------------

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  skills?: string[];
  matchScore?: number;
  matchExplanation?: {
    matchingSkills: string[];
    experience: string;
    keywordAlignment: string;
  };
  isBestMatch?: boolean;
}

export interface ResumeState {
  hasResume: boolean;
  filename?: string;
  extractedText?: string;
  skills?: string[];
  uploadedAt?: string;
}

export interface JobsResponse {
  jobs: any[];
  total?: number;
}

export interface ApplicationsResponse {
  applications: any[];
}

// ---------------- HELPERS ----------------

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}

// ---------------- AUTH ----------------

export function useLogin() {
  return useMutation<LoginResponse, Error, { email: string; password: string }>(
    {
      mutationFn: async (credentials) => {
        return fetchJSON(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
      },
    }
  );
}

// ---------------- JOBS ----------------

export function useGetJobs(filters: JobFilters) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.role) params.append("role", filters.role);
      if (filters.location) params.append("location", filters.location);
      if (filters.jobType) params.append("jobType", filters.jobType);
      if (filters.workMode) params.append("workMode", filters.workMode);
      if (filters.skills) params.append("skills", filters.skills);
      if (filters.datePosted) params.append("datePosted", filters.datePosted);

      if (typeof filters.minMatchScore === "number") {
        params.append("minMatchScore", String(filters.minMatchScore));
      }

      return fetchJSON(`${API_BASE}/api/jobs?${params.toString()}`);
    },
  });
}

// ---------------- RESUME ----------------

export function useGetResume() {
  return useQuery<ResumeState>({
    queryKey: ["resume"],
    queryFn: () => fetchJSON(`${API_BASE}/api/resume`),
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);

      return fetchJSON(`${API_BASE}/api/upload-resume`, {
        method: "POST",
        body: form,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

// ---------------- APPLICATIONS ----------------

export function useGetApplications() {
  return useQuery<ApplicationsResponse>({
    queryKey: ["applications"],
    queryFn: () => fetchJSON(`${API_BASE}/api/applications`),
  });
}

export function useApplyJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      jobId: string;
      status: string;
      title: string;
      company: string;
    }) =>
      fetchJSON(`${API_BASE}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string;
      status: string;
      note?: string;
    }) =>
      fetchJSON(`${API_BASE}/api/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string; [key: string]: any }) =>
      fetchJSON(`${API_BASE}/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

// ---------------- AI CHAT ----------------

export function useAiChat() {
  return useMutation({
    mutationFn: (payload: {
      message: string;
      conversationId?: string | null;
    }) =>
      fetchJSON(`${API_BASE}/api/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
  });
}