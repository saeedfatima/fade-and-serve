import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileManager from '@/components/ProfileManager';
import UserMenu from '@/components/UserMenu';

interface Booking {
  id: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface Profile {
  first_name: string;
  last_name: string;
  phone?: string;
}

const Dashboard = () => {
  const { user, userRole, signOut, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user) {
      fetchUserBookings();
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) {
        console.error('Error cancelling booking:', error);
        return;
      }

      // Refresh bookings
      fetchUserBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Redirect staff to staff dashboard
  if (userRole === 'staff' || userRole === 'admin') {
    return <Navigate to="/staff-dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.first_name || 'User'}!</h1>
            <p className="text-muted-foreground">Manage your appointments and profile</p>
          </div>
          <UserMenu />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Stats */}

          <Card>
            <CardHeader>
              <CardTitle>Appointment Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Total Bookings:</strong> {bookings.length}</p>
                <p><strong>Pending:</strong> {bookings.filter(b => b.status === 'pending').length}</p>
                <p><strong>Confirmed:</strong> {bookings.filter(b => b.status === 'confirmed').length}</p>
                <p><strong>Completed:</strong> {bookings.filter(b => b.status === 'completed').length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <a href="/book-service">Book New Appointment</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/gallery">View Gallery</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Management */}
        <div className="mt-8">
          <ProfileManager />
        </div>

        {/* Recent Bookings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Appointments</CardTitle>
            <CardDescription>
              {loadingBookings ? 'Loading appointments...' : `You have ${bookings.length} appointments`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingBookings ? (
              <p>Loading...</p>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No appointments yet</p>
                <Button asChild>
                  <a href="/book-service">Book Your First Appointment</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{booking.service_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.appointment_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {booking.appointment_time}
                        </span>
                      </div>
                      {booking.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Note: {booking.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(booking.status)} text-white`}>
                        {booking.status}
                      </Badge>
                      <p className="text-sm font-semibold mt-1">
                        ₦{booking.service_price.toLocaleString()}
                      </p>
                      {booking.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="mt-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;