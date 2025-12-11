import Camera from "./Camera";
import Overlay from "./overlay";

export default function DemoWithOverlay() {
  return (
    <Camera off>
      <Overlay enableDemoMode />
    </Camera>
  );
}
