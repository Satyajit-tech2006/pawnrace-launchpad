import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { FaChessPawn } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <FaChessPawn className="h-10 w-10 text-primary animate-pulse" />
          <span className="text-2xl font-bold text-gray-800">PawnRace</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-primary transition">
            Features
          </a>
          <a href="#coaches" className="text-gray-600 hover:text-primary transition">
            Coaches
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-primary transition">
            Pricing
          </a>
          <a href="#contact" className="text-gray-600 hover:text-primary transition">
            Contact
          </a>
        </div>

        {/* Buttons */}
        <div className="hidden md:flex space-x-4">
          <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition">
            Login
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-8 w-8 text-gray-800" /> : <Menu className="h-8 w-8 text-gray-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <a href="#features" className="block text-gray-600 hover:text-primary transition">
              Features
            </a>
            <a href="#coaches" className="block text-gray-600 hover:text-primary transition">
              Coaches
            </a>
            <a href="#pricing" className="block text-gray-600 hover:text-primary transition">
              Pricing
            </a>
            <a href="#contact" className="block text-gray-600 hover:text-primary transition">
              Contact
            </a>
            <button className="w-full px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition">
              Login
            </button>
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
