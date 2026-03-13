import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TapWaterScore",
  description: "How TapWaterScore works, where the data comes from, and why we built it.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">About TapWaterScore</h1>

      <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
        <p>
          TapWaterScore makes it easy to understand the quality of your drinking water.
          We take the official EPA data for your water system and present it in a clear,
          simple format that anyone can understand.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Where the data comes from</h2>
        <p>
          All water quality data comes from the EPA Safe Drinking Water Information System (SDWIS).
          This is the federal database that tracks every public water system in the United States.
          Water utilities are legally required to report their testing results and any violations
          to the EPA through this system.
        </p>
        <p>
          We update our database quarterly to reflect the latest data published by the EPA.
          Our grading system is based on violation history, contaminant types, and how recent
          the issues are.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">What we don&apos;t cover</h2>
        <p>
          TapWaterScore covers public water systems only. Private wells (serving approximately
          15% of US households) are not regulated by the EPA and are not included in our data.
          If you rely on a private well, we recommend getting your water tested by a certified
          laboratory.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Why we built this</h2>
        <p>
          Every American has the right to know what is in their drinking water. The data exists,
          but it is buried in government databases, locked behind technical jargon, and scattered
          across thousands of municipal websites. We believe this information should be easy to
          find, easy to understand, and free to access.
        </p>
        <p>
          With PFAS contamination affecting 176 million Americans and lead concerns at their
          highest level since 2001, understanding your water quality has never been more important.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Contact</h2>
        <p>
          Questions or feedback? Email us at{" "}
          <a href="mailto:contact@tapwaterscore.com" className="text-teal-600 hover:text-teal-800">
            contact@tapwaterscore.com
          </a>
        </p>
      </div>
    </div>
  );
}
