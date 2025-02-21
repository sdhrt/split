import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { iso4217CurrencyCodes } from "@/lib/currency";

function CurrencySelect({
  setCurrency,
}: {
  setCurrency: (cur: string) => void;
}) {
  return (
    <Select onValueChange={(v) => setCurrency(v)}>
      <SelectTrigger className="w-[100px]" defaultValue={"USD"}>
        <SelectValue placeholder="USD" />
      </SelectTrigger>
      <SelectContent>
        {iso4217CurrencyCodes.map((cur) => (
          <SelectItem value={cur} key={cur}>
            {cur}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CurrencySelect;
