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
    container: "bg-(--bg-primary) ring-1 ring-(--ring-primary)",
    icon: "text-(--text-primary)",
  };
};

export default function NavigationCardMain({
  navData,
}: {
  navData: NavData;
  handleCancelDestination: () => void;
}) {
  return (
    <div className="flex gap-6 p-4">
      <div
        className={`shrink-0 size-16 rounded-2xl flex items-center justify-center ${
          getDirectionStyles().container
        }`}
      >
        <span className={`direction-icon ${getDirectionStyles().icon}`}>
          {renderDirectionIcon(navData.move_instruction.direction_type)}
        </span>
      </div>
      <div className="flex flex-col justify-center min-w-0 gap-2">
        <p className="text-xs text-(--text-tertiary)">다음 안내</p>
        <NavigationCardInstructionText
          text_ko={navData.move_instruction.text_ko}
        />
      </div>
    </div>
  );
}
