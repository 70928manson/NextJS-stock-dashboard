import Image from "next/image";
import MarketItem from "./components/home/MarketItem";

export default function Home() {
  return (
    <main className="flex min-h-main-content flex-col items-center">
      <div className="max-w-[1140px] w-[80%] m-home-market-info">
        <div className="w-full overflow-hidden relative bg-white rounded shadow-home-market-info my-auto">
          <div className="flex m-2">
            <MarketItem title={"台股加權指數"} value={`17995.03`} misc={`-7.95 (-0.04%)`} status={`down`} />
            <MarketItem title={"台股成交金額"} value={`2581.44億`} misc={`昨日3005.17億`} />
            <MarketItem title={"台股股價淨值比"} value={`2.13倍`} misc={`昨日2.13倍`} />
            <MarketItem title={"台股本益比"} value={`21.25倍`} misc={`昨日21.25倍`} />
          </div>
          <div>指數圖</div>
        </div>
      </div>
      <div>
        產業熱力圖
      </div>
    </main>
  );
}
