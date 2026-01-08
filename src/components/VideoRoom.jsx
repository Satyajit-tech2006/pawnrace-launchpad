import React, { useEffect, useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles'; // Great default styles
import { Track } from 'livekit-client';
import apiClient from '../lib/api'; 
import { Loader2, VideoOff, MicOff } from 'lucide-react';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

const VideoRoom = ({ roomId }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Request a secure token from YOUR backend
        const res = await apiClient.get(`/livekit/token?roomId=${roomId}`);
        setToken(res.data.token);
      } catch (error) {
        console.error("Failed to connect to video:", error);
      }
    };

    if (roomId) fetchToken();
  }, [roomId]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#111] text-gray-500 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-xs font-mono">Securing Connection...</span>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: '100%', width: '100%', backgroundColor: '#000' }}
    >
      {/* VideoConference is the "Magical Component".
         It automatically handles:
         1. Grid Layout (1x1, 2x2, 3x3 depending on user count)
         2. Active Speaker (Makes the person talking bigger)
         3. Bandwidth management (Lowers quality if internet is bad)
      */}
      <VideoConference />

      {/* Renders audio from all other participants */}
      <RoomAudioRenderer />
      
      {/* Optional: Adds Mute/Camera buttons at the bottom of the video area */}
      {/* <ControlBar /> */} 
    </LiveKitRoom>
  );
};

export default VideoRoom;