export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
  
    if (!symbol) {
      return new Response(JSON.stringify({ error: "Symbol is required" }), { status: 400 });
    }
  
    try {
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
        console.log("Fetching data from Yahoo Finance:", yahooUrl);
      const res = await fetch(yahooUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0', 
        }
      });
  
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
  