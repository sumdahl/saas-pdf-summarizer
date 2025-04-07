import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NavigationControls({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSectionSelect,
}: {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSectionSelect: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-background/80 backdrop-blur-xs border-t border-rose-500/10 rounded-b-2xl">
      <div className="flex justify-between items-center w-full">
        {/* Left Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={currentSection === 0}
          className={cn(
            "rounded-full w-14 h-14 transition-all duration-200 bg-gradient-to-br from-rose-500 to-rose-600 backdrop-blur-xs border border-rose-500/10",
            currentSection === 0 ? "opacity-50" : "hover:bg-rose-500/20"
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Dots in Center */}
        <div className="flex gap-2">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => onSectionSelect(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                currentSection === index
                  ? "bg-gradient-to-r from-rose-500 to-rose-700"
                  : "bg-rose-500/20 hover:bg-rose-500/30"
              )}
            />
          ))}
        </div>

        {/* Right Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={currentSection === totalSections - 1}
          className={cn(
            "rounded-full w-14 h-14 transition-all duration-200 bg-gradient-to-br from-rose-500 to-rose-600 backdrop-blur-xs border border-rose-500/10",
            currentSection === totalSections - 1
              ? "opacity-50"
              : "hover:bg-rose-500/20"
          )}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
