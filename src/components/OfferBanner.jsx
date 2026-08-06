import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import sambitImg from "../assets/sambit-panda.jpg";
console.log(sambitImg)
const OfferBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[80vh] overflow-hidden bg-black">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>

      {/* Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-600/20 blur-[200px] rounded-full"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-red-600/20 blur-[200px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between min-h-[80vh]">

        {/* LEFT CONTENT */}
        <div className="max-w-xl text-center md:text-left">

          <span className="bg-orange-600/20 border border-orange-500 px-4 py-1 rounded-full text-orange-400 text-sm font-bold">
            FLASH SALE • 60% OFF
          </span>

          <h1 className="text-4xl md:text-7xl font-black text-white mt-6 leading-tight">
            Master Chess
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Beginner to Pro
            </span>
          </h1>

          <p className="text-gray-400 text-lg mt-6">
            Train with FIDE-rated coaches. Live classes, structured study
            plans and tournaments.
          </p>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mt-8">

            <div>
              <p className="text-gray-500 line-through text-lg">₹4,999</p>
              <p className="text-4xl font-black text-white">
                ₹1,999 <span className="text-orange-500 text-xl">/-</span>
              </p>
            </div>

            <button
              onClick={() => navigate("/special-offer")}
              className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 px-8 py-4 rounded-xl text-lg font-bold hover:scale-105 transition-all shadow-lg hover:shadow-orange-500/30"
            >
              Claim Offer
              <ArrowRight size={20} />
            </button>

          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="mt-10 md:mt-0 relative">

          <div className="absolute inset-0 bg-orange-500/20 blur-[80px] rounded-full"></div>

          <img src={sambitImg} alt="coach" />
        </div>

      </div>

    </section>
  );
};

export default OfferBanner;