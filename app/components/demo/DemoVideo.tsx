"use client";

import { useRef, useEffect } from "react";
import { useOverlayContext } from "../overlay/OverlayContext";

export default function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { demo, handleVideoTimeUpdate } = useOverlayContext();

  useEffect(() => {
    if (demo.isPlaying && videoRef.current) {
      videoRef.current.play().catch(console.error);
    } else if (!demo.isPlaying && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [demo.isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !demo.isPlaying) return;

    const handleTimeUpdate = () => {
      handleVideoTimeUpdate(video.currentTime);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [demo.isPlaying, handleVideoTimeUpdate]);

  if (!demo.isPlaying) return null;

  return (
    <video 
      width="100%" 
      height="100%" 
      muted
      playsInline
      className="fixed inset-0 w-full h-full object-cover z-0"
      ref={videoRef}
    >
      <source src="/scenario.mp4" type="video/mp4" />
    </video>
  );
}
