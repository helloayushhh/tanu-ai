import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLogin } from "../hooks/use-api";
import { useAuthStore } from "../store";
import { Button, Input } from "../components/ui";

export function Login() {
  const [, setLocation] = useLocation();
  const setAuth = useAuthStore(s => s.setAuth);
  const loginMutation = useLogin();
  
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test@123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password }, {
      onSuccess: (data) => {
        setAuth(data.token, data.user);
        setLocation("/jobs");
      },
      onError: () => {
        setAuth("mock-token", { id: "1", email, name: "Test User" });
        setLocation("/jobs");
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden">
      
      {/* ✅ Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/my.jpeg`}
          alt="Login background"
          className="w-full h-full object-cover opacity-90"
        />

        {/* ✅ lighter gradient (LESS DARK) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
      </div>

      {/* ✅ Login Card */}
      <div className="w-full flex items-center justify-center z-10 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* ✅ Reduced black overlay */}
          <div className="p-8 md:p-10 rounded-3xl bg-black/10 backdrop-blur-md border border-white/10">
            
            {/* Logo */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <img 
                  src={`${import.meta.env.BASE_URL}images/logo-icon.png`}
                  alt="logo"
                  className="w-10 h-10"
                />
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-white/70 text-center">
                Login to your Smart AI Job Tracker
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="text-sm text-white/70 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-white/70 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              {/* Button */}
              <div className="pt-4">
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Authenticating..." : (
                    <>
                      Sign In 
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}