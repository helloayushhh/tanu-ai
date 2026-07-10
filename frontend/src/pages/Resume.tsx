import { useState, useRef } from "react";
import { Brain } from "lucide-react";
import { Layout } from "../components/Layout";
import { Job, useGetResume, useUploadResume } from "../hooks/use-api";
import { UploadCloud, FileText, CheckCircle2, Zap, AlertCircle } from "lucide-react";
import { Button, Badge, Skeleton } from "../components/ui";
import { motion } from "framer-motion";
import { JobCard } from "../components/JobCard";

export function Resume() {
  const { data: resume, isLoading } = useGetResume();
  const uploadMutation = useUploadResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMutation.mutate(e.target.files[0], {
        onSuccess: (data) => {
          setRecommendedJobs(data?.recommendedJobs || []);
        },
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadMutation.mutate(e.dataTransfer.files[0], {
        onSuccess: (data) => {
          setRecommendedJobs(data?.recommendedJobs || []);
        },
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Resume Profile</h1>
          <p className="text-muted-foreground">Upload your resume to let our AI match you with perfect roles.</p>
        </header>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <Skeleton className="h-[300px] w-full rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Upload Area */}
            <div className="md:col-span-1 space-y-6">
              <div 
                className={`
                  relative overflow-hidden border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                  ${dragActive ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-white/10 bg-card hover:border-primary/50 hover:bg-white/5'}
                  ${resume?.hasResume ? 'bg-emerald-500/5 border-emerald-500/20' : ''}
                `}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.doc,.docx"
                  className="hidden" 
                />
                
                {uploadMutation.isPending ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="font-medium text-primary">Analyzing Document...</p>
                    <p className="text-xs text-muted-foreground mt-2">Extracting skills via AI</p>
                  </div>
                ) : resume?.hasResume ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-white mb-1">Resume Active</p>
                    <p className="text-sm text-muted-foreground mb-6 break-all">{resume.filename || 'resume.pdf'}</p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                      Replace Resume
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-16 h-16 bg-white/5 text-muted-foreground rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-white mb-2">Upload Resume</p>
                    <p className="text-xs text-muted-foreground mb-4">PDF, TXT up to 5MB</p>
                    <Button variant="gradient" size="sm" className="w-full pointer-events-none">
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>
              
              {!resume?.hasResume && !uploadMutation.isPending && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-3 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-200">You need to upload a resume before we can generate personalized job matches.</p>
                </div>
              )}
            </div>

            {/* Extracted Data Area */}
            <div className="md:col-span-2 space-y-6">
              {resume?.hasResume ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-panel p-6 sm:p-8 rounded-2xl"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-4">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-white">Extracted Skills</h2>
                      <p className="text-sm text-muted-foreground">AI identified these technical skills from your resume</p>
                    </div>
                  </div>
                  
                  {resume.skills && resume.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {resume.skills.map((skill, i) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          key={skill}
                        >
                          <Badge className="px-3 py-1.5 text-sm bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-colors cursor-default">
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic mb-8">No specific technical skills were confidently extracted.</p>
                  )}

                  <div className="border-t border-white/5 pt-6">
                    <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-muted-foreground" /> Raw Text Preview
                    </h3>
                    <div className="bg-black/40 rounded-xl p-4 max-h-[300px] overflow-y-auto font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {resume.extractedText || "No text could be extracted."}
                    </div>
                  </div>

                  {recommendedJobs.length > 0 && (
                    <div className="border-t border-white/5 pt-6">
                      <h3 className="text-lg font-display font-bold text-white mb-4">
                        Job Recommendations (from your technical skills)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {recommendedJobs.map((job, idx) => (
                          <JobCard key={job.id || idx} job={job} isBestMatch={idx < 6} />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-card/30">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Brain className="w-10 h-10 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Awaiting Analysis</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Upload your resume to activate the LangChain extraction pipeline. We'll build your technical profile automatically.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
