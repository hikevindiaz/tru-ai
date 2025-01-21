// Tremor Button [v0.2.0]

import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { RiLoader2Fill } from "@remixicon/react"
import { tv, type VariantProps } from "tailwind-variants"

import { cn, focusRing } from "@/lib/utils"

const buttonVariants = tv({
  base: [
    // base
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out",
    // disabled
    "disabled:pointer-events-none disabled:shadow-none",
    // focus
    focusRing,
  ],
  variants: {
    variant: {
      primary: [
        // border
        "border-transparent",
        // text color
        "text-white",
        // background color
        "bg-blue-500 dark:bg-blue-600",
        // hover color
        "hover:bg-blue-600 dark:hover:bg-blue-500",
        // disabled
        "disabled:bg-blue-300 dark:disabled:bg-blue-800",
        "disabled:text-white/70 dark:disabled:text-white/50",
        // Ensure contrast
        "shadow-sm dark:shadow-blue-900/20",
      ],
      secondary: [
        // border
        "border-gray-200 dark:border-gray-800",
        // text color
        "text-gray-900 dark:text-gray-100",
        // background color
        "bg-white dark:bg-gray-900",
        // hover
        "hover:bg-gray-50 hover:border-gray-300",
        "dark:hover:bg-gray-800 dark:hover:border-gray-700",
        // disabled
        "disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400",
        "dark:disabled:bg-gray-900 dark:disabled:border-gray-800 dark:disabled:text-gray-600",
        // shadow for better contrast
        "shadow-sm dark:shadow-none",
      ],
      light: [
        // base
        "shadow-none",
        // border
        "border-transparent",
        // text color
        "text-gray-700 dark:text-gray-300",
        // background color
        "bg-gray-100 dark:bg-gray-800",
        // hover color
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        // disabled
        "disabled:bg-gray-50 dark:disabled:bg-gray-900",
        "disabled:text-gray-400 dark:disabled:text-gray-600",
      ],
      ghost: [
        // base
        "shadow-none",
        // border
        "border-transparent",
        // text color
        "text-gray-700 dark:text-gray-300",
        // background color
        "bg-transparent",
        // hover color
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        // disabled
        "disabled:text-gray-400 dark:disabled:text-gray-600",
        "hover:text-gray-900 dark:hover:text-gray-100",
      ],
      destructive: [
        // border
        "border-transparent",
        // text color
        "text-white",
        // background color
        "bg-red-500 dark:bg-red-600",
        // hover color
        "hover:bg-red-600 dark:hover:bg-red-500",
        // disabled
        "disabled:bg-red-300 dark:disabled:bg-red-800",
        "disabled:text-white/70 dark:disabled:text-white/50",
      ],
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-6 text-base",
      icon: "h-9 w-9 p-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isLoading = false,
      loadingText,
      className,
      disabled,
      variant,
      size,
      children,
      ...props
    }: ButtonProps,
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : "button"
    return (
      <Component
        ref={forwardedRef}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        tremor-id="tremor-raw"
        {...props}
      >
        {isLoading ? (
          <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
            <RiLoader2Fill
              className="size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
            <span className="sr-only">
              {loadingText ? loadingText : "Loading"}
            </span>
            {loadingText ? loadingText : children}
          </span>
        ) : (
          children
        )}
      </Component>
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants, type ButtonProps }
