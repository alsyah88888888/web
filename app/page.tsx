"use client";
import React from "react";
import dynamic from "next/dynamic";
import LetterGlitch from "@/components/LetterGlitch";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Instagram,
  Mail,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import StaggeredMenu from "@/components/StaggeredMenu";

const Lanyard = dynamic(() => import("@/components/Lanyard"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-zinc-500 font-mono">
      INITIALIZING ID...
    </div>
  ),
});

export default function HackerPortfolio() {
  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/" },
    { label: "About", ariaLabel: "Learn about us", link: "/about" },
    { label: "Services", ariaLabel: "View our services", link: "/services" },
    { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
  ];
  return (
    <main className="relative h-screen w-full bg-black overflow-x-hidden overflow-y-auto snap-y snap-mandatory font-mono selection:bg-[#61dca3]/30 scroll-smooth">
      {/* BACKGROUND FIXED (Tetap) */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden">
        <LetterGlitch
          glitchColors={["#2b4539", "#61dca3", "#61b3dc"]}
          glitchSpeed={50}
          centerVignette={false}
          outerVignette={true}
          smooth={true}
        />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION - snap-start membuat section ini jadi titik henti */}
        <section className="h-screen flex flex-col items-center justify-center px-6 text-center snap-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-6 inline-block px-4 py-1 border border-[#61dca3]/50 bg-[#2b4539]/20 text-[#61dca3] text-xs md:text-sm tracking-[0.5em] uppercase backdrop-blur-md">
              Welcome to my digital portfolio
            </div>

            <h1 className="text-7xl md:text-[9rem] font-black text-white font-[family-name:var(--font-orbitron)] tracking-tighter leading-[0.8] mb-6">
              RIANSYAH
            </h1>

            <div className="mb-4 inline-block px-4 py-2 border border-[#61dca3]/50 bg-[#2b4539]/20 text-[#61dca3] text-[10px] md:text-sm tracking-[0.3em] uppercase backdrop-blur-md max-w-2xl">
              Creative Technology Specialist // Multimedia Production // Music
              Production
            </div>
          </motion.div>

          <div className="absolute bottom-10 animate-bounce text-zinc-500">
            <p className="text-[10px] mb-2 tracking-widest">
              SCROLL TO ACCESS ID
            </p>
            <ChevronDown size={20} className="mx-auto" />
          </div>
        </section>

        {/* LANYARD SECTION - snap-start */}
        <section className="relative h-screen w-full bg-black/40 backdrop-blur-sm border-y border-white/5 snap-start">
          <div className="absolute top-10 left-10 z-20">
            <h2 className="text-[#61dca3] font-[family-name:var(--font-orbitron)] text-xl tracking-tighter">
              ACCESSING ID...
            </h2>
            <p className="text-zinc-500 text-[10px] tracking-widest">
              It's me, Riansyah Lubis
            </p>
          </div>
          <div className="w-full h-full">
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
          </div>
        </section>

        {/* PROJECT SECTION - snap-start */}
        <section className="min-h-screen py-24 px-6 bg-black/60 backdrop-blur-md snap-start">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-[#61dca3] font-[family-name:var(--font-orbitron)] text-3xl tracking-tighter">
                PROJECT ARCHIVES
              </h2>
              <div className="h-1 w-30 bg-[#61dca3] mt-2" />
              <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mt-4">
                Latest Operations // Visual & Technical Works
              </p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {portfolioData.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative break-inside-avoid group overflow-hidden border border-white/10 bg-zinc-900/30 backdrop-blur-sm hover:border-[#61dca3]/50 transition-all duration-500"
                >
                  {/* ... isi portfolio card tetap sama ... */}
                  <div
                    className={`relative w-full ${item.height} overflow-hidden`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-bold">{item.title}</h3>
                    <p className="text-zinc-400 text-xs">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* INFO SECTION - snap-start */}
        <section className="h-screen flex items-center py-32 px-6 bg-black/80 backdrop-blur-xl border-t border-white/5 snap-start">
          <div className="max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-white">
                  Ready for collaboration?{" "}
                  <span className="text-[#61dca3]">
                    Let's build something epic together.
                  </span>
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href="https://wa.me/6281386175161"
                  className="flex items-center justify-center gap-3 bg-[#61dca3] text-black p-4 font-bold hover:shadow-[0_0_20px_#61dca3] transition-all"
                >
                  <MessageCircle size={20} /> CONTACT_WHATSAPP
                </a>
                <div className="flex gap-4">
                  <a
                    href="mailto:muhammadriansyah.lubis@gmail.com"
                    onClick={(e) => {
                      console.log("Email link clicked");
                      // Browser akan handle sisanya
                    }}
                    className="flex-1 border border-white/10 p-4 text-center hover:bg-white/5 transition-all text-white"
                  >
                    <Mail className="inline mr-2" size={18} /> EMAIL
                  </a>
                  <a
                    href="https://www.instagram.com/alsyah88888/"
                    className="flex-1 border border-white/10 p-4 text-center hover:bg-white/5 transition-all text-white"
                  >
                    <Instagram className="inline mr-2" size={18} /> IG
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 text-center text-zinc-700 text-[10px] tracking-[0.5em] uppercase snap-end">
          © 2026 // Riansyah Lubis // Secure Connection Active
        </footer>
      </div>
    </main>
  );
}

// --- TYPES & DATA ---
interface PortfolioItem {
  title: string;
  category: string;
  height: string;
  image: string;
  desc: string;
}

const portfolioData: PortfolioItem[] = [
  {
    title: "Multimedia Production",
    category: "Production",
    height: "h-64",
    image: "/web/images/portfolio/multimedia.jpg",
    desc: "End-to-end multimedia management for large scale corporate events and digital broadcast.",
  },
  {
    title: "Livestream Architecture",
    category: "Broadcasting",
    height: "h-96",
    image: "/web/images/portfolio/livestream.jpg",
    desc: "Designing high-availability livestreaming systems with multi-camera switching and redundant encoders.",
  },
  {
    title: "Music Production",
    category: "Creative",
    height: "h-72",
    image: "/web/images/portfolio/music.jpg",
    desc: "Sound design and music composition for digital media and commercial projects.",
  },
  {
    title: "Machine Learning",
    category: "Technical",
    height: "h-80",
    image: "/web/images/portfolio/machine-learning.jpg",
    desc: "image processing and computer vision platform for enterprise-grade visual intelligence and automated insight extraction.",
  },
  {
    title: "Digital Media Architect",
    category: "Design",
    height: "h-60",
    image: "/web/images/portfolio/digital.jpg",
    desc: "Structuring digital assets and media workflows for optimal content delivery.",
  },
  {
    title: "Creative Technology",
    category: "Innovation",
    height: "h-96",
    image: "/web/images/portfolio/creative.jpg",
    desc: "Creative Technology blends art and tech to craft beautiful digital visuals using tools like TouchDesigner, Resolume, and many more",
  },
];
