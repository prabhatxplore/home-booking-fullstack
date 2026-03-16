import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Booking from "../components/Booking";
import AddFav from "../components/AddFav";
import { useAuth } from "../context/AuthContext";
import BookingHost from "../components/Host/BookingHost";
import { toast } from "react-toastify";

const HomeDetails = () => {
  const [home, setHome] = useState({});
  const [loading, setLoading] = useState(false)
  const { homeID } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth()
  useEffect(() => {
    const fetchHome = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/home-details/${homeID}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setLoading(false)
        if (data.success) {
          setHome(data.home);
          if (window.location.hash) {
            const elementId = window.location.hash.substring(1);
            const element = document.getElementById(elementId);
            if (element) {
              setTimeout(() => {
                element.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }
          }
        } else {
          toast.info(data.message);
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error Occured")
      }
    };
    fetchHome();
  }, [homeID, navigate]);



  if (loading) {
    return <div className="text-center">
      Loading...
    </div>
  }
  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20 font-sans text-slate-900">
      {/* 1. Header Section */}
      <header className="max-w-7xl mx-auto px-8 pt-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
              {home?.house_name}
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <span className="flex items-center gap-1.5 underline decoration-slate-300 underline-offset-4">
                <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {home?.location}
              </span>
              <span>•</span>
              <span className="text-slate-500">4.98 (120 reviews)</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-full border border-transparent hover:border-slate-200 transition-all text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0-10.628a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5m0 10.628a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5" /></svg>
              Share
            </button>
            <AddFav _id={home._id} />
          </div>
        </div>
      </header>

      {/* 2. Hero Image Section */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="group relative w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={`${home?.photo}`}
            alt={home?.house_name}
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        </div>
      </section>

      {/* 3. Main Content Grid */}
      <main className="max-w-7xl mx-auto px-8 mt-12  gap-16">

        {/* Left Column: Details (8 Columns) */}
        <div className="col-span-12">
          <div className="flex items-center justify-between pb-8 mb-8 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Hosted by Premium Stays</h2>
              <p className="text-slate-500 mt-1">10 guests • 4 bedrooms • 5 beds • 3 baths</p>
            </div>

          </div>

          <div className="prose prose-slate lg:prose-lg max-w-none mb-12">
            <h3 className="text-xl font-bold mb-4">About this space</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {home?.description}
            </p>
          </div>

          {/* Amenities Summary */}
          <div className="  gap-8 py-8 border-t border-slate-200">
            <div className="flex gap-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M2.25 21h19.5M4.5 21V3.545m0 0L12 2.25l7.5 1.295" /></svg>
              </div>
              <div>
                <p className="font-bold text-slate-900">Self check-in</p>
                <p className="text-sm text-slate-500">Check yourself in with the smartlock.</p>
              </div>
            </div>
            <div className="flex gap-5 ">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
              </div>
              <div>
                <p className="font-bold text-slate-900">Free cancellation</p>
                <p className="text-sm text-slate-500">Full refund for 48 hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Booking Card (4 Columns) */}

        <section id="myBooking" className="">
          <div className="flex justify-center">
            <Booking home={home} />
            {user?.user_type === "host" && <BookingHost />}
          </div>
        </section>

      </main >
    </div >
  );
};

export default HomeDetails;