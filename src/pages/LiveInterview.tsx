import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Video as VideoIcon } from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { ParticipantVideo } from '@/components/interview/ParticipantVideo';
import { EvaluationPanel } from '@/components/interview/EvaluationPanel';
import { ChatPanel } from '@/components/interview/ChatPanel';
import { SessionControls } from '@/components/interview/SessionControls';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

interface Participant {
  id: string;
  user_id: string;
  role: 'candidate' | 'recruiter';
  display_name: string;
  is_connected: boolean;
  peer_id: string | null;
}

const LiveInterview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');

  const [userRole, setUserRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [userName, setUserName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);

  const {
    localStream,
    peers,
    peerId,
    isAudioEnabled,
    isVideoEnabled,
    connectionStatus,
    initializePeer,
    connectToPeer,
    toggleAudio,
    toggleVideo,
    cleanup,
  } = useWebRTC({
    onPeerConnected: (peerId, stream) => {
      console.log('Peer connected:', peerId);
    },
    onPeerDisconnected: (peerId) => {
      console.log('Peer disconnected:', peerId);
    },
  });

  useEffect(() => {
    if (!sessionId) {
      toast({
        title: 'Invalid session',
        description: 'Please join a valid interview session.',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    initializeSession();
  }, [sessionId]);

  useEffect(() => {
    if (peerId && sessionId) {
      updateParticipantPeerId(peerId);
    }
  }, [peerId, sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    subscribeToParticipants();
  }, [sessionId]);

  const initializeSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // Get user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      const role = roleData?.role === 'employer' ? 'recruiter' : 'candidate';
      setUserRole(role);
      setUserName(profile?.full_name || 'Unknown');

      // Join session
      const { error: joinError } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionId!,
          user_id: user.id,
          role,
          display_name: profile?.full_name || 'Unknown',
        });

      if (joinError && !joinError.message.includes('duplicate')) {
        throw joinError;
      }

      // Initialize WebRTC
      await initializePeer();

      // Fetch existing participants
      fetchParticipants();
    } catch (error) {
      console.error('Error initializing session:', error);
      toast({
        title: 'Error',
        description: 'Failed to join the session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', sessionId!)
        .is('left_at', null);

      if (error) throw error;
      
      const participantsList = data as Participant[];
      setParticipants(participantsList);

      // Connect to peers
      participantsList.forEach((p) => {
        if (p.peer_id && p.user_id !== (supabase.auth.getUser() as any).data?.user?.id) {
          connectToPeer(p.peer_id);
        }
      });
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const updateParticipantPeerId = async (newPeerId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('session_participants')
        .update({ peer_id: newPeerId })
        .eq('session_id', sessionId!)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error updating peer ID:', error);
    }
  };

  const subscribeToParticipants = () => {
    const channel = supabase
      .channel(`participants:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_participants',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log('Participant update:', payload);
          fetchParticipants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleToggleRecording = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || userRole !== 'recruiter') return;

      const newRecordingState = !isRecording;
      setIsRecording(newRecordingState);

      await supabase
        .from('interview_sessions')
        .update({
          recording_started_at: newRecordingState ? new Date().toISOString() : null,
        })
        .eq('id', sessionId!);

      toast({
        title: newRecordingState ? 'Recording started' : 'Recording stopped',
        description: newRecordingState
          ? 'The interview session is now being recorded.'
          : 'Recording has been stopped.',
      });
    } catch (error) {
      console.error('Error toggling recording:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle recording.',
        variant: 'destructive',
      });
    }
  };

  const handleEndSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('session_participants')
        .update({ left_at: new Date().toISOString(), is_connected: false })
        .eq('session_id', sessionId!)
        .eq('user_id', user.id);

      cleanup();
      navigate(-1);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const candidateInfo = {
    name: participants.find((p) => p.role === 'candidate')?.display_name || 'Unknown',
    position: 'Senior Frontend Developer',
    skills: ['JavaScript', 'React', 'CSS'],
    resumeUrl: undefined,
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HireGoai</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <VideoIcon className="h-8 w-8 text-primary" />
            Live Interview Session
          </h1>
          <p className="text-muted-foreground">
            Senior Frontend Developer Position – Interview in Progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Grid */}
          <div className="lg:col-span-2 space-y-4">
            {/* Local Video */}
            <ParticipantVideo
              stream={localStream}
              name={userName}
              role={userRole}
              isConnected={connectionStatus === 'connected'}
              isMuted={!isAudioEnabled}
              isLocal
            />

            {/* Remote Videos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from(peers.entries()).map(([peerId, stream], index) => {
                const participant = participants.find((p) => p.peer_id === peerId);
                return (
                  <ParticipantVideo
                    key={peerId}
                    stream={stream}
                    name={participant?.display_name || `Participant ${index + 1}`}
                    role={participant?.role || 'candidate'}
                    isConnected={participant?.is_connected || false}
                  />
                );
              })}
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <Collapsible open={sidePanelOpen} onOpenChange={setSidePanelOpen}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Session Info</h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        sidePanelOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-4">
                <EvaluationPanel
                  sessionId={sessionId!}
                  candidateInfo={candidateInfo}
                  isRecruiter={userRole === 'recruiter'}
                />
                <ChatPanel
                  sessionId={sessionId!}
                  isRecruiter={userRole === 'recruiter'}
                  userName={userName}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>

      {/* Session Controls */}
      <SessionControls
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isRecording={isRecording}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleRecording={handleToggleRecording}
        onEndSession={handleEndSession}
      />
    </div>
  );
};

export default LiveInterview;
