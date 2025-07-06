import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const projects = [
  { name: "POKT", color: "text-primary bg-primary/20" },
  { name: "WMT", color: "text-accent bg-accent/20" },
  { name: "SUPRA", color: "text-purple-400 bg-purple-400/20" },
  { name: "Entangle", color: "text-green-400 bg-green-400/20" },
  { name: "Gunzilla", color: "text-amber-400 bg-amber-400/20" },
  { name: "Myria", color: "text-cyan-400 bg-cyan-400/20" },
  { name: "Chirp", color: "text-pink-400 bg-pink-400/20" },
  { name: "Massa", color: "text-red-400 bg-red-400/20" },
  { name: "Prasaga", color: "text-indigo-400 bg-indigo-400/20" }
];

interface AboutSectionProps {
  onGetInTouchClick?: () => void;
}

export default function AboutSection({ onGetInTouchClick }: AboutSectionProps) {

  return (
    <section id="about" className="py-32 relative">
      {/* Abstract technological cosmos background */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&h=1287')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-space text-5xl font-bold text-gradient mb-6">ABOUT NODEIFI</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-morphism rounded-3xl p-8 mb-8">
              <h3 className="font-space text-2xl font-bold mb-6 text-primary">Our Mission</h3>
              <p className="font-inter text-lg text-muted-foreground leading-relaxed mb-6">
                Nodeifi is a team of experienced professionals with a shared passion for the crypto industry. 
                Some of us have been invested and involved since 2013, and we wanted to do more than just invest or trade.
              </p>
              <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                We wanted to actively support and contribute to the industry, which is why we started offering 
                services that help new and existing projects. Our goal is to promote decentralization and 
                further the growth of the crypto industry.
              </p>
            </div>

            <div className="glass-morphism rounded-3xl p-8">
              <h3 className="font-space text-2xl font-bold mb-6 text-accent">Our Community</h3>
              <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                At Nodeifi, we're not just a team – we're a thriving DAO community of investors and backers 
                united in our mission to revolutionize the crypto landscape. With deep-rooted experience dating 
                back to 2013, we've been at the forefront of blockchain technology, working tirelessly to promote 
                decentralization and drive industry growth.
              </p>
              
              <motion.button 
                onClick={onGetInTouchClick}
                className="mt-6 inline-flex items-center bg-primary hover:bg-primary/80 text-background px-6 py-3 rounded-full font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Blockchain nodes network visualization */}
            <div className="relative mb-8">
              <img 
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Blockchain nodes network with interconnected glowing points"
                className="rounded-3xl shadow-2xl w-full h-auto opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl"></div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
