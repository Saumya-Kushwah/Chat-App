import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white">
      {/* Hero Section */}
      <header className="text-center py-20 px-6">
        <h1 className="text-6xl font-extrabold tracking-tight drop-shadow-lg">
          Welcome to <span className="text-pink-300">ChatVerse</span>
        </h1>
        <p className="text-lg font-medium max-w-3xl mx-auto mt-4 leading-relaxed">
          ChatVerse is your all-in-one communication platform. Connect, chat, and video call with ease. Join now and experience the future of communication!
        </p>
        <div className="mt-10 flex justify-center gap-6">
          <button
            className="px-8 py-3 text-lg font-semibold bg-white text-gray-900 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="px-8 py-3 text-lg font-semibold bg-pink-500 rounded-lg shadow-lg hover:bg-pink-400 transition duration-300"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </div>
      </header>

      {/* About Section */}
      <section className="py-20 bg-white text-gray-900 rounded-t-3xl shadow-2xl">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl font-extrabold mb-8">About This Application</h2>
          <p className="text-lg font-medium leading-relaxed">
            Discover a world of seamless communication with ChatVerse. Whether you're sending instant messages, making secure video calls, or simply staying connected, ChatVerse offers the best tools to enhance your communication.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            {/* Feature Cards */}
            <div className="bg-gradient-to-br from-indigo-200 to-purple-300 rounded-lg p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                <i className="fas fa-comments text-2xl mr-2"></i> Real-Time Messaging
              </h3>
              <p className="text-gray-700">
                Enjoy fast and responsive messaging with zero delays, ensuring smooth communication.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-200 to-purple-300 rounded-lg p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-pink-800 mb-2">
                <i className="fas fa-video text-2xl mr-2"></i> Secure Video Calls
              </h3>
              <p className="text-gray-700">
                Experience high-quality video calls with top-notch encryption for your privacy.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-200 to-indigo-300 rounded-lg p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                <i className="fas fa-smile text-2xl mr-2"></i> Intuitive Interface
              </h3>
              <p className="text-gray-700">
                Navigate effortlessly through our sleek and user-friendly design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg font-medium">
            Made with ❤️ by the ChatVerse Team.
          </p>
          <div className="flex justify-center gap-8 mt-4 text-sm">
            <a
              href="#"
              className="hover:text-white transition"
              title="Visit GitHub"
            >
              GitHub
            </a>
            <a
              href="#"
              className="hover:text-white transition"
              title="Contact Us"
            >
              Contact Us
            </a>
            <a
              href="#"
              className="hover:text-white transition"
              title="Privacy Policy"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
