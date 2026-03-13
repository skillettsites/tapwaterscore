import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "TapWaterScore privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-xs text-gray-400 mb-8">Last updated: March 2026</p>

      <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">What we collect</h2>
        <p>
          When you use TapWaterScore, we may collect the ZIP code you search for and basic
          analytics data (pages viewed, device type, referral source). We do not collect
          your name, email address, or any other personal information unless you choose to
          contact us directly.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">How we use it</h2>
        <p>
          ZIP code searches are used solely to retrieve water quality data from the EPA.
          Analytics data helps us understand how people use the site so we can improve it.
          We do not sell, rent, or share any user data with third parties.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Cookies</h2>
        <p>
          We use essential cookies for site functionality and analytics cookies (Google Analytics)
          to understand site usage. You can disable cookies in your browser settings.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Third-party links</h2>
        <p>
          Our site may contain affiliate links to water filter products. If you click these
          links and make a purchase, we may earn a commission at no extra cost to you. These
          third-party sites have their own privacy policies.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Contact</h2>
        <p>
          For privacy-related questions, email{" "}
          <a href="mailto:contact@tapwaterscore.com" className="text-teal-600 hover:text-teal-800">
            contact@tapwaterscore.com
          </a>
        </p>
      </div>
    </div>
  );
}
