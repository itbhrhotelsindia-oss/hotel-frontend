import React, { useEffect, useRef, useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import ExitOfferModal from "../components/ExitOfferModal.jsx";

/*
  Home.jsx - robust hero slider using <img> elements + fallback SVG
  Keeps ORIGINAL_IMAGES exactly as provided by you.
*/

const ORIGINAL_IMAGES = [
  "/assets/hero1.png",
  "/assets/hero2.png",
  "/assets/brand-2.png",
  "/assets/hero2.png",
  "/assets/brand-2.png",
];

export default function Home() {
  const [offerOpen, setOfferOpen] = useState(true);
  // clone technique for infinite carousel: [last, ...real, first]
  const slides = [
    ORIGINAL_IMAGES[ORIGINAL_IMAGES.length - 1],
    ...ORIGINAL_IMAGES,
    ORIGINAL_IMAGES[0],
  ];
  const total = slides.length;

  // state
  const [index, setIndex] = useState(1); // start at first real slide
  const [transitionMs, setTransitionMs] = useState(400);
  const [isPaused, setIsPaused] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false); // NEW: track dropdown state

  // refs
  const wrapperRef = useRef(null);
  const timerRef = useRef(null);
  const transitionFallbackRef = useRef(null);
  const mountedRef = useRef(true);
  const hiddenRef = useRef(false);

  // tiny inline SVG placeholder (dark neutral) — used when image fails
  const PLACEHOLDER_SVG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" fill="#888" font-size="28" font-family="Arial" text-anchor="middle" dy=".35em">Image not available</text></svg>`
    );

  // preload images (no-op if missing but helpful)
  useEffect(() => {
    let loaded = 0;
    const probes = [];
    ORIGINAL_IMAGES.forEach((src) => {
      try {
        const img = new Image();
        img.src = src;
        img.onload = img.onerror = () => {
          loaded++;
        };
        probes.push(img);
      } catch (e) {
        console.warn("Preload error for", src, e);
      }
    });
    return () => {
      mountedRef.current = false;
      probes.forEach((p) => (p.src = ""));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // autoplay using recursive timeout (safe with page visibility)
  useEffect(() => {
    function schedule() {
      clearTimeout(timerRef.current);
      if (isPaused || hiddenRef.current) return;
      timerRef.current = setTimeout(() => {
        setIndex((i) => i + 1);
        schedule();
      }, 8000);
    }
    schedule();
    return () => clearTimeout(timerRef.current);
  }, [isPaused]);

  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  function handleScroll() {
    const isTop = window.scrollY < 50;
    setScrolled(!isTop);
  }
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  
  // pause when page hidden or window blur
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

  // transitionend handler to snap clones -> real slides
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function handleEnd() {
      clearTimeout(transitionFallbackRef.current);

      if (index === total - 1) {
        // moved to cloned last -> snap to real first
        setTransitionMs(0);
        setIndex(1);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTransitionMs(400))
        );
      } else if (index === 0) {
        // moved to cloned first -> snap to real last
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

  // fallback if transitionend doesn't fire
  useEffect(() => {
    clearTimeout(transitionFallbackRef.current);
    if (transitionMs > 0) {
      transitionFallbackRef.current = setTimeout(() => {
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
      }, transitionMs + 120);
    }
    return () => clearTimeout(transitionFallbackRef.current);
  }, [index, transitionMs, total]);

  // cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
      clearTimeout(transitionFallbackRef.current);
    };
  }, []);

  // nav helpers
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

  // math for transforms
  const slideWidthPercent = 100 / total;
  const translatePercent = index * slideWidthPercent;

  // image onError for <img>
  function handleImgError(el, src) {
    if (!el) return;
    console.warn("Hero image failed to load:", src, "— using placeholder.");
    el.src = PLACEHOLDER_SVG;
  }

  // quick sanity logs: if ORIGINAL_IMAGES missing
  if (!Array.isArray(ORIGINAL_IMAGES) || ORIGINAL_IMAGES.length === 0) {
    console.error("ORIGINAL_IMAGES is empty — add image paths in Home.jsx");
  }

  return (
    <div className="page-home">
      {/* {offerOpen && (
        <ExitOfferModal open={offerOpen} onClose={() => setOfferOpen(false)} />
      )} */}
      <TopBar />
      <SafeHeaderBar scrolled={scrolled} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
      {mainSection(dropdownOpen)}
      {brandBannerAndChatSection()}
      {ourBrandSection()}
      {planYourEventsSection()}
      {aboutUsSection()}
    </div>
  );

  function ourBrandSection() {
    return <section className="brands-section" aria-labelledby="brands-heading" style={{ padding: '40px 20px', fontSize: '18px' }}>
      <div className="brands-inner-container" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h2 id="brands-heading" className="brands-title" style={{ fontSize: '2rem' }}>OUR BRANDS</h2>
        <div className="brand-sub-row" >
          <div className="brand-sub-left" style={{ padding: '16px' }}>
            <p className="brand-sub-desc" style={{ fontSize: '1.3rem', lineHeight: 1.6 }}>
              Experience the pinnacle of refined Indian luxury at Pride Plaza, our upscale brand created for high-income individuals, C-suite executives, and elite leisure travellers. Combining timeless Indian traditions with sophisticated contemporary design, Pride Plaza delivers world-class hospitality, bespoke services, and a setting that celebrates elegance. Perfect for luxury business travel, high-profile events, and destination weddings, each Pride Plaza hotel is a haven for guests who value exclusivity, comfort, and culturally rich experiences. <strong>Pride Premier</strong>.
            </p>
          </div>

          <div className="brand-sub-right" style={{ padding: '16px' }}>
            <div className="brand-logos" aria-hidden={false}>
              <img src="/assets/brand-1.png" alt="Brand 1" style={{ width: '650px', height: 'auto' }} />
            </div>
          </div>

          <div className="brand-sub-right" style={{ padding: '16px' }}>
            <div className="brand-logos" aria-hidden={false}>
              <img src="/assets/brand-1.png" alt="Brand 1" style={{ width: '650px', height: 'auto' }} />
            </div>
          </div>

          <div className="brand-sub-left" style={{ padding: '16px' }}>
            <p className="brand-sub-desc" style={{ fontSize: '1.3rem', lineHeight: 1.6 }}>
              Dynamic, stylish, and connected to India’s evolving urban lifestyle, Pride Premier is our upper midscale brand designed for affluent business executives and high-income families. Focused on accessibility, convenience, and premium value, Pride Premier blends contemporary comfort with personalised amenities to meet the needs of guests who seamlessly combine work and leisure. Whether it’s a corporate stay, a weekend family getaway, or a regional conference, every Pride Premier stay is refined, rewarding, and effortlessly hospitable. <strong>Pride Premier</strong>.
            </p>
          </div>

          <div className="brand-sub-left" style={{ padding: '16px' }}>
            <p className="brand-sub-desc" style={{ fontSize: '1.3rem', lineHeight: 1.6 }}>
              Dynamic, stylish, and connected to India’s evolving urban lifestyle, Pride Premier is our upper midscale brand designed for affluent business executives and high-income families. Focused on accessibility, convenience, and premium value, Pride Premier blends contemporary comfort with personalised amenities to meet the needs of guests who seamlessly combine work and leisure. Whether it’s a corporate stay, a weekend family getaway, or a regional conference, every Pride Premier stay is refined, rewarding, and effortlessly hospitable. <strong>Pride Premier</strong>.
            </p>
          </div>

          <div className="brand-sub-right" style={{ padding: '16px' }}>
            <div className="brand-logos" aria-hidden={false}>
              <img src="/assets/brand-1.png" alt="Brand 1" style={{ width: '650px', height: 'auto' }} />
            </div>
          </div>
        </div>
      </div>
    </section>;
  }
  
  function planYourEventsSection() {
  const items = [
    {
      title: "Woyage - Daycations",
      image: "/assets/g1.png",
      desc: "Replenish your spirit as you escape into your world of serenity...",
    },
    {
      title: "Luxury Escapes",
      image: "/assets/g2.png",
      desc: "Unwind in curated luxurious settings crafted just for unforgettable experiences.",
    },
    {
      title: "Offers & Promotions",
      image: "/assets/g3.png",
      desc: "Exclusive seasonal offers crafted just for you.",
    },
  ];

  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  const left = items[(index - 1 + items.length) % items.length];
  const center = items[index];
  const right = items[(index + 1) % items.length];

  return (
    <section className="taj-carousel-section">
      <h2 id="brands-heading" className="brands-title" style={{ fontSize: '2rem' }}>PLAN YOUR EVENTS</h2>

      <div className="taj-carousel">
        {/* LEFT */}
        <div className="side-card">
          <img src={left.image} className="side-img" />
          <div className="side-border"></div>
          <div className="side-label">{left.title}</div>
          <button className="nav-arrow left" onClick={prev}>‹</button>
        </div>

        {/* CENTER */}
        <div className="center-card">
          <img src={center.image} className="center-img" />
          <div className="center-box">
            <h3>{center.title}</h3>
            <p>{center.desc}</p>
            <a href="#" className="more-link">MORE ›</a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="side-card">
          <img src={right.image} className="side-img" />
          <div className="side-border"></div>
          <div className="side-label">{right.title}</div>
          <button className="nav-arrow right" onClick={next}>›</button>
        </div>
      </div>
    </section>
  );
}


  function aboutUsSection() {
    return <section className="about-section" id="about">
      <div className="about-inner">
        <h4 className="abt-title">ABOUT US</h4>
        <p className="abt-text">
          Since 2016, we've been helping travelers find stays they love — effortlessly.
          We're about curating unforgettable journeys! Our passionate team blends seamless technology with a love for discovery.
        </p>
        <button className="abt-btn" onClick={() => (window.location.href = "/about")}>Know More →</button>
      </div>
      <div className="stats-row" aria-hidden={false}>
        <div className="stat-box"><h2>98%+</h2><p>Positive Feedback</p></div>
        <div className="stat-box"><h2>15+</h2><p>Years of Expertise</p></div>
        <div className="stat-box"><h2>25K+</h2><p>Happy Guests</p></div>
      </div>
    </section>;
  }

  function brandBannerAndChatSection() {
    return <section className="brand-banner-premium" aria-label="Brand statement">
      <div className="brand-banner-inner">
        <h2 className="brand-banner-title">TRULY INDIAN. TRADITIONALLY LUXURIOUS.</h2>
        <p className="brand-banner-sub">Leading Hotel Chain Group in India</p>
        <div className="brand-banner-contacts" role="contentinfo" aria-label="Contact information">
          <div className="bb-contact" onClick={() => (window.location.href = "tel:18002091400")}>
            <span className="bb-icon" aria-hidden="true">📞</span>
            1800 209 1400
          </div>
          <div className="bb-contact" onClick={() => (window.location.href = "mailto:centralreservations@hrchotel.com")}>
            <span className="bb-icon" aria-hidden="true">✉️</span>
            centralreservations@hrchotel.com
          </div>
        </div>
      </div>

      <div className="chat-widget" aria-hidden={false}>
        {chatOpen && (
          <div className="chat-card" role="dialog" aria-label="Chat with Pratima">
            <div className="chat-message">
              <strong>Welcome to The HRC Group of Hotels.</strong>
              <div> I am Pratima! How may I help you today?</div>
            </div>
            <button className="chat-close" aria-label="Close chat" onClick={() => setChatOpen(false)}>✕</button>
          </div>
        )}
        <button
          className="chat-launch"
          aria-label={chatOpen ? "Close chat" : "Open chat"}
          onClick={() => setChatOpen((v) => !v)}
          title="Chat with us"
        >
          <img src="/assets/chat-avatar.jpg" alt="Chat avatar" />
        </button>
      </div>
    </section>;
  }

  function mainSection(isDropdownOpen = false) {
    return <section
      className="hero-slider"
      style={{ 
        height: "calc(100vh - 120px)",
       pointerEvents: isDropdownOpen ? "none" : "auto" // disable slider if dropdown open
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero slideshow"
    >
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
            className={`hero-slide ${i === index ? "active" : ""}`}
            style={{
              flex: `0 0 ${slideWidthPercent}%`,
              width: `${slideWidthPercent}%`,
              height: "100%",
              position: "relative",
              overflow: "hidden",
              backgroundColor: "#111",
            }}
            role="img"
            aria-label={`Slide ${i}`}
          >
            {/* Use an actual <img> for reliable loading/error handling */}
            <img
              src={img}
              alt={`Slide ${i}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                verticalAlign: "middle",
              }}
              onError={(e) => handleImgError(e.target, img)}
              draggable={false} />
          </div>
        ))}
      </div>

      {/* overlay */}
      <div className="hero-overlay" aria-hidden={false}>
        <div className="hero-left">
          <h1 className="hero-title">Experience Luxury Stays Across India</h1>
          <p className="hero-sub">
            Book directly for best prices, instant confirmation & premium offers.
          </p>

          <div className="search-row" role="search" aria-label="Find hotels">
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
            role="tab" />
        ))}
      </div>
    </section>;
  }

  // Top bar (premium)
  function TopBar() {
    return (
      <div className="topbar-premium" role="banner" aria-label="Top contact bar">
        <div className="topbar-inner container">
          <div className="topbar-left">
            <span className="topbar-item">✉️ info@bhrhotelsindia.com</span>
            <span className="topbar-item">📞 Toll Free: +91 921128334</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-tag">Luxury Hospitality · Since 2010</span>
          </div>
        </div>
      </div>
    );
  }

  // Safe header wrapper (falls back if HeaderBar import or render fails)
  function SafeHeaderBar() {
    if (!HeaderBar) {
      return fallbackHeader();
    }
        try {
          return <HeaderBar scrolled={scrolled} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />;
    } catch (e) {
      console.warn("HeaderBar render failed, using fallback header", e);
      return fallbackHeader();
    }

    function fallbackHeader() {
      return (
        <header className="header-bar">
          <div className="header-inner container">
            <img src="/assets/brand-logo.png" alt="Brand" className="brand-logo" />
            <nav className="main-nav" aria-label="Main navigation">
              <ul><li><a href="/">Home</a></li><li><a href="/hotels">Hotels</a></li><li><a href="/about">About</a></li></ul>
            </nav>
            <div className="header-actions"><button className="book-now" onClick={() => (window.location.href = "/book")}>Book Now</button></div>
          </div>
        </header>
      );
    }
  }
}
