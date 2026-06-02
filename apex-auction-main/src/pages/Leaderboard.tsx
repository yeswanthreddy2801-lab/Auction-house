import { useAuctionWinners } from "@/hooks/useAuctionWinners";
import { Trophy, Crown, Medal, Award } from "lucide-react";
import { motion } from "framer-motion";

const rankIcons = [Crown, Medal, Award];

const Leaderboard = () => {
  const { data: winners = [], isLoading, isError } = useAuctionWinners();
  const sorted = [...winners].sort((a, b) => b.finalPrice - a.finalPrice);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center">
        <p className="text-base text-foreground">Loading leaderboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center">
        <p className="text-base text-destructive">Unable to load leaderboard. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10 space-y-2 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <Trophy size={14} className="text-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">Auction Winners</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground text-sm">Recent auctions completed with top bids and winners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {sorted.slice(0, 3).map((auction, index) => {
            const Icon = rankIcons[index] ?? Trophy;
            return (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                className={`glass rounded-xl p-5 text-center ${index === 0 ? 'border border-gold/30 shadow-lg' : ''}`}
              >
                <Icon size={24} className={index === 0 ? 'text-gold mx-auto mb-3' : 'text-muted-foreground mx-auto mb-3'} />
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Rank {index + 1}</p>
                <h2 className="font-semibold text-lg text-foreground mb-2 truncate">{auction.title}</h2>
                <p className="text-sm text-muted-foreground mb-3">Winner: {auction.winnerName}</p>
                <p className="text-2xl font-bold text-foreground">${auction.finalPrice.toLocaleString()}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">Sold on {new Date(auction.endTime).toLocaleDateString()}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="glass rounded-xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border/30">
            <span>Rank</span>
            <span>Item</span>
            <span>Winner</span>
            <span>Final Price</span>
          </div>
          {sorted.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No finished auctions yet.</div>
          ) : (
            sorted.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-4 items-center hover:bg-muted/10 transition-colors border-b border-border/10 last:border-0"
              >
                <span className={`text-sm font-bold w-8 ${index < 3 ? 'text-gold' : 'text-muted-foreground'}`}>#{index + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground truncate">{auction.title}</p>
                  <p className="text-[11px] text-muted-foreground">Seller: {auction.sellerName}</p>
                </div>
                <p className="text-sm text-foreground">{auction.winnerName}</p>
                <p className="text-sm font-semibold text-foreground">${auction.finalPrice.toLocaleString()}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
