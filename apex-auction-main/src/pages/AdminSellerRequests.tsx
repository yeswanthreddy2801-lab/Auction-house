import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const fetchSellerRequests = async () => {
  const response = await api.get('/admin/seller-requests');
  return response.data.data;
};

const AdminSellerRequests = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sellerRequests'],
    queryFn: fetchSellerRequests,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/approve-seller/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sellerRequests'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/reject-seller/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sellerRequests'] }),
  });

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Admin Seller Requests</p>
            <h1 className="text-3xl font-bold text-foreground">Approve pending sellers</h1>
          </div>
          <Link to="/" className="inline-flex items-center rounded-full border border-border/50 bg-background px-4 py-2 text-sm text-foreground transition hover:border-gold/60">
            Back to home
          </Link>
        </div>

        <div className="glass rounded-3xl border border-border/20 p-6">
          <p className="text-sm text-muted-foreground">
            Pending requests are users who clicked "Become a Seller" and need admin approval to become an approved seller.
          </p>
        </div>

        {isLoading ? (
          <div className="glass rounded-3xl border border-border/20 p-6 text-center">
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-gold" />
            <p className="text-muted-foreground">Loading requests...</p>
          </div>
        ) : isError ? (
          <div className="glass rounded-3xl border border-border/20 p-6 text-center text-red-400">
            Failed to load seller requests.
          </div>
        ) : data?.length === 0 ? (
          <div className="glass rounded-3xl border border-border/20 p-6 text-center text-muted-foreground">
            There are no pending seller requests right now.
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((request: any) => (
              <div key={request._id} className="glass rounded-3xl border border-border/20 p-6 md:flex md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">User ID: {request._id}</p>
                  <h2 className="text-lg font-semibold text-foreground">{request.name}</h2>
                  <p className="text-sm text-muted-foreground">{request.email}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-400">Status: {request.sellerStatus}</p>
                </div>
                <div className="mt-4 flex flex-col gap-2 md:mt-0 md:flex-row">
                  <Button
                    onClick={() => approveMutation.mutate(request._id)}
                    disabled={approveMutation.isLoading}
                    className="inline-flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-400"
                  >
                    <CheckCircle2 size={16} /> Approve
                  </Button>
                  <Button
                    onClick={() => rejectMutation.mutate(request._id)}
                    disabled={rejectMutation.isLoading}
                    className="inline-flex items-center gap-2 bg-red-500 text-white hover:bg-red-400"
                  >
                    <XCircle size={16} /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSellerRequests;
