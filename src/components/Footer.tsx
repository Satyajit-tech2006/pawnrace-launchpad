import React from 'react';
import { Crown, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    'Company': [
      { name: 'About Us', href: '#about' },
      { name: 'Our Team', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' }
    ],
    'For Students': [
      { name: 'Find a Coach', href: '#mentors' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Success Stories', href: '#testimonials' },
      { name: 'Support', href: '#contact' }
    ],
    'For Coaches': [
      { name: 'Become a Coach', href: '#contact' },
      { name: 'Coach Resources', href: '#' },
      { name: 'Coach Community', href: '#' },
      { name: 'Earnings', href: '#' }
    ],
    'Resources': [
      { name: 'Chess Blog', href: '#' },
      { name: 'Learning Center', href: '#' },
      { name: 'Tournament Calendar', href: '#' },
      { name: 'Chess Rules', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Crown className="h-8 w-8 text-accent" />
                <span className="text-2xl font-bold text-accent-gradient">PawnRace</span>
              </div>
              
              <p className="text-primary-foreground/80 mb-6 max-w-md">
                The world's leading online chess academy connecting students 
                with FIDE-rated coaches for personalized chess education.
              </p>

              {/* Social Media Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2 rounded-lg transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-primary-foreground mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
            <p className="text-primary-foreground/80 mb-6">
              Get chess tips, tournament updates, and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-foreground bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-primary-foreground/80 text-sm">
              © 2025 PawnRace. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;