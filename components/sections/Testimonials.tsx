'use client';

import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Adaeze M.',
    review: 'The cup cake was everything! Moist, creamy, and absolutely delicious. Will definitely be ordering again.',
    stars: 5,
  },
  {
    name: 'Tunde O.',
    review: "Ordered a celebration cake for my wife's birthday and she loved it. The presentation was beautiful and it tasted even better.",
    stars: 5,
  },
  {
    name: 'Simi A.',
    review: 'Best pastries in Ibadan, period. The response on WhatsApp was fast and delivery was on time. Highly recommend!',
    stars: 5,
  },
  {
    name: 'Fatima K.',
    review: "I've tried so many cake places. Bextery Bites is on another level. Nutritious and sumptuous – just like they promise.",
    stars: 5,
  },
];

export default function Testimonials() {
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
      id="testimonials"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-brand-brown font-body text-sm font-medium tracking-widest uppercase mb-4">
            What Customers Say
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-brand-dark mb-4">
            Made with love, enjoyed by many
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`bg-white p-6 rounded-2xl shadow-soft transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${idx * 100}ms` : '0ms',
              }}
            >
              {/* Quote Mark */}
              <div className="text-4xl text-brand-red font-display mb-4">"</div>

              {/* Review Text */}
              <p className="text-brand-dark font-body text-sm mb-4 leading-relaxed">
                {testimonial.review}
              </p>

              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.stars }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className="fill-brand-red text-brand-red"
                  />
                ))}
              </div>

              {/* Reviewer Name */}
              <p className="font-display font-bold text-brand-red">
                {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
