import { ArrowLeft, Settings } from "lucide-react";
import { NavData } from "./types";

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
          <>
            <div className="h-3 w-10 rounded-full bg-(--bg-tertiary) animate-pulse mb-1" />
            <div className="h-5 w-32 rounded-md bg-(--bg-tertiary) animate-pulse" />
          </>
        ) : (
          navData.destination && (
            <>
              <p className="text-xs text-(--text-tertiary)">목적지</p>
              <p className="text-base text-(--text-primary)">
                {navData.destination}
              </p>
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
