import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Best Water Filters for Every Contaminant (2026)",
  description:
    "Independent guide to the best water filters for PFAS, lead, chlorine, and more. Compare pitchers, under-sink, reverse osmosis, and whole house systems. Backed by NSF certification and lab testing data.",
};

type Product = {
  name: string;
  price: string;
  url: string;
  removes: string[];
  highlight?: string;
};

const PFAS_FILTERS: Product[] = [
  {
    name: "Clearly Filtered Pitcher",
    price: "$90",
    url: "https://www.clearlyfiltered.com/products/clean-water-filter-pitcher",
    removes: ["PFAS (99.9%)", "Lead", "Chromium-6", "Fluoride", "Pesticides"],
    highlight: "Best overall for PFAS",
  },
  {
    name: "Epic Water Filters Nano",
    price: "$38",
    url: "https://www.epicwaterfilters.com/products/epic-nano",
    removes: ["PFAS (97%+)", "Lead", "Bacteria", "Cysts", "Chlorine"],
    highlight: "Budget-friendly PFAS removal",
  },
  {
    name: "AquaTru Countertop RO",
    price: "$350 - $450",
    url: "https://www.aquatru.com/products/aquatru-classic",
    removes: ["PFAS (99%+)", "Lead", "Arsenic", "Chromium-6", "Fluoride", "Nitrates"],
    highlight: "No installation required",
  },
];

const LEAD_FILTERS: Product[] = [
  {
    name: "Clearly Filtered Under-Sink",
    price: "$250 - $350",
    url: "https://www.clearlyfiltered.com/products/under-the-sink-water-filter-system",
    removes: ["Lead (99.5%)", "PFAS", "Fluoride", "Chromium-6", "Pharmaceuticals"],
    highlight: "Top-rated for lead removal",
  },
  {
    name: "Epic Water Filters Pure",
    price: "$30",
    url: "https://www.epicwaterfilters.com/products/epic-pure-water-filter-pitcher",
    removes: ["Lead (99.9%)", "PFAS", "Chlorine", "Fluoride", "Pesticides"],
    highlight: "Best value pitcher",
  },
  {
    name: "SpringWell CF1",
    price: "$50 - $80",
    url: "https://www.springwellwater.com/product/springwell-countertop-water-filter/",
    removes: ["Lead", "Chlorine", "VOCs", "Cysts", "Sediment"],
    highlight: "Simple countertop setup",
  },
];

const WHOLE_HOUSE: Product[] = [
  {
    name: "SpringWell CF4",
    price: "$850 - $1,600",
    url: "https://www.springwellwater.com/product/whole-house-water-filter-system/",
    removes: ["Chlorine", "VOCs", "Sediment", "Pesticides", "Herbicides"],
    highlight: "Best all-around whole house",
  },
  {
    name: "Aquasana Whole House",
    price: "$800 - $1,500",
    url: "https://www.aquasana.com/whole-house-water-filters",
    removes: ["Chlorine", "Lead", "VOCs", "Cysts", "Sediment", "PFAS"],
    highlight: "600K gallon capacity",
  },
  {
    name: "Crystal Quest Whole House",
    price: "$700 - $2,500",
    url: "https://www.crystalquest.com/collections/whole-house-water-filters",
    removes: ["Chlorine", "Lead", "Iron", "Sediment", "VOCs", "Heavy Metals"],
    highlight: "Most customisable options",
  },
];

const RO_SYSTEMS: Product[] = [
  {
    name: "AquaTru Countertop",
    price: "$350 - $450",
    url: "https://www.aquatru.com/products/aquatru-classic",
    removes: ["PFAS", "Lead", "Arsenic", "Fluoride", "Nitrates", "Chromium-6"],
    highlight: "No plumbing needed",
  },
  {
    name: "SpringWell RO System",
    price: "$400 - $600",
    url: "https://www.springwellwater.com/product/reverse-osmosis-system/",
    removes: ["PFAS", "Lead", "Arsenic", "Fluoride", "Nitrates", "TDS"],
    highlight: "Under-sink with remineralisation",
  },
  {
    name: "Waterdrop G3P800",
    price: "$600 - $800",
    url: "https://www.waterdropfilter.com/products/waterdrop-g3p800-reverse-osmosis-system",
    removes: ["PFAS", "Lead", "Arsenic", "Fluoride", "TDS", "Chlorine"],
    highlight: "800 GPD, tankless design",
  },
];

const BUDGET_PITCHERS: Product[] = [
  {
    name: "Epic Water Filters Pure Pitcher",
    price: "$30",
    url: "https://www.epicwaterfilters.com/products/epic-pure-water-filter-pitcher",
    removes: ["Lead (99.9%)", "PFAS", "Chlorine", "Fluoride", "Pesticides"],
    highlight: "Best budget pick",
  },
  {
    name: "Clearly Filtered Pitcher",
    price: "$90",
    url: "https://www.clearlyfiltered.com/products/clean-water-filter-pitcher",
    removes: ["PFAS (99.9%)", "Lead", "Fluoride", "Chromium-6", "Pharmaceuticals"],
    highlight: "Premium pitcher, 365+ contaminants",
  },
  {
    name: "Brita Elite",
    price: "$25 - $40",
    url: "https://www.amazon.com/Brita-Filter-Replacement-Standard-Pitchers/dp/B0BWDMYQCX",
    removes: ["Lead", "Chlorine", "Mercury", "Cadmium", "Benzene"],
    highlight: "Most widely available",
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {product.highlight && (
        <span className="inline-block self-start px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold mb-3">
          {product.highlight}
        </span>
      )}
      <h3 className="font-bold text-gray-900 text-base mb-1">{product.name}</h3>
      <p className="text-xl font-extrabold text-gray-900 mb-3">{product.price}</p>
      <div className="mb-4 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Removes</p>
        <div className="flex flex-wrap gap-1.5">
          {product.removes.map((r) => (
            <span
              key={r}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {r}
            </span>
          ))}
        </div>
      </div>
      {/* AFFILIATE: swap URL when approved */}
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-600 transition-all shadow-sm"
      >
        Check Price
      </a>
    </div>
  );
}

