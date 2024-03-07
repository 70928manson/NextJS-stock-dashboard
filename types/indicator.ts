export interface MTXContractRes {
    Contract: string;
}

export interface MTXContractOpenInterest {
    OpenInterest: Number;
}

export interface bigThreeMTXContract {
    'OpenInterest(Long)': Number;
    'OpenInterest(Short)': Number;
}

export interface dollarCostAveragingRank {
    level: string,
    stock: {
        stockCode: string,
        stockName: string,
        stockTradingAccont: string
    },
    etf: {
        etfCode: string,
        etfName: string,
        etfTradingAccont: string
    }
}