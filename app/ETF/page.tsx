import { fetchFugleTodayData } from "../lib/Fugle/fugleActions";
import { getDownloads } from "../lib/Matchbox/matchboxActions";

export default async function Page() {

    //fetchFugleTodayData
    const [todayData, test] = await Promise.all([
        fetchFugleTodayData('0050'),
        getDownloads("00929")
    ]);

     console.log("test", test);
    

    return (
        <main>
            ETF觀測站
            基本資訊

            old: 0056 00878 00919 00929 00713
            new: 00939 00940
            規模前5大高股息etf前10大共同持股
            使用web scraper爬取MoneyDJ
            <div>
                <h3>{todayData.name}</h3>
                <p>{todayData.openPrice}</p>
                <p>{todayData.closePrice}</p>
            </div>
            
        </main>
    );
}