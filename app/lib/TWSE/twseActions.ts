'use server';

// TWSE 臺灣證券交易所

import { DateTime } from 'luxon';
import numeral from "numeral";
import { stockTWSEData } from '@/types/stock';

// 取得上一個交易日的成交股數, 成交金額, 成交筆數, 發行量加權股價指數, 漲跌點數
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
    const response = await fetch(url, {
        cache: 'no-store',
    }).then((res) => res.json());

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

// 取得大盤本益比, 淨值比, 殖利率
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
    const response = await fetch(url, {
        cache: 'no-store',
    }).then((res) => res.json());

    // 若該日期非交易日或尚無成交資訊則回傳 null
    if (!response) return null;
    if (!response.data) return null;

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
    const response = await fetch(url, {
        cache: 'no-store',
    }).then((res) => res.json());

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
// 取得個股&ETF定期定額排行
export async function fetchDollarCostAveragingRank() {
    const url = `https://www.twse.com.tw//ETFReport/ETFRank`;

    // 取得回應資料
    const response = await fetch(url, {
        cache: 'no-store',
    }).then((res) => res.json());

    // 若該日期非交易日或尚無成交資訊則回傳 null
    if (!response) return null;

    // 整理回應資料
    const data = response.data.map((row: string[]) => {
        return {
            level: row[0],
            stock: {
                stockCode: row[1],
                stockName: row[2],
                stockTradingAccont: row[3]
            }, 
            etf: {
                etfCode: row[4],
                etfName: row[5],
                etfTradingAccont: row[6]
            }
        };
    })

    return data;
};