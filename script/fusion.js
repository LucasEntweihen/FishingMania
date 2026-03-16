/* ==========================================================================
   BANCO DE DADOS DE QUIMERAS E MOTOR DE FUSÃO GENÉTICA (NÍVEL AAA)
   ========================================================================== */

// ==========================================================================
// 1. ENGINE DE RENDERIZAÇÃO VETORIAL RPG (0 KBs - Alta Fidelidade)
// ==========================================================================
const createIcon = (bgDefs, bgTexture, content) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="width: 100%; height: 100%; border-radius: 12px; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.9));">
    <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="magic-bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feComponentTransfer><feFuncA type="linear" slope="1.5"/></feComponentTransfer>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="drop" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000" flood-opacity="0.8"/>
        </filter>
        
        <linearGradient id="metalBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#475569"/>
            <stop offset="50%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="metalHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="50%" stop-color="#475569"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
        <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="50%" stop-color="#b45309"/>
            <stop offset="100%" stop-color="#fcd34d"/>
        </linearGradient>
        
        <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
            <stop offset="60%" stop-color="rgba(0,0,0,0)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.95)"/>
        </radialGradient>

        ${bgDefs}
    </defs>
    
    <rect width="100" height="100" fill="url(#bg)" />
    
    <g opacity="0.3">${bgTexture}</g>
    
    <rect width="100" height="100" fill="url(#vignette)" />
    
    <g transform="translate(5, 5) scale(0.9)" filter="url(#drop)">
        ${content}
    </g>
    
    <rect x="1" y="1" width="98" height="98" rx="14" fill="none" stroke="#000" stroke-width="2" />
    <rect x="2" y="2" width="96" height="96" rx="12" fill="none" stroke="url(#metalBase)" stroke-width="6" />
    <rect x="4" y="4" width="92" height="92" rx="10" fill="none" stroke="url(#metalHighlight)" stroke-width="2" opacity="0.8" />
    <rect x="6" y="6" width="88" height="88" rx="8" fill="none" stroke="#020617" stroke-width="3" />
    
    <g id="rivets">
        <circle cx="10" cy="10" r="4.5" fill="#000"/>
        <circle cx="10" cy="10" r="3.5" fill="url(#metalHighlight)"/>
        <circle cx="9" cy="9" r="1.5" fill="#fff" opacity="0.6"/>
        <circle cx="90" cy="10" r="4.5" fill="#000"/>
        <circle cx="90" cy="10" r="3.5" fill="url(#metalHighlight)"/>
        <circle cx="89" cy="9" r="1.5" fill="#fff" opacity="0.6"/>
        <circle cx="10" cy="90" r="4.5" fill="#000"/>
        <circle cx="10" cy="90" r="3.5" fill="url(#metalHighlight)"/>
        <circle cx="9" cy="89" r="1.5" fill="#fff" opacity="0.6"/>
        <circle cx="90" cy="90" r="4.5" fill="#000"/>
        <circle cx="90" cy="90" r="3.5" fill="url(#metalHighlight)"/>
        <circle cx="89" cy="89" r="1.5" fill="#fff" opacity="0.6"/>
    </g>
