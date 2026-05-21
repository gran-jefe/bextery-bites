'use client';

import { ShoppingBag, MessageCircle, PackageCheck } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: ShoppingBag,
    title: 'Pick your pastry',
    description: "Browse our menu and decide what you'd like",
  },
  {
    number: '2',
    icon: MessageCircle,
    title: 'Message us on WhatsApp',
    description: 'Send us your order, quantity, and delivery details',
  },
  {
    number: '3',
    icon: PackageCheck,
    title: 'Enjoy your delivery',
    description: 'We bake fresh and deliver to you in Ibadan',
  },
];

const whatsappLink = 'https://wa.me/2348089480850?text=Hi%2C%20I%27d%20like%20to%20place%20an%20order%20with%20Bextery%20Bites.';

export default function HowToOrder() {
  return (
    <section
      id="order"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-red text-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-white/70 font-body text-sm font-medium tracking-widest uppercase mb-4">
            Simple & Easy
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
            How to Order
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative text-center">
                {/* Decorative number background */}
                <div className="text-8xl font-display font-bold opacity-10 mb-4 leading-none">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6 -mt-16 relative z-10">
                  <Icon size={48} className="text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-display font-bold mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-white/80 font-body">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center pt-8">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-white text-brand-red font-body font-bold rounded-full text-lg hover:bg-brand-cream transition-all duration-300 shadow-warm hover:shadow-none animate-pulse-subtle"
          >
            Start Your Order on WhatsApp
          </a>
        </div>
      </div>

      <style>{`
        @keyframes pulseSoft {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 8px 24px rgba(255, 255, 255, 0.5);
          }
        }

        .animate-pulse-subtle {
          animation: pulseSoft 2.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
