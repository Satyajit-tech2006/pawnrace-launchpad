import React, { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { gsap } from "gsap";
import coachImg from "../assets/sambit-panda.jpg";

const OfferDetails = () => {

  const heroRef = useRef(null);
  const coachRef = useRef(null);
  const cardsRef = useRef([]);
  const curriculumRef = useRef(null);

  const whatsappNumber = "918984021185";
  const message =
    "Hi PawnRace! I want to register for the Advanced Chess Training Session with IM Sambit Panda.";

  const achievements = [
    "National Under-7 Champion (2011)",
    "2nd Runner-up – SOAI International Grandmasters Festival 2024",
    "Best Player Award – Dubai Open International Chess Tournament",
    "4th Place – Torino International Open Chess Tournament, Italy"
  ];

  const topics = [
    "Advanced Strategy & Calculation",
    "Tournament Preparation",
    "Practical Endgame Techniques"
  ];

  useEffect(() => {

    gsap.from(heroRef.current, {
      y: -50,
      opacity: 0,
      duration: 1
    });

    gsap.from(coachRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      delay: 0.5
    });

    gsap.from(cardsRef.current, {
      y: 40,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      delay: 0.7
    });

    gsap.from(curriculumRef.current, {
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 1
    });

  }, []);

  return (

    <div className="bg-black text-white min-h-screen py-16 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HERO */}

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">

          <div ref={heroRef}>

            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 leading-tight mb-6 pt-6">
              Advanced Chess Training Session
              <br />
              with IM Sambit Panda
            </h1>

            <p className="text-gray-400 mb-6 text-lg">
              Train with International Master level strategies and learn advanced
              tournament concepts used by professional chess players.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 px-6 py-4 rounded-xl font-semibold text-lg transition"
            >
              <MessageCircle />
              Reserve Seat on WhatsApp
            </a>

          </div>

          {/* COACH */}

          <div ref={coachRef} className="flex justify-center">

            <div className="bg-zinc-900 p-4 rounded-2xl border border-yellow-500/40 shadow-xl">

              <img
                src={coachImg}
                alt="Coach"
                className="rounded-xl w-80 h-80 object-cover"
              />

              <div className="text-center mt-4">

                <h3 className="text-xl font-bold text-yellow-400">
                  IM Sambit Panda
                </h3>

                <p className="text-gray-400 text-sm">
                  Highest FIDE Rating: 2452
                </p>

                <p className="text-yellow-500 text-sm mt-1">
                  ⭐ 9th International Master (IM) from Odisha
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* DETAILS */}

        <div className="grid md:grid-cols-5 gap-6 mb-16">

          {[
            ["DATE", "14 – 15 March"],
            ["TIME", "6:30 PM – 8:00 PM IST"],
            ["FORMAT", "Live Online"],
            ["INDIA PRICE", "₹999"],
            ["FOREIGN PRICE", "$20"]
          ].map((item, i) => (

            <div
              key={i}
              ref={el => cardsRef.current[i] = el}
              className="bg-zinc-900 p-6 rounded-xl border border-yellow-500/20 text-center"
            >

              <p className="text-yellow-400 text-sm">{item[0]}</p>
              <h3 className="font-semibold text-lg">{item[1]}</h3>

            </div>

          ))}

        </div>


        {/* MAJOR ACHIEVEMENTS */}

        <div className="bg-zinc-900 p-8 rounded-xl border border-yellow-500/30 mb-16">

          <h2 className="text-2xl text-yellow-400 font-bold mb-6">
            Major Achievements
          </h2>

          <ul className="space-y-3 text-gray-300">

            {achievements.map((item, i) => (
              <li key={i}>🏆 {item}</li>
            ))}

          </ul>

        </div>


        {/* WORKSHOP TOPICS */}

        <div
          ref={curriculumRef}
          className="bg-zinc-900 p-8 rounded-xl border border-yellow-500/20 mb-20"
        >

          <h2 className="text-2xl font-bold text-yellow-400 mb-6">
            Workshop Topics
          </h2>

          <ul className="space-y-3 text-gray-300">

            {topics.map((item, i) => (
              <li key={i}>♟ {item}</li>
            ))}

          </ul>

        </div>


        {/* BONUS */}

        <div className="text-center mb-16">

          <p className="text-yellow-400 font-semibold text-lg">
            🎁 Bonus: Free E-Books for all participants
          </p>

        </div>


        {/* LIMITED SEATS */}

        <div className="text-center mb-16">

          <p className="bg-red-600 inline-block px-6 py-3 rounded-lg font-bold text-lg">
            ⚠ Limited Seats Available
          </p>

        </div>


        {/* REGISTER */}

        <div className="bg-yellow-500 text-black p-10 rounded-2xl text-center max-w-3xl mx-auto">

          <h2 className="text-2xl font-bold mb-6">
            How to Register
          </h2>

          <p><b>Account:</b> Pawnrace Academy</p>
          <p><b>Bank:</b> Union Bank</p>
          <p><b>Acc No:</b> 04581100000109</p>
          <p className="mb-6"><b>IFSC:</b> UBIN0804584</p>

          <div className="bg-white/20 rounded-lg p-6 mb-6 text-left max-w-xl mx-auto">

            <h3 className="font-bold mb-3 text-lg">Registration Steps</h3>

            <ol className="list-decimal ml-5 space-y-2">

              <li>Transfer the workshop fee to the bank account above.</li>
              <li>Take a screenshot of the payment confirmation.</li>
              <li>
                Send <b>Name, Age, Chess Level, and Payment Screenshot</b> on WhatsApp.
              </li>

            </ol>

          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg"
          >

            <MessageCircle />
            WhatsApp: +91 8984021185

          </a>

        </div>

      </div>

    </div>

  );
};

export default OfferDetails;