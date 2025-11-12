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
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="container mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Trading Calculator</h1>
          </div>
          <p className="text-base text-muted-foreground">Professional Position Size, TP & SL Calculator</p>
        </div>

        {/* Account Size Selector - Excel Style */}
        <div className="mb-6 border-2 border-border bg-card">
          <div className="grid grid-cols-2 border-b-2 border-border">
            <div className="p-3 border-r-2 border-border bg-muted/50">
              <Label className="text-sm font-bold uppercase">PF Account Size</Label>
            </div>
            <div className="p-3 bg-success/20">
              <Select value={accountType} onValueChange={(value) => setAccountType(value as AccountType)}>
                <SelectTrigger className="h-8 font-bold border-2 border-success/50 bg-background">
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
          <div className="space-y-4">
            {/* Header */}
            <div className="border-2 border-border bg-card">
              <div className="grid grid-cols-[1fr_200px] border-b-2 border-border">
                <div className="p-3 border-r-2 border-border bg-muted/30">
                  <h2 className="text-base font-bold uppercase">Evaluation Stage</h2>
                </div>
                <div className="p-3 bg-muted/30">
                  <h3 className="text-sm font-bold uppercase text-center">Remarks</h3>
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
            <div className="border-2 border-border bg-card">
              {/* STEP 1 */}
              <div className="border-b-2 border-border">
                <div className="grid grid-cols-[80px_1fr] border-b border-border">
                  <div className="p-2 border-r-2 border-border bg-muted/30">
                    <p className="text-xs font-bold uppercase">Step 1</p>
                  </div>
                  <div className="p-2 bg-success/20">
                    <Select value={evalSegment} onValueChange={setEvalSegment}>
                      <SelectTrigger className="h-8 border-2 border-success/50 font-semibold">
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
              <div className="border-b-2 border-border">
                <div className="grid grid-cols-[80px_1fr] border-b border-border bg-muted/20">
                  <div className="p-2 border-r-2 border-border">
                    <p className="text-xs font-bold uppercase">Step 2</p>
                  </div>
                  <div className="grid grid-cols-4">
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center">LOT</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center">P.F OPEN PRICE</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center">LOT</p>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-center">REAL OPEN PRICE</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                  <div className="border-r-2 border-border"></div>
                  <div className="grid grid-cols-4">
                    <div className="p-2 border-r border-border">
                      <Input 
                        value={evalResult?.pfLot.toFixed(3) || ""} 
                        readOnly 
                        className="h-8 text-center text-xs font-bold bg-muted/50 border-0"
                      />
                    </div>
                    <div className="p-2 border-r border-border bg-success/20">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="3996.38"
                        value={evalPfOpen}
                        onChange={(e) => setEvalPfOpen(e.target.value)}
                        className="h-8 text-center text-xs font-bold border-2 border-success/50"
                      />
                    </div>
                    <div className="p-2 border-r border-border">
                      <Input 
                        value={evalResult?.realLot.toFixed(3) || ""} 
                        readOnly 
                        className="h-8 text-center text-xs font-bold bg-muted/50 border-0"
                      />
                    </div>
                    <div className="p-2 bg-success/20">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="3996.3"
                        value={evalRealOpen}
                        onChange={(e) => setEvalRealOpen(e.target.value)}
                        className="h-8 text-center text-xs font-bold border-2 border-success/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="border-b-2 border-border">
                <div className="grid grid-cols-[80px_1fr_1fr]">
                  <div className="p-3 border-r-2 border-border bg-muted/30">
                    <p className="text-xs font-bold uppercase">Step 3</p>
                  </div>
                  <div className="p-3 border-r border-border">
                    <p className="text-xs font-bold text-center uppercase">Prop Firm AC</p>
                  </div>
                  <div className={`p-3 ${evalAction === "SELL" ? "bg-destructive/20" : "bg-success/20"}`}>
                    <p className="text-xs font-bold text-center uppercase">{evalAction}</p>
                  </div>
                </div>
              </div>

              {/* STEP 4 */}
              {evalResult && (
                <div className="border-b-2 border-border">
                  <div className="grid grid-cols-[80px_1fr_1fr] border-b border-border bg-muted/20">
                    <div className="p-2 border-r-2 border-border">
                      <p className="text-xs font-bold uppercase">Step 4</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center uppercase">Prop Firm TP</p>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-center uppercase">Prop Firm SL</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[80px_1fr_1fr]">
                    <div className="border-r-2 border-border"></div>
                    <div className="p-3 border-r border-border bg-info/20">
                      <p className="text-base font-bold text-center">{evalResult.pfTP.toFixed(3)}</p>
                    </div>
                    <div className="p-3 bg-info/20">
                      <p className="text-base font-bold text-center">{evalResult.pfSL.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* FINDOUT SECTION */}
              {evalResult && getSpreadValues(evalResult, evalAction) && (
                <div className="border-b-2 border-border">
                  <div className="p-2 bg-muted/30 border-b border-border">
                    <p className="text-xs font-bold text-center uppercase">Findout The Exit Value To Show Real TP & Real SL</p>
                  </div>
                  <div className="grid grid-cols-[80px_100px_1fr_1fr_100px] border-b border-border bg-muted/20">
                    <div className="border-r-2 border-border"></div>
                    <div className="border-r border-border"></div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center uppercase">Higher Side</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center uppercase">Lower Side</p>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-center uppercase">Spread (PF)</p>
                    </div>
                  </div>
                  {(() => {
                    const spread = getSpreadValues(evalResult, evalAction);
                    return (
                      <>
                        <div className="grid grid-cols-[80px_100px_1fr_1fr_100px] border-b border-border">
                          <div className="border-r-2 border-border"></div>
                          <div className="p-2 border-r border-border bg-muted/20">
                            <p className="text-xs font-bold">PF A/c</p>
                          </div>
                          <div className="p-2 border-r border-border bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.pfHigher.toFixed(4)}</p>
                          </div>
                          <div className="p-2 border-r border-border bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.pfLower.toFixed(4)}</p>
                          </div>
                          <div className="p-2 bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.pfSpread.toFixed(4)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-[80px_100px_1fr_1fr_100px]">
                          <div className="border-r-2 border-border"></div>
                          <div className="p-2 border-r border-border bg-muted/20">
                            <p className="text-xs font-bold">REAL A/c</p>
                          </div>
                          <div className="p-2 border-r border-border bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.realHigher.toFixed(4)}</p>
                          </div>
                          <div className="p-2 border-r border-border bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.realLower.toFixed(4)}</p>
                          </div>
                          <div className="p-2 bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.realSpread.toFixed(4)}</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* STEP 5a */}
              {evalResult && (
                <div className="border-b-2 border-border">
                  <div className="grid grid-cols-[80px_1fr_1fr] border-b border-border bg-muted/20">
                    <div className="p-2 border-r-2 border-border">
                      <p className="text-xs font-bold uppercase">Step 5a</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center uppercase">Real AC TP</p>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-center uppercase">Real AC SL</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[80px_1fr_1fr]">
                    <div className="border-r-2 border-border"></div>
                    <div className="p-3 border-r border-border bg-info/20">
                      <p className="text-base font-bold text-center">{evalResult.realTP.toFixed(3)}</p>
                    </div>
                    <div className="p-3 bg-info/20">
                      <p className="text-base font-bold text-center">{evalResult.realSL.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5b */}
              {evalResult && (
                <div className="border-b-2 border-border">
                  <div className="grid grid-cols-[80px_1fr_1fr] border-b border-border bg-warning/30">
                    <div className="p-2 border-r-2 border-border">
                      <p className="text-xs font-bold uppercase">Step 5b</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center uppercase">Real AC TP</p>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-center uppercase">Real AC SL</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[80px_1fr_1fr]">
                    <div className="border-r-2 border-border"></div>
                    <div className="p-3 border-r border-border bg-info/20">
                      <p className="text-base font-bold text-center">{evalResult.realTP.toFixed(3)}</p>
                    </div>
                    <div className="p-3 bg-info/20">
                      <p className="text-base font-bold text-center">{evalResult.realSL.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance */}
              {evalResult && (
                <div className="p-4 bg-warning/20 border-t-2 border-warning/50">
                  <p className="text-xs font-bold text-center mb-1 uppercase">Balance After Evaluation</p>
                  <p className="text-2xl font-bold text-center">${evalResult.balance.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border-2 border-border bg-card p-4">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={evalAction === "BUY" ? "default" : "outline"}
                  className="flex-1 h-12"
                  onClick={() => setEvalAction("BUY")}
                >
                  <ArrowUpRight className="w-5 h-5 mr-2" />
                  BUY
                </Button>
                <Button
                  type="button"
                  variant={evalAction === "SELL" ? "destructive" : "outline"}
                  className="flex-1 h-12"
                  onClick={() => setEvalAction("SELL")}
                >
                  <ArrowDownRight className="w-5 h-5 mr-2" />
                  SELL
                </Button>
              </div>
            </div>
          </div>

          {/* FUNDED STAGE */}
          <div className="space-y-4">
            {/* Header */}
            <div className="border-2 border-border bg-card">
              <div className="grid grid-cols-[1fr_200px] border-b-2 border-border">
                <div className="p-3 border-r-2 border-border bg-muted/30">
                  <h2 className="text-base font-bold uppercase">Funded Stage</h2>
                </div>
                <div className="p-3 bg-muted/30">
                  <h3 className="text-sm font-bold uppercase text-center">Remarks</h3>
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
            <div className="border-2 border-border bg-card">
              {/* STEP 1 */}
              <div className="border-b-2 border-border">
                <div className="grid grid-cols-[80px_1fr] border-b border-border">
                  <div className="p-2 border-r-2 border-border bg-muted/30">
                    <p className="text-xs font-bold uppercase">Step 1</p>
                  </div>
                  <div className="p-2 bg-success/20">
                    <Select value={fundedSegment} onValueChange={setFundedSegment}>
                      <SelectTrigger className="h-8 border-2 border-success/50 font-semibold">
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
              <div className="border-b-2 border-border">
                <div className="grid grid-cols-[80px_1fr] border-b border-border bg-muted/20">
                  <div className="p-2 border-r-2 border-border">
                    <p className="text-xs font-bold uppercase">Step 2</p>
                  </div>
                  <div className="grid grid-cols-4">
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center">LOT</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center">P.F OPEN PRICE</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center">LOT</p>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-center">REAL OPEN PRICE</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                  <div className="border-r-2 border-border"></div>
                  <div className="grid grid-cols-4">
                    <div className="p-2 border-r border-border">
                      <Input 
                        value={fundedResult?.pfLot.toFixed(3) || ""} 
                        readOnly 
                        className="h-8 text-center text-xs font-bold bg-muted/50 border-0"
                      />
                    </div>
                    <div className="p-2 border-r border-border bg-success/20">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="1000"
                        value={fundedPfOpen}
                        onChange={(e) => setFundedPfOpen(e.target.value)}
                        className="h-8 text-center text-xs font-bold border-2 border-success/50"
                      />
                    </div>
                    <div className="p-2 border-r border-border">
                      <Input 
                        value={fundedResult?.realLot.toFixed(3) || ""} 
                        readOnly 
                        className="h-8 text-center text-xs font-bold bg-muted/50 border-0"
                      />
                    </div>
                    <div className="p-2 bg-success/20">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="1001"
                        value={fundedRealOpen}
                        onChange={(e) => setFundedRealOpen(e.target.value)}
                        className="h-8 text-center text-xs font-bold border-2 border-success/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="border-b-2 border-border">
                <div className="grid grid-cols-[80px_1fr_1fr]">
                  <div className="p-3 border-r-2 border-border bg-muted/30">
                    <p className="text-xs font-bold uppercase">Step 3</p>
                  </div>
                  <div className="p-3 border-r border-border">
                    <p className="text-xs font-bold text-center uppercase">Prop Firm AC</p>
                  </div>
                  <div className={`p-3 ${fundedAction === "SELL" ? "bg-destructive/20" : "bg-success/20"}`}>
                    <p className="text-xs font-bold text-center uppercase">{fundedAction}</p>
                  </div>
                </div>
              </div>

              {/* STEP 4 */}
              {fundedResult && (
                <div className="border-b-2 border-border">
                  <div className="grid grid-cols-[80px_1fr_1fr] border-b border-border bg-muted/20">
                    <div className="p-2 border-r-2 border-border">
                      <p className="text-xs font-bold uppercase">Step 4</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center uppercase">Prop Firm TP</p>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-center uppercase">Prop Firm SL</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[80px_1fr_1fr]">
                    <div className="border-r-2 border-border"></div>
                    <div className="p-3 border-r border-border bg-info/20">
                      <p className="text-base font-bold text-center">{fundedResult.pfTP.toFixed(3)}</p>
                    </div>
                    <div className="p-3 bg-info/20">
                      <p className="text-base font-bold text-center">{fundedResult.pfSL.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* FINDOUT SECTION */}
              {fundedResult && getSpreadValues(fundedResult, fundedAction) && (
                <div className="border-b-2 border-border">
                  <div className="p-2 bg-muted/30 border-b border-border">
                    <p className="text-xs font-bold text-center uppercase">Findout The Exit Value To Show Real TP & Real SL</p>
                  </div>
                  <div className="grid grid-cols-[80px_100px_1fr_1fr_100px] border-b border-border bg-muted/20">
                    <div className="border-r-2 border-border"></div>
                    <div className="border-r border-border"></div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center uppercase">Higher Side</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center uppercase">Lower Side</p>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-center uppercase">Spread (PF)</p>
                    </div>
                  </div>
                  {(() => {
                    const spread = getSpreadValues(fundedResult, fundedAction);
                    return (
                      <>
                        <div className="grid grid-cols-[80px_100px_1fr_1fr_100px] border-b border-border">
                          <div className="border-r-2 border-border"></div>
                          <div className="p-2 border-r border-border bg-muted/20">
                            <p className="text-xs font-bold">PF A/c</p>
                          </div>
                          <div className="p-2 border-r border-border bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.pfHigher.toFixed(4)}</p>
                          </div>
                          <div className="p-2 border-r border-border bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.pfLower.toFixed(4)}</p>
                          </div>
                          <div className="p-2 bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.pfSpread.toFixed(4)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-[80px_100px_1fr_1fr_100px]">
                          <div className="border-r-2 border-border"></div>
                          <div className="p-2 border-r border-border bg-muted/20">
                            <p className="text-xs font-bold">REAL A/c</p>
                          </div>
                          <div className="p-2 border-r border-border bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.realHigher.toFixed(4)}</p>
                          </div>
                          <div className="p-2 border-r border-border bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.realLower.toFixed(4)}</p>
                          </div>
                          <div className="p-2 bg-success/20">
                            <p className="text-xs font-bold text-center">{spread!.realSpread.toFixed(4)}</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* STEP 5 */}
              {fundedResult && (
                <div className="border-b-2 border-border">
                  <div className="grid grid-cols-[80px_1fr_1fr] border-b border-border bg-muted/20">
                    <div className="p-2 border-r-2 border-border">
                      <p className="text-xs font-bold uppercase">Step 5</p>
                    </div>
                    <div className="p-2 border-r border-border">
                      <p className="text-xs font-bold text-center uppercase">Real AC TP</p>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-center uppercase">Real AC SL</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[80px_1fr_1fr]">
                    <div className="border-r-2 border-border"></div>
                    <div className="p-3 border-r border-border bg-info/20">
                      <p className="text-base font-bold text-center">{fundedResult.realTP.toFixed(3)}</p>
                    </div>
                    <div className="p-3 bg-info/20">
                      <p className="text-base font-bold text-center">{fundedResult.realSL.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance */}
              {fundedResult && (
                <div className="p-4 bg-warning/20 border-t-2 border-warning/50">
                  <p className="text-xs font-bold text-center mb-1 uppercase">Real AC Balance After Evaluation or After Phase 2</p>
                  <p className="text-2xl font-bold text-center">${fundedResult.balance.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border-2 border-border bg-card p-4">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={fundedAction === "BUY" ? "default" : "outline"}
                  className="flex-1 h-12"
                  onClick={() => setFundedAction("BUY")}
                >
                  <ArrowUpRight className="w-5 h-5 mr-2" />
                  BUY
                </Button>
                <Button
                  type="button"
                  variant={fundedAction === "SELL" ? "destructive" : "outline"}
                  className="flex-1 h-12"
                  onClick={() => setFundedAction("SELL")}
                >
                  <ArrowDownRight className="w-5 h-5 mr-2" />
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
