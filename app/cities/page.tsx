import { Metadata } from "next";
import Link from "next/link";
import { CITIES_BY_STATE, STATES_WITH_CITIES } from "@/lib/cities";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Water Quality by City - Tap Water Reports for 200+ US Cities | TapWaterScore",
  description:
    "Check tap water quality for over 200 major US cities. See water sources, common contaminants, EPA violations, and water quality scores. Free reports by ZIP code.",
};

// Display names for state slugs
const STATE_NAMES: Record<string, string> = {
  alabama: "Alabama", alaska: "Alaska", arizona: "Arizona", arkansas: "Arkansas",
  california: "California", colorado: "Colorado", connecticut: "Connecticut",
  delaware: "Delaware", "district-of-columbia": "District of Columbia",
  florida: "Florida", georgia: "Georgia", hawaii: "Hawaii", idaho: "Idaho",
  illinois: "Illinois", indiana: "Indiana", iowa: "Iowa", kansas: "Kansas",
  kentucky: "Kentucky", louisiana: "Louisiana", maine: "Maine", maryland: "Maryland",
  massachusetts: "Massachusetts", michigan: "Michigan", minnesota: "Minnesota",
  mississippi: "Mississippi", missouri: "Missouri", montana: "Montana",
  nebraska: "Nebraska", nevada: "Nevada", "new-hampshire": "New Hampshire",
  "new-jersey": "New Jersey", "new-mexico": "New Mexico", "new-york": "New York",
  "north-carolina": "North Carolina", "north-dakota": "North Dakota",
  ohio: "Ohio", oklahoma: "Oklahoma", oregon: "Oregon", pennsylvania: "Pennsylvania",
  "rhode-island": "Rhode Island", "south-carolina": "South Carolina",
  "south-dakota": "South Dakota", tennessee: "Tennessee", texas: "Texas",
  utah: "Utah", vermont: "Vermont", virginia: "Virginia", washington: "Washington",
  "west-virginia": "West Virginia", wisconsin: "Wisconsin", wyoming: "Wyoming",
};

export default function CitiesPage() {
  const totalCities = Object.values(CITIES_BY_STATE).reduce(
    (sum, cities) => sum + cities.length,
    0
  );

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
              by City
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Explore tap water quality for {totalCities}+ major US cities. See
            water sources, common contaminants, and get a free water quality
            report for your ZIP code.
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

      {/* Cities by State */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-10">
            {STATES_WITH_CITIES.map((stateSlug) => {
              const cities = CITIES_BY_STATE[stateSlug];
              const stateName = STATE_NAMES[stateSlug] || stateSlug;

              return (
                <div key={stateSlug}>
                  <div className="flex items-center gap-3 mb-4">
                    <Link
                      href={`/states/${stateSlug}`}
                      className="text-lg md:text-xl font-extrabold text-gray-900 hover:text-teal-700 transition-colors"
                    >
                      {stateName}
                    </Link>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {cities.length} {cities.length === 1 ? "city" : "cities"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {cities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/cities/${city.stateSlug}/${city.slug}`}
                        className="group bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
                      >
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-teal-700 transition-colors truncate">
                          {city.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          Pop. ~{city.population}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="relative py-16 md:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight">
              Why water quality varies from city to city
            </h2>
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p>
                Two cities in the same state can have dramatically different
                tap water quality. The reasons come down to three main factors:
                where the water comes from, how it is treated, and how it
                reaches your tap.
              </p>
              <p>
                Water source is the biggest variable. Cities drawing from
                protected mountain reservoirs or deep aquifers generally start
                with cleaner water than those pulling from rivers that carry
                agricultural and industrial runoff. For example, New York City
                and Portland, Oregon both benefit from pristine mountain
                watersheds, while cities along the Ohio or Mississippi Rivers
                must treat water carrying upstream pollution.
              </p>
              <p>
                Treatment technology matters too. Some cities have invested
                billions in advanced treatment, including granular activated
                carbon, ozone disinfection, and reverse osmosis. Others,
                particularly smaller or financially stressed systems, may rely
                on more basic treatment that meets minimum standards but does
                not remove all contaminants of concern.
              </p>
              <p>
                Finally, the distribution system between the treatment plant
                and your faucet can introduce contaminants. Lead service lines,
                corroding iron mains, and cross-connections can all affect
                water quality at the tap, even when the treated water leaving
                the plant is clean. Cities with older infrastructure face
                the greatest challenges in this area.
              </p>
              <h3 className="text-lg font-bold text-white pt-2">
                Check your specific water
              </h3>
              <p>
                City-level information provides useful context, but the best
                way to know what is in your tap water is to{" "}
                <Link
                  href="/"
                  className="text-teal-400 hover:text-teal-300 underline underline-offset-2"
                >
                  look up your ZIP code
                </Link>{" "}
                for a report based on your specific water system. Water quality
                can vary between neighborhoods served by different water
                systems or distribution mains.
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
            Enter your ZIP code for a free water quality report specific to
            your address.
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
