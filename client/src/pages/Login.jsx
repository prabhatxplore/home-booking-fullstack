import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      alert("User Logged in");
    } else {
      fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            toast.success(`Login successful`)
            navigate("/");
          } else {
            toast.error(data.message)
            setPassword("");
          }
        });
    }
  };
  return (
    <main className="flex justify-center items-center px-4 py-10 sm:py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col gap-6"
      >
        <h1 className="text-center text-2xl sm:text-3xl font-bold">
          Login Page
        </h1>

        <div className="flex flex-col gap-4">
          <input
            required
            minLength="7"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="outline outline-gray-300 w-full bg-white h-11 rounded-3xl px-5 focus:outline-green-500"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
          />

          <input
            type="password"
            required
            name="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="outline outline-gray-300 w-full bg-white h-11 rounded-3xl px-5 focus:outline-green-500"
            placeholder="Password"
          />
        </div>

        <input
          type="submit"
          value="Login"
          className="w-full cursor-pointer font-medium shadow-md bg-green-500 hover:bg-green-600 text-black rounded-3xl h-11 transition duration-300 active:scale-95"
        />
        <Link to="/signup" className="text-center"><span className="text-red-500">New user? </span> <span className=" text-blue-600 hover:underline">


          Create an account
        </span>
        </Link>
      </form>
    </main>
  );
}

export default Login;
