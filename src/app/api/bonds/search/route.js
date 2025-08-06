import yahooFinance from 'yahoo-finance2';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Query parameter "q" is required' }),
        { status: 400 }
      );
    }

    const results = await yahooFinance.search(query, { quotesCount: 10, newsCount: 0 });

    let bonds = results.quotes.filter(q =>
      q.quoteType === 'BOND' || q.quoteType === 'ETF' || q.quoteType === 'MUTUALFUND'
    ).map(q => ({
      symbol: q.symbol,
      shortName: q.shortname,
      longName: q.longname || q.shortname,
      type: q.quoteType
    }));

    if (bonds.length === 0) {
      return new Response(JSON.stringify({ error: 'No bonds found' }), { status: 404 });
    }

    const bondsWithPrices = await Promise.all(
      bonds.map(async bond => {
        try {
          const quote = await yahooFinance.quote(bond.symbol);
          return {
            ...bond,
            price: quote?.regularMarketPrice ?? null,
            currency: quote?.currency ?? null
          };
        } catch (err) {
          console.error(`Error fetching price for ${bond.symbol}:`, err);
          return { ...bond, price: null, currency: null };
        }
      })
    );

    return new Response(JSON.stringify(bondsWithPrices), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Error searching bonds:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
