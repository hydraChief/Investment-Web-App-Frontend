document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

const API_KEY = "YOUR_ALPHAVANTAGE_KEY";
let selectedStock = null;

document.getElementById("stockSearch").addEventListener("change", async (e) => {
  selectedStock = e.target.value.trim();
  if (!selectedStock) return;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${selectedStock}&apikey=${API_KEY}`;
  const data = await fetchJSON(url);
  const series = data["Time Series (Daily)"];
  const chartData = Object.entries(series).slice(0, 22).map(([date, val]) => ({
    x: new Date(date),
    o: parseFloat(val["1. open"]),
    h: parseFloat(val["2. high"]),
    l: parseFloat(val["3. low"]),
    c: parseFloat(val["4. close"])
  })).reverse();
  const ctx = document.getElementById("candlestickChart").getContext("2d");
  new Chart(ctx, {
    type: 'candlestick',
    data: { datasets: [{ label: selectedStock, data: chartData }] }
  });
});

document.getElementById("buyBtn").addEventListener("click", async () => {
  const units = parseInt(document.getElementById("buyUnits").value);
  if (!selectedStock || !units) return alert("Select stock and enter units");
  await fetchJSON(`${BACKEND_URL}/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock: selectedStock, units })
  });
  alert("Purchase successful!");
});

async function loadOwnedStocks() {
  const stocks = await fetchJSON(`${BACKEND_URL}/owned`);
  const container = document.getElementById("ownedStocks");
  container.innerHTML = "";
  stocks.forEach(stock => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${stock.symbol}</strong> - Owned: ${stock.units}
      <input type="number" id="sell-${stock.symbol}" placeholder="Units to sell">
      <button onclick="sellStock('${stock.symbol}', ${stock.units})">Sell</button>
    `;
    container.appendChild(div);
  });
}

async function sellStock(symbol, ownedUnits) {
  const input = document.getElementById(`sell-${symbol}`);
  const units = parseInt(input.value);
  if (units > ownedUnits) return alert("You cannot sell more than you own!");
  await fetchJSON(`${BACKEND_URL}/sell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock: symbol, units })
  });
  alert("Sold successfully!");
  loadOwnedStocks();
}

loadOwnedStocks();