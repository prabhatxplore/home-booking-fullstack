// components/HeroSlideshow.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeroSlideshow({ homes }) {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!homes?.length) return;

    const interval = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % homes.length);
        setFade(true); // fade in
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [homes]);

  if (!homes?.length) return null;

  const home = homes[current];

  return (
    <div className="relative hidden md:block  h-[480px] w-5xl rounded-[14px] m-auto overflow-hidden">

      {/* Background image */}
      <img
        src={home.photo}
        alt={home.house_name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col justify-end px-10 pb-12"
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
        }}
      >
        <p className="text-white/70 text-sm font-medium tracking-widest uppercase mb-2">
          📍 {home.location}
        </p>
        <h2 className="text-white text-4xl font-bold mb-2 max-w-xl leading-tight">
          {home.house_name}
        </h2>
        <p className="text-white/70 text-sm max-w-lg line-clamp-2 mb-4">
          {home.description}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-white font-bold text-xl">
            ${home.price}
            <span className="text-white/60 text-sm font-normal"> / night</span>
          </span>
          <Link
            to={`/home-details/${home._id}`}
            className="px-5 py-2 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition"
          >
            View Details
          </Link>
          <Link
            to={`/home-details/${home._id}#myBooking`}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-10 flex gap-2">
        {homes.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFade(false); setTimeout(() => { setCurrent(i); setFade(true); }, 400); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}