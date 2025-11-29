import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Caanip",
    short_name: "Caanip",
    description: "Caanip",
    start_url: "/",
    display: "standalone",
    // 참고: CSS 변수 --manifest-bg와 --manifest-theme 참조 (globals.css)
    background_color: "#ffffff", // --manifest-bg
    theme_color: "#000000", // --manifest-theme
    icons: [],
  };
}
