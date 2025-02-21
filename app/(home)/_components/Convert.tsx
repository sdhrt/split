import { useEffect, useState } from "react";
import CurrencySelect from "./CurrencySelect";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Convert({
  amount,
  globalCurrency,
}: {
  amount: number;
  globalCurrency: string;
}) {
  const [currency, setCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const [rate, setRate] = useState();
  const [date, setDate] = useState<Date>();
  useEffect(() => {
    fetch(
      `https://v6.exchangerate-api.com/v6/e3e0dc65e1689bd107957462/pair/${globalCurrency}/${currency}`,
      { cache: "force-cache", method: "GET" },
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.result == "error") {
          return toast({
            title: "Couldn't convert currency",
            variant: "destructive",
          });
        }
        setRate(res.conversion_rate);
        const last_update = new Date(res.time_last_update_utc);
        setDate(last_update);
        setConvertedAmount(amount * res.conversion_rate);
      });
  }, [currency, amount, globalCurrency]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2 text-gray-800">
        <CurrencySelect setCurrency={setCurrency} />
        <span>{convertedAmount.toFixed(2)}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        {globalCurrency != currency && (
          <span>
            1 {globalCurrency} = {rate} {currency}
          </span>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {date?.toDateString()} {date?.toLocaleTimeString()}
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-muted-foreground">The last update time</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default Convert;
