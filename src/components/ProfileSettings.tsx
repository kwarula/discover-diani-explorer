import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

const ProfileSettings = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Form state
  const [formState, setFormState] = useState({
    full_name: '',
    username: '',
    bio: '',
    is_tourist: false,
    stay_duration: '',
    interests: [] as string[],
    dietary_preferences: [] as string[],
  });

  // New interest input
  const [newInterest, setNewInterest] = useState('');
  const [newDietaryPreference, setNewDietaryPreference] = useState('');

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      setFormState({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        is_tourist: profile.is_tourist || false,
        stay_duration: profile.stay_duration?.toString() || '',
        interests: profile.interests || [],
        dietary_preferences: profile.dietary_preferences || [],
      });
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormState(prev => ({ ...prev, is_tourist: checked }));
  };

  const handleStayDurationChange = (value: string) => {
    setFormState(prev => ({ ...prev, stay_duration: value }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formState.interests.includes(newInterest.trim())) {
      setFormState(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormState(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addDietaryPreference = () => {
    if (newDietaryPreference.trim() && !formState.dietary_preferences.includes(newDietaryPreference.trim())) {
      setFormState(prev => ({
        ...prev,
        dietary_preferences: [...prev.dietary_preferences, newDietaryPreference.trim()]
      }));
      setNewDietaryPreference('');
    }
  };

  const removeDietaryPreference = (preference: string) => {
    setFormState(prev => ({
      ...prev,
      dietary_preferences: prev.dietary_preferences.filter(p => p !== preference)
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setAvatarFile(file);
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return;

    try {
      setUploadingAvatar(true);
      
      // Create a unique file path
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Update the profile with the new avatar URL
      await updateProfile({
        id: user.id,
        avatar_url: data.publicUrl
      });

      toast.success('Avatar updated successfully');
      setAvatarFile(null);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Error uploading avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const updateUserProfile = async () => {
    // Make sure we have a user and profile before attempting update
    if (!user || !profile) {
      toast.error("Please log in to update your profile");
      return;
    }

    try {
      // Pass both the profile ID and the updates
      await updateProfile({
        id: user.id,
        ...formState
      });
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Please log in to view your profile settings.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="general">General Information</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and how others see you on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl || ''} alt={formState.full_name} />
                <AvatarFallback className="text-lg">
                  {formState.full_name.split(' ').map(n => n[0]).join('').toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Upload size={16} />
                    <span>Upload new picture</span>
                  </div>
                  <Input 
                    id="avatar" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange} 
                  />
                </Label>
                {avatarFile && (
                  <Button 
                    size="sm" 
                    onClick={uploadAvatar} 
                    disabled={uploadingAvatar}
                    className="w-fit"
                  >
                    {uploadingAvatar ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : 'Save Avatar'}
                  </Button>
                )}
              </div>
            </div>

            {/* Name & Username */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formState.full_name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formState.username}
                  onChange={handleInputChange}
                  placeholder="your_username"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formState.bio}
                onChange={handleInputChange}
                placeholder="Tell us a bit about yourself"
                rows={4}
              />
            </div>

            {/* Tourist Status */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_tourist" 
                  checked={formState.is_tourist}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_tourist">I am a tourist visiting Diani Beach</Label>
              </div>

              {formState.is_tourist && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="stay_duration">How long are you staying?</Label>
                  <Select 
                    value={formState.stay_duration} 
                    onValueChange={handleStayDurationChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Less than 3 days</SelectItem>
                      <SelectItem value="7">About a week</SelectItem>
                      <SelectItem value="14">Two weeks</SelectItem>
                      <SelectItem value="30">A month</SelectItem>
                      <SelectItem value="90">Several months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={updateUserProfile} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
            <CardDescription>
              Tell us about your interests and preferences to get personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Interests */}
            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formState.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <button 
                      type="button" 
                      onClick={() => removeInterest(interest)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest (e.g., Snorkeling, Hiking)"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                />
                <Button type="button" size="icon" onClick={addInterest}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Dietary Preferences */}
            <div className="space-y-2">
              <Label>Dietary Preferences</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formState.dietary_preferences.map((preference, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {preference}
                    <button 
                      type="button" 
                      onClick={() => removeDietaryPreference(preference)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newDietaryPreference}
                  onChange={(e) => setNewDietaryPreference(e.target.value)}
                  placeholder="Add a dietary preference (e.g., Vegetarian, Gluten-free)"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryPreference())}
                />
                <Button type="button" size="icon" onClick={addDietaryPreference}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={updateUserProfile} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileSettings;
