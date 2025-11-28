"use client";

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Eye,
  Video,
  VideoOff,
} from "lucide-react";
import React, { useState } from "react";
import { useCameraCapture } from "@/app/hooks/useCameraCapture";
import { useOverlayContext } from "../OverlayContext";
import { useCameraContext } from "@/app/components/Camera";

export default function Debug() {
  const {
    navData,
    handleStepChange,
    handleDebugCapture,
    isLoadingDestination,
  } = useOverlayContext();
  const currentStep = navData.route_summary.current_step;
  const totalSteps = navData.route_summary.total_steps;
  const { captureScreen, isCapturing } = useCameraCapture();
  const { isWebcamEnabled, toggleWebcam } = useCameraContext();
  const [isUpdatingNav, setIsUpdatingNav] = useState(false);

  const handlePrevious = () => {
    if (currentStep > 1) {
      handleStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      handleStepChange(currentStep + 1);
    }
  };

  const canGoPrevious = currentStep > 1;
  const canGoNext = currentStep < totalSteps;
  const isCaptureDisabled = isCapturing || isUpdatingNav;

  const handleCaptureAndUpdate = async () => {
    if (isCaptureDisabled) {
      return;
    }

    setIsUpdatingNav(true);
    try {
      const capturedImage = await captureScreen({ download: false });
      if (capturedImage) {
        await handleDebugCapture(capturedImage);
      }
    } catch (error) {
      console.error("캡처 및 경로 갱신 실패:", error);
    } finally {
      setIsUpdatingNav(false);
    }
  };

  return (
    <div className="flex flex-col bg-zinc-900 rounded-2xl p-3 gap-2 max-w-sm w-full mx-auto shadow-2xl shadow-zinc-900">
      <h2 className="text-lg font-bold">Debug Panel</h2>
      <div className="pointer-events-auto flex items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`p-2 rounded-lg transition-colors ${
            canGoPrevious
              ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 cursor-pointer"
              : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
          }`}
          title="이전 단계"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex-1 text-center text-zinc-200 font-medium">
          <span className="text-base">{currentStep}</span>
          <span className="text-sm text-zinc-500 mx-1">/</span>
          <span className="text-sm text-zinc-500">{totalSteps}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`p-2 rounded-lg transition-colors ${
            canGoNext
              ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 cursor-pointer"
              : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
          }`}
          title="다음 단계"
        >
          <ArrowRight size={24} />
        </button>

        <button
          onClick={toggleWebcam}
          className={`p-2 rounded-lg transition-colors ${
            isWebcamEnabled
              ? "bg-blue-500 hover:bg-blue-400 text-white cursor-pointer"
              : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300 cursor-pointer"
          }`}
          title={isWebcamEnabled ? "Webcam 끄기" : "Webcam 켜기"}
        >
          {isWebcamEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button
          onClick={handleCaptureAndUpdate}
          disabled={isCaptureDisabled || !isWebcamEnabled}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
            isCaptureDisabled || !isWebcamEnabled
              ? "bg-emerald-500/30 text-zinc-600 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-400 text-white cursor-pointer"
          }`}
          title="AR 캡처 후 경로 갱신"
        >
          <Camera size={20} />
          <span className="text-sm">
            {isLoadingDestination || isUpdatingNav ? "업데이트 중..." : "캡처"}
          </span>
        </button>
      </div>
    </div>
  );
}
