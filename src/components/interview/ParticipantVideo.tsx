import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

interface ParticipantVideoProps {
  stream: MediaStream | null;
  name: string;
  role: 'candidate' | 'recruiter';
  isConnected: boolean;
  isMuted?: boolean;
  isLocal?: boolean;
}

export const ParticipantVideo = ({
  stream,
  name,
  role,
  isConnected,
  isMuted,
  isLocal = false,
}: ParticipantVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Card className="relative overflow-hidden bg-card border-border">
      <div className="aspect-video bg-muted relative">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal || isMuted}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        
        {/* Name label */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{name}</span>
              <Badge 
                variant={role === 'candidate' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {role === 'candidate' ? 'Candidate' : 'Recruiter'}
              </Badge>
            </div>
            
            {/* Connection status */}
            <div className="flex items-center gap-1">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-400" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* Muted indicator */}
        {isMuted && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="text-xs">
              Muted
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};
