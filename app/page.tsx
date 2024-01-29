import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-main-content flex-col items-center p-12">
      <div className="flex">
        <div>
          加權指數
        </div>
        <div>
          淨值比
        </div>
        <div>
          Vix
        </div>
      </div>
      <div>指數圖</div>
      <div>
        產業熱力圖
      </div>
    </main>
  );
}
