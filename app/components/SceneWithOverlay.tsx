"use client";

import dynamic from "next/dynamic";
import Overlay from "./overlay";
import { useEffect, useState } from "react";
import Camera from "./Camera";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <p className="text-white">Loading...</p>,
});

export default function SceneWithOverlay() {
  return (
    <Camera>
      <Overlay />
      {/* <Scene /> */}
    </Camera>
  );
}
