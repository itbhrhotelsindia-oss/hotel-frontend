import React, { useEffect, useRef, useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";

/*
  Home.jsx - Sliding + Fading Hero with Zoom Parallax, Arrows, Dots
  Uses images available in the sandbox (uploaded files). If you prefer to use
  /assets paths, copy the files to public/assets and update HERO_IMAGES accordingly.
*/

const HERO_IMAGES = [
  "/assets/hero2.png",
  "/assets/hero3.png",
  "/assets/hero1.png",
  "/assets/hero2.png",
  "/assets/hero3.png",
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0); // used to restart CSS animation if needed
  const autoplayDelay = 1500; // ms - change this value to speed up/slow down
  const transitionDuration = 1000; // match CSS transition time (ms)
  const timerRef = useRef(null);

  // autoplay
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
      setAnimKey((k) => k + 1);
    }, autoplayDelay);
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  // clear on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function goTo(i) {
    clearInterval(timerRef.current);
    setIndex(i % HERO_IMAGES.length);
    setAnimKey((k) => k + 1);
  }

  function prev() {
    goTo((index - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  }

  function next() {
    goTo((index + 1) % HERO_IMAGES.length);
  }

  return (
    <div className="page-home">
      <TopBar />
      <HeaderBar />

      {homeFunction()}
    </div>
  );

  function TopBar() {
    return (
      <div className="top-bar" role="banner">
        <div className="top-inner">
          <div />
          <div className="top-right">
            <span className="top-item">✉️ centralreservations@pridehotel.com</span>
            <span className="top-item">📞 Toll Free Number: 1800 209 1400</span>
          </div>
        </div>
      </div>
    );
  }


  function homeFunction() {
    return <section
      className="hero-slider"
      style={{ height: "calc(100vh - 120px)", overflow: "hidden" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero slideshow"
    >
      {/* sliding wrapper */}

      <div className="hero-slider-wrapper"
        style={{
          transform: `translate3d(-${index * 100}%, 0, 0)`,
          transition: `transform ${transitionDuration}ms ease-in-out`,
          willChange: "transform",
        }}>

        {HERO_IMAGES.map((img, i) => {
          const isActive = i === index;
          // add a unique key so CSS animations restart when animKey changes
          return (
            <div
              key={`${i}-${animKey}`}
              className={`hero-slide ${isActive ? "active" : ""}`}
              style={{
                backgroundImage: `url(${img})`,
                height: "100%",
                width: `${100 / HERO_IMAGES.length}%`, // each slide takes 1/N of the wrapper
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
              aria-hidden={!isActive} />
          );
        })}
      </div>

      {/* overlay content (keeps same as before) */}
      <div className="hero-overlay">
        <div className="hero-left">
          <h1 className="hero-title">Experience Luxury Stays Across India</h1>
          <p className="hero-sub">Book directly for best prices, instant confirmation & premium offers.</p>

          <div className="search-row">
            <input type="text" placeholder="City or Landmark" aria-label="Search location" />
            <input type="date" aria-label="Check-in date" />
            <input type="date" aria-label="Check-out date" />
            <button className="btn-primary">BOOK NOW</button>
          </div>

          <small className="help-text">Need help? Call us: <strong>1800 209 1400</strong></small>
        </div>

        <div className="promo-card" role="region" aria-label="Promotion">
          <h3>Promocode: WWP</h3>
          <p>Save up to 20% on selected stays</p>
          <a className="promo-btn" href="/hotels">Explore Hotels</a>
        </div>
      </div>

      {/* arrows */}
      <button className="slider-arrow left" onClick={prev} aria-label="Previous slide">‹</button>
      <button className="slider-arrow right" onClick={next} aria-label="Next slide">›</button>

      {/* dots */}
      <div className="slider-dots" role="tablist" aria-label="Slide controls">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </section>;
  }
}
