import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: 'active' | 'passed' | 'failed' | 'pending';
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = 'md', showIcon = true, className }: StatusBadgeProps) {
  const configs = {
    active: {
      label: 'Active',
      icon: Clock,
      classes: 'bg-green-500/20 border-green-500/50 text-green-400'
    },
    passed: {
      label: 'Passed',
      icon: CheckCircle,
      classes: 'bg-green-500/20 border-green-500/50 text-green-400'
    },
    failed: {
      label: 'Failed',
      icon: XCircle,
      classes: 'bg-red-500/20 border-red-500/50 text-red-400'
    },
    pending: {
      label: 'Pending',
      icon: AlertCircle,
      classes: 'bg-amber-500/20 border-amber-500/50 text-amber-400'
    }
  };

  const config = configs[status] || configs['pending']; // fallback to pending if status not found
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4'
  };

  return (
    <div className={cn(
      'flex items-center space-x-2 rounded-full border font-medium transition-all duration-300',
      config.classes,
      sizeClasses[size],
      className
    )}>
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </div>
  );
}