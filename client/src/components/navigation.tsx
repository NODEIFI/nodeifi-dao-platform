import { useState, useEffect, useCallback } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MobileNavDrawer } from "./ui/mobile-nav-drawer";
import { UnifiedButton } from "./ui/unified-button";
import { ContactFormModal } from "./ui/contact-form-modal";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [candyBurst, setCandyBurst] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (sectionId: string) => {
    if (location !== '/') {
      // If not on home page, navigate to home first, then scroll
      setLocation('/');
      // Increased timeout and added retry logic for better reliability
      setTimeout(() => {
        const scrollToElement = () => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          } else {
            // Retry if element not found immediately
            setTimeout(scrollToElement, 50);
          }
        };
        scrollToElement();
      }, 200);
    } else {
      // If already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleCandyShopClick = useCallback(() => {
    setCandyBurst(true);
    setTimeout(() => {
      setLocation("/candy-shop");
      setCandyBurst(false);
    }, 2000); // Extended to 2 seconds to let the animation play fully
  }, [setLocation]);

  // Candy pieces data for the burst animation
  const candyPieces = Array.from({ length: 30 }, (_, i) => {
    const candyTypes = ['🍭', '🍬', '🧁', '🍪', '🎂', '🍰', '🧁', '🍩'];
    const colors = ['#FF6B9D', '#C44569', '#F8B500', '#78E08F', '#60A3BC', '#6C5CE7', '#FD79A8', '#FF9F43', '#A29BFE'];
    return {
      id: i,
      emoji: candyTypes[i % candyTypes.length],
      color: colors[i % colors.length],
      size: Math.random() * 15 + 20,
      delay: Math.random() * 0.3,
      angle: (360 / 30) * i + Math.random() * 40 - 20,
      distance: Math.random() * 300 + 150,
      rotationSpeed: Math.random() * 4 + 2
    };
  });

  return (
    <>
      <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-morphism' : 'glass-morphism'
      } rounded-full px-8 py-4 desktop-nav`}>
        <div className="flex items-center justify-center">
          {/* Original Desktop Navigation - Always Visible on Desktop */}
          <div className="desktop-nav-items flex items-center space-x-6 lg:space-x-8">
            <Link href="/services">
              <button 
                onClick={() => {
                  // If already on services page, scroll to top
                  if (location === '/services') {
                    window.scrollTo(0, 0);
                  }
                }}
                className="text-sm font-space hover:text-primary transition-colors whitespace-nowrap"
              >
                SERVICES
              </button>
            </Link>
            <div className="relative">
              <button 
                onClick={() => setCommunityDropdownOpen(!communityDropdownOpen)}
                className="text-sm font-space hover:text-primary transition-colors whitespace-nowrap flex items-center"
              >
                COMMUNITY
                <ChevronDown className={`ml-1 w-3 h-3 transform transition-transform ${communityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {communityDropdownOpen && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl px-4 py-3 min-w-[180px] shadow-xl z-50">
                  <Link href="/application">
                    <div className="text-sm font-space text-foreground hover:text-primary transition-colors whitespace-nowrap py-2 cursor-pointer">
                      Application
                    </div>
                  </Link>
                  <Link href="/instant-access">
                    <div className="text-sm font-space text-foreground hover:text-primary transition-colors whitespace-nowrap py-2 cursor-pointer">
                      Instant Access
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <button 
              onClick={handleCandyShopClick}
              className="text-sm font-space hover:text-accent transition-colors whitespace-nowrap relative"
            >
              THE CANDY SHOP DAO
            </button>
            <Link href="/governance">
              <button className="text-sm font-space hover:text-primary transition-colors whitespace-nowrap">
                GOVERNANCE
              </button>
            </Link>
            <Link href="/whats-at-stake">
              <button className="text-sm font-space hover:text-primary transition-colors whitespace-nowrap">
                WHAT'S AT STAKE?
              </button>
            </Link>
            <Link href="/news">
              <button className="text-sm font-space hover:text-primary transition-colors whitespace-nowrap">
                NEWS
              </button>
            </Link>
            <div className="relative">
              <button 
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className="text-sm font-space hover:text-primary transition-colors whitespace-nowrap flex items-center"
              >
                CONTACT US
                <ChevronDown className={`ml-1 w-3 h-3 transform transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {aboutDropdownOpen && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl px-4 py-3 min-w-[180px] shadow-xl z-50">
                  <button 
                    onClick={() => {
                      navigateToSection('about');
                      setAboutDropdownOpen(false);
                    }}
                    className="text-sm font-space text-foreground hover:text-primary transition-colors whitespace-nowrap py-2 cursor-pointer block w-full text-left"
                  >
                    About Us
                  </button>
                  <button 
                    onClick={() => {
                      navigateToSection('team');
                      setAboutDropdownOpen(false);
                    }}
                    className="text-sm font-space text-foreground hover:text-primary transition-colors whitespace-nowrap py-2 cursor-pointer block w-full text-left"
                  >
                    The Team
                  </button>
                  <button 
                    onClick={() => {
                      navigateToSection('contact');
                      setAboutDropdownOpen(false);
                    }}
                    className="text-sm font-space text-foreground hover:text-primary transition-colors whitespace-nowrap py-2 cursor-pointer block w-full text-left"
                  >
                    Contact Us
                  </button>
                  <button 
                    onClick={() => {
                      setIsContactModalOpen(true);
                      setAboutDropdownOpen(false);
                    }}
                    className="text-sm font-space text-foreground hover:text-primary transition-colors whitespace-nowrap py-2 cursor-pointer block w-full text-left"
                  >
                    Business Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <nav className={`mobile-nav fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-morphism' : 'glass-morphism'
      } rounded-full px-4 py-3`}>
        <div className="flex items-center justify-between w-full">
          {/* Mobile Logo */}
          <Link href="/" className="mobile-logo flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full">
                <img 
                  src="https://pbs.twimg.com/profile_images/1569262543469690880/LRIroCvJ_400x400.jpg"
                  alt="Nodeifi Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="font-space text-sm font-bold text-white md:inline hidden">NODEIFI</span>
            </div>
          </Link>
          
          <span className="font-space text-lg font-bold text-white md:hidden flex-1 text-center">Navigation</span>

          {/* Mobile Menu Button */}
          <UnifiedButton
            variant="secondary"
            size="sm"
            className="mobile-menu-btn p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={16} />
          </UnifiedButton>
        </div>
      </nav>

      {/* Epic Candy Burst Animation Overlay */}
      <AnimatePresence>
        {candyBurst && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Screen flash effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {candyPieces.map((candy) => (
              <motion.div
                key={candy.id}
                className="absolute flex items-center justify-center"
                style={{
                  fontSize: candy.size,
                  filter: `drop-shadow(0 0 ${candy.size/2}px ${candy.color}) drop-shadow(0 0 ${candy.size}px ${candy.color}60)`,
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{
                  x: Math.cos((candy.angle * Math.PI) / 180) * candy.distance,
                  y: Math.sin((candy.angle * Math.PI) / 180) * candy.distance + Math.sin(candy.angle) * 50,
                  scale: [0, 1.5, 1.2, 1, 0.8, 0],
                  rotate: 360 * candy.rotationSpeed,
                  opacity: [1, 1, 1, 0.8, 0.5, 0]
                }}
                transition={{
                  duration: 1.8, // Extended duration for smoother animation
                  delay: candy.delay,
                  ease: "easeOut"
                }}
              >
                {candy.emoji}
                {/* Candy glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${candy.color}40 0%, transparent 70%)`,
                    filter: 'blur(8px)'
                  }}
                  animate={{
                    scale: [1, 2, 1.5, 0],
                    opacity: [0.8, 0.4, 0.2, 0]
                  }}
                  transition={{
                    duration: 1.8, // Extended duration for glow effect
                    delay: candy.delay,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            ))}
            
            {/* Epic Central Explosion */}
            <motion.div
              className="absolute w-40 h-40 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(255,107,157,0.7) 20%, rgba(196,69,105,0.5) 40%, rgba(248,181,0,0.3) 70%, transparent 100%)',
                filter: 'blur(2px)'
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 0.5, 2, 3], opacity: [1, 0.9, 0.4, 0] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {/* Candy explosion shockwave */}
            <motion.div
              className="absolute w-20 h-20 border-4 border-yellow-300 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 8], opacity: [1, 0] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Enhanced Sparkle effects */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute text-xl"
                style={{
                  filter: 'drop-shadow(0 0 4px #FFD700)',
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                  rotate: 0
                }}
                animate={{
                  x: Math.cos((i * 24 * Math.PI) / 180) * (120 + Math.random() * 80),
                  y: Math.sin((i * 24 * Math.PI) / 180) * (120 + Math.random() * 80),
                  scale: [0, 1.5, 1, 0],
                  opacity: [1, 1, 0.8, 0],
                  rotate: 360 * 2
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.1 + Math.random() * 0.4,
                  ease: "easeOut"
                }}
              >
                ✨
              </motion.div>
            ))}

            {/* Extra candy confetti */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="absolute text-sm"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                  rotate: 0
                }}
                animate={{
                  x: (Math.random() - 0.5) * 800,
                  y: Math.random() * 600 - 200,
                  scale: [0, 1, 0.8, 0],
                  opacity: [1, 1, 0.6, 0],
                  rotate: Math.random() * 720
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.6,
                  ease: "easeOut"
                }}
              >
                🎉
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigateToSection={navigateToSection}
        onCandyShopClick={handleCandyShopClick}
      />

      {/* Contact Form Modal */}
      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
}