// HydroSip – demo dashboard
// All sample data lives here so it can later be replaced by real Supabase data.
const SAMPLE_DATA = {
  goalLitres: 2.0,
  reminderIntervalMin: 60,
  lastSync: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
  today: [
    { id: 1, time: '07:45', ml: 250 },
    { id: 2, time: '09:30', ml: 200 },
    { id: 3, time: '11:15', ml: 300 },
    { id: 4, time: '13:00', ml: 150 },
    { id: 5, time: '15:20', ml: 300 }
  ],
  // Litres per day, Monday to Sunday. Today's bar is calculated from `today`.
  week: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], litres: [1.6, 1.9, 1.4, 2.1, 1.7, 1.5, 0] },
  todayIndex: 6
};

const STORAGE_KEY = 'hydrosip-demo-settings';

const state = {
  events: SAMPLE_DATA.today.slice(),
  goal: SAMPLE_DATA.goalLitres,
  interval: SAMPLE_DATA.reminderIntervalMin
};

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.goal) state.goal = saved.goal;
    if (saved && saved.interval) state.interval = saved.interval;
  } catch (e) { /* storage unavailable – keep defaults */ }
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ goal: state.goal, interval: state.interval }));
    return true;
  } catch (e) {
    return false;
  }
}

const fmtL = (litres) => {
  const v = Math.round(litres * 100) / 100;
  return (Number.isInteger(v) ? v.toFixed(1) : String(v)) + ' L';
};
const totalLitres = () => state.events.reduce((sum, e) => sum + e.ml, 0) / 1000;

let chart = null;

function renderProgress() {
  const total = totalLitres();
  const pct = Math.min(100, Math.round((total / state.goal) * 100));
  const ring = document.getElementById('ring-value');
  const circumference = 2 * Math.PI * 62;
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference * (1 - pct / 100);
  document.getElementById('ring-text').textContent = pct + '%';
  document.getElementById('total-text').textContent = fmtL(total);
  document.getElementById('goal-text').textContent = 'of ' + fmtL(state.goal) + ' · ' + pct + '%';
}

function renderEvents() {
  const list = document.getElementById('events');
  list.innerHTML = '';
  state.events.forEach((ev) => {
    const li = document.createElement('li');
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = ev.time;
    const amount = document.createElement('span');
    amount.className = 'amount';
    amount.textContent = ev.ml + ' ml';
    const btn = document.createElement('button');
    btn.className = 'btn-remove';
    btn.type = 'button';
    btn.textContent = 'Remove';
    btn.setAttribute('aria-label', 'Remove ' + ev.ml + ' ml at ' + ev.time);
    li.append(time, amount, btn);
    btn.addEventListener('click', () => {
      state.events = state.events.filter((x) => x.id !== ev.id);
      renderAll();
    });
    list.appendChild(li);
  });
  document.getElementById('events-empty').hidden = state.events.length > 0;
}

function renderChart() {
  const data = SAMPLE_DATA.week.litres.slice();
  data[SAMPLE_DATA.todayIndex] = totalLitres();
  if (typeof Chart === 'undefined') return; // CDN not reachable – page still works

  if (chart) {
    chart.data.datasets[0].data = data;
    chart.data.datasets[1].data = data.map(() => state.goal);
    chart.update();
    return;
  }

  const colors = data.map((_, i) => (i === SAMPLE_DATA.todayIndex ? '#1F6E6C' : '#9FD1CB'));
  chart = new Chart(document.getElementById('week-chart'), {
    type: 'bar',
    data: {
      labels: SAMPLE_DATA.week.labels,
      datasets: [
        { label: 'Litres', data: data, backgroundColor: colors, borderRadius: 8, maxBarThickness: 44 },
        { type: 'line', label: 'Goal', data: data.map(() => state.goal), borderColor: '#E07A5F', borderDash: [6, 6], pointRadius: 0, borderWidth: 2 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 500 },
      scales: {
        y: { beginAtZero: true, ticks: { callback: (v) => v + ' L', color: '#4A5A5E' }, grid: { color: '#E6EEEC' } },
        x: { ticks: { color: '#4A5A5E' }, grid: { display: false } }
      },
      plugins: {
        legend: { labels: { color: '#1F2A2E', font: { family: 'DM Sans' } } },
        tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + Number(c.raw).toFixed(1) + ' L' } }
      }
    }
  });
}

function renderSync() {
  const d = new Date(SAMPLE_DATA.lastSync);
  const el = document.getElementById('last-sync');
  el.dateTime = d.toISOString();
  el.textContent = d.toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

function renderAll() {
  renderProgress();
  renderEvents();
  renderChart();
}

function initSettings() {
  const form = document.getElementById('settings-form');
  const goal = document.getElementById('s-goal');
  const interval = document.getElementById('s-interval');
  const msg = document.getElementById('saved-msg');
  goal.value = state.goal;
  interval.value = String(state.interval);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const g = parseFloat(goal.value);
    if (!(g >= 0.5 && g <= 5)) { msg.textContent = 'Please enter a goal between 0.5 and 5 litres.'; return; }
    state.goal = g;
    state.interval = parseInt(interval.value, 10);
    msg.textContent = saveSettings()
      ? 'Saved. Reminder every ' + state.interval + ' minutes.'
      : 'Applied for this visit (browser storage is not available).';
    renderAll();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  renderSync();
  initSettings();
  renderAll();
});
