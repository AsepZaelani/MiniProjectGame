  // ---- Background themes, cycle by level ----
  const THEMES = [
    { name: 'Nebula Awal', deep: '#12102A', mid: '#1E1B3F', star: '244,242,255', orbs: ['#B98CE0', '#FF6B6B', '#FFD166', '#8FD3FF'], env: 'nebula' },
    { name: 'Nebula Glasier', deep: '#0A1A2E', mid: '#123B57', star: '190,235,240', orbs: ['#4ECDC4', '#66D9EF', '#8FD3FF', '#9DE7FF'], env: 'ice' },
    { name: 'Nebula Ignis', deep: '#2A0E12', mid: '#4A1620', star: '255,205,190', orbs: ['#FF6B6B', '#FF9F6B', '#FFD166', '#FF8FB4'], env: 'fire' },
    { name: 'Nebula Void', deep: '#08070F', mid: '#171226', star: '210,190,255', orbs: ['#B98CE0', '#FF4D8D', '#66D9EF', '#8B87B8'], env: 'void' },
    { name: 'Nebula Kristal', deep: '#0B1A2E', mid: '#20264A', star: '215,245,255', orbs: ['#9DE7FF', '#C77DFF', '#F4F2FF', '#66D9EF'], env: 'crystal' }
  ];

  // ---- Planet / stage system: 5 dunia nebula, masing-masing 10 level (mini boss @5, boss @10) ----
  const PLANETS = [
    { id: 0, name: 'Nebula Awal', sector: '01', icon: '🌌', levels: [1,2,3,4,5,6,7,8,9,10], theme: 0,
      desc: 'Gerbang nebula ungu-merah muda tempat para penjaga memulai perjalanan. Tenang, namun drone dan tawon pengintai mulai bermunculan.',
      enemies: ['drone','wasp','tank'], boss: 0, miniBoss: 5, diffStars: 1,
      passive: { key: 'fireRate', label: 'Fire Rate +5%', value: 0.05 } },
    { id: 1, name: 'Nebula Glasier', sector: '02', icon: '❄️', levels: [11,12,13,14,15,16,17,18,19,20], theme: 1,
      desc: 'Kabut nebula membeku biru-cyan penuh kristal es melayang. Medan dingin dengan gerombolan cepat dan pemecah.',
      enemies: ['swarmer','splitter','crystal'], boss: 1, miniBoss: 6, diffStars: 2,
      passive: { key: 'defense', label: 'Defense +5%', value: 0.05 } },
    { id: 2, name: 'Nebula Ignis', sector: '03', icon: '🔥', levels: [21,22,23,24,25,26,27,28,29,30], theme: 2,
      desc: 'Awan nebula membara merah-jingga dengan meteor panas menyengat. Ranjau dan pengorbit mengintai di balik kabut bara.',
      enemies: ['orbiter','mine','charger'], boss: 2, miniBoss: 7, diffStars: 3,
      passive: { key: 'attack', label: 'Attack +5%', value: 0.05 } },
    { id: 3, name: 'Nebula Void', sector: '04', icon: '🌀', levels: [31,32,33,34,35,36,37,38,39,40], theme: 3,
      desc: 'Nebula gelap keunguan yang menyerap cahaya. Makhluk asam, penembak, dan hantu erratic mengintai dari bayangan void.',
      enemies: ['acid','shooter','phantom'], boss: 3, miniBoss: 8, diffStars: 4,
      passive: { key: 'maxHp', label: 'Max HP +5%', value: 0.05 } },
    { id: 4, name: 'Nebula Kristal', sector: '05', icon: '💎', levels: [41,42,43,44,45,46,47,48,49,50], theme: 4,
      desc: 'Sektor akhir perjalanan. Pecahan kristal cyan-ungu-putih bercahaya menyelimuti sektor ini — seluruh ancaman sebelumnya berkumpul di sini.',
      enemies: ['crystal','charger','phantom','voidling'], boss: 4, miniBoss: 9, diffStars: 5,
      passive: { key: 'crit', label: 'Critical Chance +5%', value: 0.05 } }
  ];
  let selectedStartLevel = 1;
  function getPlanetForLevel(lvl) {
    return PLANETS.find(p => p.levels.includes(lvl)) || PLANETS[0];
  }
  function diffStarsStr(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  // ---- LocalStorage progress: planet unlock discovery & enemy encyclopedia ----
  const LS_KEYS = { enemies: 'pn_seen_enemies_v1', planets: 'pn_discovered_planets_v1' };
  function lsLoadSet(key) { try { const raw = localStorage.getItem(key); return new Set(raw ? JSON.parse(raw) : []); } catch (e) { return new Set(); } }
  function lsSaveSet(key, set) { try { localStorage.setItem(key, JSON.stringify([...set])); } catch (e) {} }
  let seenEnemies = lsLoadSet(LS_KEYS.enemies);
  let discoveredPlanets = lsLoadSet(LS_KEYS.planets);
  discoveredPlanets.add(0); // Veyra selalu sudah "ditemukan" sejak awal permainan

  // ---- Big sci-fi banner queue (boss warning/phase2/defeated, planet intro/clear/unlock/discovery) ----
  let bbQueue = [], bbShowing = false;
  function queueBigBanner(opts) { bbQueue.push(opts); if (!bbShowing) showNextBigBanner(); }
  function showNextBigBanner() {
    if (bbQueue.length === 0) { bbShowing = false; return; }
    bbShowing = true;
    const o = bbQueue.shift();
    bigBanner.className = ''; void bigBanner.offsetWidth;
    bigBanner.classList.add(o.type || 'info');
    bbTag.textContent = o.tag || '';
    bbTitle.innerHTML = o.title || '';
    bbSub.innerHTML = o.sub || '';
    bigBanner.classList.add('show');
    if (o.shake) { bigBanner.classList.add('shake'); }
    const dur = o.duration || 1300;
    setTimeout(() => { bigBanner.classList.remove('show'); setTimeout(showNextBigBanner, 250); }, dur);
  }
  function queueEnemyIntroToast(name, desc) {
    enemyIntroToast.innerHTML = `NEW ENEMY<span class="ei-name">${name}</span><span class="ei-desc">${desc}</span>`;
    enemyIntroToast.style.opacity = '1';
    setTimeout(() => { enemyIntroToast.style.opacity = '0'; }, 1900);
  }
  const ENEMY_INTRO_DESC = {
    drone: 'Musuh dasar, terbang lurus ke bawah.', wasp: 'Bergerak zigzag dengan cepat.',
    tank: 'HP tebal, bergerak lambat tapi tangguh.', swarmer: 'Kecil dan sangat gesit, bergerombol.',
    splitter: 'Pecah menjadi dua saat dikalahkan.', crystal: 'Melayang pelan sambil berayun.',
    orbiter: 'Bergerak mendekat perlahan ke arahmu.', mine: 'Ranjau diam yang berbahaya jika didekati.',
    charger: 'Menerjang cepat ke arah posisimu.', acid: 'Meninggalkan jejak racun berbahaya.',
    shooter: 'Menembak dari kejauhan, waspada!', phantom: 'Gerakan cepat dan tak terduga.',
    voidling: 'Musuh kecil dengan gerakan cepat dari kegelapan void.'
  };

  // ---- Persistent (whole session) ----
  let wallet = 0, sessionHigh = 0;
  let totalKills = 0, maxLevelReached = 1, bossesDefeated = 0, maxComboSeen = 0, planetsCleared = 0;

