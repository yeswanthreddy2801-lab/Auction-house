import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { BidEntry } from '@/data/mockData';

export const useProductBids = (productId?: string) => {
  return useQuery<BidEntry[]>({
    queryKey: ['productBids', productId],
    enabled: !!productId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    queryFn: async () => {
      const response = await api.get(`/products/${productId}/bids`);
      if (!response.data.success) throw new Error('Failed to fetch bid history');

      return response.data.data.map((bid: any): BidEntry => ({
        id: bid._id,
        userId: bid.bidder?._id || bid.bidder,
        userName: bid.bidder?.name || 'Unknown',
        amount: bid.amount,
        timestamp: new Date(bid.timestamp),
      }));
    },
  });
};
