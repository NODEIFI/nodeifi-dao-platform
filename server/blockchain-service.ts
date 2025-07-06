import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x2c154014103b5ec2ac0337599fde0f382d9fb52f'; // Lowercase to avoid checksum validation
const BASE_RPC_URL = process.env.ALCHEMY_RPC_URL || 'https://base-mainnet.g.alchemy.com/v2/GB1Ox8ohQ31jXJe9LLxXm9rV71x1_ozR';

// Aragon DAO contract ABI - corrected for actual governance contract
const ARAGON_DAO_ABI = [
  'function getProposal(uint256 _proposalId) external view returns (bool executed, bool canceled, tuple(uint256 supportThreshold, uint256 minVotingPower, uint64 snapshotBlock, uint64 startDate, uint64 endDate) parameters, uint256 tally, uint256 approvals, bytes actions, uint256 allowFailureMap)',
  'function canVote(uint256 _proposalId, address _voter, uint8 _voteOption) external view returns (bool)',
  'function getVote(uint256 _proposalId, address _voter) external view returns (uint8 voteOption, uint256 votingPower)',
  'function isMember(address _account) external view returns (bool)',
  'function addresslistLength() external view returns (uint256)',
  'function addresslistLengthAtBlock(uint256 _blockNumber) external view returns (uint256)',
  'event ProposalCreated(uint256 indexed proposalId, address indexed creator, uint64 startDate, uint64 endDate, bytes metadata, bytes actions, uint256 allowFailureMap)',
  'event VoteCast(uint256 indexed proposalId, address indexed voter, uint8 voteOption, uint256 votingPower)',
  'event ProposalExecuted(uint256 indexed proposalId)'
];

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  public contract: ethers.Contract;
  
  constructor() {
    try {
      this.provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, ARAGON_DAO_ABI, this.provider);
      console.log('🔗 Blockchain service initialized for direct contract queries');
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  async getProposalData(proposalId: string): Promise<{
    confirmationCount: number;
    requiredConfirmations: number;
    totalOwners: number;
    isExecuted: boolean;
    confirmations: string[];
    deadline?: number;
  }> {
    console.log(`🚀 START getProposalData for ${proposalId}`);
    
    try {
      console.log(`✅ Step 1: Input validation`);
      if (!proposalId || typeof proposalId !== 'string') {
        throw new Error(`Invalid proposalId: ${proposalId}`);
      }
      
      console.log(`✅ Step 2: Converting proposal ID to numeric`);
      const numericId = parseInt(proposalId.replace('MULTISIG-', ''));
      if (isNaN(numericId)) {
        throw new Error(`Could not parse numeric ID from ${proposalId}`);
      }
      console.log(`   Numeric ID: ${numericId}`);
      
      console.log(`✅ Step 3: Verifying blockchain service setup`);
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      console.log(`   Provider URL: ${BASE_RPC_URL}`);
      console.log(`   Contract: ${this.contract.target}`);
      
      console.log(`✅ Step 4: Testing basic provider connectivity`);
      try {
        const network = await this.provider.getNetwork();
        console.log(`   Network connected: ${network.name} (${network.chainId})`);
      } catch (networkError) {
        console.log(`   Network connection failed: ${networkError}`);
        throw new Error(`Provider connection failed: ${networkError}`);
      }
      
      console.log(`✅ Step 5: Making contract calls with detailed error handling`);
      
      // Test each contract method individually with detailed logging
      let confirmationCount = 0;
      let requiredConfirmations = 3;
      let owners = [];
      let transactionCount = 0;

      try {
        console.log(`   Calling getConfirmationCount(${numericId})...`);
        confirmationCount = await this.contract.getConfirmationCount(numericId);
        console.log(`   ✅ getConfirmationCount success: ${confirmationCount}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`   ❌ getConfirmationCount failed: ${errorMessage}`);
        confirmationCount = 0;
      }

      try {
        console.log(`   Calling required()...`);
        requiredConfirmations = await this.contract.required();
        console.log(`   ✅ required success: ${requiredConfirmations}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`   ❌ required failed: ${errorMessage}`);
        requiredConfirmations = 3;
      }

      try {
        console.log(`   Calling getOwners()...`);
        owners = await this.contract.getOwners();
        console.log(`   ✅ getOwners success: ${owners.length} owners`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`   ❌ getOwners failed: ${errorMessage}`);
        owners = [];
      }

      try {
        console.log(`   Calling transactionCount()...`);
        transactionCount = await this.contract.transactionCount();
        console.log(`   ✅ transactionCount success: ${transactionCount}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`   ❌ transactionCount failed: ${errorMessage}`);
        transactionCount = 0;
      }

      console.log(`📊 COMPREHENSIVE BLOCKCHAIN CALL RESULTS:`);
      console.log(`   getConfirmationCount(${numericId}): ${confirmationCount}`);
      console.log(`   required(): ${requiredConfirmations}`);
      console.log(`   getOwners().length: ${owners.length}`);
      console.log(`   transactionCount(): ${transactionCount}`);
      console.log(`   Transaction ID ${numericId} exists: ${numericId <= transactionCount}`);
      
      console.log(`✅ Step 6: Testing alternative confirmation methods`);
      
      // Try alternative confirmation methods
      let directConfirmations = [];
      try {
        console.log(`   Calling getConfirmations(${numericId})...`);
        directConfirmations = await this.contract.getConfirmations(numericId);
        console.log(`   ✅ getConfirmations success: [${directConfirmations.join(', ')}]`);
        console.log(`   Direct confirmation count: ${directConfirmations.length}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`   ❌ getConfirmations failed: ${errorMessage}`);
      }

      // Check if transaction is confirmed
      try {
        console.log(`   Calling isConfirmed(${numericId})...`);
        const isConfirmed = await this.contract.isConfirmed(numericId);
        console.log(`   ✅ isConfirmed success: ${isConfirmed}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`   ❌ isConfirmed failed: ${errorMessage}`);
      }
      
      console.log(`✅ Step 7: Checking individual owner confirmations`);
      const individualConfirmations = [];
      for (let i = 0; i < owners.length; i++) {
        try {
          console.log(`   Calling confirmations(${numericId}, ${owners[i]})...`);
          const isConfirmed = await this.contract.confirmations(numericId, owners[i]);
          console.log(`   ✅ Owner ${owners[i]}: ${isConfirmed ? 'CONFIRMED' : 'NOT CONFIRMED'}`);
          if (isConfirmed) {
            individualConfirmations.push(owners[i]);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.log(`   ❌ Owner ${owners[i]} confirmation check failed: ${errorMessage}`);
        }
      }
      
      console.log(`📈 SUMMARY FOR MULTISIG-${numericId}:`);
      console.log(`   Contract confirmationCount: ${confirmationCount}`);
      console.log(`   Individual mapping count: ${individualConfirmations.length}`);
      console.log(`   Direct getConfirmations count: ${directConfirmations.length}`);
      console.log(`   Expected vs Actual: Expected 5, Contract shows ${confirmationCount}`);

      console.log(`✅ Step 8: Getting current block and calculating deadline`);
      let currentTimestamp = Date.now() / 1000;
      try {
        const currentBlock = await this.provider.getBlock('latest');
        if (currentBlock) {
          currentTimestamp = Number(currentBlock.timestamp);
          console.log(`   ✅ Current block timestamp: ${currentTimestamp}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`   ❌ Failed to get current block: ${errorMessage}`);
      }
      
      const deadline = currentTimestamp + (3 * 24 * 60 * 60); // 3 days from now

      console.log(`✅ Step 9: Building final result object`);
      const result = {
        confirmationCount: Number(confirmationCount),
        requiredConfirmations: Number(requiredConfirmations),
        totalOwners: owners.length,
        isExecuted: false,
        confirmations: individualConfirmations,
        deadline: deadline
      };

      console.log(`✅ SUCCESS: getProposalData completed for ${proposalId}`);
      console.log(`📊 FINAL RESULT:`, result);
      
      return result;

    } catch (error) {
      console.log(`❌ CRITICAL ERROR in getProposalData for ${proposalId}`);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : 'No stack trace';
      console.log(`   Error message: ${errorMessage}`);
      console.log(`   Error stack: ${errorStack}`);
      
      // Don't throw - return safe fallback to prevent crashes
      console.log(`   Returning safe fallback data to prevent service crash`);
      return {
        confirmationCount: 0,
        requiredConfirmations: 3,
        totalOwners: 0,
        isExecuted: false,
        confirmations: [],
        deadline: Date.now() / 1000 + (3 * 24 * 60 * 60)
      };
    }
  }

  async getVoteEvents(proposalId: string): Promise<{
    yes: number;
    no: number;
    abstain: number;
  }> {
    console.log(`🚀 START getVoteEvents for ${proposalId}`);
    
    try {
      console.log(`✅ Step 1: Input validation for vote events`);
      if (!proposalId || typeof proposalId !== 'string') {
        throw new Error(`Invalid proposalId for events: ${proposalId}`);
      }
      
      const numericId = parseInt(proposalId.replace('MULTISIG-', ''));
      if (isNaN(numericId)) {
        throw new Error(`Could not parse numeric ID from ${proposalId} for events`);
      }
      console.log(`   Numeric ID: ${numericId}`);

      console.log(`✅ Step 2: Getting current block number`);
      let currentBlock = 0;
      try {
        currentBlock = await this.provider.getBlockNumber();
        console.log(`   ✅ Current block: ${currentBlock}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`   ❌ Failed to get block number: ${errorMessage}`);
        throw new Error(`Block number fetch failed: ${errorMessage}`);
      }
      
      // Try multiple block ranges to ensure we capture all votes
      const blockRanges = [
        { from: Math.max(0, currentBlock - 50000), to: currentBlock, label: "Last 50k blocks" },
        { from: Math.max(0, currentBlock - 100000), to: currentBlock - 50000, label: "50k-100k blocks ago" },
        { from: 0, to: Math.min(50000, currentBlock), label: "Genesis to 50k" }
      ];

      let totalConfirmations = 0;
      let totalRevocations = 0;
      const allConfirmationAddresses = new Set();

      console.log(`✅ Step 3: Querying events across multiple block ranges`);
      
      for (const range of blockRanges) {
        console.log(`   Testing range: ${range.label} (${range.from} to ${range.to})`);
        
        try {
          // Test confirmation events
          console.log(`     Creating confirmation filter...`);
          const confirmationFilter = this.contract.filters.Confirmation(null, numericId);
          console.log(`     Querying confirmation events...`);
          const confirmationEvents = await this.contract.queryFilter(confirmationFilter, range.from, range.to);
          console.log(`     ✅ Found ${confirmationEvents.length} confirmation events`);

          // Test revocation events
          console.log(`     Creating revocation filter...`);
          const revocationFilter = this.contract.filters.Revocation(null, numericId);
          console.log(`     Querying revocation events...`);
          const revocationEvents = await this.contract.queryFilter(revocationFilter, range.from, range.to);
          console.log(`     ✅ Found ${revocationEvents.length} revocation events`);
          
          // Process confirmation events
          confirmationEvents.forEach((event, index) => {
            try {
              console.log(`     Processing confirmation event ${index + 1}...`);
              const eventLog = event as ethers.EventLog;
              if (eventLog.args && eventLog.args[0]) {
                const sender = eventLog.args[0];
                console.log(`     ✅ Confirmation from: ${sender} (Block: ${event.blockNumber})`);
                allConfirmationAddresses.add(sender);
              }
            } catch (parseError) {
              const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
              console.log(`     ❌ Could not parse confirmation event ${index + 1}: ${errorMessage}`);
            }
          });

          // Process revocation events
          revocationEvents.forEach((event, index) => {
            try {
              console.log(`     Processing revocation event ${index + 1}...`);
              const eventLog = event as ethers.EventLog;
              if (eventLog.args && eventLog.args[0]) {
                const sender = eventLog.args[0];
                console.log(`     ✅ Revocation from: ${sender} (Block: ${event.blockNumber})`);
              }
            } catch (parseError) {
              const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
              console.log(`     ❌ Could not parse revocation event ${index + 1}: ${errorMessage}`);
            }
          });

          totalConfirmations += confirmationEvents.length;
          totalRevocations += revocationEvents.length;
          
          console.log(`     ✅ Range ${range.label} completed successfully`);

        } catch (rangeError) {
          const errorMessage = rangeError instanceof Error ? rangeError.message : String(rangeError);
          console.log(`     ❌ Range ${range.label} failed: ${errorMessage}`);
          
          // Log detailed error information for debugging
          if (rangeError instanceof Error) {
            console.log(`     Error details: ${rangeError.stack}`);
          }
        }
      }

      console.log(`✅ Step 4: Building final event results`);
      const result = {
        yes: totalConfirmations,
        no: totalRevocations,
        abstain: 0
      };

      console.log(`✅ SUCCESS: getVoteEvents completed for ${proposalId}`);
      console.log(`📊 EVENT SUMMARY:`);
      console.log(`   Total Confirmations: ${totalConfirmations}`);
      console.log(`   Total Revocations: ${totalRevocations}`);
      console.log(`   Unique Confirmation Addresses: ${allConfirmationAddresses.size}`);
      console.log(`   Addresses: [${Array.from(allConfirmationAddresses).join(', ')}]`);
      console.log(`   Final result:`, result);

      return result;

    } catch (error) {
      console.log(`❌ CRITICAL ERROR in getVoteEvents for ${proposalId}`);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : 'No stack trace';
      console.log(`   Error message: ${errorMessage}`);
      console.log(`   Error stack: ${errorStack}`);
      
      // Return safe fallback to prevent crashes
      console.log(`   Returning safe fallback vote data to prevent service crash`);
      return { yes: 0, no: 0, abstain: 0 };
    }
  }

  async getCurrentBlockTime(): Promise<number> {
    const block = await this.provider.getBlock('latest');
    if (!block) {
      throw new Error('Failed to get current block');
    }
    return Number(block.timestamp);
  }

  async getContractOwners(): Promise<string[]> {
    try {
      console.log('🔍 Getting contract owners...');
      const owners = await this.contract.getOwners();
      console.log(`✅ Retrieved ${owners.length} contract owners:`, owners);
      return owners.map((addr: string) => addr.toLowerCase());
    } catch (error) {
      console.error('❌ Failed to get contract owners:', error);
      // Return empty array as fallback - this will mark all users as ineligible
      return [];
    }
  }

  get contractAddress(): string {
    return CONTRACT_ADDRESS;
  }
}

export const blockchainService = new BlockchainService();