import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AuctionItem } from '@/data/mockData';

export const useHomeProducts = () => {
    return useQuery({
        queryKey: ['homeProducts'],
        queryFn: async () => {
            const response = await api.get('/products/home');
            if (!response.data.success) throw new Error('Failed to fetch home products');

            // Map backend products to AuctionItem interface
            return response.data.data.map((item: any): AuctionItem => ({
                id: item._id,
                title: item.title,
                description: item.description,
                category: item.category,
                imageIndex: 0, // Fallback for mock carousel images
                images: item.images, // Add this to AuctionItem if we want to use real URLs
                sellerPrice: item.startingPrice, // Mapping startingPrice to sellerPrice
                startingBid: item.startingPrice,
                currentBid: item.currentBid,
                totalBids: item.totalBids,
                endTime: new Date(item.auctionEndTime),
                sellerId: item.seller?._id || item.seller,
                sellerName: item.seller?.name || 'Unknown',
                status: item.isActive ? 'live' : 'completed',
            }));
        },
    });
};
