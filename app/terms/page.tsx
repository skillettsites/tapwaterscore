import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "TapWaterScore terms of use.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Use</h1>
      <p className="text-xs text-gray-400 mb-8">Last updated: March 2026</p>

      <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Use of information</h2>
        <p>
          TapWaterScore provides water quality information based on data from the EPA Safe
          Drinking Water Information System. This information is provided for general
          informational purposes only and should not be considered a substitute for
          professional water testing.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Accuracy</h2>
        <p>
          While we strive to provide accurate and up-to-date information, we cannot guarantee
          the completeness or accuracy of the data. EPA data reflects system-level testing and
          may not reflect conditions at your specific tap. Water quality can vary within a
          distribution system, especially in older buildings with lead pipes.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Not medical advice</h2>
        <p>
          The health information on this site is for general education purposes only and does
          not constitute medical advice. If you have health concerns about your drinking water,
          consult a healthcare professional.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Limitation of liability</h2>
        <p>
          TapWaterScore is provided &quot;as is&quot; without warranties of any kind. We are not
          liable for any damages arising from the use of this site or reliance on the information
          provided.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:contact@tapwaterscore.com" className="text-teal-600 hover:text-teal-800">
            contact@tapwaterscore.com
          </a>
        </p>
      </div>
    </div>
  );
}
