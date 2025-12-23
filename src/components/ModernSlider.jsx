import React, { useState, useEffect } from "react";
import "./ModernSlider.css";

export default function ModernSlider({
  images = [],
  autoPlay = true,
  interval = 4000,
}) {
  const [index, setIndex] = useState(0);

  // 👉 Auto-play logic
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, interval);

    return () => clearInterval(timer);
  }, [index, autoPlay, interval, images.length]);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="slider-wrapper"
      style={{ backgroundImage: `url(${images[index]})` }}
    >
      {/* CENTER IMAGE */}
      {/* <div className="slider-card">
        <img src={images[index]} alt="slide" />
      </div> */}

      {/* LEFT ARROW */}
      {/* <button className="arrow left" onClick={prevSlide}>
        ←
      </button> */}

      {/* RIGHT ARROW */}
      {/* <button className="arrow right" onClick={nextSlide}>
        →
      </button> */}

      {/* DOTS */}
      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  );
}
