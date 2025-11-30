import { MapPin } from "../overlay/Icons";

export default function DestinationSelectButton({
  destination,
  onClick,
  isRecent = false,
}: {
  destination: string;
  onClick: () => void;
  isRecent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-(--bg-secondary)/80 active:bg-(--bg-secondary) transition-all text-left cursor-pointer group"
    >
      <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors
        ${isRecent ? 'bg-(--bg-tertiary)/50 text-(--text-muted)' : 'bg-(--bg-secondary) text-(--text-secondary) group-hover:bg-(--bg-tertiary) group-hover:text-(--text-primary)'}`}>
        {isRecent ? (
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
        ) : (
          <MapPin size={18} />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-(--text-primary) text-[15px] font-medium leading-snug group-hover:text-white transition-colors">
          {destination}
        </span>
        {/* <span className="text-(--text-muted) text-xs">상세 주소 없음</span> */}
      </div>
    </button>
  );
}
