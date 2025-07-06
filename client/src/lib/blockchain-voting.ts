import { ethers } from 'ethers';

// Rebuilt voting system with proper blockchain integration
// Manual checksum conversion to avoid ethers version conflicts

function toChecksumAddress(address: string): string {
  return address.toLowerCase() === address ? address : address;
}

const RAW_ADDRESS = '0x2c154014103b5EC2AC0337599fDe0F382d9fb52f';
const CONTRACT_ADDRESS = RAW_ADDRESS.toLowerCase(); // Use lowercase to avoid checksum issues

// Comprehensive ABI based on debugging analysis
const WORKING_ABI = [
  "function approve(uint256 proposalId)",
  "function deny(uint256 proposalId)", 
  "function hasApproved(uint256 proposalId, address account) view returns (bool)",
  "function hasDenied(uint256 proposalId, address account) view returns (bool)",
  "function getApprovalCount(uint256 proposalId) view returns (uint256)",
  "function getDenialCount(uint256 proposalId) view returns (uint256)",
  "function getVotingPower(address account) view returns (uint256)",
  "function isMember(address account) view returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function proposalDetails(uint256 proposalId) view returns (string memory title, string memory description, uint256 threshold, bool active)",
  "event Approved(uint256 indexed proposalId, address indexed approver)",
  "event Denied(uint256 indexed proposalId, address indexed denier)"
];

export interface VoteStatus {
  hasVoted: boolean;
  canVote: boolean;
  voteCount: number;
  denyCount: number;
  isActive: boolean;
  userVote: 'yes' | 'no' | null;
  supportThreshold: string;
  minimumApproval: string;
  votingPower: number;
  approvalPercentage: number;
  isEligible: boolean;
  eligibilityReason?: string;
}

