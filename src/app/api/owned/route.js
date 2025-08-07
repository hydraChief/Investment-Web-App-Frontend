import yahooFinance from 'yahoo-finance2';

export async function GET(req) {
    try {
        const ownedStocksURL = `${process.env.BACKEND_URL}/api/dashboard/units`;
        const res = await fetch(ownedStocksURL, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            method: 'GET',
        });

        if (!res.ok) throw new Error(`Backend API returned ${res.status}`);
        const ownedStocks = await res.json(); 

        if (!ownedStocks.length) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        const symbols = ownedStocks.map(s => s.company_name);

        const quotes = await yahooFinance.quote(symbols);
        const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

        const priceMap = {};
        quotesArray.forEach(q => {
            priceMap[q.symbol] = {
                price: q.regularMarketPrice,
                fullName: q.longName || q.shortName || q.symbol,
                shortName: q.shortName || q.symbol
            };
        });

        const enrichedData = ownedStocks.map(stock => {
            const priceInfo = priceMap[stock.company_name] || { price: 0, fullName: stock.company_name };
            return {
                company_name: stock.company_name,
                full_company_name: priceInfo.fullName,
                short_company_name: priceInfo.shortName,
                previous_price: stock.price || 0,
                previous_total_amount:stock.total_units,
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
