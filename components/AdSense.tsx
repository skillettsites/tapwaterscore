"use client";

import { useEffect } from "react";

// Replace with your actual AdSense publisher ID
const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "";

/** AdSense auto-ad script loader. Add to layout.tsx. */
export function AdSenseScript() {
  if (!PUBLISHER_ID) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
      crossOrigin="anonymous"
    />
  );
}

/** In-content ad unit. Place between content sections. */
export function AdUnit({ slot, format = "auto" }: { slot: string; format?: string }) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded
    }
  }, []);

  if (!PUBLISHER_ID) return null;

  return (
    <div className="my-6">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
