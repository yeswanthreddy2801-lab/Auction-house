export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageIndex: number;
  sellerPrice: number;
  startingBid: number;
  currentBid: number;
  totalBids: number;
  endTime: Date;
  sellerId: string;
  sellerName: string;
  status: "upcoming" | "live" | "completed";
  images?: string[];
  winnerId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  sellerStatus: 'none' | 'pending' | 'approved' | 'rejected';
  avatar: string;
  reputationPoints: number;
  totalWins: number;
  totalBids: number;
  isOnline: boolean;
}

export interface BidEntry {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
}

export interface ChatRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
}

export const mockUsers: User[] = [
  { id: "u1", name: "Alexander V.", email: "alex@example.com", role: "admin", sellerStatus: "approved", avatar: "AV", reputationPoints: 340, totalWins: 12, totalBids: 45, isOnline: true },
  { id: "u2", name: "Isabella M.", email: "isabella@example.com", role: "seller", sellerStatus: "approved", avatar: "IM", reputationPoints: 280, totalWins: 9, totalBids: 38, isOnline: true },
  { id: "u3", name: "Sebastian K.", email: "sebastian@example.com", role: "buyer", sellerStatus: "none", avatar: "SK", reputationPoints: 220, totalWins: 7, totalBids: 31, isOnline: false },
  { id: "u4", name: "Victoria R.", email: "victoria@example.com", role: "buyer", sellerStatus: "none", avatar: "VR", reputationPoints: 195, totalWins: 6, totalBids: 28, isOnline: true },
  { id: "u5", name: "Maximilian D.", email: "maxim@example.com", role: "buyer", sellerStatus: "none", avatar: "MD", reputationPoints: 160, totalWins: 5, totalBids: 22, isOnline: false },
  { id: "u6", name: "Anastasia L.", email: "ana@example.com", role: "buyer", sellerStatus: "none", avatar: "AL", reputationPoints: 140, totalWins: 4, totalBids: 19, isOnline: true },
  { id: "u7", name: "Dominic W.", email: "dominic@example.com", role: "buyer", sellerStatus: "none", avatar: "DW", reputationPoints: 120, totalWins: 3, totalBids: 15, isOnline: false },
  { id: "u8", name: "Cassandra B.", email: "cassandra@example.com", role: "buyer", sellerStatus: "none", avatar: "CB", reputationPoints: 100, totalWins: 2, totalBids: 12, isOnline: true },
];

const now = new Date();
const hoursFromNow = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000);

export const mockAuctions: AuctionItem[] = [
  {
    id: "a1",
    title: "Patek Philippe Nautilus 5711",
    description: "Rare stainless steel Patek Philippe Nautilus ref. 5711/1A in mint condition with complete box and papers.",
    category: "Watches",
    imageIndex: 0,
    sellerPrice: 185000,
    startingBid: 18500,
    currentBid: 142000,
    totalBids: 23,
    endTime: hoursFromNow(2.5),
    sellerId: "u1",
    sellerName: "Alexander V.",
    status: "live",
  },
  {
    id: "a2",
    title: "1967 Ferrari 275 GTB/4",
    description: "Matching numbers, fully documented provenance, concours-level restoration by marque specialists.",
    category: "Automotive",
    imageIndex: 1,
    sellerPrice: 3200000,
    startingBid: 320000,
    currentBid: 2850000,
    totalBids: 47,
    endTime: hoursFromNow(1.2),
    sellerId: "u2",
    sellerName: "Isabella M.",
    status: "live",
  },
  {
    id: "a3",
    title: "Kashmir Sapphire Necklace",
    description: "Extraordinary 45-carat unheated Kashmir sapphire surrounded by D-flawless diamonds, signed by Bulgari.",
    category: "Jewelry",
    imageIndex: 2,
    sellerPrice: 920000,
    startingBid: 92000,
    currentBid: 780000,
    totalBids: 31,
    endTime: hoursFromNow(4),
    sellerId: "u3",
    sellerName: "Sebastian K.",
    status: "live",
  },
  {
    id: "a4",
    title: "Hermès Himalaya Birkin 30",
    description: "Ultra-rare Hermès Himalaya Niloticus crocodile Birkin 30 with 18K white gold and diamond hardware.",
    category: "Fashion",
    imageIndex: 3,
    sellerPrice: 450000,
    startingBid: 45000,
    currentBid: 0,
    totalBids: 0,
    endTime: hoursFromNow(24),
    sellerId: "u4",
    sellerName: "Victoria R.",
    status: "upcoming",
  },
  {
    id: "a5",
    title: "Château Margaux 1787",
    description: "Exceptionally rare pre-revolution Bordeaux from Thomas Jefferson's personal collection.",
    category: "Wine & Spirits",
    imageIndex: 4,
    sellerPrice: 225000,
    startingBid: 22500,
    currentBid: 0,
    totalBids: 0,
    endTime: hoursFromNow(48),
    sellerId: "u5",
    sellerName: "Maximilian D.",
    status: "upcoming",
  },
  {
    id: "a6",
    title: "Monet — Water Lilies Study",
    description: "Previously unknown study by Claude Monet for the Orangerie series, authenticated and catalogued.",
    category: "Fine Art",
    imageIndex: 5,
    sellerPrice: 12500000,
    startingBid: 1250000,
    currentBid: 0,
    totalBids: 0,
    endTime: hoursFromNow(72),
    sellerId: "u6",
    sellerName: "Anastasia L.",
    status: "upcoming",
  },
];

export const mockBidFeed: BidEntry[] = [
  { id: "b1", userId: "u2", userName: "Isabella M.", amount: 142000, timestamp: new Date(now.getTime() - 120000) },
  { id: "b2", userId: "u4", userName: "Victoria R.", amount: 139000, timestamp: new Date(now.getTime() - 300000) },
  { id: "b3", userId: "u6", userName: "Anastasia L.", amount: 135000, timestamp: new Date(now.getTime() - 480000) },
  { id: "b4", userId: "u2", userName: "Isabella M.", amount: 130000, timestamp: new Date(now.getTime() - 600000) },
  { id: "b5", userId: "u8", userName: "Cassandra B.", amount: 125000, timestamp: new Date(now.getTime() - 900000) },
  { id: "b6", userId: "u4", userName: "Victoria R.", amount: 118000, timestamp: new Date(now.getTime() - 1200000) },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
