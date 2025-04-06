import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, ChevronLeft, Sparkles } from "lucide-react";
export default function SummaryHeader({
  title,
  createdAt,
}: {
  title: string;
  createdAt: string;
}) {
  return (
    <div className="flex gap-4 mb-4 justify-between">
      <div className="space-y-6">
        <div>
          <Badge
            variant="secondary"
            className="relative px-4 py-1.5 text-sm
          font-medium bg-white/90 backdrop-blur-xs rounded-full hover:bg-white/90
          transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-rose-500" />
            AI Summary
          </Badge>
          <div className="">
            <Calendar className="h-4 w-4 text-rose-400" />
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
      <div>
        <Link href="/dashboard">
          <Button
            variant={"link"}
            size="sm"
            className="group flex items-center gap-1 sm:gap-2 hover:bg-white/10 backdrop-blur-xs
                    rounded-full transition-all duration-200 shadow-xs hover:shadow-md border
                    border-rose-100/30 bg-rose-100 px-2 sm:px-3"
          >
            <ChevronLeft
              className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500 transition-transform
            group-hover:translate-x-0.5"
            />
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              Back <span className="hidden sm:inline">To Dashboard</span>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
