// components/ARComponent.tsx
import { useEffect, useState } from "react";
import Script from "next/script";

const ARComponent = () => {
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const [arjsLoaded, setArjsLoaded] = useState(false);
  const [boxes, setBoxes] = useState<any[]>([]);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  const spawnBox = () => {
    const cameraEl = document.querySelector("[gps-camera]");
    if (!cameraEl) return;

    const camera = (cameraEl as any)?.object3D;
    const three = (window as any).THREE;

    if (!camera || !three) return;

    const position = new three.Vector3(0, 0, -2);

    position.applyQuaternion(camera.quaternion);

    position.add(camera.position);

    const newBox = {
      id: Date.now(),
      x: position.x,
      y: position.y,
      z: position.z,
    };

    setBoxes((prev: any) => [...prev, newBox]);
  };

  useEffect(() => {
    const updateViewportSize = () => {
      if (typeof window === "undefined") return;
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportSize();

    if (typeof window === "undefined") return;

    window.addEventListener("resize", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
    };
  }, []);

  useEffect(() => {
    console.log(boxes);
  }, [boxes]);

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={() => setAframeLoaded(true)}
      />

      {aframeLoaded && (
        <Script
          src="https://raw.githack.com/jeromeetienne/AR.js/master/aframe/build/aframe-ar.min.js"
          strategy="afterInteractive"
          onLoad={() => setArjsLoaded(true)}
        />
      )}

      {arjsLoaded && (
        <Script
          src="https://raw.githack.com/donmccurdy/aframe-extras/master/dist/aframe-extras.loaders.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            if ((window as any).THREEx) {
              (window as any).THREEx.ArToolkitContext.baseURL =
                "https://raw.githack.com/jeromeetienne/ar.js/master/three.js/";
            }
          }}
        />
      )}

      {/* --- UI 버튼 --- */}
      {/* {arjsLoaded && (
        <button
          className="fixed b-[30px] l-[50%] bg-white text-black px-4 py-2 rounded-md z-50 border-none font-medium cursor-pointer"
          onClick={spawnBox}
        >
          박스 소환 📦
        </button>
      )} */}

      {/* --- Scene --- */}
      {arjsLoaded && viewportSize.width > 0 && viewportSize.height > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          {/* @ts-ignore */}
          <a-scene
            vr-mode-ui="enabled: false"
            embedded
            arjs={`sourceType: webcam; sourceWidth:${viewportSize.width}; sourceHeight:${viewportSize.height}; displayWidth: auto; displayHeight: auto; debugUIEnabled: false;`}
            renderer="logarithmicDepthBuffer: true;"
          >
            {/* @ts-ignore */}
            <a-camera gps-camera rotation-reader></a-camera>
            {boxes.map((box) => (
              // @ts-ignore
              <a-box
                key={box.id}
                position={`${box.x} ${box.y} ${box.z}`}
                material="color: yellow;"
                scale="0.5 0.5 0.5"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 5000"
              />
            ))}
            {/* @ts-ignore */}
          </a-scene>
        </div>
      )}
    </>
  );
};

export default ARComponent;
