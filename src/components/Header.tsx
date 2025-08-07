import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Scissors, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userRole } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">YUSTIKUM BARBER</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link to="/gallery" className="text-foreground hover:text-primary transition-colors">
              Gallery
            </Link>
            <Link to="/team" className="text-foreground hover:text-primary transition-colors">
              Team
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Button asChild size="sm" className="bg-gradient-gold text-primary-foreground shadow-gold hover:shadow-luxury">
                <Link to={userRole === 'staff' || userRole === 'admin' ? '/staff-dashboard' : '/dashboard'}>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-gold text-primary-foreground shadow-gold hover:shadow-luxury">
                  <Link to="/services">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/services" className="text-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/gallery" className="text-foreground hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link to="/team" className="text-foreground hover:text-primary transition-colors">
                Team
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <Button asChild size="sm" className="bg-gradient-gold text-primary-foreground shadow-gold">
                    <Link to={userRole === 'staff' || userRole === 'admin' ? '/staff-dashboard' : '/dashboard'}>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link to="/auth">
                        <User className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="bg-gradient-gold text-primary-foreground shadow-gold">
                      <Link to="/services">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;