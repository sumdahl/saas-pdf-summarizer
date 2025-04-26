"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { UploadFormInputProps } from "@/types/upload-form";

const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onSubmit, isLoading }, ref) => {
    return (
      <form ref={ref} className="flex flex-col gap-6" onSubmit={onSubmit}>
        <div className="flex justify-end items-center gap-1.5">
          <Input
            id="file"
            name="file"
            type="file"
            accept="application/pdf"
            required
            className={cn(isLoading && "opacity-50 cursor-not-allowed")}
            disabled={isLoading}
          />
          <Button disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Upload your PDF"
            )}
          </Button>
        </div>
      </form>
    );
  }
);

UploadFormInput.displayName = "UploadFormInput";

export default UploadFormInput;
