"use client";

export default function Header() {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="tracking-tighter font-bold text-2xl">⚡ Flash Tracker</h1>
      <a
        href="https://beast.flash.trade?referral=Beast_1373"
        target="blank"
        className="text-black p-2 rounded text-sm font-medium"
        style={{
          background:
            "linear-gradient(94.61deg,#fffaf3 -4.98%,#fff200 32.6%,#01e1e0 114.17%)",
        }}
      >
        Save 5% on Fees
      </a>
    </div>
  );
}
