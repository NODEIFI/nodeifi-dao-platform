import { pgTable, serial, timestamp, text, integer, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Performance metrics tracking
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metricType: text("metric_type").notNull(), // 'response_time', 'cpu_usage', 'memory_usage', 'request_count'
  value: real("value").notNull(),
  source: text("source").notNull(), // 'api', 'database', 'client', 'server'
  metadata: jsonb("metadata"), // Additional context data
});

// Performance optimization rules
export const optimizationRules = pgTable("optimization_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  triggerCondition: text("trigger_condition").notNull(), // JSON condition string
  action: text("action").notNull(), // 'scale_up', 'scale_down', 'cache_adjust', 'rate_limit'
  parameters: jsonb("parameters").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  priority: integer("priority").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Performance optimization history
export const optimizationHistory = pgTable("optimization_history", {
  id: serial("id").primaryKey(),
  ruleId: integer("rule_id").references(() => optimizationRules.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  action: text("action").notNull(),
  triggerMetrics: jsonb("trigger_metrics").notNull(),
  result: text("result").notNull(), // 'success', 'failed', 'partial'
  impactMetrics: jsonb("impact_metrics"), // Performance before/after
});

// System configuration for adaptive optimization
export const systemConfig = pgTable("system_config", {
  id: serial("id").primaryKey(),
  configKey: text("config_key").notNull().unique(),
  configValue: jsonb("config_value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertOptimizationRuleSchema = createInsertSchema(optimizationRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOptimizationHistorySchema = createInsertSchema(optimizationHistory).omit({
  id: true,
  timestamp: true,
});

export const insertSystemConfigSchema = createInsertSchema(systemConfig).omit({
  id: true,
  updatedAt: true,
});

// Types
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
export type OptimizationRule = typeof optimizationRules.$inferSelect;
export type InsertOptimizationRule = z.infer<typeof insertOptimizationRuleSchema>;
export type OptimizationHistory = typeof optimizationHistory.$inferSelect;
export type InsertOptimizationHistory = z.infer<typeof insertOptimizationHistorySchema>;
export type SystemConfig = typeof systemConfig.$inferSelect;
export type InsertSystemConfig = z.infer<typeof insertSystemConfigSchema>;