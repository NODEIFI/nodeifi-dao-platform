import { LogoSettings } from "@shared/schema";

// In-memory storage for when database is unavailable
class DatabaseFallback {
  private logoSettings: LogoSettings = {
    id: 1,
    syncMode: 'independent',
    desktopAnimationType: 'css',
    mobileAnimationType: 'framer',
    animationSpeed: 'normal',
    enableOrbitalDots: true,
    dotSizeScale: 1.0,
    ringOpacity: 1.0,
    enablePulseEffect: false,
    colorTheme: 'default',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  getLogoSettings(): LogoSettings {
    return this.logoSettings;
  }

  updateLogoSettings(updates: Partial<LogoSettings>): LogoSettings {
    this.logoSettings = { ...this.logoSettings, ...updates, updatedAt: new Date() };
    return this.logoSettings;
  }
}

export const databaseFallback = new DatabaseFallback();