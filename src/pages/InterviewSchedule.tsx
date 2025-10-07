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
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  meeting_link: string | null;
  notes: string | null;
  candidates: {
    name: string;
    email: string;
  };
  jobs: {
    title: string;
  };
}

const InterviewSchedule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interviews, setInterviews] = useState<Interview[]>([]);
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
          candidates(name, email),
          jobs(title)
        `)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
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
      filtered = filtered.filter(
        (interview) =>
          interview.candidates.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.jobs.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
      case 'missed':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
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
                  variant={statusFilter === 'missed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('missed')}
                  size="sm"
                >
                  Missed
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
            {filteredInterviews.map((interview) => (
              <Card
                key={interview.id}
                className="border-2 shadow-[var(--card-3d-shadow)] hover:shadow-[var(--card-3d-hover-shadow)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        {interview.jobs.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{interview.candidates.name}</span>
                        <span className="text-xs">({interview.candidates.email})</span>
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
                        {format(new Date(interview.scheduled_at), 'PPP')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {format(new Date(interview.scheduled_at), 'p')} ({interview.duration_minutes} min)
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSchedule;
