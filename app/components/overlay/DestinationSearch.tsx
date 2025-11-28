"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { animate, createScope, stagger } from "animejs"; // animejs import
import DestinationSelectButton from "./DestinationSelectButton";
import DestinationInput from "./DestinationInput";
import { useOverlayContext } from "./OverlayContext";

// TODO: 임시 목적지 목록
const SAMPLE_DESTINATIONS = [
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

  // 렌더링 헬퍼 함수
  const renderContent = () => {
    switch (viewState) {
      case "results":
        return (
          <div className="max-h-72 overflow-y-auto p-2">
            <div className="space-y-0.5">
              {filteredDestinations.map((destination) => (
                <div key={destination} className="anim-item">
                  <DestinationSelectButton
                    onClick={() => handleSelect(destination)}
                    destination={destination}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "empty":
        return (
          <div className="py-12 px-4 fade-in">
            <p className="text-zinc-500 text-sm text-center">
              검색 결과가 없습니다
            </p>
          </div>
        );
      case "recent":
        return (
          <div>
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                최근 검색
              </span>
              <button
                onClick={handleRemoveAllRecentDestinations}
                onMouseDown={(event) => event.preventDefault()}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                모두 삭제
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              <div className="space-y-0.5">
                {recentDestinations.map((destination: string) => (
                  <div key={destination} className="anim-item opacity-0">
                    <DestinationSelectButton
                      onClick={() => handleSelect(destination)}
                      destination={destination}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "instruction":
        return (
          <div className="py-12 px-4 fade-in">
            <p className="text-zinc-500 text-sm text-center">
              목적지를 검색하세요
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={rootRef}
      className="w-full max-w-sm mx-auto pointer-events-auto bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl shadow-zinc-900"
    >
      {/* 검색 입력 필드 */}
      <div className="p-2 relative z-10 bg-zinc-900">
        <DestinationInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsFocused={setIsFocused}
        />
      </div>

      {/* 동적 높이 컨테이너 */}
      <div
        ref={containerRef}
        className="overflow-hidden bg-zinc-900"
        style={{ height: 0 }}
      >
        <div ref={listRef}>{renderContent()}</div>
      </div>
    </div>
  );
}
