import { fetchTPEXMarginTransactions } from "../lib/TPEX/tpexActions";
import { fetchDollarCostAveragingRank, fetchTWSEMarginTransactions } from "../lib/TWSE/twseActions";
import { fetchMxfMarketOi, fetchBigThreeMxf } from "../lib/TAIFEX/taifexActions";
import { notFound } from 'next/navigation';
import { fetchUsTreasuryYields } from "../lib/USFinance/USFinanceActions";
import { dollarCostAveragingRank } from "@/types/indicator";

export default async function Page() {
    const today = new Date();
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yesterdayDate = String(yesterday.getDate()).padStart(2, "0");

    const [openInterest, TWSEMarginTransactions, TPEXMarginTransactions, bigThreeOpenInterest, treasuryYields, dollarCostAveragingRank] = await Promise.all([
        fetchMxfMarketOi(),
        fetchTWSEMarginTransactions(`${yesterdayYear}-${yesterdayMonth}-${yesterdayDate}`),
        fetchTPEXMarginTransactions(`${yesterdayYear}-${yesterdayMonth}-${yesterdayDate}`),
        fetchBigThreeMxf(),
        fetchUsTreasuryYields(`${yesterdayYear}-${yesterdayMonth}-${yesterdayDate}`),
        fetchDollarCostAveragingRank()
    ])

    // if (!openInterest || !TWSEMarginTransactions || !TPEXMarginTransactions || !bigThreeOpenInterest || !treasuryYields) {
    //     notFound();
    // }

    const smallLong = bigThreeOpenInterest ? openInterest - bigThreeOpenInterest.long : 0;     //散戶多單
    const smallShort = bigThreeOpenInterest ? openInterest - bigThreeOpenInterest.short : 0;   //散戶空單
    const smallClean = bigThreeOpenInterest ? (smallLong - smallShort) : 0;                      //散戶淨部位

    // 散戶多空比 = 散戶淨部位 / 未沖銷契約量 * 100%
    const smallLongShortRation = (Math.round(smallClean / openInterest * 100 * 100) / 100).toFixed(2);

    return (
        <main className="w-[80%] h-full mx-auto">
            <p className="text-center">經濟指標: 散戶, 大戶, 法人, Fed利率</p>
            
            {/* <h3 className="text-lg p-2 font-bold">三大法人買賣超</h3> */}

            <div className="flex flex-col items-center">
                <h2 className="text-2xl p-2 font-bold">散戶指標 - 融資融券餘額</h2>
                <div className="flex justify-center">
                    {
                        TWSEMarginTransactions && <div className="p-1">
                            <h3 className="text-xl p-2 font-bold">集中市場</h3>
                            <h4 className="text-lg p-2">融資今日餘額 (交易單位): {TWSEMarginTransactions.marginBalance || "TAIFEX資料統整中"}</h4>
                            <h4 className="text-lg p-2">融資餘額增減 (交易單位): {TWSEMarginTransactions.marginBalanceChange || "TAIFEX資料統整中"}</h4>
                            <h4 className="text-lg p-2">融資金額(仟元)-今日餘額: {TWSEMarginTransactions.marginBalanceValue || "TAIFEX資料統整中"}</h4>
                            <h4 className="text-lg p-2">融資餘額增減(仟元): {TWSEMarginTransactions.marginBalanceValueChange || "TAIFEX資料統整中"}</h4>
                            <h4 className="text-lg p-2">融券(交易單位)-今日餘額: {TWSEMarginTransactions.shortBalance || "TAIFEX資料統整中"}</h4>
                            <h4 className="text-lg p-2">融券餘額增減(交易單位): {TWSEMarginTransactions.shortBalanceChange || "TAIFEX資料統整中"}</h4>
                        </div>
                    }
                    {
                        TPEXMarginTransactions && <div className="p-1">
                            <h3 className="text-xl p-2 font-bold">櫃買中心</h3>
                            <h4 className="text-lg p-2">融資今日餘額 (交易單位): {TPEXMarginTransactions.marginBalance || "TAIFEX資料統整中"}</h4>
                            <h4 className="text-lg p-2">融資餘額增減 (交易單位): {TPEXMarginTransactions.marginBalanceChange || "TAIFEX資料統整中"}</h4>
                            <h4 className="text-lg p-2">融資金額(仟元)-今日餘額: {TPEXMarginTransactions.marginBalanceValue || "TAIFEX資料統整中"}</h4>
                            <h4 className="text-lg p-2">融資餘額增減(仟元): {TPEXMarginTransactions.marginBalanceValueChange || "TAIFEX資料統整中"}</h4>
                            <h4 className="text-lg p-2">融券(交易單位)-今日餘額: {TPEXMarginTransactions.shortBalance || "TAIFEX資料統整中"}</h4>
                            <h4 className="text-lg p-2">融券餘額增減(交易單位): {TPEXMarginTransactions.shortBalanceChange || "TAIFEX資料統整中"}</h4>
                        </div>
                    }
                </div>
                <h2 className="text-2xl p-2 font-bold">散戶指標 - 小台散戶多空比</h2>
                {
                    bigThreeOpenInterest && <div className="p-1">
                        <div>
                            <p className="p-2">散戶多空比 = 散戶淨部位 / 未沖銷契約量 * 100%</p>
                            <h4 className="text-sm p-2">未沖銷契約量: {openInterest} </h4>
                            <h4 className="text-sm p-2">三大法人多方未平倉: {bigThreeOpenInterest.long} </h4>
                            <h4 className="text-sm p-2">三大法人空方未平倉: {bigThreeOpenInterest.short} </h4>
                            <h4 className="text-sm p-2">小台散戶多空比: {smallLongShortRation} </h4>
                        </div>
                    </div>
                }
                <h2 className="text-2xl p-2 font-bold">景氣循環指標 - 美國公債殖利率</h2>
                {
                    treasuryYields && <div className="p-1">
                        <div>
                            <p className="p-2">美國財政部公佈今日公債殖利率</p>
                            <h4 className="text-sm p-2">今日10年公債殖利率: {treasuryYields.us10y} </h4>
                            <h4 className="text-sm p-2">今日20年公債殖利率: {treasuryYields.us20y} </h4>
                        </div>
                    </div>
                }
                <h2 className="text-2xl p-2 font-bold">定期定額排行</h2>
                <div className="p-1">
                    {
                        dollarCostAveragingRank.map((rank: dollarCostAveragingRank) => {
                            return <div className="flex items-center">
                                <p>{rank.level}</p>
                                <h4 className="text-sm p-2 w-[50%]">個股: {rank.stock.stockName} </h4>
                                <h4 className="text-sm p-2 w-[50%]">ETF: {rank.etf.etfName} </h4>
                            </div>
                        })
                    }
                </div>
            </div>
        </main>
    );
}