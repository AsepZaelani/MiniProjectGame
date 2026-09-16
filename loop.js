// Peluang drop energi penuh dari musuh saat energi pemain kritis (<=20%). Nilai per-kill,
  // hanya dievaluasi ketika kondisi energi kritis terpenuhi (lihat killEnemy()).
  const ENERGY_DROP_CHANCE = 0.35;
  // ---- Jeda upgrade di antar-level: pesawat terbang masuk portal -> HANGAR -> keluar portal lagi ----
  let pendingLevelAdvance = null;
  let midGameBreak = false;
  let breakTransition = null; // {phase:'in'|'out', t, dur, onDone}
  function openUpgradeBreak() {
    if (!running) return;
    pauseBtn.style.display = 'none';
    ensureAudio(); sfx.ui();
    breakTransition = { phase: 'in', t: 0, dur: 56, onDone: () => {
      midGameBreak = true;
      paused = true;
      pausePanel.style.display = 'none';
      sfx.ui();
      overlay.style.display = 'flex';
      shopPanel.style.display = 'block';
      shopCoins.textContent = wallet;
      renderShop();
      if (backBtn) backBtn.textContent = '▶ LANJUTKAN MISI';
    }};
  }
  function proceedFromUpgradeBreak() {
    midGameBreak = false;
    shopPanel.style.display = 'none';
    overlay.style.display = 'none';
    if (backBtn) backBtn.textContent = 'KEMBALI';
    energy = maxEnergy; updateCombatHud(); // isi ulang energi senjata jadi penuh setelah selesai upgrade
    const advance = pendingLevelAdvance; pendingLevelAdvance = null;
    if (advance) advance(); // ganti planet/tema/level dulu, supaya animasi keluar portal terjadi di latar sektor baru
    if (!running) return;
    paused = false;
    breakTransition = { phase: 'out', t: 0, dur: 50, onDone: () => {
      player.x = W / 2; player.y = H - 90;
      if (running) pauseBtn.style.display = 'block';
    }};
    requestAnimationFrame(loop);
  }
  function drawPortalRing(x, y, r, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.9);
    g.addColorStop(0, 'rgba(157,231,255,0.35)'); g.addColorStop(1, 'rgba(157,231,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 1.9, 0, Math.PI * 2); ctx.fill();
    const ringColors = ['#9DE7FF', '#C77DFF', '#4ECDC4'];
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate(t * 0.02 * (i % 2 === 0 ? 1 : -1) + i * 1.4);
      ctx.strokeStyle = ringColors[i]; ctx.lineWidth = 2.2 - i * 0.4; ctx.globalAlpha = 0.75 - i * 0.15;
      ctx.beginPath(); ctx.ellipse(0, 0, r - i * 5, (r - i * 5) * 0.42, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 0.85 + Math.sin(t * 0.2) * 0.1;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 8; i++) {
      const a = t * 0.06 + i * (Math.PI * 2 / 8);
      ctx.globalAlpha = 0.6; ctx.fillStyle = i % 2 === 0 ? '#9DE7FF' : '#C77DFF';
      ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.36, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }
  function renderBreakTransition() {
    const theme = THEMES[themeIdx];
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#070B1D'); grad.addColorStop(0.48, theme.deep); grad.addColorStop(1, '#050713');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    stars.forEach(st => { st.y += st.s; if (st.y > H) { st.y = 0; st.x = Math.random() * W; } ctx.fillStyle = `rgba(${theme.star},0.6)`; ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill(); });

    animTick++;
    const bt = breakTransition;
    bt.t++;
    const p = Math.min(1, bt.t / bt.dur);
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const portalX = W / 2, portalY = H * 0.26;
    drawPortalRing(portalX, portalY, 34 + Math.sin(animTick * 0.15) * 3, animTick);

    let shipY, shipScale, shipAlpha;
    if (bt.phase === 'in') {
      shipY = player.y + (portalY - player.y) * ease;
      shipScale = 1 - ease * 0.85;
      shipAlpha = 1 - Math.max(0, ease - 0.7) / 0.3;
      if (bt.t === 4) { sfx.equip(); }
    } else {
      const restY = H - 90;
      shipY = portalY + (restY - portalY) * ease;
      shipScale = 0.15 + ease * 0.85;
      shipAlpha = Math.min(1, ease / 0.3);
      if (bt.t === 4) { sfx.equip(); }
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, shipAlpha));
    ctx.translate(portalX, shipY);
    ctx.scale(shipScale, shipScale);
    drawShip({ x: 0, y: 0, tilt: Math.sin(animTick * 0.1) * 0.08 });
    ctx.restore();

    if (bt.t >= bt.dur) {
      const done = bt.onDone;
      breakTransition = null;
      if (done) done();
    }
  }

  function endGame(victory = false) {
    running = false;
    midGameBreak = false; pendingLevelAdvance = null;
    enemyBullets = []; bullets = [];
    sfx.gameover(); saveProgress(); paused = false; pauseBtn.style.display='none'; pausePanel.style.display='none';
    clearGameplayCanvas();
    hud.style.display = 'none'; if(astroCombatHud) astroCombatHud.style.display='none'; if(energyMeter) energyMeter.style.display='none'; if(armorMeter) armorMeter.style.display='none'; if(rapidBuffBadge) rapidBuffBadge.style.display='none'; if(shieldBuffBadge) shieldBuffBadge.style.display='none';
    setBgMode('menu');
    if (score > sessionHigh) sessionHigh = score;
    saveProgress();
    menuPanel.style.display = 'none'; shopPanel.style.display = 'none'; customizePanel.style.display = 'none'; missionPanel.style.display = 'none'; mapPanel.style.display = 'none';
    gameOverPanel.style.display = 'block';
    gameOverPanel.style.alignSelf = 'center';
    gameOverStats.innerHTML = victory ? `🏆 SEMUA LEVEL SELESAI!<br>SKOR ${score}<br>KOIN +${coinsThisRun}` : `SKOR ${score}<br>LEVEL ${level}<br>KOIN +${coinsThisRun}`;
    document.getElementById('gameOverMsg').textContent = victory ? 'Kamu berhasil menaklukkan seluruh galaksi!' : 'Kapalmu hancur. Coba lagi dan lanjutkan progresmu!';
    retryBtn.textContent = victory ? 'MAIN LAGI' : 'COBA LAGI';
    if(menuCoins) menuCoins.textContent = wallet; if(menuHigh) menuHigh.textContent = sessionHigh;
    overlay.style.display = 'flex'; bossBarWrap.style.display = 'none'; waveTag.style.display = 'none'; planetTag.style.display = 'none';
    requestAnimationFrame(menuBgLoop);
  }

  function takeHit(damage = 25) {
    if (!running) return;
    if (playerInvuln > 0) return; // invincibility frame: ignore further hits for a short window
    if (shieldTimer > 0) { sfx.shieldHit(); return; }
    const moduleDefense = 1 - Math.min(.22, moduleBonus('shieldCore'));
    const droneDefense = activeDrone()?.id === 'shieldDrone' ? .96 : 1;
    let dmg = damage * planetPassiveMods.defenseMult * moduleDefense * droneDefense;
    combo = 0; comboTimer = 0;
    playerInvuln = INVULN_FRAMES;
    shieldRegenDelay = 240; // perisai berhenti mengisi ulang sesaat setelah kena serang

    // Bar biru (perisai) menyerap damage lebih dulu; HP (nyawa) baru berkurang kalau perisai sudah habis.
    if (playerShield > 0) {
      const absorbed = Math.min(playerShield, dmg);
      playerShield = Math.max(0, playerShield - absorbed);
      dmg -= absorbed;
      sfx.shieldHit(); triggerShake(5); updateCombatHud();
      spawnImpact(player.x, player.y - player.h * 0.3, COLORS.cyan);
      screenFlash.style.transition = 'none';
      screenFlash.style.background = 'rgba(78,205,196,0.28)';
      requestAnimationFrame(() => { screenFlash.style.transition = 'background 0.35s ease'; screenFlash.style.background = 'rgba(78,205,196,0)'; });
    }

    if (dmg > 0) {
      playerHP = Math.max(0, playerHP - dmg);
      sfx.hurt(); triggerShake(8); updateHPUI(); updateHud();
      spawnImpact(player.x, player.y - player.h * 0.3, COLORS.coral);
      spawnDamagePop(player.x, player.y - player.h * 0.6, dmg);
      screenFlash.style.transition = 'none';
      screenFlash.style.background = 'rgba(255,60,60,0.32)';
      requestAnimationFrame(() => { screenFlash.style.transition = 'background 0.35s ease'; screenFlash.style.background = 'rgba(255,60,60,0)'; });
    }
    if (playerHP <= 0) endGame();
  }

  function killEnemy(e) {
    const def = ENEMY_TYPES[e.type];
    spawnExplosion(e.x, e.y, def.color);
    sfx.explode();
    const coinBonus = activeDrone()?.id === 'coinDrone' ? 1 : 0;
    const coinReward = Math.max(1, Math.round(def.coin * 1.15)) + coinBonus;
    wallet += coinReward; coinsThisRun += coinReward;
    spawnCoinPop(e.x, e.y, coinReward); sfx.coin();
    registerKill(10);
    totalKills++; killsThisRun++;
    updateHud();
    if (def.splits && !e.fromSplit) {
      for (let i = 0; i < 2; i++) {
        enemies.push({ type: e.type, x: e.x + (i === 0 ? -14 : 14), y: e.y, r: e.r * 0.55, hp: 1, maxHp: 1,
          speed: e.speed * 1.25, rot: 0, rotSpeed: (Math.random() - 0.5) * 0.1, seed: Math.random() * 100, fromSplit: true });
      }
    }
    if (Math.random() < POWERUP_CHANCE) {
      const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
      pickups.push({ x: e.x, y: e.y, type, vy: 1.8 });
    }
    // Energi kritis (<=20%): musuh yang tumbang punya peluang menjatuhkan drop energi
    // yang langsung mengisi penuh energi pemain saat diambil. Dibatasi satu drop energi
    // aktif dalam satu waktu agar tidak membanjiri layar dengan drop yang sama.
    else if (maxEnergy > 0 && energy / maxEnergy <= 0.2 && !pickups.some(pu => pu.type === 'energyFull') && Math.random() < ENERGY_DROP_CHANCE) {
      pickups.push({ x: e.x, y: e.y, type: 'energyFull', vy: 1.8 });
    }
    checkAchievements(); saveProgress();
  }

  function loop() {
    if (!running || paused) return;
    try {
      loopFrame();
    } catch (err) {
      // Jaga-jaga: satu error di satu frame tidak boleh membekukan seluruh game.
      console.error('[Penjaga Nebula] Frame error, otomatis dipulihkan:', err);
      try { ctx.restore(); } catch (e) {}
      if (running && !paused) requestAnimationFrame(loop);
    }
  }
  function loopFrame() {
    if (!running || paused) return;
    ctx.save();
    if (breakTransition) { renderBreakTransition(); ctx.restore(); requestAnimationFrame(loop); return; }
    let shakeX = 0, shakeY = 0;
    if (shakeTimer > 0) { shakeTimer--; shakeX = (Math.random() - 0.5) * shakeMag * (shakeTimer / 14); shakeY = (Math.random() - 0.5) * shakeMag * (shakeTimer / 14); }

    const theme = THEMES[themeIdx];

    // Arena gameplay: lebih gelap, berlapis, dan terasa seperti ruang tempur.
    // Tidak memakai kabut/orb map agar layar bermain punya identitas visual sendiri.
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#070B1D');
    grad.addColorStop(0.48, theme.deep);
    grad.addColorStop(1, '#050713');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    // Dua sumber cahaya besar yang bergerak perlahan di belakang arena.
    ctx.globalCompositeOperation = 'lighter';
    const pulse = 0.5 + Math.sin(animTick * 0.012) * 0.5;
    const glow1 = ctx.createRadialGradient(W * 0.18, H * 0.30, 0, W * 0.18, H * 0.30, H * 0.42);
    glow1.addColorStop(0, `rgba(${theme.star},${0.055 + pulse * 0.025})`);
    glow1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow1; ctx.fillRect(0, 0, W, H);
    const glow2 = ctx.createRadialGradient(W * 0.82, H * 0.72, 0, W * 0.82, H * 0.72, H * 0.48);
    glow2.addColorStop(0, `rgba(${theme.star},0.045)`);
    glow2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow2; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';

    // Planet raksasa samar di tepi arena.
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = theme.mid;
    ctx.beginPath(); ctx.arc(W * 1.08, H * 0.20, H * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(${theme.star},0.28)`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(W * 1.08, H * 0.20, H * 0.24, H * 0.075, -0.22, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    // Debu bintang dan streak bergerak ke bawah.
    battleDust.forEach(d => {
      d.y += d.speed;
      if (d.y > H + 4) { d.y = -4; d.x = Math.random() * W; }
      ctx.globalAlpha = d.alpha * (0.65 + Math.sin(animTick * 0.03 + d.phase) * 0.35);
      ctx.fillStyle = `rgba(${theme.star},1)`;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    battleStreaks.forEach(st => {
      st.y += st.speed; st.x += st.speed * 0.12;
      if (st.y > H + st.len) { st.y = -st.len; st.x = Math.random() * W; }
      const sg = ctx.createLinearGradient(st.x, st.y, st.x, st.y - st.len);
      sg.addColorStop(0, `rgba(${theme.star},0)`);
      sg.addColorStop(1, `rgba(${theme.star},${st.alpha})`);
      ctx.strokeStyle = sg; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(st.x, st.y); ctx.lineTo(st.x - st.len * 0.08, st.y - st.len); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    ctx.translate(shakeX, shakeY);

    drawEnvParticles(theme.env, theme);
    // Planet-specific midground particles: sparse, layered, and kept behind gameplay objects.
    const mt=meteorTheme();
    if(animTick%2===0 && fxParticles.length<FX_CAP-3){
      const ang=Math.random()*Math.PI*2;
      addFx(Math.random()*W,Math.random()*H,{color:mt.particle,speed:.12+Math.random()*.35,angle:ang,life:26+Math.random()*28,r:.4+Math.random()*1.1,shape:mt.type==='crystal'?'diamond':'dot',alpha:.35,glow:false,gravity:0});
    }
    drawFxParticles();

    stars.forEach(st => {
      st.y += st.s; if (st.y > H) { st.y = 0; st.x = Math.random() * W; }
      ctx.fillStyle = `rgba(${theme.star},0.6)`;
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
    });


    if (shieldTimer > 0) shieldTimer--;
    if (rapidFireTimer > 0) rapidFireTimer--;
    updateBuffBadges();
    if (shieldRegenDelay > 0) { shieldRegenDelay--; }
    else if (playerShield < maxShield) { playerShield = Math.min(maxShield, playerShield + maxShield / 300); updateCombatHud(); }
    if (comboTimer > 0) { comboTimer--; if (comboTimer === 0) { combo = 0; updateHud(); } }

    // Mouse control: kapal mengikuti posisi kursor dengan halus, termasuk maju-mundur.
    // Keyboard/touch tetap bisa dipakai seperti sebelumnya.
    if (mouseActive && mouseTargetX !== null && mouseTargetY !== null && !keys.left && !keys.right && !keys.up && !keys.down) {
      const dx = mouseTargetX - player.x;
      const dy = mouseTargetY - player.y;
      player.vx = dx * 0.18;
      player.vy = dy * 0.18;
      player.x += dx * 0.18;
      player.y += dy * 0.18;
    } else {
      // Gerakan lebih halus: kapal berakselerasi saat ditekan dan melambat perlahan saat dilepas.
      const accel = player.speed * 0.22;
      if (keys.left) player.vx -= accel;
      else if (keys.right) player.vx += accel;
      else player.vx *= 0.82;
      if (keys.up) player.vy -= player.speed * 0.16;
      else if (keys.down) player.vy += player.speed * 0.16;
      else player.vy *= 0.82;

      const maxVx = player.speed * 1.05;
      const maxVy = player.speed * 0.8;
      player.vx = Math.max(-maxVx, Math.min(maxVx, player.vx));
      player.vy = Math.max(-maxVy, Math.min(maxVy, player.vy));
      player.x += player.vx; player.y += player.vy;
    }
    player.x = Math.max(20, Math.min(W - 20, player.x));
    player.y = Math.max(70, Math.min(H - 45, player.y));

    // Efek banking: pesawat sedikit miring mengikuti arah geraknya lalu kembali tegak.
    player.targetTilt = Math.max(-0.22, Math.min(0.22, player.vx / Math.max(1, player.speed) * 0.22));
    player.tilt += (player.targetTilt - player.tilt) * 0.16;
    if (playerInvuln > 0) playerInvuln--;
    const invulnBlink = playerInvuln > 0 && Math.floor(playerInvuln / 4) % 2 === 0;
    if (!invulnBlink) drawShip(player);
    drawGameplayDrone();

    // ===== MANUAL ASTRO-STYLE WEAPON CONTROL =====
    // Pesawat tidak menembak sendiri. Setiap tembakan HARUS dipicu oleh satu kali pencet/klik/tap
    // (lihat fireWeaponOnce()) — tidak ada lagi auto-fire terus-menerus selama tombol ditahan.
    // Senjata utama terus menembak selama klik kiri / C ditahan, mengikuti fire rate senjata.
    if (mouseWeaponHeld || keyWeaponHeld) fireWeaponOnce();
    // Di sini kita hanya menghitung mundur cooldown antar tembakan agar fire rate senjata tetap berlaku.
    if (weaponShotTimer > 0) weaponShotTimer--;
    if (energyRegenLock > 0) energyRegenLock--;
    // Energi TIDAK pulih saat pemain sedang aktif menembak.
    // Regen mulai setelah berhenti menembak, atau langsung aktif jika energi sudah habis.
    if (energy < maxEnergy && !mouseWeaponHeld && !keyWeaponHeld && (energyRegenLock <= 0 || energy <= 0)) {
      const energyRatio = maxEnergy > 0 ? energy / maxEnergy : 1;
      // Regenerasi energi dipercepat dari sebelumnya agar jeda antar tembakan terasa lebih singkat.
      const regen = energyRatio < 0.25
        ? Math.max(0.55, maxEnergy * 0.0038)
        : Math.max(0.22, maxEnergy * 0.0014);
      energy = Math.min(maxEnergy, energy + regen);
    }

    // Roket memakai KLIK KANAN. Tahan klik kanan untuk meluncurkan terus mengikuti cooldown.
    if (rocketCooldown > 0) rocketCooldown--;
    if (mouseRocketHeld) fireRocket();
    updateCombatHud();

    // Drone attack ringan: satu projectile periodik, dibatasi agar tetap hemat HP/CPU.
    if (running && !paused && activeDrone()?.id === 'attackDrone') {
      window.__pnDroneTimer=(window.__pnDroneTimer||0)+1;
      if(window.__pnDroneTimer>62){
        window.__pnDroneTimer=0;
        const dx=droneVisualX, dy=droneVisualY-10; bullets.push({x:dx,y:dy,vx:0,vy:-10,r:3.5,dmg:2,pierce:false,weaponId:'drone-attack',kind:'laser'}); burstFx(dx,dy,'#FF8A8A',5,{speedMin:.4,speedMax:1.5,life:9,r:.7,shape:'dot',gravity:0}); sfx.weapon('ion');
      }
    }
    bullets.forEach(b => {
      if (b.homing) {
        let target = null, bestD = Infinity;
        enemies.forEach(e => { const d = (e.x - b.x) ** 2 + (e.y - b.y) ** 2; if (d < bestD) { bestD = d; target = e; } });
        if (bossActive && boss) { const d = (boss.x - b.x) ** 2 + (boss.y - b.y) ** 2; if (d < bestD) { bestD = d; target = boss; } }
        if (target) {
          const dx = target.x - b.x, dy = target.y - b.y, dist = Math.hypot(dx, dy) || 1, sp = 7.5;
          const dvx = dx / dist * sp, dvy = dy / dist * sp;
          b.vx += (dvx - b.vx) * b.turn; b.vy += (dvy - b.vy) * b.turn;
        }
      }
      b.trail = b.trail || [];
      b.trail.unshift({ x: b.x, y: b.y }); if (b.trail.length > 5) b.trail.pop();
      b.x += b.vx; b.y += b.vy;
    });
    bullets = bullets.filter(b => b.y > -14 && b.x > -14 && b.x < W + 14);
    updateMeteors();
    bullets.forEach(drawBullet);
    meteors.forEach(drawMeteor);

    if (!bossActive && levelTransitionTimer <= 0) {
      spawnTimer++;
      const spawnRate = Math.max(24, (68 - Math.min(level, 12) * 2) * diff.spawnDelayMult);
      if (spawnTimer > spawnRate && enemiesSpawnedThisLevel < enemiesTargetThisLevel) { spawnTimer = 0; spawnEnemy(); }
    }
    if (waveEnemyCount) waveEnemyCount.textContent = `MUSUH ${Math.min(enemiesSpawnedThisLevel, enemiesTargetThisLevel)}/${enemiesTargetThisLevel}`;
    if (!bossActive && enemiesSpawnedThisLevel >= enemiesTargetThisLevel && enemies.length === 0 && levelTransitionTimer <= 0) maybeLevelUp();

    enemies.forEach(e => {
      const def = ENEMY_TYPES[e.type];
      const prevX = e.x;
      const isDashing = e.type === 'charger' && e.chargeState === 'charging';
      if (isDashing) { e.x += e.chargeVX; e.y += e.chargeVY; }
      else { def.move(e); }
      // Hadapkan hidung pesawat ke arah gerak (lurus menerjang ke bawah), miring tipis saat berbelok — tidak ada lagi yang berputar/orbit.
      const dvx = e.x - prevX;
      const targetRot = Math.max(-0.4, Math.min(0.4, dvx * 0.22));
      e.rot += (targetRot - e.rot) * 0.18;
      if (!isDashing) e.x = Math.max(e.r, Math.min(W - e.r, e.x));
      updateEnemyAttack(e, def);
    });

    for (let ei = enemies.length - 1; ei >= 0; ei--) {
      const e = enemies[ei];
      const def = ENEMY_TYPES[e.type];
      if (e.type === 'mine' && e.mineState === 'dead') { enemies.splice(ei, 1); continue; }
      for (let bi = bullets.length - 1; bi >= 0; bi--) {
        const b = bullets[bi];
        const dx = b.x - e.x, dy = b.y - e.y;
        if (dx * dx + dy * dy < (e.r + b.r) * (e.r + b.r)) {
          if (b.pierce) { if (!b.hitEnemies) b.hitEnemies = new Set(); if (b.hitEnemies.has(e)) continue; b.hitEnemies.add(e); }
          let dmg = b.dmg;
          if (Math.random() < planetPassiveMods.critChance) { dmg *= 1.5; spawnTextPop(b.x, b.y - 8, 'CRIT!', COLORS.amber); }
          e.hp -= dmg;
          if (!b.pierce) bullets.splice(bi, 1);
          if (b.rocket) spawnRocketBlast(b.x, b.y, rocketBlastColor(b.kind));
          if (e.hp > 0) { sfx.hitEnemy(); if (!b.rocket) spawnImpact(b.x, b.y, ENEMY_TYPES[e.type].color); if (Math.random() < 0.35) spawnDamagePop(e.x, e.y - e.r, dmg); }
          break;
        }
      }
      if (e.hp <= 0) { enemies.splice(ei, 1); killEnemy(e); updateHud(); maybeLevelUp(); continue; }
      if (e.y - e.r > H) { enemies.splice(ei, 1); continue; }
      if (rectCircleCollide(player.x, player.y, player.w, player.h, e.x, e.y, e.r)) {
        if (shieldTimer > 0) {
          // Perisai kebal aktif: menabrak musuh langsung menghancurkannya dengan reward penuh.
          enemies.splice(ei, 1); killEnemy(e); updateHud(); maybeLevelUp(); sfx.shieldHit();
        } else {
          enemies.splice(ei, 1); takeHit(def && def.attackDamageBase ? atkDmgScale(def.attackDamageBase) + 12 : 25);
          if (!running) { ctx.restore(); return; }
        }
      }
    }
    enemies.forEach(e => { drawEnemy(e); drawEnemyTelegraph(e, ENEMY_TYPES[e.type]); if (e.type === 'mine') drawMineWarning(e, ENEMY_TYPES[e.type]); });

    if (bossActive && boss) {
      const bdef = BOSS_DEFS[bossDefIdx];
      if (bossEntryTimer > 0) {
        bossEntryTimer--;
        boss.entryProgress = 1 - bossEntryTimer / 34;
        ctx.fillStyle = `rgba(0,0,0,${0.35 * (bossEntryTimer / 34)})`;
        ctx.fillRect(0, 0, W, H);
        boss.y = 90 * boss.entryProgress + (-30) * (1 - boss.entryProgress);
        drawBoss(boss);
      } else {
        boss.entryProgress = 1;
        boss.x += boss.dir * boss.speed;
        if (boss.x < boss.r + 10 || boss.x > W - boss.r - 10) boss.dir *= -1;
        boss.rot += 0.01;

        // Boss telegraph: setiap beberapa tembakan, beri peringatan singkat lalu lepaskan serangan berat (fireHeavy).
        if (bossTelegraphTimer > 0) {
          bossTelegraphTimer--;
          if (bossTelegraphTimer === 0) {
            const lvlD = level;
            const shots = bdef.fireHeavy ? bdef.fireHeavy(boss, player.x, player.y, lvlD) : bdef.fire(boss, player.x, player.y, lvlD);
            if (enemyBullets.length < ENEMY_BULLET_CAP) { enemyBullets.push(...shots); sfx.enemyShoot(); triggerShake(6); }
          }
        } else {
          const phaseSpeedMult = bossPhase3 ? 0.45 : (bossPhase2 ? 0.65 : 1);
          bossFireTimer++;
          if (bossFireTimer > bdef.fireDelay(level) * phaseSpeedMult) {
            bossFireTimer = 0;
            bossShotCount++;
            const heavyDue = (bossPhase2 || bossPhase3) && bossShotCount % 4 === 0;
            if (heavyDue && bdef.fireHeavy) {
              bossTelegraphTimer = 26; bossTelegraphKind = 'heavy';
            } else if (enemyBullets.length < ENEMY_BULLET_CAP) {
              enemyBullets.push(...bdef.fire(boss, player.x, player.y, level)); sfx.enemyShoot();
            }
          }
        }

        for (let bi = bullets.length - 1; bi >= 0; bi--) {
          const b = bullets[bi];
          const dx = b.x - boss.x, dy = b.y - boss.y;
          if (dx * dx + dy * dy < (boss.r + b.r) * (boss.r + b.r)) {
            if (b.pierce) { if (b.hitBoss) continue; b.hitBoss = true; }
            let dmg = b.dmg;
            if (Math.random() < planetPassiveMods.critChance) { dmg *= 1.5; spawnTextPop(b.x, b.y - 10, 'CRIT!', COLORS.amber); }
            boss.hp -= dmg; if (!b.pierce) bullets.splice(bi, 1);
            if (b.rocket) spawnRocketBlast(b.x, b.y, rocketBlastColor(b.kind));
            sfx.bossHit(); if (!b.rocket) spawnImpact(b.x, b.y, bdef.color);
            bossBarFill.style.width = Math.max(0, (boss.hp / boss.maxHp) * 100) + '%';
            if (!bossPhase2 && boss.hp <= boss.maxHp * 0.5) {
              bossPhase2 = true;
              boss.speed *= 1.15;
              triggerShake(10);
              burstFx(boss.x,boss.y,bdef.color,22,{speedMin:1.2,speedMax:4.2,shape:'shard',life:26,gravity:-.01});
              sfx.bossPhase();
              queueBigBanner({ type: 'warn', tag: 'PHASE 2', title: 'BOSS BERSERK', sub: `${bdef.name} menjadi lebih agresif!`, duration: 1200, shake: true });
            } else if (!bossPhase3 && boss.hp <= boss.maxHp * 0.2) {
              bossPhase3 = true;
              boss.speed *= 1.15;
              triggerShake(12);
              burstFx(boss.x,boss.y,bdef.color,30,{speedMin:1.5,speedMax:5.0,shape:'diamond',life:30,gravity:-.015});
              sfx.bossPhase();
              queueBigBanner({ type: 'warn', tag: 'PHASE 3', title: 'BOSS MENGAMUK', sub: `${bdef.name} melancarkan serangan penuh!`, duration: 1200, shake: true });
            }
          }
        }
        if (bossTelegraphTimer > 0) drawBossTelegraph(boss);
        if (rectCircleCollide(player.x, player.y, player.w, player.h, boss.x, boss.y, boss.r)) {
          takeHit(50); if (!running) { ctx.restore(); return; }
        }
        if (boss.hp <= 0) {
          const isMini = bossKind === 'mini';
          const reward = Math.round((isMini ? 35 + level * 6 : 60 + level * 10) * 1.10);
          wallet += reward; coinsThisRun += reward;
          registerKill(isMini ? 60 : 100);
          bossesDefeated++;
          sfx.bossDown(); triggerShake(isMini ? 10 : 16);
          spawnExplosion(boss.x, boss.y, bdef.color);
          spawnTextPop(boss.x, boss.y, `${isMini ? 'MINI BOSS' : 'BOSS'} KALAH! +${reward}💰`, bdef.color);
          queueBigBanner({ type: 'success', tag: isMini ? 'MINI BOSS DEFEATED' : 'BOSS DEFEATED', title: bdef.name, sub: `+${reward}💰 COIN · +${isMini?60:100} SCORE`, duration: 1400 });
          boss = null; bossActive = false; bossPhase2 = false; bossPhase3 = false; bossTelegraphTimer = 0; bossBarWrap.style.display = 'none'; enemyBullets = [];
          bossKind = null;
          updateHud(); checkAchievements(); saveProgress();
          // Langsung tuntaskan level (bukan maybeLevelUp) supaya boss tidak ke-spawn ulang berkali-kali.
          completeLevel();
        } else drawBoss(boss);
      }
    }

    enemyBullets.forEach(b => {
      if (b.curve) { const ang = Math.atan2(b.vy, b.vx) + b.curve; const spd = Math.hypot(b.vx, b.vy); b.vx = Math.cos(ang) * spd; b.vy = Math.sin(ang) * spd; }
      b.x += b.vx; b.y += b.vy;
    });
    enemyBullets = enemyBullets.filter(b => b.y < H + 10 && b.x > -20 && b.x < W + 20);
    enemyBullets.forEach(drawEnemyBullet);
    for (let bi = enemyBullets.length - 1; bi >= 0; bi--) {
      const b = enemyBullets[bi];
      if (rectCircleCollide(player.x, player.y, player.w, player.h, b.x, b.y, b.r)) {
        const dmg = b.dmg != null ? b.dmg : Math.min(28, 12 + level * 0.9);
        enemyBullets.splice(bi, 1);
        takeHit(dmg);
        if (!running) { ctx.restore(); return; }
      }
    }

    for (let pi = pickups.length - 1; pi >= 0; pi--) {
      const pu = pickups[pi]; pu.y += pu.vy;
      if (pu.y > H + 20) { pickups.splice(pi, 1); continue; }
      drawPickup(pu);
      if (rectCircleCollide(player.x, player.y, player.w, player.h, pu.x, pu.y, 14)) {
        sfx.powerup();
        if (pu.type === 'shield') { shieldTimer = SHIELD_TIMER_MAX; spawnTextPop(pu.x, pu.y, 'PERISAI AKTIF!', COLORS.cyan); }
        else if (pu.type === 'rapid') { rapidFireTimer = RAPID_FIRE_MAX; spawnTextPop(pu.x, pu.y, 'RAPID FIRE!', COLORS.amber); }
        else if (pu.type === 'energyFull') { energy = maxEnergy; spawnTextPop(pu.x, pu.y, 'ENERGI PENUH!', COLORS.cyan); updateCombatHud(); }
        else { playerHP = Math.min(maxHPPool, playerHP + maxHPPool * 0.25); spawnTextPop(pu.x, pu.y, '+25% HP', COLORS.coral); updateHPUI(); updateHud(); }
        pickups.splice(pi, 1);
      }
    }

    for (let si = sparks.length - 1; si >= 0; si--) {
      const s = sparks[si]; s.x += s.vx; s.y += s.vy; s.vx *= 0.94; s.vy *= 0.94; s.life--;
      ctx.globalAlpha = Math.max(s.life / 30, 0); ctx.fillStyle = s.color;
      if(s.ring){ctx.globalCompositeOperation='lighter';ctx.strokeStyle=s.color;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(s.x,s.y,s.r*(1+(30-s.life)*.08),0,Math.PI*2);ctx.stroke();ctx.globalCompositeOperation='source-over';}
      else {ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();}
      ctx.globalAlpha = 1;
      if (s.life <= 0) sparks.splice(si, 1);
    }

    for (let pi = particles.length - 1; pi >= 0; pi--) {
      const p = particles[pi]; p.y += p.vy; p.life--;
      ctx.globalAlpha = Math.max(p.life / (p.small ? 22 : 40), 0); ctx.fillStyle = p.color;
      ctx.font = (p.small ? 'bold 10px Nunito' : 'bold 13px Nunito'); ctx.textAlign = 'center'; ctx.fillText(p.text, p.x, p.y); ctx.globalAlpha = 1;
      if (p.life <= 0) particles.splice(pi, 1);
    }

    ctx.restore();
    requestAnimationFrame(loop);
  }

  function pauseGame() {
    if (!running || paused) return;
    sfx.pause();
    paused = true;
    pauseBtn.style.display='none';
    pausePanel.style.display='block';
    overlay.style.display='flex';
    menuPanel.style.display='none'; shopPanel.style.display='none'; customizePanel.style.display='none'; missionPanel.style.display='none'; gameOverPanel.style.display='none'; mapPanel.style.display='none';
  }
  function resumeGame() {
    if (!running || !paused) return;
    sfx.ui();
    paused = false;
    pausePanel.style.display='none';
    overlay.style.display='none';
    pauseBtn.style.display='block';
    requestAnimationFrame(loop);
  }
  function exitGame() {
    // EXIT dari pause = batalkan seluruh progres RUN yang sedang dimainkan.
    // Tidak ada resume dari level/HP/score/koin hasil run sebelumnya.
    running = false; paused = false; midGameBreak = false; pendingLevelAdvance = null;

    // Hentikan dan bersihkan seluruh objek gameplay aktif.
    bullets = []; enemies = []; enemyBullets = []; pickups = []; particles = []; sparks = []; meteors = []; meteorTimer = 0; fxParticles = [];
    boss = null; bossActive = false; bossFireTimer = 0; bossDefIdx = 0;
    bossPhase2 = false; bossPhase3 = false; bossShotCount = 0; bossTelegraphTimer = 0; bossTelegraphKind = null;
    playerHP = 100; enemiesSpawnedThisLevel = 0; levelTransitionTimer = 0;
    playerShield = maxShield; shieldRegenDelay = 0; shieldTimer = 0; rapidFireTimer = 0;
    combo = 0; comboTimer = 0; coinsThisRun = 0; playerInvuln = 0;
    mouseActive = false; mouseTargetX = null; mouseTargetY = null; keys = {};

    pauseBtn.style.display='none'; pausePanel.style.display='none';
    bossBarWrap.style.display='none'; waveTag.style.display='none'; planetTag.style.display='none';
    hud.style.display = 'none';
    // Semua HUD khusus gameplay wajib hilang saat kembali ke menu.
    astroCombatHud.style.display = 'none';
    energyMeter.style.display = 'none';
    armorMeter.style.display = 'none';
    rapidBuffBadge.style.display = 'none';
    shieldBuffBadge.style.display = 'none';
    hpWrap.style.display = 'none';
    waveTag.style.display = 'none';
    planetTag.style.display = 'none';
    clearGameplayCanvas();
    overlay.style.display='flex';
    setBgMode('menu');
    menuPanel.style.display='flex'; menuPanel.style.flexDirection='column'; menuPanel.style.alignItems='center';
    shopPanel.style.display='none'; customizePanel.style.display='none'; missionPanel.style.display='none'; gameOverPanel.style.display='none'; mapPanel.style.display='none';

    // Kembalikan state permainan ke kondisi awal level yang dipilih.
    saveProgress();
    initState();
    refreshWallet();
    updateHud();
    requestAnimationFrame(menuBgLoop);
  }

  function startGame() {
    ensureAudio(); gameOverPanel.style.display='none'; menuPanel.style.display='none'; shopPanel.style.display='none'; customizePanel.style.display='none'; missionPanel.style.display='none'; settingsPanel.style.display='none'; mapPanel.style.display='none'; initState(); overlay.style.display = 'none'; running = true; paused = false; pauseBtn.style.display='block';
    hud.style.display = 'flex'; if(astroCombatHud) astroCombatHud.style.display='flex'; if(energyMeter) energyMeter.style.display='block'; if(armorMeter) armorMeter.style.display='block'; planetTag.style.display = 'block';
    const p = getPlanetForLevel(level);
    const discoveredNow = !discoveredPlanets.has(p.id);
    if (discoveredNow) { discoveredPlanets.add(p.id); lsSaveSet(LS_KEYS.planets, discoveredPlanets); saveProgress(); }
    showPlanetIntro(p, discoveredNow);
    if (isBossLevel(level)) setTimeout(() => { if (running) showLevelBanner(`LEVEL ${level}<br>⚠️ BOSS`); }, discoveredNow ? 1900 : 1400);
    requestAnimationFrame(loop);
  }