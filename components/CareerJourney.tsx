"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LineSidebar from "@/components/LineSidebar";
import {
  Briefcase,
  Terminal,
  Server,
  Database,
  Cpu,
  Layers,
  Video,
  Award,
} from "lucide-react";

interface CareerPoint {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface CareerPhase {
  year: string;
  role: string;
  company: string;
  description: string;
  tag: string;
  points: CareerPoint[];
}

const CAREER_DATA: CareerPhase[] = [
  {
    year: "2026 – Sekarang",
    role: "Kepemimpinan TI & Arsitektur Sistem Informasi",
    company: "PT. Kola Borasi Indonesia — IT Consultant & IT Manager",
    description:
      "Dipercaya untuk memimpin transformasi digital dan mengelola infrastruktur teknologi informasi perusahaan secara menyeluruh:",
    tag: "CURRENT LEADERSHIP // IT MANAGER",
    points: [
      {
        title: "Arsitektur Perangkat Lunak ERP",
        desc: "Merancang dan mengimplementasikan sistem Enterprise Resource Planning (ERP) yang terintegrasi guna mengoptimalkan efisiensi operasional lintas divisi.",
        icon: <Layers className="text-[#61dca3]" size={18} />,
      },
      {
        title: "Manajemen Rantai Pasok & Gudang",
        desc: "Membangun Warehouse Management System (WMS) yang presisi untuk meningkatkan akurasi inventarisasi dan pelacakan arus barang.",
        icon: <Server className="text-[#61dca3]" size={18} />,
      },
      {
        title: "Sistem Informasi Sumber Daya Manusia",
        desc: "Mengembangkan platform Human Resource Information System (HRIS) guna mengintegrasikan tata kelola administrasi, kehadiran, dan data personalia secara aman dan terstruktur.",
        icon: <Database className="text-[#61dca3]" size={18} />,
      },
    ],
  },
  {
    year: "2025",
    role: "Spesialis Multimedia & Pengembangan Web Independen",
    company: "Praktisi Lepas / Freelance",
    description:
      "Memperluas cakupan profesional dengan menyediakan layanan konsultasi dan eksekusi independen di bidang fotografi, desain komunikasi visual, serta pengembangan situs web. Berfokus pada penyediaan solusi digital yang disesuaikan dengan kebutuhan spesifik Klien.",
    tag: "INDEPENDENT CONSULTANT // WEB & MEDIA",
    points: [
      {
        title: "Konsultasi & Solusi Digital Custom",
        desc: "Penyediaan solusi digital mandiri dari arsitektur web hingga eksekusi kreatif untuk meningkatkan kredibilitas brand Klien.",
        icon: <Terminal className="text-[#61dca3]" size={18} />,
      },
      {
        title: "Desain Komunikasi Visual & Fotografi",
        desc: "Eksekusi penyuntingan visual modern, fotografi profesional, dan desain tata letak berstandar agensi.",
        icon: <Award className="text-[#61dca3]" size={18} />,
      },
    ],
  },
  {
    year: "2017 – 2025",
    role: "Pengembangan Operasional Media & Teknologi",
    company: "SMA PLUS PGRI Cibinong",
    description:
      "Selama delapan tahun, saya bertanggung jawab penuh dalam mengelola dan mengintegrasikan ekosistem media digital serta infrastruktur teknologi berbasis sekolah:",
    tag: "8 YEARS TENURE // TECH & MEDIA ECOSYSTEM",
    points: [
      {
        title: "Manajemen Produksi Media",
        desc: "Memimpin seluruh alur kerja produksi livestreaming, podcast, dan live music recording, yang mencakup perencanaan strategis, eksekusi lapangan, hingga tahap post-production.",
        icon: <Video className="text-[#61dca3]" size={18} />,
      },
      {
        title: "Strategi Konten & Analisis Performa",
        desc: "Menyusun content planner yang terstruktur untuk platform media sosial, mengoptimalkan jadwal publikasi, serta menganalisis metrik performa guna meningkatkan keterlibatan (engagement) audiens.",
        icon: <Cpu className="text-[#61dca3]" size={18} />,
      },
      {
        title: "Pengarahan Kreatif & Publikasi",
        desc: "Mengarahkan proses pembuatan aset visual (fotografi dan videografi), penyuntingan, hingga tata kelola publikasi konten secara konsisten.",
        icon: <Award className="text-[#61dca3]" size={18} />,
      },
      {
        title: "Pengembangan Sistem Informasi Internal",
        desc: "Merancang, mengimplementasikan, dan memelihara aplikasi kartu digital bagi karyawan dan pelajar—meliputi desain antarmuka, tata kelola distribusi, hingga perawatan basis data sistem.",
        icon: <Database className="text-[#61dca3]" size={18} />,
      },
    ],
  },
];

const SIDEBAR_LABELS = [
  "PT. Kola Borasi (2026–Sekarang)",
  "Freelance Specialist (2025)",
  "SMA Plus PGRI Cibinong (2017–2025)",
];

export default function CareerJourney() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activePhase = CAREER_DATA[activeIndex] || CAREER_DATA[0];

