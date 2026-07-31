"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Activity,
  MousePointer,
  MapPin,
  Layers,
  CheckCircle2,
  KeyRound,
  Terminal,
} from "lucide-react";

export default function LanyardHUD() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-10">
      {/* 1. TOP HUD HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        {/* Left: Security Identity Title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#61dca3] animate-pulse inline-block" />
            <span className="text-[10px] md:text-xs font-mono text-[#61dca3] tracking-[0.25em] uppercase">
              CLEARANCE: LEVEL 5 // EXECUTIVE ARCHITECT
            </span>
          </div>
          <h2 className="text-[#61dca3] font-[family-name:var(--font-orbitron)] text-2xl md:text-3xl font-bold tracking-tighter">
            ACCESSING ID...
          </h2>
          <p className="text-zinc-400 text-xs font-mono tracking-widest mt-1">
            It&apos;s me, <span className="text-white font-bold">Riansyah Lubis</span> — IT Manager &amp; Multimedia Specialist
          </p>
        </div>

        {/* Right: Telemetry & Location (Desktop) */}
        <div className="hidden sm:flex flex-col items-end text-right font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2 text-white">
            <MapPin size={14} className="text-[#61dca3]" />
            <span>BOGOR, INDONESIA</span>
          </div>
          <span className="text-zinc-500 text-[10px] tracking-widest mt-0.5">
            LAT: 06°35&apos;S // LONG: 106°49&apos;E // SYS_ONLINE
          </span>
        </div>
      </div>

      {/* 2. CENTER STAGE SIDE PANELS (Desktop Only - lg:block) */}
      <div className="hidden lg:flex items-center justify-between w-full my-auto pointer-events-none">
        {/* LEFT HUD PANEL: EXECUTIVE PROFILE & METRICS */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-80 bg-zinc-950/80 border border-white/10 hover:border-[#61dca3]/50 transition-colors duration-500 p-6 rounded-lg backdrop-blur-xl shadow-2xl pointer-events-auto"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span className="text-xs font-mono text-[#61dca3] tracking-widest uppercase flex items-center gap-2">
              <ShieldCheck size={16} /> BIO_METRICS
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              ID #RL-2026
            </span>
          </div>

          <p className="text-zinc-300 text-xs leading-relaxed mb-5">
            Profesional IT &amp; Spesialis Multimedia dengan <span className="text-[#61dca3] font-bold">8+ tahun pengalaman</span> mengelola ekosistem teknologi, produksi media digital, dan transformasi arsitektur sistem informasi.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>ERP / WMS / HRIS Arch</span>
                <span className="text-[#61dca3]">98%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-[#61dca3] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Broadcast &amp; Media Prod</span>
                <span className="text-[#61dca3]">95%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[95%] h-full bg-[#61dca3] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Digital Ecosystem &amp; Web</span>
                <span className="text-[#61dca3]">94%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-[#61dca3] rounded-full" />
              </div>
            </div>
          </div>

          {/* Interactive Instruction Banner */}
          <div className="mt-6 p-3 bg-[#61dca3]/10 border border-[#61dca3]/30 rounded text-[#61dca3] font-mono text-[11px] flex items-center gap-2.5">
            <MousePointer size={16} className="animate-bounce shrink-0" />
            <span>DRAG &amp; RELEASE TO SWING 3D PHYSICS CARD</span>
          </div>
        </motion.div>

        {/* RIGHT HUD PANEL: CREDENTIALS & LEADERSHIP STATUS */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-72 bg-zinc-950/80 border border-white/10 hover:border-[#61dca3]/50 transition-colors duration-500 p-6 rounded-lg backdrop-blur-xl shadow-2xl pointer-events-auto"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span className="text-xs font-mono text-[#61dca3] tracking-widest uppercase flex items-center gap-2">
              <KeyRound size={16} /> CREDENTIALS
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              VERIFIED
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="border-l-2 border-[#61dca3] pl-3">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">
                Current Leadership
              </div>
              <div className="text-white font-bold mt-0.5">
                PT. Kola Borasi Indonesia
              </div>
              <div className="text-[#61dca3] font-mono text-[11px]">
                IT Consultant &amp; Manager (2026–Present)
              </div>
            </div>

            <div className="border-l-2 border-zinc-700 pl-3">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">
                Long Tenure Record
              </div>
              <div className="text-zinc-300 font-bold mt-0.5">
                SMA PLUS PGRI Cibinong
              </div>
              <div className="text-zinc-400 font-mono text-[11px]">
                Media &amp; Tech Ops Lead (8 Years)
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 font-mono text-[11px] text-zinc-400 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>SYS_HASH:</span>
                <span className="text-[#61dca3]">0xRL888_2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ENGINE:</span>
                <span className="text-white">RAPIER_V1.3_3D</span>
              </div>
              <div className="flex items-center justify-between">
                <span>STATUS:</span>
                <span className="text-[#61dca3] flex items-center gap-1">
                  <CheckCircle2 size={12} /> LIVE INTERACTIVE
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. BOTTOM HUD RIBBON */}
      <div>
        {/* Mobile-only Compact Card (lg:hidden) */}
        <div className="lg:hidden mb-4 p-4 bg-zinc-950/90 border border-white/10 rounded-lg backdrop-blur-md pointer-events-auto">
          <div className="flex items-center justify-between text-xs font-mono text-[#61dca3] mb-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} /> ID #RL-2026 // LEVEL 5
            </span>
            <span className="text-zinc-500">BOGOR, ID</span>
          </div>
          <p className="text-zinc-300 text-xs leading-relaxed mb-3">
            IT Manager &amp; Spesialis Multimedia (8+ th pengalaman) memimpin arsitektur ERP/WMS/HRIS dan operasional media digital.
          </p>
          <div className="p-2.5 bg-[#61dca3]/10 border border-[#61dca3]/30 rounded text-[#61dca3] font-mono text-[11px] flex items-center justify-center gap-2">
            <MousePointer size={14} className="animate-bounce" />
            <span>SWIPE &amp; DRAG TO SWING 3D ID CARD</span>
          </div>
        </div>

        {/* Desktop Bottom Telemetry Bar */}
        <div className="hidden lg:flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] text-zinc-500">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Cpu size={14} className="text-[#61dca3]" /> THREE.JS WEBGL RENDERER
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Activity size={14} className="text-[#61dca3]" /> REALTIME ACCELEROMETER
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Terminal size={14} className="text-[#61dca3]" /> ZERO-LATENCY PHYSICS
            </span>
          </div>

          <div className="text-zinc-400">
            SYSTEM_ID: <span className="text-white">RIANSYAH_LUBIS_PORTFOLIO_V2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
