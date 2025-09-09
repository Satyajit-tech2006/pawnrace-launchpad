import React from "react";
import { motion } from "framer-motion";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
  viewport: { once: true, amount: 0.2 },
});

const glass =
  "bg-white/5 border border-yellow-400/30 backdrop-blur-lg shadow-[0_8px_40px_rgb(2,6,23,0.6)] rounded-3xl";

const Contacts = () => {
  return (
    <div className="min-h-screen w-full relative bg-[#0E1A3C] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full blur-3xl opacity-30 bg-yellow-400/30" />
        <div className="absolute -bottom-44 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-yellow-300/25" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full blur-3xl opacity-15 bg-yellow-200/20" />
      </div>

      {/* Heading */}
      <section className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 pt-28">
        <motion.h2
          {...fadeInUp(0)}
          className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent"
        >
          📞 Contact Us
        </motion.h2>
        <motion.p
          {...fadeInUp(0.2)}
          className="mt-6 text-lg md:text-xl text-gray-300 text-center max-w-2xl mx-auto leading-relaxed"
        >
          We'd love to hear from you! Whether you have a question, need support,
          or want to join{" "}
          <span className="text-yellow-400 font-semibold">PawnRace</span>, feel
          free to reach out.
        </motion.p>
      </section>

      {/* Contact Info Section */}
      <section className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 mt-14">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Email */}
          <motion.div {...fadeInUp(0.2)} className={`p-6 ${glass}`}>
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">
              📧 Email
            </h3>
            <a
              href="mailto:academy@pawnrace.com"
              className="text-yellow-400 hover:underline"
            >
              academy@pawnrace.com
            </a>
          </motion.div>

          {/* WhatsApp */}
          <motion.div {...fadeInUp(0.3)} className={`p-6 ${glass}`}>
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">
              💬 WhatsApp
            </h3>
            <a
              href="https://wa.me/918984021185"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline"
            >
              Chat with Us
            </a>
          </motion.div>

          {/* Location */}
          <motion.div {...fadeInUp(0.4)} className={`p-6 ${glass}`}>
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">
              📍 Location
            </h3>
            <p className="text-gray-300">Puri, Odisha, India</p>
          </motion.div>
        </div>
      </section>

      {/* Query Button Section */}
      <section className="relative max-w-3xl mx-auto mt-20 mb-16 px-6 sm:px-8 lg:px-10 text-center">
        <motion.div {...fadeInUp(0.5)} className={`p-10 ${glass}`}>
          <h3 className="text-2xl font-semibold text-yellow-300 mb-6">
            📝 Have a Query?
          </h3>
          <p className="text-gray-300 mb-8">
            Click below to fill out our quick form and we’ll get back to you as
            soon as possible.
          </p>
          <button
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSdet9DNAj6yMB0Qjv-2WnFpxLT_EyA-bEb9H8EvpSnoF5SRHQ/viewform",
                "_blank"
              )
            }
            className="px-8 py-3 text-lg font-semibold rounded-lg bg-yellow-400 text-black shadow-lg hover:bg-yellow-500 hover:scale-105 transform transition duration-300"
          >
            🚀 Send Us Your Query
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Contacts;
