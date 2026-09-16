  // ---- Armory expansion: modules, drones, cosmetics ----
  const MODULES=[{id:'shieldCore',name:'SHIELD CORE',icon:'🛡️',desc:'Lapisan energi yang mengurangi damage masuk.',bonus:'-3.5% damage / level',max:5,cost:70,owned:false,level:0,effect:l=>l*.035},{id:'armorPlate',name:'ARMOR PLATE',icon:'▣',desc:'Pelat lambung yang memperbesar HP maksimum.',bonus:'+4% HP / level',max:5,cost:80,owned:false,level:0,effect:l=>l*.04},{id:'energyCore',name:'ENERGY CORE',icon:'⚡',desc:'Reaktor yang memperbesar kapasitas & pengisian energi senjata.',bonus:'+3.5% energi / level',max:5,cost:75,owned:false,level:0,effect:l=>l*.035},{id:'thruster',name:'THRUSTER',icon:'➤',desc:'Pendorong tambahan untuk manuver lebih cepat.',bonus:'+3% speed / level',max:5,cost:65,owned:false,level:0,effect:l=>l*.03},{id:'rapidSystem',name:'RAPID SYSTEM',icon:'⟡',desc:'Sirkuit pemicu untuk mempercepat fire rate.',bonus:'+3% fire rate / level',max:5,cost:75,owned:false,level:0,effect:l=>l*.03}];
  const DRONES=[{id:'attackDrone',name:'ATTACK DRONE',icon:'◈',desc:'Drone tempur yang menembakkan bantuan berkala.',bonus:'Projectile bantuan berkala',cost:240,owned:false,equipped:false},{id:'shieldDrone',name:'SHIELD DRONE',icon:'◇',desc:'Drone pelindung yang mengurangi damage masuk.',bonus:'Defense tambahan 4%',cost:220,owned:false,equipped:false},{id:'coinDrone',name:'COIN DRONE',icon:'◆',desc:'Drone collector yang meningkatkan hasil coin.',bonus:'+1 coin dari musuh',cost:200,owned:false,equipped:false}];
  let equippedDroneId=null;let equippedModuleIds=[null,null];

  const ACHIEVEMENTS = [
    { id: 'firstblood', name: 'First Blood', desc: 'Kalahkan musuh pertamamu', target: 1, get: () => totalKills, reward: 15, achieved: false },
    { id: 'k25', name: 'Pemburu Pemula', desc: 'Kalahkan 25 musuh', target: 25, get: () => totalKills, reward: 30, achieved: false },
    { id: 'k100', name: 'Petarung Ulung', desc: 'Kalahkan 100 musuh', target: 100, get: () => totalKills, reward: 80, achieved: false },
    { id: 'k300', name: 'Sang Penakluk Galaksi', desc: 'Kalahkan 300 musuh', target: 300, get: () => totalKills, reward: 180, achieved: false },
    { id: 'lvl5', name: 'Penjelajah', desc: 'Capai level 5', target: 5, get: () => maxLevelReached, reward: 50, achieved: false },
    { id: 'lvl9', name: 'Penakluk Angkasa', desc: 'Capai level 9', target: 9, get: () => maxLevelReached, reward: 120, achieved: false },
    { id: 'boss1', name: 'Pembasmi Boss', desc: 'Kalahkan 1 boss', target: 1, get: () => bossesDefeated, reward: 40, achieved: false },
    { id: 'boss5', name: 'Penakluk Boss', desc: 'Kalahkan 5 boss', target: 5, get: () => bossesDefeated, reward: 150, achieved: false },
    { id: 'combo10', name: 'Rentetan Combo', desc: 'Capai combo x10', target: 10, get: () => maxComboSeen, reward: 45, achieved: false },
    { id: 'gun1', name: 'Kolektor Senjata', desc: 'Beli senjata baru', target: 1, get: () => WEAPONS.filter(w => w.owned).length - 1, reward: 35, achieved: false },
    { id: 'skin1', name: 'Armada Baru', desc: 'Beli pesawat baru', target: 1, get: () => SHIPS.filter(s => s.owned).length - 1, reward: 35, achieved: false },
    { id: 'guardian1', name: 'Nebula Guardian', desc: 'Selesaikan satu planet', target: 1, get: () => planetsCleared, reward: 60, achieved: false },
    { id: 'module1', name: 'Collector Module', desc: 'Beli 1 modul', target: 1, get: () => MODULES.filter(m=>m.owned).length, reward: 35, achieved: false },
    { id: 'drone1', name: 'Drone Collector', desc: 'Beli 1 drone', target: 1, get: () => DRONES.filter(d=>d.owned).length, reward: 45, achieved: false },
    { id: 'shopmaster', name: 'Shop Master', desc: 'Miliki 5 item tambahan di Armory', target: 5, get: () => (WEAPONS.filter(w=>w.owned).length-1)+(SHIPS.filter(s=>s.owned).length-1)+MODULES.filter(m=>m.owned).length+DRONES.filter(d=>d.owned).length, reward: 100, achieved: false },
    { id: 'fullloadout', name: 'Full Loadout', desc: 'Pasang senjata di kedua slot', target: 2, get: () => (equippedLeftId?1:0)+(equippedRightId?1:0), reward: 60, achieved: false }
  ];

  let toastQueue = [], toastShowing = false;
  function queueToast(text) { toastQueue.push(text); if (!toastShowing) showNextToast(); }
  function showNextToast() {
    if (toastQueue.length === 0) { toastShowing = false; return; }
    toastShowing = true;
    achieveToast.textContent = toastQueue.shift();
    achieveToast.style.opacity = '1';
    setTimeout(() => { achieveToast.style.opacity = '0'; setTimeout(showNextToast, 300); }, 1800);
  }
  function checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
      if (!a.achieved && a.get() >= a.target) {
        a.achieved = true;
        wallet += a.reward;
        refreshWallet();
        sfx.achieve();
        queueToast(`🏆 ${a.name} +${a.reward}💰`); saveProgress();
      }
    });
  }

