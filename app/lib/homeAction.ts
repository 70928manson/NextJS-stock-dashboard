'use server';

import { DateTime } from 'luxon';
import numeral from "numeral";

//不包括今日即時 只有抓昨天的成交股數, 成交金額, 成交筆數, 發行量加權股價指數, 漲跌點數
export async function fetchMarketTrades(date: string) {
    // 將 `date` 轉換成 `yyyyMMdd` 格式
    const formattedDate = DateTime.fromISO(date).toFormat('yyyyMMdd');

    // 建立 URL 查詢參數
    const query = new URLSearchParams({
        response: 'json',     // 指定回應格式為 JSON
        date: formattedDate,  // 指定資料日期
    });
    const url = `https://www.twse.com.tw/exchangeReport/FMTQIK?${query}`;

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
    })
    //.find((data: data) => data.date === date) || null  //取得目標日期的成交資訊
    const length = data.length

    return data[length - 1];
};
