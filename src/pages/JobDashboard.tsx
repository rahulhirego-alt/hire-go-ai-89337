import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowLeft, Briefcase, Users, Calendar, ClipboardCheck, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  status: 'active' | 'closed' | 'draft';
  created_at: string;
}

interface CandidateStats {
  total: number;
  applied: number;
  screening: number;
  interview: number;
  assessment: number;
  offer: number;
}

const JobDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    scheduledInterviews: 0,
    pendingAssessments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      // Fetch statistics
      const { count: candidatesCount } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true });

      const { count: interviewsCount } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');

      const { count: assessmentsCount } = await supabase
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .is('completed_at', null);

      setStats({
        totalJobs: jobsData?.length || 0,
        totalCandidates: candidatesCount || 0,
        scheduledInterviews: interviewsCount || 0,
        pendingAssessments: assessmentsCount || 0,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCandidatesByJob = async (jobId: string): Promise<CandidateStats> => {
    const { data } = await supabase
      .from('candidates')
      .select('status')
      .eq('job_id', jobId);

    const stats: CandidateStats = {
      total: data?.length || 0,
      applied: 0,
      screening: 0,
      interview: 0,
      assessment: 0,
      offer: 0,
    };

    data?.forEach((candidate) => {
      if (candidate.status in stats) {
        stats[candidate.status as keyof CandidateStats]++;
      }
    });

    return stats;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'closed':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'draft':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return '';
    }
  };

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
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Job Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of all active jobs and recruitment progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 shadow-[var(--card-3d-shadow)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{stats.totalJobs}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-[var(--card-3d-shadow)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{stats.totalCandidates}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-[var(--card-3d-shadow)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Scheduled Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{stats.scheduledInterviews}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-[var(--card-3d-shadow)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{stats.pendingAssessments}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Active Job Postings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No jobs posted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const JobCard = ({ job }: { job: Job }) => {
  const [candidateStats, setCandidateStats] = useState<CandidateStats>({
    total: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    assessment: 0,
    offer: 0,
  });

  useEffect(() => {
    fetchCandidateStats();
  }, [job.id]);

  const fetchCandidateStats = async () => {
    const { data } = await supabase
      .from('candidates')
      .select('status')
      .eq('job_id', job.id);

    const stats: CandidateStats = {
      total: data?.length || 0,
      applied: 0,
      screening: 0,
      interview: 0,
      assessment: 0,
      offer: 0,
    };

    data?.forEach((candidate) => {
      if (candidate.status in stats) {
        stats[candidate.status as keyof CandidateStats]++;
      }
    });

    setCandidateStats(stats);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'closed':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'draft':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return '';
    }
  };

  const getProgressPercentage = () => {
    if (candidateStats.total === 0) return 0;
    return Math.round((candidateStats.offer / candidateStats.total) * 100);
  };

  return (
    <Card className="border-2 shadow-[var(--card-3d-shadow)] hover:shadow-[var(--card-3d-hover-shadow)] hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{job.location}</p>
          </div>
          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Candidates</span>
            <span className="font-bold">{candidateStats.total}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Applied: {candidateStats.applied}</span>
              <span>Screening: {candidateStats.screening}</span>
              <span>Interview: {candidateStats.interview}</span>
              <span>Assessment: {candidateStats.assessment}</span>
              <span>Offer: {candidateStats.offer}</span>
            </div>
            <Progress value={getProgressPercentage()} />
            <p className="text-xs text-muted-foreground text-center">
              {getProgressPercentage()}% Conversion Rate
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDashboard;
