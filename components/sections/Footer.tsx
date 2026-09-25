'use client';

import Link from 'next/link';
import { MessageCircle, X as XIcon } from 'lucide-react';

const currentYear = new Date().getFullYear();

const navLinks = [
  { label: 'Bestsellers', href: '#menu' },
  { label: 'Clinical Nutrition', href: '#clinical' },
  { label: 'Our Story', href: '#about' },
  { label: 'How to Order', href: '#order' },
];

const socialLinks = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/2348089480850',
  },
  {
    icon: XIcon,
    label: 'X',
    href: 'https://x.com/bextery_bites',
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-rose py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-display text-2xl font-bold text-white">
                Bextery <span className="font-body text-sm tracking-widest">BITES</span>
              </h3>
            </div>
            <p className="font-body italic text-brand-rose">
              Sumptuous feel in every nutritious bite
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-body text-sm font-medium tracking-widest uppercase text-brand-red mb-4">
              Navigate
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-brand-rose hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h4 className="font-body text-sm font-medium tracking-widest uppercase text-brand-red mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/2348089480850"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-body text-brand-rose hover:text-white transition-colors"
              >
                <MessageCircle size={16} />
                08089480850
              </a>
              <a
                href="https://x.com/bextery_bites"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-body text-brand-rose hover:text-white transition-colors"
              >
                <XIcon size={16} />
                @bextery_bites
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-red/30 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className="font-body text-brand-rose">
            © {currentYear} Bextery Bites. All rights reserved.
          </p>
          <a
            href="https://thegranjefe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-brand-rose hover:text-white transition-colors"
          >
            Website by Gran Jefe
          </a>
        </div>
      </div>
    </footer>
  );
}
