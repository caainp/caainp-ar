import { useApp } from "@playcanvas/react/hooks";
import { useState } from "react";
import * as pc from 'playcanvas';

export const XRScene = () => {
  const app = useApp();
  const [xrStarted, setXrStarted] = useState(false);

  const startXR = async () => {
    if (app.xr && app.xr.supported) {
      const cameraEntity = app.root.findByName('Camera') as pc.Entity & { camera: pc.Camera };

      if (!cameraEntity || !cameraEntity.camera) {
        alert("Camera not found");
        return;
      }

      try {
        await app.xr.start(cameraEntity.camera, pc.XRTYPE_AR, pc.XRSPACE_LOCAL);
        setXrStarted(true);
        alert("XR started");
      } catch (error) {
        alert('Failed to start XR:' + error);
      }
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
    <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 999 }}>
      <button 
        onClick={startXR} 
        onTouchEnd={startXR}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Start AR
      </button>
    </div>
  );
}