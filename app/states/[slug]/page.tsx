import { Metadata } from "next";
import Link from "next/link";
import ZipLookup from "@/components/ZipLookup";
import { notFound } from "next/navigation";

export const revalidate = 86400;

const STATES: Record<
  string,
  { name: string; abbr: string; slug: string }
> = {
  alabama: { name: "Alabama", abbr: "AL", slug: "alabama" },
  alaska: { name: "Alaska", abbr: "AK", slug: "alaska" },
  arizona: { name: "Arizona", abbr: "AZ", slug: "arizona" },
  arkansas: { name: "Arkansas", abbr: "AR", slug: "arkansas" },
  california: { name: "California", abbr: "CA", slug: "california" },
  colorado: { name: "Colorado", abbr: "CO", slug: "colorado" },
  connecticut: { name: "Connecticut", abbr: "CT", slug: "connecticut" },
  delaware: { name: "Delaware", abbr: "DE", slug: "delaware" },
  "district-of-columbia": { name: "District of Columbia", abbr: "DC", slug: "district-of-columbia" },
  florida: { name: "Florida", abbr: "FL", slug: "florida" },
  georgia: { name: "Georgia", abbr: "GA", slug: "georgia" },
  hawaii: { name: "Hawaii", abbr: "HI", slug: "hawaii" },
  idaho: { name: "Idaho", abbr: "ID", slug: "idaho" },
  illinois: { name: "Illinois", abbr: "IL", slug: "illinois" },
  indiana: { name: "Indiana", abbr: "IN", slug: "indiana" },
  iowa: { name: "Iowa", abbr: "IA", slug: "iowa" },
  kansas: { name: "Kansas", abbr: "KS", slug: "kansas" },
  kentucky: { name: "Kentucky", abbr: "KY", slug: "kentucky" },
  louisiana: { name: "Louisiana", abbr: "LA", slug: "louisiana" },
  maine: { name: "Maine", abbr: "ME", slug: "maine" },
  maryland: { name: "Maryland", abbr: "MD", slug: "maryland" },
  massachusetts: { name: "Massachusetts", abbr: "MA", slug: "massachusetts" },
  michigan: { name: "Michigan", abbr: "MI", slug: "michigan" },
  minnesota: { name: "Minnesota", abbr: "MN", slug: "minnesota" },
  mississippi: { name: "Mississippi", abbr: "MS", slug: "mississippi" },
  missouri: { name: "Missouri", abbr: "MO", slug: "missouri" },
  montana: { name: "Montana", abbr: "MT", slug: "montana" },
  nebraska: { name: "Nebraska", abbr: "NE", slug: "nebraska" },
  nevada: { name: "Nevada", abbr: "NV", slug: "nevada" },
  "new-hampshire": { name: "New Hampshire", abbr: "NH", slug: "new-hampshire" },
  "new-jersey": { name: "New Jersey", abbr: "NJ", slug: "new-jersey" },
  "new-mexico": { name: "New Mexico", abbr: "NM", slug: "new-mexico" },
  "new-york": { name: "New York", abbr: "NY", slug: "new-york" },
  "north-carolina": { name: "North Carolina", abbr: "NC", slug: "north-carolina" },
  "north-dakota": { name: "North Dakota", abbr: "ND", slug: "north-dakota" },
  ohio: { name: "Ohio", abbr: "OH", slug: "ohio" },
  oklahoma: { name: "Oklahoma", abbr: "OK", slug: "oklahoma" },
  oregon: { name: "Oregon", abbr: "OR", slug: "oregon" },
  pennsylvania: { name: "Pennsylvania", abbr: "PA", slug: "pennsylvania" },
  "rhode-island": { name: "Rhode Island", abbr: "RI", slug: "rhode-island" },
  "south-carolina": { name: "South Carolina", abbr: "SC", slug: "south-carolina" },
  "south-dakota": { name: "South Dakota", abbr: "SD", slug: "south-dakota" },
  tennessee: { name: "Tennessee", abbr: "TN", slug: "tennessee" },
  texas: { name: "Texas", abbr: "TX", slug: "texas" },
  utah: { name: "Utah", abbr: "UT", slug: "utah" },
  vermont: { name: "Vermont", abbr: "VT", slug: "vermont" },
  virginia: { name: "Virginia", abbr: "VA", slug: "virginia" },
  washington: { name: "Washington", abbr: "WA", slug: "washington" },
  "west-virginia": { name: "West Virginia", abbr: "WV", slug: "west-virginia" },
  wisconsin: { name: "Wisconsin", abbr: "WI", slug: "wisconsin" },
  wyoming: { name: "Wyoming", abbr: "WY", slug: "wyoming" },
};

