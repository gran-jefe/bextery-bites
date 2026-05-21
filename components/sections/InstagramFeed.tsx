'use client';

import { Camera, X as XIcon } from 'lucide-react';

const feedPlaceholders = [
  { gradient: 'from-brand-red to-brand-brown' },
  { gradient: 'from-brand-brown to-brand-rose' },
  { gradient: 'from-brand-rose to-brand-red' },
  { gradient: 'from-brand-red to-brand-rose' },
  { gradient: 'from-brand-brown to-brand-dark' },
  { gradient: 'from-brand-dark to-brand-brown' },
];

export default function InstagramFeed() {
  return (
    <section
      id="instagram"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-dark text-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-brand-rose font-body text-sm font-medium tracking-widest uppercase mb-4">
            Follow Along
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-4">
            @bextery_bites
          </h2>
          <p className="text-lg text-brand-rose font-body max-w-2xl mx-auto">
            See our latest creations and behind-the-scenes on Instagram and X
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <a
            href="https://instagram.com/bextery_bites"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-red text-white font-body font-semibold rounded-full hover:bg-brand-brown transition-colors"
          >
            <Camera className="w-5 h-5 mr-2" />
            Instagram
          </a>
          <a
            href="https://x.com/bextery_bites"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand-rose text-brand-rose font-body font-semibold rounded-full hover:bg-brand-rose/10 transition-colors"
          >
            <XIcon className="w-5 h-5 mr-2" />
            X / Twitter
          </a>
        </div>

        {/* Feed Grid Placeholder */}
        <div className="grid grid-cols-3 gap-4">
          {feedPlaceholders.map((item, idx) => (
            <div
              key={idx}
              className={`aspect-square bg-linear-to-br ${item.gradient} rounded-lg overflow-hidden relative group cursor-pointer hover:shadow-warm transition-shadow`}
            >
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Dev Note */}
        <div className="mt-12 text-center text-xs text-brand-rose">
          {/* TODO: Replace static grid with live Instagram Basic Display API feed when client provides API token */}
        </div>
      </div>
    </section>
  );
}
