import { Settings } from "lucide-react";
import { useOverlayContext } from "../OverlayContext";

export default function SettingButton() {
    const { setSetting } = useOverlayContext();
  return <button onClick={() => setSetting(true)} className="p-2 rounded-3xl transition-colors bg-zinc-800 hover:bg-zinc-700 text-zinc-100 cursor-pointer">
    <Settings size={24} className="text-zinc-400" />
  </button>
}