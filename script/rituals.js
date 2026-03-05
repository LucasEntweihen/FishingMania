/* ==========================================================================
   RITUAIS OCULTOS E ORBES DE EVENTO (END-GAME)
   ========================================================================== */

   const RITUALS_DB = [
    {
        id: 'ritual_tempestade', name: 'Dança da Tempestade', eventTarget: 'tempestade', orbIcon: '⛈️', orbColor: '#3b82f6', 
        desc: 'Invoca o Orbe das Tormentas. Força uma Tempestade Noturna imediata.', successChance: 0.70, 
        reqMats: { 'titanio': 2500, 'carbono': 1500, 'meteorito': 1000 }, reqFish: 5, req67: 1
    },
    {
        id: 'ritual_ouro', name: 'Sacrifício da Avareza', eventTarget: 'ouro', orbIcon: '✨', orbColor: '#fbbf24', 
        desc: 'Invoca o Orbe de Ouro. O oceano brilhará e dobrará os seus lucros.', successChance: 0.60, 
        reqMats: { 'ouro': 5000, 'perola': 2000, 'cristal': 1000 }, reqFish: 5, req67: 1
    },
    {
        id: 'ritual_frenesi', name: 'Gula Sanguinária', eventTarget: 'frenesi', orbIcon: '🦈', orbColor: '#ef4444', 
        desc: 'Invoca o Orbe Sangrento. Desperta um Frenesi Alimentar no cais.', successChance: 0.65, 
        reqMats: { 'metal': 5000, 'plastico': 5000, 'materia_escura': 1000 }, reqFish: 5, req67: 1
    },
    {
        id: 'ritual_misticismo', name: 'Cântico do Nevoeiro', eventTarget: 'misticismo', orbIcon: '🔮', orbColor: '#a855f7', 
        desc: 'Invoca o Orbe Místico. Cobre a tela e aumenta o spawn de Lendas incrivelmente.', successChance: 0.50, 
        reqMats: { 'tecido_magico': 2000, 'cristal': 1500, 'essencia': 1000 }, reqFish: 5, req67: 1
    },
    {
        id: 'ritual_abismo', name: 'Pacto da Escória', eventTarget: 'abismo_lixo', orbIcon: '🗑️', orbColor: '#10b981', 
        desc: 'Invoca o Orbe do Descarte. O mar vira lixo e desperta as relíquias Vândalas.', successChance: 0.40, 
        reqMats: { 'metal': 10000, 'plastico': 10000, 'uranio_vazado': 500, 'tecido_magico': 500 }, reqFish: 5, req67: 1
    },
    {
        id: 'ritual_bestas', name: 'O Chamado do Abismo', eventTarget: 'mar_bestas', orbIcon: '🐙', orbColor: '#7f1d1d', 
        desc: 'Invoca o Orbe do Fim. Evoca o temido Mar das Bestas. (Risco extremo de falha)', successChance: 0.30, 
        reqMats: { 'materia_escura': 3000, 'fragmento_tempo': 1500, 'poeira_cosmica': 1000, 'tecido_realidade': 250 }, reqFish: 5, req67: 1
    }
];

const SACRIFICE_RARITIES = ['lendario', 'mitico', 'secreto', 'divino', 'aurudo', 'vandalo', 'bestial'];

let activeRitual = null;

function getValidSacrificeFishes(is67) {
    if (!window.RARITIES || !window.GAME_STATE) return [];
    const collection = is67 ? window.GAME_STATE.collection67 : window.GAME_STATE.collection;
    if (!collection) return [];
    let validFishes = [];
    Object.values(window.RARITIES).forEach(rarity => {
        if (SACRIFICE_RARITIES.includes(rarity.id)) {
            rarity.variations.forEach(fish => {
                const ownedAmount = collection[fish.name] || 0;
                if (ownedAmount > 0) validFishes.push({ name: fish.name, amount: ownedAmount, image: fish.image, rarity: rarity.name, color: rarity.style });
            });
        }
    });
    return validFishes;
}

function consumeFishes(amountRequired, is67) {
    const collection = is67 ? window.GAME_STATE.collection67 : window.GAME_STATE.collection;
    let amountLeftToConsume = amountRequired;
    const validFishes = getValidSacrificeFishes(is67);

    for (let i = 0; i < validFishes.length && amountLeftToConsume > 0; i++) {
        const fishData = validFishes[i];
        const consumeFromThis = Math.min(fishData.amount, amountLeftToConsume);
        collection[fishData.name] -= consumeFromThis;
        amountLeftToConsume -= consumeFromThis;
    }
}

