"use client";
import { motion } from "framer-motion";
import { FiDownload, FiEye, FiClock } from "react-icons/fi";
import {
  FaYoutube, FaTiktok, FaInstagram, FaFacebook,
  FaSnapchat, FaSpotify, FaTwitter, FaGlobe,
} from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const PLAT: Record<string, { Icon: any; color: string; label: string }> = {
  youtube:   { Icon: FaYoutube,   color: "#ff0000", label: "YouTube"   },
  tiktok:    { Icon: FaTiktok,    color: "#ff2d55", label: "TikTok"    },
  instagram: { Icon: FaInstagram, color: "#e1306c", label: "Instagram" },
  facebook:  { Icon: FaFacebook,  color: "#1877f2", label: "Facebook"  },
  snapchat:  { Icon: FaSnapchat,  color: "#fffc00", label: "Snapchat"  },
  spotify:   { Icon: FaSpotify,   color: "#1db954", label: "Spotify"   },
  twitter:   { Icon: FaTwitter,   color: "#1da1f2", label: "X"         },
  threads:   { Icon: SiThreads,   color: "#aaaaaa", label: "Threads"   },
  direct:    { Icon: FaGlobe,     color: "#aaaaaa", label: "رابط"      },
};

export default function ResultCard({ result, onSelect }: { result: any; onSelect: (r: any) => void }) {
  const p = PLAT[result.platform] || PLAT.direct;
  const { Icon } = p;

  return (
    <motion.div whileHover={{ scale:1.008, y:-1 }} whileTap={{ scale:.995 }}
      onClick={() => onSelect(result)} className="card"
      style={{ display:"flex", alignItems:"center", gap:12,
        padding:"10px 12px", cursor:"pointer", borderRadius:14 }}>

      {/* Thumbnail */}
      <div style={{ position:"relative", flexShrink:0, width:112, height:64,
        borderRadius:10, overflow:"hidden", background:"#1a1a1a" }}>
        {result.thumbnail
          ? <img src={result.thumbnail} alt="" loading="lazy"
              style={{ width:"100%", height:"100%", objectFit:"cover" }}
              onError={e => { (e.target as any).style.display = "none"; }} />
          : <div style={{ width:"100%", height:"100%", display:"flex",
              alignItems:"center", justifyContent:"center" }}>
              <Icon size={26} color={p.color} />
            </div>
        }
        {result.duration && (
          <span style={{ position:"absolute", bottom:4, right:4,
            background:"rgba(0,0,0,.85)", color:"white",
            fontSize:10, fontWeight:700, padding:"2px 5px", borderRadius:5 }}>
            {result.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex:1, minWidth:0, textAlign:"right" }}>
        <p style={{ color:"white", fontSize:13, fontWeight:700,
          lineHeight:1.45, marginBottom:5,
          overflow:"hidden", display:"-webkit-box",
          WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
          {result.title}
        </p>
        <div style={{ display:"flex", alignItems:"center", gap:8,
          justifyContent:"flex-end", flexWrap:"wrap" }}>
          {result.channel && (
            <span style={{ color:"#666", fontSize:11, fontFamily:"Cairo" }}>{result.channel}</span>
          )}
          {result.views && (
            <span style={{ color:"#555", fontSize:11, display:"flex", alignItems:"center", gap:3 }}>
              <FiEye size={10}/> {result.views}
            </span>
          )}
          <span style={{ display:"inline-flex", alignItems:"center", gap:4,
            fontSize:11, fontWeight:700, color:p.color,
            background: p.color+"18", padding:"2px 7px", borderRadius:5 }}>
            <Icon size={10}/> {p.label}
          </span>
        </div>
      </div>

      {/* Download btn */}
      <motion.button whileHover={{ scale:1.12 }} whileTap={{ scale:.9 }}
        onClick={e => { e.stopPropagation(); onSelect(result); }}
        style={{ flexShrink:0, width:38, height:38, borderRadius:999,
          background:"#ff2d2d1a", border:"1.5px solid #ff2d2d33",
          color:"#ff2d2d", display:"flex", alignItems:"center",
          justifyContent:"center", cursor:"pointer" }}>
        <FiDownload size={15} strokeWidth={2.5}/>
      </motion.button>
    </motion.div>
  );
}
