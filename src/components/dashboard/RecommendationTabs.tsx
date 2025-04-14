import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import RecommendationCard from './RecommendationCard';
import { Listing } from '@/types/supabase';
import LoadingCard from './LoadingCard';

interface RecommendationTabsProps {
  onListingSelect: (id: string) => void;
}

const RecommendationTabs: React.FC<RecommendationTabsProps> = ({ onListingSelect }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Listing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch listings from Supabase (replace with your actual query)
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .limit(5);

        if (error) {
          setError(error.message);
        } else {
          setRecommendations(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  return (
    <Tabs defaultvalue="recommendations" className="w-full">
      <TabsList>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        <TabsTrigger value="favorites" disabled>Favorites (Coming Soon)</TabsTrigger>
      </TabsList>
      <TabsContent value="recommendations" className="pt-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : recommendations && recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((listing) => (
              <RecommendationCard
                key={listing.id}
                listing={listing}
                onSelect={onListingSelect}
              />
            ))}
          </div>
        ) : (
          <p>No recommendations found.</p>
        )}
      </TabsContent>
      <TabsContent value="favorites" className="pt-4">
        <p>Coming soon!</p>
      </TabsContent>
    </Tabs>
  );
};

export default RecommendationTabs;
