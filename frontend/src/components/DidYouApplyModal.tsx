import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, X } from "lucide-react";
import { useState } from "react";
import { useApplyJob } from "../hooks/use-api";

interface DidYouApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  jobId?: string;
}

export function DidYouApplyModal({ isOpen, onClose, jobTitle, company, jobId }: DidYouApplyModalProps) {
  const [selectedOption, setSelectedOption] = useState<"yes" | "earlier" | null>(null);
  const applyMutation = useApplyJob();

  const handleYesApplied = () => {
    setSelectedOption("yes");
    
    // Save application to backend API
    applyMutation.mutate({
      jobId: jobId || Date.now().toString(),
      title: jobTitle,
      company: company,
      status: "applied"
    }, {
      onSuccess: () => {
        setTimeout(() => {
          onClose();
          setSelectedOption(null);
        }, 800);
      }
    });
  };

  const handleAppliedEarlier = () => {
    setSelectedOption("earlier");
    
    // Save application with earlier status to backend API
    applyMutation.mutate({
      jobId: jobId || Date.now().toString(),
      title: jobTitle,
      company: company,
      status: "applied_earlier"
    }, {
      onSuccess: () => {
        setTimeout(() => {
          onClose();
          setSelectedOption(null);
        }, 800);
      }
    });
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
          <div 
            className="absolute w-64 h-64 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, #EC4899 0%, transparent 70%)",
              top: "50%",
              right: "30%",
              filter: "blur(40px)",
              animation: "float 7s ease-in-out infinite"
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
              className="text-center"
            >
              <h2 
                className="text-3xl font-bold mb-3"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "'Inter', system-ui, sans-serif"
                }}
              >
                Did you apply?
              </h2>
              
              <p 
                className="text-lg mb-8"
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontFamily: "'Inter', system-ui, sans-serif"
                }}
              >
                Did you apply to <span className="font-semibold text-white">{jobTitle}</span> at <span className="font-semibold text-white">{company}</span>?
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleYesApplied}
                  disabled={selectedOption !== null}
                  className="w-full py-4 px-6 rounded-[16px] font-semibold text-white relative overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: selectedOption === "yes" 
                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                      : "linear-gradient(135deg, #4F46E5 0%, #9333EA 50%, #EC4899 100%)",
                    boxShadow: selectedOption === "yes"
                      ? "0 4px 20px rgba(16, 185, 129, 0.4)"
                      : "0 4px 20px rgba(79, 70, 229, 0.4)",
                    fontFamily: "'Inter', system-ui, sans-serif"
                  }}
                >
                  {selectedOption === "yes" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Applied Successfully!
                    </motion.div>
                  ) : (
                    "Yes, Applied"
                  )}
                  
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 rounded-[16px] opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)",
                      filter: "blur(10px)"
                    }}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAppliedEarlier}
                  disabled={selectedOption !== null}
                  className="w-full py-4 px-6 rounded-[16px] font-semibold relative overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: selectedOption === "earlier"
                      ? "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
                      : "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: selectedOption === "earlier" ? "#ffffff" : "rgba(255, 255, 255, 0.9)",
                    fontFamily: "'Inter', system-ui, sans-serif"
                  }}
                >
                  {selectedOption === "earlier" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Noted!
                    </motion.div>
                  ) : (
                    "Applied Earlier"
                  )}
                </motion.button>
              </div>
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
