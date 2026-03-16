import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import HeroSlideshow from "../components/HeroSlideshow";

export default function Home() {
  const { user, setUser } = useAuth();
  const [homes, setHomes] = useState([]);
  const { favourites } = useAuth()
  useEffect(() => {
    fetch("/api/home", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setHomes(data.homes);
        console.log(data);
      })
      .catch((err) => console.log("Error Occured while fetching homes", err));
  }, [favourites]);

  return (
    <>
      <HeroSlideshow homes={homes} />

      <div className="border-t-[1px] border-t-gray-300 px-3 overflow-y-auto">
        <h1 className=" text-center p-6 rounded-3xl font-medium text-2xl ">
          Available Homes
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-9">
          {homes.map((home) => (
            <Card key={home._id} home={home}>
              <Link
                to={`/home-details/${home._id}`}
                className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
              >
                Details
              </Link>
              {user?.user_type === "guest" && <Link to={`/home-details/${home._id}#myBooking`} className="flex-1 py-2 text-center rounded-xl bg-blue-600 cursor-pointer text-white font-semibold text-sm hover:bg-blue-800 transition">
                Book Now
              </Link>}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
