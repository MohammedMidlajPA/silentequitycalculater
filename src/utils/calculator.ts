import { EVALUATION_DATA, FUNDED_DATA, ACCOUNT_BALANCES, type AccountType, type TradeAction, type StageType } from "@/data/tradingData";

export interface CalculationResult {
  pfLot: number;
  realLot: number;
  pfTP: number;
  pfSL: number;
  realTP: number;
  realSL: number;
  balance: number;
}

export function calculateTrade(
  accountType: AccountType,
  stage: StageType,
  segment: string,
  action: TradeAction,
  pfOpenPrice: number,
  realOpenPrice: number
): CalculationResult {
  const data = stage === "EVALUATION" ? EVALUATION_DATA : FUNDED_DATA;
  const segmentData = data.find((d) => d.segment === segment);

  if (!segmentData) {
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
  const lotMap: Record<AccountType, { pf: keyof typeof segmentData.lots; real: keyof typeof segmentData.lots }> = {
    "100K": { pf: "pf100k", real: "real100k" },
    "50K": { pf: "pf50k", real: "real50k" },
    "25K": { pf: "pf25k", real: "real25k" },
  };

  const lotKeys = lotMap[accountType];
  const pfLot = segmentData.lots[lotKeys.pf];
  const realLot = segmentData.lots[lotKeys.real];

  // Calculate TP and SL based on action (matching App_Script-3.docx logic)
  let pfTP: number, pfSL: number, realTP: number, realSL: number;

  if (action === "SELL") {
    // For SELL (PF): TP = Open - TP, SL = Open + SL
    pfTP = pfOpenPrice - segmentData.tp;
    pfSL = pfOpenPrice + segmentData.sl;
    // For SELL (Real): SL = Open + SL, TP = Open - TP
    realSL = realOpenPrice + segmentData.sl;
    realTP = realOpenPrice - segmentData.tp;
  } else {
    // For BUY (PF): TP = Open + TP, SL = Open - SL
    pfTP = pfOpenPrice + segmentData.tp;
    pfSL = pfOpenPrice - segmentData.sl;
    // For BUY (Real): SL = Open - SL, TP = Open + TP
    realSL = realOpenPrice - segmentData.sl;
    realTP = realOpenPrice + segmentData.tp;
  }

  // For EVALUATION, use the account balance from the map
  // For FUNDED, always return 1000 as the fixed balance
  const balance = stage === "EVALUATION" ? (ACCOUNT_BALANCES[accountType] || 0) : 1000;

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
