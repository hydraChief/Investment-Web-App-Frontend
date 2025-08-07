export async function POST(req) {
    try {
        let mData = await req.json();
        console.log("buying metals:", mData);

        const buyInvestmentURL = `${process.env.BACKEND_URL}/api/metals/buy`;
        console.log("buying metal investment", buyInvestmentURL);

        const res = await fetch(buyInvestmentURL, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                "Content-Type": "application/json",
            },
            duplex: 'half',
            method: 'POST',
            body: JSON.stringify(mData)
        });

        const data = await res.json();
        console.log("buy metal response:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        console.error("Error buying metal:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
