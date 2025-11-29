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
    <div ref={rootRef} className="flex gap-5 p-5 items-center">
      <div className="shrink-0 size-14 rounded-2xl bg-(--bg-primary) ring-1 ring-(--ring-primary) flex items-center justify-center shadow-md">
        <div className="relative w-6 h-6">
          <div className="loading-spinner absolute inset-0 rounded-full border-2 border-(--bg-tertiary) border-t-(--scrollbar-thumb)" />
          <div className="absolute inset-1 rounded-full bg-(--bg-primary)" />
        </div>
      </div>
      <div className="flex flex-col justify-center min-w-0 gap-0.5">
        <div className="h-2.5 w-16 rounded-full bg-(--bg-tertiary) loading-pulse mb-1" />
        <div className="h-5 w-48 rounded-md bg-(--bg-tertiary) loading-pulse" />
      </div>
    </div>
  );
}
