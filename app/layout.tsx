import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AdSenseScript } from "@/components/AdSense";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "TapWaterScore - Check Your Tap Water Quality by ZIP Code",
    template: "%s | TapWaterScore",
  },
  description:
    "Free tap water quality report for any US ZIP code. See what contaminants are in your drinking water, how it compares to safety standards, and which filters actually remove them. Powered by EPA data.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.tapwaterscore.com"
  ),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.tapwaterscore.com",
    siteName: "TapWaterScore",
    title: "TapWaterScore - Check Your Tap Water Quality by ZIP Code",
    description:
      "Free tap water quality report for any US ZIP code. See contaminants, health risks, and the right filter for your water.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdSenseScript />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 antialiased`}>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "TapWaterScore",
              url: "https://www.tapwaterscore.com",
              description:
                "Free tap water quality report for any US ZIP code. Powered by EPA data.",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://www.tapwaterscore.com/zip/{search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <Header />
        <main>{children}</main>
        <footer className="bg-slate-900 text-gray-400 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
              <div>
                <a href="/" className="flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="shrink-0">
                    <circle cx="14" cy="14" r="13" className="fill-teal-900 stroke-teal-500" strokeWidth="1.5" />
                    <path d="M14 6c0 0-5.5 6.5-5.5 10.5a5.5 5.5 0 0 0 11 0C19.5 12.5 14 6 14 6z" className="fill-teal-400" />
                    <path d="M14 6c0 0-5.5 6.5-5.5 10.5a5.5 5.5 0 0 0 11 0C19.5 12.5 14 6 14 6z" className="fill-cyan-300" opacity="0.4" />
                  </svg>
                  <span className="text-lg font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                    TapWaterScore
                  </span>
                </a>
                <p className="mt-2">
                  Free tap water quality reports powered by EPA data.
                  Know what&apos;s in your water before you drink it.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/" className="hover:text-white transition-colors">Check Your Water</a></li>
                  <li><a href="/states" className="hover:text-white transition-colors">Water Quality by State</a></li>
                  <li><a href="/cities" className="hover:text-white transition-colors">Water Quality by City</a></li>
                  <li><a href="/contaminants" className="hover:text-white transition-colors">Contaminant Guide</a></li>
                  <li><a href="/filters" className="hover:text-white transition-colors">Filter Recommendations</a></li>
                  <li><a href="/testing" className="hover:text-white transition-colors">Water Testing</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Data Sources</h3>
                <p className="text-xs leading-relaxed">
                  All water quality data comes from the EPA Safe Drinking Water
                  Information System (SDWIS), the Water Quality Portal, and
                  public Consumer Confidence Reports. Updated quarterly.
                </p>
                <p className="text-xs mt-3">
                  <a href="mailto:contact@tapwaterscore.com" className="hover:text-white transition-colors">
                    contact@tapwaterscore.com
                  </a>
                </p>
              </div>
            </div>
            <div className="gradient-line mt-8 mb-4" />
            <div className="text-xs text-center text-gray-500">
              &copy; {new Date().getFullYear()} TapWaterScore. All rights reserved.
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
