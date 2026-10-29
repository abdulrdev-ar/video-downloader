import * as React from "react";

import { cn } from "@/common/lib/utils";

// 16px text keeps iOS Safari from zooming in when the field is focused.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-md border border-input bg-card px-3.5 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
