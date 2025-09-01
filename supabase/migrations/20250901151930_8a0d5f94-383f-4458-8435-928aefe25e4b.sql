-- Remove medical/pharmaceutical tables that are not relevant for a barber shop
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS manufacturers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS credit_topups CASCADE;
DROP TABLE IF EXISTS user_credits CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Create barber shop services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  duration INTEGER NOT NULL, -- duration in minutes
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Anyone can view active services
CREATE POLICY "Anyone can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true);

-- Only authenticated users can manage services (for staff/admin)
CREATE POLICY "Authenticated users can manage services" 
ON public.services 
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create bookings table for barber appointments
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  barber_id UUID, -- references profiles table for staff
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(appointment_date, appointment_time)
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own bookings
CREATE POLICY "Users can delete their own bookings" 
ON public.bookings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample barber services
INSERT INTO public.services (name, description, price, duration) VALUES
('Classic Haircut', 'Traditional haircut with scissors and clippers', 25.00, 30),
('Beard Trim', 'Professional beard trimming and shaping', 15.00, 20),
('Hair Wash & Style', 'Hair washing with styling', 20.00, 25),
('Buzz Cut', 'Short all-over cut with clippers', 18.00, 15),
('Mustache Trim', 'Mustache trimming and grooming', 10.00, 10),
('Full Service', 'Haircut, beard trim, and styling', 40.00, 60);