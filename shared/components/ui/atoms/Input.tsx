'use client';

import React, { forwardRef, useState, useId } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, EyeOff, AlertCircle, CheckCircle, X } from 'lucide-react';
import { BaseComponentProps } from '@/shared/types';

// Input variants
const inputVariants = cva(
  [
    'flex w-full rounded-md border transition-all duration-200',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-neutral-300 bg-white px-3 py-2',
          'hover:border-neutral-400 focus-visible:border-primary-500',
          'dark:border-neutral-700 dark:bg-neutral-950 dark:hover:border-neutral-600',
        ],
        filled: [
          'border-transparent bg-neutral-100 px-3 py-2',
          'hover:bg-neutral-200 focus-visible:bg-white focus-visible:border-primary-500',
          'dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-950',
        ],
        flushed: [
          'border-0 border-b-2 border-neutral-300 rounded-none px-0 py-2',
          'hover:border-neutral-400 focus-visible:border-primary-500',
          'dark:border-neutral-700 dark:hover:border-neutral-600',
        ],
      },
      size: {
        sm: 'h-8 text-sm',
        default: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
      state: {
        default: '',
        error: 'border-error-500 focus-visible:border-error-500 focus-visible:ring-error-500',
        success: 'border-success-500 focus-visible:border-success-500 focus-visible:ring-success-500',
        warning: 'border-warning-500 focus-visible:border-warning-500 focus-visible:ring-warning-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

// Input props interface
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants>,
    BaseComponentProps {
  // Label and description
  label?: string;
  description?: string;
  helperText?: string;
  
  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Validation
  error?: string;
  success?: string;
  warning?: string;
  
  // Clearable input
  clearable?: boolean;
  onClear?: () => void;
  
  // Character count
  showCount?: boolean;
  maxLength?: number;
  
  // Loading state
  isLoading?: boolean;
  
  // Password toggle (for password inputs)
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      state,
      type = 'text',
      label,
      description,
      helperText,
      leftIcon,
      rightIcon,
      error,
      success,
      warning,
      clearable = false,
      onClear,
      showCount = false,
      maxLength,
      isLoading = false,
      showPasswordToggle = false,
      value,
      onChange,
      disabled,
      id,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputId = useId();
    const finalId = id || inputId;
    
    // Determine input type (handle password toggle)
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    // Determine validation state
    const validationState = error ? 'error' : success ? 'success' : warning ? 'warning' : state;
    
    // Get current value length
    const currentLength = typeof value === 'string' ? value.length : 0;
    
    // Handle clear button click
    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      onClear?.();
    };
    
    // Handle focus/blur for styling
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };
    
    // Validation message
    const validationMessage = error || success || warning;
    const validationIcon = error ? (
      <AlertCircle className="h-4 w-4 text-error-500" />
    ) : success ? (
      <CheckCircle className="h-4 w-4 text-success-500" />
    ) : warning ? (
      <AlertCircle className="h-4 w-4 text-warning-500" />
    ) : null;
    
    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={finalId}
            className={cn(
              'block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              validationState === 'error' && 'text-error-700',
              validationState === 'success' && 'text-success-700',
              validationState === 'warning' && 'text-warning-700'
            )}
          >
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        
        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          {/* Input element */}
          <input
            ref={ref}
            id={finalId}
            type={inputType}
            className={cn(
              inputVariants({ variant, size, state: validationState }),
              leftIcon && 'pl-10',
              (rightIcon || clearable || showPasswordToggle || validationIcon || isLoading) && 'pr-10',
              className
            )}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || isLoading}
            maxLength={maxLength}
            data-testid={testId || 'input'}
            {...props}
          />
          
          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Loading spinner */}
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted-foreground border-t-transparent" />
            )}
            
            {/* Validation icon */}
            {!isLoading && validationIcon}
            
            {/* Clear button */}
            {!isLoading && clearable && value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {/* Password toggle */}
            {!isLoading && type === 'password' && showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            
            {/* Custom right icon */}
            {!isLoading && !validationIcon && !clearable && !showPasswordToggle && rightIcon}
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="flex items-center justify-between gap-2 min-h-[1.25rem]">
          {/* Validation message or helper text */}
          <div className="flex items-center gap-1">
            {validationMessage ? (
              <p
                className={cn(
                  'text-sm',
                  validationState === 'error' && 'text-error-600',
                  validationState === 'success' && 'text-success-600',
                  validationState === 'warning' && 'text-warning-600'
                )}
              >
                {validationMessage}
              </p>
            ) : helperText ? (
              <p className="text-sm text-muted-foreground">{helperText}</p>
            ) : null}
          </div>
          
          {/* Character count */}
          {showCount && maxLength && (
            <p
              className={cn(
                'text-sm tabular-nums',
                currentLength > maxLength * 0.9 ? 'text-warning-600' : 'text-muted-foreground',
                currentLength > maxLength && 'text-error-600'
              )}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

// Export variants for external use
export { inputVariants };