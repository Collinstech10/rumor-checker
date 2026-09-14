import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://qgpeqlbnetewlikwiudp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncGVxbGJuZXRld2xpa3dpdWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjQyMzksImV4cCI6MjA5MjEwMDIzOX0.O060OSKMTVckbYYBRCkPskUC0TUVdBkfjh-XWY57rIQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

const CATEGORIES = [
  { id: "class",      label: "Class Gist",    icon: "🎓" },
  { id: "lecturer",   label: "Lecturer Gist", icon: "👨‍🏫" },
  { id: "campus",     label: "Campus Gist",   icon: "🏫" },
  { id: "school",     label: "School Issues", icon: "⚠️" },
  { id: "nationwide", label: "Nationwide",    icon: "🌐" },
  { id: "union",      label: "Union",         icon: "✝️" },
];
const CAT_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));
const NAV = [
  { id: "home",    label: "Home",   icon: "⊞" },
  { id: "feed",    label: "Feed",   icon: "📰" },
  { id: "video",   label: "Videos", icon: "🎬" },
  { id: "post",    label: "Post",   icon: "✏️" },
  { id: "profile", label: "Me",     icon: "👤" },
];

const GEMINI_KEY = "AIzaSyAbIHaB__m6_SBCiq4rhfGRzzkS7vDBpyM";
const PAYSTACK_PUBLIC_KEY = "pk_live_eb2af552514f29bf33169bfc9432666c26d26bd1";
const VERIFICATION_PRICE = 2000; // ₦2,000
const FREE_AI_LIMIT = 5; // free users get 5 AI messages per day
const MAX_CHARS_FREE = 500; // free users post limit
const PREMIUM_THEMES = {
  default:  { bg: "#040812", accent: "#c9a84c", glow: "#e8c96a" },
  gold:     { bg: "#1a1500", accent: "#ffd700", glow: "#ffec6e" },
  purple:   { bg: "#0f0a1a", accent: "#9c27b0", glow: "#ce93d8" },
  blue:     { bg: "#0a0f1a", accent: "#2196f3", glow: "#90caf9" },
  red:      { bg: "#1a0a0a", accent: "#ef5350", glow: "#ff8a80" },
};

// ── SPLASH SCREEN (Canvas Animation) ─────────────────────────
function SplashScreen({ onDone }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const startRef  = useRef(null);
  const DURATION  = 15000; // 15 seconds

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Particles ──
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.6 ? "#e8c96a" : Math.random() > 0.5 ? "#c9a84c" : "#1de9b6",
    }));

    // ── DNA helix strands ──
    const helixPoints = 60;

    // ── Ripple rings ──
    const rings = [];
    let lastRing = 0;

    // ── Text phases ──
    const phases = [
      { time: 0,    text: "",               sub: "" },
      { time: 1500, text: "TRUTH",          sub: "" },
      { time: 3500, text: "TRUTH",          sub: "finding it matters" },
      { time: 5500, text: "LYNK",           sub: "" },
      { time: 7000, text: "LYNK",           sub: "connecting your campus" },
      { time: 9000, text: "TruthLynk",      sub: "Clarity. Truth. Campus." },
      { time: 11500,text: "TruthLynk",      sub: "Your school's truth engine 🔍" },
    ];

    const draw = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      // ── Background ──
      ctx.fillStyle = "#02040e";
      ctx.fillRect(0, 0, W, H);

      // ── Radial background glow ──
      const glowR = Math.min(W, H) * 0.55 * (0.5 + 0.5 * Math.sin(elapsed * 0.001));
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      grd.addColorStop(0, "rgba(201,168,76,0.07)");
      grd.addColorStop(0.5, "rgba(201,168,76,0.03)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // ── Grid lines ──
      ctx.strokeStyle = "rgba(201,168,76,0.04)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ── DNA Helix ──
      const helixW = Math.min(W * 0.12, 60);
      const helixH = H * 0.6;
      const helixX = cx;
      const helixY = cy - helixH / 2;
      const helixSpeed = elapsed * 0.002;

      for (let i = 0; i < helixPoints; i++) {
        const t    = i / helixPoints;
        const y    = helixY + t * helixH;
        const wave = Math.sin(t * Math.PI * 4 + helixSpeed);
        const x1   = helixX + wave * helixW;
        const x2   = helixX - wave * helixW;
        const alpha = 0.15 + 0.3 * Math.abs(wave);

        // Strand 1
        ctx.beginPath();
        ctx.arc(x1, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${alpha})`;
        ctx.fill();

        // Strand 2
        ctx.beginPath();
        ctx.arc(x2, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,201,106,${alpha})`;
        ctx.fill();

        // Cross bridges
        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y); ctx.lineTo(x2, y);
          ctx.strokeStyle = `rgba(201,168,76,${alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // ── Particles ──
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.4 + 0.6 * progress);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // ── Particle connections ──
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${(1 - dist/80) * 0.12})`;
            ctx.stroke();
          }
        }
      }

      // ── Ripple rings ──
      if (elapsed - lastRing > 1800) {
        rings.push({ r: 0, alpha: 0.8, born: elapsed });
        lastRing = elapsed;
      }
      rings.forEach((ring, idx) => {
        const age = elapsed - ring.born;
        ring.r = age * 0.12;
        ring.alpha = Math.max(0, 0.6 - age * 0.0005);
        if (ring.alpha <= 0) { rings.splice(idx, 1); return; }
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201,168,76,${ring.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // ── Central logo circle ──
      const logoR = Math.min(W, H) * 0.1;
      const logoPulse = 1 + 0.05 * Math.sin(elapsed * 0.003);
      const logoGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, logoR * logoPulse);
      logoGrd.addColorStop(0, "#c9a84c");
      logoGrd.addColorStop(1, "#8a6820");
      ctx.beginPath();
      ctx.arc(cx, cy, logoR * logoPulse, 0, Math.PI * 2);
      ctx.fillStyle = logoGrd;
      ctx.shadowColor = "#e8c96a";
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0;

      // ── Magnifying glass icon ──
      const mg = logoR * 0.55;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = logoR * 0.1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx - mg * 0.1, cy - mg * 0.1, mg * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + mg * 0.32, cy + mg * 0.32);
      ctx.lineTo(cx + mg * 0.75, cy + mg * 0.75);
      ctx.stroke();

      // ── Text phases ──
      let currentPhase = phases[0];
      for (const phase of phases) {
        if (elapsed >= phase.time) currentPhase = phase;
      }

      if (currentPhase.text) {
        const isLogo = currentPhase.text === "TruthLynk";
        const textY  = cy + logoR * 2.5;

        // Main text
        const fontSize = isLogo ? Math.min(W * 0.1, 48) : Math.min(W * 0.14, 64);
        ctx.font = `900 ${fontSize}px 'Playfair Display', Georgia, serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Glow effect on text
        ctx.shadowColor = "#e8c96a";
        ctx.shadowBlur = 20;
        const grad = ctx.createLinearGradient(cx - 100, 0, cx + 100, 0);
        grad.addColorStop(0, "#e8c96a");
        grad.addColorStop(0.5, "#ffffff");
        grad.addColorStop(1, "#c9a84c");
        ctx.fillStyle = grad;
        ctx.fillText(currentPhase.text, cx, textY);
        ctx.shadowBlur = 0;

        // Sub text
        if (currentPhase.sub) {
          ctx.font = `400 ${Math.min(W * 0.04, 18)}px 'Outfit', Arial, sans-serif`;
          ctx.fillStyle = "rgba(168,213,168,0.85)";
          ctx.fillText(currentPhase.sub, cx, textY + fontSize * 0.75);
        }
      }

      // ── Progress bar at bottom ──
      const barW = W * 0.6;
      const barH = 3;
      const barX = (W - barW) / 2;
      const barY = H - 50;
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 2);
      ctx.fill();
      const progGrd = ctx.createLinearGradient(barX, 0, barX + barW, 0);
      progGrd.addColorStop(0, "#8a6820");
      progGrd.addColorStop(1, "#e8c96a");
      ctx.fillStyle = progGrd;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * progress, barH, 2);
      ctx.fill();

      // ── Skip hint ──
      ctx.font = `300 ${Math.min(W * 0.03, 13)}px 'Outfit', Arial, sans-serif`;
      ctx.fillStyle = "rgba(201,168,76,0.35)";
      ctx.textAlign = "center";
      ctx.fillText("tap to skip", W / 2, H - 22);

      // ── Fade out at end ──
      if (progress > 0.85) {
        const fadeAlpha = (progress - 0.85) / 0.15;
        ctx.fillStyle = `rgba(6,14,6,${fadeAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        onDone();
      }
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      onClick={() => { onDone(); }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 9999, cursor: "pointer", background: "#02040e", touchAction: "manipulation" }}
    />
  );
}


const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAbIHaB__m6_SBCiq4rhfGRzzkS7vDBpyM";

// ── LOGIN SOUND (Web Audio API — no file needed) ──────────────
function playLoginSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [
      { freq: 523.25, start: 0,    dur: 0.15 }, // C5
      { freq: 659.25, start: 0.12, dur: 0.15 }, // E5
      { freq: 783.99, start: 0.24, dur: 0.15 }, // G5
      { freq: 1046.5, start: 0.36, dur: 0.35 }, // C6 (long)
    ];
    notes.forEach(({ freq, start, dur }) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    });
  } catch (e) { /* Audio not supported */ }
}

// ── NOTIFICATION SOUND ────────────────────────────────────────
function playNotifSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

// ── PUSH NOTIFICATIONS HELPER ──────────────────────────────────
async function registerPush(userId) {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    const reg = await navigator.serviceWorker.register("/sw.js");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    // Use a simple notification via the Notifications API (no VAPID needed)
    return reg;
  } catch (e) { console.error("Push registration failed:", e); }
}

async function sendLocalNotification(title, body) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification(title, {
        body,
        icon: "/favicon.svg",
        badge: "/favicon.svg",
        vibrate: [100, 50, 100],
      });
    } else {
      new Notification(title, { body, icon: "/favicon.svg" });
    }
  }
}
const REACTIONS = ["❤️","😮","😂","😡","🔥","👍"];
const ONBOARDING_STEPS = [
  { icon: "🔍", title: "Welcome to TruthLynk", desc: "Your school's truth engine — where gists are verified, rumors are checked, and campus news lives.", bg: "linear-gradient(135deg,#02040e,#040d1e)" },
  { icon: "📢", title: "Post Gists Freely", desc: "Share what's happening on campus. Post anonymously or with your name. Add photos, videos and voice notes.", bg: "linear-gradient(135deg,#04091a,#060f28)" },
  { icon: "✅", title: "AI Fact-Checks Everything", desc: "Every post is automatically verified by Gemini AI — so you always know what's likely true.", bg: "linear-gradient(135deg,#06081a,#080c24)" },
  { icon: "🏆", title: "Earn XP & Badges", desc: "The more you post and engage, the more XP you earn. Climb the leaderboard and become a campus legend.", bg: "linear-gradient(135deg,#04091a,#0a0620)" },
  { icon: "🔐", title: "Get Verified", desc: "Pay ₦2,000 once to get your verified checkmark — just like Twitter. Stand out from the crowd.", bg: "linear-gradient(135deg,#0a0800,#1a1200)" },
];

// ── LANGUAGES ─────────────────────────────────────────────────
const LANGS = {
  en: {
    home: "Home", feed: "Feed", post: "Post", saved: "Saved", profile: "Me",
    greeting: "Good to see you,", hi: "Hi", happening: "What's happening today?",
    browse: "Browse Feed", postGist: "Post Gist", categories: "Categories",
    recentGists: "Recent Gists", viewAll: "View all", trending: "🔥 Trending Now",
    postTitle: "Post a Gist", postSub: "Share what's happening in your school.",
    titlePlaceholder: "Title / Headline *", contentPlaceholder: "What happened? Give full details...",
    category: "Category *", tags: "Tags (comma separated, optional)",
    anonymous: "Post anonymously", attach: "Attach Photos / Videos (max 30MB)",
    record: "Record Voice Note", submitPost: "🚀 Post Gist", posting: "Uploading media...",
    posted: "Gist posted! 🎉 AI is checking it now...", memories: "Memories",
    memoriesSub: "Search past gists from your school.", searchPast: "Search past gists...",
    savedPosts: "🔖 Saved Posts", savedSub: "Posts you have bookmarked",
    noSaved: "No saved posts yet.", tapSave: "Tap 📑 on any post to save it",
    notifications: "Notifications", markRead: "Mark all read", noNotifs: "No notifications yet",
    editProfile: "✏️ Edit Profile", enablePush: "🔔 Enable Push Notifications",
    installApp: "📲 Install TruthLynk App", logout: "🚪 Log Out",
    login: "Log In", signup: "Sign Up", createAccount: "Create Account",
    email: "Email address", password: "Password (min 6 chars)", fullName: "Full name",
    username: "Username *", school: "School name", tagline: "Clarity. Truth. Campus.",
    truthEngine: "Your school's truth engine",
  },
  yo: {
    home: "Ile", feed: "Iroyin", post: "Firanṣẹ", saved: "Fipamọ", profile: "Mi",
    greeting: "Ẹ káàbọ̀,", hi: "Bawo", happening: "Kini n ṣẹlẹ loni?",
    browse: "Wo Iroyin", postGist: "Firanṣẹ Iroyin", categories: "Awọn ẹka",
    recentGists: "Awọn Iroyin Tuntun", viewAll: "Wo gbogbo", trending: "🔥 Olokiki Julọ",
    postTitle: "Firanṣẹ Iroyin", postSub: "Pin ohun ti n ṣẹlẹ ni ile-iwe rẹ.",
    titlePlaceholder: "Akọle *", contentPlaceholder: "Kini ṣẹlẹ? Sọ gbogbo alaye...",
    category: "Ẹka *", tags: "Awọn aami (ya pẹlu comma)",
    anonymous: "Firanṣẹ laisilorukọ", attach: "Ṣafikun Aworan/Fidio (max 30MB)",
    record: "Gbọnrọ Ohun", submitPost: "🚀 Firanṣẹ", posting: "Nfọsi media...",
    posted: "Iroyin ti firanṣẹ! 🎉", memories: "Itan",
    memoriesSub: "Wa awọn iroyin atijọ.", searchPast: "Wa iroyin atijọ...",
    savedPosts: "🔖 Awọn Iroyin Ti Fipamọ", savedSub: "Awọn iroyin ti o fipamọ",
    noSaved: "Ko si iroyin ti o fipamọ.", tapSave: "Tẹ 📑 lori iroyin lati fipamọ",
    notifications: "Iwifunni", markRead: "Samisi bi ti ka", noNotifs: "Ko si iwifunni",
    editProfile: "✏️ Ṣatunṣe Profaili", enablePush: "🔔 Mu Iwifunni ṣiṣẹ",
    installApp: "📲 Fọwọsi TruthLynk", logout: "🚪 Jade",
    login: "Wọle", signup: "Forukọsilẹ", createAccount: "Ṣẹda Akọọlẹ",
    email: "Adirẹsi imeeli", password: "Ọrọ igbaniwọle (o kere 6)", fullName: "Orukọ kikun",
    username: "Orukọ olumulo *", school: "Orukọ ile-iwe", tagline: "Ìmọ. Òtítọ́. Àgbàlá.",
    truthEngine: "Ẹrọ otitọ ile-iwe rẹ",
  },
  ig: {
    home: "Ụlọ", feed: "Akụkọ", post: "Zipu", saved: "Chekwaa", profile: "Mu",
    greeting: "Nnọọ,", hi: "Ndewo", happening: "Gịnị na-eme taa?",
    browse: "Lee Akụkọ", postGist: "Zipu Akụkọ", categories: "Ụdị",
    recentGists: "Akụkọ Ọhụrụ", viewAll: "Lee niile", trending: "🔥 Ihe Na-ewu Ewu",
    postTitle: "Zipu Akụkọ", postSub: "Kọọ ihe na-eme n'ụlọ akwụkwọ gị.",
    titlePlaceholder: "Aha *", contentPlaceholder: "Gịnị mere? Kọọ nkọwa ọ bụla...",
    category: "Ụdị *", tags: "Akara (kee site na comma)",
    anonymous: "Zipu n'aha ọzọ", attach: "Tinye Foto/Vidiyo (max 30MB)",
    record: "Dekọọ Olu", submitPost: "🚀 Zipu", posting: "Na-ebufe media...",
    posted: "Akụkọ ezipụla! 🎉", memories: "Ndepụta",
    memoriesSub: "Chọọ akụkọ ochie.", searchPast: "Chọọ akụkọ ochie...",
    savedPosts: "🔖 Akụkọ Echekwara", savedSub: "Akụkọ i chekwara",
    noSaved: "Enweghị akụkọ echekwara.", tapSave: "Pịa 📑 n'akụkọ ọ bụla iji chekwaa",
    notifications: "Ọkwa", markRead: "Kọwaa dị ka agụrụ", noNotifs: "Enweghị ọkwa",
    editProfile: "✏️ Dezie Profaịlụ", enablePush: "🔔 Kwado Ọkwa",
    installApp: "📲 Wụnye TruthLynk", logout: "🚪 Pụọ",
    login: "Banye", signup: "Debanye Aha", createAccount: "Mepụta Akaụntụ",
    email: "Adreesị ozi-e", password: "Okwuntughe (o kere 6)", fullName: "Aha ọzọ ọzọ",
    username: "Aha ọrụ *", school: "Aha ụlọ akwụkwọ", tagline: "Àmà. Eziokwu. Ogige.",
    truthEngine: "Igwe eziokwu ụlọ akwụkwọ gị",
  },
  pcm: {
    home: "House", feed: "Gist", post: "Drop", saved: "Saved", profile: "Me",
    greeting: "How far,", hi: "Oga", happening: "Wetin dey happen today?",
    browse: "See Gist", postGist: "Drop Gist", categories: "Departments",
    recentGists: "Fresh Gist", viewAll: "See all", trending: "🔥 Hot Right Now",
    postTitle: "Drop Gist", postSub: "Share wetin dey happen for your school.",
    titlePlaceholder: "Heading *", contentPlaceholder: "Wetin happen? Give full gist...",
    category: "Department *", tags: "Tags (separate by comma)",
    anonymous: "Drop am anon", attach: "Add Photo/Video (max 30MB)",
    record: "Record Voice Note", submitPost: "🚀 Drop am", posting: "Dey upload...",
    posted: "Gist don drop! 🎉", memories: "Old Gist",
    memoriesSub: "Search old gist for your school.", searchPast: "Search old gist...",
    savedPosts: "🔖 Saved Gist", savedSub: "Gist wey you save",
    noSaved: "No saved gist yet.", tapSave: "Tap 📑 for any gist to save am",
    notifications: "Alert", markRead: "Mark all as read", noNotifs: "No alert yet",
    editProfile: "✏️ Edit Profile", enablePush: "🔔 Turn On Notification",
    installApp: "📲 Install TruthLynk", logout: "🚪 Log Out",
    login: "Log In", signup: "Sign Up", createAccount: "Create Account",
    email: "Email address", password: "Password (at least 6)", fullName: "Full name",
    username: "Username *", school: "School name", tagline: "Clarity. Truth. Campus.",
    truthEngine: "Your school truth engine",
  },
};

