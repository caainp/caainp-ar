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
    <div className="flex flex-col bg-(--bg-card) rounded-2xl p-3 gap-2 max-w-sm w-full mx-auto shadow-2xl">
      <h2 className="text-lg font-bold">Debug Panel</h2>
      <div className="pointer-events-auto flex items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`p-2 rounded-lg transition-colors ${
            canGoPrevious
              ? "bg-(--bg-secondary) hover:bg-(--bg-hover) text-(--text-primary) cursor-pointer"
              : "bg-(--bg-secondary)/50 text-(--text-disabled) cursor-not-allowed"
          }`}
          title="이전 단계"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex-1 text-center text-(--text-secondary) font-medium">
          <span className="text-base">{currentStep}</span>
          <span className="text-sm text-(--text-muted) mx-1">/</span>
          <span className="text-sm text-(--text-muted)">{totalSteps}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`p-2 rounded-lg transition-colors ${
            canGoNext
              ? "bg-(--bg-secondary) hover:bg-(--bg-hover) text-(--text-primary) cursor-pointer"
              : "bg-(--bg-secondary)/50 text-(--text-disabled) cursor-not-allowed"
          }`}
          title="다음 단계"
        >
          <ArrowRight size={24} />
        </button>

        <button
          onClick={toggleWebcam}
          className={`p-2 rounded-lg transition-colors ${
            isWebcamEnabled
              ? "bg-(--action-primary) hover:bg-(--action-primary-hover) text-(--text-white) cursor-pointer"
              : "bg-(--bg-tertiary) hover:bg-(--text-disabled) text-(--text-tertiary) cursor-pointer"
          }`}
          title={isWebcamEnabled ? "Webcam 끄기" : "Webcam 켜기"}
        >
          {isWebcamEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        {/* <button
          onClick={handleCaptureAndUpdate}
          disabled={isCaptureDisabled || !isWebcamEnabled}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
            isCaptureDisabled || !isWebcamEnabled
              ? "bg-[var(--action-success)]/30 text-[var(--text-disabled)] cursor-not-allowed"
              : "bg-[var(--action-success)] hover:bg-[var(--action-success-hover)] text-[var(--text-white)] cursor-pointer"
          }`}
          title="AR 캡처 후 경로 갱신"
        >
          <Camera size={20} />
          <span className="text-sm">
            {isLoadingDestination || isUpdatingNav ? "업데이트 중..." : "캡처"}
          </span>
        </button> */}

        <button
          onClick={handleDebugUpdateStep}
          disabled={isCaptureDisabled}
          className={`p-2 rounded-lg transition-colors ${
            isCaptureDisabled
            ? "bg-(--bg-secondary)/50 text-(--text-disabled) cursor-not-allowed"
            : "bg-(--bg-secondary) hover:bg-(--bg-hover) text-(--text-primary) cursor-pointer"
          }`}
          title="무작위 값 갱신"
        >
          <span className="text-xs">무작위 값 갱신</span>
        </button>
      </div>
    </div>
  );
}
