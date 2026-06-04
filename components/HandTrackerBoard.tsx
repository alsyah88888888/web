"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Trash2, Palette, Sliders, Check, Share2, AlertCircle, Music, Edit3 } from "lucide-react";
import { gsap } from "gsap";

const COLORS = [
  { name: "Neon Green", value: "#61dca3" },
  { name: "Cyber Cyan", value: "#00f0ff" },
  { name: "Hot Pink", value: "#ff007f" },
  { name: "Plasma Purple", value: "#bd00ff" },
  { name: "Pure White", value: "#ffffff" },
];

const SIZES = [2, 4, 8, 12, 18];

const WHITE_KEYS = [
  { id: 0, note: "C4", freq: 261.63, label: "Do" },
  { id: 1, note: "D4", freq: 293.66, label: "Re" },
  { id: 2, note: "E4", freq: 329.63, label: "Mi" },
  { id: 3, note: "F4", freq: 349.23, label: "Fa" },
  { id: 4, note: "G4", freq: 392.00, label: "Sol" },
  { id: 5, note: "A4", freq: 440.00, label: "La" },
  { id: 6, note: "B4", freq: 493.88, label: "Si" },
  { id: 7, note: "C5", freq: 523.25, label: "Do" },
];

const BLACK_KEYS = [
  { id: 8, note: "C#4", freq: 277.18, label: "Do#", leftOffset: 1 },
  { id: 9, note: "D#4", freq: 311.13, label: "Re#", leftOffset: 2 },
  { id: 10, note: "F#4", freq: 369.99, label: "Fa#", leftOffset: 4 },
  { id: 11, note: "G#4", freq: 415.30, label: "Sol#", leftOffset: 5 },
  { id: 12, note: "A#4", freq: 466.16, label: "La#", leftOffset: 6 },
];

