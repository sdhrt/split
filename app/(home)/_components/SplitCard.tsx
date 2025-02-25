"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IUser } from "@/schema/user";
import { toast } from "@/hooks/use-toast";
import clsx from "clsx";
import { UserButton, useUser } from "@clerk/nextjs";
import People from "./People";
import { Link } from "next-view-transitions";

export default function ExpenseSplitCard() {
  const { user } = useUser();

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [selectedPersons, setSelectedPersons] = useState<
    { email: string; percentage: number }[]
  >([]);

  const totalPercentage = selectedPersons.reduce(
    (sum, person) => sum + person.percentage,
    0,
  );

  const addToHistory = async (selectedUsers: any) => {
    if (user) {
      const res = await fetch("/api/add-history", {
        method: "POST",
        body: JSON.stringify({
          users: selectedUsers,
          initiator: user.primaryEmailAddress?.emailAddress,
          amount: totalAmount,
        }),
      });
      const { error, message } = await res.json();
      if (error) {
        toast({
          title: message,
          variant: "destructive",
        });
      } else {
        toast({
          title: message,
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex flex-col gap-2">
            <span>Expense Split</span>
            <Link
              href={"/history"}
              className="text-sm text-muted-foreground flex items-center gap-1 underline"
            >
              Check History
            </Link>
          </div>
          <span>
            <UserButton showName />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="total-amount">Total Amount</Label>
          <Input
            id="total-amount"
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            placeholder="Enter total amount"
          />
        </div>

        <People
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          selectedPersons={selectedPersons}
          setSelectedPersons={setSelectedPersons}
        />

        <div className="flex justify-between items-center">
          <span>Total Percentage:</span>
          <span
            className={clsx(
              totalPercentage === 100 ? "text-green-500" : "text-red-500",
              "font-semibold",
            )}
          >
            {totalPercentage === 100 ? (
              <span>
                {totalAmount == 0 ? (
                  <span className="text-red-500">Enter total amount</span>
                ) : (
                  <span>Splitting</span>
                )}
              </span>
            ) : (
              <span>Total is not 100%: {totalPercentage}%</span>
            )}
          </span>
        </div>

        {totalPercentage === 100 && totalAmount !== 0 && (
          <div>
            <h3 className="font-semibold mb-2">Split Amount</h3>
            {selectedPersons.map((person) => (
              <div
                key={person.email}
                className="flex justify-between items-center mb-1"
              >
                <span>{person.email}:</span>
                <span>
                  ${((totalAmount * person.percentage) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {totalPercentage === 100 && totalAmount !== 0 && (
          <div>
            <Button onClick={() => addToHistory(selectedPersons)}>
              Add Payment to history
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
