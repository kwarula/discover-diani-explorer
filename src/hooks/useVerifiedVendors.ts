import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/types/database'; // Keep this for potential future use or reference

// Define the structure for a verified vendor object explicitly (without is_verified for now)
export interface VerifiedVendor {
  id: string;
  business_name: string;
  logo_url: string | null;
  // We might add calculated average rating later if needed
  average_rating?: number;
  // is_verified: boolean | null; // Temporarily removed due to type/schema issues
}

// Define the hook's input parameters (optional limit)
interface UseVerifiedVendorsProps {
  limit?: number;
}

// Define the hook's return value structure
interface UseVerifiedVendorsReturn {
  vendors: VerifiedVendor[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useVerifiedVendors = ({
  limit = 6, // Default limit for display
}: UseVerifiedVendorsProps = {}): UseVerifiedVendorsReturn => {
  const [vendors, setVendors] = useState<VerifiedVendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch operators, selecting only necessary fields (excluding is_verified for now)
      // TODO: Add fetching related reviews to calculate average rating later
      // TODO: Re-add filtering by is_verified if the column exists and types are resolved
      let query = supabase
        .from('operators')
        .select('id, business_name, logo_url') // Removed is_verified from select
        // .eq('is_verified', true) // Temporarily removed filter
        .eq('status', 'active'); // Assuming only active operators

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      // Add default ordering if needed, e.g., by creation date or name
      query = query.order('created_at', { ascending: false });

      // Fetch the data, relying on Supabase client's type inference based on .select()
      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error fetching vendors:", error);
        throw new Error(`Supabase query failed: ${error.message}`);
      }

      // Process the data (which should now be simpler)
      const processedVendors = data?.map((vendor): VerifiedVendor | null => {
        if (vendor && typeof vendor.id === 'string' && typeof vendor.business_name === 'string') {
          return {
            id: vendor.id,
            business_name: vendor.business_name,
            logo_url: vendor.logo_url ?? null,
            // is_verified: null, // Removed
            average_rating: 4.5 // Placeholder
          };
        }
        console.warn('Skipping invalid vendor data:', vendor);
        return null;
      }).filter((v): v is VerifiedVendor => v !== null) || [];

      setVendors(processedVendors);

    } catch (err) {
      console.error("Error fetching verified vendors:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return { vendors, loading, error, refetch: fetchVendors };
};
