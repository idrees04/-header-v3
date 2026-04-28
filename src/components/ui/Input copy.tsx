import React from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, onClear, value, ...props }, ref) => (
    <div className="relative flex items-center group">
      {leftIcon && (
        <span className="absolute left-2.5 text-[#9B9992] pointer-events-none flex items-center">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        value={value}
        className={cn(
          'flex h-8 w-full rounded-[5px] border border-[rgba(0,0,0,0.12)] bg-white px-3 py-1',
          'text-[11.5px] font-[var(--font-body)] text-[#18181A] placeholder:text-[#9B9992]',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[#2B7FD4] focus:ring-offset-0 focus:border-[#2B7FD4]',
          'hover:border-[rgba(0,0,0,0.22)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          leftIcon  && 'pl-8',
          (rightIcon || (onClear && value)) && 'pr-8',
          className
        )}
        {...props}
      />
      {onClear && value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2.5 text-[#9B9992] hover:text-[#18181A] transition-colors duration-150 flex items-center"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      ) : rightIcon ? (
        <span className="absolute right-2.5 text-[#9B9992] pointer-events-none flex items-center">
          {rightIcon}
        </span>
      ) : null}
    </div>
  )
);

Input.displayName = 'Input';
