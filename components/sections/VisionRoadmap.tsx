'use client';

import { CheckCircle2, Factory, Award, Building2 } from 'lucide-react';

const phases = [
  {
    phase: 'Phase 1: Proof of Concept',
    badge: 'Completed & Validated',
    icon: CheckCircle2,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    title: 'Artisanal Craft & Student Validation',
    points: [
      'Validated recipes with hundreds of happy student and family clients in Ibadan.',
      'Perfected 4 signature favorites: Foil cakes, Moist Red Velvet, Fudgy Chocolate, and Parfaits.',
      'Achieved 100% zero food-waste by turning cake off-cuts into premium layered parfaits.',
    ],
  },
  {
    phase: 'Phase 2: Scale & Structure',
    badge: 'Immediate Priority (MUZASAF Support)',
    icon: Factory,
    badgeColor: 'bg-brand-red/10 text-brand-red border-brand-red/30',
    title: 'Commercial Machinery & Capacity Expansion',
    points: [
      'Upgrade from hand mixers to a 10L commercial planetary mixer and heavy-duty gas deck oven.',
      'Install dedicated cold-chain deep freezing to triple weekly production capacity to 80+ units.',
      'Create 2 direct youth apprentice positions in Ibadan for food processing and hygiene.',
    ],
  },
  {
    phase: 'Phase 3: Long-Term Dominance',
    badge: 'Future Horizon',
    icon: Award,
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    title: 'NAFDAC Certification & Indigenous Value Chains',
    points: [
      'Full NAFDAC registration for packaged therapeutic oat & tigernut (aya) loaves.',
      'Supply chain offtake directly from Nigerian smallholder farmers of composite grains.',
      'Launch of Ibadan’s premier flagship Bextery Wellness & Indulgence Café.',
    ],
  },
];

export default function VisionRoadmap() {
  return (
    <section id="vision" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-dark text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="text-brand-rose font-body text-xs font-semibold tracking-widest uppercase">
            Built to Stand the Test of Time
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white">
            Our Growth & Impact Roadmap
          </h2>
          <p className="text-brand-cream/80 font-body text-sm sm:text-base max-w-2xl mx-auto">
            From humble beginnings to an institutionally backed, health-forward food manufacturing brand in Nigeria.
          </p>
        </div>

        {/* Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {phases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col justify-between hover:border-brand-red/50 transition-all duration-300 relative group"
              >
                <div className="space-y-6">
                  {/* Badge */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-brand-rose uppercase tracking-wider">
                      {item.phase}
                    </span>
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon + Title */}
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-red/20 text-brand-red flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white">
                      {item.title}
                    </h3>
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-3 text-xs sm:text-sm text-brand-cream/80 font-body">
                    {item.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <span className="text-brand-red font-bold">›</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom line marker */}
                <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-brand-rose/60 font-body">
                  Bextery Bites Strategic Milestone
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Callout */}
        <div className="mt-16 bg-gradient-to-r from-brand-red/20 via-white/5 to-emerald-950/40 p-8 rounded-3xl border border-brand-rose/20 text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            Social Accountability & Governance
          </div>
          <p className="text-sm font-body text-brand-cream/90 leading-relaxed">
            We are structured to welcome grant audits, impact evaluations, and clinical research partnerships. Every kobo of capital support directly unlocks local job creation, food hygiene excellence, and accessible preventative nutrition.
          </p>
        </div>
      </div>
    </section>
  );
}
