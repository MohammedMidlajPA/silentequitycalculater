// Trading data tables based on the spreadsheet

export interface TradeSegmentData {
  segment: string;
  lots: {
    pf100k: number;
    real100k: number;
    pf50k: number;
    real50k: number;
    pf25k: number;
    real25k: number;
    pf5k: number;
    real5k: number;
  };
  tp: number;
  sl: number;
}

export const EVALUATION_DATA: TradeSegmentData[] = [
  {
    segment: "P1 1ST TRADE",
    lots: { pf100k: 4.0, real100k: 0.3, pf50k: 2.0, real50k: 0.18, pf25k: 1.0, real25k: 0.1, pf5k: 0.2, real5k: 0.02 },
    tp: 20.2,
    sl: 10.2,
  },
  {
    segment: "P1 2ND TRADE",
    lots: { pf100k: 4.0, real100k: 0.3, pf50k: 2.0, real50k: 0.18, pf25k: 1.0, real25k: 0.1, pf5k: 0.2, real5k: 0.02 },
    tp: 30.2,
    sl: 10.2,
  },
  {
    segment: "P1 3RD TRADE",
    lots: { pf100k: 2.0, real100k: 0.15, pf50k: 1.0, real50k: 0.09, pf25k: 0.5, real25k: 0.05, pf5k: 0.1, real5k: 0.01 },
    tp: 80.2,
    sl: 10.2,
  },
  {
    segment: "P2 1ST TRADE",
    lots: { pf100k: 4.0, real100k: 0.55, pf50k: 2.0, real50k: 0.32, pf25k: 1.0, real25k: 0.18, pf5k: 0.2, real5k: 0.036 },
    tp: 12.7,
    sl: 10.2,
  },
  {
    segment: "P2 2ND TRADE",
    lots: { pf100k: 4.0, real100k: 0.55, pf50k: 2.0, real50k: 0.32, pf25k: 1.0, real25k: 0.18, pf5k: 0.2, real5k: 0.036 },
    tp: 22.7,
    sl: 10.2,
  },
  {
    segment: "P2 3RD TRADE",
    lots: { pf100k: 2.0, real100k: 0.275, pf50k: 1.0, real50k: 0.16, pf25k: 0.5, real25k: 0.09, pf5k: 0.1, real5k: 0.018 },
    tp: 32.7,
    sl: 10.2,
  },
];

export const FUNDED_DATA: TradeSegmentData[] = [
  {
    segment: "1ST TRADE",
    lots: { pf100k: 2.4, real100k: 0.94, pf50k: 1.2, real50k: 0.48, pf25k: 0.6, real25k: 0.24, pf5k: 0.12, real5k: 0.048 },
    tp: 20.2,
    sl: 10.2,
  },
  {
    segment: "2ND TRADE",
    lots: { pf100k: 2.4, real100k: 0.94, pf50k: 1.2, real50k: 0.48, pf25k: 0.6, real25k: 0.24, pf5k: 0.12, real5k: 0.048 },
    tp: 30.2,
    sl: 10.2,
  },
  {
    segment: "3RD TRADE",
    lots: { pf100k: 2.4, real100k: 0.94, pf50k: 1.2, real50k: 0.48, pf25k: 0.6, real25k: 0.24, pf5k: 0.12, real5k: 0.048 },
    tp: 40.2,
    sl: 10.2,
  },
  {
    segment: "4TH TRADE",
    lots: { pf100k: 2.4, real100k: 0.94, pf50k: 1.2, real50k: 0.48, pf25k: 0.6, real25k: 0.24, pf5k: 0.12, real5k: 0.048 },
    tp: 50.2,
    sl: 10.2,
  },
];

export const ACCOUNT_BALANCES: Record<string, number> = {
  "100K": 1900,
  "50K": 1000,
  "25K": 500,
  "5K": 100,
};

export type AccountType = "100K" | "50K" | "25K" | "5K";
export type TradeAction = "BUY" | "SELL";
export type StageType = "EVALUATION" | "FUNDED";
