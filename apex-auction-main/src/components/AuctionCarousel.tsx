import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockAuctions, formatCurrency, type AuctionItem } from "@/data/mockData";
import CountdownTimer from "./CountdownTimer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import hero1 from "@/assets/auction-hero-1.jpg";
import hero2 from "@/assets/auction-hero-2.jpg";
import hero3 from "@/assets/auction-hero-3.jpg";
import hero4 from "@/assets/auction-hero-4.jpg";
import hero5 from "@/assets/auction-hero-5.jpg";
import hero6 from "@/assets/auction-hero-6.jpg";

import { useHomeProducts } from "@/hooks/useProducts";

const auctionImages = [hero1, hero2, hero3, hero4, hero5, hero6];

const AuctionCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { data: items = [], isLoading, error } = useHomeProducts();

  const next = useCallback(() => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, items.length]);

  const getVisibleItems = (): AuctionItem[] => {
    if (items.length === 0) return [];
    if (items.length === 1) return [items[0]];
    if (items.length === 2) return [items[1], items[0], items[1]];

    const result: AuctionItem[] = [];
    for (let i = -1; i <= 1; i++) {
      const idx = (currentIndex + i + items.length) % items.length;
      result.push(items[idx]);
    }
    return result;
  };

  const handleBid = (item: AuctionItem) => {
    if (!isLoggedIn) {
      navigate("/auth");
    } else if (item.status === "live") {
      navigate("/live");
    }
  };

  if (isLoading) return <div className="w-full h-96 flex items-center justify-center"><p className="text-muted-foreground animate-pulse">Loading auctions...</p></div>;
  if (error) return <div className="w-full text-center py-10"><p className="text-red-400">Failed to load auctions</p></div>;
  if (items.length === 0) return <div className="w-full text-center py-10"><p className="text-muted-foreground">No active auctions at the moment</p></div>;

  return (
    <div className="relative w-full">
      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 glass rounded-full p-2 text-foreground hover:bg-muted transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 glass rounded-full p-2 text-foreground hover:bg-muted transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Cards */}
      <div className="flex justify-center gap-4 md:gap-6 px-12 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {getVisibleItems().map((item, i) => (
            <motion.div
              key={item.id + "-" + i}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{
                opacity: i === 1 ? 1 : 0.6,
                scale: i === 1 ? 1 : 0.92,
                x: 0,
              }}
              exit={{ opacity: 0, scale: 0.9, x: -50 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`glass glow-card rounded-xl overflow-hidden flex-shrink-0 w-full max-w-[350px] ${i === 1 ? "gold-glow" : ""
                }`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.images && item.images.length > 0 ? (item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000/${item.images[0]}`) : auctionImages[item.imageIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                {item.status === "live" && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                    LIVE
                  </div>
                )}
                <div className="absolute top-3 right-3 text-xs glass rounded-full px-2 py-0.5 text-muted-foreground">
                  {item.category}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-display font-semibold text-foreground text-sm leading-tight line-clamp-2">
                  {item.title}
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Seller Price</p>
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(item.sellerPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Starting Bid</p>
                    <p className="text-sm font-semibold text-gold">{formatCurrency(item.startingBid)}</p>
                  </div>
                </div>

                {item.currentBid > 0 && (
                  <div className="glass rounded-lg p-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Bid</p>
                    <p className="text-lg font-bold text-primary">{formatCurrency(item.currentBid)}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <CountdownTimer endTime={item.endTime} />
                  <span className="text-[10px] text-muted-foreground">{item.totalBids} bids</span>
                </div>

                <button
                  onClick={() => handleBid(item)}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all gradient-gold text-secondary-foreground hover:opacity-90 gold-glow"
                >
                  Place Bid
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-8 bg-secondary" : "w-1.5 bg-border"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AuctionCarousel;
