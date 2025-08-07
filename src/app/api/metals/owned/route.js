export async function GET(req) {
    try {
        const gettingMetalsURL = `${process.env.BACKEND_URL}/api/metals/current-prices`;
        console.log("getting metals", gettingMetalsURL);

        const res = await fetch(gettingMetalsURL, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
            method: 'GET',
        });

        const data = await res.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        console.error("Error getting metals:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
