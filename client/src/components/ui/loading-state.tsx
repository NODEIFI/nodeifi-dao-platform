import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function LoadingState({ icon: Icon, title, description, className }: LoadingStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-space text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}