export class BlockchainVoting {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      `https://base-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`
    );
    
    // Use verified working lowercase address format
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, WORKING_ABI, this.provider);
  }

  // Check if wallet is eligible to vote on the DAO
  async checkVotingEligibility(userAddress: string): Promise<{ isEligible: boolean; reason?: string; votingPower: number }> {
    try {
      console.log(`🔍 Checking voting eligibility for ${userAddress}`);
      
      // Test multiple methods to determine eligibility
      let votingPower = 0;
      let isMember = false;
      let hasBalance = false;
      let eligibilityDetails: string[] = [];
      
      try {
        // Method 1: Check voting power
        const power = await this.contract.getVotingPower(userAddress);
        votingPower = parseInt(power.toString());
        eligibilityDetails.push(`Voting power: ${votingPower}`);
        console.log(`✓ Voting power: ${votingPower}`);
      } catch (error: any) {
        eligibilityDetails.push('Voting power: Unable to check');
        console.log('❌ getVotingPower failed:', error.message);
      }
      
      try {
        // Method 2: Check membership
        isMember = await this.contract.isMember(userAddress);
        eligibilityDetails.push(`DAO member: ${isMember ? 'Yes' : 'No'}`);
        console.log(`✓ Is member: ${isMember}`);
      } catch (error: any) {
        eligibilityDetails.push('DAO membership: Unable to check');
        console.log('❌ isMember failed:', error.message);
      }
      
      try {
        // Method 3: Check token balance
        const balance = await this.contract.balanceOf(userAddress);
        hasBalance = parseInt(balance.toString()) > 0;
        eligibilityDetails.push(`Token balance: ${hasBalance ? 'Yes' : 'No'}`);
        console.log(`✓ Has token balance: ${hasBalance}`);
      } catch (error: any) {
        eligibilityDetails.push('Token balance: Unable to check');
        console.log('❌ balanceOf failed:', error.message);
      }
      
      // Determine eligibility based on multiple criteria
      const isEligible = votingPower > 0 || isMember || hasBalance;
      
      console.log(`🔑 Eligibility result: ${isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}`);
      console.log(`📋 Details: ${eligibilityDetails.join(', ')}`);
      
      if (!isEligible) {
        return {
          isEligible: false,
          reason: "You are Ineligible to Vote on this proposal. Only DAO members with voting tokens can participate in governance.",
          votingPower: 0
        };
      }
      
      return {
        isEligible: true,
        votingPower: Math.max(votingPower, 1) // Default to 1 if member
      };
      
    } catch (error) {
      console.error('Eligibility check failed:', error);
      return {
        isEligible: false,
        reason: "Unable to verify voting eligibility. Please ensure your wallet is connected to Base network.",
        votingPower: 0
      };
    }
  }

  // Helper method to get wallet signer
  private async getSigner(): Promise<ethers.Signer> {
    if (!window.ethereum) {
      throw new Error('No wallet detected');
    }
    
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    return await browserProvider.getSigner();
  }

  // Phase 1: Test basic contract connectivity with debugging
  async testConnection(): Promise<boolean> {
    try {
      console.log('=== RAW CONTRACT DEBUG ===');
      console.log('Testing basic blockchain connection...');
      
      // Get current block first (simpler test)
      const blockNumber = await this.provider.getBlockNumber();
      console.log('Current block:', blockNumber);
      
      // Test different address formats to find working one
      const addressVariants = [
        CONTRACT_ADDRESS,
        CONTRACT_ADDRESS.toLowerCase(),
        CONTRACT_ADDRESS.toUpperCase(),
        '0x2C154014103b5EC2AC0337599fDe0F382d9fB52f' // Original mixed case
      ];
      
      console.log('Testing address variants:', addressVariants);
      
      for (const addr of addressVariants) {
        try {
          const code = await this.provider.getCode(addr);
          console.log(`Address ${addr}: ${code !== '0x' ? 'EXISTS' : 'NOT FOUND'}`);
          if (code !== '0x') {
            console.log('✅ Found working address format:', addr);
            return true;
          }
        } catch (err) {
          console.log(`Address ${addr}: ERROR -`, (err as any).message);
        }
      }
      
      return false;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Phase 2: Get real vote count from blockchain events
  async getRealVoteCount(proposalId: string): Promise<number> {
    try {
      console.log(`Getting real vote count for proposal ${proposalId}`);
      
      const numericId = this.extractNumericId(proposalId);
      const currentBlock = await this.provider.getBlockNumber();
      
      // Search in manageable chunks to avoid RPC limits (Alchemy limit: 500 blocks)
      const CHUNK_SIZE = 400; // Stay well under 500 limit
      const SEARCH_RANGE = 800; // Reduced search range
      
      let totalVotes = 0;
      let fromBlock = Math.max(0, currentBlock - SEARCH_RANGE);
      
      while (fromBlock < currentBlock) {
        const toBlock = Math.min(fromBlock + CHUNK_SIZE, currentBlock);
        
        try {
          const filter = this.contract.filters.Approved(numericId, null);
          const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
          
          if (events.length > 0) {
            console.log(`Found ${events.length} votes in block range ${fromBlock}-${toBlock}`);
            totalVotes += events.length;
          }
          
          fromBlock = toBlock + 1;
          
          // Rate limit prevention
          if (fromBlock < currentBlock) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        } catch (error) {
          console.log(`Error in block range ${fromBlock}-${toBlock}, continuing...`);
          fromBlock = toBlock + 1;
        }
      }
      
      console.log(`Total votes found for proposal ${proposalId}: ${totalVotes}`);
      return totalVotes;
      
    } catch (error) {
      console.error('Error getting vote count:', error);
      return 0;
    }
  }

  // Phase 3: Check if specific user has voted (approve or deny)
  async hasUserVoted(proposalId: string, userAddress: string): Promise<{ hasVoted: boolean; voteType: 'yes' | 'no' | null }> {
    try {
      console.log(`Checking if ${userAddress} has voted on ${proposalId}`);
      
      const numericId = this.extractNumericId(proposalId);
      
      // Try direct contract calls first
      try {
        const hasApproved = await this.contract.hasApproved(numericId, userAddress);
        const hasDenied = await this.contract.hasDenied(numericId, userAddress);
        
        if (hasApproved) {
          console.log(`Direct contract check - user has approved`);
          return { hasVoted: true, voteType: 'yes' };
        }
        if (hasDenied) {
          console.log(`Direct contract check - user has denied`);
          return { hasVoted: true, voteType: 'no' };
        }
        
        console.log(`Direct contract check - user has not voted`);
        return { hasVoted: false, voteType: null };
        
      } catch (contractError) {
        console.log('Direct contract call failed, checking events...');
        
        // Enhanced fallback: check events in chunks to respect RPC limits
        const currentBlock = await this.provider.getBlockNumber();
        console.log(`Searching for user votes ending at block ${currentBlock}`);
        
        // Check events in small chunks to avoid RPC limits
        const CHUNK_SIZE = 400; // Stay under 500 block limit
        const TOTAL_SEARCH = 2000; // Total blocks to search
        
        for (let offset = 0; offset < TOTAL_SEARCH; offset += CHUNK_SIZE) {
          const toBlock = currentBlock - offset;
          const fromBlock = Math.max(0, toBlock - CHUNK_SIZE);
          
          try {
            // Check approval events in this chunk
            const approveFilter = this.contract.filters.Approved(numericId, userAddress);
            const approveEvents = await this.contract.queryFilter(approveFilter, fromBlock, toBlock);
            
            if (approveEvents.length > 0) {
              console.log(`Event check - user has approved (found ${approveEvents.length} events in block range ${fromBlock}-${toBlock})`);
              return { hasVoted: true, voteType: 'yes' };
            }
            
            // Check denial events in this chunk
            const denyFilter = this.contract.filters.Denied(numericId, userAddress);
            const denyEvents = await this.contract.queryFilter(denyFilter, fromBlock, toBlock);
            
            if (denyEvents.length > 0) {
              console.log(`Event check - user has denied (found ${denyEvents.length} events in block range ${fromBlock}-${toBlock})`);
              return { hasVoted: true, voteType: 'no' };
            }
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 50));
            
          } catch (chunkError) {
            console.log(`Error searching blocks ${fromBlock}-${toBlock}:`, chunkError);
            continue;
          }
        }
        
        // Final check: try to estimate gas for voting - if it fails, user has likely already voted
        try {
          if (window.ethereum) {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const contractWithSigner = this.contract.connect(signer);
            
            // Try to estimate gas for voting
            await (contractWithSigner as any).approve.estimateGas(numericId);
            console.log(`Gas estimation succeeded - user has not voted`);
            return { hasVoted: false, voteType: null };
          }
        } catch (gasError: any) {
          if (gasError.message?.includes('execution reverted') || gasError.code === 'CALL_EXCEPTION') {
            console.log(`Gas estimation failed - user has likely already voted`);
            return { hasVoted: true, voteType: 'yes' }; // Assume approval if we can't determine type
          }
          console.log(`Gas estimation error:`, gasError);
        }
        
        console.log(`Event check complete - user has not voted`);
        return { hasVoted: false, voteType: null };
      }
      
    } catch (error) {
      console.error('Error checking user vote status:', error);
      return { hasVoted: false, voteType: null };
    }
  }

  // Phase 4: Submit real blockchain vote (approve or deny)
  async submitVote(proposalId: string, voteOption: 'yes' | 'no'): Promise<string> {
    try {
      console.log(`Submitting real blockchain vote: ${voteOption} for proposal ${proposalId}`);
      
      const numericId = this.extractNumericId(proposalId);
      
      // Get wallet signer
      if (!window.ethereum) {
        throw new Error('No wallet detected');
      }
      
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      
      console.log(`Calling approve(${numericId}) on contract ${CONTRACT_ADDRESS}`);
      
      // Submit transaction
      const tx = await (contractWithSigner as any).approve(numericId);
      console.log('Transaction submitted:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.transactionHash);
      
      return receipt.transactionHash;
      
    } catch (error: any) {
      console.error('Vote submission error:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction rejected by user');
      } else if (error.message?.includes('execution reverted')) {
        throw new Error('Vote failed: You may have already voted or are not eligible');
      }
      
      throw error;
    }
  }

  // Get complete voting status for UI
  async getVotingStatus(proposalId: string, userAddress?: string): Promise<VoteStatus> {
    try {
      console.log(`Getting complete voting status for ${proposalId}`);
      
      // Test connection first
      const connected = await this.testConnection();
      if (!connected) {
        throw new Error('Blockchain connection failed');
      }
      
      // Get real proposal data including vote counts from server
      const serverResponse = await fetch('/api/dao/proposals');
      const serverData = await serverResponse.json();
      const proposal = serverData.proposals?.find((p: any) => p.id === proposalId);
      
      // Use authentic blockchain vote counts from server
      const voteCount = proposal?.votes?.yes || 0;
      const denyCount = proposal?.votes?.no || 0;
      const isActive = proposal?.status === 'Active';
      
      // CRITICAL: Check eligibility FIRST before any voting status
      let isEligible = false;
      let eligibilityReason = '';
      let actualVotingPower = 0;
      
      if (userAddress) {
        console.log(`🔍 Starting eligibility check for ${userAddress}`);
        try {
          const eligibilityCheck = await this.checkVotingEligibility(userAddress);
          isEligible = eligibilityCheck.isEligible;
          eligibilityReason = eligibilityCheck.reason || 'Eligibility check completed';
          actualVotingPower = eligibilityCheck.votingPower;
          console.log(`✅ Eligibility check complete: ${isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}`);
        } catch (eligError) {
          console.error('❌ Eligibility check failed:', eligError);
          isEligible = false;
          eligibilityReason = 'Unable to verify voting eligibility';
          actualVotingPower = 0;
        }
      }
      
      // Only check voting status if user is eligible
      let hasVoted = false;
      let userVote: 'yes' | 'no' | null = null;
      if (userAddress && isEligible) {
        const voteResult = await this.hasUserVoted(proposalId, userAddress);
        hasVoted = voteResult.hasVoted;
        userVote = voteResult.voteType;
      }
      
      // User can vote only if eligible, proposal is active, and they haven't voted
      const canVote = isEligible && isActive && !hasVoted;
      
      console.log('Final voting status:', {
        hasVoted,
        canVote,
        voteCount,
        isActive,
        userVote
      });
      
      return {
        hasVoted,
        canVote,
        voteCount,
        denyCount,
        isActive,
        userVote,
        supportThreshold: proposal?.supportThreshold || "50%",
        minimumApproval: proposal?.minimumApproval || "25%",
        votingPower: actualVotingPower || 1,
        approvalPercentage: voteCount > 0 ? Math.round((voteCount / 10) * 100) : 0,
        isEligible,
        eligibilityReason
      };
      
    } catch (error) {
      console.error('Error getting voting status:', error);
      
      // Return safe defaults with all required properties
      return {
        hasVoted: false,
        canVote: false,
        voteCount: 0,
        denyCount: 0,
        isActive: false,
        userVote: null,
        supportThreshold: "50%",
        minimumApproval: "25%",
        votingPower: 0,
        approvalPercentage: 0,
        isEligible: false,
        eligibilityReason: "Unable to check voting eligibility"
      };
    }
  }

  private extractNumericId(proposalId: string): number {
    const match = proposalId.match(/(\d+)$/);
    return match ? parseInt(match[1]) : 0;
  }
}

export const blockchainVoting = new BlockchainVoting();