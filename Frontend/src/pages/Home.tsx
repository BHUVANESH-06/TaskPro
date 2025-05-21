import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r  text-black flex flex-col">
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold mb-2">TaskPro</h1>
        <p className="text-lg opacity-80">Your smart workspace for tracking tasks, teams, and timelines.</p>
      </header>
      <iframe
        src="https://lottie.host/embed/ba89cb9e-0c8c-46b2-a8a6-7e22a9779da5/MZwawJaNxN.lottie"
        style={{ width: '500px', height: '500px', border: 'none' }}
        allowFullScreen
        className='mx-auto'
        ></iframe>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Manage your projects efficiently like a pro!
        </h2>
        <p className="max-w-xl mb-6 text-gray-700">
          Whether you’re a student team, startup, or enterprise — TaskPro helps you organize tasks, assign team members, and monitor project progress in real-time.
        </p>

        <div className="space-x-4">
          <button
            className="bg-white text-blue-900 px-6 py-2 rounded-xl font-semibold shadow hover:bg-gray-200 cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </button>
          <button
            className="border border-white px-6 py-2 rounded-xl font-semibold hover:bg-white hover:text-blue-900 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
