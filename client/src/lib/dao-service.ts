import { ethers } from 'ethers'
import { createWalletClient, custom } from 'viem'

export interface DAOProposal {
  id: string
  title: string
  description: string
  status: 'active' | 'passed' | 'failed' | 'pending'
  votesFor: number
  votesAgainst: number
  totalVotes: number
  endDate: string
  startDate: string
  creatorAddress: string
  votingPower: number
  userVote: 'for' | 'against' | null
  onChainId?: number
}

function toChecksumAddress(address: string): string {
  return address.toLowerCase() === address ? address : address;
}

const RAW_DAO_ADDRESS = '0x2c154014103b5EC2AC0337599fDe0F382d9fb52f';
const DAO_ADDRESS = toChecksumAddress(RAW_DAO_ADDRESS);

export class DAOService {
  private provider: ethers.JsonRpcProvider
  private walletClient: any

  constructor() {
    try {
      // Initialize ethers provider using Alchemy RPC endpoint for Base network
      this.provider = new ethers.JsonRpcProvider(
        `https://base-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`
      )
      
      console.log('DAO Service initialized with ethers.js and Alchemy RPC endpoint')
    } catch (error) {
      console.warn('Failed to initialize DAO Service:', error)
      throw error
    }
  }

  private getWalletClient() {
    if (!window.ethereum) throw new Error('No wallet detected')
    
    return createWalletClient({
      transport: custom(window.ethereum)
    })
  }

  async getDAOProposals(): Promise<DAOProposal[]> {
    try {
      console.log('Fetching latest 3 proposals from server proxy...')
      
      // Use server-side proxy to avoid CORS issues
      const response = await fetch('/api/dao/proposals')
      
      if (!response.ok) {
        throw new Error(`Server request failed: ${response.status}`)
      }

      const data = await response.json()
      
      console.log('Raw server response:', JSON.stringify(data, null, 2))
      
      if (!data.proposals || !Array.isArray(data.proposals)) {
        console.log('No proposals returned from server - response structure:', data)
        return []
      }

      console.log(`Successfully fetched ${data.proposals.length} proposals from server`)
      console.log('Proposal titles:', data.proposals.map((p: any) => p.title))
      
      // Process server response into DAOProposal format
      const processedProposals = data.proposals.map((proposal: any) => {
        console.log('Processing proposal:', proposal.title, 'with status:', proposal.status)
        
        try {
          const mappedStatus = this.mapStatus(proposal.status)
          console.log('Mapped status:', proposal.status, '->', mappedStatus)
          
          const processed = {
            id: proposal.id || proposal.proposalId,
            title: proposal.title,
            description: proposal.description,
            status: mappedStatus,
            votesFor: proposal.votes?.yes || 0,
            votesAgainst: proposal.votes?.no || 0,
            totalVotes: proposal.totalVotingPower || 0,
            endDate: proposal.endDate || new Date().toISOString(),
            startDate: proposal.startDate || new Date().toISOString(),
            creatorAddress: proposal.creator || '',
            votingPower: 0,
            userVote: null,
            onChainId: 0
          }
          
          console.log('Successfully processed proposal:', processed.title)
          return processed
        } catch (error) {
          console.error('Error processing proposal:', proposal.title, error)
          throw error
        }
      })
      
      console.log('Final processed proposals count:', processedProposals.length)
      return processedProposals
      
    } catch (error) {
      console.error('Error fetching DAO proposals:', error)
      return []
    }
  }

  private mapStatus(status: string): 'active' | 'passed' | 'failed' | 'pending' {
    switch (status.toLowerCase()) {
      case 'executed': return 'passed'
      case 'rejected': return 'failed'
      case 'active': return 'active'
      case 'expired': return 'failed'
      case 'succeeded': return 'passed'
      default: return 'pending'
    }
  }

  async getDAOStats() {
    try {
      const response = await fetch('/api/dao/proposals')
      
      if (!response.ok) {
        throw new Error(`Server request failed: ${response.status}`)
      }

      const data = await response.json()
      console.log('DAO stats response:', data.stats)
      
      // Use authentic stats from server response
      if (data.stats) {
        return {
          totalProposals: data.stats.totalProposals,
          members: data.stats.members,
          treasury: data.stats.treasury,
          contractAddress: data.stats.contractAddress || DAO_ADDRESS
        }
      }
      
      // Fallback calculation only if stats not provided
      const proposals = data.proposals || []
      const totalProposals = proposals.length
      const uniqueCreators = new Set(proposals.map((p: any) => p.creator))
      const members = uniqueCreators.size
      
      return {
        totalProposals,
        members,
        treasury: '$0.00',
        contractAddress: DAO_ADDRESS
      }
      
    } catch (error) {
      console.error('Error fetching DAO stats:', error)
      return {
        totalProposals: 0,
        members: 0,
        treasury: '0.00',
        contractAddress: DAO_ADDRESS
      }
    }
  }

  async getUserVotingPower(userAddress: string): Promise<number> {
    try {
      // Basic implementation - return 1 if user is connected
      return 1
    } catch (error) {
      console.error('Error getting voting power:', error)
      return 0
    }
  }

  async getUserVote(proposalId: string, userAddress: string): Promise<'for' | 'against' | null> {
    try {
      // Cannot determine user vote without proper contract ABI
      return null
    } catch (error) {
      console.error('Error getting user vote:', error)
      return null
    }
  }

  async submitVote(proposalId: string, vote: 'for' | 'against', userAddress: string): Promise<string> {
    try {
      console.log(`Attempting to submit ${vote} vote for proposal ${proposalId}`)
      
      if (!window.ethereum) {
        throw new Error('No wallet connected')
      }

      // Would need proper contract ABI and methods to implement voting
      throw new Error('Voting requires proper contract integration - please vote directly on Aragon')
      
    } catch (error) {
      console.error('Vote submission failed:', error)
      throw error
    }
  }

  async getDAOInfo() {
    try {
      // Verify contract exists
      const code = await this.provider.getCode(DAO_ADDRESS)
      
      return {
        address: DAO_ADDRESS,
        name: 'Nodeifi DAO',
        network: 'Base',
        contractExists: code && code !== '0x'
      }
    } catch (error) {
      console.error('Error getting DAO info:', error)
      return {
        address: DAO_ADDRESS,
        name: 'Nodeifi DAO',
        network: 'Base',
        contractExists: false
      }
    }
  }
}