"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Globe, MonitorPlay, Eye } from "lucide-react";

export default function BehanceShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadIframe, setLoadIframe] = useState(true);

  const slides = [
    {
      url: "/web/images/portfolio/behance-1.png",
      title: "Cover Portfolio",
      desc: "Portfolio Muhammad Riansyah L, S.Kom - Creative Technology & Multimedia Production",
    },
    {
      url: "/web/images/portfolio/behance-2.png",
      title: "Siapa Saya?",
      desc: "Ketua Pembina Multimedia di SMA PLUS PGRI Cibinong dengan 7 tahun pengalaman mengelola livestreaming, podcast, dan desain grafis.",
    },
    {
      url: "/web/images/portfolio/behance-3.png",
      title: "Pengalaman Kerja",
      desc: "Mengelola produksi konten, livestreaming, dan merancang sistem manajemen kartu karyawan/pelajar di SMA PLUS PGRI Cibinong.",
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-zinc-950/80 border border-[#61dca3]/20 rounded-xl overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(97,220,163,0.05)] p-4 md:p-8 font-mono">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#61dca3]/20 pb-6 mb-6 gap-4">
        <div>
          <div className="inline-block px-3 py-0.5 border border-[#61dca3]/30 bg-[#2b4539]/20 text-[#61dca3] text-[10px] tracking-wider uppercase mb-2">
            [ EXTERNAL_PORTFOLIO_LINK ]
          </div>
          <h3 className="text-[#61dca3] font-[family-name:var(--font-orbitron)] text-2xl md:text-3xl tracking-tighter">
            CREATIVE_PORTFOLIO
          </h3>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mt-1">
            Behance Interactive Slide Deck & Live Embed
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setLoadIframe(!loadIframe)}
            className={`flex items-center gap-2 px-4 py-2 border font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
              loadIframe
                ? "bg-[#61dca3] text-black border-[#61dca3] shadow-[0_0_15px_#61dca3]"
                : "border-[#61dca3]/40 text-[#61dca3] hover:bg-[#61dca3]/10 hover:border-[#61dca3] hover:shadow-[0_0_10px_rgba(97,220,163,0.3)]"
            }`}
          >
            {loadIframe ? <Eye size={14} /> : <MonitorPlay size={14} />}
            {loadIframe ? "View Summary Slides (3)" : "View All Works (Live Embed)"}
          </button>
          
          <a
            href="https://www.behance.net/gallery/241008283/CREATIVE-PORTFOLIO"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white hover:bg-white/5 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Globe size={14} /> Behance.net <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* DISPLAY CONTAINER */}
      <div className="relative h-[550px] md:h-[680px] w-full bg-black border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
        {loadIframe ? (
          /* LIVE BEHANCE IFRAME */
          <div className="w-full h-full relative">
            <iframe
              src="https://www.behance.net/embed/project/241008283?ilo0=1"
              allowFullScreen
              loading="lazy"
              allow="clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full border-0 absolute inset-0 bg-zinc-950"
              title="CREATIVE - PORTFOLIO on Behance"
            />
            {/* Ambient retro scanning line effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] opacity-30" />
          </div>
        ) : (
          /* LOCAL SLIDE VIEWER */
          <div className="relative w-full h-full group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col justify-between"
              >
                {/* Main image slide */}
                <div className="flex-1 w-full h-full relative overflow-hidden">
                  <img
                    src={slides[currentIndex].url}
                    alt={slides[currentIndex].title}
                    className="w-full h-full object-contain"
                  />
                  {/* Subtle glitch screen overlay overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] opacity-20" />
                </div>

                {/* Footer caption overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-md border-t border-white/5 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="max-w-3xl">
                    <h4 className="text-white font-bold text-sm md:text-base mb-1">
                      {slides[currentIndex].title}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {slides[currentIndex].desc}
                    </p>
                  </div>
                  <div className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest shrink-0 self-end md:self-center">
                    [ SLIDE {currentIndex + 1} OF {slides.length} ]
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white hover:text-[#61dca3] hover:border-[#61dca3]/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white hover:text-[#61dca3] hover:border-[#61dca3]/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
              aria-label="Next Slide"
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicators */}
            <div className="absolute top-4 right-4 flex gap-1.5 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full border transition-all ${
                    currentIndex === index
                      ? "bg-[#61dca3] border-[#61dca3]"
                      : "bg-black/80 border-white/30 hover:border-[#61dca3]/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
