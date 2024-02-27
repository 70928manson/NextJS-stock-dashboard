export interface indexData {
    closePrice: number;
    change: number;
    changePercent: number;
    totalTradeValue: number;
}

export interface marketTradeData {
    date: string;
    tradeVolume: number;
    tradeValue: number;
    transaction: number;
    price: number;
    change: number;
}