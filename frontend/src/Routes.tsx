import { Route } from 'wouter';
import { Login } from './pages/Login';
import { Jobs } from './pages/Jobs';
import { Resume } from './pages/Resume';
import { Applications } from './pages/Applications';
import NotFound from './pages/not-found';

export function AppRoutes() {
  return (
    <>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/resume" component={Resume} />
      <Route path="/applications" component={Applications} />
      <Route path="/:rest*" component={NotFound} />
    </>
  );
}
