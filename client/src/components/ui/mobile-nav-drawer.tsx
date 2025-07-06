import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, FileText, Headphones, Candy, Vote, Zap, Users, Server } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { UnifiedButton } from './unified-button';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  onCandyShopClick?: () => void;
}

const navItems = [
  { href: '#about', label: 'About Us', icon: FileText, action: 'scroll' },
  { href: '#contact', label: 'Contact Us', icon: FileText, action: 'scroll' },
  { href: '/services', label: 'Services', icon: Server, action: 'navigate' },
  { href: '/application', label: 'Application', icon: FileText, action: 'navigate' },
  { href: '/instant-access', label: 'Instant Access', icon: Zap, action: 'navigate' },
  { href: '/candy-shop', label: 'The Candy Shop DAO', icon: Candy, action: 'navigate' },
  { href: '/governance', label: 'Governance', icon: Vote, action: 'navigate' },
  { href: '/whats-at-stake', label: "What's at Stake?", icon: Headphones, action: 'navigate' },
  { href: '/news', label: 'News', icon: FileText, action: 'navigate' },
];

export function MobileNavDrawer({ isOpen, onClose, onNavigateToSection, onCandyShopClick }: MobileNavDrawerProps) {
  const [location] = useLocation();

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const drawerVariants = {
    hidden: { 
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    visible: { 
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-md border-l border-white/20 z-50 overflow-y-auto"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full">
                  <img 
                    src="https://pbs.twimg.com/profile_images/1569262543469690880/LRIroCvJ_400x400.jpg"
                    alt="Nodeifi Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="font-space text-lg font-bold text-white">NODEIFI</span>
              </div>
              <UnifiedButton
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </UnifiedButton>
            </div>

            {/* Navigation Items */}
            <nav className="p-6">
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location === item.href || 
                    (item.action === 'scroll' && location === '/' && item.href.startsWith('#'));
                  
                  const handleClick = () => {
                    if (item.action === 'scroll' && onNavigateToSection) {
                      const sectionId = item.href.replace('#', '');
                      onNavigateToSection(sectionId);
                    }
                    onClose();
                  };
                  
                  return (
                    <motion.div
                      key={item.href}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      {item.action === 'navigate' ? (
                        <Link href={item.href}>
                          <button
                            onClick={onClose}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                              isActive
                                ? 'bg-primary/20 border border-primary/50 text-primary'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </button>
                        </Link>
                      ) : (
                        <button
                          onClick={handleClick}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                            isActive
                              ? 'bg-primary/20 border border-primary/50 text-primary'
                              : 'text-gray-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>


            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}