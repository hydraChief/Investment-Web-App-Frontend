"use client";
import { fetchJSON } from "@/lib/api";
import { set } from "date-fns";
import { useEffect, useState } from "react";

export default function MetalsPage() {
  const [metals, setMetals] = useState([]);
  const [ownedMetals, setOwnedMetals] = useState([]);

  const [selectedBuyMetal, setSelectedBuyMetal] = useState(null);
  const [selectedSellMetal, setSelectedSellMetal] = useState(null);

  const [buyUnits, setBuyUnits] = useState("");
  const [sellUnits, setSellUnits] = useState("");

  const [mode, setMode] = useState("buy"); 

  useEffect(() => {
    async function fetchMetals() {
      try {
        const data = await fetchJSON("/api/metals/search");
        setMetals(data);
      } catch (err) {
        console.error("Error loading metals:", err);
      }
    }
    fetchMetals();
  }, []);

  async function fetchOwned() {
    try {
      const data = await fetchJSON("/api/metals/owned");
      console.log("Owned metals data:", data);
      setOwnedMetals(data);
    } catch (err) {
      console.error("Error loading owned metals:", err);
    }
  }
  useEffect(() => {
    fetchOwned();
  }, []);

  const handleBuy = async (name, symbol,price, units) => {
    if (units<=0) return alert("Select metal and units");
    try {
      const metalsData = await fetchJSON("/api/metals/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metalName: name,
          symbol: symbol,
          units: units,
          price: price,
        })
      });
      if (metalsData) {
        alert("Metal purchased successfully");
        setOwnedMetals(metalsData);
        setBuyUnits(0);
      } else {
        alert(metalsData.error || "Error buying metal");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSell = async ( name, symbol,price, units, ownedUnits) => {
    if (ownedUnits < units || units <= 0) {
      return alert("Not enough units to sell");
    }
    try {
      const data = await fetchJSON("/api/metals/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metalName: name,
          symbol: symbol,
          units: units,
          price: price,
        })
      });
        alert("Metal sold successfully");
        await fetchOwned();
        setSellUnits("");
        setSelectedSellMetal(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Precious Metals Trading</h1>
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setMode("buy")}
          style={{ fontWeight: mode === "buy" ? "bold" : "normal" }}
        >
          Buy
        </button>
        <button
          onClick={() => setMode("sell")}
          style={{ fontWeight: mode === "sell" ? "bold" : "normal", marginLeft: 10 }}
        >
          Sell
        </button>
      </div>

      {mode === "buy" && (
        <div>
          <h2>Available Metals</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {metals.map(m => (
              <div
                key={m.symbol}
                onClick={() => setSelectedBuyMetal(m)}
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  backgroundColor:
                    selectedBuyMetal?.symbol === m.symbol ? "#cce5ff" : "white"
                }}
              >
                <strong>{m.name}</strong> ({m.symbol})<br />
                Price: ${m.price}
              </div>
            ))}
          </div>
          {selectedBuyMetal && (
            <div style={{ marginTop: 20 }}>
              <h3>Buy {selectedBuyMetal.name}</h3>
              <input
                type="number"
                placeholder="Units"
                value={buyUnits}
                onChange={e => setBuyUnits(e.target.value)}
              />
              <button onClick={()=>handleBuy(selectedBuyMetal.name,selectedBuyMetal.symbol,selectedBuyMetal.price,buyUnits)}>Buy</button>
            </div>
          )}
        </div>
      )}

      {mode === "sell" && (
        <div>
          <h2>Owned Metals</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {ownedMetals.map(m => (
              <div
                key={m.metal_symbol}
                onClick={() => setSelectedSellMetal(m)}
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  backgroundColor:
                    selectedSellMetal?.symbol === m.metal_symbol ? "#ffcccc" : "white"
                }}
              >
                <strong>{m.metal_name}</strong> ({m.metal_symbol})<br />
                Units: {m.units_remaining}<br />
                Price: ${m.current_price?.toFixed(2)}
              </div>
            ))}
          </div>
          {selectedSellMetal && (
            <div style={{ marginTop: 20 }}>
              <h3>Sell {selectedSellMetal.metal_name}</h3>
              <input
                type="number"
                placeholder="Units to Sell"
                value={sellUnits}
                onChange={e => setSellUnits(e.target.value)}
              />
              <button onClick={()=>handleSell(selectedSellMetal.metal_name,selectedSellMetal.metal_symbol,selectedSellMetal.current_price,sellUnits)}>Sell</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
