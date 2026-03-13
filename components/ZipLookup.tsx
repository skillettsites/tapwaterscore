"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ZipLookup({ autoFocus = false }: { autoFocus?: boolean }) {
  const [zip, setZip] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = zip.replace(/\D/g, "").slice(0, 5);
    if (cleaned.length === 5) {
      router.push(`/zip/${cleaned}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="search-glow flex items-center bg-white rounded-xl overflow-hidden">
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          placeholder="Enter ZIP code (e.g. 90210)"
          autoFocus={autoFocus}
          className="flex-1 px-5 py-4 text-lg text-gray-900 placeholder-gray-400 outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={zip.replace(/\D/g, "").length !== 5}
          className="px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check Water
        </button>
      </div>
    </form>
  );
}
