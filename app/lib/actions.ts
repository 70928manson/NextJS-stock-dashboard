'use server';

import { DateTime } from 'luxon';
import numeral from "numeral";

interface data {
    date: string | null;
    tradeVolume: number,
    tradeValue: number,
    transaction: number,
    price: number,
    change: number,
}

//不包括今日即時 只有到昨天QQ
export async function fetchMarketTrades(date: string) {
    // 將 `date` 轉換成 `yyyyMMdd` 格式
    const formattedDate = DateTime.fromISO(date).toFormat('yyyyMMdd');

    // 建立 URL 查詢參數
    const query = new URLSearchParams({
        response: 'json',     // 指定回應格式為 JSON
        date: formattedDate,  // 指定資料日期
    });
    const url = `https://www.twse.com.tw/exchangeReport/FMTQIK?${query}`;

    //問題 response type

    // 取得回應資料
    const response = await fetch(url).then((res) => res.json());

    // 若該日期非交易日或尚無成交資訊則回傳 null
    if (!response) return null;

    // 整理回應資料
    const data = response.data.map((row: string[]) => {
        // [ 日期, 成交股數, 成交金額, 成交筆數, 發行量加權股價指數, 漲跌點數 ]
        const [date, ...values] = row;

        // 將 `民國年/MM/dd` 的日期格式轉換成 `yyyy-MM-dd`
        const [year, month, day] = date.split('/');
        const formatted = `${+year + 1911}${month}${day}`;
        const formattedDate = DateTime.fromFormat(formatted, 'yyyyMMdd').toISODate();

        //轉為數字格式
        const [tradeVolume, tradeValue, transaction, price, change] = values.map(value => numeral(value).value());

        return {
            date: formattedDate,
            tradeVolume,
            tradeValue,
            transaction,
            price,
            change,
        };
    }).find((data: data) => data.date === date) || null  //取得目標日期的成交資訊

    return data;
};

//富果API版本
const apiTSEIndexUrl = 'https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/IX0001'

//今日行情
export async function fetchTSEIndex() {
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
        //console.log("TSE today data", data)
        return data;
    } catch (error) {
        console.error('API 請求錯誤:', error);
    }
}

const apiTSEIndexHistoryUrl = 'https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/IX0001'

export async function fetchTSEIndexHistory(from: string, to: string) {
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
        const response = await fetch(`${apiTSEIndexHistoryUrl}?${payload}`, {
            headers: headers,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        };
        const data = await response.json();
        //console.log('TSE History data', data);
        return data.data;
    } catch (error) {
        console.error('API 請求錯誤:', error);
    }
}