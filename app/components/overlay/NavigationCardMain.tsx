import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { TbStairsUp } from "react-icons/tb";
import { TbStairsDown } from "react-icons/tb";
import { DirectionType, NavData } from "./types";
import { MapPin, X } from "./Icons";
import NavigationCardInstructionText from "./NavigationCardInstructionText";

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

export default function NavigationCardMain({
  navData,
  handleCancelDestination,
}: {
  navData: NavData;
  handleCancelDestination: () => void;
}) {
  return (
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
  );
}
