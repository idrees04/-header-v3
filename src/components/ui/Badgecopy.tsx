import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border font-medium transition-colors focus:outline-none select-none',
  {
    variants: {
      variant: {
        default:      'border-transparent bg-[#EBF4FF] text-[#1B5EA3]',
        commenced:    'border-[rgba(23,158,111,0.25)] bg-[#E8F8F2] text-[#0E6B4A]',
        pipeline:     'border-[rgba(109,79,194,0.25)] bg-[#F0EBFF] text-[#4A2F9E]',
        approvedU:    'border-[rgba(43,127,212,0.25)] bg-[#EBF4FF] text-[#1B5EA3]',
        approvedC:    'border-[rgba(217,119,6,0.25)] bg-[#FEF3C7] text-[#92530B]',
        nmi:          'border-[rgba(217,119,6,0.25)] bg-[#FEF9EC] text-[#92530B]',
        void:         'border-[rgba(0,0,0,0.10)] bg-[#F2F1EE] text-[#5C5B57]',
        duplicate:    'border-[rgba(194,80,122,0.25)] bg-[#FDEEF4] text-[#9E3660]',
        rejected:     'border-[rgba(220,53,69,0.25)] bg-[#FEE2E2] text-[#B02030]',
        new:          'border-[rgba(23,158,111,0.2)] bg-[#F0FBF7] text-[#0E6B4A]',
        noProgram:    'border-[rgba(0,0,0,0.08)] bg-[#F9F8F6] text-[#9B9992]',
        foundationLvl:'border-[rgba(43,127,212,0.2)] bg-[#EBF4FF] text-[#1B5EA3]',
        ugLvl:        'border-[rgba(23,158,111,0.2)] bg-[#E8F8F2] text-[#0E6B4A]',
        pgLvl:        'border-[rgba(109,79,194,0.2)] bg-[#F0EBFF] text-[#4A2F9E]',
        dipLvl:       'border-[rgba(217,119,6,0.2)] bg-[#FEF3C7] text-[#92530B]',
        langLvl:      'border-[rgba(23,158,111,0.2)] bg-[#F0FBF7] text-[#0E6B4A]',
        phdLvl:       'border-[rgba(194,80,122,0.2)] bg-[#FDEEF4] text-[#9E3660]',
      },
      size: {
        sm: 'px-1.5 py-0 text-[9.5px] h-[18px]',
        md: 'px-2 py-0 text-[10px] h-[20px]',
        lg: 'px-2.5 py-0.5 text-[11px] h-[22px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, dotColor, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className="inline-block rounded-full flex-shrink-0"
          style={{
            width: 5,
            height: 5,
            background: dotColor ?? 'currentColor',
          }}
        />
      )}
      {children}
    </span>
  )
);

Badge.displayName = 'Badge';
