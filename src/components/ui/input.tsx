import React from 'react';
import { cn } from '../../lib/cn';
import { useScaling } from '@/hooks/useScaling';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, onClear, value, style, ...props }, ref) => {
    const { sc, font } = useScaling();
    
    return (
      <div className="relative flex items-center group w-full">
        {leftIcon && (
          <span 
            className="absolute text-[#9B9992] pointer-events-none flex items-center"
            style={{ left: sc(10) }}
          >
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          value={value}
          style={{ 
            fontSize: font(0.875),
            paddingLeft: leftIcon ? sc(32) : sc(12),
            paddingRight: (rightIcon || (onClear && value)) ? sc(32) : sc(12),
            borderRadius: sc(5),
            height: sc(32),
            ...style 
          }}
          className={cn(
            'flex w-full border border-[rgba(0,0,0,0.12)] bg-white py-1',
            'font-[var(--font-body)] text-[#18181A] placeholder:text-[#9B9992]',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#2B7FD4] focus:ring-offset-0 focus:border-[#2B7FD4]',
            'hover:border-[rgba(0,0,0,0.22)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        {onClear && value ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute text-[#9B9992] hover:text-[#18181A] transition-colors duration-150 flex items-center"
            style={{ right: sc(10) }}
          >
            <svg width={sc(12)} height={sc(12)} viewBox="0 0 12 12" fill="none">
              <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        ) : rightIcon ? (
          <span 
            className="absolute text-[#9B9992] pointer-events-none flex items-center"
            style={{ right: sc(10) }}
          >
            {rightIcon}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
