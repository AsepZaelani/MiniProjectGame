// ---- Visual armory items: Drone, Modul, Kosmetik — masing-masing digambar unik di canvas ----
  function droneColor(id){ return id==='attackDrone'?'#FF6B6B':id==='shieldDrone'?'#4ECDC4':id==='coinDrone'?'#FFD166':'#9DE7FF'; }
  function drawDroneCraft(d, x, y, scale=1, angle=0, idle=0) {
    if(!d) return;
    const c = droneColor(d.id), t = animTick;
    ctx.save();
    ctx.translate(x, y + Math.sin(t*.055 + idle)*2.2*scale);
    ctx.rotate(angle + Math.sin(t*.035 + idle)*.045);
    ctx.scale(scale, scale);
    ctx.globalCompositeOperation='lighter';
    ctx.globalAlpha=.16 + Math.sin(t*.09+idle)*.04; ctx.fillStyle=c;
    ctx.beginPath(); ctx.arc(0,0,17,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';
    // Mini spacecraft engine + flame
    ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=c; ctx.globalAlpha=.72 + Math.sin(t*.22+idle)*.2;
    ctx.beginPath(); ctx.moveTo(-3,8); ctx.lineTo(0,18+Math.sin(t*.4+idle)*2); ctx.lineTo(3,8); ctx.closePath(); ctx.fill();
    ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';
    // Main fighter hull
    ctx.fillStyle='#10152A'; ctx.strokeStyle=c; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(5,-4); ctx.lineTo(11,7); ctx.lineTo(5,6); ctx.lineTo(0,10); ctx.lineTo(-5,6); ctx.lineTo(-11,7); ctx.lineTo(-5,-4); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Wings / structures
    ctx.fillStyle='#1C2744'; ctx.strokeStyle=c;
    ctx.beginPath(); ctx.moveTo(-4,-1); ctx.lineTo(-15,5); ctx.lineTo(-9,8); ctx.lineTo(-2,5); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4,-1); ctx.lineTo(15,5); ctx.lineTo(9,8); ctx.lineTo(2,5); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Cockpit/core
    ctx.globalCompositeOperation='lighter'; ctx.fillStyle=c; ctx.globalAlpha=.85;
    ctx.beginPath(); ctx.ellipse(0,-3,3.1,4.5,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFFFFF'; ctx.globalAlpha=.7; ctx.beginPath(); ctx.arc(-.8,-4.2,1,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';
    // Unique role details
    if(d.id==='attackDrone'){
      ctx.strokeStyle='#FF8A8A'; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(-6,-1); ctx.lineTo(-12,-5); ctx.moveTo(6,-1); ctx.lineTo(12,-5); ctx.stroke();
      ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(-12,-5,1.2,0,Math.PI*2); ctx.arc(12,-5,1.2,0,Math.PI*2); ctx.fill();
      if(Math.floor(t/8)%2===0){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#FFFFFF';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-8,-6);ctx.lineTo(-13,-9);ctx.moveTo(8,-6);ctx.lineTo(13,-9);ctx.stroke();ctx.globalCompositeOperation='source-over';}
    } else if(d.id==='shieldDrone'){
      ctx.globalCompositeOperation='lighter'; ctx.strokeStyle=c; ctx.lineWidth=1.2; ctx.globalAlpha=.72;
      ctx.beginPath(); ctx.arc(0,0,13+Math.sin(t*.12)*1.2,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0,0,16,Math.PI*.15,Math.PI*1.1); ctx.stroke(); ctx.globalAlpha=1;
      for(let i=0;i<3;i++){const a=t*.035+i*Math.PI*2/3;ctx.fillStyle='#DFFFFF';ctx.beginPath();ctx.arc(Math.cos(a)*14,Math.sin(a)*14,1.1,0,Math.PI*2);ctx.fill();}
      ctx.globalCompositeOperation='source-over';
    } else if(d.id==='coinDrone'){
      ctx.strokeStyle=c; ctx.lineWidth=1.2; ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#FFF4B8';ctx.beginPath();ctx.arc(0,-3,2.2,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#FFD166';ctx.beginPath();ctx.moveTo(-8,4);ctx.lineTo(-13,10);ctx.moveTo(8,4);ctx.lineTo(13,10);ctx.stroke();
      ctx.globalCompositeOperation='lighter';ctx.fillStyle='#FFD166';
      for(let i=0;i<3;i++){const a=t*.05+i*2.1;ctx.globalAlpha=.5+Math.sin(t*.1+i)*.3;ctx.beginPath();ctx.arc(Math.cos(a)*12,Math.sin(a)*12,1.1,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    }
    // Tiny engine sparks / trail
    ctx.globalCompositeOperation='lighter';
    for(let i=0;i<2;i++){const yy=12+i*3+(t*.8+i*7)%7;ctx.globalAlpha=Math.max(0,1-((yy-12)/13));ctx.fillStyle=c;ctx.beginPath();ctx.arc((i?1:-1)*Math.sin(t*.08+i),yy,0.8,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    ctx.restore();
  }
  function drawDroneIcon(d) { drawDroneCraft(d, 0, 0, 1.05, 0, (d?.id||'').length); }
  function drawGameplayDrone() {
    const d=activeDrone(); if(!d || !player) return;
    const targetX=player.x + (player.vx>=0 ? 48 : -48) + Math.sin(animTick*.045+droneVisualSeed)*5;
    const targetY=player.y - 2 + Math.sin(animTick*.075+droneVisualSeed)*12;
    droneVisualVX += (targetX-droneVisualX)*.045;
    droneVisualVY += (targetY-droneVisualY)*.045;
    droneVisualVX *= .88; droneVisualVY *= .88;
    droneVisualX += droneVisualVX; droneVisualY += droneVisualVY;
    const ang=Math.atan2(droneVisualY-player.y,droneVisualX-player.x)*.16;
    drawDroneCraft(d,droneVisualX,droneVisualY,.82,ang,droneVisualSeed);
  }
  function drawHangarDronePreview(cw,ch) {
    const d=activeDrone(); if(!d) return;
    const oldX=ctx;
    drawDroneCraft(d,cw/2+34,ch/2+5,.62,0,13);
    ctx=oldX;
  }

  function moduleColor(id){ return id==='shieldCore'?'#4ECDC4':id==='armorPlate'?'#FFD166':id==='energyCore'?'#FF9F6B':id==='thruster'?'#8FD3FF':id==='rapidSystem'?'#C77DFF':'#9DE7FF'; }
  function drawModuleIcon(m) {
    const t = animTick; const c = moduleColor(m.id);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .16; ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 1.3; ctx.strokeStyle = c; ctx.fillStyle = '#161033';
    switch (m.id) {
      case 'shieldCore': {
        ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        const shp = 1 + Math.sin(t*.2)*.08;
        ctx.strokeStyle = c; ctx.globalAlpha = .85; ctx.beginPath(); ctx.arc(0, 0, 11*shp, 0, Math.PI*2); ctx.stroke();
        ctx.globalAlpha = .4; ctx.beginPath(); ctx.arc(0, 0, 11*shp, Math.PI*.2, Math.PI*1.1); ctx.stroke(); ctx.globalAlpha = 1;
        break;
      }
      case 'armorPlate':
        ctx.beginPath(); ctx.moveTo(0,-11); ctx.lineTo(9,-4); ctx.lineTo(6,10); ctx.lineTo(-6,10); ctx.lineTo(-9,-4); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.moveTo(0,-8); ctx.lineTo(0,7); ctx.stroke();
        break;
      case 'energyCore': {
        const pulse = 1 + Math.sin(t*.25)*.15;
        ctx.beginPath(); ctx.arc(0, 0, 8*pulse, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = .7;
        ctx.beginPath(); ctx.arc(0, 0, 3*pulse, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < 4; i++) { const a = t*.08 + i*Math.PI/2; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(Math.cos(a)*8, Math.sin(a)*8); ctx.lineTo(Math.cos(a)*13, Math.sin(a)*13); ctx.stroke(); }
        break;
      }
      case 'thruster': {
        ctx.beginPath(); ctx.moveTo(-5,-10); ctx.lineTo(5,-10); ctx.lineTo(6,6); ctx.lineTo(-6,6); ctx.closePath(); ctx.fill(); ctx.stroke();
        const flame = 6 + Math.sin(t*.5)*3;
        const grad = ctx.createLinearGradient(0,6,0,6+flame); grad.addColorStop(0,'#FFFFFF'); grad.addColorStop(.4,c); grad.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(-4,6); ctx.lineTo(0,6+flame); ctx.lineTo(4,6); ctx.closePath(); ctx.fill();
        break;
      }
      case 'rapidSystem':
        ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        for (let i = 0; i < 3; i++) { const off = ((t*0.6 + i*7) % 18); ctx.globalAlpha = Math.max(0, 1 - off/18); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, -9-off, 1.6, 0, Math.PI*2); ctx.fill(); }
        ctx.globalAlpha = 1;
        break;
      default:
        ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }


  function drawShip(p) {
    const shipDef = getShip(equippedShipId);
    const color = shipDef.color;
    animTick++;
    ctx.save();
    ctx.translate(p.x, p.y);
    // Miring halus saat bergerak kiri/kanan agar pesawat terasa benar-benar bergerak.
    ctx.rotate(p.tilt || 0);

    // Aura hidup di belakang lambung — berdenyut pelan agar kapal terasa "bernapas".
    const auraPulse = 0.55 + Math.sin(animTick * 0.06) * 0.18;
    ctx.globalCompositeOperation = 'lighter';
    const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, 30);
    aura.addColorStop(0, color + '00');
    aura.addColorStop(0.7, color + Math.round(auraPulse * 40).toString(16).padStart(2, '0'));
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Efek visual perisai (ring biru) khusus gameplay: sengaja disembunyikan saat preview
    // di toko/hangar (suppressShipWeapons true) agar tampilan kapal di toko tetap bersih.
    if (shieldTimer > 0 && !suppressShipWeapons) {
      const shPulse = 1 + Math.sin(animTick * 0.25) * 0.04;
      ctx.beginPath(); ctx.arc(0, -2, 27 * shPulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(78,205,196,0.85)'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = 'rgba(78,205,196,0.12)'; ctx.fill();
      ctx.strokeStyle = 'rgba(220,255,250,0.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, -2, 27 * shPulse - 4, animTick * 0.03, animTick * 0.03 + Math.PI * 1.2); ctx.stroke();
    }

    const flameLen = 10 + Math.sin(animTick * 0.5) * 4;
    if(animTick%3===0 && fxParticles.length<FX_CAP-4){
      const ec=shipDef.color;
      for(let i=0;i<2;i++) addFx(p.x+(Math.random()-.5)*5,p.y+15,{color:ec,speed:.35+Math.random()*.8,angle:Math.PI/2+(Math.random()-.5)*.3,life:10+Math.random()*10,r:.7+Math.random()*1.3,alpha:.7,glow:true});
    }
    const flicker = 0.85 + Math.sin(animTick * 1.3) * 0.15;
    const glowColor = shipDef.color;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = glowColor; ctx.globalAlpha = .22 * flicker;
    ctx.beginPath(); ctx.arc(0, 15 + flameLen*.35, 13, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    // Ekor mesin dua lapis: inti putih panas + selubung warna kapal + percikan kecil.
    const flameGrad = ctx.createLinearGradient(0, 12, 0, 12 + flameLen * flicker);
    flameGrad.addColorStop(0, '#FFFFFF');
    flameGrad.addColorStop(.25, glowColor);
    flameGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = flameGrad;
    ctx.beginPath(); ctx.moveTo(-7, 11); ctx.lineTo(0, 12 + flameLen * flicker); ctx.lineTo(7, 11); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = .8;
    ctx.beginPath(); ctx.moveTo(-2.5, 11); ctx.lineTo(0, 12 + flameLen * 0.6); ctx.lineTo(2.5, 11); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    for (let i = 0; i < 2; i++) {
      const sp = ((animTick * 1.7 + i * 47) % 24);
      ctx.globalAlpha = Math.max(0, 1 - sp / 24) * .7;
      ctx.fillStyle = glowColor;
      ctx.beginPath(); ctx.arc((i === 0 ? -3 : 3) * Math.sin(animTick * 0.1 + i), 14 + sp, 1.3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    const pts = shipHull(shipDef.shape);
    const grad = ctx.createLinearGradient(0, -20, 0, 18);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.35, color);
    grad.addColorStop(1, '#00000055');
    ctx.fillStyle = grad;
    ctx.beginPath();
    pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.stroke();
    // Garis rim-light tipis di sisi kanan-atas agar lambung terlihat mengilap & bervolume.
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-2, -19); ctx.lineTo(9, -2); ctx.lineTo(6, 12); ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#1A1030';
    ctx.beginPath(); ctx.ellipse(0, -2, 3.4, 5.2, 0, 0, Math.PI * 2); ctx.fill();
    // Inti kokpit berdenyut lembut seperti reaktor hidup.
    const cockpitGlow = 0.45 + Math.sin(animTick * 0.12) * 0.25;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = color; ctx.globalAlpha = cockpitGlow * 0.6;
    ctx.beginPath(); ctx.ellipse(0, -2, 5.4, 7.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.ellipse(-1, -4, 1.1, 1.8, 0, 0, Math.PI * 2); ctx.fill();

    // Detail panels & armor plating
    ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-9,-8); ctx.lineTo(-4,7); ctx.lineTo(-9,11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(9,-8); ctx.lineTo(4,7); ctx.lineTo(9,11); ctx.stroke();
    ctx.fillStyle = color; ctx.globalAlpha=.55;
    ctx.fillRect(-13,2,5,8); ctx.fillRect(8,2,5,8); ctx.globalAlpha=1;
    // Garis energi kecil yang berkedip di panel samping — kesan sirkuit hidup.
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = 0.5 + Math.sin(animTick * 0.2) * 0.4;
    ctx.fillRect(-13, 5 + Math.sin(animTick*0.15)*2, 5, 1.2);
    ctx.fillRect(8, 5 + Math.cos(animTick*0.15)*2, 5, 1.2);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    // Modul senjata: dipasang kiri & kanan, mengikuti senjata aktif dari Toko.
    // (Disembunyikan saat preview di Toko Pesawat agar tidak tertukar dengan tampilan Hangar.)
    if (!suppressShipWeapons) {
      drawWeaponModule(equippedWeaponId || 'blaster', -1);
      drawWeaponModule(equippedWeaponId || 'blaster', 1);
    }
    // Ship-specific silhouettes/details
    if (shipDef.id === 'interceptor') {
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-17,8); ctx.lineTo(-25,15); ctx.lineTo(-10,12); ctx.moveTo(17,8); ctx.lineTo(25,15); ctx.lineTo(10,12); ctx.stroke();
      ctx.fillStyle = '#DFFFFB'; ctx.beginPath(); ctx.arc(0,-11,2.2,0,Math.PI*2); ctx.fill();
    } else if (shipDef.id === 'cruiser') {
      ctx.fillStyle = '#202043'; ctx.fillRect(-12,7,24,7); ctx.strokeStyle=color; ctx.strokeRect(-12,7,24,7);
      ctx.fillStyle='#FFFFFF'; ctx.fillRect(-5,-1,10,2);
    } else if (shipDef.id === 'fortress') {
      ctx.fillStyle='#2A274D'; ctx.fillRect(-18,5,7,8); ctx.fillRect(11,5,7,8);
      ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=1; ctx.strokeRect(-18,5,7,8); ctx.strokeRect(11,5,7,8);
      ctx.beginPath(); ctx.arc(0,6,7,0,Math.PI*2); ctx.stroke();
    } else if (shipDef.id === 'striker') {
      ctx.strokeStyle=color; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-12,-2); ctx.lineTo(-23,-12); ctx.lineTo(-16,4); ctx.moveTo(12,-2); ctx.lineTo(23,-12); ctx.lineTo(16,4); ctx.stroke();
      ctx.fillStyle='#FFFFFF'; ctx.fillRect(-2,-15,4,5);
    } else if (shipDef.id === 'phantom') {
      ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(0,0,23,Math.PI*.12,Math.PI*.88); ctx.stroke();
      ctx.fillStyle=color; ctx.globalAlpha=.7; ctx.beginPath(); ctx.arc(-18,-2,3,0,Math.PI*2); ctx.arc(18,-2,3,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    } else if (shipDef.id === 'titan') {
      ctx.fillStyle='#3A314D'; ctx.fillRect(-20,0,8,13); ctx.fillRect(12,0,8,13);
      ctx.strokeStyle=color; ctx.lineWidth=2; ctx.strokeRect(-20,0,8,13); ctx.strokeRect(12,0,8,13);
      ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(0,8,3,0,Math.PI*2); ctx.fill();
    }
    for (let i = 0; i < shipDef.level; i++) {
      ctx.fillStyle = COLORS.amber;
      ctx.beginPath(); ctx.arc(-10 + i * 5, 20, 1.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function drawEnemy(e) {
    const def = ENEMY_TYPES[e.type];
    const c = def.color;
    const seed = e.seed || 0;
    const breathe = 0.5 + Math.sin(animTick * 0.07 + seed * 4) * 0.5;
    ctx.save(); ctx.translate(e.x,e.y); ctx.rotate(e.rot);

    // Aura luar yang "bernapas" — membuat musuh terasa hidup, bukan sekadar ikon statis.
    ctx.globalCompositeOperation='lighter'; ctx.fillStyle=c; ctx.globalAlpha=.10 + breathe * .09;
    ctx.beginPath(); ctx.arc(0,0,e.r*(1.4 + breathe*.12),0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    ctx.globalCompositeOperation='source-over';

    // Cincin energi berputar mengelilingi musuh, memberi kesan teknologi/organik yang aktif.
    ctx.save();
    ctx.rotate(animTick * 0.02 + seed);
    ctx.strokeStyle = c; ctx.globalAlpha = .35 + breathe * .25; ctx.lineWidth = 1.3;
    ctx.setLineDash([e.r * 0.55, e.r * 0.9]);
    ctx.beginPath(); ctx.arc(0, 0, e.r * 1.22, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1;
    ctx.restore();

    // Siluet dasar — didesain ulang menjadi bentuk pesawat musuh (hull + kokpit + mesin), bukan sekadar ikon geometris.
    ctx.fillStyle='#15142B'; ctx.strokeStyle=c; ctx.lineWidth=2;
    const SHIP_HULLS = {
      spike:   [[0,14],[6,4],[9,-8],[4,-12],[0,-9],[-4,-12],[-9,-8],[-6,4]],
      diamond: [[0,13],[10,2],[5,-6],[13,-11],[3,-9],[0,-13],[-3,-9],[-13,-11],[-5,-6],[-10,2]],
      star:    [[0,10],[4,2],[10,3],[3,-3],[5,-10],[0,-6],[-5,-10],[-3,-3],[-10,3],[-4,2]],
      hex:     [[0,-11],[8,-5],[10,5],[4,11],[-4,11],[-10,5],[-8,-5]],
      crystal: [[0,-13],[7,-3],[5,12],[0,7],[-5,12],[-7,-3]],
      arrow:   [[0,15],[3,0],[14,-10],[3,-6],[0,-13],[-3,-6],[-14,-10],[-3,0]],
      ghost:   [[0,12],[6,4],[5,-6],[11,-10],[0,-6],[-11,-10],[-5,-6],[-6,4]],
      shooter: [[0,-12],[8,-2],[9,10],[3,7],[3,16],[-3,16],[-3,7],[-9,10],[-8,-2]]
    };
    function drawEnemyHull(pts) {
      const scale = e.r / 13;
      ctx.save(); ctx.scale(scale, scale);
      const grad = ctx.createLinearGradient(0, -13, 0, 13);
      grad.addColorStop(0, '#4A447A'); grad.addColorStop(0.5, c); grad.addColorStop(1, '#15142B');
      ctx.beginPath(); pts.forEach(([x,y],i)=> i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = c; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.restore();
      // Kokpit (nose menghadap arah gerak, ke bawah menuju pemain)
      ctx.fillStyle = '#0A0918';
      ctx.beginPath(); ctx.ellipse(0, e.r*0.16, e.r*0.22, e.r*0.3, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.42)';
      ctx.beginPath(); ctx.ellipse(-e.r*0.06, e.r*0.06, e.r*0.08, e.r*0.12, 0, 0, Math.PI*2); ctx.fill();
      // Nyala mesin di belakang (atas, karena musuh bergerak turun)
      ctx.globalCompositeOperation='lighter'; ctx.fillStyle=c; ctx.globalAlpha=.45 + breathe*.25;
      ctx.beginPath(); ctx.ellipse(0, -e.r*0.78, e.r*0.2, e.r*0.32, 0, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';
    }
    const isShipHull = !!SHIP_HULLS[def.shape];
    if (isShipHull) {
      drawEnemyHull(SHIP_HULLS[def.shape]);
    } else if(def.shape==='tank'){
      ctx.beginPath(); ctx.roundRect(-e.r,-e.r*.62,e.r*2,e.r*1.24,5); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#29264A'; ctx.fillRect(-e.r*.42,-e.r*.9,e.r*.84,e.r*1.8); ctx.strokeRect(-e.r*.42,-e.r*.9,e.r*.84,e.r*1.8);
      ctx.fillStyle=c; ctx.fillRect(-e.r*.62,-e.r*.15,e.r*1.24,e.r*.3);
      // Meriam kembar di sisi kiri-kanan agar terasa seperti kapal tempur berat.
      ctx.fillStyle='#0A0918'; ctx.fillRect(-e.r*1.05,-e.r*.12,e.r*.3,e.r*.5); ctx.fillRect(e.r*.75,-e.r*.12,e.r*.3,e.r*.5);
      ctx.fillStyle='#FFF'; ctx.fillRect(-3,-3,6,6);
    } else if(def.shape==='mine'){
      ctx.fillStyle='#17162D'; ctx.beginPath();ctx.arc(0,0,e.r*.68,0,Math.PI*2);ctx.fill();ctx.stroke();
      for(let i=0;i<10;i++){const a=i*Math.PI/5;ctx.strokeStyle=c;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(Math.cos(a)*e.r*.55,Math.sin(a)*e.r*.55);ctx.lineTo(Math.cos(a)*e.r,Math.sin(a)*e.r);ctx.stroke();}
      ctx.fillStyle=c;ctx.beginPath();ctx.arc(0,0,e.r*.23,0,Math.PI*2);ctx.fill();
    } else if(def.shape==='crystal'){
      ctx.beginPath();ctx.moveTo(0,-e.r);ctx.lineTo(e.r*.7,-e.r*.25);ctx.lineTo(e.r*.42,e.r);ctx.lineTo(0,e.r*.55);ctx.lineTo(-e.r*.42,e.r);ctx.lineTo(-e.r*.7,-e.r*.25);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#EFFFFF';ctx.globalAlpha=.75;ctx.beginPath();ctx.moveTo(0,-e.r*.72);ctx.lineTo(e.r*.2,-e.r*.1);ctx.lineTo(0,e.r*.38);ctx.lineTo(-e.r*.18,-e.r*.08);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
    } else if(def.shape==='blob'){
      ctx.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6,rr=e.r*(.76+Math.sin(a*3+e.seed)*.13);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();
      // Sirip organik kecil menyerupai lambung pesawat bio agar tetap terasa seperti wahana, bukan sekadar gumpalan.
      ctx.fillStyle=c; ctx.globalAlpha=.5;
      ctx.beginPath(); ctx.ellipse(-e.r*.7,e.r*.3,e.r*.22,e.r*.4,-0.4,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(e.r*.7,e.r*.3,e.r*.22,e.r*.4,0.4,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=.55;ctx.beginPath();ctx.arc(-e.r*.3,-e.r*.15,e.r*.16,0,Math.PI*2);ctx.arc(e.r*.28,-e.r*.1,e.r*.12,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    } else if(def.shape==='ghost'){
      ctx.beginPath();ctx.arc(0,-2,e.r*.76,Math.PI,0);ctx.lineTo(e.r*.76,e.r*.72);ctx.lineTo(e.r*.35,e.r*.45);ctx.lineTo(0,e.r*.75);ctx.lineTo(-e.r*.35,e.r*.45);ctx.lineTo(-e.r*.76,e.r*.72);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle=c;ctx.beginPath();ctx.arc(0,-2,e.r*.48,0,Math.PI*2);ctx.stroke();
    } else if(def.shape==='void'){
      const g=ctx.createRadialGradient(0,0,2,0,0,e.r);g.addColorStop(0,'#FFF');g.addColorStop(.18,c);g.addColorStop(.65,'#241344');g.addColorStop(1,'rgba(0,0,0,.1)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,e.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle=c;ctx.beginPath();ctx.arc(0,0,e.r*.7,0,Math.PI*1.5);ctx.stroke();
    } else if(def.shape==='orb'){
      // Drone pengorbit — badan bulat + sirip kecil menyerupai satelit tempur.
      ctx.beginPath(); ctx.arc(0,0,e.r*.7,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#0A0918'; ctx.beginPath(); ctx.ellipse(0,0,e.r*.28,e.r*.2,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=c; ctx.lineWidth=1.6;
      for(let i=0;i<3;i++){ const a=i*Math.PI*2/3; ctx.beginPath(); ctx.moveTo(Math.cos(a)*e.r*.7,Math.sin(a)*e.r*.7); ctx.lineTo(Math.cos(a)*e.r*1.15,Math.sin(a)*e.r*1.15); ctx.stroke(); }
    } else {
      const spikes=def.spikes||6;ctx.beginPath();for(let i=0;i<spikes;i++){const a=i*Math.PI*2/spikes,rr=i%2===0?e.r:e.r*.58;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();
    }
    // Mata/inti dan armor tambahan — dilewati untuk siluet pesawat baru karena sudah punya kokpit sendiri.
    if (!isShipHull) {
      ctx.fillStyle='#09091A';ctx.beginPath();ctx.ellipse(0,0,e.r*.38,e.r*.27,0,0,Math.PI*2);ctx.fill();
      ctx.globalCompositeOperation='lighter';
      ctx.fillStyle=c; ctx.globalAlpha = .35 + breathe * .45;
      ctx.beginPath(); ctx.arc(0,0,e.r*(.13 + breathe*.06),0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFFFFF'; ctx.globalAlpha = breathe * .5;
      ctx.beginPath(); ctx.arc(0,0,e.r*.06,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation='source-over';
    }
    ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,e.r*.82,0,Math.PI*2);ctx.stroke();
    ctx.restore();
    if (e.maxHp && e.maxHp > 1) {
      const bw = e.r * 1.9, bh = 3.4;
      const bx = e.x - bw / 2, by = e.y - e.r - 10;
      const ratio = Math.max(0, Math.min(1, e.hp / e.maxHp));
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
      ctx.fillStyle = '#241f3d'; ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = ratio > 0.5 ? '#6BFF95' : ratio > 0.25 ? '#FFD166' : '#FF5C5C';
      ctx.fillRect(bx, by, bw * ratio, bh);
    }
  }

  function drawBoss(b) {
    const def = BOSS_DEFS[bossDefIdx];
    const bossBreathe = 0.5 + Math.sin(animTick * 0.05) * 0.5;
    if(animTick%4===0 && fxParticles.length<FX_CAP-5){
      for(let i=0;i<2;i++){const a=Math.random()*Math.PI*2,rr=b.r*(1.05+Math.random()*.55);addFx(b.x+Math.cos(a)*rr,b.y+Math.sin(a)*rr,{color:def.color,speed:.15+Math.random()*.5,angle:a+Math.PI+(Math.random()-.5)*.7,life:18+Math.random()*12,r:.7+Math.random()*1.4,alpha:.7,glow:true});}
    }
    const entryScale = b.entryProgress != null ? b.entryProgress : 1;
    ctx.save(); ctx.translate(b.x, b.y);
    ctx.globalAlpha = entryScale;
    ctx.scale(entryScale, entryScale);
    if (bossPhase2) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = '#FF4D8D'; ctx.globalAlpha = 0.28 + Math.sin(animTick * 0.2) * 0.12;
      ctx.beginPath(); ctx.arc(0, 0, b.r * 1.7, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = entryScale; ctx.globalCompositeOperation = 'source-over';
    }
    // Aura ancaman raksasa yang berdenyut di belakang boss.
    ctx.globalCompositeOperation = 'lighter';
    const bAura = ctx.createRadialGradient(0, 0, b.r * 0.6, 0, 0, b.r * 1.6);
    bAura.addColorStop(0, def.color + '55'); bAura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bAura; ctx.globalAlpha = 0.5 + bossBreathe * 0.3;
    ctx.beginPath(); ctx.arc(0, 0, b.r * (1.3 + bossBreathe * 0.15), 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = def.color;
    if (def.shape === 'void') {
      const g=ctx.createRadialGradient(0,0,5,0,0,b.r); g.addColorStop(0,'#FFFFFF'); g.addColorStop(.2,def.color); g.addColorStop(1,'rgba(0,0,0,.1)'); ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(0,0,b.r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=def.color; ctx.lineWidth=4; ctx.beginPath();ctx.arc(0,0,b.r*.65,b.rot,b.rot+Math.PI*1.5);ctx.stroke();
    } else if (def.shape === 'crystal') {
      ctx.beginPath(); for(let i=0;i<8;i++){const a=i*Math.PI/4;const rr=i%2?b.r*.55:b.r;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=3;ctx.stroke();
    } else if (def.shape === 'sun') {
      ctx.beginPath();ctx.arc(0,0,b.r*.72,0,Math.PI*2);ctx.fill();
      for(let i=0;i<12;i++){const a=i*Math.PI/6+b.rot;ctx.beginPath();ctx.moveTo(Math.cos(a)*b.r*.65,Math.sin(a)*b.r*.65);ctx.lineTo(Math.cos(a)*b.r,Math.sin(a)*b.r);ctx.lineWidth=5;ctx.strokeStyle=def.color;ctx.stroke();}
    } else if (def.shape === 'poison') {
      ctx.beginPath();ctx.arc(0,0,b.r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#183B2A';ctx.beginPath();ctx.arc(-b.r*.28,0,b.r*.14,0,Math.PI*2);ctx.arc(b.r*.28,0,b.r*.14,0,Math.PI*2);ctx.fill();
    } else if (def.shape === 'hex') {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) { const ang = (i / 6) * Math.PI * 2 + b.rot; ctx.lineTo(Math.cos(ang) * b.r, Math.sin(ang) * b.r); }
      ctx.closePath(); ctx.fill();
    } else if (def.shape === 'round') {
      ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, b.r * 0.65, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.beginPath(); const spikes = 14;
      for (let i = 0; i < spikes; i++) { const ang = (i / spikes) * Math.PI * 2 + b.rot; const rad = i % 2 === 0 ? b.r : b.r * 0.78; ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad); }
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = '#1A1030';
    ctx.beginPath(); ctx.arc(-b.r * 0.28, 0, b.r * 0.15, 0, Math.PI * 2); ctx.arc(b.r * 0.28, 0, b.r * 0.15, 0, Math.PI * 2); ctx.fill();
    // Mata boss menyala dan berkedip mengancam.
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = 0.3 + bossBreathe * 0.55;
    ctx.beginPath(); ctx.arc(-b.r * 0.28, 0, b.r * 0.06, 0, Math.PI * 2); ctx.arc(b.r * 0.28, 0, b.r * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }

  function drawRocketBody(b, bodyColor, finColor, glowColor, scale) {
    const s = scale;
    const ang = Math.atan2(b.vx || 0, -(b.vy || 1));
    ctx.translate(b.x, b.y); ctx.rotate(ang);
    // Api knalpot di belakang roket, berkedip halus.
    const flameLen = 11 * s + Math.sin(animTick * 0.6 + (b.x||0)) * 2.2;
    const fg = ctx.createLinearGradient(0, 6 * s, 0, 6 * s + flameLen);
    fg.addColorStop(0, '#FFFFFF'); fg.addColorStop(0.4, glowColor); fg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.moveTo(-3 * s, 6 * s); ctx.lineTo(0, 6 * s + flameLen); ctx.lineTo(3 * s, 6 * s); ctx.closePath(); ctx.fill();
    // Sirip belakang.
    ctx.fillStyle = finColor;
    ctx.beginPath(); ctx.moveTo(-2.4 * s, 2.5 * s); ctx.lineTo(-7.5 * s, 8.5 * s); ctx.lineTo(-1.8 * s, 6 * s); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(2.4 * s, 2.5 * s); ctx.lineTo(7.5 * s, 8.5 * s); ctx.lineTo(1.8 * s, 6 * s); ctx.closePath(); ctx.fill();
    // Badan roket runcing.
    ctx.fillStyle = bodyColor;
    ctx.beginPath(); ctx.moveTo(0, -11 * s); ctx.lineTo(3.2 * s, -1 * s); ctx.lineTo(3.2 * s, 5.5 * s); ctx.lineTo(-3.2 * s, 5.5 * s); ctx.lineTo(-3.2 * s, -1 * s); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.32)'; ctx.lineWidth = 1; ctx.stroke();
    // Garis tengah + highlight hidung.
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -9 * s); ctx.lineTo(0, 5 * s); ctx.stroke();
    ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(-0.8 * s, -5 * s, 1.3 * s, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  }
  function drawBullet(b) {
    const id = b.rocket ? (b.kind || 'missile') : (b.weaponId || b.kind || 'blaster');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const pulse = 1 + Math.sin(animTick * 0.35 + (b.x||0)*0.03) * 0.12;
    const glow = (color, r) => { ctx.fillStyle=color; ctx.globalAlpha=.18; ctx.beginPath(); ctx.arc(b.x,b.y,r*2.1,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; };
    if (b.trail) { b.trail.slice(0,5).forEach((t,i)=>{ ctx.globalAlpha=(1-i/5)*.22; ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(t.x,t.y,b.r*(1-i/6),0,Math.PI*2); ctx.fill(); }); ctx.globalAlpha=1; }
    if(animTick%3===0 && fxParticles.length<FX_CAP-2){ addFx(b.x,b.y,{color:b.color||'#9DE7FF',speed:.15+Math.random()*.35,angle:Math.random()*Math.PI*2,life:7+Math.random()*7,r:.35+Math.random()*.8,alpha:.55,glow:true}); }
    switch(id) {
      case 'blaster': glow('#FFD166',b.r); ctx.fillStyle='#FFF4C4'; ctx.fillRect(b.x-2,b.y-8,b.r,b.r*3); break;
      case 'twin': glow('#4ECDC4',b.r); ctx.fillStyle='#7AE5DC'; ctx.beginPath(); ctx.roundRect(b.x-3,b.y-6,6,12,3); ctx.fill(); break;
      case 'spread': glow('#FF9AC1',b.r); ctx.fillStyle='#FF6B9D'; ctx.beginPath(); ctx.arc(b.x,b.y,b.r*pulse,0,Math.PI*2); ctx.fill(); break;
      case 'laser': glow('#FFFFFF',b.r); ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(b.x,b.y+10); ctx.lineTo(b.x,b.y-18); ctx.stroke(); ctx.strokeStyle='#FF8FB4'; ctx.lineWidth=2; ctx.stroke(); break;
      case 'homing': glow('#C77DFF',b.r); ctx.fillStyle='#DAB5FF'; ctx.beginPath(); ctx.moveTo(b.x,b.y-8); ctx.lineTo(b.x+5,b.y+5); ctx.lineTo(b.x,b.y+2); ctx.lineTo(b.x-5,b.y+5); ctx.closePath(); ctx.fill(); break;
      case 'plasma': glow('#7AE5DC',b.r); const pg=ctx.createRadialGradient(b.x,b.y,1,b.x,b.y,b.r*1.4); pg.addColorStop(0,'#FFFFFF'); pg.addColorStop(.35,'#7AE5DC'); pg.addColorStop(1,'rgba(78,205,196,.1)'); ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(b.x,b.y,b.r*pulse,0,Math.PI*2); ctx.fill(); break;
      case 'railgun': glow('#BDE7FF',b.r); ctx.fillStyle='#E8F7FF'; ctx.fillRect(b.x-3,b.y-28,6,38); ctx.fillStyle='#8FD3FF'; ctx.fillRect(b.x-1,b.y-35,2,50); break;
      case 'burst': glow('#FF8A8A',b.r); ctx.fillStyle='#FFB0B0'; ctx.beginPath(); ctx.arc(b.x,b.y,b.r*pulse,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#FF6B6B'; ctx.lineWidth=2; ctx.stroke(); break;
      case 'ion': glow('#8FFBFF',b.r); ctx.strokeStyle='#8FFBFF'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(b.x,b.y+12); ctx.lineTo(b.x,b.y-14); ctx.stroke(); ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(b.x,b.y-14,3,0,Math.PI*2); ctx.fill(); break;
      case 'shatter': glow('#9DE7FF',b.r); ctx.fillStyle='#D8FAFF'; ctx.beginPath(); for(let i=0;i<6;i++){const a=i*Math.PI/3; const rr=i%2?b.r*.55:b.r; ctx.lineTo(b.x+Math.cos(a)*rr,b.y+Math.sin(a)*rr);} ctx.closePath(); ctx.fill(); break;
      case 'thunder': glow('#FFF3A6',b.r); ctx.strokeStyle='#FFF3A6'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(b.x-2,b.y+10); ctx.lineTo(b.x+3,b.y); ctx.lineTo(b.x-2,b.y-2); ctx.lineTo(b.x+4,b.y-13); ctx.stroke(); break;
      case 'vortex': glow('#C77DFF',b.r); ctx.strokeStyle='#E1B8FF'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(b.x,b.y,b.r*1.2,0,Math.PI*1.5); ctx.stroke(); ctx.beginPath(); ctx.arc(b.x,b.y,b.r*.65,Math.PI,Math.PI*2.5); ctx.stroke(); break;
      case 'nova': glow('#FFB6E0',b.r); ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(b.x,b.y,b.r*.75,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#FF8FD0'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(b.x,b.y,b.r*1.7,0,Math.PI*2); ctx.stroke(); break;
      case 'gravity': glow('#B98CE0',b.r); ctx.strokeStyle='#E5D0FF'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(b.x,b.y+14); ctx.lineTo(b.x,b.y-18); ctx.stroke(); ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(b.x,b.y-18,4,0,Math.PI*2); ctx.fill(); break;
      // Serangan dasar tiap pesawat dibuat benar-benar berbeda sesuai deskripsinya.
      case 'ship-interceptor': {
        // Twin Vector Shot: tiga anak panah energi yang bergerak menyebar.
        glow('#4ECDC4', b.r*1.3);
        const ang = Math.atan2(b.vx || 0, -(b.vy || 1));
        ctx.translate(b.x,b.y); ctx.rotate(ang);
        ctx.fillStyle='#DFFFFB'; ctx.strokeStyle='#4ECDC4'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(5,3); ctx.lineTo(0,1); ctx.lineTo(-5,3); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#4ECDC4'; ctx.fillRect(-1.5,1,3,8);
        break;
      }
      case 'ship-cruiser': {
        // Cannon Core: inti meriam padat dengan selubung heksagonal dan recoil ring.
        glow('#FF6B6B', b.r*1.5);
        ctx.translate(b.x,b.y);
        ctx.strokeStyle='#FF6B6B'; ctx.lineWidth=2;
        ctx.beginPath(); for(let i=0;i<6;i++){const a=i*Math.PI/3-Math.PI/2; const rr=b.r*1.25; const x=Math.cos(a)*rr,y=Math.sin(a)*rr; i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.closePath(); ctx.stroke();
        ctx.fillStyle='#FFF1F1'; ctx.beginPath(); ctx.arc(0,0,b.r*.72,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#FF6B6B'; ctx.beginPath(); ctx.arc(0,0,b.r*.38,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='rgba(255,107,107,.65)'; ctx.beginPath(); ctx.arc(0,7,b.r*1.45,0,Math.PI*2); ctx.stroke();
        break;
      }
      case 'ship-fortress': {
        // Plasma Heavy: bola plasma besar, berlapis dan punya ekor panas.
        glow('#FFD166', b.r*1.7);
        ctx.translate(b.x,b.y);
        const pg=ctx.createRadialGradient(0,0,1,0,0,b.r*1.5);
        pg.addColorStop(0,'#FFFFFF'); pg.addColorStop(.25,'#FFF1A8'); pg.addColorStop(.65,'#FFD166'); pg.addColorStop(1,'rgba(255,209,102,0)');
        ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(0,0,b.r*1.45*pulse,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#FFF6C7'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,b.r*.82,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(-b.r*.18,-b.r*.18,b.r*.3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#FFD166'; ctx.fillRect(-2,b.r*.7,4,9);
        break;
      }
      case 'ship-striker': {
        // Focus Rail: satu rail beam sangat tipis dan fokus, bukan proyektil bulat.
        glow('#B98CE0', 4);
        ctx.strokeStyle='rgba(185,140,224,.28)'; ctx.lineWidth=10; ctx.beginPath(); ctx.moveTo(b.x,b.y+18); ctx.lineTo(b.x,b.y-34); ctx.stroke();
        ctx.strokeStyle='#F5E8FF'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(b.x,b.y+18); ctx.lineTo(b.x,b.y-34); ctx.stroke();
        ctx.strokeStyle='#B98CE0'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(b.x-3,b.y+18); ctx.lineTo(b.x-3,b.y-34); ctx.moveTo(b.x+3,b.y+18); ctx.lineTo(b.x+3,b.y-34); ctx.stroke();
        ctx.fillStyle='#FFFFFF'; ctx.fillRect(b.x-2,b.y-38,4,7);
        break;
      }
      case 'ship-phantom': {
        // Phantom Bolt: bolt hantu berupa cincin fase dengan inti transparan.
        glow('#66D9EF', b.r*1.5);
        ctx.translate(b.x,b.y); ctx.rotate(animTick*.05);
        ctx.strokeStyle='rgba(102,217,239,.45)'; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(0,0,b.r*1.45,0,Math.PI*2); ctx.stroke();
        ctx.strokeStyle='#DDFBFF'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,b.r*.8,0,Math.PI*1.55); ctx.stroke();
        ctx.fillStyle='rgba(232,251,255,.9)'; ctx.beginPath(); ctx.arc(0,0,b.r*.28,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=.35; ctx.strokeStyle='#66D9EF'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,b.r*2.1,Math.PI*.15,Math.PI*1.25); ctx.stroke();
        break;
      }
      case 'ship-titan': {
        // Heavy Core: inti energi raksasa dengan cincin tekanan dan shockwave.
        glow('#FF9F6B', b.r*1.9);
        ctx.translate(b.x,b.y);
        ctx.strokeStyle='rgba(255,159,107,.55)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,0,b.r*1.65*pulse,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle='#FFF4EC'; ctx.beginPath(); ctx.arc(0,0,b.r*.78,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#FF9F6B'; ctx.beginPath(); ctx.arc(0,0,b.r*.48,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(-b.r*.16,-b.r*.2,b.r*.18,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#FFB980'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,b.r*.55,b.r*1.2,0,Math.PI); ctx.stroke();
        break;
      }
      case 'missile': {
        // Roket Standar: oranye-emas dengan sirip & api knalpot, persis desain roket sungguhan.
        glow('#FFB347', b.r * 1.4);
        drawRocketBody(b, '#FFB347', '#B5722A', '#FF8A3D', 1);
        break;
      }
      case 'heavyMissile': {
        // Roket Berat: lebih besar & tebal, badan merah dengan pita peringatan.
        glow('#FF5C5C', b.r * 1.7);
        drawRocketBody(b, '#FF6B5C', '#8A2E2E', '#FF3D3D', 1.4);
        ctx.strokeStyle = '#FFE082'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-4.2, 1.5); ctx.lineTo(4.2, 1.5); ctx.stroke();
        break;
      }
      case 'clusterMissile': {
        // Roket Cluster: lebih kecil & ramping karena meluncur bertiga sekaligus, warna ungu.
        glow('#C77DFF', b.r * 1.3);
        drawRocketBody(b, '#D9A6FF', '#6B3D96', '#C77DFF', 0.78);
        break;
      }
      case 'homingMissile': {
        // Roket Pelacak: ada lampu seeker berkedip di hidung yang menandakan ia mengunci target.
        glow('#66D9EF', b.r * 1.5);
        drawRocketBody(b, '#9DE7FF', '#2E6E8A', '#66D9EF', 1.08);
        ctx.globalAlpha = 0.55 + Math.sin(animTick * 0.5) * 0.45;
        ctx.fillStyle = '#FF4DCE'; ctx.beginPath(); ctx.arc(0, -9, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        break;
      }
      case 'plasmaMissile': {
        // Roket Plasma: paling premium, dibalut cangkang energi putih-cyan yang berdenyut.
        glow('#7AE5DC', b.r * 2);
        ctx.save(); ctx.globalAlpha = 0.5 + Math.sin(animTick * 0.3) * 0.15;
        ctx.strokeStyle = '#7AE5DC'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 1.6 * pulse, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
        drawRocketBody(b, '#F2FFFE', '#3FA79B', '#4ECDC4', 1.25);
        break;
      }
      default: ctx.fillStyle=COLORS.amber; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  function drawPickup(pu) {
    ctx.save(); ctx.translate(pu.x, pu.y); ctx.font = '18px Nunito'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const icon = pu.type === 'shield' ? '🛡️' : pu.type === 'rapid' ? '⚡' : pu.type === 'energyFull' ? '🔋' : '❤️';
    ctx.fillText(icon, 0, 0); ctx.restore();
  }

  function addFx(x,y,opts={}) {
    if (fxParticles.length >= FX_CAP) return;
    const a = opts.angle ?? Math.random()*Math.PI*2;
    const sp = opts.speed ?? (0.5+Math.random()*2.2);
    fxParticles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:opts.life??(18+Math.random()*18),maxLife:opts.life??30,
      r:opts.r??(0.8+Math.random()*2),color:opts.color||'#FFFFFF',glow:opts.glow!==false,drag:opts.drag??0.96,gravity:opts.gravity??0,
      shape:opts.shape||'dot',rot:Math.random()*Math.PI*2,vr:(Math.random()-.5)*.18,alpha:opts.alpha??1,trail:opts.trail||false});
  }
  function burstFx(x,y,color,count=12,opts={}) {
    const n=Math.min(count, FX_CAP-fxParticles.length);
    for(let i=0;i<n;i++) addFx(x,y,{color,speed:(opts.speedMin??1)+(Math.random()*(opts.speedMax??3)),life:opts.life??(18+Math.random()*18),r:opts.r??(1+Math.random()*2.4),shape:opts.shape||'shard',gravity:opts.gravity??0.02});
  }
  function rocketBlastColor(kind) {
    switch (kind) {
      case 'heavyMissile': return '#FF5C5C';
      case 'clusterMissile': return '#C77DFF';
      case 'homingMissile': return '#66D9EF';
      case 'plasmaMissile': return '#7AE5DC';
      default: return '#FFB347';
    }
  }
  function spawnExplosion(x,y,color){
    const ec=color;
    const count=18;
    // Ring + bright core + varied debris.
    burstFx(x,y,ec,count,{speedMin:1.3,speedMax:4.8,life:22+Math.random()*14,shape:'shard'});
    for(let i=0;i<5;i++) addFx(x,y,{color:'#FFFFFF',speed:.5+Math.random()*2,life:10+Math.random()*8,r:1+Math.random()*2.5,shape:'dot',gravity:0});
    sparks.push({x,y,vx:0,vy:0,life:18,color:ec,r:5,ring:true});
  }
  function spawnRocketBlast(x,y,color){
    // Ledakan roket: lebih besar & dramatis dibanding hit peluru biasa.
    burstFx(x,y,color,26,{speedMin:1.8,speedMax:6.4,life:26+Math.random()*16,shape:'shard'});
    for(let i=0;i<12;i++) addFx(x,y,{color:'#FFFFFF',speed:.8+Math.random()*3.4,life:14+Math.random()*10,r:1.2+Math.random()*3,shape:'dot',gravity:0});
    sparks.push({x,y,vx:0,vy:0,life:26,color:'#FFFFFF',r:10,ring:true});
    sparks.push({x,y,vx:0,vy:0,life:20,color,r:16,ring:true});
    sfx.explode(); triggerShake(5);
  }
  function spawnImpact(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const ang = Math.random() * Math.PI * 2, sp = 1.0 + Math.random() * 2.8;
      addFx(x,y,{angle:ang,speed:sp,life:10+Math.random()*9,color:i%3===0?'#FFFFFF':color,r:.8+Math.random()*1.7,shape:'shard',gravity:.01});
    }
    sparks.push({x,y,vx:0,vy:0,life:8,color:'#FFFFFF',r:3,ring:true});
  }
  function drawFxParticles(){
    for(let i=fxParticles.length-1;i>=0;i--){
      const f=fxParticles[i]; f.x+=f.vx; f.y+=f.vy; f.vx*=f.drag; f.vy=f.vy*f.drag+f.gravity; f.rot+=f.vr; f.life--;
      const a=Math.max(0,f.life/f.maxLife)*f.alpha;
      ctx.save(); ctx.globalAlpha=a; ctx.translate(f.x,f.y); ctx.rotate(f.rot);
      if(f.glow){ctx.globalCompositeOperation='lighter';ctx.fillStyle=f.color;ctx.globalAlpha=a*.18;ctx.beginPath();ctx.arc(0,0,f.r*2.8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=a;}
      ctx.fillStyle=f.color; ctx.strokeStyle=f.color;
      if(f.shape==='shard'){ctx.beginPath();ctx.moveTo(f.r*1.8,0);ctx.lineTo(-f.r*.8,-f.r*.55);ctx.lineTo(-f.r*1.2,f.r*.4);ctx.closePath();ctx.fill();}
      else if(f.shape==='diamond'){ctx.beginPath();ctx.moveTo(0,-f.r*1.8);ctx.lineTo(f.r,0);ctx.lineTo(0,f.r*1.8);ctx.lineTo(-f.r,0);ctx.closePath();ctx.fill();}
      else {ctx.beginPath();ctx.arc(0,0,f.r,0,Math.PI*2);ctx.fill();}
      ctx.restore();
      if(f.life<=0||f.x<-50||f.x>W+50||f.y<-70||f.y>H+70)fxParticles.splice(i,1);
    }
  }
  function triggerShake(mag) { shakeTimer = 14; shakeMag = mag; }