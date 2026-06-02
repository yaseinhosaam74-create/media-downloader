"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiLink, FiLoader } from "react-icons/fi";
import {
  FaYoutube, FaTiktok, FaInstagram, FaFacebook,
  FaSnapchat, FaSpotify, FaTwitter
} from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import { PLATFORMS, detectPlatform } from "@/lib/platforms";
import ResultCard from "@/components/ResultCard";
import FormatModal from "@/components/FormatModal";
import toast from "react-hot-toast";

const ICONS: Record<string, any> = {
  youtube: FaYoutube, tiktok: FaTiktok, instagram: FaInstagram,
  facebook: FaFacebook, snapchat: FaSnapchat, spotify: FaSpotify,
  twitter: FaTwitter, threads: SiThreads,
};

export default function Home() {
  const [platform, setPlatform] = useState("youtube");
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activePlat = PLATFORMS.find(p => p.id === platform)!;
  const isUrl = query.trim().startsWith("http");

  const doSearch = async (q?: string) => {
    const sq = (q ?? query).trim();
    if (!sq) { inputRef.current?.focus(); return; }
    setLoading(true); setSearched(true);
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(sq)}&platform=${platform}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results || []);
      if (!data.results?.length) toast("لا توجد نتائج 🔍");
    } catch (e: any) {
      toast.error(e.message || "فشل البحث");
      setResults([]);
    } finally { setLoading(false); }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const txt = e.clipboardData.getData("text").trim();
    if (txt.startsWith("http")) {
      const detected = detectPlatform(txt);
      setPlatform(detected);
      setQuery(txt);
      setTimeout(() => doSearch(txt), 80);
    }
  };

  const handlePlatformSwitch = (id: string) => {
    setPlatform(id);
    setQuery("");
    setResults([]);
    setSearched(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 16px 100px" }}>

      {/* ── Hero ── */}
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
        style={{ textAlign:"center", marginBottom:32 }}>
        <motion.h1
          initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.1, duration:.5 }}
          style={{ fontFamily:"Cairo", fontWeight:900, fontSize:"clamp(28px,6vw,48px)",
            lineHeight:1.15, marginBottom:10, color:"white" }}>
          حمّل من{" "}
          <span className="grad-text">أي منصة</span>
        </motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.25 }}
          style={{ color:"#666", fontSize:"clamp(13px,3vw,15px)", fontFamily:"Cairo" }}>
          يوتيوب · تيك توك · إنستجرام · فيسبوك · سناب · سبوتيفاي وأكثر
        </motion.p>
      </motion.div>

      {/* ── Platform chips ── */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
        style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6,
          marginBottom:18, scrollbarWidth:"none" }}>
        {PLATFORMS.map((p, i) => {
          const Icon = ICONS[p.id];
          const active = platform === p.id;
          return (
            <motion.button key={p.id} onClick={() => handlePlatformSwitch(p.id)}
              initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }}
              transition={{ delay: i*.04 }}
              whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}
              className="chip"
              style={{
                color: active ? "white" : p.color,
                background: active ? p.color : p.bg,
                borderColor: active ? p.color : p.color + "40",
                flexShrink: 0,
              }}>
              <Icon size={14} /> {p.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Search bar ── */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
        style={{ marginBottom:24 }}>
        <div className="search-wrap">
          <div style={{ padding:"0 14px", color: isUrl ? activePlat.color : "#555", flexShrink:0, display:"flex" }}>
            {isUrl ? <FiLink size={17}/> : <FiSearch size={17}/>}
          </div>
          <input ref={inputRef} className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doSearch()}
            onPaste={handlePaste}
            placeholder={activePlat.placeholder}
          />
          <motion.button whileTap={{ scale:.95 }} className="btn-primary"
            onClick={() => doSearch()}
            disabled={loading || !query.trim()}
            style={{ margin:5, borderRadius:999, padding:"10px 22px", fontSize:14 }}>
            {loading
              ? <span className="spin"><FiLoader size={15}/></span>
              : <FiSearch size={15}/>
            }
            <span className="hide-xs">{loading ? "جاري البحث…" : "بحث"}</span>
          </motion.button>
        </div>

        {/* Hint */}
        <AnimatePresence mode="wait">
          {!activePlat.supportsSearch && !isUrl && (
            <motion.p key="hint-url" initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ color:"#555", fontSize:12, fontFamily:"Cairo", textAlign:"right",
                marginTop:8, paddingRight:4 }}>
              💡 الصق رابط {activePlat.label} مباشرةً في الأعلى
            </motion.p>
          )}
          {activePlat.supportsSearch && (
            <motion.p key="hint-yt" initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ color:"#555", fontSize:12, fontFamily:"Cairo", textAlign:"right",
                marginTop:8, paddingRight:4 }}>
              💡 ابحث بالاسم أو الصق رابطاً مباشراً
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Results ── */}
      <AnimatePresence mode="wait">

        {/* Skeleton */}
        {loading && (
          <motion.div key="skeleton" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[...Array(5)].map((_,i) => (
              <div key={i} className="skeleton" style={{ height:88, borderRadius:14,
                animationDelay:`${i*.1}s` }} />
            ))}
          </motion.div>
        )}

        {/* Results list */}
        {!loading && results.length > 0 && (
          <motion.div key="list" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <p style={{ color:"#555", fontSize:12, fontFamily:"Cairo", textAlign:"right", marginBottom:4 }}>
              {results.length} نتيجة
            </p>
            {results.map((r, i) => (
              <motion.div key={`${r.id}-${i}`}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i*.05, ease:"easeOut" }}>
                <ResultCard result={r} onSelect={setSelected} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty */}
        {!loading && searched && results.length === 0 && (
          <motion.div key="empty" initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
            style={{ textAlign:"center", padding:"60px 0", color:"#555" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>😕</div>
            <p style={{ fontFamily:"Cairo", fontSize:15 }}>لا توجد نتائج، جرّب رابطاً مختلفاً</p>
          </motion.div>
        )}

        {/* Welcome state */}
        {!searched && !loading && (
          <motion.div key="welcome" initial={{ opacity:0 }} animate={{ opacity:.5 }} exit={{ opacity:0 }}
            style={{ textAlign:"center", padding:"56px 0", color:"#444" }}>
            <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
              style={{ fontSize:52, marginBottom:14 }}>🎵</motion.div>
            <p style={{ fontFamily:"Cairo", fontSize:14 }}>اختر منصة وابدأ</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selected && <FormatModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
