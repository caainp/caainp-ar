import { X } from "lucide-react";
import { useOverlayContext } from "../OverlayContext";

export default function Setting() {
  const { debug, setDebug, setSetting } = useOverlayContext();

  return (
    <div className="w-full max-w-sm mx-auto pointer-events-auto bg-zinc-900 rounded-2xl
     overflow-hidden shadow-2xl shadow-zinc-900">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">설정</h2>
            <p className="text-sm text-zinc-400">디버그 관련 옵션을 제어합니다.</p>
          </div>
          <button
            type="button"
            onClick={() => setSetting(false)}
            className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
            aria-label="설정 닫기"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-zinc-900/60 px-3 py-2">
          <div>
            <p className="text-base font-medium text-zinc-100">디버그 모드</p>
            <p className="text-xs text-zinc-500">디버그 패널 표시 여부</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={debug}
            aria-label="디버그 모드 전환"
            onClick={() => setDebug((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              debug ? "bg-blue-500" : "bg-zinc-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                debug ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}