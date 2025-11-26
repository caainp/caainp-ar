"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./components/Scene"), {
  ssr: false,
  loading: () => <p className="text-white">Loading...</p>,
});

export const App = () => {
  return <Scene />;
};

export default App;
