import React from "react";
import { ArrowRight } from "lucide-react";

import sambitImg from "../assets/sambit-panda.jpg";
import nilsuImg from "../assets/nilsu-pattnaik.jpg";

export default function App() {
  return <Hero />;
}

function bookDemo() {
  window.open(
    "https://docs.google.com/forms/d/e/1FAIpQLSd368-GnfJjgbQdIeAiU6ro68983N8OPo6upy5n0kDI9YClkA/viewform?usp=dialog",
    "_blank",
  );
}

function Hero() {
  const coaches = [
    {
      name: "Sambit Panda",
      title: "International Master",
      rating: "Highest FIDE Rating: 2452",
      desc: "9th International Master from Odisha. National champion and strong international tournament performer.",
      img: sambitImg,
    },
    {
      name: "Nilsu Pattnaik",
      title: "Commonwealth Medalist",
      rating: "FIDE Rated 2200+",
      desc: "Elite chess coach helping students master strategy, calculation and endgame skills.",
      img: nilsuImg,
    },
  ];

  return (
    <>
      <style>{`

      @keyframes float-animation {
        0%,100%{transform:translateY(0)}
        50%{transform:translateY(-20px)}
      }

      .float-animation{
        animation:float-animation 6s ease-in-out infinite;
      }

      .fade-in-up{
        animation:fade-in-up 1s ease-out forwards;
        opacity:0;
        transform:translateY(20px);
      }

      @keyframes fade-in-up{
        from{opacity:0; transform:translateY(20px)}
        to{opacity:1; transform:translateY(0)}
      }

      `}</style>

      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white overflow-hidden py-16">
        {/* floating chess pieces */}

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-amber-200 opacity-10 float-animation text-6xl">
            ♛
          </div>

          <div
            className="absolute top-40 right-20 text-amber-200 opacity-10 float-animation text-4xl"
            style={{ animationDelay: "1s" }}
          >
            ♞
          </div>

          <div
            className="absolute bottom-40 left-20 text-amber-200 opacity-10 float-animation text-5xl"
            style={{ animationDelay: "2s" }}
          >
            ♜
          </div>

          <div
            className="absolute bottom-20 right-10 text-amber-200 opacity-10 float-animation text-3xl"
            style={{ animationDelay: "0.5s" }}
          >
            ♟
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* TOP TEXT SECTION */}

          <div className="text-center max-w-4xl mx-auto fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 pt-11">
              Train with FIDE-rated Masters & World-Class Mentors –
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                AI-analyzed GM syllabus
              </span>
            </h1>

            <p className="text-xl text-amber-100/80 mb-8">
              Join elite chess training programs guided by international players
              and masters.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-amber-300 font-medium mb-10">
              <span>✓ 1-on-1 Live Training</span>

              <span>✓ Personalized Learning</span>

              <span>✓ Real-time Game Analysis</span>
            </div>

            <button
              onClick={bookDemo}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-400 transition-all shadow-lg transform hover:scale-105"
            >
              Book Free Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            {/* stats */}

            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-amber-400/20">
              <div>
                <div className="text-3xl font-bold text-amber-400">50+</div>

                <div className="text-sm text-amber-200/70">FIDE Coaches</div>
              </div>

              <div>
                <div className="text-3xl font-bold text-amber-400">100+</div>

                <div className="text-sm text-amber-200/70">Students</div>
              </div>

              <div>
                <div className="text-3xl font-bold text-amber-400">98%</div>

                <div className="text-sm text-amber-200/70">Success Rate</div>
              </div>
            </div>
          </div>

          {/* COACHES ROW */}

          <div className="grid md:grid-cols-2 gap-12 mt-16 max-w-5xl mx-auto">
            {coaches.map((coach, index) => (
              <div key={index}>
                {/* image */}

                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400/30">
                  <img
                    src={coach.img}
                    alt={coach.name}
                    className="w-full object-cover aspect-[4/5]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* card */}

                <div className="mt-6 bg-blue-950/80 backdrop-blur-md border border-amber-400/30 rounded-xl p-6 shadow-xl text-center hover:scale-105 transition-all duration-300">
                  <h3 className="text-amber-400 text-xs uppercase font-bold mb-1">
                    ♟️ Learn Chess With
                  </h3>

                  <h2 className="text-3xl font-extrabold mb-2">{coach.name}</h2>

                  <p className="text-amber-300 font-semibold mb-3">
                    {coach.title}
                  </p>

                  <div className="flex justify-center items-center text-sm text-amber-100 mb-4 bg-black/30 py-2 px-4 rounded-lg">
                    🏅 {coach.rating}
                  </div>

                  <p className="text-sm text-gray-300 mb-5">{coach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
