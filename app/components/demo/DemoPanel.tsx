"use client";

import { useOverlayContext } from "../overlay/OverlayContext";
import { Play, MapPin, Navigation, Camera } from "lucide-react";

export default function DemoPanel() {
  const { startDemo } = useOverlayContext();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)' }}>
      <div className="max-w-md w-full mx-4 p-8 rounded-3xl shadow-2xl" 
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-light)'
        }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ 
              background: 'linear-gradient(to bottom right, var(--action-primary), var(--action-accent))'
            }}>
            <Navigation className="w-8 h-8" style={{ color: 'var(--text-white)' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Caainp Demo
          </h1>
        </div>

        <button
          onClick={startDemo}
          className="w-full py-4 px-6 rounded-2xl font-semibold text-lg
            flex items-center justify-center gap-3
            transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
            shadow-lg"
          style={{ 
            background: 'linear-gradient(to right, var(--action-primary), var(--action-accent))',
            color: 'var(--text-white)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, var(--action-primary-hover), var(--action-accent-hover))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, var(--action-primary), var(--action-accent))';
          }}
        >
          <Play className="w-5 h-5" />
          Start Demo
        </button>
      </div>
    </div>
  );
}