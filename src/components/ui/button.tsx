import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-[5px] font-medium text-[11px] transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B7FD4] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#18181A] text-white hover:bg-[#2d2d30] border border-transparent',
        outline: 'bg-white border border-[rgba(0,0,0,0.12)] text-[#5C5B57] hover:bg-[#F2F1EE] hover:text-[#18181A]',
        ghost: 'bg-transparent border border-transparent text-[#5C5B57] hover:bg-[#F2F1EE] hover:text-[#18181A]',
        active: 'bg-[#18181A] text-white border border-[#18181A]',
        filter: 'bg-white border border-[rgba(0,0,0,0.10)] text-[#5C5B57] hover:bg-[#F2F1EE] hover:border-[rgba(0,0,0,0.18)]',
        filterOn: 'bg-[#18181A] text-white border border-[#18181A]',
      },
      size: {
        xs: 'h-6 px-2 py-0 text-[0.6875rem]',   // 11px
        sm: 'h-7 px-2.5 py-0 text-[0.75rem]',   // 12px
        md: 'h-8 px-3 py-0 text-[0.8125rem]',   // 13px
        lg: 'h-9 px-4 py-0 text-[0.875rem]',    // 14px (your base)
        xl: 'h-10 px-5 py-0 text-[0.9375rem]',  // 15px (optional, for dense desktop UI)
        icon: 'h-7 w-7 p-0',
      }
    },
    defaultVariants: {
      variant: 'outline',
      size: 'sm',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);

Button.displayName = 'Button';
