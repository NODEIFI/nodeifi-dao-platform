import { users, projects, teamMembers, logoSettings, governanceCache, type User, type InsertUser, type Project, type InsertProject, type TeamMember, type InsertTeamMember, type LogoSettings, type InsertLogoSettings, type GovernanceCache, type InsertGovernanceCache } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { databaseFallback } from "./database-fallback";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  getAllTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  getLogoSettings(): Promise<LogoSettings | undefined>;
  createLogoSettings(settings: InsertLogoSettings): Promise<LogoSettings>;
  updateLogoSettings(id: number, settings: Partial<InsertLogoSettings>): Promise<LogoSettings>;
  // Governance cache methods
  getCachedProposal(proposalId: string): Promise<GovernanceCache | undefined>;
  getAllCachedProposals(): Promise<GovernanceCache[]>;
  upsertGovernanceCache(data: InsertGovernanceCache): Promise<GovernanceCache>;
  deleteCachedProposal(proposalId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async getAllTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers);
  }

  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const [teamMember] = await db
      .insert(teamMembers)
      .values(insertTeamMember)
      .returning();
    return teamMember;
  }

  async getLogoSettings(): Promise<LogoSettings | undefined> {
    try {
      const [settings] = await db.select().from(logoSettings).limit(1);
      return settings || undefined;
    } catch (error) {
      // Database unavailable - use fallback
      return databaseFallback.getLogoSettings();
    }
  }

  async createLogoSettings(insertLogoSettings: InsertLogoSettings): Promise<LogoSettings> {
    const [settings] = await db
      .insert(logoSettings)
      .values(insertLogoSettings)
      .returning();
    return settings;
  }

  async updateLogoSettings(id: number, updateData: Partial<InsertLogoSettings>): Promise<LogoSettings> {
    const [settings] = await db
      .update(logoSettings)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(logoSettings.id, id))
      .returning();
    return settings;
  }

  // Governance cache methods
  async getCachedProposal(proposalId: string): Promise<GovernanceCache | undefined> {
    const [cached] = await db.select().from(governanceCache).where(eq(governanceCache.proposalId, proposalId));
    return cached || undefined;
  }

  async getAllCachedProposals(): Promise<GovernanceCache[]> {
    return await db.select().from(governanceCache);
  }

  async upsertGovernanceCache(data: InsertGovernanceCache): Promise<GovernanceCache> {
    const existing = await this.getCachedProposal(data.proposalId);
    
    if (existing) {
      const [updated] = await db
        .update(governanceCache)
        .set({ ...data, lastUpdated: new Date() })
        .where(eq(governanceCache.proposalId, data.proposalId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(governanceCache)
        .values(data)
        .returning();
      return created;
    }
  }

  async deleteCachedProposal(proposalId: string): Promise<void> {
    await db.delete(governanceCache).where(eq(governanceCache.proposalId, proposalId));
  }
}

export const storage = new DatabaseStorage();
