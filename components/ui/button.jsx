import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text- font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-dark text-light hover:bg-dark/90",
        light: "bg-light text-dark hover:bg-light/90",
        highlight: "bg-highlight text-dark hover:bg-highlight/90",
        transparent: "bg-transparent text-dark hover:bg-transparent/90",
        border: "border border-dark/20 text-dark hover:bg-dark/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8  gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4 text-lg",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size,
  icon,
  iconPosition = "left",
  loading,
  asChild = false,
  disabled,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  const renderContent = () => {
    if (loading) {
      return <Loader2 className="animate-spin" />
    }
    
    if (icon) {
      return (
        <>
          {iconPosition === "left" && icon}
          {props.children}
          {iconPosition === "right" && icon}
        </>
      )
    }
    
    return props.children
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}>
      {renderContent()}
    </Comp>
  );
}

export { Button, buttonVariants }
