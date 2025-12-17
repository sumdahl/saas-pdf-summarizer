import { FileUp } from "lucide-react";

export default function UploadDropzone() {
  return (
    <div
      className="hidden md:flex flex-col justify-center items-center space-y-2 bg-rose-200/30
            p-4 border-dashed border-3 w-72 md:w-96 transition-opacity duration-500 opacity-0 md:opacity-100"
    >
      <FileUp size={50} className="text-rose-600/80" />
      <span className="font-semibold  text-rose-400/90">
        Drop your files here...(PDF)
      </span>
    </div>
  );
}
