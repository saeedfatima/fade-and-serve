import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Scissors, Award, Users, Clock } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About YUSTIKUM BARBER
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Where tradition meets modern style. We've been crafting exceptional haircuts and providing premium grooming services for over a decade.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Founded in 2012, YUSTIKUM BARBER began as a small neighborhood barbershop with a simple mission: to provide exceptional haircuts in a welcoming environment. Over the years, we've grown into the city's premier destination for men's grooming.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our master barbers combine traditional techniques with contemporary styles, ensuring every client leaves looking and feeling their absolute best. We believe that a great haircut is more than just a service—it's an experience.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, we continue to uphold our commitment to excellence, innovation, and the timeless art of barbering.
              </p>
            </div>
            <div className="bg-gradient-gold rounded-2xl p-8 text-center shadow-luxury">
              <Scissors className="h-16 w-16 mx-auto mb-6 text-primary-foreground" />
              <h3 className="text-2xl font-bold text-primary-foreground mb-4">
                Master Craftsmanship
              </h3>
              <p className="text-primary-foreground/90">
                Every cut is a masterpiece, crafted with precision, passion, and decades of experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-background rounded-xl shadow-subtle hover:shadow-gold transition-all duration-300">
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-foreground mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for perfection in every cut, every style, every detail.
              </p>
            </div>
            
            <div className="text-center p-6 bg-background rounded-xl shadow-subtle hover:shadow-gold transition-all duration-300">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-foreground mb-3">Community</h3>
              <p className="text-muted-foreground">
                Building lasting relationships with our clients and neighborhood.
              </p>
            </div>
            
            <div className="text-center p-6 bg-background rounded-xl shadow-subtle hover:shadow-gold transition-all duration-300">
              <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-foreground mb-3">Tradition</h3>
              <p className="text-muted-foreground">
                Honoring classic barbering traditions while embracing innovation.
              </p>
            </div>
            
            <div className="text-center p-6 bg-background rounded-xl shadow-subtle hover:shadow-gold transition-all duration-300">
              <Scissors className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-foreground mb-3">Craftsmanship</h3>
              <p className="text-muted-foreground">
                Every haircut is a work of art, carefully crafted to perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Our skilled barbers bring years of experience and passion to every appointment
            </p>
            <div className="inline-flex items-center gap-2 text-primary font-semibold">
              <span>See all our barbers</span>
              <a href="/#barbers" className="hover:text-primary/80 transition-colors">→</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;