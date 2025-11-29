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
      className="step-item flex gap-3 transition-all duration-200"
    >
      {/* 왼쪽: 인디케이터 + 연결선 */}
      <div className="flex flex-col items-center">
        {/* 스텝 인디케이터 */}
        <div
          className={`shrink-0 rounded-full flex items-center justify-center transition-all duration-300
            ${isCurrent ? "w-5 h-5 ring-4 ring-(--action-primary)/20" : "w-5 h-5"}
            ${
              isCompleted
                ? "bg-(--action-success) text-(--text-white)"
                : isCurrent
                ? "bg-(--action-primary) text-(--text-white) shadow-md shadow-(--action-primary)/30"
                : isLast
                ? "bg-(--bg-tertiary) text-(--text-tertiary)"
                : "bg-(--bg-secondary) text-(--text-muted) ring-1 ring-(--border-primary)"
            }`}
        >
          {isCompleted ? (
            <CheckCircle size={12} />
          ) : isLast ? (
            <Flag size={isCurrent ? 14 : 10} />
          ) : isCurrent ? (
            <div className="w-2.5 h-2.5 bg-white rounded-full" />
          ) : (
            <Circle size={6} />
          )}
        </div>

        {/* 연결선 (마지막 아이템 제외) */}
        {!isLast && (
          <div
            className={`w-0.5 flex-1 min-h-4 rounded-full transition-colors duration-300
              ${isCompleted ? "bg-(--action-success)" : "bg-(--border-primary)"}`}
          />
        )}
      </div>

      {/* 오른쪽: 콘텐츠 */}
      <div
        className={`flex-1 pb-4 transition-all duration-200
          ${isLast ? "pb-0" : ""}`}
      >
        {/* 현재 단계 배지 */}
        {isCurrent && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full text-(--action-primary) bg-(--action-primary)/10">
            현재 위치
          </span>
        )}

        {/* 단계 텍스트 */}
        <p
          className={`font-medium transition-all duration-200 leading-snug m-0
            ${
              isCurrent
                ? "text-base text-(--text-primary)"
                : isCompleted
                ? "text-sm text-(--text-muted) line-through decoration-1"
                : "text-sm text-(--text-tertiary)"
            }`}
        >
          {step}
        </p>

        {/* 완료 표시 */}
        {isCompleted && (
          <span className="text-[10px] text-(--action-success) mt-0.5 block">
            완료
          </span>
        )}
      </div>
    </div>
  );
}
