export function formatFileNameAsTitle(url: string): string {
  const fileName = url.split("/").pop() || "";
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
