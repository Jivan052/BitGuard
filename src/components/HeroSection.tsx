import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bitcoin, TrendingUp, Shield, Lock, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Bitcoin price on component mount
  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
        );
        if (response.ok) {
          const data = await response.json();
          setCurrentPrice(data.bitcoin.usd);
          setPriceChange(data.bitcoin.usd_24h_change);
        }
      } catch (error) {
        console.error("Failed to fetch Bitcoin price:", error);
      }
    };
    
    fetchBitcoinPrice();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Enhanced background elements */}
      <div 
        className="absolute inset-0 overflow-hidden" 
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <div className="absolute -inset-[10px] bg-[radial-gradient(circle_at_top_right,_#F7931A40,_transparent_40%)]"></div>
        <div className="absolute -inset-[10px] bg-[radial-gradient(circle_at_bottom_left,_#F7931A30,_transparent 35%)]"></div>
        <div className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      {/* Floating Bitcoin icons with improved animation */}
      <div className="absolute top-1/4 left-1/5 animate-float-slow opacity-10">
        <Bitcoin size={70} className="text-primary" />
      </div>
      <div className="absolute bottom-1/3 right-1/5 animate-float opacity-10" style={{animationDelay: "1.2s", animationDuration: "8s"}}>
        <Bitcoin size={50} className="text-primary" />
      </div>
      <div className="absolute top-2/3 left-1/3 animate-float-slow opacity-10" style={{animationDelay: "2.5s"}}>
        <Bitcoin size={35} className="text-primary" />
      </div>
      <div className="absolute bottom-1/4 right-1/3 animate-float opacity-10" style={{animationDelay: "3.8s"}}>
        <Bitcoin size={25} className="text-primary" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="w-full md:w-1/2 mb-10 md:mb-0" variants={itemVariants}>
            <div className=" mt-20 inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium mt-45">
              <Star size={14} className="mr-1 animate-pulse" />
              <span >Bitcoin Guardian Protocol</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              <span className="gradient-text">Protect</span> Your Bitcoin with{" "}
              <span className="gradient-text">AI Intelligence</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              BitGuardian leverages advanced AI algorithms to help you make smarter Bitcoin investment decisions with real-time analysis, fraud detection, and personalized recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="btn-primary w-full font-medium group">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/bitcoin-info" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full font-medium">
                  View Bitcoin Analysis
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden shadow-sm">
                    <div className={cn(
                      "w-full h-full bg-gradient-to-br",
                      i % 2 === 0 ? "from-blue-500/80 to-indigo-600/80" : "from-primary/80 to-amber-600/80"
                    )}></div>
                  </div>
                ))}
              </div>
              <p className="ml-0 sm:ml-4 text-sm text-muted-foreground">
                Joined by <span className="font-medium text-foreground"></span> Bitcoin investors worldwide
              </p>
            </div>
            
            <div className="hidden sm:flex items-center gap-8 mt-8">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">Advanced Security</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">Privacy Focused</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">Real-time Analysis</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2 flex justify-center md:justify-end"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-md">
              {/* Main card with enhanced glass effect */}
              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm animate-glow border border-white/10">
                <div className="aspect-video w-full bg-card/80 flex flex-col items-center justify-center relative overflow-hidden p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                  <Bitcoin size={100} className="text-primary opacity-20 mb-4" />
                  <div className="text-center z-10">
                    <h3 className="text-3xl font-bold mb-2">BitGuardian</h3>
                    <p className="text-muted-foreground">AI-Powered Protection</p>
                    
                    <div className="mt-6 pt-6 border-t border-primary/10 w-full">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Bitcoin Price</span>
                        <div className="text-right">
                          {currentPrice ? (
                            <span className="font-bold">
                              ${currentPrice.toLocaleString()}
                            </span>
                          ) : (
                            <div className="h-5 w-20 bg-muted/40 rounded animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced floating cards */}
              <motion.div
                className="absolute -left-8 -bottom-10 transform rotate-6 glass-card p-4 rounded-lg shadow-lg max-w-[180px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                    <TrendingUp size={16} className={priceChange && priceChange > 0 ? "text-green-500" : "text-red-500"} />
                  </div>
                  <div className="text-sm">
                    {priceChange ? (
                      <>
                        <p className={`font-medium ${priceChange > 0 ? "text-green-500" : "text-red-500"}`}>
                          {priceChange > 0 ? "+" : ""}{priceChange.toFixed(2)}%
                        </p>
                        <p className="text-xs text-muted-foreground">24h change</p>
                      </>
                    ) : (
                      <>
                        <div className="h-3 w-16 bg-muted/40 rounded animate-pulse mb-1"></div>
                        <div className="h-2 w-12 bg-muted/30 rounded animate-pulse"></div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -left-20 top-9 transform -rotate-3 glass-card p-4 rounded-lg shadow-lg max-w-[180px]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="text-sm">
                  <div className="flex items-center justify-between ">
                    <p className="text-primary font-medium ">Risk Assessment</p>
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Low</span>
                  </div>
                  <div className="w-full bg-muted/30 h-2 rounded-full mt-2">
                    <div className="bg-green-500 w-1/3 h-full rounded-full"></div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -right-5 bottom-20 transform rotate-12 glass-card py-2 px-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-primary mr-2" />
                  <p className="text-xs font-medium">Protected</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
