import { NextRequest, NextResponse } from "next/server";

const RAPID_KEY  = process.env.RAPIDAPI_KEY || "";
const YT_HOST    = "youtube-v31.p.rapidapi.com";

async function searchYouTube(q: string) {
  const url = `https://${YT_HOST}/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=8&regionCode=SA`;
  const res  = await fetch(url, {
    headers: { "x-rapidapi-key": RAPID_KEY, "x-rapidapi-host": YT_HOST },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("YouTube search failed");
  const data = await res.json();
  return (data.items || []).map((item: any) => ({
    id:        item.id?.videoId,
    title:     item.snippet?.title || "",
    thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || "",
    channel:   item.snippet?.channelTitle || "",
    duration:  "",
    views:     "",
    url:       `https://www.youtube.com/watch?v=${item.id?.videoId}`,
    platform:  "youtube",
  }));
}

async function fetchDirectInfo(inputUrl: string, platform: string) {
  // Use All-in-One Social Media Downloader API on RapidAPI
  const url = `https://social-media-video-downloader.p.rapidapi.com/smvd/get/all?url=${encodeURIComponent(inputUrl)}`;
  const res  = await fetch(url, {
    headers: {
      "x-rapidapi-key":  RAPID_KEY,
      "x-rapidapi-host": "social-media-video-downloader.p.rapidapi.com",
    },
  });
  if (!res.ok) throw new Error("Info fetch failed");
  const data = await res.json();
  if (!data.success) throw new Error("No data");

  return [{
    id:        data.id || "0",
    title:     data.title || "بدون عنوان",
    thumbnail: data.picture || "",
    channel:   data.author || "",
    duration:  data.duration ? `${Math.floor(data.duration/60)}:${String(data.duration%60).padStart(2,"0")}` : "",
    views:     "",
    url:       inputUrl,
    platform,
    links:     data.links || [],   // direct download links from API
  }];
}

export async function GET(req: NextRequest) {
  const q        = req.nextUrl.searchParams.get("q")?.trim() || "";
  const platform = req.nextUrl.searchParams.get("platform") || "youtube";
  if (!q) return NextResponse.json({ results: [] });

  if (!RAPID_KEY) {
    return NextResponse.json({ results: [], error: "RAPIDAPI_KEY غير مضبوط" }, { status: 500 });
  }

  try {
    let results;
    if (q.startsWith("http")) {
      results = await fetchDirectInfo(q, platform);
    } else {
      results = await searchYouTube(q);
    }
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ results: [], error: err.message }, { status: 500 });
  }
}
