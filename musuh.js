  // ---- Enemy type definitions ----
  const ENEMY_TYPES = {
    drone: { color: COLORS.cyan, hp: 1, coin: 1, baseSpeed: 1.6, r: [14, 24], spikes: 6, shape: 'spike',
      move: e => { e.y += e.speed; }, unlockLevel: 1,
      attackType: 'straight', pattern: 'aimed', attackDamageBase: 5, attackCooldownBase: 100, projectileSpeedBase: 4.6, projectileR: 4 },
    wasp: { color: COLORS.coral, hp: 1, coin: 2, baseSpeed: 2.0, r: [11, 16], spikes: 6, shape: 'diamond',
      move: e => { e.y += e.speed; e.x += Math.sin(e.y * 0.05 + e.seed) * 2.2; }, unlockLevel: 3,
      attackType: 'fast-shot', pattern: 'aimed', attackDamageBase: 6, attackCooldownBase: 130, projectileSpeedBase: 6.4, projectileR: 3.5 },
    tank: { color: COLORS.amber, hp: 4, coin: 5, baseSpeed: 0.9, r: [22, 28], spikes: 8, shape: 'tank',
      move: e => { e.y += e.speed; }, unlockLevel: 6,
      attackType: 'heavy-shot', pattern: 'aimed', attackDamageBase: 14, attackCooldownBase: 165, projectileSpeedBase: 3.4, projectileR: 7, telegraphFrames: 16 },
    swarmer: { color: COLORS.purple, hp: 1, coin: 1, baseSpeed: 2.6, r: [8, 11], spikes: 5, shape: 'star',
      move: e => { e.y += e.speed; e.x += Math.cos(e.y * 0.08 + e.seed) * 1.4; }, unlockLevel: 11,
      attackType: 'pressure', pattern: 'aimed', attackDamageBase: 2.5, attackCooldownBase: 70, projectileSpeedBase: 4.8, projectileR: 2.6 },
    splitter: { color: '#7FE0A8', hp: 2, coin: 2, baseSpeed: 1.7, r: [16, 20], spikes: 6, shape: 'hex',
      move: e => { e.y += e.speed; }, unlockLevel: 14, splits: true,
      attackType: 'straight', pattern: 'straight', attackDamageBase: 4, attackCooldownBase: 115, projectileSpeedBase: 4.4, projectileR: 3.6 },
    crystal: { color: '#9DE7FF', hp: 3, coin: 4, baseSpeed: 1.25, r: [14, 19], spikes: 4, shape: 'crystal',
      move: e => { e.y += e.speed; e.x += Math.sin(e.y * 0.035 + e.seed) * 1.1; }, unlockLevel: 17,
      attackType: 'crystal-shard', pattern: 'aimed', attackDamageBase: 8, attackCooldownBase: 140, projectileSpeedBase: 4.2, projectileR: 5.5, telegraphFrames: 20 },
    orbiter: { color: '#FF9F6B', hp: 2, coin: 3, baseSpeed: 1.1, r: [12, 15], spikes: 7, shape: 'orb',
      move: e => { e.y += e.speed; if (e.y > 70) e.x += (e.targetX - e.x) * 0.03; }, unlockLevel: 21,
      attackType: 'orbit-bolt', pattern: 'orbit', attackDamageBase: 6, attackCooldownBase: 125, projectileSpeedBase: 3.6, projectileR: 4.4 },
    mine: { color: '#FFB347', hp: 3, coin: 4, baseSpeed: 1.0, r: [14, 18], spikes: 12, shape: 'mine',
      move: e => { e.y += e.speed; }, unlockLevel: 24,
      attackType: 'area', pattern: 'area', attackDamageBase: 16, attackRange: 92, blastRadius: 78, telegraphFrames: 38 },
    charger: { color: '#FF5C5C', hp: 2, coin: 4, baseSpeed: 1.5, r: [13, 18], spikes: 3, shape: 'arrow',
      move: e => { e.y += e.speed; if (e.y > 110) e.x += (e.targetX - e.x) * 0.022; }, unlockLevel: 27,
      attackType: 'charge', pattern: 'charge', attackDamageBase: 12, attackCooldownBase: 150, projectileSpeedBase: 8.4, telegraphFrames: 28 },
    acid: { color: '#8BE28B', hp: 2, coin: 3, baseSpeed: 1.35, r: [15, 20], spikes: 7, shape: 'blob',
      move: e => { e.y += e.speed; e.x += Math.sin(e.y * 0.045 + e.seed) * 1.8; }, unlockLevel: 31,
      attackType: 'acid-shot', pattern: 'aimed', attackDamageBase: 8, attackCooldownBase: 120, projectileSpeedBase: 3.2, projectileR: 5 },
    shooter: { color: '#66D9EF', hp: 3, coin: 5, baseSpeed: 0.85, r: [17, 21], spikes: 8, shape: 'shooter',
      move: e => { e.y += e.speed; }, unlockLevel: 34, shooter: true,
      attackType: 'ranged-double', pattern: 'double', attackDamageBase: 7, attackCooldownBase: 105, projectileSpeedBase: 5, projectileR: 4 },
    phantom: { color: '#D8A7FF', hp: 2, coin: 4, baseSpeed: 1.75, r: [12, 17], spikes: 6, shape: 'ghost',
      move: e => { e.y += e.speed; e.x += Math.sin(e.y * 0.07 + e.seed) * 2.5; }, unlockLevel: 37,
      attackType: 'erratic', pattern: 'aimed-jitter', attackDamageBase: 7, attackCooldownBase: 100, projectileSpeedBase: 5.2, projectileR: 4 },
    voidling: { color: '#C77DFF', hp: 5, coin: 7, baseSpeed: 1.15, r: [19, 24], spikes: 10, shape: 'void',
      move: e => { e.y += e.speed; e.x += Math.sin(e.y * 0.025 + e.seed) * 2.0; }, unlockLevel: 41,
      attackType: 'void-spread', pattern: 'spread', attackDamageBase: 9, attackCooldownBase: 150, projectileSpeedBase: 4.4, projectileR: 4.6 }
  };
  const ENEMY_NAMES = {
    drone: 'Drone Nebula', wasp: 'Tawon Zigzag', tank: 'Tank Berat',
    swarmer: 'Gerombolan Cepat', splitter: 'Pemecah Kristal', crystal: 'Kristal Es',
    orbiter: 'Pengorbit Bara', mine: 'Ranjau Api', charger: 'Penyerbu Merah',
    acid: 'Lendir Asam', shooter: 'Penembak Racun', phantom: 'Hantu Rawa',
    voidling: 'Makhluk Void'
  };

  // ---- Enemy attack system: per-planet projectile color identity (visual only, tetap ringan) ----
  const PLANET_ATTACK_COLOR = ['#B98CE0', '#66D9EF', '#FF8A45', '#C77DFF', '#9DE7FF'];
  function planetAttackColor() { return PLANET_ATTACK_COLOR[currentPlanetId] || COLORS.magenta; }
  function hexToRgba(hex, a) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // Scaling ringan berdasarkan level: damage & speed naik sedikit, cooldown berkurang sedikit, tetap bertahap.
  function atkDmgScale(base) { return +(base * (1 + Math.min(0.55, (level - 1) * 0.035)) * diff.speedMult).toFixed(2); }
  function atkSpeedScale(base) { return base * (1 + Math.min(0.45, (level - 1) * 0.028)) * diff.speedMult; }
  function atkCooldownScale(base) { return Math.max(base * 0.55, base - (level - 1) * 1.3) * diff.spawnDelayMult; }
  function aimedVec(fromX, fromY, speed) {
    const dx = player.x - fromX, dy = player.y - fromY, d = Math.hypot(dx, dy) || 1;
    return { vx: dx / d * speed, vy: dy / d * speed };
  }

  // Menembakkan projectile musuh sesuai pola serangannya. Dipanggil setelah telegraph (jika ada) selesai.
  function fireEnemyProjectile(e, def) {
    if (levelTransitionTimer > 0 || enemyBullets.length >= ENEMY_BULLET_CAP) return;
    const dmg = atkDmgScale(def.attackDamageBase);
    const spd = atkSpeedScale(def.projectileSpeedBase);
    const color = def.color;
    const r = def.projectileR || 4;
    const ox = e.x, oy = e.y + e.r * 0.6;
    const base = { r, dmg, enemy: true, ptype: e.type, color, planetColor: planetAttackColor() };
    switch (def.pattern) {
      case 'straight':
        enemyBullets.push({ ...base, x: ox, y: oy, vx: 0, vy: spd });
        break;
      case 'double': {
        const v = aimedVec(ox, oy, spd); const ang = Math.atan2(v.vy, v.vx);
        [-0.14, 0.14].forEach(off => { const a = ang + off; enemyBullets.push({ ...base, x: ox, y: oy, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd }); });
        break;
      }
      case 'spread': {
        const v = aimedVec(ox, oy, spd); const ang = Math.atan2(v.vy, v.vx); const n = 3;
        for (let i = 0; i < n; i++) { const a = ang + (i - (n - 1) / 2) * 0.24; enemyBullets.push({ ...base, x: ox, y: oy, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd }); }
        break;
      }
      case 'aimed-jitter': {
        const v = aimedVec(ox, oy, spd); const ang = Math.atan2(v.vy, v.vx) + (Math.random() - 0.5) * 0.34;
        enemyBullets.push({ ...base, x: ox, y: oy, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd });
        break;
      }
      case 'orbit': {
        const v = aimedVec(ox, oy, spd * 0.85);
        enemyBullets.push({ ...base, x: ox, y: oy, vx: v.vx, vy: v.vy, curve: (Math.random() < 0.5 ? -1 : 1) * 0.022 });
        break;
      }
      case 'aimed':
      default: {
        const v = aimedVec(ox, oy, spd);
        enemyBullets.push({ ...base, x: ox, y: oy, vx: v.vx, vy: v.vy });
        break;
      }
    }
    sfx.enemyShoot();
  }

  // Update serangan satu musuh per frame: menangani cooldown, telegraph/warning, lalu menembak.
  // mine & charger punya state machine sendiri karena bukan penembak biasa.
  function updateEnemyAttack(e, def) {
    if (!running || paused || !def.attackType || e.y < -e.r) return;
    if (e.type === 'mine') { updateMineAttack(e, def); return; }
    if (e.type === 'charger') { updateChargerAttack(e, def); return; }
    if (e.y < 10) return; // tunggu musuh benar-benar masuk arena sebelum menyerang
    if (e.attackTimer === undefined) e.attackTimer = atkCooldownScale(def.attackCooldownBase) * (0.35 + Math.random() * 0.65);
    if (e.telegraph > 0) {
      e.telegraph--;
      if (e.telegraph === 0) { fireEnemyProjectile(e, def); e.attackTimer = atkCooldownScale(def.attackCooldownBase); }
      return;
    }
    e.attackTimer--;
    if (e.attackTimer <= 0) {
      if (def.telegraphFrames) { e.telegraph = def.telegraphFrames; }
      else { fireEnemyProjectile(e, def); e.attackTimer = atkCooldownScale(def.attackCooldownBase); }
    }
  }

  // MINE: musuh area. Diam menembakkan, hanya meledak jika pemain terlalu dekat, dengan warning singkat sebelum meledak.
  function updateMineAttack(e, def) {
    if (e.y < 10 || e.mineState === 'dead') return;
    if (e.mineWarn > 0) {
      e.mineWarn--;
      if (e.mineWarn === 0) {
        const dmg = atkDmgScale(def.attackDamageBase);
        const dist = Math.hypot(player.x - e.x, player.y - e.y);
        if (dist < (def.blastRadius || 78) + Math.max(player.w, player.h) * 0.4) takeHit(dmg);
        spawnExplosion(e.x, e.y, def.color); spawnImpact(e.x, e.y, def.color);
        triggerShake(9); sfx.explode();
        e.mineState = 'dead';
      }
      return;
    }
    const dist = Math.hypot(player.x - e.x, player.y - e.y);
    if (dist < (def.attackRange || 92)) e.mineWarn = def.telegraphFrames || 38;
  }

  // CHARGER: telegraph singkat, lalu menerjang cepat ke posisi pemain saat itu, lalu cooldown.
  function updateChargerAttack(e, def) {
    if (!e.chargeState) e.chargeState = 'idle';
    if (e.chargeState === 'idle') {
      if (e.y < 60) return;
      if (e.attackTimer === undefined) e.attackTimer = atkCooldownScale(def.attackCooldownBase) * (0.4 + Math.random() * 0.6);
      e.attackTimer--;
      if (e.attackTimer <= 0) { e.chargeState = 'telegraph'; e.telegraph = def.telegraphFrames || 28; }
    } else if (e.chargeState === 'telegraph') {
      e.telegraph--;
      if (e.telegraph <= 0) {
        const spd = atkSpeedScale(def.projectileSpeedBase);
        const v = aimedVec(e.x, e.y, spd);
        e.chargeVX = v.vx; e.chargeVY = v.vy;
        e.chargeState = 'charging'; e.chargeTimer = 30;
      }
    } else if (e.chargeState === 'charging') {
      e.chargeTimer--;
      if (e.chargeTimer <= 0 || e.y > H + e.r) { e.chargeState = 'cooldown'; e.attackTimer = atkCooldownScale(def.attackCooldownBase); }
    } else if (e.chargeState === 'cooldown') {
      e.attackTimer--;
      if (e.attackTimer <= 0) e.chargeState = 'idle';
    }
  }

  function drawEnemyBullet(b) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const c = b.color || COLORS.magenta;
    switch (b.ptype) {
      case 'crystal':
        ctx.fillStyle = 'rgba(157,231,255,.25)'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 2, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = c; ctx.strokeStyle = '#EFFFFF'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(b.x, b.y - b.r); ctx.lineTo(b.x + b.r * 0.7, b.y); ctx.lineTo(b.x, b.y + b.r); ctx.lineTo(b.x - b.r * 0.7, b.y); ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      case 'acid':
        ctx.fillStyle = 'rgba(139,226,139,.25)'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r * 0.85, b.r * 1.15, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.28, 0, Math.PI * 2); ctx.fill();
        break;
      case 'voidling':
        ctx.fillStyle = 'rgba(199,125,255,.28)'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 2, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        const vg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); vg.addColorStop(0, '#FFFFFF'); vg.addColorStop(.4, c); vg.addColorStop(1, 'rgba(20,10,40,.2)');
        ctx.fillStyle = vg; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        break;
      case 'orbiter':
        ctx.strokeStyle = c; ctx.lineWidth = 2.4; ctx.fillStyle = 'rgba(255,159,107,.85)';
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.85, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        break;
      case 'tank':
        ctx.fillStyle = c; ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; ctx.strokeStyle = '#FFF6D8'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.6, 0, Math.PI * 2); ctx.stroke();
        break;
      default:
        ctx.fillStyle = hexToRgba(b.planetColor || '#FFFFFF', 0.22); ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.35, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  // Warning/telegraph visual singkat: lingkaran atau garis arah sebelum musuh menyerang.
  function drawEnemyTelegraph(e, def) {
    if (!e.telegraph || e.telegraph <= 0) return;
    const t = e.telegraph / (def.telegraphFrames || 20);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = '#FFFFFF'; ctx.globalAlpha = 0.35 + Math.sin(animTick * 0.6) * 0.25 * t;
    ctx.lineWidth = 1.6;
    if (e.type === 'charger') {
      const v = aimedVec(e.x, e.y, 1);
      ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + v.vx * 260, e.y + v.vy * 260); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r * (1.5 + (1 - t) * 0.6), 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  // Warning boss sebelum melepaskan serangan berat: cincin merah berdenyut di sekeliling boss.
  function drawBossTelegraph(b) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = '#FF4D8D'; ctx.globalAlpha = 0.4 + Math.sin(animTick * 0.7) * 0.3; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 1.5, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  function drawMineWarning(e, def) {
    if (!e.mineWarn || e.mineWarn <= 0) return;
    const t = e.mineWarn / (def.telegraphFrames || 38);
    ctx.save();
    ctx.strokeStyle = '#FF6B6B'; ctx.globalAlpha = 0.3 + Math.sin(animTick * 0.8) * 0.25;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(e.x, e.y, def.blastRadius || 78, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // dmg proyektil boss: naik bertahap sesuai level, dibatasi agar tetap fair.
  function bossBulletDmg(lvl, heavy) { return Math.min(heavy ? 30 : 22, (heavy ? 14 : 10) + lvl * 0.75); }

  // ---- Boss & mini-boss definitions: index 0-4 = boss utama per dunia, index 5-9 = mini-boss (level 5) per dunia ----
  const BOSS_DEFS = [
    { name: 'Penjaga Spiral', color: COLORS.magenta, shape: 'spiky', fireDelay: lvl => Math.max(28, 55 - lvl * 2),
      fire: (b, px, py, lvl) => { const d = bossBulletDmg(lvl); return [-1.6, 0, 1.6].map(vx => ({ x: b.x, y: b.y + b.r * 0.5, vx, vy: 4.4, r: 5, dmg: d, ptype:'tank', color: COLORS.magenta })); },
      fireHeavy: (b, px, py, lvl) => { const d = bossBulletDmg(lvl, true); const arr = []; for (let i = -4; i <= 4; i++) arr.push({ x: b.x, y: b.y + b.r * 0.5, vx: i * 0.9, vy: 4.8, r: 5.5, dmg: d, ptype:'tank', color: COLORS.magenta }); return arr; } },
    { name: 'Raja Kristal', color: '#9DE7FF', shape: 'crystal', fireDelay: lvl => Math.max(25, 50 - lvl * 2),
      fire: (b, px, py, lvl) => { const a = b.rot * 4; const d = bossBulletDmg(lvl); return [-0.8,0,0.8].map(v => ({ x:b.x, y:b.y+b.r*.5, vx:Math.sin(a+v)*3, vy:4.6, r:5.5, dmg: d, ptype:'crystal', color:'#9DE7FF' })); },
      fireHeavy: (b, px, py, lvl) => { const d = bossBulletDmg(lvl, true); const arr = []; const n = 8; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; arr.push({ x: b.x, y: b.y, vx: Math.cos(a) * 3.6, vy: Math.sin(a) * 3.6, r: 6, dmg: d, ptype:'crystal', color:'#9DE7FF' }); } return arr; } },
    { name: 'Titan Bara', color: '#FF8A45', shape: 'sun', fireDelay: lvl => Math.max(35, 65 - lvl * 2),
      fire: (b, px, py, lvl) => { const d = bossBulletDmg(lvl); const arr=[]; const n=10; for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+b.rot; arr.push({x:b.x,y:b.y,vx:Math.cos(a)*3.5,vy:Math.sin(a)*3.5,r:4.5,dmg:d,ptype:'tank',color:'#FF8A45'});} return arr; },
      fireHeavy: (b, px, py, lvl) => { const d = bossBulletDmg(lvl, true); const arr=[]; const n=16; for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+b.rot*1.4; arr.push({x:b.x,y:b.y,vx:Math.cos(a)*4.2,vy:Math.sin(a)*4.2,r:5,dmg:d,ptype:'tank',color:'#FF8A45'});} return arr; } },
    { name: 'Penguasa Void', color: '#C77DFF', shape: 'void', fireDelay: lvl => Math.max(16, 34 - lvl),
      fire: (b, px, py, lvl) => { const d = bossBulletDmg(lvl); const arr=[]; const base=Math.atan2(py-b.y,px-b.x); for(let i=-2;i<=2;i++){const a=base+i*.22; arr.push({x:b.x,y:b.y+b.r*.5,vx:Math.cos(a)*5.5,vy:Math.sin(a)*5.5,r:5.5,dmg:d,ptype:'voidling',color:'#C77DFF'});} return arr; },
      fireHeavy: (b, px, py, lvl) => { const d = bossBulletDmg(lvl, true); const arr=[]; const base=Math.atan2(py-b.y,px-b.x); for(let i=-4;i<=4;i++){const a=base+i*.17; arr.push({x:b.x,y:b.y+b.r*.5,vx:Math.cos(a)*6,vy:Math.sin(a)*6,r:5.5,dmg:d,ptype:'voidling',color:'#C77DFF'});} return arr; } },
    { name: 'Core Crystal', color: '#9DE7FF', shape: 'crystal', fireDelay: lvl => Math.max(14, 30 - lvl),
      fire: (b, px, py, lvl) => { const d = bossBulletDmg(lvl); const arr=[]; const n=6; const a0=b.rot*2; for(let i=0;i<n;i++){const a=a0+(i/n)*Math.PI*2; arr.push({x:b.x,y:b.y,vx:Math.cos(a)*4.4,vy:Math.sin(a)*4.4,r:5.5,dmg:d,ptype:'crystal',color:'#9DE7FF'});} return arr; },
      fireHeavy: (b, px, py, lvl) => { const d = bossBulletDmg(lvl, true); const arr=[]; const n=12; const a0=b.rot*2; for(let i=0;i<n;i++){const a=a0+(i/n)*Math.PI*2; arr.push({x:b.x,y:b.y,vx:Math.cos(a)*5,vy:Math.sin(a)*5,r:5.5,dmg:d,ptype:'crystal',color:'#9DE7FF'});} return arr; } },
    // ---- Mini-boss (index 5-9), pola lebih simpel, HP jauh lebih rendah dari boss utama ----
    { name: 'Utusan Racun', color: '#7FE0A8', shape: 'poison', fireDelay: lvl => Math.max(30, 50 - lvl),
      fire: (b, px, py, lvl) => { const d = bossBulletDmg(lvl); const dx=px-b.x,dy=py-(b.y+b.r*.5),dd=Math.hypot(dx,dy)||1; return [
        {x:b.x,y:b.y+10,vx:dx/dd*4.6,vy:dy/dd*4.6,r:5,dmg:d,ptype:'acid',color:'#7FE0A8'}
      ]; },
      fireHeavy: (b, px, py, lvl) => { const d = bossBulletDmg(lvl, true); const dx=px-b.x,dy=py-(b.y+b.r*.5),dd=Math.hypot(dx,dy)||1; const base=Math.atan2(dy,dx); const arr=[]; for(let i=-1;i<=1;i++){const a=base+i*.22; arr.push({x:b.x,y:b.y+b.r*.5,vx:Math.cos(a)*5,vy:Math.sin(a)*5,r:5.5,dmg:d,ptype:'acid',color:'#7FE0A8'});} return arr; } },
    { name: 'Pecahan Kristal', color: '#9DE7FF', shape: 'crystal', fireDelay: lvl => Math.max(32, 52 - lvl * 1.6),
      fire: (b, px, py, lvl) => { const a = b.rot * 3; const d = bossBulletDmg(lvl); return [{ x:b.x, y:b.y+b.r*.5, vx:Math.sin(a)*2.6, vy:4.4, r:5, dmg: d, ptype:'crystal', color:'#9DE7FF' }]; },
      fireHeavy: (b, px, py, lvl) => { const d = bossBulletDmg(lvl, true); const arr=[]; const n=5; for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2; arr.push({x:b.x,y:b.y,vx:Math.cos(a)*3.2,vy:Math.sin(a)*3.2,r:5,dmg:d,ptype:'crystal',color:'#9DE7FF'});} return arr; } },
    { name: 'Percikan Bara', color: '#FF8A45', shape: 'sun', fireDelay: lvl => Math.max(38, 58 - lvl * 1.6),
      fire: (b, px, py, lvl) => { const d = bossBulletDmg(lvl); const arr=[]; const n=6; for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+b.rot; arr.push({x:b.x,y:b.y,vx:Math.cos(a)*3,vy:Math.sin(a)*3,r:4.2,dmg:d,ptype:'tank',color:'#FF8A45'});} return arr; },
      fireHeavy: (b, px, py, lvl) => { const d = bossBulletDmg(lvl, true); const arr=[]; const n=10; for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+b.rot*1.2; arr.push({x:b.x,y:b.y,vx:Math.cos(a)*3.6,vy:Math.sin(a)*3.6,r:4.6,dmg:d,ptype:'tank',color:'#FF8A45'});} return arr; } },
    { name: 'Bayangan Void', color: '#C77DFF', shape: 'void', fireDelay: lvl => Math.max(24, 40 - lvl),
      fire: (b, px, py, lvl) => { const d = bossBulletDmg(lvl); const base=Math.atan2(py-b.y,px-b.x); return [{x:b.x,y:b.y+b.r*.5,vx:Math.cos(base)*4.6,vy:Math.sin(base)*4.6,r:5,dmg:d,ptype:'voidling',color:'#C77DFF'}]; },
      fireHeavy: (b, px, py, lvl) => { const d = bossBulletDmg(lvl, true); const base=Math.atan2(py-b.y,px-b.x); const arr=[]; for(let i=-2;i<=2;i++){const a=base+i*.2; arr.push({x:b.x,y:b.y+b.r*.5,vx:Math.cos(a)*5,vy:Math.sin(a)*5,r:5,dmg:d,ptype:'voidling',color:'#C77DFF'});} return arr; } },
    { name: 'Inti Kristal Kecil', color: '#9DE7FF', shape: 'crystal', fireDelay: lvl => Math.max(20, 34 - lvl),
      fire: (b, px, py, lvl) => { const d = bossBulletDmg(lvl); const arr=[]; const n=4; const a0=b.rot*2; for(let i=0;i<n;i++){const a=a0+(i/n)*Math.PI*2; arr.push({x:b.x,y:b.y,vx:Math.cos(a)*3.8,vy:Math.sin(a)*3.8,r:5,dmg:d,ptype:'crystal',color:'#9DE7FF'});} return arr; },
      fireHeavy: (b, px, py, lvl) => { const d = bossBulletDmg(lvl, true); const arr=[]; const n=8; const a0=b.rot*2; for(let i=0;i<n;i++){const a=a0+(i/n)*Math.PI*2; arr.push({x:b.x,y:b.y,vx:Math.cos(a)*4.2,vy:Math.sin(a)*4.2,r:5,dmg:d,ptype:'crystal',color:'#9DE7FF'});} return arr; } }
  ];

  const POWERUP_CHANCE = 0.09;
  const POWERUP_TYPES = ['shield', 'life', 'rapid'];
  const LEVEL_UP_SCORE = 120;
  const COMBO_WINDOW = 85;

  let player, bullets, enemies, enemyBullets, pickups, particles, sparks, stars;
  let meteors = [], meteorTimer = 0;
  let fxParticles = [];
  const FX_CAP = 260;
  let score, lives, running, paused, spawnTimer, shootLeftTimer, shootRightTimer, shootCenterTimer, keys, level, coinsThisRun;
  let playerHP = 100, enemiesSpawnedThisLevel = 0, enemiesTargetThisLevel = BASE_WAVE_ENEMIES, levelTransitionTimer = 0;
  let playerShield = 100, maxShield = 100, shieldRegenDelay = 0; // bar biru: lapisan perisai, diserap duluan sebelum HP (nyawa) berkurang
  let boss, bossActive, bossFireTimer, bossDefIdx, bossPhase2, bossWaitingEntry, bossEntryTimer = 0;
  let bossKind = null; // 'main' | 'mini' | null
  let bossPhase3 = false, bossShotCount = 0, bossTelegraphTimer = 0, bossTelegraphKind = null;
  let shieldTimer, shakeTimer, shakeMag;
  let rapidFireTimer = 0; // durasi buff rapid fire (frame)
  const SHIELD_TIMER_MAX = 300, RAPID_FIRE_MAX = 360;
  let playerInvuln = 0;
  let combo, comboTimer, diff, themeIdx;
  let shipStats, animTick = 0, startLivesEffective = 3;
  let mouseActive = false, mouseTargetX = null, mouseTargetY = null;
  let droneVisualX = 0, droneVisualY = 0, droneVisualVX = 0, droneVisualVY = 0, droneVisualSeed = Math.random()*100;
  let killsThisRun = 0, maxHPPool = 100, lowHpWarned = false, suppressShipWeapons = false;
  let planetPassiveMods = { fireRateMult: 1, defenseMult: 1, atkMult: 1, hpPoolMult: 1, ultChargeMult: 1, critChance: 0 };
  let currentPlanetId = 0;
  let envParticles = [];

  function computePlanetPassiveMods(planet) {
    const mods = { fireRateMult: 1, defenseMult: 1, atkMult: 1, hpPoolMult: 1, ultChargeMult: 1, critChance: 0 };
    if (!planet || !planet.passive) return mods;
    const v = planet.passive.value;
    switch (planet.passive.key) {
      case 'fireRate': mods.fireRateMult = 1 + v; break;
      case 'defense': mods.defenseMult = 1 - v; break;
      case 'attack': mods.atkMult = 1 + v; break;
      case 'maxHp': mods.hpPoolMult = 1 + v; break;
      case 'ultCharge': mods.ultChargeMult = 1 + v; break;
      case 'crit': mods.critChance = v; break;
    }
    return mods;
  }
  function initEnvParticles(env) {
    const count = 42;
    envParticles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2.2 + 0.35, speed: Math.random() * 1.25 + 0.18,
      alpha: Math.random() * 0.42 + 0.10, phase: Math.random() * Math.PI * 2, rot: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.9 + 0.35, drift: (Math.random()-.5)*0.22
    }));
  }
  function drawEnvParticles(env, theme) {
    envParticles.forEach(p => {
      p.y += p.speed * p.depth; p.x += p.drift; p.phase += 0.02 * p.depth;
      if (p.y > H + 6) { p.y = -6; p.x = Math.random() * W; }
      ctx.save();
      ctx.globalAlpha = p.alpha * (0.6 + Math.sin(p.phase) * 0.4);
      if (env === 'ice') {
        ctx.fillStyle = '#CFF7FF'; ctx.translate(p.x, p.y); ctx.rotate(p.phase);
        ctx.fillRect(-p.r, -0.6, p.r * 2, 1.2); ctx.fillRect(-0.6, -p.r, 1.2, p.r * 2);
      } else if (env === 'fire') {
        ctx.fillStyle = '#FFB37A'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 1.3, 0, Math.PI * 2); ctx.fill();
      } else if (env === 'toxic') {
        ctx.fillStyle = '#B9FFB0'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 1.6, 0, Math.PI * 2); ctx.fill();
      } else if (env === 'void') {
        ctx.strokeStyle = '#C77DFF'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 1.4); ctx.stroke();
      } else if (env === 'crystal') {
        ctx.fillStyle = '#DFF7FF'; ctx.translate(p.x, p.y); ctx.rotate(p.phase);
        ctx.beginPath(); ctx.moveTo(0, -p.r * 1.6); ctx.lineTo(p.r, 0); ctx.lineTo(0, p.r * 1.6); ctx.lineTo(-p.r, 0); ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = '#B98CE0'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });
  }

  function availableTypes(lvl) {
    const planet = getPlanetForLevel(lvl);
    return planet.enemies.filter(k => ENEMY_TYPES[k] && ENEMY_TYPES[k].unlockLevel <= lvl);
  }
  function levelInWorld(lvl) { return ((lvl - 1) % 10) + 1; }
  function isMiniBossLevel(lvl) { return levelInWorld(lvl) === 5; }
  function isMainBossLevel(lvl) { return levelInWorld(lvl) === 10; }
  function isBossLevel(lvl) { return isMiniBossLevel(lvl) || isMainBossLevel(lvl); }
  function comboMultiplier() { return 1 + Math.min(4, Math.floor(combo / 5)) * 0.5; }


