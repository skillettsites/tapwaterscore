import { Metadata } from "next";
import ZipLookup from "@/components/ZipLookup";

export const metadata: Metadata = {
  title: "TapWaterScore - Check Your Tap Water Quality by ZIP Code",
  description:
    "Free tap water quality report for any US ZIP code. See what contaminants are in your drinking water, health risks, and which filters remove them. Powered by EPA data.",
};

const FEATURES = [
  {
    icon: "🔬",
    title: "Contaminant breakdown",
    desc: "Every detected contaminant in your water system, compared against EPA legal limits and health guidelines. We show you what the numbers actually mean.",
  },
  {
    icon: "📊",
    title: "Water quality grade",
    desc: "Your water system scored A through F based on violation history, contaminant levels, and how they compare to health-based guidelines.",
  },
  {
    icon: "⚠️",
    title: "Violation history",
    desc: "Every EPA violation on record for your water system. Health-based violations, monitoring failures, and enforcement actions.",
  },
  {
    icon: "🏥",
    title: "Health risk context",
    desc: "What each contaminant means for your health. We explain the risks in plain language, with specific concerns for children and pregnant women.",
  },
  {
    icon: "💧",
    title: "Filter recommendations",
    desc: "Which type of filter actually removes the contaminants found in your water. Not all filters work for all contaminants.",
  },
  {
    icon: "📈",
    title: "Trend tracking",
    desc: "Is your water getting better or worse? We track changes over time so you can see if problems are being addressed.",
  },
];

