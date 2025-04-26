"use client";
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  generateSummarizedPdf,
  storePdfSummaryAction,
} from "@/actions/upload-action";
import { useRef, useState } from "react";
// import { Search } from "lucide-react";

const SIZE = 20 * 1024 * 1024; // 20MB

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
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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
      console.log("Uploading file", file);
      toast.loading("Starting upload...", {
        description: `Uploading ${file}`,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      const validatedFields = formSchema.safeParse({ file });

      if (!validatedFields.success) {
        toast.error("Invalid file", {
          description:
            validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid file",
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await startUpload([file]);

        if (!response) {
          toast.error("Upload failed", {
            description: "Unable to upload your file. Please try again later.",
          });
          setIsLoading(false);
          return;
        }

        // 🔄 Show a persistent toast while processing the PDF
        const processingToastId = toast.loading(
          // "🔍 Analyzing your document...",
          "Analyzing your document...",
          {
            description: "This might take a few seconds. Please hold on...",
            // icon: <Search className="h-4 w-4" />,
          }
        );
        const summaryResult = await generateSummarizedPdf([
          {
            serverData: {
              userId: response[0].serverData.userId,
              file: {
                url: response[0].serverData.file.url,
                name: response[0].serverData.file.name,
              },
            },
          },
        ]);

        toast.dismiss(processingToastId); // ✅ Dismiss once done

        console.log(summaryResult);

        const { data = null, message = null } = summaryResult || {};
        if (data) {
          let storedSummary: any;
          toast.dismiss();
          toast.success("📄 Saving PDF...", {
            description: "Hang tight! We're saving your PDF...💾",
          });

          //save the summary to the database

          if (data.summary) {
            console.log(data.summary);
            storedSummary = await storePdfSummaryAction({
              summary: data.summary,
              fileUrl: response[0].serverData.file.url,
              title: data.title,
              fileName: file.name,
            });
          }
          toast.success("✨ Summary Generated!", {
            description:
              "Your PDF has been successfully summarized! and saved ✨",
          });
          formRef.current?.reset();
          setIsLoading(false);
          router.push(`/summaries/${storedSummary.data.id}`);
          //redirect to the [id] summary page
        }
      } catch (error: any) {
        setIsLoading(false);
        if (error.message === "DOCUMENT_TOO_LONG") {
          toast.error("Document too long", {
            description:
              "Please try with a shorter document or split it into smaller parts.",
          });
        } else if (error.message === "CONTENT_TOO_LONG") {
          toast.error("Content too long", {
            description:
              "This document exceeds our maximum length limit. Please try with a shorter document or split it into smaller parts.",
          });
        } else {
          toast.error("Unexpected error", {
            description: "Something went wrong. Please try again later.",
          });
        }
      }
    } catch (error) {
      console.error("Error occurred", error);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
