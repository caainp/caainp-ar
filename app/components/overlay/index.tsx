"use client";

import React, { useEffect, useState } from "react";
import NavigationCard from "./navigation/NavigationCard";
import DestinationSearch from "./destination/DestinationSearch";
import Debug from "./debug/Debug";
import { NavData } from "./types";
import { calculateDestination } from "@/app/lib/action";
import { OverlayProvider, useOverlayContext } from "./OverlayContext";
import SettingWrapper from "./setting/SettingWrapper";
import RouteSummary from "./route/RouteSummary";
import { fetchNavigationStep } from "@/app/lib/api";
import { useCameraCapture } from "@/app/hooks/useCameraCapture";
import CaptureLoopNavigation from "./CaptureLoopNavigation";

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

export default function Overlay() {
  const [debug, setDebug] = useState(false);
  const [setting, setSetting] = useState(false);
  const [navData, setNavData] = useState<NavData>(initialNavData);
  const [isCaptureLoopEnabled, setIsCaptureLoopEnabled] = useState(true);
  const [recentDestinations, setRecentDestinations] = useState<string[]>([]);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  const [palette, setPalette] = useState<string>("soft");
  const { captureScreen } = useCameraCapture();

  const createBlackImage = (): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "black-placeholder.jpg", { type: "image/jpeg" });
            resolve(file);
          } else {
            throw new Error("Failed to create black image");
          }
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const handleSelectDestination = async (destination: string) => {
    // 초기화
    setNavData(initialNavData);
    setRecentDestinations((prev) => [destination, ...prev.filter((d) => d !== destination)]);
    setIsLoadingDestination(true);

    try {
      const captureResult = await captureScreen({ format: "blob", download: false });
      let imageFile: File | null = null;

      if (captureResult instanceof Blob) {
        imageFile = new File([captureResult], "capture.jpg", { type: "image/jpeg" });
      }

      // =========== DEBUG ============
      // const response = await fetchNavigationStep(destination, imageFile as File);
      // console.log(response);
      // =========== DEBUG ============

      if (!imageFile) {
        imageFile = await createBlackImage();
      }

      const stepResponse = await fetchNavigationStep(destination, imageFile);
      setNavData({
        ...stepResponse,
        destination,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDestination(false);
    }
  };

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

  

  useEffect(() => {
    if (palette === "default") {
      document.documentElement.removeAttribute("data-palette");
    } else {
      document.documentElement.setAttribute("data-palette", palette);
    }
  }, [palette]);

  return (
    <OverlayProvider
      value={{
        navData,
        setNavData,
        isLoadingDestination,
        setIsLoadingDestination,
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
      }}
    >
      <OverlayTopSheet />
      {setting && <SettingWrapper />}
      <OverlayBottomSheet />
    </OverlayProvider>
  );
}

function OverlayTopSheet() {
  const { navData, isLoadingDestination } = useOverlayContext();

  return (
    <div className="absolute top-0 left-0 right-0 h-fit text-(--text-white)">
      {!(navData.destination || isLoadingDestination) && (
        <div className="p-4">
          <DestinationSearch />
        </div>
      )}
      {(navData.destination || isLoadingDestination) && (
        <>
          <NavigationCard />
          {navData.destination && !isLoadingDestination && (
            <div className="pt-2 pl-2">
              <CaptureLoopNavigation />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OverlayBottomSheet() {
  const { navData, debug } = useOverlayContext();
  return (
    <div className="absolute bottom-0 left-0 right-0 h-fit flex flex-col justify-between font-sans antialiased text-(--text-white)">
      {/* Debug */}
      {navData.destination && debug && (
        <div className="relative mx-auto max-w-sm w-full pointer-events-auto mb-2 p-4 gap-2 flex flex-col">
          <Debug />
        </div>
      )}
      {navData.destination && <RouteSummary />}
    </div>
  );
}
