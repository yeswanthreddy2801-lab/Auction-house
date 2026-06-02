import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useSellerProducts = (sellerId?: string) => {
  return useQuery({
    queryKey: ['sellerProducts', sellerId],
    enabled: !!sellerId,
    queryFn: async () => {
      const response = await api.get(`/products?seller=${sellerId}`);
      if (!response.data.success) throw new Error('Failed to fetch seller products');
      return response.data.data;
    },
  });
};
