import { ArrowLeft, Settings } from "lucide-react";
import { NavData } from "../types";
import NavigationCardHeaderLoading from "../../loading/NavigationCardHeaderLoading";

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
