import React, { useEffect, useRef, useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";

const ORIGINAL_IMAGES = [
  "/assets/hero2.png",
  "/assets/hero3.png",
  "/assets/hero1.png",
  "/assets/hero2.png",
  "/assets/hero3.png",
];

export default function Home() {
  const slides = [
    ORIGINAL_IMAGES[ORIGINAL_IMAGES.length - 1],
    ...ORIGINAL_IMAGES,
    ORIGINAL_IMAGES[0],
  ];
  const realCount = ORIGINAL_IMAGES.length;
  const total = slides.length;

  const [index, setIndex] = useState(1);
  const [transitionMs, setTransitionMs] = useState(400);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  const wrapperRef = useRef(null);
  const timerRef = useRef(null); // for autoplay timeout id
  const transitionFallbackRef = useRef(null); // fallback timeout id for transitionend
  const mountedRef = useRef(true);
  const hiddenRef = useRef(false);

  // preload images (non-blocking)
  useEffect(() => {
    let loaded = 0;
    const imgs = [];
    ORIGINAL_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded++;
        if (mountedRef.current && loaded === ORIGINAL_IMAGES.length) {
          setImagesPreloaded(true);
        }
      };
      imgs.push(img);
    });
    return () => {
      mountedRef.current = false;
      imgs.forEach((i) => (i.src = ""));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autoplay using recursive setTimeout (safer than setInterval)
  useEffect(() => {
    function schedule() {
      clearTimeout(timerRef.current);
      // don't schedule while paused or if page hidden
      if (isPaused || hiddenRef.current) return;
      timerRef.current = setTimeout(() => {
        // advance by 1
        setIndex((i) => i + 1);
        schedule(); // schedule next tick
      }, 700); // your autoplayDelay
    }
    schedule();
    return () => clearTimeout(timerRef.current);
  }, [isPaused]);

  // Pause on visibilitychange / blur (prevents odd timer/resume behavior)
  useEffect(() => {
    function onVisibilityChange() {
      const hidden = document.visibilityState === "hidden";
      hiddenRef.current = hidden;
      setIsPaused(hidden);
    }
    function onBlur() {
      hiddenRef.current = true;
      setIsPaused(true);
    }
    function onFocus() {
      hiddenRef.current = false;
      setIsPaused(false);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // transitionend handler + fallback
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function handleEnd() {
      // clear fallback timer
      clearTimeout(transitionFallbackRef.current);

      if (index === total - 1) {
        setTransitionMs(0);
        setIndex(1);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTransitionMs(400))
        );
      } else if (index === 0) {
        setTransitionMs(0);
        setIndex(total - 2);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTransitionMs(400))
        );
      }
    }

    wrapper.addEventListener("transitionend", handleEnd);

    return () => {
      wrapper.removeEventListener("transitionend", handleEnd);
      clearTimeout(transitionFallbackRef.current);
    };
  }, [index, total]);

  // Whenever we change index so that a transition will occur, set a fallback timeout
  // If transitionend doesn't fire (browser throttling, 0ms transition, etc), fallback will snap.
  useEffect(() => {
    // clear previous fallback
    clearTimeout(transitionFallbackRef.current);

    // only set fallback if we expect a transition (transitionMs > 0)
    if (transitionMs > 0) {
      transitionFallbackRef.current = setTimeout(() => {
        // mimic transitionend behavior
        if (index === total - 1) {
          setTransitionMs(0);
          setIndex(1);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setTransitionMs(400))
          );
        } else if (index === 0) {
          setTransitionMs(0);
          setIndex(total - 2);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setTransitionMs(400))
          );
        }
      }, transitionMs + 120); // small buffer after transition duration
    }

    return () => clearTimeout(transitionFallbackRef.current);
  }, [index, transitionMs, total]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
      clearTimeout(transitionFallbackRef.current);
    };
  }, []);

  // safe manual nav
  function next() {
    clearTimeout(timerRef.current);
    setIndex((i) => i + 1);
  }
  function prev() {
    clearTimeout(timerRef.current);
    setIndex((i) => i - 1);
  }
  function goToReal(i) {
    clearTimeout(timerRef.current);
    setIndex(i + 1);
  }

  // percent math consistent with slides.length
  const slideWidthPercent = 100 / total;
  const translatePercent = index * slideWidthPercent;

  // image onError handler to show a subtle fallback instead of blank
  function handleImgError(el) {
    if (!el) return;
    // replace background image with a neutral gradient / color
    el.style.backgroundImage =
      "linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))";
    el.classList.remove("active");
  }

  return (
    <div className="page-home">
      <TopBar />
      <HeaderBar />

      <section
        className="hero-slider"
        style={{ height: "calc(100vh - 120px)" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Optional loading indicator if very slow */}
        {!imagesPreloaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              pointerEvents: "none",
            }}
          >
            Loading…
          </div>
        )}

        <div
          className="hero-slider-wrapper"
          ref={wrapperRef}
          style={{
            width: `${total * 100}%`,
            display: "flex",
            transform: `translateX(-${translatePercent}%)`,
            transition: `transform ${transitionMs}ms ease-in-out`,
            height: "100%",
          }}
        >
          {slides.map((img, i) => (
            <div
              key={i}
              ref={(el) => {
                // set onError only once when the node is created
                if (el && !el.dataset.errorHandlerAttached) {
                  el.dataset.errorHandlerAttached = "1";
                  // create a test img to probe if source is reachable
                  const test = new Image();
                  test.src = img;
                  test.onerror = () => handleImgError(el);
                }
              }}
              className={`hero-slide ${i === index ? "active" : ""}`}
              style={{
                backgroundImage: `url(${img})`,
                flex: `0 0 ${slideWidthPercent}%`,
                width: `${slideWidthPercent}%`,
                height: "100%",
                backgroundColor: "#111", // fallback color while loading
              }}
              role="img"
              aria-label={`Slide ${i}`}
            />
          ))}
        </div>

        {/* overlay */}
        <div className="hero-overlay" aria-hidden={false}>
          <div className="hero-left">
            <h1 className="hero-title">Experience Luxury Stays Across India</h1>
            <p className="hero-sub">
              Book directly for best prices, instant confirmation & premium
              offers.
            </p>

            <div className="search-row">
              <input type="text" placeholder="City or Landmark" aria-label="Search location" />
              <input type="date" aria-label="Check-in date" />
              <input type="date" aria-label="Check-out date" />
              <button className="btn-primary" aria-label="Book now">BOOK NOW</button>
            </div>

            <small className="help-text">
              Need help? Call us: <strong>1800 209 1400</strong>
            </small>
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
          {ORIGINAL_IMAGES.map((_, i) => (
            <button
              key={i}
              className={`dot ${index === i + 1 ? "active" : ""}`}
              onClick={() => goToReal(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={index === i + 1}
              role="tab"
            />
          ))}
        </div>
      </section>
    </div>
  );

  function TopBar() {
    return (
      <div className="top-bar" role="banner">
        <div className="top-inner">
          <span className="top-item">✉️ centralreservations@pridehotel.com</span>
          <span className="top-item">📞 Toll Free Number: 1800 209 1400</span>
        </div>
      </div>
    );
  }
}
