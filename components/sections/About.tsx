'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-dark text-brand-cream"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Visual Card */}
          <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-full bg-gradient-to-br from-[#9A684D] via-[#BD4935] to-[#4F4140] rounded-3xl p-8 text-brand-cream shadow-2xl relative overflow-hidden border border-brand-rose/20">
              {/* Subtle watermark of official Bextery mark */}
              <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-15 pointer-events-none">
                <Image
                  src="/brand-symbol-rose.png"
                  alt="Bextery Symbol Watermark"
                  width={192}
                  height={222}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-brand-rose font-semibold bg-white/10 px-3 py-1 rounded-full">
                    The Founder's Journey
                  </span>
                  <div className="w-7 h-8 flex items-center justify-center">
                    <Image
                      src="/brand-symbol-rose.png"
                      alt="Bextery Symbol"
                      width={28}
                      height={32}
                      className="w-auto h-7 object-contain opacity-80"
                    />
                  </div>
                </div>
                
                <h3 className="text-3xl font-display font-bold text-white leading-snug">
                  "It started in student hostels with a hand mixer, a single oven, and an obsession with pure flavor."
                </h3>

                <p className="text-sm font-body text-brand-cream/80 leading-relaxed">
                  With a degree in Human Nutrition & Dietetics and a full year of intensive clinical dietetic experience in hospital wards, I observed firsthand how diabetic, hypertensive, and health-conscious Nigerians are completely excluded from celebratory treats. Modern confectionery in Nigeria had lost its conscience.
                </p>

                <div className="pt-4 border-t border-brand-rose/30 space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-red bg-white p-1 rounded-full text-xs font-bold">✓</span>
                    <span><strong>Pure & Halal Ingredients:</strong> Zero potassium bromate, zero industrial saccharin.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-red bg-white p-1 rounded-full text-xs font-bold">✓</span>
                    <span><strong>Clinical Science:</strong> Calibrated moisture & glycemic index awareness.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-red bg-white p-1 rounded-full text-xs font-bold">✓</span>
                    <span><strong>100% Zero-Waste Goal:</strong> Cake offcuts repurposed into rich Greek yogurt parfaits.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Content */}
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            {/* Label */}
            <div className="text-brand-rose font-body text-xs font-semibold tracking-widest uppercase">
              Our Identity & Purpose
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight">
              Where artisan baking meets dietary therapy.
            </h2>

            {/* Body Copy */}
            <div className="space-y-4 font-body text-brand-cream/90 leading-relaxed text-sm sm:text-base">
              <p>
                Bextery Bites was built on the belief that indulgence shouldn’t come at the cost of your health, and healthy pastries shouldn’t taste like cardboard.
              </p>
              <p>
                Having baked for hundreds of students, families, and professionals across Ibadan, we are taking our craft to commercial scale: offering everyday celebratory treats alongside certified therapeutic baked diets for non-regular and health-restricted food consumers.
              </p>
            </div>

            {/* 2 Wings Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-brand-rose/20 space-y-1">
                <div className="text-brand-red text-xs font-bold uppercase tracking-wider">
                  Wing A: The Indulgence Line
                </div>
                <div className="text-white font-display text-lg font-bold">
                  Bestsellers & Celebrations
                </div>
                <p className="text-xs text-brand-rose">
                  Foil cakes, rich chocolate fudge, moist red velvet, parfaits, and bespoke celebration cakes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-brand-rose/20 space-y-1">
                <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Wing B: The Clinical Line
                </div>
                <div className="text-white font-display text-lg font-bold">
                  Therapeutic & Functional
                </div>
                <p className="text-xs text-brand-rose">
                  Low-GI, diabetic-friendly, high-fiber, and gluten-safe bakes formulated with indigenous grains.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-brand-rose/20">
              <div className="border-l-2 border-brand-red pl-4">
                <div className="text-3xl font-display font-bold text-brand-red">500+</div>
                <p className="text-brand-rose text-xs font-body mt-1">Orders Handcrafted in Ibadan</p>
              </div>
              <div className="border-l-2 border-brand-red pl-4">
                <div className="text-3xl font-display font-bold text-brand-red">100%</div>
                <p className="text-brand-rose text-xs font-body mt-1">Scientific Recipe Balance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signature brand guidelines double red line accent */}
        <div className="mt-16 space-y-1.5 opacity-60">
          <div className="h-0.5 w-full bg-brand-red" />
          <div className="h-0.5 w-full bg-brand-red" />
        </div>
      </div>
    </section>
  );
}
