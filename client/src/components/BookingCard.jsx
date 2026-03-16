import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BookingCard = ({ booking, setSelectBooking, setClientSecret, refresh }) => {
  const [date, setDate] = useState(null);
  const [isPay, setIsPay] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDate(new Date(booking.createdAt));
  }, []);

  const statusTheme = {
    pending:   { card: "border-yellow-200 bg-yellow-50",  badge: "bg-yellow-400 text-yellow-900",  dot: "bg-yellow-400" },
    paid:      { card: "border-blue-200 bg-blue-50",      badge: "bg-blue-600 text-white",          dot: "bg-blue-500"   },
    confirmed: { card: "border-green-200 bg-green-50",    badge: "bg-green-600 text-white",         dot: "bg-green-500"  },
    cancelled: { card: "border-red-200 bg-red-50",        badge: "bg-red-500 text-white",           dot: "bg-red-400"    },
  };

  const current = statusTheme[booking.status] || {
    card: "border-gray-200 bg-gray-50",
    badge: "bg-gray-500 text-white",
    dot: "bg-gray-400",
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    if (confirm("Are sure want to cancel") && booking.status !== "cancelled") {
      try {
        const res = await fetch(`/api/bookings/${booking._id}/cancel-booking`, {
          method: "PATCH",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message);
          refresh();
        } else {
          setError(data.message);
          toast.error(data.message);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed");
      }
    }
  };

  const handlePay = async (e) => {
    setIsPay(true);
    e.preventDefault();
    const data = await fetch(`/api/payment/create-payment-intent`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: booking._id }),
    });
    const response = await data.json();
    if (response.success) {
      toast.info(response.message);
      setSelectBooking(booking);
      setClientSecret(response.clientSecret);
      refresh();
    } else {
      setIsPay(false);
      toast.info(response.message);
      setSelectBooking(null);
      setClientSecret(null);
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto rounded-2xl border ${current.card} shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden`}>
      
      <div className="flex flex-col sm:flex-row">
        
        {/* Image */}
        <div className="relative sm:w-56 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
          <img
            src={booking.home?.photo}
            alt={booking.home?.house_name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          {/* Status badge over image */}
          <span className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${current.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current opacity-80`} />
            {booking.status?.toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5 gap-4">
          
          {/* Top — name, location, description, date */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-800 truncate">{booking.home?.house_name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">📍 {booking.home?.location}</p>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{booking.home?.description}</p>
            </div>
            {/* Booked date */}
            {date && (
              <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                {date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          {/* Bottom — check in/out + buttons */}
          <div className="flex flex-wrap items-end justify-between gap-3">

            {/* Check in / out */}
            <div className="flex gap-6">
              <div className="text-sm">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Check In</p>
                <p className="text-gray-700 font-semibold">{new Date(booking.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
              <div className="w-px bg-gray-200 self-stretch" />
              <div className="text-sm">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Check Out</p>
                <p className="text-gray-700 font-semibold">{new Date(booking.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>

            {/* Action buttons — only for pending */}
            {booking.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={handlePay}
                  disabled={isPay}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
                >
                  Pay Now
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isPay}
                  className="px-4 py-2 bg-white hover:bg-red-50 border border-red-300 text-red-500 text-sm font-semibold rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;