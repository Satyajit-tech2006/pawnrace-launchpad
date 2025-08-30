import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
const Contacts = () => {
  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-8">
          Contact <span className="text-indigo-600">Us</span>
        </h2>

        {/* Contact Info Section */}
        <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
          {/* Email */}
          <div className="p-6 rounded-2xl shadow-md bg-white">
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <a
              href="mailto:pawnraceacademy@gmail.com"
              className="text-indigo-600 hover:underline"
            >
              pawnraceacademy@gmail.com
            </a>
          </div>

          {/* WhatsApp */}
          <div className="p-6 rounded-2xl shadow-md bg-white">
            <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
            <a
              href="https://wa.me/917008489238"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
             WhatsappUS
            </a>
          </div>

          {/* Location */}
          <div className="p-6 rounded-2xl shadow-md bg-white">
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <p>Bhubaneswar, Odisha, India</p>
          </div>
        </div>

        {/* Map Embed */}
        <div className="mb-12">
          <iframe
            title="company-location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14686.546379244596!2d85.8245397!3d20.2960591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909f0213a27cf%3A0x1b6c68f6e5bb0a7c!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="350"
            allowFullScreen=""
            loading="lazy"
            className="rounded-2xl shadow-md"
          ></iframe>
        </div>

        {/* Query Form */}
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Send Us a Query
          </h3>
          <form className="space-y-4">
            {/* Name */}
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            {/* Message */}
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contacts;
