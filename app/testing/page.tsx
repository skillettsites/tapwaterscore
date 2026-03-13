import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Water Testing Kits - Test Your Tap Water at Home",
  description:
    "Get your tap water professionally tested at home. Recommended testing kits for lead, PFAS, and 200+ contaminants. Lab-certified results in days, not weeks.",
};

const KITS = [
  {
    name: "Essential Water Test",
    price: "$30",
    badge: "Best for basics",
    badgeColor: "bg-teal-100 text-teal-700",
    contaminants: "50+",
    description:
      "A solid starting point for anyone curious about their water quality. Screens for the most common contaminants including lead, copper, bacteria, nitrates, and hardness.",
    highlights: [
      "50+ contaminants tested",
      "Lead and copper screening",
      "Bacteria and nitrates",
      "Water hardness and pH",
      "Lab-certified results",
    ],
    url: "https://www.tapscore.com/products/essential-water-test",
  },
  {
    name: "Extended Water Test",
    price: "$160",
    badge: "Most popular",
    badgeColor: "bg-cyan-100 text-cyan-700",
    contaminants: "100+",
    description:
      "A thorough analysis covering metals, pesticides, and some PFAS compounds. Recommended for older homes, well water, or anyone who wants a more complete picture.",
    highlights: [
      "100+ contaminants tested",
      "Heavy metals and pesticides",
      "Select PFAS compounds",
      "Volatile organic compounds",
      "Detailed health risk summary",
    ],
    url: "https://www.tapscore.com/products/extended-water-test",
  },
  {
    name: "Advanced Water Test",
    price: "$290",
    badge: "Most comprehensive",
    badgeColor: "bg-purple-100 text-purple-700",
    contaminants: "200+",
    description:
      "The most comprehensive home water test available. Covers every major contaminant category including the full range of PFAS compounds. Ideal for families, pregnant women, and anyone who wants total confidence in their water.",
    highlights: [
      "200+ contaminants tested",
      "Full PFAS panel (all compounds)",
      "Radioactive contaminants",
      "Complete pesticide screening",
      "Personalised filtration plan",
    ],
    url: "https://www.tapscore.com/products/advanced-water-test",
  },
  {
    name: "PFAS Water Test",
    price: "$200",
    badge: "PFAS focused",
    badgeColor: "bg-red-100 text-red-700",
    contaminants: "30+",
    description:
      "Targeted testing for PFAS (forever chemicals) including PFOA, PFOS, and dozens of other compounds. If PFAS is your primary concern, this is the test to get.",
    highlights: [
      "30+ PFAS compounds",
      "Includes PFOA and PFOS",
      "Tests against new EPA limits",
      "GenX and other emerging PFAS",
      "Clear pass/fail for each compound",
    ],
    url: "https://www.tapscore.com/products/pfas-water-test",
  },
];

