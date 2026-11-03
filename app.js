const $ = id => document.getElementById(id);

// Телефон мәзірі
const menuBtn = $('menuBtn');
if (menuBtn) menuBtn.addEventListener('click', () => {
  const opened = $('navLinks').classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(opened));
});

// Тіркелу және кіру формалары (деректер серверге жіберілмейді)
const registerForm = $('registerForm');
const loginForm = $('loginForm');
const message = $('formMessage');
if (registerForm) registerForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!registerForm.reportValidity()) return;
  if ($('password').value !== $('confirm').value) {
    message.textContent = 'Қате: құпия сөздер сәйкес келмейді.';
    message.className = 'form-message error';
    return;
  }
  message.textContent = 'Форма дұрыс толтырылды! Бұл — демо, аккаунт сақталмады.';
  message.className = 'form-message success';
  registerForm.reset();
});
if (loginForm) loginForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  message.textContent = 'Форма тексерілді. Нақты кіру PHP/MySQL кезеңінде қосылады.';
  message.className = 'form-message success';
});

// Карта және нысандар каталогы
if ($('places')) {
  const escapeHTML = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const featureText = item => [
    item.ramp ? '✓ Пандус' : '✕ Пандус',
    item.lift ? '✓ Лифт' : '✕ Лифт',
    item.parking ? '✓ Арнайы тұрақ' : '✕ Арнайы тұрақ'
  ];
  const search = $('search'), category = $('category'), feature = $('feature');
  let selectedId = null;

  function selectPlace(id) {
    const p = PLACES.find(place => place.id === id);
    if (!p) return;
    selectedId = id;
    $('detail').innerHTML = `<span class="eyebrow">Таңдалған нысан</span><h2>${p.icon} ${escapeHTML(p.name)}</h2><p>${escapeHTML(p.address)} · ${escapeHTML(p.category)}</p><div class="tags">${featureText(p).map(t => `<span>${t}</span>`).join('')}</div><p class="hint">Бұл — ойдан құрастырылған нысан. Пікірлер, таңдаулылар және нақты маршруттар келесі апталарда қосылады.</p>`;
    $('mapNote').textContent = `${p.icon} ${p.name} таңдалды`;
    document.querySelectorAll('[data-id]').forEach(el => el.classList.toggle('selected', Number(el.dataset.id) === id));
  }

  function draw() {
    const text = search.value.trim().toLocaleLowerCase('kk');
    const list = PLACES.filter(p =>
      p.name.toLocaleLowerCase('kk').includes(text) &&
      (category.value === 'all' || p.category === category.value) &&
      (feature.value === 'all' || p[feature.value])
    );
    $('resultCount').textContent = `${list.length} нысан`;
    $('places').innerHTML = list.length ? list.map(p => `
      <button type="button" class="place-card" data-id="${p.id}">
        <span class="place-icon">${p.icon}</span><span><strong>${escapeHTML(p.name)}</strong><small>${escapeHTML(p.category)} · ${escapeHTML(p.address)}</small><small>${p.ramp ? '♿ Пандус бар' : 'Пандус көрсетілмеген'}</small></span><span class="arrow">→</span>
      </button>`).join('') : '<p class="empty">Сәйкес нысан табылмады.</p>';
    $('mapPins').innerHTML = list.map(p => `<button type="button" class="map-pin" data-id="${p.id}" style="left:${p.x}%;top:${p.y}%" aria-label="${escapeHTML(p.name)}">${p.icon}</button>`).join('');
    document.querySelectorAll('[data-id]').forEach(button => button.addEventListener('click', () => selectPlace(Number(button.dataset.id))));
    if (selectedId && list.some(p => p.id === selectedId)) selectPlace(selectedId);
  }
  search.addEventListener('input', draw);
  category.addEventListener('change', draw);
  feature.addEventListener('change', draw);
  draw();
}
