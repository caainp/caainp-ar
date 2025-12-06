"use client";

import { useOverlayContext } from "./OverlayContext";
import { useCameraCapture } from "@/app/hooks/useCameraCapture";
import { useEffect, useState, useCallback, useRef } from "react";
import { fetchNavigationStep } from "@/app/lib/api";

export default function CaptureLoopNavigation() {
  const { navData, setNavData, isLoadingDestination, isCaptureLoopEnabled, setIsCaptureLoopEnabled } = useOverlayContext();
  const { destination } = navData;
  const { captureScreen, isCapturing } = useCameraCapture();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const shouldCaptureLoopEnabled =
    !!destination && !isLoadingDestination && isCaptureLoopEnabled;

  const performCaptureAndUpdate = useCallback(async () => {
    if (!destination || isProcessing || isCapturing) return;

    setIsProcessing(true);
    try {
      const captureResult = await captureScreen({
        format: "blob",
        download: false,
      });

      if (captureResult instanceof Blob) {
        const imageFile = new File([captureResult], "capture.jpg", {
          type: "image/jpeg",
        });
        const stepResponse = await fetchNavigationStep(destination, imageFile);
        setNavData((prev) => ({
          ...stepResponse,
          destination: prev.destination,
        }));
      }
    } catch (error) {
      console.error("캡처 루프 에러:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [destination, isProcessing, isCapturing, captureScreen, setNavData]);

  useEffect(() => {
    if (shouldCaptureLoopEnabled) {
      intervalRef.current = setInterval(() => {
        performCaptureAndUpdate();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [shouldCaptureLoopEnabled, performCaptureAndUpdate]);

  return null;
}
