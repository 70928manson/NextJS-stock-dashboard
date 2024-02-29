import { fetchMxfMarketOi, fetchBigThreeMxf } from "../lib/indicatorAction";
import { notFound } from 'next/navigation';

export default async function Page() {
    const [openInterest, bigThreeOpenInterest] = await Promise.all([
        fetchMxfMarketOi(),
        fetchBigThreeMxf()
    ])

    if (!openInterest || !bigThreeOpenInterest) {
        notFound();
    }

    const smallLong = openInterest - bigThreeOpenInterest.long;     //散戶多單
    const smallShort = openInterest - bigThreeOpenInterest.short;   //散戶空單
    const smallClean = smallLong - smallShort;                      //散戶淨部位

    // 散戶多空比 = 散戶淨部位 / 未沖銷契約量 * 100%
    const smallLongShortRation = (Math.round(smallClean / openInterest * 100 * 100) / 100).toFixed(2);

    return (
        <main className="flex min-h-main-content flex-col items-center">
            經濟指標: 散戶, 大戶, 法人, Fed利率
            
            <h3 className="text-lg p-2">三大法人買賣超</h3>

            <h2 className="text-2xl p-2">散戶</h2>

            <h3 className="text-lg p-2">融資融券餘額: </h3>
            
            <h3 className="text-lg p-2">小台散戶多空比: {smallLongShortRation} </h3>
            <h4 className="text-sm p-2">未沖銷契約量: {openInterest} </h4>
            <h4 className="text-sm p-2">三大法人多方未平倉: {bigThreeOpenInterest.long} </h4>
            <h4 className="text-sm p-2">三大法人空方未平倉: {bigThreeOpenInterest.short} </h4>
            <p>散戶多空比 = 散戶淨部位 / 未沖銷契約量 * 100%</p>

        </main>
    );
}