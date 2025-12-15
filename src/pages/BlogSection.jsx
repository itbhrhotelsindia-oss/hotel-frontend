import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import "./BlogSection.css";

export default function BlogSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [showBooking, setShowBooking] = useState(true);
  const contactInfo = location.state?.contactInfo || {};

  const featured = {
    title: "Dine With Pride – Culinary Art & Global Flavours",
    text: "Experience a luxurious dining journey crafted by our celebrated chefs.",
    image: "/assets/g1.png",
  };
  const posts = [
    {
      id: 1,
      title: "Top 10 Wedding Destinations in India",
      image: "/assets/jim-cor.jpg",
    },
    {
      id: 2,
      title: "A Luxury Staycation – What to Expect",
      image: "/assets/mussorie.jpg",
    },
    {
      id: 3,
      title: "Wellness Retreats – Relax, Recharge, Revive",
      image: "/assets/rishikesh.jpg",
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
        EXCLUSIVE OFFERS
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

      {blog1()}

      {/* {blog2()} */}

      {/* {blog3()} */}

      <Footer contactInfo={contactInfo} />
    </main>
  );

  function blog3() {
    return (
      <section className="minimal-blog-section">
        <h2 className="minimal-heading">Latest Insights</h2>

        {/* FEATURED ARTICLE */}
        <div className="minimal-featured">
          <img src={featured.image} alt={featured.title} />
          <div className="minimal-featured-body">
            <h3>{featured.title}</h3>
            <p>{featured.text}</p>
            <button className="minimal-read-btn">READ MORE →</button>
          </div>
        </div>

        {/* GRID ARTICLES */}
        <div className="minimal-grid">
          {posts.map((post) => (
            <div key={post.id} className="minimal-card">
              <img src={post.image} alt={post.title} />
              <h4>{post.title}</h4>
              <button className="minimal-link">Read More →</button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function blog2() {
    return (
      <section className="luxury-blog-section">
        <h2 className="luxury-blog-heading">Latest Stories</h2>

        {/* FEATURED POST */}
        <div className="luxury-featured">
          <img src={featured.image} alt={featured.title} />
          <div className="luxury-featured-text">
            <h3>{featured.title}</h3>
            <p>{featured.text}</p>
            <button className="luxury-btn">READ MORE →</button>
          </div>
        </div>

        {/* GRID POSTS */}
        <div className="luxury-grid">
          {posts.map((post) => (
            <div key={post.id} className="luxury-card">
              <img src={post.image} alt={post.title} />
              <div className="luxury-card-content">
                <h4>{post.title}</h4>
                <button className="luxury-link">Read More →</button>
              </div>
            </div>
          ))}
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
