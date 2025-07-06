import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Users, Shield, Zap, Target, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { UnifiedCard } from '@/components/ui/unified-card';

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

const tableOfContents: TableOfContentsItem[] = [
  { id: 'introduction', title: 'Introduction', level: 1 },
  { id: 'nodeifi-overview', title: 'NODEIFI: A Brief Overview', level: 1 },
  { id: 'velocity-foundation', title: 'The Velocity Foundation: Custodian of Our Vision', level: 1 },
  { id: 'introducing-nodeifi-dao', title: 'Introducing NODEIFI DAO', level: 1 },
  { id: 'candyshop-dao', title: 'CandyShop DAO: Empowering the Community', level: 1 },
  { id: 'project-sub-daos', title: 'Project Sub-DAOs: Expanding Decentralized Governance', level: 1 },
];

export default function JourneyToDecentralization() {
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="relative pt-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative px-6 py-16 bg-gradient-to-br from-background via-background/95 to-primary/5"
        >
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link href="/governance">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/70 transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Governance</span>
                </div>
              </Link>
            </motion.div>

            {/* Title */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center mb-6"
              >
                <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/30">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold bg-gradient-to-r from-white via-accent to-primary bg-clip-text text-transparent font-space tracking-wide"
              >
                Announcing the Velocity Foundation DAO
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-300 font-light max-w-3xl mx-auto"
              >
                Our Path to Decentralized Governance
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24">
                <UnifiedCard className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-1">
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          activeSection === item.id
                            ? 'bg-primary/20 text-primary border-l-2 border-primary'
                            : 'text-gray-400 hover:text-foreground hover:bg-card/50'
                        } ${item.level === 2 ? 'ml-4 text-sm' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          {item.level === 2 && <ChevronRight className="w-3 h-3" />}
                          {item.title}
                        </div>
                      </button>
                    ))}
                  </nav>
                </UnifiedCard>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3"
            >
              <div className="prose prose-lg prose-invert max-w-none">
                {/* Introduction */}
                <section id="introduction" className="mb-16">
                  <UnifiedCard className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <Globe className="w-8 h-8 text-primary" />
                      Introduction
                    </h2>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>
                        At NODEIFI, we are thrilled to unveil our comprehensive roadmap for transitioning to a 
                        decentralized governance model. This journey marks a significant milestone in our commitment 
                        to fostering community involvement and ensuring that our operations align with the 
                        decentralized ethos at the core of the crypto industry.
                      </p>
                    </div>
                  </UnifiedCard>
                </section>

                {/* NODEIFI Overview */}
                <section id="nodeifi-overview" className="mb-16">
                  <UnifiedCard className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <Target className="w-8 h-8 text-accent" />
                      NODEIFI: A Brief Overview
                    </h2>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>
                        NODEIFI has always been driven by a team of passionate and experienced professionals 
                        dedicated to supporting and advancing the crypto industry. Since our inception, we have actively 
                        contributed to numerous projects, promoting decentralization and driving industry growth. Our 
                        latest step is to embrace a decentralized governance structure through the establishment of the 
                        Velocity Foundation DAO.
                      </p>
                    </div>
                  </UnifiedCard>
                </section>

                {/* Velocity Foundation */}
                <section id="velocity-foundation" className="mb-16">
                  <UnifiedCard className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <Users className="w-8 h-8 text-purple-400" />
                      The Velocity Foundation: Custodian of Our Vision
                    </h2>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>
                        The Velocity Foundation, incorporated in the Cayman Islands, will hold custody of project funds 
                        as a non-profit organization and will manage the coordination and development of the DAO, 
                        ensuring a smooth transition towards a fully decentralized organization. The Foundation will 
                        serve as the bedrock for our governance framework, supporting the NODEIFI and CandyShop 
                        DAOs in their respective roles.
                      </p>
                    </div>
                  </UnifiedCard>
                </section>

                {/* Introducing NODEIFI DAO */}
                <section id="introducing-nodeifi-dao" className="mb-16">
                  <UnifiedCard className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <Zap className="w-8 h-8 text-yellow-400" />
                      Introducing NODEIFI DAO
                    </h2>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>
                        The NODEIFI DAO will be the primary body governing the Velocity Foundation. Initially, 
                        members will be selected through an application process, with plans for transition to a 
                        token-based membership model. The NODEIFI DAO will have the authority to make key 
                        operational decisions, manage day-to-day node operations, and oversee the broader strategic 
                        direction of our business.
                      </p>
                    </div>
                  </UnifiedCard>
                </section>

                {/* CandyShop DAO */}
                <section id="candyshop-dao" className="mb-16">
                  <UnifiedCard className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <Users className="w-8 h-8 text-green-400" />
                      CandyShop DAO: Empowering the Community
                    </h2>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>
                        The CandyShop DAO will function as a sub-DAO under the Velocity Foundation, focused on 
                        decisions impacting the CandyShop operations. Community members will participate in 
                        governance through ownership of Candy tokens, representing a percentage of value of NFTs 
                        held. This structure ensures that our vibrant community can propose and vote on initiatives 
                        specific to the CandyShop, fostering a sense of ownership and active participation.
                      </p>
                    </div>
                  </UnifiedCard>
                </section>

                {/* Project Sub-DAOs */}
                <section id="project-sub-daos" className="mb-16">
                  <UnifiedCard className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <Shield className="w-8 h-8 text-blue-400" />
                      Project Sub-DAOs: Expanding Decentralized Governance
                    </h2>
                    <div className="text-gray-300 space-y-4 leading-relaxed">
                      <p>
                        To further decentralize governance and create specialized decision-making bodies, NODEIFI 
                        will introduce Project Sub-DAOs. These Sub-DAOs will oversee specific initiatives under the 
                        guidance of their parent DAO, allowing for focused decision-making on specialized projects 
                        while maintaining the overall structure under the Velocity Foundation.
                      </p>
                    </div>
                  </UnifiedCard>
                </section>

                {/* Call to Action */}
                <section className="mb-16">
                  <UnifiedCard className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold text-foreground">Ready to Participate?</h3>
                      <p className="text-gray-300">
                        Join our governance discussions and help shape the future of our DAO
                      </p>
                      <Link href="/governance">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-colors cursor-pointer">
                          View Active Proposals
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </Link>
                    </div>
                  </UnifiedCard>
                </section>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}