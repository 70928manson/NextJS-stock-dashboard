import { fetchTPEXMarginTransactions } from "../lib/TPEX/tpexAction";
import { fetchTWSEMarginTransactions } from "../lib/TWSE/twseAction";
import { fetchMxfMarketOi, fetchBigThreeMxf } from "../lib/indicatorAction";
import { notFound } from 'next/navigation';

export default async function Page() {
    const today = new Date();
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yesterdayDate = String(yesterday.getDate()).padStart(2, "0");

    const [openInterest, TWSEMarginTransactions, TPEXMarginTransactions, bigThreeOpenInterest] = await Promise.all([
        fetchMxfMarketOi(),
        fetchTWSEMarginTransactions(`${yesterdayYear}-${yesterdayMonth}-${yesterdayDate}`),
        fetchTPEXMarginTransactions(`${yesterdayYear}-${yesterdayMonth}-${yesterdayDate}`),
        fetchBigThreeMxf(),
    ])

    if (!openInterest || !TWSEMarginTransactions || !TPEXMarginTransactions || !bigThreeOpenInterest) {
        notFound();
    }

    const smallLong = openInterest - bigThreeOpenInterest.long;     //散戶多單
    const smallShort = openInterest - bigThreeOpenInterest.short;   //散戶空單
    const smallClean = smallLong - smallShort;                      //散戶淨部位

    // 散戶多空比 = 散戶淨部位 / 未沖銷契約量 * 100%
    const smallLongShortRation = (Math.round(smallClean / openInterest * 100 * 100) / 100).toFixed(2);

    return (
        <main className="w-[80%] h-full mx-auto">
            <p className="text-center">經濟指標: 散戶, 大戶, 法人, Fed利率</p>
            
            {/* <h3 className="text-lg p-2 font-bold">三大法人買賣超</h3> */}

            <div className="flex flex-col items-center">
                <h2 className="text-2xl p-2 font-bold">散戶指標 - 融資融券餘額</h2>
                <div className="flex justify-center">
                    <div className="p-1">
                        <h3 className="text-xl p-2 font-bold">集中市場</h3>
                        <h4 className="text-lg p-2">融資今日餘額 (交易單位): {TWSEMarginTransactions.marginBalance}</h4>
                        <h4 className="text-lg p-2">融資餘額增減 (交易單位): {TWSEMarginTransactions.marginBalanceChange}</h4>
                        <h4 className="text-lg p-2">融資金額(仟元)-今日餘額: {TWSEMarginTransactions.marginBalanceValue}</h4>
                        <h4 className="text-lg p-2">融資餘額增減(仟元): {TWSEMarginTransactions.marginBalanceValueChange}</h4>
                        <h4 className="text-lg p-2">融券(交易單位)-今日餘額: {TWSEMarginTransactions.shortBalance}</h4>
                        <h4 className="text-lg p-2">融券餘額增減(交易單位): {TWSEMarginTransactions.shortBalanceChange}</h4>
                    </div>
                    <div className="p-1">
                        <h3 className="text-xl p-2 font-bold">櫃買中心</h3>
                        <h4 className="text-lg p-2">融資今日餘額 (交易單位): {TPEXMarginTransactions.marginBalance}</h4>
                        <h4 className="text-lg p-2">融資餘額增減 (交易單位): {TPEXMarginTransactions.marginBalanceChange}</h4>
                        <h4 className="text-lg p-2">融資金額(仟元)-今日餘額: {TPEXMarginTransactions.marginBalanceValue}</h4>
                        <h4 className="text-lg p-2">融資餘額增減(仟元): {TPEXMarginTransactions.marginBalanceValueChange}</h4>
                        <h4 className="text-lg p-2">融券(交易單位)-今日餘額: {TPEXMarginTransactions.shortBalance}</h4>
                        <h4 className="text-lg p-2">融券餘額增減(交易單位): {TPEXMarginTransactions.shortBalanceChange}</h4>
                    </div>
                </div>
                <h2 className="text-2xl p-2 font-bold">散戶指標 - 小台散戶多空比</h2>
                <div className="p-1">
                    <div>
                        <p className="p-2">散戶多空比 = 散戶淨部位 / 未沖銷契約量 * 100%</p>
                        <h4 className="text-sm p-2">未沖銷契約量: {openInterest} </h4>
                        <h4 className="text-sm p-2">三大法人多方未平倉: {bigThreeOpenInterest.long} </h4>
                        <h4 className="text-sm p-2">三大法人空方未平倉: {bigThreeOpenInterest.short} </h4>
                        <h4 className="text-sm p-2">小台散戶多空比: {smallLongShortRation} </h4>
                    </div>

                </div>
            </div>
        </main>
    );
}