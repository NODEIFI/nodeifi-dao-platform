import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import ottoImage from "@assets/photo_2025-05-28 23.53.52.jpeg";

const teamMembers = [
  {
    name: "Candy Man",
    role: "Team Lead",
    description: "Acts as the primary leader of the DAO, ensuring alignment with its vision and strategic goals.",
    twitter: "https://x.com/time2node",
    image: "https://pbs.twimg.com/profile_images/1896500056855019520/4yGryWaj_400x400.jpg",
    gradient: "from-primary to-amber-600"
  },
  {
    name: "Nixinzim", 
    role: "Community & Operations Lead",
    description: "Manages all CandyShop DAO members, including proposal submissions and community interactions.",
    twitter: "https://x.com/nixnodeifi",
    image: "https://pbs.twimg.com/profile_images/1902335747820032000/pqvVQ41E_400x400.jpg",
    gradient: "from-accent to-cyan-600"
  },
  {
    name: "OTTO",
    role: "Technical Lead",
    description: "Oversees all technical operations, including node infrastructure, platform development, and integrations.",
    twitter: "https://x.com/ottomakan", 
    image: ottoImage,
    gradient: "from-green-600 to-teal-600"
  },
  {
    name: "BuySell",
    role: "Governance & Finance Lead", 
    description: "Oversees treasury operations, including fund allocation and management. Improve governance processes.",
    twitter: "https://x.com/SupraNodes",
    image: "https://pbs.twimg.com/profile_images/1791833590126542848/4XJ7kQWz_400x400.jpg",
    gradient: "from-purple-600 to-pink-600"
  },
  {
    name: "Alpha",
    role: "Partnerships & Growth Lead",
    description: "Identifies and secures strategic partnerships to grow the DAO's ecosystem and resources.", 
    twitter: "https://x.com/alphanomicon",
    image: "https://pbs.twimg.com/profile_images/1673052135578288128/dTTIf55B_400x400.jpg",
    gradient: "from-amber-600 to-red-600"
  }
];

export default function TeamSection() {
  return (
    <section id="team" className="py-32 relative">
      {/* Futuristic space station interior background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-space text-5xl font-bold text-gradient mb-6">MEET THE TEAM</h2>
          <p className="font-inter text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Nodeifi is a team of experienced professionals with a shared passion for the crypto industry. 
            Some of us have been invested and involved since 2013, and we wanted to do more than just invest or trade.
          </p>
        </motion.div>

        {/* First row - 4 members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {teamMembers.slice(0, 4).map((member, index) => (
            <motion.div
              key={member.name}
              className="glass-morphism rounded-3xl p-8 hover-lift group text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Profile image */}
              <div className="relative mb-4">
                <div className={`w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br ${member.gradient} p-1`}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src={member.image}
                      alt={`Professional portrait of ${member.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image for ${member.name}:`, member.image);
                        console.error('Image error:', e);
                      }}
                      onLoad={() => {
                        console.log(`Successfully loaded image for ${member.name}:`, member.image);
                      }}
                    />
                  </div>
                </div>
                <div className={`absolute ${member.role.length > 15 ? '-bottom-4' : '-bottom-2'} left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary/90 to-accent/90 px-3 py-1.5 rounded-full border border-primary/30 shadow-lg max-w-[140px]`}>
                  <span className={`${member.role.length > 15 ? 'text-[10px]' : 'text-xs'} font-bold text-white tracking-wide text-center block leading-tight`}>
                    {member.role}
                  </span>
                </div>
              </div>
              
              <h3 className="font-space text-2xl font-bold mb-2">
                {member.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {member.description}
              </p>
              
              <a 
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-accent hover:text-white transition-colors group"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-sm">
                  @{member.twitter.split('/').pop()}
                </span>
                <ExternalLink className="w-3 h-3 ml-1 group-hover:scale-110 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Second row - centered 5th member */}
        {teamMembers.length > 4 && (
          <div className="flex justify-center">
            <motion.div
              key={teamMembers[4].name}
              className="glass-morphism rounded-3xl p-8 hover-lift group text-center max-w-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Profile image */}
              <div className="relative mb-4">
                <div className={`w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br ${teamMembers[4].gradient} p-1`}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src={teamMembers[4].image}
                      alt={`Professional portrait of ${teamMembers[4].name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image for ${teamMembers[4].name}:`, teamMembers[4].image);
                        console.error('Image error:', e);
                      }}
                      onLoad={() => {
                        console.log(`Successfully loaded image for ${teamMembers[4].name}:`, teamMembers[4].image);
                      }}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary/90 to-accent/90 px-3 py-1.5 rounded-full border border-primary/30 shadow-lg max-w-[140px]">
                  <span className="text-xs font-bold text-white tracking-wide text-center block leading-tight">
                    {teamMembers[4].role}
                  </span>
                </div>
              </div>
              
              <h3 className="font-space text-2xl font-bold mb-2">
                {teamMembers[4].name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {teamMembers[4].description}
              </p>
              
              <a 
                href={teamMembers[4].twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-accent hover:text-white transition-colors group"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-sm">
                  @{teamMembers[4].twitter.split('/').pop()}
                </span>
                <ExternalLink className="w-3 h-3 ml-1 group-hover:scale-110 transition-transform" />
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
