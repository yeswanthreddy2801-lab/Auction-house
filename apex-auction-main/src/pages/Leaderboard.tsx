import { mockUsers } from "@/data/mockData";
import ReputationBadge from "@/components/ReputationBadge";
import { Trophy, MessageCircle, Crown, Medal, Award } from "lucide-react";
import { motion } from "framer-motion";

const rankIcons = [Crown, Medal, Award];

const Leaderboard = () => {
  const sorted = [...mockUsers].sort((a, b) => b.reputationPoints - a.reputationPoints);

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10 space-y-2 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <Trophy size={14} className="text-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">Elite Rankings</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground text-sm">Top performers ranked by reputation & wins</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
          {[sorted[1], sorted[0], sorted[2]].map((user, i) => {
            const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
            const Icon = rankIcons[rank - 1];
            const isFirst = rank === 1;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`glass rounded-xl p-4 md:p-6 text-center relative ${
                  isFirst ? "gold-glow -mt-4 md:-mt-8" : ""
                }`}
              >
                <Icon size={isFirst ? 28 : 20} className={isFirst ? "text-gold mx-auto mb-2" : "text-muted-foreground mx-auto mb-2"} />
                <div className={`mx-auto flex items-center justify-center rounded-full ${
                  isFirst ? "h-16 w-16 md:h-20 md:w-20 bg-secondary" : "h-12 w-12 md:h-14 md:w-14 bg-muted"
                } font-bold text-lg mb-3`}>
                  <span className={isFirst ? "text-secondary-foreground" : "text-foreground"}>{user.avatar}</span>
                </div>
                <p className="font-display font-semibold text-foreground text-sm md:text-base">{user.name}</p>
                <div className="mt-2 flex justify-center">
                  <ReputationBadge points={user.reputationPoints} size={isFirst ? "md" : "sm"} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">{user.totalWins}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Wins</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{user.totalBids}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Bids</p>
                  </div>
                </div>
                <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Full List */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border/30">
            <span>Rank</span>
            <span>Bidder</span>
            <span className="hidden md:block">Status</span>
            <span>Wins</span>
            <span>Reputation</span>
            <span></span>
          </div>
          {sorted.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors border-b border-border/10 last:border-0"
            >
              <span className={`text-sm font-bold w-8 ${i < 3 ? "text-gold" : "text-muted-foreground"}`}>
                #{i + 1}
              </span>
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground flex-shrink-0">
                  {user.avatar}
                </div>
                <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${user.isOnline ? "bg-primary" : "bg-muted-foreground"}`} />
                <span className="text-xs text-muted-foreground">{user.isOnline ? "Online" : "Offline"}</span>
              </div>
              <span className="text-sm font-semibold text-foreground text-center">{user.totalWins}</span>
              <ReputationBadge points={user.reputationPoints} size="sm" />
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
