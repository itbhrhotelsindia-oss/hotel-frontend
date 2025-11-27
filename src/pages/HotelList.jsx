import React, { useState, useEffect } from "react";
import HotelCard from "../components/HotelCard";
import { fetchHotels } from "../utils/api";

export default function HotelList() {
    console.log('HotelList component rendering...');
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    console.log('Current state:', { loading, error, hotels });

    useEffect(() => {
        const getHotels = async () => {
            try {
                console.log('Fetching hotels from API...');
                const data = await fetchHotels();
                console.log('API Response:', data);
                setHotels(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch hotels:", err);
                console.error("Error details:", err.response?.data || err.message);
                setError("Failed to load hotels. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        getHotels();
    }, []);

    if (loading) {
        return (
            <div className="container">
                <h1>Hotels</h1>
                <p>Loading hotels...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <h1>Hotels</h1>
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Hotels</h1>
            
            {hotels.length === 0 ? (
                <p>No hotels found.</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {hotels.map((h) => (
                        <HotelCard key={h.id} hotel={h} />
                    ))}
                </div>
            )}
        </div>
    );
}
