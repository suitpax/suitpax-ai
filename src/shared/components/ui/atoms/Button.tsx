'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { BaseComponentProps, SizeVariant } from '@/src/shared/types';

// Button variants using CVA for better type safety and performance
const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md text-sm font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'relative overflow-hidden',
    'active:scale-[0.98] transform-gpu',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary-600 text-white shadow-md hover:bg-primary-700',
          'active:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700',
        ],
        destructive: [
          'bg-error-600 text-white shadow-md hover:bg-error-700',
          'active:bg-error-800 dark:bg-error-600 dark:hover:bg-error-700',
        ],
        outline: [
          'border border-neutral-300 bg-white hover:bg-neutral-50 hover:text-neutral-900',
          'dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        ],
        secondary: [
          'bg-secondary-100 text-secondary-900 shadow-sm hover:bg-secondary-200',
          'dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700',
        ],
        ghost: [
          'hover:bg-neutral-100 hover:text-neutral-900',
          'dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        ],
        link: [
          'text-primary-600 underline-offset-4 hover:underline',
          'dark:text-primary-400',
        ],
        gradient: [
          'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg',
          'hover:from-primary-700 hover:to-primary-800 hover:shadow-xl',
          'active:from-primary-800 active:to-primary-900',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
      },
      rounded: {
        default: 'rounded-md',
        sm: 'rounded-sm',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        ping: 'animate-ping',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
      animation: 'none',
    },
  }
);

// Enhanced button props with better type safety
export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>,
    BaseComponentProps {
  // Loading state
  isLoading?: boolean;
  loadingText?: string;
  
  // Icon support
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Tooltip
  tooltip?: string;
  
  // Analytics tracking
  trackingId?: string;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      animation,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      onClick,
      trackingId,
      ariaLabel,
      ariaDescribedBy,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    // Handle click with analytics tracking
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled) return;
      
      // Track button click if tracking ID is provided
      if (trackingId && typeof window !== 'undefined') {
        // Analytics tracking would go here
        console.debug('Button clicked:', trackingId);
      }
      
      onClick?.(event);
    };

    // Determine if button should be disabled
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, rounded, animation }), className)}
        disabled={isDisabled}
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={isDisabled}
        data-testid={testId || 'button'}
        {...props}
      >
        {/* Left icon or loading spinner */}
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="inline-flex items-center justify-center">
            {leftIcon}
          </span>
        ) : null}

        {/* Button content */}
        <span className={cn('truncate', isLoading && loadingText && 'sr-only')}>
          {children}
        </span>

        {/* Loading text */}
        {isLoading && loadingText && (
          <span className="truncate">{loadingText}</span>
        )}

        {/* Right icon (hidden during loading) */}
        {!isLoading && rightIcon && (
          <span className="inline-flex items-center justify-center">
            {rightIcon}
          </span>
        )}

        {/* Ripple effect overlay */}
        <span 
          className="absolute inset-0 opacity-0 transition-opacity duration-200 hover:opacity-10 bg-white rounded-[inherit]"
          aria-hidden="true"
        />
      </button>
    );
  }
);

Button.displayName = 'Button';

// Export variants for external use
export { buttonVariants };

// Compound components for common patterns
export const ButtonGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical';
    size?: SizeVariant;
    variant?: VariantProps<typeof buttonVariants>['variant'];
  }
>(({ className, orientation = 'horizontal', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        orientation === 'horizontal' ? '[&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:-ml-px' : '[&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:-mt-px',
        className
      )}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
});

ButtonGroup.displayName = 'ButtonGroup';