'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const whatsappLink = 'https://wa.me/2347067436817';

export default function Hero() {
  return (
    <section
      id="hero"
      className="bg-brand-cream pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background glow watermark */}
      <div
        className="absolute right-0 top-1/3 -translate-y-1/2 opacity-15 pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[500px] h-[500px] bg-gradient-to-br from-brand-red via-brand-rose to-brand-brown rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Trust Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-brand-red" />
              Dietitian-Formulated Pastries
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
              100% Halal & Clean Ingredients
            </span>
            <span className="text-xs text-brand-brown font-medium">
              • Fresh in Ibadan
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-brand-dark leading-[1.1] tracking-tight">
            Sumptuous taste meets{' '}
            <span className="text-brand-red italic underline decoration-brand-rose/60 decoration-wavy decoration-2">
              clinical nutrition.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-brand-brown font-body max-w-2xl leading-relaxed">
            From irresistible <strong className="text-brand-dark font-semibold">Foil Cakes, velvety Red Velvet, & Greek Yogurt Parfaits</strong> to our groundbreaking upcoming <strong className="text-brand-red font-semibold">Diabetic & Low-GI Therapeutic Pastries</strong>. Handcrafted with scientific precision and pure care.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 pt-1">
            <a
              href="https://wa.me/2347067436817?text=Hi%20Bextery%20Bites%2C%20I%20would%20like%20to%20order%20from%20your%20menu!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-brand-red text-white font-body font-semibold rounded-full hover:bg-brand-brown transition-all duration-200 shadow-md hover:shadow-warm text-xs sm:text-sm uppercase tracking-wider"
            >
              Order on WhatsApp
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
            <a
              href="#menu"
              className="inline-flex items-center justify-center px-7 py-3.5 border-2 border-brand-dark/20 text-brand-dark font-body font-semibold rounded-full hover:bg-brand-red/5 hover:border-brand-red transition-all duration-200 text-xs sm:text-sm uppercase tracking-wider"
            >
              Explore Bestsellers & Menu
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-brand-rose/30 max-w-xl">
            <div className="border-l-2 border-brand-red pl-3">
              <div className="font-display text-2xl sm:text-3xl font-bold text-brand-red">500+</div>
              <div className="text-[11px] font-medium text-brand-brown">Happy Customers</div>
            </div>
            <div className="border-l-2 border-brand-dark pl-3">
              <div className="font-display text-2xl sm:text-3xl font-bold text-brand-dark">100%</div>
              <div className="text-[11px] font-medium text-brand-brown">Zero Banned Additives</div>
            </div>
            <div className="border-l-2 border-brand-red pl-3">
              <div className="font-display text-2xl sm:text-3xl font-bold text-brand-red">2 Wings</div>
              <div className="text-[11px] font-medium text-brand-brown">Indulgence & Clinical</div>
            </div>
          </div>
        </div>

        {/* Right column - Illustrated Product & Nutrition Showcase */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-md bg-white p-5 sm:p-6 rounded-3xl shadow-xl border border-brand-rose/30">
            {/* Visual Header */}
            <div className="rounded-2xl bg-gradient-to-br from-[#BD4935] via-[#9A684D] to-[#4F4140] p-5 sm:p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-inner">
              <div className="flex justify-between items-start z-10 mb-3">
                <span className="text-[10px] uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-semibold">
                  Bestseller Spotlight
                </span>
                <span className="text-[11px] font-bold text-amber-200 bg-black/30 px-2.5 py-0.5 rounded-full">
                  Fresh Daily
                </span>
              </div>

              {/* Authentic Packaging Sticker Feature */}
              <div className="flex items-center gap-4 my-2 z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 drop-shadow-xl hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/brand-sticker-round.png"
                    alt="Bextery Bites Packaging Seal"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl font-display font-bold leading-tight">
                    Foil Cakes & Parfait Drops
                  </div>
                  <p className="text-xs text-brand-cream/90 font-body leading-relaxed">
                    Moist chocolate and velvet sponge layers paired with rich fruit-compote Greek yogurt.
                  </p>
                </div>
              </div>

              {/* Subtle watermark in card background */}
              <div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-15 pointer-events-none">
                <Image
                  src="/brand-symbol-rose.png"
                  alt="Watermark"
                  width={144}
                  height={166}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Nutrition Callout Card */}
            <div className="mt-4 p-3.5 rounded-xl bg-brand-cream/80 border border-brand-rose/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-brand-red">
                  Nutritionist Formulated
                </div>
                <div className="text-[11px] text-brand-brown">
                  Scientific moisture control & balanced sweetness
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                Pure / Halal
              </span>
            </div>

            {/* Quick Links inside Card */}
            <div className="mt-3.5 grid grid-cols-2 gap-2 text-center text-xs font-semibold">
              <a
                href="#clinical"
                className="p-2.5 rounded-xl bg-brand-rose/20 text-brand-dark hover:bg-brand-red hover:text-white transition-colors"
              >
                🌿 Therapeutic Diets
              </a>
              <a
                href="#menu"
                className="p-2.5 rounded-xl bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white transition-colors"
              >
                🎂 Celebration Cakes
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