// ── XP & BADGES ───────────────────────────────────────────────
const BADGE_DEFS = [
  { id: "first_post",    icon: "🌱", name: "First Gist",     desc: "Posted your first gist",      xp: 10  },
  { id: "ten_posts",     icon: "📝", name: "Regular",        desc: "Posted 10 gists",              xp: 50  },
  { id: "fifty_posts",   icon: "✍️", name: "Contributor",    desc: "Posted 50 gists",              xp: 200 },
  { id: "viral",         icon: "🔥", name: "Viral",          desc: "Got 50+ likes on a post",      xp: 100 },
  { id: "streak_7",      icon: "⚡", name: "Week Warrior",   desc: "7-day posting streak",         xp: 70  },
  { id: "streak_30",     icon: "💎", name: "Legend",         desc: "30-day posting streak",        xp: 300 },
  { id: "truth_seeker",  icon: "🔍", name: "Truth Seeker",   desc: "Had 5 posts verified true",    xp: 150 },
  { id: "popular",       icon: "⭐", name: "Popular",        desc: "Got 100+ total likes",         xp: 200 },
  { id: "voice_first",   icon: "🎙️", name: "Voice of Campus","desc": "Posted first voice note",   xp: 20  },
];

function getLevelInfo(xp) {
  if (xp < 50)   return { level: 1, name: "Newbie",      color: "#9e9e9e", next: 50 };
  if (xp < 150)  return { level: 2, name: "Explorer",    color: "#c9a84c", next: 150 };
  if (xp < 400)  return { level: 3, name: "Contributor", color: "#2196f3", next: 400 };
  if (xp < 800)  return { level: 4, name: "Influencer",  color: "#9c27b0", next: 800 };
  if (xp < 1500) return { level: 5, name: "Veteran",     color: "#ff9800", next: 1500 };
  return { level: 6, name: "Legend", color: "#f44336", next: null };
}

