"use client";

import { useOverlayContext } from "./OverlayContext";
import { useCameraCapture } from "@/app/hooks/useCameraCapture";
import { useCallback } from "react";
import { fetchNavigationStep } from "@/app/lib/api";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import { useCameraContext } from "../Camera";
import { createBlackImage } from "@/app/lib/utils";

export default function CaptureLoopNavigation() {
  const { setNavData, demo: { enableDemoMode }, isProcessing, setIsProcessing } = useOverlayContext();
  const { isWebcamEnabled, enableWebcam } = useCameraContext();
  const { captureScreen, isCapturing } = useCameraCapture();

  const performCaptureAndUpdate = useCallback(async () => {
    if (isProcessing || isCapturing) return;

    setIsProcessing(true);
    try {
      const captureResult = await captureScreen({
        format: "blob",
        download: false,
      });

      let imageFile: File | null = null;

      if (captureResult instanceof Blob) {
        imageFile = new File([captureResult], "capture.jpg", {
          type: "image/jpeg",
        });
      }

      if (!imageFile) {
        imageFile = await createBlackImage();
      }

      const stepResponse = await fetchNavigationStep({ image: imageFile as File, enableDemoMode });

      setNavData((prev) => ({
        ...stepResponse,
        destination: prev.destination,
      }));
    } catch (error) {
      console.error("Capture Loop Error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isCapturing, captureScreen, setNavData, setIsProcessing, enableDemoMode]);

  return (
    <button
      onClick={performCaptureAndUpdate}
      disabled={isProcessing || isCapturing}
      className="group relative flex items-center justify-center rounded-full transition-transform 
      active:scale-95 disabled:opacity-50 touch-manipulation"
      aria-label="현재 위치 캡처 및 길안내 업데이트"
    >
      <div className={`
        relative flex items-center justify-center 
        size-14 rounded-full 
        bg-(--bg-primary) 
        ring-1 ring-(--border-primary)
        transition-colors duration-200
        shadow-2xl
      `}>
        {isProcessing ? (
          <Loader2 className="size-6 text-(--text-white) animate-spin" />
        ) : (
          isWebcamEnabled ? (
            <Camera className="size-6 text-(--text-white)" />
          ) : (
            <CameraOff className="size-6 text-(--text-white) opacity-50" />
          )
        )}
      </div>
    </button>
  );
}
