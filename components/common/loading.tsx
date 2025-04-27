"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Loading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Trigger loading on route or query param change
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // slight delay for smoother transition

    return () => clearTimeout(timer);
  }, [pathname, searchParams.toString()]);
  // 👆 .toString() — important: avoid stale objects triggering unnecessary re-renders

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500"></div>
    </div>
  );
}
