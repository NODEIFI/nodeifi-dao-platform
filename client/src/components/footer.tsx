import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative z-10 py-16 bg-background border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.div 
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-full mr-4 relative overflow-hidden">
            <img 
              src="https://pbs.twimg.com/profile_images/1569262543469690880/LRIroCvJ_400x400.jpg"
              alt="Nodeifi Logo"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
          </div>
          <h3 className="font-orbitron text-2xl font-bold text-white">
            <span className="text-slate-300">NODE</span>
            <span className="text-primary">IFI</span>
          </h3>
        </motion.div>
        
        <motion.p 
          className="text-white text-lg mb-8 font-medium"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          We know what's at stake
        </motion.p>
        
        <motion.p 
          className="text-sm text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          © 2024 Nodeifi. Pioneering the future of blockchain infrastructure.
        </motion.p>
      </div>
    </footer>
  );
}
