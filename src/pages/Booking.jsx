import React from "react";
import { useParams } from "react-router-dom";

export default function Booking() {
    const { bookingId } = useParams();

    return (
        <div>
            <h1>Booking Page</h1>
            <p>Booking for hotel ID: {bookingId}</p>

            <form style={{ maxWidth: 500, display: "grid", gap: 12 }}>
                <input placeholder="Guest Name" style={{ padding: 12 }} />
                <input placeholder="Phone Number" style={{ padding: 12 }} />

                <div style={{ display: "flex", gap: 8 }}>
                    <input type="date" style={{ padding: 12 }} />
                    <input type="date" style={{ padding: 12 }} />
                </div>

                <button
                    style={{
                        padding: 12,
                        background: "#1976d2",
                        color: "white",
                        borderRadius: 8,
                        border: "none",
                    }}
                >
                    Confirm Booking
                </button>
            </form>
        </div>
    );
}
