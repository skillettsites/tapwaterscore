import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Drinking Water Contaminants Guide",
  description:
    "Learn about the most common contaminants found in US drinking water, including lead, PFAS, arsenic, and bacteria. EPA limits, health effects, sources, and how to remove them.",
};

type Contaminant = {
  name: string;
  health: string;
  epaLimit?: string;
  sources: string;
  severity: "health" | "secondary";
};

type Category = {
  name: string;
  icon: string;
  description: string;
  contaminants: Contaminant[];
};

const CATEGORIES: Category[] = [
  {
    name: "Microorganisms",
    icon: "🦠",
    description:
      "Bacteria, viruses, and parasites that can enter water supplies through sewage overflows, animal waste, or treatment failures.",
    contaminants: [
      {
        name: "E. coli",
        health:
          "Gastrointestinal illness, diarrhoea, vomiting. Can be severe in children and the elderly.",
        epaLimit: "0 (zero tolerance)",
        sources: "Human and animal faecal waste, sewage overflows",
        severity: "health",
      },
      {
        name: "Giardia",
        health:
          "Giardiasis, causing prolonged diarrhoea, cramps, nausea, and dehydration.",
        epaLimit: "99.9% removal required",
        sources:
          "Contaminated surface water, animal waste, infected individuals",
        severity: "health",
      },
      {
        name: "Cryptosporidium",
        health:
          "Cryptosporidiosis, causing watery diarrhoea and stomach cramps. Particularly dangerous for immunocompromised individuals.",
        epaLimit: "99% removal required",
        sources:
          "Contaminated surface water, agricultural runoff. Resistant to chlorine disinfection.",
        severity: "health",
      },
      {
        name: "Legionella",
        health:
          "Legionnaires' disease, a serious form of pneumonia. Can be fatal, especially in older adults and smokers.",
        epaLimit: "No MCL (treatment technique required)",
        sources:
          "Grows in warm water systems, cooling towers, plumbing biofilms",
        severity: "health",
      },
      {
        name: "Total Coliforms",
        health:
          "Not necessarily harmful on their own, but their presence indicates that other pathogens may be in the water.",
        epaLimit: "No more than 5% positive samples/month",
        sources:
          "Naturally present in soil and vegetation; indicates potential contamination pathway",
        severity: "secondary",
      },
    ],
  },
  {
    name: "Inorganic Chemicals",
    icon: "⚗️",
    description:
      "Metals and minerals that can enter water from natural deposits, industrial discharge, or corrosion of household plumbing.",
    contaminants: [
      {
        name: "Lead",
        health:
          "Developmental delays and learning difficulties in children. Kidney damage and high blood pressure in adults. No safe level of exposure.",
        epaLimit: "Action level: 15 ppb",
        sources:
          "Corrosion of old lead pipes, solder, and fixtures. Most common in homes built before 1986.",
        severity: "health",
      },
      {
        name: "Arsenic",
        health:
          "Linked to skin, bladder, and lung cancer with long-term exposure. Also causes skin damage and circulatory problems.",
        epaLimit: "MCL: 10 ppb",
        sources:
          "Natural geological deposits, mining and smelting operations, industrial discharge",
        severity: "health",
      },
      {
        name: "Copper",
        health:
          "Short-term: nausea, vomiting, diarrhoea. Long-term: liver and kidney damage. Wilson's disease patients are especially sensitive.",
        epaLimit: "Action level: 1.3 ppm",
        sources:
          "Corrosion of copper plumbing, natural deposits, industrial discharge",
        severity: "health",
      },
      {
        name: "Nitrates",
        health:
          "Blue baby syndrome (methemoglobinemia) in infants under 6 months. Potentially linked to certain cancers in adults.",
        epaLimit: "MCL: 10 ppm",
        sources:
          "Agricultural fertilizer runoff, septic systems, animal feedlots, natural deposits",
        severity: "health",
      },
      {
        name: "Fluoride",
        health:
          "At recommended levels (0.7 ppm), helps prevent tooth decay. Excess causes dental fluorosis in children and skeletal fluorosis in adults.",
        epaLimit: "MCL: 4 ppm",
        sources:
          "Added intentionally by many water systems; also found naturally in groundwater",
        severity: "secondary",
      },
      {
        name: "Mercury",
        health:
          "Damages the nervous system, kidneys, and developing fetuses. Chronic exposure causes tremors, mood changes, and cognitive impairment.",
        epaLimit: "MCL: 2 ppb",
        sources:
          "Industrial discharge, coal-fired power plants, natural deposits, landfill runoff",
        severity: "health",
      },
      {
        name: "Chromium-6",
        health:
          "Probable human carcinogen linked to stomach and intestinal cancers. Made famous by the Erin Brockovich case.",
        epaLimit: "No federal MCL (California set 10 ppb, later withdrawn)",
        sources:
          "Industrial discharge, natural erosion, coal ash, steel manufacturing",
        severity: "health",
      },
    ],
  },
  {
    name: "Organic Chemicals (PFAS / Forever Chemicals)",
    icon: "🧪",
    description:
      "Per- and polyfluoroalkyl substances are synthetic chemicals that persist in the environment and the human body. Found in the drinking water of an estimated 176 million Americans.",
    contaminants: [
      {
        name: "PFOA",
        health:
          "Linked to kidney and testicular cancer, thyroid disease, liver damage, immune system suppression, and developmental effects in fetuses.",
        epaLimit: "MCL: 4 ppt (2024 EPA rule)",
        sources:
          "Manufacturing of non-stick coatings (Teflon), stain-resistant fabrics, food packaging",
        severity: "health",
      },
      {
        name: "PFOS",
        health:
          "Similar to PFOA. Linked to cancer, thyroid disease, immune system effects, and elevated cholesterol. Accumulates in the body over decades.",
        epaLimit: "MCL: 4 ppt (2024 EPA rule)",
        sources:
          "Firefighting foam (AFFF), industrial facilities, military bases, wastewater treatment plants",
        severity: "health",
      },
      {
        name: "GenX (HFPO-DA)",
        health:
          "Liver damage, kidney effects, developmental toxicity, and potential cancer risk. Intended as a safer PFOA replacement but still raises serious concerns.",
        epaLimit: "MCL: 10 ppt (2024 EPA rule)",
        sources:
          "Industrial discharge, replacement chemical for PFOA in manufacturing",
        severity: "health",
      },
    ],
  },
  {
    name: "Disinfection Byproducts",
    icon: "🔬",
    description:
      "Formed when chlorine and other disinfectants react with naturally occurring organic matter in water. A trade-off between killing pathogens and creating new chemical risks.",
    contaminants: [
      {
        name: "Trihalomethanes (THMs)",
        health:
          "Long-term exposure linked to bladder cancer, liver and kidney problems, and adverse reproductive outcomes including miscarriage.",
        epaLimit: "MCL: 80 ppb (annual average)",
        sources:
          "Formed when chlorine reacts with organic matter (leaves, soil, algae) during water treatment",
        severity: "health",
      },
      {
        name: "Haloacetic Acids (HAAs)",
        health:
          "Similar cancer risks to THMs. Also linked to liver toxicity and developmental effects in animal studies.",
        epaLimit: "MCL: 60 ppb (annual average)",
        sources:
          "Same formation process as THMs; higher in systems with more organic matter in source water",
        severity: "health",
      },
      {
        name: "Chloramine",
        health:
          "Generally less irritating than chlorine, but can leach lead from pipes. Harmful to aquarium fish and dialysis patients.",
        epaLimit: "MCL: 4 ppm (as chlorine residual)",
        sources:
          "Added intentionally as an alternative disinfectant to chlorine; used by many large water systems",
        severity: "secondary",
      },
    ],
  },
  {
    name: "Radionuclides",
    icon: "☢️",
    description:
      "Radioactive elements that occur naturally in rock and soil. They dissolve into groundwater and are more common in certain geological regions.",
    contaminants: [
      {
        name: "Radium (226 & 228)",
        health:
          "Long-term exposure linked to bone cancer, lymphoma, and leukaemia. Accumulates in bones over time.",
        epaLimit: "MCL: 5 pCi/L (combined 226+228)",
        sources:
          "Natural radioactive decay of uranium and thorium in rock; more common in deep wells",
        severity: "health",
      },
      {
        name: "Uranium",
        health:
          "Kidney damage and toxicity with chronic exposure. Also a radioactive cancer risk at elevated levels.",
        epaLimit: "MCL: 30 ppb",
        sources:
          "Natural geological deposits, mining operations, phosphate fertilizers",
        severity: "health",
      },
      {
        name: "Radon",
        health:
          "Increases cancer risk when inhaled (released from water during showering). Second leading cause of lung cancer after smoking.",
        epaLimit: "No federal MCL (proposed: 300 pCi/L)",
        sources:
          "Dissolves into groundwater from natural radioactive decay in rock and soil",
        severity: "health",
      },
    ],
  },
];

