import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, Sparkles, Zap, Crown } from 'lucide-react';

const services = [
  {
    id: 1,
    name: 'Classic Cut',
    description: 'Traditional haircut with precision and style',
    price: '$25',
    duration: '30 min',
    icon: Scissors,
    popular: false
  },
  {
    id: 2,
    name: 'Premium Fade',
    description: 'Modern fade with detailed styling and finish',
    price: '$35',
    duration: '45 min',
    icon: Zap,
    popular: true
  },
  {
    id: 3,
    name: 'Beard Trim',
    description: 'Professional beard styling and grooming',
    price: '$20',
    duration: '25 min',
    icon: Sparkles,
    popular: false
  },
  {
    id: 4,
    name: 'Royal Package',
    description: 'Complete grooming experience with hot towel service',
    price: '$60',
    duration: '90 min',
    icon: Crown,
    popular: false
  },
  {
    id: 5,
    name: 'Skin Fade',
    description: 'Ultra-precise skin fade with sharp lines',
    price: '$40',
    duration: '50 min',
    icon: Zap,
    popular: true
  },
  {
    id: 6,
    name: 'Deluxe Cut & Style',
    description: 'Cut, wash, style with premium products',
    price: '$45',
    duration: '60 min',
    icon: Crown,
    popular: false
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-slate">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional barbering services tailored to your style and preference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.id} 
                className={`relative bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-gold group ${
                  service.popular ? 'ring-2 ring-primary shadow-luxury' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-gold text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{service.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="text-center space-y-4">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{service.price}</div>
                    <div className="text-sm text-muted-foreground">{service.duration}</div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-gold text-primary-foreground hover:shadow-gold transition-all"
                    variant={service.popular ? "default" : "outline"}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;