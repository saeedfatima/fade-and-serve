import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string;
  gender: string;
}

const ProfileManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone: '',
    avatar_url: '',
    gender: 'male'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      const fullName = data?.full_name || '';
      const parts = fullName.trim().split(' ');
      const first = parts[0] || '';
      const last = parts.slice(1).join(' ') || '';

      setProfile(prev => ({
        ...prev,
        first_name: first,
        last_name: last,
        phone: data?.phone || '',
        avatar_url: prev.avatar_url,
        gender: prev.gender,
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: ProfileData) => {
    const full_name = `${profileData.first_name} ${profileData.last_name}`.trim();

    // Try to update existing profile first
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name, phone: profileData.phone })
      .eq('user_id', user?.id as string);

    if (updateError) {
      // Attempt insert if no profile exists
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ user_id: user?.id, full_name, phone: profileData.phone });

      return { error: insertError };
    }

    return { error: null };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile(profile);

      if (error) {
        toast({
          title: "Error",
          description: typeof error === 'string' ? error : "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          My Profile
        </CardTitle>
        <CardDescription>
          Manage your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.avatar_url} alt="Profile avatar" />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {(profile.first_name?.charAt(0) || '')}{(profile.last_name?.charAt(0) || '')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center space-y-2">
            <Label htmlFor="avatar-url">Profile Picture URL</Label>
              <Input
                id="avatar-url"
                placeholder="https://example.com/image.jpg"
                value={profile.avatar_url}
                onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                className="max-w-xs"
              />
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              value={profile.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              value={profile.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={profile.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full bg-gradient-gold text-primary-foreground shadow-gold hover:shadow-luxury"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileManager;