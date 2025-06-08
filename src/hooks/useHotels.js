import { useQuery } from '@tanstack/react-query';
import { fetchHotels, fetchDiscountedHotels } from '../services/hotelService';

export const useHotels = (options = {}) => {
  const { discounted = false, ...queryOptions } = options;

  return useQuery({
    queryKey: discounted ? ['discounted-hotels'] : ['hotels'],
    queryFn: discounted ? () => fetchDiscountedHotels(queryOptions) : () => fetchHotels(all),
    select: (data) => data || [],
    refetchOnWindowFocus: true,
  });
};