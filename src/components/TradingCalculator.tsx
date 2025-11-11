import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTrade, type CalculationResult } from "@/utils/calculator";
import { EVALUATION_DATA, FUNDED_DATA, type AccountType, type TradeAction, type StageType } from "@/data/tradingData";
import { ArrowUpRight, ArrowDownRight, Calculator } from "lucide-react";

export function TradingCalculator() {
  const [accountType, setAccountType] = useState<AccountType>("100K");
  const [activeStage, setActiveStage] = useState<StageType>("EVALUATION");

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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Trading Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">Calculate your position size, TP & SL with precision</p>
        </div>

        {/* Account Type Selector */}
        <Card className="mb-6 p-6 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Label htmlFor="account-type" className="text-base font-semibold whitespace-nowrap">
              Account Size
            </Label>
            <Select value={accountType} onValueChange={(value) => setAccountType(value as AccountType)}>
              <SelectTrigger id="account-type" className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100K">$100,000</SelectItem>
                <SelectItem value="50K">$50,000</SelectItem>
                <SelectItem value="25K">$25,000</SelectItem>
                <SelectItem value="5K">$5,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Tabs for Evaluation and Funded */}
        <Tabs value={activeStage} onValueChange={(value) => setActiveStage(value as StageType)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="EVALUATION">Evaluation Stage</TabsTrigger>
            <TabsTrigger value="FUNDED">Funded Stage</TabsTrigger>
          </TabsList>

          <TabsContent value="EVALUATION" className="space-y-6">
            <Card className="p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Evaluation Parameters</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eval-segment">Trade Segment</Label>
                  <Select value={evalSegment} onValueChange={setEvalSegment}>
                    <SelectTrigger id="eval-segment">
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

                <div className="space-y-2">
                  <Label htmlFor="eval-action">Action</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={evalAction === "BUY" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setEvalAction("BUY")}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Buy
                    </Button>
                    <Button
                      type="button"
                      variant={evalAction === "SELL" ? "destructive" : "outline"}
                      className="flex-1"
                      onClick={() => setEvalAction("SELL")}
                    >
                      <ArrowDownRight className="w-4 h-4 mr-2" />
                      Sell
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eval-pf-open">Prop Firm Open Price</Label>
                  <Input
                    id="eval-pf-open"
                    type="number"
                    step="0.001"
                    placeholder="3996.38"
                    value={evalPfOpen}
                    onChange={(e) => setEvalPfOpen(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eval-real-open">Real Account Open Price</Label>
                  <Input
                    id="eval-real-open"
                    type="number"
                    step="0.001"
                    placeholder="3996.3"
                    value={evalRealOpen}
                    onChange={(e) => setEvalRealOpen(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {evalResult && (
              <Card className="p-6 shadow-elevated bg-gradient-to-br from-card to-card/50">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Calculated Results</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <ResultCard label="Prop Firm Lot" value={evalResult.pfLot.toFixed(3)} />
                  <ResultCard label="Real Account Lot" value={evalResult.realLot.toFixed(3)} />
                  <ResultCard label="Balance" value={`$${evalResult.balance.toFixed(2)}`} highlight />
                  <ResultCard label="PF Take Profit" value={evalResult.pfTP.toFixed(3)} type="success" />
                  <ResultCard label="PF Stop Loss" value={evalResult.pfSL.toFixed(3)} type="destructive" />
                  <div className="md:col-span-2 lg:col-span-1 grid grid-cols-2 gap-4">
                    <ResultCard label="Real TP" value={evalResult.realTP.toFixed(3)} type="success" compact />
                    <ResultCard label="Real SL" value={evalResult.realSL.toFixed(3)} type="destructive" compact />
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="FUNDED" className="space-y-6">
            <Card className="p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Funded Parameters</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="funded-segment">Trade Segment</Label>
                  <Select value={fundedSegment} onValueChange={setFundedSegment}>
                    <SelectTrigger id="funded-segment">
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

                <div className="space-y-2">
                  <Label htmlFor="funded-action">Action</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={fundedAction === "BUY" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setFundedAction("BUY")}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Buy
                    </Button>
                    <Button
                      type="button"
                      variant={fundedAction === "SELL" ? "destructive" : "outline"}
                      className="flex-1"
                      onClick={() => setFundedAction("SELL")}
                    >
                      <ArrowDownRight className="w-4 h-4 mr-2" />
                      Sell
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funded-pf-open">Prop Firm Open Price</Label>
                  <Input
                    id="funded-pf-open"
                    type="number"
                    step="0.001"
                    placeholder="1000"
                    value={fundedPfOpen}
                    onChange={(e) => setFundedPfOpen(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funded-real-open">Real Account Open Price</Label>
                  <Input
                    id="funded-real-open"
                    type="number"
                    step="0.001"
                    placeholder="1001"
                    value={fundedRealOpen}
                    onChange={(e) => setFundedRealOpen(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {fundedResult && (
              <Card className="p-6 shadow-elevated bg-gradient-to-br from-card to-card/50">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Calculated Results</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <ResultCard label="Prop Firm Lot" value={fundedResult.pfLot.toFixed(3)} />
                  <ResultCard label="Real Account Lot" value={fundedResult.realLot.toFixed(3)} />
                  <ResultCard label="Balance" value={`$${fundedResult.balance.toFixed(2)}`} highlight />
                  <ResultCard label="PF Take Profit" value={fundedResult.pfTP.toFixed(3)} type="success" />
                  <ResultCard label="PF Stop Loss" value={fundedResult.pfSL.toFixed(3)} type="destructive" />
                  <div className="md:col-span-2 lg:col-span-1 grid grid-cols-2 gap-4">
                    <ResultCard label="Real TP" value={fundedResult.realTP.toFixed(3)} type="success" compact />
                    <ResultCard label="Real SL" value={fundedResult.realSL.toFixed(3)} type="destructive" compact />
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
  type?: "default" | "success" | "destructive";
  highlight?: boolean;
  compact?: boolean;
}

function ResultCard({ label, value, type = "default", highlight = false, compact = false }: ResultCardProps) {
  const bgClass =
    type === "success"
      ? "bg-success/10 border-success/20"
      : type === "destructive"
      ? "bg-destructive/10 border-destructive/20"
      : highlight
      ? "bg-primary/10 border-primary/20"
      : "bg-muted/50 border-border";

  const textClass =
    type === "success"
      ? "text-success"
      : type === "destructive"
      ? "text-destructive"
      : highlight
      ? "text-primary"
      : "text-foreground";

  return (
    <div className={`rounded-lg border p-4 ${bgClass} transition-all hover:shadow-md`}>
      <p className={`text-sm ${compact ? "text-xs" : ""} text-muted-foreground mb-1`}>{label}</p>
      <p className={`text-2xl ${compact ? "text-xl" : ""} font-bold ${textClass}`}>{value}</p>
    </div>
  );
}
