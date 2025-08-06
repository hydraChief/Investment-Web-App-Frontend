export async function GET(req) {
    try {
        const distributionURL = `${process.env.BACKEND_URL}/api/metals/date-series-all`;
        console.log("fetching metals investment distribution", distributionURL);

        const res = await fetch(distributionURL, {
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
        console.error("Error fetching metals investment distribution:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
