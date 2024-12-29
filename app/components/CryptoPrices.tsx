"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
interface CryptoPrices {
  bitcoin: { usd: number; usd_24h_change: number };
  solana: { usd: number; usd_24h_change: number };
}

export function CryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrices>({
    bitcoin: { usd: 0, usd_24h_change: 0 },
    solana: { usd: 0, usd_24h_change: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,solana&vs_currencies=usd&include_24hr_change=true"
        );
        const data = await response.json();
        setPrices(data);
      } catch (err) {
        setError("Failed to fetch prices");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex space-x-4">
      <div className="flex text-xs items-center justify-center p-1 px-2 shadow-strong">
        <span
          className={
            prices.bitcoin.usd_24h_change >= 0
              ? "font-semibold text-green-500"
              : "font-semibold text-red-500"
          }
        >
          <strong className="flex items-center justify-center">
            <Image
              src="/btc.svg"
              alt="Bitcoin"
              width={16}
              height={16}
              className="mr-1"
            />
            ${prices.bitcoin.usd.toLocaleString()} (
            {prices.bitcoin.usd_24h_change.toFixed(2)}%)
          </strong>
        </span>
      </div>
      <div className="flex text-xs items-center justify-center p-1 px-2 shadow-strong">
        <span
          className={
            prices.solana.usd_24h_change >= 0
              ? "font-semibold text-green-500"
              : "font-semibold text-red-500"
          }
        >
          <strong className="flex items-center justify-center">
            <Image
              src="/sol.svg"
              alt="Solana"
              width={16}
              height={16}
              className="mr-1"
            />
            ${prices.solana.usd.toLocaleString()} (
            {prices.solana.usd_24h_change.toFixed(2)}%)
          </strong>
        </span>
      </div>
    </div>
  );
}
