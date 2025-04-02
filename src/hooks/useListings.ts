
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/database';

export const useListings = (category?: string, limit = 10) => {
  return useQuery({
    queryKey: ['listings', category, limit],
    queryFn: async () => {
      // Use explicit type cast to bypass TypeScript errors with Supabase client
      let query = supabase
        .from('listings')
        .select(`
          id, title, description, category, sub_category, 
          price, price_unit, location, images, featured, user_id, status, created_at, updated_at,
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
        // Type assertion to any as a workaround
        query = (query as any).eq('category', category);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error in useListings:", error); // Add specific logging
        throw error;
      }

      // Convert the response data to our Listing type with proper null checks
      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        sub_category: item.sub_category,
        price: item.price,
        price_unit: item.price_unit,
        location: item.location,
        images: item.images || [],
        featured: item.featured,
        rating: item.rating || 0,
        user_id: item.user_id,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) as Listing[];
    },
  });
};

export const useListingById = (id: string) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      // Use explicit type cast to bypass TypeScript errors with Supabase client
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id, title, description, category, sub_category, 
          price, price_unit, location, images, featured, user_id, status, created_at, updated_at,
          (
            SELECT AVG(rating) as rating
            FROM reviews
            WHERE reviews.listing_id = listings.id
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error(`Supabase query error in useListingById for ID ${id}:`, error); // Add specific logging
        throw error;
      }

      // Convert to our Listing type with proper defaults
      if (!data) {
        throw new Error('Listing not found');
      }
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        sub_category: data.sub_category,
        price: data.price,
        price_unit: data.price_unit,
        location: data.location,
        images: data.images || [],
        featured: data.featured,
        rating: data.rating || 0,
        user_id: data.user_id,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at
      } as Listing;
    },
    enabled: !!id
  });
};
