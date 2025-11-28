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
        <span className="text-zinc-500 text-xs tracking-wider">
          목적지 목록
        </span>
      </div>
      {SAMPLE_DESTINATIONS.map((destination) => (
        <div key={destination} className="anim-item">
          <DestinationSelectButton
            onClick={() => onSelectDestination(destination)}
            destination={destination}
          />
        </div>
      ))}
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
        <div className="max-h-72 overflow-y-auto p-2">
          <div className="space-y-0.5">
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
        <div className="py-12 px-4 fade-in">
          <p className="text-zinc-500 text-sm text-center">
            검색 결과가 없습니다
          </p>
        </div>
      );
    case "recent":
      return (
        <div className="max-h-64 overflow-y-auto p-2">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
              최근 검색
            </span>
            <button
              onClick={onRemoveAllRecentDestinations}
              onMouseDown={(event) => event.preventDefault()}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              모두 삭제
            </button>
          </div>
          {recentDestinations.map((destination: string) => (
            <div key={destination} className="anim-item opacity-0">
              <DestinationSelectButton
                onClick={() => onSelectDestination(destination)}
                destination={destination}
              />
            </div>
          ))}
          {DestinationSearchContentDefaultList({ onSelectDestination })}
        </div>
      );
    case "instruction":
      return (
        <div className="max-h-64 overflow-y-auto p-2">
          <div className="py-12 px-4 fade-in">
            <p className="text-zinc-500 text-sm text-center">
              목적지를 검색하세요
            </p>
          </div>
          {DestinationSearchContentDefaultList({ onSelectDestination })}
        </div>
      );
    default:
      return null;
  }
}
