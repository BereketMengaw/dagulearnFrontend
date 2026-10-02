import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, videoUrl }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X size={20} />
        </button>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
          <iframe
            src={`${videoUrl}?autoplay=1&mute=1&loop=1&rel=0&playsinline=1`}
            className="absolute inset-0 h-full w-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
