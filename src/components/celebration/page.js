"use client"; // Required for client-side components in Next.js

import React, { useState } from "react";
import Confetti from "react-confetti";

const CelebrationComponent = () => {
  const [isConfettiActive, setIsConfettiActive] = useState(true);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* Confetti Animation */}
      {isConfettiActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false} // Stop confetti after one cycle
          numberOfPieces={500} // Number of confetti pieces
          onConfettiComplete={() => setIsConfettiActive(false)} // Stop confetti after animation
        />
      )}

      {/* Celebration Message */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎉 Congratulations! 🎉
        </h1>
        <p className="text-gray-600">
          Your course has been created successfully!
        </p>
      </div>
    </div>
  );
};

export default CelebrationComponent;
