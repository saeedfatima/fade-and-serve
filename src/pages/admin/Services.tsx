import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Clock, DollarSign, Home, Settings2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  duration_display: string;
  is_active: boolean;
  has_home_service?: boolean;
  has_new_equipment?: boolean;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await apiClient.getServices();
      if (response.data) {
        setServices(response.data as Service[]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleHomeService = async (serviceId: number, currentStatus: boolean) => {
    // This would update the service to enable/disable home service
    toast({
      title: "Success",
      description: `Home service ${!currentStatus ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage barber services and pricing</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Create a new barber service with pricing and duration.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" placeholder="e.g., Classic Haircut" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Service description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" placeholder="25.00" />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" placeholder="30" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="home-service" />
                <Label htmlFor="home-service">Available for home service</Label>
              </div>
              <Button className="w-full">Create Service</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No services found</p>
          </div>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {service.description}
                    </CardDescription>
                  </div>
                  <Badge variant={service.is_active ? "outline" : "secondary"}>
                    {service.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${service.price}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration_display}
                  </div>
                </div>

                <div className="space-y-3 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Home className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Home Service</span>
                    </div>
                    <Switch
                      checked={service.has_home_service}
                      onCheckedChange={() => toggleHomeService(service.id, service.has_home_service || false)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Settings2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">New Equipment</span>
                    </div>
                    <Switch checked={service.has_new_equipment} />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Services;