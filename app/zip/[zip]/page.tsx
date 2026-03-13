import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWaterReport } from "@/lib/epa";
import { GRADE_INFO } from "@/lib/types";
import ZipLookup from "@/components/ZipLookup";
import Link from "next/link";

interface PageProps {
  params: Promise<{ zip: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { zip } = await params;
  return {
    title: `Water Quality Report for ${zip}`,
    description: `Free tap water quality report for ZIP code ${zip}. See contaminants, violations, health risks, and your water quality grade. Powered by EPA data.`,
  };
}

// Revalidate every 24 hours (ISR)
export const revalidate = 86400;

export default async function WaterReportPage({ params }: PageProps) {
  const { zip } = await params;

  // Validate ZIP
  if (!/^\d{5}$/.test(zip)) {
    notFound();
  }

  const report = await getWaterReport(zip);

  if (!report || report.systems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4">
          No water systems found for {zip}
        </h1>
        <p className="text-gray-500 mb-8">
          We could not find any public water systems serving ZIP code {zip}.
          This could mean the area is served by private wells (not tracked by EPA)
          or the ZIP code is not valid.
        </p>
        <div className="flex justify-center">
          <ZipLookup />
        </div>
      </div>
    );
  }

  const gradeInfo = GRADE_INFO[report.grade];
  const primary = report.primarySystem;

