'use client';

import Image from 'next/image';
import { Camera, X as XIcon, ExternalLink } from 'lucide-react';

const showcaseItems = [
  {
    type: 'image',
    src: '/brand-sticker-round.png',
    tag: 'Official Packaging Seal',
    title: 'Handcrafted with Dexterity',
    desc: 'Each treat sealed fresh with our trademark round brand badge.',
  },
  {
    type: 'highlight',
    gradient: 'from-[#BD4935] to-[#9A684D]',
    tag: 'Bestseller Drop',
    title: 'Gourmet Foil Cakes',
    desc: 'Deeply moist chocolate fudge and velvety red velvet layers baked in sealed pans.',
  },
  {
    type: 'image',
    src: '/brand-full-logo-cream.png',
    tag: 'Brand Identity',
    title: 'Clinical Precision Meets Art',
    desc: 'Formulated by a Human Nutrition & Dietetics professional.',
  },
  {
    type: 'highlight',
    gradient: 'from-[#9A684D] to-[#4F4140]',
    tag: 'Zero Food-Waste',
    title: 'Greek Yogurt Parfaits',
    desc: 'Decadent cake crumbs layered with rich fruit compotes and creamy yogurt.',
  },
  {
    type: 'highlight',
    gradient: 'from-[#4F4140] to-[#BD4935]',
    tag: 'Therapeutic Diets',
    title: 'Diabetic-Safe Low GI Loaves',
    desc: 'Indulgence engineered for sustained glycemic control and pure wellness.',
  },
  {
    type: 'image',
    src: '/brand-symbol-red.png',
    tag: 'Quality Standard',
    title: '100% Halal & Tayyib',
    desc: 'Zero potassium bromate, zero industrial saccharin, pure ingredients only.',
  },
];

export default function InstagramFeed() {
  return (
    <section
      id="instagram"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-dark text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="text-brand-rose font-body text-xs font-semibold tracking-widest uppercase mb-3">
            Follow the Journey
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
            @bextery_bites
          </h2>
          <p className="text-sm sm:text-base text-brand-rose font-body max-w-2xl mx-auto">
            Fresh daily drops, behind the scenes from our Ibadan kitchen, and evidence-based nutrition tips.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-14">
          <a
            href="https://x.com/bextery_bites"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3.5 bg-brand-red text-white font-body font-semibold rounded-full hover:bg-brand-brown transition-all duration-200 shadow-md text-xs sm:text-sm uppercase tracking-wider"
          >
            <XIcon className="w-4 h-4 mr-2" />
            Connect on X (@bextery_bites)
          </a>
          <a
            href="https://wa.me/2347067436817?text=Hi%20Bextery%20Bites%2C%20I%20love%20your%20creations!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3.5 border-2 border-brand-rose/50 text-brand-cream font-body font-semibold rounded-full hover:bg-brand-rose/10 transition-all duration-200 text-xs sm:text-sm uppercase tracking-wider"
          >
            WhatsApp Inquiry
          </a>
        </div>

        {/* Brand & Product Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-brand-cream/5 border border-brand-rose/20 rounded-2xl p-6 relative overflow-hidden group hover:border-brand-red transition-all duration-300 flex flex-col justify-between h-72 shadow-lg"
            >
              {/* Background gradient or subtle mark */}
              {item.type === 'highlight' && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}
                />
              )}

              <div className="relative z-10">
                <span className="inline-block text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-white/10 text-brand-rose mb-3">
                  {item.tag}
                </span>
                <h3 className="text-xl font-display font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-rose/80 font-body leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Visual element / Image / Icon at bottom */}
              <div className="relative z-10 pt-4 flex justify-between items-end border-t border-white/10">
                {item.type === 'image' ? (
                  <div className="w-16 h-16 rounded-xl bg-white/10 p-2 flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.src!}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-brand-rose/70 font-display italic">
                    Dietitian Formulated
                  </div>
                )}
                <span className="text-[11px] text-brand-cream font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:text-brand-red transition-colors">
                  Bextery Bites
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
