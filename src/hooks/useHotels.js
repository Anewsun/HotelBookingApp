import { useQuery } from '@tanstack/react-query';
import { fetchHotels } from '../services/hotelService';

export const useHotels = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: fetchHotels,
    select: (data) => data || [],
    refetchOnWindowFocus: true, // Tự động refetch khi màn hình được focus
  });
};