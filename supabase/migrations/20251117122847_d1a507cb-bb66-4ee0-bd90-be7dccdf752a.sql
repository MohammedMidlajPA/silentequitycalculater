-- Create trading_segments table for evaluation data
CREATE TABLE IF NOT EXISTS public.trading_segments_evaluation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  segment text NOT NULL UNIQUE,
  pf_lot_100k decimal(10,3) NOT NULL,
  real_lot_100k decimal(10,3) NOT NULL,
  pf_lot_50k decimal(10,3) NOT NULL,
  real_lot_50k decimal(10,3) NOT NULL,
  pf_lot_25k decimal(10,3) NOT NULL,
  real_lot_25k decimal(10,3) NOT NULL,
  pf_lot_5k decimal(10,3) NOT NULL DEFAULT 0,
  real_lot_5k decimal(10,3) NOT NULL DEFAULT 0,
  tp decimal(10,3) NOT NULL,
  sl decimal(10,3) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trading_segments table for funded data
CREATE TABLE IF NOT EXISTS public.trading_segments_funded (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  segment text NOT NULL UNIQUE,
  pf_lot_100k decimal(10,3) NOT NULL,
  real_lot_100k decimal(10,3) NOT NULL,
  pf_lot_50k decimal(10,3) NOT NULL,
  real_lot_50k decimal(10,3) NOT NULL,
  pf_lot_25k decimal(10,3) NOT NULL,
  real_lot_25k decimal(10,3) NOT NULL,
  pf_lot_5k decimal(10,3) NOT NULL DEFAULT 0,
  real_lot_5k decimal(10,3) NOT NULL DEFAULT 0,
  tp decimal(10,3) NOT NULL,
  sl decimal(10,3) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create account_balances table
CREATE TABLE IF NOT EXISTS public.account_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_type text NOT NULL UNIQUE,
  balance decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert evaluation data
INSERT INTO public.trading_segments_evaluation (segment, pf_lot_100k, real_lot_100k, pf_lot_50k, real_lot_50k, pf_lot_25k, real_lot_25k, pf_lot_5k, real_lot_5k, tp, sl)
VALUES 
  ('P1 1ST TRADE', 4.000, 0.300, 2.000, 0.180, 1.000, 0.100, 0, 0, 20.200, 10.200),
  ('P1 2ND TRADE', 4.000, 0.300, 2.000, 0.180, 1.000, 0.100, 0, 0, 30.200, 10.200),
  ('P1 3RD TRADE', 2.000, 0.150, 1.000, 0.090, 0.500, 0.050, 0, 0, 80.200, 10.200),
  ('P2 1ST TRADE', 4.000, 0.550, 2.000, 0.320, 1.000, 0.180, 0, 0, 12.700, 10.200),
  ('P2 2ND TRADE', 4.000, 0.550, 2.000, 0.320, 1.000, 0.180, 0, 0, 22.700, 10.200),
  ('P2 3RD TRADE', 2.000, 0.275, 1.000, 0.160, 0.500, 0.090, 0, 0, 32.700, 10.200)
ON CONFLICT (segment) DO NOTHING;

-- Insert funded data
INSERT INTO public.trading_segments_funded (segment, pf_lot_100k, real_lot_100k, pf_lot_50k, real_lot_50k, pf_lot_25k, real_lot_25k, pf_lot_5k, real_lot_5k, tp, sl)
VALUES 
  ('1ST TRADE', 2.400, 0.940, 1.200, 0.480, 0.600, 0.240, 0, 0, 20.200, 10.200),
  ('2ND TRADE', 2.400, 0.940, 1.200, 0.480, 0.600, 0.240, 0, 0, 30.200, 10.200),
  ('3RD TRADE', 2.400, 0.940, 1.200, 0.480, 0.600, 0.240, 0, 0, 40.200, 10.200),
  ('4TH TRADE', 2.400, 0.940, 1.200, 0.480, 0.600, 0.240, 0, 0, 50.200, 10.200)
ON CONFLICT (segment) DO NOTHING;

-- Insert account balances
INSERT INTO public.account_balances (account_type, balance)
VALUES 
  ('100K', 1900),
  ('50K', 1000),
  ('25K', 500),
  ('5K', 0)
ON CONFLICT (account_type) DO NOTHING;

-- Enable RLS
ALTER TABLE public.trading_segments_evaluation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_segments_funded ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_balances ENABLE ROW LEVEL SECURITY;

-- Create policies for read-only public access to trading data
CREATE POLICY "Allow public read access to evaluation segments"
  ON public.trading_segments_evaluation
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to funded segments"
  ON public.trading_segments_funded
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to account balances"
  ON public.account_balances
  FOR SELECT
  USING (true);

-- Create update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_trading_segments_evaluation_updated_at
  BEFORE UPDATE ON public.trading_segments_evaluation
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trading_segments_funded_updated_at
  BEFORE UPDATE ON public.trading_segments_funded
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_account_balances_updated_at
  BEFORE UPDATE ON public.account_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();