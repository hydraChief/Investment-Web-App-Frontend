export async function POST(req) {
    try {
        let bData = await req.json();
        console.log("selling bonds:", bData);
      const sellInvestmentURL = `${process.env.BACKEND_URL}/api/bonds/sell`;
        console.log("selling investment", sellInvestmentURL);
      const res = await fetch(sellInvestmentURL, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            "Content-Type": "application/json",
        },
        duplex: 'half',
        method: 'POST',
        body: JSON.stringify(bData)
      });
      
      const data = await res.json();
      console.log("sell bond response:", data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
        console.error("Error adding investment:", err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
  