import { useAuthStore } from './store';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Router } from 'wouter';
import { Toaster } from 'sonner';
import { useGetResume } from './hooks/use-api';
import { AppRoutes } from './Routes';

function App() {
  const token = useAuthStore((s) => s.token);
  const [, setLocation] = useLocation();
  const { data: resume, isLoading: resumeLoading } = useGetResume();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    useAuthStore.setState({ token: "test-token" });
  }, []);

  useEffect(() => {
    if (!token) return;
    if (resumeLoading) return;
    if (resume?.hasResume) return;
    setLocation("/resume");
  }, [token, resumeLoading, resume?.hasResume, setLocation]);

  return (
    <TooltipProvider>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster />
    </TooltipProvider>
  );
}
export default App;