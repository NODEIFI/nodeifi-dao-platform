import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import PortfolioSection from "@/components/portfolio-section";
import TeamSection from "@/components/team-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ParticleBackground from "@/components/particle-background";
import { ContactFormModal } from "@/components/ui/contact-form-modal";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <ParticleBackground />
      <Navigation />
      <HeroSection />
      <PortfolioSection />
      <TeamSection />
      <AboutSection onGetInTouchClick={() => setIsContactModalOpen(true)} />
      <ContactSection onGetInTouchClick={() => setIsContactModalOpen(true)} />
      <Footer />
      
      {/* Contact Form Modal */}
      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
}
