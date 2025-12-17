export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500"></div>
    </div>
  );
}
