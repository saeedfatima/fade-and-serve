import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, DollarSign, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Booking {
  id: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    phone?: string;
  } | null;
}

const StaffDashboard = () => {
  const { user, userRole, signOut, loading } = useAuth();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const { toast } = useToast();

  // Redirect if not authenticated or not staff
  if (!loading && (!user || (userRole !== 'staff' && userRole !== 'admin'))) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user && (userRole === 'staff' || userRole === 'admin')) {
      fetchAllBookings();
    }
  }, [user, userRole]);

  const fetchAllBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles!user_id (
            first_name,
            last_name,
            phone
          )
        `)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        });
        return;
      }

      setAllBookings((data as any) || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking:', error);
        toast({
          title: "Error",
          description: "Failed to update booking status",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setAllBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
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

  const handleSignOut = async () => {
    await signOut();
  };

  const todayBookings = allBookings.filter(
    booking => booking.appointment_date === new Date().toISOString().split('T')[0]
  );

  const totalRevenue = allBookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + Number(booking.service_price), 0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Staff Dashboard</h1>
            <p className="text-muted-foreground">Manage appointments and customers</p>
          </div>
          <div className="flex gap-2">
            {userRole === 'admin' && (
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Admin Settings
              </Button>
            )}
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayBookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allBookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allBookings.filter(b => b.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* All Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
            <CardDescription>
              {loadingBookings ? 'Loading appointments...' : `Managing ${allBookings.length} appointments`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingBookings ? (
              <p>Loading...</p>
            ) : allBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No appointments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold">{booking.service_name}</h3>
                        <Badge className={`${getStatusColor(booking.status)} text-white`}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>Customer:</strong> {booking.profiles?.first_name} {booking.profiles?.last_name}</p>
                        {booking.profiles?.phone && (
                          <p><strong>Phone:</strong> {booking.profiles.phone}</p>
                        )}
                        <div className="flex items-center gap-4">
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
                          <p><strong>Notes:</strong> {booking.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold">${booking.service_price}</p>
                      </div>
                      <Select
                        value={booking.status}
                        onValueChange={(value) => updateBookingStatus(booking.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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

export default StaffDashboard;