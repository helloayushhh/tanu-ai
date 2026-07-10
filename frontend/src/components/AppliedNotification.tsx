import { CheckCircle2, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface AppliedNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
}

export function AppliedNotification({ isOpen, onClose, jobTitle, company }: AppliedNotificationProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative mx-4 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
            
            {/* Main content */}
            <div className="relative bg-slate-900 rounded-2xl border border-green-500/30 p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Success icon with animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg animate-pulse" />
                  <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Success message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  Yes, Applied! <Sparkles className="inline-block w-5 h-5 text-yellow-400 ml-1" />
                </h3>
                
                <div className="space-y-2 mb-6">
                  <p className="text-gray-300">
                    Successfully applied to
                  </p>
                  <div className="bg-slate-800 rounded-lg p-3 border border-white/10">
                    <p className="font-semibold text-white">{jobTitle}</p>
                    <p className="text-gray-400 text-sm">{company}</p>
                  </div>
                </div>

                {/* Additional decorative elements */}
                <div className="flex justify-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>

                <p className="text-sm text-gray-400">
                  Good luck with your application! 🎯
                </p>
              </motion.div>

              {/* Decorative corner elements */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-green-500/50 rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-green-500/50 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-green-500/50 rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-green-500/50 rounded-br-lg" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
