// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Save,
  Loader2,
  Edit,
  Award,
  TrendingUp,
  Leaf,
  Clock,
  DollarSign,
  MapPin,
  Settings,
  History
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferences: {}
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        preferences: user.preferences || {}
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile(formData);
      updateUser({ ...user, ...formData });
      setEditMode(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        className="pl-10"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Shield className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="font-medium capitalize">{user?.role || 'User'}</p>
                        <p className="text-sm text-gray-500">Account permissions level</p>
                      </div>
                      {user?.role === 'admin' && (
                        <Badge className="ml-auto">Administrator</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">Date you joined CommuteGo</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Commute Preferences</CardTitle>
                  <CardDescription>
                    Customize your default commute settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Default Route Preferences</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Preferred Mode</Label>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">Balanced</p>
                          <p className="text-sm text-gray-500">Cost, time, and eco balance</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Max Daily Budget</Label>
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">$20.00</p>
                          <p className="text-sm text-gray-500">Maximum daily commute spend</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Notification Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Route Alerts</p>
                          <p className="text-sm text-gray-500">Traffic and delay notifications</p>
                        </div>
                        <div className="h-4 w-9 rounded-full bg-primary-600"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Weekly Reports</p>
                          <p className="text-sm text-gray-500">Commute analytics and insights</p>
                        </div>
                        <div className="h-4 w-9 rounded-full bg-primary-600"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Promotional Offers</p>
                          <p className="text-sm text-gray-500">Discounts and special deals</p>
                        </div>
                        <div className="h-4 w-9 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>
                    Your accomplishments and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { icon: TrendingUp, title: 'Eco Warrior', desc: 'Saved 100kg CO₂', earned: true },
                      { icon: Leaf, title: 'Green Commuter', desc: '50 eco-friendly trips', earned: true },
                      { icon: Clock, title: 'Time Saver', desc: 'Saved 50 hours', earned: false },
                      { icon: Award, title: 'Early Bird', desc: '50 morning commutes', earned: true },
                      { icon: DollarSign, title: 'Budget Master', desc: 'Saved $500', earned: false },
                      { icon: User, title: 'Community Builder', desc: '10 friends invited', earned: false },
                    ].map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <achievement.icon className={`h-5 w-5 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <p className="font-medium">{achievement.title}</p>
                            <p className="text-sm text-gray-500">{achievement.desc}</p>
                          </div>
                        </div>
                        {achievement.earned ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Earned
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
                            Locked
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Profile Card */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                  <AvatarFallback className="text-xl">
                    {getInitials(user?.name || 'User')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-gray-500 mb-4">{user?.email}</p>
                <Badge variant={user?.role === 'admin' ? 'default' : 'outline'} className="mb-6">
                  {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
                </Badge>
                
                <Separator className="my-4" />
                
                <div className="w-full space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commutes</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Saved</span>
                    <span className="font-medium text-green-600">$1,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbon Saved</span>
                    <span className="font-medium text-emerald-600">85 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">
                      {user?.created_at ? new Date(user.created_at).getFullYear() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/plan">
                  <MapPin className="h-4 w-4 mr-2" />
                  Plan New Commute
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/history">
                  <History className="h-4 w-4 mr-2" />
                  View History
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;