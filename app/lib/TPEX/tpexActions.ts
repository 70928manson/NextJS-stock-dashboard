'use server';

// TPEX 證券櫃檯買賣中心

import { DateTime } from 'luxon';
import numeral from "numeral";

// 取得櫃買市場融資融券餘額
export async function fetchTPEXMarginTransactions(date: string) {
    // 將 `date` 轉換成 `民國年/MM/dd` 格式
    const dt = DateTime.fromISO(date);
    const year = dt.get('year') - 1911;
    const formattedDate = `${year}/${dt.toFormat('MM/dd')}`;

    // 建立 URL 查詢參數
    const query = new URLSearchParams({
        l: 'zh-tw',       // 指定語系為正體中文
        d: formattedDate, // 指定日期
        o: 'json',        // 指定回應格式為 JSON
    });
    const url = `https://www.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?${query}`;

    // 取得回應資料
    const response = await fetch(url, {
        cache: 'no-store',
    }).then((res) => res.json());

    // 若該日期非交易日或尚無成交資訊則回傳 null
    if (!response) return null;

    // 整理回應資料  data => numeral(data).value()
    const data = [
        ...response.tfootData_one,
        ...response.tfootData_two
    ].map((data: string) => numeral(data).value())   // 取出融資融券統計並轉為數字格式
    .filter((data) => data) as number[];             // 移除 null 值, data 必為number[]

    const [
        marginBalancePrev,        // 融資(交易單位)-前日餘額
        marginPurchase,           // 融資(交易單位)-買進
        marginSale,               // 融資(交易單位)-賣出
        cashRedemption,           // 融資(交易單位)-現金(券)償還
        marginBalance,            // 融資(交易單位)-今日餘額
        shortBalancePrev,         // 融券(交易單位)-前日餘額
        shortCovering,            // 融券(交易單位)-買進
        shortSale,                // 融券(交易單位)-賣出
        stockRedemption,          // 融券(交易單位)-現金(券)償還
        shortBalance,             // 融券(交易單位)-今日餘額
        marginBalanceValuePrev,   // 融資金額(仟元)-前日餘額
        marginPurchaseValue,      // 融資金額(仟元)-買進
        marginSaleValue,          // 融資金額(仟元)-賣出
        cashRedemptionValue,      // 融資金額(仟元)-現金(券)償還
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
}