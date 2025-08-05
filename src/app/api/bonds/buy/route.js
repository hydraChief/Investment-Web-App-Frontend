export async function POST(req) {
    try {
        let bData = await req.json();
        console.log("buying bonds:", bData);
      const buyInvestmentURL = `${process.env.BACKEND_URL}/api/bonds/buy`;
        console.log("buying investment", buyInvestmentURL);
      const res = await fetch(buyInvestmentURL, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            "Content-Type": "application/json",
        },
        duplex: 'half',
        method: 'POST',
        body: JSON.stringify(bData)
      });
  
      const data = await res.json();
      console.log("buy bond response:", data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
        console.error("Error adding investment:", err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
  