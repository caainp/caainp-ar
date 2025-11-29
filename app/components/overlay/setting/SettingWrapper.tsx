import Setting from "./Setting";
import { useOverlayContext } from "../OverlayContext";

export default function SettingWrapper() {

  const { setSetting } = useOverlayContext();

  return <div className="absolute inset-0">
    {/* Background */}
    <div
      className="absolute inset-0 z-2 bg-(--bg-base)/40 backdrop-blur-4xl "
      onClick={() => setSetting(false)}
    ></div>
    {/* Content */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm mx-auto z-3 p-2">
      <Setting />
    </div>
  </div>;
}