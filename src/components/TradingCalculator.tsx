import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculateTrade, type CalculationResult } from "@/utils/calculator";
import { EVALUATION_DATA, FUNDED_DATA, type AccountType, type TradeAction } from "@/data/tradingData";
import { ArrowUpRight, ArrowDownRight, Calculator } from "lucide-react";

export function TradingCalculator() {
  const [accountType, setAccountType] = useState<AccountType>("100K");

  // Evaluation state
  const [evalSegment, setEvalSegment] = useState<string>("P1 1ST TRADE");
  const [evalAction, setEvalAction] = useState<TradeAction>("BUY");
  const [evalPfOpen, setEvalPfOpen] = useState<string>("");
  const [evalRealOpen, setEvalRealOpen] = useState<string>("");
  const [evalResult, setEvalResult] = useState<CalculationResult | null>(null);

  // Funded state
  const [fundedSegment, setFundedSegment] = useState<string>("1ST TRADE");
  const [fundedAction, setFundedAction] = useState<TradeAction>("BUY");
  const [fundedPfOpen, setFundedPfOpen] = useState<string>("");
  const [fundedRealOpen, setFundedRealOpen] = useState<string>("");
  const [fundedResult, setFundedResult] = useState<CalculationResult | null>(null);

  // Calculate evaluation results
  useEffect(() => {
    if (evalPfOpen && evalRealOpen) {
      const result = calculateTrade(
        accountType,
        "EVALUATION",
        evalSegment,
        evalAction,
        parseFloat(evalPfOpen),
        parseFloat(evalRealOpen)
      );
      setEvalResult(result);
    } else {
      setEvalResult(null);
    }
  }, [accountType, evalSegment, evalAction, evalPfOpen, evalRealOpen]);

  // Calculate funded results
  useEffect(() => {
    if (fundedPfOpen && fundedRealOpen) {
      const result = calculateTrade(
        accountType,
        "FUNDED",
        fundedSegment,
        fundedAction,
        parseFloat(fundedPfOpen),
        parseFloat(fundedRealOpen)
      );
      setFundedResult(result);
    } else {
      setFundedResult(null);
    }
  }, [accountType, fundedSegment, fundedAction, fundedPfOpen, fundedRealOpen]);

  return (
    <div className="min-h-screen bg-background py-4 px-2 sm:px-4">
      <div className="container mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calculator className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Trading Calculator</h1>
          </div>
          <p className="text-sm text-muted-foreground">Calculate position size, TP & SL with precision</p>
        </div>

        {/* Account Size Selector */}
        <Card className="mb-4 p-3 sm:p-4 shadow-card bg-primary/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Label htmlFor="account-type" className="text-xs sm:text-sm font-bold whitespace-nowrap uppercase">
              PF Account Size
            </Label>
            <Select value={accountType} onValueChange={(value) => setAccountType(value as AccountType)}>
              <SelectTrigger id="account-type" className="w-full sm:w-[160px] font-semibold text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100K">100K</SelectItem>
                <SelectItem value="50K">50K</SelectItem>
                <SelectItem value="25K">25K</SelectItem>
                <SelectItem value="5K">5K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Side-by-side layout */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* EVALUATION STAGE */}
          <div className="space-y-4">
            <div className="bg-primary/10 px-4 py-2 rounded-t-lg border-b-2 border-primary">
              <h2 className="text-lg font-bold text-foreground uppercase">Evaluation Stage</h2>
            </div>
            
            <Card className="p-4 shadow-card">
              <div className="space-y-4">
                {/* Trade Segment */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">Step 1: Trade Segment</Label>
                  <Select value={evalSegment} onValueChange={setEvalSegment}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVALUATION_DATA.map((item) => (
                        <SelectItem key={item.segment} value={item.segment}>
                          {item.segment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 2: Lot & Open Price */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">Step 2: Lot & Open Price</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">PF Lot</Label>
                      <Input 
                        value={evalResult?.pfLot.toFixed(3) || "0.000"} 
                        readOnly 
                        className="text-sm font-semibold bg-muted"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">PF Open Price</Label>
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="3996.38"
                        value={evalPfOpen}
                        onChange={(e) => setEvalPfOpen(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Real Lot</Label>
                      <Input 
                        value={evalResult?.realLot.toFixed(3) || "0.000"} 
                        readOnly 
                        className="text-sm font-semibold bg-muted"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Real Open Price</Label>
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="3996.3"
                        value={evalRealOpen}
                        onChange={(e) => setEvalRealOpen(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Action */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">Step 3: Prop Firm A/C</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={evalAction === "BUY" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setEvalAction("BUY")}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      Buy
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={evalAction === "SELL" ? "destructive" : "outline"}
                      className="flex-1"
                      onClick={() => setEvalAction("SELL")}
                    >
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                      Sell
                    </Button>
                  </div>
                </div>

                {/* Step 4: PF TP & SL */}
                {evalResult && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase">Step 4: Prop Firm TP & SL</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                        <p className="text-xs text-muted-foreground mb-1">PF TP</p>
                        <p className="text-lg font-bold text-success">{evalResult.pfTP.toFixed(3)}</p>
                      </div>
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                        <p className="text-xs text-muted-foreground mb-1">PF SL</p>
                        <p className="text-lg font-bold text-destructive">{evalResult.pfSL.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Real AC TP & SL */}
                {evalResult && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase">Step 5: Real AC TP & SL</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                        <p className="text-xs text-muted-foreground mb-1">Real TP</p>
                        <p className="text-lg font-bold text-success">{evalResult.realTP.toFixed(3)}</p>
                      </div>
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                        <p className="text-xs text-muted-foreground mb-1">Real SL</p>
                        <p className="text-lg font-bold text-destructive">{evalResult.realSL.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Balance Display */}
                {evalResult && (
                  <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1 uppercase">Balance After Evaluation</p>
                    <p className="text-2xl font-bold text-primary">${evalResult.balance.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* FUNDED STAGE */}
          <div className="space-y-4">
            <div className="bg-primary/10 px-4 py-2 rounded-t-lg border-b-2 border-primary">
              <h2 className="text-lg font-bold text-foreground uppercase">Funded Stage</h2>
            </div>
            
            <Card className="p-4 shadow-card">
              <div className="space-y-4">
                {/* Trade Segment */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">Step 1: Trade Segment</Label>
                  <Select value={fundedSegment} onValueChange={setFundedSegment}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNDED_DATA.map((item) => (
                        <SelectItem key={item.segment} value={item.segment}>
                          {item.segment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 2: Lot & Open Price */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">Step 2: Lot & Open Price</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">PF Lot</Label>
                      <Input 
                        value={fundedResult?.pfLot.toFixed(3) || "0.000"} 
                        readOnly 
                        className="text-sm font-semibold bg-muted"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">PF Open Price</Label>
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="1000"
                        value={fundedPfOpen}
                        onChange={(e) => setFundedPfOpen(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Real Lot</Label>
                      <Input 
                        value={fundedResult?.realLot.toFixed(3) || "0.000"} 
                        readOnly 
                        className="text-sm font-semibold bg-muted"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Real Open Price</Label>
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="1001"
                        value={fundedRealOpen}
                        onChange={(e) => setFundedRealOpen(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Action */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">Step 3: Prop Firm A/C</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={fundedAction === "BUY" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setFundedAction("BUY")}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      Buy
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={fundedAction === "SELL" ? "destructive" : "outline"}
                      className="flex-1"
                      onClick={() => setFundedAction("SELL")}
                    >
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                      Sell
                    </Button>
                  </div>
                </div>

                {/* Step 4: PF TP & SL */}
                {fundedResult && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase">Step 4: Prop Firm TP & SL</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                        <p className="text-xs text-muted-foreground mb-1">PF TP</p>
                        <p className="text-lg font-bold text-success">{fundedResult.pfTP.toFixed(3)}</p>
                      </div>
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                        <p className="text-xs text-muted-foreground mb-1">PF SL</p>
                        <p className="text-lg font-bold text-destructive">{fundedResult.pfSL.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Real AC TP & SL */}
                {fundedResult && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase">Step 5: Real AC TP & SL</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                        <p className="text-xs text-muted-foreground mb-1">Real TP</p>
                        <p className="text-lg font-bold text-success">{fundedResult.realTP.toFixed(3)}</p>
                      </div>
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                        <p className="text-xs text-muted-foreground mb-1">Real SL</p>
                        <p className="text-lg font-bold text-destructive">{fundedResult.realSL.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Balance Display */}
                {fundedResult && (
                  <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1 uppercase">Balance After Phase 2</p>
                    <p className="text-2xl font-bold text-primary">${fundedResult.balance.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
