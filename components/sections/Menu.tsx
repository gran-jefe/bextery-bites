'use client';

import { useEffect, useRef, useState } from 'react';

const products = [
  {
    name: 'Cup Cake',
    description: 'Layered cake in a cup — moist sponge, cream, and toppings. A Bextery signature.',
    whatsappMsg: "Hi, I'd like to order a Cup Cake from Bextery Bites.",
    gradient: 'from-brand-red to-brand-brown',
  },
  {
    name: 'Classic Sponge Cake',
    description: 'Light, fluffy, and perfectly moist. Available in chocolate, vanilla, and red velvet.',
    whatsappMsg: "Hi, I'd like to order a Classic Sponge Cake from Bextery Bites.",
    gradient: 'from-brand-brown to-brand-rose',
  },
  {
    name: 'Celebration Cake',
    description: 'Custom-designed cakes for birthdays, anniversaries, and every special moment.',
    whatsappMsg: "Hi, I'd like to order a Celebration Cake from Bextery Bites.",
    gradient: 'from-brand-rose to-brand-brown',
  },
  {
    name: 'Donuts',
    description: 'Soft, glazed, and irresistible. Classic and filled varieties available.',
    whatsappMsg: "Hi, I'd like to order Donuts from Bextery Bites.",
    gradient: 'from-brand-red to-brand-rose',
  },
  {
    name: 'Pastry Box',
    description: "A curated assortment of Bextery's finest — perfect for gifting or sharing.",
    whatsappMsg: "Hi, I'd like to order a Pastry Box from Bextery Bites.",
    gradient: 'from-brand-brown to-brand-dark',
  },
  {
    name: 'Custom Order',
    description: 'Got a special request? We love a challenge. Tell us what you need.',
    whatsappMsg: "Hi, I'd like to place a custom order with Bextery Bites.",
    gradient: 'from-brand-rose to-brand-red',
  },
];

export default function Menu() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(Array(products.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const cards = Array(products.length).fill(false);
          products.forEach((_, idx) => {
            setTimeout(() => {
              setVisibleCards((prev) => {
                const newState = [...prev];
                newState[idx] = true;
                return newState;
              });
            }, idx * 100);
          });
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

  const encodeMessage = (msg: string) => encodeURIComponent(msg);

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-brand-brown font-body text-sm font-medium tracking-widest uppercase mb-4">
            What We Bake
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-brand-dark mb-4">
            Our Pastries
          </h2>
          <p className="text-lg text-brand-brown font-body max-w-2xl mx-auto">
            Every item is made fresh to order. Custom flavours welcome.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <div
              key={product.name}
              className={`bg-white rounded-2xl shadow-soft overflow-hidden transition-all duration-500 ${
                visibleCards[idx]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Image Placeholder */}
              <div
                className={`w-full h-48 bg-linear-to-br ${product.gradient}`}
              />

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-display font-bold text-brand-dark">
                  {product.name}
                </h3>
                <p className="text-brand-brown font-body text-sm leading-relaxed">
                  {product.description}
                </p>
                <a
                  href={`https://wa.me/2348089480850?text=${encodeMessage(product.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-brand-red font-body font-semibold hover:text-brand-brown transition-colors"
                >
                  Order this →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
