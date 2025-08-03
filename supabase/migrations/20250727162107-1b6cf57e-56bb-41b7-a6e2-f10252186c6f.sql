
-- Create gadgets table
CREATE TABLE public.gadgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  condition TEXT DEFAULT 'good',
  available BOOLEAN DEFAULT true,
  seller_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gadget_transactions table for buy/swap operations
CREATE TABLE public.gadget_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gadget_id UUID REFERENCES public.gadgets(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'swap')),
  amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gadgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gadget_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for gadgets
CREATE POLICY "Anyone can view available gadgets" 
  ON public.gadgets 
  FOR SELECT 
  USING (available = true);

CREATE POLICY "Users can create their own gadgets" 
  ON public.gadgets 
  FOR INSERT 
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own gadgets" 
  ON public.gadgets 
  FOR UPDATE 
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own gadgets" 
  ON public.gadgets 
  FOR DELETE 
  USING (auth.uid() = seller_id);

-- RLS policies for transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.gadget_transactions 
  FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create transactions" 
  ON public.gadget_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own transactions" 
  ON public.gadget_transactions 
  FOR UPDATE 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Insert some sample gadgets data
INSERT INTO public.gadgets (name, category, price, description, image_url, condition, available) VALUES
('iPhone 13', 'phone', 450000, 'Apple iPhone 13 with 128GB storage in excellent condition', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=300', 'excellent', true),
('Samsung Galaxy S21', 'phone', 380000, 'Samsung Galaxy S21 with 256GB storage, barely used', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=300', 'good', true),
('MacBook Pro M1', 'laptop', 750000, '2020 MacBook Pro with M1 chip, 8GB RAM, 512GB SSD', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=300', 'excellent', true),
('Dell XPS 15', 'laptop', 650000, 'Dell XPS 15 with 16GB RAM, 1TB SSD, and 4K display', 'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?q=80&w=300', 'good', false),
('iPad Pro 11"', 'tablet', 420000, 'iPad Pro 11-inch with 256GB storage and Apple Pencil', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300', 'excellent', true);
