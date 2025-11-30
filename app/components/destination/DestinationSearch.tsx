"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { animate, createScope, stagger } from "animejs"; // animejs import
import DestinationInput from "./DestinationInput";
import { useOverlayContext } from "../overlay/OverlayContext";
import DestinationSearchContent from "./DestinationSearchContent";
import SettingButton from "../overlay/setting/SettingButton";

// TODO: 임시 목적지 목록
export const SAMPLE_DESTINATIONS = [
  "401호 강의실",
  "402호 강의실",
  "403호 강의실",
  "404호 강의실",
  "405호 강의실",
  "406호 강의실",
  "407호 강의실",
  "408호 강의실",
  "409호 강의실",
  "410호 강의실",
  "화장실",
  "도서관",
  "학생식당",
  "행정실",
  "교수연구실",
];

export default function DestinationSearch() {
  const {
    handleSelectDestination,
    recentDestinations,
    handleRemoveAllRecentDestinations,
  } = useOverlayContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 애니메이션을 위한 Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const filteredDestinations = SAMPLE_DESTINATIONS.filter((dest) =>
    dest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (destination: string) => {
    handleSelectDestination(destination);
    setSearchQuery("");
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const hasSearchResults =
    searchQuery.length > 0 && filteredDestinations.length > 0;

  const hasNoSearchResults =
    searchQuery.length > 0 && filteredDestinations.length === 0;

  const hasRecentDestinations = recentDestinations.length > 0;

  // 현재 보여줄 상태 결정 (애니메이션 로직 단순화를 위해 변수로 관리)
  const viewState = hasSearchResults
    ? "results"
    : hasNoSearchResults
    ? "empty"
    : isFocused
    ? hasRecentDestinations
      ? "recent"
      : "instruction"
    : "hidden";

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    scopeRef.current = createScope({ root: rootRef }).add((self) => {
      const targetHeight =
        viewState === "hidden" ? 0 : listRef.current?.scrollHeight || 0;

      animate(container, {
        height: targetHeight,
        duration: 250,
        easing: "easeOutQuad",
      });

      if (viewState === "results" || viewState === "recent") {
        animate(container, {
          opacity: [0, 1],
          duration: 250,
          easing: "easeOutQuad",
        });
        animate(".anim-item", {
          opacity: [0, 1],
          translateY: [10, 0],
          filter: ["blur(4px)", "blur(0px)"],
          delay: stagger(30, { start: 50 }),
          duration: 350,
          easing: "easeOutQuad",
        });
      }
    });

    return () => scopeRef.current?.revert();
  }, [
    viewState,
    filteredDestinations,
    recentDestinations,
    searchQuery,
    isFocused,
  ]);

  return (
    <div
      ref={rootRef}
      className="w-full max-w-sm mx-auto pointer-events-auto bg-(--bg-card)/80 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl 
      ring-1 ring-white/10 border border-white/10"
    >
      {/* 검색 입력 필드 */}
      <div className="p-2 relative z-10 bg-(--bg-card) flex items-center gap-2">
        <DestinationInput
          inputRef={inputRef as React.RefObject<HTMLInputElement>}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsFocused={setIsFocused}
        />
        <SettingButton />
      </div>

      {/* 동적 높이 컨테이너 */}
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-(--bg-card)"
        style={{ height: 0 }}
      >
        {/* 상단 약간 그림자 */}
        {/* <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-zinc-900 to-transparent" /> */}
        <div ref={listRef}>
          <DestinationSearchContent
            viewState={viewState}
            filteredDestinations={filteredDestinations}
            recentDestinations={recentDestinations}
            onSelectDestination={handleSelect}
            onRemoveAllRecentDestinations={handleRemoveAllRecentDestinations}
          />
        </div>
      </div>
    </div>
  );
}
