import { Metadata } from "next";
import Link from "next/link";
import ZipLookup from "@/components/ZipLookup";
import { notFound } from "next/navigation";
import { CITIES, CITY_BY_SLUG, CITIES_BY_STATE } from "@/lib/cities";

type Params = Promise<{ state: string; city: string }>;

export function generateStaticParams() {
  return CITIES.map((c) => ({ state: c.stateSlug, city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { state, city: citySlug } = await params;
  const cityData = CITY_BY_SLUG[`${state}/${citySlug}`];
  if (!cityData) return {};

  return {
    title: `Tap Water Quality in ${cityData.name}, ${cityData.stateAbbr} - Water Report | TapWaterScore`,
    description: `Is ${cityData.name}, ${cityData.state} tap water safe? Check water quality, contaminants, EPA violations, and water scores. Free report for ${cityData.name} ZIP codes.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Params;
}) {
  const { state, city: citySlug } = await params;
  const cityData = CITY_BY_SLUG[`${state}/${citySlug}`];

  if (!cityData) {
    notFound();
  }

  // Get nearby cities data
  const nearbyCities = cityData.nearbyCities
    .map((slug) => CITY_BY_SLUG[slug])
    .filter(Boolean)
    .slice(0, 6);

  // Get other cities in the same state (excluding current)
  const stateCities = (CITIES_BY_STATE[state] || [])
    .filter((c) => c.slug !== citySlug)
    .slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Link
              href="/cities"
              className="px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm font-medium hover:bg-teal-500/20 transition-colors"
            >
              All Cities
            </Link>
            <span className="text-gray-500">/</span>
            <Link
              href={`/states/${cityData.stateSlug}`}
              className="px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm font-medium hover:bg-teal-500/20 transition-colors"
            >
              {cityData.state}
            </Link>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Tap Water Quality in{" "}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
              {cityData.name}, {cityData.stateAbbr}
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Find out what&apos;s in your drinking water. Enter your ZIP code
            below for a detailed water quality report for {cityData.name},{" "}
            {cityData.state}.
          </p>
          <div className="flex justify-center">
            <ZipLookup />
          </div>
          <p className="mt-4 text-sm text-gray-400/80">
            Try <span className="text-teal-400/80 font-medium">{cityData.zip}</span> for{" "}
            {cityData.name}
          </p>
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

      {/* City Overview */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200/60 rounded-xl flex items-center justify-center text-lg font-bold text-teal-600">
                {cityData.stateAbbr}
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {cityData.name} Drinking Water Overview
                </h2>
                <p className="text-sm text-gray-500">
                  Population: ~{cityData.population} | Source: {cityData.waterSource}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {cityData.overview}
            </p>
          </div>
        </div>
      </section>

      {/* Key Concerns */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 text-center">
            Common water quality concerns in {cityData.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cityData.concerns.map((concern) => (
              <div
                key={concern}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5 w-8 h-8 bg-amber-50 border border-amber-200/60 rounded-lg flex items-center justify-center text-sm">
                    ⚠️
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                      {concern}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Enter your ZIP code above to see if this contaminant
                      has been detected in your specific water system.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 text-center">
            What&apos;s in your {cityData.name} water report
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🔬",
                title: "Contaminant levels",
                desc: `Every detected contaminant in your ${cityData.name} water system, compared to EPA limits and health guidelines.`,
              },
              {
                icon: "⚠️",
                title: "Violation history",
                desc: `All EPA violations on record for water systems serving ${cityData.name}, including health-based and monitoring violations.`,
              },
              {
                icon: "📊",
                title: "Water quality grade",
                desc: "An A through F grade based on violation history, contaminant levels, and health guideline comparisons.",
              },
              {
                icon: "💧",
                title: "Filter recommendations",
                desc: "Which type of water filter will actually remove the contaminants found in your specific water system.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-50 rounded-xl border border-gray-200 p-5"
              >
                <span className="text-2xl block mb-2">{item.icon}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Helpful Resources */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4 text-center">
            Protect your water quality
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/filters"
              className="group bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
            >
              <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-teal-700 transition-colors">
                Water Filter Guide
              </h3>
              <p className="text-xs text-gray-500">
                Find the right filter for contaminants in {cityData.name} water.
                Compare pitcher, under-sink, and whole-house options.
              </p>
            </Link>
            <Link
              href="/testing"
              className="group bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
            >
              <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-teal-700 transition-colors">
                Water Testing Guide
              </h3>
              <p className="text-xs text-gray-500">
                Learn how to test your {cityData.name} tap water at home.
                Lab testing kits and DIY options compared.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      {nearbyCities.length > 0 && (
        <section className="py-8 md:py-12 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4 text-center">
              Water quality in nearby cities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nearbyCities.map((nearby) => (
                <Link
                  key={`${nearby.stateSlug}/${nearby.slug}`}
                  href={`/cities/${nearby.stateSlug}/${nearby.slug}`}
                  className="group bg-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-teal-300 transition-all"
                >
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-teal-700 transition-colors truncate">
                    {nearby.name}
                  </p>
                  <p className="text-xs text-gray-400">{nearby.state}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Cities in State */}
      {stateCities.length > 0 && (
        <section className="py-8 md:py-12 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4 text-center">
              Other cities in {cityData.state}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stateCities.map((sc) => (
                <Link
                  key={sc.slug}
                  href={`/cities/${sc.stateSlug}/${sc.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md hover:border-teal-300 transition-all text-center"
                >
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-teal-700 transition-colors truncate">
                    {sc.name}
                  </p>
                </Link>
              ))}
            </div>
            <p className="text-center mt-4">
              <Link
                href={`/states/${cityData.stateSlug}`}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2"
              >
                View all {cityData.state} water quality info
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
            Check your {cityData.name} water now
          </h2>
          <p className="text-gray-500 mb-8">
            Enter your ZIP code for a free water quality report specific to
            your water system in {cityData.name}, {cityData.state}.
          </p>
          <div className="flex justify-center">
            <ZipLookup />
          </div>
        </div>
      </section>

      {/* Browse Links */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-gray-500">
            <Link
              href="/cities"
              className="text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2"
            >
              Browse all cities
            </Link>
            {" · "}
            <Link
              href={`/states/${cityData.stateSlug}`}
              className="text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2"
            >
              {cityData.state} water quality
            </Link>
            {" · "}
            <Link
              href="/states"
              className="text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2"
            >
              All states
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
