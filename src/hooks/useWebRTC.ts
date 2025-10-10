import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';

interface UseWebRTCOptions {
  onPeerConnected?: (peerId: string, stream: MediaStream) => void;
  onPeerDisconnected?: (peerId: string) => void;
}

export const useWebRTC = (options: UseWebRTCOptions = {}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<string, MediaStream>>(new Map());
  const [peerId, setPeerId] = useState<string>('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Map<string, any>>(new Map());

  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  const initializePeer = useCallback(async () => {
    const stream = await initializeMedia();
    
    const peer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
        ],
      },
    });

    peer.on('open', (id) => {
      console.log('My peer ID is:', id);
      setPeerId(id);
      setConnectionStatus('connected');
    });

    peer.on('call', (call) => {
      console.log('Receiving call from:', call.peer);
      call.answer(stream);
      
      call.on('stream', (remoteStream) => {
        console.log('Received remote stream from:', call.peer);
        setPeers((prev) => new Map(prev).set(call.peer, remoteStream));
        options.onPeerConnected?.(call.peer, remoteStream);
      });

      call.on('close', () => {
        console.log('Call closed with:', call.peer);
        setPeers((prev) => {
          const newPeers = new Map(prev);
          newPeers.delete(call.peer);
          return newPeers;
        });
        options.onPeerDisconnected?.(call.peer);
      });

      connectionsRef.current.set(call.peer, call);
    });

    peer.on('error', (error) => {
      console.error('Peer error:', error);
      setConnectionStatus('disconnected');
    });

    peerRef.current = peer;
    setConnectionStatus('connecting');
  }, [initializeMedia, options]);

  const connectToPeer = useCallback((remotePeerId: string) => {
    if (!peerRef.current || !localStream) {
      console.error('Peer or local stream not initialized');
      return;
    }

    console.log('Calling peer:', remotePeerId);
    const call = peerRef.current.call(remotePeerId, localStream);

    call.on('stream', (remoteStream) => {
      console.log('Received remote stream from:', remotePeerId);
      setPeers((prev) => new Map(prev).set(remotePeerId, remoteStream));
      options.onPeerConnected?.(remotePeerId, remoteStream);
    });

    call.on('close', () => {
      console.log('Call closed with:', remotePeerId);
      setPeers((prev) => {
        const newPeers = new Map(prev);
        newPeers.delete(remotePeerId);
        return newPeers;
      });
      options.onPeerDisconnected?.(remotePeerId);
    });

    connectionsRef.current.set(remotePeerId, call);
  }, [localStream, options]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, [localStream]);

  const cleanup = useCallback(() => {
    // Stop all tracks
    localStream?.getTracks().forEach((track) => track.stop());
    
    // Close all peer connections
    connectionsRef.current.forEach((connection) => {
      connection.close();
    });
    connectionsRef.current.clear();

    // Destroy peer
    peerRef.current?.destroy();
    
    setLocalStream(null);
    setPeers(new Map());
    setPeerId('');
    setConnectionStatus('disconnected');
  }, [localStream]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
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
  };
};
