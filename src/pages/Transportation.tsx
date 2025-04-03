import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Bus, Bike, Footprints, CarTaxiFront, Info, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react'; // Added Loader2
import VerifiedOperatorCard from '@/components/transport/VerifiedOperatorCard'; // Added
import { supabase } from '@/integrations/supabase/client'; // Added
import { Tables } from '@/types/database'; // Added
import { Checkbox } from "@/components/ui/checkbox"; // Added for filtering
import { Label } from "@/components/ui/label"; // Added for filtering

const Transportation = () => {
  const [operators, setOperators] = useState<Tables<'operators'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  // TODO: Add state for other filters like type (tuk-tuk, moto, taxi) if needed

  useEffect(() => {
    const fetchOperators = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch operators - refine query based on how transport operators are identified
        // Option 1: Filter by a specific 'business_type' like 'Transport'
        // Option 2: Filter if 'specialties' array contains relevant terms
        // Option 3: Fetch all and filter client-side (less efficient for large datasets)
        // Explicitly select columns to ensure type alignment
        const columnsToSelect = `
          id,
          business_name,
          business_type,
          categories,
          contact_email,
          contact_person_name,
          contact_phone,
          cover_photo_url,
          created_at,
          description,
          key_offerings,
          location_coordinates,
          logo_url,
          operating_hours,
          price_range,
          service_area_description,
          status,
          updated_at,
          user_id,
          is_verified,
          specialties
        `;
        const { data, error: dbError } = await supabase
          .from('operators')
          .select(columnsToSelect)
          // .eq('business_type', 'Transport') // Example filter (re-enable if needed)
          // Or filter by specialties: .or('specialties.cs.{"Tuk-tuk"},specialties.cs.{"Moto"},specialties.cs.{"Taxi"}') // Re-enable if needed
          .order('is_verified', { ascending: false }) // Show verified first
          .order('business_name');

        if (dbError) throw dbError;

        // Further client-side filtering if needed (e.g., if no specific DB filter is perfect)
        // For now, assume the query returns relevant transport operators
        setOperators(data || []);
      } catch (err: any) {
        console.error("Error fetching transport operators:", err);
        setError("Failed to load transportation options. Please try again later.");
        setOperators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  // Apply client-side filters based on state
  const filteredOperators = operators.filter(op => {
    if (showVerifiedOnly && !op.is_verified) {
      return false;
    }
    // Add other filter logic here based on state (e.g., selectedType)
    // Example: if (selectedType && !op.specialties?.includes(selectedType)) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center text-ocean-dark">Getting Around Diani</h1>
      <p className="text-lg text-center text-gray-600 mb-8 max-w-3xl mx-auto"> {/* Reduced bottom margin */}
        Navigating Diani is easy with various options available. Choose the best fit for your budget, comfort, and destination.
      </p>

      <div className="text-center mb-12"> {/* Added container for the button */}
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>

      {/* Filtering Section */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50 flex flex-wrap items-center gap-4">
         <h3 className="text-lg font-semibold mr-4">Filter Options:</h3>
         <div className="flex items-center space-x-2">
            <Checkbox
              id="verifiedOnly"
              checked={showVerifiedOnly}
              onCheckedChange={(checked) => setShowVerifiedOnly(Boolean(checked))}
              aria-labelledby="verifiedOnlyLabel"
            />
            <Label htmlFor="verifiedOnly" id="verifiedOnlyLabel" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Show Verified Only
            </Label>
          </div>
          {/* TODO: Add more filters here (e.g., dropdown for type based on specialties/business_type) */}
      </div>

      {/* Price Guidance Section */}
      <Card className="mb-12 bg-blue-50 border-blue-200 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Info size={20} className="mr-2" /> Price Guidance & Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <p><strong>Negotiate Fares:</strong> Always agree on the price *before* starting your journey, especially with Tuk-tuks and Boda-bodas.</p>
          <p><strong>Typical Ranges (Estimates):</strong></p>
          <ul className="list-disc list-inside pl-4">
            <li>Ukunda Junction to Beach Hotels: 200-400 KSh (Tuk-tuk)</li>
            <li>Beach Hotels to Kongo River: 300-500 KSh (Tuk-tuk)</li>
            <li>Short hops along beach road: 100-200 KSh (Tuk-tuk/Boda)</li>
          </ul>
          <p><strong>Taxis:</strong> Generally more expensive, better for longer distances or groups. Confirm fare or meter usage beforehand.</p>
          <p><strong>Apps:</strong> Ride-hailing apps (Uber/Bolt) have variable availability in Diani. Check locally.</p>
        </CardContent>
      </Card>


      {/* Verified Operators List */}
      <h2 className="text-3xl font-semibold mb-6 text-ocean-dark border-b pb-2">Transport Operators</h2>
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-ocean-light" />
          <span className="ml-2">Loading Operators...</span>
        </div>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && filteredOperators.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No operators match the current filters. Try adjusting your selection or check back later.
        </p>
      )}
      {!loading && !error && filteredOperators.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOperators.map(operator => (
            // Ensure the operator data structure matches VerifiedOperatorCard props
            <VerifiedOperatorCard key={operator.id} operator={operator} />
          ))}
        </div>
      )}
      {/* Static general info cards removed, replaced by dynamic list */}
        <p className="text-center text-gray-600 mt-12">
          Choose wisely and enjoy exploring all that Diani has to offer!
        </p>
    </div>
  );
};

export default Transportation;
