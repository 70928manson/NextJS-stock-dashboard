'use client';

import React, { useEffect, useState, useTransition } from 'react'
import { createChart } from 'lightweight-charts'
import { fetchTSEIndexHistory } from '@/app/lib/actions';
import { historyData, candleData, TSEHistoryProps } from '@/types/components/TSEHistory';

const TSEHistory = ({ TSEToday }: TSEHistoryProps) => {
    const [TSEHistoryData, setTSEHistoryData] = useState<historyData[]>([]);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);

    const fetchTSEData = async () => {
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
        const todayDate = String(today.getDate() - 1).padStart(2, "0");
        const to = `${todayYear}-${todayMonth}-${todayDate}`;

        //一年之前
        const start = new Date();
        start.setFullYear(start.getFullYear() - 1);
        const startYear = start.getFullYear();
        const startMonth = String(start.getMonth() + 1).padStart(2, "0");
        const startDate = String(start.getDate()).padStart(2, "0");
        const from = `${startYear}-${startMonth}-${startDate}`;

        try {
            const response = await fetchTSEIndexHistory(from, to);          
            setTSEHistoryData(response);
        } catch (error: any) {
            console.log("err", error);
            
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    useEffect(() => {
        startTransition(fetchTSEData);
    }, [])

    useEffect(() => {
        const fetchChart = () => {
            const parentElement = document.getElementById('TSEHistory') as HTMLElement;

            const chartWidth = parentElement.clientWidth;
            const chartHeight = parentElement.clientHeight;

            const chart = createChart(parentElement, {
                autoSize: true,
                width: chartWidth,
                height: 400
            })

            const data: candleData[] = TSEHistoryData.map((item) => {
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
            data.push({
                time: TSEToday.time,
                open: TSEToday.open,
                close: TSEToday.close,
                high: TSEToday.high,
                low: TSEToday.low,
                value: TSEToday.value 
            })

            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#EF5350',
                downColor: '#26A69A',
                borderVisible: false,
                wickUpColor: '#EF5350',
                wickDownColor: '#26A69A'
            });

            candlestickSeries.setData(data);
        }
        if (TSEHistoryData.length === 0) return
        if (loading) return
        fetchChart()
    }, [TSEHistoryData, loading])

    return (
        <>
            {loading && <div>
                <div className="flex items-center justify-center bg-info h-96">
                    {/* TODO: Loading 動畫元件 */}
                    <h2 className="text-white text-center ml-2">資料載入中...</h2>
                </div>
            </div>}
            {!loading && <div className='w-[80%] overflow-auto mx-auto'>
                {(TSEHistoryData.length === 0) ?
                    <div className="flex flex-col items-center justify-center bg-info h-96">
                        <h2 className="text-white text-center">OOPS！資料有誤，暫時無法顯示</h2>
                        <button
                            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                            onClick={() => { fetchTSEData() }}
                        >
                            重新整理
                        </button>
                        <div className="text-secondary text-center text-xs mt-4">如果錯誤持續發生，請聯繫管理員</div>
                    </div> :
                    <div id="TSEHistory"></div>
                }
            </div>}
        </>
    )
}

export default TSEHistory