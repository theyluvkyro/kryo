import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-[#E50914] text-8xl font-black mb-4">404</h1>
      <h2 className="text-white text-3xl font-bold mb-4">Lost your way?</h2>
      <p className="text-gray-400 mb-8 max-w-sm">
        Sorry, we can't find that page. You'll find lots to explore on the home page.
      </p>
      <Link
        to="/"
        className="bg-white text-black font-bold px-8 py-3 rounded-md hover:bg-white/80 transition"
      >
        Kyro Home
      </Link>
    </div>
  );
}
