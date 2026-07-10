import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Search, SlidersHorizontal, Mic, X, AlertCircle } from "lucide-react";
import { Layout } from "../components/Layout";
import { JobCard } from "../components/JobCard";
import { useAiChat, useGetJobs, useGetResume } from "../hooks/use-api";
import { useChatStore, useFilterStore } from "../store";
import { useVoice } from "../hooks/use-voice";
import { Input, Button, Skeleton, cn } from "../components/ui";

export function Jobs() {
  // 1. All store/context hooks first (needed for other state initialization)
  const filterState = useFilterStore();
  const { filters, setFilter, setAllFilters, resetFilters } = filterState;

  // 2. All state hooks
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.role || "");
  const [isTyping, setIsTyping] = useState(false);

  const { conversationId, setConversationId } = useChatStore();
  const aiChatMutation = useAiChat();

  const [skillsInput, setSkillsInput] = useState("");
  const selectedSkills = useMemo(
    () =>
      (filters.skills ? filters.skills.split(",") : [])
        .map((s) => s.trim())
        .filter(Boolean),
    [filters.skills]
  );

  // 3. All custom hooks (in consistent order)
  const { data: resume } = useGetResume();
  const { data: jobsResponse, isLoading, isError } = useGetJobs(filters);
  
  // DEBUG: Log the jobs response to check if API is working
  console.log("JOBS RESPONSE:", jobsResponse);
  console.log("JOBS LENGTH:", jobsResponse?.jobs?.length);
  
  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    resetTranscript,
    error: voiceError,
  } = useVoice();

  // 4. All ref hooks
  const debouncedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 5. All computed data
  const jobs = jobsResponse?.jobs || [];
  const sortedJobs = useMemo(() => [...jobs].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)), [jobs]);
  const displayJobs = useMemo(() => {
    if (filters.minMatchScore === 0) {
      return sortedJobs.map((job, idx) => ({ ...job, isBestMatch: idx < 6 }));
    }
    return sortedJobs.map((job) => ({ ...job, isBestMatch: false }));
  }, [sortedJobs, filters.minMatchScore]);

  // 6. All effects together at the end
  // Debounce search input to filter store
  useEffect(() => {
    if (debouncedTimer.current) clearTimeout(debouncedTimer.current);
    debouncedTimer.current = setTimeout(() => {
      if (searchInput !== filters.role) {
        setFilter('role', searchInput);
      }
      setIsTyping(false);
    }, 450);

    return () => {
      if (debouncedTimer.current) clearTimeout(debouncedTimer.current);
    };
  }, [searchInput, setFilter, filters.role]);

  // Sync filters if changed externally (e.g., AI chat update) only when not typing
  useEffect(() => {
    if (!isTyping && filters.role !== searchInput) {
      setSearchInput(filters.role);
    }
  }, [filters.role, isTyping, searchInput]);

  // Voice -> LangGraph assistant -> filter updates
  useEffect(() => {
    const text = transcript?.trim();
    if (!text) return;

    // Avoid spamming on interim results: only act after the mic stops.
    if (isListening) return;

    // Prevent re-triggering on the same transcript.
    resetTranscript();

    aiChatMutation.mutate(
      { message: text, conversationId },
      {
        onSuccess: (data) => {
          if (data?.conversationId) setConversationId(data.conversationId);
          if (data?.filterUpdates) setAllFilters(data.filterUpdates);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening]);

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filter Sidebar (Desktop) / Drawer (Mobile logic hidden for brevity) */}
        <aside className={cn(
          "w-full lg:w-72 shrink-0 space-y-6",
          showFilters ? "block" : "hidden",
          "lg:block"
        )}>
          <div className="bg-card/50 backdrop-blur-md rounded-2xl border p-5 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2 text-primary" /> Filters
              </h3>
              <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-white underline">Reset</button>
            </div>

            <div className="space-y-6">
              {/* Search with Mic */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Search Role</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={searchInput}
                    onChange={(e) => {
                      setIsTyping(true);
                      setSearchInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (searchInput && searchInput !== filters.role) {
                          setFilter('role', searchInput);
                        }
                        setIsTyping(false);
                      }
                    }}
                    placeholder="React Developer..."
                    className="pl-9 pr-10"
                    type="text"
                    autoComplete="off"
                  />
                  <button 
                    onClick={isListening ? stopListening : startListening}
                    className={cn("absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors", 
                      isListening ? "text-rose-400 bg-rose-500/20 pulse-ring" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                {voiceError && (
                  <p className="text-xs text-rose-400 mt-1">{voiceError}</p>
                )}
              </div>

              {/* Skills (multi) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Technical Skills</label>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Add technical skills (React, Node.js, TypeScript, Machine Learning)</span>
                  ) : (
                    selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10"
                      >
                        {skill}
                        <button
                          className="text-muted-foreground hover:text-white"
                          onClick={() => {
                            const next = selectedSkills.filter((s) => s !== skill);
                            setFilter("skills", next.join(","));
                          }}
                          type="button"
                          aria-label={`Remove ${skill}`}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <Input
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. React, Node, TypeScript, ML"
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      const next = skillsInput
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      if (next.length === 0) return;
                      const merged = Array.from(new Set([...selectedSkills, ...next]));
                      setFilter("skills", merged.join(","));
                      setSkillsInput("");
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const next = skillsInput
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      if (next.length === 0) return;
                      const merged = Array.from(new Set([...selectedSkills, ...next]));
                      setFilter("skills", merged.join(","));
                      setSkillsInput("");
                    }}
                    className="shrink-0"
                  >
                    Add
                  </Button>
                </div>

                {/* Quick skill buttons */}
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Quick add technical skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {['React', 'Node.js', 'TypeScript', 'Machine Learning'].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => {
                          const merged = Array.from(new Set([...selectedSkills, skill]));
                          setFilter("skills", merged.join(","));
                        }}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          selectedSkills.includes(skill)
                            ? 'bg-primary/20 border border-primary/50 text-primary'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date Posted */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date Posted</label>
                <select
                  className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  value={filters.datePosted}
                  onChange={(e) => setFilter("datePosted", e.target.value)}
                >
                  <option value="">Any time</option>
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
              </div>

              {/* Work Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Work Mode</label>
                <select 
                  className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  value={filters.workMode}
                  onChange={(e) => setFilter('workMode', e.target.value)}
                >
                  <option value="">Any Mode</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Job Type</label>
                <select 
                  className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  value={filters.jobType}
                  onChange={(e) => setFilter('jobType', e.target.value)}
                >
                  <option value="">Any Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="contract">Contract</option>
                  <option value="part-time">Part Time</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <Input 
                  value={filters.location}
                  onChange={(e) => setFilter('location', e.target.value)}
                  placeholder="City, Country..."
                />
              </div>

              {/* Match Score Slider */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-muted-foreground">Min Match Score</label>
                  <span className="text-sm font-bold text-primary">{filters.minMatchScore}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" step="5"
                  value={filters.minMatchScore}
                  onChange={(e) => setFilter('minMatchScore', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <div className="flex-1 space-y-8">
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display font-bold text-white">Job Feed</h1>
            <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
            </Button>
          </div>

          {!resume?.hasResume && (
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-1">Supercharge your search</h3>
                <p className="text-sm text-muted-foreground">Upload your resume to enable AI match scoring and personalized insights.</p>
              </div>
              <Link href="/resume" className="shrink-0">
                <Button variant="gradient">Upload Resume</Button>
              </Link>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
            </div>
          ) : isError ? (
            <div className="text-center py-20 bg-card/30 rounded-2xl border">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">Failed to load jobs</h3>
              <p className="text-muted-foreground mt-2">Check your connection or try adjusting filters.</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-card/30 rounded-2xl border">
              <Search className="w-12 h-12 text-muted-foreground opacity-50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">No jobs found</h3>
              <p className="text-muted-foreground mt-2">Try broadening your search criteria.</p>
              <Button variant="outline" onClick={resetFilters} className="mt-6">Clear Filters</Button>
            </div>
          ) : (
            <>
                <div className="w-full">
                <h2 className="text-xl font-display font-bold text-white mb-4">Job Recommendations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                  {displayJobs.map((job, idx) => (
                    <div key={job.id || `${job.title}-${idx}`} className="w-full">
                      <JobCard job={job} isBestMatch={job.isBestMatch} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
