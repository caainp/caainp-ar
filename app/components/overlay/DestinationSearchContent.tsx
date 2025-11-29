import { SAMPLE_DESTINATIONS } from "./DestinationSearch";
import DestinationSelectButton from "./DestinationSelectButton";

type ViewState = "results" | "empty" | "recent" | "instruction" | "hidden";

type DestinationSearchContentProps = {
  viewState: ViewState;
  filteredDestinations: string[];
  recentDestinations: string[];
  onSelectDestination: (destination: string) => void;
  onRemoveAllRecentDestinations: () => void;
};

function DestinationSearchContentDefaultList({
  onSelectDestination,
}: {
  onSelectDestination: (destination: string) => void;
}) {
  return (
    <>
      <div className="px-4 pt-4 pb-2">
        <span className="text-(--text-tertiary) text-[11px] font-semibold uppercase tracking-wider">
          추천 목적지
        </span>
      </div>
      <div className="space-y-1">
        {SAMPLE_DESTINATIONS.map((destination) => (
          <div key={destination} className="anim-item">
            <DestinationSelectButton
              onClick={() => onSelectDestination(destination)}
              destination={destination}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default function DestinationSearchContent({
  viewState,
  filteredDestinations,
  recentDestinations,
  onSelectDestination,
  onRemoveAllRecentDestinations,
}: DestinationSearchContentProps) {
  switch (viewState) {
    case "results":
      return (
        <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar">
          <div className="space-y-1">
            {filteredDestinations.map((destination) => (
              <div key={destination} className="anim-item">
                <DestinationSelectButton
                  onClick={() => onSelectDestination(destination)}
                  destination={destination}
                />
              </div>
            ))}
          </div>
        </div>
      );
    case "empty":
      return (
        <div className="py-16 px-4 fade-in flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-(--bg-secondary) flex items-center justify-center text-(--text-muted)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <p className="text-(--text-muted) text-sm font-medium">
            검색 결과가 없습니다
          </p>
        </div>
      );
    case "recent":
      return (
        <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <span className="text-(--text-tertiary) text-[11px] font-semibold uppercase tracking-wider">
              최근 검색
            </span>
            <button
              onClick={onRemoveAllRecentDestinations}
              onMouseDown={(event) => event.preventDefault()}
              className="text-[11px] text-(--text-muted) hover:text-(--text-primary) transition-colors px-2 py-1 rounded-md hover:bg-(--bg-secondary)"
            >
              모두 삭제
            </button>
          </div>
          <div className="space-y-1">
            {recentDestinations.map((destination: string) => (
              <div key={destination} className="anim-item opacity-0">
                <DestinationSelectButton
                  onClick={() => onSelectDestination(destination)}
                  destination={destination}
                  isRecent
                />
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/5">
             {DestinationSearchContentDefaultList({ onSelectDestination })}
          </div>
        </div>
      );
    case "instruction":
      return (
        <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar">
          <div className="py-8 px-4 fade-in text-center">
             <p className="text-(--text-muted) text-sm">
              목적지를 검색하여<br/>길안내를 시작하세요
            </p>
          </div>
          {DestinationSearchContentDefaultList({ onSelectDestination })}
        </div>
      );
    default:
      return null;
  }
}
