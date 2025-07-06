import React from 'react';
import { XCircle } from 'lucide-react';
import { UnifiedButton } from './unified-button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({ 
  title, 
  description, 
  onRetry, 
  retryLabel = 'Try Again',
  className 
}: ErrorStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="font-space text-xl font-bold text-red-400 mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      {onRetry && (
        <UnifiedButton variant="primary" onClick={onRetry}>
          {retryLabel}
        </UnifiedButton>
      )}
    </div>
  );
}