let stocks = [
  { name: 'Reliance',  symbol:'RELIANCE', sector:'energy',  price: 2400, change: 0 },
  { name: 'Infosys',   symbol:'INFY',     sector:'it',      price: 1500, change: 0 },
  { name: 'HDFC Bank', symbol:'HDFCBANK', sector:'banking', price: 1600, change: 0 },
  { name: 'TCS',       symbol:'TCS',      sector:'it',      price: 3300, change: 0 },
  { name: 'ONGC',      symbol:'ONGC',     sector:'energy',  price: 270,  change: 0 }
];

function jitter(p) {
  const delta = Math.round((Math.random()*20 - 10) * 100) / 100; // -10..+10
  return { delta, next: Math.max(1, Math.round((p + delta)*100)/100) };
}

function startMockFeed(io, onTick) {
  setInterval(()=>{
    stocks = stocks.map(s => {
      const { delta, next } = jitter(s.price);
      return { ...s, price: next, change: delta };
    });
    io.emit('stockUpdate', stocks);
    if (typeof onTick === 'function') onTick(stocks);
  }, 3000);
}

function getStocks(){ return stocks; }

module.exports = { startMockFeed, getStocks };
