import { motion } from "framer-motion";
import { useEffect } from "react";
import { ShoppingCart, Wallet, Users, ArrowRight, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/footer";
import ParticleBackground from "@/components/particle-background";
import Navigation from "@/components/navigation";

const steps = [
  {
    step: 1,
    title: "Check Terms of Use",
    description: "Make sure you are familiar with our terms of use"
  },
  {
    step: 2,
    title: "Visit OpenSea",
    description: "Visit our official OpenSea page and check out our collection"
  },
  {
    step: 3,
    title: "Purchase NFT",
    description: "Purchase your Nodeifi NFT"
  },
  {
    step: 4,
    title: "Connect Wallet",
    description: "Head over to Collab Land and connect your wallet"
  },
  {
    step: 5,
    title: "Follow Instructions",
    description: "Follow the bot instructions and join our channel"
  }
];

export default function InstantAccess() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <ParticleBackground />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 cosmic-gradient"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            className="flex items-center mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/">
              <button className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-space text-6xl font-bold text-gradient mb-6">
              We'd love you to join our community!
            </h1>
            
            <h2 className="font-space text-3xl font-semibold text-primary mb-6">
              Let's get started!
            </h2>
            
            <p className="font-inter text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Get instant access to The Candy Shop by purchasing a Nodeifi NFT and connecting your wallet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* NFT Showcase Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-space text-4xl font-bold text-gradient mb-8">
              Nodeifi Membership NFT
            </h3>
            <div className="glass-morphism rounded-3xl p-12 max-w-2xl mx-auto">
              <img 
                src="https://i2.seadn.io/ethereum/0xb02571635cb767f51f5d606a63c21250ab218a68/d35b0fa2cbd85b6b845c25b30c93482e.gif?w=350"
                alt="Nodeifi Membership NFT"
                className="rounded-2xl mx-auto mb-8 max-w-sm w-full hover-lift"
              />
              <p className="text-xl text-muted-foreground mb-8">
                Own this exclusive NFT to gain instant access to The Candy Shop community
              </p>
              <motion.a
                href="https://opensea.io/collection/nodeifi"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-primary to-amber-500 text-background font-space font-semibold px-10 py-5 rounded-full hover-lift transition-all duration-300 inline-flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                View on OpenSea
                <ExternalLink className="w-4 h-4 ml-2" />
              </motion.a>
            </div>
          </motion.div>

          {/* Detailed Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-morphism rounded-3xl p-8">
                <h3 className="font-space text-2xl font-bold mb-6 text-primary">Getting Started</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-muted-foreground">
                        Make sure you are familiar with our{" "}
                        <a href="https://www.nodeifi.io/manifesto" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary underline">
                          Terms of use
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-muted-foreground">
                        Visit our official{" "}
                        <a href="https://opensea.io/collection/nodeifi/overview" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary underline">
                          OpenSea page
                        </a>{" "}
                        and check out{" "}
                        <a href="https://opensea.io/collection/nodeifi" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary underline">
                          our collection
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Purchase your Nodeifi NFT</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Once you own a Nodeifi Membership NFT</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-muted-foreground">
                        Head over to{" "}
                        <a href="https://telegram.me/collablandbot?start=VFBDI1RFTCNDT01NIy0xMDAyMTE1MjUyODcx" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary underline">
                          Collab Land
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-morphism rounded-3xl p-8 mb-8">
                <h3 className="font-space text-2xl font-bold mb-6 text-accent">Connection Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Press "Start" or type /start</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Follow the bot instructions and press "Connect"</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">A new website link will pop-up</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Connect and link your wallet</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Follow the instructions</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">When your wallet is successfully linked you'll be shown confirmation</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Return to Telegram to join our channel</p>
                  </div>
                </div>
              </div>

              <div className="glass-morphism rounded-3xl p-8">
                <h3 className="font-space text-2xl font-bold mb-6 text-amber-400">Important Notes</h3>
                <div className="space-y-4">
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-400 font-semibold">
                      Note! If you transfer or sell your NFT, you will automatically lose access to the group. 
                      In order to restore your access, you will have to repeat the steps above!
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground">
                    If you would like to apply for free membership please see{" "}
                    <Link href="/application">
                      <span className="text-accent hover:text-primary cursor-pointer underline">here</span>
                    </Link>
                    . Be aware there is no guarantee of admission with the application process and times to respond can vary.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glass-morphism rounded-3xl p-12 max-w-4xl mx-auto">
              <h3 className="font-space text-3xl font-bold mb-6 text-gradient">Welcome aboard!</h3>
              <p className="text-xl text-muted-foreground mb-8">
                Introduce yourself and get ready for the sweet opportunities in The Candy Shop.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.a
                  href="https://opensea.io/collection/nodeifi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-primary to-amber-500 text-background font-space font-semibold px-10 py-5 rounded-full hover-lift transition-all duration-300 inline-flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Visit OpenSea Collection
                  <ExternalLink className="w-4 h-4 ml-2" />
                </motion.a>
                
                <motion.a
                  href="https://t.me/nixinzim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-morphism border-accent text-accent font-space font-semibold px-10 py-5 rounded-full hover-lift transition-all duration-300 inline-flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Support
                  <ExternalLink className="w-4 h-4 ml-2" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}