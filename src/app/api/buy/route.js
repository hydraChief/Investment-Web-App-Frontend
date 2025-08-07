export async function POST(req) {
    try {
        let bData = await req.json();
        console.log("Buying stock:", bData);
      const addInvestmentURL = `${process.env.BACKEND_URL}/api/investments/add`;
        console.log("Adding investment", addInvestmentURL);
      const res = await fetch(addInvestmentURL, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            "Content-Type": "application/json",
        },
        duplex: 'half',
        method: 'POST',
        body: JSON.stringify(bData)
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
  