'use client';

import MarketItem from "../components/home/MarketItem";
import { useEffect, useState } from "react";
import { fetchMarketTrades } from "./lib/TWSE/twseActions";

import CandleHistory from "@/components/CandleHistory";
import { candleData } from "@/types/components/CandleHistory";
import { indexData, marketTradeData } from "@/types/home";
import { fetchFugleTodayData } from "./lib/Fugle/fugleActions";

export default function Home() {
  const [TSEindex, setTSEindex] = useState<indexData>({
    closePrice: 0,
    change: 0,
    changePercent: 0,
    totalTradeValue: 0
  });
  const [yesterdayData, setYesterdayData] = useState<marketTradeData>({
    date: "",
    tradeVolume: 0,
    tradeValue: 0,
    transaction: 0,
    price: 0,
    change: 0
  });
  const [TSEToday, setTSEToday] = useState<candleData>({
    time: "",
    open: "",
    close: "",
    high: "",
    low: "",
    value: "" 
  })
  const [status, setStatus] = useState("unch");

  useEffect(() => {
    const today = new Date();

    //抓上一個交易日大盤指數資料
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yesterdayDate = String(yesterday.getDate()).padStart(2, "0");
    fetchMarketTrades(`${yesterdayYear}-${yesterdayMonth}-${yesterdayDate}`).then((res) => {
      setYesterdayData(res);
    });

    //台股當日大盤指數
    fetchFugleTodayData("IX0001").then((res) => {
      //給candle圖的
      setTSEToday({
        time: res.date,
        open: res.openPrice,
        close: res.closePrice,
        high: res.highPrice,
        low: res.lowPrice,
        value: res.closePrice
      })
      
      //給marketItem的
      setTSEindex({
        closePrice: res.closePrice,
        change: res.change,
        changePercent: res.changePercent,
        totalTradeValue: Math.round(res.total.tradeValue / 100000000 * 100) / 100
      })
      if (res.change > 0) {
        setStatus("up");
      } else if (res.change === 0) {
        setStatus("unch");
      } else {
        setStatus("down")
      }
    });
  }, []);

  //if (yesterdayData.date.length === 0) return <div>loading...</div>

  return (
    <main className="flex min-h-main-content flex-col items-center">
      <div className="max-w-[1140px] w-[80%] m-home-market-info">
        <div className="w-full overflow-hidden bg-white rounded shadow-home-market-info my-auto">
          <div className="flex m-2 mt-6">
            <MarketItem title={"台股加權指數"} value={`${TSEindex.closePrice}`} misc={`${TSEindex.change} (${TSEindex.changePercent}%)`} status={status} />
            <MarketItem title={"台股成交金額"} value={`${TSEindex.totalTradeValue}億`} misc={`昨日${Math.round(yesterdayData.tradeValue / 100000000 * 100) / 100}億`} />
            <MarketItem title={"台股股價淨值比"} value={`2.13倍`} misc={`昨日2.13倍`} />
            <MarketItem title={"台股本益比"} value={`21.25倍`} misc={`昨日21.25倍`} />
          </div>
        </div>
      </div>
      <CandleHistory candleToday={TSEToday} stockNo="IX0001" />
      <p className="mt-2">
        加權指數走勢圖
      </p>
    </main>
  );
}
