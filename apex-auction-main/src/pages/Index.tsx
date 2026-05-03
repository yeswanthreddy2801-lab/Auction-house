import AuctionCarousel from "@/components/AuctionCarousel";
import { Gavel, Shield, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/30" />
        <div className="relative container mx-auto text-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Live Auctions Available</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
            The Premier
            <span className="block text-gold">Luxury Auction House</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Bid on the world's most exclusive assets. Watches, art, automobiles, and rare collectibles — 
            secured by reputation, powered by trust.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <AuctionCarousel />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Reputation Protected",
                desc: "Every bidder carries a reputation score. Verified trust, real accountability.",
              },
              {
                icon: Zap,
                title: "Real-Time Bidding",
                desc: "Live countdown, instant bid updates, competitive intensity at its finest.",
              },
              {
                icon: Trophy,
                title: "Elite Deal Rooms",
                desc: "Winners unlock private negotiation spaces with sellers for secure transactions.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 glow-card hover:gold-glow transition-all duration-500"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 mb-4">
                  <feature.icon size={20} className="text-gold" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-t border-border/20">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "$48M+", label: "Total Volume" },
              { value: "2,400+", label: "Active Bidders" },
              { value: "156", label: "Lots Sold" },
              { value: "99.2%", label: "Trust Score" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/20">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display text-sm font-bold">
            <Gavel size={16} className="text-gold" />
            <span>VAULT</span>
            <span className="text-gold text-xs font-normal tracking-widest">AUCTION</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Vault Auction. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
