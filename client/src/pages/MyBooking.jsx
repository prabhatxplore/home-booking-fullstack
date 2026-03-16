import { useCallback, useEffect, useState } from "react";
import BookingCard from "../components/BookingCard";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Payment from "../components/Payment";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY)

function MyBooking() {
  const [booking, setBooking] = useState([]);
  const [selectBooking, setSelectBooking] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)

  const fetchBookingHome = useCallback(async () => {
    const res = await fetch(`/api/bookings`, { credentials: "include" });
    const data = await res.json();
    if (data.success) {
      setBooking(data.bookings);
    }
  }, []);

  useEffect(() => {
    fetchBookingHome();
  }, [fetchBookingHome]);

  const handleClosePayment = () => {
    setSelectBooking(null);
    setClientSecret(null);
    // refresh list after a successful payment
    fetchBookingHome();
  };

  return (
    <div className="relative">
      {selectBooking && clientSecret && <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Payment booking={selectBooking}

          clientSecret={clientSecret}
          onClose={handleClosePayment} />
      </Elements>}
      <div className="border-t-[1px] border-t-gray-300 px-3 overflow-y-auto">
        <h1 className=" text-center p-6 rounded-3xl font-medium text-2xl ">
          My Bookings
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-9">
          {booking?.map((home) => (
            <BookingCard key={home._id} booking={home} setClientSecret={setClientSecret} setSelectBooking={setSelectBooking} refresh={() => {
              fetchBookingHome()
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyBooking;
