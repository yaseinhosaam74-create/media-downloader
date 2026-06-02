export type Platform = {
  id: string;
  label: string;
  color: string;
  bg: string;
  placeholder: string;
  supportsSearch: boolean;
};

export const PLATFORMS: Platform[] = [
  { id: "youtube",   label: "YouTube",   color: "#ff0000", bg: "#ff000020", placeholder: "ابحث أو الصق رابط يوتيوب",      supportsSearch: true  },
  { id: "tiktok",    label: "TikTok",    color: "#ff2d55", bg: "#ff2d5520", placeholder: "الصق رابط تيك توك",            supportsSearch: false },
  { id: "instagram", label: "Instagram", color: "#e1306c", bg: "#e1306c20", placeholder: "الصق رابط إنستجرام",           supportsSearch: false },
  { id: "facebook",  label: "Facebook",  color: "#1877f2", bg: "#1877f220", placeholder: "الصق رابط فيسبوك",             supportsSearch: false },
  { id: "snapchat",  label: "Snapchat",  color: "#fffc00", bg: "#fffc0015", placeholder: "الصق رابط سناب شات",           supportsSearch: false },
  { id: "spotify",   label: "Spotify",   color: "#1db954", bg: "#1db95420", placeholder: "الصق رابط سبوتيفاي",           supportsSearch: false },
  { id: "twitter",   label: "X",         color: "#1da1f2", bg: "#1da1f220", placeholder: "الصق رابط X / تويتر",          supportsSearch: false },
  { id: "threads",   label: "Threads",   color: "#aaaaaa", bg: "#aaaaaa15", placeholder: "الصق رابط ثريدز",              supportsSearch: false },
];

export function detectPlatform(url: string): string {
  if (!url.startsWith("http")) return "youtube";
  if (url.includes("tiktok.com"))    return "tiktok";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("fb.com") || url.includes("facebook.com") || url.includes("fb.watch")) return "facebook";
  if (url.includes("snapchat.com"))  return "snapchat";
  if (url.includes("spotify.com"))   return "spotify";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("threads.net"))   return "threads";
  return "youtube";
}

export function getFormats(platform: string) {
  if (platform === "spotify") return [
    { id: "mp3", label: "MP3", sub: "صوت — أعلى جودة", color: "#1db954", type: "audio" },
  ];
  if (["tiktok","instagram","snapchat","threads","twitter","facebook"].includes(platform)) return [
    { id: "mp4",  label: "MP4",  sub: "فيديو — أفضل جودة", color: "#ff2d2d", type: "video" },
    { id: "mp3",  label: "MP3",  sub: "صوت فقط",           color: "#1db954", type: "audio" },
  ];
  return [
    { id: "mp3",      label: "MP3",       sub: "صوت — أعلى جودة",  color: "#1db954", type: "audio" },
    { id: "mp4_480",  label: "480p",      sub: "فيديو — حجم صغير", color: "#888",    type: "video" },
    { id: "mp4_720",  label: "720p HD",   sub: "فيديو — جودة جيدة",color: "#3ea6ff", type: "video" },
    { id: "mp4_1080", label: "1080p FHD", sub: "فيديو — أعلى جودة",color: "#ff2d2d", type: "video" },
  ];
}