</svg>`;

// ==========================================================================
// 2. O ARSENAL TÁTICO EXPANDIDO E BALANCEADO (Artes Anatômicas e Realistas)
// ==========================================================================
window.SKILLS = {
    // === ATAQUES CLÁSSICOS ===
    'mordida_padrao': { 
        id: 'mordida_padrao', name: 'Mordida Básica', type: 'ATK', cost: 1, rng: 1, pwr: 1.0, desc: 'Dano físico simples contra um alvo adjacente.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#991b1b"/><stop offset="100%" stop-color="#450a0a"/></radialGradient>
             <linearGradient id="fang" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="80%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#ef4444"/></linearGradient>`,
            `<path d="M0 20 L100 80 M0 80 L100 20 M50 0 L50 100" stroke="#7f1d1d" stroke-width="8" />`,
            `<path d="M10 50 C 10 10, 90 10, 90 50 C 90 90, 10 90, 10 50 Z" fill="#000" stroke="#7f1d1d" stroke-width="4"/>
             <path d="M15 45 C 30 20, 70 20, 85 45 C 70 35, 30 35, 15 45 Z" fill="#ef4444"/>
             <path d="M20 40 L25 65 L30 40 Z M35 38 L40 70 L45 38 Z M50 38 L55 75 L60 38 Z M65 38 L70 70 L75 38 Z M80 40 L85 60 L90 40 Z" fill="url(#fang)"/>
             <path d="M15 55 C 30 80, 70 80, 85 55 C 70 65, 30 65, 15 55 Z" fill="#dc2626"/>
             <path d="M25 60 L30 35 L35 60 Z M40 62 L45 30 L50 62 Z M55 62 L60 25 L65 62 Z M70 60 L75 35 L80 60 Z" fill="url(#fang)"/>
             <circle cx="50" cy="50" r="5" fill="#ef4444" filter="url(#glow)"/>
             <path d="M48 50 L52 50 L50 70 Z" fill="#ef4444" filter="url(#glow)"/>`
        )
    },
    'jato_agua': { 
        id: 'jato_agua', name: 'Jato Pressurizado', type: 'MAG', cost: 2, rng: 3, pwr: 1.2, desc: 'Dispara água à distância. Ignora 20% da DEF.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0f172a"/></radialGradient>
             <linearGradient id="beam" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0369a1"/></linearGradient>`,
            `<circle cx="50" cy="50" r="40" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="10 10"/>
             <circle cx="50" cy="50" r="25" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="15 5"/>`,
            `<path d="M20 80 Q 50 10 80 80" fill="none" stroke="#7dd3fc" stroke-width="8" filter="url(#glow)" opacity="0.5"/>
             <path d="M10 90 L30 50 L95 5 L70 30 L10 90 Z" fill="url(#beam)" filter="url(#magic-bloom)"/>
             <path d="M15 85 L40 60 L100 0 L80 40 Z" fill="#ffffff" opacity="0.8"/>
             <circle cx="85" cy="25" r="4" fill="#ffffff" filter="url(#glow)"/><circle cx="75" cy="10" r="6" fill="#e0f2fe" filter="url(#glow)"/>`
        )
    },
    'escudo_bolha': { 
        id: 'escudo_bolha', name: 'Escudo de Bolha', type: 'BUFF', cost: 2, rng: 0, pwr: 0, desc: 'Aumenta a DEF própria em 50% por 2 turnos.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#022c22"/></radialGradient>`,
            `<circle cx="20" cy="80" r="10" fill="none" stroke="#059669" stroke-width="2"/><circle cx="80" cy="30" r="15" fill="none" stroke="#059669" stroke-width="2"/>`,
            `<circle cx="50" cy="50" r="42" fill="rgba(52, 211, 153, 0.15)" stroke="#6ee7b7" stroke-width="3" filter="url(#magic-bloom)"/>
             <circle cx="50" cy="50" r="38" fill="none" stroke="#a7f3d0" stroke-width="1"/>
             <path d="M20 40 A 30 30 0 0 1 60 15" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" filter="url(#glow)"/>
             <path d="M25 40 A 25 25 0 0 1 55 18" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
             <path d="M70 80 A 25 25 0 0 1 40 85" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.6" filter="url(#glow)"/>
             <circle cx="50" cy="50" r="15" fill="#34d399" opacity="0.2" filter="url(#magic-bloom)"/>`
        )
    },
    'investida': { 
        id: 'investida', name: 'Investida Brutal', type: 'ATK', cost: 2, rng: 1, pwr: 1.5, desc: 'Choque físico. Empurra o inimigo 1 célula para trás.',
        icon: createIcon(
            `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#7c2d12"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>
             <linearGradient id="armor" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#b45309"/></linearGradient>`,
            `<rect x="0" y="20" width="80" height="3" fill="#fff" opacity="0.5"/><rect x="0" y="50" width="50" height="6" fill="#fff" opacity="0.8" filter="url(#glow)"/><rect x="0" y="80" width="90" height="2" fill="#fff" opacity="0.4"/>`,
            `<path d="M20 20 L80 50 L20 80 L35 50 Z" fill="#000" filter="url(#magic-bloom)"/>
             <path d="M30 25 L95 50 L30 75 L45 50 Z" fill="url(#armor)"/>
             <path d="M85 45 L100 50 L85 55 Z" fill="#ffffff" filter="url(#magic-bloom)"/>
             <path d="M60 20 L80 35 L50 40 Z" fill="#fde047" opacity="0.8"/>
             <path d="M60 80 L80 65 L50 60 Z" fill="#fde047" opacity="0.8"/>`
        )
    },
    'canto_sereia': { 
        id: 'canto_sereia', name: 'Canto Curativo', type: 'HEAL', cost: 3, rng: 2, pwr: 0, desc: 'Ondas sonoras mágicas. Restaura 35% do HP de um aliado.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#c026d3"/><stop offset="100%" stop-color="#2e1065"/></radialGradient>`,
            `<polygon points="50,0 55,45 100,50 55,55 50,100 45,55 0,50 45,45" fill="#fbcfe8" opacity="0.2"/>`,
            `<circle cx="50" cy="50" r="18" fill="#e879f9" filter="url(#magic-bloom)" opacity="0.9"/>
             <circle cx="50" cy="50" r="35" fill="none" stroke="#f0abfc" stroke-width="4" opacity="0.6"/>
             <circle cx="50" cy="50" r="50" fill="none" stroke="#d946ef" stroke-width="2" opacity="0.3"/>
             <path d="M45 70 V20 L75 25 V65 M45 40 L75 45" fill="none" stroke="#fef08a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
             <ellipse cx="35" cy="70" rx="12" ry="8" fill="#fef08a" transform="rotate(-15 35 70)" filter="url(#magic-bloom)"/>
             <ellipse cx="65" cy="75" rx="12" ry="8" fill="#fef08a" transform="rotate(-15 65 75)" filter="url(#magic-bloom)"/>
             <circle cx="20" cy="30" r="3" fill="#ffffff" filter="url(#glow)"/><circle cx="80" cy="20" r="4" fill="#ffffff" filter="url(#glow)"/>`
        )
    },
    'explosao_kamikaze': { 
        id: 'explosao_kamikaze', name: 'Detonação Abissal', type: 'MAG', cost: 3, rng: 2, pwr: 3.0, desc: 'Dano em área 3x3. O usuário perde 50% do próprio HP.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="65%"><stop offset="0%" stop-color="#facc15"/><stop offset="50%" stop-color="#b91c1c"/><stop offset="100%" stop-color="#000000"/></radialGradient>`,
            `<path d="M50 0 Q 70 30 100 50 Q 70 70 50 100 Q 30 70 0 50 Q 30 30 50 0 Z" fill="#ea580c" opacity="0.5"/>`,
            `<path d="M50 5 L62 38 L95 30 L72 55 L85 90 L50 72 L15 90 L28 55 L5 30 L38 38 Z" fill="#f97316" stroke="#991b1b" stroke-width="2"/>
             <path d="M50 20 L57 42 L80 40 L65 55 L75 80 L50 65 L25 80 L35 55 L20 40 L43 42 Z" fill="#fef08a" filter="url(#magic-bloom)"/>
             <circle cx="50" cy="52" r="15" fill="#ffffff" filter="url(#magic-bloom)"/>
             <polygon points="10,20 15,25 5,30" fill="#fca5a5" filter="url(#glow)"/><polygon points="80,10 90,15 85,25" fill="#fca5a5" filter="url(#glow)"/>`
        )
    },
    'olhar_abissal': { 
        id: 'olhar_abissal', name: 'Olhar do Abismo', type: 'DEBUFF', cost: 2, rng: 4, pwr: 0, desc: 'Aterroriza o alvo. Reduz o ATK e a SPD inimiga em 30%.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#6b21a8"/><stop offset="100%" stop-color="#000000"/></radialGradient>
             <radialGradient id="iris" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fde047"/><stop offset="50%" stop-color="#22c55e"/><stop offset="100%" stop-color="#064e3b"/></radialGradient>`,
            `<circle cx="50" cy="50" r="50" fill="#000" opacity="0.4"/>`,
            `<path d="M5 50 Q 50 -15 95 50 Q 50 115 5 50 Z" fill="#000" stroke="#d8b4fe" stroke-width="2" filter="url(#glow)"/>
             <path d="M15 50 Q 50 5 85 50 Q 50 95 15 50 Z" fill="#020617"/>
             <ellipse cx="50" cy="50" rx="30" ry="40" fill="url(#iris)"/>
             <path d="M45 15 C 45 15, 60 50, 45 85 C 45 85, 30 50, 45 15 Z" fill="#000"/>
             <path d="M55 15 C 55 15, 40 50, 55 85 C 55 85, 70 50, 55 15 Z" fill="#000"/>
             <ellipse cx="60" cy="35" rx="8" ry="12" fill="#ffffff" transform="rotate(30 60 35)" opacity="0.8" filter="url(#glow)"/>`
        )
    },
    'espinho_venenoso': { 
        id: 'espinho_venenoso', name: 'Disparo Tóxico', type: 'MAG', cost: 2, rng: 3, pwr: 0.8, desc: 'Dano no impacto + aplica Envenenamento severo por 3 turnos.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="65%"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#022c22"/></radialGradient>
             <linearGradient id="stinger" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1e293b"/><stop offset="50%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#f8fafc"/></linearGradient>`,
            `<circle cx="30" cy="70" r="25" fill="#22c55e" opacity="0.3" filter="url(#magic-bloom)"/>
             <circle cx="70" cy="30" r="15" fill="#22c55e" opacity="0.3" filter="url(#magic-bloom)"/>`,
            `<path d="M10 90 L85 15 C 95 5, 100 10, 95 20 L20 95 Z" fill="url(#stinger)" stroke="#020617" stroke-width="2"/>
             <path d="M40 60 L60 30 L65 40 Z M60 40 L80 10 L85 20 Z" fill="url(#stinger)" stroke="#020617" stroke-width="1"/>
             <path d="M85 20 C 70 30, 70 45, 85 55 C 100 45, 100 30, 85 20 Z" fill="#bcf68f" filter="url(#magic-bloom)"/>
             <path d="M45 60 C 35 70, 35 85, 45 90 C 55 85, 55 70, 45 60 Z" fill="#86efac" filter="url(#glow)"/>
             <circle cx="65" cy="65" r="5" fill="#bcf68f" filter="url(#glow)"/>`
        )
    },
    'nadadeira_navalha': { 
        id: 'nadadeira_navalha', name: 'Corte Navalha', type: 'ATK', cost: 2, rng: 1, pwr: 1.6, desc: 'Corte crítico da meia lua. 50% de chance de Dano Crítico (2x).',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="100%" stop-color="#082f49"/></radialGradient>
             <linearGradient id="blade" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#cbd5e1"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>`,
            `<path d="M10 80 Q 50 30 80 10" stroke="#0ea5e9" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#glow)" opacity="0.6"/>`,
            `<path d="M0 100 C 0 50, 50 0, 100 0 C 40 10, 10 40, 15 100 Z" fill="url(#blade)" filter="url(#magic-bloom)"/>
             <path d="M80 20 L83 8 L86 20 L98 23 L86 26 L83 38 L80 26 L68 23 Z" fill="#ffffff" filter="url(#heavy-glow)"/>
             <path d="M5 95 C 5 45, 45 5, 95 5" stroke="#ffffff" stroke-width="3" fill="none" filter="url(#glow)"/>`
        )
    },
    'amor_de_peixe': { 
        id: 'amor_de_peixe', name: 'Poder do Cardume', type: 'BUFF', cost: 3, rng: 3, pwr: 0, desc: 'Feromônios mágicos. Aumenta o ATK de TODOS os aliados na área em 25%.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#fce7f3"/><stop offset="100%" stop-color="#831843"/></radialGradient>
             <linearGradient id="heartGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f472b6"/><stop offset="100%" stop-color="#be185d"/></linearGradient>`,
            `<circle cx="50" cy="45" r="40" fill="#fbcfe8" opacity="0.4" filter="url(#magic-bloom)"/>`,
            `<path d="M50 35 C 50 35, 80 -10, 95 25 C 110 60, 50 95, 50 95 C 50 95, -10 60, 5 25 C 20 -10, 50 35, 50 35 Z" fill="url(#heartGrad)" stroke="#fdf2f8" stroke-width="2" filter="url(#glow)"/>
             <path d="M50 45 C 50 45, 65 15, 75 35 C 85 55, 50 80, 50 80 C 50 80, 15 55, 25 35 C 35 15, 50 45, 50 45 Z" fill="#fdf2f8" opacity="0.9" filter="url(#magic-bloom)"/>
             <polygon points="20,15 25,5 30,15 40,20 30,25 25,35 20,25 10,20" fill="#ffffff" filter="url(#glow)"/>
             <polygon points="80,75 83,68 86,75 93,78 86,81 83,88 80,81 73,78" fill="#ffffff" filter="url(#glow)"/>`
        )
    },

    // === ATAQUES AVANÇADOS (RPGs Táticos Clássicos) ===
    'tsunami': { 
        id: 'tsunami', name: 'Ira de Poseidon', type: 'MAG', cost: 4, rng: 3, pwr: 1.8, desc: 'Invoca uma onda massiva. Atinge e esmaga múltiplos inimigos simultaneamente.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="65%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#082f49"/></radialGradient>
             <linearGradient id="ocean" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#0284c7"/><stop offset="50%" stop-color="#0369a1"/><stop offset="100%" stop-color="#e0f2fe"/></linearGradient>`,
            `<path d="M0 100 C 20 50, 50 80, 100 100 Z" fill="#0c4a6e" />`,
            `<path d="M0 100 C 0 30, 40 0, 80 20 C 105 35, 110 5, 80 40 C 40 80, 20 80, 0 100 Z" fill="url(#ocean)" filter="url(#drop)"/>
             <path d="M0 100 C 0 25, 40 -5, 85 15 C 95 20, 80 30, 70 25 C 50 15, 20 40, 15 100 Z" fill="#ffffff" filter="url(#magic-bloom)"/>
             <path d="M70 20 C 80 10, 95 10, 90 30 C 85 25, 75 25, 70 20 Z" fill="#ffffff"/>
             <circle cx="85" cy="35" r="4" fill="#ffffff" filter="url(#glow)"/><circle cx="95" cy="25" r="3" fill="#e0f2fe" filter="url(#glow)"/>`
        )
    },
    'camuflagem': { 
        id: 'camuflagem', name: 'Camuflagem Óptica', type: 'BUFF', cost: 2, rng: 0, pwr: 0, desc: 'Mimetiza-se com o mar. Concede +60% de chance de Esquivar por 2 turnos.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#2dd4bf"/><stop offset="100%" stop-color="#020617"/></radialGradient>`,
            `<path d="M0 25 L100 25 M0 50 L100 50 M0 75 L100 75 M25 0 L25 100 M50 0 L50 100 M75 0 L75 100" stroke="#14b8a6" stroke-width="1" opacity="0.3"/>`,
            `<path d="M20 50 L50 10 L80 50 L50 90 Z" fill="none" stroke="#5eead4" stroke-width="4" filter="url(#magic-bloom)"/>
             <path d="M30 50 L50 25 L70 50 L50 75 Z" fill="#ccfbf1" opacity="0.9" filter="url(#glow)"/>
             <rect x="0" y="45" width="100" height="5" fill="#ffffff" filter="url(#heavy-glow)"/>
             <path d="M20 50 L50 10 L80 50 L50 90 Z" fill="none" stroke="#2dd4bf" stroke-width="8" transform="translate(0, -10)" opacity="0.3" filter="url(#glow)"/>`
        )
    },
    'vampirismo_abissal': { 
        id: 'vampirismo_abissal', name: 'Drenar Fluidos', type: 'MAG', cost: 3, rng: 1, pwr: 1.3, desc: 'Parasitismo puro. Converte 100% do dano causado no inimigo em cura.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#000000"/></radialGradient>
             <linearGradient id="orb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#881337"/></linearGradient>`,
            `<path d="M10 100 Q 50 50 50 20 Q 50 50 90 100" fill="none" stroke="#f43f5e" stroke-width="4" opacity="0.5" filter="url(#glow)"/>`,
            `<path d="M20 10 L30 70 C 35 40, 40 40, 45 10 Z" fill="#f8fafc" stroke="#000" stroke-width="2" filter="url(#drop)"/>
             <path d="M80 10 L70 70 C 65 40, 60 40, 55 10 Z" fill="#f8fafc" stroke="#000" stroke-width="2" filter="url(#drop)"/>
             <circle cx="50" cy="85" r="14" fill="url(#orb)" filter="url(#magic-bloom)"/>
             <path d="M50 85 C 40 70, 40 40, 50 20 C 60 40, 60 70, 50 85 Z" fill="#f43f5e" opacity="0.8" filter="url(#glow)"/>`
        )
    },
    'frenesi_predador': { 
        id: 'frenesi_predador', name: 'Frenesi Sanguinário', type: 'ATK', cost: 3, rng: 1, pwr: 0.6, desc: 'Perde o controle. Ataca o mesmo alvo 3 vezes seguidas de forma violenta.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#450a0a"/></radialGradient>`,
            `<path d="M0 0 L100 100 M100 0 L0 100" stroke="#ea580c" stroke-width="2" opacity="0.3"/>`,
            `<path d="M10 15 Q 40 50 20 95 M45 5 Q 70 50 50 100 M80 0 Q 100 50 75 90" fill="none" stroke="#000000" stroke-width="14" stroke-linecap="round" filter="url(#drop)"/>
             <path d="M10 15 Q 40 50 20 95 M45 5 Q 70 50 50 100 M80 0 Q 100 50 75 90" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" filter="url(#magic-bloom)"/>
             <path d="M25 80 L35 75 L30 90 Z M55 85 L65 75 L50 95 Z" fill="#ef4444" filter="url(#glow)"/>
             <circle cx="85" cy="80" r="5" fill="#fca5a5" filter="url(#glow)"/>`
        )
    },
    'choque_eletrico': { 
        id: 'choque_eletrico', name: 'Descarga Estática', type: 'MAG', cost: 3, rng: 2, pwr: 1.2, desc: 'Gera altíssima voltagem. Possui 40% de chance de infligir Paralisia.',
        icon: createIcon(
            `<radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#172554"/></radialGradient>
             <linearGradient id="bolt" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#fef08a"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>`,
            `<path d="M10 30 L40 40 L20 70 M90 20 L70 50 L90 80" fill="none" stroke="#60a5fa" stroke-width="3" filter="url(#glow)" opacity="0.6"/>`,
            `<path d="M60 0 L15 45 L45 55 L25 100 L95 40 L55 35 L75 0 Z" fill="url(#bolt)" stroke="#ffffff" stroke-width="2" filter="url(#magic-bloom)"/>
             <path d="M30 45 L5 40 M80 60 L95 70 M45 80 L70 95 M70 25 L85 10" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none" filter="url(#heavy-glow)"/>`
        )
    },
    'barreira_coral': { 
        id: 'barreira_coral', name: 'Formação de Coral', type: 'BUFF', cost: 2, rng: 2, pwr: 0, desc: 'Parede calcária no alvo. Ele não pode ser empurrado e tem a DEF dobrada.',
        icon: createIcon(
            `<linearGradient id="bg" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#4a044e"/><stop offset="50%" stop-color="#be185d"/><stop offset="100%" stop-color="#0284c7"/></linearGradient>
             <linearGradient id="coral" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#fca5a5"/></linearGradient>`,
            `<path d="M0 100 L25 50 L45 60 L60 40 L80 65 L100 100 Z" fill="#0f172a" stroke="#1e293b" stroke-width="4"/>`,
            `<path d="M25 60 C 25 30, 5 35, 10 10 M25 60 C 25 30, 45 40, 40 15 M75 65 C 75 35, 60 40, 65 15 M75 65 C 75 35, 95 30, 90 5 M50 70 C 50 40, 50 30, 55 10 M50 70 C 50 50, 35 30, 25 15" fill="none" stroke="url(#coral)" stroke-width="8" stroke-linecap="round" filter="url(#magic-bloom)"/>
             <path d="M25 60 C 25 30, 5 35, 10 10 M25 60 C 25 30, 45 40, 40 15 M75 65 C 75 35, 60 40, 65 15 M75 65 C 75 35, 95 30, 90 5 M50 70 C 50 40, 50 30, 55 10 M50 70 C 50 50, 35 30, 25 15" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
             <circle cx="10" cy="10" r="4.5" fill="#ffffff" filter="url(#heavy-glow)"/><circle cx="40" cy="15" r="5" fill="#ffffff" filter="url(#heavy-glow)"/><circle cx="65" cy="15" r="4.5" fill="#ffffff" filter="url(#heavy-glow)"/><circle cx="90" cy="5" r="3.5" fill="#ffffff" filter="url(#heavy-glow)"/><circle cx="55" cy="10" r="3" fill="#ffffff" filter="url(#glow)"/>`
        )
    }
};

