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
    <div className="flex items-center justify-between min-h-[44px]">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs font-semibold text-(--text-tertiary) uppercase tracking-wider shrink-0">
          경로
        </span>
        <span className="text-xs font-medium text-(--text-tertiary) bg-(--bg-secondary) px-2 py-0.5 rounded-full shrink-0">
          {currentStep} / {totalSteps}
        </span>
        <div
          ref={collapsedInfoRef}
          className="collapsed-info flex items-center gap-1.5 min-w-0 flex-1"
        >
          <span className="shrink-0">
            <Dot size={12} className="text-(--text-disabled)" />
          </span>
          <span className="text-sm font-medium text-(--text-secondary) truncate">
            {currentStepText}
          </span>
        </div>
      </div>
      <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-(--bg-secondary)/50 ml-2">
        <ChevronDown
          size={18}
          className={`text-(--text-tertiary) transition-transform duration-300 ${
            isSpread ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>
  );
}

export default memo(RouteSummaryHeader);

