import DestinationSelectButton from "./DestinationSelectButton";
import { Search } from "../Icons";

type ViewState = "instruction" | "hidden" | "querying";

type DestinationSearchContentProps = {
  viewState: ViewState;
  searchQuery: string;
  recentDestinations: string[];
  onSelectDestination: (destination: string) => void;
  onRemoveAllRecentDestinations: () => void;
};

function DestinationSearchContentQuerying({
  searchQuery,
  onSelectDestination,
}: {
  searchQuery: string;
  onSelectDestination: (destination: string) => void;
}) {
  return (
    <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar">
      <div className="px-2 pt-2 pb-2">
        <button
          onClick={() => onSelectDestination(searchQuery)}
          onMouseDown={(event) => event.preventDefault()}
          className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-(--bg-secondary)/80 active:bg-(--bg-secondary) transition-all text-left cursor-pointer group fade-in"
        >
          <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-(--bg-secondary) text-(--text-secondary) group-hover:bg-(--bg-tertiary) group-hover:text-(--text-primary) transition-colors">
            <Search size={18} />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-(--text-primary) text-[15px] font-medium leading-snug group-hover:text-white transition-colors truncate">
              &quot;{searchQuery}&quot; 검색하기
            </span>
            <span className="text-(--text-muted) text-xs">
              쿼리로 길안내 시작
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

function DestinationSearchContentRecent({
  recentDestinations,
  onSelectDestination,
  onRemoveAllRecentDestinations,
}: {
  recentDestinations: string[];
  onSelectDestination: (destination: string) => void;
  onRemoveAllRecentDestinations: () => void;
}) {
  return (
    <>
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
    </>
  );
}

export default function DestinationSearchContent({
  viewState,
  searchQuery,
  recentDestinations,
  onSelectDestination,
  onRemoveAllRecentDestinations,
}: DestinationSearchContentProps) {
  switch (viewState) {
    case "instruction":
      return (
        <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar">
          <div className="py-8 px-4 fade-in text-center">
            <p className="text-(--text-muted) text-sm">
              쿼리를 작성하여
              <br />
              길안내를 시작하세요
            </p>
          </div>
          {recentDestinations.length > 0 && (
            <div className="border-t border-white/5">
              <DestinationSearchContentRecent
                recentDestinations={recentDestinations}
                onSelectDestination={onSelectDestination}
                onRemoveAllRecentDestinations={onRemoveAllRecentDestinations}
              />
            </div>
          )}
        </div>
      );
    case "querying":
      return (
        <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar">
          <div className="border-b border-white/5">
            <DestinationSearchContentQuerying
              searchQuery={searchQuery}
              onSelectDestination={onSelectDestination}
            />
          </div>
          <DestinationSearchContentRecent
            recentDestinations={recentDestinations}
            onSelectDestination={onSelectDestination}
            onRemoveAllRecentDestinations={onRemoveAllRecentDestinations}
          />
        </div>
      );
    default:
      return null;
  }
}
