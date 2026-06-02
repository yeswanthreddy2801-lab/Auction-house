import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ReputationBadge from "./ReputationBadge";
import { Gavel, Trophy, User as UserIcon, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRequestSeller } from "@/hooks/useSeller";
import { Badge } from "./ui/badge";

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const requestSeller = useRequestSeller();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: Gavel },
    { path: "/live", label: "Live Auction", icon: Gavel },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <Gavel size={18} className="text-secondary-foreground" />
          </div>
          <span className="text-foreground">VAULT</span>
          <span className="text-gold text-sm font-normal tracking-widest">AUCTION</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-foreground ${isActive(link.path) ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              {user.role === 'buyer' && user.sellerStatus === 'none' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => requestSeller.mutate()}
                  disabled={requestSeller.isPending}
                  className="text-xs h-8 border-gold/50 text-gold hover:bg-gold/10"
                >
                  Become a Seller
                </Button>
              )}
              {user.sellerStatus === 'pending' && <Badge variant="secondary" className="text-[10px] h-5 bg-blue-500/20 text-blue-400 border-none">Pending Seller</Badge>}
              {user.sellerStatus === 'rejected' && <Badge variant="destructive" className="text-[10px] h-5 bg-red-500/20 text-red-400 border-none">Request Rejected</Badge>}
              {user.role === 'admin' && (
                <Link to="/admin/seller-requests" className="text-xs font-semibold text-gold hover:underline mr-2">Admin Hub</Link>
              )}
              {(user.role === 'seller' || user.sellerStatus === 'approved') && (
                <Link to="/seller/dashboard" className="text-xs font-semibold text-gold hover:underline mr-2">Seller Hub</Link>
              )}

              <ReputationBadge points={user.reputationPoints} size="sm" />
              <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {user.avatar || user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button onClick={logout} className="text-muted-foreground hover:text-foreground transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-sm px-5"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-border/30 p-4 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${isActive(link.path) ? "text-foreground" : "text-muted-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && user && user.role === 'admin' && (
            <Link
              to="/admin/seller-requests"
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${isActive('/admin/seller-requests') ? "text-foreground" : "text-muted-foreground"}`}
            >
              Admin Hub
            </Link>
          )}
          {isLoggedIn && user && (user.role === 'seller' || user.sellerStatus === 'approved') && (
            <Link
              to="/seller/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${isActive('/seller/dashboard') ? "text-foreground" : "text-muted-foreground"}`}
            >
              Seller Hub
            </Link>
          )}
          {isLoggedIn && user ? (
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <div className="flex items-center gap-2">
                <ReputationBadge points={user.reputationPoints} size="sm" />
                <span className="text-sm">{user.name}</span>
              </div>
              <button onClick={logout} className="text-muted-foreground"><LogOut size={16} /></button>
            </div>
          ) : (
            <Button onClick={() => { navigate("/auth"); setMobileOpen(false); }} className="w-full bg-secondary text-secondary-foreground">
              Sign In
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
