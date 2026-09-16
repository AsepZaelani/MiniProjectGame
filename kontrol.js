  // ===== Mouse combat controls =====
  // Klik kiri = senjata utama. Tahan klik kiri untuk terus menembak mengikuti fire rate.
  // Klik kanan = roket, satu peluncuran setiap klik.
  let mouseWeaponHeld = false;
  let mouseRocketHeld = false;
  document.addEventListener('contextmenu', e => { if(running && !paused) e.preventDefault(); });
  document.addEventListener('mousedown', e => {
    if(!running || paused) return;
    if(e.button===0){
      e.preventDefault();
      mouseWeaponHeld = true;
      fireWeaponOnce();
    } else if(e.button===2){
      e.preventDefault();
      mouseRocketHeld = true;
      fireRocket();
    }
  });
  window.addEventListener('mouseup', e => {
    if(e.button===0) mouseWeaponHeld = false;
    if(e.button===2) mouseRocketHeld = false;
  });
  window.addEventListener('blur', () => { mouseWeaponHeld = false; mouseRocketHeld = false; });

  // ===== Tombol alternatif menembak =====
  const laserFireBtn = document.getElementById('laserFireBtn');
  const rocketFireBtn = document.getElementById('rocketFireBtn');
  let lastLaserBtnFire = 0, lastRocketBtnFire = 0;
  if (laserFireBtn) {
    const pressLaser = e => {
      e.preventDefault(); if(!running || paused) return;
      const now = performance.now(); if (now - lastLaserBtnFire < 150) return; lastLaserBtnFire = now;
      fireWeaponOnce();
      laserFireBtn.classList.add('pressed');
      setTimeout(() => laserFireBtn.classList.remove('pressed'), 120);
    };
    // pointerdown untuk perangkat modern; click sebagai cadangan bila Pointer Events tidak stabil (WebView lama).
    laserFireBtn.addEventListener('pointerdown', pressLaser);
    laserFireBtn.addEventListener('click', pressLaser);
    laserFireBtn.addEventListener('contextmenu', e => e.preventDefault());
  }
  if (rocketFireBtn) {
    const pressRocket = e => {
      e.preventDefault(); if(!running || paused) return;
      const now = performance.now(); if (now - lastRocketBtnFire < 150) return; lastRocketBtnFire = now;
      fireRocket();
      rocketFireBtn.classList.add('pressed');
      setTimeout(() => rocketFireBtn.classList.remove('pressed'), 120);
    };
    rocketFireBtn.addEventListener('pointerdown', pressRocket);
    rocketFireBtn.addEventListener('click', pressRocket);
    rocketFireBtn.addEventListener('contextmenu', e => e.preventDefault());
  }
  // C = alternatif senjata, Z = alternatif roket. C bisa ditahan seperti klik kiri.
  let keyWeaponHeld = false;
  window.addEventListener('keydown', e => {
    if (!running || paused) return;
    const k=e.key.toLowerCase();
    if (k === 'z' && !e.repeat) { e.preventDefault(); fireRocket(); }
    if (k === 'c') { e.preventDefault(); keyWeaponHeld = true; fireWeaponOnce(); }
  });
  window.addEventListener('keyup', e => {
    if (e.key.toLowerCase() === 'c') keyWeaponHeld = false;
  });

  function fireRocket(){
    if(!running || paused || rocketCooldown>0 || rocketAmmo<=0) return;
    const r=getRocket(equippedRocketId); if(!r) return;
    rocketAmmo--; rocketCooldown=r.cooldown;
    const count=r.count||1;
    for(let i=0;i<count;i++){
      const offset=(i-(count-1)/2)*10;
      const spread=(i-(count-1)/2)*0.055;
      const speed=r.speed;
      const baseAngle=-Math.PI/2 + spread;
      const b={x:player.x+offset,y:player.y-22,vx:Math.cos(baseAngle)*speed,vy:Math.sin(baseAngle)*speed,r:5.5,dmg:r.damage,pierce:false,kind:r.kind,weaponId:r.id,rocket:true,homing:true,turn:r.homing ? .12 : .075};
      bullets.push(b);
    }
    // Semua jenis roket otomatis mencari musuh terdekat, bukan hanya Homing Rocket.
    sfx.weapon('homing'); updateCombatHud();
  }
  // Tembakan laser/senjata utama: SATU kali panggil = SATU kali tembakan (tidak ada spam otomatis
  // meski tombolnya ditahan). Setiap pencet/klik/tap harus memanggil fungsi ini sendiri-sendiri.
  function fireWeaponOnce(){
    if(!running || paused) return;
    const activeWeapon = getWeapon(equippedWeaponId);
    if(!activeWeapon || weaponShotTimer > 0) return;
    const ws = activeWeapon.stats(activeWeapon.level);
    const cost = weaponEnergyCost(activeWeapon);
    if (energy < cost) { sfx.fail(); return; }
    const rapidMult = rapidFireTimer > 0 ? 0.45 : 1;
    weaponShotTimer = Math.max(3, Math.round(ws.fireDelay * rapidMult));
    energy -= cost;
    // Selama pemain terus menembak, regen energi ditahan.
    energyRegenLock = 14;
    // Tembakan keluar dari dua sisi (kiri & kanan) sekaligus dalam satu tembakan, bukan bergantian.
    const buildLevelProjectiles = (baseBullets, side) => {
      const arr = baseBullets.map(b => ({
        ...b, dmg:(b.dmg + (shipStats.dmgBonus || 0))*planetPassiveMods.atkMult, weaponId:activeWeapon.id, weaponSide:side
      }));
      // Setiap upgrade level menambah proyektil baru. Proyektil tambahan dibuat menyudut
      // agar peningkatan daya tembak tidak hanya berupa garis lurus.
      const extraCount = Math.max(0, activeWeapon.level - 1);
      const anchor = arr[0];
      if(anchor && extraCount > 0){
        const speed = Math.hypot(anchor.vx || 0, anchor.vy || 0) || 9;
        const baseAngle = Math.atan2(anchor.vy || -speed, anchor.vx || 0);
        const angles = [-0.18,-0.12,-0.06,0.06,0.12,0.18];
        for(let i=0;i<extraCount;i++){
          const a = baseAngle + angles[i % angles.length];
          arr.push({
            ...anchor,
            vx:Math.cos(a)*speed, vy:Math.sin(a)*speed,
            x:anchor.x + (i%2 ? -2 : 2),
            y:anchor.y,
            dmg:anchor.dmg
          });
        }
      }
      return arr;
    };
    const leftBullets = buildLevelProjectiles(activeWeapon.pattern(player, ws, -22), 'left');
    const rightBullets = buildLevelProjectiles(activeWeapon.pattern(player, ws, 22), 'right');
    bullets.push(...leftBullets, ...rightBullets); sfx.weapon(activeWeapon.id);
    updateCombatHud();
  }
  function switchWeapon(dir=1){
    normalizeWeaponLoadout();
    const list=equippedWeaponIds; if(!list.length)return;
    equippedWeaponSlot=(equippedWeaponSlot+dir+list.length)%list.length;
    equippedWeaponId=list[equippedWeaponSlot];
    weaponShotTimer=0; sfx.equip(); saveProgress(); updateCombatHud(); notify('SENJATA '+(equippedWeaponSlot+1)+'/'+list.length+': '+getWeapon(equippedWeaponId).name);
  }
  function switchRocket(dir=1){
    const owned=getOwnedRockets(); if(!owned.length)return;
    let i=owned.findIndex(r=>r.id===equippedRocketId); if(i<0)i=0;
    equippedRocketId=owned[(i+dir+owned.length)%owned.length].id; sfx.equip(); saveProgress(); updateCombatHud(); notify('ROKET: '+getRocket(equippedRocketId).name);
  }

  // ---- Mouse control ----
  canvas.addEventListener('mousemove', e => {
    if (!running || paused) return;
    const rect = canvas.getBoundingClientRect();
    mouseTargetX = (e.clientX - rect.left) * (W / rect.width);
    mouseTargetY = (e.clientY - rect.top) * (H / rect.height);
    mouseTargetX = Math.max(20, Math.min(W - 20, mouseTargetX));
    mouseTargetY = Math.max(70, Math.min(H - 45, mouseTargetY));
    mouseActive = true;
  });
  canvas.addEventListener('mouseleave', () => { mouseActive = false; });

  let touchX = null, touchY = null;
  canvas.addEventListener('touchstart', e => {
    mouseActive = false; touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; }, { passive: true });
  canvas.addEventListener('touchmove', e => {
    if (!running || touchX === null) return;
    const nx = e.touches[0].clientX; const ny = e.touches[0].clientY;
    const dx = nx - touchX, dy = ny - touchY;
    player.x += dx * 1.4; player.y += dy * 1.4;
    player.x = Math.max(20, Math.min(W - 20, player.x)); player.y = Math.max(70, Math.min(H - 45, player.y));
    touchX = nx; touchY = ny;
  }, { passive: true });
  canvas.addEventListener('touchend', () => { touchX = null; touchY = null; }, { passive: true });

