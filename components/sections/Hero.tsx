'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const whatsappLink = 'https://wa.me/2348089480850';

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen bg-brand-cream pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex items-center relative overflow-hidden"
    >
      {/* Background watermark */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[500px] h-[500px] bg-gradient-to-br from-brand-red via-brand-rose to-brand-brown rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
          {/* Trust Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
              Dietitian-Formulated Pastries
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200">
              100% Halal & Clean Ingredients
            </span>
            <span className="text-xs text-brand-brown font-medium hidden sm:inline">
              · Fresh in Ibadan
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-brand-dark leading-[1.08] tracking-tight">
            Sumptuous taste meets{' '}
            <span className="text-brand-red italic underline decoration-brand-rose/60 decoration-wavy decoration-2">
              clinical nutrition.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-brand-brown font-body max-w-2xl leading-relaxed">
            From irresistible <strong className="text-brand-dark">Foil Cakes, velvety Red Velvet, & Greek Yogurt Parfaits</strong> to our groundbreaking upcoming <strong className="text-brand-red">Diabetic & Low-GI Therapeutic Pastries</strong>. Handcrafted with scientific precision and pure love.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-y border-brand-rose/30 py-4 max-w-xl">
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-brand-red">500+</div>
              <div className="text-xs font-medium text-brand-brown">Happy Customers</div>
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-brand-dark">100%</div>
              <div className="text-xs font-medium text-brand-brown">Zero Banned Additives</div>
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-brand-red">2 Wings</div>
              <div className="text-xs font-medium text-brand-brown">Indulgence & Clinical</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="https://wa.me/2348089480850?text=Hi%20Bextery%20Bites%2C%20I%20would%20like%20to%20order%20from%20your%20menu!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-red text-white font-body font-semibold rounded-full hover:bg-brand-brown transition-all duration-300 shadow-md hover:shadow-warm text-sm uppercase tracking-wider"
            >
              Order on WhatsApp
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
            <a
              href="#menu"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand-dark/20 text-brand-dark font-body font-semibold rounded-full hover:bg-brand-red/5 hover:border-brand-red transition-all duration-300 text-sm uppercase tracking-wider"
            >
              Explore Bestsellers & Menu
            </a>
          </div>
        </div>

        {/* Right column - Illustrated Product & Nutrition Showcase */}
        <div className="lg:col-span-5 animate-fade-in-scale">
          <div className="relative mx-auto max-w-md bg-white p-6 rounded-3xl shadow-xl border border-brand-rose/30">
            {/* Visual Header */}
            <div className="h-64 rounded-2xl bg-gradient-to-br from-[#BD4935] via-[#9A684D] to-[#4F4140] p-6 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl" />
              <div className="flex justify-between items-start">
                <span className="text-[11px] uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-semibold">
                  Bestseller Spotlight
                </span>
                <span className="text-xs font-bold text-amber-200 bg-black/30 px-2.5 py-0.5 rounded-full">
                  Fresh Daily
                </span>
              </div>
              <div>
                <div className="text-3xl font-display font-bold">Foil Cake & Parfait Drops</div>
                <p className="text-xs text-brand-cream/90 font-body mt-1">
                  Moist chocolate/velvet sponge layers paired with rich fruit-compote Greek yogurt
                </p>
              </div>
            </div>

            {/* Nutrition Callout Card */}
            <div className="mt-4 p-4 rounded-xl bg-brand-cream/80 border border-brand-rose/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-brand-red">
                  Nutritionist Formulated
                </div>
                <div className="text-xs text-brand-brown">
                  Scientific moisture control & balanced sweetness
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                Pure / Halal
              </span>
            </div>

            {/* Quick Links inside Card */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-semibold">
              <a
                href="#clinical"
                className="p-3 rounded-xl bg-brand-rose/20 text-brand-dark hover:bg-brand-red hover:text-white transition-colors"
              >
                🌿 Therapeutic Diets
              </a>
              <a
                href="#menu"
                className="p-3 rounded-xl bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white transition-colors"
              >
                🎂 Celebration Cakes
              </a>
            </div>
          </div>
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
