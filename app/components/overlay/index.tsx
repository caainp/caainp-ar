"use client";

import React, { useState } from "react";
import NavigationCard from "./NavigationCard";
import DestinationSearch from "./DestinationSearch";
import { CurrentAction, NavData } from "./types";
import { calculateDestination } from "@/app/lib/action";

export default function Overlay() {
  const [navData, setNavData] = useState<NavData>({
    currentAction: "front",
    distance: 12,
    instruction: "복도 끝까지 직진하세요",
    nextWaypoint: "화장실 (경유)",
    totalSteps: 5,
    currentStepIndex: 2,
    destination: null, // 초기에는 목적지 없음
    activeConstraints: ["엘리베이터 이용", "계단 제외"],
  });

  const [recentDestinations, setRecentDestinations] = useState<string[]>([]);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);

  const handleSelectDestination = async (destination: string) => {
    setIsLoadingDestination(true);
    setNavData((prev) => ({
      ...prev,
      destination,
    }));

    // 이미 최근 검색에 있는 목적지라면 제거 하고 최근 검색 목록의 맨 앞에 추가
    setRecentDestinations((prev) => {
      if (prev.includes(destination)) {
        return [destination, ...prev.filter((d) => d !== destination)];
      }
      return [destination, ...prev];
    });

    try {
      const {
        instruction,
        currentAction,
      }: { instruction: string; currentAction: CurrentAction } =
        await calculateDestination(destination);
      setNavData((prev) => ({
        ...prev,
        instruction,
        currentAction,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDestination(false);
    }
  };

  const handleCancelDestination = () => {
    setNavData((prev) => ({
      ...prev,
      destination: null,
    }));
  };

  const handleRemoveRecentDestination = (destination: string) => {
    setRecentDestinations((prev) => prev.filter((d) => d !== destination));
  };

  const handleRemoveAllRecentDestinations = () => {
    setRecentDestinations([]);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-4 font-sans antialiased text-white">
      {/* AR Viewport */}
      <div className="flex-1 flex items-center justify-center opacity-30 pointer-events-none" />

      {/* 목적지가 없으면 검색 UI, 있으면 네비게이션 카드 표시 */}
      {navData.destination ? (
        <NavigationCard
          isLoadingDestination={isLoadingDestination}
          navData={navData}
          onCancelDestination={handleCancelDestination}
        />
      ) : (
        <DestinationSearch
          onSelectDestination={handleSelectDestination}
          recentDestinations={recentDestinations}
          onRemoveRecentDestination={handleRemoveRecentDestination}
          onRemoveAllRecentDestinations={handleRemoveAllRecentDestinations}
        />
      )}
    </div>
  );
}
