"use client";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { deleteSummaryAction } from "@/actions/summary-action";
import { DeleteSummaryInterface } from "@/types/summary";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState, useTransition } from "react";

export default function DeleteSummary({ summaryId }: DeleteSummaryInterface) {
  const [open, setOpen] = useState(false);

  const [isPending, startTransaction] = useTransition();

  const handleDelete = async () => {
    startTransaction(async () => {
      const result = await deleteSummaryAction(summaryId);
      if (!result.success) {
        toast.error("Error", {
          description: "Failed to delete summary",
        });
      }

      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size="icon"
          className="text-gray-400 bg-gray-50 border border-gray-200
         hover:text-rose-600 hover:bg-rose-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Summary</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this summary? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            variant="ghost"
            className="px-4 bg-gray-50 border border-gray-200 hover:text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="px-4 bg-linear-to-r from-rose-500 to-rose-700
            hover:from-rose-600 hover:to-rose-800"
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
