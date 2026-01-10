import React, { useState, useEffect, useRef } from "react";
import "./BanquetSlider.css";

export default function BanquetSlider() {
  const images = ["/assets/g1.png", "/assets/g2.png", "/assets/g3.png"];

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-play every 4 seconds
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const startAutoPlay = () => {
    stopAutoPlay();
    intervalRef.current = setInterval(nextSlide, 4000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <section className="banquet-wrapper">
      <div
        className="banquet-slider"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        <img
          src={images[index]}
          alt="Banquet Hall"
          className="banquet-image fade"
        />

        {/* LEFT ARROW */}
        <button className="banquet-arrow left" onClick={prevSlide}>
          ‹
        </button>

        {/* RIGHT ARROW */}
        <button className="banquet-arrow right" onClick={nextSlide}>
          ›
        </button>

        {/* DOTS */}
        {/* <div className="banquet-dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            ></span>
          ))}
        </div> */}
      </div>

      {/* DESCRIPTION */}
      <div className="banquet-description">
        <p>
          Banquet halls at BHR Hotels Group - One of the top hotel chains in
          India, are elegantly designed spacious venues for all your event
          requirements. Guests get customized packages, suited for every budget
          coupled with well-appointed rooms, varied dining options, numerous
          recreational facilities, and seamless service.
        </p>

        <p>
          We ensure that events organized at our banquet halls add a special
          touch to all your occasions. Be it a Conference, Meeting, Wedding or
          any other Social Gathering, we customize our facilities to meet your
          needs and ensure a memorable event!
        </p>
      </div>
    </section>
  );
}
