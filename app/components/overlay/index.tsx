"use client";

import React, { useCallback, useState } from "react";
import NavigationCard from "./NavigationCard";
import DestinationSearch from "./DestinationSearch";
import Debug from "./debug/Debug";
import { NavData } from "./types";
import { calculateDestination } from "@/app/lib/action";
import { OverlayProvider } from "./OverlayContext";
import SettingWrapper from "./setting/SettingWrapper";

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
  const [debug, setDebug] = useState(true);
  const [setting, setSetting] = useState(false);
  const [navData, setNavData] = useState<NavData>(initialNavData);
  const [recentDestinations, setRecentDestinations] = useState<string[]>([]);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);

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
    async (captureImage: string) => {
      if (!captureImage) {
        return;
      }

      // setIsLoadingDestination(true);
      const destinationLabel = navData.destination ?? "AR 캡처 기반 목적지";

      try {
        const formData = new FormData();
        formData.append("destination", destinationLabel);
        const captureFile = dataUrlToFile(
          captureImage,
          `ar-capture-${Date.now()}.png`
        );
        formData.append("captureImage", captureFile);

        const newNavData = await calculateDestination(formData);
        setNavData(newNavData);
      } catch (error) {
        console.error("캡처 기반 경로 계산 실패:", error);
      } finally {
        // setIsLoadingDestination(false);
      }
    },
    [navData.destination]
  );

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
      }}
    >
      <div className="fixed inset-0 flex flex-col justify-between p-4 font-sans antialiased text-white">
        <DestinationSearch />
        {/* AR Viewport */}
        <div className="flex-1 flex items-center justify-center opacity-30" />

        {/* Debug */}
        {navData.destination && (
          <div className="relative mx-auto max-w-sm w-full pointer-events-auto mb-2 gap-2 flex flex-col">
            <button
              onClick={() => setDebug(!debug)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-2xl shadow-zinc-900"
            >
              {debug ? "Debug Off" : "Debug On"}
            </button>
            {navData.destination && debug && <Debug />}
          </div>
        )}
        {/* 목적지가 없으면 검색 UI, 있으면 네비게이션 카드 표시 */}
        {(isLoadingDestination || navData.destination) && <NavigationCard />}
        {setting && <SettingWrapper />}
      </div>
    </OverlayProvider>
  );
}
