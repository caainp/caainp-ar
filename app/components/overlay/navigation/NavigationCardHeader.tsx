import { ArrowLeft, Settings } from "lucide-react";
import { NavData } from "../types";
import NavigationCardHeaderLoading from "../../loading/NavigationCardHeaderLoading";
import { useRef, useState, useEffect } from "react";

function DestinationText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && measureRef.current) {
        setIsOverflowing(measureRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <div ref={containerRef} className="relative max-w-[200px]">
      <p
        className={`${isOverflowing ? "text-sm leading-tight" : "text-base"} text-(--text-primary) wrap-break-word`}
        style={
          isOverflowing
            ? {
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }
        }
      >
        {text}
      </p>
      <p
        ref={measureRef}
        className="pointer-events-none absolute inset-0 invisible whitespace-nowrap"
        aria-hidden
      >
        {text}
      </p>
    </div>
  );
}

export default function NavigationCardHeader({
  handleCancelDestination,
  setSetting,
  navData,
  isLoading,
}: {
  handleCancelDestination: () => void;
  setSetting: (setting: boolean) => void;
  navData: NavData;
  isLoading: boolean;
}) {
  return (
    <div className="flex justify-between items-center mt-2 px-4">
      <button
        className="text-sm text-(--text-tertiary) hover:text-(--text-primary) transition-colors p-2 rounded-full 
          bg-(--bg-tertiary) hover:bg-(--bg-hover)"
        onClick={handleCancelDestination}
      >
        <ArrowLeft size={24} />
      </button>

      <div className="flex flex-col items-center gap-0.5">
        {isLoading ? (
          <NavigationCardHeaderLoading />
        ) : (
          navData.destination && (
            <>
              <p className="text-xs text-(--text-tertiary)">쿼리</p>
              <DestinationText text={navData.destination} />
            </>
          )
        )}
      </div>

      <button
        className="text-sm text-(--text-tertiary) hover:text-(--text-primary) transition-colors p-2 rounded-full 
          bg-(--bg-tertiary) hover:bg-(--bg-hover)"
        onClick={() => setSetting(true)}
      >
        <Settings size={24} />
      </button>
    </div>
  );
}