function initRituals() {
    if (window.GAME_STATE && !window.GAME_STATE.orbs) window.GAME_STATE.orbs = {};

    const btnOpen = document.getElementById('open-rituals-btn');
    const btnClose = document.getElementById('close-rituals-btn');
    const modal = document.getElementById('rituals-modal');

    if (btnOpen && btnClose && modal) {
        btnOpen.addEventListener('click', () => {
            modal.classList.remove('hidden');
            renderRitualsList();
            if(!activeRitual) selectRitual(RITUALS_DB[0].id);
            else renderActiveRitual();
        });
        btnClose.addEventListener('click', () => modal.classList.add('hidden') );
    }

    if (!document.getElementById('orb-styles')) {
        const style = document.createElement('style');
        style.id = 'orb-styles';
        style.innerHTML = `
            @keyframes pulseOrb { 0% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.1); filter: brightness(1.3); } 100% { transform: scale(1); filter: brightness(1); } }
            .event-orb { width: 55px; height: 55px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.8rem; cursor: pointer; transition: all 0.3s; animation: pulseOrb 2s infinite ease-in-out; border: 2px solid rgba(255,255,255,0.5); user-select: none; }
            .event-orb:hover { transform: scale(1.2) !important; }
        `;
        document.head.appendChild(style);
    }
    setTimeout(renderOrbs, 1000);
}

window.renderOrbs = function() {
    const container = document.getElementById('orbs-container');
    if (!container) return;
    container.innerHTML = '';
    if (!window.GAME_STATE || !window.GAME_STATE.orbs) return;

    Object.keys(window.GAME_STATE.orbs).forEach(ritualId => {
        const count = window.GAME_STATE.orbs[ritualId];
        if (count > 0) {
            const ritualData = RITUALS_DB.find(r => r.id === ritualId);
            if (!ritualData) return;
            const orbDiv = document.createElement('div');
            orbDiv.className = 'event-orb tooltip'; orbDiv.dataset.tip = `Forçar: ${ritualData.name} (x${count})`;
            orbDiv.style.background = `radial-gradient(circle at 30% 30%, #fff, ${ritualData.orbColor} 40%, #000 100%)`;
            orbDiv.style.boxShadow = `0 0 20px ${ritualData.orbColor}, inset 0 0 10px rgba(255,255,255,0.8)`;
            orbDiv.innerHTML = `<span style="filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));">${ritualData.orbIcon}</span>`;
            if (count > 1) { orbDiv.innerHTML += `<div style="position:absolute; bottom:-5px; right:-5px; background:#0f172a; color:white; border-radius:50%; width:20px; height:20px; font-size:0.7rem; display:flex; justify-content:center; align-items:center; font-weight:bold; border:2px solid ${ritualData.orbColor};">${count}</div>`; }

            orbDiv.addEventListener('click', () => {
                if (window.currentEventID) {
                    if(window.showToast) window.showToast("Céu Instável", "Aguarde o fim do evento atual.", "warning");
                    return;
                }
                window.GAME_STATE.orbs[ritualId]--;
                if(typeof window.saveGame === "function") window.saveGame();
                window.renderOrbs();
                if (typeof window.forceEvent === "function") window.forceEvent(ritualData.eventTarget);
            });
            container.appendChild(orbDiv);
        }
    });
}

function renderRitualsList() {
    const listContainer = document.getElementById('ritual-list-container');
    if (!listContainer) return;
    listContainer.innerHTML = `<h3 style="color:#a78bfa; font-family:'Fredoka'; text-align:center; margin-top:0; border-bottom:1px solid #3f3f46; padding-bottom:10px;">Tomo Negro</h3>`;

    RITUALS_DB.forEach(ritual => {
        const isActive = activeRitual && activeRitual.id === ritual.id;
        const div = document.createElement('div');
        div.style.cssText = `background: ${isActive ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${isActive ? '#8b5cf6' : '#3f3f46'}; padding: 15px; border-radius: 12px; margin-bottom: 12px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 12px;`;
        div.innerHTML = `
            <div style="font-size: 2rem; filter: drop-shadow(0 0 10px ${ritual.orbColor});">${ritual.orbIcon}</div>
            <div>
                <div style="color: ${isActive ? '#ddd6fe' : '#a1a1aa'}; font-weight: bold; font-family: 'Poppins', sans-serif; font-size: 0.95rem;">${ritual.name}</div>
                <div style="color: ${isActive ? '#a78bfa' : '#52525b'}; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">${(ritual.successChance * 100).toFixed(0)}% Sucesso</div>
            </div>
        `;
        div.addEventListener('click', () => selectRitual(ritual.id));
        listContainer.appendChild(div);
    });
}

function selectRitual(id) { activeRitual = RITUALS_DB.find(r => r.id === id); renderRitualsList(); renderActiveRitual(); }

