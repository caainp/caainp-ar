"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import { animate, createScope, stagger } from "animejs"; // animejs import
import DestinationInput from "./DestinationInput";
import { useOverlayContext } from "../OverlayContext";
import DestinationSearchContent from "./DestinationSearchContent";
import SettingButton from "../setting/SettingButton";
import DestinationSearchContentStartRoomSelection from "./DestinationSearchContentStartRoomSelection";

export type ViewState = "instruction" | "hidden" | "querying";

export default function DestinationSearch() {
  const {
    handleSelectDestination,
    recentDestinations,
    handleRemoveAllRecentDestinations,
  } = useOverlayContext();

  const [startRoom, setStartRoom] = useState("");
  const [destination, setDestination] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openStartRoomSelection, setOpenStartRoomSelection] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const startRoomInputRef = useRef<HTMLInputElement>(null);

  // 애니메이션을 위한 Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  const handleSelect = (destination: string) => {
    setDestination(destination);
    setOpenStartRoomSelection(true);
    startRoomInputRef.current?.focus();
  };

  const handleSelectRoom = (startRoom: string) => {
    setStartRoom(startRoom);
  };

  const requestSelectDestination = () => {
    console.log("requestSelectDestination", destination, startRoom);
    handleSelectDestination(destination, startRoom);
    cleanUpWithSelectDestination();
  };

  const cleanUpWithSelectDestination = () => {
    setSearchQuery("");
    setDestination("");
    setStartRoom("");
    setIsFocused(false);
    setOpenStartRoomSelection(false);
    destinationInputRef.current?.blur();
  };

  const hasSearchQuery = searchQuery.length > 0;

  // 현재 보여줄 상태 결정
  const getViewState = (): ViewState => {
    if (!isFocused) {
      return "hidden";
    }

    if (!hasSearchQuery) {
      return "instruction";
    }

    return "querying";
  };

  const viewState = getViewState();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    scopeRef.current = createScope({ root: rootRef }).add(() => {
      const targetHeight =
        viewState === "hidden" ? 0 : listRef.current?.scrollHeight || 0;
        
      animate(container, {
        height: targetHeight,
        duration: 250,
        easing: "easeOutQuad",
      });

      if (viewState === "instruction") {
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
      } else if (viewState === "querying") {
        animate(container, {
          opacity: 1,
          duration: 0,
          easing: "easeOutQuad",
        });
        animate(".anim-item", {
          opacity: 1,
          translateY: 0,
          filter: "blur(0px)",
          duration: 0,
          easing: "easeOutQuad",
        });        
      }
      
      return () => scopeRef.current?.revert();
    });
  }, [
    viewState,
    recentDestinations,
    openStartRoomSelection,
    isFocused,
  ]);

  return (
    <div
      ref={rootRef}
      className="w-full max-w-sm mx-auto pointer-events-auto bg-(--bg-card)/80 backdrop-blur-xl rounded-4xl overflow-hidden shadow-2xl 
      ring-1 ring-white/10 border border-white/10"
    >
      {/* 검색 입력 필드 */}
      <div className="p-2 relative z-10 bg-(--bg-card) flex items-center gap-2">
        <DestinationInput
          inputRef={destinationInputRef as React.RefObject<HTMLInputElement>}
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
          {!openStartRoomSelection && <DestinationSearchContent
            viewState={viewState}
            searchQuery={searchQuery}
            recentDestinations={recentDestinations}
            onSelectDestination={handleSelect}
            onRemoveAllRecentDestinations={handleRemoveAllRecentDestinations}
          />}
          {openStartRoomSelection && (
            <DestinationSearchContentStartRoomSelection
              onSelectRoom={handleSelectRoom}
              setIsFocused={setIsFocused}
              onRequestSelectDestination={requestSelectDestination}
              cleanUpWithSelectDestination={cleanUpWithSelectDestination}
              startRoomInputRef={startRoomInputRef as React.RefObject<HTMLInputElement>}
            />
          )}
        </div>
      </div>
    </div>
  );
}