  return (
    <>
      {/* Hero band */}
      <section className="bg-gradient-to-b from-slate-900 via-teal-950 to-gray-50 pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-teal-400 text-sm font-medium mb-1">Water Quality Report</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              ZIP Code {zip}
            </h1>
            {primary && (
              <p className="text-gray-400 mt-2">
                {primary.name} &middot; {primary.state}
              </p>
            )}
          </div>

          {/* Grade card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Grade circle */}
              <div className={`flex-shrink-0 w-28 h-28 rounded-full ${gradeInfo.bgColor} ${gradeInfo.borderColor} border-4 flex flex-col items-center justify-center`}>
                <span className={`text-4xl font-extrabold ${gradeInfo.color}`}>{report.grade}</span>
                <span className={`text-xs font-medium ${gradeInfo.color}`}>{gradeInfo.label}</span>
              </div>

              {/* Summary */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {gradeInfo.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{report.violationCount}</p>
                    <p className="text-xs text-gray-500">Total violations</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className={`text-2xl font-bold ${report.healthViolationCount > 0 ? "text-red-600" : "text-gray-900"}`}>
                      {report.healthViolationCount}
                    </p>
                    <p className="text-xs text-gray-500">Health violations</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{report.systems.length}</p>
                    <p className="text-xs text-gray-500">Water systems</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className={`text-2xl font-bold ${report.hasPfas ? "text-red-600" : "text-green-600"}`}>
                      {report.hasPfas ? "Yes" : "No"}
                    </p>
                    <p className="text-xs text-gray-500">PFAS detected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System info */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Water System Details</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {primary && (
                  <>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-500 w-40">System Name</td>
                      <td className="px-4 py-3 text-gray-900">{primary.name}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-500">System ID</td>
                      <td className="px-4 py-3 text-gray-900 font-mono text-xs">{primary.pwsId}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-500">State</td>
                      <td className="px-4 py-3 text-gray-900">{primary.state}</td>
                    </tr>
                    {primary.county && (
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-500">County</td>
                        <td className="px-4 py-3 text-gray-900">{primary.county}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-500">Population Served</td>
                      <td className="px-4 py-3 text-gray-900">{primary.populationServed.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-500">Water Source</td>
                      <td className="px-4 py-3 text-gray-900">{primary.sourceType}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {report.systems.length > 1 && (
            <p className="text-xs text-gray-400 mt-2">
              {report.systems.length} water systems serve this ZIP code. Showing the largest system above.
            </p>
          )}
        </div>
      </section>

      {/* Top concerns */}
      {report.topConcerns.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Contaminant Concerns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {report.topConcerns.map((concern) => (
                <div
                  key={concern.name}
                  className={`rounded-xl border p-4 ${
                    concern.isHealthBased
                      ? "bg-red-50 border-red-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      concern.isHealthBased
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {concern.isHealthBased ? "Health" : "Other"}
                    </span>
                    <span className="text-xs text-gray-500">{concern.violationCount} violation{concern.violationCount !== 1 ? "s" : ""}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{concern.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PFAS alert */}
      {report.hasPfas && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧪</span>
                <div>
                  <h3 className="font-bold text-red-800 mb-1">PFAS Detected in Your Water System</h3>
                  <p className="text-sm text-red-700 leading-relaxed">
                    PFAS (&quot;forever chemicals&quot;) have been detected in your water system.
                    These synthetic chemicals don&apos;t break down in the environment and have been
                    linked to cancer, thyroid disease, and immune system effects. Consider using
                    a reverse osmosis or activated carbon filter rated for PFAS removal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Violation history */}
      {report.violations.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Violation History</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Contaminant</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Period</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.violations.slice(0, 20).map((v, i) => (
                    <tr key={`${v.violationId}-${i}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{v.contaminantName}</td>
                      <td className="px-4 py-3 text-gray-600">{formatViolationType(v.violationType)}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {formatDate(v.compliancePeriodBegin)} - {formatDate(v.compliancePeriodEnd)}
                      </td>
                      <td className="px-4 py-3">
                        {v.isHealthBased ? (
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Yes</span>
                        ) : (
                          <span className="text-xs text-gray-400">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {report.violations.length > 20 && (
                <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-100">
                  Showing 20 of {report.violations.length} violations.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Filter recommendations */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <span className="text-2xl block mb-2">🚰</span>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Pitcher Filter</h3>
              <p className="text-xs text-gray-500 mb-2">Good for: chlorine, taste, some lead</p>
              <p className="text-xs text-gray-400">$20-$40. Replace filter every 2-3 months.</p>
            </div>
            <div className="bg-teal-50 rounded-xl border border-teal-200 p-5">
              <span className="text-2xl block mb-2">💧</span>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Reverse Osmosis</h3>
              <p className="text-xs text-gray-500 mb-2">Best for: PFAS, lead, arsenic, nitrates</p>
              <p className="text-xs text-gray-400">$150-$500. Removes 95%+ of contaminants.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <span className="text-2xl block mb-2">🏠</span>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Whole House</h3>
              <p className="text-xs text-gray-500 mb-2">Best for: sediment, chlorine, hard water</p>
              <p className="text-xs text-gray-400">$300-$3,000. Filters all water in your home.</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Filter recommendations are general guidance based on common contaminants. Check that any filter
            is NSF-certified to remove the specific contaminants found in your water.
          </p>
        </div>
      </section>

      {/* Check another */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Check another ZIP code</h2>
          <div className="flex justify-center">
            <ZipLookup />
          </div>
          <div className="mt-6 flex justify-center gap-4 text-sm">
            <Link href="/states" className="text-teal-600 hover:text-teal-800 font-medium">
              Browse by state
            </Link>
            <Link href="/contaminants" className="text-teal-600 hover:text-teal-800 font-medium">
              Contaminant guide
            </Link>
          </div>
        </div>
      </section>

      {/* Data source disclaimer */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Data source: EPA Safe Drinking Water Information System (SDWIS).
            Last updated: {report.lastUpdated}. This report reflects system-level data
            reported to the EPA and may not reflect conditions at your specific tap.
            For the most accurate results, consider a certified lab test of your water.
          </p>
        </div>
      </section>
    </>
  );
}

function formatViolationType(code: string): string {
  const types: Record<string, string> = {
    "01": "MCL violation",
    "02": "Treatment technique",
    "03": "Monitoring",
    "04": "Reporting",
    "05": "Other",
    MCL: "MCL violation",
    TT: "Treatment technique",
    MON: "Monitoring",
    RPT: "Reporting",
    MR: "Monitoring & reporting",
    Other: "Other",
  };
  return types[code] || code;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  // Handle various date formats from EPA
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}
