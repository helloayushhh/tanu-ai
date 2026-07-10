import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, X, Send, Mic, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChatStore, useFilterStore } from "../store";
import { useVoice } from "../hooks/use-voice";
import { useAiChat } from "../hooks/use-api";
import { Button, Input, cn } from "./ui";

export function AIChat() {
  const { isOpen, toggleOpen, messages, addMessage, conversationId, setConversationId } = useChatStore();
  const setAllFilters = useFilterStore(s => s.setAllFilters);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const aiChatMutation = useAiChat();
  const { isListening, transcript, startListening, stopListening, error: voiceError } = useVoice();

  // Update input when voice transcript changes
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim() || aiChatMutation.isPending) return;

    const userMsg = input.trim();
    setInput("");
    if (isListening) stopListening();

    // Add user message
    addMessage({ role: 'user', content: userMsg });

    // Call API
    aiChatMutation.mutate(
      { message: userMsg, conversationId },
      {
        onSuccess: (data) => {
          if (data.conversationId) setConversationId(data.conversationId);
          
          // Add AI response
          addMessage({ role: 'ai', content: data.reply });

          // Handle actions
          if ((data.action === 'updateFilters' || data.action === 'searchJobs') && data.filterUpdates) {
            setAllFilters(data.filterUpdates);
          }

          // Show direct recommendations list in chat too
          if (data?.jobRecommendations?.length) {
  const listText = data.jobRecommendations
    .map((job: any) => `• ${job.title} @ ${job.company} (${job.location})`)
    .join('\n');

  addMessage({
    role: 'ai',
    content: `🔥 Recommended jobs:\n${listText}`
  });
}
        },
        onError: () => {
          addMessage({ role: 'ai', content: "Sorry, I'm having trouble connecting right now. Please try again." });
        }
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
      setTimeout(() => handleSend(), 100);
    } else {
      startListening();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleOpen}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl hover:shadow-primary/50 transition-shadow z-50 group"
          >
            <Sparkles className="w-6 h-6 text-white absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <BrainCircuit className="w-7 h-7 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-card border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 shadow-lg">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Smart AI</h3>
                  <p className="text-xs text-emerald-400 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button onClick={toggleOpen} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div 
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-white rounded-br-sm" 
                        : "bg-muted text-foreground border border-white/5 rounded-bl-sm"
                    )}
                  >
                    {msg.role === 'ai' ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              
              {aiChatMutation.isPending && (
                <div className="mr-auto items-start flex">
                  <div className="px-4 py-3 bg-muted border border-white/5 rounded-2xl rounded-bl-sm flex space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative flex items-center">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening..." : "Ask me anything..."}
                  className="pr-24 bg-black/20 border-white/10"
                  disabled={aiChatMutation.isPending}
                />
                <div className="absolute right-2 flex items-center space-x-1">
                  <button 
                    onClick={toggleVoice}
                    className={cn(
                      "p-1.5 rounded-full transition-colors",
                      isListening ? "bg-rose-500/20 text-rose-400 pulse-ring" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || aiChatMutation.isPending}
                    className="p-1.5 bg-primary text-white rounded-full disabled:opacity-50 disabled:bg-muted"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
              {voiceError && (
                <p className="text-xs text-rose-400 mt-2">{voiceError}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
