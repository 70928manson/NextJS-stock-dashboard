'use server';

import { stockTWSEData } from '@/types/stock';
import { DateTime } from 'luxon';
import numeral from "numeral";

// Fugle 富果API

//富果API stock基本資料 拿g收盤價(最後成交價), 漲跌, 漲跌幅, 成交量 (金額)
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