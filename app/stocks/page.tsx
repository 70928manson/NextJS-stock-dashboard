export default async function Page() {
    const hotStocks = [
        '2330',
        '0050',
        '0056',
        '00878',
        '00919',
        '00929',
    ]

    return (
        <main className="w-[80%] h-full mx-auto">
            <h2 className="text-center text-3xl p-2">股票資訊站</h2>
            <p className="text-center p-2">大家都在搜...</p>
            <div className='text-center'>
                <div className="flex justify-center items-center">
                    {hotStocks.map((stock) => {
                        return <div className="p-1 m-1 cursor-pointer hover:bg-sky-100 hover:text-blue-600 border rounded-lg">{stock}</div>
                    })}
                </div>
            </div>
        </main>
    );
}