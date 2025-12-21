import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import "./BlogSection.css";
import { useNavigate } from "react-router-dom";

export default function BlogSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [showBooking, setShowBooking] = useState(true);
  const contactInfo = location.state?.contactInfo || {};
  const navigate = useNavigate();

  const blog = {
    title:
      "What are 5 amazing castor oil benefits for health, beauty, and wellness?",
    intro:
      "Castor oil, treasured for centuries, is a natural powerhouse for health, beauty, and wellness...",
    sections: [
      {
        heading: "Deeply Moisturizes Dry Skin",
        text: "Castor oil penetrates deeply into the skin, locking in moisture...",
      },
      {
        heading: "Promotes Healthy Hair Growth",
        text: "Its fatty acids nourish the scalp and stimulate hair follicles...",
      },
      {
        heading: "Strengthens Nails and Cuticles",
        text: "Castor oil strengthens brittle nails and softens cuticles...",
      },
    ],
  };

  const popularPosts = [
    {
      title: "How to Create a Weekly Castor Oil Spa Night",
      image: "/assets/g1.png",
      date: "25 August, 2025",
      author: "JOHN WRIGHT",
      link: "#",
    },
    {
      title: "Top 10 Wellness Rituals You Must Try",
      image: "/assets/g2.png",
      date: "15 August, 2025",
      author: "SARAH JONES",
      link: "#",
    },
  ];

  const destinations = [
    {
      id: "1",
      title: "Cultural Heritage",
      subtitle: "10+ Locations",
      image: "/assets/g1.png",
    },
    {
      id: "2",
      title: "Exotic Safari",
      subtitle: "07+ Safaris",
      image: "/assets/g2.png",
    },
    {
      id: "3",
      title: "Adventure Tours",
      subtitle: "40% Discount",
      promo: false,
      image: "/assets/g3.png",
    },
    {
      id: "4",
      title: "Alpine Adventures",
      subtitle: "15+ Locations",
      image: "/assets/g4.png",
    },
    {
      id: "5",
      title: "Island Getaway",
      subtitle: "12+ Locations",
      image: "/assets/img3.jpg",
    },
  ];

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* Spacer so content does not hide behind sticky header */}
      <div style={{ height: "140px" }}></div>

      <h1 className="section-heading">
        {" "}
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
        From Our Blog
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
      </h1>

      {/* {blog1()} */}

      <section className="locals-section">
        {/* LEFT ROUND IMAGE */}
        <div className="locals-img-left">
          <img src="/assets/slider-2.jpg" alt="Local Experts" />
        </div>

        {/* CENTER TEXT CONTENT */}
        <div className="locals-content">
          <h2>
            We’re locals you can trust! We live here year-round and know each
            property owner and local business personally. We offer concierge
            services and local recommendations that make vacation planning a
            dream.
          </h2>

          <div className="locals-badge">
            <img src="/assets/atom.svg" alt="Badge" className="badge-ico" />
            <div>
              <p>
                The service loved by <strong>Karen</strong> and thousands of
                other guests.
              </p>
              <span className="review-stars">★ Reviews 5.0/5</span>
            </div>
          </div>
        </div>

        {/* RIGHT ROUND IMAGE */}
        <div className="locals-img-right">
          <img src="/assets/img1.jpg" alt="Resort Area" />
        </div>
      </section>

      {/* {multiImageSection()} */}

      {/* {blog2()} */}

      <div className="blog-layout-container">
        {/* LEFT SIDE — MAIN BLOG CONTENT */}
        <div className="blog-main">
          <h1>{blog.title}</h1>
          <p className="blog-intro">{blog.intro}</p>

          <div className="adventure-grid">
            {destinations.map((item, index) => {
              // HIGHLIGHT CARD
              if (item.promo) {
                return (
                  <div key={item.id} className="adv-card promo-card">
                    <div className="promo-content">
                      <span className="promo-discount">{item.subtitle}</span>
                      <h3>{item.title}</h3>
                      <button className="promo-btn">Find Tours</button>
                    </div>
                  </div>
                );
              }

              // NORMAL IMAGE CARD
              return (
                <div
                  key={item.id}
                  className={`adv-card ${index === 4 || 8 ? "horizontal" : ""}`}
                  onClick={() => navigate(`/blog/${item.slug}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* <img src={BASE_URL + item.image} alt={item.title} /> */}
                  <img src={item.image} alt={item.title} />

                  <div className="adv-info">
                    <h3>{item.title}</h3>
                    <span>{item.subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE — POPULAR POSTS */}
        <div className="blog-sidebar">
          <h2 className="sidebar-title">Popular Post</h2>
          <p className="blog-intro">Popular Post</p>
          {popularPosts.map((post, i) => (
            <div className="sidebar-card" key={i}>
              <img src={post.image} alt={post.title} className="sidebar-img" />

              <p className="sidebar-date">
                {post.date} · BY {post.author}
              </p>

              <h3 className="sidebar-post-title">{post.title}</h3>

              {/* <a href={post.link} className="sidebar-link"> */}
              <a href={`/blog/${post.slug}`} className="sidebar-link">
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>

      <Footer contactInfo={contactInfo} />
    </main>
  );

  function blog2() {
    return (
      <section className="adventure-section">
        {/* HEADER */}
        <div className="adventure-header">
          <div>
            <h2>Unlock Your Next Adventure</h2>
            <p>
              We bring exceptional experiences curated from destinations across
              India. Explore your perfect getaway now.
            </p>
          </div>

          <button className="view-more-btn">View More →</button>
        </div>

        {/* GRID */}
        <div className="adventure-grid">
          {destinations.map((item, index) => {
            // HIGHLIGHT CARD
            if (item.promo) {
              return (
                <div key={item.id} className="adv-card promo-card">
                  <div className="promo-content">
                    <span className="promo-discount">{item.subtitle}</span>
                    <h3>{item.title}</h3>
                    <button className="promo-btn">Find Tours</button>
                  </div>
                </div>
              );
            }

            // NORMAL IMAGE CARD
            return (
              <div
                key={item.id}
                className={`adv-card ${index === 4 || 8 ? "horizontal" : ""}`}
              >
                {/* <img src={BASE_URL + item.image} alt={item.title} /> */}
                <img src={item.image} alt={item.title} />

                <div className="adv-info">
                  <h3>{item.title}</h3>
                  <span>{item.subtitle}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  function multiImageSection() {
    return (
      <section className="adventure-section">
        {/* HEADER */}
        <div className="adventure-header">
          <div>
            <h2>Unlock Your Next Adventure</h2>
            <p>
              We have been operating for over a decade, providing top-notch
              services to our clients and building a strong track record.
            </p>
          </div>

          <button className="view-more-btn">View More →</button>
        </div>

        {/* GRID */}
        <div className="adventure-grid">
          {/* CARD 1 */}
          <div className="adv-card">
            <img src="/assets/img1.jpg" alt="Cultural Heritage" />
            <div className="adv-info">
              <h3>Cultural Heritage</h3>
              <span>10+ Locations</span>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="adv-card">
            <img src="/assets/img2.jpg" alt="Exotic Safari" />
            <div className="adv-info">
              <h3>Exotic Safari</h3>
              <span>07+ Safaris</span>
            </div>
          </div>

          {/* HIGHLIGHT PROMO CARD */}
          <div className="adv-card promo-card">
            <div className="promo-content">
              <span className="promo-discount">40% Discount</span>
              <h3>All Kinds Of Adventure Tours</h3>
              <button className="promo-btn">Find Tours</button>
            </div>
          </div>

          {/* CARD 4 */}
          <div className="adv-card horizontal">
            <img src="/assets/img3.jpg" alt="Alpine Adventures" />
            <div className="adv-info">
              <h3>Alpine Adventures</h3>
              <span>15+ Locations</span>
            </div>
          </div>

          {/* CARD 5 */}
          <div className="adv-card">
            <img src="/assets/g1.png" alt="Island Getaway" />
            <div className="adv-info">
              <h3>Island Getaway</h3>
              <span>12+ Locations</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function blog1() {
    return (
      <div className="blog-section">
        <h2 className="blog-heading">Latest Stories</h2>

        {/* GRID POSTS */}
        <div className="blog-grid">
          {posts.map((post) => (
            <div className="blog-card" key={post.id}>
              <img src={post.image} />
              <h4>{post.title}</h4>
              <button className="blog-btn small">Read More →</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
