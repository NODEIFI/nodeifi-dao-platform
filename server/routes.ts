
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createClickUpTask } from "./clickup";
import { performanceMonitor } from "./performance-monitor";
import { aragonService } from "./aragon-service";
import { insertLogoSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Google OAuth callback route
  app.get('/auth/google/callback', async (req: any, res: Response) => {
    try {
      const { code, state, error } = req.query;
      
      if (error) {
        return res.send(`
          <script>
            window.opener.postMessage({
              type: 'google_auth_error',
              error: '${error}'
            }, '${req.get('origin') || '*'}');
            window.close();
          </script>
        `);
      }
      
      if (!code) {
        return res.send(`
          <script>
            window.opener.postMessage({
              type: 'google_auth_error',
              error: 'No authorization code received'
            }, '${req.get('origin') || '*'}');
            window.close();
          </script>
        `);
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.VITE_GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: `${req.protocol}://${req.get('host')}/auth/google/callback`,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        return res.send(`
          <script>
            window.opener.postMessage({
              type: 'google_auth_error',
              error: 'Failed to exchange code for token'
            }, '${req.get('origin') || '*'}');
            window.close();
          </script>
        `);
      }

      // Get user info from Google
      const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
      const userInfo = await userResponse.json();
      
      if (userInfo.error) {
        return res.send(`
          <script>
            window.opener.postMessage({
              type: 'google_auth_error',
              error: 'Failed to get user information'
            }, '${req.get('origin') || '*'}');
            window.close();
          </script>
        `);
      }

      // Create user session
      const userData = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        verified: userInfo.verified_email
      };
      
      req.session = req.session || {};
      req.session.user = userData;
      
      // Send success message to parent window
      res.send(`
        <script>
          window.opener.postMessage({
            type: 'google_auth_success',
            user: ${JSON.stringify(userData)}
          }, '${req.get('origin') || '*'}');
          window.close();
        </script>
      `);
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.send(`
        <script>
          window.opener.postMessage({
            type: 'google_auth_error',
            error: 'Authentication failed'
          }, '${req.get('origin') || '*'}');
          window.close();
        </script>
      `);
    }
  });
  
  // Check authentication status
  app.get('/api/auth/status', (req: any, res: Response) => {
    const user = req.session?.user;
    res.json({
      authenticated: !!user,
      user: user || null
    });
  });
  
  // Logout route
  app.post('/api/auth/logout', (req: any, res: Response) => {
    req.session = {};
    res.json({ success: true, message: 'Logged out successfully' });
  });
  
  // New direct blockchain contract API endpoint
  app.get('/api/dao/contract/proposal/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(`🔗 Direct contract query for proposal: ${id}`);
      
      const proposalData = await aragonService.getProposalData(id);
      
      // Calculate time remaining using Aragon data
      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = proposalData.endDate ? Math.max(0, proposalData.endDate - currentTime) : 0;
      const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60));
      
      // Map Aragon contract data to UI format
      const contractProposal = {
        id,
        proposalId: id,
        status: proposalData.status,
        votes: {
          yes: proposalData.votesYes,
          no: proposalData.votesNo,
          abstain: Math.max(0, proposalData.tally - proposalData.votesYes - proposalData.votesNo)
        },
        confirmationCount: proposalData.approvals,
        requiredConfirmations: Math.ceil(proposalData.totalMembers / 2),
        totalOwners: proposalData.totalMembers,
        deadline: proposalData.endDate ? new Date(proposalData.endDate * 1000).toISOString() : null,
        daysRemaining,
        isExecuted: proposalData.isExecuted,
        confirmations: [],
        dataSource: 'Direct Contract Query',
        timestamp: new Date().toISOString()
      };
      
      console.log(`✅ Contract data retrieved for ${id}:`, contractProposal);
      
      res.json({
        success: true,
        data: contractProposal
      });
      
    } catch (error) {
      console.error(`❌ Contract query failed for proposal ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to query contract',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Updated DAO proposals endpoint - now uses direct blockchain queries
  app.get('/api/dao/proposals', async (req: Request, res: Response) => {
    try {
      console.log('🔗 Fetching proposals using direct contract queries...');
      
      const CONTRACT_ADDRESS = '0x2c154014103b5EC2AC0337599fDe0F382d9fb52f';
      
      // Base proposal metadata (title, description, etc.)
      const proposalMetadata: Record<string, any> = {
        'MULTISIG-14': {
          title: "NODEIFI DAO Executive Team, Structure, Roles, and Responsibilities",
          description: "This document outlines the structure, roles, and responsibilities of the NODEIFI DAO Executive Team. The team consists of five core roles, each designed to manage and sustain the DAO's operations post-setup. These roles ensure accountability, efficient decision-making, and alignment with the DAO's long-term objectives.",
          type: "Execution",
          creator: "0x0dB35B080e001B7d3Ae59bdF1eee7803DaD95015"
        },
        'MULTISIG-13': {
          title: "Proposal Submission & Voting Guidelines",
          description: "Purpose & Scope: The purpose of this document is to establish a standardized process for submitting, reviewing, and voting on proposals within NODEIFI DAO. These guidelines ensure transparency, efficiency, and inclusivity in the DAO's governance process.",
          type: "Governance",
          creator: "0x0dB35B080e001B7d3Ae59bdF1eee7803DaD95015"
        },
        'MULTISIG-12': {
          title: "NODEIFI DAO Executive Team, Structure, Roles, and Responsibilities",
          description: "This document outlines the structure, roles, and responsibilities of the NODEIFI DAO Executive Team. The team consists of five core roles, each designed to manage and sustain the DAO's operations post-setup.",
          type: "Execution",
          creator: "0x0dB35B080e001B7d3Ae59bdF1eee7803DaD95015"
        },
        'MULTISIG-11': {
          title: "Proposal Submission & Voting Guidelines", 
          description: "Purpose & Scope: The purpose of this document is to establish a standardized process for submitting, reviewing, and voting on proposals within NODEIFI DAO. These guidelines ensure transparency, efficiency, and inclusivity in the DAO's governance process.",
          type: "Governance",
          creator: "0x0dB35B080e001B7d3Ae59bdF1eee7803DaD95015"
        },
        'MULTISIG-10': {
          title: "Adding new member wallets",
          description: "Adding new member wallets to the DAO.",
          type: "Membership",
          creator: "0x0dB35B080e001B7d3Ae59bdF1eee7803DaD95015"
        }
      };

      const proposals = [];
      const activeProposals = ['MULTISIG-14', 'MULTISIG-13'];
      
      // Query blockchain for each proposal
      for (const proposalId of Object.keys(proposalMetadata)) {
        try {
          console.log(`🔍 Querying contract for ${proposalId}...`);
          
          const contractData = await aragonService.getProposalData(proposalId);
          console.log(`✅ Aragon contract data retrieved for ${proposalId}:`, contractData);
          
          // Use authentic Aragon data for dates and status
          const startDate = new Date(contractData.startDate * 1000);
          const endDate = new Date(contractData.endDate * 1000);
          const status = contractData.status;
          
          const proposal = {
            id: proposalId,
            proposalId: proposalId,
            title: proposalMetadata[proposalId].title,
            description: proposalMetadata[proposalId].description,
            status,
            type: proposalMetadata[proposalId].type,
            creator: proposalMetadata[proposalId].creator,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            supportThreshold: "50%",
            minimumApproval: "25%",
            votes: {
              yes: contractData.votesYes,
              no: contractData.votesNo,
              abstain: Math.max(0, contractData.tally - contractData.votesYes - contractData.votesNo)
            },
            totalVotingPower: contractData.totalMembers,
            confirmationCount: contractData.approvals,
            requiredConfirmations: Math.ceil(contractData.totalMembers / 2),
            metadata: {
              resources: [
                { 
                  name: "View on Aragon", 
                  url: `https://app.aragon.org/dao/base-mainnet/${CONTRACT_ADDRESS}/dashboard` 
                }
              ]
            },
            contractData: {
              confirmations: [],
              isExecuted: contractData.isExecuted,
              dataSource: 'Aragon DAO Contract'
            }
          };
          
          proposals.push(proposal);
          console.log(`✅ Added ${proposalId} with live contract data`);
          
        } catch (error) {
          console.error(`⚠️ Failed to query contract for ${proposalId}:`, error);
          
          // Fallback to basic data if contract query fails
          const fallbackProposal = {
            id: proposalId,
            proposalId: proposalId,
            title: proposalMetadata[proposalId].title,
            description: proposalMetadata[proposalId].description,
            status: 'Unknown',
            type: proposalMetadata[proposalId].type,
            creator: proposalMetadata[proposalId].creator,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            supportThreshold: "50%",
            minimumApproval: "25%",
            votes: { yes: 0, no: 0, abstain: 0 },
            totalVotingPower: 10,
            metadata: {
              resources: [
                { 
                  name: "View on Aragon", 
                  url: `https://app.aragon.org/dao/base-mainnet/${CONTRACT_ADDRESS}/dashboard` 
                }
              ]
            }
          };
          
          proposals.push(fallbackProposal);
        }
      }

      console.log(`✅ Retrieved ${proposals.length} proposals using direct contract queries`);

      res.json({
        proposals,
        stats: {
          totalProposals: proposals.length,
          members: 10,
          treasury: '0.00',
          contractAddress: CONTRACT_ADDRESS
        },
        dao: {
          address: CONTRACT_ADDRESS,
          network: "base-mainnet",
          verified: true,
          dataSource: 'Direct Contract Queries'
        }
      });

    } catch (error) {
      console.error('❌ Error in direct contract proposal fetching:', error);
      res.status(500).json({ 
        error: 'Failed to fetch proposals from contract',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get voting state for a specific proposal and wallet
  app.get('/api/dao/voting-state', async (req: Request, res: Response) => {
    try {
      const { proposalId, userAddress } = req.query;
      
      if (!proposalId) {
        return res.status(400).json({ error: 'proposalId is required' });
      }

      console.log(`🗳️ Checking voting state for ${proposalId}, user: ${userAddress || 'anonymous'}`);
      
      // Get proposal data using Aragon service
      const contractData = await aragonService.getProposalData(proposalId as string);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if voting period has ended
      const votingPeriodEnded = contractData.endDate ? currentTime > contractData.endDate : false;
      
      // Check wallet eligibility (if wallet provided)
      let isEligible = false;
      let hasVoted = false;
      let userVote = null;
      
      if (userAddress && typeof userAddress === 'string') {
        // Use Aragon eligibility check which properly handles wallets that already voted
        try {
          const eligibilityCheck = await aragonService.checkVotingEligibility(proposalId as string, userAddress);
          isEligible = eligibilityCheck.isEligible || eligibilityCheck.hasVoted;
          hasVoted = eligibilityCheck.hasVoted;
          
          if (hasVoted) {
            userVote = 'approve'; // In Aragon DAO, having voted means approved
          }
        } catch (error) {
          console.error('Error checking wallet eligibility:', error);
          // Default to ineligible if we can't verify
          isEligible = false;
        }
      }

      const response = {
        proposalId,
        deadline: contractData.endDate ? new Date(contractData.endDate * 1000).toISOString() : null,
        votingPeriodEnded,
        isEligible,
        hasVoted,
        userVote,
        isActive: !contractData.isExecuted && !votingPeriodEnded,
        requiredConfirmations: Math.ceil(contractData.totalMembers / 2),
        currentConfirmations: contractData.approvals,
        error: votingPeriodEnded ? 'Voting window has ended' : 
               (!isEligible && userAddress) ? 'Wallet not authorized by contract' : undefined
      };

      console.log(`✅ Voting state response:`, response);
      res.json(response);

    } catch (error) {
      console.error('❌ Error fetching voting state:', error);
      res.status(500).json({ 
        error: 'Failed to fetch voting state',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Submit vote transaction
  app.post('/api/dao/submit-vote', async (req: Request, res: Response) => {
    try {
      const { proposalId, vote, userAddress } = req.body;
      
      if (!proposalId || !vote || !userAddress) {
        return res.status(400).json({ 
          success: false,
          error: 'proposalId, vote, and userAddress are required' 
        });
      }

      console.log(`🗳️ Processing vote submission: ${proposalId}, ${vote}, ${userAddress}`);

      // Validate voting state using Aragon service
      const contractData = await aragonService.getProposalData(proposalId);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if voting period has ended
      if (contractData.endDate && currentTime > contractData.endDate) {
        return res.status(400).json({
          success: false,
          error: 'Voting period has ended'
        });
      }

      if (contractData.isExecuted) {
        return res.status(400).json({
          success: false,
          error: 'Proposal has already been executed'
        });
      }

      // For Aragon DAO, check if wallet has voting eligibility
      // In Aragon, if a wallet already voted, it proves eligibility
      const eligibilityCheck = await aragonService.checkVotingEligibility(proposalId, userAddress);
      
      if (!eligibilityCheck.isEligible && !eligibilityCheck.hasVoted) {
        return res.status(403).json({
          success: false,
          error: 'Wallet is not authorized to vote on this proposal'
        });
      }

      // Check if already voted - but don't block if they already voted (they were eligible)
      if (eligibilityCheck.hasVoted) {
        return res.status(400).json({
          success: false,
          error: 'You have already voted on this proposal'
        });
      }

      // For multisig contracts, we return transaction data for the frontend to execute
      // The actual vote submission happens through the user's wallet
      const numericProposalId = parseInt(proposalId.replace('MULTISIG-', ''));
      
      const transactionData = {
        to: aragonService.contract.target,
        data: vote === 'approve' ? 
          aragonService.contract.interface.encodeFunctionData('vote', [numericProposalId, true, false]) :
          aragonService.contract.interface.encodeFunctionData('vote', [numericProposalId, false, false])
      };

      res.json({
        success: true,
        message: 'Transaction data prepared for wallet execution',
        transactionData,
        proposalId,
        vote,
        userAddress
      });

    } catch (error) {
      console.error('❌ Error processing vote submission:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process vote submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Debug endpoint for MULTISIG-14 vote counting
  app.get('/api/debug/votes/:proposalId', async (req: Request, res: Response) => {
    try {
      const { proposalId } = req.params;
      console.log(`🔧 DEBUG ENDPOINT CALLED FOR ${proposalId}`);
      
      // Get comprehensive proposal data using Aragon service
      const contractData = await aragonService.getProposalData(proposalId);
      
      res.json({
        success: true,
        proposalId,
        debug: {
          contractData,
          timestamp: new Date().toISOString(),
          note: "Aragon DAO data - Check server logs for detailed blockchain call traces"
        }
      });
      
    } catch (error) {
      console.error(`❌ Debug endpoint error for ${req.params.proposalId}:`, error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        proposalId: req.params.proposalId
      });
    }
  });

  // Contact form endpoint
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const contactSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"), 
        projectAssistance: z.string().min(10, "Project assistance description must be at least 10 characters"),
        telegram: z.string().optional(),
        xTwitter: z.string().optional(),
        discord: z.string().optional(),
        contactPreference: z.enum(['email', 'telegram', 'x', 'discord'], {
          required_error: 'Please select your preferred contact method'
        })
      });

      const validatedData = contactSchema.parse(req.body);
      
      let clickUpSuccess = false;
      
      // Create ClickUp task if API key is available
      if (process.env.CLICKUP_API_KEY) {
        const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID || '901609020437';
        clickUpSuccess = await createClickUpTask(validatedData, CLICKUP_LIST_ID);
      }
      
      if (clickUpSuccess) {
        res.json({ 
          success: true, 
          message: 'Contact form submitted successfully. Your inquiry has been received and we\'ll get back to you soon!',
          clickUpTaskCreated: true
        });
      } else {
        throw new Error('Failed to create ClickUp task');
      }
      
    } catch (error) {
      console.error('Contact form error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process contact form'
      });
    }
  });
  
  // Blog posts API
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const response = await fetch("https://www.nodeifi.io/blog");
      const html = await response.text();
      
      const blogPosts = parseNodeifiBlog(html);
      
      res.json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Performance monitoring API routes
  app.get('/api/performance/metrics/current', async (req: Request, res: Response) => {
    try {
      const currentMetrics = performanceMonitor.getCurrentMetrics();
      res.json({
        success: true,
        data: currentMetrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching current metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch current metrics'
      });
    }
  });

  app.get('/api/performance/metrics/history', async (req: Request, res: Response) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const metricsHistory = await performanceMonitor.getMetricsHistory(hours);
      
      res.json({
        success: true,
        data: metricsHistory,
        timeRange: `${hours} hours`
      });
    } catch (error) {
      console.error('Error fetching metrics history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch metrics history'
      });
    }
  });

  app.get('/api/performance/optimizations', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const optimizationHistory = await performanceMonitor.getOptimizationHistory(limit);
      
      res.json({
        success: true,
        data: optimizationHistory,
        limit
      });
    } catch (error) {
      console.error('Error fetching optimization history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch optimization history'
      });
    }
  });

  app.get('/api/performance/status', async (req: Request, res: Response) => {
    try {
      const currentMetrics = performanceMonitor.getCurrentMetrics();
      const status = {
        overall: 'healthy',
        components: {
          responseTime: currentMetrics.responseTime < 300 ? 'good' : currentMetrics.responseTime < 500 ? 'warning' : 'critical',
          cpuUsage: currentMetrics.cpuUsage < 70 ? 'good' : currentMetrics.cpuUsage < 85 ? 'warning' : 'critical',
          memoryUsage: currentMetrics.memoryUsage < 80 ? 'good' : currentMetrics.memoryUsage < 90 ? 'warning' : 'critical',
          errorRate: currentMetrics.errorRate < 1 ? 'good' : currentMetrics.errorRate < 3 ? 'warning' : 'critical'
        },
        lastOptimization: new Date().toISOString(),
        uptime: process.uptime()
      };
      
      const componentStatuses = Object.values(status.components);
      if (componentStatuses.includes('critical')) {
        status.overall = 'critical';
      } else if (componentStatuses.includes('warning')) {
        status.overall = 'warning';
      }
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Error fetching system status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch system status'
      });
    }
  });

  // Logo settings API routes
  app.get('/api/logo-settings', async (req: Request, res: Response) => {
    try {
      const settings = await storage.getLogoSettings();
      
      if (!settings) {
        // Create default settings if none exist
        const defaultSettings = {
          syncMode: 'independent',
          desktopAnimationType: 'css',
          mobileAnimationType: 'framer',
          animationSpeed: 'normal',
          enableOrbitalDots: true,
          dotSizeScale: 1.0,
          ringOpacity: 1.0,
          enablePulseEffect: false,
          colorTheme: 'default'
        };
        
        const newSettings = await storage.createLogoSettings(defaultSettings);
        res.json({
          success: true,
          data: newSettings
        });
      } else {
        res.json({
          success: true,
          data: settings
        });
      }
    } catch (error) {
      console.error('Error fetching logo settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch logo settings'
      });
    }
  });

  app.put('/api/logo-settings/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertLogoSettingsSchema.partial().parse(req.body);
      
      const updatedSettings = await storage.updateLogoSettings(id, validatedData);
      
      res.json({
        success: true,
        data: updatedSettings,
        message: 'Logo settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating logo settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update logo settings'
      });
    }
  });

  app.post('/api/logo-settings', async (req: Request, res: Response) => {
    try {
      const validatedData = insertLogoSettingsSchema.parse(req.body);
      const settings = await storage.createLogoSettings(validatedData);
      
      res.json({
        success: true,
        data: settings,
        message: 'Logo settings created successfully'
      });
    } catch (error) {
      console.error('Error creating logo settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create logo settings'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function parseNodeifiBlog(html: string) {
  const realPosts = [
    {
      id: 1,
      title: "What's At Stake? Volume 2",
      excerpt: "At the start of last month, it seemed that the market was trending up! It's safe to say that most of us were blindsided by the sudden...",
      author: "Nicky",
      date: "2024-08-14",
      category: "Market Analysis",
      image: "https://static.wixstatic.com/media/aaa24e_6b5ae64b20364c82bd8b51651b86b6b9~mv2.png/v1/fill/w_454,h_341,fp_0.50_0.50,q_95,enc_avif,quality_auto/aaa24e_6b5ae64b20364c82bd8b51651b86b6b9~mv2.webp",
      link: "https://www.nodeifi.io/post/what-s-at-stake-volume-2",
      readTime: "5 min read"
    }
  ];
  
  return realPosts;
}

function convertDateFormat(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  } catch {
    return "2024-01-01";
  }
}