const FAQS = [
  {
    q: "How is a home water test different from the EPA data on TapWaterScore?",
    a: "TapWaterScore shows you system-level data collected by your water utility at the treatment plant or distribution points. A home water test measures what is actually coming out of your specific tap, after water has traveled through your local pipes, fixtures, and plumbing. If you have older pipes or live far from the treatment plant, results can differ significantly.",
  },
  {
    q: "How do I collect a water sample?",
    a: "Tap Score sends you everything you need: pre-labelled sample vials, clear instructions, and a prepaid return shipping label. You simply fill the vials from your tap following the instructions (usually a cold water tap that has been running for 30 seconds) and drop the package in the mail.",
  },
  {
    q: "How long does it take to get results?",
    a: "Most results are delivered within 3 to 5 business days after the lab receives your sample. You will get an email notification when your results are ready, and you can view them online through a secure dashboard.",
  },
  {
    q: "Do I need to test if my water system has no violations?",
    a: "A clean system-level report is a good sign, but it does not guarantee what comes out of your tap. Lead can leach from service lines and household plumbing. Copper can dissolve from pipes and fittings. These issues are specific to your home and would not show up in your utility's testing.",
  },
  {
    q: "Is Tap Score a certified laboratory?",
    a: "Yes. Tap Score tests are processed by SimpleLab's network of ISO/IEC 17025 accredited and state-certified laboratories across the United States. All results are lab-certified and legally defensible.",
  },
  {
    q: "Should I test my well water?",
    a: "Absolutely. Private wells are not monitored by the EPA or any government agency. The CDC recommends testing well water at least once a year for bacteria, nitrates, and any contaminants of local concern. If you have a well, testing is the only way to know what is in your water.",
  },
  {
    q: "Which test should I choose?",
    a: "For most people, the Essential Water Test is a great starting point. If you have older pipes, live near industrial or agricultural areas, or have specific health concerns, the Extended or Advanced test will give you a more complete picture. If PFAS is your primary concern, choose the dedicated PFAS test.",
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

export default function TestingPage() {
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
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm font-medium">
            Lab-certified home water testing
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Get Your Water{" "}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
              Professionally Tested
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-6">
            EPA data shows what your water system reports at the treatment plant.
            A home water test shows what is actually coming out of your tap.
            Old pipes, local plumbing, and distance from the plant can all change
            what ends up in your glass.
          </p>
          <a
            href="#kits"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow text-sm"
          >
            View Testing Kits
            <span aria-hidden="true">&darr;</span>
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Why Test Your Water */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Why test your water?
            </h2>
            <p className="mt-3 text-base text-gray-500 max-w-lg mx-auto">
              System-level data is a useful starting point, but it does not tell the whole story.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200/80">
              <span className="text-3xl block mb-3">🏭</span>
              <h3 className="font-bold text-gray-900 text-sm mb-2">EPA monitors at the plant, not your tap</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Water quality data from the EPA reflects testing at the treatment facility or distribution
                points. By the time water reaches your faucet, it has traveled through miles of pipes
                that may introduce additional contaminants.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200/80">
              <span className="text-3xl block mb-3">🔧</span>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Old pipes add lead, copper, and more</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Homes built before 1986 may have lead solder in their plumbing. Lead service lines
                are still common in many cities. Copper pipes can also leach into water, especially
                if it sits in the pipes overnight.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200/80">
              <span className="text-3xl block mb-3">🪨</span>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Private wells have no EPA monitoring</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                About 43 million Americans rely on private wells. These are completely unregulated
                by the EPA, meaning no one is testing them unless you do it yourself. Bacteria,
                nitrates, and heavy metals are common well water concerns.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200/80">
              <span className="text-3xl block mb-3">🧪</span>
              <h3 className="font-bold text-gray-900 text-sm mb-2">PFAS and emerging contaminants</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                PFAS, microplastics, and pharmaceutical residues are increasingly found in drinking
                water. The EPA only finalized its first PFAS limits in 2024, and many water systems
                are still catching up on testing. A home test can fill in the gaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Testing Kits */}
      <section id="kits" className="py-16 md:py-24 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Recommended testing kits
            </h2>
            <p className="mt-3 text-base text-gray-500 max-w-xl mx-auto">
              We recommend Tap Score by SimpleLab. Order online, collect a sample at home,
              mail it back, and get lab-certified results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {KITS.map((kit) => (
              <div
                key={kit.name}
                className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${kit.badgeColor}`}>
                      {kit.badge}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg mt-2">{kit.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-gray-900">{kit.price}</p>
                    <p className="text-xs text-gray-500">{kit.contaminants} contaminants</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{kit.description}</p>
                <ul className="space-y-1.5 mb-6 flex-grow">
                  {kit.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-teal-500 text-xs">&#10003;</span>
                      {h}
                    </li>
                  ))}
                </ul>
                {/* AFFILIATE: swap URL when approved */}
                <a
                  href={kit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-shadow text-sm"
                >
                  Order Test
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              How it works
            </h2>
          </div>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Order your kit online",
                desc: "Choose the test that fits your needs. Tap Score ships a sample collection kit directly to your door with everything you need.",
              },
              {
                step: "2",
                title: "Collect your sample",
                desc: "Follow the simple instructions to fill the pre-labelled vials from your tap. Takes about two minutes.",
              },
              {
                step: "3",
                title: "Mail it back",
                desc: "Drop the prepaid return package in the mail. No trip to the post office needed; just use your mailbox or any USPS drop-off.",
              },
              {
                step: "4",
                title: "Get your results",
                desc: "Receive lab-certified results in 3 to 5 business days. Your report includes a clear breakdown of every contaminant tested, health context, and filtration recommendations.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Test */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              When should you test?
            </h2>
            <p className="mt-3 text-base text-gray-500 max-w-lg mx-auto">
              Some situations call for testing more than others. Here are the most common reasons people test their water.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "🏠",
                title: "Moving to a new home",
                desc: "You do not know the plumbing history. Test before you settle in.",
              },
              {
                icon: "🔧",
                title: "Old or unknown plumbing",
                desc: "Homes built before 1986 may have lead solder. Homes before 1950 may have lead pipes.",
              },
              {
                icon: "⚠️",
                title: "After a system violation",
                desc: "If your water system has a recent EPA violation, test to see how your tap is affected.",
              },
              {
                icon: "🪨",
                title: "Well water",
                desc: "Private wells should be tested at least once a year. The CDC recommends annual testing for bacteria and nitrates.",
              },
              {
                icon: "👶",
                title: "Pregnancy or infants",
                desc: "Lead and nitrates are especially dangerous for developing children. Testing gives you peace of mind.",
              },
              {
                icon: "🔄",
                title: "Change in taste or smell",
                desc: "If your water suddenly tastes, smells, or looks different, testing can identify the cause.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80"
              >
                <span className="text-3xl block mb-3">{item.icon}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white rounded-xl border border-gray-200 p-5"
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

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
            Not sure if you need a test?
          </h2>
          <p className="text-gray-500 mb-8">
            Start with your free water quality report. If your area has violations or
            elevated contaminant levels, a home test can confirm whether your tap is affected.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow text-sm"
          >
            Check Your ZIP Code Free
          </Link>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="py-8 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            <strong className="text-gray-500">Affiliate disclosure:</strong> Some links on this page are
            affiliate links. If you purchase a water testing kit through these links, TapWaterScore may
            earn a small commission at no extra cost to you. We only recommend products we genuinely
            believe are useful. Our editorial content is not influenced by affiliate partnerships.
          </p>
        </div>
      </section>
    </>
  );
}
