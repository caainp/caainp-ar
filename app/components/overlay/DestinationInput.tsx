import { Search } from "./Icons";

export default function DestinationInput({
  inputRef,
  searchQuery,
  setSearchQuery,
  setIsFocused,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setIsFocused: (value: boolean) => void;
}) {
  return (
    <div className="relative flex-1">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)">
        <Search size={18} />
      </div>
      <input
        type="text"
        ref={inputRef}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="목적지 검색"
        className="w-full bg-(--bg-input) rounded-3xl py-3 pl-10 pr-4 text-(--text-primary) text-sm placeholder-(--text-muted) 
          focus:outline-none focus:ring-1 focus:ring-(--ring-secondary) ring-1 ring-(--ring-primary) shadow-2xl shadow-(--bg-card) transition-all"
      />
    </div>
  );
}
