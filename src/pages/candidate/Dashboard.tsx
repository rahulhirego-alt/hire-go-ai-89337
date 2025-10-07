import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { InterviewCard3D } from "@/components/interview/InterviewCard3D";
import { 
  Sparkles, 
  FileText, 
  Video, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  Bell,
  Settings,
  LogOut
} from "lucide-react";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data
  const profileCompletion = 75;
  const applications = 5;
  const interviewsScheduled = 2;
  const recommendedJobs = 8;

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
          <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your job search</p>
        </div>

        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Complete Your Profile
              </CardTitle>
              <CardDescription>
                {profileCompletion}% complete - finish your profile to get better matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={profileCompletion} className="mb-4" />
              <Link to="/candidate/onboarding">
                <Button variant="hero">Complete Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Applications"
            value={applications}
            icon={<FileText className="h-5 w-5" />}
            trend="+2 this week"
          />
          <StatCard
            title="Interviews"
            value={interviewsScheduled}
            icon={<Calendar className="h-5 w-5" />}
            trend="1 upcoming"
          />
          <StatCard
            title="Recommended"
            value={recommendedJobs}
            icon={<Sparkles className="h-5 w-5" />}
            trend="AI matched"
          />
          <StatCard
            title="Profile Views"
            value={24}
            icon={<TrendingUp className="h-5 w-5" />}
            trend="+12 this month"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Recommended Jobs
                </CardTitle>
                <CardDescription>AI-matched positions based on your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <JobCard
                  title="Senior Frontend Developer"
                  company="TechCorp Inc."
                  location="Remote"
                  matchScore={95}
                  salary="$120k - $150k"
                  tags={["React", "TypeScript", "Tailwind"]}
                />
                <JobCard
                  title="Full Stack Engineer"
                  company="StartupXYZ"
                  location="San Francisco, CA"
                  matchScore={88}
                  salary="$100k - $140k"
                  tags={["Node.js", "React", "PostgreSQL"]}
                />
                <JobCard
                  title="UI/UX Developer"
                  company="DesignHub"
                  location="New York, NY"
                  matchScore={82}
                  salary="$90k - $120k"
                  tags={["React", "Figma", "CSS"]}
                />
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ApplicationCard
                  title="Frontend Developer"
                  company="TechFlow"
                  status="Under Review"
                  appliedDate="2 days ago"
                />
                <ApplicationCard
                  title="React Developer"
                  company="WebSolutions"
                  status="Interview Scheduled"
                  appliedDate="5 days ago"
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
                  <FileText className="mr-2 h-4 w-4" />
                  Update Resume
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  Record Video Resume
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Take Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Interviews - 3D Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Interviews
                </CardTitle>
                <CardDescription>Join live or review recordings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InterviewCard3D
                  employer="TechFlow Inc."
                  recruiter={{
                    name: "Sarah Mitchell",
                    title: "Senior Technical Recruiter",
                    email: "sarah.mitchell@techflow.com",
                    phone: "+1 (555) 123-4567"
                  }}
                  position="Frontend Developer"
                  date="Tomorrow"
                  time="2:00 PM"
                  status="live"
                  onJoin={() => navigate('/live-interview')}
                />
                <InterviewCard3D
                  employer="WebSolutions"
                  recruiter={{
                    name: "Michael Chen",
                    title: "Talent Acquisition Manager",
                    email: "m.chen@websolutions.io",
                    phone: "+1 (555) 234-5678"
                  }}
                  position="React Developer"
                  date="Dec 20"
                  time="10:00 AM"
                  status="upcoming"
                  onJoin={() => navigate('/live-interview')}
                />
                <InterviewCard3D
                  employer="StartupXYZ"
                  recruiter={{
                    name: "Emily Rodriguez",
                    title: "Head of Engineering",
                    email: "emily@startupxyz.com"
                  }}
                  position="Full Stack Engineer"
                  date="Dec 15"
                  time="3:00 PM"
                  status="completed"
                  onViewRecording={() => console.log('View recording')}
                />
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
  value: number;
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

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  matchScore: number;
  salary: string;
  tags: string[];
}

const JobCard = ({ title, company, location, matchScore, salary, tags }: JobCardProps) => (
  <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{company} • {location}</p>
      </div>
      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
        {matchScore}% Match
      </Badge>
    </div>
    <p className="text-sm font-medium text-primary mb-3">{salary}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline">
          {tag}
        </Badge>
      ))}
    </div>
  </div>
);

interface ApplicationCardProps {
  title: string;
  company: string;
  status: string;
  appliedDate: string;
}

const ApplicationCard = ({ title, company, status, appliedDate }: ApplicationCardProps) => (
  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
    <div>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{company}</p>
    </div>
    <div className="text-right">
      <Badge variant="secondary" className="mb-1">
        {status}
      </Badge>
      <p className="text-xs text-muted-foreground">{appliedDate}</p>
    </div>
  </div>
);

interface InterviewCardProps {
  company: string;
  date: string;
  time: string;
}

const InterviewCard = ({ company, date, time }: InterviewCardProps) => (
  <div className="p-4 border border-border rounded-lg bg-primary/5">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-medium">{company}</h4>
      <Calendar className="h-4 w-4 text-primary" />
    </div>
    <p className="text-sm text-muted-foreground mb-1">{date} at {time}</p>
    <Button size="sm" variant="hero" className="w-full mt-2">
      Join Interview
    </Button>
  </div>
);

export default CandidateDashboard;
