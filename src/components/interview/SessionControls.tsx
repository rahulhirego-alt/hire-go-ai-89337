import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Circle, Phone } from 'lucide-react';

interface SessionControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isRecording: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleRecording: () => void;
  onEndSession: () => void;
}

export const SessionControls = ({
  isAudioEnabled,
  isVideoEnabled,
  isRecording,
  onToggleAudio,
  onToggleVideo,
  onToggleRecording,
  onEndSession,
}: SessionControlsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isRecording && (
            <Badge variant="destructive" className="flex items-center gap-2">
              <Circle className="h-3 w-3 fill-current animate-pulse" />
              Recording
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isAudioEnabled ? 'secondary' : 'destructive'}
            size="lg"
            onClick={onToggleAudio}
            className="rounded-full w-14 h-14"
          >
            {isAudioEnabled ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant={isVideoEnabled ? 'secondary' : 'destructive'}
            size="lg"
            onClick={onToggleVideo}
            className="rounded-full w-14 h-14"
          >
            {isVideoEnabled ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant={isRecording ? 'destructive' : 'outline'}
            size="lg"
            onClick={onToggleRecording}
            className="rounded-full w-14 h-14"
          >
            <Circle className={`h-5 w-5 ${isRecording ? 'fill-current' : ''}`} />
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={onEndSession}
            className="rounded-full w-14 h-14 ml-4"
          >
            <Phone className="h-5 w-5 rotate-[135deg]" />
          </Button>
        </div>

        <div className="w-32" /> {/* Spacer for centering */}
      </div>
    </div>
  );
};
