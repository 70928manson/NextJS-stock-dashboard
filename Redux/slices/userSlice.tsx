// import { create } from 'zustand'

// //id 股價名稱 股價 漲跌 漲跌幅 本益比 值利率 股價淨值比
// type StockType = {
//     id: number
//     name: string,
//     price: Number,
//     change: Number,
//     changePercentage: Number,
//     PE: Number,
//     yield: Number,
//     PBR: Number,
// }

// type PortfolioStore = {
//     stocks: StockType[]
//     addStock: (stock: StockType) => void,
//     deleteStock: (stockId: Number) => void,
// }

// export const usePortfolioStore = create<PortfolioStore>((set) => ({
//     stocks: [],
//     addStock: (stock: StockType) => set((state) => ({ stocks: [...state.stocks, stock] })),
//     deleteStock: (stockId: Number) => set((state) => {
//         const filterStocks = state.stocks.filter((stock) => {
//             return stock.id !== stockId
//         })
//         return { stocks: filterStocks }
//     })
// }));