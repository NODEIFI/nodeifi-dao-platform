import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { UnifiedButton } from '@/components/ui/unified-button';

interface WalletConnection {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  isOnBaseNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet?: () => void;
}

interface WalletConnectionProps {
  wallet: WalletConnection;
  position?: 'fixed' | 'relative';
  className?: string;
  showDisconnect?: boolean;
}

export function WalletConnection({ 
  wallet, 
  position = 'fixed', 
  className = '',
  showDisconnect = false 
}: WalletConnectionProps) {
  const baseClasses = position === 'fixed' 
    ? 'fixed top-24 right-6 z-20' 
    : 'relative';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className={`${baseClasses} ${className}`}
    >
      {!wallet.isConnected ? (
        <UnifiedButton
          onClick={wallet.connectWallet}
          disabled={wallet.isConnecting}
          variant="primary"
          size="sm"
          className="shadow-lg backdrop-blur-sm bg-card/90 border border-border/50"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </UnifiedButton>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">
              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
            </span>
          </div>
          
          {!wallet.isOnBaseNetwork && (
            <div className="px-3 py-1 text-xs font-medium bg-amber-500/20 backdrop-blur-sm border border-amber-500/50 text-amber-400 rounded-lg shadow-lg">
              Switch to Base
            </div>
          )}
          
          {showDisconnect && wallet.disconnectWallet && (
            <UnifiedButton
              onClick={wallet.disconnectWallet}
              variant="secondary"
              size="sm"
              className="text-xs bg-card/90 backdrop-blur-sm border border-border/50"
            >
              Disconnect
            </UnifiedButton>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Compact version for headers/navigation
export function WalletConnectionCompact({ wallet, className = '' }: { wallet: WalletConnection; className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      {!wallet.isConnected ? (
        <UnifiedButton
          onClick={wallet.connectWallet}
          disabled={wallet.isConnecting}
          variant="secondary"
          size="sm"
          className="h-9"
        >
          <Wallet className="w-4 h-4 mr-1" />
          {wallet.isConnecting ? 'Connecting...' : 'Connect'}
        </UnifiedButton>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-card/80 border border-border/30 rounded-md px-2 py-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
            <span className="text-xs font-medium text-foreground">
              {wallet.address?.slice(0, 4)}...{wallet.address?.slice(-4)}
            </span>
          </div>
          
          {!wallet.isOnBaseNetwork && (
            <div className="px-2 py-1 text-xs bg-amber-500/20 border border-amber-500/50 text-amber-400 rounded-md">
              Base
            </div>
          )}
        </div>
      )}
    </div>
  );
}