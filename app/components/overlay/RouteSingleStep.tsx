import { Circle } from "lucide-react";

export default function RouteSingleStep({ step }: { step: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="shrink-0 w-6 h-6 bg-emerald-500/30 text-emerald-400 border-2 border-emerald-400 rounded-full flex items-center justify-center">
        <Circle size={10} />
      </div>
      <h1 className="text-sm font-medium tracking-wider">{step}</h1>
    </div>
  );
}
