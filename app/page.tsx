"use client";

import dynamic from "next/dynamic";
import Overlay from "./components/overlay";

const Scene = dynamic(() => import("./components/Scene"), {
  ssr: false,
  loading: () => <p className="text-white">Loading...</p>,
});

export const App = () => {
  return (
    <>
      <Overlay />
      {/* <Scene /> */}
    </>
  );
};

export default App;
