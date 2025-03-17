import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
    .middleware(async ({ req }) => {
      const user = await currentUser();
      if (!user) {
        throw new UploadThingError("Unauthorized");
      }
      return { userId: user.id }; // Ensure the return type matches expected metadata
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        userId: metadata.userId,
        file: {
          url: file.ufsUrl,
          name: file.name,
          size: file.size,
          key: file.key,
        },
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// TIMESTAMPS :-> 3:08:08 to continue from here
