import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import sphinxLogo from "@assets/SPHX logo main.png";
import { UnifiedButton } from "@/components/ui/unified-button";
import { UnifiedCard } from "@/components/ui/unified-card";
// Animated Trading Bars Component (simplified candlestick-style visualization)
function SphinxTradingChart() {
  const [bars, setBars] = useState<Array<{id: number, height: number, isGreen: boolean}>>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    let barCount = 0;
    
    const addNewBar = () => {
      const height = Math.random() * 30 + 10; // Random height between 10-40px
      const isGreen = Math.random() > 0.5; // Random green/red
      
      setBars(prev => {
        const newBars = [...prev, { id: barCount++, height, isGreen }];
        // Keep only last 24 bars
        return newBars.slice(-24);
      });
    };
    
    // Start with immediate bar
    addNewBar();
    
    // Add new bar every 2000ms (2 seconds)
    intervalRef.current = setInterval(addNewBar, 2000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <div className="flex items-end justify-center h-12 w-full">
      <div className="flex items-end justify-center" style={{ width: '85%', gap: '3px' }}>
        {bars.map((bar, index) => (
          <motion.div
            key={bar.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: bar.height, 
              opacity: 1 
            }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 100 
            }}
            className={`w-2 rounded-sm ${
              bar.isGreen 
                ? 'bg-green-400 shadow-lg shadow-green-400/30' 
                : 'bg-red-400 shadow-lg shadow-red-400/30'
            }`}
            style={{ 
              minHeight: '8px'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Authentic project data with official logos and website aesthetics
const projects = [
  {
    name: "SUPRA",
    category: "High-Performance Blockchain",
    description: "High-performance blockchain platform combining next-generation consensus with advanced infrastructure",
    details: "Supra is building a vertically integrated blockchain infrastructure that combines a novel consensus mechanism with oracle services. Their approach aims to solve the oracle problem while providing high throughput and low latency for DeFi applications.",
    logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg2IiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGNsaXAtcGF0aD0idXJsKCNhKSI+PHBhdGggZD0iTTM5LjYyNyAyMGMwIDExLjA0NC04Ljg3MiAyMC0xOS44MTMgMjBDOC44NzIgNDAgMCAzMS4wNDQgMCAyMFM4Ljg3MiAwIDE5LjgxNCAwYzEwLjk0MSAwIDE5LjgxMyA4Ljk1NiAxOS44MTMgMjBaIiBmaWxsPSIjREQxNDM4Ii8+PHBhdGggZD0iTTMxLjE3OCAxMC4zNzhjLS40NzUtMS4yMjItMS4yNzItMi4yOTMtMi4xNjItMy4xOTFhMTAuNTUzIDEwLjU1MyAwIDAgMC0zLjIyMy0yLjA3NiA5LjM3MyA5LjM3MyAwIDAgMC0yLjQwOC0uNjE3Yy0yLjk1NS0uNDMyLTYuMDY4LjQ4NC04LjMyNiAyLjc2OC0yLjYwNyAyLjYzMi0zLjUyMyA2LjQ4NS0yLjM3MyAxMC4wNzJ2LjAzNWExMC4wODkgMTAuMDg5IDAgMCAwLTEuOTY5IDEuNjIyYy0uOTA3Ljk2LTEuNjQyIDIuMDc2LTIuMTE4IDMuMjk4YTEwLjU2NCAxMC41NjQgMCAwIDAtLjY5IDMuODRjMCAxLjMzMy4yNzcgMi42Ljc5NiAzLjc3OC40NzYgMS4yMjIgMS4yNzMgMi4yOTMgMi4xNjIgMy4xOTFhMTAuNTUzIDEwLjU1MyAwIDAgMCAzLjIyMyAyLjA3NmMxLjE2Ny40OCAyLjQyNi42OTcgMy42OTkuNjk3LS4xOCAwLS4zNTctLjAwOS0uNTMzLS4wMTdhOS42OTUgOS42OTUgMCAwIDAgNy40MzItMi44NzYgOS44NDMgOS44NDMgMCAwIDAgMi4zOTUtOS45OTEgOS43OTggOS43OTggMCAwIDAgMi4wODctMS42OTNjLjkwNy0uOTYgMS42NDMtMi4wNzYgMi4xMTgtMy4yOThhMTAuNTcgMTAuNTcgMCAwIDAgLjY5Mi0zLjg0IDkuMzEgOS4zMSAwIDAgMC0uNzk3LTMuNzc4bS04LjU0Ny43MTFhNC4xNyA0LjE3IDAgMCAxLS4wOTctLjk1NWMuMzU3LjA2Mi42OTYuMTY4IDEuMDM1LjMxLjQ3Ni4yLjg5LjUyNSAxLjIxMS44OTguMzA4LjM4Ny41ODEuODA1LjczNSAxLjI4NS4xNjguNDguMjE2Ljk2LjIxNiAxLjQ0YTMuNzU3IDMuNzU3IDAgMCAxLTEuMDc5IDIuNDIybC0yLjAyLTUuMzk1di0uMDA1Wm0yLjMwOCA2LjE2NWMuMDYxLS4wNTguMTIzLS4xMTYuMTc2LS4xODMuNDEzLS40MzUuNjczLS44OTcuODg5LTEuNDQuMjE2LS41NDIuMjYtMS4xMjkuMjYtMS42NTcgMC0uNTg3LS4xNTQtMS4xMTYtLjM3LTEuNTk2cy0uNTgxLS45MTYtLjk1MS0xLjI4NGMtLjM3LS4zMjUtLjg0Ni0uNjUtMS4zMjEtLjgwNS0uMzQzLS4xMjQtLjcxOC0uMTc4LTEuMDk2LS4yMDRhNC4wOCA0LjA4IDAgMCAxIC40NjItMS43OTFjLjQzMS4wODQuODQ1LjIxMyAxLjI0Ni40LjczNS4zMjQgMS4zMi44MDQgMS44NCAxLjMzMy40NzYuNTg3LjkwNyAxLjIyMiAxLjE2NyAxLjkycy4zNyAxLjQyNy4zNyAyLjE4MmMwIC43NTYtLjE1NCAxLjUwMi0uNDc1IDIuMTM4YTQuNjc2IDQuNjc2IDAgMCAxLTEuMjExIDEuNzUxIDUuMTg3IDUuMTg3IDAgMCAxLS41NDYuNDMxbC0uNDQ1LTEuMTkxLjAwNS0uMDA0Wm0uNzE3IDEuOTE1YTcuNSA3LjUgMCAwIDAgLjc4LS42NzFjLjUzNy0uNTg3IDEuMDEyLTEuMzMzIDEuMjcyLTIuMDc2LjMyMS0uODA0LjQzMS0xLjYwOC40MzEtMi40IDAtLjc5LS4xOTgtMS41OTUtLjUyMy0yLjMzN2E1Ljc4OCA1Ljc4OCAwIDAgMC0xLjM2NS0xLjkyYy0uNTgyLS41MjUtMS4yMTEtLjk2LTEuOTQ3LTEuMjIzYTYuMzk3IDYuMzk3IDAgMCAwLTEuMjgtLjMwMmMuMTg0LS4zNDIuNDA5LS42NTguNjg2LS45NDIuMjE2LS4yMTguNDU0LS40MDQuNy0uNTY0LjE5OC4wNy4zOTIuMTUuNTgxLjI0YTcuMTIgNy4xMiAwIDAgMSAyLjQyNiAxLjcwMmMuNjkyLjY5OCAxLjIxMSAxLjYwOSAxLjU4MSAyLjUwNi4zNy45Ni41MjQgMS45NjUuNTI0IDIuOTI1YTguNTY2IDguNTY2IDAgMCAxLS42MyAyLjg4Yy0uMzcuODUzLS45NSAxLjY0LTEuNjQyIDIuMzM4YTYuODMgNi44MyAwIDAgMS0xLjE3NS45NWwtLjQxOS0xLjExNXYuMDFaTTE1LjM1NCAzMy41MTZhNS45MjMgNS45MjMgMCAwIDEtLjQ1OC0uMTk2IDcuMTE5IDcuMTE5IDAgMCAxLTIuNDI2LTEuNzAyYy0uNjkyLS42OTgtMS4yMTEtMS42MDktMS41ODEtMi41MTFhOC4xNDMgOC4xNDMgMCAwIDEtLjUyLTIuOTI1IDguNDY0IDguNDY0IDAgMCAxIC42My0yLjg4Yy4zNy0uODUzLjk1MS0xLjY0IDEuNjQzLTIuMzM3YTYuNzk3IDYuNzk3IDAgMCAxIDEuMDc4LS44OWwuNDI3IDEuMTJhNi44ODYgNi44ODYgMCAwIDAtLjY5MS42MDVjLS41MzcuNTg3LTEuMDEzIDEuMzM0LTEuMjcyIDIuMDc2LS4zMjIuODA0LS40MzIgMS42MDktLjQzMiAyLjQgMCAuNzkuMTk4IDEuNTk1LjUyNCAyLjMzOGE1Ljc5IDUuNzkgMCAwIDAgMS4zNjUgMS45MmMuNTgxLjUyNCAxLjIxLjk2IDEuOTUgMS4yMjIuMzc1LjEzMy43NjcuMjI2IDEuMTU5LjI4NGE0LjA4OSA0LjA4OSAwIDAgMS0uNjcuODk4IDMuODcgMy44NyAwIDAgMS0uNzIyLjU3M20uMjk1LTEuOTE1Yy0uNzM1LS4zMjUtMS4zMi0uODA1LTEuODQtMS4zMzQtLjQ3Ni0uNTg2LS45MDMtMS4yMjItMS4xNjctMS45MmE2LjE5MyA2LjE5MyAwIDAgMS0uMzctMi4xODJjMC0uNzU1LjE1NC0xLjUwMi40NzYtMi4xMzguMjYtLjY4LjY5LTEuMjcgMS4yMS0xLjc1LjE0Ni0uMTM0LjMtLjI1NC40NTgtLjM3bC40NTggMS4yMWMtLjAzNS4wMzUtLjA3LjA2Ni0uMTA1LjEwNi0uNDE0LjQzMS0uNjc0Ljg5OC0uODkgMS40NC0uMjE2LjU0Mi0uMjYgMS4xMjktLjI2IDEuNjU4IDAgLjU5LjE1NCAxLjExNS4zNyAxLjU5NXMuNTgxLjkxNi45NTEgMS4yODVjLjM3LjMyNC44NDYuNjQ5IDEuMzIxLjgwNC4zMTcuMTExLjY1Ni4xNyAxLjAwNC4xOTZhNC4xNTggNC4xNTggMCAwIDEtLjQ4OSAxLjc3OCA1LjM0NSA1LjM0NSAwIDAgMS0xLjEyNy0uMzc4Wm0xLjUzNy0yLjQxNGMuMDY2LjMyLjA4OC42NC4wNzkuOTU2YTQuODIgNC44MiAwIDAgMS0uOTQyLS4yOTNjLS40NzYtLjItLjg5LS41MjUtMS4yMTEtLjg5OC0uMzA4LS4zODctLjU4MS0uODA1LS43MzUtMS4yODUtLjE2OC0uNDgtLjIxNi0uOTYtLjIxNi0xLjQ0YTMuNzUzIDMuNzUzIDAgMCAxIDEuMDA4LTIuMzQ2bDIuMDE3IDUuMzA2Wm0tNi4wOCAzLjc0N2MtLjkwOC0uOTE1LTEuNTMzLTEuOTY5LTIuMDA5LTMuMTQyLS40MTMtMS4xMTYtLjYzLTIuNC0uNjMtMy42MjIuMDYyLTEuMjIzLjMyMi0yLjQ0NS43OTgtMy41Ni40NzUtMS4xMyAxLjIxLTIuMTM4IDIuMDU2LTIuOTg3YTguNzA1IDguNzA1IDAgMCAxIDEuNzE3LTEuMzMzbC4zMjYuODUzYy0uNDk4LjMyOS0uOTYuNjk4LTEuMzY1IDEuMTQ3YTguMDA1IDguMDA1IDAgMCAwLTEuNjg2IDIuNzFjLS4zNyAxLjAwNS0uNTIgMi4wNzYtLjUyIDMuMTQzLjA2MiAxLjA1My4yNiAyLjEyLjY5MSAzLjA4YTguMTQ4IDguMTQ4IDAgMCAwIDEuNzk3IDIuNTU2IDguMTAxIDguMTAxIDAgMCAwIDIuNTc2IDEuNjU3Yy4xMzYuMDU0LjI3My4wOTguNDEuMTQ3YTQuMzEyIDQuMzEyIDAgMCAxLTIuMDYyLjYgMy4xNzYgMy4xNzYgMCAwIDEtLjc3LS4wOCA5LjUwOSA5LjUwOSAwIDAgMS0xLjMyNS0xLjE2bTE5LjUyMy0xNS4yNDRjLS40NzYgMS4xMjgtMS4yMTEgMi4xMzctMi4wNTcgMi45ODZhOC42MjIgOC42MjIgMCAwIDEtMS44MjIgMS4zOTZsLS4zMTctLjg1YTcuMjQ4IDcuMjQ4IDAgMCAwIDEuNDY2LTEuMjEyYy43MzUtLjc5MiAxLjMyLTEuNzAzIDEuNjg2LTIuNzEyLjM3LTEuMDA0LjUyLTIuMDc1LjUyLTMuMTQyLS4wNjItMS4wNTMtLjI2LTIuMTItLjY5Mi0zLjA4YTguMDc3IDguMDc3IDAgMCAwLTQuMzcyLTQuMjEzIDUuNjMzIDUuNjMzIDAgMCAwLS41NDYtLjE4MiA0LjA0OSA0LjA0OSAwIDAgMSAyLjk2OC0uNDhjLjQ4LjM0Ni45MjQuNzM3IDEuMzIgMS4xNi45MDguOTE1IDEuNTMzIDEuOTY0IDIuMDA4IDMuMTQyLjQxNCAxLjExNS42MyAyLjQuNjMgMy42MjItLjA2MSAxLjIyMi0uMzIxIDIuNDQ5LS43OTcgMy41NiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik01Mi4zNjYgMzMuMDljLTEuOTY0LS41NzktMy41NDQtMS4zMjUtNC43MzMtMi4yNDVsMi4wOTEtNC42ODVjMS4xNC44NDUgMi40OTcgMS41MjUgNC4wNjkgMi4wMzYgMS41NzIuNTEgMy4xNDMuNzY5IDQuNzE1Ljc2OSAxLjc1MyAwIDMuMDQzLS4yNjMgMy44OC0uNzg3LjgzNi0uNTI0IDEuMjU0LTEuMjIyIDEuMjU0LTIuMDkzIDAtLjY0LS4yNDYtMS4xNzQtLjc0LTEuNTk2LS40OTMtLjQyMi0xLjEyNy0uNzYtMS45MDItMS4wMTgtLjc3NS0uMjU4LTEuODE4LS41MzgtMy4xMzktLjg0NC0yLjAzLS40ODUtMy42OS0uOTczLTQuOTgtMS40NThhOC4xMDMgOC4xMDMgMCAwIDEtMy4zMjgtMi4zNDJjLS45MjUtMS4wNzYtMS4zODctMi41MDctMS4zODctNC4yOTggMC0xLjU2LjQxOC0yLjk3OCAxLjI1NC00LjI0NC44MzctMS4yNjcgMi4wOTYtMi4yNzEgMy43ODMtMy4wMTQgMS42ODYtLjc0MiAzLjc0Ny0xLjExNSA2LjE4MS0xLjExNSAxLjcgMCAzLjM2LjIwNCA0Ljk4LjYxMyAxLjYyLjQwOSAzLjA0MyAxIDQuMjYyIDEuNzY1bC0xLjkwMiA0LjcyNGMtMi40NjEtMS40MDQtNC45MTgtMi4xMTEtNy4zOC0yLjExMS0xLjcyNSAwLTIuOTk4LjI4NC0zLjgyMS44NDQtLjgyMy41NjUtMS4yMzcgMS4zMDctMS4yMzcgMi4yMjcgMCAuOTIuNDc1IDEuNjA5IDEuNDI2IDIuMDUzLjk1MS40NSAyLjQwNC44OSA0LjM1NSAxLjMyNSAyLjAzLjQ4NCAzLjY5Ljk3MyA0Ljk4IDEuNDU3YTguMjIgOC4yMiAwIDAgMSAzLjMyOCAyLjMwM2MuOTI1IDEuMDQ5IDEuMzg3IDIuNDcgMS4zODcgNC4yNjJhNy4zNzkgNy4zNzkgMCAwIDEtMS4yNzIgNC4yMDRjLS44NSAxLjI2Ny0yLjEyNyAyLjI3MS0zLjgyMiAzLjAxNC0xLjcuNzQyLTMuNzY1IDEuMTEtNi4yIDEuMTFhMjEuNTYgMjEuNTYgMCAwIDEtNi4xMDYtLjg2Nm0yNC43NDQtMi4zMTZjLTIuMTE4LTIuMTI0LTMuMTc0LTUuMTYtMy4xNzQtOS4wOTdWNi42MTdoNi4xNnYxNC44MTljMCA0LjgxMyAxLjk3NiA3LjIxNyA1LjkzNSA3LjIxNyAxLjkyNCAwIDMuMzk5LS41ODIgNC40MTItMS43NDYgMS4wMTItMS4xNjUgMS41MjMtMi45ODcgMS41MjMtNS40NzFWNi42MThoNi4wODV2MTUuMDQ5YzAgMy45NDItMS4wNjEgNi45NzMtMy4xNzUgOS4wOTctMi4xMTcgMi4xMjUtNS4wNzYgMy4xODctOC44OCAzLjE4Ny0zLjgwNSAwLTYuNzY0LTEuMDYyLTguODgxLTMuMTg3bTQzLjI0NS0yMi45NTVjMS43MzUuNzkgMy4wNzQgMS45MiA0LjAxMSAzLjM3OC45MzggMS40NTcgMS40MDkgMy4xODYgMS40MDkgNS4xODIgMCAxLjk5NS0uNDY2IDMuNjkzLTEuNDA5IDUuMTY0LS45MzcgMS40NzEtMi4yNzYgMi42LTQuMDExIDMuMzc4LTEuNzM0Ljc4Mi0zLjc4NiAxLjE3My02LjE0MiAxLjE3M2gtNS4zNjN2Ny40MWgtNi4xNlY2LjYxN2gxMS41MjNjMi4zNiAwIDQuNDA4LjM5NSA2LjE0MiAxLjE5Wm0tMi4yNjMgMTEuOTk1Yy45NjQtLjgwNCAxLjQ0NC0xLjk1IDEuNDQ0LTMuNDM1cy0uNDgtMi42NjctMS40NDQtMy40NzFjLS45NjQtLjgwNS0yLjM3My0xLjIxLTQuMjIyLTEuMjFoLTUuMDJ2OS4zM2g1LjAyYzEuODQ5IDAgMy4yNTgtLjQwNSA0LjIyMi0xLjIxbTI5LjEgMTMuNjg1LTUuMTM0LTcuNDg5aC01LjY2N3Y3LjQ5aC02LjE2VjYuNjE3aDExLjUyM2MyLjM2IDAgNC40MDguMzk1IDYuMTQyIDEuMTkgMS43MzUuNzkyIDMuMDc0IDEuOTIgNC4wMTEgMy4zNzkuOTM4IDEuNDU3IDEuNDA5IDMuMTg2IDEuNDA5IDUuMTgyIDAgMS45OTUtLjQ3NSAzLjcyLTEuNDI2IDUuMTY0LS45NTEgMS40NS0yLjMwMyAyLjU1MS00LjA1MSAzLjMybDUuOTcxIDguNjRoLTYuNjE4Wm0tMS41NTktMjAuNTk1Yy0uOTY0LS44MDUtMi4zNzMtMS4yMS00LjIyMi0xLjIxaC01LjAydjkuMzdoNS4wMmMxLjg0OSAwIDMuMjU4LS40MSA0LjIyMi0xLjIyNy45NjQtLjgxOCAxLjQ0NC0xLjk2OSAxLjQ0NC0zLjQ1MyAwLTEuNDg1LS40OC0yLjY2Ny0xLjQ0NC0zLjQ3Nm0zMS40MjUgMTQuODMxaC0xMi4zNmwtMi4zNiA1Ljc2aC02LjMxNGwxMS44NjctMjYuODc1aDYuMDg1bDExLjkwNSAyNi44NzVoLTYuNDYzbC0yLjM2LTUuNzZabS0xLjk0Mi00LjcyNC00LjIyMy0xMC4yOS00LjIyMiAxMC4yOWg4LjQ0NVoiIGZpbGw9IiMxRDJBM0EiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE4NS44ODJ2NDBIMHoiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=",
    website: "https://supra.com",
    websiteColors: {
      primary: "#FF3E00",
      secondary: "#DD1438",
      background: "#000000",
      accent: "#FF6B35"
    },
    type: "Partnership"
  },
  {
    name: "GUNZILLA",
    category: "Gaming",
    description: "Battle royale gaming ecosystem with blockchain integration",
    details: "Gunzilla Games is developing Off The Grid, a cyberpunk battle royale game that integrates blockchain technology. Players can truly own in-game assets and participate in a player-driven economy within an immersive gaming experience.",
    logo: "https://gunzillagames.com/static/media/logo_green.c371cd74.svg",
    website: "https://gunzillagames.com",
    websiteColors: {
      primary: "#00D4AA",
      secondary: "#FF6B35",
      background: "#000000",
      accent: "#00FFFF"
    },
    type: "Investment"
  },
  {
    name: "REDBELLY",
    category: "Enterprise",
    description: "High-performance blockchain for enterprise applications",
    details: "RedBelly Network provides a high-performance blockchain solution designed for enterprise use cases. Their consensus algorithm enables fast transaction processing while maintaining security and decentralization.",
    logo: "https://storage.googleapis.com/redbelly-website.firebasestorage.app/Image/Redbelly_Logo_d9af84c0b5/Redbelly_Logo_d9af84c0b5.svg",
    website: "https://redbelly.network",
    websiteColors: {
      primary: "#DC2626",
      secondary: "#991B1B",
      background: "#FFFFFF",
      accent: "#EF4444"
    },
    type: "Investment"
  },
  {
    name: "MYRIA",
    category: "Gaming L2",
    description: "Ethereum L2 scaling solution built for gaming",
    details: "Myria is an Ethereum Layer 2 scaling solution built specifically for gaming and NFTs. It provides developers with the tools to build scalable blockchain games while offering players true ownership of their digital assets.",
    logo: "https://myria.com/images/myria-logo-light.svg",
    website: "https://myria.com",
    websiteColors: {
      primary: "#10B981",
      secondary: "#0891B2",
      background: "#000000",
      accent: "#14B8A6"
    },
    type: "Investment"
  },
  {
    name: "TEN",
    category: "Privacy",
    description: "Privacy-focused Ethereum Layer 2 solution",
    details: "TEN Protocol provides privacy-preserving smart contracts on Ethereum through advanced cryptographic techniques, enabling developers to build applications with built-in privacy protection.",
    logo: "https://ten.xyz/assets/TEN_Protocol_LOGO.svg",
    website: "https://ten.xyz",
    websiteColors: {
      primary: "#8B5CF6",
      secondary: "#7C3AED",
      background: "#0F0F23",
      accent: "#A78BFA"
    },
    type: "Investment"
  },
  {
    name: "WORLD MOBILE",
    category: "Connectivity",
    description: "Blockchain-based mobile network for underserved regions",
    details: "World Mobile Token (WMT) powers a blockchain-based mobile network aimed at providing connectivity to underserved regions. It uses a sharing economy model to incentivize node operators and users, bridging digital divides.",
    logo: "https://pbs.twimg.com/profile_images/1890087991609016320/I64Atpti_400x400.jpg",
    website: "https://worldmobile.io",
    websiteColors: {
      primary: "#FF6B35",
      secondary: "#E55A2B",
      background: "#FFFFFF",
      accent: "#FF8C42"
    },
    type: "Infrastructure"
  },
  {
    name: "MINUTES NETWORK",
    category: "Telecommunications",
    description: "Blockchain-based wholesale telecommunications carrier",
    details: "Minutes Network is a blockchain-based wholesale telecommunications carrier revolutionizing the call termination market through its proprietary Mintech technology and decentralized physical infrastructure (DePIN). It offers the lowest-cost international voice termination services to Tier 1 operators like Skype, Lebara, and Vodatel, using a network of 500 Switch Nodes and 2,500 Validation Nodes to handle up to 72 million minutes of daily call traffic. The Minutes Network Token (MNT) powers a sharing economy, where net revenues are used to buy back tokens and reward node operators and users.",
    logo: "https://minutesnetwork.io/images/logo_whitetext.svg",
    website: "https://minutesnetwork.io",
    websiteColors: {
      primary: "#1E40AF",
      secondary: "#1D4ED8",
      background: "#F8FAFC",
      accent: "#3B82F6"
    },
    type: "Partnership"
  },
  {
    name: "CHIRP",
    category: "DePIN IoT",
    description: "DePIN ecosystem that powers Real World Assets through IoT connectivity",
    details: "Chirp enables devices and sensors from various manufacturers and radio technologies to communicate with each other, the internet, and the blockchain. It provides RWA dApp developers with connectivity and powerful tools, allowing them to focus on building their applications without managing IoT complexities. The $CHIRP token powers the entire ecosystem, rewarding users for their contributions through mining, gaming, and data generation.",
    logo: "https://chirptoken.io/wp-content/themes/chirp/build/img/logo.svg",
    website: "https://chirptoken.io",
    websiteColors: {
      primary: "#FF6B35",
      secondary: "#E55A2B", 
      background: "#0A0A0A",
      accent: "#FF8C42"
    },
    type: "Investment"
  },
  {
    name: "MULTISYNQ",
    category: "DePIN",
    description: "Decentralized synchronization protocol for blockchain and IoT applications",
    details: "Multisynq is a decentralized, hyper-local DePIN synchronization protocol for the converging digital and physical worlds. It enables seamless data coordination across devices and networks, focusing on real-time, secure data exchange. The platform allows instant multiplayer game creation with no networking code, offering 15-30ms latency at 90% lower operational costs through its DePIN architecture.",
    logo: "https://multisynq.io/static/media/logo-white.26febca75ccb1486e8cd.png",
    website: "https://multisynq.io",
    websiteColors: {
      primary: "#6366F1",
      secondary: "#4F46E5",
      background: "#0F172A",
      accent: "#8B5CF6"
    },
    type: "Investment"
  },
  {
    name: "CREDBULL",
    category: "DeFi",
    description: "DeFi platform offering yield-generating opportunities through tokenized financial products",
    details: "Credbull is a DeFi platform that provides crypto yield without crypto volatility by offering access to stable high yield in emerging markets through private credit and real world assets (RWAs). The platform focuses on yield uncorrelated to crypto markets, diversified across multiple RWAs with permissionless access and liquidity features. Credbull provides short-term credit to creditworthy SMEs in emerging markets, including invoice financing and cross-border payments.",
    logo: "https://credbull.io/_next/static/media/logo.3227e7d9.svg",
    website: "https://credbull.io",
    websiteColors: {
      primary: "#10B981",
      secondary: "#059669",
      background: "#064E3B",
      accent: "#34D399"
    },
    type: "Investment"
  },
  {
    name: "SPHINX",
    category: "Trading Infrastructure",
    description: "24/7 commodity derivatives trading with near-instant clearing and atomic settlement",
    details: "Sphinx operates a bespoke L1 blockchain engineered for commodity derivatives trading with institutional-grade performance and security. The platform offers 24/7 direct market access, 28% increase in capital efficiency through cross-margining, atomic settlement, 10x cheaper trading fees, and 50% reduction in back-office costs. Built for institutions with FCA and BMA regulatory compliance.",
    logo: sphinxLogo,
    website: "https://sphx.io",
    websiteColors: {
      primary: "#00D4FF",
      secondary: "#0099CC",
      background: "#0A1628",
      accent: "#40E0D0"
    },
    type: "Infrastructure"
  },
  {
    name: "PANGEA",
    category: "Data Infrastructure",
    description: "90ms latency blockchain data network with real-time streaming and cross-chain functionality",
    details: "Pangea provides the first immersive web3 environment with useable data for chains, dApps and protocols. The platform indexes at 533,000 TPS and delivers data in just 90ms from the tip of the chain. Pangea offers real-time and historical data with comprehensive insights, modular architecture, and serves as a single source of truth for cross-chain applications.",
    logo: "https://blog.pangea.foundation/content/images/2024/09/Lock-up--1-.png",
    website: "https://pangea.foundation",
    websiteColors: {
      primary: "#34D399",
      secondary: "#10B981",
      background: "#0F172A",
      accent: "#6EE7B7"
    },
    type: "Infrastructure"
  }
];

// Website Portal Card Component
function WebsitePortalCard({ project, index, onOpenModal }: {
  project: typeof projects[0];
  index: number;
  onOpenModal: () => void;
}) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl border border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-white/40 shadow-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onOpenModal}
    >
      {/* Mini Website Preview */}
      <div className="relative w-full h-80 overflow-hidden">
        {/* Website Background */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: project.websiteColors.background }}
        />

        {/* Website-specific Layout */}
        {project.name === "CHIRP" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#FF6B35] p-4 overflow-hidden">
            {/* Animated flying birds */}
            <div className="absolute inset-0">
              <style>{`
                @keyframes flyIntoDistance1 {
                  0% { 
                    transform: translate(-10%, 20%) scale(1.2); 
                    opacity: 0; 
                  }
                  10% { 
                    opacity: 0.7; 
                  }
                  100% { 
                    transform: translate(45%, 45%) scale(0.2); 
                    opacity: 0; 
                  }
                }
                @keyframes flyIntoDistance2 {
                  0% { 
                    transform: translate(90%, 70%) scale(1.1); 
                    opacity: 0; 
                  }
                  15% { 
                    opacity: 0.6; 
                  }
                  100% { 
                    transform: translate(55%, 50%) scale(0.15); 
                    opacity: 0; 
                  }
                }
                @keyframes flyIntoDistance3 {
                  0% { 
                    transform: translate(15%, 10%) scale(1.3); 
                    opacity: 0; 
                  }
                  12% { 
                    opacity: 0.8; 
                  }
                  100% { 
                    transform: translate(50%, 40%) scale(0.1); 
                    opacity: 0; 
                  }
                }
                @keyframes flyIntoDistance4 {
                  0% { 
                    transform: translate(85%, 45%) scale(1.0); 
                    opacity: 0; 
                  }
                  8% { 
                    opacity: 0.5; 
                  }
                  100% { 
                    transform: translate(60%, 55%) scale(0.12); 
                    opacity: 0; 
                  }
                }
                @keyframes flyIntoDistance5 {
                  0% { 
                    transform: translate(-5%, 85%) scale(1.4); 
                    opacity: 0; 
                  }
                  14% { 
                    opacity: 0.9; 
                  }
                  100% { 
                    transform: translate(40%, 35%) scale(0.08); 
                    opacity: 0; 
                  }
                }
                @keyframes flyIntoDistance6 {
                  0% { 
                    transform: translate(45%, 30%) scale(1.1); 
                    opacity: 0; 
                  }
                  12% { 
                    opacity: 0.6; 
                  }
                  100% { 
                    transform: translate(52%, 48%) scale(0.15); 
                    opacity: 0; 
                  }
                }
                @keyframes flyIntoDistance7 {
                  0% { 
                    transform: translate(35%, 55%) scale(1.0); 
                    opacity: 0; 
                  }
                  15% { 
                    opacity: 0.7; 
                  }
                  100% { 
                    transform: translate(48%, 42%) scale(0.12); 
                    opacity: 0; 
                  }
                }
                .chirp-bird-1 { animation: flyIntoDistance1 6s infinite ease-out; }
                .chirp-bird-2 { animation: flyIntoDistance2 7s infinite ease-out; animation-delay: 1.5s; }
                .chirp-bird-3 { animation: flyIntoDistance3 8s infinite ease-out; animation-delay: 3s; }
                .chirp-bird-4 { animation: flyIntoDistance4 5.5s infinite ease-out; animation-delay: 4.5s; }
                .chirp-bird-5 { animation: flyIntoDistance5 9s infinite ease-out; animation-delay: 0.5s; }
                .chirp-bird-6 { animation: flyIntoDistance6 6.5s infinite ease-out; animation-delay: 2.5s; }
                .chirp-bird-7 { animation: flyIntoDistance7 7.5s infinite ease-out; animation-delay: 4s; }
              `}</style>
              
              {/* Bird 1 - Top area bird - Wings up position */}
              <div className="absolute chirp-bird-1" style={{top: '15%', left: '8%', zIndex: 1}}>
                <svg width="16" height="10" viewBox="0 0 16 10">
                  <path d="M2 7 Q5 2 8 6 Q11 2 14 7" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="d" values="M2 7 Q5 2 8 6 Q11 2 14 7;M2 5 Q5 5 8 5 Q11 5 14 5;M2 7 Q5 2 8 6 Q11 2 14 7" dur="0.3s" repeatCount="indefinite"/>
                  </path>
                </svg>
              </div>
              
              {/* Bird 2 - Bottom right area bird - Wings up position */}
              <div className="absolute chirp-bird-2" style={{top: '75%', left: '85%', zIndex: 1}}>
                <svg width="14" height="8" viewBox="0 0 14 8">
                  <path d="M1 6 Q4 1 7 5 Q10 1 13 6" stroke="#FFFFFF" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="d" values="M1 6 Q4 1 7 5 Q10 1 13 6;M1 4 Q4 4 7 4 Q10 4 13 4;M1 6 Q4 1 7 5 Q10 1 13 6" dur="0.4s" repeatCount="indefinite"/>
                  </path>
                </svg>
              </div>
              
              {/* Bird 3 - Top left area bird - Wings up position */}
              <div className="absolute chirp-bird-3" style={{top: '5%', left: '12%', zIndex: 1}}>
                <svg width="18" height="12" viewBox="0 0 18 12">
                  <path d="M1 9 Q5 2 9 7 Q13 2 17 9" stroke="#FFFFFF" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="d" values="M1 9 Q5 2 9 7 Q13 2 17 9;M1 6 Q5 6 9 6 Q13 6 17 6;M1 9 Q5 2 9 7 Q13 2 17 9" dur="0.35s" repeatCount="indefinite"/>
                  </path>
                </svg>
              </div>
              
              {/* Bird 4 - Middle right area bird - Wings up position */}
              <div className="absolute chirp-bird-4" style={{top: '50%', left: '80%', zIndex: 1}}>
                <svg width="12" height="7" viewBox="0 0 12 7">
                  <path d="M1.5 5.5 Q4 1.5 6 4.5 Q8 1.5 10.5 5.5" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="d" values="M1.5 5.5 Q4 1.5 6 4.5 Q8 1.5 10.5 5.5;M1.5 3.5 Q4 3.5 6 3.5 Q8 3.5 10.5 3.5;M1.5 5.5 Q4 1.5 6 4.5 Q8 1.5 10.5 5.5" dur="0.25s" repeatCount="indefinite"/>
                  </path>
                </svg>
              </div>
              
              {/* Bird 5 - Bottom left area bird - Wings up position */}
              <div className="absolute chirp-bird-5" style={{top: '85%', left: '5%', zIndex: 1}}>
                <svg width="20" height="14" viewBox="0 0 20 14">
                  <path d="M1 11 Q6 2 10 8 Q14 2 19 11" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="d" values="M1 11 Q6 2 10 8 Q14 2 19 11;M1 7 Q6 7 10 7 Q14 7 19 7;M1 11 Q6 2 10 8 Q14 2 19 11" dur="0.45s" repeatCount="indefinite"/>
                  </path>
                </svg>
              </div>
              
              {/* Bird 6 - Center area bird */}
              <div className="absolute chirp-bird-6" style={{top: '35%', left: '45%', zIndex: 1}}>
                <svg width="15" height="9" viewBox="0 0 15 9">
                  <path d="M1.5 7 Q4.5 2 7.5 6 Q10.5 2 13.5 7" stroke="#FFFFFF" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="d" values="M1.5 7 Q4.5 2 7.5 6 Q10.5 2 13.5 7;M1.5 5 Q4.5 5 7.5 5 Q10.5 5 13.5 5;M1.5 7 Q4.5 2 7.5 6 Q10.5 2 13.5 7" dur="0.32s" repeatCount="indefinite"/>
                  </path>
                </svg>
              </div>
              
              {/* Bird 7 - Center-bottom area bird */}
              <div className="absolute chirp-bird-7" style={{top: '60%', left: '40%', zIndex: 1}}>
                <svg width="13" height="8" viewBox="0 0 13 8">
                  <path d="M1 6 Q4 1.5 6.5 5 Q9 1.5 12 6" stroke="#FFFFFF" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="d" values="M1 6 Q4 1.5 6.5 5 Q9 1.5 12 6;M1 4 Q4 4 6.5 4 Q9 4 12 4;M1 6 Q4 1.5 6.5 5 Q9 1.5 12 6" dur="0.38s" repeatCount="indefinite"/>
                  </path>
                </svg>
              </div>
            </div>

            {/* Clean centered layout */}
            <div className="flex flex-col items-center justify-center h-full relative z-10">
              {/* Centered logo */}
              <div className="mb-6">
                <img 
                  src={project.logo} 
                  alt="Chirp Logo"
                  className="h-12 object-contain filter brightness-0 invert"
                />
              </div>
              
              {/* Main tagline */}
              <div className="text-center">
                <div className="text-orange-300 text-sm font-semibold mb-1">DEPIN ECOSYSTEM</div>
                <div className="text-white text-sm">THAT POWERS RWA</div>
              </div>
              
              {/* Simple progress bars */}
              <div className="flex space-x-1 mt-6">
                <div className="w-8 h-1 bg-orange-400/80 rounded animate-pulse"></div>
                <div className="w-12 h-1 bg-orange-500/60 rounded"></div>
                <div className="w-6 h-1 bg-orange-400/80 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Subtle IoT pattern in corner */}
            <div className="absolute bottom-4 right-4 opacity-30 z-10">
              <svg width="24" height="24">
                <circle cx="4" cy="4" r="1.5" fill="#FB923C"/>
                <circle cx="12" cy="6" r="1" fill="#FB923C"/>
                <circle cx="20" cy="10" r="1.5" fill="#FB923C"/>
                <circle cx="6" cy="16" r="1" fill="#FB923C"/>
                <circle cx="16" cy="20" r="1.5" fill="#FB923C"/>
                <line x1="4" y1="4" x2="12" y2="6" stroke="#FB923C" strokeWidth="0.5"/>
                <line x1="12" y1="6" x2="20" y2="10" stroke="#FB923C" strokeWidth="0.5"/>
                <line x1="4" y1="4" x2="6" y2="16" stroke="#FB923C" strokeWidth="0.5"/>
                <line x1="6" y1="16" x2="16" y2="20" stroke="#FB923C" strokeWidth="0.5"/>
              </svg>
            </div>
          </div>
        )}

        {project.name === "SUPRA" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF3E00] via-[#DD1438] to-[#000000] p-4">
            {/* Oracle visualization */}
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 border-2 border-white/40 rounded-full flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <img 
                src={project.logo} 
                alt="Supra Logo"
                className="h-8 object-contain mb-4"
              />
              <div className="text-white text-xs font-semibold mb-2">HIGH PERFORMANCE</div>
              <div className="flex space-x-1">
                <div className="w-12 h-1 bg-white/60 rounded"></div>
                <div className="w-8 h-1 bg-white/40 rounded"></div>
                <div className="w-16 h-1 bg-white/60 rounded"></div>
              </div>
            </div>
            {/* Circuit pattern */}
            <div className="absolute bottom-4 right-4 opacity-30">
              <svg width="40" height="40">
                <path d="M5 5 L15 5 L15 15 L25 15 L25 25 L35 25" stroke="white" strokeWidth="1" fill="none" />
                <circle cx="15" cy="5" r="2" fill="white" />
                <circle cx="25" cy="15" r="2" fill="white" />
                <circle cx="35" cy="25" r="2" fill="white" />
              </svg>
            </div>
          </div>
        )}

        {project.name === "GUNZILLA" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#00D4AA] to-[#FF6B35] p-4">
            {/* Gaming interface */}
            <div className="flex flex-col items-center justify-center h-full">
              {/* Cyberpunk hexagon */}
              <div className="relative w-16 h-16 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <polygon 
                    points="50,5 85,25 85,75 50,95 15,75 15,25" 
                    stroke="#00FFFF" 
                    strokeWidth="2" 
                    fill="rgba(0,255,255,0.1)"
                    className="animate-pulse"
                  />
                  <polygon 
                    points="50,20 70,35 70,65 50,80 30,65 30,35" 
                    stroke="#00D4AA" 
                    strokeWidth="1" 
                    fill="rgba(0,212,170,0.2)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-ping"></div>
                </div>
              </div>
              <img 
                src={project.logo} 
                alt="Gunzilla Logo"
                className="h-8 object-contain mb-4"
              />
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="w-8 h-8 bg-[#FF6B35]/30 border border-[#FF6B35]/50 rounded"></div>
                <div className="w-8 h-8 bg-[#00FFFF]/30 border border-[#00FFFF]/50 rounded"></div>
                <div className="w-8 h-8 bg-[#00D4AA]/30 border border-[#00D4AA]/50 rounded"></div>
              </div>
              <div className="text-[#00FFFF] text-xs font-bold tracking-wider">CYBERPUNK GAMING</div>
            </div>
            {/* Cyberpunk grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{ 
                backgroundImage: 'linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>
          </div>
        )}


        {project.name === "REDBELLY" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] to-[#FEF2F2] p-4">
            {/* Enterprise visualization */}
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-24 h-12 border-2 border-[#DC2626]/30 rounded-lg flex items-center justify-center mb-4 bg-[#DC2626]/5">
                <div className="text-[#DC2626] text-xs font-bold whitespace-nowrap">CONSENSUS</div>
              </div>
              <img 
                src={project.logo} 
                alt="RedBelly Logo"
                className="h-8 object-contain mb-4"
              />
              <div className="flex space-x-3 mb-4">
                <div className="w-4 h-4 bg-[#DC2626] rounded-full"></div>
                <div className="w-1 h-4 bg-[#DC2626]/60"></div>
                <div className="w-4 h-4 bg-[#EF4444] rounded-full"></div>
                <div className="w-1 h-4 bg-[#DC2626]/60"></div>
                <div className="w-4 h-4 bg-[#DC2626] rounded-full"></div>
              </div>
              <div className="text-[#991B1B] text-xs">HIGH PERFORMANCE</div>
            </div>
            {/* Professional accent */}
            <div className="absolute bottom-4 left-4">
              <div className="w-8 h-8 border border-[#DC2626]/20 rounded-lg bg-[#DC2626]/10"></div>
            </div>
          </div>
        )}

        {project.name === "MYRIA" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#1A2447] to-[#2E4A7A] overflow-hidden">
            {/* Scrolling Gaming Controllers Background */}
            <div className="absolute inset-0 opacity-15 z-0">
              {/* Top row - moving right - positioned lower to avoid header */}
              <div className="absolute top-12 left-0 flex space-x-12 animate-scroll-right">
                {/* Modern PlayStation-style Controller */}
                <svg width="40" height="24" viewBox="0 0 40 24" className="text-blue-400 flex-shrink-0">
                  {/* Main body */}
                  <path d="M8 8 L32 8 Q36 8 36 12 L36 16 Q36 20 32 20 L8 20 Q4 20 4 16 L4 12 Q4 8 8 8 Z" fill="currentColor"/>
                  {/* Left grip */}
                  <path d="M4 12 Q2 12 2 14 L2 20 Q2 22 4 22 L8 22 L8 20 L4 20 Z" fill="currentColor"/>
                  {/* Right grip */}
                  <path d="M36 12 Q38 12 38 14 L38 20 Q38 22 36 22 L32 22 L32 20 L36 20 Z" fill="currentColor"/>
                  {/* D-pad */}
                  <rect x="8" y="12" width="4" height="1" fill="white" opacity="0.8"/>
                  <rect x="9.5" y="10.5" width="1" height="4" fill="white" opacity="0.8"/>
                  {/* Action buttons */}
                  <circle cx="30" cy="11" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="33" cy="13" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="27" cy="13" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="30" cy="15" r="1.5" fill="white" opacity="0.8"/>
                  {/* Analog sticks */}
                  <circle cx="14" cy="16" r="2" fill="white" opacity="0.6"/>
                  <circle cx="26" cy="16" r="2" fill="white" opacity="0.6"/>
                </svg>
                
                {/* Xbox-style Controller */}
                <svg width="42" height="26" viewBox="0 0 42 26" className="text-green-400 flex-shrink-0">
                  {/* Main body - more rounded Xbox shape */}
                  <ellipse cx="21" cy="13" rx="18" ry="10" fill="currentColor"/>
                  {/* Controller grips */}
                  <ellipse cx="8" cy="16" rx="6" ry="8" fill="currentColor"/>
                  <ellipse cx="34" cy="16" rx="6" ry="8" fill="currentColor"/>
                  {/* D-pad */}
                  <rect x="10" y="11" width="4" height="1" fill="white" opacity="0.8"/>
                  <rect x="11.5" y="9.5" width="1" height="4" fill="white" opacity="0.8"/>
                  {/* ABXY buttons */}
                  <circle cx="30" cy="9" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="33" cy="11" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="27" cy="11" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="30" cy="13" r="1.5" fill="white" opacity="0.8"/>
                  {/* Analog sticks */}
                  <circle cx="16" cy="8" r="2.5" fill="white" opacity="0.6"/>
                  <circle cx="26" cy="17" r="2.5" fill="white" opacity="0.6"/>
                  {/* Xbox logo area */}
                  <circle cx="21" cy="6" r="2" fill="white" opacity="0.4"/>
                </svg>
                
                {/* Nintendo Switch Pro Controller */}
                <svg width="38" height="22" viewBox="0 0 38 22" className="text-purple-400 flex-shrink-0">
                  {/* Main body */}
                  <rect x="6" y="6" width="26" height="12" rx="6" fill="currentColor"/>
                  {/* Left grip */}
                  <ellipse cx="6" cy="14" rx="5" ry="7" fill="currentColor"/>
                  {/* Right grip */}
                  <ellipse cx="32" cy="14" rx="5" ry="7" fill="currentColor"/>
                  {/* D-pad buttons as separate elements */}
                  <rect x="9" y="11" width="2" height="0.8" fill="white" opacity="0.8"/>
                  <rect x="9.6" y="10.2" width="0.8" height="2.4" fill="white" opacity="0.8"/>
                  {/* ABXY buttons */}
                  <circle cx="27" cy="9" r="1.2" fill="white" opacity="0.8"/>
                  <circle cx="29.5" cy="11" r="1.2" fill="white" opacity="0.8"/>
                  <circle cx="24.5" cy="11" r="1.2" fill="white" opacity="0.8"/>
                  <circle cx="27" cy="13" r="1.2" fill="white" opacity="0.8"/>
                  {/* Analog sticks */}
                  <circle cx="14" cy="15" r="2" fill="white" opacity="0.6"/>
                  <circle cx="24" cy="15" r="2" fill="white" opacity="0.6"/>
                </svg>
                
                {/* Repeat for seamless scrolling */}
                <svg width="40" height="24" viewBox="0 0 40 24" className="text-blue-400 flex-shrink-0">
                  <path d="M8 8 L32 8 Q36 8 36 12 L36 16 Q36 20 32 20 L8 20 Q4 20 4 16 L4 12 Q4 8 8 8 Z" fill="currentColor"/>
                  <path d="M4 12 Q2 12 2 14 L2 20 Q2 22 4 22 L8 22 L8 20 L4 20 Z" fill="currentColor"/>
                  <path d="M36 12 Q38 12 38 14 L38 20 Q38 22 36 22 L32 22 L32 20 L36 20 Z" fill="currentColor"/>
                </svg>
              </div>
              
              {/* Bottom row - moving left */}
              <div className="absolute bottom-4 right-0 flex space-x-12 animate-scroll-left">
                {/* Retro SNES Controller */}
                <svg width="36" height="16" viewBox="0 0 36 16" className="text-gray-300 flex-shrink-0">
                  {/* Main body - classic rectangular */}
                  <rect x="2" y="4" width="32" height="8" rx="4" fill="currentColor"/>
                  {/* D-pad */}
                  <rect x="6" y="7" width="4" height="1" fill="white" opacity="0.8"/>
                  <rect x="7.5" y="5.5" width="1" height="4" fill="white" opacity="0.8"/>
                  {/* Action buttons */}
                  <circle cx="26" cy="6" r="1.2" fill="white" opacity="0.8"/>
                  <circle cx="28.5" cy="8" r="1.2" fill="white" opacity="0.8"/>
                  <circle cx="23.5" cy="8" r="1.2" fill="white" opacity="0.8"/>
                  <circle cx="26" cy="10" r="1.2" fill="white" opacity="0.8"/>
                  {/* Shoulder buttons */}
                  <rect x="4" y="3" width="4" height="1.5" rx="0.5" fill="white" opacity="0.6"/>
                  <rect x="28" y="3" width="4" height="1.5" rx="0.5" fill="white" opacity="0.6"/>
                </svg>
                
                {/* Arcade Stick */}
                <svg width="24" height="28" viewBox="0 0 24 28" className="text-red-400 flex-shrink-0">
                  {/* Base */}
                  <rect x="4" y="12" width="16" height="14" rx="3" fill="currentColor"/>
                  {/* Stick */}
                  <rect x="11" y="6" width="2" height="8" fill="currentColor"/>
                  {/* Ball top */}
                  <circle cx="12" cy="6" r="4" fill="currentColor"/>
                  {/* Buttons */}
                  <circle cx="8" cy="16" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="12" cy="18" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="16" cy="16" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="8" cy="22" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="16" cy="22" r="1.5" fill="white" opacity="0.8"/>
                </svg>
                
                {/* Modern Controller Variant */}
                <svg width="38" height="22" viewBox="0 0 38 22" className="text-cyan-400 flex-shrink-0">
                  {/* Main body */}
                  <path d="M8 6 L30 6 Q34 6 34 10 L34 14 Q34 18 30 18 L8 18 Q4 18 4 14 L4 10 Q4 6 8 6 Z" fill="currentColor"/>
                  {/* Grips */}
                  <ellipse cx="6" cy="15" rx="4" ry="6" fill="currentColor"/>
                  <ellipse cx="32" cy="15" rx="4" ry="6" fill="currentColor"/>
                  {/* Controls */}
                  <circle cx="10" cy="10" r="2" fill="white" opacity="0.6"/>
                  <circle cx="28" cy="10" r="2" fill="white" opacity="0.6"/>
                  <circle cx="15" cy="14" r="1.5" fill="white" opacity="0.6"/>
                  <circle cx="23" cy="14" r="1.5" fill="white" opacity="0.6"/>
                </svg>
                
                {/* Repeat for seamless scrolling */}
                <svg width="36" height="16" viewBox="0 0 36 16" className="text-gray-300 flex-shrink-0">
                  <rect x="2" y="4" width="32" height="8" rx="4" fill="currentColor"/>
                  <rect x="6" y="7" width="4" height="1" fill="white" opacity="0.8"/>
                  <rect x="7.5" y="5.5" width="1" height="4" fill="white" opacity="0.8"/>
                </svg>
              </div>
            </div>
            
            {/* Gaming elements */}
            <div className="flex flex-col items-center justify-center h-full relative z-20 p-4">
              {/* Myria Logo - Actual logo */}
              <div className="mb-4 relative">
                <img 
                  src="https://s2.coinmarketcap.com/static/img/coins/200x200/22289.png"
                  alt="Myria Logo"
                  className="w-16 h-16 object-contain"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 -z-10 blur-md opacity-30">
                  <div className="w-16 h-16 bg-blue-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="text-white text-xl font-bold mb-4 tracking-wider">MYRIA</div>
              <div className="text-blue-200 text-xs font-semibold mb-2 text-center">CONNECTING THE WORLD</div>
              <div className="text-blue-200 text-xs font-semibold mb-4 text-center">THROUGH PLAY</div>
              
              {/* Gaming connection indicators */}
              <div className="flex space-x-2">
                <div className="w-6 h-2 bg-blue-400/60 rounded animate-pulse"></div>
                <div className="w-4 h-2 bg-blue-300/80 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-8 h-2 bg-blue-400/60 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
            </div>
            {/* Gaming pattern */}
            <div className="absolute bottom-4 right-4">
              <svg width="30" height="30">
                <polygon points="15,2 28,8 28,22 15,28 2,22 2,8" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
              </svg>
            </div>
          </div>
        )}

        {project.name === "TEN" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F23] via-[#8B5CF6] to-[#7C3AED] overflow-hidden">
            {/* Scattered Playing Cards Background */}
            <div className="absolute inset-0">
              <style>{`
                .card-container {
                  perspective: 1000px;
                }
                .card-inner {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  transform-style: preserve-3d;
                }
                .card-face {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  backface-visibility: hidden;
                  -webkit-backface-visibility: hidden;
                }
                .card-back {
                  transform: rotateY(180deg);
                }
                @keyframes cardFlip1 {
                  0%, 40% { transform: rotateY(0deg) rotate(12deg); }
                  50%, 90% { transform: rotateY(180deg) rotate(12deg); }
                  100% { transform: rotateY(0deg) rotate(12deg); }
                }
                @keyframes cardFlip2 {
                  0%, 60% { transform: rotateY(0deg) rotate(-6deg); }
                  70%, 95% { transform: rotateY(180deg) rotate(-6deg); }
                  100% { transform: rotateY(0deg) rotate(-6deg); }
                }
                @keyframes cardFlip3 {
                  0%, 20% { transform: rotateY(0deg) rotate(45deg); }
                  30%, 80% { transform: rotateY(180deg) rotate(45deg); }
                  100% { transform: rotateY(0deg) rotate(45deg); }
                }
                @keyframes cardFlip4 {
                  0%, 75% { transform: rotateY(0deg) rotate(-15deg); }
                  85%, 98% { transform: rotateY(180deg) rotate(-15deg); }
                  100% { transform: rotateY(0deg) rotate(-15deg); }
                }
                @keyframes cardFlip5 {
                  0%, 30% { transform: rotateY(0deg) rotate(30deg); }
                  40%, 85% { transform: rotateY(180deg) rotate(30deg); }
                  100% { transform: rotateY(0deg) rotate(30deg); }
                }
                @keyframes cardFlip6 {
                  0%, 50% { transform: rotateY(0deg) rotate(-20deg); }
                  60%, 92% { transform: rotateY(180deg) rotate(-20deg); }
                  100% { transform: rotateY(0deg) rotate(-20deg); }
                }
                @keyframes cardFlip7 {
                  0%, 10% { transform: rotateY(0deg) rotate(75deg); }
                  20%, 70% { transform: rotateY(180deg) rotate(75deg); }
                  100% { transform: rotateY(0deg) rotate(75deg); }
                }
                @keyframes cardFlip8 {
                  0%, 65% { transform: rotateY(0deg) rotate(-35deg); }
                  75%, 88% { transform: rotateY(180deg) rotate(-35deg); }
                  100% { transform: rotateY(0deg) rotate(-35deg); }
                }
                .card-flip-1 .card-inner { animation: cardFlip1 7s infinite ease-in-out; }
                .card-flip-2 .card-inner { animation: cardFlip2 8s infinite ease-in-out; }
                .card-flip-3 .card-inner { animation: cardFlip3 6s infinite ease-in-out; }
                .card-flip-4 .card-inner { animation: cardFlip4 9s infinite ease-in-out; }
                .card-flip-5 .card-inner { animation: cardFlip5 7.5s infinite ease-in-out; }
                .card-flip-6 .card-inner { animation: cardFlip6 8.5s infinite ease-in-out; }
                .card-flip-7 .card-inner { animation: cardFlip7 6.5s infinite ease-in-out; }
                .card-flip-8 .card-inner { animation: cardFlip8 10s infinite ease-in-out; }
              `}</style>
              
              {/* Ace of Spades - Top left */}
              <div className="absolute top-8 left-8 w-10 h-14 card-flip-1 card-container">
                <div className="card-inner">
                  {/* Front face */}
                  <div className="card-face bg-white rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex flex-col items-center justify-between h-full p-1.5 text-black text-xs bg-white">
                      <div className="font-bold text-sm">A</div>
                      <div className="text-lg">♠</div>
                      <div className="font-bold text-sm rotate-180">A</div>
                    </div>
                  </div>
                  {/* Back face */}
                  <div className="card-face card-back bg-purple-800 rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex items-center justify-center h-full bg-purple-800">
                      <div className="w-7 h-10 border-2 border-white rounded-sm bg-purple-700">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* King of Hearts - Top right */}
              <div className="absolute top-10 right-12 w-10 h-14 card-flip-2 card-container">
                <div className="card-inner">
                  <div className="card-face bg-white rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex flex-col items-center justify-between h-full p-1.5 text-red-600 text-xs bg-white">
                      <div className="font-bold text-sm">K</div>
                      <div className="text-lg">♥</div>
                      <div className="font-bold text-sm rotate-180">K</div>
                    </div>
                  </div>
                  <div className="card-face card-back bg-purple-800 rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex items-center justify-center h-full bg-purple-800">
                      <div className="w-7 h-10 border-2 border-white rounded-sm bg-purple-700">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Queen of Diamonds - Left side */}
              <div className="absolute top-16 left-6 w-10 h-14 card-flip-3 card-container">
                <div className="card-inner">
                  <div className="card-face bg-white rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex flex-col items-center justify-between h-full p-1.5 text-red-600 text-xs bg-white">
                      <div className="font-bold text-sm">Q</div>
                      <div className="text-lg">♦</div>
                      <div className="font-bold text-sm rotate-180">Q</div>
                    </div>
                  </div>
                  <div className="card-face card-back bg-purple-800 rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex items-center justify-center h-full bg-purple-800">
                      <div className="w-7 h-10 border-2 border-white rounded-sm bg-purple-700">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Jack of Clubs - Bottom left */}
              <div className="absolute bottom-8 left-10 w-10 h-14 card-flip-4 card-container">
                <div className="card-inner">
                  <div className="card-face bg-white rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex flex-col items-center justify-between h-full p-1.5 text-black text-xs bg-white">
                      <div className="font-bold text-sm">J</div>
                      <div className="text-lg">♣</div>
                      <div className="font-bold text-sm rotate-180">J</div>
                    </div>
                  </div>
                  <div className="card-face card-back bg-purple-800 rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex items-center justify-center h-full bg-purple-800">
                      <div className="w-7 h-10 border-2 border-white rounded-sm bg-purple-700">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ten of Spades - Right side */}
              <div className="absolute top-12 right-6 w-10 h-14 card-flip-5 card-container">
                <div className="card-inner">
                  <div className="card-face bg-white rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex flex-col items-center justify-between h-full p-1.5 text-black text-xs bg-white">
                      <div className="font-bold text-sm">10</div>
                      <div className="text-lg">♠</div>
                      <div className="font-bold text-sm rotate-180">10</div>
                    </div>
                  </div>
                  <div className="card-face card-back bg-purple-800 rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex items-center justify-center h-full bg-purple-800">
                      <div className="w-7 h-10 border-2 border-white rounded-sm bg-purple-700">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ten of Hearts - Bottom right */}
              <div className="absolute bottom-6 right-8 w-10 h-14 card-flip-6 card-container">
                <div className="card-inner">
                  <div className="card-face bg-white rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex flex-col items-center justify-between h-full p-1.5 text-red-600 text-xs bg-white">
                      <div className="font-bold text-sm">10</div>
                      <div className="text-lg">♥</div>
                      <div className="font-bold text-sm rotate-180">10</div>
                    </div>
                  </div>
                  <div className="card-face card-back bg-purple-800 rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex items-center justify-center h-full bg-purple-800">
                      <div className="w-7 h-10 border-2 border-white rounded-sm bg-purple-700">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ten of Diamonds - Center background */}
              <div className="absolute top-12 left-16 w-10 h-14 card-flip-7 card-container">
                <div className="card-inner">
                  <div className="card-face bg-white rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex flex-col items-center justify-between h-full p-1.5 text-red-600 text-xs bg-white">
                      <div className="font-bold text-sm">10</div>
                      <div className="text-lg">♦</div>
                      <div className="font-bold text-sm rotate-180">10</div>
                    </div>
                  </div>
                  <div className="card-face card-back bg-purple-800 rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex items-center justify-center h-full bg-purple-800">
                      <div className="w-7 h-10 border-2 border-white rounded-sm bg-purple-700">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ten of Clubs - Center background */}
              <div className="absolute bottom-12 right-14 w-10 h-14 card-flip-8 card-container">
                <div className="card-inner">
                  <div className="card-face bg-white rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex flex-col items-center justify-between h-full p-1.5 text-black text-xs bg-white">
                      <div className="font-bold text-sm">10</div>
                      <div className="text-lg">♣</div>
                      <div className="font-bold text-sm rotate-180">10</div>
                    </div>
                  </div>
                  <div className="card-face card-back bg-purple-800 rounded border-2 border-gray-300 overflow-hidden shadow-lg">
                    <div className="flex items-center justify-center h-full bg-purple-800">
                      <div className="w-7 h-10 border-2 border-white rounded-sm bg-purple-700">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Privacy visualization */}
            <div className="flex flex-col items-center justify-center h-full relative z-10 p-4">
              <div className="w-20 h-20 border border-[#8B5CF6]/40 rounded-full flex items-center justify-center mb-4 bg-[#8B5CF6]/10">
                <div className="w-12 h-12 border border-[#A78BFA]/60 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#A78BFA] rounded-full"></div>
                </div>
              </div>
              <img 
                src={project.logo} 
                alt="TEN Logo"
                className="h-8 object-contain mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="text-white text-lg font-bold mb-4">TEN</div>
              <div className="text-white text-xs font-semibold mb-2">PRIVACY L2</div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#A78BFA] rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        )}

        {project.name === "WORLD MOBILE" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-4">
            {/* Connectivity visualization */}
            <div className="flex flex-col items-center justify-center h-full">
              {/* Central connectivity hub */}
              <div className="relative mb-4">
                <div className="w-16 h-16 border-2 border-orange-400/50 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-blue-500/20 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-lg shadow-orange-500/30"></div>
                </div>
                {/* Connectivity rings */}
                <div className="absolute inset-0 w-16 h-16 border border-orange-400/30 rounded-full animate-ping"></div>
                <div className="absolute -inset-2 w-20 h-20 border border-blue-400/20 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
                <div className="absolute -inset-4 w-24 h-24 border border-orange-300/10 rounded-full animate-ping" style={{animationDelay: '1.4s'}}></div>
              </div>
              
              <img 
                src={project.logo} 
                alt="World Mobile Logo"
                className="w-12 h-12 object-contain mb-4 rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="text-orange-400 text-xl font-bold mb-4">WORLD MOBILE</div>
              <div className="text-orange-300 text-xs font-semibold mb-2">CONNECTIVITY</div>
              
              {/* Signal strength indicators */}
              <div className="flex space-x-1 mb-2">
                <div className="w-1 h-4 bg-orange-400/60 rounded animate-pulse"></div>
                <div className="w-1 h-6 bg-orange-400/80 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-8 bg-orange-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-6 bg-orange-400/80 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-1 h-4 bg-orange-400/60 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <div className="text-blue-200/60 text-xs">GLOBAL NETWORK</div>
            </div>
            
            {/* Network nodes positioned around the card */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="absolute top-8 left-8 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
            <div className="absolute bottom-6 right-6 w-1 h-1 bg-orange-300 rounded-full animate-pulse" style={{animationDelay: '1.6s'}}></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400/70 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            
            {/* Connection lines */}
            <div className="absolute top-6 left-6 w-8 h-px bg-gradient-to-r from-orange-400/40 to-transparent rotate-45"></div>
            <div className="absolute bottom-8 right-8 w-6 h-px bg-gradient-to-l from-blue-400/30 to-transparent -rotate-45"></div>
          </div>
        )}

        {project.name === "MINUTES NETWORK" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1426] via-[#1E3A8A] to-[#1E40AF] p-4">
            {/* Telecommunications visualization */}
            <div className="flex flex-col items-center justify-center h-full">
              {/* Signal tower visualization */}
              <div className="relative mb-4">
                <div className="w-16 h-16 border-2 border-white/30 rounded-lg flex items-center justify-center bg-white/10 relative">
                  <div className="w-8 h-8 bg-gradient-to-t from-blue-400 to-blue-200 rounded"></div>
                  {/* Radio waves */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-3 bg-white/80 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-300 rounded-full mt-1 animate-ping"></div>
                  </div>
                </div>
                {/* Signal emissions */}
                <div className="absolute -top-2 -left-2 w-20 h-20 border border-blue-300/20 rounded-full animate-ping"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 border border-blue-400/10 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
              
              <img 
                src={project.logo} 
                alt="Minutes Network Logo"
                className="h-10 object-contain mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="text-white text-lg font-bold mb-4">MINUTES NETWORK</div>
              <div className="text-blue-200 text-xs font-semibold mb-2">TELECOM DEPIN</div>
              
              {/* Network activity indicators */}
              <div className="flex space-x-1 mb-2">
                <div className="w-8 h-1 bg-blue-400 rounded animate-pulse"></div>
                <div className="w-6 h-1 bg-blue-300 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-4 h-1 bg-blue-200 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <div className="text-white/60 text-xs">EVERY MINUTE COUNTS</div>
            </div>
            
            {/* Network nodes */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
            
            {/* Data flow visualization */}
            <div className="absolute bottom-4 right-4 flex space-x-1">
              <div className="w-1 h-6 bg-blue-400/40 rounded animate-pulse"></div>
              <div className="w-1 h-8 bg-blue-300/60 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="w-1 h-4 bg-blue-200/80 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
        )}

        {project.name === "MULTISYNQ" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-4 overflow-hidden">
            {/* Synchronized bouncing objects */}
            <div className="absolute inset-0">
              <style>{`
                @keyframes syncMove {
                  0% { transform: translate(0, 0) scale(1); }
                  25% { transform: translate(15px, -15px) scale(1.1); }
                  50% { transform: translate(0, -30px) scale(1); }
                  75% { transform: translate(-15px, -15px) scale(1.1); }
                  100% { transform: translate(0, 0) scale(1); }
                }
                @keyframes syncMoveReverse {
                  0% { transform: translate(0, 0) scale(1); }
                  25% { transform: translate(-15px, -15px) scale(1.1); }
                  50% { transform: translate(0, -30px) scale(1); }
                  75% { transform: translate(15px, -15px) scale(1.1); }
                  100% { transform: translate(0, 0) scale(1); }
                }
                .sync-move {
                  animation: syncMove 3s ease-in-out infinite;
                }
                .sync-move-reverse {
                  animation: syncMoveReverse 3s ease-in-out infinite;
                }
              `}</style>
              
              {/* Object 1 - Top Left */}
              <div className="absolute w-3 h-3 bg-indigo-400 rounded-full sync-move" 
                   style={{
                     top: '15%', 
                     left: '15%'
                   }}></div>
              
              {/* Object 2 - Top Right (mirrored) */}
              <div className="absolute w-3 h-3 bg-purple-400 rounded-full sync-move-reverse" 
                   style={{
                     top: '15%', 
                     right: '15%'
                   }}></div>
              
              {/* Object 3 - Bottom Left (mirrored) */}
              <div className="absolute w-3 h-3 bg-purple-400 rounded-full sync-move-reverse" 
                   style={{
                     bottom: '15%', 
                     left: '15%'
                   }}></div>
              
              {/* Object 4 - Bottom Right (mirrored) */}
              <div className="absolute w-3 h-3 bg-indigo-400 rounded-full sync-move" 
                   style={{
                     bottom: '15%', 
                     right: '15%'
                   }}></div>
            </div>
            
            {/* Synchronization visualization */}
            <div className="flex flex-col items-center justify-center h-full relative z-10">
              <img 
                src={project.logo} 
                alt="MultiSynq Logo"
                className="h-8 object-contain mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="text-indigo-300 text-lg font-bold mb-4">MULTISYNQ</div>
              <div className="text-indigo-200 text-xs font-semibold mb-2">DEPIN SYNC</div>
              
              {/* Sync activity */}
              <div className="flex space-x-1 mb-2">
                <div className="w-6 h-1 bg-indigo-400 rounded animate-pulse"></div>
                <div className="w-4 h-1 bg-purple-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-8 h-1 bg-indigo-300 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <div className="text-purple-200/60 text-xs">15-30MS LATENCY</div>
            </div>
          </div>
        )}

        {project.name === "CREDBULL" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] p-4 overflow-hidden">
            {/* Raining golden coins */}
            <div className="absolute inset-0">
              <style>{`
                @keyframes fall {
                  0% { transform: translateY(-100px); opacity: 1; }
                  100% { transform: translateY(300px); opacity: 0; }
                }
                .coin-fall {
                  animation: fall linear infinite;
                }
              `}</style>
              
              {/* Coin 1 */}
              <div className="absolute w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg coin-fall" 
                   style={{
                     top: '-20px', 
                     left: '15%',
                     animationDuration: '4s',
                     animationDelay: '0s'
                   }}></div>
              
              {/* Coin 2 */}
              <div className="absolute w-2 h-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg coin-fall" 
                   style={{
                     top: '-20px', 
                     left: '35%',
                     animationDuration: '3.5s',
                     animationDelay: '0.8s'
                   }}></div>
              
              {/* Coin 3 */}
              <div className="absolute w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg coin-fall" 
                   style={{
                     top: '-20px', 
                     left: '60%',
                     animationDuration: '4.2s',
                     animationDelay: '1.5s'
                   }}></div>
              
              {/* Coin 4 */}
              <div className="absolute w-2 h-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg coin-fall" 
                   style={{
                     top: '-20px', 
                     left: '80%',
                     animationDuration: '3.8s',
                     animationDelay: '2.2s'
                   }}></div>
              
              {/* Coin 5 */}
              <div className="absolute w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg coin-fall" 
                   style={{
                     top: '-20px', 
                     left: '25%',
                     animationDuration: '4.5s',
                     animationDelay: '3s'
                   }}></div>
              
              {/* Coin 6 */}
              <div className="absolute w-2 h-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg coin-fall" 
                   style={{
                     top: '-20px', 
                     left: '70%',
                     animationDuration: '3.3s',
                     animationDelay: '3.8s'
                   }}></div>
              
              {/* Coin 7 */}
              <div className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg coin-fall" 
                   style={{
                     top: '-20px', 
                     left: '10%',
                     animationDuration: '4.1s',
                     animationDelay: '4.5s'
                   }}></div>
              
              {/* Coin 8 */}
              <div className="absolute w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg coin-fall" 
                   style={{
                     top: '-20px', 
                     left: '85%',
                     animationDuration: '3.7s',
                     animationDelay: '5.2s'
                   }}></div>
            </div>
            
            {/* Financial visualization */}
            <div className="flex flex-col items-center justify-center h-full relative z-10">
              <img 
                src={project.logo} 
                alt="CredBull Logo"
                className="h-8 object-contain mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="text-emerald-300 text-lg font-bold mb-4">CREDBULL</div>
              <div className="text-emerald-200 text-xs font-semibold mb-2">STABLE YIELD</div>
              
              {/* Yield bars */}
              <div className="flex space-x-1 mb-2">
                <div className="w-1 h-6 bg-emerald-400 rounded animate-pulse"></div>
                <div className="w-1 h-8 bg-emerald-300 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-5 bg-green-400 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <div className="w-1 h-7 bg-emerald-400 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
              <div className="text-green-200/60 text-xs">RWA YIELDS</div>
            </div>
          </div>
        )}

        {project.name === "PANGEA" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] overflow-hidden">
            {/* Animated Continent Background */}
            <div className="absolute inset-0">
              <style>{`
                @keyframes continentPulse {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 0.5; transform: scale(1.02); }
                }
                @keyframes dataFlow {
                  0% { opacity: 0; transform: scale(0.5); }
                  50% { opacity: 1; transform: scale(1); }
                  100% { opacity: 0; transform: scale(0.5); }
                }
                .continent-shape {
                  clip-path: polygon(
                    15% 25%, 25% 15%, 45% 20%, 65% 10%, 80% 25%, 
                    90% 45%, 85% 65%, 75% 80%, 55% 85%, 35% 75%, 
                    20% 60%, 10% 45%
                  );
                  animation: continentPulse 4s ease-in-out infinite;
                }
                .data-node {
                  animation: dataFlow 3s ease-in-out infinite;
                }
                .data-node-1 { animation-delay: 0s; }
                .data-node-2 { animation-delay: 0.5s; }
                .data-node-3 { animation-delay: 1s; }
                .data-node-4 { animation-delay: 1.5s; }
                .data-node-5 { animation-delay: 2s; }
                .data-node-6 { animation-delay: 2.5s; }
              `}</style>
              
              {/* Continent Silhouette */}
              <div className="continent-shape absolute inset-8 bg-gradient-to-br from-emerald-400/20 to-teal-500/30 backdrop-blur-sm"></div>
              
              {/* Data Connection Nodes */}
              <div className="absolute top-12 left-12 w-2 h-2 bg-emerald-400 rounded-full data-node data-node-1 shadow-lg shadow-emerald-400/50"></div>
              <div className="absolute top-16 right-16 w-1.5 h-1.5 bg-teal-300 rounded-full data-node data-node-2 shadow-lg shadow-teal-300/50"></div>
              <div className="absolute bottom-20 left-20 w-2 h-2 bg-emerald-500 rounded-full data-node data-node-3 shadow-lg shadow-emerald-500/50"></div>
              <div className="absolute bottom-16 right-20 w-1.5 h-1.5 bg-teal-400 rounded-full data-node data-node-4 shadow-lg shadow-teal-400/50"></div>
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-emerald-300 rounded-full data-node data-node-5"></div>
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-teal-500 rounded-full data-node data-node-6"></div>
              
              {/* Network Connection Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <line x1="15%" y1="30%" x2="35%" y2="45%" stroke="#34D399" strokeWidth="1" strokeDasharray="2,4">
                  <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                </line>
                <line x1="65%" y1="25%" x2="75%" y2="60%" stroke="#10B981" strokeWidth="1" strokeDasharray="2,4">
                  <animate attributeName="stroke-dashoffset" values="0;10" dur="2.5s" repeatCount="indefinite"/>
                </line>
                <line x1="25%" y1="70%" x2="70%" y2="55%" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="2,4">
                  <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite"/>
                </line>
              </svg>
            </div>
            
            {/* Content Overlay */}
            <div className="flex flex-col items-center justify-center h-full relative z-10 p-4">
              {/* 90MS Latency Hero Metric */}
              <div className="text-emerald-300 text-xl font-bold mb-3 tracking-wider">90MS LATENCY</div>
              
              {/* Pangea Logo - Made larger and more prominent */}
              <img 
                src={project.logo} 
                alt="Pangea Logo"
                className="h-12 w-auto object-contain mb-3"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="text-emerald-300 text-xl font-bold mb-3">PANGEA</div>
              
              {/* Data Sync Tagline */}
              <div className="text-teal-200 text-sm font-semibold mb-2">DATA SYNC</div>
              
              {/* Real-time Data Indicators */}
              <div className="flex space-x-1 mb-2">
                <div className="w-6 h-1 bg-emerald-400/60 rounded animate-pulse"></div>
                <div className="w-4 h-1 bg-teal-400/80 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-8 h-1 bg-emerald-400/60 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
              
              {/* Data Network Category */}
              <div className="text-teal-300/80 text-xs">DATA NETWORK</div>
            </div>
            
            {/* Performance Metrics */}
            <div className="absolute bottom-4 right-4 text-right">
              <div className="text-emerald-300 text-xs font-bold">533K TPS</div>
              <div className="text-teal-400 text-xs">INDEXING</div>
            </div>
            
            {/* Network Status Indicator */}
            <div className="absolute top-4 right-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
            </div>
          </div>
        )}

        {project.name === "SPHINX" && (
          <div className="absolute inset-0 bg-[#000000] overflow-hidden rounded-3xl">
            {/* Extended Full Card Infinity Mirror Background */}
            <div className="absolute inset-0">
              {/* Multiple layers creating deeper infinite depth across entire card */}
              <div className="absolute inset-1 border-2 border-cyan-400/70 rounded-3xl animate-pulse shadow-2xl shadow-cyan-400/50"></div>
              <div className="absolute inset-2 border-2 border-cyan-400/65 rounded-3xl animate-pulse shadow-2xl shadow-cyan-400/45" style={{animationDelay: '0.1s'}}></div>
              <div className="absolute inset-3 border-2 border-cyan-400/60 rounded-3xl animate-pulse shadow-xl shadow-cyan-400/40" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute inset-4 border-2 border-cyan-400/55 rounded-3xl animate-pulse shadow-xl shadow-cyan-400/35" style={{animationDelay: '0.3s'}}></div>
              <div className="absolute inset-5 border border-cyan-300/50 rounded-3xl animate-pulse shadow-lg shadow-cyan-300/30" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute inset-6 border border-cyan-300/45 rounded-3xl animate-pulse shadow-lg shadow-cyan-300/28" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute inset-7 border border-cyan-300/40 rounded-2xl animate-pulse shadow-md shadow-cyan-300/25" style={{animationDelay: '0.6s'}}></div>
              <div className="absolute inset-8 border border-cyan-300/35 rounded-2xl animate-pulse shadow-md shadow-cyan-300/22" style={{animationDelay: '0.7s'}}></div>
              <div className="absolute inset-9 border border-cyan-200/35 rounded-2xl animate-pulse shadow-sm shadow-cyan-200/20" style={{animationDelay: '0.8s'}}></div>
              <div className="absolute inset-10 border border-cyan-200/30 rounded-2xl animate-pulse shadow-sm shadow-cyan-200/18" style={{animationDelay: '0.9s'}}></div>
              <div className="absolute inset-11 border border-cyan-200/28 rounded-xl animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute inset-12 border border-cyan-200/25 rounded-xl animate-pulse" style={{animationDelay: '1.1s'}}></div>
              <div className="absolute inset-13 border border-cyan-100/25 rounded-xl animate-pulse" style={{animationDelay: '1.2s'}}></div>
              <div className="absolute inset-14 border border-cyan-100/22 rounded-xl animate-pulse" style={{animationDelay: '1.3s'}}></div>
              <div className="absolute inset-15 border border-cyan-100/20 rounded-lg animate-pulse" style={{animationDelay: '1.4s'}}></div>
              <div className="absolute inset-16 border border-cyan-100/18 rounded-lg animate-pulse" style={{animationDelay: '1.5s'}}></div>
              <div className="absolute inset-17 border border-cyan-50/15 rounded-lg animate-pulse" style={{animationDelay: '1.6s'}}></div>
              <div className="absolute inset-18 border border-cyan-50/12 rounded-lg animate-pulse" style={{animationDelay: '1.7s'}}></div>
              <div className="absolute inset-19 border border-cyan-50/10 rounded animate-pulse" style={{animationDelay: '1.8s'}}></div>
              <div className="absolute inset-20 border border-cyan-50/8 rounded animate-pulse" style={{animationDelay: '1.9s'}}></div>
              <div className="absolute inset-21 border border-cyan-50/6 rounded animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="absolute inset-22 border border-cyan-50/4 rounded animate-pulse" style={{animationDelay: '2.1s'}}></div>
              
            </div>
            
            {/* Content overlay with centered logo */}
            <div className="relative z-10 h-full">
              {/* Centered SPHINX logo - Mobile responsive sizing */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={project.logo} 
                  alt="Sphinx Logo"
                  className="object-contain filter brightness-0 invert sphinx-logo-mobile"
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(58%) sepia(69%) saturate(4284%) hue-rotate(160deg) brightness(101%) contrast(101%)'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'block';
                  }}
                />
                <div style={{display: 'none'}} className="text-cyan-300 text-xl font-bold tracking-wider">SPHINX</div>
              </div>
              
              {/* Animated Trading Chart - full width at bottom */}
              <div className="absolute bottom-8 left-0 right-0">
                <SphinxTradingChart />
              </div>
              
              {/* 24/7 CLEARING text - positioned at very bottom */}
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <div className="text-cyan-300 text-xs">24/7 CLEARING</div>
              </div>
            </div>
            
            {/* Trading pattern */}
            <div className="absolute bottom-4 right-4 opacity-30">
              <svg width="40" height="40">
                <path d="M5 35 Q15 25 25 30 T45 25" stroke="#00D4FF" strokeWidth="2" fill="none" />
                <circle cx="15" cy="30" r="1" fill="#00D4FF" />
                <circle cx="35" cy="25" r="1" fill="#00D4FF" />
              </svg>
            </div>
          </div>
        )}

        {/* Default layout for projects without specific designs */}
        {!["SUPRA", "GUNZILLA", "MASSA", "REDBELLY", "MYRIA", "TEN", "WORLD MOBILE", "MINUTES NETWORK", "MULTISYNQ", "CREDBULL", "SPHINX", "CHIRP", "PANGEA"].includes(project.name) && (
          <div 
            className="absolute inset-0 p-4"
            style={{ 
              background: `linear-gradient(135deg, ${project.websiteColors.background} 0%, ${project.websiteColors.primary}20 100%)` 
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <img 
                src={project.logo} 
                alt={`${project.name} Logo`}
                className="h-6 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="text-white text-xs font-bold">{project.name}</div>
              <div 
                className="text-xs font-bold"
                style={{ color: project.websiteColors.primary }}
              >
                {project.category.toUpperCase()}
              </div>
            </div>
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 border"
                  style={{ 
                    backgroundColor: `${project.websiteColors.primary}20`,
                    borderColor: `${project.websiteColors.primary}40`
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: project.websiteColors.primary }}
                  />
                </div>
                <div 
                  className="text-xs font-semibold"
                  style={{ color: project.websiteColors.primary }}
                >
                  {project.description.split(' ').slice(0, 3).join(' ').toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Website frame effect */}
        <div className="absolute inset-0 border-2 border-white/20 rounded-3xl pointer-events-none" />
        
        {/* Browser-like top bar */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-sm rounded-t-3xl flex items-center px-4 space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-space text-lg font-bold text-white">{project.name}</h3>
          <div 
            className="px-2 py-1 rounded-full text-xs font-bold text-white"
            style={{ 
              backgroundColor: project.type === 'Investment' ? '#10B981' : '#3B82F6' 
            }}
          >
            {project.type.toUpperCase()}
          </div>
        </div>
        <p className="text-sm text-white/70 mb-3 line-clamp-2">{project.description}</p>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal();
            }}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: `${project.websiteColors.primary}30`,
              border: `1px solid ${project.websiteColors.primary}50`
            }}
          >
            Learn More
          </button>
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="py-2 px-3 rounded-lg text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      
    </motion.div>
  );
}

