
// demo users
const demoUsers = [{ username:'ramses', password:'faith123', displayName:'Ramses' },{ username:'jefry', password:'grace456', displayName:'Jefry' },{ username:'andy', password:'hope789', displayName:'Andy' }];
function findUser(u){ return demoUsers.find(x=>x.username===u); }
// login
if(document.getElementById('loginForm')){
  const form=document.getElementById('loginForm');
  form.addEventListener('submit', function(e){ e.preventDefault(); const u=form.username.value.trim(); const p=form.password.value.trim(); const user=findUser(u); if(user && user.password===p){ localStorage.setItem('church_logged_in', JSON.stringify({ username:user.username, displayName:user.displayName })); window.location.href='dashboard.html'; } else { alert('Invalid username or password.'); } });
}
// protect pages and common handlers
function requireSession(){ const s=JSON.parse(localStorage.getItem('church_logged_in')||'null'); if(!s){ alert('You must login to access the member portal.'); window.location.href='login.html'; } return s; }
if(document.getElementById('welcome')){
  const session=requireSession();
  document.getElementById('welcome').textContent = 'Welcome, ' + session.displayName + '!';
  const key = 'devotion_' + session.username;
  const saved = localStorage.getItem(key);
  if(saved) document.getElementById('personalDevotion').value = saved;
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){ logoutBtn.addEventListener('click', function(e){ e.preventDefault(); localStorage.removeItem('church_logged_in'); window.location.href='login.html'; }); }
  const saveBtn = document.getElementById('saveDevotion');
  if(saveBtn){ saveBtn.addEventListener('click', function(){ const text = document.getElementById('personalDevotion').value.trim(); localStorage.setItem(key, text); alert('Personal devotional saved locally in your browser.'); }); }
}
// member data handlers
if(document.getElementById('memberDataForm')){
  const session = requireSession();
  const key = 'member_' + session.username;
  const fields = ['fullName','email','phone','address','job','skills','businessName','insta','facebook','tiktok'];
  const saved = JSON.parse(localStorage.getItem(key) || '{}');
  fields.forEach(f => { if(saved[f]) document.getElementById(f).value = saved[f]; });
  document.getElementById('saveMemberData').addEventListener('click', ()=>{ const data = {}; fields.forEach(f=> data[f] = document.getElementById(f).value.trim()); localStorage.setItem(key, JSON.stringify(data)); alert('Data jemaat disimpan secara lokal.'); });
  document.getElementById('downloadMemberData').addEventListener('click', ()=>{ const data = JSON.parse(localStorage.getItem(key)||'{}'); let txt = 'Data Jemaat - ' + (data.fullName || session.displayName) + '\n\n'; for(const k of fields) txt += k + ': ' + (data[k]||'') + '\n'; const blob = new Blob([txt], {type:'text/plain'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = (session.username + '_data.txt'); a.click(); URL.revokeObjectURL(url); });
}
// prayer handlers
if(document.getElementById('prayerForm')){
  const session = requireSession();
  const pKey = 'prayers_' + session.username;
  function renderPrayers(){ const arr = JSON.parse(localStorage.getItem(pKey) || '[]'); const tbody = document.querySelector('#prayerTable tbody'); tbody.innerHTML = ''; arr.forEach((p, idx)=>{ const tr = document.createElement('tr'); tr.innerHTML = '<td>'+p.title+'</td><td>'+p.detail+'</td><td>'+p.status+'</td><td><button data-idx="'+idx+'" class="delPrayer">Hapus</button></td>'; tbody.appendChild(tr); }); document.querySelectorAll('.delPrayer').forEach(btn=> btn.addEventListener('click', (e)=>{ const i = parseInt(e.target.dataset.idx); const arr = JSON.parse(localStorage.getItem(pKey)||'[]'); arr.splice(i,1); localStorage.setItem(pKey, JSON.stringify(arr)); renderPrayers(); })); }
  document.getElementById('addPrayer').addEventListener('click', ()=>{ const title = document.getElementById('prayerTitle').value.trim(); const detail = document.getElementById('prayerDetail').value.trim(); const status = document.getElementById('prayerStatus').value; if(!title || !detail){ alert('Mohon isi judul dan detail doa.'); return; } const arr = JSON.parse(localStorage.getItem(pKey) || '[]'); arr.push({title, detail, status}); localStorage.setItem(pKey, JSON.stringify(arr)); renderPrayers(); document.getElementById('prayerForm').reset(); });
  renderPrayers();
}
// job handlers
if(document.getElementById('jobForm')){
  const session = requireSession();
  const jKey = 'jobs_' + session.username;
  function renderJobs(){ const arr = JSON.parse(localStorage.getItem(jKey) || '[]'); const list = document.getElementById('jobList'); list.innerHTML=''; arr.forEach((j, idx)=>{ const li = document.createElement('li'); li.innerHTML = '<strong>'+j.title+'</strong><div>'+j.desc+'</div><div class="muted">Kontak: '+(j.contact||'-')+'</div><button data-idx="'+idx+'" class="delJob">Hapus</button>'; list.appendChild(li); }); document.querySelectorAll('.delJob').forEach(btn=> btn.addEventListener('click', (e)=>{ const i = parseInt(e.target.dataset.idx); const arr = JSON.parse(localStorage.getItem(jKey)||'[]'); arr.splice(i,1); localStorage.setItem(jKey, JSON.stringify(arr)); renderJobs(); })); }
  document.getElementById('addJob').addEventListener('click', ()=>{ const title = document.getElementById('jobTitle').value.trim(); const desc = document.getElementById('jobDesc').value.trim(); const contact = document.getElementById('jobContact').value.trim(); if(!title || !desc){ alert('Mohon isi judul dan deskripsi.'); return; } const arr = JSON.parse(localStorage.getItem(jKey) || '[]'); arr.push({title, desc, contact}); localStorage.setItem(jKey, JSON.stringify(arr)); renderJobs(); document.getElementById('jobForm').reset(); });
  renderJobs();
}
// login form (older style fallback)
if(document.getElementById('loginForm')){
  const f=document.getElementById('loginForm'); f.addEventListener('submit', function(e){ e.preventDefault(); const u=f.username.value.trim(); const p=f.password.value.trim(); const user=findUser(u); if(user && user.password===p){ localStorage.setItem('church_logged_in', JSON.stringify({ username:user.username, displayName:user.displayName })); window.location.href='dashboard.html'; } else alert('Invalid username or password.'); });
}
