import { CheckCircle, Circle, Flag } from "./Icons";

interface RouteStepProps {
  step: string;
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLast: boolean;
}

export default function RouteStep({
  step,
  index,
  isCompleted,
  isCurrent,
  isLast,
}: RouteStepProps) {
  return (
    <div
      key={index}
      data-step-index={index}
      className={`step-item flex items-center rounded-lg transition-all duration-200 ${
        isCurrent
          ? "bg-zinc-800 p-2.5 gap-3"
          : isCompleted
          ? "opacity-50 py-1.5 px-2 gap-2"
          : "opacity-30 py-1.5 px-2 gap-2"
      }`}
    >
      <div
        className={`shrink-0 rounded-full flex items-center justify-center transition-all duration-200 ${
          isCurrent ? "w-5 h-5" : "w-4 h-4"
        } ${
          isCompleted
            ? "bg-zinc-500 text-zinc-900"
            : isCurrent
            ? "bg-zinc-600 text-zinc-200"
            : isLast
            ? "bg-zinc-700 text-zinc-400"
            : "bg-zinc-800 text-zinc-500"
        }`}
      >
        {isCompleted ? (
          <CheckCircle size={isCurrent ? 12 : 10} />
        ) : isLast ? (
          <Flag size={isCurrent ? 10 : 8} />
        ) : (
          <Circle size={isCurrent ? 8 : 6} />
        )}
      </div>

      {/* 단계 텍스트 */}
      <span
        className={`font-medium transition-all duration-200 ${
          isCurrent
            ? "text-sm text-zinc-100"
            : isCompleted
            ? "text-xs text-zinc-500 line-through"
            : "text-xs text-zinc-500"
        }`}
      >
        {step}
      </span>

      {isCurrent && (
        <span className="ml-auto text-xs font-medium text-zinc-400 bg-zinc-700 px-2 py-0.5 rounded">
          현재
        </span>
      )}
    </div>
  );
}
