import { X, Palette, Info, ChevronLeft } from "lucide-react";
import { useOverlayContext } from "../OverlayContext";
import { useState } from "react";

const PALETTE_OPTIONS = [
  { value: "default", label: "기본", description: "Zinc 다크 테마" },
  { value: "soft", label: "소프트", description: "부드러운 Stone 테마" },
  { value: "soft-light", label: "소프트 라이트", description: "따뜻한 오프화이트 테마" },
] as const;

const VERSION_INFO = [
  { name: "API Version", version: "v1" },
  { name: "Next.js", version: "16.0.4" },
  { name: "React", version: "19.2.0" },
  { name: "A-Frame", version: "1.7.1" },
  { name: "Anime.js", version: "4.2.2" },
  { name: "Lucide React", version: "0.555.0" },
  { name: "React Icons", version: "5.5.0" },
];

export default function Setting() {
  const { debug, setDebug, setSetting, palette, setPalette } = useOverlayContext();
  const [showVersion, setShowVersion] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto pointer-events-auto bg-(--bg-card) rounded-2xl overflow-hidden shadow-2xl shadow-(--bg-card)">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          {showVersion ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowVersion(false)}
                className="rounded-full p-1 -ml-1 text-(--text-tertiary) transition-colors hover:bg-(--border-subtle) hover:text-(--text-white) cursor-pointer"
                aria-label="뒤로 가기"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h2 className="text-lg font-bold text-(--text-white)">버전 정보</h2>
                <p className="text-sm text-(--text-tertiary)">라이브러리 및 API 버전</p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-(--text-white)">설정</h2>
              <p className="text-sm text-(--text-tertiary)">앱 관련 옵션을 제어합니다.</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSetting(false)}
            className="rounded-full p-1 text-(--text-tertiary) transition-colors hover:bg-(--border-subtle) hover:text-(--text-white) cursor-pointer"
            aria-label="설정 닫기"
          >
            <X size={24} />
          </button>
        </div>

        {showVersion ? (
          /* Version Info View */
          <div className="space-y-2">
            {VERSION_INFO.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 rounded-xl bg-(--bg-card)/60 border border-(--border-subtle)"
              >
                <span className="text-sm font-medium text-(--text-secondary)">{item.name}</span>
                <span className="text-sm font-mono text-(--text-primary)">{item.version}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Main Settings View */
          <div className="space-y-4">
            {/* Theme Settings */}
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
                    <span
                      className={`text-sm font-medium ${
                        palette === option.value ? "text-(--action-primary)" : "text-(--text-primary)"
                      }`}
                    >
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

            {/* Debug Mode Toggle */}
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

            {/* Version Info Button */}
            <button
              type="button"
              onClick={() => setShowVersion(true)}
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-(--border-subtle) bg-(--bg-card)/60 px-3 py-3 transition-colors hover:bg-(--bg-card) hover:border-(--border-light) cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--bg-tertiary) text-(--text-secondary)">
                  <Info size={16} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-(--text-primary)">버전 정보</p>
                  <p className="text-xs text-(--text-muted)">라이브러리 및 API 버전 확인</p>
                </div>
              </div>
              <div className="text-(--text-tertiary)">
                <ChevronLeft size={16} className="rotate-180" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}