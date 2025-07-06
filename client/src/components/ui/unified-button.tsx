import React from 'react';
import { cn } from '@/lib/utils';

export interface UnifiedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function UnifiedButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: UnifiedButtonProps) {
  const baseClasses = 'rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 focus-visible:ring-primary/50',
    secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20 focus-visible:ring-white/50',
    danger: 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 focus-visible:ring-red-500/50',
    success: 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 focus-visible:ring-green-500/50'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}