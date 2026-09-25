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
                src="/brand-full-logo-light.png"
                alt="Bextery Bites - Dietitian-Crafted · Ibadan"
                width={220}
                height={48}
                className="h-11 w-auto object-contain"
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
                className="flex items-center gap-2 font-body text-brand-rose hover:text-white transition-colors"
              >
                <MessageCircle size={16} />
                07067436817
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
