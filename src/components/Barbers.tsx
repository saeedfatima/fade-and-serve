import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Clock } from 'lucide-react';
import barberProfile from '@/assets/barber-profile.jpg';

// Sample barber data - in real app, this would come from your Django API
const barbers = [
  {
    id: 1,
    name: 'Marcus Johnson',
    title: 'Master Barber',
    experience: '8 years',
    rating: 4.9,
    reviews: 156,
    specialties: ['Fades', 'Classic Cuts', 'Beard Styling'],
    bio: 'Expert in modern fades and traditional barbering techniques',
    image: barberProfile,
    available: true,
    nextSlot: 'Today 2:30 PM'
  },
  {
    id: 2,
    name: 'David Chen',
    title: 'Senior Barber',
    experience: '6 years',
    rating: 4.8,
    reviews: 124,
    specialties: ['Skin Fades', 'Pompadours', 'Hot Towel'],
    bio: 'Precision cutting specialist with attention to detail',
    image: barberProfile,
    available: true,
    nextSlot: 'Today 4:00 PM'
  },
  {
    id: 3,
    name: 'Alex Rodriguez',
    title: 'Barber',
    experience: '4 years',
    rating: 4.7,
    reviews: 89,
    specialties: ['Modern Cuts', 'Textured Styles', 'Beard Trims'],
    bio: 'Creative stylist bringing fresh modern looks',
    image: barberProfile,
    available: false,
    nextSlot: 'Tomorrow 10:00 AM'
  },
  {
    id: 4,
    name: 'Tony Milano',
    title: 'Master Barber',
    experience: '12 years',
    rating: 5.0,
    reviews: 203,
    specialties: ['Classic Cuts', 'Straight Razor', 'Premium Service'],
    bio: 'Traditional barbering master with old-school techniques',
    image: barberProfile,
    available: true,
    nextSlot: 'Today 5:30 PM'
  }
];

const Barbers = () => {
  return (
    <section id="barbers" className="py-20 bg-slate">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Skilled professionals dedicated to delivering exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {barbers.map((barber, index) => (
            <Card 
              key={barber.id} 
              className="bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-gold group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary transition-colors"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-card ${
                    barber.available ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                
                <CardTitle className="text-xl text-foreground">{barber.name}</CardTitle>
                <CardDescription className="text-primary font-semibold">
                  {barber.title}
                </CardDescription>
                
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Star className="h-4 w-4 text-primary fill-current" />
                  <span className="text-foreground font-semibold">{barber.rating}</span>
                  <span className="text-muted-foreground text-sm">({barber.reviews})</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  {barber.bio}
                </p>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Experience</p>
                  <p className="font-semibold text-foreground">{barber.experience}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">Specialties</p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {barber.specialties.map((specialty) => (
                      <Badge 
                        key={specialty} 
                        variant="secondary" 
                        className="text-xs bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Next available:</span>
                  </div>
                  <p className="text-sm font-semibold text-center text-foreground mb-3">
                    {barber.nextSlot}
                  </p>
                  
                  <Button 
                    className={`w-full ${
                      barber.available 
                        ? 'bg-gradient-gold text-primary-foreground hover:shadow-gold' 
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                    disabled={!barber.available}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {barber.available ? 'Book Now' : 'Not Available'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Barbers;