const FAQS = [
  {
    q: "Where does the data come from?",
    a: "All data comes from the EPA Safe Drinking Water Information System (SDWIS), which tracks every public water system in the United States. This is the same data that your water utility is required by law to report to the EPA. We update our database quarterly.",
  },
  {
    q: "Is TapWaterScore free?",
    a: "The basic water quality grade and top contaminant summary is completely free. We also offer a detailed report with full contaminant breakdown, health risk analysis, and personalised filter recommendations.",
  },
  {
    q: "How accurate is the data?",
    a: "We use the same EPA data that water utilities are legally required to report. However, this data reflects testing done by your water system, typically updated annually. Conditions at your specific tap may differ from the system-wide results, especially if you have older pipes.",
  },
  {
    q: "Does this cover well water?",
    a: "No. Private wells are not regulated by the EPA and are not included in the SDWIS database. If you rely on a private well, we recommend getting your water tested by a certified lab. We can help you find one in your area.",
  },
  {
    q: "What about PFAS (forever chemicals)?",
    a: "PFAS testing data is expanding rapidly. The EPA finalized the first national PFAS drinking water standards in 2024, and we include all available PFAS data from the EPA's monitoring programs. Many water systems are being tested for PFAS for the first time.",
  },
  {
    q: "Why does my water score poorly if it meets legal limits?",
    a: "EPA legal limits (Maximum Contaminant Levels) are set based on what is feasible, not just what is safe. Many health organizations, including the EWG, have set stricter health-based guidelines. We compare against both so you can make an informed decision.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-28 text-center">
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm font-medium">
            Free water quality report
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            What&apos;s really in<br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
              your tap water?
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-8">
            Enter your ZIP code to see contaminants, health risks, and
            violations for your water system. Powered by EPA data.
          </p>
          <div className="flex justify-center">
            <ZipLookup autoFocus />
          </div>
          <p className="mt-4 text-sm text-gray-400/80">
            Covers all 50 states. 150,000+ public water systems. Updated quarterly.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Key stats */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-gray-900">87%</p>
              <p className="text-sm text-gray-500 mt-1">of Americans worried about water</p>
              <p className="text-xs text-red-600 font-medium mt-0.5">Up from 73% in 2021</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-gray-900">176M</p>
              <p className="text-sm text-gray-500 mt-1">Americans exposed to PFAS</p>
              <p className="text-xs text-red-600 font-medium mt-0.5">&quot;Forever chemicals&quot; in drinking water</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-gray-900">150K+</p>
              <p className="text-sm text-gray-500 mt-1">Water systems tracked</p>
              <p className="text-xs text-teal-600 font-medium mt-0.5">Every public system in the US</p>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              More than just a water report
            </h2>
            <p className="mt-3 text-base text-gray-500 max-w-lg mx-auto">
              We turn raw EPA data into clear, actionable information about your drinking water.
            </p>
          </div>

          {/* Free vs Premium */}
          <div className="max-w-2xl mx-auto mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 p-5">
                <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">FREE</span>
                <p className="text-xs text-gray-400 mt-1 mb-3">No sign-up needed</p>
                <ul className="space-y-1.5">
                  {[
                    "Water quality grade (A-F)",
                    "Top 5 contaminants",
                    "Violation count",
                    "System information",
                    "Basic health risks",
                    "State comparison",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500 text-xs">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-md border border-teal-200/80 p-5">
                <span className="inline-block px-2.5 py-0.5 bg-gradient-to-r from-teal-500 to-cyan-400 text-white rounded-full text-xs font-bold">DETAILED</span>
                <p className="text-xs text-gray-500 mt-1 mb-3">$4.99 one-time</p>
                <p className="text-xs text-gray-500 mb-2">Everything free, plus:</p>
                <ul className="space-y-1.5">
                  {[
                    "Full contaminant report",
                    "Health risk breakdown",
                    "PFAS analysis",
                    "Filter recommendations",
                    "Historical trends",
                    "Downloadable PDF",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-medium text-gray-800">
                      <span className="text-teal-500 text-xs">&#9733;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-5 bg-white rounded-2xl shadow-md border border-gray-200/80 hover:shadow-lg transition-shadow"
              >
                <span className="text-3xl block mb-3">{f.icon}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              How it works
            </h2>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Enter your ZIP code</h3>
                <p className="text-gray-600 text-sm">Type in any US ZIP code to find the water systems that serve your area.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900">We pull the EPA data</h3>
                <p className="text-gray-600 text-sm">We check the EPA SDWIS database for violations, contaminant levels, and system information. Every regulated contaminant is included.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Get your water score</h3>
                <p className="text-gray-600 text-sm">See your water quality grade, top contaminants, health risks, and which filters will actually help. All in plain English.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PFAS section */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200/60 p-8 md:p-12">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🧪</span>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                  PFAS: The &quot;forever chemicals&quot; crisis
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  PFAS (per- and polyfluoroalkyl substances) have been found in the drinking
                  water of 176 million Americans. These synthetic chemicals don&apos;t break down
                  in the environment and have been linked to cancer, thyroid disease,
                  immune system effects, and developmental issues in children.
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  In April 2024, the EPA set the first-ever national limits for PFAS in
                  drinking water. Many water systems are being tested for the first time.
                  TapWaterScore includes all available PFAS data from EPA monitoring programs.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">9,728 contaminated sites</span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">15,000+ lawsuits filed</span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Linked to 6+ cancer types</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-gray-50 rounded-xl border border-gray-200 p-5"
              >
                <summary className="font-semibold text-sm text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform text-xs">&#9660;</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="relative py-16 md:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight">
              Why check your tap water quality?
            </h2>
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p>
                The EPA regulates over 90 contaminants in US drinking water, but
                legal limits are not always the same as safe levels. Many
                Maximum Contaminant Levels (MCLs) were set decades ago and have
                not been updated to reflect current scientific understanding.
              </p>
              <p>
                Your water utility is required to publish an annual Consumer
                Confidence Report, but these documents are often dozens of pages
                long, filled with technical jargon, and published as PDFs buried
                deep on municipal websites. Most people never read them.
              </p>
              <p>
                TapWaterScore takes the official EPA data for your water system
                and presents it in a clear, simple format. We tell you what
                contaminants were found, whether they exceed health guidelines,
                and what type of water filter will actually remove them. No
                jargon, no scare tactics, just facts you can act on.
              </p>
              <p>
                With PFAS contamination affecting 176 million Americans and
                lead concerns rising to their highest level since 2001,
                understanding your water quality has never been more important.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
            Check your water now
          </h2>
          <p className="text-gray-500 mb-8">
            Enter any US ZIP code to get your free water quality report.
          </p>
          <div className="flex justify-center">
            <ZipLookup />
          </div>
        </div>
      </section>
    </>
  );
}
