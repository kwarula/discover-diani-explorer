import React, { useState, useCallback } from 'react'; // Added useCallback
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'; // Added imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/auth'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { uploadFileToSupabase } from '@/lib/utils'; // Import upload helper

// Define default map center (Diani Beach)
const defaultCenter = {
  lat: -4.2833, // Latitude for Diani Beach
  lng: 39.5833  // Longitude for Diani Beach
};

// Define Zod schema for the entire form
const onboardingSchema = z.object({
  // Step 1: Basic Business Information
  businessName: z.string().min(2, { message: "Business name is required." }),
  businessType: z.string({ required_error: "Please select a business type." }),
  contactPersonName: z.string().min(2, { message: "Contact person name is required." }),
  contactEmail: z.string().email({ message: "Invalid contact email address." }),
  contactPhone: z.string().min(10, { message: "Valid phone number is required." }), // Basic validation

  // Step 2: Location & Operation
  addressStreet: z.string().optional(),
  addressArea: z.string().min(2, { message: "Area/Neighborhood is required." }),
  mapCoordinates: z.object({ // Added map coordinates schema
      lat: z.number(),
      lng: z.number()
    }).optional(), // Make optional initially, can enforce later if needed
  serviceAreaDescription: z.string().optional(),
  operatingHours: z.string().optional(), // Simple text for now, could be JSONB later

  // Step 3: Listing Details & Services
  description: z.string().min(50, { message: "Please provide a detailed description (min 50 characters)." }),
  keyOfferings: z.array(z.string()).optional(), // Example: using multi-select or tags later
  categories: z.array(z.string()).optional(), // Example
  priceRange: z.string().optional(), // Example: $, $$, $$$

  // Step 4: Media Upload - Use z.instanceof or refine later for better validation if needed
  logo: z.instanceof(FileList).optional().nullable(), // FileList for single file input
  coverPhoto: z.instanceof(FileList).optional().nullable(),
  gallery: z.instanceof(FileList).optional().nullable(), // FileList for multiple files

  // Step 5: Verification Documents
  businessPermit: z.instanceof(FileList).optional().nullable(),
  tourismLicense: z.instanceof(FileList).optional().nullable(),
  kraPin: z.instanceof(FileList).optional().nullable(),
  // Add more document fields as needed based on business type logic later

  // Terms agreement
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the Operator Terms of Service." }),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const TOTAL_STEPS = 5;
const MAP_CONTAINER_STYLE = { height: '400px', width: '100%' }; // Style for map container
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Get key from env

const OperatorOnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter); // State for marker
  const { user } = useAuth(); // Get user from auth context
  const navigate = useNavigate(); // Hook for navigation

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      // Initialize default values for all fields
      businessName: "",
      businessType: undefined,
      contactPersonName: "",
      contactEmail: "", // Pre-fill from auth context later if possible
      contactPhone: "",
      addressStreet: "",
      addressArea: "",
      mapCoordinates: defaultCenter, // Initialize map coordinates
      serviceAreaDescription: "",
      operatingHours: "",
      description: "",
      keyOfferings: [],
      categories: [],
      priceRange: undefined,
      logo: null, // Use null for FileList defaults
      coverPhoto: null, // Use null
      gallery: null, // Use null
      businessPermit: null, // Use null
      tourismLicense: null, // Use null
      kraPin: null, // Use null
      agreeToTerms: false,
    },
  });

  // --- Map Marker Drag Handler ---
  const onMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPos = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkerPosition(newPos);
      form.setValue('mapCoordinates', newPos, { shouldValidate: true }); // Update form state
      console.log("New Marker Position:", newPos);
    }
  }, [form]);


  // Function to handle form submission (final step)
  const processForm = async (values: OnboardingFormValues) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "User not found. Please log in again.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    console.log("Submitting Onboarding Data:", values);

    try {
      let logoUrl: string | undefined = undefined;
      let coverPhotoUrl: string | undefined = undefined;
      const galleryUrls: string[] = [];
      const documentUrls: { type: string; url: string }[] = [];

      const userId = user.id;
      const timestamp = Date.now();

      // --- Helper to upload a single file ---
      const uploadSingleFile = async (fileList: FileList | null | undefined, bucket: string, type: string): Promise<string | undefined> => {
        if (fileList && fileList.length > 0) {
          const file = fileList[0];
          const filePath = `public/${userId}/${type}-${timestamp}-${file.name}`;
          return await uploadFileToSupabase(file, bucket, filePath);
        }
        return undefined;
      };

      // --- Helper to upload multiple files (gallery) ---
       const uploadMultipleFiles = async (fileList: FileList | null | undefined, bucket: string, typePrefix: string): Promise<string[]> => {
         const urls: string[] = [];
         if (fileList && fileList.length > 0) {
           for (let i = 0; i < fileList.length; i++) {
             const file = fileList[i];
             const filePath = `public/${userId}/${typePrefix}-${timestamp}-${i}-${file.name}`;
             try {
                const url = await uploadFileToSupabase(file, bucket, filePath);
                urls.push(url);
             } catch (uploadError) {
                 console.error(`Failed to upload gallery file ${i}:`, uploadError);
                 // Decide if one failed upload should stop the whole process or just skip the file
                 toast({ title: "Upload Error", description: `Failed to upload one of the gallery images: ${file.name}`, variant: "destructive" });
                 // Optionally: throw uploadError; // To stop submission
             }
           }
         }
         return urls;
       };

      // --- Upload Files ---
      logoUrl = await uploadSingleFile(values.logo, 'operator_logos', 'logo');
      coverPhotoUrl = await uploadSingleFile(values.coverPhoto, 'operator_covers', 'cover');
      const uploadedGalleryUrls = await uploadMultipleFiles(values.gallery, 'operator_gallery', 'gallery');
      galleryUrls.push(...uploadedGalleryUrls);

      // Upload documents
      const permitUrl = await uploadSingleFile(values.businessPermit, 'operator_verification_docs', 'permit');
      if (permitUrl) documentUrls.push({ type: 'Business Permit', url: permitUrl });
      const licenseUrl = await uploadSingleFile(values.tourismLicense, 'operator_verification_docs', 'license');
      if (licenseUrl) documentUrls.push({ type: 'Tourism License', url: licenseUrl });
      const kraUrl = await uploadSingleFile(values.kraPin, 'operator_verification_docs', 'kra');
      if (kraUrl) documentUrls.push({ type: 'KRA PIN', url: kraUrl });

      // --- Prepare Operator Data ---
      const operatorData = {
        user_id: userId,
        business_name: values.businessName,
        business_type: values.businessType,
        contact_person_name: values.contactPersonName,
        contact_email: values.contactEmail,
        contact_phone: values.contactPhone,
        address_street: values.addressStreet,
        address_area: values.addressArea,
        // Format coordinates for PostGIS POINT type (Lng Lat)
        location_coordinates: values.mapCoordinates ? `POINT(${values.mapCoordinates.lng} ${values.mapCoordinates.lat})` : null,
        service_area_description: values.serviceAreaDescription,
        operating_hours: values.operatingHours ? JSON.parse(JSON.stringify(values.operatingHours)) : null, // Basic JSON storage for now
        description: values.description,
        key_offerings: values.keyOfferings, // Assuming these are handled correctly by form inputs later
        categories: values.categories,
        price_range: values.priceRange,
        logo_url: logoUrl,
        cover_photo_url: coverPhotoUrl,
        status: 'pending_verification', // Initial status
      };

      // --- Insert Operator Data ---
      const { data: operatorResult, error: operatorError } = await supabase
        .from('operators')
        .insert(operatorData)
        .select() // Select the inserted row to get the ID
        .single(); // Expecting a single row back

      if (operatorError || !operatorResult) {
        console.error("Error inserting operator data:", operatorError);
        throw new Error(`Failed to save business profile: ${operatorError?.message || 'Unknown error'}`);
      }

      const operatorId = operatorResult.id;

      // --- Insert Gallery Media ---
      if (galleryUrls.length > 0) {
        const galleryData = galleryUrls.map((url, index) => ({
          operator_id: operatorId,
          media_url: url,
          media_type: 'image', // Assuming image for now, add logic for video later
          sort_order: index,
        }));
        const { error: galleryError } = await supabase.from('operator_gallery_media').insert(galleryData);
        if (galleryError) {
           console.error("Error inserting gallery media:", galleryError);
           // Decide how to handle partial success - maybe log and continue?
           toast({ title: "Warning", description: "Profile saved, but failed to save some gallery images.", variant: "default" });
        }
      }

       // --- Insert Verification Documents ---
       if (documentUrls.length > 0) {
         const docsData = documentUrls.map(doc => ({
           operator_id: operatorId,
           document_type: doc.type,
           document_url: doc.url, // URL from storage (might need signed URLs later if bucket is private)
         }));
         const { error: docsError } = await supabase.from('operator_verification_documents').insert(docsData);
         if (docsError) {
            console.error("Error inserting verification documents:", docsError);
            toast({ title: "Warning", description: "Profile saved, but failed to save verification documents.", variant: "default" });
         }
       }

      // --- Success ---
      toast({
        title: "Application Submitted Successfully!",
        description: "Your details have been received and are pending review.",
      });
      navigate('/operator/submission-confirmation'); // Redirect on success

    } catch (error: any) {
      console.error("Onboarding submission failed:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle "Next" button click
  const handleNext = async () => {
    // Trigger validation for fields relevant to the current step
    let fieldsToValidate: (keyof OnboardingFormValues)[] = [];
    if (currentStep === 1) fieldsToValidate = ['businessName', 'businessType', 'contactPersonName', 'contactEmail', 'contactPhone'];
    // Validate mapCoordinates in step 2 (optional for now, but trigger validation if set)
    if (currentStep === 2) fieldsToValidate = ['addressArea', 'mapCoordinates'];
    if (currentStep === 3) fieldsToValidate = ['description'];
    // Add validation triggers for steps 4 & 5 if needed (e.g., required uploads)

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(prev => prev + 1);
      } else {
        // If it's the last step, trigger the final submission validation for terms
        const termsValid = await form.trigger(['agreeToTerms']);
        if (termsValid) {
           await form.handleSubmit(processForm)();
        } else {
           // Scroll to terms checkbox?
           console.log("Need to agree to terms");
        }
      }
    } else {
       console.log("Validation failed for step:", currentStep, form.formState.errors);
       // Optionally scroll to the first error field
    }
  };

  // Function to handle "Previous" button click
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

   if (!GOOGLE_MAPS_API_KEY) {
      return <div className="text-red-600 p-4">Error: Google Maps API Key is missing. Please configure VITE_GOOGLE_MAPS_API_KEY in your .env file.</div>;
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Operator Onboarding</CardTitle>
        <CardDescription>Step {currentStep} of {TOTAL_STEPS}: Complete your business profile.</CardDescription>
        <Progress value={(currentStep / TOTAL_STEPS) * 100} className="mt-2" />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default browser submission */}
          <CardContent className="space-y-6">

            {/* Step 1: Basic Business Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <FormField control={form.control} name="businessName" render={({ field }) => ( <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input placeholder="e.g., Diani Beach Resort" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="businessType" render={({ field }) => ( <FormItem><FormLabel>Business Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Accommodation">Accommodation</SelectItem><SelectItem value="Tour Operator">Tour Operator</SelectItem><SelectItem value="Restaurant">Restaurant</SelectItem><SelectItem value="Shop">Shop</SelectItem><SelectItem value="Real Estate">Real Estate Agency</SelectItem><SelectItem value="Transport">Transport Provider</SelectItem><SelectItem value="Local Service">Local Service</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="contactPersonName" render={({ field }) => ( <FormItem><FormLabel>Primary Contact Person</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="contactEmail" render={({ field }) => ( <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input placeholder="contact@business.com" {...field} type="email" /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="contactPhone" render={({ field }) => ( <FormItem><FormLabel>Contact Phone Number</FormLabel><FormControl><Input placeholder="+254 7XX XXX XXX" {...field} type="tel" /></FormControl><FormMessage /></FormItem> )} />
              </div>
            )}

            {/* Step 2: Location & Operation */}
             {currentStep === 2 && (
               <div className="space-y-4">
                 <FormField control={form.control} name="addressStreet" render={({ field }) => ( <FormItem><FormLabel>Street Address (Optional)</FormLabel><FormControl><Input placeholder="e.g., Beach Road" {...field} /></FormControl><FormMessage /></FormItem> )} />
                 <FormField control={form.control} name="addressArea" render={({ field }) => ( <FormItem><FormLabel>Area / Neighborhood</FormLabel><FormControl><Input placeholder="e.g., Galu Beach, Ukunda Town" {...field} /></FormControl><FormMessage /></FormItem> )} />

                 {/* --- Google Map Integration --- */}
                 <FormField
                    control={form.control}
                    name="mapCoordinates"
                    render={({ field }) => ( // field is implicitly used by form state, but we manage marker directly
                      <FormItem>
                        <FormLabel>Pin Location on Map</FormLabel>
                        <FormControl>
                          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                            <GoogleMap
                              mapContainerStyle={MAP_CONTAINER_STYLE}
                              center={markerPosition} // Center map on marker
                              zoom={15} // Adjust zoom level as needed
                            >
                              <Marker
                                position={markerPosition}
                                draggable={true}
                                onDragEnd={onMarkerDragEnd} // Update position on drag end
                              />
                            </GoogleMap>
                          </LoadScript>
                        </FormControl>
                        <FormDescription>Drag the pin to your exact business location. Coordinates: {markerPosition.lat.toFixed(4)}, {markerPosition.lng.toFixed(4)}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 {/* --- End Google Map Integration --- */}

                 <FormField control={form.control} name="serviceAreaDescription" render={({ field }) => ( <FormItem><FormLabel>Service Area (if applicable)</FormLabel><FormControl><Textarea placeholder="Describe where you offer services if not fixed, e.g., 'Delivery within Diani', 'Tours cover South Coast'" {...field} /></FormControl><FormMessage /></FormItem> )} />
                 <FormField control={form.control} name="operatingHours" render={({ field }) => ( <FormItem><FormLabel>Operating Hours</FormLabel><FormControl><Textarea placeholder="e.g., Mon-Fri: 9am - 5pm, Sat: 10am - 2pm, Seasonal closures apply" {...field} /></FormControl><FormMessage /></FormItem> )} />
               </div>
             )}

            {/* Step 3: Listing Details & Services */}
            {currentStep === 3 && (
              <div className="space-y-4">
                 <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Detailed Business Description</FormLabel><FormControl><Textarea placeholder="Tell customers what makes your business special (min 50 characters)..." {...field} rows={5} /></FormControl><FormDescription>Use formatting and details to attract customers.</FormDescription><FormMessage /></FormItem> )} />
                 {/* Key Offerings/Categories - Placeholder - Needs better UI (MultiSelect, Checkboxes, TagsInput) */}
                 <FormItem>
                   <FormLabel>Key Offerings / Services (Optional)</FormLabel>
                   <FormControl><Input placeholder="e.g., Seafood, Guided Tours, Airport Transfers (comma-separated)" /></FormControl>
                   <FormDescription>Helps users filter and find you.</FormDescription>
                 </FormItem>
                 <FormField control={form.control} name="priceRange" render={({ field }) => ( <FormItem><FormLabel>Price Indication (Optional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select price range..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="$">$ (Budget)</SelectItem><SelectItem value="$$">$$ (Mid-range)</SelectItem><SelectItem value="$$$">$$$ (Premium)</SelectItem></SelectContent></Select><FormDescription>Give customers a general idea of your pricing.</FormDescription><FormMessage /></FormItem> )} />
              </div>
            )}

             {/* Step 4: Media Upload */}
             {currentStep === 4 && (
               <div className="space-y-4">
                 <h3 className="text-lg font-medium">Media Uploads</h3>
                 {/* Logo Upload Placeholder */}
                 <FormItem>
                   <FormLabel>Business Logo</FormLabel>
                   <FormControl><Input type="file" accept="image/*" /></FormControl>
                   <FormDescription>Recommended: Square format (e.g., 500x500px), JPG/PNG.</FormDescription>
                   <FormMessage />
                 </FormItem>
                  {/* Cover Photo Upload Placeholder */}
                 <FormItem>
                   <FormLabel>Cover Photo</FormLabel>
                   <FormControl><Input type="file" accept="image/*" /></FormControl>
                   <FormDescription>Recommended: Landscape format (e.g., 1200x400px), JPG/PNG.</FormDescription>
                   <FormMessage />
                 </FormItem>
                  {/* Gallery Upload Placeholder */}
                 <FormItem>
                   <FormLabel>Gallery Images/Videos (Optional)</FormLabel>
                   <FormControl><Input type="file" accept="image/*,video/*" multiple /></FormControl>
                   <FormDescription>Showcase your business visually (max 5 files).</FormDescription>
                   <FormMessage />
                 </FormItem>
               </div>
             )}

             {/* Step 5: Verification Documents */}
             {currentStep === 5 && (
               <div className="space-y-4">
                 <h3 className="text-lg font-medium">Verification Documents</h3>
                 <p className="text-sm text-gray-600">To ensure trust and safety, please upload the following documents. They are stored securely and used only for verification.</p>
                 {/* Document Upload Placeholders */}
                 <FormItem> <FormLabel>Business Permit</FormLabel><FormControl><Input type="file" accept=".pdf,.jpg,.jpeg,.png" /></FormControl><FormMessage /> </FormItem>
                 <FormItem> <FormLabel>KRA PIN Certificate</FormLabel><FormControl><Input type="file" accept=".pdf,.jpg,.jpeg,.png" /></FormControl><FormMessage /> </FormItem>
                 <FormItem> <FormLabel>Tourism License (if applicable)</FormLabel><FormControl><Input type="file" accept=".pdf,.jpg,.jpeg,.png" /></FormControl><FormMessage /> </FormItem>
                 {/* Add more based on logic */}

                 {/* Terms Agreement */}
                 <FormField control={form.control} name="agreeToTerms" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow mt-6">
                      <FormControl>
                         <input type="checkbox" checked={field.value} onChange={field.onChange} className="form-checkbox h-5 w-5 text-coral rounded border-gray-300 focus:ring-coral" />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Agree to Terms</FormLabel>
                        <FormDescription>
                          I agree to the Discover Diani <a href="/operator-terms" target="_blank" className="text-coral hover:underline">Operator Terms of Service</a>.
                        </FormDescription>
                         <FormMessage /> {/* Display validation message here */}
                      </div>
                    </FormItem>
                  )} />
               </div>
             )}

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button type="button" onClick={handleNext} disabled={isSubmitting}>
              {currentStep === TOTAL_STEPS ? (isSubmitting ? 'Submitting...' : 'Submit for Verification') : 'Next'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default OperatorOnboardingForm;
