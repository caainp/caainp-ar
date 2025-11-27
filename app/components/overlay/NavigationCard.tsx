import React, { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";
import {
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  MapPinLarge,
  MapPin,
  X,
} from "./Icons";
import { NavData } from "./types";

interface NavigationCardProps {
  isLoadingDestination: boolean;
  navData: NavData;
  onCancelDestination?: () => void;
}

export default function NavigationCard({
  isLoadingDestination,
  navData,
  onCancelDestination,
}: NavigationCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const wasLoadingRef = useRef(isLoadingDestination);

  useEffect(() => {
    scopeRef.current = createScope({ root: rootRef }).add((self) => {
      if (!self) return;

      // 로딩
      self.add("startLoadingSpinner", () => {
        animate(".loading-spinner", {
          rotate: 360,
          duration: 1000,
          loop: true,
          ease: "linear",
        });

        animate(".loading-pulse", {
          opacity: [0.3, 1, 0.3],
          scale: [1],
          duration: 1000,
          loop: true,
          ease: "inOut(2)",
        });
      });

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

    if (isLoadingDestination) {
      scopeRef.current.methods.startLoadingSpinner();
    } else if (wasLoadingRef.current && !isLoadingDestination) {
      scopeRef.current.methods.fadeInContent();
    }

    wasLoadingRef.current = isLoadingDestination;
  }, [isLoadingDestination]);

  const renderDirectionIcon = () => {
    switch (navData.currentAction) {
      case "front":
        return <ArrowUp />;
      case "left":
        return <ArrowLeft />;
      case "right":
        return <ArrowRight />;
      case "back":
        return <MapPinLarge />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={rootRef}
      className="w-full max-w-sm mx-auto mb-6 pointer-events-auto"
    >
      <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-2xl flex items-center gap-4">
        <div className="shrink-0 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-inner shadow-zinc-400/20 overflow-hidden">
          {isLoadingDestination ? (
            <div className="loading-spinner w-8 h-8 border-2 border-white/30 border-t-white/90 rounded-full" />
          ) : (
            <span className="direction-icon text-zinc-200 text-4xl">
              {renderDirectionIcon()}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-baseline gap-2">
            <div className="flex items-center gap-2 mb-2 w-full justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin />
                <span>{navData.destination}</span>
              </div>
              {onCancelDestination && (
                <button
                  onClick={onCancelDestination}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/50 transition-all text-gray-400 hover:text-white"
                  title="목적지 취소"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          {isLoadingDestination ? (
            <div className="loading-pulse h-6 w-3/4 rounded bg-white/20" />
          ) : (
            <p className="instruction-text text-lg font-semibold leading-tight text-white/90">
              {navData.instruction}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