function renderActiveRitual() {
    if (!activeRitual) return;
    document.getElementById('ritual-title').innerHTML = `<span style="font-size: 2.5rem; filter: drop-shadow(0 0 15px ${activeRitual.orbColor});">${activeRitual.orbIcon}</span><br>${activeRitual.name}<div style="font-size: 0.9rem; color: #a1a1aa; font-family: 'Poppins'; font-weight: normal; margin-top: 10px; max-width: 500px; margin-inline: auto;">${activeRitual.desc}</div>`;

    let canExecute = true;

    const fishReqBox = document.getElementById('ritual-fish-req');
    const validNormals = getValidSacrificeFishes(false);
    const valid67s = getValidSacrificeFishes(true);
    let totalNormals = validNormals.reduce((sum, f) => sum + f.amount, 0);
    let total67s = valid67s.reduce((sum, f) => sum + f.amount, 0);
    if (totalNormals < activeRitual.reqFish || total67s < activeRitual.req67) canExecute = false;

    fishReqBox.innerHTML = `
        <div style="background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; border: 1px solid ${totalNormals >= activeRitual.reqFish ? '#34d399' : '#ef4444'}55; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #cbd5e1; font-size: 0.85rem; font-weight: bold;">🐟 Almas de Elite</span><span style="color: ${totalNormals >= activeRitual.reqFish ? '#34d399' : '#ef4444'}; font-weight: 900; font-size: 1.1rem;">${totalNormals} / ${activeRitual.reqFish}</span>
        </div>
        <div style="background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; border: 1px solid ${total67s >= activeRitual.req67 ? '#34d399' : '#ef4444'}55; display: flex; justify-content: space-between; align-items: center; margin-top:10px;">
            <span style="color: #cbd5e1; font-size: 0.85rem; font-weight: bold;">🏆 Colossos (67cm+)</span><span style="color: ${total67s >= activeRitual.req67 ? '#34d399' : '#ef4444'}; font-weight: 900; font-size: 1.1rem;">${total67s} / ${activeRitual.req67}</span>
        </div>
    `;

    const matReqBox = document.getElementById('ritual-mat-req');
    let matHTML = '';
    Object.keys(activeRitual.reqMats).forEach(matId => {
        const needed = activeRitual.reqMats[matId];
        const have = (window.GAME_STATE && window.GAME_STATE.materials && window.GAME_STATE.materials[matId]) ? window.GAME_STATE.materials[matId] : 0;
        const matData = window.MATERIALS.find(m => m.id === matId);
        if (have < needed) canExecute = false;
        const color = have >= needed ? '#34d399' : '#ef4444';
        matHTML += `<div style="background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; border: 1px solid ${color}55; display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <span style="color: #cbd5e1; font-size: 0.85rem; display: flex; align-items: center; gap: 5px;"><span>${matData ? matData.icon : '📦'}</span> ${matData ? matData.name : matId}</span>
            <span style="color: ${color}; font-weight: 900; font-size: 0.95rem;">${have.toLocaleString()} / ${needed.toLocaleString()}</span>
        </div>`;
    });
    matReqBox.innerHTML = matHTML;

    const btn = document.getElementById('btn-execute-ritual');
    if (canExecute) {
        btn.disabled = false; btn.style.background = `linear-gradient(135deg, ${activeRitual.orbColor}, #4c1d95)`;
        btn.style.color = 'white'; btn.style.borderColor = activeRitual.orbColor; btn.style.boxShadow = `0 0 20px ${activeRitual.orbColor}88`; btn.style.cursor = 'pointer';
        btn.innerText = `SACRIFICAR TUDO (${(activeRitual.successChance * 100).toFixed(0)}%)`;
        btn.onclick = () => {
            Object.keys(activeRitual.reqMats).forEach(matId => { window.GAME_STATE.materials[matId] -= activeRitual.reqMats[matId]; });
            consumeFishes(activeRitual.reqFish, false); consumeFishes(activeRitual.req67, true);
            if (Math.random() <= activeRitual.successChance) {
                window.GAME_STATE.orbs[activeRitual.id] = (window.GAME_STATE.orbs[activeRitual.id] || 0) + 1;
                if(window.showToast) window.showToast("Ritual Bem Sucedido!", `Você obteve o ${activeRitual.orbIcon} Orbe de Evento!`, "success");
                window.renderOrbs();
            } else {
                if(window.showToast) window.showToast("O Ritual Falhou...", `Os Deuses rejeitaram a sua oferenda.`, "error");
            }
            if(typeof window.saveGame === "function") window.saveGame();
            renderActiveRitual();
        };
    } else {
        btn.disabled = true; btn.style.background = '#27272a'; btn.style.color = '#52525b';
        btn.style.borderColor = '#3f3f46'; btn.style.boxShadow = 'none'; btn.style.cursor = 'not-allowed';
        btn.innerText = 'Recursos Insuficientes'; btn.onclick = null;
    }
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', () => setTimeout(initRituals, 500)); } else { setTimeout(initRituals, 500); }