import yahooFinance from 'yahoo-finance2';

export async function GET(req) {
    try {
        // Step 1: Get owned stocks from backend
        const ownedStocksURL = `${process.env.BACKEND_URL}/api/dashboard/units`;
        const res = await fetch(ownedStocksURL, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            method: 'GET',
        });

        if (!res.ok) throw new Error(`Backend API returned ${res.status}`);
        const ownedStocks = await res.json(); // [{ company_name, units_remaining }, ...]

        if (!ownedStocks.length) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Step 2: Extract symbols
        const symbols = ownedStocks.map(s => s.company_name);

        // Step 3: Fetch all quotes at once using yahoo-finance2
        const quotes = await yahooFinance.quote(symbols);
        const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

        // Step 4: Map symbol -> { price, full_name }
        const priceMap = {};
        quotesArray.forEach(q => {
            priceMap[q.symbol] = {
                price: q.regularMarketPrice,
                fullName: q.longName || q.shortName || q.symbol,
                shortName: q.shortName || q.symbol
            };
        });

        // Step 5: Merge with owned stocks
        const enrichedData = ownedStocks.map(stock => {
            const priceInfo = priceMap[stock.company_name] || { price: 0, fullName: stock.company_name };
            return {
                company_name: stock.company_name,
                full_company_name: priceInfo.fullName,
                short_company_name: priceInfo.shortName,
                price_per_unit: priceInfo.price,
                total_units: stock.units_remaining,
                total_amount: stock.units_remaining * priceInfo.price
            };
        });

        return new Response(JSON.stringify(enrichedData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Error fetching investment distribution:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
