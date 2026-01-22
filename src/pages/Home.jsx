import React, { useEffect, useRef, useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import Footer from "../components/Footer.jsx";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import BookingSearchBox from "./BookingSearchBox.jsx";

const FALLBACK = {
  heroImages: [
    "/assets/img1.jpg",
    "/assets/img2.jpg",
    "/assets/slider-3.jpg",
    "/assets/slider-1.jpg",
    "/assets/slider-2.jpg",
  ],
  brandSection: {
    title: "OUR BRANDS",
    blocks: [
      {
        layout: "text-left-image-right",
        text: "Experience the pinnacle of refined Indian luxury...",
        imageUrl: "/assets/slider-2.jpg",
      },
      {
        layout: "image-left-text-right",
        text: "Dynamic, stylish, and connected to India’s urban lifestyle...",
        imageUrl: "/assets/slider-1.jpg",
      },
      {
        layout: "image-left-text-right",
        text: "Dynamic, stylish, and connected to India’s evolving lifestyle...",
        imageUrl: "/assets/img1.jpg",
      },
      {
        layout: "text-left-image-right",
        text: "Dynamic, stylish, and connected to India’s evolving lifestyle...",
        imageUrl: "/assets/img3.jpg",
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
      "Since 2010, we've been helping travelers find stays they love — effortlessly. We're about curating unforgettable journeys! Our passionate team blends seamless technology with a love for discovery",
    buttonText: "Know More →",
    buttonLink: "/about",
    stats: [
      { value: "98%+", label: "Positive Feedback" },
      { value: "15+", label: "Years of Expertise" },
      { value: "25K+", label: "Happy Guests" },
    ],
  },
  brandBanner: {
    title: "Elegance Crafted With Indian Soul",
    subtitle:
      "From sacred pilgrimages and spiritual retreats to wildlife adventures, tranquil lakes and Himalayan vistas, discover experiences paired with immaculate spaces, refined comfort, and attentive hospitality for a truly elevated stay",
    contacts: [
      {
        type: "phone",
        value: "+91 9211283334",
        displayValue: "+91 9211283334",
      },
      {
        type: "email",
        value: "info@bhrhotelsindia.com",
        displayValue: "info@bhrhotelsindia.com",
      },
    ],
  },
  contactSection: {
    reservationPhone: "+91 9211283334",
    hotelPhone: "+91 9211283334",
    email: "info@bhrhotelsindia.com",
    corporateAddress: "Corporate Office, Mumbai",
    supportHours: "24x7",
    socialLinks: [
      { name: "facebook", url: "https://www.facebook.com/bhrhotelsindia" },
      { name: "twitter", url: "https://x.com/bhrhotelsindia" },
      {
        name: "instagram",
        url: "https://www.instagram.com/bhrhotelsindiaofficial",
      },
    ],
  },
};

export default function Home() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [home, setHome] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef(null);

  const slides = [
    home.heroImages[home.heroImages.length - 1],
    ...home.heroImages,
    home.heroImages[0],
  ];

  const total = slides.length;

  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);
  const [index, setIndex] = useState(1);
  const [transitionMs, setTransitionMs] = useState(100); // 1000 is for smooth sliding

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(true);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => prev), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (index === home.heroImages.length + 1) {
      setTimeout(() => {
        setTransitionMs(0);
        setIndex(1);
        setTimeout(() => setTransitionMs(100), 20); // 1000 is for smooth sliding
      }, transitionMs);
    }

    if (index === 0) {
      setTimeout(() => {
        setTransitionMs(0);
        setIndex(home.heroImages.length);
        setTimeout(() => setTransitionMs(100), 20); // 1000 is for smooth sliding
      }, transitionMs);
    }
  }, [index]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${BASE_URL}/api/home`);
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();

        // Merge backend values with fallback so layout never breaks

        data.heroImages = data.heroImages.map((imgUrl) => `${imgUrl}`);

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

  // autoplay
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => i + 1), 5000);
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
          requestAnimationFrame(() => setTransitionMs(400)),
        );
      }
      if (index === 0) {
        setTransitionMs(0);
        setIndex(total - 2);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTransitionMs(400)),
        );
      }
    }

    wrapper.addEventListener("transitionend", handleEnd);
    return () => wrapper.removeEventListener("transitionend", handleEnd);
  }, [index, total]);

  useEffect(() => {
    function scroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", scroll);
    return () => window.removeEventListener("scroll", scroll);
  }, []);

  return (
    <div className="page-home">
      <HeaderBar
        scrolled={scrolled}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        contactInfo={home.contactSection}
        setShowBooking={setShowBooking}
      />

      {sliderSection()}
      {brandBanner()}
      {/* {brandsSection()} */}
      {ourBrands()}
      {eventsSection()}
      {/* {aboutSection()} */}

      <Footer contactInfo={home.contactSection} />
    </div>
  );

  function sliderSection() {
    return (
      <section className="main-image-slider">
        <div
          className="main-image-slider-wrapper"
          ref={wrapperRef}
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: transitionMs
              ? `transform ${transitionMs}ms ease-in-out`
              : "none",
          }}
        >
          <div className="main-image-slide">
            <img src={home.heroImages[home.heroImages.length - 1]} />
          </div>

          {home.heroImages.map((src, i) => (
            <div key={i} className="main-image-slide">
              <img src={src} />
            </div>
          ))}

          <div className="main-image-slide">
            <img src={home.heroImages[0]} />
          </div>
        </div>

        <button className="slider-arrow left" onClick={prev}>
          ‹
        </button>
        <button className="slider-arrow right" onClick={next}>
          ›
        </button>

        {/* SHOW BOOKING BOX ONLY IF NOT IN POPUP MODE */}
        {showBooking && <BookingSearchBox />}

        <div className="slider-dots">
          {home.heroImages.map((_, i) => (
            <div
              key={i}
              className={`dot ${i + 1 === index ? "active" : ""}`}
              onClick={() => setIndex(i + 1)}
            />
          ))}
        </div>
      </section>
    );
  }

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
                (window.location.href = `tel:${home.contactSection.reservationPhone}`)
              }
            >
              {<FaPhoneAlt />} {home.contactSection.reservationPhone}
            </div>
            <div
              className="bb-contact"
              onClick={() =>
                (window.location.href = `mailto:${home.contactSection.email}`)
              }
            >
              {<FaEnvelope />} {home.contactSection.email}
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
    const description = section.description || "OUR BRANDS";
    return (
      <section
        className="events-conf-section"
        style={{ background: "#e9e6e6ff" }}
      >
        {/* HEADER ROW */}
        <div className="events-conf-header">
          <div className="events-conf-title-wrap">
            <span className="line" />
            <h2 className="events-conf-title">{title}</h2>
          </div>

          <p className="events-conf-sub">{description}</p>
        </div>

        <div className="brand-card-wrapper">
          {brands.map((brand, index) => (
            <div className="brand-card" key={index}>
              <div className="brand-image-wrapper">
                <img
                  src={brand.imageUrl}
                  alt={brand.title}
                  className="brand-image"
                />
              </div>

              <h3 className="brand-title">{brand.name}</h3>
              <p className="brand-description">{brand.text}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

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
                className={`brand-sub-row ${
                  isImageLeft ? "image-left" : "image-right"
                }`}
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

  function eventsSection() {
    const { title, description, events } = home.eventsSection;
    const [idx, setIdx] = useState(0);

    const left = events[(idx - 1 + events.length) % events.length];
    const center = events[idx];
    const right = events[(idx + 1) % events.length];

    return (
      <section className="events-conf-section">
        <div className="events-conf-header">
          <div className="events-conf-title-wrap">
            <span className="line" />
            <h2 className="events-conf-title">{title}</h2>
          </div>

          <p className="events-conf-sub">{description}</p>
        </div>

        <div className="left-card">
          {/* Left */}
          <div className="side-card">
            <img src={`${left.imageUrl}`} className="side-img" />
            <div className="side-border" />
            <div className="side-label">{left.title}</div>
            <button
              className="nav-arrow left"
              onClick={() => setIdx((idx - 1 + events.length) % events.length)}
            >
              ‹
            </button>
          </div>

          {/* Center */}
          <div className="center-card">
            <img src={`${center.imageUrl}`} className="center-img" />
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
            <button
              className="nav-arrow right"
              onClick={() => setIdx((idx + 1) % events.length)}
            >
              ›
            </button>
          </div>
        </div>
      </section>
    );
  }

  function aboutSection() {
    const a = home.aboutSection;

    return (
      <section className="about-section">
        <div className="about-inner">
          <h4 className="abt-title">{a.title}</h4>
          <p className="abt-text">{a.description}</p>
          <button
            className="abt-btn"
            onClick={() => (window.location.href = a.buttonLink)}
          >
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
