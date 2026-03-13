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

export const revalidate = 86400;

export default async function WaterReportPage({ params }: PageProps) {
  const { zip } = await params;

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
                {primary.name} · {primary.state}
                {primary.populationServed > 0 && ` · ${primary.populationServed.toLocaleString()} people served`}
              </p>
            )}
          </div>

          {/* Grade card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className={`flex-shrink-0 w-28 h-28 rounded-full ${gradeInfo.bgColor} ${gradeInfo.borderColor} border-4 flex flex-col items-center justify-center`}>
                <span className={`text-4xl font-extrabold ${gradeInfo.color}`}>{report.grade}</span>
                <span className={`text-xs font-medium ${gradeInfo.color}`}>{gradeInfo.label}</span>
              </div>

              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {gradeInfo.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatBox
                    value={report.violationCount.toString()}
                    label="Total violations"
                    color={report.violationCount > 0 ? "text-yellow-600" : "text-green-600"}
                  />
                  <StatBox
                    value={report.healthViolationCount.toString()}
                    label="Health violations"
                    color={report.healthViolationCount > 0 ? "text-red-600" : "text-green-600"}
                  />
                  <StatBox
                    value={report.hasPfas ? "Yes" : "No"}
                    label="PFAS detected"
                    color={report.hasPfas ? "text-red-600" : "text-green-600"}
                  />
                  <StatBox
                    value={report.hasLead ? "Yes" : "No"}
                    label="Lead detected"
                    color={report.hasLead ? "text-orange-600" : "text-green-600"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 space-y-8 pb-16">
        {/* System info */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Water System Details</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {primary && (
                  <>
                    <InfoRow label="System Name" value={primary.name} />
                    <InfoRow label="System ID" value={primary.pwsId} mono />
                    <InfoRow label="State" value={primary.state} />
                    {primary.county && <InfoRow label="County" value={primary.county} />}
                    <InfoRow label="Population Served" value={primary.populationServed.toLocaleString()} />
                    <InfoRow label="Water Source" value={primary.sourceType} />
                  </>
                )}
              </tbody>
            </table>
          </div>
          {report.systems.length > 1 && (
            <p className="text-xs text-gray-400 mt-2">
              {report.systems.length} water systems serve this ZIP code. Showing the largest.
            </p>
          )}
        </section>

        {/* Lead and Copper */}
        {report.leadCopper && (report.leadCopper.lead90th != null || report.leadCopper.copper90th != null) && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lead & Copper Testing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.leadCopper.lead90th != null && (
                <div className={`rounded-xl border p-5 ${
                  report.leadCopper.leadExceeds
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-900">Lead (90th percentile)</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      report.leadCopper.leadExceeds
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {report.leadCopper.leadExceeds ? "Exceeds Action Level" : "Below Action Level"}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {report.leadCopper.lead90th} <span className="text-sm font-normal text-gray-500">{report.leadCopper.leadUnit}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Action level: {report.leadCopper.leadActionLevel} {report.leadCopper.leadUnit}
                  </p>
                  {report.leadCopper.leadDate && (
                    <p className="text-xs text-gray-400 mt-1">Tested: {report.leadCopper.leadDate}</p>
                  )}
                </div>
              )}
              {report.leadCopper.copper90th != null && (
                <div className={`rounded-xl border p-5 ${
                  report.leadCopper.copperExceeds
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-900">Copper (90th percentile)</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      report.leadCopper.copperExceeds
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {report.leadCopper.copperExceeds ? "Exceeds Action Level" : "Below Action Level"}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {report.leadCopper.copper90th} <span className="text-sm font-normal text-gray-500">{report.leadCopper.copperUnit}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Action level: {report.leadCopper.copperActionLevel} {report.leadCopper.copperUnit}
                  </p>
                  {report.leadCopper.copperDate && (
                    <p className="text-xs text-gray-400 mt-1">Tested: {report.leadCopper.copperDate}</p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Top concerns */}
        {report.topConcerns.length > 0 && (
          <section>
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
                      {concern.isHealthBased ? "Health" : concern.category || "Other"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {concern.violationCount} violation{concern.violationCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{concern.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PFAS alert */}
        {report.hasPfas && (
          <section>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧪</span>
                <div>
                  <h3 className="font-bold text-red-800 mb-1">PFAS Detected in Your Water System</h3>
                  <p className="text-sm text-red-700 leading-relaxed">
                    PFAS (&quot;forever chemicals&quot;) have been detected in your water system.
                    These synthetic chemicals don&apos;t break down and have been linked to cancer,
                    thyroid disease, and immune system effects. A reverse osmosis or NSF-certified
                    activated carbon filter can remove PFAS from your drinking water.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Violation history table */}
        {report.violations.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Violation History</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Contaminant</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Period</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.violations.slice(0, 25).map((v, i) => (
                    <tr key={`${v.violationId}-${i}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{v.contaminantName}</span>
                        {v.isHealthBased && (
                          <span className="ml-2 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                            Health
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{v.categoryDesc}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {formatDate(v.periodBegin)} - {formatDate(v.periodEnd)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${
                          v.status === "Resolved" || v.status === "R"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}>
                          {v.status === "R" ? "Resolved" : v.status || "Open"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {report.violations.length > 25 && (
                <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-100">
                  Showing 25 of {report.violations.length} violations.
                </div>
              )}
            </div>
          </section>
        )}

        {/* No violations message */}
        {report.violations.length === 0 && (
          <section>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <span className="text-3xl block mb-2">✅</span>
              <h3 className="font-bold text-green-800 mb-1">No Violations on Record</h3>
              <p className="text-sm text-green-700">
                This water system has no recorded violations in the EPA database.
                This is a good sign, but does not guarantee the absence of all contaminants.
              </p>
            </div>
          </section>
        )}

        {/* Filter recommendations */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Filters for Your Water</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <span className="text-2xl block mb-2">🚰</span>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Pitcher Filter</h3>
              <p className="text-xs text-gray-500 mb-2">Good for: chlorine, taste, some lead</p>
              <p className="text-xs text-gray-400 mb-3">$30-$90. Replace every 2-3 months.</p>
              <a
                href="https://www.clearlyfiltered.com/products/clearly-filtered-water-pitcher" /* AFFILIATE: swap URL when approved */
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-100 transition-colors"
              >
                Clearly Filtered Pitcher →
              </a>
            </div>
            <div className={`rounded-xl border p-5 ${
              report.hasPfas || report.hasLead
                ? "bg-teal-50 border-teal-200 ring-2 ring-teal-300"
                : "bg-white border-gray-200"
            }`}>
              <span className="text-2xl block mb-2">💧</span>
              <h3 className="font-bold text-sm text-gray-900 mb-1">
                Reverse Osmosis
                {(report.hasPfas || report.hasLead) && (
                  <span className="ml-2 text-[10px] font-bold text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500 mb-2">Best for: PFAS, lead, arsenic, nitrates</p>
              <p className="text-xs text-gray-400 mb-3">$350-$600. Removes 95%+ of contaminants.</p>
              <a
                href="https://www.springwellwater.com/reverse-osmosis-water-filter-system/" /* AFFILIATE: swap URL when approved */
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-100 transition-colors"
              >
                SpringWell RO System →
              </a>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <span className="text-2xl block mb-2">🏠</span>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Whole House</h3>
              <p className="text-xs text-gray-500 mb-2">Best for: sediment, chlorine, hard water</p>
              <p className="text-xs text-gray-400 mb-3">$850-$2,500. Filters all water in your home.</p>
              <a
                href="https://www.springwellwater.com/whole-house-water-filter-system/" /* AFFILIATE: swap URL when approved */
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-100 transition-colors"
              >
                SpringWell Whole House →
              </a>
            </div>
          </div>

          {/* Water testing CTA */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-sm text-gray-900 mb-1">Not sure what filter you need?</h3>
              <p className="text-xs text-gray-500">
                Get your water professionally tested to find out exactly what contaminants are present.
                EPA data shows system-level results; a home test shows what comes out of your tap.
              </p>
            </div>
            <a
              href="https://www.tapscore.com/" /* AFFILIATE: swap URL when approved */
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-sm font-semibold text-white bg-teal-600 rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors"
            >
              Order a Tap Score Test
            </a>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">
              Filter recommendations are based on contaminants found in your water system.
              Always check that a filter is NSF-certified.
            </p>
            <Link href="/filters" className="text-xs text-teal-600 hover:text-teal-800 font-medium whitespace-nowrap ml-4">
              Full filter guide →
            </Link>
          </div>
          <p className="text-[10px] text-gray-300 mt-1">
            Some links are affiliate links. We may earn a commission at no extra cost to you.
          </p>
        </section>

        {/* Check another */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 text-center">
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
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Data source: EPA Safe Drinking Water Information System (SDWIS) via ECHO.
          Last updated: {report.lastUpdated}. This report reflects system-level data
          reported to the EPA and may not reflect conditions at your specific tap.
          For the most accurate results, consider a certified lab test.
        </p>
      </div>
    </>
  );
}

// ── Helper Components ──

function StatBox({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <tr>
      <td className="px-4 py-3 font-medium text-gray-500 w-40">{label}</td>
      <td className={`px-4 py-3 text-gray-900 ${mono ? "font-mono text-xs" : ""}`}>{value}</td>
    </tr>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}
