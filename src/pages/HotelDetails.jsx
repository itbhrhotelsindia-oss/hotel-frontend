import React, { useEffect, useRef, useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import Footer from "../components/Footer.jsx";
import "./HotelDetails.css";
import {
  FaSwimmingPool,
  FaChair,
  FaHome,
  FaUmbrellaBeach,
} from "react-icons/fa";
import BookingSearchBox from "./BookingSearchBox.jsx";

const FALLBACK = {
  heroImages: [
    "/assets/img1.jpg",
    "/assets/img2.jpg",
    "/assets/slider-1.jpg",
    "/assets/slider-2.jpg",
    "/assets/img3.jpg",
  ],
  brandSection: {
    title: "OUR BRANDS",
    blocks: [
      {
        layout: "text-left-image-right",
        text: "Experience the pinnacle of refined Indian luxury...",
        imageUrl: "/assets/slider-1.jpg",
      },
      {
        layout: "image-left-text-right",
        text: "Dynamic, stylish, and connected to India’s urban lifestyle...",
        imageUrl: "/assets/slider-2.jpg",
      },
      {
        layout: "image-left-text-right",
        text: "Dynamic, stylish, and connected to India’s evolving lifestyle...",
        imageUrl: "/assets/slider-3.jpg",
      },
      {
        layout: "text-left-image-right",
        text: "Dynamic, stylish, and connected to India’s evolving lifestyle...",
        imageUrl: "/assets/img2.jpg",
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
    title: "Elegance Crafted With Indian Soul",
    subtitle: "A seamless blend of heritage, culture, and world-class comfort.",
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
    ],
  },
};

export default function HotelDetails() {
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

  const rooms = [
    {
      id: "01",
      title: "Exclusive Deluxe",
      price: "$690 / NIGHT",
      stars: 5,
      bed: "King Bed",
      size: "1500 sqft / Room",
      desc: "We have sixteen Executive Deluxe rooms for only BDT. 5555+ with King size bed.",
      image: "/assets/g1.png",
    },
    {
      id: "02",
      title: "Premier Suite",
      price: "$890 / NIGHT",
      stars: 5,
      bed: "King Bed",
      size: "1500 sqft / Room",
      desc: "Experience premier luxury with spacious interiors & premium amenities.",
      image: "/assets/img1.jpg",
    },
    {
      id: "03",
      title: "Oceanview Suite",
      price: "$690 / NIGHT",
      stars: 5,
      bed: "King Bed",
      size: "1500 sqft / Room",
      desc: "Wake up to breathtaking ocean views and luxurious comfort.",
      image: "/assets/img2.jpg",
    },
    {
      id: "04",
      title: "Deluxe Twine",
      price: "$690 / NIGHT",
      stars: 5,
      bed: "2 King Beds",
      size: "1500 sqft / Room",
      desc: "Perfect for families — two king beds and spacious interiors.",
      image: "/assets/img3.jpg",
    },
  ];

  const features = [
    {
      id: 1,
      title: "Infinity Pool",
      desc: "Lorem ipsum dolor sit amet consectetur. Eget nibh nibh ut.",
      icon: <FaSwimmingPool />,
      highlight: true,
    },
    {
      id: 2,
      title: "Coworking Space",
      desc: "Lorem ipsum dolor sit amet consectetur. Intege.",
      icon: <FaChair />,
      highlight: false,
    },
    {
      id: 3,
      title: "Homy & Cozy Place",
      desc: "Lorem ipsum dolor sit amet consectetur. Diam mattis.",
      icon: <FaHome />,
      highlight: false,
    },
    {
      id: 4,
      title: "Many Food Menus",
      desc: "Lorem ipsum dolor sit amet consectetur. Et augue.",
      icon: <FaUmbrellaBeach />,
      highlight: false,
    },
  ];
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
        const res = await fetch(BASE_URL + "/api/home");
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();

        data.heroImages = data.heroImages.map((imgUrl) => imgUrl);

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
        scrolled={true}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        contactInfo={home.contactSection}
        setShowBooking={setShowBooking}
      />

      {/* {sliderSection()} */}

      {imageSection()}

      {roomSection()}

      {servicesSection()}

      <Footer contactInfo={home.contactSection} />
    </div>
  );

  function imageSection() {
    return (
      <div className="everleaf-wrapper">
        {/* IMAGE GRID */}
        <div className="el-grid">
          <img src="/assets/img1.jpg" alt="Forest" />
          <img src="/assets/img2.jpg" alt="Walk" />
          <img src="/assets/img3.jpg" alt="Cabin" />
          <img src="/assets/g1.png" alt="Room" />
        </div>

        {/* TEXT SECTION */}
        <section className="el-text-section">
          <h2>Where the Forest Inspires Every Step</h2>

          <p>
            We believe that nature holds the key to balance, clarity, and
            inspiration. That's why everything we create is rooted in the calm
            strength of the forest — a place where stillness and beauty grow
            side by side. Our mission is to bring a sense of natural harmony
            into your everyday life through thoughtful design and intentional
            simplicity.
          </p>
        </section>

        {showBooking && <BookingSearchBox />}
      </div>
    );
  }

  function servicesSection() {
    return (
      <section className="rc-container">
        <h4 className="rc-subtitle">ROYAL CULTURE</h4>
        <h2 className="rc-title">
          We take pride in our attention to detail, personalized service, and
          commitment to exceeding your expectations.
        </h2>

        <div className="rc-grid">
          {features.map((item) => (
            <div
              key={item.id}
              className={`rc-card ${item.highlight ? "rc-card-dark" : ""}`}
            >
              <div className="rc-icon">{item.icon}</div>
              <h3 className="rc-card-title">{item.title}</h3>
              <p className="rc-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function roomSection() {
    return (
      <section className="rooms-section">
        <div className="rooms-header">
          <h4 className="rooms-subtitle">ROOMS & SUITES</h4>
          <h2 className="rooms-title">
            Experience Top-Notch Best <br /> On Hospitality At Our Hotels
          </h2>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-image-wrapper">
                <img src={room.image} alt={room.title} className="room-image" />
                <div className="room-price">{room.price}</div>
              </div>

              <div className="room-content">
                <div className="room-id">{room.id}</div>
                <h3 className="room-name">{room.title}</h3>

                <div className="room-stars">{"⭐".repeat(room.stars)}</div>

                <p className="room-desc">{room.desc}</p>

                <div className="room-features">
                  <span>🛏 {room.bed}</span>
                  <span>📐 {room.size}</span>
                </div>

                <button className="room-btn">VIEW DETAILS</button>
              </div>
            </div>
          ))}
        </div>

        <div className="rooms-explore-wrapper">
          <button className="explore-btn">EXPLORE ALL →</button>
        </div>
      </section>
    );
  }

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
}