// Brief water quality context per state. These are general descriptions
// that highlight the most relevant water quality factors for each state.
const STATE_CONTEXT: Record<string, string> = {
  alabama:
    "Alabama's water quality challenges include aging infrastructure in older cities, agricultural runoff from poultry and cotton farming, and industrial contamination from its manufacturing history. Parts of north Alabama have naturally occurring fluoride and manganese in groundwater.",
  alaska:
    "Alaska generally has high-quality water sources, but remote communities face unique challenges with water treatment and distribution. Permafrost thaw is increasingly affecting water infrastructure, and some rural communities still lack modern water systems.",
  arizona:
    "Arizona faces significant water quality concerns due to naturally occurring arsenic in groundwater, PFAS contamination near military installations, and the effects of drought concentrating contaminants. The state relies heavily on Colorado River water and groundwater.",
  arkansas:
    "Arkansas water quality is affected by agricultural runoff from rice, poultry, and livestock operations. Some older water systems, particularly in rural areas, face infrastructure challenges. The state has also dealt with manganese and iron in groundwater.",
  california:
    "California has some of the most diverse water quality challenges in the nation. Issues range from agricultural pesticide contamination in the Central Valley to PFAS near military bases, naturally occurring chromium-6, and drought-related water scarcity.",
  colorado:
    "Colorado's water quality varies significantly by region. Mountain communities typically enjoy clean water from snowmelt, while eastern plains face agricultural runoff concerns. Legacy mining operations in mountain areas have left elevated metals in some water sources.",
  connecticut:
    "Connecticut water quality is generally good, though the state faces challenges from aging infrastructure, PFAS contamination from industrial sites, and naturally occurring radon in groundwater. Lead service lines remain a concern in older cities.",
  delaware:
    "Delaware's small size means a relatively concentrated set of water quality issues. Agricultural runoff from poultry farming, industrial PFAS contamination, and saltwater intrusion along the coast are the primary concerns for drinking water.",
  "district-of-columbia":
    "The District of Columbia made national headlines for lead contamination in the early 2000s. While significant improvements have been made, aging infrastructure and lead service line replacement remain ongoing priorities for DC Water.",
  florida:
    "Florida's water quality concerns include algal blooms, agricultural runoff, PFAS from military bases, and saltwater intrusion in coastal aquifers. The state's limestone geology means groundwater is particularly vulnerable to surface contamination.",
  georgia:
    "Georgia's water quality varies between urban Atlanta, rural agricultural areas, and the coastal region. Challenges include aging infrastructure in cities, agricultural runoff, and industrial contamination. The state has invested heavily in watershed protection.",
  hawaii:
    "Hawaii's remote location and volcanic geology create unique water quality conditions. Groundwater is generally clean, but military PFAS contamination at Red Hill near Pearl Harbor caused a significant crisis. Pesticide runoff from agriculture also affects some areas.",
  idaho:
    "Idaho benefits from abundant, high-quality groundwater from the Snake River Plain Aquifer. However, agricultural contamination from dairy and farming operations, and legacy mining pollution in the Silver Valley, remain ongoing concerns.",
  illinois:
    "Illinois faces water quality challenges from aging urban infrastructure (particularly lead in Chicago), agricultural runoff across the state's vast farmland, and industrial contamination. Atrazine and nitrate levels are elevated in many rural water systems.",
  indiana:
    "Indiana's water quality is significantly affected by agricultural runoff, with nitrates and atrazine commonly found in water systems. Industrial contamination from manufacturing, and coal ash ponds near power plants, also contribute to water quality concerns.",
  iowa:
    "Iowa has some of the most significant nitrate contamination in the country, driven by intensive corn and soybean farming. Des Moines Water Works has spent millions on nitrate removal. Atrazine and other herbicides are also widespread in water sources.",
  kansas:
    "Kansas water quality is shaped by agricultural activity, with nitrate and atrazine contamination common in rural water systems. Western Kansas faces challenges with naturally occurring uranium and fluoride in groundwater, along with declining aquifer levels.",
  kentucky:
    "Kentucky's water quality concerns include coal mining runoff in eastern counties, agricultural contamination, and aging infrastructure. Some of the state's older water systems have high rates of water loss from deteriorating pipes.",
  louisiana:
    "Louisiana faces water quality challenges from industrial pollution along the Mississippi River corridor (sometimes called 'Cancer Alley'), agricultural runoff, and saltwater intrusion. The state also has significant lead service line concerns.",
  maine:
    "Maine's water quality is generally good, but the state has been heavily impacted by PFAS contamination from the historical land application of sewage sludge on farmland. Naturally occurring arsenic and radon in groundwater also affect many communities.",
  maryland:
    "Maryland's water quality varies from the Chesapeake Bay watershed to the mountainous west. Agricultural runoff, aging infrastructure in Baltimore, and PFAS contamination from military installations are the primary drinking water concerns.",
  massachusetts:
    "Massachusetts generally has good water quality, with the Quabbin Reservoir serving as a world-class drinking water source. However, PFAS contamination, lead service lines in older cities, and naturally occurring manganese affect some communities.",
  michigan:
    "Michigan's water quality became a national focus after the Flint water crisis. The state faces widespread PFAS contamination, aging infrastructure, and lead service lines. Great Lakes water sources are generally high quality, but distribution systems vary.",
  minnesota:
    "Minnesota benefits from abundant water resources, but faces challenges from agricultural contamination, PFAS from 3M's historical operations, and naturally occurring manganese. The state has been a leader in addressing PFAS contamination.",
  mississippi:
    "Mississippi faces significant water quality challenges, particularly in Jackson, where infrastructure failures led to a prolonged water crisis. Rural systems often struggle with compliance, and agricultural runoff affects many water sources.",
  missouri:
    "Missouri's water quality is affected by lead mining legacy in the southeast, agricultural runoff, and aging infrastructure in St. Louis and Kansas City. The state has naturally occurring lead in some groundwater sources.",
  montana:
    "Montana generally has good water quality from mountain sources, but legacy mining contamination, particularly from Superfund sites like Butte, affects some communities. Agricultural runoff and naturally occurring arsenic are also concerns in certain areas.",
  nebraska:
    "Nebraska's water quality challenges are primarily agricultural, with nitrate contamination widespread in the state's groundwater. The Ogallala Aquifer, a major drinking water source, faces increasing contamination from farming operations.",
  nevada:
    "Nevada faces water quality concerns from naturally occurring arsenic, chromium-6, and uranium in groundwater. The state's arid climate means heavy reliance on Lake Mead and groundwater, both of which face contamination and scarcity challenges.",
  "new-hampshire":
    "New Hampshire has been significantly affected by PFAS contamination, particularly from the former Pease Air Force Base. Naturally occurring arsenic, radon, and uranium in the state's granite bedrock also affect many private and public water systems.",
  "new-jersey":
    "New Jersey has some of the most aggressive water quality standards in the nation, driven by extensive industrial contamination history. The state led the way on PFAS regulation and has set strict limits for several contaminants beyond federal requirements.",
  "new-mexico":
    "New Mexico faces significant water quality challenges from naturally occurring arsenic, uranium from legacy mining on tribal lands, and PFAS from military installations. Drought and water scarcity compound these issues across the state.",
  "new-york":
    "New York City's unfiltered water supply from the Catskill watershed is renowned for quality, but upstate communities face varying challenges. PFAS contamination, aging infrastructure, and agricultural runoff affect water systems across the state.",
  "north-carolina":
    "North Carolina has faced significant water quality issues, including GenX (a PFAS compound) contamination in the Cape Fear River from the Chemours plant. Agricultural runoff from hog and poultry operations also affects many water systems.",
  "north-dakota":
    "North Dakota's water quality is influenced by oil and gas development in the Bakken region, agricultural runoff, and naturally occurring contaminants. Some communities rely on surface water from the Missouri River system.",
  ohio:
    "Ohio faces water quality challenges from agricultural runoff (particularly harmful algal blooms in Lake Erie), aging infrastructure in older cities, and industrial contamination. Toledo's 2014 water crisis highlighted the vulnerability of Great Lakes water supplies.",
  oklahoma:
    "Oklahoma's water quality is affected by oil and gas operations, agricultural runoff, and naturally occurring minerals. Some communities face elevated levels of arsenic, barium, and radium in groundwater sources.",
  oregon:
    "Oregon generally has good water quality, with Portland's Bull Run watershed providing excellent source water. However, some communities face challenges from agricultural runoff, naturally occurring arsenic, and legacy industrial contamination.",
  pennsylvania:
    "Pennsylvania's water quality varies significantly. Challenges include lead in older cities like Philadelphia and Pittsburgh, agricultural runoff in rural areas, coal mining impacts, and potential contamination concerns related to natural gas fracking.",
  "rhode-island":
    "Rhode Island's water quality is generally good, with most residents served by the Scituate Reservoir system. However, PFAS contamination, aging infrastructure, and naturally occurring manganese affect some communities in the state.",
  "south-carolina":
    "South Carolina faces water quality challenges from agricultural runoff, aging infrastructure, and industrial contamination. The state's coastal communities also deal with saltwater intrusion and the effects of development on water sources.",
  "south-dakota":
    "South Dakota's water quality varies between the Black Hills region and the eastern plains. Agricultural runoff, naturally occurring uranium and radium, and limited water resources in some areas are the primary concerns.",
  tennessee:
    "Tennessee's water quality challenges include coal ash contamination from power plants, agricultural runoff, and aging infrastructure. The Kingston coal ash spill in 2008 highlighted the state's vulnerability to industrial water contamination.",
  texas:
    "Texas faces diverse water quality challenges across its vast territory. Issues include naturally occurring arsenic and radium, agricultural runoff, PFAS from military bases, and aging infrastructure. Drought conditions frequently stress water supplies.",
  utah:
    "Utah generally has good water quality from mountain snowmelt, but faces challenges from naturally occurring arsenic, mining legacy contamination, and the effects of drought on water sources. The Great Salt Lake's decline raises concerns about dust-borne contaminants.",
  vermont:
    "Vermont has generally good water quality, but faces challenges from PFAS contamination, agricultural runoff affecting Lake Champlain, and naturally occurring manganese. The state's small water systems sometimes struggle with treatment and monitoring requirements.",
  virginia:
    "Virginia's water quality varies from the Appalachian region to the coastal plain. Military PFAS contamination, coal mining impacts, agricultural runoff, and aging infrastructure in older cities are the primary concerns for drinking water.",
  washington:
    "Washington state benefits from abundant, high-quality water sources, but faces challenges from PFAS contamination near military bases, nitrate contamination in agricultural areas, and naturally occurring arsenic in some groundwater systems.",
  "west-virginia":
    "West Virginia has faced significant water quality challenges from coal mining, chemical industry contamination (including the 2014 Elk River chemical spill), and aging infrastructure. Many rural communities rely on small water systems with limited resources.",
  wisconsin:
    "Wisconsin faces water quality challenges from agricultural runoff, including nitrate contamination in many private wells. PFAS contamination, naturally occurring radium, and aging infrastructure in older cities also affect drinking water quality.",
  wyoming:
    "Wyoming generally has good water quality, but faces challenges from oil and gas operations, uranium mining legacy, and naturally occurring contaminants in groundwater. Some rural communities have limited water treatment infrastructure.",
};

