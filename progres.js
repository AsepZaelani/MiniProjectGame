  // ---- Persistent save v23: kompatibel dengan save planet/enemy lama ----
  const SAVE_KEY_V23='pn_save_v23';
  function saveProgress(){
    try{
      const data={
        wallet,sessionHigh,totalKills,maxLevelReached,bossesDefeated,maxComboSeen,planetsCleared,rocketAmmoLevel,
        equippedShipId,equippedWeaponId,equippedWeaponIds,equippedWeaponSlot,equippedRocketId,equippedLeftId,equippedRightId,chosenDiff,equippedModuleIds,seenEnemies:[...seenEnemies],discoveredPlanets:[...discoveredPlanets],
        ships:SHIPS.map(s=>({id:s.id,owned:s.owned,level:s.level})),
        weapons:WEAPONS.map(w=>({id:w.id,owned:w.owned,level:w.level})),
        rockets:ROCKETS.map(r=>({id:r.id,owned:r.owned})),
        modules:MODULES.map(m=>({id:m.id,owned:m.owned,level:m.level})),
        drones:DRONES.map(d=>({id:d.id,owned:d.owned,equipped:d.equipped})),
        achievements:ACHIEVEMENTS.map(a=>({id:a.id,achieved:a.achieved}))
      };
      localStorage.setItem(SAVE_KEY_V23,JSON.stringify(data));
    }catch(e){}
  }
  function loadProgress(){
    try{
      const raw=localStorage.getItem(SAVE_KEY_V23); if(!raw) return;
      const d=JSON.parse(raw)||{};
      ['wallet','sessionHigh','totalKills','maxLevelReached','bossesDefeated','maxComboSeen','planetsCleared'].forEach(k=>{if(Number.isFinite(d[k])) window[k]=d[k];});
      if(Number.isFinite(d.wallet)) wallet=d.wallet;
      if(Number.isFinite(d.sessionHigh)) sessionHigh=d.sessionHigh;
      if(Number.isFinite(d.totalKills)) totalKills=d.totalKills;
      if(Number.isFinite(d.maxLevelReached)) maxLevelReached=Math.max(1,d.maxLevelReached);
      if(Number.isFinite(d.bossesDefeated)) bossesDefeated=d.bossesDefeated;
      if(Number.isFinite(d.maxComboSeen)) maxComboSeen=d.maxComboSeen;
      if(Number.isFinite(d.planetsCleared)) planetsCleared=d.planetsCleared;
      if(Number.isFinite(d.rocketAmmoLevel)) rocketAmmoLevel=Math.max(0,Math.min(ROCKET_CAPACITY_MAX,d.rocketAmmoLevel));
      if(d.equippedShipId && SHIPS.some(s=>s.id===d.equippedShipId)) equippedShipId=d.equippedShipId;
      if(d.equippedWeaponId && WEAPONS.some(w=>w.id===d.equippedWeaponId&&w.owned)) equippedWeaponId=d.equippedWeaponId;
      if(Array.isArray(d.equippedWeaponIds)) equippedWeaponIds=d.equippedWeaponIds.slice(0,MAX_EQUIPPED_WEAPONS);
      if(Number.isFinite(d.equippedWeaponSlot)) equippedWeaponSlot=Math.max(0,Math.floor(d.equippedWeaponSlot));
      if(d.equippedRocketId && ROCKETS.some(r=>r.id===d.equippedRocketId&&r.owned)) equippedRocketId=d.equippedRocketId;
      if(d.equippedLeftId===null || WEAPONS.some(w=>w.id===d.equippedLeftId)) equippedLeftId=d.equippedLeftId;
      if(d.equippedRightId===null || WEAPONS.some(w=>w.id===d.equippedRightId)) equippedRightId=d.equippedRightId;
      if(d.chosenDiff && DIFFICULTIES[d.chosenDiff]) chosenDiff=d.chosenDiff;
      if(Array.isArray(d.equippedModuleIds)) equippedModuleIds=d.equippedModuleIds.slice(0,2);
      if(Array.isArray(d.seenEnemies)) seenEnemies=new Set(d.seenEnemies);
      if(Array.isArray(d.discoveredPlanets)) discoveredPlanets=new Set(d.discoveredPlanets);
      discoveredPlanets.add(0);
      (d.ships||[]).forEach(x=>{const s=SHIPS.find(v=>v.id===x.id);if(s){s.owned=!!x.owned;s.level=Math.max(1,Math.min(s.maxLevel,x.level||1));}});
      (d.weapons||[]).forEach(x=>{const w=WEAPONS.find(v=>v.id===x.id);if(w){w.owned=!!x.owned;w.level=Math.max(1,Math.min(w.maxLevel,x.level||1));}});
      normalizeWeaponLoadout();
      (d.rockets||[]).forEach(x=>{const r=ROCKETS.find(v=>v.id===x.id);if(r)r.owned=!!x.owned;});
      (d.modules||[]).forEach(x=>{const m=MODULES.find(v=>v.id===x.id);if(m){m.owned=!!x.owned;m.level=Math.max(0,Math.min(m.max,x.level||0));}});
      if(!Array.isArray(d.equippedModuleIds)) equippedModuleIds=MODULES.filter(m=>m.owned).slice(0,2).map(m=>m.id);
      equippedModuleIds=equippedModuleIds.filter((id,i,a)=>id&&a.indexOf(id)===i&&MODULES.some(m=>m.id===id&&m.owned)).slice(0,2);
      (d.drones||[]).forEach(x=>{const r=DRONES.find(v=>v.id===x.id);if(r){r.owned=!!x.owned;r.equipped=false;}});
      const oldDrone=(d.drones||[]).find(x=>x.equipped&&DRONES.some(r=>r.id===x.id&&r.owned));if(oldDrone){equippedDroneId=oldDrone.id;DRONES.forEach(r=>r.equipped=r.id===equippedDroneId);}
      (d.achievements||[]).forEach(x=>{const a=ACHIEVEMENTS.find(v=>v.id===x.id);if(a)a.achieved=!!x.achieved;});
    }catch(e){}
  }
  function notify(text){miniNotify.textContent=text;miniNotify.classList.add('show');clearTimeout(notify._t);notify._t=setTimeout(()=>miniNotify.classList.remove('show'),1300);}
  function moduleLevel(id){const m=MODULES.find(x=>x.id===id);return m?m.level:0;}
  function moduleBonus(id){const m=MODULES.find(x=>x.id===id);return m&&m.owned&&equippedModuleIds.includes(id)?m.effect(m.level):0;}
  function activeDrone(){return DRONES.find(d=>d.equipped&&d.owned)||null;}
  function buyOrUpgradeModule(id){const m=MODULES.find(x=>x.id===id);if(!m)return;const cost=m.owned?m.cost*m.level:m.cost;if(wallet<cost){sfx.fail();notify('COIN TIDAK CUKUP');return;}wallet-=cost;m.owned=true;m.level=Math.min(m.max,m.level+1);if(m.level===1&&equippedModuleIds.filter(Boolean).length<2){const i=equippedModuleIds.findIndex(x=>!x);if(i>=0)equippedModuleIds[i]=m.id;}refreshWallet();sfx.purchase();notify(m.level===1?'MODULE ACQUIRED':'MODULE UPGRADED');renderArmory();renderCustomize();checkAchievements();saveProgress();}
  function toggleModuleEquip(id){const m=MODULES.find(x=>x.id===id);if(!m||!m.owned)return;const idx=equippedModuleIds.indexOf(id);if(idx>=0){equippedModuleIds[idx]=null;notify('MODULE DILEPAS');sfx.equip();}else{const empty=equippedModuleIds.findIndex(x=>!x);if(empty<0){sfx.fail();notify('SLOT MODUL PENUH');return;}equippedModuleIds[empty]=id;sfx.equip();notify('MODULE TERPASANG');}renderArmory();renderCustomize();saveProgress();}
  function buyDrone(id){const d=DRONES.find(x=>x.id===id);if(!d)return;if(d.owned){if(equippedDroneId===id){equippedDroneId=null;DRONES.forEach(x=>x.equipped=false);notify('DRONE DILEPAS');}else{equippedDroneId=id;DRONES.forEach(x=>x.equipped=x.id===id);notify('DRONE TERPASANG');}sfx.equip();renderArmory();renderCustomize();saveProgress();return;}if(wallet<d.cost){sfx.fail();notify('COIN TIDAK CUKUP');return;}wallet-=d.cost;d.owned=true;equippedDroneId=id;DRONES.forEach(x=>x.equipped=x.id===id);sfx.purchase();notify('DRONE ACQUIRED');refreshWallet();renderArmory();renderCustomize();checkAchievements();saveProgress();}
  function renderArmoryCards(list,container,type){container.innerHTML='';const visible=list;visible.forEach(item=>{const card=document.createElement('div');const equipped=item.equipped||(type==='module'&&equippedModuleIds.includes(item.id));card.className='armory-card'+(equipped?' equipped':'')+(!item.owned?' locked':'');const top=document.createElement('div');top.className='armory-top';const iconBox=document.createElement('div');iconBox.className='armory-shop-icon'+(!item.owned?' is-locked':'');const preview=document.createElement('canvas');preview.className='armory-shop-preview';preview.dataset.itemId=item.id;preview.dataset.itemType=type;iconBox.appendChild(preview);const lab=document.createElement('div');lab.className='armory-preview-label';lab.textContent='PREVIEW';iconBox.appendChild(lab);const mid=document.createElement('div');mid.className='armory-info';const lv=item.level!==undefined?`Lv.${item.level}/${item.max}`:'';const status=!item.owned?'BELI':equipped?'TERPASANG':'DIMILIKI';mid.innerHTML=`<h3>${item.name} ${lv?`<span style="font:7px 'Press Start 2P';color:var(--amber)">${lv}</span>`:''}</h3><div class="armory-status ${!item.owned?'locked':equipped?'equipped':'owned'}">${status}</div><p>${item.desc}</p>${item.bonus?`<div class="armory-stat">✦ ${item.bonus}</div>`:''}${item.effect?`<div class="armory-stat">${item.effect}</div>`:''}${type==='module'?`<div class="level-pips">${Array.from({length:item.max},(_,i)=>`<i class="${i<item.level?'on':''}"></i>`).join('')}</div>`:''}`;const action=document.createElement('div');action.className='armory-action';const price=document.createElement('div');price.className='armory-price';price.textContent=!item.owned?(item.cost?'💰 '+item.cost:'GRATIS'):(type==='module'&&item.level<item.max?'💰 '+item.cost*item.level:'');if(price.textContent)action.appendChild(price);const btn=document.createElement('button');if(type==='module'){if(!item.owned){btn.textContent='BELI';btn.className='equip';btn.disabled=wallet<item.cost;btn.onclick=()=>buyOrUpgradeModule(item.id);}else{btn.textContent=equipped?'LEPAS':'PASANG';btn.className='equip';btn.onclick=()=>toggleModuleEquip(item.id);if(item.level<item.max){const up=document.createElement('button');up.className='up';up.textContent='UPGRADE';up.disabled=wallet<item.cost*item.level;up.onclick=()=>buyOrUpgradeModule(item.id);action.appendChild(up);}}}else if(type==='drone'){btn.textContent=!item.owned?'BELI':equipped?'LEPAS':'PASANG';btn.className='equip';btn.disabled=!item.owned&&wallet<item.cost;btn.onclick=()=>buyDrone(item.id);}action.appendChild(btn);top.append(iconBox,mid,action);card.appendChild(top);card.onclick=e=>{if(e.target.tagName!=='BUTTON')openDetail(item,type)};container.appendChild(card);});if(!visible.length){const e=document.createElement('div');e.className='loadout-empty';e.textContent='Belum ada item di kategori ini.';container.appendChild(e);}}
  function renderArmory(){renderArmoryCards(MODULES,moduleList,'module');renderArmoryCards(DRONES,droneList,'drone');startShopArmoryPreview();}
  let detailPreviewRAF=null;
  function stopDetailPreview(){ if(detailPreviewRAF){cancelAnimationFrame(detailPreviewRAF);detailPreviewRAF=null;} }
  function startDetailCanvasPreview(item,type){
    stopDetailPreview();
    detailPreview.innerHTML='';
    const canvas=document.createElement('canvas');
    detailPreview.appendChild(canvas);
    function loop(){
      const oldCtx=ctx, oldAnimTick=animTick;
      const now=performance.now()*0.001;
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const cssW=canvas.clientWidth||110, cssH=canvas.clientHeight||110;
      const rw=Math.round(cssW*dpr), rh=Math.round(cssH*dpr);
      if(canvas.width!==rw||canvas.height!==rh){canvas.width=rw;canvas.height=rh;}
      const c=canvas.getContext('2d');
      c.setTransform(dpr,0,0,dpr,0,0); c.clearRect(0,0,cssW,cssH);
      ctx=c; animTick=oldAnimTick+now*18;
      c.save(); c.translate(cssW/2,cssH/2); c.scale(2.5,2.5);
      if(type==='module') drawModuleIcon(item);
      else if(type==='drone') drawDroneIcon(item);
      c.restore();
      ctx=oldCtx; animTick=oldAnimTick;
      detailPreviewRAF=requestAnimationFrame(loop);
    }
    loop();
  }
  function openDetail(item,type){
    if(type==='module'||type==='drone'){
      startDetailCanvasPreview(item,type);
    } else {
      stopDetailPreview();
      detailPreview.innerHTML='';
      detailPreview.textContent=item.icon || (type==='weapon'?'🔫':'🚀');
    }
    const lv=item.level!==undefined?`LEVEL ${item.level}/${item.maxLevel||item.max}`:'STATUS: '+(item.owned?(item.equipped?'TERPASANG':'DIMILIKI'):'TERKUNCI');
    detailContent.innerHTML=`<h2 style="font:14px 'Press Start 2P';color:var(--cyan2);margin:0 0 8px;">${item.name}</h2><p style="font-size:11px;color:var(--dim);line-height:1.5;">${item.baseDesc||item.desc||''}</p><div style="font:8px 'Press Start 2P';color:var(--amber);margin-top:8px;">${lv}</div>`;
    detailActions.innerHTML='';
    {
      const btn=document.createElement('button');btn.className='big';
      if(type==='module') btn.textContent=item.level>=item.max?'MAX LEVEL':(item.owned?'UPGRADE':'BUY');
      else btn.textContent=item.owned?(type==='ship'?'EQUIP':'EQUIP'):'BUY';
      btn.onclick=()=>{
        if(type==='module') buyOrUpgradeModule(item.id);
        else if(type==='drone') buyDrone(item.id);
        else if(type==='weapon'){
          if(!item.owned){if(wallet<item.cost){sfx.fail();notify('COIN TIDAK CUKUP');return;}wallet-=item.cost;item.owned=true;sfx.purchase();notify('ITEM ACQUIRED');}
          else if(item.level<item.maxLevel){const cost=item.upgradeCost(item.level);if(wallet<cost){sfx.fail();notify('COIN TIDAK CUKUP');return;}wallet-=cost;item.level++;sfx.purchase();notify('WEAPON UPGRADED');}
          refreshWallet();renderShop();saveProgress();
        } else if(type==='ship'){
          if(!item.owned){if(wallet<item.cost){sfx.fail();notify('COIN TIDAK CUKUP');return;}wallet-=item.cost;item.owned=true;sfx.purchase();}
          equippedShipId=item.id;sfx.equip();renderShop();saveProgress();
        }
        itemDetailModal.classList.remove('show');
        stopDetailPreview();
      };
      detailActions.appendChild(btn);
    }
    if(type==='weapon' && item.owned){const s=document.createElement('span');s.style.cssText="font:8px 'Press Start 2P';color:var(--dim);align-self:center;";s.textContent='Preview suara';detailActions.appendChild(s);}
    itemDetailModal.classList.add('show'); if(type==='weapon') sfx.weapon(item.id); else sfx.ui();
  }
  function renderArmory(){
    renderArmoryCards(MODULES,moduleList,'module');renderArmoryCards(DRONES,droneList,'drone');
    startShopArmoryPreview();
  }
  loadProgress();

  function initState() {
    paused = false;
    diff = DIFFICULTIES[chosenDiff];
    const shipDef = getShip(equippedShipId);
    shipStats = shipDef.statsAt(shipDef.level);
    const planet = getPlanetForLevel(selectedStartLevel);
    planetPassiveMods = computePlanetPassiveMods(planet);
    shipStats = { ...shipStats, fireRateMult: shipStats.fireRateMult * planetPassiveMods.fireRateMult * (1 + moduleBonus('rapidSystem')), speedMult: shipStats.speedMult * (1 + moduleBonus('thruster')) };
    player = { x: W / 2, y: H - 90, w: 34, h: 34, speed: 6.5 * shipStats.speedMult, vx: 0, vy: 0, tilt: 0, targetTilt: 0 };
    droneVisualX = player.x + 48; droneVisualY = player.y + 8; droneVisualVX = 0; droneVisualVY = 0; droneVisualSeed = Math.random()*100;
    bullets = []; enemies = []; enemyBullets = []; pickups = []; particles = []; sparks = []; meteors = []; meteorTimer = 0; fxParticles = [];
    stars = Array.from({ length: 45 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + 0.4, s: Math.random() * 1.2 + 0.4 }));
    initBattleBackground();
    initEnvParticles(THEMES[planet.theme].env);
    startLivesEffective = Math.min(MAX_LIVES, diff.startLives + shipStats.bonusLives);
    score = Math.max(0, (selectedStartLevel - 1) * LEVEL_UP_SCORE * 0.75);
    lives = startLivesEffective; level = selectedStartLevel; coinsThisRun = 0;
    killsThisRun = 0;
    maxHPPool = 100 * planetPassiveMods.hpPoolMult * (1 + moduleBonus('armorPlate'));
    playerHP = maxHPPool; enemiesSpawnedThisLevel = 0; enemiesTargetThisLevel = enemyTargetForLevel(level); levelTransitionTimer = 0;
    maxShield = 100 * (1 + moduleBonus('armorPlate')); playerShield = maxShield; shieldRegenDelay = 0;
    currentPlanetId = planet.id;
    themeIdx = planet.theme;
    spawnTimer = 0; shootLeftTimer = 0; shootRightTimer = 0; shootCenterTimer = 0; keys = {};
    weaponHeld = false; weaponShotTimer = 0; rocketCooldown = 0; maxRocketAmmo = rocketCapacityFor(rocketAmmoLevel); rocketAmmo = maxRocketAmmo;
    maxEnergy = getShipEnergyMax(shipDef); energy = maxEnergy;
    normalizeWeaponLoadout();
    if (!getRocket(equippedRocketId)?.owned) equippedRocketId = getOwnedRockets()[0]?.id || 'standardRocket';
    mouseActive = false; mouseTargetX = null; mouseTargetY = null;
    boss = null; bossActive = false; bossFireTimer = 0; bossDefIdx = 0; bossPhase2 = false; bossWaitingEntry = false;
    bossPhase3 = false; bossShotCount = 0; bossTelegraphTimer = 0; bossTelegraphKind = null;
    shieldTimer = 0; shakeTimer = 0; shakeMag = 0; playerInvuln = 0; rapidFireTimer = 0;
    combo = 0; comboTimer = 0;
    maxLevelReached = Math.max(maxLevelReached, 1);
    scoreVal.textContent = '0';
    updateHud(); updatePlanetTag();
    bossBarWrap.style.display = 'none';
    updateWaveUI();
    comboTag.style.opacity = '0';
    hpWrap.classList.remove('low-hp');
    lowHpWarned = false;
  }
  function updatePlanetTag() {
    const p = getPlanetForLevel(level);
    planetTag.textContent = `${p.name.toUpperCase()} · SECTOR ${p.sector}`;
  }

  function shipHull(shape) {
    if (shape === 'sleek') return [[0,-20],[5,-6],[16,14],[7,10],[0,16],[-7,10],[-16,14],[-5,-6]];
    if (shape === 'bulky') return [[0,-16],[10,-6],[19,8],[13,18],[6,12],[0,16],[-6,12],[-13,18],[-19,8],[-10,-6]];
    if (shape === 'arrow') return [[0,-22],[3,-2],[15,18],[3,10],[0,15],[-3,10],[-15,18],[-3,-2]];
    return [[0,-18],[6,-4],[15,16],[6,9],[0,13],[-6,9],[-15,16],[-6,-4]];
  }

