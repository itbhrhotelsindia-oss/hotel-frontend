import React from "react";
import { useParams } from "react-router-dom";
import "./DiningDetails.css";

export default function DiningDetails() {
  const { restaurantId } = useParams();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Static mapping — replace with API later
  const diningData = {
    "cafe-treat": {
      title: "Culinary Finesse At Cafe Treat",
      images: [
        "/uploads/dining/cafe-treat/img1.jpg",
        "/uploads/dining/cafe-treat/img2.jpg",
      ],
      description: `
        Indulge in the varieties of global cuisines, complemented by traditional Indian hospitality.
        Choose from a wide range of buffet and A-la-carte options with a trendy interactive kitchen.
        Visit today!
      `,
      timings: "6:30 AM – 11:00 PM",
      alcohol: "Yes",
      breakfast: "06:30 AM – 10:30 AM",
      lunch: "12:00 PM – 03:00 PM",
      dinner: "07:00 PM – 11:00 PM",
    },

    "cafe-bhr": {
      title: "Culinary Finesse At Cafe BHR",
      images: ["/assets/dining2-1.jpg", "/assets/dining2-2.jpg"],
      description: `
        Enjoy global cuisines with a modern ambience at Café BHR. 
        With buffet and A-la-carte choices, Café BHR offers the perfect dining experience.
      `,
      timings: "6:30 AM – 11:00 PM",
      alcohol: "Yes",
      breakfast: "06:30 AM – 10:30 AM",
      lunch: "12:00 PM – 03:00 PM",
      dinner: "07:00 PM – 11:00 PM",
    },
  };

  const item = diningData[restaurantId];

  if (!item) return <h2 style={{ textAlign: "center" }}>Page Not Found</h2>;

  return (
    <main className="dining-details-container">
      {/* Title */}
      <h1 className="dining-details-title">{item.title}</h1>

      {/* Two-Image Layout */}
      <div className="dining-details-images">
        {item.images.map((img, i) => (
          <img key={i} src={img} alt="" />
        ))}
      </div>

      {/* Description */}
      <p className="dining-details-description">{item.description}</p>

      {/* Info Section */}
      <div className="dining-info-section">
        <p>
          <strong>Timings:</strong> {item.timings}
        </p>
        <p>
          <strong>Alcohol Served:</strong> {item.alcohol}
        </p>

        <p>
          <strong>Breakfast Buffet:</strong> {item.breakfast}
        </p>
        <p>
          <strong>Lunch Buffet:</strong> {item.lunch}
        </p>
        <p>
          <strong>Dinner Buffet:</strong> {item.dinner}
        </p>

        <small>*We are operating as per the GOI laws</small>
      </div>
    </main>
  );
}