function timeAgo(date) {
  const s = (Date.now() - new Date(date)) / 1000;
  if (s < 60)    return "Just now";
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  body{overscroll-behavior:none;background:#040812;font-family:'Outfit',sans-serif}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-track{background:#040812}
  ::-webkit-scrollbar-thumb{background:#c9a84c40;border-radius:2px}
  button,a,[role=button]{touch-action:manipulation;cursor:pointer}

  .pill-nav{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(4,8,18,0.95);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(201,168,76,0.2);border-radius:60px;padding:8px 10px;display:flex;gap:2px;z-index:100;box-shadow:0 8px 40px rgba(0,0,0,0.7),0 0 0 1px rgba(201,168,76,0.08),inset 0 1px 0 rgba(255,255,255,0.04)}
  .pill-btn{background:none;border:none;cursor:pointer;color:rgba(201,168,76,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:9px;padding:8px 12px;border-radius:50px;transition:all .3s cubic-bezier(0.34,1.56,0.64,1);font-family:'Outfit',sans-serif;font-weight:600;min-width:50px;letter-spacing:.5px;white-space:nowrap}
  .pill-btn.active{background:linear-gradient(135deg,rgba(201,168,76,0.18),rgba(201,168,76,0.06));color:#e8c96a;box-shadow:0 0 20px rgba(201,168,76,0.15),inset 0 1px 0 rgba(201,168,76,0.12)}
  .pill-btn:active{transform:scale(0.9)}
  .pill-icon{font-size:19px;line-height:1;transition:transform .3s cubic-bezier(0.34,1.56,0.64,1)}
  .pill-btn.active .pill-icon{transform:scale(1.2)}

  .cat-card{background:rgba(8,12,30,0.85);border:1px solid rgba(201,168,76,0.12);border-radius:18px;padding:16px 12px;cursor:pointer;transition:all .25s;text-align:center}
  .cat-card:active{background:rgba(201,168,76,0.07);border-color:rgba(201,168,76,0.4);transform:scale(0.97)}
  .gist-card{background:rgba(6,10,24,0.9);border:1px solid rgba(201,168,76,0.09);border-radius:20px;padding:16px;transition:all .25s;margin-bottom:12px}
  .gist-card:active{background:rgba(201,168,76,0.04);border-color:rgba(201,168,76,0.25)}

  .tab-btn{background:rgba(6,10,24,0.7);border:1px solid rgba(201,168,76,0.1);border-radius:30px;padding:7px 16px;font-size:12px;cursor:pointer;color:rgba(201,168,76,0.45);transition:all .2s;font-family:'Outfit',sans-serif;white-space:nowrap;font-weight:600}
  .tab-btn.active{background:rgba(201,168,76,0.12);color:#e8c96a;border-color:rgba(201,168,76,0.35)}

  .primary-btn{background:linear-gradient(135deg,#b8912a,#e8c96a,#c9a84c);border:none;border-radius:16px;padding:14px 20px;color:#040812;font-size:15px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .3s;font-family:'Outfit',sans-serif;width:100%;letter-spacing:.3px;box-shadow:0 4px 24px rgba(201,168,76,0.25)}
  .primary-btn:hover:not(:disabled){box-shadow:0 6px 32px rgba(201,168,76,0.45);transform:translateY(-1px)}
  .primary-btn:active{transform:scale(0.98)}
  .primary-btn:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}
  .secondary-btn{background:rgba(6,10,24,0.8);border:1px solid rgba(201,168,76,0.18);border-radius:14px;padding:12px 16px;color:rgba(201,168,76,0.75);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;font-family:'Outfit',sans-serif}
  .secondary-btn:active{background:rgba(201,168,76,0.06);border-color:rgba(201,168,76,0.4)}

  .rc-input{background:rgba(6,10,24,0.9);border:1px solid rgba(201,168,76,0.15);border-radius:14px;padding:14px 16px;color:#e8dfc8;font-size:15px;font-family:'Outfit',sans-serif;outline:none;width:100%;transition:all .2s;-webkit-appearance:none}
  .rc-input:focus{border-color:rgba(201,168,76,0.55);box-shadow:0 0 0 3px rgba(201,168,76,0.07)}
  .rc-input::placeholder{color:rgba(201,168,76,0.22)}

  .badge{background:rgba(201,168,76,0.12);color:#c9a84c;font-size:10px;padding:3px 10px;border-radius:12px;font-weight:700;display:inline-block;border:1px solid rgba(201,168,76,0.2);letter-spacing:.5px}
  .section-title{font-size:17px;font-weight:800;color:#e8dfc8;letter-spacing:-.3px;font-family:'Outfit',sans-serif}
  .view-all{font-size:12px;color:#c9a84c;cursor:pointer;font-weight:700;background:none;border:none;font-family:'Outfit',sans-serif;padding:4px;letter-spacing:.3px;opacity:.8}
  .like-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:4px;font-size:13px;color:rgba(201,168,76,0.4);font-family:'Outfit',sans-serif;padding:8px;border-radius:10px;transition:all .2s;min-height:36px;font-weight:600}
  .like-btn:active{background:rgba(201,168,76,0.07)}
  .like-btn.liked{color:#ef5350}
  .error-msg{background:rgba(40,8,8,0.9);border:1px solid rgba(239,83,80,0.25);border-radius:14px;padding:12px 16px;color:#ff8a80;font-size:13px;margin-bottom:12px}
  .success-msg{background:rgba(8,20,8,0.9);border:1px solid rgba(201,168,76,0.25);border-radius:14px;padding:12px 16px;color:#c9a84c;font-size:13px;margin-bottom:12px}
  .spinner{width:20px;height:20px;border:2px solid rgba(201,168,76,0.15);border-top-color:#c9a84c;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideUp{from{transform:translateY(28px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes goldShimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  @keyframes goldPulse{0%,100%{opacity:.6}50%{opacity:1}}
  .slide-up{animation:slideUp .4s cubic-bezier(0.34,1.16,0.64,1)}
  textarea.rc-input{resize:none}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes wave{from{height:6px;opacity:.4}to{height:32px;opacity:1}}
  .waveform-bar{width:4px;border-radius:2px;background:#c9a84c;animation:wave .8s ease-in-out infinite alternate}
  .media-viewer{position:fixed;inset:0;background:rgba(2,4,12,0.98);z-index:300;display:flex;align-items:center;justify-content:center;flex-direction:column}
  audio{width:100%;accent-color:#c9a84c;border-radius:8px}
  .reaction-picker{position:absolute;bottom:56px;left:14px;background:rgba(4,8,18,0.97);border:1px solid rgba(201,168,76,0.2);border-radius:30px;padding:8px 12px;display:flex;gap:6px;z-index:10;box-shadow:0 8px 40px rgba(0,0,0,0.9);backdrop-filter:blur(20px)}
  .gold-text{background:linear-gradient(135deg,#c9a84c,#f0d878,#c9a84c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900}

  /* ── SKELETON LOADING ── */
  .skeleton{background:linear-gradient(90deg,rgba(201,168,76,0.05) 25%,rgba(201,168,76,0.12) 50%,rgba(201,168,76,0.05) 75%);background-size:200% 100%;animation:skelshimmer 1.5s infinite;border-radius:10px}
  @keyframes skelshimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

  /* ── STORIES ── */
  .story-ring{border-radius:50%;padding:2px;background:linear-gradient(135deg,#c9a84c,#f0d878,#c9a84c)}
  .story-ring-seen{background:rgba(201,168,76,0.2)}
  .story-avatar{border-radius:50%;border:2px solid #02040e}

  /* ── HASHTAGS & MENTIONS ── */
  .hashtag{color:#e8c96a;font-weight:700;cursor:pointer}
  .mention{color:#90caf9;font-weight:700;cursor:pointer}

  /* ── PULL TO REFRESH ── */
  @keyframes rotate360{to{transform:rotate(360deg)}}
  .ptr-spinner{animation:rotate360 .8s linear infinite;display:inline-block}

  /* ── PAGE TRANSITIONS ── */
  @keyframes slideInRight{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes slideInUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
  .page-enter{animation:slideInRight .3s cubic-bezier(0.34,1.16,0.64,1)}

  /* ── MICRO ANIMATIONS ── */
  .tap-scale:active{transform:scale(0.94);transition:transform .1s}
  .hover-lift{transition:transform .2s,box-shadow .2s}
  .hover-lift:active{transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,168,76,0.2)}

  /* ── IMAGE GALLERY ── */
  .img-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:4px;border-radius:12px;overflow:hidden}
  .img-grid-3{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:4px;border-radius:12px;overflow:hidden}
  .img-grid-3 .img-main{grid-column:1/-1}
`;


// ── UTILITIES ─────────────────────────────────────────────────
// Parse hashtags and mentions in text
function parseText(text, onHashtag, onMention) {
  if (!text) return null;
  const parts = text.split(/(\#[\w]+|@[\w]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('#')) return <span key={i} className="hashtag" onClick={() => onHashtag && onHashtag(part.slice(1))}>{part}</span>;
    if (part.startsWith('@')) return <span key={i} className="mention">{part}</span>;
    return part;
  });
}

// Lazy image with blur-up effect
function LazyImage({ src, alt, style, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);
  if (error || !src) return null;
  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }} onClick={onClick}>
      {!loaded && <div className="skeleton" style={{ position: "absolute", inset: 0 }} />}
      <img src={src} alt={alt || ""} onLoad={() => setLoaded(true)} onError={() => setError(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity .3s", opacity: loaded ? 1 : 0, display: "block" }} />
    </div>
  );
}

// Skeleton post card
function SkeletonCard() {
  return (
    <div style={{ background: "rgba(6,10,24,0.9)", border: "1px solid rgba(201,168,76,0.08)", borderRadius: 20, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 12, width: "40%", marginBottom: 6 }} />
          <div className="skeleton" style={{ height: 10, width: "25%" }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 14, width: "85%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: "100%", marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 12, width: "70%", marginBottom: 14 }} />
      <div className="skeleton" style={{ height: 160, width: "100%", borderRadius: 12, marginBottom: 12 }} />
      <div style={{ display: "flex", gap: 12 }}>
        <div className="skeleton" style={{ height: 28, width: 60, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 28, width: 60, borderRadius: 8 }} />
      </div>
    </div>
  );
}

// ── STORIES BAR ───────────────────────────────────────────────
function StoriesBar({ user, posts }) {
  const [viewedStories, setViewedStories] = useState(() => {
    try { return new Set(JSON.parse(sessionStorage.getItem("tl_viewed_stories") || "[]")); } catch { return new Set(); }
  });
  const [activeStory, setActiveStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyTimerRef = useRef(null);

  // Get posts from last 24h as stories
  const stories = posts.filter(p => {
    const age = (Date.now() - new Date(p.created_at)) / 3600000;
    return age < 24 && p.post_media?.length > 0;
  }).slice(0, 10);

  // My story (own posts with media)
  const myStories = posts.filter(p => p.author_id === user.id && p.post_media?.length > 0).slice(0, 1);

  const openStory = (story) => {
    setActiveStory(story);
    setStoryProgress(0);
    const newViewed = new Set([...viewedStories, story.id]);
    setViewedStories(newViewed);
    sessionStorage.setItem("tl_viewed_stories", JSON.stringify([...newViewed]));
  };

  useEffect(() => {
    if (!activeStory) return;
    storyTimerRef.current = setInterval(() => {
      setStoryProgress(p => {
        if (p >= 100) { setActiveStory(null); return 0; }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(storyTimerRef.current);
  }, [activeStory]);

  if (stories.length === 0 && myStories.length === 0) return null;

  return (
    <>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "4px 0 8px", scrollbarWidth: "none" }}>
        {/* Add your story */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }} onClick={() => {}}>
          <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "2px dashed rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>+</div>
          <div style={{ fontSize: 10, color: "rgba(201,168,76,0.5)", fontWeight: 600 }}>Your Story</div>
        </div>
        {/* Stories */}
        {stories.map((story, i) => {
          const seen = viewedStories.has(story.id);
          return (
            <div key={story.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }} onClick={() => openStory(story)}>
              <div className={`story-ring ${seen ? "story-ring-seen" : ""}`} style={{ width: 62, height: 62, padding: 2 }}>
                <Avatar user={story.profiles} size={58} />
              </div>
              <div style={{ fontSize: 10, color: seen ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.7)", fontWeight: 600, maxWidth: 58, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {story.profiles?.username || "User"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Story viewer */}
      {activeStory && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 500, display: "flex", flexDirection: "column" }} onClick={() => setActiveStory(null)}>
          {/* Progress bar */}
          <div style={{ height: 3, background: "rgba(255,255,255,0.2)", margin: "12px 12px 0" }}>
            <div style={{ height: "100%", background: "#c9a84c", width: `${storyProgress}%`, transition: "width .1s linear", borderRadius: 3 }} />
          </div>
          <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar user={activeStory.profiles} size={34} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{activeStory.profiles?.full_name || activeStory.profiles?.username}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{timeAgo(activeStory.created_at)}</div>
            </div>
            <button onClick={() => setActiveStory(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            {activeStory.post_media[0]?.media_type === "video"
              ? <video src={activeStory.post_media[0]?.url} autoPlay loop style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 16 }} onClick={e => e.stopPropagation()} />
              : <img src={activeStory.post_media[0]?.url} alt="" style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 16, objectFit: "contain" }} />
            }
          </div>
          <div style={{ padding: "14px 16px", background: "linear-gradient(to top,rgba(0,0,0,0.8),transparent)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{activeStory.title}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{activeStory.content?.slice(0, 100)}</div>
          </div>
        </div>
      )}
    </>
  );
}

// ── PULL TO REFRESH ───────────────────────────────────────────
function usePullToRefresh(onRefresh) {
  const [pulling, setPulling]   = useState(false);
  const [pullY, setPullY]       = useState(0);
  const startY = useRef(0);

  const onTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const onTouchMove  = (e) => {
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0 && window.scrollY === 0) { setPullY(Math.min(diff, 80)); setPulling(diff > 60); }
  };
  const onTouchEnd   = () => {
    if (pulling) onRefresh();
    setPullY(0); setPulling(false);
  };

  return { onTouchStart, onTouchMove, onTouchEnd, pullY, pulling };
}

// ── HASHTAG FEED ──────────────────────────────────────────────
function HashtagFeed({ tag, posts, currentUser, onLike, onOpenComments, onSave, savedIds, onEdit, onDelete, onClose }) {
  const filtered = posts.filter(p => p.tags?.includes(tag.toLowerCase()) || p.content?.toLowerCase().includes(`#${tag.toLowerCase()}`) || p.title?.toLowerCase().includes(`#${tag.toLowerCase()}`));
  return (
    <div style={{ position: "fixed", inset: 0, background: "linear-gradient(160deg,#02040e,#040d1e)", zIndex: 400, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(201,168,76,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.6)", fontSize: 20, cursor: "pointer" }}>←</button>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#e8c96a" }}>#{tag}</div>
          <div style={{ fontSize: 12, color: "rgba(201,168,76,0.4)" }}>{filtered.length} posts</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", paddingBottom: 110 }}>
        {filtered.length === 0
          ? <div style={{ textAlign: "center", padding: 40, color: "rgba(201,168,76,0.3)" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
              <div>No posts with #{tag} yet</div>
            </div>
          : filtered.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} onLike={onLike} onOpenComments={onOpenComments} onSave={onSave} isSaved={savedIds?.has(post.id)} onEdit={onEdit} onDelete={onDelete} />)
        }
      </div>
    </div>
  );
}

// ── SHARE APP INVITE ──────────────────────────────────────────
function shareInvite(user) {
  const text = `Hey! Join me on TruthLynk — your school's truth engine 🔍

Get the latest campus gists, verify rumors, and stay in the know!

https://collinstech10.vercel.app

Invited by @${user.username || "a friend"}`;
  if (navigator.share) {
    navigator.share({ title: "Join TruthLynk", text, url: "https://collinstech10.vercel.app" }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => alert("Invite link copied! Share it with your friends 🚀"));
  }
}


// ── ONBOARDING FLOW ───────────────────────────────────────────
function OnboardingFlow({ onDone }) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast  = step === ONBOARDING_STEPS.length - 1;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", flexDirection: "column", background: current.bg, transition: "background 0.5s" }}>
      {/* Skip */}
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onDone} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "6px 16px", color: "rgba(201,168,76,0.6)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Skip</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", textAlign: "center" }}>
        {/* Animated icon */}
        <div style={{ width: 110, height: 110, background: "linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, marginBottom: 32, boxShadow: "0 0 60px rgba(201,168,76,0.15)", animation: "goldPulse 2s ease-in-out infinite" }}>
          {current.icon}
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: "#e8dfc8", marginBottom: 16, lineHeight: 1.2 }}>{current.title}</h1>
        <p style={{ fontSize: 15, color: "rgba(201,168,76,0.55)", lineHeight: 1.7, maxWidth: 300 }}>{current.desc}</p>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
        {ONBOARDING_STEPS.map((_, i) => (
          <div key={i} onClick={() => setStep(i)} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? "#c9a84c" : "rgba(201,168,76,0.2)", transition: "all .3s", cursor: "pointer" }} />
        ))}
      </div>

      {/* Button */}
      <div style={{ padding: "0 24px 48px" }}>
        <button className="primary-btn" onClick={() => isLast ? onDone() : setStep(s => s + 1)} style={{ fontSize: 16, fontWeight: 800 }}>
          {isLast ? "🚀 Let's Go!" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ── LIVE ONLINE INDICATOR ─────────────────────────────────────
function useOnlinePresence(userId) {
  useEffect(() => {
    if (!userId) return;
    // Update presence every 30 seconds
    const updatePresence = () => {
      supabase.from("profiles").update({ last_seen: new Date().toISOString() }).eq("id", userId).catch(() => {});
    };
    updatePresence();
    const interval = setInterval(updatePresence, 30000);
    return () => clearInterval(interval);
  }, [userId]);
}

function OnlineDot({ lastSeen, size = 10 }) {
  if (!lastSeen) return null;
  const mins = (Date.now() - new Date(lastSeen)) / 60000;
  const isOnline = mins < 2;
  const isRecent = mins < 30;
  if (!isOnline && !isRecent) return null;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: isOnline ? "#4caf50" : "#ff9800", border: "2px solid #02040e", position: "absolute", bottom: 1, right: 1, animation: isOnline ? "pulse 2s infinite" : "none" }} />
  );
}

// ── VIDEO FEED (TikTok style) ─────────────────────────────────
function VideoFeed({ posts, currentUser, onLike, onOpenComments }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const containerRef = useRef(null);
  const startY       = useRef(0);

  const videoPosts = posts.filter(p => p.post_media?.some(m => m.media_type === "video"));

  const handleTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const handleTouchEnd   = (e) => {
    const diff = startY.current - e.changedTouches[0].clientY;
    if (diff > 50 && currentIdx < videoPosts.length - 1) setCurrentIdx(i => i + 1);
    if (diff < -50 && currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  if (videoPosts.length === 0) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(201,168,76,0.3)", gap: 12 }}>
      <div style={{ fontSize: 48 }}>🎬</div>
      <div style={{ fontSize: 15, fontWeight: 600 }}>No videos yet</div>
      <div style={{ fontSize: 13, opacity: 0.6 }}>Post a gist with a video to see it here</div>
    </div>
  );

  const post   = videoPosts[currentIdx];
  const video  = post.post_media.find(m => m.media_type === "video");
  const liked  = currentUser && (post.likes || []).some(l => l.user_id === currentUser.id);
  const author = post.is_anonymous ? null : post.profiles;

  return (
    <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden", background: "#000" }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Video */}
      <video src={video?.url} autoPlay loop muted playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />

      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 50%,rgba(0,0,0,0.2) 100%)" }} />

      {/* Right actions */}
      <div style={{ position: "absolute", right: 14, bottom: 120, display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Avatar user={author} size={44} />
          {author?.is_verified && <div style={{ position: "absolute", bottom: -4, right: -4 }}><VerifiedBadge /></div>}
        </div>
        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => onLike(post)}>
          <div style={{ fontSize: 28 }}>{liked ? "❤️" : "🤍"}</div>
          <div style={{ fontSize: 11, color: "#fff", fontWeight: 700, marginTop: 2 }}>{(post.likes||[]).length}</div>
        </div>
        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => onOpenComments(post)}>
          <div style={{ fontSize: 26 }}>💬</div>
          <div style={{ fontSize: 11, color: "#fff", fontWeight: 700, marginTop: 2 }}>{(post.comments||[]).length}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 26 }}>🔗</div>
          <div style={{ fontSize: 11, color: "#fff", fontWeight: 700, marginTop: 2 }}>Share</div>
        </div>
      </div>

      {/* Bottom info */}
      <div style={{ position: "absolute", bottom: 90, left: 14, right: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{author?.full_name || author?.username || "Anonymous"}</span>
          {author?.is_verified && <VerifiedBadge />}
          <span className="badge" style={{ fontSize: 9 }}>{CAT_LABEL[post.category]}</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>{post.title}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{post.content?.slice(0, 80)}...</div>
      </div>

      {/* Counter */}
      <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)", borderRadius: 12, padding: "4px 10px" }}>
        <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{currentIdx + 1}/{videoPosts.length}</span>
      </div>

      {/* Swipe hint */}
      {currentIdx === 0 && (
        <div style={{ position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
          ↑ Swipe up for next video
        </div>
      )}
    </div>
  );
}

// ── FOR YOU PAGE (personalized) ───────────────────────────────
function getForYouPosts(posts, user, savedIds, likedPostIds) {
  if (!posts.length) return posts;
  // Score each post
  const scored = posts.map(post => {
    let score = 0;
    // School match
    if (post.school && post.school === user.school) score += 20;
    // Engagement
    score += (post.likes?.length || 0) * 2;
    score += (post.comments?.length || 0) * 3;
    score += Math.floor((post.views || 0) / 10);
    // Recency (last 6h = bonus)
    const hrs = (Date.now() - new Date(post.created_at)) / 3600000;
    if (hrs < 1)  score += 30;
    else if (hrs < 6)  score += 15;
    else if (hrs < 24) score += 5;
    // AI verified true = bonus
    if (post.ai_verdict === "true") score += 10;
    // Following bonus (will check separately)
    return { ...post, _score: score };
  });
  return scored.sort((a, b) => b._score - a._score);
}

// ── VISUAL CATEGORY REDESIGN ──────────────────────────────────
const CAT_VISUAL = {
  class:      { icon: "🎓", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)" },
  lecturer:   { icon: "👨‍🏫", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)" },
  campus:     { icon: "🏫", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
  school:     { icon: "⚠️", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
  nationwide: { icon: "🌐", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)" },
  union:      { icon: "✝️", color: "#c9a84c", bg: "rgba(201,168,76,0.12)", border: "rgba(201,168,76,0.25)" },
};

// ── AVATAR ─────────────────────────────────────────────────────
function Avatar({ user, size = 36 }) {
  if (user?.avatar_url)
    return <img src={user.avatar_url} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const init = (user?.full_name || user?.username || "?")[0].toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#1a2855", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8dfc8", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0 }}>
      {init}
    </div>
  );
}

// ── MEDIA VIEWER (fullscreen tap) ──────────────────────────────
function MediaViewer({ url, type, onClose }) {
  const download = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `truthlynk-${Date.now()}.${type === "video" ? "mp4" : "jpg"}`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch { window.open(url, "_blank"); }
  };
  return (
    <div className="media-viewer" onClick={onClose}>
      {type === "video"
        ? <video src={url} controls autoPlay style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 12 }} onClick={e => e.stopPropagation()} />
        : <img src={url} alt="" style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 12, objectFit: "contain" }} />
      }
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={download} style={{ background: "linear-gradient(135deg,#8a6820,#e8c96a)", border: "none", color: "#000", borderRadius: 20, padding: "10px 24px", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>⬇️ Download</button>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 20, padding: "10px 24px", fontSize: 14, cursor: "pointer" }}>✕ Close</button>
      </div>
    </div>
  );
}


// ── AI DAILY DIGEST ───────────────────────────────────────────
function AIDailyDigest({ posts }) {
  const [digest, setDigest]   = useState("");
  const [loading, setLoading] = useState(false);
  const [shown, setShown]     = useState(false);

  const generate = async () => {
    if (loading) return;
    setLoading(true); setShown(true);
    const ctx = posts.slice(0, 15).map(p => `[${p.category}] ${p.title}: ${p.content.slice(0,150)}`).join("\n");
    try {
      await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are TruthLynk AI. Create a concise, engaging daily digest of school gists. Use emojis, keep it under 200 words, group by theme.\n\nCreate today's digest from these gists:
${ctx}` }] }],
          generationConfig: { maxOutputTokens: 300 }
        })
      })
      const data = await res.json();
      setDigest(data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate digest.");
    } catch { setDigest("Failed to load digest. Check your connection."); }
    setLoading(false);
  };

  if (!shown) return (
    <button className="secondary-btn" style={{ width: "100%", marginBottom: 16 }} onClick={generate}>
      📰 Generate AI Daily Digest
    </button>
  );

  return (
    <div style={{ background: "linear-gradient(135deg,#06102a,#0a1030)", border: "1px solid #1a2855", borderRadius: 14, padding: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c" }}>📰 Today's AI Digest</div>
        <button onClick={() => setShown(false)} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.3)", cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>
      {loading
        ? <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(201,168,76,0.55)", fontSize: 13 }}><div className="spinner" style={{ width: 14, height: 14 }} /> Generating...</div>
        : <div style={{ fontSize: 13, color: "#ddc880", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{digest}</div>
      }
    </div>
  );
}

// ── EVENT CALENDAR ────────────────────────────────────────────
function EventCalendar({ user }) {
  const [events, setEvents]     = useState([]);
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState({ title: "", description: "", event_date: "", location: "" });
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    supabase.from("events").select("*, profiles(username,full_name)")
      .gte("event_date", new Date().toISOString())
      .order("event_date").limit(10)
      .then(({ data }) => setEvents(data || []));
  }, []);

  const addEvent = async () => {
    if (!form.title || !form.event_date) return;
    setLoading(true);
    const { data, error } = await supabase.from("events").insert({
      author_id: user.id, title: form.title, description: form.description,
      event_date: form.event_date, location: form.location, school: user.school || ""
    }).select("*, profiles(username,full_name)").single();
    if (!error) { setEvents(prev => [...prev, data].sort((a,b) => new Date(a.event_date)-new Date(b.event_date))); setShowAdd(false); setForm({ title:"", description:"", event_date:"", location:"" }); }
    setLoading(false);
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
  const daysUntil = (d) => {
    const diff = Math.ceil((new Date(d) - new Date()) / 86400000);
    if (diff === 0) return "Today!";
    if (diff === 1) return "Tomorrow";
    return `In ${diff} days`;
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700 }}>📅 Event Calendar</div>
        <button className="secondary-btn" onClick={() => setShowAdd(p => !p)}>+ Add Event</button>
      </div>
      {showAdd && (
        <div style={{ background: "#080f28", border: "1px solid #1a2855", borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <input className="rc-input" placeholder="Event title *" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} style={{ marginBottom: 10 }} />
          <input className="rc-input" placeholder="Location (optional)" value={form.location} onChange={e => setForm(p=>({...p,location:e.target.value}))} style={{ marginBottom: 10 }} />
          <input className="rc-input" type="datetime-local" value={form.event_date} onChange={e => setForm(p=>({...p,event_date:e.target.value}))} style={{ marginBottom: 10 }} />
          <textarea className="rc-input" placeholder="Description (optional)" rows={2} value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} style={{ marginBottom: 10 }} />
          <button className="primary-btn" onClick={addEvent} disabled={loading}>
            {loading ? <div className="spinner" /> : "📅 Add Event"}
          </button>
        </div>
      )}
      {events.length === 0
        ? <div style={{ textAlign: "center", padding: 30, color: "rgba(201,168,76,0.3)" }}><div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>No upcoming events</div>
        : events.map((ev, i) => (
          <div key={i} style={{ background: "#080f28", border: "1px solid #162248", borderRadius: 14, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e8dfc8", flex: 1 }}>{ev.title}</div>
              <div style={{ background: "#1a2855", borderRadius: 8, padding: "2px 8px", fontSize: 10, color: "#c9a84c", fontWeight: 700, marginLeft: 8, whiteSpace: "nowrap" }}>{daysUntil(ev.event_date)}</div>
            </div>
            <div style={{ fontSize: 12, color: "#c9a84c", marginBottom: 4 }}>🕐 {fmtDate(ev.event_date)}</div>
            {ev.location && <div style={{ fontSize: 12, color: "rgba(201,168,76,0.55)", marginBottom: 4 }}>📍 {ev.location}</div>}
            {ev.description && <div style={{ fontSize: 12, color: "rgba(201,168,76,0.65)" }}>{ev.description}</div>}
          </div>
        ))
      }
    </div>
  );
}



// ── LOAD FLUTTERWAVE SCRIPT ───────────────────────────────────
function usePaystack() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const load = () => {
      if (window.PaystackPop) { setReady(true); return; }
      const s = document.createElement("script");
      s.src = "https://js.paystack.co/v1/inline.js";
      s.onload = () => setReady(true);
      s.onerror = () => console.error("Paystack failed to load");
      document.head.appendChild(s);
    };
    load();
    // Poll every 500ms for up to 10s
    let tries = 0;
    const poll = setInterval(() => {
      tries++;
      if (window.PaystackPop) { setReady(true); clearInterval(poll); }
      if (tries > 20) clearInterval(poll);
    }, 500);
    return () => clearInterval(poll);
  }, []);
  return ready;
}

// ── VERIFICATION PAYMENT — Twitter style ──────────────────────
function VerificationPayment({ user, onClose, onSuccess }) {
  const psReady = usePaystack();
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState("info"); // info | success

  const handlePay = () => {
    if (!window.PaystackPop) {
      alert("Payment is still loading. Please wait a moment and try again.");
      return;
    }
    setLoading(true);
    const txRef = `TL-${user.id.slice(0,8)}-${Date.now()}`;
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: VERIFICATION_PRICE * 100,
      currency: "NGN",
      ref: txRef,
      callback: async (response) => {
        setLoading(false);
        if (response.status === "success") {
          await verifyAndActivate(txRef, response.reference || "");
        } else {
          alert("Payment not completed. Try again.");
        }
      },
      onClose: () => setLoading(false),
    });
    handler.openIframe();
  };

  const verifyAndActivate = async (txRef, reference) => {
    try {
      await supabase.from("profiles").update({
        is_verified: true,
        verified_role: "verified",
      }).eq("id", user.id);
      await supabase.from("verification_payments").insert({
        user_id: user.id,
        tx_ref: txRef,
        flw_ref: reference,
        amount: VERIFICATION_PRICE,
        role: "verified",
        status: "success",
      }).catch(() => {});
      setStep("success");
      onSuccess({ is_verified: true, verified_role: "verified" });
    } catch (e) {
      console.error("Activation error:", e);
      alert("Payment received but activation failed. Contact support.");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 400, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ background: "#040812", borderRadius: "24px 24px 0 0", border: "1px solid #162248", padding: 28, maxHeight: "90vh", overflowY: "auto" }}>

        {step === "success" ? (
          /* ── Success Screen ── */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#8a6820,#e8c96a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 16px" }}>✓</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: "#e8dfc8", marginBottom: 8 }}>You're Verified!</div>
            <div style={{ fontSize: 14, color: "rgba(201,168,76,0.55)", marginBottom: 6 }}>Your checkmark is now live on all your posts.</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0a1030", border: "1px solid #8a6820", borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
              <span style={{ fontSize: 16 }}>✅</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e8c96a" }}>@{user.username}</span>
              <span style={{ fontSize: 11, color: "rgba(201,168,76,0.55)" }}>Verified</span>
            </div>
            <button className="primary-btn" onClick={onClose}>🚀 Continue</button>
          </div>
        ) : (
          /* ── Info + Pay Screen ── */
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Get Verified ✅</div>
                <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)" }}>Stand out on TruthLynk like Twitter Blue</div>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.55)", fontSize: 22, cursor: "pointer", padding: 4 }}>✕</button>
            </div>

            {/* Checkmark preview */}
            <div style={{ background: "#080f28", border: "1px solid #1a2855", borderRadius: 16, padding: 18, marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar user={user} size={52} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#e8dfc8" }}>{user.full_name || user.username}</span>
                  <span style={{ fontSize: 18 }}>✅</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(201,168,76,0.55)", marginTop: 2 }}>@{user.username} · Verified</div>
              </div>
            </div>

            {/* Benefits */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c", marginBottom: 12 }}>What you get:</div>
              {[
                ["✅", "Verified checkmark on every post"],
                ["🔝", "Boosted visibility in the feed"],
                ["🏆", "Priority ranking in leaderboard"],
                ["💬", "Replies highlighted in comments"],
                ["🔒", "One-time payment — verified forever"],
              ].map(([icon, text], i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                  <div style={{ width: 34, height: 34, background: "#0a1030", border: "1px solid #1a2855", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
                  <div style={{ fontSize: 13, color: "#ddc880" }}>{text}</div>
                </div>
              ))}
            </div>

            {/* Price card */}
            <div style={{ background: "linear-gradient(135deg,#06102a,#0a1030)", border: "1px solid #8a6820", borderRadius: 16, padding: 18, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(201,168,76,0.55)", marginBottom: 4 }}>One-time fee</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#e8c96a", lineHeight: 1 }}>₦{VERIFICATION_PRICE.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "rgba(201,168,76,0.3)" }}>Secured by</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#00c3f7" }}>Paystack</div>
              </div>
            </div>

            {/* Pay button */}
            <button
              className="primary-btn"
              onClick={handlePay}
              disabled={loading}
              style={{ background: loading ? "#080f28" : "linear-gradient(135deg,#c9a84c,#e8c96a)", color: loading ? "rgba(201,168,76,0.3)" : "#000", fontWeight: 800, fontSize: 16, marginBottom: 12 }}
            >
              {loading ? <><div className="spinner" style={{ borderColor: "#1a2855", borderTopColor: "#c9a84c" }} /> Processing...</> : psReady ? `💳 Pay ₦${VERIFICATION_PRICE.toLocaleString()} & Get Verified` : "⏳ Loading payment..."}
            </button>

            <div style={{ fontSize: 11, color: "rgba(201,168,76,0.3)", textAlign: "center", lineHeight: 1.6 }}>
              🔒 Card · Bank Transfer · USSD · GTB · Access — No recurring charges. One-time only.
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// ── PREMIUM GATE (shows upgrade prompt if not premium) ────────
function PremiumGate({ user, feature, onUpgrade, children }) {
  if (user?.is_premium || user?.is_verified) return children;
  return (
    <div style={{ background: "linear-gradient(135deg,#1a1500,#2a2000)", border: "2px solid #ffd70060", borderRadius: 16, padding: 20, textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>👑</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#ffd700", marginBottom: 6 }}>Premium Feature</div>
      <div style={{ fontSize: 13, color: "#b8a060", marginBottom: 16 }}>{feature} is only available for verified premium members.</div>
      <button onClick={onUpgrade} style={{ background: "linear-gradient(135deg,#ffd700,#ff8c00)", border: "none", borderRadius: 20, padding: "10px 24px", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
        ✅ Get Verified · ₦2,000
      </button>
    </div>
  );
}

// ── DIRECT MESSAGES ───────────────────────────────────────────
function DirectMessages({ user, onClose }) {
  const [conversations, setConversations] = useState([]);
  const [activeDM, setActiveDM]           = useState(null);
  const [messages, setMessages]           = useState([]);
  const [text, setText]                   = useState("");
  const [loading, setLoading]             = useState(false);
  const [searchUser, setSearchUser]       = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Load conversations
    supabase.from("direct_messages")
      .select("*, sender:profiles!direct_messages_sender_id_fkey(id,username,full_name,avatar_url,is_verified), receiver:profiles!direct_messages_receiver_id_fkey(id,username,full_name,avatar_url,is_verified)")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        // Group by conversation partner
        const seen = new Set();
        const convs = [];
        data.forEach(msg => {
          const partner = msg.sender_id === user.id ? msg.receiver : msg.sender;
          if (!seen.has(partner?.id)) {
            seen.add(partner?.id);
            convs.push({ partner, lastMsg: msg });
          }
        });
        setConversations(convs);
      });
  }, [user.id]);

  const openDM = async (partner) => {
    setActiveDM(partner);
    const { data } = await supabase.from("direct_messages")
      .select("*, sender:profiles!direct_messages_sender_id_fkey(username,full_name,avatar_url)")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partner.id}),and(sender_id.eq.${partner.id},receiver_id.eq.${user.id})`)
      .order("created_at");
    setMessages(data || []);
    // Mark as read
    await supabase.from("direct_messages").update({ is_read: true })
      .eq("receiver_id", user.id).eq("sender_id", partner.id);
  };

  const sendDM = async () => {
    if (!text.trim() || !activeDM) return;
    setLoading(true);
    const { data } = await supabase.from("direct_messages")
      .insert({ sender_id: user.id, receiver_id: activeDM.id, content: text })
      .select("*, sender:profiles!direct_messages_sender_id_fkey(username,full_name,avatar_url)").single();
    if (data) { setMessages(prev => [...prev, data]); setText(""); }
    setLoading(false);
  };

  const searchUsers = async (q) => {
    if (!q.trim()) { setSearchResults([]); return; }
    const { data } = await supabase.from("profiles").select("id,username,full_name,avatar_url,is_verified")
      .ilike("username", `%${q}%`).neq("id", user.id).limit(5);
    setSearchResults(data || []);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#040812", zIndex: 400, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #080f28", display: "flex", alignItems: "center", gap: 12 }}>
        {activeDM ? (
          <>
            <button onClick={() => setActiveDM(null)} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.55)", fontSize: 20, cursor: "pointer" }}>←</button>
            <Avatar user={activeDM} size={34} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e8dfc8" }}>{activeDM.full_name || activeDM.username}</div>
              <div style={{ fontSize: 11, color: "rgba(201,168,76,0.3)" }}>@{activeDM.username}</div>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, flex: 1 }}>💬 Messages</div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.55)", fontSize: 20, cursor: "pointer" }}>✕</button>
          </>
        )}
      </div>

      {!activeDM ? (
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px" }}>
          <input className="rc-input" placeholder="Search users to message..." style={{ marginBottom: 14 }}
            onChange={e => { setSearchUser(e.target.value); searchUsers(e.target.value); }} value={searchUser} />
          {searchResults.map(u => (
            <div key={u.id} onClick={() => { openDM(u); setSearchUser(""); setSearchResults([]); }}
              style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #080f28", cursor: "pointer" }}>
              <Avatar user={u} size={40} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e8dfc8", display: "flex", alignItems: "center", gap: 4 }}>
                  {u.full_name || u.username}{u.is_verified && <VerifiedBadge />}
                </div>
                <div style={{ fontSize: 11, color: "rgba(201,168,76,0.3)" }}>@{u.username}</div>
              </div>
            </div>
          ))}
          {conversations.length === 0 && !searchUser && (
            <div style={{ textAlign: "center", padding: 40, color: "rgba(201,168,76,0.3)" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
              <div>No messages yet.</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Search for a user above to start chatting</div>
            </div>
          )}
          {conversations.map((conv, i) => (
            <div key={i} onClick={() => openDM(conv.partner)} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #080f28", cursor: "pointer" }}>
              <Avatar user={conv.partner} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e8dfc8" }}>{conv.partner?.full_name || conv.partner?.username}</div>
                <div style={{ fontSize: 12, color: "rgba(201,168,76,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.lastMsg.content}</div>
              </div>
              <div style={{ fontSize: 10, color: "rgba(201,168,76,0.3)" }}>{timeAgo(conv.lastMsg.created_at)}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.sender_id === user.id ? "flex-end" : "flex-start" }}>
                <div style={{ background: msg.sender_id === user.id ? "linear-gradient(135deg,#8a6820,#5a4010)" : "#080f28", border: msg.sender_id !== user.id ? "1px solid #162248" : "none", borderRadius: msg.sender_id === user.id ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", maxWidth: "75%", fontSize: 13, color: "#e8dfc8", lineHeight: 1.4 }}>
                  {msg.content}
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4, textAlign: "right" }}>{timeAgo(msg.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid #080f28", display: "flex", gap: 10 }}>
            <input className="rc-input" value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..." onKeyDown={e => e.key === "Enter" && sendDM()} style={{ flex: 1 }} />
            <button onClick={sendDM} disabled={loading} style={{ width: 46, height: 46, background: "linear-gradient(135deg,#8a6820,#c9a84c)", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : "➤"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── PROFILE VIEWERS ───────────────────────────────────────────
function ProfileViewers({ userId }) {
  const [viewers, setViewers] = useState([]);
  useEffect(() => {
    supabase.from("profile_views")
      .select("*, viewer:profiles!profile_views_viewer_id_fkey(id,username,full_name,avatar_url,is_verified)")
      .eq("profile_id", userId).order("viewed_at", { ascending: false }).limit(20)
      .then(({ data }) => setViewers(data || []));
  }, [userId]);

  if (!viewers.length) return (
    <div style={{ textAlign: "center", padding: 30, color: "rgba(201,168,76,0.3)" }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>👁</div>
      <div>No profile views yet</div>
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 14 }}>{viewers.length} people viewed your profile recently</div>
      {viewers.map((v, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #080f28" }}>
          <Avatar user={v.viewer} size={38} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8dfc8", display: "flex", alignItems: "center", gap: 4 }}>
              {v.viewer?.full_name || v.viewer?.username || "Anonymous"}
              {v.viewer?.is_verified && <VerifiedBadge />}
            </div>
            <div style={{ fontSize: 11, color: "rgba(201,168,76,0.3)" }}>{timeAgo(v.viewed_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── AI WRITE FOR ME ───────────────────────────────────────────
function AIWriteForMe({ onInsert, category }) {
  const [topic, setTopic]     = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState("");

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a student writing a school gist/rumor post. Write a short, engaging campus gist post about: "${topic}". Category: ${category}. Keep it under 200 words, conversational, like a student sharing news. No hashtags. Just the post content, no title.` }] }],
          generationConfig: { maxOutputTokens: 200 }
        })
      });
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setResult(text);
    } catch { setResult("Failed to generate. Try again."); }
    setLoading(false);
  };

  return (
    <div style={{ background: "linear-gradient(135deg,#06102a,#0a1030)", border: "1px solid #1a2855", borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", marginBottom: 10 }}>🤖 AI Write For Me</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input className="rc-input" placeholder="What's the topic?" value={topic} onChange={e => setTopic(e.target.value)} style={{ flex: 1, padding: "8px 12px", fontSize: 13 }} onKeyDown={e => e.key === "Enter" && generate()} />
        <button onClick={generate} disabled={loading} style={{ background: "#8a6820", border: "none", borderRadius: 8, padding: "8px 14px", color: "#e8dfc8", cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>
          {loading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : "Write"}
        </button>
      </div>
      {result && (
        <div>
          <div style={{ background: "#040812", borderRadius: 10, padding: 12, fontSize: 13, color: "#ddc880", lineHeight: 1.5, marginBottom: 8, maxHeight: 120, overflowY: "auto" }}>{result}</div>
          <button onClick={() => onInsert(result)} style={{ background: "#1a2855", border: "none", borderRadius: 8, padding: "6px 14px", color: "#e8dfc8", cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>✅ Use This</button>
        </div>
      )}
    </div>
  );
}

// ── LEADERBOARD ───────────────────────────────────────────────
function Leaderboard({ posts, onViewProfile }) {
  const scores = {};
  posts.forEach(p => {
    if (!p.author_id || p.is_anonymous) return;
    if (!scores[p.author_id]) scores[p.author_id] = { profile: p.profiles, posts: 0, likes: 0, views: 0 };
    scores[p.author_id].posts++;
    scores[p.author_id].likes  += p.likes?.length || 0;
    scores[p.author_id].views  += p.views || 0;
  });
  const ranked = Object.values(scores)
    .map(s => ({ ...s, score: s.posts * 10 + s.likes * 5 + Math.floor(s.views / 10) }))
    .sort((a, b) => b.score - a.score).slice(0, 10);
  const medals = ["🥇","🥈","🥉"];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🏆 Leaderboard</div>
      <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 16 }}>Top contributors this week</div>
      {ranked.length === 0
        ? <div style={{ textAlign: "center", padding: 40, color: "rgba(201,168,76,0.3)" }}>No data yet</div>
        : ranked.map((r, i) => (
          <div key={i} style={{ background: i < 3 ? "linear-gradient(135deg,#0a1030,#060d20)" : "#080f28", border: `1px solid ${i < 3 ? "#8a6820" : "#101d3a"}`, borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 24, width: 32, textAlign: "center" }}>{medals[i] || `#${i+1}`}</div>
            <Avatar user={r.profile} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e8dfc8" }}>{r.profile?.full_name || r.profile?.username || "User"}</div>
              <div style={{ fontSize: 11, color: "rgba(201,168,76,0.55)", marginTop: 2 }}>📝 {r.posts} posts · ❤️ {r.likes} likes · 👁 {r.views} views</div>
            </div>
            <div style={{ background: "#1a2855", borderRadius: 10, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#c9a84c" }}>{r.score}pts</div>
          </div>
        ))
      }
    </div>
  );
}

// ── FOLLOW BUTTON ─────────────────────────────────────────────
function FollowButton({ targetUserId, currentUserId }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (!currentUserId || !targetUserId) return;
    supabase.from("follows").select("id").eq("follower_id", currentUserId).eq("following_id", targetUserId).single()
      .then(({ data }) => setFollowing(!!data));
  }, [targetUserId, currentUserId]);

  const toggle = async () => {
    if (!currentUserId || loading) return;
    setLoading(true);
    if (following) {
      await supabase.from("follows").delete().eq("follower_id", currentUserId).eq("following_id", targetUserId);
      setFollowing(false);
    } else {
      await supabase.from("follows").insert({ follower_id: currentUserId, following_id: targetUserId });
      setFollowing(true);
      // Notify
      supabase.from("notifications").insert({
        user_id: targetUserId, from_user: currentUserId, type: "like",
        message: "Someone started following you on TruthLynk!"
      }).catch(() => {});
    }
    setLoading(false);
  };

  if (!currentUserId || currentUserId === targetUserId) return null;
  return (
    <button onClick={toggle} disabled={loading} style={{ background: following ? "#080f28" : "linear-gradient(135deg,#8a6820,#e8c96a)", border: `1px solid ${following ? "#1a2855" : "transparent"}`, borderRadius: 20, padding: "6px 16px", color: following ? "#d4b870" : "#000", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all .2s" }}>
      {loading ? "..." : following ? "✓ Following" : "+ Follow"}
    </button>
  );
}

// ── SCHOOL BROWSER ────────────────────────────────────────────
function SchoolBrowser({ currentSchool, onSelectSchool }) {
  const [schools, setSchools] = useState([]);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    supabase.from("posts").select("school").not("school", "is", null).neq("school", "")
      .then(({ data }) => {
        const unique = [...new Set((data||[]).map(p => p.school).filter(Boolean))];
        setSchools(unique);
      });
  }, []);

  const filtered = schools.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🏫 Schools</div>
      <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 14 }}>Browse gists from other schools</div>
      <input className="rc-input" placeholder="Search schools..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 14 }} />
      <button className={`secondary-btn${!currentSchool ? " active" : ""}`} style={{ width: "100%", marginBottom: 10, justifyContent: "flex-start" }} onClick={() => onSelectSchool("")}>
        🌍 All Schools
      </button>
      {filtered.map((s, i) => (
        <button key={i} onClick={() => onSelectSchool(s)} style={{ width: "100%", background: currentSchool === s ? "#1a2855" : "#080f28", border: `1px solid ${currentSchool === s ? "#c9a84c" : "#162248"}`, borderRadius: 12, padding: "12px 16px", color: "#e8dfc8", cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif", textAlign: "left", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, transition: "all .2s" }}>
          🏫 {s}
          {currentSchool === s && <span style={{ marginLeft: "auto", color: "#c9a84c", fontSize: 16 }}>✓</span>}
        </button>
      ))}
    </div>
  );
}

// ── PROFILE SETTINGS ──────────────────────────────────────────
function ProfileSettings({ user, onUpdate, onClose }) {
  const [form, setForm]     = useState({ full_name: user.full_name || "", username: user.username || "", school: user.school || "", bio: user.bio || "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const [emailDigest, setEmailDigest] = useState(user.email_digest || false);
  const save = async () => {
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name, username: form.username,
      school: form.school, bio: form.bio
    }).eq("id", user.id);
    if (!error) { onUpdate({ ...user, ...form, email_digest: emailDigest }); setMsg("✅ Profile updated!"); setTimeout(onClose, 1500); }
    else setMsg("❌ " + error.message);
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 300, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ background: "#040812", borderRadius: "20px 20px 0 0", border: "1px solid #162248", padding: 24, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 18, fontFamily: "'Playfair Display',serif" }}>✏️ Edit Profile</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.55)", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {msg && <div className={msg.includes("✅") ? "success-msg" : "error-msg"}>{msg}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(201,168,76,0.55)", marginBottom: 6 }}>Full Name</div>
            <input className="rc-input" value={form.full_name} onChange={e => set("full_name", e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(201,168,76,0.55)", marginBottom: 6 }}>Username</div>
            <input className="rc-input" value={form.username} onChange={e => set("username", e.target.value)} placeholder="username" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(201,168,76,0.55)", marginBottom: 6 }}>School</div>
            <input className="rc-input" value={form.school} onChange={e => set("school", e.target.value)} placeholder="Your school name" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(201,168,76,0.55)", marginBottom: 6 }}>Bio</div>
            <textarea className="rc-input" rows={3} value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Tell people about yourself..." />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(201,168,76,0.55)", marginBottom: 6 }}>Email Digest</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#080f28", border: "1px solid #162248", borderRadius: 12, padding: "12px 16px" }}>
              <input type="checkbox" id="digest" checked={emailDigest} onChange={e => setEmailDigest(e.target.checked)} style={{ accentColor: "#c9a84c", width: 16, height: 16 }} />
              <label htmlFor="digest" style={{ fontSize: 13, color: "#d4b870", cursor: "pointer" }}>📧 Receive weekly top gists digest</label>
            </div>
          </div>
          <button className="primary-btn" onClick={save} disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <div className="spinner" /> : "💾 Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}


// ── ANALYTICS DASHBOARD ───────────────────────────────────────
function AnalyticsDashboard({ user, posts }) {
  const myPosts = posts.filter(p => p.author_id === user.id);
  const totalViews = myPosts.reduce((a, p) => a + (p.views || 0), 0);
  const totalLikes = myPosts.reduce((a, p) => a + (p.likes?.length || 0), 0);
  const totalComments = myPosts.reduce((a, p) => a + (p.comments?.length || 0), 0);
  const avgViews = myPosts.length ? Math.round(totalViews / myPosts.length) : 0;

  const topPost = myPosts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))[0];

  const catBreakdown = {};
  myPosts.forEach(p => { catBreakdown[p.category] = (catBreakdown[p.category] || 0) + 1; });

  const level = getLevelInfo(user.xp || 0);
  const xpPct = level.next ? Math.round(((user.xp || 0) / level.next) * 100) : 100;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>📊 Analytics</div>
      <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 16 }}>Your post performance</div>

      {/* XP Level card */}
      <div style={{ background: "linear-gradient(135deg,#06102a,#0a1030)", border: `1px solid ${level.color}40`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(201,168,76,0.55)", marginBottom: 2 }}>Level {level.level}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: level.color }}>{level.name}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: level.color }}>{user.xp || 0} XP</div>
            {level.next && <div style={{ fontSize: 11, color: "rgba(201,168,76,0.3)" }}>/{level.next} XP to next level</div>}
          </div>
        </div>
        <div style={{ background: "#040812", borderRadius: 6, height: 8, overflow: "hidden" }}>
          <div style={{ width: `${xpPct}%`, height: "100%", background: `linear-gradient(90deg,${level.color}80,${level.color})`, borderRadius: 6, transition: "width 1s" }} />
        </div>
        {user.streak > 0 && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#ffca28" }}>⚡ {user.streak}-day streak!</div>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          ["📝", "Posts", myPosts.length, "#c9a84c"],
          ["👁", "Total Views", totalViews, "#2196f3"],
          ["❤️", "Total Likes", totalLikes, "#ef5350"],
          ["💬", "Comments", totalComments, "#ff9800"],
          ["📈", "Avg Views", avgViews, "#9c27b0"],
          ["🔖", "Saves", 0, "#00bcd4"],
        ].map(([icon, label, val, color]) => (
          <div key={label} style={{ background: "#080f28", border: "1px solid #162248", borderRadius: 12, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color, marginTop: 4 }}>{val}</div>
            <div style={{ fontSize: 11, color: "rgba(201,168,76,0.55)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {Object.keys(catBreakdown).length > 0 && (
        <div style={{ background: "#080f28", border: "1px solid #162248", borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c", marginBottom: 10 }}>Posts by Category</div>
          {Object.entries(catBreakdown).map(([cat, count]) => (
            <div key={cat} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#d4b870", marginBottom: 3 }}>
                <span>{CAT_LABEL[cat] || cat}</span><span>{count}</span>
              </div>
              <div style={{ background: "#040812", borderRadius: 4, height: 6 }}>
                <div style={{ width: `${(count / myPosts.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#8a6820,#c9a84c)", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top post */}
      {topPost && (
        <div style={{ background: "#080f28", border: "1px solid #1a2855", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", marginBottom: 6 }}>🏆 Your Best Post</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e8dfc8", marginBottom: 6 }}>{topPost.title}</div>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "rgba(201,168,76,0.55)" }}>
            <span>❤️ {topPost.likes?.length || 0}</span>
            <span>👁 {topPost.views || 0}</span>
            <span>💬 {topPost.comments?.length || 0}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── BADGES DISPLAY ────────────────────────────────────────────
function BadgesDisplay({ user }) {
  const earned = new Set(user.badges || []);
  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🏅 Badges</div>
      <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 16 }}>Earn badges by being active on TruthLynk</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {BADGE_DEFS.map(badge => {
          const has = earned.has(badge.id);
          return (
            <div key={badge.id} style={{ background: has ? "linear-gradient(135deg,#0a1030,#060d20)" : "#080f28", border: `1px solid ${has ? "#8a6820" : "#101d3a"}`, borderRadius: 14, padding: 14, textAlign: "center", opacity: has ? 1 : 0.5 }}>
              <div style={{ fontSize: 28, marginBottom: 6, filter: has ? "none" : "grayscale(100%)" }}>{badge.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: has ? "#e8dfc8" : "rgba(201,168,76,0.3)", marginBottom: 2 }}>{badge.name}</div>
              <div style={{ fontSize: 9, color: "rgba(201,168,76,0.3)", lineHeight: 1.3 }}>{badge.desc}</div>
              <div style={{ fontSize: 10, color: has ? "#c9a84c" : "#162248", marginTop: 4, fontWeight: 700 }}>+{badge.xp}XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── VERIFIED BADGE — Twitter style ✅ ────────────────────────
function VerifiedBadge({ role }) {
  // Simple green checkmark for everyone — no role labels
  return (
    <span title="Verified" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, background: "linear-gradient(135deg,#8a6820,#e8c96a)", borderRadius: "50%", fontSize: 10, marginLeft: 4, flexShrink: 0, fontWeight: 900, color: "#fff" }}>
      ✓
    </span>
  );
}

// ── LANGUAGE SELECTOR ─────────────────────────────────────────
function LangSelector({ lang, onChange }) {
  const opts = [
    { code: "en",  flag: "🇬🇧", name: "English" },
    { code: "yo",  flag: "🟢",  name: "Yoruba" },
    { code: "ig",  flag: "🟡",  name: "Igbo" },
    { code: "pcm", flag: "🇳🇬", name: "Pidgin" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {opts.map(o => (
        <button key={o.code} onClick={() => { onChange(o.code); localStorage.setItem("tl_lang", o.code); }}
          style={{ background: lang === o.code ? "#8a6820" : "#080f28", border: `1px solid ${lang === o.code ? "#c9a84c" : "#162248"}`, borderRadius: 20, padding: "6px 14px", color: "#e8dfc8", cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: lang === o.code ? 700 : 400, display: "flex", gap: 6, alignItems: "center" }}>
          {o.flag} {o.name}
        </button>
      ))}
    </div>
  );
}

// ── GROK AI CHAT ──────────────────────────────────────────────
function AIScreen({ posts }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm TruthLynk AI powered by Grok. I can help you verify rumors, answer questions about school gists, or summarize what's happening. What would you like to know?" }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode]       = useState("chat"); // chat | verify | summarize
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const buildContext = () => {
    if (!posts.length) return "No posts available yet.";
    return posts.slice(0, 20).map(p =>
      `[${p.category.toUpperCase()}] ${p.title}: ${p.content.slice(0, 200)}`
    ).join("\n");
  };

  const getSystemPrompt = () => {
    const ctx = buildContext();
    if (mode === "verify") return `You are TruthLynk AI, a school rumor verification assistant. Analyze the following school gists and help verify if rumors are likely true or false based on context and logic. Be direct and helpful. Current school gists:
${ctx}`;
    if (mode === "summarize") return `You are TruthLynk AI. Summarize the current school gists in a clear, engaging way. Group by category if helpful. Current school gists:
${ctx}`;
    return `You are TruthLynk AI, a helpful school intelligence assistant. You help students understand what's happening in their school. Use the following gists as context when answering questions:
${ctx}

Be conversational, helpful, and concise.`;
  };

  const send = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    // Check AI limit for free users
    if (!currentUser?.is_verified && !currentUser?.is_premium) {
      const count = aiMsgCount || 0;
      if (count >= FREE_AI_LIMIT) {
        setMessages(prev => [...prev, { role: "assistant", text: `⚠️ You've used your ${FREE_AI_LIMIT} free AI messages today. Get verified (✅) to unlock unlimited AI access!` }]);
        return;
      }
      setAiMsgCount(c => c + 1);
      // Update DB count
      supabase.from("profiles").update({ ai_messages_today: count + 1, ai_messages_date: new Date().toISOString().split("T")[0] }).eq("id", currentUser.id).catch(() => {});
    }
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const history = messages.filter(m => m.role !== "assistant" || messages.indexOf(m) > 0).map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text
      }));
      await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `\n\n` }] }],
          generationConfig: { maxOutputTokens: 500 }
        })
      })
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", text: "Connection error. Please check your internet and try again." }]);
    }
    setLoading(false);
  };

  const quickPrompts = [
    { label: "📋 Summarize today", text: "Summarize all the latest school gists for me" },
    { label: "🔍 Top rumor?", text: "What's the biggest rumor going around right now?" },
    { label: "⚠️ Any issues?", text: "Are there any important school issues I should know about?" },
    { label: "🎓 Class updates?", text: "What class-related gists have been posted recently?" },
  ];

  return (
    <div className="slide-up" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 10px", borderBottom: "1px solid #080f28" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#8a6820,#e8c96a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700 }}>TruthLynk AI</div>
            <div style={{ fontSize: 11, color: "#c9a84c" }}>Powered by Grok • {posts.length} gists loaded</div>
          </div>
        </div>
        {/* Mode switcher */}
        <div style={{ display: "flex", gap: 8 }}>
          {[["chat","💬 Chat"],["verify","🔍 Verify"],["summarize","📋 Summarize"]].map(([m, label]) => (
            <button key={m} className={`tab-btn${mode === m ? " active" : ""}`} onClick={() => setMode(m)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
            {msg.role === "assistant" && (
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#8a6820,#e8c96a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
            )}
            <div style={{
              background: msg.role === "user" ? "linear-gradient(135deg,#8a6820,#5a4010)" : "#080f28",
              border: msg.role === "assistant" ? "1px solid #162248" : "none",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "10px 14px", maxWidth: "80%", fontSize: 13, lineHeight: 1.5, color: "#e8dfc8",
              whiteSpace: "pre-wrap"
            }}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#8a6820,#e8c96a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ background: "#080f28", border: "1px solid #162248", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#c9a84c", animation: "pulse 1s infinite", animationDelay: `${i*0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div style={{ padding: "0 20px 10px", display: "flex", gap: 8, overflowX: "auto" }}>
          {quickPrompts.map((q, i) => (
            <button key={i} className="tab-btn" onClick={() => send(q.text)} style={{ whiteSpace: "nowrap", fontSize: 11 }}>{q.label}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "10px 20px 12px", borderTop: "1px solid #080f28", display: "flex", gap: 10, background: "#040812" }}>
        <input className="rc-input" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about school gists..." onKeyDown={e => e.key === "Enter" && send()} style={{ flex: 1 }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 46, height: 46, background: "linear-gradient(135deg,#8a6820,#e8c96a)", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: loading || !input.trim() ? 0.5 : 1 }}>
          {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : "➤"}
        </button>
      </div>
    </div>
  );
}


// ── POLL COMPONENT ────────────────────────────────────────────
function PollWidget({ postId, currentUser }) {
  const [poll, setPoll]     = useState(null);
  const [votes, setVotes]   = useState({ yes: 0, no: 0 });
  const [myVote, setMyVote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("polls").select("*").eq("post_id", postId).single()
      .then(({ data }) => {
        if (!data) return;
        setPoll(data);
        supabase.from("poll_votes").select("vote, user_id").eq("poll_id", data.id)
          .then(({ data: v }) => {
            if (!v) return;
            setVotes({ yes: v.filter(x=>x.vote==="yes").length, no: v.filter(x=>x.vote==="no").length });
            if (currentUser) {
              const mine = v.find(x => x.user_id === currentUser.id);
              if (mine) setMyVote(mine.vote);
            }
          });
      });
  }, [postId, currentUser]);

  if (!poll) return null;
  const total = votes.yes + votes.no;
  const yesPct = total ? Math.round((votes.yes/total)*100) : 50;
  const noPct  = total ? Math.round((votes.no/total)*100)  : 50;

  const vote = async (v) => {
    if (!currentUser || loading) return;
    setLoading(true);
    if (myVote) {
      await supabase.from("poll_votes").update({ vote: v }).eq("poll_id", poll.id).eq("user_id", currentUser.id);
    } else {
      await supabase.from("poll_votes").insert({ poll_id: poll.id, user_id: currentUser.id, vote: v });
    }
    setVotes(prev => {
      const next = { ...prev };
      if (myVote) next[myVote] = Math.max(0, next[myVote] - 1);
      next[v]++;
      return next;
    });
    setMyVote(v);
    setLoading(false);
  };

  return (
    <div style={{ background: "#040812", border: "1px solid #1a2855", borderRadius: 12, padding: 14, marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#d4b870", marginBottom: 10 }}>📊 {poll.question}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {[["yes","✅ True", "#8a6820"], ["no","❌ False", "#7a2a2a"]].map(([v, label, bg]) => (
          <button key={v} onClick={() => vote(v)} style={{ flex: 1, background: myVote === v ? bg : "#080f28", border: `1px solid ${myVote === v ? "#c9a84c" : "#162248"}`, borderRadius: 10, padding: "8px 4px", color: "#e8dfc8", cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 600, transition: "all .2s" }}>
            {label}
          </button>
        ))}
      </div>
      {myVote && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(201,168,76,0.55)", marginBottom: 4 }}>
            <span>✅ {yesPct}%</span><span>{total} votes</span><span>❌ {noPct}%</span>
          </div>
          <div style={{ background: "#080f28", borderRadius: 6, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${yesPct}%`, height: "100%", background: "linear-gradient(90deg,#8a6820,#c9a84c)", borderRadius: 6, transition: "width .5s" }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── REPORT MODAL ──────────────────────────────────────────────
function ReportModal({ post, currentUser, onClose }) {
  const [reason, setReason] = useState("");
  const [done, setDone]     = useState(false);
  const reasons = ["Fake news / misinformation", "Inappropriate content", "Harassment", "Spam", "Other"];

  const submit = async (r) => {
    if (!currentUser) return;
    await supabase.from("reports").upsert({ post_id: post.id, user_id: currentUser.id, reason: r }, { onConflict: "post_id,user_id" });
    setDone(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 300, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ background: "#040812", borderRadius: "20px 20px 0 0", border: "1px solid #162248", padding: 24 }}>
        {done ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <div style={{ color: "#d4b870", fontSize: 15 }}>Report submitted. Thank you!</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>🚩 Report Post</div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.55)", fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 14 }}>Why are you reporting this?</div>
            {reasons.map(r => (
              <button key={r} onClick={() => submit(r)} style={{ width: "100%", background: "#080f28", border: "1px solid #162248", borderRadius: 12, padding: "12px 16px", color: "#e8dfc8", cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif", textAlign: "left", marginBottom: 8, display: "block", transition: "all .2s" }}>
                {r}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── VOICE RECORDER ─────────────────────────────────────────────
function VoiceRecorder({ onRecorded, onCancel }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds]     = useState(0);
  const [blob, setBlob]           = useState(null);
  const [audioUrl, setAudioUrl]   = useState(null);
  const mediaRef  = useRef(null);
  const timerRef  = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const b = new Blob(chunksRef.current, { type: "audio/webm" });
        setBlob(b);
        setAudioUrl(URL.createObjectURL(b));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } catch (e) { alert("Microphone access denied. Please allow microphone access."); }
  };

  const stop = () => {
    mediaRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div style={{ background: "#080f28", border: "1px solid #162248", borderRadius: 16, padding: 20, textAlign: "center" }}>
      <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 16 }}>🎙️ Voice Note</div>

      {!blob ? (
        <>
          {recording && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 48, marginBottom: 12 }}>
              {[...Array(10)].map((_, i) => (
                <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          )}
          <div style={{ fontSize: 28, fontWeight: 700, color: "#c9a84c", marginBottom: 16, fontFamily: "monospace" }}>
            {fmt(seconds)}
          </div>
          <button
            onClick={recording ? stop : start}
            style={{ width: 64, height: 64, borderRadius: "50%", background: recording ? "#c0392b" : "linear-gradient(135deg,#8a6820,#c9a84c)", border: "none", cursor: "pointer", fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: recording ? "0 0 0 8px rgba(192,57,43,0.2)" : "0 0 0 8px rgba(76,175,80,0.15)", transition: "all .3s" }}
          >
            {recording ? "⏹" : "🎙️"}
          </button>
          <div style={{ fontSize: 12, color: "rgba(201,168,76,0.3)" }}>{recording ? "Tap to stop" : "Tap to record"}</div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <audio src={audioUrl} controls style={{ width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="secondary-btn" style={{ flex: 1 }} onClick={() => { setBlob(null); setAudioUrl(null); setSeconds(0); }}>🗑️ Redo</button>
            <button className="primary-btn" style={{ flex: 1 }} onClick={() => onRecorded(blob, fmt(seconds))}>✅ Use This</button>
          </div>
        </>
      )}
      <button onClick={onCancel} style={{ marginTop: 10, background: "none", border: "none", color: "rgba(201,168,76,0.3)", fontSize: 12, cursor: "pointer", width: "100%", padding: 6 }}>Cancel</button>
    </div>
  );
}

// ── POST CARD ──────────────────────────────────────────────────
function PostCard({ post, currentUser, onLike, onOpenComments, onEdit, onDelete, onSave, isSaved, onHashtag }) {
  const [viewer, setViewer]       = useState(null);
  const [views, setViews]         = useState(post.views || 0);
  const [showReactions, setShowReactions] = useState(false);
  const [showReport, setShowReport]       = useState(false);
  const [myReaction, setMyReaction]       = useState(null);
  const [reactionCounts, setReactionCounts] = useState({});
  const liked  = currentUser && (post.likes || []).some(l => l.user_id === currentUser.id);
  const author = post.is_anonymous ? null : post.profiles;

  // Load reactions
  useEffect(() => {
    supabase.from("reactions").select("emoji, user_id").eq("post_id", post.id).then(({ data }) => {
      if (!data) return;
      const counts = {};
      data.forEach(r => { counts[r.emoji] = (counts[r.emoji] || 0) + 1; });
      setReactionCounts(counts);
      if (currentUser) {
        const mine = data.find(r => r.user_id === currentUser.id);
        if (mine) setMyReaction(mine.emoji);
      }
    });
  }, [post.id, currentUser]);

  // View count — increment after 2s
  useEffect(() => {
    const timer = setTimeout(() => {
      supabase.rpc("increment_views", { post_id: post.id }).then(() => setViews(v => v + 1));
    }, 2000);
    return () => clearTimeout(timer);
  }, [post.id]);

  const handleReaction = async (emoji) => {
    if (!currentUser) return;
    setShowReactions(false);
    if (myReaction === emoji) {
      // Remove reaction
      await supabase.from("reactions").delete().eq("post_id", post.id).eq("user_id", currentUser.id);
      setReactionCounts(prev => ({ ...prev, [emoji]: Math.max(0, (prev[emoji] || 1) - 1) }));
      setMyReaction(null);
    } else {
      // Upsert reaction
      await supabase.from("reactions").upsert({ post_id: post.id, user_id: currentUser.id, emoji }, { onConflict: "post_id,user_id" });
      setReactionCounts(prev => {
        const next = { ...prev };
        if (myReaction) next[myReaction] = Math.max(0, (next[myReaction] || 1) - 1);
        next[emoji] = (next[emoji] || 0) + 1;
        return next;
      });
      setMyReaction(emoji);
    }
  };

  const shareToWhatsApp = () => {
    const text = `*${post.title}*\n\n${post.content}\n\n_Shared from TruthLynk — Clarity. Truth. Campus._\nhttps://collinstech10.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="gist-card" style={{ position: "relative" }}>
      {viewer && <MediaViewer url={viewer.url} type={viewer.type} onClose={() => setViewer(null)} />}

      {/* Reaction picker popup */}
      {showReactions && (
        <div style={{ position: "absolute", bottom: 56, left: 14, background: "#080f28", border: "1px solid #1a2855", borderRadius: 30, padding: "8px 12px", display: "flex", gap: 6, zIndex: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          {REACTIONS.map(e => (
            <button key={e} onClick={() => handleReaction(e)} style={{ background: myReaction === e ? "#1a2855" : "none", border: "none", fontSize: 22, cursor: "pointer", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s" }}
              onTouchStart={el => el.currentTarget.style.transform = "scale(1.3)"}
              onTouchEnd={el => el.currentTarget.style.transform = "scale(1)"}
            >{e}</button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Avatar user={author} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e8dfc8", display: "flex", alignItems: "center", gap: 4 }}>
              {post.is_anonymous ? "Anonymous" : (author?.full_name || author?.username || "User")}
              {!post.is_anonymous && author?.is_verified && <VerifiedBadge />}
            </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 11, color: "rgba(201,168,76,0.3)" }}>{timeAgo(post.created_at)}</div>
              {author?.last_seen && (() => { const mins = (Date.now() - new Date(author.last_seen)) / 60000; return mins < 2 ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4caf50" }} title="Online" /> : null; })()}
            </div>
        </div>
        <span className="badge">{CAT_LABEL[post.category] || post.category}</span>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: "#e8dfc8", marginBottom: 6, lineHeight: 1.4 }}>{post.title}</div>
      <div style={{ fontSize: 13, color: "rgba(201,168,76,0.6)", marginBottom: 10, lineHeight: 1.6 }}>{parseText(post.content, onHashtag)}</div>

      {/* Image Gallery — smart grid */}
      {(() => {
        const imgs = post.post_media?.filter(m => m.media_type !== "audio") || [];
        if (imgs.length === 0) return null;
        if (imgs.length === 1) return (
          <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 10, cursor: "pointer" }} onClick={() => setViewer({ url: imgs[0].url, type: imgs[0].media_type })}>
            {imgs[0].media_type === "video"
              ? <div style={{ position: "relative" }}><video src={imgs[0].url} style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} /><div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 50, height: 50, background: "rgba(0,0,0,0.65)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>▶️</div></div></div>
              : <LazyImage src={imgs[0].url} style={{ height: 220 }} />
            }
          </div>
        );
        if (imgs.length === 2) return (
          <div className="img-grid-2" style={{ marginBottom: 10 }}>
            {imgs.map((m, i) => <LazyImage key={i} src={m.url} style={{ height: 140 }} onClick={() => setViewer({ url: m.url, type: m.media_type })} />)}
          </div>
        );
        return (
          <div className="img-grid-3" style={{ marginBottom: 10 }}>
            <LazyImage src={imgs[0].url} style={{ height: 160 }} onClick={() => setViewer({ url: imgs[0].url, type: imgs[0].media_type })} />
            {imgs.slice(1, 3).map((m, i) => (
              <div key={i} style={{ position: "relative" }}>
                <LazyImage src={m.url} style={{ height: 100 }} onClick={() => setViewer({ url: m.url, type: m.media_type })} />
                {i === 1 && imgs.length > 3 && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", cursor: "pointer" }} onClick={() => setViewer({ url: imgs[2].url, type: imgs[2].media_type })}>+{imgs.length - 3}</div>}
              </div>
            ))}
          </div>
        );
      })()}

      {/* Voice notes */}
      {post.post_media?.filter(m => m.media_type === "audio").map((m, i) => (
        <div key={i} style={{ background: "#040812", borderRadius: 10, padding: "10px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🎙️</span>
          <audio src={m.url} controls style={{ flex: 1, height: 36 }} />
        </div>
      ))}

      {/* Reaction summary */}
      {totalReactions > 0 && (
        <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
          {Object.entries(reactionCounts).filter(([,c]) => c > 0).map(([e, c]) => (
            <div key={e} onClick={() => handleReaction(e)} style={{ background: myReaction === e ? "#1a2855" : "#162816", border: `1px solid ${myReaction === e ? "#c9a84c" : "#162248"}`, borderRadius: 20, padding: "3px 10px", fontSize: 12, color: "#e8dfc8", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              {e} <span style={{ color: "rgba(201,168,76,0.55)" }}>{c}</span>
            </div>
          ))}
        </div>
      )}

      {/* Poll */}
      <PollWidget postId={post.id} currentUser={currentUser} />

      {/* AI Verdict badge */}
      {post.ai_verdict && (
        <div style={{ background: post.ai_verdict === "true" ? "#0a1030" : post.ai_verdict === "false" ? "#3a1a1a" : "#2a2a1a", border: `1px solid ${post.ai_verdict === "true" ? "#8a6820" : post.ai_verdict === "false" ? "#7a2a2a" : "#7a7a2a"}`, borderRadius: 10, padding: "8px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{post.ai_verdict === "true" ? "✅" : post.ai_verdict === "false" ? "❌" : "⚠️"}</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: post.ai_verdict === "true" ? "#c9a84c" : post.ai_verdict === "false" ? "#ef5350" : "#ffca28" }}>
              AI: {post.ai_verdict === "true" ? "Likely True" : post.ai_verdict === "false" ? "Likely False" : "Unverified"}
            </div>
            {post.ai_reason && <div style={{ fontSize: 11, color: "rgba(201,168,76,0.55)", marginTop: 1 }}>{post.ai_reason}</div>}
          </div>
        </div>
      )}

      {/* Action bar */}
      <div style={{ display: "flex", gap: 2, borderTop: "1px solid #080f28", paddingTop: 10, alignItems: "center" }}>
        <button className={`like-btn${liked ? " liked" : ""}`} onClick={() => onLike(post)}>{liked ? "❤️" : "🤍"} {(post.likes||[]).length}</button>
        <button className="like-btn" onClick={() => setShowReactions(p => !p)}>😊</button>
        <button className="like-btn" onClick={() => onOpenComments(post)}>💬 {(post.comments||[]).length}</button>
        <div style={{ flex: 1 }} />
        <button className="like-btn" onClick={shareToWhatsApp}>📲</button>
        <button className="like-btn" onClick={() => onSave && onSave(post)} title="Save post">
          {isSaved ? "🔖" : "📑"}
        </button>
        <button className="like-btn" onClick={() => setShowReport(true)}>🚩</button>
        <span style={{ fontSize: 11, color: "rgba(201,168,76,0.3)", alignSelf: "center" }}>👁 {views}</span>
      </div>

      {/* Edit/Delete for own posts */}
      {currentUser && post.author_id === currentUser.id && (
        <div style={{ display: "flex", gap: 8, marginTop: 8, paddingTop: 8, borderTop: "1px solid #080f28" }}>
          <button onClick={() => onEdit && onEdit(post)} style={{ flex: 1, background: "none", border: "1px solid #162248", borderRadius: 8, padding: "6px", color: "rgba(201,168,76,0.55)", cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>✏️ Edit</button>
          <button onClick={async () => {
            if (!window.confirm("Delete this post?")) return;
            await supabase.from("posts").delete().eq("id", post.id);
            onDelete && onDelete(post.id);
          }} style={{ flex: 1, background: "none", border: "1px solid #7a2a2a", borderRadius: 8, padding: "6px", color: "#ef5350", cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>🗑️ Delete</button>
        </div>
      )}

      {showReport && <ReportModal post={post} currentUser={currentUser} onClose={() => setShowReport(false)} />}
    </div>
  );
}

// ── COMMENTS MODAL ─────────────────────────────────────────────
function CommentsModal({ post, currentUser, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    supabase.from("comments").select("*, profiles(username,full_name,avatar_url)").eq("post_id", post.id).order("created_at")
      .then(({ data }) => setComments(data || []));
  }, [post.id]);

  const submit = async () => {
    if (!text.trim() || !currentUser) return;
    setLoading(true);
    const { data, error } = await supabase.from("comments")
      .insert({ post_id: post.id, author_id: currentUser.id, content: text })
      .select("*, profiles(username,full_name,avatar_url)").single();
    if (!error) {
      setComments(p => [...p, data]);
      setText("");
      // Notify post author
      if (post.author_id && post.author_id !== currentUser.id) {
        const msg = `${currentUser.full_name || currentUser.username} commented on "${post.title.slice(0,40)}"`;
        await supabase.from("notifications").insert({
          user_id: post.author_id, from_user: currentUser.id, post_id: post.id,
          type: "comment", message: msg
        }).catch(() => {});
        sendLocalNotification("TruthLynk 💬", msg);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ background: "#040812", borderRadius: "20px 20px 0 0", border: "1px solid #162248", maxHeight: "75vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #080f28", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Comments ({comments.length})</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.55)", fontSize: 22, cursor: "pointer", padding: 4 }}>✕</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "12px 20px" }}>
          {comments.length === 0 && <div style={{ color: "rgba(201,168,76,0.3)", fontSize: 13, textAlign: "center", padding: 24 }}>No comments yet — be first!</div>}
          {comments.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <Avatar user={c.profiles} size={30} />
              <div style={{ background: "#080f28", borderRadius: "0 12px 12px 12px", padding: "8px 12px", flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#c9a84c", marginBottom: 2 }}>{c.profiles?.username || "User"}</div>
                <div style={{ fontSize: 13, color: "#e8dfc8" }}>{c.content}</div>
              </div>
            </div>
          ))}
        </div>
        {currentUser && (
          <div style={{ padding: "12px 20px", borderTop: "1px solid #080f28", display: "flex", gap: 10, background: "#040812" }}>
            <input className="rc-input" value={text} onChange={e => setText(e.target.value)} placeholder="Add a comment..." onKeyDown={e => e.key === "Enter" && submit()} style={{ flex: 1 }} />
            <button onClick={submit} disabled={loading} style={{ width: 46, height: 46, background: "linear-gradient(135deg,#8a6820,#c9a84c)", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 18, flexShrink: 0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : "➤"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── AUTH SCREEN ────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode]       = useState("login");
  const [form, setForm]       = useState({ username: "", email: "", password: "", fullName: "", school: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        // Immediately call onAuth — don't wait for anything else
        const u = data.user;
        onAuth({ ...u, username: u.user_metadata?.username || u.email?.split("@")[0] || "User", full_name: u.user_metadata?.full_name || "", school: u.user_metadata?.school || "" });
        // Load full profile in background silently
        supabase.from("profiles").select("*").eq("id", u.id).single()
          .then(({ data: profile }) => { if (profile) onAuth({ ...u, ...profile }); })
          .catch(() => {});
      } else {
        if (!form.username.trim()) throw new Error("Username is required");
        const { data, error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { username: form.username, full_name: form.fullName, school: form.school } },
        });
        if (error) throw error;
        onAuth({ ...data.user, username: form.username, full_name: form.fullName, school: form.school });
      }
      playLoginSound();
    } catch (e) { setError(e.message); setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#02040e 0%,#040d1e 50%,#020818 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{CSS}</style>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg,#b8912a,#f0d878,#c9a84c)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 14px", boxShadow: "0 0 40px rgba(201,168,76,0.4)" }}>🔍</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#e8dfc8" }}>TruthLynk</div>
          <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginTop: 4 }}>Clarity. Truth. Campus.</div>
        </div>
        <div style={{ background: "rgba(4,8,24,0.9)", borderRadius: 24, border: "1px solid rgba(201,168,76,0.15)", backdropFilter: "blur(20px)", padding: 24 }}>
          <div style={{ display: "flex", marginBottom: 20, background: "#040812", borderRadius: 10, padding: 3 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: 10, border: "none", borderRadius: 8, background: mode === m ? "#8a6820" : "transparent", color: mode === m ? "#e8dfc8" : "rgba(201,168,76,0.55)", fontWeight: 600, cursor: "pointer", fontSize: 14, fontFamily: "'Outfit',sans-serif", transition: "all .2s" }}>
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mode === "register" && <>
              <input className="rc-input" placeholder="Full name" value={form.fullName} onChange={e => set("fullName", e.target.value)} />
              <input className="rc-input" placeholder="Username *" value={form.username} onChange={e => set("username", e.target.value)} />
              <input className="rc-input" placeholder="School name" value={form.school} onChange={e => set("school", e.target.value)} />
            </>}
            <input className="rc-input" placeholder="Email address" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
            <input className="rc-input" placeholder="Password (min 6 chars)" type="password" value={form.password} onChange={e => set("password", e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
            <button className="primary-btn" onClick={submit} disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <div className="spinner" /> : (mode === "login" ? "Log In" : "Create Account")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────
export default function TruthLynk() {
  const [showSplash, setShowSplash]   = useState(() => !sessionStorage.getItem("tl_splash_done"));
  const [lang, setLang]               = useState(() => localStorage.getItem("tl_lang") || "en");
  const t = (key) => LANGS[lang]?.[key] || LANGS.en[key] || key;
  const [user, setUser]               = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab]                 = useState("home");
  const [posts, setPosts]             = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [filterCat, setFilterCat]     = useState("");
  const [commentPost, setCommentPost] = useState(null);
  const [newPost, setNewPost]         = useState({ title: "", content: "", category: "campus", tags: "", isAnonymous: false });
  const [postFiles, setPostFiles]     = useState([]);
  const [voiceBlob, setVoiceBlob]     = useState(null);
  const [voiceDuration, setVoiceDuration] = useState("");
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError]     = useState("");
  const [postSuccess, setPostSuccess] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [editingPost, setEditingPost]     = useState(null);
  const [editForm, setEditForm]           = useState({ title: "", content: "" });
  const [savedPosts, setSavedPosts]       = useState([]);
  const [savedIds, setSavedIds]           = useState(new Set());
  const [schoolFilter, setSchoolFilter]   = useState("");
  const [showSchools, setShowSchools]     = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings]   = useState(false);
  const [profileTab, setProfileTab]       = useState("posts");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDMs, setShowDMs]               = useState(false);
  const [aiMsgCount, setAiMsgCount]         = useState(0);
  const [postCharCount, setPostCharCount]   = useState(0);
  const [searchQuery, setSearchQuery]     = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch]       = useState(false);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [feedMode, setFeedMode]           = useState("all"); // all | following
  const [installPrompt, setInstallPrompt] = useState(null);
  const [activeHashtag, setActiveHashtag]   = useState(null);
  const [page, setPage]                     = useState(1);
  const [hasMore, setHasMore]               = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("tl_onboarded"));
  const [feedView, setFeedView]             = useState("latest");
  const fileInputRef  = useRef();
  const feedRef       = useRef();

  // ── Register service worker on load ──
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // ── Online presence ──
  useOnlinePresence(user?.id);

  // ── Session check — fast, never gets stuck ──
  useEffect(() => {
    // Hard timeout: show login screen after 4s no matter what
    const timeout = setTimeout(() => setAuthChecked(true), 4000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      if (session?.user) {
        const u = session.user;
        // Set user immediately from metadata — no DB call needed to log in
        setUser({
          ...u,
          username: u.user_metadata?.username || u.email?.split("@")[0] || "User",
          full_name: u.user_metadata?.full_name || "",
          school: u.user_metadata?.school || "",
        });
        // Load full profile in background
        supabase.from("profiles").select("*").eq("id", u.id).single()
          .then(({ data: p }) => { if (p) setUser(prev => ({ ...prev, ...p })); })
          .catch(() => {});
      }
      setAuthChecked(true);
    }).catch(() => { clearTimeout(timeout); setAuthChecked(true); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser(prev => ({
          ...u,
          username: prev?.username || u.user_metadata?.username || u.email?.split("@")[0] || "User",
          full_name: prev?.full_name || u.user_metadata?.full_name || "",
          school: prev?.school || u.user_metadata?.school || "",
        }));
      } else { setUser(null); }
    });
    return () => { subscription.unsubscribe(); clearTimeout(timeout); };
  }, []);

  const loadPosts = useCallback(async (cat = "", school = "", pageNum = 1, append = false) => {
    setPostsLoading(true);
    const PAGE_SIZE = 20;
    let q = supabase.from("posts")
      .select("*, profiles(username,full_name,avatar_url,is_verified,verified_role,last_seen), post_media(url,media_type), likes(user_id), comments(id), ai_verdict, ai_reason")
      .order("created_at", { ascending: false })
      .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1);
    if (cat)    q = q.eq("category", cat);
    if (school) q = q.eq("school", school);
    const { data } = await q;
    const newPosts = data || [];
    setHasMore(newPosts.length === PAGE_SIZE);
    if (append) setPosts(prev => [...prev, ...newPosts]);
    else setPosts(newPosts);
    setPostsLoading(false);
  }, []);

  useEffect(() => { if (authChecked) loadPosts(); }, [authChecked, loadPosts]);

  // Load saved posts
  useEffect(() => {
    if (!user) return;
    supabase.from("saved_posts").select("post_id").eq("user_id", user.id)
      .then(({ data }) => {
        const ids = new Set((data || []).map(s => s.post_id));
        setSavedIds(ids);
      });
  }, [user?.id]);

  // Load following feed
  useEffect(() => {
    if (!user || feedMode !== "following") return;
    supabase.from("follows").select("following_id").eq("follower_id", user.id)
      .then(({ data }) => {
        const ids = (data || []).map(f => f.following_id);
        if (!ids.length) { setFollowingPosts([]); return; }
        supabase.from("posts")
          .select("*, profiles(username,full_name,avatar_url), post_media(url,media_type), likes(user_id), comments(id), ai_verdict, ai_reason")
          .in("author_id", ids).order("created_at", { ascending: false }).limit(30)
          .then(({ data: fp }) => setFollowingPosts(fp || []));
      });
  }, [user?.id, feedMode]);

  // Capture PWA install prompt
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Load notifications + register push
  useEffect(() => {
    if (!user) return;
    supabase.from("notifications").select("*, profiles!notifications_from_user_fkey(username,full_name,avatar_url)")
      .eq("user_id", user.id).order("created_at", { ascending: false }).limit(30)
      .then(({ data }) => {
        setNotifications(data || []);
        setUnreadCount((data || []).filter(n => !n.is_read).length);
      });

    // Register service worker for push notifications
    registerPush(user.id);

    // Real-time notifications — also fire push when new one arrives
    const sub = supabase.channel("notifs-" + user.id).on("postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
      (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(c => c + 1);
        playNotifSound();
        sendLocalNotification("TruthLynk 🔔", payload.new.message || "You have a new notification");
      }
    ).subscribe();
    return () => supabase.removeChannel(sub);
  }, [user?.id]);

  const handleLike = async (post) => {
    if (!user) return;
    const liked = (post.likes || []).some(l => l.user_id === user.id);
    if (liked) {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", user.id);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes.filter(l => l.user_id !== user.id) } : p));
    } else {
      await supabase.from("likes").insert({ post_id: post.id, user_id: user.id });
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: [...(p.likes||[]), { user_id: user.id }] } : p));
      // Notify post author
      if (post.author_id && post.author_id !== user.id) {
        const msg = `${user.full_name || user.username} liked your post "${post.title.slice(0,40)}"`;
        await supabase.from("notifications").insert({
          user_id: post.author_id, from_user: user.id, post_id: post.id,
          type: "like", message: msg
        }).catch(() => {});
        // If author is current user on another tab, fire push
        sendLocalNotification("TruthLynk ❤️", msg);
      }
    }
  };

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditForm({ title: post.title, content: post.content });
  };

  const handleEditSave = async () => {
    if (!editingPost) return;
    const { error } = await supabase.from("posts").update({ title: editForm.title, content: editForm.content }).eq("id", editingPost.id);
    if (!error) {
      setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...editForm } : p));
      setEditingPost(null);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) { setPostError("Title and content are required."); return; }
    setPostLoading(true); setPostError(""); setPostSuccess("");
    try {
      const { data: post, error: pe } = await supabase.from("posts").insert({
        author_id: user.id, title: newPost.title, content: newPost.content,
        category: newPost.category, is_anonymous: newPost.isAnonymous,
        school: user.school || "",
        tags: newPost.tags ? newPost.tags.split(",").map(t => t.trim()) : [],
      }).select().single();
      if (pe) throw pe;

      // Upload images/videos
      for (const file of postFiles) {
        const ext  = file.name.split(".").pop();
        const path = `${user.id}/${post.id}-${Date.now()}.${ext}`;
        const { data: uploaded } = await supabase.storage.from("post-media").upload(path, file);
        if (uploaded) {
          const { data: { publicUrl } } = supabase.storage.from("post-media").getPublicUrl(path);
          await supabase.from("post_media").insert({ post_id: post.id, url: publicUrl, media_type: file.type.startsWith("video") ? "video" : "image" });
        }
      }

      // Upload voice note
      if (voiceBlob) {
        const path = `${user.id}/${post.id}-voice-${Date.now()}.webm`;
        const { data: uploaded } = await supabase.storage.from("post-media").upload(path, voiceBlob, { contentType: "audio/webm" });
        if (uploaded) {
          const { data: { publicUrl } } = supabase.storage.from("post-media").getPublicUrl(path);
          await supabase.from("post_media").insert({ post_id: post.id, url: publicUrl, media_type: "audio" });
        }
      }

      setNewPost({ title: "", content: "", category: "campus", tags: "", isAnonymous: false });
      setPostFiles([]); setVoiceBlob(null); setVoiceDuration("");
      setPostSuccess("Gist posted! 🎉 AI is checking it now...");
      // Notify the poster themselves via push
      sendLocalNotification("TruthLynk 🚀", `Your gist "${newPost.title.slice(0,40)}" has been posted!`);
      // Award XP + update streak
      supabase.rpc("add_xp", { user_id: user.id, amount: 10 }).then(() => {
        setUser(prev => ({ ...prev, xp: (prev.xp || 0) + 10 }));
      }).catch(() => {});
      supabase.rpc("update_streak", { user_id: user.id }).catch(() => {});
      loadPosts(filterCat);
      // Auto AI fact-check in background
      await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a fact-checker. Given a school gist/rumor, respond ONLY with a JSON object: {"verdict": "true|false|unverified", "reason": "one short sentence explanation max 80 chars"}. No other text.\n\nTitle: ${post.title}\nContent: ${post.content}` }] }],
          generationConfig: { maxOutputTokens: 100 }
        })
      })
      setTimeout(() => { setPostSuccess(""); setTab("feed"); }, 2000);
    } catch (e) { setPostError(e.message); }
    setPostLoading(false);
  };

  const handleSearch = async (q) => {
    if (!q.trim()) { setSearchResults([]); return; }
    const { data } = await supabase.from("posts")
      .select("*, profiles(username,full_name,avatar_url), post_media(url,media_type), likes(user_id), comments(id), ai_verdict, ai_reason")
      .or(`title.ilike.%${q}%,content.ilike.%${q}%`).order("created_at", { ascending: false }).limit(20);
    setSearchResults(data || []);
  };

  const handleSave = async (post) => {
    if (!user) return;
    if (savedIds.has(post.id)) {
      await supabase.from("saved_posts").delete().eq("user_id", user.id).eq("post_id", post.id);
      setSavedIds(prev => { const n = new Set(prev); n.delete(post.id); return n; });
      setSavedPosts(prev => prev.filter(p => p.id !== post.id));
    } else {
      await supabase.from("saved_posts").insert({ user_id: user.id, post_id: post.id });
      setSavedIds(prev => new Set([...prev, post.id]));
      setSavedPosts(prev => [post, ...prev]);
    }
  };

  const installApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  const logout = async () => { await supabase.auth.signOut(); setUser(null); setPosts([]); };

  if (showSplash) return (
    <>
      <style>{CSS}</style>
      <SplashScreen onDone={() => { sessionStorage.setItem("tl_splash_done", "1"); setShowSplash(false); }} />
    </>
  );

  if (showOnboarding && !user) return (
    <>
      <style>{CSS}</style>
      <OnboardingFlow onDone={() => { localStorage.setItem("tl_onboarded", "1"); setShowOnboarding(false); }} />
    </>
  );

  if (!authChecked) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#02040e 0%,#040d1e 50%,#020818 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{CSS}</style>
      <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  );

  if (!user) return <AuthScreen onAuth={u => { setUser(u); loadPosts(); }} />;

  const myPosts = posts.filter(p => p.author_id === user.id);

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: "linear-gradient(160deg,#02040e 0%,#040d1e 60%,#020818 100%)", minHeight: "100vh", color: "#e8dfc8", display: "flex", flexDirection: "column" }}>
      <style>{CSS}</style>

      <div style={{ background: "rgba(2,4,14,0.97)", borderBottom: "1px solid #080f28", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#8a6820,#e8c96a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔍</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, letterSpacing: "-0.5px", background: "linear-gradient(135deg,#c9a84c,#f0d878)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TruthLynk</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ cursor: "pointer", fontSize: 20 }} onClick={() => setShowSearch(p => !p)}>🔍</div>
            {installPrompt && <div style={{ cursor: "pointer", fontSize: 20 }} onClick={installApp} title="Install App">📲</div>}
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setTab("notifs")}>
              <div style={{ fontSize: 20 }}>🔔</div>
              {unreadCount > 0 && (
                <div style={{ position: "absolute", top: -4, right: -4, background: "#ef5350", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>{unreadCount > 9 ? "9+" : unreadCount}</div>
              )}
            </div>
            <Avatar user={user} size={32} />
          </div>
        </div>
        {/* Search bar */}
        {showSearch && (
          <div style={{ padding: "0 20px 12px", display: "flex", gap: 10 }}>
            <input className="rc-input" placeholder="Search gists, topics..." autoFocus
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); handleSearch(e.target.value); }}
              style={{ flex: 1, padding: "10px 14px", fontSize: 14 }}
            />
            <button onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchResults([]); }} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.55)", fontSize: 18, cursor: "pointer", padding: "0 4px" }}>✕</button>
          </div>
        )}
        {/* Search results dropdown */}
        {showSearch && searchResults.length > 0 && (
          <div style={{ padding: "0 20px 12px" }}>
            {searchResults.slice(0, 5).map(post => (
              <div key={post.id} onClick={() => { setTab("feed"); setShowSearch(false); setSearchQuery(""); setSearchResults([]); }}
                style={{ background: "#080f28", borderRadius: 10, padding: "10px 14px", marginBottom: 6, cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                <span className="badge">{CAT_LABEL[post.category]}</span>
                <div style={{ fontSize: 13, color: "#e8dfc8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 110 }}>

        {tab === "home" && (
          <div className="slide-up" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 2 }}>{t("greeting")}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{t("hi")}, {user.full_name || user.username} 👋</div>
            <div style={{ background: "linear-gradient(135deg,#060d20,#0c1438)", border: "1px solid #1a2855", borderRadius: 18, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#c9a84c", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>🏫 {user.school || "Your School"}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>What's happening today?</div>
              <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 14 }}>Browse gists, post news, or explore by category.</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button className="secondary-btn" onClick={() => setTab("feed")}>📰 Browse Feed</button>
                <button className="secondary-btn" onClick={() => setTab("post")}>✏️ Post Gist</button>
              </div>
            </div>
            {/* Stories */}
            {posts.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <StoriesBar user={user} posts={posts} />
              </div>
            )}

            {/* AI Daily Digest */}
            <AIDailyDigest posts={posts} />

            {/* Pinned posts */}
            {posts.filter(p => p.is_pinned).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#ffca28", marginBottom: 8 }}>📌 Pinned</div>
                {posts.filter(p => p.is_pinned).map(post => (
                  <PostCard key={post.id} post={post} currentUser={user} onLike={handleLike} onOpenComments={setCommentPost} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSave} isSaved={savedIds.has(post.id)} />
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span className="section-title">{t("categories")}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
              {CATEGORIES.map(cat => {
                const v = CAT_VISUAL[cat.id] || { icon: cat.icon, color: "#c9a84c", bg: "rgba(201,168,76,0.1)", border: "rgba(201,168,76,0.2)" };
                return (
                  <div key={cat.id} onClick={() => { setFilterCat(cat.id); loadPosts(cat.id, schoolFilter); setTab("feed"); }}
                    style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: 18, padding: "16px 10px", cursor: "pointer", textAlign: "center", transition: "all .2s" }}
                    className="tap-scale">
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{v.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: v.color }}>{cat.label}</div>
                  </div>
                );
              })}
            </div>
            {/* Trending Posts */}
            {(() => {
              const trending = [...posts].sort((a,b) => ((b.likes?.length||0) + (b.views||0)) - ((a.likes?.length||0) + (a.views||0))).slice(0,3);
              return trending.length > 0 ? (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span className="section-title">🔥 Trending Now</span>
                    <button className="view-all" onClick={() => setTab("feed")}>See all</button>
                  </div>
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                    {trending.map((post, i) => (
                      <div key={post.id} onClick={() => { setTab("feed"); }} style={{ minWidth: 200, background: "#080f28", border: "1px solid #162248", borderRadius: 14, padding: 14, flexShrink: 0, cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <div style={{ width: 22, height: 22, background: i === 0 ? "#ff6b00" : i === 1 ? "#9e9e9e" : "#8d6e63", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>#{i+1}</div>
                          <span className="badge">{CAT_LABEL[post.category]}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#e8dfc8", lineHeight: 1.3, marginBottom: 6 }}>{post.title.slice(0,60)}{post.title.length > 60 ? "..." : ""}</div>
                        <div style={{ display: "flex", gap: 8, fontSize: 11, color: "rgba(201,168,76,0.3)" }}>
                          <span>❤️ {post.likes?.length || 0}</span>
                          <span>👁 {post.views || 0}</span>
                          <span>💬 {post.comments?.length || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span className="section-title">Recent Gists</span>
              <button className="view-all" onClick={() => setTab("feed")}>View all</button>
            </div>
            {postsLoading
              ? <div style={{ textAlign: "center", padding: 24 }}><div className="spinner" /></div>
              : posts.slice(0, 3).map(post => <PostCard key={post.id} post={post} currentUser={user} onLike={handleLike} onOpenComments={setCommentPost} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSave} isSaved={savedIds.has(post.id)} onHashtag={tag => setActiveHashtag(tag)} />)
            }
          </div>
        )}

        {tab === "feed" && (
          <div className="slide-up">
            <div style={{ padding: "16px 20px 10px", borderBottom: "1px solid #080f28" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700 }}>Feed</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="secondary-btn" style={{ padding: "6px 10px", fontSize: 11 }} onClick={() => setShowSchools(p => !p)}>🏫 Schools</button>
                  <button className="secondary-btn" style={{ padding: "6px 10px", fontSize: 11 }} onClick={() => setShowLeaderboard(p => !p)}>🏆</button>
                </div>
              </div>
                            {/* Feed mode toggle */}
              <div style={{ display: "flex", background: "rgba(4,8,18,0.8)", borderRadius: 12, padding: 3, marginBottom: 10 }}>
                {[["latest","🕐 Latest"],["foryou","✨ For You"],["following","👥 Following"]].map(([m, label]) => (
                  <button key={m}
                    onClick={() => { if (m === "following") setFeedMode("following"); else { setFeedMode("all"); } setFeedView(m); }}
                    style={{ flex: 1, padding: "7px 2px", border: "none", borderRadius: 10, background: feedView === m ? "rgba(201,168,76,0.15)" : "transparent", color: feedView === m ? "#c9a84c" : "rgba(201,168,76,0.35)", fontWeight: 700, cursor: "pointer", fontSize: 11, fontFamily: "'Outfit',sans-serif", transition: "all .2s", whiteSpace: "nowrap" }}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                <button className={`tab-btn${filterCat === "" ? " active" : ""}`} onClick={() => { setFilterCat(""); loadPosts(""); }}>All</button>
                {CATEGORIES.map(c => (
                  <button key={c.id} className={`tab-btn${filterCat === c.id ? " active" : ""}`} onClick={() => { setFilterCat(c.id); loadPosts(c.id); }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: "14px 20px" }}>
              {postsLoading
                ? <div style={{ textAlign: "center", padding: 40 }}><div className="spinner" style={{ width: 30, height: 30 }} /></div>
                : posts.length === 0
                  ? <div style={{ textAlign: "center", padding: 40, color: "rgba(201,168,76,0.3)" }}>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                      <div style={{ marginBottom: 12 }}>No gists yet.</div>
                      <button className="secondary-btn" style={{ margin: "0 auto" }} onClick={() => setTab("post")}>Be the first!</button>
                    </div>
                  : (feedMode === "following" ? followingPosts : posts).map(post => <PostCard key={post.id} post={post} currentUser={user} onLike={handleLike} onOpenComments={setCommentPost} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSave} isSaved={savedIds.has(post.id)} />)
              }
              {feedMode === "following" && followingPosts.length === 0 && !postsLoading && (
                <div style={{ textAlign: "center", padding: 30, color: "rgba(201,168,76,0.3)" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>👥</div>
                  <div>Follow people to see their posts here!</div>
                </div>
              )}
              {/* Load More */}
              {hasMore && !postsLoading && posts.length > 0 && feedMode === "all" && (
                <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
                  <button className="secondary-btn" style={{ margin: "0 auto" }} onClick={() => {
                    const next = page + 1;
                    setPage(next);
                    loadPosts(filterCat, schoolFilter, next, true);
                  }}>📄 Load More</button>
                </div>
              )}
              {postsLoading && posts.length > 0 && (
                <div style={{ textAlign: "center", padding: 16 }}><div className="spinner" /></div>
              )}
            </div>
            {/* School browser overlay */}
            {showSchools && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200 }} onClick={() => setShowSchools(false)}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#040812", borderRadius: "20px 20px 0 0", maxHeight: "70vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
                  <SchoolBrowser currentSchool={schoolFilter} onSelectSchool={(s) => { setSchoolFilter(s); loadPosts(filterCat, s); setShowSchools(false); }} />
                </div>
              </div>
            )}
            {/* Leaderboard overlay */}
            {showLeaderboard && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200 }} onClick={() => setShowLeaderboard(false)}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#040812", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
                  <Leaderboard posts={posts} />
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "post" && (
          <div className="slide-up" style={{ padding: 20 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t("postTitle")}</div>
            <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 20 }}>Share what's happening in your school.</div>
            {postError   && <div className="error-msg">{postError}</div>}
            {postSuccess && <div className="success-msg">{postSuccess}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input className="rc-input" placeholder="Title / Headline *" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
              {/* AI Write For Me — premium only */}
              {(user.is_verified || user.is_premium) && (
                <AIWriteForMe category={newPost.category} onInsert={(text) => setNewPost(p => ({ ...p, content: text }))} />
              )}
              <div style={{ position: "relative" }}>
                <textarea className="rc-input" placeholder="What happened? Give full details... *" rows={4}
                  value={newPost.content}
                  onChange={e => {
                    const val = e.target.value;
                    const limit = (user.is_verified || user.is_premium) ? 9999 : MAX_CHARS_FREE;
                    if (val.length <= limit) { setNewPost(p => ({ ...p, content: val })); setPostCharCount(val.length); }
                  }}
                />
                <div style={{ position: "absolute", bottom: 8, right: 12, fontSize: 10, color: newPost.content.length >= MAX_CHARS_FREE && !user.is_verified ? "#ef5350" : "rgba(201,168,76,0.3)" }}>
                  {newPost.content.length}{!user.is_verified && !user.is_premium ? `/${MAX_CHARS_FREE}` : ""}
                </div>
              </div>
              {!user.is_verified && !user.is_premium && newPost.content.length >= MAX_CHARS_FREE && (
                <div style={{ background: "#3a1a1a", border: "1px solid #7a2a2a", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#ff8a80" }}>
                  ✅ Get Verified to post unlimited content
                </div>
              )}

              <div>
                <div style={{ fontSize: 12, color: "rgba(201,168,76,0.55)", marginBottom: 8 }}>Category *</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {CATEGORIES.map(c => (
                    <button key={c.id} onClick={() => setNewPost(p => ({ ...p, category: c.id }))} style={{ background: newPost.category === c.id ? "#8a6820" : "#080f28", border: `1px solid ${newPost.category === c.id ? "#c9a84c" : "#162248"}`, borderRadius: 10, padding: "10px 4px", color: "#e8dfc8", cursor: "pointer", fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, transition: "all .2s", minHeight: 52 }}>
                      {c.icon}<br />{c.label}
                    </button>
                  ))}
                </div>
              </div>

              <input className="rc-input" placeholder="Tags (comma separated, optional)" value={newPost.tags} onChange={e => setNewPost(p => ({ ...p, tags: e.target.value }))} />

              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#080f28", border: "1px solid #162248", borderRadius: 12, padding: "14px 16px" }}>
                <input type="checkbox" id="anon" checked={newPost.isAnonymous} onChange={e => setNewPost(p => ({ ...p, isAnonymous: e.target.checked }))} style={{ accentColor: "#c9a84c", width: 18, height: 18 }} />
                <label htmlFor="anon" style={{ fontSize: 14, color: "#d4b870", cursor: "pointer" }}>Post anonymously</label>
              </div>

              {/* Photo/Video */}
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }} onChange={e => {
                const files = Array.from(e.target.files);
                const tooBig = files.filter(f => f.size > 30 * 1024 * 1024);
                if (tooBig.length) { setPostError(`"${tooBig[0].name}" is too large. Max 30MB per file.`); return; }
                setPostError(""); setPostFiles(files);
              }} />
              <button className="secondary-btn" style={{ width: "100%" }} onClick={() => fileInputRef.current.click()}>
                📎 {postFiles.length ? `${postFiles.length} file(s) selected` : "Attach Photos / Videos (max 30MB)"}
              </button>
              {postFiles.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                  {postFiles.map((f, i) => (
                    <div key={i} style={{ background: "#080f28", border: "1px solid #162248", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#d4b870" }}>
                      {f.type.startsWith("video") ? "🎬" : "🖼️"} {f.name.length > 18 ? f.name.slice(0,16)+"..." : f.name} ({(f.size/1024/1024).toFixed(1)}MB)
                    </div>
                  ))}
                </div>
              )}
              {postLoading && postFiles.length > 0 && (
                <div style={{ background: "#080f28", border: "1px solid #1a2855", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#d4b870", display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="spinner" style={{ width: 14, height: 14 }} /> Uploading media, please wait...
                </div>
              )}

              {/* Voice Note */}
              {showVoiceRecorder ? (
                <VoiceRecorder
                  onRecorded={(blob, duration) => { setVoiceBlob(blob); setVoiceDuration(duration); setShowVoiceRecorder(false); }}
                  onCancel={() => setShowVoiceRecorder(false)}
                />
              ) : voiceBlob ? (
                <div style={{ background: "#080f28", border: "1px solid #1a2855", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🎙️</span>
                  <div style={{ flex: 1, fontSize: 13, color: "#d4b870" }}>Voice note ({voiceDuration})</div>
                  <button onClick={() => { setVoiceBlob(null); setVoiceDuration(""); }} style={{ background: "none", border: "none", color: "#ef5350", cursor: "pointer", fontSize: 18, padding: 4 }}>✕</button>
                </div>
              ) : (
                <button className="secondary-btn" style={{ width: "100%" }} onClick={() => setShowVoiceRecorder(true)}>
                  🎙️ Record Voice Note
                </button>
              )}

              <button className="primary-btn" onClick={handlePostSubmit} disabled={postLoading}>
                {postLoading ? <div className="spinner" /> : "🚀 Post Gist"}
              </button>
            </div>
          </div>
        )}

        {tab === "memories" && (
          <div className="slide-up" style={{ padding: 20 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Memories</div>
            <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 14 }}>Search past gists from your school.</div>
            <input className="rc-input" placeholder="Search past gists..." style={{ marginBottom: 16 }} onChange={e => handleSearch(e.target.value)} />
            {postsLoading
              ? <div style={{ textAlign: "center", padding: 30 }}><div className="spinner" /></div>
              : posts.map(post => <PostCard key={post.id} post={post} currentUser={user} onLike={handleLike} onOpenComments={setCommentPost} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSave} isSaved={savedIds.has(post.id)} />)
            }
          </div>
        )}

        {tab === "events" && <EventCalendar user={user} />}

        {tab === "ai" && <AIScreen posts={posts} />}

        {tab === "video" && (
          <div className="slide-up" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
            <VideoFeed posts={posts} currentUser={user} onLike={handleLike} onOpenComments={setCommentPost} />
          </div>
        )}

        {tab === "notifs" && (
          <div className="slide-up" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700 }}>Notifications</div>
              {unreadCount > 0 && (
                <button className="view-all" onClick={async () => {
                  await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
                  setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                  setUnreadCount(0);
                }}>Mark all read</button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "rgba(201,168,76,0.3)" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🔔</div>
                <div>No notifications yet</div>
              </div>
            ) : notifications.map((n, i) => (
              <div key={i} style={{ background: n.is_read ? "#080f28" : "#0a1030", border: `1px solid ${n.is_read ? "#101d3a" : "#1a2855"}`, borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" }}
                onClick={async () => {
                  if (!n.is_read) {
                    await supabase.from("notifications").update({ is_read: true }).eq("id", n.id);
                    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
                    setUnreadCount(c => Math.max(0, c - 1));
                  }
                }}>
                <div style={{ width: 36, height: 36, background: "#060d20", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {n.type === "like" ? "❤️" : n.type === "comment" ? "💬" : n.type === "reaction" ? "😊" : "📢"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#e8dfc8", lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: "rgba(201,168,76,0.3)", marginTop: 3 }}>{timeAgo(n.created_at)}</div>
                </div>
                {!n.is_read && <div style={{ width: 8, height: 8, background: "#c9a84c", borderRadius: "50%", flexShrink: 0, marginTop: 4 }} />}
              </div>
            ))}
          </div>
        )}

        {tab === "saved" && (
          <div className="slide-up" style={{ padding: 20 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🔖 Saved Posts</div>
            <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginBottom: 16 }}>Posts you have bookmarked</div>
            {savedPosts.length === 0
              ? <div style={{ textAlign: "center", padding: 40, color: "rgba(201,168,76,0.3)" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🔖</div>
                  <div>No saved posts yet.</div>
                  <div style={{ fontSize: 12, marginTop: 6 }}>Tap 📑 on any post to save it</div>
                </div>
              : savedPosts.map(post => <PostCard key={post.id} post={post} currentUser={user} onLike={handleLike} onOpenComments={setCommentPost} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSave} isSaved={savedIds.has(post.id)} />)
            }
          </div>
        )}

        {tab === "profile" && (
          <div className="slide-up" style={{ padding: 20 }}>
            {showSettings && <ProfileSettings user={user} onUpdate={setUser} onClose={() => setShowSettings(false)} />}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {/* Banner — premium only */}
            {(user.is_verified || user.is_premium) && (
              <div style={{ position: "relative", height: 100, background: user.banner_url ? `url(${user.banner_url}) center/cover` : `linear-gradient(135deg,${PREMIUM_THEMES[user.profile_theme || "default"].bg},${PREMIUM_THEMES[user.profile_theme || "default"].accent}40)`, borderRadius: 14, marginBottom: -40, border: "1px solid #162248" }}>
                <label style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 20, padding: "4px 10px", color: "#e8dfc8", fontSize: 11, cursor: "pointer" }}>
                  📷 Edit Banner
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                    const file = e.target.files[0]; if (!file) return;
                    const path = `banners/${user.id}.${file.name.split(".").pop()}`;
                    await supabase.storage.from("post-media").upload(path, file, { upsert: true });
                    const { data: { publicUrl } } = supabase.storage.from("post-media").getPublicUrl(path);
                    await supabase.from("profiles").update({ banner_url: publicUrl }).eq("id", user.id);
                    setUser(prev => ({ ...prev, banner_url: publicUrl }));
                  }} />
                </label>
              </div>
            )}
            <div style={{ position: "relative", display: "inline-block", marginTop: (user.is_verified || user.is_premium) ? 0 : 0 }}>
                <Avatar user={user} size={80} />
                <label style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, background: "linear-gradient(135deg,#8a6820,#e8c96a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>
                  📷
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const ext = file.name.split(".").pop();
                    const path = `avatars/${user.id}.${ext}`;
                    await supabase.storage.from("post-media").upload(path, file, { upsert: true });
                    const { data: { publicUrl } } = supabase.storage.from("post-media").getPublicUrl(path);
                    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
                    setUser(prev => ({ ...prev, avatar_url: publicUrl }));
                  }} />
                </label>
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginTop: 12 }}>{user.full_name || user.username}</div>
              <div style={{ fontSize: 13, color: "rgba(201,168,76,0.55)", marginTop: 2 }}>@{user.username}</div>
              {user.school && <div style={{ fontSize: 12, color: "#c9a84c", marginTop: 4 }}>🏫 {user.school}</div>}
              {user.bio && <div style={{ fontSize: 13, color: "rgba(201,168,76,0.65)", marginTop: 8, lineHeight: 1.4 }}>{user.bio}</div>}
              {user.is_verified
                ? <div style={{ marginTop: 8 }}><VerifiedBadge role={user.verified_role} /></div>
                : <button onClick={() => setShowVerifyModal(true)} style={{ marginTop: 10, background: "linear-gradient(135deg,#8a6820,#e8c96a)", border: "none", borderRadius: 20, padding: "8px 20px", color: "#000", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit',sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    ✅ Get Verified · ₦2,000
                  </button>
              }
              {(user.xp > 0) && (
                <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, color: getLevelInfo(user.xp).color, fontWeight: 700 }}>Lvl {getLevelInfo(user.xp).level} {getLevelInfo(user.xp).name}</div>
                  <div style={{ fontSize: 11, color: "#c9a84c" }}>• {user.xp} XP</div>
                  {user.streak > 0 && <div style={{ fontSize: 11, color: "#ffca28" }}>• ⚡{user.streak} days</div>}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {[["Posts", myPosts.length], ["Likes", myPosts.reduce((a,p)=>a+(p.likes?.length||0),0)], ["Comments", myPosts.reduce((a,p)=>a+(p.comments?.length||0),0)]].map(([label, val]) => (
                <div key={label} style={{ background: "#080f28", border: "1px solid #162248", borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#c9a84c" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "rgba(201,168,76,0.55)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Profile sub-tabs */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
              {[["posts","📝 Posts"],["analytics","📊 Stats"],["badges","🏅 Badges"],["language","🌍 Language"]].map(([id,label]) => (
                <button key={id} className={`tab-btn${profileTab===id?" active":""}`} onClick={() => setProfileTab(id)}>{label}</button>
              ))}
            </div>

            {profileTab === "posts" && (
              <div>
                {myPosts.length === 0
                  ? <div style={{ color: "rgba(201,168,76,0.3)", fontSize: 13, textAlign: "center", padding: 20 }}>You haven't posted anything yet.</div>
                  : myPosts.map(post => <PostCard key={post.id} post={post} currentUser={user} onLike={handleLike} onOpenComments={setCommentPost} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSave} isSaved={savedIds.has(post.id)} />)
                }
              </div>
            )}
            {profileTab === "analytics" && <AnalyticsDashboard user={user} posts={posts} />}
            {profileTab === "badges" && <BadgesDisplay user={user} />}
            {profileTab === "language" && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#c9a84c", marginBottom: 12 }}>🌍 Language</div>
                <LangSelector lang={lang} onChange={setLang} />
              </div>
            )}

            <button className="secondary-btn" style={{ width: "100%", marginTop: 20, marginBottom: 10 }} onClick={() => setShowSettings(true)}>
              ✏️ Edit Profile
            </button>
            {installPrompt && (
              <button className="secondary-btn" style={{ width: "100%", marginBottom: 10, background: "linear-gradient(135deg,#8a6820,#e8c96a)", color: "#000", fontWeight: 700, border: "none" }} onClick={installApp}>
                📲 Install TruthLynk App
              </button>
            )}
            <button className="secondary-btn" style={{ width: "100%", marginBottom: 10 }} onClick={async () => {
              const perm = await Notification.requestPermission();
              if (perm === "granted") {
                await registerPush(user.id);
                alert("✅ Push notifications enabled!");
              } else {
                alert("❌ Please enable notifications in your browser settings.");
              }
            }}>
              🔔 Enable Push Notifications
            </button>
            <button className="secondary-btn" style={{ width: "100%", color: "#ef5350", borderColor: "#7a2a2a" }} onClick={logout}>
              🚪 Log Out
            </button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#02040e", borderTop: "1px solid #080f28", display: "flex", justifyContent: "space-around", padding: "6px 0 10px" }}>
        {NAV.map(item => (
          <button key={item.id} className={`pill-btn${tab === item.id ? " active" : ""}`} onClick={() => setTab(item.id)}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 300, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ background: "#040812", borderRadius: "20px 20px 0 0", border: "1px solid #162248", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>✏️ Edit Post</div>
              <button onClick={() => setEditingPost(null)} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.55)", fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>
            <input className="rc-input" value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} style={{ marginBottom: 10 }} />
            <textarea className="rc-input" rows={4} value={editForm.content} onChange={e => setEditForm(p => ({ ...p, content: e.target.value }))} style={{ marginBottom: 12 }} />
            <button className="primary-btn" onClick={handleEditSave}>💾 Save Changes</button>
          </div>
        </div>
      )}

      {commentPost && <CommentsModal post={commentPost} currentUser={user} onClose={() => setCommentPost(null)} />}

      {/* Hashtag feed modal */}
      {activeHashtag && (
        <HashtagFeed
          tag={activeHashtag}
          posts={posts}
          currentUser={user}
          onLike={handleLike}
          onOpenComments={setCommentPost}
          onSave={handleSave}
          savedIds={savedIds}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setActiveHashtag(null)}
        />
      )}
      {showVerifyModal && (
        <VerificationPayment
          user={user}
          onClose={() => setShowVerifyModal(false)}
          onSuccess={(updates) => {
            setUser(prev => ({ ...prev, ...updates }));
            setShowVerifyModal(false);
          }}
        />
      )}

      {/* Hashtag feed modal */}
      {activeHashtag && (
        <HashtagFeed
          tag={activeHashtag}
          posts={posts}
          currentUser={user}
          onLike={handleLike}
          onOpenComments={setCommentPost}
          onSave={handleSave}
          savedIds={savedIds}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setActiveHashtag(null)}
        />
      )}
    </div>
  );
}
