import { MapPin } from "./Icons";

export default function DestinationSelectButton({
  destination,
  onClick,
}: {
  destination: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-(--bg-secondary) transition-colors text-left cursor-pointer group"
    >
      <div className="shrink-0 w-8 h-8 bg-(--bg-secondary) group-hover:bg-(--bg-hover) rounded-lg flex items-center justify-center transition-colors">
        <span className="text-(--text-tertiary) group-hover:text-(--text-tertiary)">
          <MapPin size={16} />
        </span>
      </div>
      <span className="text-(--text-secondary) text-sm font-medium">{destination}</span>
    </button>
  );
}
