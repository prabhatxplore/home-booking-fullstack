
import { useNavigate } from "react-router-dom";
import AddFav from "./AddFav";

function Card({ home, children }) {
  const navigate = useNavigate()
  return (
    <div className="w-full max-w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 group">
      {/* */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={`${home.photo}`}
          alt="Property"
        />

        {/* Favorite Heart Over Image */}
        <div className="absolute top-2 right-2">
          <AddFav _id={home._id} />
        </div>
      </div>

      {/* */}
      <div className="p-4 flex flex-col gap-3 flex-grow">
        {/* */}
        <div className="flex flex-col gap-0.5 cursor-pointer">
          <div className="flex justify-between items-center">
            <h3 onClick={() => {
              navigate(`/home-details/${home._id}`)
            }} className="font-bold text-gray-900 text-lg truncate hover:text-blue-400 transition duration-200">
              {home.house_name}
            </h3>
            <span className="text-[#FF385C] font-bold text-lg">
              ${home.price}
            </span>
          </div>

          {/* Location Row */}
          <div className="flex items-center gap-1 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827 0-4.401-3.506-8-8-8s-8 3.599-8 8c0 3.847 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium truncate">{home.location}</p>
          </div>
        </div>

        {/* */}
        <div className="flex gap-2 mt-2">{children}</div>
        
      </div>
    </div>
  );
}

export default Card;
