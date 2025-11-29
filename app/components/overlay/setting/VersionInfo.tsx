const VERSION_INFO = [
  { name: "API Version", version: "v1" },
  { name: "Next.js", version: "16.0.4" },
  { name: "React", version: "19.2.0" },
  { name: "A-Frame", version: "1.7.1" },
  { name: "Anime.js", version: "4.2.2" },
  { name: "Lucide React", version: "0.555.0" },
  { name: "React Icons", version: "5.5.0" },
];

export default function VersionInfo() {
  return (
    <div className="space-y-2">
      {VERSION_INFO.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between p-3 rounded-xl bg-(--bg-card)/60 border border-(--border-subtle)"
        >
          <span className="text-sm font-medium text-(--text-secondary)">{item.name}</span>
          <span className="text-sm font-mono text-(--text-primary)">{item.version}</span>
        </div>
      ))}
    </div>
  );
}
