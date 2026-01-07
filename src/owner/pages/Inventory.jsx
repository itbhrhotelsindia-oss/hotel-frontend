import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Inventory = () => {
  const { hotelId } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypeId, setRoomTypeId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD ROOM TYPES ================= */
  useEffect(() => {
    async function loadRoomTypes() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/admin/room-types?hotelId=${hotelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load room types");
        setRoomTypes(await res.json());
      } catch (err) {
        setError(err.message);
      }
    }

    loadRoomTypes();
  }, [hotelId]);

  /* ================= LOAD INVENTORY ================= */
  const loadInventory = async () => {
    if (!roomTypeId || !startDate || !endDate) {
      alert("Select room type and date range");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${BASE_URL}/api/admin/inventory?hotelId=${hotelId}&roomTypeId=${roomTypeId}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to load inventory");

      setInventory(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE SINGLE DATE ================= */
  const updateDate = async (item, changes) => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/inventory/date`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId,
          roomTypeId,
          date: item.date,
          ...changes,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      loadInventory();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= BLOCK / UNBLOCK ================= */
  const toggleStatus = async (item) => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/inventory/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId,
          roomTypeId,
          date: item.date,
          active: !item.active,
        }),
      });

      if (!res.ok) throw new Error("Status update failed");
      loadInventory();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ padding: 24 }}>
      <h2>Inventory</h2>

      <div style={styles.controls}>
        <select
          value={roomTypeId}
          onChange={(e) => setRoomTypeId(e.target.value)}
        >
          <option value="">Select Room Type</option>
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button onClick={loadInventory}>Load</button>
      </div>

      {loading && <p>Loading inventory…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {inventory.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Rooms</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.date}>
                <td>{item.date}</td>

                <td>
                  <input
                    type="number"
                    value={item.totalRooms}
                    onChange={(e) =>
                      updateDate(item, {
                        totalRooms: Number(e.target.value),
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.pricePerNight}
                    onChange={(e) =>
                      updateDate(item, {
                        pricePerNight: Number(e.target.value),
                      })
                    }
                  />
                </td>

                <td>{item.active ? "OPEN" : "BLOCKED"}</td>

                <td>
                  <button onClick={() => toggleStatus(item)}>
                    {item.active ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ✅ NAMED EXPORT (MATCHES RoomTypes) */
export { Inventory };

/* ================= STYLES ================= */
const styles = {
  controls: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
