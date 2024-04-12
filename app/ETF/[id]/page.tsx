import { fetchFugleTodayData } from '@/app/lib/Fugle/fugleActions';
import { fetchTWSEBasicData } from '@/app/lib/TWSE/twseActions';
import CandleHistory from '@/components/CandleHistory';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    const today = new Date();

    //call證交所api抓上一個交易日該個股的本益比, 股價淨值比, 殖利率
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yesterdayDate = String(yesterday.getDate()).padStart(2, "0");

    const [basic, todayData] = await Promise.all([
        fetchTWSEBasicData(`${yesterdayYear}-${yesterdayMonth}-${yesterdayDate}`, id),
        fetchFugleTodayData(id),
    ]);

    if (!todayData) {
        notFound();
    }

    const candleData = {
        time: todayData.date,
        open: todayData.openPrice,
        close: todayData.closePrice,
        high: todayData.highPrice,
        low: todayData.lowPrice,
        value: todayData.closePrice
    }

    return (
        <main>
            個股頁面
            <div>
                證交所資料
                <p>Current params id: {id}</p>
                <p>資料日期: {todayData.date}</p>
                <p>價格: {todayData?.lastTrade?.price ? todayData.lastTrade.price : todayData.lastTrial.price}</p>
                <p>漲跌幅: {todayData.changePercent}</p>
                <p>漲跌金額: {todayData.change}</p>
                <p>成交量: {todayData.total.tradeVolume}</p>
                <p>成交金額: {todayData.total.tradeValue}</p>
            </div>

            {
                basic && <div>
                    <p>本益比: {basic.PE}</p>
                    <p>淨值比: {basic.PB}</p>
                    <p>殖利率: {basic.dividenedYield}</p>

                    <p>籌碼</p>

                    <p>K棒圖</p>
                </div>
            }
            <CandleHistory candleToday={candleData} stockNo={id} />
        </main>
    );
}