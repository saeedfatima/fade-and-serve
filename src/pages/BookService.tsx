import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Banknote } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from '@/hooks/useDjangoAuth';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

const BookService = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState(
    searchParams.get('service') || ""
  );
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiClient.getServices();
        
        if (response.error) {
          console.error('Error fetching services:', response.error);
          return;
        }

        setServices((response.data as Service[]) || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Please login to book a service.</p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedServiceData = services.find(s => s.name === selectedService);

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a service, date, and time.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedServiceData) {
      toast({
        title: "Invalid Service",
        description: "Please select a valid service.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiClient.createBooking({
        service_id: selectedServiceData.id,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        notes: notes || undefined,
      });

      if (response.error) {
        console.error('Booking error:', response.error);
        toast({
          title: "Booking Failed",
          description: response.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Booking Confirmed!",
        description: "Your appointment has been booked successfully.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Book Your Service</h1>
            <p className="text-muted-foreground">Choose your preferred service, date, and time</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service">Select Service</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.name}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.name}</span>
                          <div className="flex items-center gap-2 ml-4">
                            <div className="flex items-center gap-1">
                              <Banknote className="h-3 w-3" />
                              <span className="text-sm">₦{service.price.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-sm">{service.duration_minutes} mins</span>
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Details */}
              {selectedServiceData && (
                <Card className="bg-secondary/20">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{selectedServiceData.name}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Banknote className="h-4 w-4 text-primary" />
                          <span className="font-semibold">₦{selectedServiceData.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{selectedServiceData.duration_minutes} mins</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => 
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label htmlFor="time">Select Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Special Requests (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests or preferences..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Book Button */}
              <Button 
                onClick={handleBooking}
                disabled={isLoading || !selectedService || !selectedDate || !selectedTime}
                className="w-full"
              >
                {isLoading ? 'Booking...' : 'Book Appointment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookService;