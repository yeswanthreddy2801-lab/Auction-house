import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface WinnerAuction {
  id: string;
  title: string;
  winnerName: string;
  winnerId?: string;
  finalPrice: number;
  endTime: string;
  sellerName: string;
}

export const useAuctionWinners = () => {
  return useQuery<WinnerAuction[]>({
    queryKey: ['auctionWinners'],
    queryFn: async () => {
      const response = await api.get('/products/winners');
      if (!response.data.success) throw new Error('Failed to fetch auction winners');
      return response.data.data;
    },
  });
};
