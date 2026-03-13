import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Water Quality by State | TapWaterScore",
  description:
    "Explore tap water quality across all 50 US states and DC. See water systems, violations, contaminant data, and water quality scores for every state.",
};

const STATES = [
  { name: "Alabama", abbr: "AL", slug: "alabama" },
  { name: "Alaska", abbr: "AK", slug: "alaska" },
  { name: "Arizona", abbr: "AZ", slug: "arizona" },
  { name: "Arkansas", abbr: "AR", slug: "arkansas" },
  { name: "California", abbr: "CA", slug: "california" },
  { name: "Colorado", abbr: "CO", slug: "colorado" },
  { name: "Connecticut", abbr: "CT", slug: "connecticut" },
  { name: "Delaware", abbr: "DE", slug: "delaware" },
  { name: "District of Columbia", abbr: "DC", slug: "district-of-columbia" },
  { name: "Florida", abbr: "FL", slug: "florida" },
  { name: "Georgia", abbr: "GA", slug: "georgia" },
  { name: "Hawaii", abbr: "HI", slug: "hawaii" },
  { name: "Idaho", abbr: "ID", slug: "idaho" },
  { name: "Illinois", abbr: "IL", slug: "illinois" },
  { name: "Indiana", abbr: "IN", slug: "indiana" },
  { name: "Iowa", abbr: "IA", slug: "iowa" },
  { name: "Kansas", abbr: "KS", slug: "kansas" },
  { name: "Kentucky", abbr: "KY", slug: "kentucky" },
  { name: "Louisiana", abbr: "LA", slug: "louisiana" },
  { name: "Maine", abbr: "ME", slug: "maine" },
  { name: "Maryland", abbr: "MD", slug: "maryland" },
  { name: "Massachusetts", abbr: "MA", slug: "massachusetts" },
  { name: "Michigan", abbr: "MI", slug: "michigan" },
  { name: "Minnesota", abbr: "MN", slug: "minnesota" },
  { name: "Mississippi", abbr: "MS", slug: "mississippi" },
  { name: "Missouri", abbr: "MO", slug: "missouri" },
  { name: "Montana", abbr: "MT", slug: "montana" },
  { name: "Nebraska", abbr: "NE", slug: "nebraska" },
  { name: "Nevada", abbr: "NV", slug: "nevada" },
  { name: "New Hampshire", abbr: "NH", slug: "new-hampshire" },
  { name: "New Jersey", abbr: "NJ", slug: "new-jersey" },
  { name: "New Mexico", abbr: "NM", slug: "new-mexico" },
  { name: "New York", abbr: "NY", slug: "new-york" },
  { name: "North Carolina", abbr: "NC", slug: "north-carolina" },
  { name: "North Dakota", abbr: "ND", slug: "north-dakota" },
  { name: "Ohio", abbr: "OH", slug: "ohio" },
  { name: "Oklahoma", abbr: "OK", slug: "oklahoma" },
  { name: "Oregon", abbr: "OR", slug: "oregon" },
  { name: "Pennsylvania", abbr: "PA", slug: "pennsylvania" },
  { name: "Rhode Island", abbr: "RI", slug: "rhode-island" },
  { name: "South Carolina", abbr: "SC", slug: "south-carolina" },
  { name: "South Dakota", abbr: "SD", slug: "south-dakota" },
  { name: "Tennessee", abbr: "TN", slug: "tennessee" },
  { name: "Texas", abbr: "TX", slug: "texas" },
  { name: "Utah", abbr: "UT", slug: "utah" },
  { name: "Vermont", abbr: "VT", slug: "vermont" },
  { name: "Virginia", abbr: "VA", slug: "virginia" },
  { name: "Washington", abbr: "WA", slug: "washington" },
  { name: "West Virginia", abbr: "WV", slug: "west-virginia" },
  { name: "Wisconsin", abbr: "WI", slug: "wisconsin" },
  { name: "Wyoming", abbr: "WY", slug: "wyoming" },
];

export default function StatesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Water Quality{" "}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
              by State
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Explore tap water quality across the United States. Select your
            state to see water systems, violations, and contaminant data.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* State Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200/60 rounded-lg flex items-center justify-center text-sm font-bold text-teal-600 group-hover:from-teal-100 group-hover:to-cyan-100 transition-colors">
                    {state.abbr}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-teal-700 transition-colors">
                      {state.name}
                    </p>
                    <p className="text-xs text-gray-400">View water quality</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="relative py-16 md:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight">
              How water quality varies across the US
            </h2>
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p>
                Tap water quality in the United States varies significantly from
                state to state. Some states consistently meet or exceed EPA
                standards, while others face ongoing challenges with
                contaminants, aging infrastructure, and regulatory enforcement.
                Understanding how your state compares can help you make informed
                decisions about your drinking water.
              </p>
              <p>
                Several key factors determine the quality of tap water in any
                given state. Infrastructure age plays a major role; states with
                older water systems are more likely to have lead pipes,
                corroding distribution networks, and treatment facilities that
                struggle to keep up with modern contaminant standards. Cities
                like Flint, Michigan demonstrated how aging infrastructure can
                create serious public health crises.
              </p>
              <p>
                Agricultural runoff is another significant factor. States with
                large farming operations often see elevated levels of nitrates,
                pesticides, and herbicides in their water supply. The Midwest
                and Great Plains states are particularly affected, where
                fertilizer and animal waste can seep into groundwater and
                surface water sources used for drinking water.
              </p>
              <p>
                Industrial pollution, both historical and ongoing, affects water
                quality in many states. PFAS contamination from military bases,
                manufacturing facilities, and firefighting foam has been
                detected in water systems across the country. States with heavy
                industrial histories, such as New Jersey, Michigan, and North
                Carolina, often face elevated levels of these persistent
                chemicals.
              </p>
              <p>
                Natural geology also shapes water quality. Arsenic occurs
                naturally in groundwater across the Southwest and parts of New
                England. Radon, uranium, and other naturally occurring
                contaminants vary by region based on the underlying rock and
                soil composition.
              </p>
              <h3 className="text-lg font-bold text-white pt-2">
                Check your specific water quality
              </h3>
              <p>
                While state-level data provides useful context, water quality
                can vary dramatically between cities, counties, and even
                neighbourhoods within the same state. The best way to understand
                what is in your tap water is to{" "}
                <Link href="/" className="text-teal-400 hover:text-teal-300 underline underline-offset-2">
                  look up your ZIP code
                </Link>{" "}
                for a personalised water quality report based on your specific
                water system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
            Know your water
          </h2>
          <p className="text-gray-500 mb-6">
            Enter your ZIP code for a free water quality report specific to your
            address.
          </p>
          <div className="flex justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Check Your Water Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
