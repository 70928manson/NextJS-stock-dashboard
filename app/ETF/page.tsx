import { fetchFugleTodayData } from "../lib/Fugle/fugleActions";

export default async function Page() {

    //fetchFugleTodayData
    const [todayData] = await Promise.all([
        fetchFugleTodayData('0050')
    ]);

    return (
        <main>
            ETF觀測站
            基本資訊
            高股息共同持股

            <div>
                <h3>{todayData.name}</h3>
                <p>{todayData.openPrice}</p>
                <p>{todayData.closePrice}</p>
            </div>
            
        </main>
    );
}