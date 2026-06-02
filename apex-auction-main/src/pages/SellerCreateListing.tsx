import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useRequestSeller } from "@/hooks/useSeller";

const SellerCreateListing = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading } = useAuth();
  const requestSeller = useRequestSeller();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [startingPrice, setStartingPrice] = useState(0);
  const [auctionEndTime, setAuctionEndTime] = useState("");
  const [images, setImages] = useState("");

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post("/products", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Auction listing created successfully and is now live");
      navigate("/seller/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.response?.data?.error || "Failed to create listing";
      toast.error(message);
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || !description || !category || !startingPrice || !auctionEndTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      title,
      description,
      category,
      startingPrice,
      auctionEndTime: new Date(auctionEndTime).toISOString(),
      images: images
        .split(",")
        .map((image) => image.trim())
        .filter(Boolean),
    };

    createMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Checking your account status...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  const isSellerApproved = user?.role === "seller" && user?.sellerStatus === "approved";

  if (!isSellerApproved) {
    const status = user?.sellerStatus ?? "none";
    const title =
      status === "pending"
        ? "Seller approval required"
        : status === "rejected"
        ? "Seller request rejected"
        : "Seller access required";
    const description =
      status === "pending"
        ? "Your seller request is still pending. Please wait for admin approval before creating listings."
        : status === "rejected"
        ? "Your request was rejected. Contact support for next steps."
        : "You need seller approval before you can create auction listings.";

    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-6">
          <div className="glass rounded-3xl border border-border/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">Seller Hub</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground">{title}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {status === "none" && (
                <Button
                  onClick={() => requestSeller.mutate()}
                  disabled={requestSeller.isPending}
                  className="bg-gold text-background hover:bg-gold/90"
                >
                  {requestSeller.isPending ? "Requesting access..." : "Request seller access"}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate("/seller/dashboard")}
              >
                Back to dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Seller Hub</p>
            <h1 className="text-3xl font-bold text-foreground">Create auction listing</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              New listings from approved sellers are published live immediately and should appear on the home page once created.
            </p>
          </div>
        </div>

        <div className="glass rounded-3xl border border-border/20 p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Rare vintage watch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="Art, Watches, Automobiles"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the auction item in detail"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startingPrice">Starting Price</Label>
                <Input
                  id="startingPrice"
                  type="number"
                  value={startingPrice}
                  min={0}
                  onChange={(event) => setStartingPrice(Number(event.target.value))}
                  placeholder="15000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auctionEndTime">Auction End Time</Label>
                <Input
                  id="auctionEndTime"
                  type="datetime-local"
                  value={auctionEndTime}
                  onChange={(event) => setAuctionEndTime(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Images</Label>
              <Textarea
                id="images"
                value={images}
                onChange={(event) => setImages(event.target.value)}
                placeholder="Enter image URLs separated by commas"
              />
              <p className="text-xs text-muted-foreground">Optional. Add one or more image URLs separated by commas.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={createMutation.isLoading} className="bg-gold text-background hover:bg-gold/90">
                {createMutation.isLoading ? "Creating..." : "Create Listing"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/seller/dashboard')}>
                Back to dashboard
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerCreateListing;
