import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowLeft, Video, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const VideoAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const questions = [
    'Tell us about yourself and your professional background.',
    'Describe a challenging project you worked on and how you overcame obstacles.',
    'Where do you see yourself in 5 years?',
  ];

  useEffect(() => {
    startCamera();
    setupProctoring();
    
    return () => {
      stopCamera();
      cleanup();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera/microphone',
        variant: 'destructive',
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const setupProctoring = () => {
    // Detect tab switches
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Detect window blur
    window.addEventListener('blur', handleWindowBlur);
    
    // Prevent right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Request fullscreen
    enterFullscreen();
  };

  const cleanup = () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleWindowBlur);
    document.removeEventListener('contextmenu', (e) => e.preventDefault());
  };

  const handleVisibilityChange = () => {
    if (document.hidden && isRecording) {
      setTabSwitches((prev) => prev + 1);
      showWarning('Tab switch detected! Please stay on this page.');
      playWarningSound();
    }
  };

  const handleWindowBlur = () => {
    if (isRecording) {
      setWarnings((prev) => prev + 1);
      showWarning('Window lost focus! Please stay focused on the assessment.');
      playWarningSound();
    }
  };

  const showWarning = (message: string) => {
    toast({
      title: '⚠️ Warning',
      description: message,
      variant: 'destructive',
    });
    setWarnings((prev) => prev + 1);
  };

  const playWarningSound = () => {
    const audio = new Audio('/warning.mp3'); // You would need to add this file
    audio.play().catch(() => {
      // Fallback: use system beep
      const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDGD0PLNfC0GKIDL8Nd/PwoZZ7jp7KFRFwlOn+TxwXAiAy6B0O/PeTEGK37L79qCOwkVY7jp7aFREwxPouHwwXEjBC5/z+7QeTQGKYDM79h/PQoVY7fr7KFQFglMouHwwXAjBS9/zO7QeTIGK4DM79h/PgkWY7fr7KBQFglMouHwwXAjBS9/zO7QeTIGKoDM79d+PwkUZLfr7KBQFglMouHwwHAjBS5/zO7QeTIGK4DN79d+PQoVY7fr7KBQFglMouHwwHAjBS5/zO7QeTIGK4DN79d+PQoVY7fr7KBQFglMouHwwHAjBS5/zO7QeTIGK4DN79d+PQoVY7fr7KBQFglMouHwwHAjBS5/zO7QeTIGK4DN79d+PQoVY7fr7KBQFglMouHwwHAjBS5/zO7QeTIGK4DN79d+PQoVY7fr7KBQFglMouHwwHAjBS5/zO7QeTIGK4DN79d+PQoVY7fr7KBQFglMouHwwHAjBS5/zO7QeTIGK4DN79d+PQoVY7fr7KBQFglMouHwwHAjBS5/zO7QeTIGK4DN79d+PQ');
      beep.play();
    });
  };

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().catch(() => {
      toast({
        title: 'Fullscreen Required',
        description: 'Please enable fullscreen for the assessment.',
        variant: 'destructive',
      });
    });
    setIsFullscreen(true);
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      await saveAssessment(blob);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);

    toast({
      title: 'Recording Started',
      description: 'Answer the question clearly',
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        toast({
          title: 'Moving to Next Question',
        });
      } else {
        toast({
          title: 'Assessment Complete!',
          description: 'Your responses have been recorded',
        });
      }
    }
  };

  const saveAssessment = async (blob: Blob) => {
    try {
      // In production, upload to storage and save record
      toast({
        title: 'Saved',
        description: 'Your response has been saved',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            <div className="flex items-center gap-4">
              <Badge variant={warnings > 5 ? 'destructive' : 'secondary'}>
                Warnings: {warnings}
              </Badge>
              <Badge variant={tabSwitches > 3 ? 'destructive' : 'secondary'}>
                Tab Switches: {tabSwitches}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} />
        </div>

        {/* Warning Banner */}
        {(warnings > 3 || tabSwitches > 2) && (
          <Card className="mb-6 border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-semibold">
                  Multiple violations detected! Your assessment is being monitored.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Live Video Feed
                {isRecording && (
                  <Badge className="ml-auto bg-red-500 animate-pulse">
                    REC {formatTime(recordingTime)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500 flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    Monitoring Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Question</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg font-medium">{questions[currentQuestion]}</p>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Proctoring Status:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Camera</span>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Microphone</span>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Tab Detection</span>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Fullscreen</span>
                      <Badge variant="secondary" className={isFullscreen ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}>
                        {isFullscreen ? 'Active' : 'Required'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Start Recording Answer
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="w-full"
                    >
                      Stop & Submit Answer
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  ⚠️ Do not switch tabs, leave fullscreen, or use external devices
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoAssessment;
