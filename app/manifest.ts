import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Vikram Parekh",
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#F5F2EC",
    theme_color: "#1F4D3A",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
