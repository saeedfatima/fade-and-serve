import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import haircutStyles from '@/assets/haircut-styles.jpg';
import barberCutting from '@/assets/barber-cutting.jpg';

// Sample haircut data - in real app, this would come from your Django API
const haircutData = [
  {
    id: 1,
    name: 'Classic Fade',
    price: '₦6,000',
    image: haircutStyles,
    category: 'Fade'
  },
  {
    id: 2,
    name: 'Skin Fade',
    price: '₦3,000',
    image: barberCutting,
    category: 'Fade'
  },
  {
    id: 3,
    name: 'Pompadour',
    price: '₦5,000',
    image: haircutStyles,
    category: 'Classic'
  },
  {
    id: 4,
    name: 'Undercut',
    price: '₦9,000',
    image: barberCutting,
    category: 'Modern'
  },
  {
    id: 5,
    name: 'Buzz Cut',
    price: '₦12,000',
    image: haircutStyles,
    category: 'Classic'
  },
  {
    id: 6,
    name: 'Textured Crop',
    price: '₦18,000',
    image: barberCutting,
    category: 'Modern'
  },
  {
    id: 7,
    name: 'Mid Fade',
    price: '₦4,000',
    image: haircutStyles,
    category: 'Fade'
  },
  {
    id: 8,
    name: 'Quiff',
    price: '₦7,000',
    image: barberCutting,
    category: 'Classic'
  }
];

const categories = ['All', 'Fade', 'Classic', 'Modern'];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookStyle = (styleName: string) => {
    if (user) {
      navigate(`/book-service?style=${encodeURIComponent(styleName)}`);
    } else {
      navigate('/auth');
    }
  };

  const filteredHaircuts = selectedCategory === 'All' 
    ? haircutData 
    : haircutData.filter(haircut => haircut.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Work
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Browse our gallery of precision cuts and satisfied clients
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-gradient-gold text-primary-foreground shadow-gold" 
                  : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredHaircuts.map((haircut, index) => (
            <Card 
              key={haircut.id} 
              className="group overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-gold"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={haircut.image}
                    alt={haircut.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {haircut.name}
                      </h3>
                      <p className="text-primary font-bold text-xl">
                        {haircut.price}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-foreground">{haircut.name}</h3>
                      <p className="text-sm text-muted-foreground">{haircut.category}</p>
                    </div>
                    <div className="text-primary font-bold text-lg">
                      {haircut.price}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-3 bg-gradient-gold text-primary-foreground hover:shadow-gold transition-all"
                    size="sm"
                    onClick={() => handleBookStyle(haircut.name)}
                  >
                    Book This Style
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Load More Styles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;