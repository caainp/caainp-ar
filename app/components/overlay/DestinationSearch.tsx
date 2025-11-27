"use client";

import React, { useState } from "react";
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

  return (
    <div className="w-full max-w-sm mx-auto pointer-events-auto bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* 입력 폼 상단 영역 */}
      <div>
        {hasSearchResults ? (
          <div className="max-h-72 overflow-y-auto p-2">
            <div className="space-y-0.5">
              {filteredDestinations.map((destination) => (
                <DestinationSelectButton
                  key={destination}
                  onClick={() => handleSelect(destination)}
                  destination={destination}
                />
              ))}
            </div>
          </div>
        ) : hasNoSearchResults ? (
          <div className="py-12 px-4">
            <p className="text-zinc-500 text-sm text-center">
              검색 결과가 없습니다
            </p>
          </div>
        ) : isFocused ? (
          <div>
            {!hasRecentDestinations ? (
              <div className="py-12 px-4">
                <p className="text-zinc-500 text-sm text-center">
                  목적지를 검색하세요
                </p>
              </div>
            ) : (
              <>
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
                      <DestinationSelectButton
                        key={destination}
                        onClick={() => handleSelect(destination)}
                        destination={destination}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* 검색 입력 필드 */}
      <div className="p-2">
        <DestinationInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsFocused={setIsFocused}
        />
      </div>
    </div>
  );
}
