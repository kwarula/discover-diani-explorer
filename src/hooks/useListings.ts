
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Listing = {
  id: string;
  title: string;
  description: string;
  category: string;
  sub_category: string | null;
  price: number;
  price_unit: string | null;
  location: string;
  images: string[];
  featured: boolean;
  rating: number;
};

export const useListings = (category?: string, limit = 10) => {
  return useQuery({
    queryKey: ['listings', category, limit],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select(`
          id, title, description, category, sub_category, 
          price, price_unit, location, images, featured,
          (
            SELECT AVG(rating) as rating
            FROM reviews
            WHERE reviews.listing_id = listings.id
          )
        `)
        .eq('status', 'approved')
        .order('featured', { ascending: false })
        .limit(limit);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        ...item,
        rating: item.rating || 0,
        images: item.images || []
      })) as Listing[];
    },
  });
};

export const useListingById = (id: string) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id, title, description, category, sub_category, 
          price, price_unit, location, images, featured,
          (
            SELECT AVG(rating) as rating
            FROM reviews
            WHERE reviews.listing_id = listings.id
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        ...data,
        rating: data.rating || 0,
        images: data.images || []
      } as Listing;
    },
    enabled: !!id
  });
};
