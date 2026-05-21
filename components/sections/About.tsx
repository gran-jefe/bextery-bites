'use client';

import { useEffect, useRef, useState } from 'react';

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
          {/* Left column - Image placeholder */}
          <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-full aspect-square bg-gradient-to-br from-brand-brown to-brand-rose rounded-3xl shadow-warm relative overflow-hidden">
              {/* Floating badge */}
              <div className="absolute bottom-6 right-6 bg-brand-red text-white rounded-full w-24 h-24 flex items-center justify-center flex-col font-body text-center shadow-warm">
                <span className="text-xs font-medium tracking-widest">EST</span>
                <span className="text-2xl font-display font-bold">2025</span>
              </div>
            </div>
          </div>

          {/* Right column - Content */}
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            {/* Label */}
            <div className="text-brand-rose font-body text-sm font-medium tracking-widest uppercase">
              Our Story
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white">
              Made with dexterity, served with love
            </h2>

            {/* Body Copy */}
            <div className="space-y-4 font-body text-brand-cream leading-relaxed">
              <p>
                Bextery Bites was born from a simple belief — that great pastries should be both sumptuous
                and nutritious. Every cake we make is handcrafted with quality ingredients, genuine care, and
                a whole lot of creativity.
              </p>
              <p>
                Our mission is to curate pastries for anyone and everyone, regardless of health status or
                dietary preference. We're building towards becoming the most sought-after cake brand in
                Ibadan — one bite at a time.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="border-l-2 border-brand-red pl-4">
                <div className="text-4xl font-display font-bold text-brand-red">500+</div>
                <p className="text-brand-rose text-sm font-body mt-2">Orders Delivered</p>
              </div>
              <div className="border-l-2 border-brand-red pl-4">
                <div className="text-4xl font-display font-bold text-brand-red">100%</div>
                <p className="text-brand-rose text-sm font-body mt-2">Handcrafted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
