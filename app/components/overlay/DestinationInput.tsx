import { Search } from "./Icons";

export default function DestinationInput({
  searchQuery,
  setSearchQuery,
  setIsFocused,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setIsFocused: (value: boolean) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="목적지 검색"
        className="w-full bg-zinc-800 rounded-lg py-3 pl-10 pr-4 text-zinc-100 text-sm placeholder-zinc-500 
          focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all"
      />
    </div>
  );
}
