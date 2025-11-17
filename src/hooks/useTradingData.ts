import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TradingSegment {
  id: string;
  segment: string;
  pf_lot_100k: number;
  real_lot_100k: number;
  pf_lot_50k: number;
  real_lot_50k: number;
  pf_lot_25k: number;
  real_lot_25k: number;
  pf_lot_5k: number;
  real_lot_5k: number;
  tp: number;
  sl: number;
}

export interface AccountBalance {
  account_type: string;
  balance: number;
}

export const useTradingDataEvaluation = () => {
  return useQuery({
    queryKey: ["trading-segments-evaluation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_segments_evaluation")
        .select("*")
        .order("segment");
      
      if (error) throw error;
      return data as TradingSegment[];
    },
  });
};

export const useTradingDataFunded = () => {
  return useQuery({
    queryKey: ["trading-segments-funded"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_segments_funded")
        .select("*")
        .order("segment");
      
      if (error) throw error;
      return data as TradingSegment[];
    },
  });
};

export const useAccountBalances = () => {
  return useQuery({
    queryKey: ["account-balances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("account_balances")
        .select("*")
        .order("account_type");
      
      if (error) throw error;
      return data as AccountBalance[];
    },
  });
};
