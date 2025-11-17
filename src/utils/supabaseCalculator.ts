import type { TradingSegment } from "@/hooks/useTradingData";

export type AccountType = "100K" | "50K" | "25K" | "5K";
export type TradeAction = "BUY" | "SELL";
export type StageType = "EVALUATION" | "FUNDED";

export interface CalculationResult {
  pfLot: number;
  realLot: number;
  pfTP: number;
  pfSL: number;
  realTP: number;
  realSL: number;
  balance: number;
}

export function calculateTradeFromSupabase(
  segment: TradingSegment | undefined,
  accountType: AccountType,
  action: TradeAction,
  pfOpenPrice: number,
  realOpenPrice: number,
  balance: number
): CalculationResult {
  if (!segment) {
    return {
      pfLot: 0,
      realLot: 0,
      pfTP: 0,
      pfSL: 0,
      realTP: 0,
      realSL: 0,
      balance: 0,
    };
  }

  // Get lot sizes based on account type
  const lotMap: Record<AccountType, { pf: keyof TradingSegment; real: keyof TradingSegment }> = {
    "100K": { pf: "pf_lot_100k", real: "real_lot_100k" },
    "50K": { pf: "pf_lot_50k", real: "real_lot_50k" },
    "25K": { pf: "pf_lot_25k", real: "real_lot_25k" },
    "5K": { pf: "pf_lot_5k", real: "real_lot_5k" },
  };

  const lotKeys = lotMap[accountType];
  const pfLot = Number(segment[lotKeys.pf]);
  const realLot = Number(segment[lotKeys.real]);
  const tp = Number(segment.tp);
  const sl = Number(segment.sl);

  // Calculate TP and SL based on action
  let pfTP: number, pfSL: number, realTP: number, realSL: number;

  if (action === "SELL") {
    // For SELL (PF): TP = Open - TP, SL = Open + SL
    pfTP = pfOpenPrice - tp;
    pfSL = pfOpenPrice + sl;
    // For SELL (Real): TP = Open - TP, SL = Open + SL
    realTP = realOpenPrice - tp;
    realSL = realOpenPrice + sl;
  } else {
    // For BUY (PF): TP = Open + TP, SL = Open - SL
    pfTP = pfOpenPrice + tp;
    pfSL = pfOpenPrice - sl;
    // For BUY (Real): TP = Open + TP, SL = Open - SL
    realTP = realOpenPrice + tp;
    realSL = realOpenPrice - sl;
  }

  return {
    pfLot,
    realLot,
    pfTP: Number(pfTP.toFixed(3)),
    pfSL: Number(pfSL.toFixed(3)),
    realTP: Number(realTP.toFixed(3)),
    realSL: Number(realSL.toFixed(3)),
    balance,
  };
}
