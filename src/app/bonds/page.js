'use client';
import { useState, useEffect } from 'react';
import { fetchJSON } from '@/lib/api';

export default function BondsPage() {
  const [tab, setTab] = useState('buy');
  const [selectedBondType, setSelectedBondType] = useState('treasury bond');
  const [selectedBuyBond, setSelectedBuyBond] = useState({});
  const [selectedSellBond, setSelectedSellBond] = useState({});
  const [ownedBonds, setOwnedBonds] = useState([]);
  const [buyUnits, setBuyUnits] = useState(0);
  const [sellUnits, setSellUnits] = useState(0);
  const [searchedBond, setSearchedBond] = useState([]);

  const categories = [
    { name: "US Treasuries", query: "treasury bond" },
    { name: "Corporate Bonds", query: "corporate bond" },
    { name: "Municipal Bonds", query: "municipal bond" },
    { name: "Government Bonds", query: "government bond" },
    { name: "Junk Bonds", query: "high yield bond" },
    { name: "International Bonds", query: "international bond" }
  ];
  useEffect(() => { loadOwnedBonds(); }, []);

  useEffect(() => {
    if (!selectedBondType) return;
    searchBond();
  }, [selectedBondType]);

  async function loadOwnedBonds() {
    const bonds = await fetchJSON(`/api/bonds/owned`);
    console.log("Owned bonds:", bonds);
    setOwnedBonds(bonds);
  }

  async function searchBond() {
    if (!selectedBondType) return;
    const res = await fetch(`/api/bonds/search?q=${encodeURIComponent(selectedBondType)}`);
    const json = await res.json();
    console.log("Bond search results:", json);
    setSearchedBond(json);
  }

  async function buyBond(name, symbol, price, buyUnits) {
    await fetchJSON(`/api/bonds/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, symbol: symbol, price: price, type: 'buy', units: buyUnits })
    });
    loadOwnedBonds();
    setBuyUnits(0);
    alert("Purchase successful!");
  }

  async function sellBond(name, symbol, ownedUnits,price, sellUnits) {
    if (sellUnits > ownedUnits) return alert("Cannot sell more than owned");
    await fetchJSON(`/api/bonds/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, symbol: symbol, price: price, type: 'sell', units: sellUnits })
    });
    alert("Sold successfully!");
    loadOwnedBonds();
  }


  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => setTab('buy')} style={{ background: tab === 'buy' ? '#1abc9c' : '#ddd' }}>Buy</button>
        <button onClick={() => setTab('sell')} style={{ background: tab === 'sell' ? '#1abc9c' : '#ddd' }}>Sell</button>
      </div>

      {/* Buy Tab */}
      {tab === 'buy' && (
        <div>
          {categories.map(cat => (
            <button key={cat.name} onClick={() => setSelectedBondType(cat.query)} style={{ margin: '0 5px' }}>
              {cat.name}
            </button>
          ))}

            <input type="number" value={buyUnits} onChange={e => setBuyUnits(Number(e.target.value))} placeholder="Units" />
            <button onClick={() => buyBond(selectedBuyBond.shortName, selectedBuyBond.symbol, selectedBuyBond.price, buyUnits)}>Buy</button>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: '10px',
            fontWeight: 'bold',
            borderBottom: '2px solid #ccc',
            padding: '8px 0'
          }}>
            <div>Full Name</div>
            <div>Symbol</div>
            <div>Type</div>
            <div>Current Price</div>
            <div>Action</div>
          </div>

          {searchedBond.map(bond => (
            <div
              key={bond.bond_name}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                gap: '10px',
                padding: '8px 0',
                borderBottom: '1px solid #eee',
                alignItems: 'center'
              }}
              onClick={() => setSelectedBuyBond(bond)}
            >
              <div>{bond.shortName}</div>
              <div>{bond.symbol}</div>
              <div>{bond.type}</div>
              <div>${bond.price?.toFixed(2)}</div>
              <div style={{ display: 'flex', gap: '5px' }}>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sell Tab */}
      {tab === 'sell' && (
        <div>
            <input
                type="number"
                min="1"
                max={selectedSellBond.total_units}
                onChange={(e) => setSellUnits(Number(e.target.value))}
                placeholder="Units"
                style={{ width: '60px' }}
            />
            <button onClick={() => sellBond(selectedSellBond.bond_name, selectedSellBond.bond_symbol, selectedSellBond.units_remaining, selectedSellBond.current_price, sellUnits)}>
                Sell
            </button>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: '10px',
            fontWeight: 'bold',
            borderBottom: '2px solid #ccc',
            padding: '8px 0'
          }}>
            <div>Full Name</div>
            <div>Symbol</div>
            <div>Units</div>
            <div>Current Price</div>
            <div>Action</div>
          </div>

          {ownedBonds.map(bond => (
            <div
              key={bond.bond_name}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                gap: '10px',
                padding: '8px 0',
                borderBottom: '1px solid #eee',
                alignItems: 'center'
              }}
              onClick={() => setSelectedSellBond(bond)}
            >
              <div>{bond.bond_name}</div>
              <div>{bond.bond_symbol}</div>
              <div>{bond.units_remaining}</div>
              <div>${bond.current_price?.toFixed(2)}</div>
              <div style={{ display: 'flex', gap: '5px' }}>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
