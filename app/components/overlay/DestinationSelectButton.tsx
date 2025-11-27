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
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-blue-600/50 transition-all text-left group cursor-pointer"
    >
      <div className="shrink-0 w-10 h-10 bg-blue-600/30 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all">
        <span className="text-blue-300 group-hover:text-white">
          <MapPin />
        </span>
      </div>
      <span className="text-white/90 font-medium">{destination}</span>
    </button>
  );
}
