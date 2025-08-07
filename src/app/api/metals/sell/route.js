export async function POST(req) {
    try {
        let mData = await req.json();
        console.log("selling metals:", mData);

        const sellInvestmentURL = `${process.env.BACKEND_URL}/api/metals/sell`;
        console.log("selling metal investment", sellInvestmentURL);

        const res = await fetch(sellInvestmentURL, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                "Content-Type": "application/json",
            },
            duplex: 'half',
            method: 'POST',
            body: JSON.stringify(mData)
        });

        const data = await res.json();
        console.log("sell metal response:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        console.error("Error selling metal:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
