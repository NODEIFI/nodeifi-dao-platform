import { useParams, Link } from "wouter";
import { ArrowLeft, ExternalLink, Clock, User, CheckCircle, XCircle, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useCallback, useRef } from "react";
import ParticleBackground from "@/components/particle-background";
import Navigation from "@/components/navigation";
import { UnifiedButton } from "@/components/ui/unified-button";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RebuiltVotingInterface } from "@/components/rebuilt-voting-interface";
import { VotingInterface } from "@/components/voting-interface";
import { VotingStatistics } from "@/components/voting-statistics";
import { MultisigVotingSection } from "@/components/multisig-voting-section";

import { votingService } from "@/lib/voting-service";
import { WalletConnection } from "@/components/wallet-connection";
import { useWalletGlobal } from "@/hooks/use-wallet-global";

interface ProposalDetail {
  id: string;
  proposalId: string;
  title: string;
  description: string;
  status: string;
  type: string;
  creator: string;
  startDate: string;
  endDate: string;
  supportThreshold: string;
  minimumApproval: string;
  votes: {
    yes: number;
    no: number;
    abstain: number;
  };
  totalVotingPower: number;
  metadata: {
    resources: Array<{
      name: string;
      url: string;
    }>;
  };
}

export default function ProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const wallet = useWalletGlobal();
  const queryClient = useQueryClient();
  const [actualVotes, setActualVotes] = useState({ yes: 0, no: 0, abstain: 0 });
  const [isLoadingVotes, setIsLoadingVotes] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch real vote counts directly from contract
  const loadActualVotes = useCallback(async (showRefreshState = false) => {
    try {
      if (showRefreshState) setIsRefreshing(true);
      setIsLoadingVotes(true);
      
      console.log(`🔗 Fetching live contract data for proposal: ${id}`);
      
      const response = await fetch(`/api/dao/contract/proposal/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contract data');
      }
      
      const contractData = await response.json();
      console.log(`✅ Contract data received:`, contractData.data);
      
      const votes = contractData.data.votes;
      setActualVotes(votes);
      const now = new Date();
      setLastUpdated(now);
      
      console.log(`📈 Vote counts - Yes: ${votes.yes}, No: ${votes.no}, Abstain: ${votes.abstain}`);
      
    } catch (error) {
      console.error('❌ Contract data fetch error:', error);
      // Fallback to voting service
      try {
        const votes = await votingService.getVoteEvents(id!);
        setActualVotes(votes);
        setLastUpdated(new Date());
      } catch (fallbackError) {
        console.error('❌ Fallback voting service error:', fallbackError);
      }
    } finally {
      setIsLoadingVotes(false);
      if (showRefreshState) setIsRefreshing(false);
    }
  }, [id]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    if (!id || isRefreshing) return;
    
    console.log('🔄 Manual refresh triggered for proposal:', id);
    
    // Refresh both proposal data and vote counts
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['/api/dao/proposals'] }),
      loadActualVotes(true)
    ]);
    
    console.log('✅ Manual refresh completed');
  }, [id, isRefreshing, queryClient, loadActualVotes]);

  // Set up automatic polling
  useEffect(() => {
    if (!id) return;

    // Initial load
    loadActualVotes();

    // Set up polling every 45 seconds
    pollingIntervalRef.current = setInterval(() => {
      loadActualVotes();
      queryClient.invalidateQueries({ queryKey: ['/api/dao/proposals'] });
    }, 45000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [id, loadActualVotes, queryClient]);

  const { data: proposalData, isLoading, error } = useQuery({
    queryKey: ['/api/dao/proposals'],
    queryFn: async () => {
      console.log('ProposalDetail - Fetching proposals for ID:', id);
      const response = await fetch('/api/dao/proposals');
      if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }
      const data = await response.json();
      console.log('ProposalDetail - Raw API response:', data);
      return data;
    },
    refetchInterval: 45000, // Auto-refetch every 45 seconds
    refetchIntervalInBackground: true, // Continue refetching even when tab is not active
    staleTime: 30000, // Consider data stale after 30 seconds
    enabled: !!id, // Only fetch when we have an ID
    select: (data: any) => {
      console.log('ProposalDetail - Processing data for ID:', id);
      console.log('ProposalDetail - Data type:', typeof data);
      console.log('ProposalDetail - Is array:', Array.isArray(data));
      
      // Handle both array and object response formats
      let proposals = Array.isArray(data) ? data : data?.proposals;
      
      if (!proposals || !Array.isArray(proposals)) {
        console.log('ProposalDetail - No valid proposals array found');
        return null;
      }
      
      console.log('ProposalDetail - Available proposal IDs:', proposals.map((p: any) => p.id));
      
      const proposal = proposals.find((p: any) => {
        const matches = p.id === id || p.proposalId === id;
        console.log(`ProposalDetail - Checking proposal ${p.id} (${p.proposalId}): ${matches}`);
        return matches;
      });
      
      if (!proposal) {
        console.log('ProposalDetail - No matching proposal found');
        return null;
      }
      
      // Map the server response to the expected format
      const mappedProposal = {
        ...proposal,
        votes: proposal.votes || { yes: 0, no: 0, abstain: 0 },
        totalVotingPower: proposal.totalVotingPower || 0,
        creator: proposal.creator || proposal.creatorAddress || '',
        startDate: proposal.startDate || new Date().toISOString(),
        endDate: proposal.endDate || new Date().toISOString(),
        metadata: proposal.metadata || { resources: [] }
      };
      
      console.log('ProposalDetail - Mapped proposal:', mappedProposal.title);
      return mappedProposal;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <ParticleBackground />
        <Navigation />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading proposal details...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !proposalData) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <ParticleBackground />
        <Navigation />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center max-w-md p-8"
          >
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Proposal Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The proposal you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/governance">
              <UnifiedButton className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Governance
              </UnifiedButton>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'executed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'accepted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'executed': return <CheckCircle className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Use live contract data as primary source
  const contractVotes = proposalData?.votes || { yes: 0, no: 0, abstain: 0 };
  const liveVotes = actualVotes;
  
  // Priority: Use live blockchain data if available, otherwise use cached contract data
  const displayVotes = (liveVotes.yes > 0 || liveVotes.no > 0 || liveVotes.abstain > 0) 
    ? liveVotes 
    : contractVotes;
  
  const totalVotes = displayVotes.yes + displayVotes.no + displayVotes.abstain;
  const yesPercentage = totalVotes > 0 ? (displayVotes.yes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (displayVotes.no / totalVotes) * 100 : 0;
  const abstainPercentage = totalVotes > 0 ? (displayVotes.abstain / totalVotes) * 100 : 0;

  const timeLeft = new Date(proposalData.endDate).getTime() - new Date().getTime();
  const daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <ParticleBackground />
      <Navigation />
      
      {/* Wallet Connection */}
      <WalletConnection 
        wallet={wallet} 
        position="fixed" 
        showDisconnect={true}
      />
      
      

      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/governance">
              <UnifiedButton className="mb-6 text-muted-foreground hover:text-foreground bg-transparent border border-border hover:bg-accent/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Governance
              </UnifiedButton>
            </Link>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className={`${getStatusColor(proposalData.status)} border`}>
                  {getStatusIcon(proposalData.status)}
                  <span className="ml-2">{proposalData.status}</span>
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  {proposalData.type}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  {proposalData.id}
                </Badge>
              </div>
              
              {/* Real-time data controls with debug info */}
              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">
                      Last updated: {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)}s ago
                    </span>
                  </div>
                )}
                <UnifiedButton
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="h-8 px-3 bg-accent/20 hover:bg-accent/40 border border-accent/50 text-accent text-xs"
                >
                  {isRefreshing ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  <span className="ml-1">Refresh</span>
                </UnifiedButton>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {proposalData.title}
            </h1>
          </motion.div>

          {/* Single Column Layout - Following requested flow */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              {/* 1. Title (already shown above) */}
              
              {/* 2. Description */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {proposalData.description}
                </p>
              </div>

              {/* 3. Proposal */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8">
                <h2 className="text-xl font-semibold mb-6">Proposal</h2>
                
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
              </div>

              {/* 4. Live Blockchain Voting Section */}
              <VotingStatistics proposalId={proposalData.id} />

              {/* 5. Voting Interface */}
              <VotingInterface proposalId={proposalData.id} />

              {/* 6. Details Section */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8">
                <h2 className="text-xl font-semibold mb-6">Details</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Onchain ID</span>
                    <span className="text-sm font-mono text-foreground">14</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">ID</span>
                    <span className="text-sm font-mono text-foreground">{proposalData.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Proposed by</span>
                    <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                      {proposalData.creator.slice(0, 6)}...{proposalData.creator.slice(-4)} ↗
                    </a>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Published</span>
                    <span className="text-sm text-foreground">
                      {new Date(proposalData.startDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} ↗
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {proposalData.status}
                    </Badge>
                  </div>
                  
                  
                </div>
              </div>

              {/* Additional Resources */}
              {proposalData.metadata.resources && proposalData.metadata.resources.length > 0 && (
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Resources</h3>
                  <div className="space-y-3">
                    {proposalData.metadata.resources.map((resource: { name: string; url: string }, index: number) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <UnifiedButton className="w-full justify-between bg-primary/10 hover:bg-primary/20 border border-primary/30">
                          {resource.name}
                          <ExternalLink className="w-4 h-4" />
                        </UnifiedButton>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}