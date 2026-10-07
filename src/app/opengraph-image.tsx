import { ImageResponse } from "next/og";

/**
 * The share card for every page that doesn't set its own (blog posts and events
 * with a cover override it).
 *
 * Replaces the square profile .webp that used to be the og:image: a square image
 * gets cropped in a 1.91:1 large-summary card, and several platforms (LinkedIn,
 * WhatsApp previews) handle WebP poorly. This renders a proper 1200×630 PNG.
 */
export const alt = "Afif Zilani — Co-Founder & CEO of ZeroD Farm, Naogaon, Bangladesh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px 80px",
                    background: "#f9f6f0",
                    color: "#132119",
                    fontFamily: "Georgia, serif",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                        style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            background: "#f2a20d",
                        }}
                    />
                    <div style={{ fontSize: 28, letterSpacing: 4, color: "#25603f" }}>
                        ZEROD FARM · NAOGAON, BANGLADESH
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1 }}>Afif Zilani</div>
                    <div style={{ fontSize: 44, marginTop: 24, color: "#25603f" }}>
                        Co-Founder &amp; CEO, ZeroD Farm
                    </div>
                </div>
                <div style={{ display: "flex", fontSize: 28, color: "#4f5c55" }}>
                    afifzilani.com
                </div>
            </div>
        ),
        size
    );
}
