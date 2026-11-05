import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Vikram Parekh: Data, AI & Analytics Talent Infrastructure. Co-founder of datavruti, building estana and graph.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const photo = await readFile(join(process.cwd(), "public/vikram-profile.png"));
  const src = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F5F2EC", color: "#1C1B19", fontFamily: "Georgia, serif" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 56px 56px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 18, letterSpacing: 3, textTransform: "uppercase", color: "#4E5F55", fontFamily: "sans-serif" }}>
            <div style={{ width: 32, height: 2, background: "#4E5F55" }} />
            Data, AI &amp; Analytics Talent Infrastructure
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 124, lineHeight: 0.95, letterSpacing: -5 }}>Vikram</div>
            <div style={{ fontSize: 124, lineHeight: 0.95, letterSpacing: -5, color: "#1F4D3A", paddingLeft: 64 }}>Parekh</div>
          </div>
          <div style={{ display: "flex", gap: 28, borderTop: "2px solid #DCE0D6", paddingTop: 24, fontSize: 24, color: "#4E5F55", fontFamily: "sans-serif" }}>
            <span>datavruti.com</span>
            <span>estana.in</span>
            <span>mygraph.id</span>
          </div>
        </div>
        <div style={{ display: "flex", width: 440, height: "100%", padding: "40px 40px 40px 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" width={400} height={550} style={{ width: 400, height: 550, objectFit: "cover", borderRadius: 8 }} />
        </div>
      </div>
    ),
    size
  );
}
