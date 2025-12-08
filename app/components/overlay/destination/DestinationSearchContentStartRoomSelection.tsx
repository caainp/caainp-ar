"use client";

import { useEffect, useState } from "react";
import { Navigation } from "lucide-react";

export default function DestinationSearchContentStartRoomSelection({ 
  onSelectRoom, 
  setIsFocused,
  onRequestSelectDestination,
  cleanUpWithSelectDestination,
  startRoomInputRef
}: { 
  onSelectRoom: (startRoom: string) => void; 
  setIsFocused: (isFocused: boolean) => void;
  onRequestSelectDestination: () => void;
  cleanUpWithSelectDestination: () => void;
  startRoomInputRef: React.RefObject<HTMLInputElement>;
}) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (startRoomInputRef.current) {
      startRoomInputRef.current.focus();
    }
  }, [startRoomInputRef])

  const isValidNumber = (value: string): boolean => {
    const trimmed = value.trim();
    if (trimmed === "") return false;
    const num = Number(trimmed);
    return !isNaN(num) && isFinite(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim() === "") {
      setError("");
    } else if (!isValidNumber(value)) {
      setError("숫자만 입력 가능합니다");
    } else {
      onSelectRoom(value.trim());
      setError("");
    }
  };

  const handleSubmit = () => {
    if (isValidNumber(inputValue)) {
      onSelectRoom(inputValue.trim());
      onRequestSelectDestination();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const canSubmit = isValidNumber(inputValue);

  return (
    <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar">
      <div className="px-2 pt-2 pb-2 space-y-3">
        <div className="fade-in">
          <label className="flex items-center justify-between gap-1 text-(--text-tertiary) text-[11px] font-semibold uppercase tracking-wider mb-2 px-1">
            <span>출발 호실</span>
            {error && (
                <p className="text-red-400 text-xs px-1 fade-in">{error}</p>
            )}
          </label>
          <div className="relative">
            <input
              type="text"
              ref={startRoomInputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                cleanUpWithSelectDestination();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="호실 번호 입력"
              className="w-full bg-(--bg-secondary)/50 hover:bg-(--bg-secondary) focus:bg-(--bg-card) rounded-xl py-3 px-4
                text-(--text-primary) text-[15px] placeholder-(--text-muted) transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-(--ring-primary)/50 ring-1 ring-transparent focus:shadow-lg"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          onMouseDown={(e) => e.preventDefault()}
          disabled={!canSubmit}
          className={`w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl transition-all text-center cursor-pointer group fade-in
            ${canSubmit 
              ? "bg-(--action-primary) hover:bg-(--action-primary-hover) active:scale-[0.98] text-white" 
              : "bg-(--bg-secondary)/50 text-(--text-muted) cursor-not-allowed"
            }`}
        >
          <Navigation size={18} className={canSubmit ? "text-white" : "text-(--text-muted)"} />
          <span className="text-[15px] font-medium">
            길안내 시작
          </span>
        </button>
      </div>
    </div>
  );
}