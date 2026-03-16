// Unauthorized.jsx
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
    const navigate = useNavigate();
    const { user } = useAuth()
    return (
        <div className="w-full flex items-center justify-center min-h-[600px]">
            <div className="flex flex-col items-center gap-4">
                {/* Label */}
                <div className="text-xs uppercase tracking-[0.3em] text-gray-400 font-light">
                    Unauthorized
                </div>

                {/* Button */}
                <button onClick={() => {
                    if (user.user_type === "guest") {
                        return navigate("/")
                    }
                    if (user.user_type === "host") {
                        return navigate("/dashboard")
                    }
                }} className="text-sm px-5 py-1.5 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-sm">
                    Home
                </button>
            </div>
        </div>
    );
}