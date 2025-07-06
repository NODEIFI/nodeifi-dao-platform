import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import Footer from "@/components/footer";
import ParticleBackground from "@/components/particle-background";
import Navigation from "@/components/navigation";

const categories = ["All", "Partnerships", "Technology", "Education", "What's at Stake", "News"];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: blogData, isLoading } = useQuery({
    queryKey: ['/api/blog-posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog-posts');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      const data = await response.json();
      console.log('Blog API Response:', data);
      return data;
    }
  });

  const allBlogPosts = Array.isArray(blogData) ? blogData : [];
  
  const filteredBlogPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return allBlogPosts;
    }
    
    // Map category names to match the blog post categories
    const categoryMap: { [key: string]: string[] } = {
      "Partnerships": ["Partnerships", "Partnership"],
      "Technology": ["Technology", "Tech"],
      "Education": ["Education", "Tutorial"],
      "What's at Stake": ["Market Analysis", "What's at Stake"],
      "News": ["News", "Announcements"]
    };
    
    const searchTerms = categoryMap[selectedCategory] || [selectedCategory];
    return allBlogPosts.filter((post: any) => 
      searchTerms.some(term => 
        post.category?.toLowerCase().includes(term.toLowerCase()) ||
        post.title?.toLowerCase().includes(term.toLowerCase())
      )
    );
  }, [allBlogPosts, selectedCategory]);

  console.log('Filtered blog posts for rendering:', filteredBlogPosts);

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
            backgroundImage: "url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380')",
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
          
          <motion.h1 
            className="font-space text-6xl font-bold text-gradient mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Latest News & Updates
          </motion.h1>
          
          <motion.p 
            className="font-inter text-xl text-muted-foreground max-w-3xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Stay updated with the latest developments, partnerships, and insights from the Nodeifi ecosystem.
          </motion.p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-space font-medium transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'bg-primary text-background' 
                    : 'glass-morphism hover:bg-primary/20 text-muted-foreground hover:text-white'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <motion.div
                className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-muted-foreground">Loading latest news...</p>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!isLoading && (
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedCategory}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {filteredBlogPosts.map((post: any, index: number) => (
                  <motion.article
                    key={post.id}
                    className="glass-morphism rounded-2xl overflow-hidden hover-lift group cursor-pointer"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => window.open(post.link, '_blank')}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-primary text-background text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-3">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {post.author}
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                      
                      <h2 className="font-space text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center text-accent group-hover:text-primary transition-colors">
                        <span className="font-semibold text-sm mr-2">Read More</span>
                        <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          )}


        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&h=1287')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h3 
            className="font-space text-4xl font-bold text-gradient mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Stay in the Loop
          </motion.h3>
          
          <motion.p 
            className="font-inter text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Get the latest updates on partnerships, technology developments, and ecosystem news.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
            <button className="bg-primary hover:bg-primary/80 text-background font-semibold px-8 py-4 rounded-full transition-all duration-300">
              Subscribe
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}