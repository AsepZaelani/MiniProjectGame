  // ---- Icon previews for shop/customize cards (no external images needed) ----
  function shipIconSVG(ship) {
    const pts = shipHull(ship.shape);
    const poly = pts.map(([x, y]) => `${x + 24},${y * 0.85 + 24}`).join(' ');
    return `<svg viewBox="0 0 48 48"><defs><radialGradient id="g-${ship.id}" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="45%" stop-color="${ship.color}"/><stop offset="100%" stop-color="${ship.color}" stop-opacity="0.3"/>
    </radialGradient></defs>
    <polygon points="${poly}" fill="url(#g-${ship.id})" stroke="rgba(255,255,255,0.4)" stroke-width="0.7"/>
    <ellipse cx="24" cy="21" rx="3" ry="4.4" fill="#1A1030"/></svg>`;
  }

  function weaponIconSVG(w) {
    const c = w.visualColor || '#FFD166';
    const kind = w.kind || (w.pattern && w.id === 'laser' ? 'laser' : null) || w.id;
    if (kind === 'laser' || w.id === 'laser' || w.id === 'ion' || w.id === 'thunder') {
      return `<svg viewBox="0 0 48 48"><defs><linearGradient id="l-${w.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${c}" stop-opacity="0"/><stop offset="100%" stop-color="${c}"/></linearGradient></defs>
        <rect x="21" y="6" width="6" height="36" rx="3" fill="url(#l-${w.id})"/></svg>`;
    }
    if (kind === 'missile' || w.id === 'homing') {
      return `<svg viewBox="0 0 48 48"><polygon points="24,6 30,30 24,26 18,30" fill="${c}"/><circle cx="24" cy="34" r="4" fill="#FFD166" opacity="0.85"/></svg>`;
    }
    if (kind === 'plasma' || w.id === 'plasma' || w.id === 'shatter') {
      return `<svg viewBox="0 0 48 48"><defs><radialGradient id="p-${w.id}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFFFFF"/><stop offset="45%" stop-color="${c}"/><stop offset="100%" stop-color="${c}" stop-opacity="0"/>
      </radialGradient></defs><circle cx="24" cy="24" r="15" fill="url(#p-${w.id})"/></svg>`;
    }
    if (kind === 'rail' || w.id === 'railgun') {
      return `<svg viewBox="0 0 48 48"><rect x="20" y="4" width="8" height="40" fill="${c}" opacity="0.9"/><rect x="22.5" y="4" width="3" height="40" fill="#FFFFFF"/></svg>`;
    }
    if (w.id === 'twin') {
      return `<svg viewBox="0 0 48 48"><circle cx="18" cy="24" r="5" fill="${c}"/><circle cx="30" cy="24" r="5" fill="${c}"/></svg>`;
    }
    if (w.id === 'spread' || w.id === 'burst' || w.id === 'vortex') {
      return `<svg viewBox="0 0 48 48"><circle cx="24" cy="30" r="5" fill="${c}"/><circle cx="14" cy="16" r="4" fill="${c}" opacity="0.8"/><circle cx="34" cy="16" r="4" fill="${c}" opacity="0.8"/></svg>`;
    }
    return `<svg viewBox="0 0 48 48"><defs><radialGradient id="b-${w.id}" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="55%" stop-color="${c}"/><stop offset="100%" stop-color="${c}" stop-opacity="0.35"/>
    </radialGradient></defs><rect x="20.5" y="6" width="7" height="16" rx="3.5" fill="${c}" opacity="0.55"/><ellipse cx="24" cy="28" rx="8" ry="11" fill="url(#b-${w.id})"/></svg>`;
  }

  // Ikon roket bergaya vektor (bukan emoji) — bentuk & warna berbeda untuk tiap jenis roket,
  // dipakai bersama di shop dan di HUD saat bermain supaya desainnya selalu sama persis.
  const ROCKET_COLORS = { missile:'#9DE7FF', heavyMissile:'#FF9F6B', clusterMissile:'#FFD166', homingMissile:'#66D9EF', plasmaMissile:'#C77DFF' };
  function rocketIconSVG(r) {
    const kind = (r && r.kind) || 'missile';
    const c = ROCKET_COLORS[kind] || '#9DE7FF';
    const flame = `<polygon points="21,36 27,36 24,45" fill="#FFB347" opacity="0.9"/><polygon points="22.3,36 25.7,36 24,42" fill="#FFF3A6"/>`;
    if (kind === 'heavyMissile') {
      return `<svg viewBox="0 0 48 48">
        <polygon points="24,4 30,16 30,32 18,32 18,16" fill="${c}"/>
        <rect x="18" y="18" width="12" height="10" fill="#11102A" opacity=".35"/>
        <polygon points="17,26 10,34 17,32" fill="${c}" opacity=".85"/>
        <polygon points="31,26 38,34 31,32" fill="${c}" opacity=".85"/>
        ${flame}
      </svg>`;
    }
    if (kind === 'clusterMissile') {
      return `<svg viewBox="0 0 48 48">
        <polygon points="16,10 20,22 12,22" fill="${c}"/><rect x="13" y="22" width="6" height="14" rx="2" fill="${c}" opacity=".85"/>
        <polygon points="24,4 28,16 20,16" fill="${c}"/><rect x="21" y="16" width="6" height="18" rx="2" fill="${c}"/>
        <polygon points="32,10 36,22 28,22" fill="${c}" opacity=".85"/><rect x="29" y="22" width="6" height="14" rx="2" fill="${c}" opacity=".7"/>
        <polygon points="13,36 16,42 19,36" fill="#FFB347" opacity=".9"/><polygon points="21,34 24,42 27,34" fill="#FFB347" opacity=".9"/><polygon points="29,36 32,42 35,36" fill="#FFB347" opacity=".9"/>
      </svg>`;
    }
    if (kind === 'homingMissile') {
      return `<svg viewBox="0 0 48 48">
        <polygon points="24,5 29,20 19,20" fill="${c}"/><rect x="19" y="20" width="10" height="14" rx="2" fill="${c}" opacity=".85"/>
        <circle cx="24" cy="13" r="3" fill="#FFFFFF"/><circle cx="24" cy="13" r="1.3" fill="${c}"/>
        <polygon points="19,26 12,32 19,32" fill="${c}" opacity=".8"/><polygon points="29,26 36,32 29,32" fill="${c}" opacity=".8"/>
        <circle cx="24" cy="24" r="10" fill="none" stroke="${c}" stroke-width="1" opacity=".35"/>
        ${flame}
      </svg>`;
    }
    if (kind === 'plasmaMissile') {
      return `<svg viewBox="0 0 48 48"><defs><radialGradient id="rp-${r.id}" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF"/><stop offset="45%" stop-color="${c}"/><stop offset="100%" stop-color="${c}" stop-opacity="0.15"/>
      </radialGradient></defs>
        <rect x="20" y="20" width="8" height="16" rx="3" fill="${c}" opacity=".8"/>
        <circle cx="24" cy="16" r="11" fill="url(#rp-${r.id})"/>
        <circle cx="24" cy="16" r="4" fill="#FFFFFF"/>
        <polygon points="19,32 13,40 19,37" fill="${c}" opacity=".8"/><polygon points="29,32 35,40 29,37" fill="${c}" opacity=".8"/>
      </svg>`;
    }
    // standard missile
    return `<svg viewBox="0 0 48 48">
      <polygon points="24,4 29,18 19,18" fill="${c}"/><rect x="19" y="18" width="10" height="16" rx="2" fill="${c}" opacity=".85"/>
      <rect x="22" y="18" width="4" height="16" fill="#11102A" opacity=".25"/>
      <polygon points="19,26 12,33 19,32" fill="${c}" opacity=".85"/><polygon points="29,26 36,33 29,32" fill="${c}" opacity=".85"/>
      ${flame}
    </svg>`;
  }

  // Visual weapon modules: setiap senjata punya bentuk perangkat yang berbeda.
  // Modul dipasang di kiri/kanan kapal, sementara serangan dasar kapal tetap aktif.
  function drawWeaponModule(id, side) {
    const w = getWeapon(id) || WEAPONS[0];
    const x = side * 30;
    const c = w.visualColor || '#FFD166';
    const pulse = 1 + Math.sin(animTick * 0.18 + side) * 0.08;
    ctx.save();
    ctx.translate(x, 0);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = .16;
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(0, -2, 13 * pulse, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = c;
    ctx.fillStyle = '#11102A';

    switch (w.id) {
      case 'blaster':
        ctx.fillRect(-4,-7,8,15); ctx.strokeRect(-4,-7,8,15);
        ctx.fillStyle=c; ctx.fillRect(-2,-12,4,7); break;
      case 'twin':
        ctx.fillRect(-7,-5,5,13); ctx.fillRect(2,-5,5,13); ctx.strokeRect(-7,-5,5,13); ctx.strokeRect(2,-5,5,13);
        ctx.fillStyle=c; ctx.fillRect(-6,-11,3,7); ctx.fillRect(3,-11,3,7); break;
      case 'spread':
        ctx.beginPath(); ctx.moveTo(-9,8); ctx.lineTo(-4,-8); ctx.lineTo(0,-12); ctx.lineTo(4,-8); ctx.lineTo(9,8); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle=c; ctx.beginPath(); ctx.arc(0,-10,3,0,Math.PI*2); ctx.fill(); break;
      case 'laser':
        ctx.beginPath(); ctx.moveTo(-6,8); ctx.lineTo(0,-13); ctx.lineTo(6,8); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle=c; ctx.fillRect(-2,-16,4,10); break;
      case 'homing':
        ctx.beginPath(); ctx.moveTo(0,-15); ctx.lineTo(7,1); ctx.lineTo(0,9); ctx.lineTo(-7,1); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle=c; ctx.beginPath(); ctx.arc(0,-4,3,0,Math.PI*2); ctx.fill(); break;
      case 'plasma':
        ctx.beginPath(); ctx.ellipse(0,0,8,11,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(0,-2,3.2,0,Math.PI*2); ctx.fill(); break;
      case 'railgun':
        ctx.fillRect(-3,-15,6,23); ctx.strokeRect(-3,-15,6,23);
        ctx.fillStyle=c; ctx.fillRect(-1,-19,2,8); break;
      case 'burst':
        ctx.beginPath(); ctx.moveTo(-8,6); ctx.lineTo(-5,-7); ctx.lineTo(0,-11); ctx.lineTo(5,-7); ctx.lineTo(8,6); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle=c; for(let i=-1;i<=1;i++) ctx.fillRect(i*4-1,-15,2,6); break;
      case 'ion':
        ctx.beginPath(); ctx.arc(0,-1,8,0,Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-3,8); ctx.lineTo(0,-7); ctx.lineTo(3,8); ctx.stroke(); break;
      case 'shatter':
        ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(8,-3); ctx.lineTo(3,10); ctx.lineTo(-5,6); ctx.lineTo(-8,-4); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle=c; ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(4,-1); ctx.lineTo(-2,5); ctx.lineTo(-4,-3); ctx.closePath(); ctx.fill(); break;
      case 'thunder':
        ctx.beginPath(); ctx.moveTo(-7,8); ctx.lineTo(-2,-3); ctx.lineTo(-6,-3); ctx.lineTo(3,-15); ctx.lineTo(1,-5); ctx.lineTo(7,-5); ctx.lineTo(-2,10); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
      case 'vortex':
        ctx.beginPath(); ctx.arc(0,0,9,0,Math.PI*1.6); ctx.stroke(); ctx.beginPath(); ctx.arc(0,0,5,Math.PI,Math.PI*2.5); ctx.stroke();
        ctx.fillStyle=c; ctx.beginPath(); ctx.arc(0,0,3,0,Math.PI*2); ctx.fill(); break;
      case 'nova':
        ctx.beginPath(); for(let i=0;i<10;i++){const a=i*Math.PI/5; const r=i%2?6:13; ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);} ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(0,0,3,0,Math.PI*2); ctx.fill(); break;
      case 'gravity':
        ctx.beginPath(); ctx.moveTo(0,-17); ctx.lineTo(7,8); ctx.lineTo(0,5); ctx.lineTo(-7,8); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(0,-2,5,0,Math.PI*2); ctx.stroke(); break;
    }
    ctx.restore();
  }

