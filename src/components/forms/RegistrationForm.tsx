
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

// Mock registration function - would connect to backend in production
const registerUser = async (userData: any) => {
  console.log('Registering user:', userData);
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

const RegistrationForm = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
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
    
    setIsSubmitting(true);
    try {
      await registerUser(formData);
      onComplete();
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
            >
              {step === totalSteps ? (
                isSubmitting ? 'Creating Account...' : 'Complete Registration'
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
