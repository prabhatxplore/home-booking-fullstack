import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";

function HostHomes() {
  const [homes, setHomes] = useState([]);
  const navigate = useNavigate();
  const fetchHostHomes = async () => {
    try {
      const res = await fetch("/api/host/host-homes", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setHomes(data.homes);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchHostHomes();
  }, []);

  const handleHomeDelete = async (homeId) => {
    try {
      const res = await fetch(`/api/host/delete-home/${homeId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="border-t-[1px] border-t-gray-300 px-3 overflow-y-auto">
      <h1 className=" text-center p-6 rounded-3xl font-medium text-2xl ">
        Host Homes
      </h1>
      <div className="flex flex-wrap justify-center items-center gap-9">
        {homes?.map((home) => (
          <Card key={home._id} home={home}>
            <Link
              to={`/edit-home/${home._id}`}
              className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-black hover:border-[2px] transition"
            >
              Edit
            </Link>

            <button
              onClick={async () => {
                await handleHomeDelete(home._id);
                fetchHostHomes();
              }}
              className="flex-1 py-2 rounded-xl outline-[2px] outline-red-500 text-red-500 hover:text-white font-semibold text-sm hover:bg-red-500 transition cursor-pointer"
            >
              Delete
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default HostHomes;
