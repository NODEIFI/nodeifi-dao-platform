import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Zap, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { UnifiedCard } from '@/components/ui/unified-card';

interface SystemMetrics {
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  requestCount: number;
  activeConnections: number;
  errorRate: number;
}

interface SystemStatus {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    responseTime: 'good' | 'warning' | 'critical';
    cpuUsage: 'good' | 'warning' | 'critical';
    memoryUsage: 'good' | 'warning' | 'critical';
    errorRate: 'good' | 'warning' | 'critical';
  };
  lastOptimization: string;
  uptime: number;
}

interface OptimizationHistory {
  id: number;
  action: string;
  timestamp: string;
  result: 'success' | 'failed' | 'partial';
  triggerMetrics: SystemMetrics;
}

function MetricCard({ title, value, unit, status, icon: Icon, trend }: {
  title: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  icon: any;
  trend?: number;
}) {
  const statusColors = {
    good: 'text-green-400 border-green-400/30 bg-green-400/10',
    warning: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    critical: 'text-red-400 border-red-400/30 bg-red-400/10'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border ${statusColors[status]} backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6" />
        {trend !== undefined && (
          <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">
        {value.toFixed(1)}{unit}
      </div>
      <div className="text-sm opacity-70">{title}</div>
    </motion.div>
  );
}

function StatusIndicator({ status }: { status: 'good' | 'warning' | 'critical' }) {
  const config = {
    good: { icon: CheckCircle, color: 'text-green-400', label: 'Good' },
    warning: { icon: AlertTriangle, color: 'text-yellow-400', label: 'Warning' },
    critical: { icon: XCircle, color: 'text-red-400', label: 'Critical' }
  };

  const { icon: Icon, color, label } = config[status];

  return (
    <div className={`flex items-center ${color}`}>
      <Icon className="w-4 h-4 mr-2" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

function OptimizationCard({ optimization }: { optimization: OptimizationHistory }) {
  const resultColors = {
    success: 'text-green-400 bg-green-400/10 border-green-400/30',
    failed: 'text-red-400 bg-red-400/10 border-red-400/30',
    partial: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-cyan-400/20 bg-black/20 backdrop-blur-sm mb-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-white">{optimization.action.replace('_', ' ').toUpperCase()}</div>
        <div className={`px-2 py-1 rounded text-xs border ${resultColors[optimization.result]}`}>
          {optimization.result}
        </div>
      </div>
      <div className="text-sm text-gray-300 mb-2">
        {new Date(optimization.timestamp).toLocaleString()}
      </div>
      <div className="text-xs text-gray-400">
        Triggered by: CPU {optimization.triggerMetrics.cpuUsage.toFixed(1)}%, 
        Memory {optimization.triggerMetrics.memoryUsage.toFixed(1)}%, 
        Response {optimization.triggerMetrics.responseTime.toFixed(0)}ms
      </div>
    </motion.div>
  );
}

export default function PerformanceDashboard() {
  const [isVisible, setIsVisible] = useState(false);

  // Real-time metrics query
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/performance/metrics/current'],
    refetchInterval: 5000, // Update every 5 seconds
  });

  // System status query
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/performance/status'],
    refetchInterval: 10000, // Update every 10 seconds
  });

  // Optimization history query
  const { data: optimizationData, isLoading: optimizationLoading } = useQuery({
    queryKey: ['/api/performance/optimizations'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (metricsLoading || statusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-cyan-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading Performance Dashboard...</div>
      </div>
    );
  }

  const metrics: SystemMetrics = (metricsData as any)?.data || {
    responseTime: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    requestCount: 0,
    activeConnections: 0,
    errorRate: 0
  };
  const status: SystemStatus = (statusData as any)?.data || {
    overall: 'healthy' as const,
    components: {
      responseTime: 'good' as const,
      cpuUsage: 'good' as const,
      memoryUsage: 'good' as const,
      errorRate: 'good' as const
    },
    lastOptimization: new Date().toISOString(),
    uptime: 0
  };
  const optimizations: OptimizationHistory[] = (optimizationData as any)?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-cyan-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Adaptive Performance Optimizer
          </h1>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-lg border ${
              status.overall === 'healthy' ? 'border-green-400/30 bg-green-400/10 text-green-400' :
              status.overall === 'warning' ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400' :
              'border-red-400/30 bg-red-400/10 text-red-400'
            }`}>
              System Status: {status.overall?.toUpperCase()}
            </div>
            <div className="text-gray-300">
              Uptime: {Math.floor((status.uptime || 0) / 3600)}h {Math.floor(((status.uptime || 0) % 3600) / 60)}m
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Response Time"
            value={metrics.responseTime || 0}
            unit="ms"
            status={status.components?.responseTime || 'good'}
            icon={Zap}
          />
          <MetricCard
            title="CPU Usage"
            value={metrics.cpuUsage || 0}
            unit="%"
            status={status.components?.cpuUsage || 'good'}
            icon={Cpu}
          />
          <MetricCard
            title="Memory Usage"
            value={metrics.memoryUsage || 0}
            unit="%"
            status={status.components?.memoryUsage || 'good'}
            icon={HardDrive}
          />
          <MetricCard
            title="Error Rate"
            value={metrics.errorRate || 0}
            unit="%"
            status={status.components?.errorRate || 'good'}
            icon={Activity}
          />
        </div>

        {/* System Components Status */}
        <UnifiedCard className="mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">System Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-black/20 border border-cyan-400/20">
                <div className="text-sm text-gray-300 mb-2">Response Time</div>
                <StatusIndicator status={status.components?.responseTime || 'good'} />
              </div>
              <div className="p-4 rounded-lg bg-black/20 border border-cyan-400/20">
                <div className="text-sm text-gray-300 mb-2">CPU Usage</div>
                <StatusIndicator status={status.components?.cpuUsage || 'good'} />
              </div>
              <div className="p-4 rounded-lg bg-black/20 border border-cyan-400/20">
                <div className="text-sm text-gray-300 mb-2">Memory Usage</div>
                <StatusIndicator status={status.components?.memoryUsage || 'good'} />
              </div>
              <div className="p-4 rounded-lg bg-black/20 border border-cyan-400/20">
                <div className="text-sm text-gray-300 mb-2">Error Rate</div>
                <StatusIndicator status={status.components?.errorRate || 'good'} />
              </div>
            </div>
          </div>
        </UnifiedCard>

        {/* Optimization History */}
        <UnifiedCard>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Optimizations</h2>
            <div className="max-h-96 overflow-y-auto">
              {optimizations.length > 0 ? (
                optimizations.slice(0, 10).map((optimization, index) => (
                  <OptimizationCard key={index} optimization={optimization} />
                ))
              ) : (
                <div className="text-gray-400 text-center py-8">
                  No optimizations performed yet. System is monitoring for optimization opportunities.
                </div>
              )}
            </div>
          </div>
        </UnifiedCard>
      </motion.div>
    </div>
  );
}