// components/NProgressProvider.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
// import nProgress from "nprogress";
import nProgress from "nprogress";

nProgress.configure({ showSpinner: false });

export default function NProgressProvider() {
  const pathname = usePathname();

  useEffect(() => {
    nProgress.start();
    // Simulate async load — optional
    const timeout = setTimeout(() => {
      nProgress.done();
    }, 500); // You can adjust or remove this timeout based on real data fetching

    return () => {
      clearTimeout(timeout);
      nProgress.done();
    };
  }, [pathname]);

  return null;
}
