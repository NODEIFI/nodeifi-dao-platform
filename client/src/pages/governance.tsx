import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Vote, Users, Shield, CheckCircle, XCircle, Clock, Wallet, ExternalLink, ArrowLeft, TrendingUp, Archive } from 'lucide-react';
import { Link } from 'wouter';
import { DAOService, type DAOProposal } from '@/lib/dao-service';
import { UnifiedButton } from '@/components/ui/unified-button';
import { UnifiedCard } from '@/components/ui/unified-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { useQuery } from '@tanstack/react-query';
import { WalletConnection } from '@/components/wallet-connection';
import { useWalletGlobal } from '@/hooks/use-wallet-global';

const DAO_ADDRESS = '0x2c154014103b5EC2AC0337599fDe0F382d9fB52f';

// Utility function for consistent date formatting
const formatTimeAgo = (dateString: string) => {
  if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string:', dateString);
    return 'Invalid date';
  }
  
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) return 'Future date';
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1 day ago';
  return `${diffInDays} days ago`;
};

// TypeScript declaration for Web3 wallets
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      isRabby?: boolean;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

// Wallet hook for proper state management
function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const BASE_CHAIN_ID = '0x2105'; // Base mainnet (8453 in decimal)

  const connectWallet = async () => {
    console.log('=== CONNECT WALLET INITIATED ===');
    console.log('Current state before connect:', { isConnected, address, isConnecting });
    
    if (!window.ethereum) {
      alert('No Web3 wallet detected. Please install a compatible wallet browser extension (MetaMask, Coinbase Wallet, etc.) to connect.');
      return;
    }

    try {
      setIsConnecting(true);
      console.log('Set isConnecting to true');
      console.log('Requesting wallet accounts...');
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts && accounts.length > 0) {
        console.log('Received accounts:', accounts);
        console.log('Setting wallet connected state...');
        setAddress(accounts[0]);
        setIsConnected(true);
        console.log('State should now be connected with address:', accounts[0]);
        
        // Get chain ID
        const chain = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chain);
        console.log('Chain ID set to:', chain);
        
        // Switch to Base if not already connected
        if (chain !== BASE_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: BASE_CHAIN_ID }],
            });
            setChainId(BASE_CHAIN_ID);
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              // Chain not added yet
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: BASE_CHAIN_ID,
                  chainName: 'Base',
                  rpcUrls: ['https://mainnet.base.org'],
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                  blockExplorerUrls: ['https://basescan.org']
                }],
              });
              setChainId(BASE_CHAIN_ID);
            }
          }
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setIsConnected(false);
      setAddress(null);
    } finally {
      setIsConnecting(false);
      console.log('Connect completed');
    }
  };

  const disconnectWallet = () => {
    console.log('=== DISCONNECT WALLET ===');
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
  };

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length === 0) {
        console.log('No accounts - disconnecting wallet');
        setIsConnected(false);
        setAddress(null);
      } else {
        console.log('Received accounts:', accounts);
        console.log('Setting wallet connected state...');
        setAddress(accounts[0]);
        setIsConnected(true);
        console.log('State should now be connected with address:', accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      console.log('Chain changed:', chainId);
      setChainId(chainId);
    };

    const handleDisconnect = () => {
      console.log('Wallet disconnected');
      setIsConnected(false);
      setAddress(null);
      setChainId(null);
    };

    if (window.ethereum) {
      window.ethereum.on?.('accountsChanged', handleAccountsChanged);
      window.ethereum.on?.('chainChanged', handleChainChanged);
      window.ethereum.on?.('disconnect', handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener?.('chainChanged', handleChainChanged);
        window.ethereum.removeListener?.('disconnect', handleDisconnect);
      }
    };
  }, []);

  return {
    isConnected,
    address,
    chainId,
    isConnecting,
    connectWallet,
    disconnectWallet,
    isOnBaseNetwork: chainId === BASE_CHAIN_ID
  };
}

