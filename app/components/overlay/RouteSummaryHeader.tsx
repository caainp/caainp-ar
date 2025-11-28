import { memo, RefObject } from "react";
import { Dot, ChevronDown } from "lucide-react";

interface RouteSummaryHeaderProps {
  currentStep: number;
  totalSteps: number;
  currentStepText: string;
  isSpread: boolean;
  collapsedInfoRef: RefObject<HTMLDivElement | null>;
}

function RouteSummaryHeader({
  currentStep,
  totalSteps,
  currentStepText,
  isSpread,
  collapsedInfoRef,
}: RouteSummaryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          경로
        </span>
        <span className="text-xs text-zinc-600">
          {currentStep} / {totalSteps}
        </span>
        <div
          ref={collapsedInfoRef}
          className="collapsed-info flex items-center gap-1"
        >
          <span>
            <Dot size={10} className="text-zinc-600" />
          </span>
          <span className="text-xs font-medium text-zinc-300">
            {currentStepText}
          </span>
        </div>
      </div>
      <ChevronDown
        size={16}
        className={`text-zinc-500 transition-transform ${
          isSpread ? "rotate-180" : ""
        }`}
      />
    </div>
  );
}

export default memo(RouteSummaryHeader);