// Project Modal Component
function ProjectModal({ project, isOpen, onClose }: { 
  project: typeof projects[0] | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!project || !isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="glass-morphism rounded-3xl max-w-2xl w-full p-8 border border-white/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(135deg, ${project.websiteColors.primary}15 0%, ${project.websiteColors.secondary}10 100%)`
        }}
      >
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 mr-6 shadow-lg">
            <img 
              src={project.logo} 
              alt={`${project.name} Logo`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.style.display = 'block';
              }}
            />
            <div 
              className="w-full h-full rounded-lg flex items-center justify-center text-2xl font-bold"
              style={{ 
                color: project.websiteColors.primary,
                display: 'none'
              }}
            >
              {project.name.slice(0, 2)}
            </div>
          </div>
          <div>
            <h3 className="font-space text-3xl font-bold mb-2">{project.name}</h3>
            <div className="flex items-center space-x-4">
              <div 
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white border"
                style={{ 
                  backgroundColor: `${project.websiteColors.primary}30`,
                  borderColor: `${project.websiteColors.primary}50`
                }}
              >
                {project.category}
              </div>
              <div 
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ 
                  backgroundColor: project.type === 'Investment' ? '#10B981' : '#3B82F6' 
                }}
              >
                {project.type.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-lg mb-8 leading-relaxed text-white/90">
          {project.details}
        </p>
        
        <div className="flex space-x-4">
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg border text-white"
            style={{ 
              backgroundColor: `${project.websiteColors.primary}30`,
              borderColor: `${project.websiteColors.primary}50`
            }}
          >
            <Globe className="w-5 h-5 mr-2" />
            Visit Website
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold hover:scale-105 hover:bg-white/30 transition-all duration-300 shadow-lg"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioSection() {
  const [modalProject, setModalProject] = useState<typeof projects[0] | null>(null);

  const investments = projects.filter(p => p.type === 'Investment');
  const partnerships = projects.filter(p => p.type === 'Partnership');

  return (
    <section id="portfolio" className="py-32 relative overflow-hidden">
      {/* Space Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1614850715649-1d0106293bd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380')",
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
          <h2 className="font-space text-5xl font-bold text-gradient mb-6">WEBSITE PORTAL GALLERY</h2>
          <p className="font-inter text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Look through mini windows into each project's actual website. These authentic portals showcase 
            the real branding and aesthetics of our portfolio companies.
          </p>
        </motion.div>

        {/* All Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <WebsitePortalCard
              key={project.name}
              project={project}
              index={index}
              onOpenModal={() => setModalProject(project)}
            />
          ))}
        </div>


      </div>

      {/* Project Modal */}
      <ProjectModal 
        project={modalProject} 
        isOpen={!!modalProject} 
        onClose={() => setModalProject(null)} 
      />
    </section>
  );
}