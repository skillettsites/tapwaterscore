import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About TapWaterScore",
  description:
    "How TapWaterScore works, where the data comes from, and why we built it. Free EPA water quality reports for every US ZIP code.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        About TapWaterScore
      </h1>
      <p className="text-gray-500 mb-10">
        Free water quality reports for every US ZIP code, powered by EPA data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-teal-700">150K+</p>
          <p className="text-sm text-teal-600 mt-1">Water systems tracked</p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-teal-700">43,000+</p>
          <p className="text-sm text-teal-600 mt-1">ZIP codes covered</p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-teal-700">100%</p>
          <p className="text-sm text-teal-600 mt-1">Free, no signup required</p>
        </div>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Where the data comes from
          </h2>
          <p>
            All water quality data comes from the EPA Safe Drinking Water
            Information System (SDWIS) via the ECHO (Enforcement and Compliance
            History Online) database. This is the federal system that tracks
            every public water system in the United States. Water utilities are
            legally required to report their testing results and any violations
            to the EPA.
          </p>
          <p className="mt-3">
            We pull violation history, lead and copper testing results, and
            system details directly from EPA endpoints. Our grading system is
            based on violation history, contaminant types, and how recent the
            issues are. Health-based violations are weighted more heavily than
            monitoring or reporting violations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            How we&apos;re different
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Feature</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">TapWaterScore</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">EWG</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">EPA Direct</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-600">Uses official EPA limits</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">Yes</td>
                  <td className="px-4 py-3 text-red-600">No, uses own stricter guidelines</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">Easy to understand grades</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">A-F grades</td>
                  <td className="px-4 py-3 text-yellow-600">Contaminant counts</td>
                  <td className="px-4 py-3 text-red-600">Raw data only</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">Filter recommendations</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">Yes, NSF-certified</td>
                  <td className="px-4 py-3 text-yellow-600">Yes, but sells own filters</td>
                  <td className="px-4 py-3 text-red-600">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">Free access</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">100% free</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">Free</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">Free</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">Lead/copper testing data</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">Yes</td>
                  <td className="px-4 py-3 text-yellow-600">Partial</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">Yes, but hard to find</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            What we don&apos;t cover
          </h2>
          <p>
            TapWaterScore covers public water systems only. Private wells
            (serving approximately 15% of US households) are not regulated by the
            EPA and are not included in our data. If you rely on a private well,
            we recommend getting your water tested by a certified laboratory.
          </p>
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>Important:</strong> Our reports show system-level data
              reported to the EPA. Conditions at your specific tap may differ due
              to building plumbing, service line materials, or local
              infrastructure. For the most accurate results, consider a{" "}
              <Link href="/testing" className="text-teal-600 hover:text-teal-800 font-medium">
                professional water test
              </Link>.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Why we built this
          </h2>
          <p>
            Every American has the right to know what is in their drinking water.
            The data exists, but it is buried in government databases, locked
            behind technical jargon, and scattered across thousands of municipal
            websites. We believe this information should be easy to find, easy to
            understand, and free to access.
          </p>
          <p className="mt-3">
            With PFAS contamination affecting 176 million Americans and lead
            concerns at their highest level since 2001, understanding your water
            quality has never been more important.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
          <p>
            Questions or feedback? Email us at{" "}
            <a
              href="mailto:contact@tapwaterscore.com"
              className="text-teal-600 hover:text-teal-800 font-medium"
            >
              contact@tapwaterscore.com
            </a>
          </p>
        </section>
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-teal-600 to-cyan-500 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Check your water now</h2>
        <p className="text-teal-100 mb-4">
          Enter your ZIP code for a free water quality report.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-teal-700 font-semibold rounded-lg px-6 py-3 hover:bg-teal-50 transition-colors"
        >
          Get Your Free Report
        </Link>
      </div>
    </div>
  );
}
