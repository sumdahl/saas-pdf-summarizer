import { Suspense } from "react";
import Loading from "@/components/common/loading";
export default function NotFound() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <Suspense fallback={null}>
        <Loading />
      </Suspense>
    </div>
  );
}
