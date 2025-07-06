import { motion } from "framer-motion";
import { useState } from "react";
import { UnifiedButton } from "@/components/ui/unified-button";
import { AdaptiveLogo } from "@/components/adaptive-logo";
import { LogoSettingsPanel } from "@/components/logo-settings-panel";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [showSettings, setShowSettings] = useState(false);

  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Cosmic background */}
      <div className="absolute inset-0 cosmic-gradient"></div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2026&h=1350')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 w-2 h-2 bg-accent rounded-full opacity-60"
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-1 h-1 bg-primary rounded-full opacity-80"
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-32 left-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-40"
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-70"
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 pt-32 md:pt-16">


        {/* Nodeifi Official Logo with Adaptive Settings */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center mb-8 hero-logo-container"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <AdaptiveLogo />
          <div className="ml-0 md:ml-6 mt-4 md:mt-0">
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold tracking-widest hero-main-text" style={{ letterSpacing: '0.15em', textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}>
              <span className="text-slate-300">NODE</span>
              <span className="text-primary">IFI</span>
            </h1>
          </div>
        </motion.div>
        
        <motion.h2 
          className="font-space text-3xl md:text-4xl font-bold mb-8 text-gradient"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          We know what's at stake
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Pioneering the future of blockchain infrastructure through innovative node operations, 
          strategic partnerships, and cutting-edge technology solutions.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <UnifiedButton 
            variant="primary"
            size="lg"
            onClick={scrollToPortfolio}
            className="bg-gradient-to-r from-primary to-amber-500 text-black border-none hover:from-primary/80 hover:to-amber-500/80"
          >
            Explore Our Portfolio
          </UnifiedButton>
          <UnifiedButton 
            variant="secondary"
            size="lg"
            onClick={scrollToContact}
          >
            Get in Touch
          </UnifiedButton>
        </motion.div>
      </div>

      {/* Logo Settings Panel */}
      <LogoSettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </section>
  );
}
