import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useAuth } from '@/contexts/auth'; // Import useAuth

// Remove mock function
// const registerUser = async (userData: any) => { ... };

const RegistrationForm = ({ onComplete }: { onComplete: () => void }) => {
  const { signUp, isSigningUp } = useAuth(); // Get signUp and loading state
  const [step, setStep] = useState(1);
  // Use isSigningUp from useAuth instead of local isSubmitting
  // const [isSubmitting, setIsSubmitting] = useState(false); 
  const [formData, setFormData] = useState({
    name: '',
    username: '', // Add username state
    email: '',
    password: '',
    isTourist: 'yes',
    stayDuration: '1-3',
    interests: [] as string[],
    dietaryPreferences: [] as string[],
    activityPreferences: [] as string[],
  });

  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev[category as keyof typeof prev] as string[];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [category]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [category]: [...currentValues, value]
        };
      }
    });
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step !== totalSteps) {
      nextStep();
      return;
    }
    
     // No need for local setIsSubmitting(true) here, useAuth handles it
     try {
       // Prepare data for signUp, converting stayDuration
       let stayDurationNum: number | null = null;
       if (formData.isTourist === 'yes') {
         if (formData.stayDuration === '15+') {
           stayDurationNum = 15; // Or handle as a special case/max value if needed
         } else {
           const parts = formData.stayDuration.split('-');
           if (parts.length === 2) {
             stayDurationNum = parseInt(parts[1], 10); // Use radix 10
             if (isNaN(stayDurationNum)) {
               stayDurationNum = null; // Handle parsing errors
             }
           }
         }
       }
       
       await signUp(formData.email, formData.password, { 
         full_name: formData.name, 
         username: formData.username,
         is_tourist: formData.isTourist === 'yes',
         stay_duration: stayDurationNum, // Pass converted number or null
         interests: formData.interests,
         dietary_preferences: formData.dietaryPreferences, // Pass dietary preferences
         // activityPreferences are not currently stored in the profile, so not passed
       });
       onComplete(); // Call onComplete after successful signup
    } catch (error) {
      // Error handling is likely done within useAuthMethods (toast messages)
      // You might add additional specific error handling here if needed
      console.error('Registration form error:', error); 
    } 
    // No need for finally block to set loading state, useAuth handles it
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-display text-ocean-dark">
                Create Your Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                 <Label htmlFor="username">Username</Label>
                 <Input
                   id="username"
                   name="username"
                   value={formData.username}
                   onChange={handleInputChange}
                   placeholder="Choose a unique username"
                   required
                   // Add pattern for validation if desired
                   // pattern="^[a-zA-Z0-9_]{3,20}$" 
                   // title="Username must be 3-20 characters and contain only letters, numbers, and underscores."
                 />
               </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a secure password"
                  required
                />
              </div>
            </CardContent>
          </>
        );
        
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-display text-ocean-dark">
                Your Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Are you a tourist visiting Diani Beach?</Label>
                <RadioGroup 
                  value={formData.isTourist}
                  onValueChange={(value) => handleRadioChange('isTourist', value)}
                  className="flex space-x-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="tourist-yes" />
                    <Label htmlFor="tourist-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="tourist-no" />
                    <Label htmlFor="tourist-no">No (I'm a local/resident)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>How long will you be staying in Diani?</Label>
                <RadioGroup 
                  value={formData.stayDuration}
                  onValueChange={(value) => handleRadioChange('stayDuration', value)}
                  className="space-y-2 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-3" id="stay-1-3" />
                    <Label htmlFor="stay-1-3">1-3 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4-7" id="stay-4-7" />
                    <Label htmlFor="stay-4-7">4-7 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="8-14" id="stay-8-14" />
                    <Label htmlFor="stay-8-14">8-14 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15+" id="stay-15+" />
                    <Label htmlFor="stay-15+">15+ days</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </>
        );
        
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-display text-ocean-dark">
                Your Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="mb-3 block">What interests you in Diani? (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { id: 'beaches', label: 'Beaches & Relaxation' },
                  { id: 'watersports', label: 'Water Sports' },
                  { id: 'wildlife', label: 'Wildlife & Safaris' },
                  { id: 'culture', label: 'Local Culture' },
                  { id: 'food', label: 'Food & Cuisine' },
                  { id: 'nightlife', label: 'Nightlife' },
                  { id: 'shopping', label: 'Shopping' },
                  { id: 'history', label: 'History & Heritage' }
                ].map(item => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={item.id} 
                      checked={formData.interests.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleCheckboxChange('interests', item.id);
                        } else {
                          handleCheckboxChange('interests', item.id);
                        }
                      }}
                    />
                    <Label htmlFor={item.id}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </>
        );
        
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-display text-ocean-dark">
                Lifestyle Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Dietary Preferences (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { id: 'no-restrictions', label: 'No Restrictions' },
                    { id: 'vegetarian', label: 'Vegetarian' },
                    { id: 'vegan', label: 'Vegan' },
                    { id: 'halal', label: 'Halal' },
                    { id: 'gluten-free', label: 'Gluten-Free' },
                    { id: 'seafood-lover', label: 'Seafood Lover' }
                  ].map(item => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`diet-${item.id}`} 
                        checked={formData.dietaryPreferences.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleCheckboxChange('dietaryPreferences', item.id);
                          } else {
                            handleCheckboxChange('dietaryPreferences', item.id);
                          }
                        }}
                      />
                      <Label htmlFor={`diet-${item.id}`}>{item.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Activity Preferences (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { id: 'adventure', label: 'Adventure & Thrills' },
                    { id: 'relaxation', label: 'Relaxation & Wellness' },
                    { id: 'nightlife', label: 'Nightlife & Entertainment' },
                    { id: 'family', label: 'Family-Friendly' },
                    { id: 'cultural', label: 'Cultural Experiences' },
                    { id: 'eco', label: 'Eco-Tourism & Nature' }
                  ].map(item => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`activity-${item.id}`} 
                        checked={formData.activityPreferences.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleCheckboxChange('activityPreferences', item.id);
                          } else {
                            handleCheckboxChange('activityPreferences', item.id);
                          }
                        }}
                      />
                      <Label htmlFor={`activity-${item.id}`}>{item.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-md w-full mx-auto">
        {renderStep()}
        
        <div className="px-6 pb-6">
          {/* Progress indicator */}
          <div className="flex justify-between items-center mb-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full ${
                  index + 1 <= step 
                    ? 'bg-ocean text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index + 1 < step ? (
                  <Check size={16} />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            {step > 1 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button 
              type="submit"
              className="bg-ocean hover:bg-ocean-dark"
              disabled={isSigningUp} // Use isSigningUp for disabled state
            >
              {step === totalSteps ? (
                isSigningUp ? 'Creating Account...' : 'Complete Registration' // Use isSigningUp for loading text
              ) : (
                <span className="flex items-center gap-1">
                  Next
                  <ChevronRight size={16} />
                </span>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default RegistrationForm;