  return (
    <div className="w-full">
      {/* Header Title Section */}
      <div className="mb-12">
        <h2 className="text-[#61dca3] font-[family-name:var(--font-orbitron)] text-3xl tracking-tighter">
          PROFIL & PERJALANAN PROFESIONAL
        </h2>
        <div className="h-1 w-32 bg-[#61dca3] mt-2" />
        <p className="text-zinc-400 text-xs tracking-[0.3em] uppercase mt-4">
          Career Timeline // Leadership, Media Operations & System Architecture
        </p>
      </div>

      {/* Main Grid: Left LineSidebar + Right Interactive Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Side: React Bits LineSidebar Component */}
        <div className="lg:col-span-5 bg-zinc-950/60 border border-white/10 p-6 backdrop-blur-md rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#61dca3]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xs font-mono text-zinc-500 mb-4 tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-[#61dca3] animate-pulse inline-block" />
            SELECT CAREER MILESTONE
          </div>

          <LineSidebar
            items={SIDEBAR_LABELS}
            accentColor="#61dca3"
            textColor="#a1a1aa"
            markerColor="#2b4539"
            showIndex={true}
            showMarker={true}
            proximityRadius={100}
            maxShift={24}
            falloff="smooth"
            markerLength={40}
            markerGap={12}
            tickScale={0.5}
            scaleTick={true}
            itemGap={24}
            fontSize={1.0}
            smoothing={120}
            defaultActive={0}
            onItemClick={(index) => {
              setActiveIndex(index);
            }}
            className="w-full"
          />
        </div>

        {/* Right Side: Animated Career Phase Detail Card */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="bg-zinc-900/60 border border-white/10 hover:border-[#61dca3]/40 transition-colors duration-500 p-6 md:p-8 backdrop-blur-xl rounded-lg relative overflow-hidden shadow-2xl"
            >
              {/* Top Accent Tag & Year */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span className="px-3 py-1 text-xs border border-[#61dca3]/40 text-[#61dca3] bg-[#61dca3]/10 font-mono tracking-widest">
                  {activePhase.tag}
                </span>
                <span className="text-sm font-mono text-[#61dca3] flex items-center gap-2">
                  <Briefcase size={14} /> {activePhase.year}
                </span>
              </div>

              {/* Role & Company */}
              <h3 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-orbitron)] leading-tight">
                {activePhase.role}
              </h3>
              <p className="text-zinc-400 font-mono text-sm mt-2 border-l-2 border-[#61dca3] pl-3 py-1">
                {activePhase.company}
              </p>

              {/* Description */}
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed mt-6 border-b border-white/10 pb-6">
                {activePhase.description}
              </p>

              {/* Points Grid */}
              {activePhase.points.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
                    KEY RESPONSIBILITIES & ARCHITECTURAL CONTRIBUTIONS
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activePhase.points.map((pt, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="p-4 border border-white/10 bg-black/40 hover:border-[#61dca3]/50 transition-all rounded"
                      >
                        <h5 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                          {pt.icon}
                          <span>{pt.title}</span>
                        </h5>
                        <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                          {pt.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
