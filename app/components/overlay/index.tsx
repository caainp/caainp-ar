"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import NavigationCard from "./navigation/NavigationCard";
import DestinationSearch from "./destination/DestinationSearch";
import Debug from "./debug/Debug";
import { NavData } from "./types";
import { OverlayProvider, useOverlayContext } from "./OverlayContext";
import SettingWrapper from "./setting/SettingWrapper";
import RouteSummary from "./route/RouteSummary";
import { fetchNavigationStart } from "@/app/lib/api";
import { useCameraCapture } from "@/app/hooks/useCameraCapture";
import CaptureLoopNavigation from "./CaptureLoopNavigation";
import DemoPanel from "../demo/DemoPanel";
import DemoVideo from "../demo/DemoVideo";
import { useDemo } from "@/app/hooks/useDemo";
import { createBlackImage } from "@/app/lib/utils";

const initialNavData: NavData = {
  schema_version: 1,
  current_node: null,
  next_node: null,
  move_instruction: {
    direction_type: "STRAIGHT",
    angle_deg: 0,
    text_ko: "",
  },
  route_summary: {
    current_step: 0,
    total_steps: 0,
    remaining_steps_text: "",
    via_nodes: [],
  },
  destination: ""
};


export default function Overlay({ enableDemoMode = false }: { enableDemoMode?: boolean }) {
  const [debug, setDebug] = useState(false);
  const [setting, setSetting] = useState(false);
  const [navData, setNavData] = useState<NavData>(initialNavData);
  const [isCaptureLoopEnabled, setIsCaptureLoopEnabled] = useState(true);
  const [recentDestinations, setRecentDestinations] = useState<string[]>([]);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [palette, setPalette] = useState<string>("soft");
  const { captureScreen } = useCameraCapture();

  console.log(navData);

  const handleSelectDestination = useCallback(async (destination: string, startRoom: string) => {
    setNavData(initialNavData);
    setRecentDestinations((prev) => [destination, ...prev.filter((d) => d !== destination)]);
    setIsLoadingDestination(true);

    try {
      const captureResult = await captureScreen({ format: "blob", download: false });
      let imageFile: File | null = null;

      if (captureResult instanceof Blob) {
        imageFile = new File([captureResult], "capture.jpg", { type: "image/jpeg" });
      }

      if (!imageFile) {
        imageFile = await createBlackImage();
      }

      const startResponse = await fetchNavigationStart({ requestText: destination, startRoom, image: imageFile as File, enableDemoMode });
      setNavData({
        ...startResponse,
        destination,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDestination(false);
    }
  }, [captureScreen, enableDemoMode]);

  const handleCancelDestination = () => {
    setNavData(initialNavData);
  };

  const handleRemoveRecentDestination = (destination: string) => {
    setRecentDestinations((prev) => prev.filter((d) => d !== destination));
  };

  const handleRemoveAllRecentDestinations = () => {
    setRecentDestinations([]);
  };

  const handleStepChange = (newStep: number) => {
    setNavData((prev) => ({
      ...prev,
      route_summary: {
        ...prev.route_summary,
        current_step: newStep,
      },
    }));
  };

  const {
    demo,
    setDemo,
    demoSearchQuery,
    setDemoSearchQuery,
    startDemo,
    stopDemo,
    performDemoCapture,
    handleVideoTimeUpdate,
  } = useDemo(enableDemoMode, handleSelectDestination, setNavData, initialNavData, isProcessing, setIsProcessing);

  const contextValue = useMemo(() => ({
    navData,
    setNavData,
    isLoadingDestination,
    setIsLoadingDestination,
    isProcessing,
    setIsProcessing,
    recentDestinations,
    setRecentDestinations,
    handleSelectDestination,
    handleCancelDestination,
    handleRemoveRecentDestination,
    handleRemoveAllRecentDestinations,
    handleStepChange,
    setting,
    setSetting,
    debug,
    setDebug,
    palette,
    setPalette,
    isCaptureLoopEnabled,
    setIsCaptureLoopEnabled,
    demo,
    setDemo,
    startDemo,
    stopDemo,
    performDemoCapture,
    setDemoSearchQuery,
    demoSearchQuery,
    handleVideoTimeUpdate,
  }), [
    navData,
    isLoadingDestination,
    isProcessing,
    recentDestinations,
    handleSelectDestination,
    setting,
    debug,
    palette,
    isCaptureLoopEnabled,
    demo,
    startDemo,
    stopDemo,
    performDemoCapture,
    demoSearchQuery,
    setDemo,
    setDemoSearchQuery,
    handleVideoTimeUpdate,
  ]);

  useEffect(() => {
    if (palette === "default") {
      document.documentElement.removeAttribute("data-palette");
    } else {
      document.documentElement.setAttribute("data-palette", palette);
    }
  }, [palette]);

  return (
    <OverlayProvider value={contextValue}>
      <OverlayTopSheet />
      {demo.enableDemoMode && demo.isPanelOpen && <DemoPanel />}
      {demo.enableDemoMode && demo.isPlaying && <DemoVideo />}
      {setting && <SettingWrapper />} 
      <OverlayBottomSheet />
    </OverlayProvider>
  );
}

function OverlayTopSheet() {
  const { navData, isLoadingDestination } = useOverlayContext();

  return (
    <div className="absolute top-0 left-0 right-0 h-fit text-(--text-white) z-10">
      {!(navData.destination || isLoadingDestination) && (
        <div className="p-4">
          <DestinationSearch />
        </div>
      )}
      {(navData.destination || isLoadingDestination) && (
        <>
          <NavigationCard />
        </>
      )}
    </div>
  );
}

function OverlayBottomSheet() {
  const { navData, debug, isLoadingDestination } = useOverlayContext();
  return (
    <div className="absolute bottom-0 left-0 right-0 h-fit flex flex-col justify-between font-sans antialiased text-(--text-white)">
      {navData.destination && debug && (
        <div className="relative mx-auto max-w-sm w-full pointer-events-auto mb-2 p-4 gap-2 flex flex-col">
          <Debug />
        </div>
      )}
      {navData.destination && !isLoadingDestination && (
        <div className="pb-4 m-auto">
          <CaptureLoopNavigation />
        </div>
      )}
      {navData.destination && <RouteSummary />}
    </div>
  );
}
