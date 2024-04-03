import { fetchFugleTodayData } from "../lib/Fugle/fugleActions";
import { getDownloads } from "../lib/Matchbox/matchboxActions";
import StockListbox from "@/components/StockListbox";

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
            <div>
                <h3>{todayData.name}</h3>
                <p>{todayData.openPrice}</p>
                <p>{todayData.closePrice}</p>
            </div>

            <StockListbox /> 
            <h2>持股池</h2>
            <div className="flex">
                <div>
                    <h3>00929</h3>
                    {
                        test.map((t) => {
                            return <div key={t.name} className="flex gap-x-4">
                                <p>{t.name}</p>
                                <p>{t.percent}</p>
                            </div>
                        })
                    }
                    <div className="p-2 border-2 hover:p-3">移除</div>
                </div>
            </div>
            
        </main>
    );
}