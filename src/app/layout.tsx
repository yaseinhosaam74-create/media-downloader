import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MediaDrop — حمّل من أي منصة",
  description: "حمّل فيديوهات وموسيقى من يوتيوب، تيك توك، إنستجرام، فيسبوك وأكثر",
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: "12px",
              fontFamily: "Cairo, sans-serif",
              fontSize: "14px",
              padding: "12px 18px",
            },
            success: { iconTheme: { primary: "#1db954", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#ff2d2d", secondary: "#fff" } },
          }}
        />
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 56px)" }}>{children}</main>
      </body>
    </html>
  );
}
