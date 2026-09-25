'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    href: 'https://wa.me/2347067436817',
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
            <div className="mb-3">
              <Image
                src="/brand-real-logo-white.png"
                alt="Bextery Bites"
                width={180}
                height={45}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="font-body italic text-brand-rose text-sm">
              Sumptuous feel in every nutritious bite
            </p>
            <p className="text-xs text-brand-rose/70 font-body">
              The base comes from being able to create unique things with your hands, dexterity.
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
                href="https://wa.me/2347067436817"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-body text-brand-rose hover:text-white transition-colors"
              >
                <MessageCircle size={16} />
                <span>07067436817</span>
              </a>
              <a
                href="https://instagram.com/_bexterybites"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-body text-brand-rose hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>@_bexterybites</span>
              </a>
              <a
                href="https://www.tiktok.com/@bextery.bites"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-body text-brand-rose hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.43c1.7-1.7 1.8-4.28 1.8-6.19a9.66 9.66 0 0 0 5-1.42v-3.71a6.67 6.67 0 0 1-1.07-.1z"/>
                </svg>
                <span>@bextery.bites</span>
              </a>
              <a
                href="https://x.com/bextery_bites"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-body text-brand-rose hover:text-white transition-colors"
              >
                <XIcon size={16} />
                <span>@bextery_bites</span>
              </a>
            </div>
          </div>
        </div>

        {/* Signature Double Red Line Accent */}
        <div className="space-y-1 mb-6">
          <div className="h-[2px] bg-brand-red w-full" />
          <div className="h-[1px] bg-brand-red/60 w-full" />
        </div>

        {/* Bottom Bar */}
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
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
