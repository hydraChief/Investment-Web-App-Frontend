export async function GET(req) {
    try {
      const ownedStocks = `${process.env.BACKEND_URL}/api/dashboard/units`;
      const res = await fetch(ownedStocks, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
        },
        duplex: 'half',
        method: 'GET',
      });
  
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
        console.error("Error adding investment:", err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
  