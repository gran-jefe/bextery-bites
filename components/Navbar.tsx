'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'How to Order', href: '#order' },
];

const whatsappLink = 'https://wa.me/2348089480850';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-cream shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="#hero"
              className="flex items-center gap-2 font-display text-2xl font-bold text-brand-dark hover:text-brand-red transition-colors"
            >
              <span>Bextery</span>
              <span className="font-body text-sm tracking-widest">BITES</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm font-medium text-brand-dark uppercase tracking-wide hover:text-brand-red transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block px-6 py-2 bg-brand-red text-white font-body font-medium rounded-full hover:bg-brand-brown transition-colors"
            >
              Order Now
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-brand-dark hover:text-brand-red transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-brand-cream md:hidden">
          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="font-body text-base font-medium text-brand-dark uppercase tracking-wide hover:text-brand-red transition-colors block"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleNavClick}
              className="block w-full text-center px-6 py-3 bg-brand-red text-white font-body font-medium rounded-full hover:bg-brand-brown transition-colors"
            >
              Order Now
            </a>
          </div>
        </div>
      )}
    </>
  );
}
