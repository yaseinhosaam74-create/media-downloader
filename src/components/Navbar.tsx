"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownloadCloud, FiMenu, FiX, FiHome, FiUser } from "react-icons/fi";

const LINKS = [
  { href: "/",      label: "الرئيسية",   icon: FiHome },
  { href: "/about", label: "حول المطور", icon: FiUser },
];

export default function Navbar() {
  const path   = usePathname();
  const [open, setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .5, ease: "easeOut" }}
        style={{
          position: "sticky", top: 0, zIndex: 100, height: 56,
          background: scrolled ? "rgba(10,10,10,.92)" : "#0a0a0a",
          borderBottom: `1px solid ${scrolled ? "#2a2a2a" : "#1a1a1a"}`,
          backdropFilter: scrolled ? "blur(16px)" : "none",
          transition: "all .3s",
        }}
      >
        <div style={{
          maxWidth: 900, margin: "0 auto", height: "100%",
          padding: "0 16px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div whileHover={{ rotate: -10, scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}
              style={{ width: 34, height: 34, background: "linear-gradient(135deg,#ff2d2d,#ff6b35)", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FiDownloadCloud color="white" size={17} strokeWidth={2.5} />
            </motion.div>
            <span style={{ fontFamily: "Cairo", fontWeight: 900, fontSize: 19, color: "white", letterSpacing: "-0.5px" }}>
              Media<span style={{ color: "#ff2d2d" }}>Drop</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav style={{ display: "flex", gap: 4, alignItems: "center" }} className="hide-xs">
            {LINKS.map(l => {
              const Icon = l.icon;
              const active = path === l.href;
              return (
                <Link key={l.href} href={l.href} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 999, textDecoration: "none",
                  fontFamily: "Cairo", fontSize: 13, fontWeight: 700,
                  background: active ? "#1a1a1a" : "transparent",
                  color: active ? "white" : "#888",
                  border: active ? "1px solid #2a2a2a" : "1px solid transparent",
                  transition: "all .2s",
                }}>
                  <Icon size={14} />
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Hamburger */}
          <motion.button
            whileTap={{ scale: .9 }}
            onClick={() => setOpen(o => !o)}
            className="show-xs"
            style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10,
              width: 38, height: 38, display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", color: "white" }}
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200 }} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 240,
                background: "#111", borderLeft: "1px solid #2a2a2a", zIndex: 201, padding: 20 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <span style={{ fontFamily: "Cairo", fontWeight: 900, fontSize: 18, color: "white" }}>
                  Media<span style={{ color: "#ff2d2d" }}>Drop</span>
                </span>
                <motion.button whileTap={{ scale: .9 }} onClick={() => setOpen(false)}
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8,
                    width: 32, height: 32, display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", color: "#888" }}>
                  <FiX size={15} />
                </motion.button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {LINKS.map((l, i) => {
                  const Icon = l.icon;
                  const active = path === l.href;
                  return (
                    <motion.div key={l.href}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * .07 }}>
                      <Link href={l.href} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "13px 16px", borderRadius: 12, textDecoration: "none",
                        fontFamily: "Cairo", fontWeight: 700, fontSize: 15,
                        background: active ? "#1a1a1a" : "transparent",
                        color: active ? "white" : "#888",
                        border: active ? "1px solid #2a2a2a" : "1px solid transparent",
                      }}>
                        <Icon size={17} style={{ color: active ? "#ff2d2d" : "#888" }} />
                        {l.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .hide-xs { display: flex; }
        .show-xs  { display: none; }
        @media (max-width: 560px) {
          .hide-xs { display: none !important; }
          .show-xs  { display: flex !important; }
        }
      `}</style>
    </>
  );
}
