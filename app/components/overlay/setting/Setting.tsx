import { X, Palette } from "lucide-react";
import { useOverlayContext } from "../OverlayContext";

const PALETTE_OPTIONS = [
  { value: "default", label: "기본", description: "Zinc 다크 테마" },
  { value: "soft", label: "소프트", description: "부드러운 Stone 테마" },
  { value: "soft-light", label: "소프트 라이트", description: "따뜻한 오프화이트 테마" },
] as const;

export default function Setting() {
  const { debug, setDebug, setSetting, palette, setPalette } = useOverlayContext();

  return (
    <div className="w-full max-w-sm mx-auto pointer-events-auto bg-(--bg-card) rounded-2xl
     overflow-hidden shadow-2xl shadow-(--bg-card)">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-(--text-white)">설정</h2>
            <p className="text-sm text-(--text-tertiary)">앱 관련 옵션을 제어합니다.</p>
          </div>
          <button
            type="button"
            onClick={() => setSetting(false)}
            className="rounded-full p-1 text-(--text-tertiary) transition-colors hover:bg-(--border-subtle) hover:text-(--text-white) cursor-pointer"
            aria-label="설정 닫기"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-(--text-secondary)">
            <Palette size={16} />
            <span className="text-sm font-medium">테마</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PALETTE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPalette(option.value)}
                className={`relative flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2 transition-all cursor-pointer ${
                  palette === option.value
                    ? "border-(--action-primary) bg-(--action-primary)/10"
                    : "border-(--border-subtle) bg-(--bg-card)/60 hover:border-(--border-light)"
                }`}
              >
                <span className={`text-sm font-medium ${
                  palette === option.value ? "text-(--action-primary)" : "text-(--text-primary)"
                }`}>
                  {option.label}
                </span>
                <span className="text-xs text-(--text-muted)">{option.description}</span>
                {palette === option.value && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-(--action-primary)" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-(--border-subtle) bg-(--bg-card)/60 px-3 py-2">
          <div>
            <p className="text-base font-medium text-(--text-primary)">디버그 모드</p>
            <p className="text-xs text-(--text-muted)">디버그 패널 표시 여부</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={debug}
            aria-label="디버그 모드 전환"
            onClick={() => setDebug((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              debug ? "bg-(--action-primary)" : "bg-(--bg-tertiary)"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-(--text-white) transition-transform ${
                debug ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}