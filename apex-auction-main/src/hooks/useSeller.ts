import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useRequestSeller = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await api.post('/seller/request');
            return response.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success('Seller request submitted successfully');
                // Invalidate 'me' query to update user status
                queryClient.invalidateQueries({ queryKey: ['me'] });
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to submit request';
            toast.error(message);
        }
    });
};
