  // ---- SHIPS WITH INDIVIDUAL LEVELS & UNIQUE SPECIAL ATTACKS ----
  const SHIPS = [
    { id: 'interceptor', name: 'Interceptor', cost: 0, color: '#4ECDC4', shape: 'sleek', owned: true, level: 1, maxLevel: 5,
      basicDesc: 'Serangan Dasar: Twin Vector Shot. Dua peluru cepat menyilang dari tengah badan, rate tembak tinggi damage ringan.',
      desc: 'Cepat & lincah.', upgradeCost: lvl => 55 * lvl,
      statsAt: lvl => ({ speedMult: 1.22 + (lvl - 1) * 0.05, fireRateMult: 1.08 + (lvl - 1) * 0.04, bonusLives: 0, dmgBonus: 0 }),
      basicFireDelay: lvl => Math.max(8, 15 - lvl),
      basicAttack: (p, lvl) => { const count = Math.min(3, lvl); const dmg = 1 + Math.floor((lvl - 1) / 2); return Array.from({length: count}, (_,i) => ({ x:p.x + (i-(count-1)/2)*8, y:p.y-18, vx:(i-(count-1)/2)*0.8, vy:-9.5, r:3.5, dmg, pierce:false })); },
    },
    { id: 'cruiser', name: 'Cruiser', cost: 90, color: '#FF5C5C', shape: 'standard', owned: false, level: 1, maxLevel: 5,
      basicDesc: 'Serangan Dasar: Cannon Inti. Tembakan tunggal seimbang lurus dari tengah badan pesawat.',
      desc: 'Seimbang untuk segala situasi.', upgradeCost: lvl => 60 * lvl,
      statsAt: lvl => ({ speedMult: 1.0 + (lvl - 1) * 0.04, fireRateMult: 1.0 + (lvl - 1) * 0.06, bonusLives: lvl >= 3 ? 1 : 0, dmgBonus: 0 }),
      basicFireDelay: lvl => Math.max(10, 17 - lvl),
      basicAttack: (p, lvl) => { const count = lvl >= 5 ? 3 : lvl >= 3 ? 2 : 1; const dmg = 2 + Math.floor((lvl - 1) / 2); return Array.from({length: count}, (_,i) => ({ x:p.x + (i-(count-1)/2)*9, y:p.y-20, vx:0, vy:-9.5, r:4.5, dmg, pierce:false })); },
    },
    { id: 'fortress', name: 'Fortress', cost: 150, color: '#FFD166', shape: 'bulky', owned: false, level: 1, maxLevel: 5,
      basicDesc: 'Serangan Dasar: Plasma Berat. Bola energi besar & lambat dari tengah badan, damage tinggi dan menembus musuh.',
      desc: 'Lambat tapi sangat tangguh.', upgradeCost: lvl => 75 * lvl,
      statsAt: lvl => ({ speedMult: 0.78 + (lvl - 1) * 0.04, fireRateMult: 0.95 + (lvl - 1) * 0.04, bonusLives: 1 + (lvl >= 3 ? 1 : 0), dmgBonus: 0 }),
      basicFireDelay: lvl => Math.max(18, 28 - lvl * 2),
      basicAttack: (p, lvl) => { const count = lvl >= 4 ? 2 : 1; const dmg = 4 + lvl; return Array.from({length: count}, (_,i) => ({ x:p.x + (i-(count-1)/2)*12, y:p.y-20, vx:0, vy:-6, r:9, dmg, pierce:true, kind:'plasma' })); },
    },
    { id: 'striker', name: 'Striker', cost: 200, color: '#B98CE0', shape: 'arrow', owned: false, level: 1, maxLevel: 5,
      basicDesc: 'Serangan Dasar: Focus Rail. Peluru presisi tipis dari tengah badan, damage besar dan menembus musuh.',
      desc: 'Damage tinggi serang lurus.', upgradeCost: lvl => 85 * lvl,
      statsAt: lvl => ({ speedMult: 1.05 + (lvl - 1) * 0.04, fireRateMult: 1.0 + (lvl - 1) * 0.04, bonusLives: 0, dmgBonus: lvl }),
      basicFireDelay: lvl => Math.max(20, 30 - lvl * 2),
      basicAttack: (p, lvl) => { const count = lvl >= 4 ? 2 : 1; const dmg = 5 + lvl; return Array.from({length: count}, (_,i) => ({ x:p.x + (i-(count-1)/2)*10, y:p.y-22, vx:0, vy:-13, r:5, dmg, pierce:true, kind:'rail' })); },
    },
    { id: 'phantom', name: 'Phantom', cost: 280, color: '#FF4DCE', shape: 'standard', owned: false, level: 1, maxLevel: 5,
      basicDesc: 'Serangan Dasar: Phantom Bolt. Peluru cepat dengan damage sedang.',
      desc: 'Sangat cepat dan gesit.', upgradeCost: lvl => 95 * lvl,
      statsAt: lvl => ({ speedMult: 1.15 + (lvl - 1) * 0.05, fireRateMult: 1.05 + (lvl - 1) * 0.05, bonusLives: lvl >= 4 ? 1 : 0, dmgBonus: 1 }),
      basicFireDelay: lvl => Math.max(12, 20 - lvl * 2),
      basicAttack: (p, lvl) => { const count = lvl >= 5 ? 3 : lvl >= 3 ? 2 : 1; const dmg = 3 + Math.floor(lvl / 2); return Array.from({length: count}, (_,i) => ({ x:p.x + (i-(count-1)/2)*8, y:p.y-19, vx:(i-(count-1)/2)*0.5, vy:-12, r:4, dmg, pierce:false })); },
    },
    { id: 'titan', name: 'Titan', cost: 360, color: '#6BFF95', shape: 'bulky', owned: false, level: 1, maxLevel: 5,
      basicDesc: 'Serangan Dasar: Heavy Core. Peluru besar dengan damage tinggi.',
      desc: 'Kuat, tahan benturan, tapi lebih lambat.', upgradeCost: lvl => 105 * lvl,
      statsAt: lvl => ({ speedMult: 0.72 + (lvl - 1) * 0.045, fireRateMult: 0.92 + (lvl - 1) * 0.04, bonusLives: 2 + (lvl >= 4 ? 1 : 0), dmgBonus: 2 }),
      basicFireDelay: lvl => Math.max(20, 31 - lvl * 2),
      basicAttack: (p, lvl) => { const count = lvl >= 5 ? 2 : 1; const dmg = 7 + lvl * 2; return Array.from({length: count}, (_,i) => ({ x:p.x + (i-(count-1)/2)*13, y:p.y-20, vx:0, vy:-7, r:10, dmg, pierce:true, kind:'plasma' })); },
    },
  ];
  let equippedShipId = 'interceptor';
  function getShip(id) { return SHIPS.find(s => s.id === id); }

  // ---- Stat bar Hangar: dihitung dari data asli ship (statsAt & basicAttack), bukan angka rekaan ----
  const SHIP_STAT_REF = { atk: 40, spdMin: 0.65, spdMax: 1.5, def: 6.5 };
  function computeShipStatBars(ship) {
    const lvl = ship.level;
    const s = ship.statsAt(lvl);
    let atkRaw = 0;
    try {
      const sample = ship.basicAttack({ x: 0, y: 0 }, lvl) || [];
      atkRaw = sample.reduce((sum, b) => sum + (b.dmg || 0), 0);
    } catch (e) { atkRaw = 5; }
    atkRaw += (s.dmgBonus || 0) * 3;
    const defRaw = 1 + (s.bonusLives || 0) * 1.5 + (1 / s.speedMult) * 0.5;
    const pct = v => Math.max(6, Math.min(100, Math.round(v)));
    return {
      attack: pct(atkRaw / SHIP_STAT_REF.atk * 100),
      speed: pct((s.speedMult - SHIP_STAT_REF.spdMin) / (SHIP_STAT_REF.spdMax - SHIP_STAT_REF.spdMin) * 100),
      defense: pct(defRaw / SHIP_STAT_REF.def * 100)
    };
  }


