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
    <div className="relative flex-1 group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted) group-focus-within:text-(--text-primary) transition-colors">
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
        className="w-full bg-(--bg-secondary)/50 hover:bg-(--bg-secondary) focus:bg-(--bg-card) rounded-3xl py-3.5 pl-11 pr-10 
          text-(--text-primary) text-[15px] placeholder-(--text-muted) transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-(--ring-primary)/50 ring-1 ring-transparent focus:shadow-lg"
      />
      {searchQuery && (
        <button
          onClick={() => {
            setSearchQuery("");
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-tertiary) transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
