import WalletInput from "./components/WalletInput";

export default function Home() {
  return (
    <>
      <div className="min-h-[calc(100vh)] flex items-center justify-center">
        <div className="flex flex-col items-center max-w-2xl mx-auto space-y-8">
          <WalletInput />
          <p className="dark:text-slate-400 text-slate-700 text-center px-4 text-sm md:text-base">
            this is a beta product designed to help you see your profitability
            on{" "}
            <a
              href="https://beast.flash.trade?referral=Beast_1373"
              target="_blank"
              className="underline"
            >
              flash trade
            </a>{" "}
            over time. it only supports SOL/BTC/ETH at the moment and may be
            very buggy, please report bugs to{" "}
            <a
              href="https://twitter.com/solarnius"
              target="_blank"
              className="underline"
            >
              @solarnius
            </a>{" "}
            on twitter. no guarantees are made about accuracy.
          </p>
        </div>
      </div>
    </>
  );
}
