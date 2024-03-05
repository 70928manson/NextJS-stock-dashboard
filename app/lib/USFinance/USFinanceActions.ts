'use server';

// US Ministry of Finance 美國財政部

import { DateTime } from 'luxon';
import { stringToJsonData } from '@/utils';

// 取得目標日期的美國公債殖利率
export async function fetchUsTreasuryYields(date: string) {
    const dt = DateTime.fromISO(date);
    const month = dt.toFormat('yyyyMM');
    const url = `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/all/${month}?type=daily_treasury_yield_curve&field_tdr_date_value_month=${month}&page&_format=csv`

    // 美國財政部回傳該月每日美債殖利率紀錄 csv 資料
    const csvString = await fetch(url).then((res) => res.text());
    // 若尚無該日期資訊則回傳 null
    if (!csvString) return null;

    const formattedDate = DateTime.fromISO(date).toFormat('MM/dd/yyyy');

    // 美國 1 個月期公債殖利率 ~ 美國 30 年期公債殖利率
    const headers = ["date", "us1m", "us2m", "us3m", "us6m", "us1y", "us2y", "us3y", "us5y", "us7y", "us10y", "us20y", "us30y"];

    const data = stringToJsonData(csvString, headers).find(data => data.date === formattedDate);

    return data
};