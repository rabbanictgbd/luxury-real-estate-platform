import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function MyBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/bookings?userEmail=${encodeURIComponent(
          user.email
        )}`
      );
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={booking.propertyImage}
                  alt={booking.propertyTitle}
                  className="h-48 w-full object-cover"
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">{booking.propertyTitle}</h2>
                <p className="font-semibold">Price: BDT {booking.price}</p>
                <p className="text-gray-600">
                  Booked On: {new Date(booking.bookedAt).toLocaleDateString()}
                </p>

                <div className="card-actions justify-end">
                  <a
                    href={`/properties/${booking.propertyId}`}
                    className="btn btn-sm btn-outline"
                  >
                    View Property
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
