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
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-left cursor-pointer group"
    >
      <div className="shrink-0 w-8 h-8 bg-zinc-800 group-hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors">
        <span className="text-zinc-400 group-hover:text-zinc-300">
          <MapPin size={16} />
        </span>
      </div>
      <span className="text-zinc-200 text-sm font-medium">{destination}</span>
    </button>
  );
}
