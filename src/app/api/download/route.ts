import { NextRequest, NextResponse } from "next/server";

const RAPID_KEY = process.env.RAPIDAPI_KEY || "";

// ── YouTube download via RapidAPI ──────────────────────────────────────────
async function getYouTubeLink(videoUrl: string, format: string): Promise<string> {
  const isAudio = format === "mp3";
  const qualityMap: Record<string, string> = {
    mp4_1080: "1080",
    mp4_720:  "720",
    mp4_480:  "480",
    mp4:      "720",
  };
  const quality = qualityMap[format] || "720";

  // YouTube downloader API
  const apiUrl = isAudio
    ? `https://youtube-mp36.p.rapidapi.com/dl?id=${extractYTId(videoUrl)}`
    : `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${extractYTId(videoUrl)}`;

  const host = isAudio
    ? "youtube-mp36.p.rapidapi.com"
    : "ytstream-download-youtube-videos.p.rapidapi.com";

  const res = await fetch(apiUrl, {
    headers: { "x-rapidapi-key": RAPID_KEY, "x-rapidapi-host": host },
  });
  const data = await res.json();

  if (isAudio) {
    if (data.status === "ok" && data.link) return data.link;
    throw new Error("فشل تحميل الصوت");
  }

  // Video: pick best matching quality
  const formats = data.adaptiveFormats || data.formats || [];
  const found = formats
    .filter((f: any) => f.mimeType?.includes("video/mp4") && f.qualityLabel?.includes(quality))
    .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))[0];

  if (found?.url) return found.url;

  // Fallback: best mp4
  const fallback = formats
    .filter((f: any) => f.mimeType?.includes("video/mp4"))
    .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))[0];
  if (fallback?.url) return fallback.url;
  throw new Error("لا توجد صيغة متاحة");
}

// ── Social media download via RapidAPI ────────────────────────────────────
async function getSocialLink(mediaUrl: string, format: string): Promise<string> {
  const isAudio = format === "mp3";
  const res = await fetch(
    `https://social-media-video-downloader.p.rapidapi.com/smvd/get/all?url=${encodeURIComponent(mediaUrl)}`,
    { headers: { "x-rapidapi-key": RAPID_KEY, "x-rapidapi-host": "social-media-video-downloader.p.rapidapi.com" } }
  );
  const data = await res.json();
  if (!data.success || !data.links?.length) throw new Error("لا يمكن تحميل هذا الرابط");

  const links: any[] = data.links;
  if (isAudio) {
    const audio = links.find(l => l.type?.includes("audio") || l.quality?.includes("audio") || l.link?.includes(".mp3"));
    if (audio?.link) return audio.link;
  }
  // Best video
  const video = links.find(l => !l.type?.includes("audio")) || links[0];
  if (video?.link) return video.link;
  throw new Error("لا يوجد رابط تحميل");
}

function extractYTId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return m ? m[1] : "";
}

function isYouTube(url: string) {
  return url.includes("youtu.be") || url.includes("youtube.com");
}

// ── Main handler ──────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const mediaUrl = req.nextUrl.searchParams.get("url") || "";
  const format   = req.nextUrl.searchParams.get("format") || "mp4_720";
  const title    = req.nextUrl.searchParams.get("title") || "media";

  if (!mediaUrl) return NextResponse.json({ error: "No URL" }, { status: 400 });
  if (!RAPID_KEY) return NextResponse.json({ error: "RAPIDAPI_KEY غير مضبوط" }, { status: 500 });

  try {
    const dlUrl = isYouTube(mediaUrl)
      ? await getYouTubeLink(mediaUrl, format)
      : await getSocialLink(mediaUrl, format);

    // Redirect to direct link (fastest — no server buffering)
    return NextResponse.redirect(dlUrl);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل التحميل" }, { status: 500 });
  }
}
