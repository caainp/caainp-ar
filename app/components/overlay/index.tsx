"use client";

import React, { useCallback, useEffect, useState } from "react";
import NavigationCard from "./navigation/NavigationCard";
import DestinationSearch from "./destination/DestinationSearch";
import Debug from "./debug/Debug";
import { NavData } from "./types";
import { calculateDestination } from "@/app/lib/action";
import { OverlayProvider, useOverlayContext } from "./OverlayContext";
import SettingWrapper from "./setting/SettingWrapper";
import RouteSummary from "./route/RouteSummary";

const dataUrlToFile = (dataUrl: string, filename: string) => {
  const [header, data] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const binary = atob(data);
  const len = binary.length;
  const array = new Uint8Array(len);

  for (let i = 0; i < len; i += 1) {
    array[i] = binary.charCodeAt(i);
  }

  return new File([array], filename, { type: mime });
};

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
  destination: null,
};

export default function Overlay() {
  const [debug, setDebug] = useState(false);
  const [setting, setSetting] = useState(false);
  const [navData, setNavData] = useState<NavData>(initialNavData);
  const [recentDestinations, setRecentDestinations] = useState<string[]>([]);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  const [palette, setPalette] = useState<string>("soft");

  const handleSelectDestination = async (destination: string) => {
    // 초기화
    setNavData(initialNavData);

    setIsLoadingDestination(true);

    // 이미 최근 검색에 있는 목적지라면 제거 하고 최근 검색 목록의 맨 앞에 추가
    setRecentDestinations((prev) => {
      if (prev.includes(destination)) {
        return [destination, ...prev.filter((d) => d !== destination)];
      }
      return [destination, ...prev];
    });

    try {
      const formData = new FormData();
      formData.append("destination", destination);
      const newNavData = await calculateDestination(formData);
      setNavData(newNavData);
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

  const handleDebugCapture = useCallback(
    async (captureImage: string | Blob) => {
      if (!captureImage) {
        return;
      }

      // setIsLoadingDestination(true);
      const destinationLabel = navData.destination ?? "DESTINATION";

      try {
        const formData = new FormData();
        formData.append("destination", destinationLabel);

        let captureFile: File;
        const filename = `ar-capture-${Date.now()}.jpg`;

        if (captureImage instanceof Blob) {
          captureFile = new File([captureImage], filename, {
            type: "image/jpeg",
          });
        } else {
          captureFile = dataUrlToFile(captureImage, filename);
        }

        formData.append("captureImage", captureFile);

        const newNavData = await calculateDestination(formData);
        setNavData(newNavData);
      } catch (error) {
        console.error("Debug Capture Error:", error);
      } finally {
        // setIsLoadingDestination(false);
      }
    },
    [navData.destination]
  );

  const handleDebugUpdateNav = useCallback(async () => {
    const destinationLabel = navData.destination ?? "DESTINATION";

    try {
      const formData = new FormData();
      formData.append("destination", destinationLabel);
      const newNavData = await calculateDestination(formData);
      setNavData(newNavData);
    } catch (error) {
      console.error(error);
    }
  }, [navData.destination]);

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
        handleDebugCapture,
        setting,
        setSetting,
        debug,
        setDebug,
        handleDebugUpdateNav,
        palette,
        setPalette,
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
      {(navData.destination || isLoadingDestination) && <NavigationCard />}
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
