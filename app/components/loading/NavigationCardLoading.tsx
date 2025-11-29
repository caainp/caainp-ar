import React, { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";

export default function NavigationCardLoading() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    scopeRef.current = createScope({ root: rootRef }).add(() => {
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

    return () => scopeRef.current?.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex gap-6 p-4">
      <div className="shrink-0 size-16 rounded-2xl bg-(--bg-primary) ring-1 ring-(--ring-primary) flex items-center justify-center">
        <div className="relative w-7 h-7">
          <div className="loading-spinner absolute inset-0 rounded-full border-2 border-(--bg-tertiary) border-t-(--scrollbar-thumb)" />
          <div className="absolute inset-1 rounded-full bg-(--bg-primary)" />
        </div>
      </div>
      <div className="flex flex-col justify-center min-w-0 gap-2">
        <div className="h-3.5 w-48 rounded-full bg-(--bg-tertiary) loading-pulse" />
        <div className="h-4 w-1/2 rounded-md bg-(--bg-tertiary) loading-pulse" />
      </div>
    </div>
  );
}
