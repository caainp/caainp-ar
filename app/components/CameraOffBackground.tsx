"use client";

import { useEffect, useRef, useState } from "react";
import { CameraOff } from "lucide-react";
import { useCameraContext } from "./Camera";

interface FloatingShape {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

// 색상을 조금 더 밝은(Luminosity가 높은) 톤으로 변경하여 어둠 속에서 더 잘 보이게 함
const COLORS = [
  "#6366f1", // Indigo 500 (기존 600보다 밝음)
  "#8b5cf6", // Violet 500
  "#ec4899", // Pink 500
  "#10b981", // Emerald 500
  "#3b82f6", // Blue 500
  "#06b6d4", // Cyan 500 (추가: 발광 효과가 좋음)
];

export default function CameraOffBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<FloatingShape[]>([]);
  const animationFrameRef = useRef<number>(0);
  const { enableWebcam } = useCameraContext();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleActivate = async () => {
    if (isRequesting) return;

    setIsRequesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1920,
          height: 1080,
          facingMode: "environment",
        },
      });

      stream.getTracks().forEach((track) => track.stop());

      enableWebcam();
    } catch (error) {
      console.error("카메라 권한 요청 실패:", error);
      alert(
        "카메라 권한이 필요합니다. 브라우저 설정에서 카메라 권한을 허용해주세요."
      );
    } finally {
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const initShapes = () => {
      const count = 7;
      shapesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 200 + Math.random() * 300,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      }));
    };

    initShapes();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapesRef.current.forEach((shape) => {
        shape.x += shape.vx;
        shape.y += shape.vy;

        if (shape.x < -shape.radius) shape.vx *= -1;
        if (shape.x > canvas.width + shape.radius) shape.vx *= -1;
        if (shape.y < -shape.radius) shape.vy *= -1;
        if (shape.y > canvas.height + shape.radius) shape.vy *= -1;

        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(
          shape.x,
          shape.y,
          0,
          shape.x,
          shape.y,
          shape.radius
        );
        gradient.addColorStop(0, shape.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;

        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.8;

        ctx.fill();

        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1.0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 border border-slate-800/90">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          filter: "blur(60px)",
          mixBlendMode: "lighten",
        }}
      />

      {/* Texture & Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(2, 6, 23, 0.1) 0%, rgba(2, 6, 23, 0.4) 50%, rgba(2, 6, 23, 0.95) 100%)",
          }}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full space-y-6">
        {/* Icon Container */}
        <div className="relative group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl group-hover:bg-indigo-400/40 transition-colors duration-500" />

          <div
            className="relative flex items-center justify-center w-24 h-24 
              bg-slate-900/40 
              shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] 
              rounded-full 
              backdrop-blur-xl 
              border border-white/10 
              group-hover:border-white/25
              transition-all duration-500 group-hover:scale-105"
          >
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/5 to-transparent opacity-100" />

            <CameraOff
              className="w-10 h-10 text-slate-300 group-hover:text-white transition-colors duration-500"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Text Group */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-medium text-slate-100 tracking-tight drop-shadow-lg">
            카메라가 꺼져있습니다
          </h3>
          <button
            onClick={handleActivate}
            disabled={isRequesting}
            className="text-sm text-slate-300 font-normal tracking-wide drop-shadow-md 
              hover:text-white underline cursor-pointer
              transition-all duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1"
          >
            {isRequesting ? "요청 중..." : "활성화하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
