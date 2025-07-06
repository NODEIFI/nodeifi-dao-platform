import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { LogoSettings } from "@shared/schema";

interface AdaptiveLogoProps {
  className?: string;
}

export function AdaptiveLogo({ className = "" }: AdaptiveLogoProps) {
  const { data: settingsResponse } = useQuery({
    queryKey: ['/api/logo-settings'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const settings = (settingsResponse as any)?.data as LogoSettings | undefined;

  // Default settings if none are loaded
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

  const currentSettings = settings || defaultSettings;

  // Animation speed mapping
  const speedMapping = {
    slow: { duration: 30, dotScale: 0.8 },
    normal: { duration: 20, dotScale: 1.0 },
    fast: { duration: 10, dotScale: 1.2 }
  };

  const speed = speedMapping[currentSettings.animationSpeed as keyof typeof speedMapping] || speedMapping.normal;

  // Color theme mapping
  const colorThemes = {
    default: {
      primary: 'hsl(var(--primary))',
      secondary: 'rgb(251, 191, 36)', // amber-400
      accent: 'hsl(var(--primary))'
    },
    monochrome: {
      primary: 'rgb(156, 163, 175)', // gray-400
      secondary: 'rgb(229, 231, 235)', // gray-200
      accent: 'rgb(107, 114, 128)' // gray-500
    },
    rainbow: {
      primary: 'rgb(239, 68, 68)', // red-500
      secondary: 'rgb(34, 197, 94)', // green-500
      accent: 'rgb(168, 85, 247)' // purple-500
    }
  };

  const colors = colorThemes[currentSettings.colorTheme as keyof typeof colorThemes] || colorThemes.default;

  // Common logo image
  const logoImage = (
    <img 
      src="https://pbs.twimg.com/profile_images/1569262543469690880/LRIroCvJ_400x400.jpg"
      alt="Nodeifi Logo"
      className="w-full h-full object-cover rounded-full"
    />
  );

  // Synchronized mode - use same animation type for both
  if (currentSettings.syncMode === 'synchronized') {
    const animationType = currentSettings.desktopAnimationType;
    
    if (animationType === 'framer') {
      return (
        <div className={`w-32 h-32 rounded-full relative ${className}`}>
          {logoImage}
          <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
          
          {currentSettings.enableOrbitalDots && (
            <>
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-dashed"
                style={{ 
                  borderColor: colors.primary,
                  opacity: currentSettings.ringOpacity 
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: speed.duration * 0.4, repeat: Infinity, ease: "linear" }}
              >
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                  style={{ 
                    width: `${8 * currentSettings.dotSizeScale}px`,
                    height: `${8 * currentSettings.dotSizeScale}px`,
                    backgroundColor: colors.primary 
                  }}
                />
              </motion.div>
              
              <motion.div 
                className="absolute -inset-2 rounded-full border border-dotted"
                style={{ 
                  borderColor: colors.secondary,
                  opacity: currentSettings.ringOpacity 
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: speed.duration * 0.6, repeat: Infinity, ease: "linear" }}
              >
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                  style={{ 
                    width: `${6 * currentSettings.dotSizeScale}px`,
                    height: `${6 * currentSettings.dotSizeScale}px`,
                    backgroundColor: colors.secondary 
                  }}
                />
              </motion.div>
              
              <motion.div 
                className="absolute -inset-4 rounded-full border"
                style={{ 
                  borderColor: colors.accent,
                  opacity: currentSettings.ringOpacity 
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: speed.duration, repeat: Infinity, ease: "linear" }}
              >
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                  style={{ 
                    width: `${4 * currentSettings.dotSizeScale}px`,
                    height: `${4 * currentSettings.dotSizeScale}px`,
                    backgroundColor: colors.accent 
                  }}
                />
              </motion.div>
            </>
          )}
        </div>
      );
    } else {
      // CSS animations for synchronized mode
      return (
        <div className={`w-32 h-32 rounded-full relative ${className}`}>
          {logoImage}
          <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
          
          {currentSettings.enableOrbitalDots && (
            <>
              <div 
                className="absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow"
                style={{ 
                  borderColor: colors.primary,
                  opacity: currentSettings.ringOpacity,
                  animationDuration: `${speed.duration * 0.4}s`
                }}
              >
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                  style={{ 
                    width: `${8 * currentSettings.dotSizeScale}px`,
                    height: `${8 * currentSettings.dotSizeScale}px`,
                    backgroundColor: colors.primary 
                  }}
                />
              </div>
              
              <div 
                className="absolute -inset-2 rounded-full border border-dotted animate-spin-slow"
                style={{ 
                  borderColor: colors.secondary,
                  opacity: currentSettings.ringOpacity,
                  animationDirection: 'reverse',
                  animationDuration: `${speed.duration * 0.6}s`
                }}
              >
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                  style={{ 
                    width: `${6 * currentSettings.dotSizeScale}px`,
                    height: `${6 * currentSettings.dotSizeScale}px`,
                    backgroundColor: colors.secondary 
                  }}
                />
              </div>
              
              <div 
                className="absolute -inset-4 rounded-full border animate-spin-slow"
                style={{ 
                  borderColor: colors.accent,
                  opacity: currentSettings.ringOpacity,
                  animationDuration: `${speed.duration}s`
                }}
              >
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                  style={{ 
                    width: `${4 * currentSettings.dotSizeScale}px`,
                    height: `${4 * currentSettings.dotSizeScale}px`,
                    backgroundColor: colors.accent 
                  }}
                />
              </div>
            </>
          )}
        </div>
      );
    }
  }

  // Independent mode - different animations for desktop/mobile
  return (
    <div className={`relative flex-shrink-0 main-nodeifi-logo ${className}`}>
      {/* Desktop Logo */}
      <div className="hidden md:block w-32 h-32 rounded-full relative">
        {logoImage}
        <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
        
        {currentSettings.enableOrbitalDots && currentSettings.desktopAnimationType === 'css' && (
          <>
            <div 
              className="absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow"
              style={{ 
                borderColor: colors.primary,
                opacity: currentSettings.ringOpacity,
                animationDuration: `${speed.duration * 0.4}s`
              }}
            >
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                style={{ 
                  width: `${8 * currentSettings.dotSizeScale}px`,
                  height: `${8 * currentSettings.dotSizeScale}px`,
                  backgroundColor: colors.primary 
                }}
              />
            </div>
            
            <div 
              className="absolute -inset-2 rounded-full border border-dotted animate-spin-slow"
              style={{ 
                borderColor: colors.secondary,
                opacity: currentSettings.ringOpacity,
                animationDirection: 'reverse',
                animationDuration: `${speed.duration * 0.6}s`
              }}
            >
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                style={{ 
                  width: `${6 * currentSettings.dotSizeScale}px`,
                  height: `${6 * currentSettings.dotSizeScale}px`,
                  backgroundColor: colors.secondary 
                }}
              />
            </div>
            
            <div 
              className="absolute -inset-4 rounded-full border animate-spin-slow"
              style={{ 
                borderColor: colors.accent,
                opacity: currentSettings.ringOpacity,
                animationDuration: `${speed.duration}s`
              }}
            >
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                style={{ 
                  width: `${4 * currentSettings.dotSizeScale}px`,
                  height: `${4 * currentSettings.dotSizeScale}px`,
                  backgroundColor: colors.accent 
                }}
              />
            </div>
          </>
        )}

        {currentSettings.enableOrbitalDots && currentSettings.desktopAnimationType === 'framer' && (
          <>
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-dashed"
              style={{ 
                borderColor: colors.primary,
                opacity: currentSettings.ringOpacity 
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: speed.duration * 0.4, repeat: Infinity, ease: "linear" }}
            >
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                style={{ 
                  width: `${8 * currentSettings.dotSizeScale}px`,
                  height: `${8 * currentSettings.dotSizeScale}px`,
                  backgroundColor: colors.primary 
                }}
              />
            </motion.div>
            
            <motion.div 
              className="absolute -inset-2 rounded-full border border-dotted"
              style={{ 
                borderColor: colors.secondary,
                opacity: currentSettings.ringOpacity 
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: speed.duration * 0.6, repeat: Infinity, ease: "linear" }}
            >
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                style={{ 
                  width: `${6 * currentSettings.dotSizeScale}px`,
                  height: `${6 * currentSettings.dotSizeScale}px`,
                  backgroundColor: colors.secondary 
                }}
              />
            </motion.div>
            
            <motion.div 
              className="absolute -inset-4 rounded-full border"
              style={{ 
                borderColor: colors.accent,
                opacity: currentSettings.ringOpacity 
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: speed.duration, repeat: Infinity, ease: "linear" }}
            >
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 rounded-full"
                style={{ 
                  width: `${4 * currentSettings.dotSizeScale}px`,
                  height: `${4 * currentSettings.dotSizeScale}px`,
                  backgroundColor: colors.accent 
                }}
              />
            </motion.div>
          </>
        )}
      </div>
      
      {/* Mobile Logo */}
      <div className="block md:hidden w-32 h-32 rounded-full relative">
        {logoImage}
        <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
        
        {currentSettings.enableOrbitalDots && currentSettings.mobileAnimationType === 'framer' && (
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-dashed"
            style={{ 
              borderColor: colors.primary,
              opacity: currentSettings.ringOpacity 
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div 
              className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full"
              style={{ 
                transform: 'translate(-50%, -50%)',
                backgroundColor: colors.primary 
              }}
            />
          </motion.div>
        )}

        {currentSettings.enableOrbitalDots && currentSettings.mobileAnimationType === 'css' && (
          <div 
            className="absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow"
            style={{ 
              borderColor: colors.primary,
              opacity: currentSettings.ringOpacity,
              animationDuration: '8s'
            }}
          >
            <div 
              className="absolute top-0 left-1/2 w-2 h-2 rounded-full"
              style={{ 
                transform: 'translate(-50%, -50%)',
                backgroundColor: colors.primary 
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}