'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { label: 'Bestsellers', href: '#menu' },
  { label: 'Clinical Nutrition', href: '#clinical' },
  { label: 'Our Story', href: '#about' },
  { label: 'How to Order', href: '#order' },
];

const whatsappLink = 'https://wa.me/2347067436817?text=Hi%20Bextery%20Bites%2C%20I%20would%20like%20to%20place%20an%20order%20or%20make%20an%20inquiry.';

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
            ? 'bg-brand-cream/95 backdrop-blur-md shadow-soft border-b border-brand-rose/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="#hero"
              className="flex items-center gap-3 group transition-all"
            >
              {/* Official brand symbol */}
              <div className="w-8 h-9 group-hover:scale-105 transition-transform flex-shrink-0 flex items-center justify-center">
                <Image
                  src="/brand-symbol-red.png"
                  alt="Bextery Bites Symbol"
                  width={32}
                  height={37}
                  className="w-auto h-8 object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5 font-display text-2xl font-bold text-brand-dark group-hover:text-brand-red transition-colors leading-none">
                  <span>Bextery</span>
                  <span className="font-body text-[10px] tracking-[0.3em] text-brand-brown font-semibold uppercase">BITES</span>
                </div>
                <span className="font-body text-[9px] text-brand-brown/80 tracking-wider uppercase mt-1 hidden sm:block">
                  Dietitian-Crafted · Ibadan
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-body text-xs font-semibold text-brand-dark uppercase tracking-wider hover:text-brand-red transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300">
                100% Halal & Tayyib
              </span>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-brown transition-all shadow-sm hover:shadow-warm"
              >
                Order on WhatsApp
              </a>
            </div>

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
              <div className="pt-2">
                <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 mb-3">
                  100% Halal & Pure (Tayyib)
                </span>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleNavClick}
                  className="block w-full text-center px-6 py-3 bg-brand-red text-white font-body font-semibold rounded-full hover:bg-brand-brown transition-colors text-sm uppercase tracking-wider"
                >
                  Order on WhatsApp
                </a>
              </div>
          </div>
        </div>
      )}
    </>
  );
}
