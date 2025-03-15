"use client";
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
const SIZE = 20 * 1024 * 1024; // 20MB
import { toast } from "sonner";

const formSchema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= SIZE, {
      message: "File size must be less than 20MB",
    })
    .refine((file) => file.type.startsWith("application/pdf"), {
      message: "File must be a PDF",
    }),
});

export default function UploadForm() {
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      toast.dismiss(); // Dismiss any existing loading toasts
      toast.success(
        "📄 PDF uploaded successfully! Processing your document...",
        {
          description: "We'll analyze and summarize your PDF shortly.",
        }
      );
    },
    onUploadError: (error: Error) => {
      toast.dismiss(); // Dismiss any existing loading toasts
      console.error(`ERROR while uploading! ${error.message}`);
      toast.error("Upload failed", {
        description:
          "There was a problem uploading your file. Please try again.",
      });
    },
    onUploadBegin: (file) => {
      toast.loading("Starting upload...", {
        description: `Uploading ${file}`,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    const validatedFields = formSchema.safeParse({ file });

    if (!validatedFields.success) {
      toast.error("Invalid file", {
        description:
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid file",
      });
      return;
    }

    try {
      const response = await startUpload([file]);

      if (!response) {
        toast.error("Upload failed", {
          description: "Unable to upload your file. Please try again later.",
        });
        return;
      }
    } catch (error) {
      toast.error("Unexpected error", {
        description: "Something went wrong. Please try again later.",
      });
    }

    //validating the fields
    // schema with zod
    //upload the file to uploadThing
    //parse the pdf using lang chain
    //summarize the pdf using OpenAI
    //save the summary to the database
    //redirect to the [id] summary page
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
