  // ---- METEOR ENVIRONMENTAL HAZARD ----
  // Meteor bukan enemy baru: hanya hazard ringan dengan HP/collision sederhana.
  const METEOR_THEMES = [
    { rock:'#3A214F', mid:'#704C86', hot:'#FF62C8', glow:'#B98CE0', trail:'#C77DFF', particle:'#E7B5FF', crystal:'#B98CE0', type:'nebula' },
    { rock:'#5A7180', mid:'#9ED8EA', hot:'#D8FAFF', glow:'#66D9EF', trail:'#BFEFFF', particle:'#E8FBFF', crystal:'#9DE7FF', type:'ice' },
    { rock:'#3B1A18', mid:'#7B2B20', hot:'#FF7A2F', glow:'#FF4D32', trail:'#FF9F6B', particle:'#FFD0A8', crystal:'#FF8A45', type:'lava' },
    { rock:'#171323', mid:'#3A204B', hot:'#FF4DCE', glow:'#C77DFF', trail:'#8F7CFF', particle:'#E3B7FF', crystal:'#FF4D8D', type:'void' },
    { rock:'#26334A', mid:'#647FAE', hot:'#E9FBFF', glow:'#9DE7FF', trail:'#C77DFF', particle:'#F4F2FF', crystal:'#C77DFF', type:'crystal' }
  ];

  function meteorTheme(){ return METEOR_THEMES[currentPlanetId] || METEOR_THEMES[0]; }
  function meteorWaveConfig(){
    const w = 1 + Math.min(4, Math.floor((enemiesSpawnedThisLevel / Math.max(1, enemiesTargetThisLevel)) * 5));
    return {
      interval: Math.max(74, 145 - w * 9) * diff.spawnDelayMult,
      speedMin: 1.55 + Math.min(1.25, (w - 1) * 0.12),
      speedMax: 2.45 + Math.min(1.75, (w - 1) * 0.16),
      angle: 0.16 + Math.min(0.30, (w - 1) * 0.018)
    };
  }
  function meteorShapePoints(r, variant){
    const counts = variant === 0 ? 9 : variant === 1 ? 10 : 11;
    const pts=[];
    for(let i=0;i<counts;i++){
      const a=(i/counts)*Math.PI*2;
      const wobble=0.72 + Math.random()*0.46;
      pts.push({x:Math.cos(a)*r*wobble,y:Math.sin(a)*r*wobble});
    }
    return pts;
  }
  function spawnMeteor(){
    if(!running || paused || bossWaitingEntry || levelTransitionTimer>0 || meteors.length>=METEOR_CAP) return;
    const cfg=meteorWaveConfig();
    const roll=Math.random();
    const size=roll<0.55?{name:'small',r:10+Math.random()*4,hp:2}:{name:'medium',r:15+Math.random()*5,hp:4};
    if(roll>0.88) Object.assign(size,{name:'large',r:23+Math.random()*7,hp:8});
    const x=Math.random()*(W+70)-35;
    const dir=(Math.random()<0.5?-1:1)*(0.12+Math.random()*cfg.angle);
    const speed=cfg.speedMin+Math.random()*(cfg.speedMax-cfg.speedMin);
    const theme=meteorTheme();
    const m={x,y:-size.r-18,r:size.r,hp:size.hp,maxHp:size.hp,size:size.name,vx:dir*speed*0.72,vy:speed,
      rot:Math.random()*Math.PI*2,rotSpeed:(Math.random()-.5)*0.055,seed:Math.random()*1000,
      points:meteorShapePoints(size.r,Math.floor(Math.random()*3)),theme,warning:size.name==='large'?26:0,hitCooldown:0};
    meteors.push(m);
    if(m.warning>0) sfx.meteorWarn();
  }

  function drawMeteor(m){
    const t=m.theme||meteorTheme();
    ctx.save();
    if(m.warning>0){
      const pulse=.28+Math.sin(animTick*.75)*.16; ctx.globalAlpha=Math.max(.1,pulse);
      ctx.strokeStyle=t.hot; ctx.lineWidth=1.2; ctx.setLineDash([3,7]);
      ctx.beginPath();ctx.moveTo(m.x,0);ctx.lineTo(m.x+m.vx*18,Math.min(H,m.y+115));ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=t.hot;ctx.beginPath();ctx.arc(m.x,12,2.2+Math.sin(animTick*.5),0,Math.PI*2);ctx.fill();
    }
    // Directional trail made from tapered streaks, not circles.
    ctx.globalCompositeOperation='lighter';
    const trailLen=m.size==='large'?44:m.size==='medium'?32:24;
    for(let i=trailLen;i>2;i-=4){
      const q=i/trailLen,tx=m.x-m.vx*i*.9,ty=m.y-m.vy*i*.9;
      ctx.globalAlpha=(1-q)*.22; ctx.strokeStyle=t.trail; ctx.lineWidth=Math.max(.6,m.r*(.05+(1-q)*.11));
      ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx-m.vx*2.2,ty-m.vy*2.2);ctx.stroke();
    }
    ctx.globalAlpha=.12+Math.sin(animTick*.18+m.seed)*.04;ctx.fillStyle=t.glow;ctx.beginPath();ctx.arc(m.x,m.y,m.r*1.7,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    ctx.translate(m.x,m.y);ctx.rotate(m.rot);
    // Dark rocky body with irregular silhouette and faceted planes.
    ctx.beginPath();m.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
    const rg=ctx.createRadialGradient(-m.r*.38,-m.r*.42,m.r*.05,0,0,m.r*1.2);
    rg.addColorStop(0,t.mid);rg.addColorStop(.48,t.rock);rg.addColorStop(1,'#05060A');ctx.fillStyle=rg;ctx.fill();
    ctx.strokeStyle=t.hot;ctx.globalAlpha=.7;ctx.lineWidth=1.1;ctx.stroke();ctx.globalAlpha=1;
    // Facets.
    ctx.fillStyle='rgba(255,255,255,.09)';ctx.beginPath();ctx.moveTo(-m.r*.55,-m.r*.25);ctx.lineTo(-m.r*.1,-m.r*.7);ctx.lineTo(m.r*.48,-m.r*.25);ctx.lineTo(m.r*.05,m.r*.05);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.moveTo(-m.r*.48,m.r*.3);ctx.lineTo(-m.r*.05,m.r*.05);ctx.lineTo(m.r*.55,m.r*.4);ctx.lineTo(m.r*.12,m.r*.72);ctx.closePath();ctx.fill();
    // Craters with raised rims.
    const craterCount=m.size==='large'?5:m.size==='medium'?3:2;
    for(let i=0;i<craterCount;i++){
      const a=(i*2.17+m.seed*.013)%(Math.PI*2),d=m.r*(.12+.29*((i+2)%3)/2),cx=Math.cos(a)*d,cy=Math.sin(a)*d,cr=m.r*(.075+.035*(i%3));
      ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(cx,cy,cr*1.35,cr*.82,a,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=.8;ctx.stroke();
    }
    // Planet-specific energy cracks.
    ctx.strokeStyle=t.hot;ctx.globalAlpha=.82;ctx.lineWidth=Math.max(1,m.r*.055);
    const cracks=[[-.62,-.05,-.18,-.2,.12,-.02,.54,-.14],[-.22,.62,-.05,.18,.24,.28,.52,.12]];
    cracks.forEach(c=>{ctx.beginPath();ctx.moveTo(c[0]*m.r,c[1]*m.r);for(let k=2;k<c.length;k+=2)ctx.lineTo(c[k]*m.r,c[k+1]*m.r);ctx.stroke();});ctx.globalAlpha=1;
    // Hot core + tiny planet-specific particles.
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.48+Math.sin(animTick*.22+m.seed)*.18;ctx.fillStyle=t.hot;ctx.beginPath();ctx.arc(-m.r*.25,-m.r*.3,m.r*.12,0,Math.PI*2);ctx.fill();
    if(t.type==='lava'){ctx.fillStyle='#FFD08A';for(let i=0;i<3;i++){ctx.beginPath();ctx.arc((i-1)*m.r*.3,m.r*.72+Math.sin(animTick+i)*1.5,m.r*.035,0,Math.PI*2);ctx.fill();}}
    if(t.type==='crystal'){ctx.fillStyle=t.crystal;for(let i=0;i<4;i++){const a=-2+i*.7,x=Math.cos(a)*m.r*.6,y=Math.sin(a)*m.r*.55;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+m.r*.08,y-m.r*.32);ctx.lineTo(x+m.r*.2,y);ctx.closePath();ctx.fill();}}
    ctx.restore();
  }

  function meteorBreak(m){
    const t=m.theme||meteorTheme();
    for(let i=0;i<(m.size==='large'?11:m.size==='medium'?7:4);i++){
      const a=Math.random()*Math.PI*2, sp=1.2+Math.random()*3.1;
      sparks.push({x:m.x,y:m.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:18+Math.random()*12,color:i%2?t.hot:t.particle,r:1+Math.random()*2});
    }
    burstFx(m.x,m.y,t.particle,m.size==='large'?20:m.size==='medium'?12:8,{speedMin:1.5,speedMax:5.2,shape:m.size==='large'?'shard':'diamond',life:24+Math.random()*18,gravity:.035});
    spawnExplosion(m.x,m.y,t.glow); sfx.meteorBreak(); score+=m.size==='large'?8:m.size==='medium'?5:3; updateHud();
  }

  function updateMeteors(){
    if(!running||paused)return;
    const cfg=meteorWaveConfig();
    meteorTimer++;
    // Boss/transisi level diberi ruang agar meteor tidak menumpuk saat layar sedang berubah.
    if(!bossActive && levelTransitionTimer<=0 && meteorTimer>cfg.interval && meteors.length<METEOR_CAP){
      meteorTimer=0; spawnMeteor();
    }
    for(let mi=meteors.length-1;mi>=0;mi--){
      const m=meteors[mi];
      if(m.warning>0)m.warning--;
      m.x+=m.vx; m.y+=m.vy; m.rot+=m.rotSpeed;
      if(Math.random()<.48 && fxParticles.length<FX_CAP){
        addFx(m.x-m.vx*2,m.y-m.vy*2,{color:m.theme.particle,speed:.15+Math.random()*.6,angle:Math.atan2(m.vy,m.vx)+Math.PI+(Math.random()-.5)*.7,life:10+Math.random()*12,r:.6+Math.random()*1.4,shape:m.theme.type==='crystal'?'diamond':'dot',gravity:.005});
      }
      if(m.hitCooldown>0)m.hitCooldown--;
      // Projectile pemain dapat menghancurkan meteor.
      let destroyed=false;
      for(let bi=bullets.length-1;bi>=0;bi--){
        const b=bullets[bi];
        const dx=b.x-m.x,dy=b.y-m.y;
        if(dx*dx+dy*dy<(m.r+b.r*.85)*(m.r+b.r*.85)){
          if(b.pierce){ if(!b.hitMeteors) b.hitMeteors=new Set(); if(b.hitMeteors.has(m)) continue; b.hitMeteors.add(m); }
          m.hp-=b.dmg||1;
          if(!b.pierce)bullets.splice(bi,1);
          spawnImpact(b.x,b.y,m.theme.glow);
          if(m.hp<=0){meteorBreak(m);meteors.splice(mi,1);destroyed=true;break;}
        }
      }
      if(destroyed)continue;
      // Satu meteor tidak bisa memberi damage berulang karena hitCooldown + takeHit() I-frame.
      if(m.hitCooldown<=0 && rectCircleCollide(player.x,player.y,player.w,player.h,m.x,m.y,m.r*.88)){
        takeHit(m.size==='large'?20:m.size==='medium'?13:8);
        m.hitCooldown=INVULN_FRAMES;
        spawnImpact(m.x,m.y,m.theme.hot);sfx.meteorHit();
      }
      if(m.y-m.r>H+20||m.x<-60||m.x>W+60)meteors.splice(mi,1);
    }
  }

  function spawnEnemy() {
    const types = availableTypes(level);
    if (!types.length || enemiesSpawnedThisLevel >= enemiesTargetThisLevel) return;
    // Tanpa sistem wave: tipe musuh dipilih acak dari semua yang sudah terbuka di level ini,
    // supaya beberapa jenis musuh bisa muncul bersamaan dan terasa lebih ramai/hidup.
    const type = types[Math.floor(Math.random() * types.length)];
    if (!seenEnemies.has(type)) {
      seenEnemies.add(type); lsSaveSet(LS_KEYS.enemies, seenEnemies);
      queueEnemyIntroToast(ENEMY_NAMES[type] || type, ENEMY_INTRO_DESC[type] || '');
    }
    const def = ENEMY_TYPES[type];
    const r = def.r[0] + Math.random() * (def.r[1] - def.r[0]);
    // HP musuh meningkat berdasarkan level dan seberapa jauh progres di level ini.
    const progress = enemiesSpawnedThisLevel / Math.max(1, enemiesTargetThisLevel);
    const scaledEnemyHP = Math.max(
      def.hp,
      Math.ceil(def.hp + (level - 1) * 0.7 + progress * 6)
    );
    if (type === 'orbiter') {
      enemies.push({ type, x: Math.random() * (W - r * 2) + r, y: -r, r, hp: scaledEnemyHP, maxHp: scaledEnemyHP,
        speed: (def.baseSpeed + level * 0.06) * diff.speedMult,
        rot: 0, seed: Math.random() * 100, targetX: player.x });
    } else {
      enemies.push({ type, x: Math.random() * (W - r * 2) + r, y: -r, r, hp: scaledEnemyHP, maxHp: scaledEnemyHP,
        speed: (def.baseSpeed + Math.random() * 0.5 + level * 0.08) * diff.speedMult,
        rot: 0, rotSpeed: (Math.random() - 0.5) * 0.08, seed: Math.random() * 100,
        targetX: player.x, fireTimer: Math.random() * 50 });
    }
    enemiesSpawnedThisLevel++;
  }

  function spawnBoss(kind = 'main') {
    const planet = getPlanetForLevel(level);
    const isMini = kind === 'mini';
    bossKind = isMini ? 'mini' : 'main';
    bossDefIdx = (isMini ? planet.miniBoss : planet.boss) % BOSS_DEFS.length;
    const def = BOSS_DEFS[bossDefIdx];
    const hpMult = isMini ? 0.4 : 1;
    boss = { x: W / 2, y: 90, r: isMini ? 36 : 46, hp: (220 + level * 48) * diff.bossHpMult * hpMult, maxHp: (220 + level * 48) * diff.bossHpMult * hpMult,
      dir: 1, speed: (2.5 + level * 0.22) * diff.speedMult, rot: 0, entryProgress: 0 };
    bossActive = true; bossFireTimer = 0; bossPhase2 = false; bossPhase3 = false; bossShotCount = 0; bossTelegraphTimer = 0; bossTelegraphKind = null; bossEntryTimer = 34; sfx.bossEnter();
    bossBarWrap.style.display = 'block';
    bossLabel.textContent = (isMini ? 'MINI BOSS · ' : 'BOSS · ') + def.name;
    bossBarFill.style.width = '100%';
  }

  function spawnCoinPop(x, y, amount) { particles.push({ x, y, text: `+${amount}`, life: 40, vy: -1.2, color: COLORS.amber }); }
  function spawnTextPop(x, y, text, color) { particles.push({ x, y, text, life: 55, vy: -1.0, color }); }
  function spawnDamagePop(x, y, dmg) { particles.push({ x: x + (Math.random()*10-5), y, text: Math.round(dmg), life: 22, vy: -1.4, color: COLORS.white, small: true }); }

  function rectCircleCollide(rx, ry, rw, rh, cx, cy, cr) {
    const closestX = Math.max(rx - rw / 2, Math.min(cx, rx + rw / 2));
    const closestY = Math.max(ry - rh / 2, Math.min(cy, ry + rh / 2));
    const dx = cx - closestX, dy = cy - closestY;
    return dx * dx + dy * dy < cr * cr;
  }

  function updateHPUI() {
    const pct = Math.max(0, Math.round((playerHP / maxHPPool) * 100));
    hpFill.style.width = pct + '%'; hpLabel.textContent = 'HP ' + pct + '%';
    hpFill.style.background = pct <= 30 ? 'linear-gradient(90deg,#FF6B6B,#FF9A9A)' : 'linear-gradient(90deg,#4ECDC4,#7AE5DC)';
    hpWrap.classList.toggle('low-hp', pct > 0 && pct <= 25);
    if (pct > 0 && pct <= 25 && !lowHpWarned) {
      lowHpWarned = true;
      queueBigBanner({ type: 'warn', tag: '⚠ WARNING', title: 'LOW HP WARNING', sub: 'Segera hindari serangan musuh!', duration: 1100 });
    } else if (pct > 25) { lowHpWarned = false; }
  }
  function updateWaveUI() {
    const shown = Math.min(enemiesSpawnedThisLevel, enemiesTargetThisLevel);
    waveTagText.textContent = `MUSUH ${shown}/${enemiesTargetThisLevel}`;
    if (waveEnemyCount) waveEnemyCount.textContent = `MUSUH ${shown}/${enemiesTargetThisLevel}`;
    waveBarFill.style.width = Math.max(0, Math.min(100, shown / enemiesTargetThisLevel * 100)) + '%';
  }

  function heartsDisplay() {
    const pct = (playerHP / maxHPPool) * 100;
    const hearts = Math.ceil(pct / 25);
    return hearts > 0 ? '❤'.repeat(hearts) + '🖤'.repeat(4 - hearts) : '💀';
  }

  function updateHud() {
    scoreVal.textContent = score;
    livesVal.textContent = heartsDisplay();
    coinVal.textContent = wallet;
    levelVal.textContent = level;
    killsVal.textContent = killsThisRun;
    if (waveEnemyCount) waveEnemyCount.textContent = `MUSUH ${Math.min(enemiesSpawnedThisLevel, enemiesTargetThisLevel)}/${enemiesTargetThisLevel}`;
    if (combo >= 2) {
      comboTag.style.opacity = '1'; comboTag.textContent = `COMBO x${combo} (${comboMultiplier().toFixed(1)}x)`;
      comboTag.style.fontSize = combo >= 10 ? '13px' : (combo >= 5 ? '11.5px' : '10px');
    }
    else comboTag.style.opacity = '0';
  }

  function showLevelBanner(text) { levelBanner.innerHTML = text; levelBanner.style.opacity = '1'; setTimeout(() => { levelBanner.style.opacity = '0'; }, 1300); }

  function registerKill(baseScore) {
    combo++; comboTimer = COMBO_WINDOW;
    maxComboSeen = Math.max(maxComboSeen, combo);
    if (combo >= 2 && combo % 5 === 0) sfx.combo();
    score += Math.round(baseScore * comboMultiplier());
  }

  function maybeLevelUp() {
    if (bossActive || levelTransitionTimer > 0) return;
    // Tanpa sistem wave: satu level tuntas begitu jumlah musuh yang dijadwalkan sudah habis dibereskan.
    if (enemiesSpawnedThisLevel >= enemiesTargetThisLevel && enemies.length === 0) {
      if (isMainBossLevel(level) || isMiniBossLevel(level)) {
        if (!bossActive && levelTransitionTimer <= 0) {
          levelTransitionTimer = 110;
          const kind = isMainBossLevel(level) ? 'main' : 'mini';
          const planet = getPlanetForLevel(level);
          const bdef = BOSS_DEFS[(kind === 'mini' ? planet.miniBoss : planet.boss) % BOSS_DEFS.length];
          sfx.bossWarning(); queueBigBanner({ type: 'warn', tag: '⚠ WARNING', title: kind === 'mini' ? 'MINI BOSS TERDETEKSI' : 'BOSS TERDETEKSI', sub: bdef.name.toUpperCase(), duration: 1500, shake: true });
          setTimeout(() => { if (running && !bossActive) { levelTransitionTimer = 0; spawnBoss(kind); } }, 1100);
        }
      } else {
        completeLevel();
      }
    }
  }

  function showPlanetIntro(planet, discoveredNow) {
    const type = planet.id === 4 ? 'crystara' : 'info';
    if (discoveredNow) {
      queueBigBanner({ type, tag: 'PLANET DISCOVERED', title: `${planet.name}<br><span style="font-size:0.7em">SECTOR ${planet.sector}</span>`, sub: `"${planet.desc}"`, duration: 1800 });
    } else {
      queueBigBanner({ type, tag: `PLANET ${planet.name.toUpperCase()}`, title: `SECTOR ${planet.sector}`, sub: planet.desc, duration: 1300 });
    }
  }

  function completeLevel() {
    levelTransitionTimer = 80;
    const prevPlanet = getPlanetForLevel(level);
    maxLevelReached = Math.max(maxLevelReached, Math.min(50, level + 1));
    const next = level + 1;
    if (next <= 50) {
      const nextPlanet = getPlanetForLevel(next);
      const planetChanged = nextPlanet.id !== prevPlanet.id;
      if (planetChanged) {
        planetsCleared++;
        queueBigBanner({ type: 'success', tag: 'PLANET CLEARED', title: prevPlanet.name.toUpperCase(), sub: `Level ${prevPlanet.levels.join(', ')} selesai · +Reward`, duration: 1500 });
        checkAchievements(); saveProgress();
      } else {
        showLevelBanner(`LEVEL ${level} SELESAI!<br>Bersiap upgrade...`);
      }
      saveProgress();
      setTimeout(() => {
        if (!running || levelTransitionTimer <= 0) return;
        // Siapkan aksi lanjutan ke level berikutnya, lalu jeda dulu untuk upgrade di Armory.
        pendingLevelAdvance = () => {
          level = next; enemiesSpawnedThisLevel = 0; enemiesTargetThisLevel = enemyTargetForLevel(level);
          enemyBullets = [];
          themeIdx = nextPlanet.theme; currentPlanetId = nextPlanet.id; levelTransitionTimer = 0; updateHud(); updateWaveUI(); updatePlanetTag();
          // HP & perisai TIDAK di-reset di sini secara sengaja — nilainya harus terbawa dari level sebelumnya.
          // Kita hanya paksa HUD untuk menggambar ulang nilai yang sudah ada (bukan mengganti nilainya),
          // supaya bar HP/perisai di layar tidak sempat terlihat "penuh lagi"/salah saat level baru mulai.
          updateHPUI(); updateCombatHud();
          initEnvParticles(THEMES[nextPlanet.theme].env);
          if (planetChanged) {
            const wasDiscovered = discoveredPlanets.has(nextPlanet.id);
            if (!wasDiscovered) { discoveredPlanets.add(nextPlanet.id); lsSaveSet(LS_KEYS.planets, discoveredPlanets); saveProgress();
              queueBigBanner({ type: 'success', tag: 'NEW PLANET UNLOCKED', title: nextPlanet.name.toUpperCase(), sub: `Sector ${nextPlanet.sector} kini terbuka!`, duration: 1500 });
            }
            setTimeout(() => showPlanetIntro(nextPlanet, false), wasDiscovered ? 0 : 1600);
          } else {
            showLevelBanner(`${nextPlanet.icon} LEVEL ${next}`);
          }
        };
        openUpgradeBreak();
      }, planetChanged ? 1200 : 900);
    } else { endGame(true); }
  }

