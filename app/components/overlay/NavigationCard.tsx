import { useOverlayContext } from "./OverlayContext";
import NavigationCardLoading from "../loading/NavigationCardLoading";
import NavigationCardMain from "./NavigationCardMain";
import { useEffect, useRef } from "react";
import { createScope } from "animejs";
import { animate } from "animejs";
import NavigationCardHeader from "./NavigationCardHeader";

export default function NavigationCard() {
  const { isLoadingDestination, navData, handleCancelDestination, setSetting } =
    useOverlayContext();

  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    scopeRef.current = createScope({ root: rootRef }).add((self) => {
      if (!rootRef.current) return;

      animate(rootRef.current, {
        opacity: [0, 1],
        duration: 250,
        easing: "easeOutQuad",
      });
    });

    return () => scopeRef.current?.revert();
  }, []);

  return (
    <div ref={rootRef} className="w-full mx-auto bg-(--bg-card)
     rounded-b-4xl overflow-hidden shadow-2xl ring-1 ring-(--bg-secondary)/70">
      
      {/* 네비게이션 헤더 */}
      <div className="flex flex-col p-2 gap-2">
        {/* 이전 돌아가기, 설정 버튼 */}
        <NavigationCardHeader handleCancelDestination={handleCancelDestination} setSetting={setSetting} navData={navData} />

        {/* 메인 네비게이션 카드 */}
        {isLoadingDestination ? (
          <NavigationCardLoading />
        ) : (
          <NavigationCardMain
            navData={navData}
            handleCancelDestination={handleCancelDestination}
          />
        )}
      </div>
    </div>
  );
}
