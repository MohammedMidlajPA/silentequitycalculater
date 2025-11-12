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

  // Calculate spread values for display
  const getSpreadValues = (result: CalculationResult | null, action: TradeAction) => {
    if (!result) return null;
    
    const pfSpread = 0.16; // Fixed spread for PF
    const realSpread = 0.20; // Fixed spread for Real
    
    if (action === "SELL") {
      return {
        pfHigher: result.pfTP + pfSpread,
        pfLower: result.pfSL - pfSpread,
        realHigher: result.realTP + realSpread,
        realLower: result.realSL - realSpread,
        pfSpread,
        realSpread
      };
    } else {
      return {
        pfHigher: result.pfTP - pfSpread,
        pfLower: result.pfSL + pfSpread,
        realHigher: result.realTP - realSpread,
        realLower: result.realSL + realSpread,
        pfSpread,
        realSpread
      };
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-6 px-4">
      <div className="container mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Trading Calculator</h1>
          </div>
          <p className="text-sm text-muted-foreground text-center">Professional Position Size, TP & SL Calculator - Excel Style Interface</p>
        </div>

        {/* Account Size Selector - Excel Style */}
        <div className="mb-6 border border-border bg-card shadow-sm">
          <div className="grid grid-cols-2 border-b border-border">
            <div className="p-3 border-r border-border bg-primary/5">
              <Label className="text-xs font-bold uppercase tracking-wide">PF Account Size</Label>
            </div>
            <div className="p-3 bg-success/10">
              <Select value={accountType} onValueChange={(value) => setAccountType(value as AccountType)}>
                <SelectTrigger className="h-9 font-bold border border-border bg-background hover:bg-muted/50 transition-colors">
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
          </div>
        </div>

        {/* Side-by-side layout - Excel Style */}
        <div className="grid xl:grid-cols-2 gap-6">
          {/* EVALUATION STAGE */}
          <div className="space-y-3">
            {/* Header */}
            <div className="border border-border bg-card shadow-sm">
              <div className="grid grid-cols-[1fr_200px] border-b border-border">
                <div className="p-3 border-r border-border bg-primary/10">
                  <h2 className="text-sm font-bold uppercase tracking-wide">Evaluation Stage</h2>
                </div>
                <div className="p-3 bg-primary/10">
                  <h3 className="text-xs font-bold uppercase text-center tracking-wide">Remarks</h3>
                </div>
              </div>
              
              {/* Remarks Table */}
              <div className="grid grid-cols-[1fr_200px]">
                <div className="border-r-2 border-border"></div>
                <div>
                  {/* Header Row */}
                  <div className="grid grid-cols-2 border-b border-border">
                    <div className="p-2 border-r border-border bg-muted/20">
                      <p className="text-xs font-bold uppercase text-center">Prop</p>
                    </div>
                    <div className="p-2 bg-muted/20">
                      <p className="text-xs font-bold uppercase text-center">Real</p>
                    </div>
                  </div>
                  
                  {/* Phase 1 */}
                  {["P1 1ST TRADE", "P1 2ND TRADE", "P1 3RD TRADE"].map((seg, i) => (
                    <div 
                      key={seg} 
                      className={`grid grid-cols-2 border-b border-border ${evalSegment === seg ? "bg-success/20" : ""}`}
                    >
                  <div className="p-1.5 border-r border-border">
                    <p className="text-[10px] font-medium text-center">{seg.replace("P1 ", "")}</p>
                  </div>
                  <div className="p-1.5">
                    <p className="text-[10px] font-medium text-center opacity-0">-</p>
                  </div>
                    </div>
                  ))}
                  
                  {/* Phase 2 */}
                  {["P2 1ST TRADE", "P2 2ND TRADE", "P2 3RD TRADE"].map((seg) => (
                    <div 
                      key={seg} 
                      className={`grid grid-cols-2 border-b border-border ${evalSegment === seg ? "bg-success/20" : ""}`}
                    >
                  <div className="p-1.5 border-r border-border">
                    <p className="text-[10px] font-medium text-center">{seg.replace("P2 ", "")}</p>
                  </div>
                  <div className="p-1.5">
                    <p className="text-[10px] font-medium text-center opacity-0">-</p>
                  </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculation Area */}
            <div className="border border-border bg-card shadow-sm">
              {/* STEP 1 */}
              <div className="border-b border-border">
                <div className="grid grid-cols-[90px_1fr] border-b border-border">
                  <div className="p-2.5 border-r border-border bg-muted/40">
                    <p className="text-[11px] font-bold uppercase tracking-wide">Step 1</p>
                  </div>
                  <div className="p-2 bg-success/10">
                    <Select value={evalSegment} onValueChange={setEvalSegment}>
                      <SelectTrigger className="h-9 border border-border font-semibold bg-background hover:bg-muted/50 transition-colors">
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
                </div>
              </div>

              {/* STEP 2 */}
              <div className="border-b border-border">
                <div className="grid grid-cols-[90px_1fr] border-b border-border bg-muted/40">
                  <div className="p-2.5 border-r border-border">
                    <p className="text-[11px] font-bold uppercase tracking-wide">Step 2</p>
                  </div>
                  <div className="grid grid-cols-4">
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">LOT</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">P.F OPEN</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">LOT</p>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">REAL OPEN</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[90px_1fr]">
                  <div className="border-r border-border bg-muted/20"></div>
                  <div className="grid grid-cols-4">
                    <div className="p-1.5 border-r border-border bg-info/10">
                      <Input 
                        value={evalResult?.pfLot.toFixed(3) || ""} 
                        readOnly 
                        className="h-8 text-center text-xs font-semibold bg-transparent border-0 pointer-events-none"
                      />
                    </div>
                    <div className="p-1.5 border-r border-border bg-success/10">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="3996.38"
                        value={evalPfOpen}
                        onChange={(e) => setEvalPfOpen(e.target.value)}
                        className="h-8 text-center text-xs font-semibold border border-border focus:ring-2 focus:ring-success/50"
                      />
                    </div>
                    <div className="p-1.5 border-r border-border bg-info/10">
                      <Input 
                        value={evalResult?.realLot.toFixed(3) || ""} 
                        readOnly 
                        className="h-8 text-center text-xs font-semibold bg-transparent border-0 pointer-events-none"
                      />
                    </div>
                    <div className="p-1.5 bg-success/10">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="3996.3"
                        value={evalRealOpen}
                        onChange={(e) => setEvalRealOpen(e.target.value)}
                        className="h-8 text-center text-xs font-semibold border border-border focus:ring-2 focus:ring-success/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="border-b border-border">
                <div className="grid grid-cols-[90px_1fr_1fr]">
                  <div className="p-2.5 border-r border-border bg-muted/40">
                    <p className="text-[11px] font-bold uppercase tracking-wide">Step 3</p>
                  </div>
                  <div className="p-2.5 border-r border-border bg-muted/20">
                    <p className="text-[10px] font-bold text-center uppercase tracking-wide">Prop Firm AC</p>
                  </div>
                  <div className={`p-2.5 ${evalAction === "SELL" ? "bg-destructive/15" : "bg-success/15"}`}>
                    <p className="text-xs font-bold text-center uppercase tracking-wide">{evalAction}</p>
                  </div>
                </div>
              </div>

              {/* STEP 4 */}
              {evalResult && (
                <div className="border-b border-border">
                  <div className="grid grid-cols-[90px_1fr_1fr] border-b border-border bg-muted/40">
                    <div className="p-2.5 border-r border-border">
                      <p className="text-[11px] font-bold uppercase tracking-wide">Step 4</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">Prop Firm TP</p>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">Prop Firm SL</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[90px_1fr_1fr]">
                    <div className="border-r border-border bg-muted/20"></div>
                    <div className="p-2.5 border-r border-border bg-info/10">
                      <p className="text-sm font-bold text-center">{evalResult.pfTP.toFixed(3)}</p>
                    </div>
                    <div className="p-2.5 bg-info/10">
                      <p className="text-sm font-bold text-center">{evalResult.pfSL.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* FINDOUT SECTION */}
              {evalResult && getSpreadValues(evalResult, evalAction) && (
                <div className="border-b border-border">
                  <div className="p-2 bg-muted/40 border-b border-border">
                    <p className="text-[10px] font-bold text-center uppercase tracking-wide">Findout The Exit Value To Show Real TP & Real SL</p>
                  </div>
                  <div className="grid grid-cols-[90px_100px_1fr_1fr_100px] border-b border-border bg-muted/40">
                    <div className="border-r border-border"></div>
                    <div className="border-r border-border"></div>
                    <div className="p-1.5 border-r border-border">
                      <p className="text-[9px] font-bold text-center uppercase tracking-wide">Higher Side</p>
                    </div>
                    <div className="p-1.5 border-r border-border">
                      <p className="text-[9px] font-bold text-center uppercase tracking-wide">Lower Side</p>
                    </div>
                    <div className="p-1.5">
                      <p className="text-[9px] font-bold text-center uppercase tracking-wide">Spread (PF)</p>
                    </div>
                  </div>
                  {(() => {
                    const spread = getSpreadValues(evalResult, evalAction);
                    return (
                      <>
                        <div className="grid grid-cols-[90px_100px_1fr_1fr_100px] border-b border-border">
                          <div className="border-r border-border bg-muted/20"></div>
                          <div className="p-1.5 border-r border-border bg-muted/20">
                            <p className="text-[10px] font-semibold">PF A/c</p>
                          </div>
                          <div className="p-1.5 border-r border-border bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.pfHigher.toFixed(4)}</p>
                          </div>
                          <div className="p-1.5 border-r border-border bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.pfLower.toFixed(4)}</p>
                          </div>
                          <div className="p-1.5 bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.pfSpread.toFixed(4)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-[90px_100px_1fr_1fr_100px]">
                          <div className="border-r border-border bg-muted/20"></div>
                          <div className="p-1.5 border-r border-border bg-muted/20">
                            <p className="text-[10px] font-semibold">REAL A/c</p>
                          </div>
                          <div className="p-1.5 border-r border-border bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.realHigher.toFixed(4)}</p>
                          </div>
                          <div className="p-1.5 border-r border-border bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.realLower.toFixed(4)}</p>
                          </div>
                          <div className="p-1.5 bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.realSpread.toFixed(4)}</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* STEP 5a */}
              {evalResult && (
                <div className="border-b border-border">
                  <div className="grid grid-cols-[90px_1fr_1fr] border-b border-border bg-muted/40">
                    <div className="p-2.5 border-r border-border">
                      <p className="text-[11px] font-bold uppercase tracking-wide">Step 5a</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">Real AC TP</p>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">Real AC SL</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[90px_1fr_1fr]">
                    <div className="border-r border-border bg-muted/20"></div>
                    <div className="p-2.5 border-r border-border bg-info/10">
                      <p className="text-sm font-bold text-center">{evalResult.realTP.toFixed(3)}</p>
                    </div>
                    <div className="p-2.5 bg-info/10">
                      <p className="text-sm font-bold text-center">{evalResult.realSL.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5b */}
              {evalResult && (
                <div className="border-b border-border">
                  <div className="grid grid-cols-[90px_1fr_1fr] border-b border-border bg-warning/20">
                    <div className="p-2.5 border-r border-border">
                      <p className="text-[11px] font-bold uppercase tracking-wide">Step 5b</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">Real AC TP</p>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">Real AC SL</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[90px_1fr_1fr]">
                    <div className="border-r border-border bg-muted/20"></div>
                    <div className="p-2.5 border-r border-border bg-info/10">
                      <p className="text-sm font-bold text-center">{evalResult.realTP.toFixed(3)}</p>
                    </div>
                    <div className="p-2.5 bg-info/10">
                      <p className="text-sm font-bold text-center">{evalResult.realSL.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance */}
              {evalResult && (
                <div className="p-3 bg-warning/15 border-t border-warning/40">
                  <p className="text-[10px] font-bold text-center mb-1 uppercase tracking-wide">Balance After Evaluation</p>
                  <p className="text-xl font-bold text-center">${evalResult.balance.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border border-border bg-card shadow-sm p-3">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={evalAction === "BUY" ? "default" : "outline"}
                  className="flex-1 h-11 font-semibold"
                  onClick={() => setEvalAction("BUY")}
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  BUY
                </Button>
                <Button
                  type="button"
                  variant={evalAction === "SELL" ? "destructive" : "outline"}
                  className="flex-1 h-11 font-semibold"
                  onClick={() => setEvalAction("SELL")}
                >
                  <ArrowDownRight className="w-5 h-5 mr-2" />
                  SELL
                </Button>
              </div>
            </div>
          </div>

          {/* FUNDED STAGE */}
          <div className="space-y-3">
            {/* Header */}
            <div className="border border-border bg-card shadow-sm">
              <div className="grid grid-cols-[1fr_200px] border-b border-border">
                <div className="p-3 border-r border-border bg-primary/10">
                  <h2 className="text-sm font-bold uppercase tracking-wide">Funded Stage</h2>
                </div>
                <div className="p-3 bg-primary/10">
                  <h3 className="text-xs font-bold uppercase text-center tracking-wide">Remarks</h3>
                </div>
              </div>
              
              {/* Remarks Table */}
              <div className="grid grid-cols-[1fr_200px]">
                <div className="border-r-2 border-border"></div>
                <div>
                  {/* Header Row */}
                  <div className="grid grid-cols-2 border-b border-border">
                    <div className="p-2 border-r border-border bg-muted/20">
                      <p className="text-xs font-bold uppercase text-center">Prop</p>
                    </div>
                    <div className="p-2 bg-muted/20">
                      <p className="text-xs font-bold uppercase text-center">Real</p>
                    </div>
                  </div>
                  
                  {/* Funded trades */}
                  {FUNDED_DATA.map((item) => (
                    <div 
                      key={item.segment} 
                      className={`grid grid-cols-2 border-b border-border ${fundedSegment === item.segment ? "bg-success/20" : ""}`}
                    >
                      <div className="p-1.5 border-r border-border">
                        <p className="text-[10px] font-medium text-center">{item.segment}</p>
                      </div>
                      <div className="p-1.5">
                        <p className="text-[10px] font-medium text-center opacity-0">-</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculation Area */}
            <div className="border border-border bg-card shadow-sm">
              {/* STEP 1 */}
              <div className="border-b border-border">
                <div className="grid grid-cols-[90px_1fr] border-b border-border">
                  <div className="p-2.5 border-r border-border bg-muted/40">
                    <p className="text-[11px] font-bold uppercase tracking-wide">Step 1</p>
                  </div>
                  <div className="p-2 bg-success/10">
                    <Select value={fundedSegment} onValueChange={setFundedSegment}>
                      <SelectTrigger className="h-9 border border-border font-semibold bg-background hover:bg-muted/50 transition-colors">
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
                </div>
              </div>

              {/* STEP 2 */}
              <div className="border-b border-border">
                <div className="grid grid-cols-[90px_1fr] border-b border-border bg-muted/40">
                  <div className="p-2.5 border-r border-border">
                    <p className="text-[11px] font-bold uppercase tracking-wide">Step 2</p>
                  </div>
                  <div className="grid grid-cols-4">
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">LOT</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">P.F OPEN</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">LOT</p>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">REAL OPEN</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[90px_1fr]">
                  <div className="border-r border-border bg-muted/20"></div>
                  <div className="grid grid-cols-4">
                    <div className="p-1.5 border-r border-border bg-info/10">
                      <Input 
                        value={fundedResult?.pfLot.toFixed(3) || ""} 
                        readOnly 
                        className="h-8 text-center text-xs font-semibold bg-transparent border-0 pointer-events-none"
                      />
                    </div>
                    <div className="p-1.5 border-r border-border bg-success/10">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="1000"
                        value={fundedPfOpen}
                        onChange={(e) => setFundedPfOpen(e.target.value)}
                        className="h-8 text-center text-xs font-semibold border border-border focus:ring-2 focus:ring-success/50"
                      />
                    </div>
                    <div className="p-1.5 border-r border-border bg-info/10">
                      <Input 
                        value={fundedResult?.realLot.toFixed(3) || ""} 
                        readOnly 
                        className="h-8 text-center text-xs font-semibold bg-transparent border-0 pointer-events-none"
                      />
                    </div>
                    <div className="p-1.5 bg-success/10">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="1001"
                        value={fundedRealOpen}
                        onChange={(e) => setFundedRealOpen(e.target.value)}
                        className="h-8 text-center text-xs font-semibold border border-border focus:ring-2 focus:ring-success/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="border-b border-border">
                <div className="grid grid-cols-[90px_1fr_1fr]">
                  <div className="p-2.5 border-r border-border bg-muted/40">
                    <p className="text-[11px] font-bold uppercase tracking-wide">Step 3</p>
                  </div>
                  <div className="p-2.5 border-r border-border bg-muted/20">
                    <p className="text-[10px] font-bold text-center uppercase tracking-wide">Prop Firm AC</p>
                  </div>
                  <div className={`p-2.5 ${fundedAction === "SELL" ? "bg-destructive/15" : "bg-success/15"}`}>
                    <p className="text-xs font-bold text-center uppercase tracking-wide">{fundedAction}</p>
                  </div>
                </div>
              </div>

              {/* STEP 4 */}
              {fundedResult && (
                <div className="border-b border-border">
                  <div className="grid grid-cols-[90px_1fr_1fr] border-b border-border bg-muted/40">
                    <div className="p-2.5 border-r border-border">
                      <p className="text-[11px] font-bold uppercase tracking-wide">Step 4</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">Prop Firm TP</p>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">Prop Firm SL</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[90px_1fr_1fr]">
                    <div className="border-r border-border bg-muted/20"></div>
                    <div className="p-2.5 border-r border-border bg-info/10">
                      <p className="text-sm font-bold text-center">{fundedResult.pfTP.toFixed(3)}</p>
                    </div>
                    <div className="p-2.5 bg-info/10">
                      <p className="text-sm font-bold text-center">{fundedResult.pfSL.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* FINDOUT SECTION */}
              {fundedResult && getSpreadValues(fundedResult, fundedAction) && (
                <div className="border-b border-border">
                  <div className="p-2 bg-muted/40 border-b border-border">
                    <p className="text-[10px] font-bold text-center uppercase tracking-wide">Findout The Exit Value To Show Real TP & Real SL</p>
                  </div>
                  <div className="grid grid-cols-[90px_100px_1fr_1fr_100px] border-b border-border bg-muted/40">
                    <div className="border-r border-border"></div>
                    <div className="border-r border-border"></div>
                    <div className="p-1.5 border-r border-border">
                      <p className="text-[9px] font-bold text-center uppercase tracking-wide">Higher Side</p>
                    </div>
                    <div className="p-1.5 border-r border-border">
                      <p className="text-[9px] font-bold text-center uppercase tracking-wide">Lower Side</p>
                    </div>
                    <div className="p-1.5">
                      <p className="text-[9px] font-bold text-center uppercase tracking-wide">Spread (PF)</p>
                    </div>
                  </div>
                  {(() => {
                    const spread = getSpreadValues(fundedResult, fundedAction);
                    return (
                      <>
                        <div className="grid grid-cols-[90px_100px_1fr_1fr_100px] border-b border-border">
                          <div className="border-r border-border bg-muted/20"></div>
                          <div className="p-1.5 border-r border-border bg-muted/20">
                            <p className="text-[10px] font-semibold">PF A/c</p>
                          </div>
                          <div className="p-1.5 border-r border-border bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.pfHigher.toFixed(4)}</p>
                          </div>
                          <div className="p-1.5 border-r border-border bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.pfLower.toFixed(4)}</p>
                          </div>
                          <div className="p-1.5 bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.pfSpread.toFixed(4)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-[90px_100px_1fr_1fr_100px]">
                          <div className="border-r border-border bg-muted/20"></div>
                          <div className="p-1.5 border-r border-border bg-muted/20">
                            <p className="text-[10px] font-semibold">REAL A/c</p>
                          </div>
                          <div className="p-1.5 border-r border-border bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.realHigher.toFixed(4)}</p>
                          </div>
                          <div className="p-1.5 border-r border-border bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.realLower.toFixed(4)}</p>
                          </div>
                          <div className="p-1.5 bg-success/10">
                            <p className="text-[10px] font-semibold text-center">{spread!.realSpread.toFixed(4)}</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* STEP 5 */}
              {fundedResult && (
                <div className="border-b border-border">
                  <div className="grid grid-cols-[90px_1fr_1fr] border-b border-border bg-muted/40">
                    <div className="p-2.5 border-r border-border">
                      <p className="text-[11px] font-bold uppercase tracking-wide">Step 5</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">Real AC TP</p>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-center uppercase tracking-wide">Real AC SL</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[90px_1fr_1fr]">
                    <div className="border-r border-border bg-muted/20"></div>
                    <div className="p-2.5 border-r border-border bg-info/10">
                      <p className="text-sm font-bold text-center">{fundedResult.realTP.toFixed(3)}</p>
                    </div>
                    <div className="p-2.5 bg-info/10">
                      <p className="text-sm font-bold text-center">{fundedResult.realSL.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance */}
              {fundedResult && (
                <div className="p-3 bg-warning/15 border-t border-warning/40">
                  <p className="text-[10px] font-bold text-center mb-1 uppercase tracking-wide">Real AC Balance After Evaluation or After Phase 2</p>
                  <p className="text-xl font-bold text-center">${fundedResult.balance.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border border-border bg-card shadow-sm p-3">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={fundedAction === "BUY" ? "default" : "outline"}
                  className="flex-1 h-11 font-semibold"
                  onClick={() => setFundedAction("BUY")}
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  BUY
                </Button>
                <Button
                  type="button"
                  variant={fundedAction === "SELL" ? "destructive" : "outline"}
                  className="flex-1 h-11 font-semibold"
                  onClick={() => setFundedAction("SELL")}
                >
                  <ArrowDownRight className="w-4 h-4 mr-2" />
                  SELL
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
