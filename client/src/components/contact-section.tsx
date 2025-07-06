import { motion } from "framer-motion";
import { ExternalLink, MessageCircle, Users, Mail } from "lucide-react";

// Custom X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Custom Telegram Icon Component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.789l3.01-14.2c.309-1.239-.473-1.8-1.282-1.434z"/>
  </svg>
);

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "hello@nodeifi.io",
    href: "mailto:hello@nodeifi.io",
    bgColor: "bg-primary"
  },
  {
    icon: XIcon,
    title: "X", 
    description: "@nodeifi",
    href: "https://x.com/nodeifi",
    bgColor: "bg-black"
  },
  {
    icon: TelegramIcon,
    title: "Telegram",
    description: "Nodeifi Community",
    href: "https://t.me/Nodeifi",
    bgColor: "bg-blue-500"
  }
];

const additionalLinks = [
  {
    title: "Community",
    links: [
      { name: "X (Twitter)", href: "https://x.com/nodeifi" },
      { name: "Telegram", href: "https://t.me/Nodeifi" }
    ],
    color: "text-primary"
  },
  {
    title: "Resources", 
    links: [
      { name: "Documentation", href: "#" },
      { name: "Blog", href: "#" }
    ],
    color: "text-accent"
  },
  {
    title: "What's at Stake",
    links: [
      { name: "Staking Info", href: "#" },
      { name: "Rewards", href: "#" }
    ],
    color: "text-purple-400"
  },
  {
    title: "News",
    links: [
      { name: "Latest Updates", href: "#" },
      { name: "Announcements", href: "#" }
    ],
    color: "text-amber-400"
  }
];

interface ContactSectionProps {
  onGetInTouchClick?: () => void;
}

export default function ContactSection({ onGetInTouchClick }: ContactSectionProps) {
  return (
    <section id="contact" className="py-32 relative">
      {/* Space exploration mission control background */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.h2 
          className="font-space text-5xl font-bold text-gradient mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Ready to Launch?
        </motion.h2>
        
        <motion.p 
          className="font-inter text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Partner with us to explore the infinite possibilities of blockchain technology. 
          Let's build the decentralized future together.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="glass-morphism rounded-2xl p-6 hover-lift group block relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Galaxy background effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-accent/10 to-transparent animate-pulse"></div>
                <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
                <div className="absolute top-8 right-4 w-0.5 h-0.5 bg-primary rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-6 left-6 w-0.5 h-0.5 bg-accent rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-3 right-8 w-1 h-1 bg-white/60 rounded-full animate-twinkle" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute top-12 left-12 w-0.5 h-0.5 bg-primary/80 rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
              </div>
              
              <div className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-${method.bgColor}/50 transition-all duration-300 relative z-10`}>
                <method.icon className="w-8 h-8 text-white group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold mb-2 relative z-10 group-hover:text-primary transition-colors">{method.title}</h3>
              <p className="text-muted-foreground text-sm relative z-10 group-hover:text-foreground transition-colors">{method.description}</p>
            </motion.a>
          ))}
        </div>
        
        <div className="flex justify-center mb-16">
          <motion.button
            onClick={onGetInTouchClick}
            className="bg-gradient-to-r from-primary to-amber-500 text-background font-space font-semibold px-10 py-5 rounded-full hover-lift transition-all duration-300 inline-flex items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            Get in Touch
          </motion.button>
        </div>


      </div>
    </section>
  );
}
