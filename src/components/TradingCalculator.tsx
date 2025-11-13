import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EVALUATION_DATA, FUNDED_DATA, type AccountType, type TradeAction } from "@/data/tradingData";
import { calculateTrade, type CalculationResult } from "@/utils/calculator";

export const TradingCalculator = () => {
  const [accountType, setAccountType] = useState<AccountType>("50K");
  
  // Evaluation Stage States
  const [evalSegment, setEvalSegment] = useState("P1 1ST TRADE");
  const [evalAction, setEvalAction] = useState<TradeAction>("SELL");
  const [evalPfOpen, setEvalPfOpen] = useState("");
  const [evalRealOpen, setEvalRealOpen] = useState("");
  const [evalResults, setEvalResults] = useState<CalculationResult | null>(null);

  // Funded Stage States
  const [fundedSegment, setFundedSegment] = useState("1ST TRADE");
  const [fundedAction, setFundedAction] = useState<TradeAction>("SELL");
  const [fundedPfOpen, setFundedPfOpen] = useState("");
  const [fundedRealOpen, setFundedRealOpen] = useState("");
  const [fundedResults, setFundedResults] = useState<CalculationResult | null>(null);

  // Auto-calculate when inputs change
  useEffect(() => {
    if (evalPfOpen && evalRealOpen) {
      const results = calculateTrade(
        accountType,
        "EVALUATION",
        evalSegment,
        evalAction,
        parseFloat(evalPfOpen),
        parseFloat(evalRealOpen)
      );
      setEvalResults(results);
    }
  }, [accountType, evalSegment, evalAction, evalPfOpen, evalRealOpen]);

  useEffect(() => {
    if (fundedPfOpen && fundedRealOpen) {
      const results = calculateTrade(
        accountType,
        "FUNDED",
        fundedSegment,
        fundedAction,
        parseFloat(fundedPfOpen),
        parseFloat(fundedRealOpen)
      );
      setFundedResults(results);
    }
  }, [accountType, fundedSegment, fundedAction, fundedPfOpen, fundedRealOpen]);

  const getSpreadValues = (pfTP: number, pfSL: number, realTP: number, realSL: number, action: TradeAction) => {
    const pfHigher = action === "BUY" ? pfTP : pfSL;
    const pfLower = action === "BUY" ? pfSL : pfTP;
    const realHigher = action === "BUY" ? realTP : realSL;
    const realLower = action === "BUY" ? realSL : realTP;
    
    return {
      pfHigher: pfHigher.toFixed(4),
      pfLower: pfLower.toFixed(4),
      pfSpread: (pfHigher - pfLower).toFixed(4),
      realHigher: realHigher.toFixed(4),
      realLower: realLower.toFixed(4),
      realSpread: (realHigher - realLower).toFixed(4),
    };
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Account Size Selector */}
        <Card className="p-4 border-2 border-border">
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label className="text-sm font-bold border border-border p-2 bg-muted">PF ACCOUNT SIZE</Label>
            <Select value={accountType} onValueChange={(v) => setAccountType(v as AccountType)}>
              <SelectTrigger className="bg-success/20 border-2 border-success/50 font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100K">100K</SelectItem>
                <SelectItem value="50K">50K</SelectItem>
                <SelectItem value="25K">25K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Main Grid: Evaluation and Funded */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* EVALUATION STAGE */}
          <Card className="p-0 border-2 border-border overflow-hidden">
            <div className="grid grid-cols-[180px_1fr]">
              {/* Left: Remarks Table */}
              <div className="border-r-2 border-border bg-muted/30">
                <div className="border-b-2 border-border p-2 text-center font-bold text-xs bg-muted">
                  EVALUATION STAGE
                </div>
                <div className="border-b border-border p-2 text-center font-bold text-[10px] bg-muted/50">
                  REMARKS
                </div>
                <div className="grid grid-cols-2 border-b border-border">
                  <div className="border-r border-border p-1 text-center font-bold text-[10px] bg-muted/50">PROP</div>
                  <div className="p-1 text-center font-bold text-[10px] bg-muted/50">REAL</div>
                </div>
                {/* Phase 1 */}
                <div className="grid grid-cols-[80px_1fr] border-b border-border">
                  <div className="border-r border-border p-1 font-bold text-[10px]">PHASE I</div>
                  <div>
                    <div className={`grid grid-cols-2 border-b border-border ${evalSegment === "P1 1ST TRADE" ? "bg-success/30" : ""}`}>
                      <div className="border-r border-border p-1 text-[9px]">1ST TRADE</div>
                      <div className="p-1 text-[9px]"></div>
                    </div>
                    <div className={`grid grid-cols-2 border-b border-border ${evalSegment === "P1 2ND TRADE" ? "bg-success/30" : ""}`}>
                      <div className="border-r border-border p-1 text-[9px]">2ND TRADE</div>
                      <div className="p-1 text-[9px]"></div>
                    </div>
                    <div className={`grid grid-cols-2 ${evalSegment === "P1 3RD TRADE" ? "bg-success/30" : ""}`}>
                      <div className="border-r border-border p-1 text-[9px]">3rd TRADE</div>
                      <div className="p-1 text-[9px]"></div>
                    </div>
                  </div>
                </div>
                {/* Phase 2 */}
                <div className="grid grid-cols-[80px_1fr]">
                  <div className="border-r border-border p-1 font-bold text-[10px]">PHASE 2</div>
                  <div>
                    <div className={`grid grid-cols-2 border-b border-border ${evalSegment === "P2 1ST TRADE" ? "bg-success/30" : ""}`}>
                      <div className="border-r border-border p-1 text-[9px]">1ST TRADE</div>
                      <div className="p-1 text-[9px]"></div>
                    </div>
                    <div className={`grid grid-cols-2 border-b border-border ${evalSegment === "P2 2ND TRADE" ? "bg-success/30" : ""}`}>
                      <div className="border-r border-border p-1 text-[9px]">2ND TRADE</div>
                      <div className="p-1 text-[9px]"></div>
                    </div>
                    <div className={`grid grid-cols-2 ${evalSegment === "P2 3RD TRADE" ? "bg-success/30" : ""}`}>
                      <div className="border-r border-border p-1 text-[9px]">3rd TRADE</div>
                      <div className="p-1 text-[9px]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Calculation Area */}
              <div className="p-3 space-y-2">
                <div className="text-center font-bold text-sm border-2 border-border p-2 bg-muted/50">
                  EVALUATION STAGE
                </div>

                {/* STEP 1 */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 1</div>
                    <div className="p-1 text-center">
                      <Select value={evalSegment} onValueChange={setEvalSegment}>
                        <SelectTrigger className="h-7 text-[11px] bg-success/20 border border-success/50 font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EVALUATION_DATA.map((d) => (
                            <SelectItem key={d.segment} value={d.segment} className="text-[11px]">
                              {d.segment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 2</div>
                    <div className="grid grid-cols-4 gap-px bg-border">
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">LOT</div>
                      <div className="bg-success/20 p-1 text-center text-[10px] font-bold">PF OPEN PRICE</div>
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">LOT</div>
                      <div className="bg-success/20 p-1 text-center text-[10px] font-bold">REAL OPEN PRICE</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-px bg-border p-px">
                    <div className="bg-background p-1">
                      <Input
                        value={evalResults?.pfLot || ""}
                        readOnly
                        className="h-7 text-center text-[11px] bg-muted/50 border-none"
                      />
                    </div>
                    <div className="bg-background p-1">
                      <Input
                        type="number"
                        value={evalPfOpen}
                        onChange={(e) => setEvalPfOpen(e.target.value)}
                        className="h-7 text-center text-[11px] bg-success/20 border-2 border-success/50 font-bold"
                        placeholder="Enter"
                      />
                    </div>
                    <div className="bg-background p-1">
                      <Input
                        value={evalResults?.realLot || ""}
                        readOnly
                        className="h-7 text-center text-[11px] bg-muted/50 border-none"
                      />
                    </div>
                    <div className="bg-background p-1">
                      <Input
                        type="number"
                        value={evalRealOpen}
                        onChange={(e) => setEvalRealOpen(e.target.value)}
                        className="h-7 text-center text-[11px] bg-success/20 border-2 border-success/50 font-bold"
                        placeholder="Enter"
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 3 */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 3</div>
                    <div className="grid grid-cols-2">
                      <div className="border-r border-border p-1 text-center text-[10px] font-bold bg-muted/50">PROP FIRM AC</div>
                      <div className="p-1 text-center">
                        <Select value={evalAction} onValueChange={(v) => setEvalAction(v as TradeAction)}>
                          <SelectTrigger className={`h-7 text-[11px] font-bold border-2 ${evalAction === "BUY" ? "bg-success/20 border-success/50" : "bg-destructive/20 border-destructive/50"}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BUY">BUY</SelectItem>
                            <SelectItem value="SELL">SELL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 4 */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 4</div>
                    <div className="grid grid-cols-2 gap-px bg-border">
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">PROP FIRM TP</div>
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">PROP FIRM SL</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-border p-px">
                    <Input
                      value={evalResults?.pfTP.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                    <Input
                      value={evalResults?.pfSL.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                  </div>
                </div>

                {/* FINDOUT EXIT VALUE */}
                {evalResults && (() => {
                  const spread = getSpreadValues(evalResults.pfTP, evalResults.pfSL, evalResults.realTP, evalResults.realSL, evalAction);
                  return (
                    <div className="border border-border text-[10px]">
                      <div className="border-b border-border p-1 text-center font-bold bg-muted/50">
                        FINDOUT THE EXIT VALUE TO SHOW REAL TP & REAL SL
                      </div>
                      <div className="grid grid-cols-4 gap-px bg-border border-b border-border">
                        <div className="bg-background"></div>
                        <div className="bg-success/20 p-1 text-center font-bold">HIGHER SIDE</div>
                        <div className="bg-success/20 p-1 text-center font-bold">LOWER SIDE</div>
                        <div className="bg-success/20 p-1 text-center font-bold">SPREAD (PF)</div>
                      </div>
                      <div className="grid grid-cols-4 gap-px bg-border border-b border-border">
                        <div className="bg-muted/50 p-1 font-bold">PF A/c</div>
                        <div className="bg-success/20 p-1 text-center">{spread.pfHigher}</div>
                        <div className="bg-success/20 p-1 text-center">{spread.pfLower}</div>
                        <div className="bg-success/20 p-1 text-center">{spread.pfSpread}</div>
                      </div>
                      <div className="grid grid-cols-4 gap-px bg-border">
                        <div className="bg-muted/50 p-1 font-bold">REAL A/c</div>
                        <div className="bg-success/20 p-1 text-center">{spread.realHigher}</div>
                        <div className="bg-success/20 p-1 text-center">{spread.realLower}</div>
                        <div className="bg-success/20 p-1 text-center">{spread.realSpread}</div>
                      </div>
                    </div>
                  );
                })()}

                {/* STEP 5a */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 5a</div>
                    <div className="grid grid-cols-2 gap-px bg-border">
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">REAL AC TP</div>
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">REAL AC SL</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-border p-px">
                    <Input
                      value={evalResults?.realTP.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                    <Input
                      value={evalResults?.realSL.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                  </div>
                </div>

                {/* STEP 5b */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-warning/30">STEP 5b</div>
                    <div className="grid grid-cols-2 gap-px bg-border">
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">REAL AC TP</div>
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">REAL AC SL</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-border p-px">
                    <Input
                      value={evalResults?.realTP.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                    <Input
                      value={evalResults?.realSL.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                  </div>
                </div>

                {/* Balance */}
                {evalResults && (
                  <div className="border-t-2 border-warning/50 bg-warning/20 p-2 text-center">
                    <div className="text-[10px] font-bold">REAL AC BALANCE AFTER EVALUATION</div>
                    <div className="text-lg font-bold">${evalResults.balance.toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* FUNDED STAGE */}
          <Card className="p-0 border-2 border-border overflow-hidden">
            <div className="grid grid-cols-[180px_1fr]">
              {/* Left: Remarks Table */}
              <div className="border-r-2 border-border bg-muted/30">
                <div className="border-b-2 border-border p-2 text-center font-bold text-xs bg-muted">
                  FUNDED STAGE
                </div>
                <div className="border-b border-border p-2 text-center font-bold text-[10px] bg-muted/50">
                  REMARKS
                </div>
                <div className="grid grid-cols-2 border-b border-border">
                  <div className="border-r border-border p-1 text-center font-bold text-[10px] bg-muted/50">PROP</div>
                  <div className="p-1 text-center font-bold text-[10px] bg-muted/50">REAL</div>
                </div>
                {FUNDED_DATA.map((trade) => (
                  <div
                    key={trade.segment}
                    className={`grid grid-cols-2 border-b border-border ${fundedSegment === trade.segment ? "bg-success/30" : ""}`}
                  >
                    <div className="border-r border-border p-1 text-[9px] font-bold">{trade.segment}</div>
                    <div className="p-1 text-[9px]"></div>
                  </div>
                ))}
                
                {/* Balance Section */}
                <div className="mt-4 border-t-2 border-warning/50 bg-warning/20 p-2">
                  <div className="text-[9px] font-bold text-center mb-1">REAL AC</div>
                  <div className="text-[9px] font-bold text-center mb-1">BALANCE AFTER EVALUATION</div>
                  <div className="text-[9px] font-bold text-center">OR AFTER PHASE 2</div>
                  <div className="text-sm font-bold text-center mt-1">${fundedResults?.balance.toFixed(2) || "1,000.00"}</div>
                </div>
              </div>

              {/* Right: Calculation Area */}
              <div className="p-3 space-y-2">
                <div className="text-center font-bold text-sm border-2 border-border p-2 bg-muted/50">
                  FUNDED STAGE
                </div>

                {/* STEP 1 */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 1</div>
                    <div className="p-1 text-center">
                      <Select value={fundedSegment} onValueChange={setFundedSegment}>
                        <SelectTrigger className="h-7 text-[11px] bg-success/20 border border-success/50 font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FUNDED_DATA.map((d) => (
                            <SelectItem key={d.segment} value={d.segment} className="text-[11px]">
                              {d.segment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 2</div>
                    <div className="grid grid-cols-4 gap-px bg-border">
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">LOT</div>
                      <div className="bg-success/20 p-1 text-center text-[10px] font-bold">PF OPEN PRICE</div>
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">LOT</div>
                      <div className="bg-success/20 p-1 text-center text-[10px] font-bold">REAL OPEN PRICE</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-px bg-border p-px">
                    <div className="bg-background p-1">
                      <Input
                        value={fundedResults?.pfLot || ""}
                        readOnly
                        className="h-7 text-center text-[11px] bg-muted/50 border-none"
                      />
                    </div>
                    <div className="bg-background p-1">
                      <Input
                        type="number"
                        value={fundedPfOpen}
                        onChange={(e) => setFundedPfOpen(e.target.value)}
                        className="h-7 text-center text-[11px] bg-success/20 border-2 border-success/50 font-bold"
                        placeholder="Enter"
                      />
                    </div>
                    <div className="bg-background p-1">
                      <Input
                        value={fundedResults?.realLot || ""}
                        readOnly
                        className="h-7 text-center text-[11px] bg-muted/50 border-none"
                      />
                    </div>
                    <div className="bg-background p-1">
                      <Input
                        type="number"
                        value={fundedRealOpen}
                        onChange={(e) => setFundedRealOpen(e.target.value)}
                        className="h-7 text-center text-[11px] bg-success/20 border-2 border-success/50 font-bold"
                        placeholder="Enter"
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 3 */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 3</div>
                    <div className="grid grid-cols-2">
                      <div className="border-r border-border p-1 text-center text-[10px] font-bold bg-muted/50">PROP FIRM AC</div>
                      <div className="p-1 text-center">
                        <Select value={fundedAction} onValueChange={(v) => setFundedAction(v as TradeAction)}>
                          <SelectTrigger className={`h-7 text-[11px] font-bold border-2 ${fundedAction === "BUY" ? "bg-success/20 border-success/50" : "bg-destructive/20 border-destructive/50"}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BUY">BUY</SelectItem>
                            <SelectItem value="SELL">SELL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 4 */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 4</div>
                    <div className="grid grid-cols-2 gap-px bg-border">
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">PROP FIRM TP</div>
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">PROP FIRM SL</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-border p-px">
                    <Input
                      value={fundedResults?.pfTP.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                    <Input
                      value={fundedResults?.pfSL.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                  </div>
                </div>

                {/* FINDOUT EXIT VALUE */}
                {fundedResults && (() => {
                  const spread = getSpreadValues(fundedResults.pfTP, fundedResults.pfSL, fundedResults.realTP, fundedResults.realSL, fundedAction);
                  return (
                    <div className="border border-border text-[10px]">
                      <div className="border-b border-border p-1 text-center font-bold bg-muted/50">
                        FINDOUT THE EXIT VALUE TO SHOW REAL TP & REAL SL
                      </div>
                      <div className="grid grid-cols-4 gap-px bg-border border-b border-border">
                        <div className="bg-background"></div>
                        <div className="bg-success/20 p-1 text-center font-bold">HIGHER SIDE</div>
                        <div className="bg-success/20 p-1 text-center font-bold">LOWER SIDE</div>
                        <div className="bg-success/20 p-1 text-center font-bold">SPREAD (PF)</div>
                      </div>
                      <div className="grid grid-cols-4 gap-px bg-border border-b border-border">
                        <div className="bg-muted/50 p-1 font-bold">PF A/c</div>
                        <div className="bg-success/20 p-1 text-center">{spread.pfHigher}</div>
                        <div className="bg-success/20 p-1 text-center">{spread.pfLower}</div>
                        <div className="bg-success/20 p-1 text-center">{spread.pfSpread}</div>
                      </div>
                      <div className="grid grid-cols-4 gap-px bg-border">
                        <div className="bg-muted/50 p-1 font-bold">REAL A/c</div>
                        <div className="bg-success/20 p-1 text-center">{spread.realHigher}</div>
                        <div className="bg-success/20 p-1 text-center">{spread.realLower}</div>
                        <div className="bg-success/20 p-1 text-center">{spread.realSpread}</div>
                      </div>
                    </div>
                  );
                })()}

                {/* STEP 5 */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 5</div>
                    <div className="grid grid-cols-2 gap-px bg-border">
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">REAL AC TP</div>
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">REAL AC SL</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-border p-px">
                    <Input
                      value={fundedResults?.realTP.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                    <Input
                      value={fundedResults?.realSL.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                  </div>
                </div>

                {/* STEP 5 (duplicate) */}
                <div className="border border-border">
                  <div className="grid grid-cols-[60px_1fr] border-b border-border">
                    <div className="border-r border-border p-1 font-bold text-[10px] bg-muted/50">STEP 5</div>
                    <div className="grid grid-cols-2 gap-px bg-border">
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">REAL AC TP</div>
                      <div className="bg-muted/50 p-1 text-center text-[10px] font-bold">REAL AC SL</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-border p-px">
                    <Input
                      value={fundedResults?.realTP.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                    <Input
                      value={fundedResults?.realSL.toFixed(3) || ""}
                      readOnly
                      className="h-8 text-center text-[11px] bg-info/20 border-none font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
