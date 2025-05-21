import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, error, loading} = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login(email,password);
    if(user){
      alert("Login Successful")
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    alert('Google login coming soon...');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF] p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 relative">
        
        <div className="p-10 bg-[#f3f6fc] flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-down">
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
            <button
              type="submit"
              className="w-full bg-[#A1B2D4] text-black py-3 rounded-lg font-semibold hover:bg-[#B7C9E8] transition-transform transform hover:scale-105 duration-300 cursor-pointer"
            >
              Login
            </button>
            {error && <p>{error}</p>}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg bg-white hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300 cursor-pointer"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-600">Login with Google</span>
            </button>
            <p className="text-sm mb-4 text-center text-gray-600">
                Dont have an account?{" "}
                <span
                className="text-[#0000ff] font-medium cursor-pointer"
                onClick={() => navigate("/signup")}
                >
                Signup
                </span>
            </p>
          </form>
        </div>

        <div className="relative bg-white top-5">
          <iframe
            src="https://lottie.host/embed/eb9fe18c-d0c5-4c11-bcec-ee46ccad8c1c/BtfI6ip74r.lottie"
            className="w-full h-full"
            title="Lottie Animation"
          />
          <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-xl shadow-md text-black font-bold text-2xl">
            TaskPro
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
