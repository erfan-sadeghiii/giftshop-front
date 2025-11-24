// src/app/components/Header/Header.jsx
"use client";

import { useEffect, useState } from "react";
import Desktop from "./Header/Desktop";
import Mobile from "./Header/Mobile";


export default function Header() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for client-only logic
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <header className="header">
      <Desktop />
      <Mobile />
    </header>
  );
}
