"use client";

import { ReactNode, useRef, useState } from "react";

export default function Demo({ children }: { children?: ReactNode }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoStart = () => {
    videoRef.current?.play();
  }

  return (
    <>
      <video width="100%" height="100%" muted loop className="absolute top-0 left-0 w-full h-full object-cover" ref={videoRef} 
      onCanPlay={handleVideoStart}>
        <source src="/test.mp4" type="video/mp4" />
      </video>
      {children}
    </>
  );
}
