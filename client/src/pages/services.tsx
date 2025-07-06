import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Server, Shield, TrendingUp, Users, Zap, Eye, Mail } from 'lucide-react';
import { SiX, SiTelegram } from 'react-icons/si';
import { Link } from 'wouter';
import { UnifiedButton } from '@/components/ui/unified-button';
import { UnifiedCard } from '@/components/ui/unified-card';
import { ContactFormModal } from '@/components/ui/contact-form-modal';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export default function Services() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Scroll to top when component mounts - enhanced version
  useEffect(() => {
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    
    // Additional scroll to top after a brief delay to ensure it works
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      icon: <Server className="w-8 h-8 text-accent" />,
      title: "Seamless NaaS",
      description: "Effortlessly deploy and manage nodes-as-a-service across top blockchains with our fully managed or hybrid hosting options."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Scalable Infrastructure", 
      description: "From cloud to on-premises, we optimize performance for dApps, exchanges, and enterprise applications through expert infrastructure management."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Expert Advisory",
      description: "Leverage our deep industry knowledge for strategic consulting and venture capital advisory."
    },
    {
      icon: <Eye className="w-8 h-8 text-accent" />,
      title: "Real-Time Insights",
      description: "Track nodes and validators with ease using our intuitive, real-time dashboards."
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Security & Reliability",
      description: "Our SOC-compliant infrastructure ensures your assets and data are protected with our co-location solutions."
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Cosmic background matching the site theme */}
      <div className="absolute inset-0 cosmic-gradient"></div>
      <div 
        className="absolute inset-0 opacity-20"
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

      <Navigation />
      
      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            {/* Back to Home button matching site theme */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start mb-8"
            >
              <Link href="/">
                <UnifiedButton variant="secondary" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </UnifiedButton>
              </Link>
            </motion.div>
            
            {/* Page Title */}
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold bg-gradient-to-r from-white via-accent to-primary bg-clip-text text-transparent font-space tracking-wide mb-6"
              >
                Our Services
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-8"
              >
                Unlock the Power of Blockchain with Nodeifi
              </motion.h2>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 shadow-lg">
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed mb-6">
                    At Nodeifi, we empower businesses and investors to thrive in the Web3 ecosystem with our comprehensive suite of services, including Nodes-as-a-Service (NaaS), infrastructure management, consulting, venture capital advisory, and co-location solutions. We provide the tools and expertise to simplify your blockchain journey. Our hands-off, white-glove approach ensures your nodes run optimally, so you can focus on innovation and growth.
                  </p>
                  
                  <p className="text-gray-300 leading-relaxed">
                    Whether you're an individual investor seeking passive income through staking or a project needing scalable, secure infrastructure, Nodeifi delivers tailored solutions. Monitor your portfolio in real-time with our custom dashboards, and trust our experienced team to handle the technical complexities—setup, maintenance, and security included.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Nodeifi Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-white text-center mb-12">
              Why Choose Nodeifi?
            </h3>
            
            {/* Top row with first 4 services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {services.slice(0, 4).map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="relative group h-full">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        {service.icon}
                        <h4 className="text-xl font-semibold text-white ml-3">
                          {service.title}
                        </h4>
                      </div>
                      <p className="text-gray-300 leading-relaxed flex-grow">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Bottom row with centered fifth service */}
            {services.length > 4 && (
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + 4 * 0.1 }}
                  >
                    <div className="relative group h-full">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                      <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="flex items-center mb-4">
                          {services[4].icon}
                          <h4 className="text-xl font-semibold text-white ml-3">
                            {services[4].title}
                          </h4>
                        </div>
                        <p className="text-gray-300 leading-relaxed flex-grow">
                          {services[4].description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent via-primary to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to elevate your blockchain strategy?
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6 max-w-3xl mx-auto">
                  Contact us today for a personal consultation. We'll work closely with you to understand your unique needs and craft a comprehensive plan to maximize your success in the decentralized world.
                </p>
                <UnifiedButton
                  variant="primary"
                  size="lg"
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-gradient-to-r from-primary to-amber-500 text-background font-space font-semibold hover-lift transition-all duration-300 mb-12"
                  style={{ 
                    animation: 'glow-pulse 2s infinite'
                  }}
                >
                  Get Started Today
                </UnifiedButton>
                
                {/* Contact Links Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                    <a
                      href="mailto:hello@nodeifi.io"
                      className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 block text-center"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">Email</h4>
                      <p className="text-gray-300 text-sm">hello@nodeifi.io</p>
                    </a>
                  </motion.div>

                  {/* X (Twitter) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 to-black rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                    <a
                      href="https://x.com/nodeifi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 block text-center"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                          <SiX className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">X</h4>
                      <p className="text-gray-300 text-sm">@nodeifi</p>
                    </a>
                  </motion.div>

                  {/* Telegram */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                    <a
                      href="https://t.me/nodeifi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 block text-center"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <SiTelegram className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">Telegram</h4>
                      <p className="text-gray-300 text-sm">Nodeifi Community</p>
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      
      {/* Sticky Contact Button */}
      <button
        onClick={() => setIsContactModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary to-amber-500 text-background font-space font-semibold px-4 py-3 rounded-full hover-lift transition-all duration-300"
        style={{ 
          animation: 'glow-pulse 2s infinite'
        }}
      >
        Contact Us
      </button>

      {/* Contact Form Modal */}
      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
}