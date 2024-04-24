'use server';

import { MTXContractOpenInterest, MTXContractRes, bigThreeMTXContract } from "@/types/indicator";
import { accumulate } from "@/utils";

// 小台散戶多空比 
// - 散戶多空比 = (散戶多單 - 散戶空單) / 小型臺指期貨所有契約未沖銷契約量 x 100%
// - 散戶多單 = 小型臺指期貨所有契約未沖銷契約量 - 三大法人多方未平倉量
// - 散戶空單 = 小型臺指期貨所有契約未沖銷契約量 - 三大法人空方未平倉量

// 小型臺指期貨未沖銷契約量
export async function fetchMxfMarketOi() {
    try {
        const url = "https://openapi.taifex.com.tw/v1/DailyMarketReportFut"

        const response = await fetch(url, {
            cache: 'no-store',
        }).then((res) => res.json()).catch((err) => {
            return null;
        });

        // 若該日期非交易日或尚無成交資訊則回傳 null
        if (!response) return null;

        const MTXContract = response.filter((res: MTXContractRes) => {
            return res.Contract === "MTX"
        });

        //未沖銷契約量
        const init = 0;
        const openInterestCount = MTXContract.map((contract: MTXContractOpenInterest) => contract.OpenInterest).reduce(accumulate, init);

        return openInterestCount;
    } catch (err) {
        console.log("err", err)
    }
}

// 三大法人小型台指期貨未平倉量
export async function fetchBigThreeMxf() {
    try {
        const url = "https://openapi.taifex.com.tw/v1/MarketDataOfMajorInstitutionalTradersDetailsOfFuturesContractsBytheDate";

        const response = await fetch(url, {
            cache: 'no-store',
        }).then((res) => res.json()).catch((err) => {
            return null;
        });

        // 若該日期非交易日或尚無成交資訊則回傳 null
        if (!response) return null;

        const bigThreeMTXContract = response.filter((res: {
            ContractCode: string;
        }) => {
            return res.ContractCode === "小型臺指期貨"
        });

        //未沖銷契約量
        const openInterestLongCount = bigThreeMTXContract.map((contract: bigThreeMTXContract) => contract['OpenInterest(Long)']).reduce(accumulate, 0);
        const openInterestShortCount = bigThreeMTXContract.map((contract: bigThreeMTXContract) => contract['OpenInterest(Short)']).reduce(accumulate, 0);

        const bigThreeOpenInterest = {
            long: openInterestLongCount ? openInterestLongCount : 0,
            short: openInterestShortCount
        }

        return bigThreeOpenInterest
    } catch (err) {
        console.log("err", err);
    }
}