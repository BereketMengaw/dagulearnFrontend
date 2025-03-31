import React from "react";

const Modal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      {/* Main modal container - now takes more vertical space */}
      <div className="relative w-1/2 h-[50vh] max-w-4xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 z-10"
        >
          ✕
        </button>

        {/* Video container with improved vertical sizing */}
        <div className="relative w-full h-full">
          <iframe
            src={`${videoUrl}?autoplay=1&mute=1&loop=1&rel=0&playsinline=1`}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Optional overlay to make controls more visible */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
