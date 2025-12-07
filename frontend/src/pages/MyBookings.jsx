// src/pages/MyBookings.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const { serverApi, user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      Swal.fire("Login required", "You must login to view your bookings", "info");
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${serverApi}/api/bookings/user/${user.email}`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, serverApi, navigate]);

  const handleCancel = async (bookingId) => {
    const confirm = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${serverApi}/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel booking");

      Swal.fire("Cancelled!", "Booking has been cancelled", "success");
      setBookings(bookings.filter((b) => b._id !== bookingId));
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!bookings.length)
    return <p className="text-center mt-10">No bookings found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-base-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{booking.propertyTitle}</h2>
              <p className="text-gray-600">
                Date: {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Price: ${booking.propertyPrice}</p>
            </div>
            <button
              onClick={() => handleCancel(booking._id)}
              className="btn btn-error text-white"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