function SeverityTag({ severity }: { severity: "health" | "secondary" }) {
  if (severity === "health") {
    return (
      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
        Health-based
      </span>
    );
  }
  return (
    <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
      Secondary
    </span>
  );
}

function ContaminantCard({ c }: { c: Contaminant }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold text-gray-900 text-base">{c.name}</h3>
        <SeverityTag severity={c.severity} />
      </div>

      <div className="space-y-2.5 text-sm">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
            Health Effects
          </p>
          <p className="text-gray-700 leading-relaxed">{c.health}</p>
        </div>

        {c.epaLimit && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
              EPA Limit
            </p>
            <p className="text-gray-700 font-medium">{c.epaLimit}</p>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
            Sources
          </p>
          <p className="text-gray-600 leading-relaxed">{c.sources}</p>
        </div>
      </div>
    </div>
  );
}

export default function ContaminantsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm font-medium">
            Contaminant guide
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Common Drinking Water{" "}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
              Contaminants
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-6">
            The EPA regulates over 90 contaminants in US drinking water, from
            bacteria and heavy metals to synthetic chemicals and radioactive
            elements. Here is what you need to know about the most common ones,
            their health effects, and what the legal limits actually mean.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-all"
          >
            Check your water by ZIP code
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Quick nav */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href={`#${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-teal-300 hover:text-teal-700 transition-colors shadow-sm"
              >
                {cat.icon} {cat.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PFAS callout */}
      <section className="pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200/60 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900 mb-2">
                  2024 EPA PFAS Rule
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  In April 2024, the EPA finalised the first-ever national
                  drinking water standards for PFAS (forever chemicals). The new
                  rule sets maximum contaminant levels at{" "}
                  <strong>4 parts per trillion (ppt)</strong> for PFOA and PFOS
                  individually, and limits for three other PFAS compounds. Water
                  systems have until 2029 to comply. This is the most
                  significant drinking water regulation in decades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category sections */}
      {CATEGORIES.map((cat, idx) => (
        <section
          key={cat.name}
          id={cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
          className={idx % 2 === 1 ? "py-12 bg-white" : "py-12"}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{cat.icon}</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {cat.name}
                </h2>
              </div>
              <p className="text-gray-500 text-sm max-w-3xl">
                {cat.description}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.contaminants.map((c) => (
                <ContaminantCard key={c.name} c={c} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Filter recommendations */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200/60 p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                The right filter depends on what&apos;s in your water
              </h2>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                Different contaminants require different filtration technologies.
                A carbon filter that removes chlorine taste will not remove lead
                or PFAS. Start by finding out what is in your water, then choose
                a filter that targets those specific contaminants.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              <Link
                href="/filters"
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <span className="text-3xl mb-3">💧</span>
                <h3 className="font-bold text-gray-900 mb-1">
                  Filter Recommendations
                </h3>
                <p className="text-sm text-gray-500">
                  Compare pitchers, under-sink, reverse osmosis, and whole house
                  systems by contaminant removal.
                </p>
              </Link>
              <Link
                href="/testing"
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <span className="text-3xl mb-3">🧪</span>
                <h3 className="font-bold text-gray-900 mb-1">
                  Get Your Water Tested
                </h3>
                <p className="text-sm text-gray-500">
                  Professional lab testing kits to find out exactly what
                  contaminants are in your water at home.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="relative py-16 md:py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
              Check your water now
            </h2>
            <p className="text-gray-400 mb-8">
              Enter any US ZIP code to see which contaminants have been found in
              your local water system, how they compare to EPA limits, and what
              you can do about it.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md"
            >
              Look Up Your ZIP Code
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
