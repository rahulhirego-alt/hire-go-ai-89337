import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Plus,
  Search,
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Calendar,
  DollarSign,
} from "lucide-react";

const EmployerDashboard = () => {
  // Mock data
  const activeJobs = 12;
  const totalCandidates = 248;
  const interviewsThisWeek = 15;
  const avgTimeToHire = "18 days";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HireGoai</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="hero">
                <Plus className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Employer Dashboard 🏢</h1>
          <p className="text-muted-foreground">Manage your hiring pipeline and find top talent</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Jobs"
            value={activeJobs}
            icon={<Briefcase className="h-5 w-5" />}
            trend="+3 this month"
          />
          <StatCard
            title="Total Candidates"
            value={totalCandidates}
            icon={<Users className="h-5 w-5" />}
            trend="+45 this week"
          />
          <StatCard
            title="Interviews"
            value={interviewsThisWeek}
            icon={<Calendar className="h-5 w-5" />}
            trend="This week"
          />
          <StatCard
            title="Avg. Time to Hire"
            value={avgTimeToHire}
            icon={<Clock className="h-5 w-5" />}
            trend="-3 days"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Candidates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Candidates
                </CardTitle>
                <CardDescription>Find the perfect match with AI-powered search</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input placeholder="Search by skills, role, or keywords..." className="flex-1" />
                  <Button variant="hero">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Top Candidates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Recommended Candidates
                </CardTitle>
                <CardDescription>Best matches for your open positions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CandidateCard
                  name="Sarah Johnson"
                  role="Senior Frontend Developer"
                  matchScore={96}
                  skills={["React", "TypeScript", "Next.js"]}
                  experience="7 years"
                  availability="Immediate"
                />
                <CandidateCard
                  name="Michael Chen"
                  role="Full Stack Engineer"
                  matchScore={92}
                  skills={["Node.js", "React", "PostgreSQL"]}
                  experience="5 years"
                  availability="2 weeks"
                />
                <CandidateCard
                  name="Emily Rodriguez"
                  role="UI/UX Developer"
                  matchScore={88}
                  skills={["React", "Figma", "CSS"]}
                  experience="4 years"
                  availability="1 month"
                />
              </CardContent>
            </Card>

            {/* Active Jobs Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Active Jobs Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <JobPipelineCard
                  title="Senior React Developer"
                  applicants={45}
                  shortlisted={12}
                  interviewed={5}
                  offered={1}
                />
                <JobPipelineCard
                  title="Backend Engineer"
                  applicants={38}
                  shortlisted={10}
                  interviewed={3}
                  offered={0}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Job
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Browse Candidates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Billing
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Interviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Interviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <UpcomingInterviewCard
                  candidate="Sarah Johnson"
                  position="Frontend Developer"
                  date="Today"
                  time="2:00 PM"
                />
                <UpcomingInterviewCard
                  candidate="Michael Chen"
                  position="Full Stack Engineer"
                  date="Tomorrow"
                  time="10:00 AM"
                />
                <UpcomingInterviewCard
                  candidate="Emily Rodriguez"
                  position="UI/UX Developer"
                  date="Dec 22"
                  time="3:00 PM"
                />
              </CardContent>
            </Card>

            {/* Analytics Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Hiring Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Application Rate</span>
                    <span className="font-semibold">+25%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Shortlist Rate</span>
                    <span className="font-semibold">32%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: "32%" }} />
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  View Full Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className="text-primary">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </CardContent>
  </Card>
);

interface CandidateCardProps {
  name: string;
  role: string;
  matchScore: number;
  skills: string[];
  experience: string;
  availability: string;
}

const CandidateCard = ({ name, role, matchScore, skills, experience, availability }: CandidateCardProps) => (
  <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-semibold mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{role}</p>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>📊 {experience}</span>
          <span>🕒 {availability}</span>
        </div>
      </div>
      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
        {matchScore}% Match
      </Badge>
    </div>
    <div className="flex flex-wrap gap-2 mb-3">
      {skills.map((skill) => (
        <Badge key={skill} variant="outline" className="text-xs">
          {skill}
        </Badge>
      ))}
    </div>
    <div className="flex gap-2">
      <Button size="sm" variant="hero" className="flex-1">
        View Profile
      </Button>
      <Button size="sm" variant="outline">
        Shortlist
      </Button>
    </div>
  </div>
);

interface JobPipelineCardProps {
  title: string;
  applicants: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
}

const JobPipelineCard = ({ title, applicants, shortlisted, interviewed, offered }: JobPipelineCardProps) => (
  <div className="p-4 border border-border rounded-lg">
    <h4 className="font-semibold mb-4">{title}</h4>
    <div className="grid grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-2xl font-bold text-primary mb-1">{applicants}</div>
        <div className="text-xs text-muted-foreground">Applied</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-accent mb-1">{shortlisted}</div>
        <div className="text-xs text-muted-foreground">Shortlisted</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-primary mb-1">{interviewed}</div>
        <div className="text-xs text-muted-foreground">Interviewed</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-accent mb-1">{offered}</div>
        <div className="text-xs text-muted-foreground">Offered</div>
      </div>
    </div>
  </div>
);

interface UpcomingInterviewCardProps {
  candidate: string;
  position: string;
  date: string;
  time: string;
}

const UpcomingInterviewCard = ({ candidate, position, date, time }: UpcomingInterviewCardProps) => (
  <div className="p-4 border border-border rounded-lg bg-primary/5">
    <h4 className="font-medium mb-1">{candidate}</h4>
    <p className="text-sm text-muted-foreground mb-2">{position}</p>
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">
        {date} at {time}
      </span>
      <Button size="sm" variant="outline">
        Join
      </Button>
    </div>
  </div>
);

export default EmployerDashboard;
