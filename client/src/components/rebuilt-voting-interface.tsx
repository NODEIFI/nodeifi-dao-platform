import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, ExternalLink, X, ChevronDown, ChevronUp } from 'lucide-react';
import { blockchainVoting, type VoteStatus } from '@/lib/blockchain-voting';
import { votingService } from '@/lib/voting-service';

interface RebuiltVotingInterfaceProps {
  proposalId: string;
  proposal: any;
}



export function RebuiltVotingInterface({ proposalId, proposal }: RebuiltVotingInterfaceProps) {
  const [votingStatus, setVotingStatus] = useState<VoteStatus | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load initial data
  useEffect(() => {
    loadVotingData();
  }, [proposalId]);

  const loadVotingData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading voting data for proposal:', proposalId);
      
      // Get connected wallet address
      const connected = await votingService.isWalletConnected();
      let address = null;
      
      if (connected) {
        address = await votingService.getConnectedWallet();
        setUserAddress(address);
        console.log('Connected wallet:', address);
      }
      
      // Get real voting status from blockchain
      const status = await blockchainVoting.getVotingStatus(proposalId, address || undefined);
      setVotingStatus(status);
      
      console.log('Voting status loaded:', status);
      
    } catch (error) {
      console.error('Error loading voting data:', error);
      setError('Failed to load voting information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (voteOption: 'yes' | 'no') => {
    try {
      setIsVoting(true);
      setError(null);
      
      console.log(`User voting ${voteOption} on proposal ${proposalId}`);
      
      // Ensure wallet is connected
      if (!userAddress) {
        const address = await votingService.connectWallet();
        setUserAddress(address);
      }
      
      // Submit vote to blockchain
      const txHash = await blockchainVoting.submitVote(proposalId, voteOption);
      console.log('Vote submitted successfully:', txHash);
      
      // Reload voting status after successful vote
      await loadVotingData();
      
    } catch (error: any) {
      console.error('Voting error:', error);
      setError(error.message || 'Failed to submit vote');
    } finally {
      setIsVoting(false);
    }
  };

  const connectWallet = async () => {
    try {
      const address = await votingService.connectWallet();
      setUserAddress(address);
      await loadVotingData(); // Reload with wallet connected
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Loading voting data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadVotingData} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      

      {/* User Voting Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Cast Your Vote</CardTitle>
        </CardHeader>
        <CardContent>
          {!userAddress ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Connect your wallet to participate in voting</p>
              <Button onClick={connectWallet} className="w-full">
                Connect Wallet
              </Button>
            </div>
          ) : votingStatus?.hasVoted ? (
            <div className="text-center py-6">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <div className="text-xl font-semibold text-foreground">VOTED</div>
                  <div className="text-sm text-muted-foreground">
                    You voted: {votingStatus.userVote === 'yes' ? 'APPROVE' : votingStatus.userVote === 'no' ? 'DENY' : 'APPROVE'}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                Vote Recorded On-Chain
              </Badge>
            </div>
          ) : !votingStatus?.isActive ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">This proposal is no longer accepting votes</p>
              <Badge variant="secondary">Voting Closed</Badge>
            </div>
          ) : !votingStatus?.canVote ? (
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
                    <h3 className="text-2xl font-bold text-foreground">Not Eligible</h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {votingStatus?.eligibilityReason || "You are not eligible to vote on this proposal"}
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
          ) : (
            <div className="space-y-6">
              <p className="text-center text-gray-600 text-sm md:text-base">
                Select your vote for this proposal
              </p>
              
              <div className="space-y-3">
                {/* Approve Vote */}
                <Button
                  onClick={() => handleVote('yes')}
                  disabled={isVoting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                  size="lg"
                >
                  {isVoting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Proposal
                    </>
                  )}
                </Button>
                
                {/* Deny Vote */}
                <Button
                  onClick={() => handleVote('no')}
                  disabled={isVoting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
                  size="lg"
                >
                  {isVoting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Deny Proposal
                    </>
                  )}
                </Button>
              </div>
              
              {/* Info about voting options */}
              <div className="text-xs md:text-sm text-gray-500 text-center px-4">
                Your vote will be recorded on the blockchain and cannot be changed.
              </div>
            </div>
          )}
          
          {/* Wallet Info */}
          {userAddress && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Connected wallet:</span>
                <span className="font-mono">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposal Content - Matching Aragon Layout Exactly */}
      <div className="max-w-4xl mx-auto space-y-8">
        

        {/* Proposal and Details Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Proposal Content Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Proposal</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Executive Team Overview</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Team Lead</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                          <li><strong>Leadership:</strong> Acts as the primary leader of the DAO, ensuring alignment with its vision and strategic goals.</li>
                          {isExpanded && (
                            <>
                              <li><strong>Collaboration:</strong> Works closely with the Executive Team members to facilitate decision-making and ensure cohesive action.</li>
                              <li><strong>Oversight:</strong> Ensures team alignment and progress toward agreed goals by working closely with individual department leads. Major decisions, including governance changes, partnerships, and funding allocations, will be determined by a team vote rather than unilateral approval.</li>
                              <li><strong>Strategic Vision:</strong> Drives the long-term vision of NODEIFI DAO and the Velocity Foundation ecosystem, ensuring the DAO remains innovative, adaptable, and well-positioned in the Web3 space.</li>
                              <li><strong>Treasury Oversight:</strong> Accountable for the strategic management of treasury funds. Works closely with the Governance & Finance Lead to ensure adherence to treasury objectives.</li>
                              <li><strong>Stakeholder Engagement:</strong> Represents NODEIFI DAO in external discussions with partners, sub-DAOs, and other stakeholders or may appoint a representative as needed.</li>
                            </>
                          )}
                        </ul>
                      </div>
                      
                      {isExpanded && (
                        <>
                          <div className="border-t pt-4">
                            <h4 className="font-medium text-foreground mb-2">Governance & Finance Lead</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                              <li><strong>Governance Refinement:</strong> Continuously improve governance processes based on community feedback and best practices.</li>
                              <li><strong>Proposal Oversight:</strong> Review, organize, and track proposals submitted by members.</li>
                              <li><strong>Financial Management:</strong> Oversee treasury operations, including fund allocation and management. Maintain accurate financial records for transparency and auditing purposes.</li>
                              <li><strong>Operational Transparency:</strong> Ensure all financial reporting and sub-DAO updates are accurate and accessible.</li>
                              <li><strong>Risk & Compliance:</strong> Continual research in this area to keep us honest and compliant.</li>
                            </ul>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-medium text-foreground mb-2">Technical Lead</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                              <li><strong>Infrastructure Management:</strong> Oversees all technical operations, including node infrastructure, platform development, and integrations.</li>
                              <li><strong>Technology Strategy:</strong> Advises on the selection and implementation of tools to support DAO operations.</li>
                              <li><strong>Support & Maintenance:</strong> Ensures uptime and performance of all technical systems, including blockchain infrastructure.</li>
                              <li><strong>Technical Documentation:</strong> Maintains and updates technical documentation for transparency and knowledge sharing.</li>
                            </ul>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-medium text-foreground mb-2">Partnerships & Growth Lead</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                              <li><strong>Partnership Development:</strong> Identifies and secures strategic partnerships to grow the DAO's ecosystem and resources.</li>
                              <li><strong>Revenue Opportunities:</strong> Explores new revenue streams or funding opportunities to sustain DAO operations.</li>
                              <li><strong>Market Research:</strong> Analyzes trends in the Web3 space to identify growth opportunities.</li>
                              <li><strong>Brand Alignment:</strong> Ensures all partnerships and growth strategies align with NODEIFI DAO's mission and values.</li>
                              <li><strong>Content Creation:</strong> Develops and manages social media, blogs, newsletters, and other content to maintain transparency and engagement.</li>
                            </ul>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-medium text-foreground mb-2">Community & Operations Lead</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                              <li><strong>Community Engagement:</strong> Manages all CandyShop DAO members, including proposal submissions and community interactions.</li>
                              <li><strong>Proposal Management:</strong> Oversees the submission and review of proposals from the community to ensure alignment with the DAO's goals.</li>
                              <li><strong>Token Distribution Oversight:</strong> Manages the process of distributing tokens to members, partners, and contributors in alignment with governance policies.</li>
                              <li><strong>Operational Support:</strong> Initiates operational tasks related to community-driven initiatives, including new project rollouts and collaborations.</li>
                            </ul>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-medium text-foreground mb-2">Accountability & Dismissal</h4>
                            <p className="text-sm text-muted-foreground">
                              To ensure the integrity and effectiveness of the NODEIFI DAO Executive Team, all members are expected to operate in alignment with the DAO's principles, governance policies, and ethical standards. Failure to meet these expectations may result in dismissal through a formal review process involving community oversight and majority vote among the Executive Team.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium mt-4"
                    >
                      {isExpanded ? (
                        <>
                          Read less ↑
                        </>
                      ) : (
                        <>
                          Read more ↓
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Details</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Onchain ID</span>
                    <span className="text-sm font-mono text-foreground">14</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">ID</span>
                    <span className="text-sm font-mono text-foreground">{proposalId}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Proposed by</span>
                    <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                      0x9A3...5075 ↗
                    </a>
                  </div>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Published</span>
                    <span className="text-sm text-foreground">June 7, 2025 ↗</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        
      </div>
    </div>
  );
}