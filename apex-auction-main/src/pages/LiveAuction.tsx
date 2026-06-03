import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/data/mockData";
import CountdownTimer from "@/components/CountdownTimer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUp, Users, TrendingUp, MessageCircle } from "lucide-react";
import { useHomeProducts } from "@/hooks/useProducts";
import { useProduct } from "@/hooks/useProduct";
import { useProductBids } from "@/hooks/useProductBids";
import api from "@/lib/api";
import { toast } from "sonner";


import hero1 from "@/assets/auction-hero-1.jpg";
import hero2 from "@/assets/auction-hero-2.jpg";
import hero3 from "@/assets/auction-hero-3.jpg";
import hero4 from "@/assets/auction-hero-4.jpg";
import hero5 from "@/assets/auction-hero-5.jpg";
import hero6 from "@/assets/auction-hero-6.jpg";

const auctionImages = [hero1, hero2, hero3, hero4, hero5, hero6];

const getAuctionImage = (auction: any) => {
  const image = auction?.images?.length ? auction.images[0] : auctionImages[(auction.imageIndex || 0) % auctionImages.length];
  if (!image) return auctionImages[0];
  if (image.startsWith("http")) return image;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/${image}`;
};

const LiveAuction = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: homeItems = [], isLoading: homeLoading, isError: homeError } = useHomeProducts();
  const { data: product, isLoading: productLoading, isError: productError } = useProduct(id);
  const queryClient = useQueryClient();
  const [liveAuctions, setLiveAuctions] = useState<any[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [showNewBid, setShowNewBid] = useState(false);

  const displayAuction = selectedAuction ?? product;
  const productId = id ?? displayAuction?.id;
  const { data: bidFeed = [], isLoading: bidLoading, isError: bidError } = useProductBids(productId);
  const currentBidValue = typeof displayAuction?.currentBid === 'number' ? displayAuction.currentBid : 0;
  const currentTotalBids = typeof displayAuction?.totalBids === 'number' ? displayAuction.totalBids : 0;

  const placeBidMutation = useMutation({
    mutationFn: async ({ productId, amount }: { productId: string; amount: number }) => {
      const response = await api.post(`/products/${productId}/bid`, { amount });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to place bid");
      }
      return response.data.data;
    },
    onSuccess: (bidData, variables) => {
      const updatedAuction = {
        ...displayAuction,
        currentBid: variables.amount,
        totalBids: currentTotalBids + 1,
      };
      const newBid = {
        id: bidData._id,
        userId: bidData.bidder?._id || bidData.bidder,
        userName: bidData.bidder?.name || 'You',
        amount: bidData.amount,
        timestamp: new Date(bidData.timestamp),
      };

      setSelectedAuction(updatedAuction);
      setLiveAuctions((prev) => prev.map((auction) => auction.id === updatedAuction.id ? updatedAuction : auction));
      if (productId) {
        queryClient.setQueryData(['product', productId], updatedAuction);
        queryClient.setQueryData(['productBids', productId], (old: any[] | undefined) =>
          old ? [newBid, ...old] : [newBid]
        );
        queryClient.invalidateQueries({ queryKey: ['productBids', productId] });
      }
      queryClient.invalidateQueries({ queryKey: ['homeProducts'] });
      toast.success("Bid placed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Bid failed");
    }
  });
  const topAuctionList = liveAuctions.map((auction) =>
    auction.id === displayAuction?.id ? displayAuction : auction
  );

  useEffect(() => {
    if (homeItems.length) {
      setLiveAuctions(homeItems);
    }
  }, [homeItems]);

  useEffect(() => {
    if (id && product && (!selectedAuction || selectedAuction.id !== product.id)) {
      setSelectedAuction(product);
      setLiveAuctions((prev) => prev.map((auction) => auction.id === product.id ? product : auction));
    } else if (!id && homeItems.length && !selectedAuction) {
      setSelectedAuction(homeItems[0]);
    }
  }, [id, product, homeItems, selectedAuction]);

  if (id && productLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="text-6xl">⏳</div>
          <h2 className="font-display text-2xl font-bold text-foreground">Loading auction...</h2>
          <p className="text-muted-foreground">Fetching the selected auction item.</p>
        </div>
      </div>
    );
  }

  if (id && productError) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="text-6xl">❌</div>
          <h2 className="font-display text-2xl font-bold text-foreground">Auction not found</h2>
          <p className="text-muted-foreground">The item you selected is unavailable or no longer live.</p>
          <button onClick={() => navigate('/live')} className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-background">
            View other live auctions
          </button>
        </div>
      </div>
    );
  }

  if (!displayAuction) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="text-6xl">🔨</div>
          <h2 className="font-display text-2xl font-bold text-foreground">No Live Auctions</h2>
          <p className="text-muted-foreground">Check back soon for upcoming live events.</p>
        </div>
      </div>
    );
  }

  const handlePlaceBid = async () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (!amount) {
      toast.error("Enter a valid bid amount");
      return;
    }

    if (amount <= currentBidValue) {
      toast.error("Your bid must be higher than the current bid");
      return;
    }

    if (!displayAuction?.id) {
      toast.error("Unable to place bid on this auction");
      return;
    }

    try {
      await placeBidMutation.mutateAsync({ productId: displayAuction.id, amount });
      setBidAmount("");
      setShowNewBid(true);
      setTimeout(() => setShowNewBid(false), 2000);
    } catch (error) {
      console.error("Bid failed", error);
    }
  };

  const minBid = displayAuction.currentBid > 0
    ? displayAuction.currentBid + Math.ceil(displayAuction.currentBid * 0.02)
    : displayAuction.startingBid;

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Live Selector */}
        {topAuctionList.length > 1 && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {topAuctionList.map((auction) => (
              <button
                key={auction.id}
                onClick={() => setSelectedAuction(auction)}
                className={`flex-shrink-0 glass rounded-lg p-3 flex items-center gap-3 transition-all ${
                  displayAuction?.id === auction.id ? "border-secondary/50 gold-glow" : "border-transparent hover:border-border"
                }`}
              >
                <img src={getAuctionImage(auction)} alt="" className="h-10 w-10 rounded object-cover" />
                <div className="text-left">
                  <p className="text-xs font-medium text-foreground line-clamp-1">{auction.title}</p>
                  <p className="text-xs text-primary font-semibold">{formatCurrency(auction.currentBid)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product View */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative glass rounded-xl overflow-hidden">
              <img
                src={getAuctionImage(displayAuction)}
                alt={displayAuction.title}
                className="w-full h-[300px] md:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
                LIVE
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">{displayAuction.title}</h1>
                <p className="text-sm text-muted-foreground line-clamp-2">{displayAuction.description}</p>
              </div>
            </div>

            {/* Bid Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Seller Price", value: formatCurrency(displayAuction.sellerPrice), icon: TrendingUp },
                { label: "Starting Bid", value: formatCurrency(displayAuction.startingBid) },
                { label: "Current Bid", value: formatCurrency(currentBidValue), highlight: true },
                { label: "Total Bids", value: currentTotalBids.toString(), icon: Users },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`glass rounded-lg p-3 ${stat.highlight ? "border-primary/30 green-glow" : ""}`}
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.highlight ? "text-primary" : "text-foreground"}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Bid Input */}
            <motion.div
              className={`glass rounded-xl p-4 space-y-3 ${showNewBid ? "green-glow" : ""}`}
              animate={showNewBid ? { scale: [1, 1.01, 1] } : {}}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Place Your Bid</p>
                  <p className="text-xs text-muted-foreground">Minimum: {formatCurrency(minBid)}</p>
                </div>
                <CountdownTimer endTime={displayAuction.endTime} />
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={minBid.toLocaleString()}
                    className="w-full bg-muted/50 border border-border rounded-lg pl-7 pr-4 py-3 text-foreground font-semibold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePlaceBid}
                  disabled={placeBidMutation.isLoading}
                  className="px-8 py-3 rounded-lg font-bold text-sm transition-all gradient-gold text-secondary-foreground hover:opacity-90 gold-glow bid-pulse disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowUp size={18} className="inline mr-1" />
                  BID
                </button>
              </div>
              {!isLoggedIn && (
                <p className="text-xs text-muted-foreground text-center">
                  You must{" "}
                  <button onClick={() => navigate("/auth")} className="text-secondary underline">sign in</button>
                  {" "}to place bids
                </p>
              )}
            </motion.div>
          </div>

          {/* Sidebar: Bid Feed + Seller */}
          <div className="space-y-4">
            {/* Seller Info */}
            <div className="glass rounded-xl p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Seller</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                  {displayAuction.sellerName.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{displayAuction.sellerName}</p>
                  <p className="text-xs text-muted-foreground">{displayAuction.category}</p>
                </div>
                <button className="glass rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle size={14} />
                </button>
              </div>
            </div>

            {/* Bid Feed */}
            <div className="glass rounded-xl p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Bid History</p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {bidLoading ? (
                  <p className="text-xs text-muted-foreground">Loading bid history...</p>
                ) : bidFeed.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No bids placed yet.</p>
                ) : (
                  <AnimatePresence>
                    {bidFeed.map((bid, i) => (
                      <motion.div
                        key={bid.id}
                        initial={i === 0 ? { opacity: 0, y: -10 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          i === 0 ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/30"
                        } transition-colors`}
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                          {bid.userName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{bid.userName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {bid.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <p className={`text-sm font-bold ${i === 0 ? "text-primary" : "text-foreground"}`}>
                          {formatCurrency(bid.amount)}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAuction;
