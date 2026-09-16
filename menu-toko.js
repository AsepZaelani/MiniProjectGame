// ---- Preview pesawat hidup di toko: memakai renderer yang sama persis dengan gameplay ----
  let shopPreviewRAF = null;
  function animateShopShips() {
    const previews = document.querySelectorAll('.ship-shop-preview');
    if (!previews.length) { shopPreviewRAF = null; return; }

    const oldCtx = ctx;
    const oldShipId = equippedShipId;
    const oldAnimTick = animTick;
    const now = performance.now() * 0.001;

    previews.forEach((canvas, index) => {
      const shipId = canvas.dataset.shipId;
      const ship = getShip(shipId);
      if (!ship) return;
      const c = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 72;
      const cssH = canvas.clientHeight || 84;
      const rw = Math.round(cssW * dpr), rh = Math.round(cssH * dpr);
      if (canvas.width !== rw || canvas.height !== rh) { canvas.width = rw; canvas.height = rh; }

      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, cssW, cssH);

      // Sedikit naik-turun + miring kiri/kanan agar terlihat seperti sedang terbang.
      const bob = Math.sin(now * 2.4 + index * 0.8) * 2.2;
      const tilt = Math.sin(now * 1.7 + index * 0.55) * 0.075;
      ctx = c;
      equippedShipId = ship.id;
      animTick = oldAnimTick + now * 18 + index * 20;
      suppressShipWeapons = true;
      c.save();
      c.translate(cssW / 2, cssH / 2 - 1 + bob);
      c.scale(1.25, 1.25);
      drawShip({ x: 0, y: 0, w: 34, h: 34, tilt });
      c.restore();
    });

    ctx = oldCtx;
    equippedShipId = oldShipId;
    suppressShipWeapons = false;
    animTick = oldAnimTick + 0.35;
    shopPreviewRAF = requestAnimationFrame(animateShopShips);
  }

  function startShopShipPreview() {
    if (shopPreviewRAF) cancelAnimationFrame(shopPreviewRAF);
    shopPreviewRAF = requestAnimationFrame(animateShopShips);
  }

  // ---- Preview senjata hidup di toko: memakai renderer modul + proyektil gameplay ----
  let shopWeaponPreviewRAF = null;
  function animateShopWeapons() {
    const previews = document.querySelectorAll('.weapon-shop-preview');
    if (!previews.length) { shopWeaponPreviewRAF = null; return; }
    const oldCtx = ctx;
    const oldAnimTick = animTick;
    const now = performance.now() * 0.001;

    previews.forEach((canvas, index) => {
      const weaponId = canvas.dataset.weaponId;
      const weapon = getWeapon(weaponId);
      if (!weapon) return;
      const c = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 72;
      const cssH = canvas.clientHeight || 84;
      const rw = Math.round(cssW * dpr), rh = Math.round(cssH * dpr);
      if (canvas.width !== rw || canvas.height !== rh) { canvas.width = rw; canvas.height = rh; }
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, cssW, cssH);

      ctx = c;
      animTick = oldAnimTick + now * 18 + index * 11;
      const bob = Math.sin(now * 2.6 + index * .7) * 2.2;
      const sway = Math.sin(now * 1.9 + index * .4) * 2.5;
      const scale = 1.12;

      c.save();
      c.translate(cssW / 2 + sway, cssH / 2 + bob + 5);
      c.scale(scale, scale);
      // Modul asli yang sama dengan yang dipakai pada gameplay.
      drawWeaponModule(weapon.id, 0);

      // Tampilkan bentuk proyektil asli senjata di atas modul, bergerak naik.
      const pY = -26 - ((now * 34 + index * 13) % 34);
      const b = {
        x: 0, y: pY,
        vx: 0, vy: -7,
        r: 4 + Math.sin(animTick * .12) * .45,
        rot: animTick * .03,
        weaponId: weapon.id,
        trail: []
      };
      for (let i = 1; i <= 4; i++) b.trail.push({x:0, y:pY + i*4});
      drawBullet(b);
      c.restore();
    });

    ctx = oldCtx;
    animTick = oldAnimTick + .35;
    shopWeaponPreviewRAF = requestAnimationFrame(animateShopWeapons);
  }

  function startShopWeaponPreview() {
    if (shopWeaponPreviewRAF) cancelAnimationFrame(shopWeaponPreviewRAF);
    shopWeaponPreviewRAF = requestAnimationFrame(animateShopWeapons);
  }

  // ---- Preview hidup untuk Drone / Modul / Kosmetik di Armory ----
  let shopArmoryPreviewRAF = null;
  function animateShopArmory() {
    const previews = document.querySelectorAll('.armory-shop-preview');
    if (!previews.length) { shopArmoryPreviewRAF = null; return; }
    const oldCtx = ctx;
    const oldAnimTick = animTick;
    const now = performance.now() * 0.001;

    previews.forEach((canvas, index) => {
      const itemType = canvas.dataset.itemType;
      const itemId = canvas.dataset.itemId;
      let item = null;
      if (itemType === 'module') item = MODULES.find(x => x.id === itemId);
      else if (itemType === 'drone') item = DRONES.find(x => x.id === itemId);
      if (!item) return;
      const c = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 64, cssH = canvas.clientHeight || 64;
      const rw = Math.round(cssW * dpr), rh = Math.round(cssH * dpr);
      if (canvas.width !== rw || canvas.height !== rh) { canvas.width = rw; canvas.height = rh; }
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, cssW, cssH);

      ctx = c;
      animTick = oldAnimTick + now * 18 + index * 13;
      const bob = Math.sin(now * 2.2 + index * .6) * 2;

      c.save();
      c.translate(cssW / 2, cssH / 2 + bob);
      c.scale(1.55, 1.55);
      if (itemType === 'module') drawModuleIcon(item);
      else if (itemType === 'drone') drawDroneIcon(item);
      c.restore();
    });

    ctx = oldCtx;
    animTick = oldAnimTick + .35;
    shopArmoryPreviewRAF = requestAnimationFrame(animateShopArmory);
  }

  function startShopArmoryPreview() {
    if (shopArmoryPreviewRAF) cancelAnimationFrame(shopArmoryPreviewRAF);
    shopArmoryPreviewRAF = requestAnimationFrame(animateShopArmory);
  }

  // ---- Preview pesawat hidup di KUSTOMISASI: renderer yang sama persis dengan gameplay ----
  let customizeShipPreviewRAF = null;
  function animateCustomizeShips() {
    const previews = document.querySelectorAll('.custom-ship-preview');
    if (!previews.length) { customizeShipPreviewRAF = null; return; }
    const oldCtx = ctx;
    const oldShipId = equippedShipId;
    const oldAnimTick = animTick;
    const now = performance.now() * 0.001;

    previews.forEach((canvas, index) => {
      const shipId = canvas.dataset.shipId;
      const ship = getShip(shipId);
      if (!ship) return;
      const c = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 78;
      const cssH = canvas.clientHeight || 82;
      const rw = Math.round(cssW * dpr), rh = Math.round(cssH * dpr);
      if (canvas.width !== rw || canvas.height !== rh) { canvas.width = rw; canvas.height = rh; }
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, cssW, cssH);

      ctx = c;
      equippedShipId = ship.id;
      animTick = oldAnimTick + now * 18 + index * 17;
      suppressShipWeapons = true;
      const bob = Math.sin(now * 2.4 + index * .75) * 2.5;
      const tilt = Math.sin(now * 1.7 + index * .55) * .085;
      c.save();
      c.translate(cssW / 2, cssH / 2 - 1 + bob);
      c.scale(1.42, 1.42);
      drawShip({ x:0, y:0, w:34, h:34, tilt });
      drawHangarDronePreview(cssW, cssH);
      c.restore();
    });

    ctx = oldCtx;
    equippedShipId = oldShipId;
    suppressShipWeapons = false;
    animTick = oldAnimTick + .35;
    customizeShipPreviewRAF = requestAnimationFrame(animateCustomizeShips);
  }

  function startCustomizeShipPreview() {
    if (customizeShipPreviewRAF) cancelAnimationFrame(customizeShipPreviewRAF);
    customizeShipPreviewRAF = requestAnimationFrame(animateCustomizeShips);
  }

  function renderRocketCapacity(){
    const wrap = document.getElementById('rocketCapacityCard');
    if(!wrap) return;
    wrap.innerHTML = '';
    const maxed = rocketAmmoLevel >= ROCKET_CAPACITY_MAX;
    const cost = rocketCapacityCost(rocketAmmoLevel);
    const card = document.createElement('div'); card.className = 'weapon-card';
    const top = document.createElement('div'); top.className = 'weapon-top with-icon';
    const icon = document.createElement('div'); icon.className = 'weapon-shop-icon';
    icon.innerHTML = `<svg viewBox="0 0 48 48"><rect x="14" y="10" width="20" height="10" rx="2" fill="#FFD166"/><rect x="14" y="22" width="20" height="10" rx="2" fill="#FFD166" opacity=".55"/><rect x="14" y="34" width="20" height="6" rx="2" fill="#FFD166" opacity=".3"/></svg>`;
    const info = document.createElement('div'); info.className = 'weapon-info';
    info.innerHTML = `<h3>KAPASITAS ROKET</h3><p>Jumlah roket dibawa per nyawa: <b>${rocketCapacityFor(rocketAmmoLevel)}</b>${!maxed?` → ${rocketCapacityFor(rocketAmmoLevel+1)}`:' (MAKS)'}<br>${!maxed?`Harga: 💰${cost}`:'Sudah level maksimum'}</p>`;
    const action = document.createElement('div'); action.className = 'weapon-action';
    if(!maxed){
      const b=document.createElement('button'); b.className='buy-btn'; b.textContent='BELI +'+ROCKET_CAPACITY_STEP; b.disabled = wallet<cost;
      b.onclick=()=>{ if(wallet<cost) { sfx.fail(); return; } wallet-=cost; rocketAmmoLevel++; sfx.purchase(); notify('KAPASITAS ROKET +'+ROCKET_CAPACITY_STEP); refreshWallet(); renderRocketCapacity(); saveProgress(); };
      action.appendChild(b);
    } else {
      const tag=document.createElement('span'); tag.className='equipped-tag'; tag.textContent='MAKS'; action.appendChild(tag);
    }
    top.append(icon,info,action); card.appendChild(top); wrap.appendChild(card);
  }
  function renderRocketShop(){
    if(!rocketList) return; rocketList.innerHTML='';
    renderRocketCapacity();
    ROCKETS.forEach(r=>{
      const card=document.createElement('div'); card.className='weapon-card'+(equippedRocketId===r.id?' equipped':'')+(!r.owned?' locked':'');
      const top=document.createElement('div'); top.className='weapon-top with-icon';
      const icon=document.createElement('div'); icon.className='weapon-shop-icon rocket-shop-icon'+(!r.owned?' is-locked':''); icon.innerHTML=rocketIconSVG(r)+`<div class="rocket-shop-overlay"><span>ROCKET SYSTEM</span><i></i><b>LOCK-ON</b></div>`;
      const info=document.createElement('div'); info.className='weapon-info';
      info.innerHTML=`<h3>${r.name}</h3><p>${r.desc}<br>Damage: ${r.damage} · Jumlah: ${r.count}${!r.owned?`<br>Harga: 💰${r.cost}`:''}</p>`;
      const action=document.createElement('div'); action.className='weapon-action';
      if(r.owned){
        const tag=document.createElement('span'); tag.className='equipped-tag'; tag.textContent=equippedRocketId===r.id?'TERPASANG':'DIMILIKI'; action.appendChild(tag);
        if(equippedRocketId!==r.id){const b=document.createElement('button');b.className='buy-btn';b.textContent='PAKAI';b.onclick=()=>{equippedRocketId=r.id;sfx.equip();renderShop();saveProgress();updateCombatHud();};action.appendChild(b);}
        if(equippedRocketId===r.id && rocketAmmo<=0){
          const refillCost=Math.max(10, Math.round((r.cost||20)*0.15));
          const b=document.createElement('button'); b.className='buy-btn'; b.textContent='ISI ULANG · 💰'+refillCost; b.disabled=wallet<refillCost;
          b.onclick=()=>{ if(wallet<refillCost)return; wallet-=refillCost; rocketAmmo=maxRocketAmmo; rocketCooldown=0; sfx.purchase(); notify('ROKET DIISI ULANG · '+rocketAmmo); refreshWallet(); renderShop(); saveProgress(); updateCombatHud(); };
          action.appendChild(b);
        }
      }else{const b=document.createElement('button');b.className='buy-btn';b.textContent='BELI';b.disabled=wallet<r.cost;b.onclick=()=>{if(wallet<r.cost)return;wallet-=r.cost;r.owned=true;sfx.purchase();equippedRocketId=r.id;rocketAmmo=maxRocketAmmo;refreshWallet();renderShop();saveProgress();checkAchievements();updateCombatHud();};action.appendChild(b);}
      top.append(icon,info,action); card.appendChild(top); rocketList.appendChild(card);
    });
  }

  function renderShop() {
    weaponList.innerHTML = '';
    WEAPONS.forEach(w => {
      const card = document.createElement('div');
      card.className = 'weapon-card' + (isWeaponEquipped(w.id) ? ' equipped' : '') + (!w.owned ? ' locked' : '');
      const top = document.createElement('div'); top.className = 'weapon-top with-icon';
      const iconBox = document.createElement('div'); iconBox.className = 'weapon-shop-icon' + (!w.owned ? ' is-locked' : '');
      const weaponPreview = document.createElement('canvas'); weaponPreview.className = 'weapon-shop-preview'; weaponPreview.dataset.weaponId = w.id; iconBox.appendChild(weaponPreview);
      const weaponPreviewLabel = document.createElement('div'); weaponPreviewLabel.className = 'weapon-preview-label'; weaponPreviewLabel.textContent = 'PREVIEW'; iconBox.appendChild(weaponPreviewLabel);
      const info = document.createElement('div'); info.className = 'weapon-info';
      const dots = Array.from({ length: w.maxLevel }, (_, i) => `<span class="${i < w.level ? 'on' : ''}"></span>`).join('');
      info.innerHTML = `<h3>${w.name}</h3><p>${w.baseDesc}${!w.owned ? `<br>Harga: 💰${w.cost}` : ''}</p><div class="level-dots">${dots}</div>`;
      const action = document.createElement('div'); action.className = 'weapon-action';
      if (w.owned) {
        const inLoadout=isWeaponEquipped(w.id);
        const tag = document.createElement('span');
        tag.className = 'equipped-tag';
        tag.textContent = inLoadout ? `LOADOUT ${equippedWeaponIds.indexOf(w.id)+1}/5` : 'DIMILIKI';
        action.appendChild(tag);
        const hint = document.createElement('div');
        hint.className = 'shop-hangar-hint';
        hint.textContent = inLoadout ? (equippedWeaponId === w.id ? 'Senjata aktif · X untuk ganti' : 'Ada di loadout · X untuk ganti') : 'Bisa dipakai jika slot loadout masih tersedia';
        action.appendChild(hint);
        const equipBtn=document.createElement('button'); equipBtn.className='buy-btn';
        equipBtn.textContent=inLoadout ? (equippedWeaponId===w.id ? 'AKTIF' : 'AKTIFKAN') : 'PAKAI';
        equipBtn.disabled=equippedWeaponId===w.id;
        equipBtn.onclick=()=>{ if(equipWeaponToLoadout(w.id)){sfx.equip();refreshWallet();renderShop();saveProgress();updateCombatHud();} };
        action.appendChild(equipBtn);
        if(inLoadout && equippedWeaponIds.length>1){
          const removeBtn=document.createElement('button'); removeBtn.className='buy-btn'; removeBtn.textContent='LEPAS';
          removeBtn.onclick=()=>{removeWeaponFromLoadout(w.id);sfx.equip();renderShop();saveProgress();updateCombatHud();}; action.appendChild(removeBtn);
        }
        if (w.level < w.maxLevel) {
          const cost = w.upgradeCost(w.level);
          const btn = document.createElement('button'); btn.className = 'upgrade-btn'; btn.textContent = `UPGRADE LV${w.level+1} 💰${cost}`;
          btn.disabled = wallet < cost;
          btn.onclick = () => { if (wallet >= cost) { wallet -= cost; w.level++; sfx.purchase(); refreshWallet(); renderShop(); saveProgress(); } };
          action.appendChild(btn);
        } else { const tagMax = document.createElement('span'); tagMax.className = 'equipped-tag'; tagMax.textContent = 'MAX LEVEL'; action.appendChild(tagMax); }
      } else {
        const btn = document.createElement('button'); btn.className = 'buy-btn'; btn.textContent = 'BELI';
        btn.disabled = wallet < w.cost;
        btn.onclick = () => { if (wallet >= w.cost) { wallet -= w.cost; w.owned = true; sfx.purchase(); refreshWallet(); renderShop(); checkAchievements(); saveProgress(); } };
        action.appendChild(btn);
      }
      top.appendChild(iconBox); top.appendChild(info); top.appendChild(action); card.appendChild(top);
      card.addEventListener('click',e=>{if(e.target.tagName==='BUTTON')return;openDetail(w,'weapon');});
      weaponList.appendChild(card);
    });

    shipList.innerHTML = '';
    SHIPS.forEach(s => {
      const card = document.createElement('div');
      card.className = 'ship-shop-card' + (equippedShipId === s.id ? ' equipped' : '') + (!s.owned ? ' locked' : '');

      const icon = document.createElement('div');
      icon.className = 'ship-shop-icon' + (!s.owned ? ' is-locked' : '');
      const preview = document.createElement('canvas');
      preview.className = 'ship-shop-preview';
      preview.dataset.shipId = s.id;
      icon.appendChild(preview);
      const previewLabel = document.createElement('div');
      previewLabel.className = 'ship-preview-label';
      previewLabel.textContent = 'PREVIEW';
      icon.appendChild(previewLabel);

      const main = document.createElement('div');
      main.className = 'ship-shop-main';
      const status = s.owned ? (equippedShipId === s.id ? 'TERPAKAI' : 'DIMILIKI') : 'TERKUNCI';
      const statusClass = s.owned ? '' : ' locked';
      const dots = Array.from({ length: s.maxLevel }, (_, i) => `<span class="${i < s.level ? 'on' : ''}"></span>`).join('');
      main.innerHTML = `
        <div class="ship-shop-title">
          <span class="ship-status${statusClass}">${status}</span>
          <h3>${s.name}</h3>
          <span class="ship-level">Lv.${s.level}</span>
        </div>
        <p class="ship-desc">${s.desc} · ⚡ ENERGY CAPACITY ${getShipEnergyMax(s)}</p>
        <p class="ship-ability basic"><b>Senjata:</b> Dipasang otomatis dari senjata aktif. Pesawat tidak menembak sendiri.</p>
        <div class="ship-level-dots">${dots}</div>`;

      const action = document.createElement('div');
      action.className = 'ship-shop-action';
      if (s.owned) {
        if (equippedShipId === s.id) {
          const tag = document.createElement('span');
          tag.className = 'ship-equip-tag';
          tag.textContent = 'TERPAKAI';
          action.appendChild(tag);
        } else {
          const btn = document.createElement('button');
          btn.className = 'ship-buy-btn';
          btn.textContent = 'PAKAI';
          btn.onclick = () => { equippedShipId = s.id; sfx.equip(); renderShop(); saveProgress(); };
          action.appendChild(btn);
        }
        if (s.level < s.maxLevel) {
          const cost = s.upgradeCost(s.level);
          const btn = document.createElement('button');
          btn.className = 'ship-upgrade-btn';
          btn.textContent = `UPGRADE 💰${cost}`;
          btn.disabled = wallet < cost;
          btn.onclick = () => { if (wallet >= cost) { wallet -= cost; s.level++; refreshWallet(); renderShop(); } };
          action.appendChild(btn);
        } else {
          const tag = document.createElement('span');
          tag.className = 'ship-equip-tag';
          tag.textContent = 'MAX LEVEL';
          action.appendChild(tag);
        }
      } else {
        const price = document.createElement('div');
        price.className = 'ship-shop-price';
        price.textContent = `💰 ${s.cost}`;
        action.appendChild(price);
        const btn = document.createElement('button');
        btn.className = 'ship-buy-btn';
        btn.textContent = 'BELI';
        btn.disabled = wallet < s.cost;
        btn.onclick = () => { if (wallet >= s.cost) { wallet -= s.cost; s.owned = true; equippedShipId = s.id; refreshWallet(); sfx.purchase(); renderShop(); checkAchievements(); saveProgress(); } };
        action.appendChild(btn);
      }

      card.appendChild(icon); card.appendChild(main); card.appendChild(action);
      card.addEventListener('click',e=>{if(e.target.tagName==='BUTTON')return;openDetail(s,'ship');});
      shipList.appendChild(card);
    });
    startShopShipPreview();
    startShopWeaponPreview();
    renderRocketShop();
    renderArmory();
  }

  let customizeOpenSlot = null; // null | 'left' | 'right'

  function renderCustomize() {
    const ownedShips = SHIPS.filter(s => s.owned);
    if (!ownedShips.find(s => s.id === equippedShipId)) equippedShipId = ownedShips[0].id;
    const ship = getShip(equippedShipId);

    hangarShipPreview.dataset.shipId = ship.id;
    hangarShipName.textContent = `${ship.name} (Lv${ship.level})`;
    hangarShipDesc.textContent = ship.desc;
    hangarShipBasic.innerHTML = `<strong>${ship.basicDesc}</strong>`;
    hangarShipTrait.innerHTML = `<strong>${ship.trait}</strong>`;
    const bars = computeShipStatBars(ship);
    statAtkFill.style.width = bars.attack + '%'; statAtkVal.textContent = bars.attack;
    statSpdFill.style.width = bars.speed + '%'; statSpdVal.textContent = bars.speed;
    statDefFill.style.width = bars.defense + '%'; statDefVal.textContent = bars.defense;
    shipPrevBtn.disabled = ownedShips.length <= 1;
    shipNextBtn.disabled = ownedShips.length <= 1;

    hangarShipDots.innerHTML = '';
    ownedShips.forEach(s => {
      const dot = document.createElement('span');
      if (s.id === ship.id) dot.className = 'on';
      hangarShipDots.appendChild(dot);
    });

    fillSlotButton(slotLeftBtn, slotLeftIcon, equippedLeftId);
    fillSlotButton(slotRightBtn, slotRightIcon, equippedRightId);
    slotLeftBtn.classList.toggle('open', customizeOpenSlot === 'left');
    slotRightBtn.classList.toggle('open', customizeOpenSlot === 'right');

    if (customizeOpenSlot) renderWeaponPicker(customizeOpenSlot);
    else weaponPicker.classList.remove('show');
    renderHangarLoadout();
    startCustomizeShipPreview();
  }

  function fillSlotButton(btn, iconEl, weaponId) {
    const w = weaponId ? getWeapon(weaponId) : null;
    btn.classList.toggle('filled', !!w);
    iconEl.className = 'slot-icon' + (w ? '' : ' empty');
    iconEl.innerHTML = w ? weaponIconSVG(w) : '';
  }

  function renderWeaponPicker(slot) {
    weaponPicker.classList.add('show');
    wpTitle.textContent = slot === 'left' ? 'PILIH SENJATA KIRI' : 'PILIH SENJATA KANAN';
    const currentId = slot === 'left' ? equippedLeftId : equippedRightId;
    wpList.innerHTML = '';

    const noneRow = document.createElement('div');
    noneRow.className = 'wp-empty-row' + (!currentId ? ' equipped' : '');
    noneRow.textContent = (!currentId ? '✅ ' : '') + 'Kosongkan slot ini';
    noneRow.onclick = () => setSlotWeapon(slot, null);
    wpList.appendChild(noneRow);

    const ownedWeapons = WEAPONS.filter(w => w.owned);
    if (!ownedWeapons.length) {
      const empty = document.createElement('div');
      empty.className = 'wp-empty-row';
      empty.textContent = 'Belum ada senjata dibeli — cek TOKO dulu.';
      wpList.appendChild(empty);
    }
    ownedWeapons.forEach(w => {
      const row = document.createElement('div');
      row.className = 'wp-item' + (currentId === w.id ? ' equipped' : '');
      const icon = document.createElement('span'); icon.className = 'wp-icon'; icon.innerHTML = weaponIconSVG(w);
      const mid = document.createElement('span');
      mid.innerHTML = `<div class="wp-name">${w.name}</div><div class="wp-lv">Lv${w.level} · ${w.baseDesc}</div>`;
      row.appendChild(icon); row.appendChild(mid);
      if (currentId === w.id) { const tag = document.createElement('span'); tag.className = 'wp-tag'; tag.textContent = '✅ ON'; row.appendChild(tag); }
      row.onclick = () => setSlotWeapon(slot, w.id);
      wpList.appendChild(row);
    });
  }

  function setSlotWeapon(slot, weaponId) {
    if (slot === 'left') equippedLeftId = weaponId; else equippedRightId = weaponId;
    sfx.equip(); saveProgress();
    sfx.equip(); saveProgress();
    customizeOpenSlot = null;
    renderCustomize();
    const targetBtn = slot === 'left' ? slotLeftBtn : slotRightBtn;
    targetBtn.classList.remove('just-equipped');
    void targetBtn.offsetWidth;
    targetBtn.classList.add('just-equipped');
  }

  function renderHangarLoadout(){if(!loadoutLeftSlot)return;const lw=equippedLeftId?getWeapon(equippedLeftId):null,rw=equippedRightId?getWeapon(equippedRightId):null;loadoutLeftSlot.innerHTML=`<div class="ls-icon">${lw?'🔫':'＋'}</div><div class="ls-text"><strong>${lw?lw.name:'SENJATA KIRI'}</strong><small>${lw?'Lv'+lw.level:'Kosong'}</small></div>`;loadoutRightSlot.innerHTML=`<div class="ls-icon">${rw?'🔫':'＋'}</div><div class="ls-text"><strong>${rw?rw.name:'SENJATA KANAN'}</strong><small>${rw?'Lv'+rw.level:'Kosong'}</small></div>`;loadoutLeftSlot.onclick=()=>{customizeOpenSlot='left';renderCustomize()};loadoutRightSlot.onclick=()=>{customizeOpenSlot='right';renderCustomize()};[moduleEquip1,moduleEquip2].forEach((el,i)=>{const id=equippedModuleIds[i],m=id&&MODULES.find(x=>x.id===id);el.innerHTML=m?`<div class="mes-icon">${m.icon}</div><div><strong>${m.name}</strong><small>Lv${m.level} · SLOT ${i+1}</small></div>`:`<div class="mes-icon">＋</div><div><strong>SLOT ${i+1}</strong><small>Belum terpasang</small></div>`;el.onclick=()=>m&&toggleModuleEquip(m.id)});hangarModulePicker.innerHTML='<div class="wp-header"><span>PILIH MODUL</span></div>';const ownedM=MODULES.filter(m=>m.owned);if(!ownedM.length)hangarModulePicker.innerHTML+='<div class="loadout-empty">Belum ada modul. Beli di SHOP.</div>';ownedM.forEach(m=>{const r=document.createElement('div');r.className='wp-item'+(equippedModuleIds.includes(m.id)?' equipped':'');r.innerHTML=`<span class="wp-icon">${m.icon}</span><span><div class="wp-name">${m.name}</div><div class="wp-lv">Lv${m.level} · ${equippedModuleIds.includes(m.id)?'TERPASANG':'DIMILIKI'}</div></span>`;r.onclick=()=>toggleModuleEquip(m.id);hangarModulePicker.appendChild(r)});hangarDronePicker.innerHTML='';const ownedD=DRONES.filter(d=>d.owned);if(!ownedD.length)hangarDronePicker.innerHTML='<div class="loadout-empty">Belum ada drone. Beli di SHOP.</div>';ownedD.forEach(d=>{const r=document.createElement('div');r.className='wp-item'+(d.equipped?' equipped':'');r.innerHTML=`<span class="wp-icon">${d.icon}</span><span><div class="wp-name">${d.name}</div><div class="wp-lv">${d.equipped?'TERPASANG':'DIMILIKI'}</div></span>`;r.onclick=()=>buyDrone(d.id);hangarDronePicker.appendChild(r)});}
  function renderMissions() {
    missionList.innerHTML = '';
    const best = Number.isFinite(sessionHigh) ? sessionHigh : 0;
    const scores = [best, 0, 0, 0, 0];
    const names = ['GUARDIAN', 'NEBULA', 'STAR WARDEN', 'ACE PILOT', 'COMMANDER'];
    scores.forEach((s, i) => {
      const row = document.createElement('div');
      row.className = 'high-score-row';
      row.innerHTML = `<span class="high-score-rank">${String(i+1).padStart(2,'0')}</span><span>${names[i]}</span><span class="high-score-points">${s.toLocaleString('id-ID')}</span>`;
      missionList.appendChild(row);
    });
  }

  let selectedPlanetId = 0;
  function curvedPath(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i], p1 = points[i + 1];
      const midY = (p0.y + p1.y) / 2;
      d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }
    return d;
  }

  function renderMapTabs() {
    mapPlanetTabs.innerHTML = '';
    PLANETS.forEach(p => {
      const unlocked = p.levels[0] <= maxLevelReached;
      const btn = document.createElement('button');
      btn.className = 'planet-tab-btn' + (selectedPlanetId === p.id ? ' active' : '') + (!unlocked ? ' locked' : '');
      btn.textContent = p.icon;
      btn.title = p.name;
      btn.onclick = () => { if (!unlocked) return; selectedPlanetId = p.id; renderMap(p.id); };
      mapPlanetTabs.appendChild(btn);
    });
  }

  function renderMap(planetId) {
    selectedPlanetId = planetId;
    renderMapTabs();
    const planet = PLANETS.find(p => p.id === planetId) || PLANETS[0];
    const unlockedPlanet = planet.levels[0] <= maxLevelReached;
    const theme = THEMES[planet.theme];
    const orbColor = (theme.orbs && theme.orbs[0]) || '#4ECDC4';
    mapGlow.style.background = `radial-gradient(ellipse at 50% 30%, ${orbColor}33, ${theme.mid}22 55%, transparent 75%)`;

    // Grid 5 kolom x 2 baris untuk 10 level per dunia (bukan lagi jalur zigzag panjang untuk 3 level).
    const cols = 5;
    const positions = planet.levels.map((lvl, idx) => {
      const col = idx % cols, row = Math.floor(idx / cols);
      return { lvl, x: 30 + col * 60, y: 65 + row * 90 };
    });

    mapSvg.innerHTML = '';
    mapNodes.innerHTML = '';
    positions.forEach(pos => {
      const open = unlockedPlanet && pos.lvl <= maxLevelReached;
      const boss = isMainBossLevel(pos.lvl), miniBoss = isMiniBossLevel(pos.lvl);
      const node = document.createElement('button');
      node.className = 'map-node' + (open ? ' unlocked' : ' locked') + (pos.lvl === selectedStartLevel ? ' selected' : '') + (boss ? ' boss' : '') + (miniBoss ? ' miniboss' : '');
      node.style.left = (pos.x / 300 * 100) + '%';
      node.style.top = (pos.y / 220 * 100) + '%';
      node.textContent = !open ? '🔒' : (boss ? '👑' : miniBoss ? '⚔️' : pos.lvl);
      node.disabled = !open;
      node.onclick = () => { if (!open) return; selectedStartLevel = pos.lvl; renderMap(planetId); };
      mapNodes.appendChild(node);
    });

    const bossName = BOSS_DEFS[planet.boss % BOSS_DEFS.length].name;
    const miniBossName = BOSS_DEFS[planet.miniBoss % BOSS_DEFS.length].name;
    mapInfo.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="font-size:20px;">${planet.icon}</span>
        <div><b style="color:var(--white);">${planet.name}</b> · SECTOR ${planet.sector}<br><span class="diff-stars">${diffStarsStr(planet.diffStars)}</span></div>
      </div>
      <div style="margin-bottom:5px;">${planet.desc}</div>
      <div>⚔️ Mini Boss: <b>${miniBossName}</b> (Lv.${planet.levels[4]}) &nbsp; 👑 Boss: <b>${bossName}</b> (Lv.${planet.levels[9]})</div>
      <div>🎯 Level dipilih: ${selectedStartLevel}${isMainBossLevel(selectedStartLevel) ? ' · BOSS' : isMiniBossLevel(selectedStartLevel) ? ' · MINI BOSS' : ''}</div>
      <div style="color:var(--amber);margin-top:3px;">✦ Bonus: ${planet.passive.label}</div>
    `;
    mapPlayBtn.disabled = !unlockedPlanet;
  }


  function refreshWallet() { if(shopCoins) shopCoins.textContent = wallet; if(menuCoins) menuCoins.textContent = wallet; if(coinVal) coinVal.textContent = wallet; }

  gameOverMenuBtn.addEventListener('click', () => { gameOverPanel.style.display='none'; mapPanel.style.display='none'; menuPanel.style.display='block'; setBgMode('menu'); overlay.style.display='flex'; });
  retryBtn.addEventListener('click', startGame);
  const difficultyModal = document.getElementById('difficultyModal');
  const diffModalClose = document.getElementById('diffModalClose');
  const diffCancelBtn = document.getElementById('diffCancelBtn');
  const diffPlayBtn = document.getElementById('diffPlayBtn');
  function syncDifficultyModalUI(){
    document.querySelectorAll('.diff-choice').forEach(b=>b.classList.toggle('on', b.dataset.diff===chosenDiff));
  }
  document.querySelectorAll('.diff-choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      sfx.tab();
      chosenDiff = btn.dataset.diff; saveProgress();
      syncDifficultyModalUI();
      if (diffRow) diffRow.querySelectorAll('.diff-btn').forEach(b=>b.classList.toggle('on', b.dataset.diff===chosenDiff));
    });
  });
  function closeDifficultyModal(){ difficultyModal.classList.remove('show'); }
  diffModalClose.addEventListener('click', ()=>{ sfx.back(); closeDifficultyModal(); });
  diffCancelBtn.addEventListener('click', ()=>{ sfx.back(); closeDifficultyModal(); });
  difficultyModal.addEventListener('click', e=>{ if(e.target===difficultyModal) closeDifficultyModal(); });
  diffPlayBtn.addEventListener('click', ()=>{
    sfx.gameStart(); closeDifficultyModal();
    selectedStartLevel = 1;
    startGame();
  });
  startBtn.addEventListener('click', () => { ensureAudio(); sfx.ui(); syncDifficultyModalUI(); difficultyModal.classList.add('show'); });
  mapPlayBtn.addEventListener('click', () => { if (!mapPlayBtn.disabled) { sfx.ui(); startGame(); } });
  mapBackBtn.addEventListener('click', () => { sfx.back(); mapPanel.style.display = 'none'; setBgMode('menu'); menuPanel.style.display = 'flex'; menuPanel.style.flexDirection = 'column'; menuPanel.style.alignItems = 'center'; });
  shopBtn.addEventListener('click', () => { ensureAudio(); sfx.ui(); menuPanel.style.display = 'none'; shopPanel.style.display = 'block'; shopCoins.textContent = wallet; renderShop(); });
  backBtn.addEventListener('click', () => {
    sfx.back();
    if (midGameBreak) { proceedFromUpgradeBreak(); return; }
    shopPanel.style.display = 'none'; menuPanel.style.display = 'flex'; menuPanel.style.flexDirection = 'column'; menuPanel.style.alignItems = 'center';
  });
  document.querySelectorAll('#shopTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      ensureAudio(); sfx.tab();
      document.querySelectorAll('#shopTabs .tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#shopPanel .tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const map={weapons:'weaponTab',rockets:'rocketTab',ships:'shipTab',modules:'moduleTab',drones:'droneTab'};
      const target=document.getElementById(map[btn.dataset.tab]||'weaponTab');
      if(target) target.classList.add('active');
      if(btn.dataset.tab==='weapons') weaponList.scrollTop=0;
      if(btn.dataset.tab==='ships') shipList.scrollTop=0;
      sfx.ui();
    });
  });
  customizeBtn.addEventListener('click', () => { customizeReturn='menu'; ensureAudio(); sfx.ui(); menuPanel.style.display = 'none'; customizePanel.style.display = 'block'; customizeOpenSlot = null; setBgMode('hangar'); renderCustomize(); });
  customizeBackBtn.addEventListener('click', () => { sfx.back();
    if (customizeShipPreviewRAF) cancelAnimationFrame(customizeShipPreviewRAF);
    customizeShipPreviewRAF = null;
    customizeOpenSlot = null;
    customizePanel.style.display = 'none';
    if (customizeReturn === 'pause') {
      pausePanel.style.display = 'block';
    } else {
      setBgMode('menu');
      menuPanel.style.display = 'flex'; menuPanel.style.flexDirection = 'column'; menuPanel.style.alignItems = 'center';
    }
  });
  shipPrevBtn.addEventListener('click', () => {
    const owned = SHIPS.filter(s => s.owned);
    if (owned.length <= 1) return;
    const idx = owned.findIndex(s => s.id === equippedShipId);
    equippedShipId = owned[(idx - 1 + owned.length) % owned.length].id;
    renderCustomize();
  });
  shipNextBtn.addEventListener('click', () => {
    const owned = SHIPS.filter(s => s.owned);
    if (owned.length <= 1) return;
    const idx = owned.findIndex(s => s.id === equippedShipId);
    equippedShipId = owned[(idx + 1) % owned.length].id;
    renderCustomize();
  });
  slotLeftBtn.addEventListener('click', () => { customizeOpenSlot = customizeOpenSlot === 'left' ? null : 'left'; renderCustomize(); });
  slotRightBtn.addEventListener('click', () => { customizeOpenSlot = customizeOpenSlot === 'right' ? null : 'right'; renderCustomize(); });
  wpCloseBtn.addEventListener('click', () => { customizeOpenSlot = null; renderCustomize(); });
  loadoutTabs?.addEventListener('click',e=>{const b=e.target.closest('.loadout-tab');if(!b)return;loadoutTabs.querySelectorAll('.loadout-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.loadout-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');const p=document.getElementById('loadout'+b.dataset.loadout.charAt(0).toUpperCase()+b.dataset.loadout.slice(1));if(p)p.classList.add('active');sfx.tab();renderHangarLoadout();});
  missionBtn.addEventListener('click', () => { ensureAudio(); sfx.ui(); menuPanel.style.display = 'none'; missionPanel.style.display = 'block'; renderMissions(); });
  missionBackBtn.addEventListener('click', () => { sfx.back(); missionPanel.style.display = 'none'; menuPanel.style.display = 'flex'; menuPanel.style.flexDirection = 'column'; menuPanel.style.alignItems = 'center'; });

  let settingsReturn='menu';
  let customizeReturn='menu';
  function openSettings(returnTo='menu'){settingsReturn=returnTo;ensureAudio();sfx.ui();menuPanel.style.display='none';pausePanel.style.display='none';settingsPanel.style.display='block';overlay.style.display='flex';updateAudioUI();}
  settingsBtn.addEventListener('click',()=>openSettings('menu'));
  pauseSettingsBtn.addEventListener('click',()=>openSettings('pause'));
  pauseCustomizeBtn.addEventListener('click',()=>{ customizeReturn='pause'; ensureAudio(); sfx.ui(); pausePanel.style.display='none'; customizePanel.style.display='block'; customizeOpenSlot=null; setBgMode('hangar'); renderCustomize(); });
  helpBtn.addEventListener('click',()=>{ sfx.ui(); helpModal.classList.add('show'); });
  helpClose.addEventListener('click',()=>{ sfx.back(); helpModal.classList.remove('show'); });
  helpModal.addEventListener('click', e=>{ if(e.target===helpModal) helpModal.classList.remove('show'); });
  quitBtn.addEventListener('click',()=>{ sfx.back(); notify('Tutup tab browser ini untuk keluar dari game'); });
  settingsBackBtn.addEventListener('click',()=>{sfx.back();settingsPanel.style.display='none';if(settingsReturn==='pause'){pausePanel.style.display='block';}else{menuPanel.style.display='flex';setBgMode('menu');}});
  detailClose.addEventListener('click',()=>{sfx.back();itemDetailModal.classList.remove('show');stopDetailPreview();});
  itemDetailModal.addEventListener('click',e=>{if(e.target===itemDetailModal){itemDetailModal.classList.remove('show');stopDetailPreview();}});
  masterVol.addEventListener('input',()=>{audioPrefs.master=+masterVol.value/100;saveAudioPrefs();updateAudioUI();});
  sfxVol.addEventListener('input',()=>{audioPrefs.sfx=+sfxVol.value/100;saveAudioPrefs();updateAudioUI();ensureAudio();sfx.ui();});
  musicVol.addEventListener('input',()=>{audioPrefs.music=+musicVol.value/100;saveAudioPrefs();updateAudioUI();ensureAudio();});
  muteAllBtn.addEventListener('click',()=>{soundOn=!soundOn;saveAudioPrefs();updateAudioUI();if(soundOn){ensureAudio();sfx.ui();}});
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn; saveAudioPrefs(); updateAudioUI();
    if (soundOn) { ensureAudio(); sfx.ui(); }
  });

  pauseBtn.addEventListener('click', pauseGame);
  resumeBtn.addEventListener('click', resumeGame);
  exitGameBtn.addEventListener('click', exitGame);
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = true;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = true;
    if ((e.key === 'x' || e.key === 'X') && running && !paused) { e.preventDefault(); switchWeapon(1); }
    if ((e.key === 'y' || e.key === 'Y') && running && !paused) { e.preventDefault(); switchRocket(1); }
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') { e.preventDefault(); paused ? resumeGame() : pauseGame(); }
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
  });