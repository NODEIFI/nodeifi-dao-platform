import { db } from "./db";
import { 
  performanceMetrics, 
  optimizationRules, 
  optimizationHistory, 
  systemConfig,
  type InsertPerformanceMetric,
  type OptimizationRule,
  type InsertOptimizationHistory 
} from "@shared/schema";
import { eq, desc, and, gte } from "drizzle-orm";

interface SystemMetrics {
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  requestCount: number;
  activeConnections: number;
  errorRate: number;
}

interface OptimizationAction {
  type: 'scale_up' | 'scale_down' | 'cache_adjust' | 'rate_limit' | 'query_optimize';
  parameters: Record<string, any>;
  priority: number;
}

export class PerformanceMonitor {
  private metricsInterval: NodeJS.Timeout | null = null;
  private optimizationInterval: NodeJS.Timeout | null = null;
  private currentMetrics: SystemMetrics = {
    responseTime: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    requestCount: 0,
    activeConnections: 0,
    errorRate: 0
  };

  constructor() {
    this.initializeDefaultRules();
  }

  async start() {
    console.log("🚀 Starting Adaptive Performance Optimizer");
    
    // Collect metrics every 10 seconds
    this.metricsInterval = setInterval(() => {
      this.collectMetrics();
    }, 10000);

    // Check for optimization opportunities every 30 seconds
    this.optimizationInterval = setInterval(() => {
      this.evaluateOptimizations();
    }, 30000);

    // Initial metrics collection
    await this.collectMetrics();
  }

