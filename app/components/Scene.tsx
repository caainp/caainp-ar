// components/ARComponent.tsx
import { useState } from "react";
import Script from "next/script";
import { useCameraCapture } from "../hooks/useCameraCapture";

const ARComponent = () => {
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const [arjsLoaded, setArjsLoaded] = useState(false);

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
      {arjsLoaded && null}

      {/* --- Scene --- */}
      {arjsLoaded && (
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
            arjs={`sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: auto; displayHeight: auto; debugUIEnabled: false;`}
            // preserveDrawingBuffer: true 는 필수입니다.
            renderer="logarithmicDepthBuffer: true; preserveDrawingBuffer: true;"
          >
            {/* @ts-ignore */}
            <a-camera />

            {/* @ts-ignore */}
          </a-scene>
        </div>
      )}
    </>
  );
};

export default ARComponent;
