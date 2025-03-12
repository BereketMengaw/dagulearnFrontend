import React from "react";

const Modal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>
        <div className="relative aspect-w-16 aspect-h-9">
          <iframe
            className="w-full h-64 sm:h-80 lg:h-96 rounded-lg"
            src={videoUrl}
            title="YouTube Video"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Modal;
