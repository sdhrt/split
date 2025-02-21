"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect, useRouter } from "next/navigation";
import { UserRoundX } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const response = await res.json();
    const { error } = response;
    if (error != null) {
      console.log(error);
      setError(`${error}`);
      return;
    }
    router.push("/sign-in");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-xl md:max-w-sm rounded-2xl border-2 shadow-[4px_4px_0px_0px_rgba(0,_0,_0,_1)] border-black bg-neutral-50 p-8 mx-8">
        <div className="mb-8 text-center">
          <h2 className="font-semibold text-gray-900">Welcome to split</h2>
          <h2 className="text-sm md:text-md">Create an account to continue</h2>
        </div>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <Label className="mb-1 font-semibold text-xs">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="focus:ring-2 focus:ring-blue-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,_0,_0,_1)]"
            />
          </div>
          <div>
            <Label className="mb-1 font-semibold text-xs">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-2 focus:ring-blue-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,_0,_0,_1)]"
            />
          </div>
          {error && (
            <p className="flex justify-center items-center text-sm text-red-600 font-semibold gap-1">
              <UserRoundX size={18} />
              {error}
            </p>
          )}
          <div>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-400 text-white border-2 border-black font-semibold shadow-[4px_4px_0px_0px_rgba(0,_0,_0,_1)]"
            >
              Sign Up
            </Button>
          </div>
          <div className="text-sm">
            <span>{`Already have an account?  `}</span>
            <span
              className="underline underline-offset-4 hover:cursor-pointer font-semibold text-red-600 hover:text-red-400"
              onClick={() => redirect("/sign-in")}
            >
              Login
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
