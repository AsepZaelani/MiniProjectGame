  // ---- Audio Manager: Web Audio API, satu sistem untuk seluruh game ----
  let audioCtx = null, soundOn = true;
  let audioPrefs = { master: 0.8, sfx: 0.8, music: 0.55 };
  const sfxCooldowns = {};
  function loadAudioPrefs(){
    try{
      const raw=localStorage.getItem('pn_audio_v23');
      if(raw) audioPrefs={...audioPrefs,...JSON.parse(raw)};
    }catch(e){}
    soundOn = localStorage.getItem('pn_sound_on') !== '0';
  }
  function saveAudioPrefs(){
    try{ localStorage.setItem('pn_audio_v23',JSON.stringify(audioPrefs)); localStorage.setItem('pn_sound_on',soundOn?'1':'0'); }catch(e){}
  }
  loadAudioPrefs();
  function ensureAudio(){
    if(!audioCtx){ try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){audioCtx=null;} }
    if(audioCtx && audioCtx.state==='suspended') audioCtx.resume();
    try{ if(typeof unlockMusic==='function') unlockMusic(); }catch(e){}
  }
  function beep(freq,duration,type,vol,delay=0,tag='tone'){
    if(!soundOn || !audioCtx || audioPrefs.master<=0 || audioPrefs.sfx<=0) return;
    const now=performance.now();
    const cd=tag==='shoot'?34:tag==='hit'?22:0;
    if(cd && sfxCooldowns[tag] && now-sfxCooldowns[tag]<cd) return;
    if(cd) sfxCooldowns[tag]=now;
    const t0=audioCtx.currentTime+delay;
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.type=type||'sine';
    osc.frequency.setValueAtTime(Math.max(30,freq),t0);
    gain.gain.setValueAtTime(Math.max(.0001,(vol||.1)*audioPrefs.master*audioPrefs.sfx),t0);
    gain.gain.exponentialRampToValueAtTime(.001,t0+duration);
    osc.connect(gain);gain.connect(audioCtx.destination);osc.start(t0);osc.stop(t0+duration+.02);
  }
  const sfx={
    ui:()=>{beep(520,.045,'triangle',.07,0,'ui');beep(760,.06,'triangle',.055,.045,'ui2')},
    back:()=>beep(280,.06,'triangle',.06,0,'ui'),
    tab:()=>beep(620,.035,'square',.045,0,'tab'),
    shoot:()=>beep(1040,.035,'square',.025,0,'shoot'),
    weapon:(id)=>{
      const map={
        blaster:[1050,'square'],twin:[880,'square'],spread:[540,'sawtooth'],laser:[1500,'sine'],homing:[430,'triangle'],
        plasma:[310,'sine'],railgun:[190,'sawtooth'],burst:[720,'square'],ion:[1320,'sine'],shatter:[250,'triangle'],
        thunder:[980,'sawtooth'],vortex:[360,'sine'],nova:[650,'sawtooth'],gravity:[170,'sawtooth']
      };
      const [f,t]=map[id]||[1000,'square']; beep(f,.055,t,.035,0,'shoot'); if(id==='twin'||id==='nova') beep(f*1.35,.045,'square',.024,.035,'shoot2');
    },
    enemyShoot:()=>beep(260,.07,'square',.035,0,'enemyShoot'),
    hitEnemy:()=>beep(320,.065,'square',.065,0,'hit'),
    enemyDown:()=>{beep(180,.12,'sawtooth',.07,0,'down');beep(90,.16,'sine',.045,.025,'down2')},
    explode:()=>{beep(180,.15,'sawtooth',.10,0,'explode');beep(82,.19,'sawtooth',.065,.025,'explode2')},
    hurt:()=>beep(120,.2,'square',.11,0,'hurt'),
    shieldHit:()=>beep(640,.08,'triangle',.07,0,'shield'),
    levelup:()=>{beep(523,.08,'triangle',.11,0,'level');beep(659,.08,'triangle',.11,.08,'level2');beep(784,.14,'triangle',.11,.16,'level3')},
    bossWarning:()=>{beep(110,.18,'sawtooth',.08,0,'boss');beep(220,.22,'sawtooth',.07,.12,'boss2')},
    bossEnter:()=>{beep(70,.3,'sawtooth',.10,0,'bossEnter');beep(145,.22,'triangle',.07,.16,'bossEnter2')},
    bossHit:()=>beep(240,.05,'square',.05,0,'bossHit'),
    bossPhase:()=>{beep(180,.12,'sawtooth',.08,0,'phase');beep(360,.16,'sawtooth',.08,.08,'phase2')},
    bossDown:()=>{beep(200,.15,'sawtooth',.12,0,'bossDown');beep(300,.16,'sawtooth',.1,.1,'bossDown2');beep(500,.3,'sine',.1,.2,'bossDown3')},
    coin:()=>{beep(700,.06,'triangle',.07,0,'coin');beep(980,.09,'triangle',.06,.06,'coin2')},
    purchase:()=>{beep(520,.07,'triangle',.07,0,'buy');beep(780,.11,'triangle',.07,.07,'buy2')},
    fail:()=>{beep(160,.08,'square',.07,0,'fail');beep(110,.12,'square',.06,.07,'fail2')},
    equip:()=>{beep(460,.06,'triangle',.06,0,'equip');beep(690,.08,'triangle',.06,.06,'equip2')},
    achieve:()=>{beep(740,.08,'triangle',.1,0,'ach');beep(988,.15,'triangle',.1,.08,'ach2')},
    powerup:()=>{beep(660,.08,'triangle',.1,0,'power');beep(990,.1,'triangle',.09,.08,'power2')},
    wave:()=>{beep(430,.06,'square',.06,0,'wave');beep(650,.09,'triangle',.07,.07,'wave2')},
    clear:()=>{beep(520,.07,'triangle',.08,0,'clear');beep(780,.12,'triangle',.08,.08,'clear2')},
    gameStart:()=>{beep(330,.08,'triangle',.07,0,'start');beep(495,.1,'triangle',.07,.08,'start2')},
    countdown:()=>beep(520,.05,'square',.06,0,'count'),
    pause:()=>beep(300,.06,'triangle',.06,0,'pause'),
    gameover:()=>{beep(240,.16,'sawtooth',.08,0,'gameover');beep(120,.22,'sawtooth',.07,.12,'gameover2')},
    meteorWarn:()=>{beep(180,.06,'triangle',.035,0,'meteorWarn')},
    meteorHit:()=>{beep(95,.09,'sawtooth',.06,0,'meteorHit');beep(180,.07,'triangle',.035,.04,'meteorHit2')},
    meteorBreak:()=>{beep(130,.12,'sawtooth',.055,0,'meteorBreak');beep(260,.08,'triangle',.035,.05,'meteorBreak2')},
    combo:()=>{beep(600,.05,'square',.05,0,'combo');beep(900,.06,'triangle',.05,.05,'combo2');beep(1200,.08,'triangle',.045,.1,'combo3')}
  };
  function updateAudioUI(){
    masterVol.value=Math.round(audioPrefs.master*100); sfxVol.value=Math.round(audioPrefs.sfx*100);
    masterVolVal.textContent=Math.round(audioPrefs.master*100)+'%'; sfxVolVal.textContent=Math.round(audioPrefs.sfx*100)+'%';
    if(musicVol){ musicVol.value=Math.round(audioPrefs.music*100); musicVolVal.textContent=Math.round(audioPrefs.music*100)+'%'; }
    muteAllBtn.textContent=soundOn?'🔊 SUARA AKTIF':'🔇 MUTE ALL'; muteAllBtn.classList.toggle('on',soundOn);
    soundBtn.textContent=soundOn?'🔊 SUARA ON':'🔇 SUARA OFF'; soundBtn.classList.toggle('on',soundOn);
  }
  updateAudioUI();

  // ---- Music Manager: BGM Astro Avenger 2 (menu / shop / gameplay / boss) ----
  // Trek dipanggil sebagai file .mp3 biasa (path relatif ke folder yang sama dengan
  // HTML/CSS/JS ini) — bukan ditanam sebagai base64 di dalam JS, supaya file JS tetap
  // kecil dan aman dibuka/dipindah di file manager mana pun.
  const MUSIC_SRC = {
    menu: 'menu.mp3',
    shop: 'shop.mp3',
    game: 'game.mp3',
    boss: 'boss.mp3'
  };
  const musicEls = {};
  let currentMusic = null;
  let musicUnlocked = false;
  let musicLastError = null;
  const MUSIC_FADE_STEP = 0.05;

  function getMusicEl(key){
    if(!musicEls[key]){
      const a = new Audio();
      a.loop = true; a.preload = 'auto'; a.volume = 0;
      a.addEventListener('error', ()=>{ musicLastError = 'load-error:' + key + ' (cek nama file & lokasi ' + MUSIC_SRC[key] + ')'; });
      a.src = MUSIC_SRC[key];
      try{ a.load(); }catch(e){}
      musicEls[key] = a;
    }
    return musicEls[key];
  }
  function musicTargetVol(){
    if(!soundOn) return 0;
    return Math.max(0, Math.min(1, audioPrefs.master * audioPrefs.music));
  }
  function tryPlay(el){
    if(!el || musicTargetVol() <= 0) return;
    let p;
    try{ p = el.play(); }catch(e){ musicLastError = 'play-throw:' + e; return; }
    if(p && p.catch) p.catch(err=>{ musicUnlocked = false; musicLastError = 'play-block:' + err; });
  }
  function playMusic(key){
    if(currentMusic === key) return;
    currentMusic = key;
    if(!key) return;
    const el = getMusicEl(key);
    try{ el.currentTime = 0; }catch(e){}
    tryPlay(el);
  }
  function unlockMusic(){
    musicUnlocked = true;
    if(currentMusic) tryPlay(getMusicEl(currentMusic));
  }
  // Trek dipilih dari state permainan, bukan ditempel di tiap tombol, supaya tidak ada
  // jalur navigasi yang terlewat (menu, map, mission, pause, shop, boss, dst).
  // Cek visibilitas panel lewat computed style, bukan inline style saja — beberapa panel
  // (shopPanel, customizePanel) disembunyikan lewat class CSS "display:none", jadi
  // sebelum JS pernah menyentuh .style.display secara eksplisit, nilai inline-nya masih
  // string kosong ('') dan gampang salah dibaca sebagai "sedang terbuka".
  function panelVisible(el){
    if(!el) return false;
    try{ return window.getComputedStyle(el).display !== 'none'; }
    catch(e){ return el.style.display !== 'none' && el.style.display !== ''; }
  }
  function pickMusicKey(){
    try{
      if(typeof midGameBreak !== 'undefined' && midGameBreak) return 'shop';
      if(panelVisible(shopPanel)) return 'shop';
      if(panelVisible(customizePanel)) return 'shop';
      if(typeof running !== 'undefined' && running) return (typeof bossActive !== 'undefined' && bossActive) ? 'boss' : 'game';
    }catch(e){}
    return 'menu';
  }
  function musicTick(){
    playMusic(pickMusicKey());
    const target = musicTargetVol();
    for(const k in musicEls){
      const el = musicEls[k];
      const want = (k === currentMusic) ? target : 0;
      const v = el.volume;
      if(Math.abs(v - want) <= MUSIC_FADE_STEP) el.volume = want;
      else el.volume = Math.max(0, Math.min(1, v + (want > v ? MUSIC_FADE_STEP : -MUSIC_FADE_STEP)));
      if(want <= 0 && el.volume <= 0.001){ if(!el.paused) el.pause(); }
    }
    if(currentMusic && target > 0){
      const cur = getMusicEl(currentMusic);
      if(cur.paused) tryPlay(cur);   // retry terus sampai browser mengizinkan
    }
  }
  setInterval(musicTick, 120);
  playMusic('menu');
  ['pointerdown','touchstart','touchend','mousedown','keydown','click'].forEach(ev=>{
    window.addEventListener(ev, unlockMusic, { capture: true, passive: true });
    document.addEventListener(ev, unlockMusic, { capture: true, passive: true });
  });
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){ for(const k in musicEls){ try{ musicEls[k].pause(); }catch(e){} } }
    else if(currentMusic) tryPlay(getMusicEl(currentMusic));
  });
  // Diagnosa cepat: ketik musicStatus() di console browser kalau musik tidak terdengar.
  window.musicStatus = function(){
    const el = currentMusic ? musicEls[currentMusic] : null;
    return { soundOn, master: audioPrefs.master, music: audioPrefs.music, target: musicTargetVol(),
             currentMusic, unlocked: musicUnlocked, paused: el ? el.paused : null,
             volume: el ? el.volume : null, readyState: el ? el.readyState : null,
             currentTime: el ? el.currentTime : null, lastError: musicLastError };
  };


  const DIFFICULTIES = {
    santai: { label: 'Santai', spawnDelayMult: 1.35, speedMult: 0.8, bossHpMult: 0.75, startLives: 4 },
    normal: { label: 'Normal', spawnDelayMult: 1.0, speedMult: 1.0, bossHpMult: 1.0, startLives: 3 },
    sulit: { label: 'Sulit', spawnDelayMult: 0.72, speedMult: 1.28, bossHpMult: 1.35, startLives: 2 }
  };
  let chosenDiff = 'santai';

