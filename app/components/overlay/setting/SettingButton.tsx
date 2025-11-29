import { Settings } from "lucide-react";
import { useOverlayContext } from "../OverlayContext";

export default function SettingButton() {
    const { setSetting } = useOverlayContext();
  return <button onClick={() => setSetting(true)} className="p-2 rounded-3xl transition-colors
   bg-(--bg-secondary) hover:bg-(--bg-hover) text-(--text-primary) cursor-pointer ring-1 ring-(--ring-primary) shadow-2xl shadow-(--bg-card)">
    <Settings size={24} className="text-(--text-tertiary)" />
  </button>
}