// 2. OS PEIXES HÍBRIDOS CATALOGADOS (Fórmulas Fixas)
window.FUSIONS = {
    "Peixe Genérico+Peixe Otário": {
        id: "hibrido_generico_otario",
        name: "Otário Genérico",
        image: "/img/peixe/fusion/otario_generico.png", 
        desc: "Um peixe que não faz a menor ideia do que está fazendo no campo de batalha.",
        tactical_stats: { HP: 80, AP: 2, MP: 3, ATK: 15, DEF: 10, SPD: 5, RNG: 1 },
        available_skills: ['mordida_padrao', 'jato_agua', 'escudo_bolha', 'investida', 'espinho_venenoso']
    },
    "Bombardilo+Cruel kidfish": {
        id: "hibrido_kid_bomba",
        name: "Kid Bomba",
        image: "/img/peixe/fusion/kid_bomba.png",
        desc: "Pequeno, zangado e altamente explosivo. Excelente unidade de cerco.",
        tactical_stats: { HP: 60, AP: 2, MP: 4, ATK: 35, DEF: 5, SPD: 8, RNG: 2 },
        available_skills: ['mordida_padrao', 'explosao_kamikaze', 'investida', 'espinho_venenoso', 'olhar_abissal']
    },
    "Meio Peixe+Peixe Estranho": {
        id: "hibrido_meio_estranho",
        name: "Aberraçao Abissal",
        image: "/img/peixe/fusion/meio_estranho.png",
        desc: "Fica vivo mesmo depois de perder metade do HP. Causa repulsa nos inimigos.",
        tactical_stats: { HP: 150, AP: 1, MP: 2, ATK: 20, DEF: 25, SPD: 2, RNG: 1 },
        available_skills: ['mordida_padrao', 'olhar_abissal', 'escudo_bolha', 'canto_sereia', 'nadadeira_navalha']
    },
    "Peixes Fófos Juntos <3+Peixes Fófos Juntos <3": {
        id: "hibrido_fofos_filhote",
        name: "Cardume Herdeiro",
        image: "/img/peixe/fusion/fofos_filhote.png",
        desc: "O fruto do amor marítimo. Luta com o poder da amizade (e dentes muito afiados).",
        tactical_stats: { HP: 100, AP: 3, MP: 5, ATK: 25, DEF: 15, SPD: 10, RNG: 1 },
        available_skills: ['amor_de_peixe', 'mordida_padrao', 'jato_agua', 'canto_sereia', 'escudo_bolha']
    },
    // NOVO LENDÁRIO CATALOGADO
    "Big Eye Bocaccete+Meu Almoço Delicioso": {
        id: "hibrido_food_eye",
        name: "Bocaccete Delicioso",
        image: "/img/peixe/fusion/food-eye-bocaccete.png",
        desc: "Uma refeição incrivelmente suculenta que fica te encarando enquanto você tenta comer. Aterrorizante.",
        tactical_stats: { HP: 220, AP: 3, MP: 4, ATK: 45, DEF: 35, SPD: 12, RNG: 2 },
        available_skills: ['mordida_padrao', 'olhar_abissal', 'canto_sereia', 'amor_de_peixe', 'jato_agua']
    }
};

