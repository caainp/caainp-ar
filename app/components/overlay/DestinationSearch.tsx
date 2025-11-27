"use client";

import React, { useState } from "react";
import { Search, MapPin } from "./Icons";
import DestinationSelectButton from "./DestinationSelectButton";
import DestinationInput from "./DestinationInput";

interface DestinationSearchProps {
  onSelectDestination: (destination: string) => void;
  recentDestinations: string[];
  onRemoveRecentDestination: (destination: string) => void;
  onRemoveAllRecentDestinations: () => void;
}

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

export default function DestinationSearch({
  onSelectDestination,
  recentDestinations,
  onRemoveRecentDestination,
  onRemoveAllRecentDestinations,
}: DestinationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredDestinations = SAMPLE_DESTINATIONS.filter((dest) =>
    dest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (destination: string) => {
    onSelectDestination(destination);
    setSearchQuery("");
    setIsFocused(false);
  };

  const hasSearchResults =
    searchQuery.length > 0 && filteredDestinations.length > 0;

  const hasNoSearchResults =
    searchQuery.length > 0 && filteredDestinations.length === 0;

  const hasRecentDestinations = recentDestinations.length > 0;

  return (
    <div className="w-full max-w-sm mx-auto mb-4 pointer-events-auto">
      <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-3 border border-white/10 shadow-2xl">
        {/* 입력 폼 상단 영역 */}
        <div className="h-full">
          {hasSearchResults ? (
            <div className="max-h-64 overflow-y-auto space-y-2 mb-3">
              {filteredDestinations.map((destination) => (
                <DestinationSelectButton
                  key={destination}
                  onClick={() => handleSelect(destination)}
                  destination={destination}
                />
              ))}
            </div>
          ) : hasNoSearchResults ? (
            <div className="text-center py-8 text-gray-400">
              <p>검색 결과가 없습니다</p>
            </div>
          ) : isFocused ? (
            <div className="text-center text-gray-400">
              {!hasRecentDestinations ? (
                <p className="py-4">목적지를 검색하세요</p>
              ) : (
                <div className="py-3 px-1 flex items-center justify-between border-b border-white/5 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-linear-to-b from-blue-400 to-blue-600 rounded-full" />
                    <p className="text-sm font-medium tracking-wide text-white/80 uppercase">
                      최근 검색
                    </p>
                  </div>
                  <button
                    onClick={onRemoveAllRecentDestinations}
                    onMouseDown={(event) => event.preventDefault()}
                    className="text-xs font-medium text-white/40 hover:text-white/70 
                    px-2.5 py-1 rounded-full hover:bg-white/5 transition-all duration-200"
                  >
                    모두 삭제
                  </button>
                </div>
              )}
              <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
                {recentDestinations.map((destination: string) => (
                  <DestinationSelectButton
                    key={destination}
                    onClick={() => handleSelect(destination)}
                    destination={destination}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* 검색 입력 필드 */}
        <DestinationInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsFocused={setIsFocused}
        />
      </div>
    </div>
  );
}
