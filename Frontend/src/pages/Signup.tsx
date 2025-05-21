import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name,setName] = useState("");
  const {register,loading,error} = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords don't match");

    const user = await register(name, email, password);
    if (user) {
      alert("Registration successful!");
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f6fc]">
      <div className="flex w-[800px] rounded-3xl overflow-hidden shadow-lg bg-white">
        {/* Left Lottie Animation Section */}
        <div className="w-1/2 relative top-6 bg-[#ffffff]">
          <iframe
            src="https://lottie.host/embed/eb9fe18c-d0c5-4c11-bcec-ee46ccad8c1c/BtfI6ip74r.lottie"
            className="w-full h-full"
            title="Lottie Animation"
          />
          <div className="absolute top-6 left-6 text-[#000000] font-bold text-2xl bg-white px-4 py-2 rounded-lg shadow">
            TaskPro
          </div>
        </div>

        <div className="w-1/2 p-10 bg-[#E0E4F2]">
          <h2 className="text-3xl font-bold mb-4 text-center text-[#333]">
            Create an Account
          </h2>
          <p className="text-sm mb-4 text-center text-gray-600">
            Already have an account?{" "}
            <span
              className="text-[#0000ff] font-medium cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A1B2D4] transition-all duration-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Name"
                required
              />
            </div>
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A1B2D4] transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A1B2D4] transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A1B2D4] transition-all duration-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#A1B2D4] text-black py-3 rounded-lg font-semibold hover:bg-[#B7C9E8] transition-transform transform hover:scale-105 duration-300"
            >
              {loading? "Registering...." : "Sign Up"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg bg-white hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-600">
                Sign up with Google
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
