'use client';

import React, { useEffect, useState, useTransition } from 'react'
import { createChart } from 'lightweight-charts'
import { historyData, candleData, CandleHistoryProps } from '@/types/components/CandleHistory';
import { fetchStockCandleHistory } from '@/app/lib/Fugle/fugleAction';

const CandleHistory = ({ candleToday, stockNo }: CandleHistoryProps) => {
    const [candleHistoryData, setCandleHistoryData] = useState<historyData[]>([]);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);

    const fetchCandleHistoryData = async () => {
        const today = new Date();

        //上一個交易日
        const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
        const yesterdayYear = yesterday.getFullYear();
        const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
        const yesterdayDate = String(yesterday.getDate()).padStart(2, "0");
        const to = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDate}`;

        //一年之前
        const start = new Date();
        start.setFullYear(start.getFullYear() - 1);
        const startYear = start.getFullYear();
        const startMonth = String(start.getMonth() + 1).padStart(2, "0");
        const startDate = String(start.getDate()).padStart(2, "0");
        const from = `${startYear}-${startMonth}-${startDate}`;

        try {
            const response = await fetchStockCandleHistory(from, to, stockNo);
            
            setCandleHistoryData(response);
        } catch (error: any) {
            console.log("err", error);

        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    useEffect(() => {
        startTransition(fetchCandleHistoryData);
    }, [])

    useEffect(() => {
        const fetchChart = () => {
            const parentElement = document.getElementById('CandleHistory') as HTMLElement;

            const chartWidth = parentElement.clientWidth;
            const chartHeight = parentElement.clientHeight;

            const chart = createChart(parentElement, {
                autoSize: true,
                width: chartWidth,
                height: 400
            })

            const data: candleData[] = candleHistoryData.map((item) => {
                return {
                    time: item.date,
                    open: item.open,
                    close: item.close,
                    high: item.high,
                    low: item.low,
                    value: item.close
                }
            });
            data.reverse();

            //這裡push最新今日資料
            if (data[data.length - 1].time !== candleToday.time) {
                data.push({
                    time: candleToday.time,
                    open: candleToday.open,
                    close: candleToday.close,
                    high: candleToday.high,
                    low: candleToday.low,
                    value: candleToday.value
                })
            }

            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#EF5350',
                downColor: '#26A69A',
                borderVisible: false,
                wickUpColor: '#EF5350',
                wickDownColor: '#26A69A'
            });

            candlestickSeries.setData(data);
        }
        
        if (!candleHistoryData) return
        if (loading) return
        if (candleToday.time.length === 0) return
        fetchChart()
    }, [candleHistoryData, loading])

    return (
        <>
            {loading && <div>
                <div className="flex items-center justify-center bg-info h-96">
                    {/* TODO: Loading 動畫元件 */}
                    <h2 className="text-white text-center ml-2">資料載入中...</h2>
                </div>
            </div>}
            {!loading && <div className='w-[80%] overflow-auto mx-auto'>
                {(candleHistoryData.length === 0) ?
                    <div className="flex flex-col items-center justify-center bg-info h-96">
                        <h2 className="text-white text-center">OOPS！資料有誤，暫時無法顯示</h2>
                        <button
                            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                            onClick={() => { fetchCandleHistoryData() }}
                        >
                            重新整理
                        </button>
                        <div className="text-secondary text-center text-xs mt-4">如果錯誤持續發生，請聯繫管理員</div>
                    </div> :
                    <div id="CandleHistory"></div>
                }
            </div>}
        </>
    )
}

export default CandleHistory