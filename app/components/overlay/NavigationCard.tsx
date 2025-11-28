import React, { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";
import { MapPin, X } from "./Icons";
import { DirectionType } from "./types";
import RouteSummary from "./RouteSummary";
import { useOverlayContext } from "./OverlayContext";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { TbStairsDown, TbStairsUp } from "react-icons/tb";
import NavigationCardInstructionText from "./NavigationCardInstructionText";
import NavigationCardLoading from "../loading/NavigationCardLoading";

const renderDirectionIcon = (directionType: DirectionType) => {
  switch (directionType) {
    case "STRAIGHT":
      return <ArrowUp size={24} />;
    case "LEFT":
      return <ArrowLeft size={24} />;
    case "RIGHT":
      return <ArrowRight size={24} />;
    case "TURN_BACK":
      return <ArrowDown size={24} />;
    case "STAIRS_UP":
      return <TbStairsUp size={24} />;
    case "STAIRS_DOWN":
      return <TbStairsDown size={24} />;
    default:
      return null;
  }
};

const getDirectionStyles = () => {
  return {
    container: "bg-zinc-800 ring-1 ring-zinc-700",
    icon: "text-zinc-100",
  };
};

export default function NavigationCard() {
  const { isLoadingDestination, navData, handleCancelDestination } =
    useOverlayContext();
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const wasLoadingRef = useRef(isLoadingDestination);

  useEffect(() => {
    scopeRef.current = createScope({ root: rootRef }).add((self) => {
      if (!self) return;

      // 페이드인
      self.add("fadeInContent", () => {
        animate(".direction-icon", {
          scale: [0, 1.2, 1],
          opacity: [0, 1],
          duration: 500,
          ease: "out(3)",
        });
        animate(".instruction-text", {
          translateY: [10, 0],
          opacity: [0, 1],
          duration: 400,
          delay: 150,
          ease: "out(3)",
        });
      });
    });

    return () => scopeRef.current?.revert();
  }, []);

  useEffect(() => {
    if (!scopeRef.current) return;

    if (wasLoadingRef.current && !isLoadingDestination) {
      scopeRef.current.methods.fadeInContent();
    }

    wasLoadingRef.current = isLoadingDestination;
  }, [isLoadingDestination]);

  return (
    <div
      ref={rootRef}
      className="w-full max-w-sm mx-auto pointer-events-auto bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl shadow-zinc-900"
    >
      {/* 메인 네비게이션 카드 */}
      <div className="p-4">
        {isLoadingDestination ? (
          <NavigationCardLoading />
        ) : (
          <div className="flex items-center gap-4">
            <div
              className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                getDirectionStyles().container
              }`}
            >
              <span className={`direction-icon ${getDirectionStyles().icon}`}>
                {renderDirectionIcon(navData.move_instruction.direction_type)}
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate">
                  <MapPin size={12} />
                  <span className="truncate">{navData.destination}</span>
                </div>
                {handleCancelDestination && (
                  <button
                    onClick={handleCancelDestination}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-300"
                    title="목적지 취소"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <NavigationCardInstructionText
                text_ko={navData.move_instruction.text_ko}
              />
            </div>
          </div>
        )}
      </div>

      {/* 경로 요약 */}
      <RouteSummary />
    </div>
  );
}
