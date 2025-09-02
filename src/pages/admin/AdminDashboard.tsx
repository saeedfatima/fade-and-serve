import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Users, DollarSign, Star, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useDjangoAuth';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: number;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  is_vip: boolean;
  is_home_service: boolean;
  use_new_equipment: boolean;
  notes?: string;
  created_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

const AdminDashboard = () => {
  const { user, userRole } = useAuth();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user && (userRole === 'staff' || userRole === 'admin')) {
      fetchAllBookings();
    }
  }, [user, userRole]);

  const fetchAllBookings = async () => {
    try {
      const response = await apiClient.getBookings();

      if (response.error) {
        console.error('Error fetching bookings:', response.error);
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        });
        return;
      }

      setAllBookings((response.data as Booking[]) || []);
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

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await apiClient.updateBooking(bookingId, { status: newStatus });

      if (response.error) {
        console.error('Error updating booking:', response.error);
        toast({
          title: "Error",
          description: "Failed to update booking status",
          variant: "destructive",
        });
        return;
      }

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

  const toggleVipStatus = async (bookingId: number, currentVipStatus: boolean) => {
    try {
      const response = await apiClient.updateBooking(bookingId, { is_vip: !currentVipStatus });

      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to update VIP status",
          variant: "destructive",
        });
        return;
      }

      setAllBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, is_vip: !currentVipStatus }
            : booking
        )
      );

      toast({
        title: "Success",
        description: `VIP status ${!currentVipStatus ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update VIP status",
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

  const todayBookings = allBookings.filter(
    booking => booking.appointment_date === new Date().toISOString().split('T')[0]
  );

  const totalRevenue = allBookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + Number(booking.service_price), 0);

  const vipBookings = allBookings.filter(booking => booking.is_vip);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage appointments, customers, and services</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayBookings.filter(b => b.status === 'confirmed').length} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {allBookings.filter(b => b.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vipBookings.length}</div>
            <p className="text-xs text-muted-foreground">Premium service bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From completed bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
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
              {allBookings.slice(0, 10).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold">{booking.service_name}</h3>
                      <Badge className={`${getStatusColor(booking.status)} text-white`}>
                        {booking.status}
                      </Badge>
                      {booking.is_vip && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                          <Star className="w-3 h-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                      {booking.is_home_service && (
                        <Badge variant="outline" className="border-blue-500 text-blue-600">
                          <Home className="w-3 h-3 mr-1" />
                          Home Service
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <p>
                        <strong>Customer:</strong> {booking.user?.first_name} {booking.user?.last_name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.appointment_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.appointment_time}
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold">${booking.service_price}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={booking.is_vip}
                          onCheckedChange={() => toggleVipStatus(booking.id, booking.is_vip)}
                          className="data-[state=checked]:bg-yellow-500"
                        />
                        <span className="text-xs text-muted-foreground">VIP</span>
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
                </div>
              ))}
              
              {allBookings.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline">View All Appointments</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;