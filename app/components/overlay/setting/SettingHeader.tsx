import { X, ChevronLeft } from "lucide-react";

interface SettingHeaderProps {
  showVersion: boolean;
  onBack: () => void;
  onClose: () => void;
}

export default function SettingHeader({ showVersion, onBack, onClose }: SettingHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      {showVersion ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
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
        onClick={onClose}
        className="rounded-full p-1 text-(--text-tertiary) transition-colors hover:bg-(--border-subtle) hover:text-(--text-white) cursor-pointer"
        aria-label="설정 닫기"
      >
        <X size={24} />
      </button>
    </div>
  );
}
