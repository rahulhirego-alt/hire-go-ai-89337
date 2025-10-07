import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import CandidateDashboard from "./pages/candidate/Dashboard";
import CandidateOnboarding from "./pages/candidate/Onboarding";
import EmployerDashboard from "./pages/employer/Dashboard";
import LiveInterview from "./pages/LiveInterview";
import InterviewSchedule from "./pages/InterviewSchedule";
import VideoAssessment from "./pages/VideoAssessment";
import JobDashboard from "./pages/JobDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/onboarding" element={<CandidateOnboarding />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/live-interview" element={<LiveInterview />} />
          <Route path="/interview-schedule" element={<InterviewSchedule />} />
          <Route path="/video-assessment" element={<VideoAssessment />} />
          <Route path="/job-dashboard" element={<JobDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
