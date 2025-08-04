(async function loadDashboard() {
  const data = await fetchJSON(`${BACKEND_URL}/portfolio`);
  new Chart(document.getElementById("unitsPie"), {
    type: "pie",
    data: {
      labels: data.map(d => d.symbol),
      datasets: [{ data: data.map(d => d.units) }]
    }
  });
  new Chart(document.getElementById("valuePie"), {
    type: "pie",
    data: {
      labels: data.map(d => d.symbol),
      datasets: [{ data: data.map(d => d.currentValue) }]
    }
  });
  const transactions = await fetchJSON(`${BACKEND_URL}/transactions`);
  new Chart(document.getElementById("timeSeriesChart"), {
    type: "line",
    data: {
      labels: transactions.map(t => t.date),
      datasets: data.map(stock => ({
        label: stock.symbol,
        data: transactions.filter(t => t.symbol === stock.symbol).map(t => t.unitsChange)
      }))
    }
  });
})();