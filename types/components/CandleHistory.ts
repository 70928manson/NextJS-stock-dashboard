export interface historyData {
    date: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    change: string;
}

export interface candleData {
    time: string;
    open: string;
    close: string;
    high: string;
    low: string;
    value: string;
}

export interface CandleHistoryProps {
    candleToday: candleData
}