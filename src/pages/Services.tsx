import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scissors, Clock, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const services = [
  {
    id: 1,
    name: "Classic Haircut",
    description: "Traditional men's haircut with precision and style",
    price: "$30",
    duration: "45 min",
    icon: Scissors,
    popular: false,
  },
  {
    id: 2,
    name: "Beard Trim",
    description: "Professional beard shaping and trimming",
    price: "$20",
    duration: "30 min",
    icon: Scissors,
    popular: false,
  },
  {
    id: 3,
    name: "Premium Cut & Style",
    description: "Complete haircut with wash, cut, and styling",
    price: "$50",
    duration: "60 min",
    icon: Scissors,
    popular: true,
  },
  {
    id: 4,
    name: "Hot Towel Shave",
    description: "Luxurious traditional straight razor shave",
    price: "$35",
    duration: "45 min",
    icon: Scissors,
    popular: false,
  },
  {
    id: 5,
    name: "Father & Son Cut",
    description: "Special package for father and son haircuts",
    price: "$60",
    duration: "90 min",
    icon: Scissors,
    popular: false,
  },
  {
    id: 6,
    name: "The Full Service",
    description: "Complete grooming experience with cut, beard, and styling",
    price: "$75",
    duration: "120 min",
    icon: Scissors,
    popular: true,
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our Services
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Professional grooming services tailored to your style and needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card
                  key={service.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-elegant animate-fade-in ${
                    service.popular
                      ? "border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/10"
                      : "hover:border-primary/30"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {service.popular && (
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">{service.description}</p>
                    <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-primary">{service.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:shadow-glow"
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Services;