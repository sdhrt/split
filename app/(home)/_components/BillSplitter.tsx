"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Users, ArrowRight } from "lucide-react";
import Convert from "./Convert";
import CurrencySelect from "./CurrencySelect";
import { UserButton } from "@clerk/nextjs";

export default function BillSplitter() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .then((registration) =>
          console.log(
            "service worker registered successfully, scope is: ",
            registration.scope,
          ),
        )
        .catch((error) => {
          console.error("Service worker registration failed", error);
        });
    }
  }, []);

  const [globalCurrency, setGlobalCurrency] = useState("USD");
  const [billAmount, setBillAmount] = useState("");
  const [numPeople, setNumPeople] = useState(2);
  const [tipPercentage, setTipPercentage] = useState(0);

  const calculateSplit = () => {
    const bill = parseFloat(billAmount);
    if (isNaN(bill)) return 0;
    const tipAmount = bill * (tipPercentage / 100);
    const totalAmount = bill + tipAmount;
    return totalAmount / numPeople;
  };

  const calculateNumPeople = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setNumPeople(parseInt(e.target.value));
    } else {
      setNumPeople(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full md:max-w-md bg-white shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>
            <div className="text-2xl font-semibold text-center text-gray-800 flex justify-between">
              <span>Split the Bill</span>
              <UserButton />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="billAmount"
              className="text-sm font-medium text-gray-700"
            >
              Bill Amount
            </label>
            <div className="flex">
              <CurrencySelect setCurrency={setGlobalCurrency} />
              <Input
                id="billAmount"
                type="text"
                placeholder="0.00"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="numPeople"
              className="text-sm font-medium text-gray-700"
            >
              Number of People
            </label>
            <div className="flex items-center space-x-4">
              <Users className="text-gray-400" size={18} />
              <Input
                id="numPeople"
                type="number"
                min="1"
                value={numPeople}
                onChange={calculateNumPeople}
                className="w-20 text-center border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="tipPercentage"
              className="text-sm font-medium text-gray-700"
            >
              Tip Percentage: {tipPercentage}%
            </label>
            <Slider
              id="tipPercentage"
              min={0}
              max={30}
              step={1}
              value={[tipPercentage]}
              onValueChange={(value) => setTipPercentage(value[0])}
              className="w-full"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <div className="text-3xl font-bold text-blue-600">
            {!isNaN(numPeople) ? (
              <div className="flex flex-col gap-2 items-center">
                <span>
                  {globalCurrency} {calculateSplit().toFixed(2)}
                </span>
                <span>
                  <Convert
                    amount={Number(calculateSplit().toFixed(2))}
                    globalCurrency={globalCurrency}
                  />
                </span>
              </div>
            ) : (
              <span>
                {globalCurrency} {Number(0).toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">per person</p>
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center">
            Split Bill
            <ArrowRight className="ml-2" size={18} />
          </Button>
          <Button
            className="w-full bg-red-400 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
            onClick={() => {
              navigator.serviceWorker
                .getRegistrations()
                .then((registrations) => {
                  for (const registration of registrations) {
                    registration.unregister();
                  }
                });
            }}
          >
            Log out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
