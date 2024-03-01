'use server';

// TWSE 臺灣證券交易所

import { DateTime } from 'luxon';
import numeral from "numeral";

// 取得集中市場融資融券餘額
export async function fetchTWSEMarginTransactions(date: string) {
    // 將 `date` 轉換成 `yyyyMMdd` 格式
    const formattedDate = DateTime.fromISO(date).toFormat('yyyyMMdd');

    // 建立 URL 查詢參數
    const query = new URLSearchParams({
        response: 'json',     // 指定回應格式為 JSON
        date: formattedDate,  // 指定資料日期
        selectType: 'MS',     // 指定分類項目為信用交易統計
    });
    const url = `https://www.twse.com.tw/exchangeReport/MI_MARGN?${query}`;

    // 取得回應資料
    const response = await fetch(url).then((res) => res.json());

    // 若該日期非交易日或尚無成交資訊則回傳 null
    if (!response) return null;

    // 整理回應資料
    const data: number[] = response.creditList
        .map((data: string[]) => data.slice(1)).flat()           // 取出買賣金額並減少一層陣列嵌套
        .map((data: string) => numeral(data).value() || +data);  // 轉為數字格式

    const [
        marginPurchase,           // 融資(交易單位)-買進
        marginSale,               // 融資(交易單位)-賣出
        cashRedemption,           // 融資(交易單位)-現金(券)償還
        marginBalancePrev,        // 融資(交易單位)-前日餘額
        marginBalance,            // 融資(交易單位)-今日餘額
        shortCovering,            // 融券(交易單位)-買進
        shortSale,                // 融券(交易單位)-賣出
        stockRedemption,          // 融券(交易單位)-現金(券)償還
        shortBalancePrev,         // 融券(交易單位)-前日餘額
        shortBalance,             // 融券(交易單位)-今日餘額
        marginPurchaseValue,      // 融資金額(仟元)-買進
        marginSaleValue,          // 融資金額(仟元)-賣出
        cashRedemptionValue,      // 融資金額(仟元)-現金(券)償還
        marginBalanceValuePrev,   // 融資金額(仟元)-前日餘額
        marginBalanceValue,       // 融資金額(仟元)-今日餘額
    ] = data;

    // 計算融資餘額增減(交易單位)
    const marginBalanceChange = marginBalance - marginBalancePrev;

    // 計算融資餘額增減(仟元)
    const marginBalanceValueChange = marginBalanceValue - marginBalanceValuePrev;

    // 計算融券餘額增減(交易單位)
    const shortBalanceChange = shortBalance - shortBalancePrev;

    return {
        date,
        marginBalance,
        marginBalanceChange,
        marginBalanceValue,
        marginBalanceValueChange,
        shortBalance,
        shortBalanceChange,
    };
};