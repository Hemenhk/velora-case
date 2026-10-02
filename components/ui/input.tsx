import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-13 w-full min-w-0 rounded-xl bg-white px-4 text-[17px] text-plum ring-1 ring-plum/12 outline-none transition-shadow duration-200 placeholder:text-plum/35 focus-visible:ring-2 focus-visible:ring-berry aria-invalid:ring-2 aria-invalid:ring-danger",
        className,
      )}
      {...props}
    />
  );
}

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn("text-[15px] font-semibold text-plum", className)}
      {...props}
    />
  );
}

export { Input, Label };