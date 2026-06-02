"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMusic, FiVideo, FiDownload, FiLoader, FiExternalLink } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import { getFormats } from "@/lib/platforms";
import {
  FaYoutube, FaTiktok, FaInstagram, FaFacebook,
  FaSnapchat, FaSpotify, FaTwitter, FaGlobe,
} from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const PICONS: Record<string, any> = {
  youtube: FaYoutube, tiktok: FaTiktok, instagram: FaInstagram,
  facebook: FaFacebook, snapchat: FaSnapchat, spotify: FaSpotify,
  twitter: FaTwitter, threads: SiThreads, direct: FaGlobe,
};
const PCOLORS: Record<string, string> = {
  youtube: "#ff0000", tiktok: "#ff2d55", instagram: "#e1306c",
  facebook: "#1877f2", snapchat: "#fffc00", spotify: "#1db954",
  twitter: "#1da1f2", threads: "#aaa", direct: "#aaa",
};

export default function FormatModal({ item, onClose }: { item: any; onClose: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const formats = getFormats(item.platform || "youtube");
  const PIcon   = PICONS[item.platform] || FaGlobe;
  const pColor  = PCOLORS[item.platform] || "#aaa";

  const download = async (fmt: string) => {
    if (busy) return;
    setBusy(fmt);
    toast.loading("⏳ جاري التحضير…", { id: "dl" });
    try {
      const params = new URLSearchParams({ url: item.url, format: fmt, title: item.title });
      const res = await fetch(`/api/download?${params}`);

      if (res.redirected) {
        // API returned a direct link — open it
        const a = document.createElement("a");
        a.href = res.url;
        a.download = `${item.title.replace(/[^\w\u0600-\u06FF\s]/g,"").trim()} - MediaDrop.${fmt === "mp3" ? "mp3" : "mp4"}`;
        a.target = "_blank";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast.success("✅ بدأ التحميل!", { id: "dl" });
        onClose(); return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "فشل");
      }

      const blob = await res.blob();
      const ext  = fmt === "mp3" ? "mp3" : "mp4";
      const name = `${item.title.replace(/[^\w\u0600-\u06FF\s]/g,"").trim()} - MediaDrop.${ext}`;
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      toast.success("✅ تم التحميل!", { id: "dl" });
      onClose();
    } catch (e: any) {
      toast.error(e.message || "فشل التحميل", { id: "dl" });
    } finally { setBusy(null); }
  };

  return (
    <motion.div className="modal-bg"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}>
      <motion.div className="modal-box"
        initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
        transition={{ type:"spring", stiffness:340, damping:34 }}
        onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div style={{ width:36, height:4, background:"#333", borderRadius:2,
          margin:"4px auto 16px" }}/>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:16 }}>
          <motion.button whileTap={{ scale:.9 }} onClick={onClose}
            style={{ width:32, height:32, borderRadius:999, background:"#1a1a1a",
              border:"1px solid #2a2a2a", color:"#888", display:"flex",
              alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <FiX size={14}/>
          </motion.button>
          <span style={{ fontFamily:"Cairo", fontWeight:700, fontSize:15,
            color:"white", display:"flex", alignItems:"center", gap:6 }}>
            <PIcon style={{ color:pColor }} size={15}/> اختر الصيغة
          </span>
        </div>

        {/* Media info */}
        <div style={{ display:"flex", gap:12, padding:"10px 12px",
          background:"#1a1a1a", borderRadius:12, marginBottom:16,
          border:"1px solid #2a2a2a" }}>
          {item.thumbnail && (
            <img src={item.thumbnail} alt="" loading="lazy"
              style={{ width:72, height:50, borderRadius:8, objectFit:"cover", flexShrink:0 }}
              onError={e => { (e.target as any).style.display="none"; }} />
          )}
          <div style={{ flex:1, textAlign:"right", minWidth:0 }}>
            <p style={{ color:"white", fontSize:13, fontWeight:700,
              lineHeight:1.4, overflow:"hidden", display:"-webkit-box",
              WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
              {item.title}
            </p>
            {item.channel && (
              <p style={{ color:"#666", fontSize:11, marginTop:4, fontFamily:"Cairo" }}>{item.channel}</p>
            )}
          </div>
        </div>

        {/* Formats */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {formats.map((f, i) => (
            <motion.button key={f.id} className="fmt-btn"
              initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
              transition={{ delay: i*.06 }}
              onClick={() => download(f.id)}
              disabled={!!busy}
              style={{ borderColor: busy === f.id ? f.color+"55" : "#2a2a2a",
                opacity: busy && busy !== f.id ? .35 : 1 }}
              onMouseEnter={e => { if(!busy)(e.currentTarget as HTMLElement).style.borderColor = f.color+"55"; }}
              onMouseLeave={e => { if(!busy)(e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a"; }}>

              {/* Left icon */}
              <span style={{ color:f.color, fontSize:20, display:"flex" }}>
                {busy === f.id
                  ? <span className="spin"><FiLoader size={18}/></span>
                  : <FiDownload size={18}/>
                }
              </span>

              {/* Label */}
              <div style={{ flex:1, textAlign:"right" }}>
                <p style={{ fontWeight:800, fontSize:15, color:"white", fontFamily:"Cairo" }}>{f.label}</p>
                <p style={{ color:"#666", fontSize:12, fontFamily:"Cairo" }}>{f.sub}</p>
              </div>

              {/* Type icon */}
              <span style={{ color:f.color+"99", fontSize:18 }}>
                {f.type === "audio" ? <FiMusic size={17}/> : <FiVideo size={17}/>}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
