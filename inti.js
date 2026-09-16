  const canvas = document.getElementById('game');
  let ctx = canvas.getContext('2d');
  const hud = document.getElementById('hud');
  const overlay = document.getElementById('overlay');
  const menuPanel = document.getElementById('menuPanel');
  const shopPanel = document.getElementById('shopPanel');
  const rocketList = document.getElementById('rocketList');
  const rocketTab = document.getElementById('rocketTab');
  const astroCombatHud = document.getElementById('astroCombatHud');
  const energyMeter = document.getElementById('energyMeter');
  const energyFill = document.getElementById('energyFill');
  const armorMeter = document.getElementById('armorMeter');
  const armorFill = document.getElementById('armorFill');
  const rapidBuffBadge = document.getElementById('rapidBuffBadge');
  const rapidBuffFill = document.getElementById('rapidBuffFill');
  const shieldBuffBadge = document.getElementById('shieldBuffBadge');
  const shieldBuffFill = document.getElementById('shieldBuffFill');
  function updateBuffBadges(){
    if (rapidFireTimer > 0) {
      rapidBuffBadge.style.display = 'flex';
      rapidBuffFill.style.width = Math.max(0, Math.min(100, rapidFireTimer / RAPID_FIRE_MAX * 100)) + '%';
    } else { rapidBuffBadge.style.display = 'none'; }
    if (shieldTimer > 0) {
      shieldBuffBadge.style.display = 'flex';
      shieldBuffFill.style.width = Math.max(0, Math.min(100, shieldTimer / SHIELD_TIMER_MAX * 100)) + '%';
    } else { shieldBuffBadge.style.display = 'none'; }
  }
  const combatWeaponName = document.getElementById('combatWeaponName');
  const combatWeaponIcon = document.getElementById('combatWeaponIcon');
  const combatRocketName = document.getElementById('combatRocketName');
  const combatRocketCount = document.getElementById('combatRocketCount');
  const combatRocketIcon = document.getElementById('combatRocketIcon');
  const customizePanel = document.getElementById('customizePanel');
  const missionPanel = document.getElementById('missionPanel');
  const pauseBtn = document.getElementById('pauseBtn');
  const pausePanel = document.getElementById('pausePanel');
  const resumeBtn = document.getElementById('resumeBtn');
  const exitGameBtn = document.getElementById('exitGameBtn');
  const startBtn = document.getElementById('startBtn');
  const shopBtn = document.getElementById('shopBtn');
  const customizeBtn = document.getElementById('customizeBtn');
  const missionBtn = document.getElementById('missionBtn');
  const backBtn = document.getElementById('backBtn');
  const customizeBackBtn = document.getElementById('customizeBackBtn');
  const missionBackBtn = document.getElementById('missionBackBtn');
  const hangarShipPreview = document.getElementById('hangarShipPreview');
  const shipPrevBtn = document.getElementById('shipPrevBtn');
  const shipNextBtn = document.getElementById('shipNextBtn');
  const slotLeftBtn = document.getElementById('slotLeftBtn');
  const slotRightBtn = document.getElementById('slotRightBtn');
  const slotLeftIcon = document.getElementById('slotLeftIcon');
  const slotRightIcon = document.getElementById('slotRightIcon');
  const hangarShipName = document.getElementById('hangarShipName');
  const hangarShipDots = document.getElementById('hangarShipDots');
  const hangarShipDesc = document.getElementById('hangarShipDesc');
  const hangarShipBasic = document.getElementById('hangarShipBasic');
  const hangarShipTrait = document.getElementById('hangarShipTrait');
  const statAtkFill = document.getElementById('statAtkFill'), statAtkVal = document.getElementById('statAtkVal');
  const statSpdFill = document.getElementById('statSpdFill'), statSpdVal = document.getElementById('statSpdVal');
  const statDefFill = document.getElementById('statDefFill'), statDefVal = document.getElementById('statDefVal');
  const weaponPicker = document.getElementById('weaponPicker');
  const wpTitle = document.getElementById('wpTitle');
  const wpList = document.getElementById('wpList');
  const wpCloseBtn = document.getElementById('wpCloseBtn');
  const soundBtn = document.getElementById('soundBtn');
  const scoreVal = document.getElementById('scoreVal');
  const livesVal = document.getElementById('livesVal');
  const coinVal = document.getElementById('coinVal');
  const levelVal = document.getElementById('levelVal');
  const comboTag = document.getElementById('comboTag');
  const menuCoins = document.getElementById('menuCoins');
  const menuHigh = document.getElementById('menuHigh');
  const shopCoins = document.getElementById('shopCoins');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const settingsBackBtn = document.getElementById('settingsBackBtn');
  const pauseSettingsBtn = document.getElementById('pauseSettingsBtn');
  const pauseCustomizeBtn = document.getElementById('pauseCustomizeBtn');
  const helpBtn = document.getElementById('helpBtn');
  const helpModal = document.getElementById('helpModal');
  const helpClose = document.getElementById('helpClose');
  const quitBtn = document.getElementById('quitBtn');
  const masterVol = document.getElementById('masterVol');
  const sfxVol = document.getElementById('sfxVol');
  const masterVolVal = document.getElementById('masterVolVal');
  const sfxVolVal = document.getElementById('sfxVolVal');
  const musicVol = document.getElementById('musicVol');
  const musicVolVal = document.getElementById('musicVolVal');
  const muteAllBtn = document.getElementById('muteAllBtn');
  const moduleList = document.getElementById('moduleList');
  const droneList = document.getElementById('droneList');
  const itemDetailModal = document.getElementById('itemDetailModal');
  const detailClose = document.getElementById('detailClose');
  const detailPreview = document.getElementById('detailPreview');
  const detailContent = document.getElementById('detailContent');
  const detailActions = document.getElementById('detailActions');
  const miniNotify = document.getElementById('miniNotify');
  const loadoutTabs=document.getElementById('loadoutTabs'), loadoutLeftSlot=document.getElementById('loadoutLeftSlot'), loadoutRightSlot=document.getElementById('loadoutRightSlot');
  const moduleEquip1=document.getElementById('moduleEquip1'), moduleEquip2=document.getElementById('moduleEquip2'), hangarModulePicker=document.getElementById('hangarModulePicker'), hangarDronePicker=document.getElementById('hangarDronePicker');

  const statLine = document.getElementById('statLine');
  const weaponList = document.getElementById('weaponList');
  const shipList = document.getElementById('shipList');
  const missionList = document.getElementById('missionList');
  const levelBanner = document.getElementById('levelBanner');
  const achieveToast = document.getElementById('achieveToast');
  const bossBarWrap = document.getElementById('bossBarWrap');
  const bossBarFill = document.getElementById('bossBarFill');
  const bossLabel = document.getElementById('bossLabel');
  const diffRow = document.getElementById('diffRow');
  const levelSelect = document.getElementById('levelSelect');
  const levelSelectInfo = document.getElementById('levelSelectInfo');
  const mapPanel = document.getElementById('mapPanel');
  const mapPlanetTabs = document.getElementById('mapPlanetTabs');
  const mapGlow = document.getElementById('mapGlow');
  const mapSvg = document.getElementById('mapSvg');
  const mapNodes = document.getElementById('mapNodes');
  const mapInfo = document.getElementById('mapInfo');
  const mapPlayBtn = document.getElementById('mapPlayBtn');
  const mapBackBtn = document.getElementById('mapBackBtn');
  const hpWrap = document.getElementById('hpWrap');
  const hpFill = document.getElementById('hpFill');
  const hpLabel = document.getElementById('hpLabel');
  const waveTag = document.getElementById('waveTag');
  const waveTagText = document.getElementById('waveTagText');
  const waveEnemyCount = document.getElementById('waveEnemyCount');
  const waveBarFill = document.getElementById('waveBarFill');
  const planetTag = document.getElementById('planetTag');
  const killsVal = document.getElementById('killsVal');
  const bigBanner = document.getElementById('bigBanner');
  const bbTag = document.getElementById('bbTag');
  const bbTitle = document.getElementById('bbTitle');
  const bbSub = document.getElementById('bbSub');
  const enemyIntroToast = document.getElementById('enemyIntroToast');
  const screenFlash = document.getElementById('screenFlash');
  const gameOverPanel = document.getElementById('gameOverPanel');
  const gameOverStats = document.getElementById('gameOverStats');
  const gameOverMenuBtn = document.getElementById('gameOverMenuBtn');
  const retryBtn = document.getElementById('retryBtn');

  let W, H;
  function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 250));
  window.addEventListener('load', resize);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(resize); }
  setTimeout(resize, 300);

  // ---- Idle animated menu background (runs while not in a match) ----
  let menuStars = Array.from({ length: 80 }, () => ({ x: Math.random() * 480, y: Math.random() * 900, r: Math.random() * 1.6 + 0.3, s: Math.random() * 0.5 + 0.15 }));
  const menuPlanets = [
    { x: 0.16, y: 0.16, r: 42, color: '#4ECDC4', speedX: 0.0035, speedY: 0.0026, phase: 0 },
    { x: 0.84, y: 0.68, r: 58, color: '#FF6B6B', speedX: 0.0026, speedY: 0.0032, phase: 2.1 },
    { x: 0.62, y: 0.1, r: 24, color: '#FFD166', speedX: 0.005, speedY: 0.004, phase: 4.4 },
    { x: 0.22, y: 0.82, r: 34, color: '#B98CE0', speedX: 0.003, speedY: 0.0022, phase: 1.3 }
  ];
  let menuTick = 0;
  let bgMode = 'menu';

  // Dekorasi khusus ARENA GAMEPLAY — sengaja berbeda dari background pilih level.
  let battleDust = [];
  let battleStreaks = [];
  function initBattleBackground() {
    battleDust = Array.from({ length: 34 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.7 + 0.35, speed: Math.random() * 0.7 + 0.25,
      alpha: Math.random() * 0.35 + 0.12, phase: Math.random() * Math.PI * 2
    }));
    battleStreaks = Array.from({ length: 8 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      len: 18 + Math.random() * 48, speed: 2.2 + Math.random() * 2.5,
      alpha: 0.12 + Math.random() * 0.18
    }));
  }
  function clearGameplayCanvas() {
    // Bersihkan frame gameplay lama agar musuh, peluru, boss, dll. tidak pernah
    // ikut terlihat di belakang menu/map/high scores.
    try {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#08070f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    } catch (e) {}
  }

  function setBgMode(mode) {
    bgMode = mode;
    overlay.classList.toggle('ov-map', mode === 'map');
    if (mode !== 'battle') clearGameplayCanvas();
  }
  let hangarGridPhase = 0;
  function drawHangarBackground() {
    hangarGridPhase += 0.15;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0A0E1A'); grad.addColorStop(1, '#04050A');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    // Grid teknologi sangat halus, perspektif ringan agar tidak ramai.
    ctx.strokeStyle = 'rgba(78,205,196,0.06)'; ctx.lineWidth = 1;
    const spacing = 46;
    for (let x = -((hangarGridPhase * 0.2) % spacing); x < W; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Dua sumber cahaya lembut saja — cyan & magenta — tidak mengganggu pesawat.
    const g1 = ctx.createRadialGradient(W * 0.15, H * 0.85, 0, W * 0.15, H * 0.85, H * 0.5);
    g1.addColorStop(0, 'rgba(78,205,196,0.10)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(W * 0.85, H * 0.12, 0, W * 0.85, H * 0.12, H * 0.45);
    g2.addColorStop(0, 'rgba(255,77,141,0.08)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

    // Garis scan tipis yang bergerak pelan — sentuhan sci-fi HUD.
    const scanY = (hangarGridPhase * 1.1) % H;
    const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
    scanGrad.addColorStop(0, 'rgba(78,205,196,0)'); scanGrad.addColorStop(0.5, 'rgba(78,205,196,0.05)'); scanGrad.addColorStop(1, 'rgba(78,205,196,0)');
    ctx.fillStyle = scanGrad; ctx.fillRect(0, scanY - 40, W, 80);

    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
    vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
  }
  let shootingStar = null;
  let mapFog = Array.from({ length: 5 }, () => ({ x: Math.random(), y: Math.random(), r: 90 + Math.random() * 90, sp: 0.06 + Math.random() * 0.08, ph: Math.random() * Math.PI * 2 }));
  function currentMapTheme() {
    const planet = (typeof PLANETS !== 'undefined') ? PLANETS[selectedPlanetId] : null;
    const theme = planet && typeof THEMES !== 'undefined' ? THEMES[planet.theme] : null;
    return theme || { deep: '#0A1A2E', mid: '#123B57', star: '190,235,240' };
  }
  function menuBgLoop() {
    if (running) return;
    menuTick++;
    // Jangan pernah mempertahankan frame gameplay sebelumnya.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.restore();
    if (bgMode === 'hangar') { drawHangarBackground(); requestAnimationFrame(menuBgLoop); return; }
    const isMap = bgMode === 'map';
    const theme = isMap ? currentMapTheme() : null;
    const grad = ctx.createRadialGradient(W / 2, H * 0.22, 10, W / 2, H * 0.22, H * 1.1);
    if (isMap) { grad.addColorStop(0, theme.mid); grad.addColorStop(1, theme.deep); }
    else { grad.addColorStop(0, '#201c47'); grad.addColorStop(1, '#08070f'); }
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    // Kabut nebula lembut yang hanya tampil di layar pilih level, agar terasa berbeda dari menu utama.
    if (isMap) {
      ctx.globalCompositeOperation = 'lighter';
      mapFog.forEach((f, i) => {
        const fx = f.x * W + Math.sin(menuTick * f.sp + f.ph) * 26;
        const fy = f.y * H + Math.cos(menuTick * f.sp * 0.7 + f.ph) * 20;
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, f.r);
        fg.addColorStop(0, `rgba(${theme.star},0.10)`);
        fg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fg;
        ctx.beginPath(); ctx.arc(fx, fy, f.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
    }

    const palette = isMap ? (theme.orbs || ['#4ECDC4', '#66D9EF', '#8FD3FF', '#9DE7FF']) : null;
    menuPlanets.forEach((p, i) => {
      const px = p.x * W + Math.sin(menuTick * p.speedX + p.phase) * 16;
      const py = p.y * H + Math.cos(menuTick * p.speedY + p.phase) * 12;
      const color = palette ? palette[i % palette.length] : p.color;
      const g = ctx.createRadialGradient(px - p.r * 0.3, py - p.r * 0.3, p.r * 0.1, px, py, p.r);
      g.addColorStop(0, color + 'B0'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill();
    });

    menuStars.forEach(st => {
      st.y += st.s;
      if (st.y > H) { st.y = 0; st.x = Math.random() * W; }
      ctx.fillStyle = isMap ? `rgba(${theme.star},0.55)` : 'rgba(244,242,255,0.55)';
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
    });

    // occasional shooting star for extra life
    if (!shootingStar && Math.random() < 0.006) {
      shootingStar = { x: Math.random() * W * 0.6, y: Math.random() * H * 0.3, vx: 5 + Math.random() * 3, vy: 2.5 + Math.random() * 1.5, life: 40 };
    }
    if (shootingStar) {
      const s = shootingStar;
      const grad2 = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 6, s.y - s.vy * 6);
      grad2.addColorStop(0, 'rgba(255,255,255,0.9)'); grad2.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad2; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 6, s.y - s.vy * 6); ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.life--;
      if (s.life <= 0 || s.x > W + 20 || s.y > H + 20) shootingStar = null;
    }

    // soft vignette for atmosphere
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
    vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(menuBgLoop);
  }

  const COLORS = { coral: '#FF6B6B', cyan: '#4ECDC4', amber: '#FFD166', purple: '#B98CE0', magenta: '#FF4D8D', white: '#F4F2FF' };
  const MAX_LIVES = 5;
  const LEVEL_ENEMY_BASE = 22;
  function enemyTargetForLevel(lvl) { return Math.round(LEVEL_ENEMY_BASE + lvl * 3.6); }
  const BASE_WAVE_ENEMIES = 12;
  const INVULN_FRAMES = 40; // ~0.66s at 60fps: brief invincibility after being hit
  const ENEMY_BULLET_CAP = 140; // batasi jumlah projectile musuh aktif demi performa di HP
  const METEOR_CAP = 5; // hazard lingkungan: cukup terasa, tetapi tidak memenuhi layar

