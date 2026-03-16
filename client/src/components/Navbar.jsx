import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    console.log("Logout", data);
    if (data.success) {
      setUser(null);
      navigate("/login");
    }
  };
  const navClass = ({ isActive }) =>
    `${isActive ? "bg-blue-600 text-white" : ""} transition ease-in-out  duration-150 rounded-[8px] p-1 px-3 font-medium`
  return (
    <nav className="w-full h-16 flex justify-between  text-center items-center gap-4 px-4">
      <div className="flex-1">
        <span className="font-bold text-2xl text-[#FF385C]">Airbnb</span>
      </div>
      <div className="flex-3 flex justify-center">
        {user && user.user_type === "host" ? (
          <>
            <NavLink
              className={navClass}
              to="/dashboard"
            >
              Dashboard
            </NavLink>
            <NavLink
              className={navClass}
              to="/host-homes"
            >
              Host Home
            </NavLink>
            <NavLink
              to="/add-home"
              className={navClass}
            >
              Add Home
            </NavLink>
          </>
        ) : null}
        <NavLink
          className={navClass}
          to="/"
        >
          Home
        </NavLink>

        {user ? (
          <>
            {user?.user_type === "guest" ? <><NavLink
              className={navClass}
              to="/my-bookings"
            >
              Booking
            </NavLink>
              <NavLink
                className={navClass}
                to="/fav-home"
              >
                Favourite
              </NavLink></> : null}


          </>
        ) : null}
      </div>
      <div className="flex-1 h-16 flex items-center">
        {!user ? (
          <>
            <NavLink
              to="/login"
              className=" w-full cursor-pointer  transition duration-150 rounded-[8px] p-1 px-3 font-medium"
            >
              Login
            </NavLink>

            <NavLink
              to="/signup"
              className="w-full cursor-pointer  transition duration-150 rounded-[8px] p-1 px-3 font-medium"
            >
              Sign up
            </NavLink>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-[#FF385C] w-full cursor-pointer  transition duration-150 rounded-4xl p-3 font-medium"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
