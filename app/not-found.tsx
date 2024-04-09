import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <div style={{ padding: '10px', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", textAlign: "center", alignItems: "center", marginBottom: '20px' }}>
                    <h1 style={{
                        borderRight: '1px solid black', display: "inline-block", margin: "0 20px 0 0", padding: "0 23px",
                        fontSize: "36px", fontWeight: '700', verticalAlign: 'top', lineHeight: '56px'
                    }}>404</h1> <p style={{ fontSize: "24px" }}>This page could not be found.</p>
                </div>
                <Link href="/" className="border border-2 border-black p-3 rounded hover:bg-black hover:text-white">
                    回到首頁
                </Link>
            </div>

        </>
    );
}