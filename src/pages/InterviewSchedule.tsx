import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Search, Filter, Sparkles, User, Briefcase, Video, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Interview {
  id: string;
  interview_date: string;
  interview_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'rescheduled';
  meeting_link: string | null;
  notes: string | null;
  applications: {
    candidates: {
      user_id: string;
    } | null;
    jobs: {
      job_title: string;
    } | null;
  } | null;
}

interface Profile {
  full_name: string;
  email: string;
}

const InterviewSchedule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    filterInterviews();
  }, [searchTerm, statusFilter, interviews]);

  const fetchInterviews = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          applications(
            candidates(user_id),
            jobs(job_title)
          )
        `)
        .order('interview_date', { ascending: true });

      if (error) throw error;
      
      // Fetch profiles for all candidates
      const userIds = data?.map(i => i.applications?.candidates?.user_id).filter(Boolean) || [];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        
        const profilesMap: Record<string, Profile> = {};
        profilesData?.forEach(p => {
          profilesMap[p.id] = { full_name: p.full_name, email: p.email };
        });
        setProfiles(profilesMap);
      }
      
      setInterviews(data || []);
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

  const filterInterviews = () => {
    let filtered = [...interviews];

    if (searchTerm) {
      filtered = filtered.filter((interview) => {
        const userId = interview.applications?.candidates?.user_id;
        const profile = userId ? profiles[userId] : null;
        const jobTitle = interview.applications?.jobs?.job_title || '';
        const candidateName = profile?.full_name || '';
        
        return candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((interview) => interview.status === statusFilter);
    }

    setFilteredInterviews(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
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
            <Calendar className="h-8 w-8 text-primary" />
            Interview Schedule
          </h1>
          <p className="text-muted-foreground">
            Manage and track all scheduled interviews
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by candidate name or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'scheduled' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('scheduled')}
                  size="sm"
                >
                  Scheduled
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('completed')}
                  size="sm"
                >
                  Completed
                </Button>
                <Button
                  variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('cancelled')}
                  size="sm"
                >
                  Cancelled
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interviews List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading interviews...</p>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No interviews found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredInterviews.map((interview) => {
              const userId = interview.applications?.candidates?.user_id;
              const profile = userId ? profiles[userId] : null;
              const jobTitle = interview.applications?.jobs?.job_title || 'N/A';
              
              return (
                <Card
                  key={interview.id}
                  className="border-2 shadow-[var(--card-3d-shadow)] hover:shadow-[var(--card-3d-hover-shadow)] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          {jobTitle}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{profile?.full_name || 'Unknown'}</span>
                          <span className="text-xs">({profile?.email || 'N/A'})</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {format(new Date(interview.interview_date), 'PPP')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {interview.interview_time}
                        </span>
                      </div>
                    </div>
                    {interview.meeting_link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(interview.meeting_link!, '_blank')}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Join Meeting
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSchedule;
