// ============ STORAGE ============
const LS = {
  get(k, def) { try { const v = localStorage.getItem(k); return v===null ? def : JSON.parse(v); } catch { return def; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};

const todayISO = () => new Date().toISOString().slice(0,10);
document.getElementById('todayLabel').textContent = new Date().toLocaleDateString('de-DE',{weekday:'long', day:'numeric', month:'long'});
document.getElementById('weightDate').value = todayISO();

// ============ LEBENSMITTEL-DATENBANK ============
// Werte pro 100g (Standard) oder pro Stück
const DEFAULT_FOODS = [
  // Getreide & Brot
  { name:'Haferflocken', unit:'100g', kcal:370, p:13, c:60, f:7, aliases:['hafer'] },
  { name:'Reis (gekocht)', unit:'100g', kcal:130, p:2.7, c:28, f:0.3, aliases:['reis gekocht'] },
  { name:'Reis (roh)', unit:'100g', kcal:355, p:7, c:78, f:1, aliases:['reis roh'] },
  { name:'Nudeln (gekocht)', unit:'100g', kcal:158, p:5.8, c:31, f:1, aliases:['pasta gekocht','spaghetti gekocht'] },
  { name:'Nudeln (roh)', unit:'100g', kcal:360, p:13, c:72, f:1.5, aliases:['pasta roh','spaghetti roh'] },
  { name:'Vollkornbrot', unit:'100g', kcal:230, p:8, c:42, f:2 },
  { name:'Toastbrot', unit:'100g', kcal:270, p:9, c:48, f:4 },
  { name:'Brötchen', unit:'piece', kcal:140, p:5, c:27, f:1.5, aliases:['semmel'] },
  { name:'Couscous (gekocht)', unit:'100g', kcal:112, p:3.8, c:23, f:0.2 },
  { name:'Quinoa (gekocht)', unit:'100g', kcal:120, p:4.4, c:21, f:1.9 },
  { name:'Kartoffeln (gekocht)', unit:'100g', kcal:77, p:2, c:17, f:0.1 },
  { name:'Süßkartoffel (gekocht)', unit:'100g', kcal:86, p:1.6, c:20, f:0.1 },

  // Fleisch & Fisch
  { name:'Hähnchenbrust', unit:'100g', kcal:165, p:31, c:0, f:3.6, aliases:['hühnerbrust','chicken'] },
  { name:'Putenbrust', unit:'100g', kcal:135, p:30, c:0, f:1 },
  { name:'Rinderhack', unit:'100g', kcal:215, p:21, c:0, f:14, aliases:['hackfleisch rind'] },
  { name:'Hackfleisch gemischt', unit:'100g', kcal:240, p:18, c:0, f:18, aliases:['hack'] },
  { name:'Rindersteak', unit:'100g', kcal:200, p:27, c:0, f:10, aliases:['steak'] },
  { name:'Schweinefilet', unit:'100g', kcal:120, p:22, c:0, f:3 },
  { name:'Lachs', unit:'100g', kcal:208, p:20, c:0, f:13 },
  { name:'Thunfisch (Dose)', unit:'100g', kcal:116, p:26, c:0, f:1, aliases:['thunfisch'] },
  { name:'Garnelen', unit:'100g', kcal:99, p:24, c:0.2, f:0.3 },

  // Milchprodukte
  { name:'Milch', unit:'100g', kcal:64, p:3.4, c:4.8, f:3.5, aliases:['vollmilch','milch 3.5'] },
  { name:'Magermilch', unit:'100g', kcal:35, p:3.4, c:5, f:0.1, aliases:['milch 1.5','milch fettarm'] },
  { name:'Magerquark', unit:'100g', kcal:67, p:12, c:4, f:0.3, aliases:['quark'] },
  { name:'Skyr', unit:'100g', kcal:65, p:11, c:4, f:0.2 },
  { name:'Joghurt natur', unit:'100g', kcal:60, p:3.5, c:4, f:3.5, aliases:['joghurt'] },
  { name:'Griechischer Joghurt', unit:'100g', kcal:120, p:9, c:4, f:8 },
  { name:'Hüttenkäse', unit:'100g', kcal:100, p:13, c:3, f:4.3, aliases:['körniger frischkäse'] },
  { name:'Mozzarella', unit:'100g', kcal:250, p:18, c:1, f:19 },
  { name:'Gouda', unit:'100g', kcal:356, p:25, c:0, f:28, aliases:['käse'] },
  { name:'Frischkäse', unit:'100g', kcal:250, p:6, c:3, f:24 },
  { name:'Butter', unit:'100g', kcal:740, p:0.7, c:0.6, f:82 },

  // Eier
  { name:'Ei', unit:'piece', kcal:78, p:6.3, c:0.6, f:5.3, aliases:['eier','hühnerei'] },
  { name:'Eiweiß', unit:'piece', kcal:17, p:3.6, c:0.2, f:0.1, aliases:['eiklar'] },

  // Obst
  { name:'Banane', unit:'piece', kcal:105, p:1.3, c:27, f:0.4, aliases:['bananen'] },
  { name:'Apfel', unit:'piece', kcal:80, p:0.4, c:21, f:0.3, aliases:['äpfel'] },
  { name:'Orange', unit:'piece', kcal:65, p:1.3, c:16, f:0.2 },
  { name:'Birne', unit:'piece', kcal:100, p:0.6, c:25, f:0.2 },
  { name:'Beeren', unit:'100g', kcal:50, p:1, c:11, f:0.4, aliases:['blaubeeren','himbeeren','erdbeeren'] },
  { name:'Heidelbeeren', unit:'100g', kcal:57, p:0.7, c:14, f:0.3 },
  { name:'Trauben', unit:'100g', kcal:69, p:0.7, c:18, f:0.2 },
  { name:'Mango', unit:'100g', kcal:60, p:0.8, c:15, f:0.4 },
  { name:'Ananas', unit:'100g', kcal:50, p:0.5, c:13, f:0.1 },
  { name:'Avocado', unit:'piece', kcal:240, p:3, c:13, f:22 },

  // Gemüse
  { name:'Brokkoli', unit:'100g', kcal:34, p:2.8, c:7, f:0.4 },
  { name:'Blumenkohl', unit:'100g', kcal:25, p:1.9, c:5, f:0.3 },
  { name:'Karotten', unit:'100g', kcal:41, p:0.9, c:10, f:0.2, aliases:['möhren'] },
  { name:'Spinat', unit:'100g', kcal:23, p:2.9, c:3.6, f:0.4 },
  { name:'Tomaten', unit:'100g', kcal:18, p:0.9, c:3.9, f:0.2, aliases:['tomate'] },
  { name:'Gurke', unit:'100g', kcal:15, p:0.7, c:3.6, f:0.1 },
  { name:'Paprika', unit:'100g', kcal:31, p:1, c:6, f:0.3 },
  { name:'Zwiebel', unit:'100g', kcal:40, p:1.1, c:9, f:0.1, aliases:['zwiebeln'] },
  { name:'Salat', unit:'100g', kcal:15, p:1.4, c:2.9, f:0.2, aliases:['blattsalat','eisbergsalat'] },
  { name:'Zucchini', unit:'100g', kcal:17, p:1.2, c:3.1, f:0.3 },

  // Hülsenfrüchte
  { name:'Linsen (gekocht)', unit:'100g', kcal:116, p:9, c:20, f:0.4 },
  { name:'Kichererbsen (gekocht)', unit:'100g', kcal:164, p:9, c:27, f:2.6 },
  { name:'Bohnen (gekocht)', unit:'100g', kcal:127, p:8.7, c:23, f:0.5, aliases:['kidneybohnen'] },
  { name:'Tofu', unit:'100g', kcal:144, p:17, c:3, f:9 },

  // Nüsse & Samen
  { name:'Mandeln', unit:'100g', kcal:579, p:21, c:22, f:50 },
  { name:'Walnüsse', unit:'100g', kcal:654, p:15, c:14, f:65 },
  { name:'Cashewnüsse', unit:'100g', kcal:553, p:18, c:30, f:44, aliases:['cashews'] },
  { name:'Erdnüsse', unit:'100g', kcal:567, p:26, c:16, f:49 },
  { name:'Erdnussbutter', unit:'100g', kcal:588, p:25, c:20, f:50, aliases:['peanut butter'] },
  { name:'Chiasamen', unit:'100g', kcal:486, p:17, c:42, f:31 },
  { name:'Leinsamen', unit:'100g', kcal:534, p:18, c:29, f:42 },

  // Öle & Fette
  { name:'Olivenöl', unit:'100g', kcal:884, p:0, c:0, f:100, aliases:['öl'] },
  { name:'Rapsöl', unit:'100g', kcal:884, p:0, c:0, f:100 },
  { name:'Kokosöl', unit:'100g', kcal:862, p:0, c:0, f:100 },

  // Sonstiges
  { name:'Whey Protein', unit:'100g', kcal:380, p:75, c:8, f:5, aliases:['protein pulver','whey'] },
  { name:'Zucker', unit:'100g', kcal:400, p:0, c:100, f:0 },
  { name:'Honig', unit:'100g', kcal:304, p:0.3, c:82, f:0 },
  { name:'Marmelade', unit:'100g', kcal:250, p:0.4, c:60, f:0.1 },
  { name:'Reiscracker', unit:'100g', kcal:380, p:8, c:82, f:1 },
  { name:'Dunkle Schokolade', unit:'100g', kcal:546, p:7.8, c:46, f:31, aliases:['schokolade','zartbitter'] },
  { name:'Milchschokolade', unit:'100g', kcal:535, p:7.6, c:59, f:30 },
];

function getFoodDB() {
  return LS.get('foodDB', DEFAULT_FOODS);
}
function setFoodDB(db) { LS.set('foodDB', db); }

function addFood() {
  const name = document.getElementById('fName').value.trim();
  if (!name) return;
  const food = {
    name,
    unit: document.getElementById('fUnit').value,
    kcal: parseFloat(document.getElementById('fKcal').value)||0,
    p: parseFloat(document.getElementById('fP').value)||0,
    c: parseFloat(document.getElementById('fC').value)||0,
    f: parseFloat(document.getElementById('fF').value)||0,
    aliases: []
  };
  const db = getFoodDB();
  db.push(food);
  setFoodDB(db);
  ['fName','fKcal','fP','fC','fF'].forEach(id=>document.getElementById(id).value='');
  renderFoodTable();
  renderMeals();
}
function deleteFood(i) {
  const db = getFoodDB();
  db.splice(i,1);
  setFoodDB(db);
  renderFoodTable();
  renderMeals();
}
function renderFoodTable() {
  const db = getFoodDB();
  const cell = (val, type) => `<input style="width:100%; padding:4px 6px; background:transparent; border:1px solid transparent; border-radius:4px;" onfocus="this.style.borderColor='var(--border)'" onblur="this.style.borderColor='transparent'" type="${type}" value="${escapeHtml(String(val))}"/>`;
  document.getElementById('foodTable').innerHTML = db.map((f,i)=>`
    <tr data-i="${i}">
      <td>${cell(f.name,'text')}</td>
      <td>
        <select style="padding:4px 6px;">
          <option value="100g"${f.unit!=='piece'?' selected':''}>100g</option>
          <option value="piece"${f.unit==='piece'?' selected':''}>Stück</option>
        </select>
      </td>
      <td>${cell(f.kcal,'number')}</td>
      <td>${cell(f.p,'number')}</td>
      <td>${cell(f.c,'number')}</td>
      <td>${cell(f.f,'number')}</td>
      <td><button class="danger" onclick="deleteFood(${i})">×</button></td>
    </tr>`).join('');

  // Bind change handlers
  document.querySelectorAll('#foodTable tr').forEach(tr=>{
    const i = parseInt(tr.dataset.i);
    const [nameI, unitS, kcalI, pI, cI, fI] = tr.querySelectorAll('input, select');
    const save = () => {
      const db = getFoodDB();
      db[i].name = nameI.value.trim() || db[i].name;
      db[i].unit = unitS.value;
      db[i].kcal = parseFloat(kcalI.value)||0;
      db[i].p    = parseFloat(pI.value)||0;
      db[i].c    = parseFloat(cI.value)||0;
      db[i].f    = parseFloat(fI.value)||0;
      setFoodDB(db);
      // Mahlzeiten-Werte aktualisieren ohne neu rendern
      const meals = getMeals();
      meals.forEach((_,j)=>updateMealMacrosUI(j));
      renderTotals();
    };
    [nameI, kcalI, pI, cI, fI].forEach(el=>el.addEventListener('change', save));
    unitS.addEventListener('change', save);
  });
}

// Normalisiere Strings für Vergleich
function norm(s) {
  return (s||'').toLowerCase()
    .replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss')
    .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}

function findFood(query) {
  const db = getFoodDB();
  const q = norm(query);
  if (!q) return null;
  // Exakte Übereinstimmung
  for (const f of db) {
    if (norm(f.name) === q) return f;
    if (f.aliases && f.aliases.some(a=>norm(a)===q)) return f;
  }
  // Query enthält Foodname oder umgekehrt
  let best = null; let bestLen = 0;
  for (const f of db) {
    const candidates = [f.name, ...(f.aliases||[])];
    for (const cand of candidates) {
      const nc = norm(cand);
      if (q.includes(nc) && nc.length > bestLen) { best = f; bestLen = nc.length; }
      else if (nc.includes(q) && q.length > bestLen) { best = f; bestLen = q.length; }
    }
  }
  return best;
}

// Parse eine Zeile wie "150g Haferflocken" / "1 Banane" / "250ml Milch" / "2 Eier"
function parseLine(line) {
  const orig = line.trim();
  if (!orig) return null;
  // Mengenmuster: optional Zahl + optional Einheit (g|gr|gramm|ml|l|stk|stück|x)
  const re = /^\s*([\d.,]+)\s*(g|gr|gramm|ml|l|stk|stück|stueck|x)?\s*[a-zäöüß]*\s+(.+)$/i;
  // Aber auch "2 eier" ohne Einheit – die obige Regex matcht das auch (group2 leer)
  const m = orig.match(re);
  let qty = 1; let unit = ''; let name = orig;
  if (m) {
    qty = parseFloat(m[1].replace(',', '.'));
    unit = (m[2]||'').toLowerCase();
    name = m[3].trim();
  } else {
    // Versuch: nur Name, qty=1
    name = orig;
  }
  const food = findFood(name);
  if (!food) return { ok:false, raw: orig, name, qty, unit };
  let factor;
  if (food.unit === 'piece') {
    factor = qty;
  } else {
    // Gewichts-basiert: braucht Gramm/ml
    let grams;
    if (unit==='kg') grams = qty*1000;
    else if (unit==='l') grams = qty*1000;
    else if (unit==='ml' || unit==='g' || unit==='gr' || unit==='gramm') grams = qty;
    else if (!unit) grams = qty; // Annahme: Gramm
    else grams = qty;
    factor = grams / 100;
  }
  return {
    ok:true, raw: orig, food, qty, unit,
    kcal: food.kcal*factor,
    p: food.p*factor,
    c: food.c*factor,
    f: food.f*factor
  };
}

function calcMealMacros(foodsText) {
  // Trenne nach Zeilen und Kommas
  const lines = (foodsText||'').split(/[\n,;]+/).map(l=>l.trim()).filter(Boolean);
  const parsed = lines.map(parseLine).filter(Boolean);
  const sum = parsed.reduce((a,p)=>({
    kcal:a.kcal+(p.kcal||0), p:a.p+(p.p||0), c:a.c+(p.c||0), f:a.f+(p.f||0)
  }), {kcal:0,p:0,c:0,f:0});
  const unknown = parsed.filter(p=>!p.ok).map(p=>p.name);
  return {
    kcal: Math.round(sum.kcal),
    protein: Math.round(sum.p),
    carbs: Math.round(sum.c),
    fat: Math.round(sum.f),
    unknown
  };
}

// ============ ZYKLUS ============
// Findet das nächstgelegene Gewicht zu einem Datum (bevorzugt am/nach Datum für Start, am/vor Datum für Ende)
function findWeightNear(targetDate, prefer) {
  const weights = LS.get('weights', {});
  const dates = Object.keys(weights).sort();
  if (!dates.length) return null;
  const target = new Date(targetDate).getTime();
  let best = null; let bestDist = Infinity;
  for (const d of dates) {
    const t = new Date(d).getTime();
    const isAfter = t >= target;
    const isBefore = t <= target;
    if (prefer==='after' && !isAfter) continue;
    if (prefer==='before' && !isBefore) continue;
    const dist = Math.abs(t - target);
    if (dist < bestDist) { bestDist = dist; best = { date: d, kg: weights[d] }; }
  }
  // Fallback ohne Präferenz
  if (!best) {
    for (const d of dates) {
      const t = new Date(d).getTime();
      const dist = Math.abs(t - target);
      if (dist < bestDist) { bestDist = dist; best = { date: d, kg: weights[d] }; }
    }
  }
  return best;
}

function renderCycle() {
  const c = LS.get('cycle', { type:'bulk', start: todayISO() });
  document.querySelectorAll('#cycleToggle button').forEach(b=>{
    b.classList.toggle('active', b.dataset.cycle===c.type);
  });
  document.getElementById('cyclePill').innerHTML = c.type==='bulk'
    ? '<span class="pill bulk">AUFBAU</span>'
    : '<span class="pill cut">DIÄT</span>';
  document.getElementById('cycleStart').value = c.start;

  const start = new Date(c.start);
  const now = new Date(todayISO());
  const days = Math.floor((now - start) / (1000*60*60*24)) + 1;
  const week = Math.max(1, Math.ceil(days / 7));
  document.getElementById('cycleWeek').textContent = days>0 ? week : '–';
  document.getElementById('cycleDay').textContent  = days>0 ? days : '–';

  // Δ seit Start
  const startW = findWeightNear(c.start, 'after');
  const endW   = findWeightNear(todayISO(), 'before');
  const dEl = document.getElementById('cycleDelta');
  if (startW && endW && startW.date !== endW.date) {
    const diff = endW.kg - startW.kg;
    const sign = diff>0?'+':'';
    dEl.textContent = `${sign}${diff.toFixed(2)} kg`;
    dEl.className = 'big ' + (diff>0?'delta-up':'delta-down');
    dEl.style.fontSize = '24px';
  } else {
    dEl.textContent = '–'; dEl.className='big'; dEl.style.fontSize='24px';
  }

  renderCycleHistory();
}

function archiveCurrentCycle() {
  const c = LS.get('cycle', null);
  if (!c) return;
  const startW = findWeightNear(c.start, 'after');
  const endW   = findWeightNear(todayISO(), 'before');
  const entry = {
    type: c.type,
    start: c.start,
    end: todayISO(),
    startKg: startW ? startW.kg : null,
    endKg:   endW   ? endW.kg   : null
  };
  const hist = LS.get('cycleHistory', []);
  hist.push(entry);
  LS.set('cycleHistory', hist);
}

function finishCycle() {
  const c = LS.get('cycle', null);
  if (!c) return;
  if (!confirm('Aktuellen Zyklus abschließen und in die Historie verschieben?')) return;
  archiveCurrentCycle();
  // neuen Zyklus mit dem anderen Typ starten
  const newType = c.type === 'bulk' ? 'cut' : 'bulk';
  LS.set('cycle', { type: newType, start: todayISO() });
  renderCycle();
}

function deleteCycleHistory(i) {
  const hist = LS.get('cycleHistory', []);
  hist.splice(i,1);
  LS.set('cycleHistory', hist);
  renderCycleHistory();
}

function renderCycleHistory() {
  const hist = LS.get('cycleHistory', []);
  const tbody = document.getElementById('cycleHistoryTable');
  if (!tbody) return;
  if (!hist.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="muted">Noch keine abgeschlossenen Zyklen</td></tr>';
    return;
  }
  tbody.innerHTML = hist.slice().reverse().map((e, idxRev) => {
    const i = hist.length - 1 - idxRev;
    const days = Math.floor((new Date(e.end) - new Date(e.start)) / (1000*60*60*24)) + 1;
    const weeks = Math.max(1, Math.ceil(days/7));
    const sKg = e.startKg!=null ? e.startKg.toFixed(1) : '–';
    const eKg = e.endKg!=null   ? e.endKg.toFixed(1)   : '–';
    let deltaHtml = '<span class="muted">–</span>';
    if (e.startKg!=null && e.endKg!=null) {
      const diff = e.endKg - e.startKg;
      const sign = diff>0?'+':'';
      const cls = diff>0?'delta-up':(diff<0?'delta-down':'muted');
      deltaHtml = `<span class="${cls}">${sign}${diff.toFixed(2)} kg</span>`;
    }
    const pill = e.type==='bulk'
      ? '<span class="pill bulk">AUFBAU</span>'
      : '<span class="pill cut">DIÄT</span>';
    const period = `${new Date(e.start).toLocaleDateString('de-DE')} – ${new Date(e.end).toLocaleDateString('de-DE')}`;
    return `<tr>
      <td>${pill}</td>
      <td>${period}</td>
      <td>${weeks} W (${days} T)</td>
      <td>${sKg}</td>
      <td>${eKg}</td>
      <td>${deltaHtml}</td>
      <td><button class="danger" onclick="deleteCycleHistory(${i})">×</button></td>
    </tr>`;
  }).join('');
}

document.querySelectorAll('#cycleToggle button').forEach(b=>{
  b.onclick = () => {
    const cur = LS.get('cycle', {type:'bulk', start: todayISO()});
    if (cur.type !== b.dataset.cycle) {
      if (confirm('Aktuellen Zyklus abschließen und neuen starten? Der alte wird in die Historie übernommen.')) {
        archiveCurrentCycle();
      }
      LS.set('cycle', { type: b.dataset.cycle, start: todayISO() });
      renderCycle();
    }
  };
});
function saveCycleStart() {
  const d = document.getElementById('cycleStart').value;
  if (!d) return;
  const cur = LS.get('cycle', {type:'bulk', start: todayISO()});
  cur.start = d;
  LS.set('cycle', cur);
  renderCycle();
}

// ============ GEWICHT ============
let chart;
function saveWeight() {
  const d = document.getElementById('weightDate').value;
  const w = parseFloat(document.getElementById('weightInput').value);
  if (!d || isNaN(w)) { alert('Datum und Gewicht eingeben'); return; }
  const weights = LS.get('weights', {});
  weights[d] = w;
  LS.set('weights', weights);
  document.getElementById('weightInput').value = '';
  renderWeight();
  renderCycle();
}
function deleteWeight(d) {
  const weights = LS.get('weights', {});
  delete weights[d];
  LS.set('weights', weights);
  renderWeight();
  renderCycle();
}
function avg(arr) { return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null; }
function weekStart(date) {
  const d = new Date(date);
  const day = (d.getDay()+6)%7;
  d.setDate(d.getDate()-day);
  return d.toISOString().slice(0,10);
}
function renderWeight() {
  const weights = LS.get('weights', {});
  const dates = Object.keys(weights).sort();

  // Tägliche Tabelle inkl. Δ Vortag
  const fmtDelta = (d) => {
    if (d===null) return '<span class="muted">–</span>';
    const sign = d>0?'+':'';
    const cls = d>0?'delta-up':(d<0?'delta-down':'muted');
    return `<span class="${cls}">${sign}${d.toFixed(2)}</span>`;
  };
  document.getElementById('weightTable').innerHTML = dates.slice().reverse().map((d,idx,arr)=>{
    const prev = arr[idx+1]; // chronologisch früherer (in reversed-Liste der nächste)
    const delta = prev!==undefined ? (weights[d] - weights[prev]) : null;
    return `<tr>
      <td>${new Date(d).toLocaleDateString('de-DE')}</td>
      <td>${weights[d].toFixed(1)}</td>
      <td>${fmtDelta(delta)}</td>
      <td><button class="danger" onclick="deleteWeight('${d}')">×</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="4" class="muted">Keine Einträge</td></tr>';

  const byWeek = {};
  dates.forEach(d=>{
    const ws = weekStart(d);
    (byWeek[ws] = byWeek[ws] || []).push(weights[d]);
  });

  // Wochentabelle (neueste oben), Δ zur Vorwoche
  const weekKeys = Object.keys(byWeek).sort();
  const weekRows = weekKeys.slice().reverse().map((wk,idx,arr)=>{
    const a = avg(byWeek[wk]);
    const prevKey = arr[idx+1];
    const prevAvg = prevKey ? avg(byWeek[prevKey]) : null;
    const delta = prevAvg!==null ? (a - prevAvg) : null;
    const endDate = (()=>{ const d=new Date(wk); d.setDate(d.getDate()+6); return d.toISOString().slice(0,10); })();
    const label = `${new Date(wk).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})} – ${new Date(endDate).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}`;
    return `<tr>
      <td>${label}</td>
      <td>${a.toFixed(2)}</td>
      <td>${fmtDelta(delta)}</td>
      <td>${byWeek[wk].length}</td>
    </tr>`;
  }).join('');
  document.getElementById('weekTable').innerHTML = weekRows || '<tr><td colspan="4" class="muted">Keine Einträge</td></tr>';
  const thisWeekStart = weekStart(todayISO());
  const lastWeekStart = (()=>{ const d=new Date(thisWeekStart); d.setDate(d.getDate()-7); return d.toISOString().slice(0,10); })();
  const tAvg = byWeek[thisWeekStart] ? avg(byWeek[thisWeekStart]) : null;
  const lAvg = byWeek[lastWeekStart] ? avg(byWeek[lastWeekStart]) : null;
  document.getElementById('weekAvg').textContent = tAvg ? tAvg.toFixed(2) : '–';
  const deltaEl = document.getElementById('weekDelta');
  if (tAvg!==null && lAvg!==null) {
    const diff = tAvg - lAvg;
    deltaEl.textContent = `${diff>0?'+':''}${diff.toFixed(2)} kg`;
    deltaEl.className = 'big ' + (diff>0?'delta-up':'delta-down');
    deltaEl.style.fontSize = '24px';
  } else {
    deltaEl.textContent = '–'; deltaEl.className='big'; deltaEl.style.fontSize='24px';
  }

  const labels = dates.map(d=>new Date(d).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}));
  const data = dates.map(d=>weights[d]);
  const avgLine = dates.map(d=>avg(byWeek[weekStart(d)]));
  if (chart) chart.destroy();
  chart = new Chart(document.getElementById('weightChart'), {
    type:'line',
    data:{
      labels,
      datasets:[
        { label:'Gewicht', data, borderColor:'#4f9cff', backgroundColor:'rgba(79,156,255,.15)', tension:.3, pointRadius:3, fill:true },
        { label:'Wochenø', data: avgLine, borderColor:'#7ee787', borderDash:[6,4], pointRadius:0, fill:false }
      ]
    },
    options:{
      responsive:true,
      plugins:{ legend:{ labels:{ color:'#8a93a6' } } },
      scales:{
        x:{ ticks:{ color:'#8a93a6' }, grid:{ color:'#262c38' } },
        y:{ ticks:{ color:'#8a93a6' }, grid:{ color:'#262c38' } }
      }
    }
  });
}

// ============ CARDIO/SCHRITTE FIX ============
function saveGoals() {
  LS.set('goals', {
    steps:  parseInt(document.getElementById('stepsGoal').value)  || 0,
    cardio: parseInt(document.getElementById('cardioGoal').value) || 0,
    freq:   document.getElementById('cardioFreq').value.trim()    || ''
  });
  renderGoals();
}
function renderGoals() {
  const g = LS.get('goals', {steps:0, cardio:0, freq:''});
  document.getElementById('stepsGoal').value  = g.steps  || '';
  document.getElementById('cardioGoal').value = g.cardio || '';
  document.getElementById('cardioFreq').value = g.freq   || '';
  document.getElementById('stepsLbl').textContent  = g.steps  ? g.steps.toLocaleString('de-DE') : '–';
  document.getElementById('cardioLbl').textContent = g.cardio || '–';
  document.getElementById('freqLbl').textContent   = g.freq   || '–';
}

// ============ ERNÄHRUNGSPLAN ============
const MEAL_NAMES = ['Mahlzeit 1', 'Mahlzeit 2', 'Mahlzeit 3', 'Mahlzeit 4', 'Mahlzeit 5'];
function getMeals() {
  return LS.get('mealPlan', MEAL_NAMES.map(n=>({ name:n, foods:'' })));
}
function setMeals(m) { LS.set('mealPlan', m); }

function renderMeals() {
  const meals = getMeals();
  const c = document.getElementById('mealsContainer');
  c.innerHTML = meals.map((m,i)=>`
    <div class="meal-card">
      <div class="meal-head">
        <input style="background:transparent; border:none; padding:0; font-weight:700; font-size:14px;" value="${escapeHtml(m.name)}" onchange="updateMealName(${i}, this.value)"/>
      </div>
      <textarea id="mealFoods-${i}" placeholder="z.B. 150g Haferflocken, 250ml Milch, 1 Banane" oninput="updateMealFoods(${i}, this.value)">${escapeHtml(m.foods)}</textarea>
      <div class="meal-macros" id="mealMacros-${i}"></div>
    </div>
  `).join('');
  meals.forEach((_,i)=>updateMealMacrosUI(i));
  renderTotals();
}
function updateMealMacrosUI(i) {
  const meals = getMeals();
  const calc = calcMealMacros(meals[i].foods);
  const warn = calc.unknown.length
    ? `<span class="warn-tag">unbekannt: ${calc.unknown.map(escapeHtml).join(', ')}</span>` : '';
  const el = document.getElementById('mealMacros-'+i);
  if (el) el.innerHTML = `<b>${calc.kcal}</b> kcal · <b>${calc.protein}</b>g P · <b>${calc.carbs}</b>g KH · <b>${calc.fat}</b>g F ${warn}`;
}
function updateMealName(i, v) {
  const m = getMeals(); m[i].name = v; setMeals(m);
}
function updateMealFoods(i, v) {
  const m = getMeals(); m[i].foods = v; setMeals(m);
  updateMealMacrosUI(i);
  renderTotals();
}
function renderTotals() {
  const meals = getMeals();
  const sum = meals.reduce((a,m)=>{
    const c = calcMealMacros(m.foods);
    return { kcal:a.kcal+c.kcal, p:a.p+c.protein, c:a.c+c.carbs, f:a.f+c.fat };
  }, {kcal:0,p:0,c:0,f:0});
  document.getElementById('sumKcal').textContent = sum.kcal;
  document.getElementById('sumP').textContent    = sum.p;
  document.getElementById('sumC').textContent    = sum.c;
  document.getElementById('sumF').textContent    = sum.f;

  const g = LS.get('macroGoals', {});
  if (g.kcal) {
    document.getElementById('kcalRatio').textContent = `${sum.kcal} / ${g.kcal}`;
    document.getElementById('kcalBar').style.width = Math.min(100, sum.kcal/g.kcal*100)+'%';
  } else {
    document.getElementById('kcalRatio').textContent = `${sum.kcal} / –`;
    document.getElementById('kcalBar').style.width = '0%';
  }
}

function saveMacroGoals() {
  LS.set('macroGoals', {
    kcal: parseInt(document.getElementById('goalKcal').value)||0,
    protein: parseInt(document.getElementById('goalP').value)||0,
    carbs: parseInt(document.getElementById('goalC').value)||0,
    fat: parseInt(document.getElementById('goalF').value)||0
  });
  renderTotals();
}
function loadMacroGoals() {
  const g = LS.get('macroGoals', {});
  document.getElementById('goalKcal').value = g.kcal||'';
  document.getElementById('goalP').value = g.protein||'';
  document.getElementById('goalC').value = g.carbs||'';
  document.getElementById('goalF').value = g.fat||'';
}

function escapeHtml(s) { return (s||'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

function resetAll() {
  if (!confirm('Wirklich ALLE Daten löschen?')) return;
  ['cycle','cycleHistory','weights','goals','mealPlan','macroGoals','foodDB'].forEach(k=>localStorage.removeItem(k));
  location.reload();
}

// ============ INIT ============
renderCycle();
renderWeight();
renderGoals();
renderFoodTable();
renderMeals();
loadMacroGoals();

// ============ PWA ============
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
