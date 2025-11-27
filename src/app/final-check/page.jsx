"use client";

import dynamic from "next/dynamic";

// Load the client-only component dynamically, disable SSR
const  FinalCheck= dynamic(() => import("./FinalCheckClient"), { ssr: false });

export default function FinalCheckPage() {
  return <FinalCheck />;
}