export default function HandTrackerBoard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const uiCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // States
  const [boardMode, setBoardMode] = useState<"DRAW" | "PIANO">("DRAW");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [gestureState, setGestureState] = useState<"NO_HAND" | "DRAWING" | "ERASE" | "PAUSED">("NO_HAND");
  const [brushColor, setBrushColor] = useState("#61dca3");
  const [brushSize, setBrushSize] = useState(8);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Refs for tracking drawing coordinates and piano states across frames
  const prevCoordsRef = useRef<{ x: number; y: number } | null>(null);
  const activeKeyIdRef = useRef<number | null>(null);
  const [activePianoKey, setActivePianoKey] = useState<number | null>(null);

  // Load MediaPipe CDN Scripts
  useEffect(() => {
    let active = true;

    const loadScriptsAndInit = async () => {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

        if (!active) return;
        setIsLoading(false);
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading MediaPipe scripts:", err);
        if (active) {
          setLoadError("Gagal memuat sistem pelacak tangan dari CDN.");
          setIsLoading(false);
        }
      }
    };

    loadScriptsAndInit();

    return () => {
      active = false;
    };
  }, []);

  // Initialize Canvas Sizes & MediaPipe Hands
  useEffect(() => {
    if (!isLoaded) return;

    let cameraInstance: any = null;
    const drawingCanvas = drawingCanvasRef.current;
    const uiCanvas = uiCanvasRef.current;
    if (!drawingCanvas || !uiCanvas) return;

    const resizeCanvases = () => {
      const parent = drawingCanvas.parentElement;
      if (parent) {
        const width = parent.clientWidth;
        const height = parent.clientHeight || 500;
        
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = drawingCanvas.width;
        tempCanvas.height = drawingCanvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx && drawingCanvas.width > 0 && drawingCanvas.height > 0) {
          tempCtx.drawImage(drawingCanvas, 0, 0);
        }

        drawingCanvas.width = width;
        drawingCanvas.height = height;
        uiCanvas.width = width;
        uiCanvas.height = height;

        const drawCtx = drawingCanvas.getContext("2d");
        if (drawCtx) {
          drawCtx.lineCap = "round";
          drawCtx.lineJoin = "round";
          drawCtx.drawImage(tempCanvas, 0, 0, width, height);
        }
      }
    };

    resizeCanvases();
    window.addEventListener("resize", resizeCanvases);

    // Initialize Canvas Context
    const drawCtx = drawingCanvas.getContext("2d");
    if (drawCtx) {
      drawCtx.lineCap = "round";
      drawCtx.lineJoin = "round";
    }

    // Initialize MediaPipe Hands
    // @ts-ignore
    const mpHands = window.Hands;
    if (!mpHands) return;

    const hands = new mpHands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results: any) => {
      handleHandTrackingResults(results);
    });

    // Start Camera
    const video = videoRef.current;
    if (video) {
      // @ts-ignore
      const mpCamera = window.Camera;
      if (mpCamera) {
        const camera = new mpCamera(video, {
          onFrame: async () => {
            await hands.send({ image: video });
          },
          width: 320,
          height: 240,
        });

        camera.start()
          .then(() => {
            setCameraActive(true);
          })
          .catch((err: any) => {
            console.error("Camera access failed", err);
            setLoadError("Akses kamera ditolak. Silakan izinkan kamera untuk mencoba fitur ini.");
          });

        cameraInstance = camera;
      }
    }

    return () => {
      window.removeEventListener("resize", resizeCanvases);
      if (cameraInstance) {
        try {
          cameraInstance.stop();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, [isLoaded]);

  // Trigger entrance animation once loaded and DOM has rendered
  useEffect(() => {
    if (isLoaded && !isLoading) {
      const timer = setTimeout(() => {
        animateEntrance();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isLoading]);

  // Trigger UI canvas redraw on mode change or active key updates
  useEffect(() => {
    const uiCanvas = uiCanvasRef.current;
    if (uiCanvas) {
      const ctx = uiCanvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
        if (boardMode === "PIANO") {
          drawPianoKeyboard(ctx);
        }
      }
    }
  }, [boardMode, activePianoKey]);

  // Web Audio Synth
  const playNoteSound = (freq: number) => {
    if (typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle"; // Nice retro synthesizer tone
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.03); // Fast attack
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8); // Long decaying release

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn("AudioContext tone trigger failed: ", e);
    }
  };

  // Entrance GSAP animation
  const animateEntrance = () => {
    if (!containerRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current.querySelector(".hud-panel-left"),
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
    tl.fromTo(
      containerRef.current.querySelector(".board-canvas-wrapper"),
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );
    tl.fromTo(
      containerRef.current.querySelector(".camera-preview-wrapper"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );
  };

  // Helper loader function
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Render Full Size Piano Keyboard on UI Canvas
  const drawPianoKeyboard = (ctx: CanvasRenderingContext2D) => {
    const canvas = uiCanvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    
    const numWhiteKeys = 8;
    const whiteKeyWidth = width / numWhiteKeys;
    const blackKeyWidth = whiteKeyWidth * 0.55;
    const blackKeyHeight = height * 0.6;

    ctx.save();
    
    // Clear back screen with subtle piano grid tint
    ctx.fillStyle = "rgba(10, 10, 15, 0.95)";
    ctx.fillRect(0, 0, width, height);

    // 1. Draw White Keys
    for (let i = 0; i < numWhiteKeys; i++) {
      const key = WHITE_KEYS[i];
      const xStart = i * whiteKeyWidth;
      const isActive = activePianoKey === key.id;

      if (isActive) {
        // Glowing Neon Gradient for White Key
        const gradient = ctx.createLinearGradient(xStart, 0, xStart, height);
        gradient.addColorStop(0, "rgba(97, 220, 163, 0.4)");
        gradient.addColorStop(1, "rgba(97, 220, 163, 0.1)");
        ctx.fillStyle = gradient;
        ctx.fillRect(xStart + 2, 2, whiteKeyWidth - 4, height - 4);
        
        ctx.strokeStyle = "#61dca3";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#61dca3";
      } else {
        ctx.fillStyle = "rgba(30, 30, 35, 0.6)";
        ctx.fillRect(xStart + 2, 2, whiteKeyWidth - 4, height - 4);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.shadowBlur = 0;
      }

      ctx.lineWidth = 1.5;
      ctx.strokeRect(xStart + 2, 2, whiteKeyWidth - 4, height - 4);

      // Labels at the bottom of the white keys
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = isActive ? "#61dca3" : "rgba(255,255,255,0.4)";
      ctx.textAlign = "center";
      ctx.fillText(key.note, xStart + whiteKeyWidth / 2, height - 40);
      
      ctx.font = "10px monospace";
      ctx.fillStyle = isActive ? "#ffffff" : "rgba(255,255,255,0.2)";
      ctx.fillText(key.label, xStart + whiteKeyWidth / 2, height - 20);
    }

    // 2. Draw Black Keys (overlay on borders)
    BLACK_KEYS.forEach((key) => {
      const xCenter = key.leftOffset * whiteKeyWidth;
      const xStart = xCenter - blackKeyWidth / 2;
      const isActive = activePianoKey === key.id;

      if (isActive) {
        // Glowing active state for black keys (Hot Pink / Magenta)
        const gradient = ctx.createLinearGradient(xStart, 0, xStart, blackKeyHeight);
        gradient.addColorStop(0, "rgba(255, 0, 127, 0.7)");
        gradient.addColorStop(1, "rgba(255, 0, 127, 0.2)");
        ctx.fillStyle = gradient;
        ctx.fillRect(xStart, 2, blackKeyWidth, blackKeyHeight - 2);

        ctx.strokeStyle = "#ff007f";
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#ff007f";
      } else {
        ctx.fillStyle = "rgba(10, 10, 12, 0.98)";
        ctx.fillRect(xStart, 2, blackKeyWidth, blackKeyHeight - 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.shadowBlur = 0;
      }

      ctx.lineWidth = 1.5;
      ctx.strokeRect(xStart, 2, blackKeyWidth, blackKeyHeight - 2);

      // Draw Key text/notes vertically inside black key
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = isActive ? "#ffffff" : "rgba(255, 255, 255, 0.4)";
      ctx.textAlign = "center";
      ctx.fillText(key.note, xCenter, blackKeyHeight - 25);
    });

    ctx.restore();
  };

  // Find Piano Key index at given coordinates
  const getPianoKeyAt = (x: number, y: number, width: number, height: number): number | null => {
    const numWhiteKeys = 8;
    const whiteKeyWidth = width / numWhiteKeys;
    const blackKeyWidth = whiteKeyWidth * 0.55;
    const blackKeyHeight = height * 0.6;

    // Check black keys first (top priority)
    for (let i = 0; i < BLACK_KEYS.length; i++) {
      const key = BLACK_KEYS[i];
      const xCenter = key.leftOffset * whiteKeyWidth;
      const xStart = xCenter - blackKeyWidth / 2;
      const xEnd = xCenter + blackKeyWidth / 2;

      if (y >= 0 && y <= blackKeyHeight && x >= xStart && x <= xEnd) {
        return key.id;
      }
    }

    // Check white keys
    const whiteIndex = Math.floor(x / whiteKeyWidth);
    if (whiteIndex >= 0 && whiteIndex < numWhiteKeys) {
      return WHITE_KEYS[whiteIndex].id;
    }

    return null;
  };

  // Process MediaPipe Hand Results
  const handleHandTrackingResults = (results: any) => {
    const drawingCanvas = drawingCanvasRef.current;
    const uiCanvas = uiCanvasRef.current;
    if (!drawingCanvas || !uiCanvas) return;

    const drawCtx = drawingCanvas.getContext("2d");
    const uiCtx = uiCanvas.getContext("2d");
    if (!drawCtx || !uiCtx) return;

    // Clear UI canvas for new cursor frame
    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

    if (boardMode === "PIANO") {
      drawPianoKeyboard(uiCtx);
    }

    // If no hands detected
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      setGestureState("NO_HAND");
      prevCoordsRef.current = null;
      if (activeKeyIdRef.current !== null) {
        activeKeyIdRef.current = null;
        setActivePianoKey(null);
      }
      return;
    }

    const landmarks = results.multiHandLandmarks[0];

    // Detect gestures
    const isIndexExtended = landmarks[8].y < landmarks[6].y;
    const isMiddleExtended = landmarks[12].y < landmarks[10].y;
    const isRingExtended = landmarks[16].y < landmarks[14].y;
    const isPinkyExtended = landmarks[20].y < landmarks[18].y;

    // Coordinate mapping (Mirrored x-coordinate)
    const indexTip = landmarks[8];
    const x = (1 - indexTip.x) * drawingCanvas.width;
    const y = indexTip.y * drawingCanvas.height;

    let currentState: "DRAWING" | "ERASE" | "PAUSED" = "PAUSED";

    if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      currentState = "DRAWING";
    } else if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      currentState = "ERASE";
    }

    setGestureState(currentState);

    // Handle states based on Board Mode
    if (boardMode === "DRAW") {
      // Handle DRAWING / ERASING actions
      drawCtx.save();
      
      if (currentState === "DRAWING") {
        drawCtx.globalCompositeOperation = "source-over";
        drawCtx.strokeStyle = brushColor;
        drawCtx.lineWidth = brushSize;

        if (prevCoordsRef.current) {
          drawCtx.beginPath();
          drawCtx.moveTo(prevCoordsRef.current.x, prevCoordsRef.current.y);
          drawCtx.lineTo(x, y);
          drawCtx.stroke();
        }
        prevCoordsRef.current = { x, y };
      } else if (currentState === "ERASE") {
        drawCtx.globalCompositeOperation = "destination-out";
        drawCtx.lineWidth = brushSize * 3;

        if (prevCoordsRef.current) {
          drawCtx.beginPath();
          drawCtx.moveTo(prevCoordsRef.current.x, prevCoordsRef.current.y);
          drawCtx.lineTo(x, y);
          drawCtx.stroke();
        }
        prevCoordsRef.current = { x, y };
      } else {
        prevCoordsRef.current = null;
      }
      
      drawCtx.restore();

      // Render interactive HUD cursor on overlay canvas
      drawUiCursor(uiCtx, x, y, currentState);
    } else if (boardMode === "PIANO") {
      // PIANO MODE LOGIC
      prevCoordsRef.current = null;

      let targetKey: number | null = null;

      // Finger tip touches piano area (Drawing or Erasing active finger trigger play)
      if (x >= 0 && x <= drawingCanvas.width && y >= 0 && y <= drawingCanvas.height && (currentState === "DRAWING" || currentState === "ERASE")) {
        targetKey = getPianoKeyAt(x, y, drawingCanvas.width, drawingCanvas.height);
      }

      // Check if note trigger state changes to play tone
      if (targetKey !== activeKeyIdRef.current) {
        activeKeyIdRef.current = targetKey;
        setActivePianoKey(targetKey);

        if (targetKey !== null) {
          // Play matching frequency
          const keyObj = WHITE_KEYS.find((k) => k.id === targetKey) || BLACK_KEYS.find((k) => k.id === targetKey);
          if (keyObj) {
            playNoteSound(keyObj.freq);
          }
        }
      }

      // Draw standard cursor pointer in piano mode
      drawUiCursor(uiCtx, x, y, currentState);
    }
  };

  // Draw interactive cursor pointer on UI overlay
  const drawUiCursor = (ctx: CanvasRenderingContext2D, x: number, y: number, state: "DRAWING" | "ERASE" | "PAUSED") => {
    ctx.save();
    
    const sizeOffset = state === "DRAWING" ? 10 : state === "ERASE" ? 18 : 22;
    
    // Draw outer pulsing indicator
    ctx.beginPath();
    ctx.arc(x, y, brushSize + sizeOffset, 0, 2 * Math.PI);
    ctx.strokeStyle = state === "DRAWING" ? brushColor : state === "ERASE" ? "#ff007f" : "#ffffff55";
    ctx.lineWidth = 1.5;
    ctx.setLineDash(state === "ERASE" ? [5, 3] : []);
    ctx.stroke();

    // Draw inner solid pointer
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2 + 2, 0, 2 * Math.PI);
    ctx.fillStyle = state === "DRAWING" ? brushColor : state === "ERASE" ? "#ff007f" : "#ffffffbb";
    ctx.shadowBlur = 10;
    ctx.shadowColor = state === "DRAWING" ? brushColor : state === "ERASE" ? "#ff007f" : "#ffffff";
    ctx.fill();

    // Label pointer state
    ctx.font = "10px monospace";
    ctx.fillStyle = "#ffffffaa";
    
    let label = "POINTER";
    if (state === "DRAWING") label = boardMode === "PIANO" ? "PLAY NOTE" : "DRAWING";
    else if (state === "ERASE") label = "ERASER";

    ctx.fillText(label, x + brushSize + 15, y + 4);

    ctx.restore();
  };

  // Clear Canvas handler
  const handleClearCanvas = () => {
    const canvas = drawingCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        triggerToast("Kanvas berhasil dibersihkan!");
      }
    }
  };

  // Share/Send to WhatsApp CTA flow
  const handleShareToWhatsApp = async () => {
    const drawingCanvas = drawingCanvasRef.current;
    if (!drawingCanvas) return;

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        drawingCanvas.toBlob(resolve, "image/png")
      );

      if (blob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);
          triggerToast("Gambar disalin ke Clipboard & diunduh!");
        } catch (clipboardErr) {
          console.warn("Clipboard write failed, downloading instead: ", clipboardErr);
          triggerToast("Mengunduh hasil gambar...");
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `handtrack-art-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);

        setTimeout(() => {
          const textMsg = "Halo Riansyah! Saya baru saja menggambar ini menggunakan fitur Hand Tracker MediaPipe di website portfolio Anda. [Silakan Paste (Ctrl+V) file gambar di sini]";
          const waUrl = `https://wa.me/6281386175161?text=${encodeURIComponent(textMsg)}`;
          window.open(waUrl, "_blank");
        }, 1200);
      }
    } catch (err) {
      console.error("Export canvas failed: ", err);
      triggerToast("Gagal mengambil screenshot kanvas.");
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle Mode Change & Audio Resume
  const switchMode = (mode: "DRAW" | "PIANO") => {
    setBoardMode(mode);
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    } catch (e) {}
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col lg:flex-row gap-6 p-4 md:p-8 bg-zinc-950/70 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl"
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="w-12 h-12 border-4 border-[#61dca3] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#61dca3] font-mono text-sm tracking-[0.2em] uppercase">
            Inisialisasi MediaPipe...
          </p>
        </div>
      )}

      {/* Error State */}
      {loadError && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/95 p-6 text-center">
          <AlertCircle size={48} className="text-rose-500 mb-4 animate-pulse" />
          <h3 className="text-white font-bold text-lg mb-2 font-[family-name:var(--font-orbitron)]">
            SISTEM DITANGGUHKAN
          </h3>
          <p className="text-zinc-400 text-sm max-w-md mb-6">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-zinc-900 border border-white/20 hover:border-[#61dca3] text-white font-bold text-xs uppercase tracking-widest transition-all"
          >
            Muat Ulang Halaman
          </button>
        </div>
      )}

      {/* HUD Control Panel (Left Side) */}
      <div className="hud-panel-left relative z-10 w-full lg:w-80 flex flex-col gap-6 shrink-0 opacity-0">
        <div className="p-5 bg-black/50 border border-white/10 rounded-xl backdrop-blur-md">
          <h3 className="text-[#61dca3] font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-widest mb-1">
            CONTROL_HUD_v1.5
          </h3>
          <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-5">
            Gesture drawing & full synthesizer
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-zinc-900/80 border border-white/5 rounded-lg">
            <button
              onClick={() => switchMode("DRAW")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-xs font-mono transition-all ${
                boardMode === "DRAW"
                  ? "bg-[#61dca3]/20 border border-[#61dca3]/30 text-[#61dca3] font-bold"
                  : "border border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Edit3 size={12} /> DRAW
            </button>
            <button
              onClick={() => switchMode("PIANO")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-xs font-mono transition-all ${
                boardMode === "PIANO"
                  ? "bg-[#61dca3]/20 border border-[#61dca3]/30 text-[#61dca3] font-bold"
                  : "border border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Music size={12} /> PIANO
            </button>
          </div>

          {/* Gestures Tutorial Legend */}
          <div className="mb-6 space-y-3">
            <h4 className="text-zinc-400 font-bold text-[10px] tracking-wider uppercase mb-2">
              Panduan Gerakan:
            </h4>
            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
              <span className="text-zinc-400">1 Jari (Telunjuk)</span>
              <span className="text-[#61dca3] font-bold">
                {boardMode === "DRAW" ? "Menggambar (DRAW)" : "Tekan Nada"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
              <span className="text-zinc-400">2 Jari (Telunjuk+Tengah)</span>
              <span className="text-rose-400 font-bold">
                {boardMode === "DRAW" ? "Penghapus (ERASE)" : "Tekan Nada"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-zinc-400">Kepalan / Buka Tangan</span>
              <span className="text-zinc-500">Jeda (PAUSE)</span>
            </div>
          </div>

          {boardMode === "DRAW" && (
            <>
              {/* Color Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-zinc-300 text-xs uppercase tracking-wider font-bold">
                  <Palette size={14} className="text-[#61dca3]" />
                  Warna Kuas
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {COLORS.map((col) => (
                    <button
                      key={col.value}
                      onClick={() => setBrushColor(col.value)}
                      className="group relative w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                      style={{ backgroundColor: col.value }}
                      title={col.name}
                    >
                      {brushColor === col.value && (
                        <Check size={14} className={col.value === "#ffffff" ? "text-black" : "text-white"} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-zinc-300 text-xs uppercase tracking-wider font-bold">
                  <Sliders size={14} className="text-[#61dca3]" />
                  Ketebalan ({brushSize}px)
                </div>
                <div className="flex items-center gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`flex-1 py-1.5 text-xs font-mono border rounded transition-all ${
                        brushSize === size
                          ? "bg-[#61dca3] text-black border-[#61dca3] font-bold"
                          : "border-white/10 hover:border-white/30 text-zinc-400"
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {boardMode === "DRAW" && (
              <button
                onClick={handleClearCanvas}
                className="flex items-center justify-center gap-2 w-full p-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-[#61dca3]/50 text-white rounded font-mono text-xs uppercase tracking-wider transition-all"
              >
                <Trash2 size={14} /> Clear Canvas
              </button>
            )}

            {/* CTA Button: Share to WhatsApp */}
            <button
              onClick={handleShareToWhatsApp}
              className="flex items-center justify-center gap-2 w-full p-3 bg-[#61dca3] hover:bg-[#4ec58d] text-black font-bold rounded font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(97,220,163,0.2)] hover:shadow-[0_0_20px_rgba(97,220,163,0.4)]"
            >
              <Share2 size={14} /> Kirim ke WhatsApp
            </button>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
            STATUS_DETEKSI:
          </span>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded tracking-wide ${
              gestureState === "DRAWING"
                ? "bg-[#61dca3]/20 text-[#61dca3]"
                : gestureState === "ERASE"
                ? "bg-rose-500/20 text-rose-400"
                : gestureState === "PAUSED"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-zinc-500/20 text-zinc-400 animate-pulse"
            }`}
          >
            {gestureState}
          </span>
        </div>
      </div>

      {/* Main Interactive Area (Right Side) */}
      <div className="board-canvas-wrapper relative z-10 flex-1 h-[350px] md:h-[500px] lg:h-auto min-h-[450px] border border-white/10 rounded-xl bg-zinc-950/80 overflow-hidden opacity-0">
        {/* Helper instructions overlay */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none bg-black/60 border border-white/5 p-2 px-3 rounded text-[10px] text-zinc-400 font-mono">
          {boardMode === "DRAW" ? "CANVAS_ACTIVE // RESOLUTION DETECTED" : "SYNTH_ACTIVE // KEYBOARD MAP READY"}
        </div>

        {/* Layer 1: Webcam Feed (mirrored small card in bottom corner) */}
        <div className="camera-preview-wrapper absolute bottom-4 right-4 z-30 w-32 md:w-40 border border-[#61dca3]/30 rounded-lg overflow-hidden bg-black shadow-2xl opacity-0">
          <div className="bg-[#2b4539]/30 border-b border-[#61dca3]/20 px-2 py-1 text-[8px] text-[#61dca3] font-mono tracking-widest flex items-center justify-between">
            <span>FEED_MIRRORED</span>
            <span className="w-1.5 h-1.5 bg-[#61dca3] rounded-full animate-ping" />
          </div>
          <video
            ref={videoRef}
            className="w-full h-auto scale-x-[-1] object-cover"
            playsInline
            muted
            autoPlay
          />
        </div>

        {/* Layer 2: Permanent Drawing Canvas */}
        <canvas
          ref={drawingCanvasRef}
          className={`absolute inset-0 w-full h-full z-10 cursor-none transition-opacity ${
            boardMode === "DRAW" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Layer 3: Interactive UI (Cursor, HUD text, Piano Keys) Overlay Canvas */}
        <canvas ref={uiCanvasRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none" />
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 bg-[#2b4539] border border-[#61dca3] text-[#61dca3] font-mono text-xs rounded-lg shadow-[0_0_20px_rgba(97,220,163,0.3)] animate-bounce flex items-center gap-2">
          <Check size={16} />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
