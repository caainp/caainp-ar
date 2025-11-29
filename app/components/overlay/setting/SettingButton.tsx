import { Settings } from "lucide-react";
import { useOverlayContext } from "../OverlayContext";

export default function SettingButton() {
    const { setSetting } = useOverlayContext();
  return <button onClick={() => setSetting(true)} className="p-3.5 rounded-3xl transition-all duration-200
   bg-(--bg-secondary)/50 hover:bg-(--bg-secondary) text-(--text-muted) hover:text-(--text-primary) cursor-pointer 
   ring-1 ring-transparent hover:ring-(--ring-primary)/50 active:scale-95">
    <Settings size={20} />
  </button>
}