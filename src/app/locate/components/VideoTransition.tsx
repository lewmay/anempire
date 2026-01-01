'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface VideoTransitionProps {
  videoUrl: string;
  resultState: string;
  yesCount: number;
}

export default function VideoTransition({ videoUrl, resultState, yesCount }: VideoTransitionProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Preload video completely
    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      // Start playback once fully loaded
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Video playback failed:', err);
      });
    };

    const handleVideoEnd = () => {
      // Navigate immediately when video ends
      router.push(`/locate/results?state=${resultState}&yes=${yesCount}`);
    };

    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('ended', handleVideoEnd);

    // Start loading the video
    video.load();

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('ended', handleVideoEnd);
      document.body.style.overflow = 'auto';
    };
  }, [router, resultState, yesCount]);

  // Prevent all interactions during playback
  const handleInteraction = (e: React.SyntheticEvent) => {
    if (isPlaying) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      onClick={handleInteraction}
      onPointerDown={handleInteraction}
      onTouchStart={handleInteraction}
      style={{
        cursor: isPlaying ? 'none' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        preload="auto"
        playsInline
        muted={false}
        className="w-full h-full object-cover"
        style={{
          pointerEvents: 'none',
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Loading indicator - only shown while preloading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-neutral-400 font-serif font-light tracking-wide">
              Loading...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