// DAO Statistics Component
function DAOStatistics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dao/stats'],
    queryFn: async () => {
      const daoService = new DAOService();
      return await daoService.getDAOStats();
    },
    staleTime: 10000, // Data is fresh for 10 seconds
    gcTime: 300000, // Keep cached for 5 minutes
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true, // Refetch when window gains focus
    retry: 3, // Retry failed requests 3 times
    refetchOnMount: true, // Always refetch when component mounts
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-card/50 dark:bg-card/50 border border-border/50 rounded-lg p-6">
              <div className="h-4 bg-muted rounded w-20 mb-2"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <Archive className="w-6 h-6 text-accent mr-2" />
              <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">Proposals</span>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-white to-accent bg-clip-text text-transparent font-space">
              {stats?.totalProposals || 0}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-primary mr-2" />
              <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">Members</span>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent font-space">
              {stats?.members || 0}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-accent rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">Treasury</span>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent font-space">
              ${stats?.treasury || '0.00'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Active Proposals Component
function ActiveProposals() {
  const { data: allProposals, isLoading, error } = useQuery({
    queryKey: ['/api/dao/proposals'],
    queryFn: async () => {
      const daoService = new DAOService();
      return await daoService.getDAOProposals();
    },
    staleTime: 10000, // Data is fresh for 10 seconds
    gcTime: 300000, // Keep cached for 5 minutes
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true, // Refetch when window gains focus
    retry: 3, // Retry failed requests 3 times
    refetchOnMount: true, // Always refetch when component mounts
  });

  // Filter for only active proposals with safe data handling
  const activeProposals = React.useMemo(() => {
    if (!allProposals) return [];
    
    let proposalsArray: any[] = [];
    
    // Handle different response formats safely
    if (Array.isArray(allProposals)) {
      proposalsArray = allProposals;
    } else if (allProposals && typeof allProposals === 'object') {
      if ((allProposals as any).proposals && Array.isArray((allProposals as any).proposals)) {
        proposalsArray = (allProposals as any).proposals;
      } else {
        console.warn('Proposals data is not in expected format:', allProposals);
        return [];
      }
    } else {
      console.warn('Invalid proposals data type:', typeof allProposals);
      return [];
    }
    
    return proposalsArray.filter((proposal: any) => 
      proposal && proposal.status && proposal.status.toLowerCase() === 'active'
    );
  }, [allProposals]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-card/50 dark:bg-card/50 border border-border/50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
              <div className="h-16 bg-muted rounded mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="h-3 bg-muted rounded w-32"></div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load active proposals"
        description="There was an error fetching active proposals."
        onRetry={() => window.location.reload()}
        retryLabel="Try Again"
      />
    );
  }

  if (activeProposals.length === 0) {
    return (
      <UnifiedCard className="text-center py-8">
        <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Active Proposals</h3>
        <p className="text-muted-foreground">
          There are currently no proposals available for voting.
        </p>
      </UnifiedCard>
    );
  }

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      {activeProposals.map((proposal: any, index: number) => (
        <motion.div
          key={proposal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/governance/proposal/${proposal.id}`}>
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-accent rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-card/80 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <StatusBadge status={proposal.status} />
                      <span className="text-sm text-gray-400">
                        {formatTimeAgo(proposal.startDate)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {proposal.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                  {proposal.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    by {truncateAddress(proposal.creatorAddress)}
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// Latest Proposals Component
function LatestProposals() {
  const { data: proposals, isLoading, error } = useQuery({
    queryKey: ['/api/dao/proposals'],
    queryFn: async () => {
      console.log('LatestProposals: Starting query...');
      const daoService = new DAOService();
      const result = await daoService.getDAOProposals();
      console.log('LatestProposals: Query result:', result);
      return result;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Process proposals data with safe handling
  const processedProposals = React.useMemo(() => {
    if (!proposals) return [];
    
    let proposalsArray: any[] = [];
    
    // Handle different response formats safely
    if (Array.isArray(proposals)) {
      proposalsArray = proposals;
    } else if (proposals && typeof proposals === 'object') {
      if ((proposals as any).proposals && Array.isArray((proposals as any).proposals)) {
        proposalsArray = (proposals as any).proposals;
      } else {
        console.warn('Proposals data is not in expected format:', proposals);
        return [];
      }
    } else {
      console.warn('Invalid proposals data type:', typeof proposals);
      return [];
    }
    
    return proposalsArray.slice(0, 3);
  }, [proposals]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-card/50 dark:bg-card/50 border border-border/50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
              <div className="h-16 bg-muted rounded mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="h-3 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load proposals"
        description="There was an error fetching the latest DAO proposals."
        onRetry={() => window.location.reload()}
        retryLabel="Try Again"
      />
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <UnifiedCard className="text-center py-12">
        <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Proposals Found</h3>
        <p className="text-muted-foreground mb-4">
          No proposals are currently available from the DAO.
        </p>
        <UnifiedButton
          onClick={() => window.open(`https://app.aragon.org/dao/base-mainnet/${DAO_ADDRESS}/dashboard`, '_blank')}
          variant="secondary"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Aragon
        </UnifiedButton>
      </UnifiedCard>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed': return 'Executed';
      case 'accepted': return 'Accepted';
      case 'failed': return 'Rejected';
      case 'rejected': return 'Rejected';
      case 'active': return 'Active';
      default: return 'Pending';
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      {processedProposals.map((proposal: any, index: number) => (
        <motion.div
          key={proposal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {getStatusIcon(proposal.status)}
                    <StatusBadge status={proposal.status} />
                    <span className="text-sm text-gray-400">
                      {formatTimeAgo(proposal.startDate)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {proposal.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                {proposal.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  by {truncateAddress(proposal.creatorAddress)}
                </div>
                
                {proposal.status !== 'active' && (
                  <div className="text-sm text-gray-400">
                    Approvals: {proposal.votesFor}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      <div className="text-center pt-4">
        <UnifiedButton
          onClick={() => window.open(`https://app.aragon.org/dao/base-mainnet/${DAO_ADDRESS}/proposals`, '_blank')}
          variant="secondary"
          size="lg"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View All Proposals
        </UnifiedButton>
      </div>
    </div>
  );
}

// Main Governance Component
export default function Governance() {
  const wallet = useWalletGlobal();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic background matching the site theme */}
      <div className="absolute inset-0 cosmic-gradient"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2026&h=1350')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 w-2 h-2 bg-accent rounded-full opacity-60"
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-1 h-1 bg-primary rounded-full opacity-80"
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-32 left-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-40"
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-70"
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <Navigation />
      
      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Back to Home button matching site theme */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start mb-8"
            >
              <Link href="/">
                <UnifiedButton variant="secondary" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </UnifiedButton>
              </Link>
            </motion.div>
            
            {/* DAO Header with improved styling */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center mb-8"
              >
                <div className="relative mb-6">
                  {/* Static logo container with dynamic effects */}
                  <div className="relative w-32 h-32">
                    {/* Outer glow ring */}
                    <motion.div 
                      className="absolute -inset-4 rounded-full bg-gradient-to-r from-accent via-primary to-purple-500 opacity-30 blur-lg"
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                    />
                    
                    {/* Middle glow ring */}
                    <motion.div 
                      className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary to-accent opacity-40 blur-md"
                      animate={{ 
                        rotate: [360, 0],
                        opacity: [0.2, 0.6, 0.2]
                      }}
                      transition={{ 
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    />
                    
                    {/* Static logo container with hover effect */}
                    <motion.div 
                      className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl shadow-primary/30 border-2 border-primary/20"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Nodeifi logo */}
                      <img 
                        src="https://miro.medium.com/v2/resize:fit:2400/1*UNHUwKwBIZmHq3G97HrrzQ.png"
                        alt="Nodeifi DAO Logo"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay gradient for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ 
                          x: [-150, 150],
                          opacity: [0, 0.8, 0]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity, 
                          repeatDelay: 3,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Pulse effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-accent/50"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                    
                    {/* Floating particles around logo */}
                    <motion.div
                      className="absolute top-0 left-1/2 w-1 h-1 bg-accent rounded-full"
                      animate={{
                        x: [-20, 20, -20],
                        y: [-10, 10, -10],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full"
                      animate={{
                        x: [10, -10, 10],
                        y: [10, -10, 10],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-accent to-primary bg-clip-text text-transparent font-space tracking-wide">
                    NODEIFI DAO
                  </h1>
                  <p className="text-xl text-gray-300 font-light tracking-wide">
                    Decentralized governance for the Web3 community
                  </p>
                </div>
              </motion.div>
              
              {/* Network and Aragon info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-6 text-sm text-gray-400"
              >
                <div className="flex items-center gap-2 px-3 py-1 bg-card/20 backdrop-blur-sm rounded-full border border-border/20">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>Base Network</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-card/20 backdrop-blur-sm rounded-full border border-border/20 hover:bg-card/30 transition-colors">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <a 
                    href={`https://app.aragon.org/dao/base-mainnet/${DAO_ADDRESS}/dashboard`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    View on Aragon
                  </a>
                </div>
              </motion.div>
              
              {/* Journey to Decentralization Link */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-4"
              >
                <Link href="/journey-to-decentralization">
                  <button className="group relative px-8 py-3 bg-gradient-to-r from-primary to-accent rounded-full border border-white/20 hover:scale-110 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 overflow-hidden">
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    {/* Button text - solid white, no effects */}
                    <span className="relative z-10 text-white font-semibold text-sm">
                      Read the Journey to Decentralization
                    </span>
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* DAO Statistics */}
          <DAOStatistics />

          {/* Wallet Connection in top right corner */}
          <WalletConnection 
            wallet={wallet} 
            position="fixed" 
            showDisconnect={true}
          />

          {/* Active Proposals Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Active Proposals</h2>
              <div className="text-sm text-muted-foreground">
                Vote on current proposals
              </div>
            </div>
            <ActiveProposals />
          </motion.div>

          {/* Latest Proposals Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Latest Proposals</h2>
              <div className="text-sm text-muted-foreground">
                Auto-refreshes every 30 seconds
              </div>
            </div>
            <LatestProposals />
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}