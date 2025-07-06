import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "absolute w-1 h-1 bg-white rounded-full opacity-30 pointer-events-none";
      particle.style.top = Math.random() * 100 + "vh";
      particle.style.left = "-10px";
      particle.style.animation = `drift ${Math.random() * 20 + 10}s linear forwards`;
      
      container.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 30000);
    };

    // Create initial particles
    for (let i = 0; i < 50; i++) {
      setTimeout(() => createParticle(), Math.random() * 10000);
    }

    // Continue creating particles
    const interval = setInterval(createParticle, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
}
