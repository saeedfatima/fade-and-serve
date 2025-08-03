import { Button } from '@/components/ui/button';
import { Calendar, Star, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-barber-shop.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern barber shop interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Premium
            <span className="block text-primary">Barbering</span>
            Experience
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Where traditional craftsmanship meets modern style. Expert cuts, premium service, unforgettable experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-gold text-primary-foreground shadow-luxury hover:animate-gold-glow text-lg px-8 py-4"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Appointment
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4"
            >
              View Gallery
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-slide-up">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-primary mr-2" />
                <span className="text-3xl font-bold text-primary">4.9</span>
              </div>
              <p className="text-muted-foreground">Google Rating</p>
            </div>
            
            <div className="text-center animate-slide-up">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-primary">500+</span>
              </div>
              <p className="text-muted-foreground">Happy Clients</p>
            </div>
            
            <div className="text-center animate-slide-up">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-primary mr-2" />
                <span className="text-lg font-semibold text-foreground">Downtown</span>
              </div>
              <p className="text-muted-foreground">Prime Location</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;