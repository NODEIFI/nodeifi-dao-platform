import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ParticleBackground from "@/components/particle-background";
import Navigation from "@/components/navigation";
import { UnifiedButton } from "@/components/ui/unified-button";
import { GoogleAuth } from "@/components/google-auth";
import Footer from "@/components/footer";

export default function CandyShop() {
  const [user, setUser] = useState<any>(null);
  const [showAuthHelper, setShowAuthHelper] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user is already authenticated
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      if (data.authenticated) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthHelper(false);
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication error:', error);
    setShowAuthHelper(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <ParticleBackground />
      
      {/* Overlaid Back Button */}
      <motion.div
        className="absolute top-8 left-8 z-50"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link href="/">
          <button className="flex items-center text-muted-foreground hover:text-primary transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </Link>
      </motion.div>

      {/* Full Screen Embedded Content with Auth Handler */}
      <div className="relative z-10 h-screen">
        <iframe
          src="https://candyshop.nodeifi.io/"
          className="w-full h-full border-0"
          title="The Candy Shop DAO"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
        
        {/* Auth Helper Overlay - shows when needed */}
        {showAuthHelper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md p-8 bg-card rounded-xl border border-border shadow-xl"
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-6">
                Authenticate with Google to access The Candy Shop DAO features. This opens a secure popup window that avoids iframe restrictions.
              </p>
              <GoogleAuth
                onSuccess={handleAuthSuccess}
                onError={handleAuthError}
                buttonText="Authenticate with Google"
                className="w-full mb-4 bg-gradient-to-r from-primary to-accent"
              />
              <button
                onClick={() => setShowAuthHelper(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue browsing
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Manual Auth Trigger for Testing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 right-8 z-40"
      >
        <UnifiedButton
          onClick={() => setShowAuthHelper(true)}
          className="bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary text-xs px-4 py-2"
        >
          Need to Login?
        </UnifiedButton>
      </motion.div>
      
      <Footer />
    </div>
  );
}