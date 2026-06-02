import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRequestSeller } from "@/hooks/useSeller";
import { useSellerProducts } from "@/hooks/useSellerProducts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SellerDashboard = () => {
  const { user, isLoggedIn, isLoading } = useAuth();
  const requestSeller = useRequestSeller();
  const queryClient = useQueryClient();
  const sellerId = user?.id;
  const { data: products = [], isLoading: isProductsLoading, isError } = useSellerProducts(sellerId);

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Auction item deleted successfully");
      queryClient.invalidateQueries(['sellerProducts', sellerId]);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete auction item';
      toast.error(message);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading seller portal...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if ((user?.role === "seller" && user?.sellerStatus !== "approved")) {
    const status = user?.sellerStatus ?? "none";
    const title =
      status === "pending"
        ? "Seller request pending"
        : status === "rejected"
        ? "Seller request rejected"
        : "Become a seller";
    const description =
      status === "pending"
        ? "Your seller application is under review. Check back once an admin approves your request."
        : status === "rejected"
        ? "Your seller request was rejected. Contact support if you think this is a mistake."
        : "Request seller access to list auction items and manage your own auctions."

    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-6">
          <div className="glass rounded-3xl border border-border/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">Seller Hub</p>
            <h1 className="text-3xl font-bold text-foreground mt-2">{title}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {status === "none" && (
                <Button
                  onClick={() => requestSeller.mutate()}
                  disabled={requestSeller.isPending}
                  className="bg-gold text-background hover:bg-gold/90"
                >
                  {requestSeller.isPending ? "Requesting..." : "Request seller access"}
                </Button>
              )}
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-border/50 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-gold/60"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Seller Hub</p>
            <h1 className="text-3xl font-bold text-foreground">Your seller dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Manage your auction items here. Delete listings you no longer want and create new ones instantly.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/seller/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-background transition hover:bg-gold/90"
            >
              <PlusCircle size={16} /> Create new listing
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-border/50 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-gold/60"
            >
              <ArrowLeft size={16} /> Back to home
            </Link>
          </div>
        </div>

        <div className="glass rounded-3xl border border-border/20 p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Your auction items</h2>

          {isProductsLoading ? (
            <p className="text-sm text-muted-foreground">Loading your listings...</p>
          ) : isError ? (
            <p className="text-sm text-destructive">Failed to load your listings.</p>
          ) : products.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">You don’t have any active listings yet.</p>
              <Link
                to="/seller/create"
                className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-background transition hover:bg-gold/90"
              >
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/20 text-muted-foreground">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Current Bid</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Ends</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any) => (
                    <tr key={product._id} className="border-b border-border/20">
                      <td className="px-4 py-4 font-medium text-foreground">{product.title}</td>
                      <td className="px-4 py-4 text-muted-foreground">{product.category}</td>
                      <td className="px-4 py-4 text-foreground">${(product.currentBid || product.startingPrice).toFixed(2)}</td>
                      <td className="px-4 py-4 text-muted-foreground">{product.status}</td>
                      <td className="px-4 py-4 text-muted-foreground">{new Date(product.auctionEndTime).toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(product._id)}
                          disabled={deleteMutation.isLoading}
                          className="inline-flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
