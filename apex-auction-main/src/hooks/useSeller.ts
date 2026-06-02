import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useRequestSeller = () => {
    const { refreshUser } = useAuth();

    return useMutation({
        mutationFn: async () => {
            const response = await api.post('/seller/request');
            return response.data;
        },
        onSuccess: async (data) => {
            if (data.success) {
                toast.success('Seller request submitted successfully');
                await refreshUser();
            }
        },
        onError: (error: any) => {
            console.error('Seller request error:', error);
            const message = error.response?.data?.message || error.response?.data?.error || 'Failed to submit request';
            toast.error(message);
        }
    });
};
