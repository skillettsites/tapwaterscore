"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "/states", label: "States" },
  { href: "/cities", label: "Cities" },
  { href: "/contaminants", label: "Contaminants" },
  { href: "/filters", label: "Filters" },
  { href: "/testing", label: "Testing" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-auto min-h-14 flex items-center justify-between py-2">
        <a href="/" className="flex items-center gap-2 group">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
            <circle cx="14" cy="14" r="13" className="fill-teal-50 stroke-teal-500" strokeWidth="1.5" />
            <path d="M14 6c0 0-5.5 6.5-5.5 10.5a5.5 5.5 0 0 0 11 0C19.5 12.5 14 6 14 6z" className="fill-teal-500" />
            <path d="M14 6c0 0-5.5 6.5-5.5 10.5a5.5 5.5 0 0 0 11 0C19.5 12.5 14 6 14 6z" className="fill-cyan-400" opacity="0.4" />
          </svg>
          <span className="text-lg font-extrabold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-cyan-600 transition-all">
            TapWaterScore
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-gray-900 transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18" />
              <path d="M3 6h18" />
              <path d="M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <nav className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:text-gray-900 hover:bg-teal-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
