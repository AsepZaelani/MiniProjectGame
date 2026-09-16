  initState();
  // Auto-save progres berkala + saat tab/halaman ditutup (dipasang sekali saat boot, bukan tiap kali keluar dari game,
  // supaya tidak menumpuk banyak interval/listener yang bisa membuat progres level/perisai terasa "reset" atau tidak konsisten).
  setInterval(saveProgress, 2200);
  window.addEventListener('beforeunload', saveProgress);
  // Pastikan semua elemen HUD gameplay (wave/skor/hp/koin/level/ultimate) benar-benar
  // tersembunyi di layar menu awal — hanya muncul saat pertandingan sedang berjalan.
  hud.style.display = 'none';
  waveTag.style.display = 'none';
  planetTag.style.display = 'none';
  bossBarWrap.style.display = 'none';
  hpWrap.style.display = 'none';
  // HUD gameplay tidak boleh terbawa ke menu utama.
  astroCombatHud.style.display = 'none';
  energyMeter.style.display = 'none';
  armorMeter.style.display = 'none';
  rapidBuffBadge.style.display = 'none';
  shieldBuffBadge.style.display = 'none';
  pauseBtn.style.display = 'none';
  menuPanel.style.display='flex'; menuPanel.style.flexDirection='column'; menuPanel.style.alignItems='center';
  gameOverPanel.style.display='none';
  renderMap(0);
  if(menuCoins) menuCoins.textContent = wallet;
  if(menuHigh) menuHigh.textContent = sessionHigh;
  requestAnimationFrame(menuBgLoop);

  // Partikel debu ruang angkasa yang melayang pelan di overlay — sentuhan hidup, murni CSS (tidak butuh loop JS).
  (function spawnDust() {
    const layer = document.getElementById('dustLayer');
    if (!layer) return;
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
      s.style.animationDuration = (10 + Math.random() * 12) + 's';
      s.style.animationDelay = (Math.random() * 12) + 's';
      s.style.opacity = (0.3 + Math.random() * 0.4).toString();
      layer.appendChild(s);
    }
  })();
