import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Scissors, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import barberProfile from "@/assets/barber-profile.jpg";

const barbers = [
  {
    id: 1,
    name: "Yusuf Tijjani",
    title: "Master Barber & CEO",
    experience: "10+ years",
    specialties: ["Classic Cuts", "Beard Styling", "Straight Razor"],
    rating: 4.9,
    image: barberProfile,
    bio: "Marcus founded Elite Cuts with a vision to bring traditional barbering excellence to modern times. His attention to detail and passion for the craft have made him a sought-after barber.",
    featured: true,
  },
  {
    id: 2,
    name: "ABUBAKAR SANI",
    title: "Senior Barber",
    experience: "10+ years",
    specialties: ["Modern Fades", "Hair Design", "Styling"],
    rating: 4.8,
    image: barberProfile,
    bio: "David specializes in contemporary cuts and innovative styling techniques. He stays updated with the latest trends while maintaining classic barbering standards.",
    featured: false,
  },
  {
    id: 3,
    name: "KASHIM MUHAMUD",
    title: "Barber",
    experience: "7+ years",
    specialties: ["Classic Cuts", "Pompadours", "Grooming"],
    rating: 4.7,
    image: barberProfile,
    bio: "James brings creativity and precision to every cut. His friendly personality and skilled hands ensure every client leaves feeling confident and looking sharp.",
    featured: false,
  },
  {
    id: 4,
    name: "MUSA IBRAHIM",
    title: "Barber",
    experience: "5+ years",
    specialties: ["Fades", "Beard Trims", "Hot Towel Shaves"],
    rating: 4.8,
    image: barberProfile,
    bio: "Antonio is known for his meticulous fade work and relaxing hot towel shaves. He believes in creating a comfortable experience for every client.",
    featured: false,
  },
];

const Team = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Meet Our Team
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Skilled professionals dedicated to delivering exceptional grooming experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {barbers.map((barber, index) => (
                <Card
                  key={barber.id}
                  className={`group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-elegant animate-fade-in ${
                    barber.featured
                      ? "border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/10 md:col-span-2 lg:col-span-1"
                      : "hover:border-primary/30"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {barber.featured && (
                    <Badge className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground">
                      <Award className="h-3 w-3 mr-1" />
                      Master Barber
                    </Badge>
                  )}
                  
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={barber.image}
                      alt={barber.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <CardContent className="p-6 relative">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-foreground mb-1">{barber.name}</h3>
                      <p className="text-primary font-medium mb-2">{barber.title}</p>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{barber.rating}</span>
                        <span className="text-xs text-muted-foreground">• {barber.experience}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {barber.bio}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Scissors className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Specialties:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {barber.specialties.map((specialty) => (
                          <Badge
                            key={specialty}
                            variant="secondary"
                            className="text-xs bg-secondary/80 text-secondary-foreground"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16 animate-fade-in">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Experience Our Expertise?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Book an appointment with any of our skilled barbers and discover why we're the preferred choice for discerning gentlemen.
                </p>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-glow">
                  Book Your Appointment
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Team;