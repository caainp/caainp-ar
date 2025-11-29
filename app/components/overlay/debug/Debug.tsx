"use client";

import {
  ArrowLeft,
  ArrowRight,
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
    handleDebugUpdateNav
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

  const handleDebugUpdateStep = async () => {
    if (isCaptureDisabled) {
      return;
    }

    setIsUpdatingNav(true);
    try {
      await handleDebugUpdateNav();
    } catch (error) {
      console.error("Debug Update Nav Error:", error);
    } finally {
      setIsUpdatingNav(false);
    }
  };

  return (
    <div className="flex flex-col bg-(--bg-primary)/90 backdrop-blur-md border border-(--border-primary) rounded-2xl p-4 gap-4 max-w-sm w-full mx-auto shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-(--text-tertiary) tracking-wider uppercase">디버그 컨트롤</h2>
        {/* <div className="h-1.5 w-1.5 rounded-full bg-(--action-success) animate-pulse" /> */}
      </div>
      
      <div className="flex flex-col gap-3">
        {/* Navigation Controls */}
        <div className="flex items-center gap-2 bg-(--bg-secondary)/50 p-1.5 rounded-xl border border-(--border-subtle)">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
              canGoPrevious
                ? "bg-(--bg-tertiary) hover:bg-(--bg-hover) text-(--text-primary) hover:scale-105 active:scale-95 shadow-sm"
                : "bg-transparent text-(--text-disabled) cursor-not-allowed opacity-50"
            }`}
            title="이전 단계"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-xs text-(--text-tertiary) font-medium">Step</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-(--text-primary) tabular-nums">{currentStep}</span>
              <span className="text-xs text-(--text-muted)">/</span>
              <span className="text-sm text-(--text-muted) tabular-nums">{totalSteps}</span>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
              canGoNext
                ? "bg-(--bg-tertiary) hover:bg-(--bg-hover) text-(--text-primary) hover:scale-105 active:scale-95 shadow-sm"
                : "bg-transparent text-(--text-disabled) cursor-not-allowed opacity-50"
            }`}
            title="다음 단계"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={toggleWebcam}
            className={`h-10 px-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border ${
              isWebcamEnabled
                ? "bg-(--action-primary)/10 border-(--action-primary)/20 text-(--action-primary) hover:bg-(--action-primary)/20"
                : "bg-(--bg-secondary) border-(--border-subtle) text-(--text-secondary) hover:bg-(--bg-tertiary)"
            }`}
            title={isWebcamEnabled ? "Webcam 끄기" : "Webcam 켜기"}
          >
            {isWebcamEnabled ? <Video size={18} /> : <VideoOff size={18} />}
            <span className="text-xs font-medium">{isWebcamEnabled ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={handleDebugUpdateStep}
            disabled={isCaptureDisabled}
            className={`h-10 px-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border ${
              isCaptureDisabled
                ? "bg-(--bg-secondary)/50 border-(--border-subtle) text-(--text-disabled) cursor-not-allowed"
                : "bg-(--bg-secondary) border-(--border-subtle) text-(--text-primary) hover:bg-(--bg-tertiary) hover:border-(--border-medium) active:scale-95"
            }`}
            title="무작위 값 갱신"
          >
            <span className="text-xs font-medium">무작위 값 갱신</span>
          </button>
        </div>
      </div>
    </div>
  );
}
