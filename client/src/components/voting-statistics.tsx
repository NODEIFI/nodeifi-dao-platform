import { useState, useEffect, useCallback } from 'react';
import { Clock, Users, Target, CheckCircle } from "lucide-react";

interface VotingStatisticsProps {
  proposalId: string;
}

const MULTISIG_CONTRACT_ADDRESS = '0x2c154014103b5EC2AC0337599fDe0F382d9fB52f';

interface MultisigData {
  currentConfirmations: number;
  requiredConfirmations: number;
  totalOwners: number;
  isExecuted: boolean;
  isConfirmed: boolean;
  owners: string[];
  confirmations: string[];
  endDate?: string;
}

// Helper function to calculate countdown (days and hours only)
const useCountdown = (endDate: string) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const timeDiff = end - now;

      if (timeDiff <= 0) {
        setTimeLeft('Voting ended');
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (days > 0) {
        setTimeLeft(`${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} hour${hours !== 1 ? 's' : ''} left`);
      } else {
        setTimeLeft('Less than 1 hour left');
      }
    };

    calculateTimeRemaining();
    // Update every hour instead of every second
    const interval = setInterval(calculateTimeRemaining, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
};

export const VotingStatistics = ({ proposalId }: VotingStatisticsProps) => {
  const [multisigData, setMultisigData] = useState<MultisigData | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  
  // Real-time countdown hook
  const timeLeft = useCountdown(multisigData?.endDate || '');

  const fetchMultisigData = useCallback(async () => {
    try {
      // Use different loading states for initial vs refresh
      if (multisigData === null) {
        setIsInitialLoad(true);
      } else {
        setIsRefreshing(true);
      }
      console.log("🔗 Fetching real DAO data from server...");
      console.log("🎯 Proposal ID:", proposalId);

      const response = await fetch('/api/dao/proposals');
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      if (!data.proposals || !Array.isArray(data.proposals)) {
        throw new Error('Invalid response format');
      }

      // Find the specific proposal
      const proposal = data.proposals.find((p: any) => p.id === proposalId);
      if (!proposal) {
        throw new Error(`Proposal ${proposalId} not found`);
      }

      console.log("✅ Found proposal data:", proposal);

      // PRIORITY: Use live blockchain confirmationCount over cached votes
      const liveConfirmations = proposal.confirmationCount || proposal.contractData?.confirmationCount || 0;
      const requiredConfirmations = proposal.requiredConfirmations || proposal.contractData?.requiredConfirmations || 3;
      
      console.log(`🔥 BLOCKCHAIN DATA DEBUG - Proposal ${proposalId}:`);
      console.log(`   Live Confirmations: ${liveConfirmations}`);
      console.log(`   Required: ${requiredConfirmations}`);
      console.log(`   Vote fallback: ${proposal.votes?.yes || 0}`);
      console.log(`   Data source: ${proposal.contractData?.dataSource || 'Unknown'}`);
      
      const processedData: MultisigData = {
        currentConfirmations: liveConfirmations, // Use blockchain data directly
        requiredConfirmations: requiredConfirmations,
        totalOwners: proposal.totalVotingPower || 10,
        isExecuted: proposal.status === 'Executed',
        isConfirmed: liveConfirmations >= requiredConfirmations,
        owners: [],
        confirmations: proposal.contractData?.confirmations || [],
        endDate: proposal.endDate
      };

      console.log("📈 Processed multisig data:", processedData);
      setMultisigData(processedData);
      setLastFetched(new Date());
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching multisig data:", err);
      // Keep existing data visible on error, just update error state
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsInitialLoad(false);
      setIsRefreshing(false);
    }
  }, [proposalId]);

  // Initial fetch and polling
  useEffect(() => {
    fetchMultisigData().catch(error => {
      console.error('Initial fetch failed:', error);
    });

    // Set up polling every 45 seconds for real-time updates
    const interval = setInterval(() => {
      fetchMultisigData().catch(error => {
        console.error('Polling fetch failed:', error);
      });
    }, 45000);

    return () => clearInterval(interval);
  }, [fetchMultisigData]);

  // Show loading skeleton only on initial load
  if (isInitialLoad && !multisigData) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Show error only if no data exists at all
  if (error && !multisigData) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="text-red-400 text-center">
          Failed to load voting data: {error}
        </div>
      </div>
    );
  }

  if (!multisigData) {
    return null;
  }

  const { currentConfirmations, requiredConfirmations, totalOwners, isExecuted, isConfirmed, endDate } = multisigData;
  
  // Calculate percentages with accurate threshold positioning
  const participationPercentage = totalOwners > 0 ? (currentConfirmations / totalOwners) * 100 : 0;
  const thresholdPercentage = totalOwners > 0 ? (requiredConfirmations / totalOwners) * 100 : 0;
  const pendingVotes = totalOwners - currentConfirmations;
  const approvePercentage = totalOwners > 0 ? (currentConfirmations / totalOwners) * 100 : 0;
  const pendingPercentage = totalOwners > 0 ? (pendingVotes / totalOwners) * 100 : 0;
  
  // Ensure progress bar clearly extends past threshold when confirmed
  const displayPercentage = isConfirmed && approvePercentage >= thresholdPercentage 
    ? Math.max(approvePercentage, thresholdPercentage + 3) 
    : approvePercentage;

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Voting</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isRefreshing && (
            <div className="animate-spin w-3 h-3 border border-blue-400 border-t-transparent rounded-full mr-1"></div>
          )}
          <Clock className="w-4 h-4" />
          <span>{isExecuted ? 'Executed' : isConfirmed ? 'Approved' : 'Active'}</span>
          {error && multisigData && (
            <span className="text-orange-400 text-xs ml-2">Connection issues</span>
          )}
        </div>
      </div>
      
      {/* Time Remaining and Multisig Address */}
      <div className="space-y-2 mb-6">
        {endDate && timeLeft && (
          <div className="text-sm font-medium text-blue-400 animate-pulse">
            {timeLeft} to vote
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          {MULTISIG_CONTRACT_ADDRESS.slice(0, 6)}…{MULTISIG_CONTRACT_ADDRESS.slice(-4)}
        </div>
      </div>
      
      {/* Progress Bar with Threshold Marker */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-3">
          <span>0</span>
          <span className="font-medium">{totalOwners} members</span>
        </div>
        
        {/* Main Progress Bar with extra spacing for threshold markers */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-16 mt-16">
          {/* Current confirmations fill */}
          <div 
            className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.min(displayPercentage, 100)}%` }}
          />
          
          {/* Approval threshold marker */}
          {thresholdPercentage > 0 && thresholdPercentage <= 100 && (
            <div 
              className="absolute z-30 pointer-events-none"
              style={{ 
                left: `${thresholdPercentage}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {/* Main vertical threshold line - make it very prominent */}
              <div 
                className={`absolute w-1 ${
                  isConfirmed ? 'bg-orange-400' : 'bg-red-400'
                } shadow-lg`}
                style={{ 
                  left: '0px',
                  top: '-24px',
                  height: '60px'
                }}
              >
                {/* Top arrow pointer */}
                <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 ${
                  isConfirmed 
                    ? 'border-l-4 border-r-4 border-b-4 border-transparent border-b-orange-400' 
                    : 'border-l-4 border-r-4 border-b-4 border-transparent border-b-red-400'
                }`}></div>
                
                {/* Bottom arrow pointer */}
                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 ${
                  isConfirmed 
                    ? 'border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-400' 
                    : 'border-l-4 border-r-4 border-t-4 border-transparent border-t-red-400'
                }`}></div>
              </div>
              
              {/* Prominent threshold label */}
              <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap px-3 py-2 rounded-lg font-bold shadow-lg ${
                isConfirmed 
                  ? 'bg-orange-500 text-white border-2 border-orange-400' 
                  : 'bg-red-500 text-white border-2 border-red-400'
              }`}>
                Threshold: {requiredConfirmations} votes
                {isConfirmed && (
                  <div className="text-xs mt-1 font-normal">✓ PASSED</div>
                )}
              </div>
              

            </div>
          )}
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Current: <span className="font-medium text-foreground">{currentConfirmations}</span></span>
          <span>Total: <span className="font-medium text-foreground">{totalOwners}</span></span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-1 mb-6 border-b border-border">
        <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">
          Breakdown
        </button>
      </div>

      {/* Approval Status */}
      <div className="text-center mb-6">
        <div className="text-sm text-muted-foreground mb-2">
          {isConfirmed ? "Approval reached" : `${currentConfirmations} of ${totalOwners} members`}
        </div>
        {isConfirmed && (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Approval reached</span>
          </div>
        )}
      </div>
      
      {/* Vote Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span className="text-sm font-medium">Approve</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{currentConfirmations} votes</span>
            <span className="text-muted-foreground ml-1">({approvePercentage.toFixed(1)}%)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
            <span className="text-sm font-medium">Pending</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{pendingVotes} votes</span>
            <span className="text-muted-foreground ml-1">({pendingPercentage.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Participation</span>
          </div>
          <span className="font-medium">{currentConfirmations} of {totalOwners} owners ({participationPercentage.toFixed(1)}%)</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Required</span>
          </div>
          <span className={`font-medium ${isConfirmed ? 'text-green-400' : 'text-muted-foreground'}`}>
            {requiredConfirmations} confirmations ({thresholdPercentage.toFixed(0)}% threshold)
            {isConfirmed && <span className="ml-1">✓</span>}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Status</span>
          </div>
          <span className={`font-medium ${isExecuted ? 'text-blue-400' : isConfirmed ? 'text-green-400' : 'text-yellow-400'}`}>
            {isExecuted ? 'Executed' : isConfirmed ? 'Approved' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
};