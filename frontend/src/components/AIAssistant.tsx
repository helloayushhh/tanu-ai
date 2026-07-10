import { Brain, MessageCircle, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Job } from "../hooks/use-api";
import { Button, Input } from "./ui";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

export function AIAssistant({ isOpen, onClose, job }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && job) {
      // Initial AI analysis when assistant opens
      const initialMessage: Message = {
        id: "1",
        text: generateJobAnalysis(job),
        isAI: true,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, job]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateJobAnalysis = (job: Job): string => {
    return `🔍 **Job Analysis for ${job.title} at ${job.company}**

**📋 Key Details:**
• **Role:** ${job.title}
• **Company:** ${job.company}
• **Location:** ${job.location}
• **Match Score:** ${job.matchScore || 85}% compatibility

**💡 Why This Role Fits You:**
Based on your technical skills (React, Node.js, TypeScript, Machine Learning), this position aligns well with your expertise. The role requires strong technical capabilities that match your profile.

**🎯 Recommended Next Steps:**
1. Tailor your resume to highlight relevant projects
2. Prepare examples of your technical work
3. Research the company's tech stack and culture
4. Practice common interview questions for this role
5. Check the job details at http://localhost:5174/jobs for more information

**📊 Current Market Insights:**
Similar roles in ${job.location} typically offer competitive compensation based on your skill level and experience.

**🚀 Career Growth:**
This position offers excellent opportunities for professional development and advancement in the tech industry.

Feel free to ask me anything about this position or application tips!`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(input),
        isAI: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('salary') || input.includes('pay') || input.includes('compensation')) {
      return `💰 **Compensation Insights:**
Based on market data for ${job.title} roles in ${job.location}:
• **Entry Level:** $70,000 - $90,000
• **Mid Level:** $90,000 - $120,000  
• **Senior Level:** $120,000 - $160,000+

With your technical skills, you're positioned for the mid-to-senior range. 

**💡 Pro Tip:** Check http://localhost:5174/jobs for more detailed salary information and similar roles with compensation details.

Don't forget to negotiate based on your skills and market value!`;
    }
    
    if (input.includes('interview') || input.includes('prepare') || input.includes('questions')) {
      return `🎯 **Interview Preparation:**
**Technical Questions to Expect:**
• React hooks and state management
• Node.js architecture and APIs
• TypeScript best practices
• System design scenarios

**Behavioral Questions:**
• "Tell me about a challenging project"
• "How do you stay updated with tech?"
• "Describe your problem-solving approach"

**Pro Tips:**
• Prepare 2-3 detailed project examples
• Research the company's recent projects
• Have thoughtful questions ready for them`;
    }
    
    if (input.includes('skills') || input.includes('requirements')) {
      return `🛠️ **Skill Requirements Analysis:**
**Must-Have Skills:**
• Strong proficiency in your core technologies
• Problem-solving abilities
• Team collaboration experience

**Bonus Points:**
• Cloud platform experience (AWS/Azure)
• Docker/Kubernetes knowledge
• Testing frameworks familiarity

Your current skill set covers about 85% of what they're looking for. Focus on highlighting your strongest areas!`;
    }
    
    return `🤔 **Regarding your question about "${userInput}":**

This is a great question! Based on job details and your profile:

**Key Considerations:**
• The role values strong technical foundations
• Your experience aligns well with their needs
• Company culture appears innovation-focused

**My Recommendation:**
This position seems like a strong fit. Your technical skills match well, and company appears to value continuous learning.

**🔗 Additional Resources:**
For more comprehensive job details and similar opportunities, visit http://localhost:5174/jobs

Would you like more specific advice on any particular aspect?`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative mx-4 max-w-2xl w-full h-[600px] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
          
          {/* Main content */}
          <div className="relative bg-slate-900 rounded-2xl border border-blue-500/30 shadow-2xl h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-full p-2">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center">
                    AI Job Assistant <Sparkles className="w-4 h-4 text-yellow-400 ml-2" />
                  </h3>
                  <p className="text-sm text-gray-400">Your personal job application advisor</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Job info bar */}
            <div className="px-6 py-3 bg-slate-800/50 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{job.title}</p>
                  <p className="text-sm text-gray-400">{job.company} • {job.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400">{job.matchScore || 85}% Match</div>
                  <div className="text-xs text-gray-400">Compatibility</div>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] ${message.isAI ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.isAI 
                        ? 'bg-slate-800 border border-white/10' 
                        : 'bg-blue-500/20 border border-blue-500/30'
                    }`}>
                      <p className="text-sm text-white whitespace-pre-line">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.isAI && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mr-2 order-1">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about salary, interview prep, skills..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  size="sm"
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Salary info', 'Interview prep', 'Skill requirements'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-xs px-2 py-1 bg-slate-800 border border-white/10 rounded hover:bg-white/10 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-500/50 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-500/50 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-500/50 rounded-br-lg" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
