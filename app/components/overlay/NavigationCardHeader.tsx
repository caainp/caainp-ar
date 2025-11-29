import { ArrowLeft, Settings } from "lucide-react";
import { NavData } from "./types";

export default function NavigationCardHeader({
  handleCancelDestination,
  setSetting,
  navData,
}: {
  handleCancelDestination: () => void;
  setSetting: (setting: boolean) => void;
  navData: NavData;
}) {
  return (
    <div className="flex justify-between items-center mt-4 mb-4 px-4">
      <button
        className="text-sm text-(--text-tertiary) hover:text-(--text-primary) transition-colors p-2 rounded-full 
          bg-(--bg-tertiary) hover:bg-(--bg-hover)"
        onClick={handleCancelDestination}
      >
        <ArrowLeft size={24} />
      </button>

      <div className="flex flex-col items-center gap-1">
        {navData.destination && (
          <>
            <p className="text-xs text-(--text-tertiary)">목적지</p>
            <p className="text-base text-(--text-primary)">
              {navData.destination}
            </p>
          </>
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
