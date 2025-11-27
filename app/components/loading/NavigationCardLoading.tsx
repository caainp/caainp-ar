import React, { useEffect } from "react";
import { animate } from "animejs";

export default function NavigationCardLoading() {
  useEffect(() => {
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
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* 아이콘 영역 - 플랫한 원형 인디케이터 */}
      <div className="shrink-0 w-14 h-14 rounded-xl bg-zinc-800 ring-1 ring-zinc-700 flex items-center justify-center">
        <div className="relative w-7 h-7">
          <div className="loading-spinner absolute inset-0 rounded-full border-2 border-zinc-700 border-t-zinc-300" />
          <div className="absolute inset-1 rounded-full bg-zinc-800" />
        </div>
      </div>

      {/* 텍스트/스켈레톤 영역 */}
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="h-3 w-16 rounded-full bg-zinc-700 loading-pulse" />
          <div className="h-3 w-10 rounded-full bg-zinc-800" />
        </div>
        <div className="h-4 w-3/4 rounded-md bg-zinc-700 loading-pulse" />
        <div className="h-3 w-1/2 rounded-md bg-zinc-700 loading-pulse" />
      </div>
    </div>
  );
}
