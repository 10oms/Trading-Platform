// Simple client: search & filter + live price updates + notifications
const socket = io();

// Update stock cards on incoming prices
socket.on('stockUpdate', (stocks) => {
  stocks.forEach(s => {
    const el = document.querySelector(`.stock-card[data-symbol="${s.symbol}"]`);
    if (!el) return;
    const priceEl = el.querySelector('.stock-price');
    const changeEl = el.querySelector('.stock-change');
    priceEl.textContent = `₹${s.price}`;
    changeEl.textContent = `${s.change >= 0 ? '+' : ''}${s.change}`;
    changeEl.classList.toggle('up', s.change >= 0);
    changeEl.classList.toggle('down', s.change < 0);
  });
});

// Trigger fired toast
socket.on('triggerFired', (payload) => {
  alert(`🎯 Trigger hit for ${payload.stock} @ ₹${payload.targetPrice} (LTP ₹${payload.ltp})`);
  // Refresh right panel by reloading page data (simple approach for demo)
  setTimeout(()=>location.reload(), 500);
});

// Scheduled order placed
socket.on('scheduledPlaced', (payload) => {
  alert(`🕒 Scheduled order executed for ${payload.stock} at ${new Date(payload.time).toLocaleString()}`);
  setTimeout(()=>location.reload(), 500);
});

// Search & filter
const searchInput = document.getElementById('search-input');
const sectorFilter = document.getElementById('sector-filter');

function applyFilters(){
  const q = (searchInput.value || '').toLowerCase().trim();
  const sector = sectorFilter.value;
  document.querySelectorAll('.stock-card').forEach(card => {
    const name = card.dataset.name;
    const sym = card.dataset.symbol.toLowerCase();
    const sec = card.dataset.sector;
    const textMatch = !q || name.includes(q) || sym.includes(q);
    const sectorMatch = sector === 'all' || sector === sec;
    card.style.display = (textMatch && sectorMatch) ? '' : 'none';
  });
}

searchInput.addEventListener('input', applyFilters);
sectorFilter.addEventListener('change', applyFilters);
