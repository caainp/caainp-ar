import { useState, useCallback, useRef, useEffect } from "react";
import { DemoData, NavData } from "../components/overlay/types";
import { fetchNavigationStep } from "@/app/lib/api";
import { createBlackImage } from "@/app/lib/utils";

const initialDemoData: DemoData = {
  enableDemoMode: false,
  isPanelOpen: true,
  isPlaying: false,
  phase: "idle",
  currentScenarioStep: 0,
};

export const useDemo = (
  enableDemoMode: boolean,
  handleSelectDestination: (destination: string, startRoom: string) => Promise<void>,
  setNavData: React.Dispatch<React.SetStateAction<NavData>>,
  initialNavData: NavData,
  isProcessing: boolean,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [demo, setDemo] = useState<DemoData>({
    ...initialDemoData,
    enableDemoMode,
    isPanelOpen: enableDemoMode,
  });
  const [demoSearchQuery, setDemoSearchQuery] = useState("");
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const executedStepsRef = useRef<Set<number>>(new Set());

  const performDemoCapture = useCallback(async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const imageFile = await createBlackImage();
      const stepResponse = await fetchNavigationStep({ image: imageFile, enableDemoMode: true });
      setNavData((prev) => ({
        ...stepResponse,
        destination: prev.destination,
      }));
    } catch (error) {
      console.error("Demo Capture Error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [setNavData, isProcessing, setIsProcessing]);

  const runDemoScenario = useCallback(async () => {
    executedStepsRef.current.clear();
    setDemo((prev) => ({ ...prev, phase: "searching", currentScenarioStep: 1 }));
    
    const searchText = "엘리베이터에서 인큐베이터 들른 후 414호 강의실로 이동";
    setDemoSearchQuery(searchText);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setDemo((prev) => ({ ...prev, phase: "navigating", currentScenarioStep: 2 }));
    setDemoSearchQuery("");
    await handleSelectDestination("엘리베이터에서 인큐베이터 들른 후 414호 강의실로 이동", "중앙 엘리베이터");
  }, [handleSelectDestination]);

  const handleVideoTimeUpdate = useCallback((currentTime: number) => {
    const _demoCapture = (step: number) => {
      if (!executedStepsRef.current.has(step)) {
        executedStepsRef.current.add(step);
        setDemo((prev) => ({ ...prev, currentScenarioStep: step }));
        performDemoCapture();
      }
    };

    if (currentTime >= 34 && currentTime < 35 && !executedStepsRef.current.has(3)) {
      _demoCapture(3);
    } else if (currentTime >= 72 && currentTime < 73 && !executedStepsRef.current.has(4)) {
      _demoCapture(4);
    } else if (currentTime >= 87 && currentTime < 88 && !executedStepsRef.current.has(5)) {
      _demoCapture(5);
    } else if (currentTime >= 104 && currentTime < 105 && !executedStepsRef.current.has(6)) {
      _demoCapture(6);
    } else if (currentTime >= 105 && currentTime < 106 && !executedStepsRef.current.has(7)) {
      executedStepsRef.current.add(7);
      setDemo((prev) => ({ ...prev, phase: "completed", currentScenarioStep: 7 }));
    }
  }, [performDemoCapture]);

  const startDemo = useCallback(() => {
    setDemo((prev) => ({ ...prev, isPanelOpen: false, isPlaying: true, phase: "intro" }));
    
    demoTimerRef.current = setTimeout(() => {
      runDemoScenario();
    }, 2000);
  }, [runDemoScenario]);

  const stopDemo = useCallback(() => {
    if (demoTimerRef.current) {
      clearTimeout(demoTimerRef.current);
    }
    executedStepsRef.current.clear();
    setDemo((prev) => ({ 
      ...prev, 
      isPanelOpen: true, 
      isPlaying: false, 
      phase: "idle",
      currentScenarioStep: 0 
    }));
    setNavData(initialNavData);
    setDemoSearchQuery("");
  }, [setNavData, initialNavData]);

  useEffect(() => {
    return () => {
      if (demoTimerRef.current) {
        clearTimeout(demoTimerRef.current);
      }
    };
  }, []);

  return {
    demo,
    setDemo,
    demoSearchQuery,
    setDemoSearchQuery,
    startDemo,
    stopDemo,
    performDemoCapture,
    handleVideoTimeUpdate,
  };
};
