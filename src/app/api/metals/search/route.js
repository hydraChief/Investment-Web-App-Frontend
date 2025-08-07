import yahooFinance from 'yahoo-finance2';

// List of precious metals with names and Yahoo symbols
const metals = [
  { name: 'Gold', symbol: 'GC=F' },
  { name: 'Silver', symbol: 'SI=F' },
  { name: 'Platinum', symbol: 'PL=F' },
  { name: 'Palladium', symbol: 'PA=F' }
];

async function getMetalsData() {
  try {
    const results = await Promise.all(
      metals.map(async metal => {
        const quote = await yahooFinance.quote(metal.symbol);
        return {
          name: metal.name,
          symbol: metal.symbol,
          price: quote.regularMarketPrice,
          currency: quote.currency
        };
      })
    );
    console.log(results);
    return results;
  } catch (err) {
    console.error('Error fetching metals data:', err);
  }
}

export async function GET(req) {
  try {
    const metalsData = await getMetalsData();
    return new Response(JSON.stringify(metalsData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Error fetching precious metals data:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}