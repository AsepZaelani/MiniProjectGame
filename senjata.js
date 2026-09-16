// ---- DUAL WEAPON SYSTEM & LEVELING ----
  const WEAPONS = [
    { id: 'blaster', visualColor:'#FFD166', name: 'Blaster Standar', owned: true, level: 1, maxLevel: 5, baseDesc: 'Peluru tunggal lurus konsisten.', cost: 0,
      upgradeCost: lvl => 40 * lvl, stats: lvl => ({ fireDelay: [14, 12, 10, 8, 6][lvl - 1], dmg: [1, 1, 2, 2, 3][lvl - 1] }),
      pattern: (p, s, sideOffset) => [{ x: p.x + sideOffset, y: p.y - 18, vx: 0, vy: -9, r: 4, dmg: s.dmg, pierce: false, weaponId:'blaster' }] },
    { id: 'twin', visualColor:'#66D9EF', name: 'Cannon Kembar', owned: false, level: 1, maxLevel: 5, baseDesc: 'Tembakan ganda cepat.', cost: 60,
      upgradeCost: lvl => 55 * lvl, stats: lvl => ({ fireDelay: [13, 11, 9, 7, 6][lvl - 1], dmg: [1, 1, 2, 2, 3][lvl - 1] }),
      pattern: (p, s, sideOffset) => [
        { x: p.x + sideOffset - 4, y: p.y - 12, vx: 0, vy: -9, r: 3.5, dmg: s.dmg, pierce: false, weaponId:'twin' },
        { x: p.x + sideOffset + 4, y: p.y - 12, vx: 0, vy: -9, r: 3.5, dmg: s.dmg, pierce: false, weaponId:'twin' }
      ] },
    { id: 'spread', visualColor:'#FF9F6B', name: 'Sebar Peluru', owned: false, level: 1, maxLevel: 5, baseDesc: 'Peluru menyebar membasmi kerumunan.', cost: 140,
      upgradeCost: lvl => 70 * lvl, stats: lvl => ({ fireDelay: [18, 16, 14, 12, 10][lvl - 1], dmg: [1,1,1,2,2][lvl - 1], count: [3, 3, 5, 5, 7][lvl - 1] }),
      pattern: (p, s, sideOffset) => { const arr = []; const n = s.count; const spreadAngle = 0.35;
        for (let i = 0; i < n; i++) { const t = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
          arr.push({ x: p.x + sideOffset, y: p.y - 18, vx: t * spreadAngle * 8 + (sideOffset > 0 ? 0.5 : -0.5), vy: -9, r: 3.3, dmg: s.dmg, pierce: false, weaponId:'spread' }); }
        return arr; } },
    { id: 'laser', visualColor:'#8FD3FF', name: 'Sinar Laser', owned: false, level: 1, maxLevel: 5, baseDesc: 'Tembus musuh secara murni.', cost: 220,
      upgradeCost: lvl => 90 * lvl, stats: lvl => ({ fireDelay: [21, 18, 14, 11, 9][lvl - 1], dmg: [2, 3, 4, 5, 6][lvl - 1] }),
      pattern: (p, s, sideOffset) => [{ x: p.x + sideOffset, y: p.y - 18, vx: 0, vy: -12, r: 5.5, dmg: s.dmg, pierce: true, kind: 'laser', weaponId:'laser' }] },
    { id: 'homing', visualColor:'#9DE7FF', name: 'Rudal Pelacak', owned: false, level: 1, maxLevel: 5, baseDesc: 'Peluru mengejar musuh secara otomatis.', cost: 180,
      upgradeCost: lvl => 85 * lvl, stats: lvl => ({ fireDelay: [30, 25, 19, 15, 12][lvl - 1], dmg: [2, 3, 4, 5, 6][lvl - 1], turn: 0.16 }),
      pattern: (p, s, sideOffset) => [{ x: p.x + sideOffset, y: p.y - 18, vx: sideOffset > 0 ? 2 : -2, vy: -6, r: 5, dmg: s.dmg, pierce: false, homing: true, turn: s.turn, kind: 'missile', weaponId:'homing' }] },
    { id: 'plasma', visualColor:'#C77DFF', name: 'Bola Plasma', owned: false, level: 1, maxLevel: 5, baseDesc: 'Bola energi besar area lambat.', cost: 170,
      upgradeCost: lvl => 80 * lvl, stats: lvl => ({ fireDelay: [26, 23, 19, 15, 12][lvl - 1], dmg: [2, 3, 3, 4, 5][lvl - 1] }),
      pattern: (p, s, sideOffset) => [{ x: p.x + sideOffset, y: p.y - 18, vx: 0, vy: -6.5, r: 9, dmg: s.dmg, pierce: true, kind: 'plasma', weaponId:'plasma' }] },
    { id: 'railgun', visualColor:'#FFFFFF', name: 'Meriam Rel', owned: false, level: 1, maxLevel: 5, baseDesc: 'Damage sangat mematikan.', cost: 260,
      upgradeCost: lvl => 110 * lvl, stats: lvl => ({ fireDelay: [44, 37, 30, 24, 19][lvl - 1], dmg: [6, 8, 11, 14, 18][lvl - 1] }),
      pattern: (p, s, sideOffset) => [{ x: p.x + sideOffset, y: p.y - 18, vx: 0, vy: -17, r: 6, dmg: s.dmg, pierce: true, kind: 'rail', weaponId:'railgun' }] },
    { id: 'burst', visualColor:'#FF8A8A', name: 'Burst Cannon', owned: false, level: 1, maxLevel: 5, baseDesc: 'Tembakan pendek dengan ledakan kecil.', cost: 230,
      upgradeCost: lvl => 95 * lvl, stats: lvl => ({ fireDelay: [24, 21, 17, 14, 12][lvl - 1], dmg: [2, 3, 4, 5, 6][lvl - 1], count: [1, 1, 2, 2, 3][lvl - 1] }),
      pattern: (p, st, sideOffset=0) => Array.from({length: st.count}, (_,i) => ({ x:p.x + sideOffset + (i-(st.count-1)/2)*7, y:p.y-18, vx:0, vy:-10, r:4, dmg:st.dmg, pierce:false, weaponId:'burst' })) },
    { id: 'ion', visualColor:'#8FFBFF', name: 'Ion Beam', owned: false, level: 1, maxLevel: 5, baseDesc: 'Sinar energi cepat dengan damage stabil.', cost: 300,
      upgradeCost: lvl => 120 * lvl, stats: lvl => ({ fireDelay: [22, 19, 15, 13, 10][lvl - 1], dmg: [3, 4, 5, 6, 7][lvl - 1] }),
      pattern: (p, st, sideOffset=0) => [{ x:p.x+sideOffset, y:p.y-20, vx:0, vy:-14, r:5, dmg:st.dmg, pierce:true, kind:'laser', weaponId:'ion' }] },
    { id: 'shatter', visualColor:'#9DE7FF', name: 'Shatter Cannon', owned: false, level: 1, maxLevel: 5, baseDesc: 'Satu peluru berat yang pecah menjadi pecahan kecil saat melaju.', cost: 340,
      upgradeCost: lvl => 125 * lvl, stats: lvl => ({ fireDelay: [33,30,26,22,19][lvl-1], dmg: [4,5,6,8,10][lvl-1] }),
      pattern: (p, st, sideOffset=0) => [{ x:p.x+sideOffset, y:p.y-20, vx:0, vy:-8.5, r:7, dmg:st.dmg, pierce:true, kind:'plasma', weaponId:'shatter' }] },
    { id: 'thunder', visualColor:'#FFF3A6', name: 'Thunder Shot', owned: false, level: 1, maxLevel: 5, baseDesc: 'Tembakan energi kuat dengan peluang serangan beruntun.', cost: 390,
      upgradeCost: lvl => 135 * lvl, stats: lvl => ({ fireDelay: [28,24,21,17,14][lvl-1], dmg: [3,4,5,6,8][lvl-1] }),
      pattern: (p, st, sideOffset=0) => [{ x:p.x+sideOffset, y:p.y-20, vx:0, vy:-13, r:5.5, dmg:st.dmg, pierce:false, kind:'laser', weaponId:'thunder' },
        { x:p.x+sideOffset+1, y:p.y-20, vx:0.15, vy:-12.5, r:3, dmg:Math.max(1, st.dmg-1), pierce:false, weaponId:'thunder' }] },
    { id: 'vortex', visualColor:'#C77DFF', name: 'Vortex Gun', owned: false, level: 1, maxLevel: 5, baseDesc: 'Peluru berputar dan menarik perhatian musuh.', cost: 420,
      upgradeCost: lvl => 145 * lvl, stats: lvl => ({ fireDelay: [30,27,23,20,16][lvl-1], dmg: [3,4,5,7,9][lvl-1], turn: 0.08 }),
      pattern: (p, st, sideOffset=0) => [{ x:p.x+sideOffset, y:p.y-20, vx:sideOffset>0?2:-2, vy:-7, r:8, dmg:st.dmg, pierce:true, homing:true, turn:st.turn, kind:'plasma', weaponId:'vortex' }] },
    { id: 'nova', visualColor:'#FF8FD0', name: 'Nova Launcher', owned: false, level: 1, maxLevel: 5, baseDesc: 'Ledakan energi frontal dengan banyak proyektil terbatas.', cost: 460,
      upgradeCost: lvl => 155 * lvl, stats: lvl => ({ fireDelay: [37,33,29,26,22][lvl-1], dmg: [2,3,4,5,6][lvl-1], count: [5,5,7,7,9][lvl-1] }),
      pattern: (p, st, sideOffset=0) => { const arr=[]; const n=st.count; for(let i=0;i<n;i++){ const a=-Math.PI/2+(i-(n-1)/2)*0.16; arr.push({x:p.x+sideOffset,y:p.y-18,vx:Math.cos(a)*8,vy:Math.sin(a)*8,r:4,dmg:st.dmg,pierce:false,kind:'plasma',weaponId:'nova'}); } return arr; } },
    { id: 'gravity', visualColor:'#B98CE0', name: 'Gravity Lance', owned: false, level: 1, maxLevel: 5, baseDesc: 'Tombak energi lambat dengan damage tinggi dan tembus.', cost: 520,
      upgradeCost: lvl => 170 * lvl, stats: lvl => ({ fireDelay: [48,42,36,30,24][lvl-1], dmg: [9,12,15,19,24][lvl-1] }),
      pattern: (p, st, sideOffset=0) => [{ x:p.x+sideOffset, y:p.y-22, vx:0, vy:-10, r:9, dmg:st.dmg, pierce:true, kind:'rail', weaponId:'gravity' }] }
  ];

  // Semua senjata tetap tersedia di SHOP. Batas 5 hanya berlaku untuk LOADOUT yang dipakai saat bermain.
  const MAX_EQUIPPED_WEAPONS = 5;

  // ===== ROCKET SYSTEM =====
  // Roket terpisah dari laser, dibeli di Armory lalu diganti dengan tombol Y.
  const ROCKETS = [
    {id:'standardRocket',name:'Rocket Standard',cost:0,owned:true,damage:12,count:1,speed:8,cooldown:24,desc:'Roket standar dengan damage seimbang.',kind:'missile'},
    {id:'heavyRocket',name:'Heavy Rocket',cost:90,owned:false,damage:24,count:1,speed:6,cooldown:32,desc:'Roket berat dengan ledakan lebih kuat.',kind:'heavyMissile'},
    {id:'clusterRocket',name:'Cluster Rocket',cost:170,owned:false,damage:9,count:3,speed:7,cooldown:38,desc:'Satu peluncuran memecah menjadi beberapa proyektil.',kind:'clusterMissile'},
    {id:'homingRocket',name:'Homing Rocket',cost:260,owned:false,damage:20,count:1,speed:5.5,cooldown:34,desc:'Roket yang mengejar target terdekat.',kind:'homingMissile',homing:true},
    {id:'plasmaRocket',name:'Plasma Rocket',cost:380,owned:false,damage:34,count:1,speed:7,cooldown:45,desc:'Roket plasma mahal dengan damage sangat tinggi.',kind:'plasmaMissile'}
  ];
  let equippedWeaponId = 'blaster';
  let equippedWeaponIds = []; // LOADOUT: maksimal 5 senjata yang bisa dipakai/switch saat bermain.
  let equippedWeaponSlot = 0;
  let equippedRocketId = 'standardRocket';
  let equippedLeftId = null; // legacy
  let equippedRightId = null; // legacy
  let weaponHeld = false, rocketCooldown = 0, weaponShotTimer = 0, rocketAmmo = 12, maxRocketAmmo = 12, gunAlternateSide = -1;
  // Energi hanya pulih saat pemain berhenti menembak. Jika energi habis, regen langsung aktif.
  let energyRegenLock = 0;
  function normalizeWeaponLoadout(){
    const ownedIds = new Set(getOwnedWeapons().map(w=>w.id));
    let list = Array.isArray(equippedWeaponIds) ? equippedWeaponIds : [];
    list = list.filter((id,i,a)=>id && a.indexOf(id)===i && ownedIds.has(id)).slice(0,MAX_EQUIPPED_WEAPONS);
    if(!list.length){
      if(equippedWeaponId && ownedIds.has(equippedWeaponId)) list=[equippedWeaponId];
      else list=['blaster'];
    }
    equippedWeaponIds = list;
    if(equippedWeaponSlot<0 || equippedWeaponSlot>=equippedWeaponIds.length) equippedWeaponSlot=0;
    equippedWeaponId = equippedWeaponIds[equippedWeaponSlot] || 'blaster';
  }
  function isWeaponEquipped(id){ return equippedWeaponIds.includes(id); }
  function equipWeaponToLoadout(id){
    const w=getWeapon(id); if(!w || !w.owned) return false;
    const existing=equippedWeaponIds.indexOf(id);
    if(existing>=0){ equippedWeaponSlot=existing; equippedWeaponId=id; return true; }
    if(equippedWeaponIds.length>=MAX_EQUIPPED_WEAPONS){ sfx.fail(); notify('LOADOUT SENJATA PENUH · MAKS 5'); return false; }
    equippedWeaponIds.push(id);
    equippedWeaponSlot=equippedWeaponIds.length-1;
    equippedWeaponId=id;
    return true;
  }
  function removeWeaponFromLoadout(id){
    const idx=equippedWeaponIds.indexOf(id); if(idx<0) return;
    equippedWeaponIds.splice(idx,1);
    if(!equippedWeaponIds.length) equippedWeaponIds=['blaster'];
    if(equippedWeaponSlot>=equippedWeaponIds.length) equippedWeaponSlot=equippedWeaponIds.length-1;
    if(idx<equippedWeaponSlot) equippedWeaponSlot--;
    equippedWeaponId=equippedWeaponIds[equippedWeaponSlot] || 'blaster';
  }
  // Level upgrade JUMLAH roket (amunisi) yang bisa dibawa per nyawa/run — dibeli terpisah dari tipe roket.
  const ROCKET_CAPACITY_MAX = 10, ROCKET_CAPACITY_STEP = 2, ROCKET_CAPACITY_BASE_COST = 60;
  let rocketAmmoLevel = 0;
  function rocketCapacityFor(lvl){ return 12 + lvl * ROCKET_CAPACITY_STEP; }
  function rocketCapacityCost(lvl){ return ROCKET_CAPACITY_BASE_COST * (lvl + 1); }
  let energy = 100, maxEnergy = 100;
  function getWeapon(id) { return WEAPONS.find(w => w.id === id); }
  function getRocket(id) { return ROCKETS.find(r => r.id === id); }
  function getOwnedWeapons(){ return WEAPONS.filter(w=>w.owned); }
  function getOwnedRockets(){ return ROCKETS.filter(r=>r.owned); }
  function getShipEnergyMax(ship){ return Math.round(100 + Math.min(120, ship.cost * 0.16) + (ship.level-1)*18); }
  // Blaster (senjata awal, cost 0) sengaja dibuat sangat hemat energi supaya cocok dipakai
  // bersama Interceptor (pesawat awal) tanpa cepat kehabisan energi. Senjata dengan cost toko
  // lebih tinggi menyerap energi jauh lebih banyak per tembakan, sehingga butuh pesawat dengan
  // energi maksimum lebih besar (ship yang lebih mahal/level tinggi) agar bisa dipakai secara efektif.
  function weaponEnergyCost(weapon){ return Math.max(3, Math.round(3 + weapon.cost/40 + weapon.level*0.6)); }
  function updateCombatHud(){
    if(!energyFill) return;
    const ep=maxEnergy>0?Math.max(0,Math.min(100,energy/maxEnergy*100)):0;
    energyFill.style.height=ep+'%';
    const sh=maxShield>0?Math.max(0,Math.min(100,playerShield/maxShield*100)):0;
    armorFill.style.height=sh+'%';
    const w=getWeapon(equippedWeaponId); const r=getRocket(equippedRocketId);
    combatWeaponName.textContent=w?w.name.toUpperCase():'NO LASER';
    if(combatWeaponIcon) combatWeaponIcon.innerHTML = w ? weaponIconSVG(w) : '🔫';
    combatRocketName.textContent=r?r.name.toUpperCase():'NO ROCKET';
    if(combatRocketIcon) combatRocketIcon.innerHTML = r ? rocketIconSVG(r) : '🚀';
    combatRocketCount.textContent=rocketAmmo+'/'+maxRocketAmmo;
    combatRocketCount.classList.toggle('warn',rocketAmmo<=3);
  }
  function getWeapon(id) { return WEAPONS.find(w => w.id === id); }