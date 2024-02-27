'use server';

import { stockTWSEData } from '@/types/stock';
import { DateTime } from 'luxon';
import numeral from "numeral";

//透過證交所api 拿本益比 淨值比 殖利率
export async function fetchTWSEBasicData(date: string, stockNo: string) {    
    // 將 `date` 轉換成 `yyyyMMdd` 格式
    const formattedDate = DateTime.fromISO(date).toFormat('yyyyMMdd');

    // 建立 URL 查詢參數
    const query = new URLSearchParams({
        date: formattedDate,  // 指定資料日期
        stockNo: stockNo,     // 股票代號
        response: 'json',     // 指定回應格式為 JSON
    });

    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU?${query}`;

    // 取得回應資料
    const response = await fetch(url).then((res) => res.json());

    // 若該日期非交易日或尚無成交資訊則回傳 null
    if (!response) return null;
    
    // 整理回應資料  => 這邊要改
    const data: stockTWSEData[] = response.data.map((row: string[]) => {
        // [ 日期, 殖利率, 股利年度, 本益比, 股價淨值比, 財報年/季 ]
        const [dateA, ...values] = row;

        const formatted = DateTime.fromISO(date).toFormat('yyyyMMdd');
        
        const formattedDate = DateTime.fromFormat(formatted, 'yyyyMMdd').toISODate();

        //轉為數字格式
        const [dividenedYield, dividenedYear, PE, PB, financialQuarter] = values.map(value => numeral(value).value());

        return {
            date: formattedDate,
            dividenedYield,
            dividenedYear,
            PE,
            PB,
        };
    })
    const length = data.length

    return data[length - 1];
};

//富果API stock基本資料 拿g收盤價(最後成交價), 漲跌, 漲跌幅, 成交量 (金額?)
//今日行情
export async function fetchFugleTodayData(stockNo: string) {
    const apiTSEIndexUrl = `https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/${stockNo}`
    try {
        const headers = {
            'X-API-KEY': `${process.env.X_API_KEY}`,
            'Content-Type': 'application/json'
        };

        const response = await fetch(`${apiTSEIndexUrl}`, {
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        };

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API 請求錯誤:', error);
    }
}

//富果api candle圖
export async function fetchStockCandleHistory(from: string, to: string, stockNo: string) {
    const apiStockHistoryUrl = `https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/${stockNo}`
    try {
        const headers = {
            'X-API-KEY': `${process.env.X_API_KEY}`,
            'Content-Type': 'application/json'
        }
        const payload = new URLSearchParams({
            from: from,
            to: to,
            fields: 'open,high,low,close,volume'
        });
        const response = await fetch(`${apiStockHistoryUrl}?${payload}`, {
            headers: headers,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        };
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('API 請求錯誤:', error);
    }
}