export function generateStaticParams() {
  return Object.keys(STATES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const state = STATES[slug];
  if (!state) return {};

  return {
    title: `${state.name} Water Quality - Tap Water Report | TapWaterScore`,
    description: `Check tap water quality in ${state.name}. See water systems, EPA violations, contaminant data, and water quality scores for ${state.name} (${state.abbr}).`,
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const state = STATES[slug];

  if (!state) {
    notFound();
  }

  const context = STATE_CONTEXT[slug] || "";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <Link
            href="/states"
            className="inline-block mb-5 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-sm font-medium hover:bg-teal-500/20 transition-colors"
          >
            All States
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
              {state.name}
            </span>{" "}
            Water Quality
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Check tap water quality for any ZIP code in {state.name}. See
            contaminants, violations, and health risks for your water system.
          </p>
          <div className="flex justify-center">
            <ZipLookup />
          </div>
          <p className="mt-4 text-sm text-gray-400/80">
            Enter a {state.name} ZIP code to get your free water quality report.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* State Context */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200/60 rounded-xl flex items-center justify-center text-lg font-bold text-teal-600">
                {state.abbr}
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Water Quality in {state.name}
                </h2>
                <p className="text-sm text-gray-500">Key factors and concerns</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{context}</p>
          </div>
        </div>
      </section>

      {/* What you can find */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 text-center">
            What&apos;s in your {state.name} water report
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🔬",
                title: "Contaminant levels",
                desc: `Every detected contaminant in your ${state.name} water system, compared to EPA limits and health guidelines.`,
              },
              {
                icon: "⚠️",
                title: "Violation history",
                desc: `All EPA violations on record for water systems in ${state.name}, including health-based and monitoring violations.`,
              },
              {
                icon: "📊",
                title: "Water quality grade",
                desc: `An A through F grade based on violation history, contaminant levels, and health guideline comparisons.`,
              },
              {
                icon: "💧",
                title: "Filter recommendations",
                desc: "Which type of water filter will actually remove the contaminants found in your specific water system.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
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

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
            Check your {state.name} water now
          </h2>
          <p className="text-gray-500 mb-8">
            Enter your ZIP code for a free water quality report specific to your
            water system in {state.name}.
          </p>
          <div className="flex justify-center">
            <ZipLookup />
          </div>
        </div>
      </section>

      {/* Browse other states */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Looking for another state?{" "}
            <Link
              href="/states"
              className="text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2"
            >
              Browse all states
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
