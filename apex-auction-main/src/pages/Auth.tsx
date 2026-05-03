import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Gavel, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/");
    } catch (err) {
      // Error is handled by context toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-surface">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Gavel size={24} className="text-secondary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Join Vault Auction"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Sign in to start bidding" : "Create an account to receive 100 reputation points"}
          </p>
        </div>

        <div className="glass rounded-xl p-6 glow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alexander V."
                  required={!isLogin}
                  className="w-full mt-1 bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/30 transition-all text-sm"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full mt-1 bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/30 transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full mt-1 bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/30 transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-sm transition-all gradient-gold text-secondary-foreground hover:opacity-90 gold-glow flex items-center justify-center gap-2"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight size={16} />
            </button>
          </form>

          {!isLogin && (
            <div className="mt-4 glass rounded-lg p-3 text-center">
              <p className="text-xs text-gold">🌟 New accounts receive <span className="font-bold">100 reputation points</span></p>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-secondary font-semibold">{isLogin ? "Sign Up" : "Sign In"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
