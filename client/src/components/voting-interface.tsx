import { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Wallet, Clock, Ban } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWalletGlobal } from '@/hooks/use-wallet-global';
import { useQuery } from '@tanstack/react-query';

interface VotingInterfaceProps {
  proposalId: string;
}

interface VotingState {
  isEligible: boolean;
  hasVoted: boolean;
  userVote: 'approve' | 'deny' | null;
  votingPeriodEnded: boolean;
  proposalDeadline: Date;
  isActive: boolean;
  errorMessage?: string;
}

export const VotingInterface = ({ proposalId }: VotingInterfaceProps) => {
  const { address: userAddress, connectWallet } = useWalletGlobal();
  const [isVoting, setIsVoting] = useState(false);
  const [votingState, setVotingState] = useState<VotingState | null>(null);

  // Fetch real blockchain voting state
  const { data: blockchainVotingData, isLoading } = useQuery({
    queryKey: ['/api/dao/voting-state', proposalId, userAddress],
    enabled: !!proposalId,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  useEffect(() => {
    if (blockchainVotingData && typeof blockchainVotingData === 'object') {
      const data = blockchainVotingData as any;
      if (data.deadline) {
        const now = new Date();
        const deadline = new Date(data.deadline);
        
        setVotingState({
          isEligible: data.isEligible || false,
          hasVoted: data.hasVoted || false,
          userVote: data.userVote || null,
          votingPeriodEnded: now > deadline,
          proposalDeadline: deadline,
          isActive: data.isActive || false,
          errorMessage: data.error
        });
      }
    }
  }, [blockchainVotingData]);

  const handleVote = async (voteType: 'approve' | 'deny') => {
    if (!userAddress) {
      await connectWallet();
      return;
    }

    if (!votingState?.isEligible) {
      console.error('User is not eligible to vote');
      return;
    }

    if (votingState?.votingPeriodEnded) {
      console.error('Voting period has ended');
      return;
    }

    setIsVoting(true);
    try {
      // Get transaction data from backend
      const response = await fetch('/api/dao/submit-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposalId,
          vote: voteType,
          userAddress
        }),
      });

      if (!response.ok) {
        throw new Error('Vote submission failed');
      }

      const result = await response.json();
      
      if (result.success && result.transactionData) {
        // Execute Web3 transaction through user's wallet
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          try {
            const transactionHash = await (window as any).ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                from: userAddress,
                to: result.transactionData.to,
                data: result.transactionData.data,
                gas: '0x5208', // Standard gas limit
              }],
            });

            console.log('Transaction submitted:', transactionHash);
            
            // Update local state to reflect successful vote
            setVotingState(prev => prev ? {
              ...prev,
              hasVoted: true,
              userVote: voteType
            } : null);

            alert('Vote successfully submitted! Transaction: ' + transactionHash);
          } catch (walletError) {
            console.error('Wallet transaction failed:', walletError);
            throw new Error('Transaction was rejected by wallet');
          }
        } else {
          throw new Error('No Web3 wallet found');
        }
      } else {
        throw new Error(result.error || 'Vote submission failed');
      }
    } catch (error) {
      console.error('Voting failed:', error);
      alert('Voting failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Cast Your Vote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading voting state...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Cast Your Vote
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!userAddress ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Connect your wallet to participate in voting</p>
            <Button onClick={connectWallet} className="w-full">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        ) : votingState?.votingPeriodEnded ? (
          <div className="text-center py-6">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-xl font-semibold">Voting Window Has Ended</div>
                <div className="text-sm text-muted-foreground">
                  Deadline: {votingState.proposalDeadline.toLocaleDateString()}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 border-orange-500/30">
              Voting Closed
            </Badge>
          </div>
        ) : !votingState?.isEligible ? (
          <div className="text-center py-6">
            <div className="flex items-center justify-center mb-4">
              <Ban className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <div className="text-xl font-semibold">You Are Ineligible to Vote</div>
                <div className="text-sm text-muted-foreground">
                  Your wallet is not authorized by the contract
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-red-500/20 text-red-600 border-red-500/30">
              Not Authorized
            </Badge>
          </div>
        ) : votingState?.hasVoted ? (
          <div className="text-center py-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-xl font-semibold">VOTED</div>
                <div className="text-sm text-muted-foreground">
                  You voted: {votingState.userVote === 'approve' ? 'APPROVE' : 'DENY'}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-600 border-green-500/30">
              Vote Recorded On-Chain
            </Badge>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Voting Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={() => handleVote('approve')}
                disabled={isVoting}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                size="lg"
              >
                {isVoting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Transaction...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Proposal
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => handleVote('deny')}
                disabled={isVoting}
                variant="destructive"
                className="w-full h-12"
                size="lg"
              >
                {isVoting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Transaction...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Deny Proposal
                  </>
                )}
              </Button>
            </div>
            
            {/* Info about voting */}
            <div className="text-xs text-muted-foreground text-center">
              This will trigger a Web3 transaction to record your vote on-chain. Transaction cannot be reversed.
            </div>
          </div>
        )}

        {/* Error Message */}
        {votingState?.errorMessage && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-600">{votingState.errorMessage}</p>
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
      </CardContent>
    </Card>
  );
};