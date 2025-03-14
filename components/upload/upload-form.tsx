"use client";
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";

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
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("Uploaded successfully!");
    },
    onUploadError: (error: Error) => {
      console.error(`ERROR while uploading! ${error.message}`);
    },
    onUploadBegin: (file) => {
      console.log("Upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    console.log(file);

    const validatedFields = formSchema.safeParse({ file });
    console.log(validatedFields);

    if (!validatedFields.success) {
      console.log(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid file"
      );
      return;
    }

    const response = await startUpload([file]);

    if (!response) {
      return;
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
