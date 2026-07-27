'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

/* ─── Types ─────────────────────────────────────────── */
interface LinkItem { id: string; label: string; iconPath: string; }

/* ─── Demo Links ─────────────────────────────────────── */
const LINKS: LinkItem[] = [
  { id: 'spotify', label: 'Listen on Spotify', iconPath: 'M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.784-.963-.335.077-.67-.133-.746-.47-.077-.334.132-.67.47-.745 3.806-.874 7.076-.496 9.71 1.115.293.18.386.563.207.856zm1.226-2.738c-.227.368-.7.485-1.066.26-2.695-1.656-6.804-2.146-9.965-1.176-.41.125-.837-.105-.96-.514-.125-.41.104-.837.513-.96 3.63-1.114 8.163-.564 11.217 1.314.367.226.485.7.26 1.067zm.098-2.85c-3.23-1.92-8.542-2.096-11.603-1.16-.5.15-1.02-.132-1.17-.63-.15-.5.13-1.02.63-1.17 3.52-1.075 9.4-1.25 13.14 1.114.453.284.593.89.31 1.343-.284.453-.89.593-1.343.31z' },
  { id: 'apple', label: 'Watch on Apple Music', iconPath: 'M16.597 12.392c0-3.155 2.571-4.66 2.686-4.733-1.465-2.144-3.738-2.435-4.545-2.478-1.928-.194-3.778 1.134-4.764 1.134-1.006 0-2.527-1.11-4.113-1.08-2.071.026-3.987 1.205-5.051 3.064-2.15 3.738-.548 9.28 1.547 12.311 1.027 1.482 2.22 3.12 3.811 3.064 1.528-.052 2.108-.98 3.94-.98 1.833 0 2.356.98 3.961.954 1.62-.026 2.651-1.487 3.65-2.951 1.156-1.688 1.631-3.324 1.652-3.411-.035-.015-3.089-1.185-3.089-4.744M14.659 5.253c.84-1.018 1.405-2.433 1.252-3.844-1.218.049-2.705.812-3.568 1.838-.773.916-1.449 2.359-1.275 3.754 1.365.105 2.748-.727 3.591-1.748z' },
  { id: 'youtube', label: 'Subscribe on YouTube', iconPath: 'M21.582 6.186a2.709 2.709 0 00-1.904-1.914C17.994 3.75 12 3.75 12 3.75s-5.994 0-7.678.522a2.706 2.706 0 00-1.904 1.914C1.896 7.893 1.896 12 1.896 12s0 4.107.522 5.814a2.706 2.706 0 001.904 1.914C5.994 20.25 12 20.25 12 20.25s5.994 0 7.678-.522a2.707 2.707 0 001.904-1.914C22.104 16.107 22.104 12 22.104 12s0-4.107-.522-5.814zM9.993 15.381V8.62L15.385 12l-5.392 3.381z' },
  { id: 'tiktok', label: 'Follow on TikTok', iconPath: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 19.34a6.34 6.34 0 006.12-6V6a8.28 8.28 0 005.89 2.6V5.2a4.44 4.44 0 011.78-.35v1.84z' },
  { id: 'x', label: 'Follow on X', iconPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
];

/* ─── Themes ─────────────────────────────────────────── */
interface Theme {
  id: string; name: string; tag: string;
  screen: string; statusColor: string; notchBg: string;
  avatar: string; nameCls: string; bioCls: string;
  linkCls: string; iconCls: string; homeBar: string;
}

const THEMES: Theme[] = [
  {
    id: 'standard', name: 'Standard', tag: 'Default',
    screen: 'bg-[#F7F7EF]',
    statusColor: '#2C3A42', notchBg: '#1a1a1a',
    avatar: 'ring-4 ring-white shadow-lg',
    nameCls: 'text-[#2C3A42]', bioCls: 'text-[#5A7080]',
    linkCls: 'bg-white border border-[#58A9BE]/20 text-[#2C3A42] rounded-xl hover:border-[#58A9BE]/50 transition-colors',
    iconCls: 'text-[#58A9BE]', homeBar: 'bg-[#2C3A42]/25',
  },
  {
    id: 'midnight', name: 'Midnight', tag: 'Dark',
    screen: 'bg-[#0e1420]',
    statusColor: '#94a3b8', notchBg: '#000',
    avatar: 'ring-4 ring-indigo-500/40 shadow-[0_0_16px_rgba(99,102,241,0.35)]',
    nameCls: 'text-slate-100', bioCls: 'text-slate-400',
    linkCls: 'bg-[#141d2e] border border-indigo-900/50 text-slate-100 rounded-xl hover:bg-indigo-600 transition-colors',
    iconCls: 'text-indigo-400', homeBar: 'bg-white/20',
  },
  {
    id: 'coral', name: 'Coral Bloom', tag: 'Warm',
    screen: 'bg-white',
    statusColor: '#3A1A18', notchBg: '#1a1a1a',
    avatar: 'ring-4 ring-[#D75852]/30 shadow-lg',
    nameCls: 'text-[#3A1A18]', bioCls: 'text-[#8A4440]',
    linkCls: 'bg-white border border-[#D75852]/20 text-[#3A1A18] rounded-xl hover:border-[#D75852]/50 transition-colors',
    iconCls: 'text-[#D75852]', homeBar: 'bg-[#D75852]/25',
  },
  {
    id: 'glass', name: 'Aurora Glass', tag: 'Vibrant',
    screen: 'bg-gradient-to-br from-[#0ea5e9] via-[#6366f1] to-[#a855f7]',
    statusColor: '#fff', notchBg: '#000',
    avatar: 'ring-4 ring-white/50 shadow-[0_0_20px_rgba(255,255,255,0.2)]',
    nameCls: 'text-white', bioCls: 'text-white/75',
    linkCls: 'bg-white/20 backdrop-blur border border-white/25 text-white rounded-xl hover:bg-white/35 transition-colors',
    iconCls: 'text-white', homeBar: 'bg-white/30',
  },
  {
    id: 'golden', name: 'Golden Hour', tag: 'Luxury',
    screen: 'bg-gradient-to-b from-[#1C1005] to-[#2A1A08]',
    statusColor: '#FDE8B0', notchBg: '#000',
    avatar: 'ring-2 ring-[#F3C845]/60 shadow-[0_0_16px_rgba(243,200,69,0.25)]',
    nameCls: 'text-[#FDE8B0]', bioCls: 'text-[#F3C845]/60',
    linkCls: 'bg-[#33220A] border border-[#F3C845]/25 text-[#FDE8B0] rounded-xl hover:bg-[#F3C845] hover:text-[#1C1005] transition-colors',
    iconCls: 'text-[#F3C845]', homeBar: 'bg-[#F3C845]/25',
  },
  {
    id: 'tidal', name: 'Teal Tide', tag: 'Ocean',
    screen: 'bg-[#0B2F3A]',
    statusColor: '#E5F4F8', notchBg: '#000',
    avatar: 'ring-4 ring-[#58A9BE]/40 shadow-[0_0_16px_rgba(88,169,190,0.2)]',
    nameCls: 'text-[#E5F4F8]', bioCls: 'text-[#7EC8DA]',
    linkCls: 'bg-[#194f60] border border-[#58A9BE]/25 text-[#E5F4F8] rounded-xl hover:bg-[#58A9BE] hover:text-[#0B2F3A] transition-colors',
    iconCls: 'text-[#7EC8DA]', homeBar: 'bg-[#58A9BE]/30',
  },
];

/* ─── Phone Shell ────────────────────────────────────── */
function PhoneShell({
  theme,
  scale = 1,
  dimmed = false,
}: {
  theme: Theme;
  scale?: number;
  dimmed?: boolean;
}) {
  const W = 230;
  const H = 480;

  return (
    <div
      className="relative shrink-0 transition-all duration-500 ease-out"
      style={{
        width: W,
        height: H,
        transform: `scale(${scale})`,
        opacity: dimmed ? 0.55 : 1,
        filter: dimmed ? 'blur(0.5px)' : 'none',
      }}
    >
      {/* Outer bezel */}
      <div
        className="absolute inset-0 rounded-[42px] bg-[#161616]"
        style={{
          boxShadow: dimmed
            ? '0 12px 32px rgba(0,0,0,0.2)'
            : '0 28px 64px rgba(0,0,0,0.38), inset 0 0 0 1.5px rgba(255,255,255,0.07)',
        }}
      />

      {/* Screen */}
      <div
        className={`absolute flex flex-col overflow-hidden rounded-[34px] ${theme.screen}`}
        style={{ inset: 7 }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-5 pt-3 pb-1 shrink-0"
          style={{ color: theme.statusColor, opacity: 0.7 }}
        >
          <span className="text-[9px] font-bold tracking-tight">9:41</span>
          <div className="flex items-center gap-1">
            {/* Signal */}
            <svg width="11" height="7" viewBox="0 0 11 7" fill="currentColor">
              <rect x="0" y="4" width="2" height="3" rx="0.4" />
              <rect x="3" y="2.5" width="2" height="4.5" rx="0.4" />
              <rect x="6" y="1" width="2" height="6" rx="0.4" />
              <rect x="9" y="0" width="2" height="7" rx="0.4" opacity="0.3" />
            </svg>
            {/* Battery */}
            <svg width="17" height="7" viewBox="0 0 17 7" fill="currentColor">
              <rect x="0" y="0.5" width="14" height="6" rx="1.5" opacity="0.3" />
              <rect x="0.5" y="1" width="10" height="5" rx="1" />
              <rect x="15" y="2" width="1.5" height="3" rx="0.75" opacity="0.5" />
            </svg>
          </div>
        </div>

        {/* Dynamic island */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-full"
          style={{ width: 72, height: 20, background: theme.notchBg }}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-full overflow-hidden relative mx-auto mt-4 mb-2.5 shrink-0 ${theme.avatar}`}>
            <Image src="/taylor.jpg" alt="Taylor Swift" fill className="object-cover" />
          </div>

          {/* Name */}
          <p className={`text-[13px] font-bold text-center leading-tight mb-0.5 ${theme.nameCls}`}>
            Taylor Swift
          </p>
          <p className={`text-[10px] text-center mb-3.5 ${theme.bioCls}`}>
            Singer, songwriter & director.
          </p>

          {/* Links */}
          <div className="space-y-1.5">
            {LINKS.map((link) => (
              <div
                key={link.id}
                className={`flex items-center gap-2 px-3 py-2 text-[10px] font-semibold ${theme.linkCls}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className={`w-3 h-3 shrink-0 ${theme.iconCls}`}>
                  <path d={link.iconPath} />
                </svg>
                <span className="truncate">{link.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-1.5 shrink-0">
          <div className={`w-16 h-[3px] rounded-full ${theme.homeBar}`} />
        </div>
      </div>

      {/* Side buttons */}
      <div className="absolute -right-0.5 top-[72px] w-[3px] h-9 rounded-r-sm bg-[#222]" />
      <div className="absolute -left-0.5 top-[60px] w-[3px] h-7 rounded-l-sm bg-[#222]" />
      <div className="absolute -left-0.5 top-[96px] w-[3px] h-12 rounded-l-sm bg-[#222]" />
      <div className="absolute -left-0.5 top-[116px] w-[3px] h-12 rounded-l-sm bg-[#222]" />
    </div>
  );
}

/* ─── Carousel ───────────────────────────────────────── */
export default function ThemeCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);         // live drag offset px
  const [dragging, setDragging] = useState(false);
  const dragStart = { x: 0 } as { x: number };   // mutable ref for perf
  const THRESHOLD = 60;                           // px to commit a swipe
  const total = THEMES.length;

  const next = useCallback(() => { setDragX(0); setIdx((p) => (p + 1) % total); }, [total]);
  const prev = useCallback(() => { setDragX(0); setIdx((p) => (p - 1 + total) % total); }, [total]);

  /* Auto-advance (paused while dragging or hovering) */
  useEffect(() => {
    if (paused || dragging) return;
    const t = setInterval(next, 3500);
    return () => clearInterval(t);
  }, [paused, dragging, next]);

  /* ── Mouse drag handlers ── */
  const onMouseDown = (e: React.MouseEvent) => {
    dragStart.x = e.clientX;
    setDragging(true);
    setPaused(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setDragX(e.clientX - dragStart.x);
  };

  const onMouseUp = () => {
    if (!dragging) return;
    if (dragX < -THRESHOLD) next();
    else if (dragX > THRESHOLD) prev();
    else setDragX(0);
    setDragging(false);
    setPaused(false);
  };

  const onMouseLeave = () => {
    if (dragging) {
      if (dragX < -THRESHOLD) next();
      else if (dragX > THRESHOLD) prev();
      else setDragX(0);
      setDragging(false);
    }
    setPaused(false);
  };

  /* ── Touch swipe ── */
  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.x = e.touches[0].clientX;
    setDragging(true);
    setPaused(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setDragX(e.touches[0].clientX - dragStart.x);
  };
  const onTouchEnd = () => {
    if (dragX < -THRESHOLD) next();
    else if (dragX > THRESHOLD) prev();
    else setDragX(0);
    setDragging(false);
    setPaused(false);
  };

  const leftIdx  = (idx - 1 + total) % total;
  const rightIdx = (idx + 1) % total;

  /* Clamp visual drag so it doesn't go too far */
  const clampedDrag = Math.max(-80, Math.min(80, dragX));

  return (
    <div
      className="flex flex-col items-center gap-6 w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
    >
      {/* ── 3-phone row ── */}
      <div
        className="flex items-center justify-center"
        style={{
          gap: 24,
          height: 520,
          transform: `translateX(${clampedDrag}px)`,
          transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      >
        {/* Left phone */}
        <div style={{ zIndex: 1 }}>
          <PhoneShell theme={THEMES[leftIdx]} scale={0.78} dimmed />
        </div>

        {/* Center phone */}
        <div style={{ zIndex: 3 }}>
          <PhoneShell theme={THEMES[idx]} scale={1} />
        </div>

        {/* Right phone */}
        <div style={{ zIndex: 1 }}>
          <PhoneShell theme={THEMES[rightIdx]} scale={0.78} dimmed />
        </div>
      </div>

      {/* ── Theme label ── */}
      <div className="flex items-center gap-2.5 pointer-events-none">
        <span className="text-base font-semibold text-[#2C3A42]">{THEMES[idx].name}</span>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-[#58A9BE]/20 text-[#58A9BE] shadow-sm">
          {THEMES[idx].tag}
        </span>
      </div>

      {/* ── Dot indicators ── */}
      <div className="flex items-center gap-2" style={{ cursor: 'default' }}>
        {THEMES.map((t, i) => (
          <button
            key={t.id}
            onClick={(e) => { e.stopPropagation(); setIdx(i); setDragX(0); }}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label={`Go to ${t.name}`}
            className={`rounded-full transition-all duration-300 ${
              i === idx
                ? 'w-6 h-2.5 bg-[#58A9BE]'
                : 'w-2.5 h-2.5 bg-[#2C3A42]/15 hover:bg-[#58A9BE]/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
