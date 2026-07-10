import { ExternalLink, Brain } from "lucide-react";
import { useState } from "react";
import { Job } from "../hooks/use-api";
import { Button } from "./ui";
import { AppliedNotification } from "./AppliedNotification";
import { AIAssistant } from "./AIAssistant";
import { DidYouApplyModal } from "./DidYouApplyModal";

interface JobCardProps {
  job: Job;
  isBestMatch?: boolean;
}

export function JobCard({ job, isBestMatch }: JobCardProps) {
  const [showAppliedNotification, setShowAppliedNotification] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showDidYouApplyModal, setShowDidYouApplyModal] = useState(false);

  const handleApply = () => {
    // Show the "Did you apply?" modal instead of direct application
    setShowDidYouApplyModal(true);
  };

  return (
    <>
      <div className="bg-slate-900 p-6 rounded-xl border border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl text-white font-bold">{job.title}</h2>
            <p className="text-gray-400">{job.company}</p>
            <p className="text-sm text-gray-500 mt-1">{job.location}</p>
            {job.matchScore && (
              <div className="mt-2">
                <span className="text-sm font-medium text-green-400">{job.matchScore}% Match</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {isBestMatch && (
              <div className="text-xs font-bold px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                Best Match
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIAssistant(true)}
              className="flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              AI Insights
            </Button>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button onClick={handleApply} className="flex-1">
            Apply Now <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      <AppliedNotification
        isOpen={showAppliedNotification}
        onClose={() => setShowAppliedNotification(false)}
        jobTitle={job.title}
        company={job.company}
      />

      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        job={job}
      />

      <DidYouApplyModal
        isOpen={showDidYouApplyModal}
        onClose={() => setShowDidYouApplyModal(false)}
        jobTitle={job.title}
        company={job.company}
        jobId={job.id}
      />
    </>
  );
}