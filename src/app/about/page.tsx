"use client";
import { motion } from "framer-motion";
import { FiGithub, FiSend, FiDownloadCloud, FiHeart, FiCode } from "react-icons/fi";
import { FaYoutube, FaTiktok, FaInstagram, FaFacebook, FaSnapchat, FaSpotify, FaTwitter } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const STATS = [{ v:"1000+", l:"منصة" },{ v:"5", l:"صيغة" },{ v:"100%", l:"مجاني" }];
const TECH  = ["Next.js 13","TypeScript","Framer Motion","Tailwind CSS","RapidAPI","React 18"];
const SUPPORTED = [
  { Icon: FaYoutube,   label:"YouTube",   color:"#ff0000" },
  { Icon: FaTiktok,    label:"TikTok",    color:"#ff2d55" },
  { Icon: FaInstagram, label:"Instagram", color:"#e1306c" },
  { Icon: FaFacebook,  label:"Facebook",  color:"#1877f2" },
  { Icon: FaSnapchat,  label:"Snapchat",  color:"#fffc00" },
  { Icon: FaSpotify,   label:"Spotify",   color:"#1db954" },
  { Icon: FaTwitter,   label:"X",         color:"#1da1f2" },
  { Icon: SiThreads,   label:"Threads",   color:"#aaa"    },
];

const card = (delay=0) => ({
  initial:{ opacity:0, y:20 }, animate:{ opacity:1, y:0 },
  transition:{ delay, duration:.45 },
});

export default function About() {
  return (
    <div style={{ maxWidth:620, margin:"0 auto", padding:"32px 16px 100px" }}>

      {/* Profile */}
      <motion.div {...card(0)} style={{ background:"#111", border:"1px solid #2a2a2a",
        borderRadius:20, padding:"28px 24px", textAlign:"center", marginBottom:12 }}>
        <motion.div
          animate={{ rotate:[0,5,-5,0] }} transition={{ duration:4, repeat:Infinity }}
          style={{ width:72, height:72, borderRadius:999, margin:"0 auto 18px",
            background:"linear-gradient(135deg,#ff2d2d,#ff6b35)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          <FiDownloadCloud size={30} color="white" strokeWidth={2}/>
        </motion.div>
        <h1 style={{ fontFamily:"Cairo", fontWeight:900, fontSize:24, color:"white", marginBottom:8 }}>
          Media<span style={{ color:"#ff2d2d" }}>Drop</span>
        </h1>
        <p style={{ color:"#666", fontSize:14, fontFamily:"Cairo", lineHeight:1.9, marginBottom:22, maxWidth:360, margin:"0 auto 22px" }}>
          منصة مفتوحة المصدر لتحميل الوسائط من أكثر من 1000 موقع حول العالم. مجانية 100%.
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          {[
            { href:"https://github.com", Icon:FiGithub, label:"GitHub",   bg:"#1a1a1a", color:"white",   border:"#2a2a2a" },
            { href:"https://t.me",       Icon:FiSend,   label:"Telegram", bg:"#1877f215",color:"#3ea6ff", border:"#1877f230" },
          ].map(b => (
            <motion.a key={b.label} href={b.href} target="_blank" rel="noreferrer"
              whileHover={{ scale:1.04 }} whileTap={{ scale:.96 }}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px",
                borderRadius:999, background:b.bg, border:`1.5px solid ${b.border}`,
                color:b.color, textDecoration:"none", fontSize:13, fontWeight:700, fontFamily:"Cairo" }}>
              <b.Icon size={14}/> {b.label}
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div {...card(.08)} style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12 }}>
        {STATS.map(s => (
          <div key={s.l} style={{ background:"#111", border:"1px solid #2a2a2a",
            borderRadius:14, padding:"16px 8px", textAlign:"center" }}>
            <p style={{ color:"#ff2d2d", fontSize:22, fontWeight:900, fontFamily:"Cairo" }}>{s.v}</p>
            <p style={{ color:"#555",   fontSize:12, fontFamily:"Cairo", marginTop:4  }}>{s.l}</p>
          </div>
        ))}
      </motion.div>

      {/* Platforms */}
      <motion.div {...card(.14)} style={{ background:"#111", border:"1px solid #2a2a2a",
        borderRadius:20, padding:"20px 18px", marginBottom:12 }}>
        <p style={{ color:"white", fontWeight:700, fontFamily:"Cairo", fontSize:14,
          textAlign:"right", marginBottom:14 }}>المنصات المدعومة</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
          {SUPPORTED.map(p => (
            <div key={p.label} style={{ display:"flex", alignItems:"center", gap:10,
              padding:"11px 14px", background:"#1a1a1a", borderRadius:12,
              border:"1px solid #2a2a2a", justifyContent:"flex-end" }}>
              <span style={{ color:"white", fontSize:13, fontFamily:"Cairo", fontWeight:600 }}>{p.label}</span>
              <p.Icon size={20} color={p.color}/>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tech */}
      <motion.div {...card(.2)} style={{ background:"#111", border:"1px solid #2a2a2a",
        borderRadius:20, padding:"20px 18px" }}>
        <p style={{ color:"white", fontWeight:700, fontFamily:"Cairo", fontSize:14,
          textAlign:"right", marginBottom:14, display:"flex", alignItems:"center", gap:8, justifyContent:"flex-end" }}>
          <FiCode size={15} style={{ color:"#ff2d2d" }}/> التقنيات المستخدمة
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"flex-end" }}>
          {TECH.map(t => (
            <span key={t} style={{ padding:"6px 14px", borderRadius:999, fontSize:12,
              fontWeight:700, fontFamily:"Cairo", background:"#ff2d2d18",
              border:"1.5px solid #ff2d2d30", color:"#ff6666" }}>
              {t}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.p {...card(.26)} style={{ textAlign:"center", color:"#333", fontSize:12,
        fontFamily:"Cairo", marginTop:28, display:"flex", alignItems:"center",
        justifyContent:"center", gap:6 }}>
        صُنع بـ <FiHeart size={12} style={{ color:"#ff2d2d" }}/> — MediaDrop 2024
      </motion.p>
    </div>
  );
}