// 3. O MOTOR CIENTÍFICO DE MUTAÇÃO (Gera Quimeras do zero)
window.FusionManager = {
    sanitizeStr: function(str) {
        if (!str) return "desconhecido";
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/peixe /g, "").replace(/[^a-z0-9]/g, '');
    },

    processFusion: function(slotA, slotB) {
        if (!slotA || !slotB) return null;
        const key = [slotA.name, slotB.name].sort().join('+');

        // Se tiver uma receita pronta e desenhada à mão, usa ela!
        if (window.FUSIONS && window.FUSIONS[key]) {
            return window.FUSIONS[key];
        }

        // ========================================================
        // GERAÇÃO PROCEDURAL SE A RECEITA NÃO EXISTIR
        // ========================================================
        const prefixos = ["Quimera", "Mutante", "Híbrido", "Aberraçao", "Cobaia", "Espécime"];
        const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
        
        // Isola os nomes sem quebrar em peixes longos
        const nomeA = slotA.name.replace(/Peixe /i, "").split(' ')[0] || "Alfa";
        const nomeB = slotB.name.replace(/Peixe /i, "").split(' ').pop() || "Ômega";
        
        const safeA = this.sanitizeStr(nomeA);
        const safeB = this.sanitizeStr(nomeB);
        
        // Caminho Dinâmico: /img/peixe/fusion/mutante_bombardilo_generico.png
        const imagePath = `/img/peixe/fusion/mutante_${safeA}_${safeB}.png`;

        // Sorteia Habilidades
        const allSkillsKeys = Object.keys(window.SKILLS || {});
        const randomSkills = [];
        if (allSkillsKeys.length > 0) {
            while(randomSkills.length < 4 && randomSkills.length < allSkillsKeys.length) {
                const sk = allSkillsKeys[Math.floor(Math.random() * allSkillsKeys.length)];
                if(!randomSkills.includes(sk)) randomSkills.push(sk);
            }
        }

        // Status
        const geradoHP = Math.floor(Math.random() * 80) + 40;
        const geradoATK = Math.floor(Math.random() * 25) + 15;
        const geradoDEF = Math.floor(Math.random() * 20) + 5;
        const geradoSPD = Math.floor(Math.random() * 8) + 3;

        return {
            id: "custom_" + Date.now() + "_" + Math.floor(Math.random()*10000),
            name: `${prefixo} ${nomeA}-${nomeB}`,
            image: imagePath,
            fallbackImage: slotA.data ? slotA.data.image : 'https://placehold.co/80x80?text=?',
            desc: `DNA não catalogado resultante do cruzamento de ${slotA.name} e ${slotB.name}. Anomalia genética detectada.`,
            tactical_stats: { 
                HP: geradoHP, 
                AP: Math.floor(Math.random() * 2) + 2, 
                MP: Math.floor(Math.random() * 3) + 2, 
                ATK: geradoATK, 
                DEF: geradoDEF, 
                SPD: geradoSPD, 
                RNG: Math.floor(Math.random() * 2) + 1 
            },
            available_skills: randomSkills,
            isCustom: true // Tag de identificação para o Radar
        };
    }
};