// Footer Component for PawnRace Chess Academy
// Contains site links, social media, newsletter signup, and company information
// Updated to use Link from react-router-dom for navigation

import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

function Footer() {
  // Organized footer navigation links using 'to' for react-router-dom
  const footerNavigationLinks = {
    'Company': [
      { name: 'About Us', to: '/about' },
      { name: 'Our Team', to: '/team' },
      { name: 'Careers', to: '/careers' },
      { name: 'Press', to: '/press' }
    ],
    'For Students': [
      { name: 'Find a Coach', to: '/mentors' },
      { name: 'Pricing', to: '/pricing' },
      { name: 'Success Stories', to: '/testimonials' },
      { name: 'Support', to: '/contact' }
    ],
    'For Coaches': [
      { name: 'Become a Coach', to: '/become-a-coach' },
      { name: 'Coach Resources', to: '/coach-resources' },
      { name: 'Coach Community', to: '/coach-community' },
      { name: 'Earnings', to: '/earnings' }
    ],
    'Resources': [
      { name: 'Chess Blog', to: '/blog' },
      { name: 'Learning Center', to: '/learn' },
      { name: 'Tournament Calendar', to: '/tournaments' },
      { name: 'Chess Rules', to: '/rules' }
    ]
  };

  // Social media links remain as anchor tags for external sites
  const socialMediaLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            
            {/* Brand and Social Media Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Crown className="h-8 w-8 text-yellow-400" />
                <span className="text-2xl font-bold text-white">PawnRace</span>
              </div>
              
              <p className="text-gray-400 mb-6 max-w-md">
                The world's leading online chess academy connecting students 
                with FIDE-rated coaches for personalized chess education.
              </p>

              {/* Social Media Icons */}
              <div className="flex space-x-4">
                {socialMediaLinks.map((socialLink) => (
                  <a
                    key={socialLink.label}
                    href={socialLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"
                    aria-label={socialLink.label}
                  >
                    <socialLink.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Navigation Links */}
            {Object.entries(footerNavigationLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-white mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.to}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-white">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Get chess tips, tournament updates, and exclusive offers
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} PawnRace. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookie-policy"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;