import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import haircutStyles from "@/assets/haircut-styles.jpg";
import barberCutting from "@/assets/barber-cutting.jpg";
import heroImage from "@/assets/hero-barber-shop.jpg";
import barberProfile from "@/assets/barber-profile.jpg";

const galleryItems = [
  {
    id: 1,
    image: haircutStyles,
    title: "Modern Fade Cuts",
    category: "Haircuts",
  },
  {
    id: 2,
    image: barberCutting,
    title: "Classic Scissor Work",
    category: "Techniques",
  },
  {
    id: 3,
    image: heroImage,
    title: "Shop Interior",
    category: "Atmosphere",
  },
  {
    id: 4,
    image: barberProfile,
    title: "Master Barber",
    category: "Team",
  },
  {
    id: 5,
    image: haircutStyles,
    title: "Beard Styling",
    category: "Grooming",
  },
  {
    id: 6,
    image: barberCutting,
    title: "Precision Cuts",
    category: "Haircuts",
  },
  {
    id: 7,
    image: heroImage,
    title: "Vintage Tools",
    category: "Equipment",
  },
  {
    id: 8,
    image: barberProfile,
    title: "Client Satisfaction",
    category: "Results",
  },
];

const categories = ["All", "Haircuts", "Techniques", "Atmosphere", "Team", "Grooming", "Equipment", "Results"];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = selectedCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our Gallery
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore our work and see the quality that sets us apart
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                      <span className="text-primary text-sm font-medium">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No items found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;