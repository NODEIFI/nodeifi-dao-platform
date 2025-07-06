import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logo: text("logo"),
  website: text("website"),
  category: text("category").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description"),
  twitter: text("twitter"),
  image: text("image"),
  gradient: text("gradient"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
});

// Governance data cache
export const governanceCache = pgTable("governance_cache", {
  id: serial("id").primaryKey(),
  proposalId: text("proposal_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(),
  type: text("type"),
  creator: text("creator"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  supportThreshold: text("support_threshold"),
  minimumApproval: text("minimum_approval"),
  votes: jsonb("votes").$type<{ yes: number; no: number; abstain: number }>(),
  totalVotingPower: integer("total_voting_power"),
  confirmationCount: integer("confirmation_count"),
  requiredConfirmations: integer("required_confirmations"),
  metadata: jsonb("metadata").$type<{ resources: Array<{ name: string; url: string }> }>(),
  contractData: jsonb("contract_data"),
  dataSource: text("data_source"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGovernanceCacheSchema = createInsertSchema(governanceCache).omit({
  id: true,
  createdAt: true,
});

export type GovernanceCache = typeof governanceCache.$inferSelect;
export type InsertGovernanceCache = z.infer<typeof insertGovernanceCacheSchema>;

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

// Logo synchronization settings
export const logoSettings = pgTable("logo_settings", {
  id: serial("id").primaryKey(),
  syncMode: text("sync_mode").notNull().default("independent"), // 'synchronized', 'independent'
  desktopAnimationType: text("desktop_animation_type").notNull().default("css"), // 'css', 'framer'
  mobileAnimationType: text("mobile_animation_type").notNull().default("framer"), // 'css', 'framer'
  animationSpeed: text("animation_speed").notNull().default("normal"), // 'slow', 'normal', 'fast'
  enableOrbitalDots: boolean("enable_orbital_dots").notNull().default(true),
  dotSizeScale: real("dot_size_scale").notNull().default(1.0), // 0.5 to 2.0
  ringOpacity: real("ring_opacity").notNull().default(1.0), // 0.1 to 1.0
  enablePulseEffect: boolean("enable_pulse_effect").notNull().default(false),
  colorTheme: text("color_theme").notNull().default("default"), // 'default', 'monochrome', 'rainbow'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLogoSettingsSchema = createInsertSchema(logoSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
export type OptimizationRule = typeof optimizationRules.$inferSelect;
export type InsertOptimizationRule = z.infer<typeof insertOptimizationRuleSchema>;
export type OptimizationHistory = typeof optimizationHistory.$inferSelect;
export type InsertOptimizationHistory = z.infer<typeof insertOptimizationHistorySchema>;
export type SystemConfig = typeof systemConfig.$inferSelect;
export type InsertSystemConfig = z.infer<typeof insertSystemConfigSchema>;
export type LogoSettings = typeof logoSettings.$inferSelect;
export type InsertLogoSettings = z.infer<typeof insertLogoSettingsSchema>;
