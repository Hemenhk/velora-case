import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-semibold outline-none transition-[transform,background-color,box-shadow,color] duration-200 ease-ios active:scale-[0.97] focus-visible:ring-4 focus-visible:ring-berry/30 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground  hover:bg-berry-deep disabled:bg-plum/12 disabled:text-plum/40 disabled:shadow-none",
        secondary: "bg-white text-plum ring-1 ring-plum/12 hover:ring-plum/25",
        ghost: "text-plum hover:bg-plum/6",
        link: "text-berry underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-11 rounded-full px-5 text-[15px]",
        sm: "h-9 rounded-full px-3.5 text-[14px]",
        lg: "h-14 w-full rounded-full px-6 text-[17px] [&_svg]:size-5",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };