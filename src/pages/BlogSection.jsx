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
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      try {
        // const res = await fetch(`${BASE_URL}/api/blog`);

        const res = await fetch(`${BASE_URL}/api/blog`);

        if (!res.ok) {
          throw new Error("Blog API failed");
        }

        const data = await res.json();
        setBlogData(data);
      } catch (err) {
        console.error("Blog API error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBlog();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!blogData) return <div>No blog data</div>;

  const {
    title,
    description,
    blogImages,
    blogListSection,
    popularPostListSection,
  } = blogData;

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

      <h1 className="section-heading"> {title}</h1>

      <section className="locals-section">
        {/* LEFT ROUND IMAGE */}
        <div className="locals-img-left">
          <img src={blogImages[0]} alt="Local Experts" />
        </div>

        {/* CENTER TEXT CONTENT */}
        <div className="locals-content">
          <h2>{description}</h2>

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
          <img src={blogImages[1]} alt="Resort Area" />
        </div>
      </section>

      <div className="blog-layout-container">
        {/* LEFT SIDE — MAIN BLOG CONTENT */}
        <div className="blog-main">
          <h1>{blogListSection.title}</h1>
          <p className="blog-intro">{blogListSection.description}</p>

          <div className="adventure-grid">
            {blogListSection.blogsList.map((item, index) => {
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
                  onClick={() =>
                    navigate(`/blog/${item.slug}`, {
                      state: { blog: item },
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <img src={item.imageUrl} alt={item.title} />

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
          <h2 className="sidebar-title">{popularPostListSection.title}</h2>
          <p className="blog-intro">{popularPostListSection.description}</p>

          {popularPostListSection.postsList.map((post, i) => (
            <div
              className="sidebar-card"
              key={i}
              style={{ cursor: "pointer" }}
              // onClick={() =>
              //   navigate(`/blog/${post.id}`, {
              //     state: { blog: post },
              //   })
              // }
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="sidebar-img"
              />

              <p className="sidebar-date">
                {post.date} · BY {post.author}
              </p>

              <h3 className="sidebar-post-title">{post.title}</h3>

              <a
                className="sidebar-link"
                onClick={(e) => {
                  e.preventDefault(); // prevent default anchor behavior
                  navigate(`/blog/${post.slug}`, {
                    state: { blog: post },
                  });
                }}
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>

      <Footer contactInfo={contactInfo} />
    </main>
  );
}
