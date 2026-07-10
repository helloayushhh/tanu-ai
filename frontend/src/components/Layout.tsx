import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { BrainCircuit, Briefcase, FileText, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuthStore } from "../store";
import { AIChat } from "./AIChat";
import { cn } from "./ui";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const logout = useAuthStore(s => s.logout);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const navItems = [
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: LayoutDashboard, label: "Applications", path: "/applications" },
    { icon: FileText, label: "Resume", path: "/resume" },
  ];

  return (
    <div className="min-h-screen flex relative">

      {/* ✅ GLOBAL BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          src="/images/front.jpeg"
          alt="bg"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 z-40 border-r border-white/5 bg-card/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <BrainCircuit className="w-6 h-6 text-primary mr-2" />
          <span className="font-display font-bold text-xl text-white">Smart AI</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-white/70 hover:text-rose-400"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative z-10">
        <div className="p-4 md:p-8 pb-24">
          {children}
        </div>
      </main>

      <AIChat />
    </div>
  );
}