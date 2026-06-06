import * as React from "react";
import { HelpCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  content: React.ReactNode;
  label: string;
  side?: React.ComponentPropsWithoutRef<typeof TooltipContent>["side"];
  align?: React.ComponentPropsWithoutRef<typeof TooltipContent>["align"];
}

const DESKTOP_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function supportsDesktopPointer() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return true;
  }

  return window.matchMedia(DESKTOP_POINTER_QUERY).matches;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  label,
  side,
  align,
}) => {
  const [useTooltip, setUseTooltip] = React.useState(supportsDesktopPointer);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setUseTooltip(event.matches);
    };

    setUseTooltip(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const trigger = (
    <button
      type="button"
      aria-label={`Show help for ${label}`}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon-xs" }),
        "size-5 cursor-pointer rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
      )}
    >
      <HelpCircle className="size-4" />
    </button>
  );

  const contentBody = (
    <div className="text-sm leading-relaxed">{content}</div>
  );

  if (!useTooltip) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          className="max-w-72"
        >
          {contentBody}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side={side} align={align} className="max-w-72">
          {contentBody}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
