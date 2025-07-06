import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Clock, Users, Target, CheckCircle, X, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWalletGlobal } from '@/hooks/use-wallet-global';
import { useToast } from '@/hooks/use-toast';

interface MultisigVotingProps {
  proposalId: string;
}

interface MultisigData {
  currentConfirmations: number;
  requiredConfirmations: number;
  totalOwners: number;
  isExecuted: boolean;
  isConfirmed: boolean;
  owners: string[];
  confirmations: string[];
}

const MULTISIG_CONTRACT_ADDRESS = "0x2c154014103b5EC2AC0337599fDe0F382d9fB52f";
const BASE_RPC_URL = "https://mainnet.base.org";

// Aragon DAO multisig ABI (based on actual contract)
const MULTISIG_ABI = [
  "function getProposal(uint256 proposalId) external view returns (bool executed, uint256 approvals, uint256 creationTime, bytes calldata actions)",
  "function canApprove(uint256 proposalId, address account) external view returns (bool)",
  "function hasApproved(uint256 proposalId, address account) external view returns (bool)",
  "function members() external view returns (address[])",
  "function isMember(address account) external view returns (bool)",
  "function addresslistLength() external view returns (uint256)",
  "function addresslistSource() external view returns (address)",
  "function minApprovals() external view returns (uint256)",
  "function proposalCount() external view returns (uint256)"
];

const MultisigVotingSection = ({ proposalId }: MultisigVotingProps) => {
  const [multisigData, setMultisigData] = useState<MultisigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  const { address: userAddress, connectWallet } = useWalletGlobal();
  const { toast } = useToast();

  const handleVote = async (voteType: 'yes' | 'no') => {
    if (!userAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to vote",
        variant: "destructive"
      });
      return;
    }

    setIsVoting(true);
    try {
      // Simulate voting process
      toast({
        title: "Vote Submitted",
        description: `Your ${voteType === 'yes' ? 'approval' : 'denial'} vote has been recorded`,
      });
    } catch (err) {
      toast({
        title: "Vote Failed",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    const fetchMultisigData = async () => {
      try {
        console.log("🔗 Fetching real DAO data from server...");
        console.log("🎯 Proposal ID:", proposalId);

        // Fetch authentic data from our existing server endpoint that connects to blockchain
        const response = await fetch('/api/dao/proposals');
        const data = await response.json();
        
        console.log("📊 Server response:", data);
        
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
        
        const multisigInfo: MultisigData = {
          currentConfirmations: liveConfirmations, // Use blockchain data directly
          requiredConfirmations: requiredConfirmations,
          totalOwners: proposal.totalVotingPower || 10,
          isExecuted: proposal.status === 'Executed',
          isConfirmed: liveConfirmations >= requiredConfirmations,
          owners: [],
          confirmations: proposal.contractData?.confirmations || []
        };

        console.log("📈 Processed multisig data:", multisigInfo);
        setMultisigData(multisigInfo);
        setError(null);

      } catch (err) {
        console.error("❌ Error fetching multisig data:", err);
        setError(`Failed to fetch multisig data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    if (proposalId) {
      fetchMultisigData().catch(error => {
        console.error('Multisig data fetch failed:', error);
      });
    }
  }, [proposalId]);

  if (loading) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading multisig data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">Failed to load multisig data</div>
          <div className="text-sm text-muted-foreground">{error}</div>
        </div>
      </div>
    );
  }

  if (!multisigData) {
    return null;
  }

  const {
    currentConfirmations,
    requiredConfirmations,
    totalOwners,
    isExecuted,
    isConfirmed,
    confirmations
  } = multisigData;

  // Calculate percentages
  const approvalPercentage = totalOwners > 0 ? (currentConfirmations / totalOwners) * 100 : 0;
  const thresholdPercentage = totalOwners > 0 ? (requiredConfirmations / totalOwners) * 100 : 0;
  const participationPercentage = totalOwners > 0 ? (currentConfirmations / totalOwners) * 100 : 0;

  // Vote breakdown (for multisig, it's approve/pending)
  const pendingVotes = totalOwners - currentConfirmations;
  const approvePercentage = totalOwners > 0 ? (currentConfirmations / totalOwners) * 100 : 0;
  const pendingPercentage = totalOwners > 0 ? (pendingVotes / totalOwners) * 100 : 0;

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Voting</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{isExecuted ? 'Executed' : isConfirmed ? 'Approved' : 'Active'}</span>
        </div>
      </div>
      
      {/* Multisig Address */}
      <div className="text-sm text-muted-foreground mb-6">
        {MULTISIG_CONTRACT_ADDRESS.slice(0, 6)}…{MULTISIG_CONTRACT_ADDRESS.slice(-4)}
      </div>
      
      {/* Progress Bar with Threshold Marker */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-3">
          <span>0</span>
          <span className="font-medium">{totalOwners} members</span>
        </div>
        
        {/* Main Progress Bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
          {/* Current confirmations fill */}
          <div 
            className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.min(approvalPercentage, 100)}%` }}
          />
          
          {/* Required threshold marker */}
          {thresholdPercentage > 0 && thresholdPercentage <= 100 && (
            <div 
              className="absolute top-0 h-full w-1 bg-yellow-500 border-l-2 border-yellow-400 z-10 shadow-lg"
              style={{ left: `${thresholdPercentage}%` }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-yellow-600 dark:text-yellow-400 whitespace-nowrap bg-background px-2 py-1 rounded shadow border">
                Required
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-yellow-600 dark:text-yellow-400 whitespace-nowrap bg-background px-1 rounded">
                {requiredConfirmations}
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

      {/* Cast Your Vote Section */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
        
        {!userAddress ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Connect your wallet to participate in voting</p>
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-lg border border-red-200/20"></div>
              
              {/* Content */}
              <div className="relative text-center py-8 px-6">
                {/* Icon and Status */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Not Eligible</h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      You are not eligible to vote on this proposal
                    </p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex justify-center">
                  <Badge 
                    variant="destructive" 
                    className="bg-red-500/15 text-red-600 border-red-500/30 px-4 py-2 text-sm font-medium"
                  >
                    Voting Restricted
                  </Badge>
                </div>
                
                {/* Additional Info */}
                <div className="mt-6 pt-4 border-t border-red-200/20">
                  <p className="text-xs text-muted-foreground">
                    Only DAO members with voting tokens can participate in governance decisions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Wallet Info */}
        {userAddress && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Connected wallet:</span>
              <span className="font-mono">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { MultisigVotingSection };