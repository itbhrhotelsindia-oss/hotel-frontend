import React, { useEffect, useRef, useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import Footer from "../components/Footer.jsx";

import {
  FaEnvelope,
  FaPhoneAlt
} from "react-icons/fa";

/*
  HOME.JSX - OPTION A (Backend Driven + Same Layout)
  --------------------------------------------------
  ✔ Uses backend values
  ✔ Keeps your exact working HTML structure
  ✔ Slider + Brand + Events + Banner all remain identical
*/

// ------------------------------
// FALLBACK DATA (if backend fails)
// ------------------------------
const FALLBACK = {
  heroImages: [
    "/assets/hero1.png",
    "/assets/hero2.png",
    "/assets/brand-2.png",
    "/assets/hero2.png",
    "/assets/brand-2.png",
  ],
  brandSection: {
    title: "OUR BRANDS",
    blocks: [
      {
        layout: "text-left-image-right",
        text: "Experience the pinnacle of refined Indian luxury...",
        imageUrl: "/assets/brand-1.png",
      },
      {
        layout: "image-left-text-right",
        text: "Dynamic, stylish, and connected to India’s urban lifestyle...",
        imageUrl: "/assets/brand-1.png",
      },
      {
        layout: "image-left-text-right",
        text: "Dynamic, stylish, and connected to India’s evolving lifestyle...",
        imageUrl: "/assets/brand-1.png",
      },
      {
        layout: "text-left-image-right",
        text: "Dynamic, stylish, and connected to India’s evolving lifestyle...",
        imageUrl: "/assets/brand-1.png",
      },
    ],
  },
  eventsSection: {
    title: "PLAN YOUR EVENTS",
    events: [
      {
        title: "Woyage - Daycations",
        imageUrl: "/assets/g1.png",
        description: "Replenish your spirit...",
      },
      {
        title: "Luxury Escapes",
        imageUrl: "/assets/g2.png",
        description: "Unwind in curated luxurious settings...",
      },
      {
        title: "Offers & Promotions",
        imageUrl: "/assets/g3.png",
        description: "Exclusive seasonal offers...",
      },
    ],
  },
  aboutSection: {
    title: "ABOUT US",
    description:
      "Since 2016, we've been helping travelers find stays they love...",
    buttonText: "Know More →",
    buttonLink: "/about",
    stats: [
      { value: "98%+", label: "Positive Feedback" },
      { value: "15+", label: "Years of Expertise" },
      { value: "25K+", label: "Happy Guests" },
    ],
  },
  brandBanner: {
    title: "TRULY INDIAN. TRADITIONALLY LUXURIOUS.",
    subtitle: "Leading Hotel Chain Group in India",
    contacts: [
      {
        type: "phone",
        value: "18002091400",
        displayValue: "1800 209 1400",
      },
      {
        type: "email",
        value: "centralreservations@hrchotel.com",
        displayValue: "centralreservations@hrchotel.com",
      },
    ],
  },
  contactSection: {
    reservationPhone: "180400",
    hotelPhone: "+91 9876543210",
    email: "centralions@hrchotel.com",
    corporateAddress: "Corporate Office, Mumbai",
    supportHours: "24x7",
    socialLinks: [
      { name: "facebook", url: "https://facebook.com/hrchotel" },
      { name: "twitter", url: "https://twitter.com/hrchotel" },
      { name: "instagram", url: "https://instagram.com/hrchotel" },
    ]
  },
};

export default function Home() {
  const [home, setHome] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  const cards = [
    {
      id: 1,
      title: "MEETINGS & CONFERENCES",
      img: "/assets/g1.png", // change to your image path
    },
    {
      id: 2,
      title: "EVENTS",
      img: "/assets/g2.png", // change to your image path
    },
    {
      id: 3,
      title: "TIMELESS WEDDINGS",
      img: "/assets/g3.png", // change to your image path
    },
  ];
  // --------------------------
  // FETCH BACKEND DATA
  // --------------------------
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:8080/api/home");
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();

        // Merge backend values with fallback so layout never breaks
        setHome({
          heroImages: data.heroImages || FALLBACK.heroImages,
          brandSection: data.brandSection || FALLBACK.brandSection,
          eventsSection: data.eventsSection || FALLBACK.eventsSection,
          aboutSection: data.aboutSection || FALLBACK.aboutSection,
          brandBanner: data.brandBanner || FALLBACK.brandBanner,
          contactSection: data.contactSection || FALLBACK.contactSection,
        });
      } catch (e) {
        console.warn("Using fallback (backend error):", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  // --------------------------
  // HERO SLIDER ENGINE
  // --------------------------
  const wrapperRef = useRef(null);

  const slides = [
    home.heroImages[home.heroImages.length - 1],
    ...home.heroImages,
    home.heroImages[0],
  ];
  const total = slides.length;

  const [index, setIndex] = useState(1);
  const [transitionMs, setTransitionMs] = useState(400);
  const slideWidthPercent = 100 / total;
  const translatePercent = index * slideWidthPercent;

  // autoplay
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => i + 1), 8000);
    return () => clearInterval(id);
  }, []);

  // infinity logic
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function handleEnd() {
      if (index === total - 1) {
        setTransitionMs(0);
        setIndex(1);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTransitionMs(400))
        );
      }
      if (index === 0) {
        setTransitionMs(0);
        setIndex(total - 2);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTransitionMs(400))
        );
      }
    }

    wrapper.addEventListener("transitionend", handleEnd);
    return () => wrapper.removeEventListener("transitionend", handleEnd);
  }, [index, total]);

  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  // --------------------------
  // SCROLL HEADER
  // --------------------------
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    function scroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", scroll);
    return () => window.removeEventListener("scroll", scroll);
  }, []);

  // --------------------------
  // RENDER UI
  // --------------------------
  return (
    <div className="page-home">
      <HeaderBar
        scrolled={scrolled}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        contactInfo={home.contactSection}
      />

      {heroSection()}
      {brandBanner()}
      {/* {brandsSection()} */}
    {ourBrands()}
      {eventsSection()}
      {/* {aboutSection()} */}

      <Footer contactInfo={home.contactSection} />
    </div>
  );

  // --------------------------
  // HERO SECTION
  // --------------------------
  function heroSection() {
    return (
      <section className="hero-slider">
        <div
          className="hero-slider-wrapper"
          ref={wrapperRef}
          style={{
            width: `${total * 100}%`,
            display: "flex",
            transform: `translateX(-${translatePercent}%)`,
            transition: `transform ${transitionMs}ms ease-in-out`,
          }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              className={`hero-slide ${i === index ? "active" : ""}`}
              style={{ flex: `0 0 ${slideWidthPercent}%` }}
            >
              <img src={s} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>

        <button className="slider-arrow left" onClick={prev}>‹</button>
        <button className="slider-arrow right" onClick={next}>›</button>

        <div className="hero-overlay">
          <div className="hero-left">
            <h1 className="hero-title">Experience Luxury Stays Across India</h1>
            <p className="hero-sub">Book directly for best prices & premium offers.</p>
          </div>

          <div className="promo-card">
            <h3>Promocode: WWP</h3>
            <p>Save up to 20% on selected stays</p>
            <a className="promo-btn" href="/hotels">Explore Hotels</a>
          </div>
        </div>

        <div className="slider-dots">
          {home.heroImages.map((_, i) => (
            <button
              key={i}
              className={`dot ${index === i + 1 ? "active" : ""}`}
              onClick={() => setIndex(i + 1)}
            />
          ))}
        </div>
      </section>
    );
  }

  // --------------------------
  // BRAND BANNER
  // --------------------------
  function brandBanner() {
    const banner = home.brandBanner;
    return (
      <section className="brand-banner-premium">
        <div className="brand-banner-inner">
          <h2 className="brand-banner-title">{banner.title}</h2>
          <p className="brand-banner-sub">{banner.subtitle}</p>

          <div className="brand-banner-contacts">
           <div
                className="bb-contact"
                onClick={() =>
                  window.location.href =
                    `tel:${home.contactSection.reservationPhone}`
                }
              >
                {  <FaPhoneAlt /> } {home.contactSection.reservationPhone}
            </div>
            <div
                className="bb-contact"
                onClick={() =>
                  window.location.href =
                    `mailto:${home.contactSection.email}`
                }
              >
                { <FaEnvelope /> } {home.contactSection.email}
              </div>
          </div>
        </div>
      </section>
    );
  }


  function ourBrands() {

  const section = home.brandSection;
  const title = section.title || "OUR BRANDS";
  const brands = section.blocks || [];
    return <section className="events-conf-section" style={{ background: "#e9e6e6ff" }}>
      {/* HEADER ROW */}
      <div className="events-conf-header">
        <div className="events-conf-title-wrap">
           <span className="line" />
          <h2 className="events-conf-title">
            {title}
          </h2>
        </div>

        <p className="events-conf-sub">
          From a luxury urban sanctum to the halls of royalty, an idyllic resort to a jungle clearing, our 5-star hotels and luxury resorts bring your imagination to life.
        </p>
      </div>

      {/* CARDS */}
      <div className="events-conf-cards">
        {brands.map((brand) => (
          // <div key={brand.id} className="events-conf-card">
          <div className="events-conf-card">
            <img src={brand.imageUrl} alt={brand.title} className="events-conf-image" />
            <div className="events-conf-caption">
              <span>{brand.text}</span>
            </div>
          </div>
        ))}
      </div>
    </section>;
  }

  // --------------------------
  // BRAND BLOCKS
  // --------------------------
  function brandsSection() {
  const section = home.brandSection;
  const title = section.title || "OUR BRANDS";
  const blocks = section.blocks || [];

  return (
<section className="brands-section">
  <h2 className="brands-title">{title}</h2>

  <div className="brands-inner">
    {blocks.map((details, i) => {
      const isImageLeft = details.layout === "image-left-text-right";

      return (
        <div
          className={`brand-sub-row ${isImageLeft ? "image-left" : "image-right"}`}
          key={i}
        >
          {/* LEFT side */}
          {isImageLeft ? (
            <>
              <div className="brand-sub-image-wrap">
                <img
                  src={details.imageUrl}
                  alt=""
                  className="brand-sub-image"
                />
              </div>
              <div className="brand-sub-text-wrap">
                <p className="brand-sub-desc">{details.text}</p>
              </div>
            </>
          ) : (
            <>
              <div className="brand-sub-text-wrap">
                <p className="brand-sub-desc">{details.text}</p>
              </div>
              <div className="brand-sub-image-wrap">
                <img
                  src={details.imageUrl}
                  alt=""
                  className="brand-sub-image"
                />
              </div>
            </>
          )}
        </div>
      );
    })}
  </div>
</section>
  );
}


  // --------------------------
  // EVENTS SECTION
  // --------------------------
  function eventsSection() {
    const { title, events } = home.eventsSection;
    const [idx, setIdx] = useState(0);

    const left = events[(idx - 1 + events.length) % events.length];
    const center = events[idx];
    const right = events[(idx + 1) % events.length];

    return (
      <section className="events-conf-section" >
          <div className="events-conf-header">
          <div className="events-conf-title-wrap">
           <span className="line" />
          <h2 className="events-conf-title">
            {title}
          </h2>
        </div>

        <p className="events-conf-sub">
          From a luxury urban sanctum to the halls of royalty, an idyllic resort to a jungle clearing, our 5-star hotels and luxury resorts bring your imagination to life.
        </p>
      </div>


        <div className="left-card">
          {/* Left */}
          <div className="side-card">
            <img src={left.imageUrl} className="side-img" />
            <div className="side-border" />
            <div className="side-label">{left.title}</div>
            <button className="nav-arrow left" onClick={() => setIdx((idx - 1 + events.length) % events.length)}>‹</button>
          </div>

          {/* Center */}
          <div className="center-card">
            <img src={center.imageUrl} className="center-img" />
            <div className="center-box">
              <h3>{center.title}</h3>
              <p>{center.description}</p>
            </div>
          </div>

          {/* Right */}
          <div className="side-card">
            <img src={right.imageUrl} className="side-img" />
            <div className="side-border" />
            <div className="side-label">{right.title}</div>
            <button className="nav-arrow right" onClick={() => setIdx((idx + 1) % events.length)}>›</button>
          </div>
        </div>
      </section>
    );
  }

  // --------------------------
  // ABOUT US
  // --------------------------
  function aboutSection() {
    const a = home.aboutSection;

    return (
      <section className="about-section">
        <div className="about-inner">
          <h4 className="abt-title">{a.title}</h4>
          <p className="abt-text">{a.description}</p>
          <button className="abt-btn" onClick={() => (window.location.href = a.buttonLink)}>
            {a.buttonText}
          </button>
        </div>

        <div className="stats-row">
          {a.stats.map((s, i) => (
            <div className="stat-box" key={i}>
              <h2>{s.value}</h2>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
}
