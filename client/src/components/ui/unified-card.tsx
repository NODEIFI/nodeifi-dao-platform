import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface UnifiedCardProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export function UnifiedCard({ 
  children, 
  size = 'md', 
  hover = true, 
  className, 
  onClick 
}: UnifiedCardProps) {
  const baseClasses = 'backdrop-blur-sm bg-white/5 border border-white/20 rounded-3xl';
  
  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverProps = hover ? {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2 }
  } : {};

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      className={cn(
        baseClasses,
        sizes[size],
        onClick && 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        className
      )}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </Component>
  );
}