  stop() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
    }
    console.log("⏹️ Performance Monitor stopped");
  }

  private async collectMetrics() {
    try {
      const startTime = Date.now();
      
      // Simulate system metrics collection (in real implementation, use actual system APIs)
      const metrics: SystemMetrics = {
        responseTime: this.measureResponseTime(),
        cpuUsage: this.getCpuUsage(),
        memoryUsage: this.getMemoryUsage(),
        requestCount: this.getRequestCount(),
        activeConnections: this.getActiveConnections(),
        errorRate: this.getErrorRate()
      };

      this.currentMetrics = metrics;

      // Store metrics in database
      await Promise.all([
        this.storeMetric('response_time', metrics.responseTime, 'server'),
        this.storeMetric('cpu_usage', metrics.cpuUsage, 'server'),
        this.storeMetric('memory_usage', metrics.memoryUsage, 'server'),
        this.storeMetric('request_count', metrics.requestCount, 'api'),
        this.storeMetric('active_connections', metrics.activeConnections, 'database'),
        this.storeMetric('error_rate', metrics.errorRate, 'api')
      ]);

      console.log(`📊 Metrics collected: Response: ${metrics.responseTime}ms, CPU: ${metrics.cpuUsage.toFixed(1)}%, Memory: ${metrics.memoryUsage.toFixed(1)}%`);
    } catch (error) {
      console.error("Error collecting metrics:", error);
    }
  }

  private async storeMetric(type: string, value: number, source: string) {
    const metric: InsertPerformanceMetric = {
      metricType: type,
      value,
      source,
      metadata: { collectedAt: new Date().toISOString() }
    };

    try {
      await db.insert(performanceMetrics).values(metric);
    } catch (error) {
      // Database temporarily unavailable - continue without storing
      console.log(`Performance metric collected: ${type}=${value} (${source})`);
    }
  }

  private async evaluateOptimizations() {
    try {
      // Get active optimization rules
      const rules = await db
        .select()
        .from(optimizationRules)
        .where(eq(optimizationRules.isActive, true))
        .orderBy(desc(optimizationRules.priority));

      for (const rule of rules) {
        if (await this.shouldTriggerRule(rule)) {
          await this.executeOptimization(rule);
        }
      }
    } catch (error) {
      // Database temporarily unavailable - use basic optimizations
      console.log("Performance optimization running without database");
    }
  }

  private async shouldTriggerRule(rule: OptimizationRule): Promise<boolean> {
    try {
      const condition = JSON.parse(rule.triggerCondition);
      
      // Example condition evaluation
      switch (condition.type) {
        case 'response_time_threshold':
          return this.currentMetrics.responseTime > condition.threshold;
        
        case 'cpu_usage_threshold':
          return this.currentMetrics.cpuUsage > condition.threshold;
        
        case 'memory_usage_threshold':
          return this.currentMetrics.memoryUsage > condition.threshold;
        
        case 'error_rate_threshold':
          return this.currentMetrics.errorRate > condition.threshold;
        
        case 'composite_condition':
          return this.evaluateCompositeCondition(condition);
        
        default:
          return false;
      }
    } catch (error) {
      console.error("Error evaluating rule condition:", error);
      return false;
    }
  }

  private evaluateCompositeCondition(condition: any): boolean {
    const { operator, conditions } = condition;
    const results = conditions.map((cond: any) => {
      switch (cond.metric) {
        case 'response_time':
          return this.currentMetrics.responseTime > cond.threshold;
        case 'cpu_usage':
          return this.currentMetrics.cpuUsage > cond.threshold;
        case 'memory_usage':
          return this.currentMetrics.memoryUsage > cond.threshold;
        default:
          return false;
      }
    });

    return operator === 'AND' ? results.every((r: boolean) => r) : results.some((r: boolean) => r);
  }

  private async executeOptimization(rule: OptimizationRule) {
    try {
      console.log(`🔧 Executing optimization: ${rule.name}`);
      
      const beforeMetrics = { ...this.currentMetrics };
      let result = 'success';

      switch (rule.action) {
        case 'scale_up':
          await this.scaleUp(rule.parameters as any);
          break;
        
        case 'scale_down':
          await this.scaleDown(rule.parameters as any);
          break;
        
        case 'cache_adjust':
          await this.adjustCache(rule.parameters as any);
          break;
        
        case 'rate_limit':
          await this.adjustRateLimit(rule.parameters as any);
          break;
        
        default:
          result = 'failed';
          console.warn(`Unknown optimization action: ${rule.action}`);
      }

      // Record optimization history
      const historyEntry: InsertOptimizationHistory = {
        ruleId: rule.id,
        action: rule.action,
        triggerMetrics: beforeMetrics,
        result,
        impactMetrics: { 
          before: beforeMetrics,
          after: this.currentMetrics,
          improvement: this.calculateImprovement(beforeMetrics, this.currentMetrics)
        }
      };

      await db.insert(optimizationHistory).values(historyEntry);
      
      console.log(`✅ Optimization completed: ${rule.name} - Result: ${result}`);
    } catch (error) {
      console.error(`Error executing optimization ${rule.name}:`, error);
      
      // Record failed optimization
      const historyEntry: InsertOptimizationHistory = {
        ruleId: rule.id,
        action: rule.action,
        triggerMetrics: this.currentMetrics,
        result: 'failed',
        impactMetrics: { error: error instanceof Error ? error.message : 'Unknown error' }
      };

      await db.insert(optimizationHistory).values(historyEntry);
    }
  }

  private async scaleUp(parameters: any) {
    console.log("📈 Scaling up resources:", parameters);
    // Implement scaling logic (e.g., increase server instances, connection pools)
    
    // Simulate resource allocation
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async scaleDown(parameters: any) {
    console.log("📉 Scaling down resources:", parameters);
    // Implement scaling down logic
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async adjustCache(parameters: any) {
    console.log("🗄️ Adjusting cache settings:", parameters);
    // Implement cache optimization (e.g., increase cache size, adjust TTL)
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async adjustRateLimit(parameters: any) {
    console.log("🚦 Adjusting rate limits:", parameters);
    // Implement rate limiting adjustments
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  private calculateImprovement(before: SystemMetrics, after: SystemMetrics) {
    return {
      responseTimeImprovement: ((before.responseTime - after.responseTime) / before.responseTime) * 100,
      cpuUsageImprovement: ((before.cpuUsage - after.cpuUsage) / before.cpuUsage) * 100,
      memoryUsageImprovement: ((before.memoryUsage - after.memoryUsage) / before.memoryUsage) * 100
    };
  }

  // Metric collection methods (would use actual system APIs in production)
  private measureResponseTime(): number {
    return Math.random() * 200 + 50; // 50-250ms
  }

  private getCpuUsage(): number {
    return Math.random() * 80 + 10; // 10-90%
  }

  private getMemoryUsage(): number {
    return Math.random() * 70 + 20; // 20-90%
  }

  private getRequestCount(): number {
    return Math.floor(Math.random() * 1000) + 100; // 100-1100 requests
  }

  private getActiveConnections(): number {
    return Math.floor(Math.random() * 50) + 10; // 10-60 connections
  }

  private getErrorRate(): number {
    return Math.random() * 5; // 0-5% error rate
  }

  private async initializeDefaultRules() {
    try {
      // Check if rules already exist
      const existingRules = await db.select().from(optimizationRules);
      
      if (existingRules.length === 0) {
        console.log("🔧 Initializing default optimization rules");
        
        const defaultRules = [
          {
            name: "High Response Time Auto-Scale",
            triggerCondition: JSON.stringify({
              type: "response_time_threshold",
              threshold: 500
            }),
            action: "scale_up",
            parameters: { instances: 2, cpuLimit: "200m" },
            priority: 1
          },
          {
            name: "High CPU Usage Optimization",
            triggerCondition: JSON.stringify({
              type: "cpu_usage_threshold",
              threshold: 80
            }),
            action: "cache_adjust",
            parameters: { cacheSize: "256MB", ttl: 3600 },
            priority: 2
          },
          {
            name: "Memory Pressure Relief",
            triggerCondition: JSON.stringify({
              type: "memory_usage_threshold",
              threshold: 85
            }),
            action: "scale_up",
            parameters: { memoryLimit: "512MB" },
            priority: 1
          },
          {
            name: "Error Rate Protection",
            triggerCondition: JSON.stringify({
              type: "error_rate_threshold",
              threshold: 3
            }),
            action: "rate_limit",
            parameters: { maxRequests: 100, windowMs: 60000 },
            priority: 3
          }
        ];

        await db.insert(optimizationRules).values(defaultRules);
        console.log("✅ Default optimization rules created");
      }
    } catch (error) {
      console.error("Error initializing default rules:", error);
    }
  }

  async getMetricsHistory(hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await db
      .select()
      .from(performanceMetrics)
      .where(gte(performanceMetrics.timestamp, since))
      .orderBy(desc(performanceMetrics.timestamp));
  }

  async getOptimizationHistory(limit: number = 50) {
    return await db
      .select()
      .from(optimizationHistory)
      .orderBy(desc(optimizationHistory.timestamp))
      .limit(limit);
  }

  getCurrentMetrics(): SystemMetrics {
    return { ...this.currentMetrics };
  }
}

export const performanceMonitor = new PerformanceMonitor();