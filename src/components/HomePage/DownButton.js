"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const AnimatedDownwardButton = () => {
  const [isMovingDown, setIsMovingDown] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMovingDown((prev) => !prev);
    }, 500); // Toggle animation every 0.5 seconds for faster movement
    return () => clearInterval(interval);
  }, []);

  const handleScroll = () => {
    // Scroll down by the viewport height
    window.scrollBy({
      top: window.innerHeight, // Move one screen down
      behavior: "smooth", // Smooth scrolling
    });
  };

  return (
    <div className="flex justify-center items-center pt-28">
      <button
        onClick={handleScroll}
        className={`transition-transform duration-300 ${
          isMovingDown ? "translate-y-1" : "-translate-y-1"
        }`}
        aria-label="Scroll Down"
      >
        <div className="flex flex-col items-center -space-y-2">
          <Image
            src="/images/down-arrow.png" // Path to your uploaded image
            alt="Downward Arrow"
            width={40} // Adjust size as needed
            height={40}
          />
        </div>
      </button>
    </div>
  );
};

export default AnimatedDownwardButton;
