import { motion } from "framer-motion";
import { useEffect } from "react";
import { ArrowLeft, CheckCircle, Users, Shield, Zap, Clock } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ParticleBackground from "@/components/particle-background";

// Dynamic Application Status Component
function ApplicationStatus({ isOpen = true }: { isOpen?: boolean }) {
  if (isOpen) {
    return (
      <motion.div 
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400/50 rounded-full mb-6 relative overflow-hidden"
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(34, 197, 94, 0.3)",
            "0 0 40px rgba(34, 197, 94, 0.6)",
            "0 0 20px rgba(34, 197, 94, 0.3)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
        <CheckCircle className="w-6 h-6 text-green-400 mr-3 relative z-10" />
        <span className="text-green-400 font-bold text-lg relative z-10">
          Applications are{" "}
          <span className="text-2xl font-black text-green-300 animate-pulse">
            OPEN
          </span>
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500/30 to-orange-500/30 border-2 border-red-400/50 rounded-full mb-6 relative overflow-hidden"
      animate={{ 
        boxShadow: [
          "0 0 20px rgba(239, 68, 68, 0.3)",
          "0 0 40px rgba(239, 68, 68, 0.6)",
          "0 0 20px rgba(239, 68, 68, 0.3)"
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 animate-pulse"></div>
      <Clock className="w-6 h-6 text-red-400 mr-3 relative z-10" />
      <span className="text-red-400 font-bold text-lg relative z-10">
        Applications are{" "}
        <span className="text-2xl font-black text-red-300 animate-pulse">
          CLOSED
        </span>
      </span>
    </motion.div>
  );
}

const benefits = [
  {
    icon: Users,
    title: "Private Group Access",
    description: "Unlock access to our exclusive private community"
  },
  {
    icon: Shield,
    title: "Alpha Hunters",
    description: "Surround yourself with experienced crypto investors"
  },
  {
    icon: Zap,
    title: "Pre-IDO Access",
    description: "Get access to pre-IDO token deals for new blockchain projects"
  },
  {
    icon: CheckCircle,
    title: "Node Ownership",
    description: "Own nodes or fractionalized pool shares across blockchain projects"
  }
];

export default function Application() {
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
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380')",
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
            <ApplicationStatus isOpen={true} />
            
            <h1 className="font-space text-6xl font-bold text-gradient mb-6">
              Join The Candy Shop
            </h1>
            
            <p className="font-inter text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Apply for membership to our Private Channel: The Candy Shop. 
              This is a limited application process to join our exclusive private community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Application Info Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-morphism rounded-3xl p-8 mb-8">
                <h2 className="font-space text-3xl font-bold mb-6 text-primary">Application Process</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    As of 1st of January 2025, our applications are OPEN. Applications are reviewed based on 
                    time stamps from when the application is submitted.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-white">No purchase is necessary</strong> and no private information will be requested.
                  </p>
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mt-6">
                    <p className="text-red-400 font-semibold text-center">
                      THERE IS NO PURCHASE NECESSARY! IF ANYONE ASKS FOR FUNDS, PRIVATE KEYS OR ASKS YOU TO CONNECT TO A SITE IGNORE THEM!!
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-morphism rounded-3xl p-8">
                <h3 className="font-space text-2xl font-bold mb-6 text-accent">What Can You Do With Nodeifi?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="bg-primary/20 p-2 rounded-lg mt-1">
                        <benefit.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="glass-morphism rounded-3xl p-12">
                <h3 className="font-space text-3xl font-bold mb-8 text-gradient">Ready to Apply?</h3>
                
                <div className="mb-8">
                  <img 
                    src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                    alt="Blockchain community illustration"
                    className="rounded-2xl mx-auto mb-6 opacity-80"
                  />
                </div>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  For more information about this process and to apply, complete the application form below.
                </p>

                <motion.a
                  href="https://forms.gle/mRGqw8A82aezJkd98"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-primary to-amber-500 text-background font-space font-semibold px-10 py-5 rounded-full hover-lift transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Complete Application Form
                </motion.a>

                <p className="text-sm text-muted-foreground mt-6">
                  If you do not want to wait for the application process, please visit our{" "}
                  <Link href="/instant-access">
                    <span className="text-accent hover:text-primary cursor-pointer underline">
                      instant access
                    </span>
                  </Link>{" "}
                  page.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}