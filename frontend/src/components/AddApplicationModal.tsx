import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Link, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { useApplyJob } from "../hooks/use-api";
import { Button } from "./ui";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions = [
  { value: "applied", label: "Applied", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { value: "interview_scheduled", label: "Interview Scheduled", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  { value: "interview_completed", label: "Interview Completed", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { value: "offer_received", label: "Offer Received", color: "bg-green-500/20 text-green-300 border-green-500/30" },
  { value: "rejected", label: "Rejected", color: "bg-red-500/20 text-red-300 border-red-500/30" }
];

export function AddApplicationModal({ isOpen, onClose }: AddApplicationModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    jobLink: "",
    notes: "",
    status: "applied"
  });
  
  const applyMutation = useApplyJob();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company) {
      alert("Please fill in at least job title and company name");
      return;
    }

    applyMutation.mutate({
      jobId: Date.now().toString(),
      title: formData.title,
      company: formData.company,
      status: formData.status
    } as any, {
      onSuccess: () => {
        setFormData({
          title: "",
          company: "",
          jobLink: "",
          notes: "",
          status: "applied"
        });
        onClose();
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: "radial-gradient(ellipse at center, rgba(79, 70, 229, 0.15) 0%, rgba(0, 0, 0, 0.95) 100%)",
          backdropFilter: "blur(12px)"
        }}
        onClick={onClose}
      >
        {/* Floating gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-96 h-96 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #4F46E5 0%, transparent 70%)",
              top: "10%",
              left: "10%",
              filter: "blur(60px)",
              animation: "float 6s ease-in-out infinite"
            }}
          />
          <div 
            className="absolute w-80 h-80 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #9333EA 0%, transparent 70%)",
              bottom: "20%",
              right: "15%",
              filter: "blur(50px)",
              animation: "float 8s ease-in-out infinite reverse"
            }}
          />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative mx-4 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glassmorphism card */}
          <div 
            className="relative rounded-[24px] p-8"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon and title */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
              className="flex justify-center mb-6"
            >
              <div 
                className="relative flex items-center justify-center w-16 h-16 rounded-[20px]"
                style={{
                  background: "linear-gradient(135deg, #4F46E5 0%, #9333EA 50%, #EC4899 100%)",
                  boxShadow: "0 4px 20px rgba(79, 70, 229, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                }}
              >
                <Briefcase className="w-8 h-8 text-white" />
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-[20px] opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #4F46E5 0%, #9333EA 50%, #EC4899 100%)",
                    filter: "blur(20px)",
                    transform: "scale(1.2)"
                  }}
                />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 
                className="text-3xl font-bold mb-6 text-center"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "'Inter', system-ui, sans-serif"
                }}
              >
                Add Application
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Job Title */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                    placeholder="e.g. Senior React Developer"
                    required
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                    placeholder="e.g. Google, Microsoft"
                    required
                  />
                </div>

                {/* Job Link */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2 flex items-center">
                    <Link className="w-4 h-4 mr-2" />
                    Job Link
                  </label>
                  <input
                    type="url"
                    value={formData.jobLink}
                    onChange={(e) => handleInputChange('jobLink', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                    placeholder="https://careers.company.com/job/123"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Current Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all resize-none"
                    rows={4}
                    placeholder="HR call done, Asked DSA questions, Technical round completed..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={applyMutation.isPending}
                    className="flex-1"
                  >
                    {applyMutation.isPending ? "Adding..." : "Add Application"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }
      `}</style>
    </AnimatePresence>
  );
}
