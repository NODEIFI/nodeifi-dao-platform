import { Clock, Users, Target, CheckCircle } from "lucide-react";

interface VotingBarProps {
  currentVotes: number;
  totalPossibleVotes: number;
  minimumThreshold: number;
  supportThreshold: number;
  approvalVotes: number;
  rejectionVotes: number;
  abstainVotes: number;
  timeRemaining?: string;
  isActive: boolean;
}

export const AragonVotingBar = ({
  currentVotes,
  totalPossibleVotes,
  minimumThreshold,
  supportThreshold,
  approvalVotes,
  rejectionVotes,
  abstainVotes,
  timeRemaining = "2 days 14 hours",
  isActive
}: VotingBarProps) => {
  // Calculate percentages for visualization
  const approvalPercentage = totalPossibleVotes > 0 ? (approvalVotes / totalPossibleVotes) * 100 : 0;
  const minThresholdPercentage = totalPossibleVotes > 0 ? (minimumThreshold / totalPossibleVotes) * 100 : 0;
  const supportThresholdPercentage = totalPossibleVotes > 0 ? (supportThreshold / totalPossibleVotes) * 100 : 0;
  
  // Calculate vote percentages for breakdown
  const totalCastVotes = approvalVotes + rejectionVotes + abstainVotes;
  const approvalVotePercentage = totalCastVotes > 0 ? (approvalVotes / totalCastVotes) * 100 : 0;
  const rejectionVotePercentage = totalCastVotes > 0 ? (rejectionVotes / totalCastVotes) * 100 : 0;
  const abstainVotePercentage = totalCastVotes > 0 ? (abstainVotes / totalCastVotes) * 100 : 0;
  
  const participationPercentage = totalPossibleVotes > 0 ? (totalCastVotes / totalPossibleVotes) * 100 : 0;
  
  // Check if thresholds are met
  const minThresholdMet = approvalVotes >= minimumThreshold;
  const supportThresholdMet = approvalVotes >= supportThreshold;
  const approvalReached = minThresholdMet && supportThresholdMet;

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Voting</h2>
        {isActive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{timeRemaining} left to vote</span>
          </div>
        )}
      </div>
      
      {/* Voting ID */}
      <div className="text-sm text-muted-foreground mb-6">
        0x9A30…4941
      </div>
      
      {/* Progress Bar with Markers */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-3">
          <span>0</span>
          <span className="font-medium">{totalPossibleVotes} members</span>
        </div>
        
        {/* Main Progress Bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
          {/* Approval votes fill */}
          <div 
            className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.min(approvalPercentage, 100)}%` }}
          />
          
          {/* Minimum threshold marker */}
          {minThresholdPercentage > 0 && minThresholdPercentage <= 100 && (
            <div 
              className="absolute top-0 h-full w-0.5 bg-gray-500 z-10"
              style={{ left: `${minThresholdPercentage}%` }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap bg-background px-1 rounded">
                Min
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                {minimumThreshold}
              </div>
            </div>
          )}
          
          {/* Support threshold marker */}
          {supportThresholdPercentage > 0 && supportThresholdPercentage <= 100 && supportThresholdPercentage !== minThresholdPercentage && (
            <div 
              className="absolute top-0 h-full w-0.5 bg-gray-600 z-10"
              style={{ left: `${supportThresholdPercentage}%` }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap bg-background px-1 rounded">
                Supp
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                {supportThreshold}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Current: <span className="font-medium text-foreground">{approvalVotes}</span></span>
          <span>Total: <span className="font-medium text-foreground">{totalPossibleVotes}</span></span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-1 mb-6 border-b border-border">
        <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">
          Breakdown
        </button>
      </div>

      {/* Vote Counter Display */}
      <div className="text-center mb-6">
        <div className="text-sm text-muted-foreground mb-2">
          {approvalReached ? "Approval reached" : `${approvalVotes} of ${totalPossibleVotes} members`}
        </div>
        {approvalReached && (
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
            <span className="font-medium">{approvalVotes} votes</span>
            <span className="text-muted-foreground ml-1">({approvalVotePercentage.toFixed(1)}%)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span className="text-sm font-medium">Reject</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{rejectionVotes} votes</span>
            <span className="text-muted-foreground ml-1">({rejectionVotePercentage.toFixed(1)}%)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
            <span className="text-sm font-medium">Abstain</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{abstainVotes} votes</span>
            <span className="text-muted-foreground ml-1">({abstainVotePercentage.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="space-y-3 pt-4 border-t border-border mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Participation</span>
          </div>
          <span className="font-medium">{totalCastVotes} of {totalPossibleVotes} eligible voters ({participationPercentage.toFixed(1)}%)</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Minimum</span>
          </div>
          <span className={`font-medium ${minThresholdMet ? 'text-green-400' : 'text-muted-foreground'}`}>
            {minimumThreshold} votes ({minThresholdPercentage.toFixed(0)}% participation)
            {minThresholdMet && <span className="ml-1">✓</span>}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Support</span>
          </div>
          <span className={`font-medium ${supportThresholdMet ? 'text-green-400' : 'text-muted-foreground'}`}>
            {supportThreshold} votes ({supportThresholdPercentage.toFixed(0)}% approval)
            {supportThresholdMet && <span className="ml-1">✓</span>}
          </span>
        </div>
      </div>

      
    </div>
  );
};