function Section({
  id,
  title,
  subtitle,
  products,
}: {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
}) {
  return (
    <section id={id} className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-gray-500 text-sm mb-8">{subtitle}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <ProductCard key={p.name + p.price} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FiltersPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm font-medium">
            Independent filter guide
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Find the Right{" "}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
              Water Filter
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-6">
            Not all filters are equal. The best filter for your home depends on
            what contaminants are actually in your water. We recommend filters
            based on independent lab testing, NSF certifications, and real
            contaminant removal data.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-all"
          >
            Check your water first
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Quick nav */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "PFAS Removal", href: "#pfas" },
              { label: "Lead Removal", href: "#lead" },
              { label: "Whole House", href: "#whole-house" },
              { label: "Reverse Osmosis", href: "#reverse-osmosis" },
              { label: "Budget Pitchers", href: "#budget" },
              { label: "Water Testing", href: "#testing" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-teal-300 hover:text-teal-700 transition-colors shadow-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Product sections */}
      <Section
        id="pfas"
        title="Best for PFAS / Forever Chemicals"
        subtitle="PFAS are found in 45%+ of US tap water. These filters are independently tested to remove PFOA, PFOS, and other forever chemicals."
        products={PFAS_FILTERS}
      />

      <div className="max-w-6xl mx-auto px-4"><div className="border-t border-gray-200" /></div>

      <Section
        id="lead"
        title="Best for Lead Removal"
        subtitle="Lead can leach into water from old pipes and fixtures. These filters are NSF 53 certified for lead reduction to below 1 ppb."
        products={LEAD_FILTERS}
      />

      <div className="max-w-6xl mx-auto px-4"><div className="border-t border-gray-200" /></div>

      <Section
        id="whole-house"
        title="Best Whole House Systems"
        subtitle="Filter every tap in your home. Whole house systems treat water at the point of entry, protecting showers, laundry, and drinking water."
        products={WHOLE_HOUSE}
      />

      <div className="max-w-6xl mx-auto px-4"><div className="border-t border-gray-200" /></div>

      <Section
        id="reverse-osmosis"
        title="Best Reverse Osmosis Systems"
        subtitle="Reverse osmosis removes 95-99% of dissolved contaminants including PFAS, arsenic, fluoride, and nitrates. The most thorough filtration available."
        products={RO_SYSTEMS}
      />

      <div className="max-w-6xl mx-auto px-4"><div className="border-t border-gray-200" /></div>

      <Section
        id="budget"
        title="Best Budget / Pitcher Filters"
        subtitle="Effective filtration without a big investment. Pitcher filters are the easiest way to start filtering your drinking water today."
        products={BUDGET_PITCHERS}
      />

      {/* Water Testing */}
      <section id="testing" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200/60 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <span className="text-4xl">🧪</span>
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                  Not sure what&apos;s in your water? Get it tested first.
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Before buying a filter, it helps to know exactly what you need
                  to remove. A professional water test gives you a complete
                  picture of your water quality, including contaminants that
                  may not show up in EPA data (like private well water or
                  pipe-specific issues like lead).
                </p>
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900">Tap Score by SimpleLab</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Certified lab testing kits. Choose from basic ($30) to
                        comprehensive ($500) panels. Results in 5-7 business days
                        with detailed reports and recommendations.
                      </p>
                      <span className="inline-block mt-2 px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold">
                        10% affiliate, 90-day cookie
                      </span>
                    </div>
                    {/* AFFILIATE: swap URL when approved */}
                    <a
                      href="https://www.tapscore.com/products"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex-shrink-0 inline-block text-center px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-600 transition-all shadow-sm"
                    >
                      View Test Kits
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Choose */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center mb-10">
            How We Choose Our Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="text-2xl mb-3">🏅</div>
              <h3 className="font-bold text-gray-900 mb-2">NSF Certification</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We prioritise filters with NSF/ANSI certifications (Standards 42,
                53, 58, 401, and P473 for PFAS). NSF certification means the
                filter has been independently tested by a third-party lab to
                verify its contaminant removal claims.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="text-2xl mb-3">🔬</div>
              <h3 className="font-bold text-gray-900 mb-2">Independent Lab Testing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Beyond NSF, we look for filters that publish independent
                third-party lab results showing specific contaminant removal
                percentages. Transparency about testing methodology matters more
                than marketing claims.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Contaminant Removal Data</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We match filters to specific contaminants. A filter that removes
                chlorine taste may not remove PFAS or lead. Our recommendations
                are based on what each filter actually removes, verified by test
                data, not just what the label suggests.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="text-2xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">Total Cost of Ownership</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The sticker price is only part of the cost. We factor in
                replacement filter costs, filter lifespan, and flow rate to
                give you a realistic picture of what each system will cost over
                time. A cheap pitcher with expensive filters may cost more than
                a pricier system in the long run.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
            Start with your water report
          </h2>
          <p className="text-gray-500 mb-8">
            Enter your ZIP code to see what contaminants are in your water, then
            come back here to find the right filter.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-600 transition-all shadow-md"
          >
            Check Your Water Quality
          </Link>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Affiliate Disclosure:</span>{" "}
              Some links on this page are affiliate links, meaning we may earn a
              small commission if you purchase through them at no extra cost to
              you. This helps keep TapWaterScore free. We only recommend filters
              backed by independent testing data.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
