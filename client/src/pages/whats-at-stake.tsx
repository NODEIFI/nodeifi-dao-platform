import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Play, Volume2, Share2, Calendar, Clock, ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";
import ParticleBackground from "@/components/particle-background";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { UnifiedButton } from "@/components/ui/unified-button";
import { UnifiedCard } from "@/components/ui/unified-card";

interface Episode {
  id: number;
  title: string;
  description: string;
  duration: string;
  publishedDate: string;
  audioUrl: string;
  episodeNumber: number;
  guests?: string[];
  topics: string[];
  artwork?: string;
}

// Podcast episodes data from authentic Spotify feed
const episodes: Episode[] = [
  {
    id: 1,
    title: "Pangea",
    description: "In this episode, we talk to James and Maxim, the founders of Pangea about their protocol. The Pangea protocol is about creating a robust, decentralized data layer that supports the next generation of blockchain applications by ensuring data is accessible, verifiable, and delivered with minimal latency.",
    duration: "52:27",
    publishedDate: "2025-01-21",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-11-Pangea-e2tprc4",
    episodeNumber: 11,
    guests: ["James", "Maxim"],
    topics: ["Blockchain Infrastructure", "Data Layer", "dApp Development"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_episode400/41508649/41508649-1737481343580-0c9155141a6c5.jpg"
  },
  {
    id: 2,
    title: "Hydro Online",
    description: "In this episode, we speak to the CEO from Hydro Online about their platform which is set to change the way sites can monetise engagement of their users.",
    duration: "29:05",
    publishedDate: "2025-01-21",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-10-Hydro-Online-e2tpqnn",
    episodeNumber: 10,
    topics: ["Monetisation", "User Engagement", "Platform Technology"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_episode400/41508649/41508649-1737480114304-52f5f24cec8b4.jpg"
  },
  {
    id: 3,
    title: "World Mobile Token",
    description: "Dive into how blockchain meets mobile tech to revolutionize internet access! Nodeifi and World Mobile Token's CEO, Micky Watkins, discuss creating global connectivity, turning the dream of universal internet into reality.",
    duration: "57:19",
    publishedDate: "2024-12-03",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-9-World-Mobile-Token-e2rqm8f",
    episodeNumber: 9,
    guests: ["Micky Watkins"],
    topics: ["Mobile Technology", "Internet Access", "Global Connectivity"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_episode400/41508649/41508649-1733228174581-d00e1d2502a59.jpg"
  },
  {
    id: 4,
    title: "Pacioli AI",
    description: "Explore the future of finance with Nodeifi and Pacioli AI, as they unravel how AI transforms blockchain for regulatory compliance and beyond.",
    duration: "48:56",
    publishedDate: "2024-12-03",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-8-Pacioli-AI-e2rqm64",
    episodeNumber: 8,
    topics: ["Artificial Intelligence", "Regulatory Compliance", "Finance"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_episode400/41508649/41508649-1733228062883-03eeb09fa390e.jpg"
  },
  {
    id: 5,
    title: "Nodeifi introduces our new platform",
    description: "In this episode, the Nodeifi team introduces our new platform for the DAO members in the Candy Shop, where you can login with your membership or project NFTs and claim tokens, participate in upcoming raises and vote on proposals.",
    duration: "52:00",
    publishedDate: "2024-10-07",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-7-Nodeifi-introduces-our-new-platform-e2pb41m",
    episodeNumber: 7,
    topics: ["DAO", "Platform", "NFTs", "Governance"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_nologo400/41508649/41508649-1719223833709-0b3e4e96cf1ce.jpg"
  },
  {
    id: 6,
    title: "MELD",
    description: "MELD is a non-custodial DeFi protocol for web3 finance, providing cross-chain lending, borrowing and staking on the MELD blockchain. We speak to Ken Blaue, the CEO of MELD, about all things DeFi and how MELD is revolutionising finance through the use of blockchain technology.",
    duration: "01:01:50",
    publishedDate: "2024-10-07",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-6-MELD-e2pb39r",
    episodeNumber: 6,
    guests: ["Ken Blaue"],
    topics: ["DeFi", "Cross-chain", "Lending", "Borrowing"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_episode400/41508649/41508649-1728301744467-90249ba6bc373.jpg"
  },
  {
    id: 7,
    title: "SUPRA",
    description: "We spoke to Joshua Tobkin and Jon Jones about their game changing SUPRA project. We dived into what makes Supra the most exciting new Layer 1 and how their vertical integration allows fast finality. We also discussed how dApps can build on their layer 1.",
    duration: "01:30:52",
    publishedDate: "2024-07-21",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-5-SUPRA-e2m98jb",
    episodeNumber: 5,
    guests: ["Joshua Tobkin", "Jon Jones"],
    topics: ["Layer 1", "Vertical Integration", "Fast Finality"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_episode400/41508649/41508649-1721565415758-ae88d0274bc1f.jpg"
  },
  {
    id: 8,
    title: "Redbelly Network",
    description: "We spoke to the Founder and CTO, Vincent Gramoli from Redbelly Network about the tokenisation of Real World Assets and how their protocol will change this area of the blockchain world.",
    duration: "01:01:03",
    publishedDate: "2024-07-21",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-4-Redbelly-Network-e2m95sm",
    episodeNumber: 4,
    guests: ["Vincent Gramoli"],
    topics: ["Real World Assets", "Tokenisation", "Protocol"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_episode400/41508649/41508649-1721556678490-fc36f27744da8.jpg"
  },
  {
    id: 9,
    title: "Cornucopias",
    description: "We interviewed Josh and Rob from Cornucopias, about their Web 3 game built on the blockchain. We discussed what's coming up for their project in the near future and infrastructure being used to support it.",
    duration: "01:08:45",
    publishedDate: "2024-06-24",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-3-Cornucopias-e2l8132",
    episodeNumber: 3,
    guests: ["Josh", "Rob"],
    topics: ["Web3 Gaming", "Blockchain Infrastructure", "Gaming"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_episode400/41508649/41508649-1719228794736-3ffdd2d647037.jpg"
  },
  {
    id: 10,
    title: "Multisynq",
    description: "In this episode, we explore Multisynq's technology which allows for the real time synchronisation of multiple users interacting in various applications from gaming to education and beyond. This is an exciting development which will change the way internet users are able to interact. They call it \"the missing protocol of the internet\".",
    duration: "57:14",
    publishedDate: "2024-06-24",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-2-Multisynq-e2l85s9",
    episodeNumber: 2,
    topics: ["Real-time Synchronisation", "Gaming", "Education", "Internet Protocol"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_episode400/41508649/41508649-1719229244446-ac087f6531a77.jpg"
  },
  {
    id: 11,
    title: "TEN",
    description: "We explore TEN's protocol and how they are solving the encryption problem needed in the Web3 space for gaming and other use cases.",
    duration: "58:49",
    publishedDate: "2024-06-24",
    audioUrl: "https://creators.spotify.com/pod/show/nodeifi/episodes/Episode-1-TEN-e2l8677",
    episodeNumber: 1,
    topics: ["Encryption", "Web3", "Gaming", "Privacy"],
    artwork: "https://d2a9bkgsuxmqe2.cloudfront.net/staging/podcast_uploaded_episode400/41508649/41508649-1719229959121-9fef7bfc2e5b8.jpg"
  }
];

export default function WhatsAtStake() {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(episodes[0]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
    // Scroll to the featured player section
    const featuredPlayer = document.getElementById('featured-player');
    if (featuredPlayer) {
      featuredPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };



  const handleShare = (episode: Episode) => {
    if (navigator.share) {
      navigator.share({
        title: `Nodeifi Podcast - ${episode.title}`,
        text: episode.description,
        url: episode.audioUrl
      });
    } else {
      navigator.clipboard.writeText(episode.audioUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <ParticleBackground />
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-32 pb-20 relative">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Navigation Back to Home */}
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
          
          <div className="text-center mb-16 relative">
            {/* Signal transmission lines */}
            <div className="absolute -top-8 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent transform rotate-12"></div>
            <div className="absolute -top-4 right-1/4 w-24 h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent transform -rotate-12"></div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6">
              What's at Stake
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Deep conversations about the blockchain ecosystem, infrastructure challenges, 
              and the future of decentralized networks.
            </p>
          </div>

          {/* Featured Episode Player */}
          <div id="featured-player" className="max-w-3xl mx-auto mb-16 relative">
            {/* Cosmic decorative elements */}
            <div className="absolute -top-8 -left-8 w-4 h-4 bg-primary/40 rounded-full animate-pulse"></div>
            <div className="absolute -top-4 left-16 w-2 h-2 bg-accent/60 rounded-full"></div>
            <div className="absolute -right-6 -top-6 w-3 h-3 bg-primary/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              {/* Audio wave background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M20,50 Q30,30 40,50 T60,50 T80,50" stroke="currentColor" strokeWidth="2" fill="none" className="animate-pulse" />
                  <path d="M25,50 Q35,25 45,50 T65,50 T85,50" stroke="currentColor" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '0.5s'}} />
                  <path d="M15,50 Q25,35 35,50 T55,50 T75,50" stroke="currentColor" strokeWidth="1" fill="none" className="animate-pulse" style={{animationDelay: '1s'}} />
                </svg>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 relative z-10">
                {/* Episode Art */}
                <div className="md:w-48 flex-shrink-0">
                  <div className="aspect-square rounded-xl overflow-hidden border border-white/10">
                    {selectedEpisode.artwork ? (
                      <img 
                        src={selectedEpisode.artwork} 
                        alt={`${selectedEpisode.title} artwork`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Volume2 className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="text-sm font-semibold">Nodeifi Podcast</h3>
                          <p className="text-xs text-muted-foreground">Episode {selectedEpisode.episodeNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Episode Info */}
                <div className="lg:w-2/3">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full mb-2">
                      Episode {selectedEpisode.episodeNumber}
                    </span>
                    <h2 className="text-2xl font-bold mb-2">{selectedEpisode.title}</h2>
                    <p className="text-muted-foreground mb-4">{selectedEpisode.description}</p>
                  </div>

                  {/* Episode Meta */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedEpisode.publishedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedEpisode.duration}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4 mb-6">
                    <a 
                      href={selectedEpisode.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#1DB954]/80 transition-colors font-medium"
                    >
                      <Play className="w-4 h-4" />
                      Listen on Spotify
                    </a>
                    
                    <button 
                      onClick={() => handleShare(selectedEpisode)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>

                  {/* Topics */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-2">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEpisode.topics.map((topic, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-md"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Episodes List */}
          <div className="max-w-4xl mx-auto relative">
            {/* Section decorative elements */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-4">
                <div className="w-1 h-8 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
                <div className="w-6 h-6 border-2 border-primary/40 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                </div>
                <div className="w-1 h-8 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1"></div>
              <h2 className="text-3xl font-bold relative">
                All Episodes
                {/* Podcast microphone icon */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-primary/40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 0 1 2 0z"/>
                    <path d="M12 18a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1z"/>
                  </svg>
                </div>
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1"></div>
            </div>
            
            <div className="space-y-4">
              {episodes.map((episode) => (
                <div 
                  key={episode.id}
                  className={`glass-card p-6 rounded-xl border transition-all cursor-pointer relative group ${
                    selectedEpisode.id === episode.id 
                      ? 'border-primary/50 bg-primary/5' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => handleEpisodeSelect(episode)}
                >
                  {/* Episode number badge with cosmic design */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {episode.episodeNumber}
                  </div>
                  
                  {/* Hover effect - audio waves */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-20 transition-opacity">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path d="M9 9h6v6H9z" fill="currentColor" className="animate-pulse"/>
                      <path d="M16 8v8M20 6v12M4 6v12M8 8v8" stroke="currentColor" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Episode Artwork */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                      {episode.artwork ? (
                        <img 
                          src={episode.artwork} 
                          alt={`${episode.title} artwork`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Volume2 className="w-6 h-6 text-primary/60" />
                        </div>
                      )}
                    </div>

                    <a 
                      href={episode.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 bg-[#1DB954] text-white hover:bg-[#1DB954]/80"
                    >
                      <Play className="w-4 h-4 ml-0.5" />
                    </a>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-primary">Episode {episode.episodeNumber}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{episode.duration}</span>
                      </div>
                      <h3 className="font-semibold mb-1 truncate">{episode.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{episode.description}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {new Date(episode.publishedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscribe Section */}
          <div className="max-w-4xl mx-auto mt-16 relative">
            {/* Cosmic background elements */}
            <div className="absolute inset-0 -m-8">
              <div className="absolute top-0 left-1/4 w-1 h-16 bg-gradient-to-b from-primary/30 to-transparent"></div>
              <div className="absolute bottom-0 right-1/4 w-1 h-16 bg-gradient-to-t from-accent/30 to-transparent"></div>
              <div className="absolute top-1/2 left-0 w-16 h-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
              <div className="absolute top-1/2 right-0 w-16 h-1 bg-gradient-to-l from-accent/20 to-transparent"></div>
            </div>
            
            <div className="glass-card p-8 rounded-2xl border border-white/10 text-center relative">
              {/* Podcast satellite dish decoration */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 border-2 border-primary/30 rounded-full bg-primary/5 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 mt-4">Subscribe to What's at Stake</h3>
              <p className="text-muted-foreground mb-6">
                Stay updated with our latest episodes and insights into the blockchain ecosystem.
              </p>
              
              {/* Platform buttons with space theme */}
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://creators.spotify.com/pod/profile/nodeifi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#1DB954]/80 transition-all font-medium relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative">Listen on Spotify</span>
                </a>
                <button className="group px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all font-medium relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative">Apple Podcasts</span>
                </button>
                <button className="group px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all font-medium relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative">Google Podcasts</span>
                </button>
              </div>
              
              {/* Floating particles around subscribe section */}
              <div className="absolute -bottom-4 left-8 w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="absolute -top-2 right-16 w-1 h-1 bg-accent/60 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-8 right-8 w-3 h-3 bg-primary/30 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}