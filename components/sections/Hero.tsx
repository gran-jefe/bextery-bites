'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const whatsappLink = 'https://wa.me/2348089480850';

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen bg-brand-cream pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center relative overflow-hidden"
    >
      {/* Background watermark - decorative shape on the right */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-96 h-96 bg-gradient-to-br from-brand-red to-brand-brown rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-center relative z-10">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-8 animate-fade-in-up">
          {/* Label */}
          <div className="text-brand-brown font-body text-sm font-medium tracking-widest uppercase">
            Est. 2025 · Ibadan, Nigeria
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-brand-dark leading-tight">
            Sumptuous feel in every{' '}
            <span className="text-brand-red">nutritious</span> bite
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-brand-brown font-body max-w-2xl">
            Handcrafted cakes and pastries made with care — for every taste, every occasion.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-buttons">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-red text-white font-body font-semibold rounded-full hover:bg-brand-brown transition-all duration-300 hover:shadow-warm"
            >
              Order on WhatsApp
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="#menu"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand-red text-brand-red font-body font-semibold rounded-full hover:bg-brand-red/5 transition-all duration-300"
            >
              See our menu
            </a>
          </div>
        </div>

        {/* Right column - Image placeholder */}
        <div className="lg:col-span-2 animate-fade-in-scale">
          <div className="w-full aspect-square bg-gradient-to-br from-brand-rose to-brand-brown rounded-3xl shadow-warm" />
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInButtons {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-buttons {
          animation: fadeInButtons 0.6s ease-out 0.3s both;
        }
      `}</style>
    </section>
  );
}
