import React, { useState, useEffect, useRef } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./WeddingSection.css";
import Footer from "../components/Footer.jsx";
import EnquiryForm from "./EnquiryForm.jsx";
import { FaRing, FaHeart, FaLandmark } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function WeddingsSection() {
  const location = useLocation();
  const contactInfo = location.state?.contactInfo || {};
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [ourWeddingsData, setWeddingssData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(true);

  useEffect(() => {
    async function loadHWeddings() {
      try {
        const res = await fetch(`${BASE_URL}/api/weddings/`);
        const data = await res.json();
        setWeddingssData(data[0]); // API returns list
      } catch (err) {
        console.error("API error:", err);
      }
      setLoading(false);
    }
    loadHWeddings();
  }, []);

  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 500;
    if (direction === "left") {
      scrollRef.current.scrollLeft -= scrollAmount;
    } else {
      scrollRef.current.scrollLeft += scrollAmount;
    }
  };
  //   {
  //     title: "CITY WEDDING",
  //     image: "/assets/g1.png",
  //     description:
  //       "In the heart of the city, at the height of celebration. From glamorous rooftops in Delhi to chic ballrooms in Ahmedabad, Pune, and Bangalore... the modern couple who dreams big.",
  //   },
  //   {
  //     title: "BEACH",
  //     image: "/assets/g1.png",
  //     description:
  //       "Celebrate love where the sea kisses the sky. Beachside ceremonies, barefoot mandaps, and starlit receptions right on the sand. Say 'I do' with the waves as your witness.",
  //   },
  //   {
  //     title: "HILL",
  //     image: "/assets/g1.png",
  //     description:
  //       "In the scenic heights of Mussoorie, Dehradun, Rishikesh. Misty mornings, pine air, and panoramic views set the stage for your elevated affair.",
  //   },
  //   {
  //     title: "HILL",
  //     image: "/assets/g3.png",
  //     description:
  //       "In the scenic heights of Mussoorie, Dehradun, Rishikesh. Misty mornings, pine air, and panoramic views set the stage for your elevated affair.",
  //   },
  //   {
  //     title: "HILLasdasdasd",
  //     image: "/assets/g4.png",
  //     description:
  //       "In the scenic heights of Mussoorie, Dehradun, Rishikesh. Misty mornings, pine air, and panoramic views set the stage for your elevated affair.",
  //   },
  // ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = middleIndex * cardWidth;
    }
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    startAutoScroll();

    return () => stopAutoScroll();
  }, []);

  const cardWidth = 450; // adjust to your card width + gap

  const startAutoScroll = () => {
    stopAutoScroll();

    autoScrollRef.current = setInterval(() => {
      if (!scrollRef.current) return;

      scrollRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }, 2500);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) return;

    const maxScroll = (extendedData.length - data.length) * cardWidth;

    // If scroll moved too far right → reset to middle
    if (container.scrollLeft >= maxScroll) {
      container.scrollLeft = middleIndex * cardWidth;
    }

    // If scroll moved too far left → reset to middle
    if (container.scrollLeft <= 0) {
      container.scrollLeft = middleIndex * cardWidth;
    }
  };

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading || !ourWeddingsData) {
    return (
      <main className="offers-page">
        <HeaderBar
          scrolled={true}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          bgColor="#e8e8e8"
          contactInfo={contactInfo}
          setShowBooking={setShowBooking}
        />
        <div style={{ height: "180px" }} />
        <h2 style={{ textAlign: "center" }}>Loading Destinations...</h2>
      </main>
    );
  }

  const {
    id,
    title,
    description,
    videoUrl,
    bannerLines,
    stats,
    festivities,
    typeOfWeddings,
    highlights,
  } = ourWeddingsData;

  const extendedData = [
    ...typeOfWeddings.weddingList,
    ...typeOfWeddings.weddingList,
    ...typeOfWeddings.weddingList,
  ];
  const middleIndex = typeOfWeddings.weddingList.length;

  return (
    <main className="offers-page">
      <HeaderBar
        scrolled={true}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        bgColor="#e8e8e8"
        contactInfo={contactInfo}
        setShowBooking={setShowBooking}
      />

      <div style={{ height: "140px" }}></div>
      <h1 className="section-heading">
        <span
          className="line"
          style={{
            display: "inline-block",
            width: "100px",
            height: "3px",
            backgroundColor: "#cfa349",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        />
        {title}
        <span
          className="line"
          style={{
            display: "inline-block",
            width: "100px",
            height: "3px",
            backgroundColor: "#cfa349",
            marginLeft: "10px",
            marginBottom: "10px",
          }}
        />
      </h1>

      {videoSection()}
      {detailSection()}
      {scrolledImage()}
      {weddingFestivities()}
      <EnquiryForm />

      {/* {bottomSection()} */}

      <Footer contactInfo={contactInfo} />
    </main>
  );

  function scrolledImage() {
    return (
      <div className="wedding-slider-wrapper">
        <h2 className="ws-title">
          {/* A PRIDE DESTINATION <span>FOR EVERY LOVE STORY</span> */}
          {typeOfWeddings.title}
        </h2>

        <p className="ws-subtext">{typeOfWeddings.description}</p>

        <div className="ws-container">
          {/* Cards wrapper with auto-scroll + pause on hover */}
          <div
            className="ws-cards"
            style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
            ref={scrollRef}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
          >
            {extendedData.map((item, i) => (
              <div className="ws-card" key={i}>
                <img src={item.imageUrl} alt={item.title} className="ws-img" />
                <h3 className="ws-card-title">{item.title}</h3>
                <p className="ws-desc">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function videoSection() {
    return (
      <section className="video-section">
        <video
          width="100%"
          height="auto"
          autoPlay
          muted
          loop
          playsInline
          controls
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>
    );
  }

  function detailSection() {
    return (
      <section className="stats-banner">
        <div className="stats-banner-inner">
          <div className="stat-item">
            <h2>{stats[0].value}</h2>
            <p>{stats[0].label}</p>
          </div>

          <div className="stat-item">
            <h2>{stats[1].value}</h2>
            <p>{stats[1].label}</p>
          </div>

          <div className="stat-item">
            <h2>{stats[2].value}</h2>
            <p>{stats[2].label}</p>
          </div>
        </div>
      </section>
    );
  }

  function weddingFestivities() {
    return (
      <section className="wedding-section">
        <h2 className="wedding-title">{festivities.title}</h2>

        <p className="wedding-subtitle">{festivities.description}</p>

        <div className="wedding-list">
          {festivities.festivitiesList.map((item, i) => (
            <div
              key={i}
              className={`wedding-row ${
                item.layout === "image-left" ? "reverse" : ""
              }`}
            >
              {/* TEXT */}
              <div className="wedding-text">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>

              {/* IMAGE */}
              <div className="wedding-image">
                <img src={item.imageUrl} alt={item.title} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function bottomSection() {
    return (
      <div className="wedding-strip-container">
        <div className="wedding-strip-box">
          <FaRing className="wedding-icon" />
          {/* <span>🏩 India’s Large Weddings</span> */}
          <span>India’s Large Weddings</span>
        </div>

        <div className="wedding-strip-box">
          <FaHeart className="wedding-icon" />
          {/* <span>🥂 Intimate Gatherings</span> */}
          <span>Intimate Gatherings</span>
        </div>

        <div className="wedding-strip-box">
          <FaLandmark className="wedding-icon" />
          {/* <span>⛩️ Lavish Lawns</span> */}
          <span>Lavish Lawns</span>
        </div>
      </div>
    );
  }
}
