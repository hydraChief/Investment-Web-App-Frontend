export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
  
    if (!query) {
      return new Response(JSON.stringify({ quotes: [] }), { status: 200 });
    }
  
    try {
      const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
  