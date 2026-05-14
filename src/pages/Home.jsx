import React, { useEffect, useRef, useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import Footer from "../components/Footer.jsx";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import BookingSearchBox from "./BookingSearchBox.jsx";
import { Helmet } from "react-helmet-async";

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
        value: "+91 7900008944",
        displayValue: "+91 7900008944",
      },
      {
        type: "email",
        value: "info@hotaality.com",
        displayValue: "info@hotaality.com",
      },
    ],
  },
  contactSection: {
    reservationPhone: "+91 7900008944",
    hotelPhone: "+91 7900008944",
    email: "info@hotaality.com",
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

  useEffect(() => {
    const revealItems = document.querySelectorAll(
      ".page-home section, .brand-card, .left-card",
    );

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    revealItems.forEach((item) => item.classList.add("luxury-reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [home]);

  return (
    <>
      <Helmet>
        <title>
          Hotaality Group of Hotels | Best Resorts in Uttarakhand | Destination
          Weddings | Corporate Events | Conferences | Group Bookings
        </title>

        <meta
          name="description"
          content="Hotaality Group of Hotels - A Brand of Hotaality RevTech Private Limited offers luxury resorts and hotels across Uttarakhand and India. Destination weddings, corporate events, conferences, and group bookings."
        />

        <link rel="canonical" href="https://www.bhrhotelsindia.com/" />
      </Helmet>

      <div className="page-home bg-white text-[#2B2B2B] selection:bg-[#F57C00]/20 selection:text-[#062B4F]">
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
    </>
  );

  function sliderSection() {
    return (
      <section className="main-image-slider relative isolate min-h-[720px] overflow-hidden bg-[#062B4F] md:min-h-[760px]">
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

        <button
          className="slider-arrow left !border-white/30 !bg-white/10 !text-white !shadow-[0_18px_44px_rgba(6,43,79,0.32)] backdrop-blur-xl transition hover:!border-[#F57C00]/70 hover:!bg-[#F57C00]/25"
          onClick={prev}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          className="slider-arrow right !border-white/30 !bg-white/10 !text-white !shadow-[0_18px_44px_rgba(6,43,79,0.32)] backdrop-blur-xl transition hover:!border-[#F57C00]/70 hover:!bg-[#F57C00]/25"
          onClick={next}
          aria-label="Next slide"
        >
          ›
        </button>

        {/* SHOW BOOKING BOX ONLY IF NOT IN POPUP MODE */}
        {showBooking && <BookingSearchBox />}

        <div className="slider-dots">
          {home.heroImages.map((_, i) => (
            <div
              key={i}
              className={`dot h-1 rounded-full transition-all ${
                i + 1 === index
                  ? "active !w-10 !bg-[#F57C00]"
                  : "!w-7 !bg-white/50 hover:!bg-white/80"
              }`}
              onClick={() => setIndex(i + 1)}
              role="button"
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>
    );
  }

  function brandBanner() {
    const banner = home.brandBanner;
    return (
      <section className="brand-banner-premium !bg-[radial-gradient(circle_at_50%_-10%,rgba(245,124,0,0.18),transparent_42%),linear-gradient(135deg,rgba(0,119,200,0.96),rgba(6,43,79,0.98))] px-5 py-16 text-white md:py-20">
        <div className="brand-banner-inner mx-auto max-w-6xl">
          <h2 className="brand-banner-title text-balance !text-[clamp(2.25rem,5vw,4.75rem)] !font-medium !tracking-[0.04em]">
            {banner.title}
          </h2>
          <p className="brand-banner-sub mx-auto mt-4 max-w-4xl text-pretty !text-white/80">
            {banner.subtitle}
          </p>

          <div className="brand-banner-contacts mt-9 flex flex-wrap justify-center gap-4">
            <div
              className="bb-contact !border-[#F57C00]/30 !bg-white/10 !text-white shadow-xl shadow-[#062B4F]/20 backdrop-blur-xl transition hover:!-translate-y-1 hover:!border-[#F57C00]/70 hover:!bg-[#F57C00]/15"
              onClick={() =>
                (window.location.href = `tel:${home.contactSection.reservationPhone}`)
              }
            >
              {<FaPhoneAlt />} {home.contactSection.reservationPhone}
            </div>
            <div
              className="bb-contact !border-[#F57C00]/30 !bg-white/10 !text-white shadow-xl shadow-[#062B4F]/20 backdrop-blur-xl transition hover:!-translate-y-1 hover:!border-[#F57C00]/70 hover:!bg-[#F57C00]/15"
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
      <section className="events-conf-section !bg-[#F5F5F5] px-[8%] py-20 md:py-28">
        {/* HEADER ROW */}
        <div className="events-conf-header flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="events-conf-title-wrap flex items-center gap-5">
            <span className="line !bg-[linear-gradient(90deg,#0077C8,#F57C00,transparent)]" />
            <h2 className="events-conf-title text-[#2B2B2B]">{title}</h2>
          </div>

          <p className="events-conf-sub max-w-2xl text-[#686868]">
            {description}
          </p>
        </div>

        <div className="brand-card-wrapper grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {brands.map((brand, index) => (
            <div
              className="brand-card group !rounded-3xl !border !border-[#E4E4E4] !bg-white !p-6 !shadow-[0_24px_70px_rgba(0,95,163,0.12)] transition duration-300 hover:!-translate-y-2 hover:!border-[#0077C8]/35 hover:!shadow-[0_32px_90px_rgba(0,95,163,0.18)]"
              key={index}
            >
              <div className="brand-image-wrapper !rounded-2xl !bg-[linear-gradient(180deg,rgba(0,119,200,0.05),rgba(245,124,0,0.06)),#F5F5F5]">
                <img
                  src={brand.imageUrl}
                  alt={brand.title}
                  className="brand-image transition duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="brand-title mt-5 text-[#062B4F]">
                {brand.name}
              </h3>
              <p className="brand-description text-[#686868]">{brand.text}</p>
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
      <section className="events-conf-section bg-white px-[8%] py-20 md:py-28">
        <div className="events-conf-header flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="events-conf-title-wrap flex items-center gap-5">
            <span className="line !bg-[linear-gradient(90deg,#0077C8,#F57C00,transparent)]" />
            <h2 className="events-conf-title text-[#2B2B2B]">{title}</h2>
          </div>

          <p className="events-conf-sub max-w-2xl text-[#686868]">
            {description}
          </p>
        </div>

        <div className="left-card event-story-carousel grid min-h-[620px] gap-5 rounded-[30px] border border-[#0077C8]/20 bg-[radial-gradient(circle_at_18%_8%,rgba(245,124,0,0.14),transparent_26%),linear-gradient(135deg,rgba(0,95,163,0.96),rgba(6,43,79,0.98))] p-4 shadow-[0_28px_76px_rgba(0,95,163,0.20)] lg:grid-cols-[1.65fr_0.75fr]">
          <article className="event-feature-card group relative min-h-[520px] overflow-hidden rounded-3xl bg-[#062B4F] shadow-2xl shadow-[#062B4F]/25 md:min-h-[584px]">
            <img
              src={`${center.imageUrl}`}
              className="event-feature-img h-full min-h-[520px] w-full object-cover transition duration-700 group-hover:scale-105 md:min-h-[584px]"
              alt={center.title}
            />
            <div className="event-feature-shade absolute inset-0 bg-[linear-gradient(90deg,rgba(6,43,79,0.84),rgba(6,43,79,0.44)_45%,rgba(6,43,79,0.12)),linear-gradient(180deg,rgba(6,43,79,0.08),rgba(6,43,79,0.74))]" />

            <div className="event-feature-content absolute bottom-24 left-6 right-6 z-10 max-w-2xl text-left text-white md:bottom-14 md:left-14 md:right-auto">
              <span className="event-kicker mb-4 inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#FFCF99] before:h-px before:w-11 before:bg-[#F57C00]">
                Featured Experience
              </span>
              <h3 className="text-balance font-serif text-[clamp(2.3rem,5vw,4.75rem)] font-medium leading-none tracking-normal text-white drop-shadow-2xl">
                {center.title}
              </h3>
              <p className="mt-4 max-w-xl text-pretty leading-8 text-white/85">
                {center.description}
              </p>
            </div>

            <div className="event-carousel-controls absolute bottom-6 left-6 z-20 flex gap-3 md:left-auto md:right-7">
              <button
                className="event-control grid size-12 place-items-center rounded-full border border-white/40 bg-white/15 text-3xl text-white shadow-xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#F57C00] hover:bg-[#F57C00]"
                onClick={() =>
                  setIdx((idx - 1 + events.length) % events.length)
                }
                aria-label="Previous event"
              >
                ‹
              </button>
              <button
                className="event-control grid size-12 place-items-center rounded-full border border-white/40 bg-white/15 text-3xl text-white shadow-xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#F57C00] hover:bg-[#F57C00]"
                onClick={() => setIdx((idx + 1) % events.length)}
                aria-label="Next event"
              >
                ›
              </button>
            </div>
          </article>

          <div className="event-preview-stack grid gap-5 md:grid-cols-2 lg:grid-cols-1">
            <button
              className="event-preview-card group relative min-h-56 overflow-hidden rounded-3xl border border-white/15 bg-white/10 text-left text-white shadow-xl transition hover:-translate-y-1 hover:border-[#F57C00]/60"
              onClick={() => setIdx((idx - 1 + events.length) % events.length)}
            >
              <img
                src={`${left.imageUrl}`}
                className="event-preview-img h-full min-h-56 w-full object-cover brightness-75 transition duration-500 group-hover:scale-105"
                alt={left.title}
              />
              <span className="event-preview-label absolute bottom-20 left-6 z-10 text-xs font-extrabold uppercase tracking-[0.16em] text-[#FFCF99]">
                Previous
              </span>
              <strong className="absolute bottom-7 left-6 right-6 z-10 font-serif text-3xl font-medium leading-tight">
                {left.title}
              </strong>
            </button>

            <button
              className="event-preview-card group relative min-h-56 overflow-hidden rounded-3xl border border-white/15 bg-white/10 text-left text-white shadow-xl transition hover:-translate-y-1 hover:border-[#F57C00]/60"
              onClick={() => setIdx((idx + 1) % events.length)}
            >
              <img
                src={right.imageUrl}
                className="event-preview-img h-full min-h-56 w-full object-cover brightness-75 transition duration-500 group-hover:scale-105"
                alt={right.title}
              />
              <span className="event-preview-label absolute bottom-20 left-6 z-10 text-xs font-extrabold uppercase tracking-[0.16em] text-[#FFCF99]">
                Next
              </span>
              <strong className="absolute bottom-7 left-6 right-6 z-10 font-serif text-3xl font-medium leading-tight">
                {right.title}
              </strong>
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
