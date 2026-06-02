import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: ['product', id],
    enabled: !!id,
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      if (!response.data.success) throw new Error('Failed to fetch product');

      const item = response.data.data;
      return {
        id: item._id,
        title: item.title,
        description: item.description,
        category: item.category,
        images: item.images || [],
        imageIndex: 0,
        sellerPrice: item.startingPrice,
        startingBid: item.startingPrice,
        currentBid: item.currentBid,
        totalBids: item.totalBids,
        endTime: new Date(item.auctionEndTime),
        sellerId: item.seller?._id || item.seller,
        sellerName: item.seller?.name || 'Unknown',
        status: item.isActive ? 'live' : 'completed',
      };
    },
  });
};
