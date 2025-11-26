'use client'

import { useApp } from "@playcanvas/react/hooks";
import { useState, useMemo } from "react";
import * as pc from 'playcanvas';

export const XRScene = () => {
  const app = useApp();
  const [xrStarted, setXrStarted] = useState(false);

  const isAppReady = useMemo(() => !!(app && app.root), [app]);

  const startXR = async () => {
    if (!isAppReady) {
      alert("App is not ready yet. Please wait.");
      return;
    }

    if (!app.xr) {
      alert("XR is not available");
      return;
    }

    if (!app.xr.supported) {
      alert("XR not supported");
      return;
    }

    const cameraEntity = app.root.findByName('Camera') as pc.Entity & { camera: pc.Camera };

    if (!cameraEntity || !cameraEntity.camera) {
      alert("Camera not found");
      return;
    }

    try {
      // Ensure XR session is properly initialized before starting
      await app.xr.start(cameraEntity.camera, pc.XRTYPE_AR, pc.XRSPACE_LOCAL);
      setXrStarted(true);
      alert("XR started");
    } catch (error) {
      console.error('XR start error:', error);
      alert('Failed to start XR: ' + (error as Error).message);
    }
  };

  if (xrStarted) {
    return (
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 999 }}>
        <h1 style={{ color: 'white' }}>Camera started (AR mode)</h1>
      </div>
    );
  }

  return (
    <div className="absolute top-5 left-5 z-50">
      <button 
        onClick={startXR} 
        onTouchEnd={startXR}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Start AR
      </button>
    </div>
  );
}