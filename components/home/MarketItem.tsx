import React from 'react';
import clsx from 'clsx';

interface marketItem {
    title: string;
    value: string;
    misc: string;
    status?: string;
}

export default function MarketItem({
    title,
    value,
    misc,
    status,
}: marketItem) {
  return (
    <div className="flex flex-col p-4 justify-center items-center w-[25%] border-r last:border-0">
      <div className="text-sm font-bold leading-7">{title}</div>
      <div className={clsx("text-2xl font-bold leading-7", {
        'text-stock-red': status === "up",
        'text-stock-green': status === "down"
      })}>{value}</div>  
      <div className={clsx("text-sm font-bold leading-7", {
        'text-stock-red': status === "up",
        'text-stock-green': status === "down"
      })}>{misc}</div>
    </div>
  )
}
