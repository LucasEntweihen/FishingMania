import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = { 
    apiKey: "AIzaSyDHz1W47O5kTiEPw7OjEjSXD0eH_ICtfDA", 
    authDomain: "fishingmania-6dced.firebaseapp.com", 
    databaseURL: "https://fishingmania-6dced-default-rtdb.firebaseio.com", 
    projectId: "fishingmania-6dced", 
    storageBucket: "fishingmania-6dced.firebasestorage.app", 
    messagingSenderId: "761476396898", 
    appId: "1:761476396898:web:2b81f955acbf622a4c9e3b" 
};

// ==========================================================
// 1. O SEU MAPA EXPORTADO VEM AQUI!
// (Você pode colar por cima deste bloco sempre que quiser)
// ==========================================================
window.CURRENT_MAP = {
    bg: '/img/map/mapa1.png',
    bgOffsetX: 0,
    bgOffsetY: 0,
    bgZoom: 100,
    width: 10,
    height: 10,
    layout: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
    ]
};

// ==========================================================
// 2. INICIALIZAÇÃO SEGURA DO FIREBASE
// ==========================================================
const urlParams = new URLSearchParams(window.location.search);
const isGuestMode = urlParams.get('guest') === 'true';

let app, auth, db, offlineMode = false;

try {
    app = initializeApp(firebaseConfig); 
    auth = getAuth(app); 
    db = getDatabase(app);
} catch(e) { 
    console.warn("⚠️ Firebase Offline ou Bloqueado. Forçando Modo Local.");
    offlineMode = true; 
}

window.GAME_STATE = {};

// ==========================================================
// 3. MOTOR TÁTICO PRINCIPAL
// ==========================================================
window.TacticsEngine = {
    mapWidth: 6,
    mapHeight: 6,
    cells: [],
    units: [],
    turnQueue: [],
    activeUnitIndex: -1,
    state: 'INIT', 
    selectedSkill: null,
    
    turnFlags: { moved: false, attacked: false },
    autoSkipTimer: null,
    skipCountdown: 5,

    init: async function() {
        this.log("Iniciando varredura topográfica...", "system");
        // Sincroniza o motor com o mapa carregado
        this.mapWidth = window.CURRENT_MAP.width;
        this.mapHeight = window.CURRENT_MAP.height;
        this.gridSize = Math.max(this.mapWidth, this.mapHeight); // Fallback para a IA antiga

        await this.loadPlayerSquad();
        this.spawnEnemies();
        this.createGrid();
        this.startCombat();
    },

    log: function(msg, type='system') {
        const logDiv = document.getElementById('combat-log');
        if(logDiv) { logDiv.innerHTML += `<div class="log-entry ${type}">${msg}</div>`; logDiv.scrollTop = logDiv.scrollHeight; }
    },

    // VERIFICA SE A CÉLULA É CHÃO SÓLIDO E ESTÁ DENTRO DO MAPA
    isValidCell: function(x, y) {
        if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) return false;
        return window.CURRENT_MAP.layout[y][x] === 1;
    },

    getFreePosition: function(minX, maxX) {
        let x, y, attempts = 0;
        do {
            x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            y = Math.floor(Math.random() * this.mapHeight);
            attempts++;
        } while ((this.getUnitAt(x, y) || !this.isValidCell(x, y)) && attempts < 200);
        
        // Se após 200 tentativas não achar vaga (mapa muito esburacado), força em qualquer lugar sólido
        if (attempts >= 200) {
            for(let cy=0; cy<this.mapHeight; cy++) {
                for(let cx=0; cx<this.mapWidth; cx++) {
                    if(this.isValidCell(cx, cy) && !this.getUnitAt(cx, cy)) return {x: cx, y: cy};
                }
            }
        }
        return {x, y};
    },

    loadPlayerSquad: async function() {
        let playerUnits = [];
        let safeInstances = window.GAME_STATE.hybridInstances || [];
        if (!Array.isArray(safeInstances)) safeInstances = Object.values(safeInstances);

        const squad = window.GAME_STATE.tacticalSquad || [];
        const spawnMaxX = Math.floor(this.mapWidth / 3); // Jogador nasce na primeira terça parte do mapa

        squad.forEach((uid) => {
            if (!uid) return;
            const inst = safeInstances.find(h => h.uid === uid);
            if (!inst) return;
            
            let fishDataKey = Object.keys(window.FUSIONS || {}).find(k => window.FUSIONS[k].id === inst.speciesId);
            let data = fishDataKey ? window.FUSIONS[fishDataKey] : (window.GAME_STATE.customFusions ? window.GAME_STATE.customFusions[inst.speciesId] : null);
            
            if (data) {
                let pos = this.getFreePosition(0, spawnMaxX);
                let equipped = (inst.equippedSkills && inst.equippedSkills.length > 0) ? inst.equippedSkills : (data.available_skills ? data.available_skills.slice(0,1) : ['mordida_padrao']);

                playerUnits.push({
                    id: uid, isPlayer: true, name: data.name, image: data.image,
                    fallbackImage: data.fallbackImage || 'https://placehold.co/80x80?text=?',
                    hp: data.tactical_stats.HP, maxHp: data.tactical_stats.HP,
                    ap: data.tactical_stats.AP, maxAp: data.tactical_stats.AP,
                    mp: data.tactical_stats.MP, maxMp: data.tactical_stats.MP,
                    atk: data.tactical_stats.ATK, def: data.tactical_stats.DEF, spd: data.tactical_stats.SPD,
                    skills: equipped, x: pos.x, y: pos.y
                });
            }
        });

        if (playerUnits.length === 0) {
            this.log("⚠️ Pelotão vazio. Injetando Unidade de Treinamento.", "error");
            let pos = this.getFreePosition(0, spawnMaxX);
            playerUnits.push({
                id: 'p_fallback', isPlayer: true, name: 'Recruta Abissal', image: '/img/peixe/peixe_padrao.png', fallbackImage: 'https://placehold.co/80x80?text=?',
                hp: 150, maxHp: 150, ap: 4, maxAp: 4, mp: 4, maxMp: 4, atk: 25, def: 10, spd: 5,
                skills: ['mordida_padrao', 'jato_agua', 'escudo_bolha'], x: pos.x, y: pos.y
            });
        }
        this.units.push(...playerUnits);
    },

    spawnEnemies: function() {
        if (!window.ENEMY_DATABASE) { console.error("Inimigos não carregados!"); return; }
        
        const numEnemies = Math.floor(Math.random() * 3) + 2; 
        const spawnMinX = this.mapWidth - Math.floor(this.mapWidth / 3) - 1; // Inimigos nascem no final do mapa

        for(let i=0; i<numEnemies; i++) {
            const baseEnemy = window.ENEMY_DATABASE[Math.floor(Math.random() * window.ENEMY_DATABASE.length)];
            let pos = this.getFreePosition(spawnMinX, this.mapWidth - 1); 
            
            this.units.push({
                id: 'e_' + i, isPlayer: false, name: baseEnemy.name, image: baseEnemy.image, fallbackImage: baseEnemy.fallback,
                hp: baseEnemy.hp, maxHp: baseEnemy.hp, ap: baseEnemy.ap, maxAp: baseEnemy.ap, mp: baseEnemy.mp, maxMp: baseEnemy.mp,
                atk: baseEnemy.atk, def: baseEnemy.def, spd: baseEnemy.spd, skills: baseEnemy.skills, ai: baseEnemy.ai,
                x: pos.x, y: pos.y
            });
        }
    },

    createGrid: function() {
        const gridDOM = document.getElementById('grid');
        const bgDOM = document.querySelector('.board-wrapper');
        if(!gridDOM) return;
        
        gridDOM.innerHTML = '';
        this.cells = [];

        // Injeta a arte de fundo e as proporções
        if(bgDOM && window.CURRENT_MAP.bg) bgDOM.style.backgroundImage = `url('${window.CURRENT_MAP.bg}')`;
        gridDOM.style.gridTemplateColumns = `repeat(${this.mapWidth}, 1fr)`;
        gridDOM.style.gridTemplateRows = `repeat(${this.mapHeight}, 1fr)`;

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const cell = document.createElement('div');
                const isSolid = window.CURRENT_MAP.layout[y][x] === 1;

                // Células Void recebem uma classe especial de máscara
                cell.className = `cell ${isSolid ? '' : 'void-cell'}`; 
                cell.dataset.x = x; cell.dataset.y = y;
                
                if(isSolid) { cell.onclick = () => this.onCellClick(x, y); }
                
                gridDOM.appendChild(cell);
                this.cells.push({ x, y, dom: cell, solid: isSolid });
            }
        }
        this.renderUnits();
    },

    getUnitAt: function(x, y) { return this.units.find(u => u.hp > 0 && u.x === x && u.y === y); },
    getDist: function(x1, y1, x2, y2) { return Math.abs(x1 - x2) + Math.abs(y1 - y2); },

    renderUnits: function() {
        const gridDOM = document.getElementById('grid');
        if (!gridDOM) return;
        
        this.units.forEach(u => {
            let unitDOM = document.getElementById(`unit-${u.id}`);
            
            if (u.hp <= 0) {
                if (unitDOM) unitDOM.remove();
                return;
            }

            if (!unitDOM) {
                unitDOM = document.createElement('div');
                unitDOM.className = `unit ${u.isPlayer ? 'player' : 'enemy'}`;
                unitDOM.id = `unit-${u.id}`;
                
                const img = document.createElement('img');
                img.src = u.image;
                img.onerror = function() { this.onerror = null; this.src = u.fallbackImage; };

                const contentDiv = document.createElement('div');
                contentDiv.className = 'unit-content';
                contentDiv.innerHTML = `<div class="hp-bar-container"><div class="hp-bar-fill"></div></div>`;
                contentDiv.appendChild(img);
                
                unitDOM.appendChild(contentDiv);
                gridDOM.appendChild(unitDOM);
            }
            
            // O tamanho da divisão é variável com base na matriz!
            unitDOM.style.width = `calc(100% / ${this.mapWidth})`;
            unitDOM.style.height = `calc(100% / ${this.mapHeight})`;
            unitDOM.style.left = `calc(var(--x) * (100% / ${this.mapWidth}))`;
            unitDOM.style.top = `calc(var(--y) * (100% / ${this.mapHeight}))`;

            unitDOM.style.setProperty('--x', u.x);
            unitDOM.style.setProperty('--y', u.y);
            unitDOM.style.zIndex = 10 + u.x + u.y; // Z-Index Dinâmico Isométrico
            
            const hpFill = unitDOM.querySelector('.hp-bar-fill');
            if(hpFill) hpFill.style.width = `${(u.hp / u.maxHp) * 100}%`;
        });
    },

    startCombat: function() {
        this.log("Ameaças detectadas. Iniciando combate!", "system");
        this.turnQueue = [...this.units].sort((a, b) => b.spd - a.spd);
        this.activeUnitIndex = -1;
        this.nextTurn();
    },

    renderTurnQueue: function() {
        const qDOM = document.getElementById('turn-queue');
        if(!qDOM) return;
        qDOM.innerHTML = '';
        this.turnQueue.forEach((u, i) => {
            const img = document.createElement('img');
            img.src = u.image; img.onerror = function() { this.onerror = null; this.src = u.fallbackImage; };
            img.className = `queue-portrait ${i === this.activeUnitIndex ? 'active' : ''} ${u.hp <= 0 ? 'dead' : ''}`;
            qDOM.appendChild(img);
        });
    },

    clearAutoSkip: function() {
        if (this.autoSkipTimer) { clearInterval(this.autoSkipTimer); this.autoSkipTimer = null; }
        const passBtn = document.getElementById('btn-pass-turn');
        if (passBtn) passBtn.innerText = "ENCERRAR TURNO";
    },

    checkAutoSkip: function() {
        this.clearAutoSkip();
        const active = this.turnQueue[this.activeUnitIndex];
        if (!active || !active.isPlayer) return;

        let lowestCost = 99;
        active.skills.forEach(skId => {
            const sk = window.SKILLS[skId]; if(sk && sk.cost < lowestCost) lowestCost = sk.cost;
        });

        if ((this.turnFlags.moved && this.turnFlags.attacked) || (this.turnFlags.moved && active.ap < lowestCost)) {
            this.skipCountdown = 5;
            this.log(`Sem ações disponíveis. Pulando turno em 5s...`, 'system');
            
            this.autoSkipTimer = setInterval(() => {
                this.skipCountdown--;
                const passBtn = document.getElementById('btn-pass-turn');
                if (passBtn) passBtn.innerText = `Auto-Passar (${this.skipCountdown}s)`;
                
                if (this.skipCountdown <= 0) {
                    this.clearAutoSkip();
                    this.nextTurn();
                }
            }, 1000);
        }
    },

    nextTurn: function() {
        this.state = 'ANIMATING';
        this.clearHighlights();
        this.clearAutoSkip();

        const playersAlive = this.units.filter(u => u.isPlayer && u.hp > 0).length;
        const enemiesAlive = this.units.filter(u => !u.isPlayer && u.hp > 0).length;

        if (playersAlive === 0) { this.endGame(false); return; }
        if (enemiesAlive === 0) { this.endGame(true); return; }

        this.activeUnitIndex++;
        if (this.activeUnitIndex >= this.turnQueue.length) {
            this.activeUnitIndex = 0;
            this.log("--- Nova Rodada ---", "system");
        }

        const active = this.turnQueue[this.activeUnitIndex];
        if (active.hp <= 0) { this.nextTurn(); return; }

        this.turnFlags.moved = false;
        this.turnFlags.attacked = false;
        active.ap = active.maxAp;
        active.mp = active.maxMp;

        this.renderTurnQueue();
        this.log(`Turno de: ${active.name}`, active.isPlayer ? 'player' : 'enemy');
        
        const cellDOM = this.cells.find(c => c.x === active.x && c.y === active.y).dom;
        if(cellDOM) cellDOM.classList.add('active-turn');

        if (active.isPlayer) {
            this.state = 'IDLE';
            this.renderHUD(active);
            this.showWalkable(active);
            this.checkAutoSkip();
        } else {
            this.renderHUD(active);
            if(window.EnemyAI) window.EnemyAI.execute(active, this);
            else { this.log("Erro: Módulo de IA Inimiga não encontrado.", "error"); setTimeout(() => this.nextTurn(), 1000); }
        }
    },

    renderHUD: function(unit) {
        const hud = document.getElementById('hud-content');
        if(!hud) return;
        let skillsHtml = '';

        if (unit.isPlayer) {
            const hasMovedStr = this.turnFlags.moved ? '<span class="status-flag used">Já Andou</span>' : '<span class="status-flag">Pode Andar</span>';
            const hasAttackedStr = this.turnFlags.attacked ? '<span class="status-flag used">Já Atacou</span>' : '<span class="status-flag">Pode Atacar</span>';

            unit.skills.forEach(skId => {
                const sk = window.SKILLS ? window.SKILLS[skId] : { name: 'Ataque', cost: 1, icon: '⚔️', rng: 1 };
                const canUse = (unit.ap >= sk.cost) && !this.turnFlags.attacked;
                
                skillsHtml += `
                    <button class="skill-btn" ${!canUse ? 'disabled' : ''} onclick="window.TacticsEngine.prepareSkill('${skId}')">
                        <div class="s-icon">${sk.icon || '⚔️'}</div>
                        <div>
                            <div style="font-weight:bold; font-size:1.1rem;">${sk.name}</div>
                            <div style="font-size:0.75rem; color:#94a3b8;">Custo: ${sk.cost} AP | Alcance: ${sk.rng}</div>
                        </div>
                    </button>
                `;
            });
            
            skillsHtml += `
                <div class="status-flags">${hasMovedStr} ${hasAttackedStr}</div>
                <button id="btn-pass-turn" class="skill-btn" style="justify-content:center; background:linear-gradient(90deg, #991b1b, #ef4444); border-left-color: #fca5a5; margin-top:5px; padding: 15px;" onclick="window.TacticsEngine.nextTurn()">ENCERRAR TURNO</button>
            `;
        } else {
            skillsHtml = `<div style="text-align:center; color:#ef4444; font-weight:900; margin-top:30px; letter-spacing:2px;">[ PROCESSANDO AMEAÇA ]</div>`;
        }

        hud.innerHTML = `
            <div class="hud-portrait">
                <img src="${unit.image}" onerror="this.src='${unit.fallbackImage}'">
                <div>
                    <h2 class="hud-name" style="color: ${unit.isPlayer ? '#38bdf8' : '#ef4444'}">${unit.name}</h2>
                    <span style="font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">${unit.isPlayer ? 'Vanguarda Aliada' : 'Ameaça Hostil'}</span>
                </div>
            </div>
            <div class="hud-stats">
                <div class="hud-stat" style="border-bottom: 3px solid #4ade80;"><span>Saúde (HP)</span>${unit.hp}/${unit.maxHp}</div>
                <div class="hud-stat" style="border-bottom: 3px solid #60a5fa;"><span>Ação (AP)</span>${unit.ap}/${unit.maxAp}</div>
            </div>
            <div class="action-bar custom-scrollbar" style="max-height: 280px; overflow-y:auto; padding-right:10px;">${skillsHtml}</div>
        `;
    },

    clearHighlights: function() { this.cells.forEach(c => { c.dom.classList.remove('walkable', 'targetable', 'active-turn'); }); },

    showWalkable: function(unit) {
        if (this.state !== 'IDLE') return;
        this.clearHighlights();
        
        const activeCell = this.cells.find(c => c.x === unit.x && c.y === unit.y);
        if(activeCell) activeCell.dom.classList.add('active-turn');

        if (unit.mp <= 0 || this.turnFlags.moved) return;

        this.cells.forEach(c => {
            if(!c.solid) return; // MÁGICA DO MAPA: Ignora o abismo!
            
            const dist = this.getDist(unit.x, unit.y, c.x, c.y);
            if (dist > 0 && dist <= unit.mp && !this.getUnitAt(c.x, c.y)) {
                c.dom.classList.add('walkable');
            }
        });
    },

    prepareSkill: function(skillId) {
        const unit = this.turnQueue[this.activeUnitIndex];
        if (!unit.isPlayer || this.turnFlags.attacked) return;

        const sk = window.SKILLS[skillId];
        if (unit.ap < sk.cost) return;

        this.state = 'TARGET';
        this.selectedSkill = sk;
        this.clearHighlights();
        
        const activeCell = this.cells.find(c => c.x === unit.x && c.y === unit.y);
        if(activeCell) activeCell.dom.classList.add('active-turn');

        this.cells.forEach(c => {
            if(!c.solid) return; // MÁGICA DO MAPA: Magias não podem mirar no abismo!
            
            const dist = this.getDist(unit.x, unit.y, c.x, c.y);
            if (dist > 0 && dist <= sk.rng) {
                c.dom.classList.add('targetable');
            }
        });
    },

    onCellClick: function(x, y) {
        const activeUnit = this.turnQueue[this.activeUnitIndex];
        if (!activeUnit || !activeUnit.isPlayer || this.state === 'ANIMATING') return;

        const clickedCell = this.cells.find(c => c.x === x && c.y === y);

        if (this.state === 'IDLE' && clickedCell.dom.classList.contains('walkable') && !this.turnFlags.moved) {
            const unitDOM = document.getElementById(`unit-${activeUnit.id}`);
            if(unitDOM) {
                unitDOM.classList.add('is-moving');
                setTimeout(() => unitDOM.classList.remove('is-moving'), 500);
            }

            const dist = this.getDist(activeUnit.x, activeUnit.y, x, y);
            activeUnit.x = x; activeUnit.y = y;
            activeUnit.mp -= dist;
            this.turnFlags.moved = true; 
            
            this.log(`Reposicionamento completo.`, 'player');
            this.renderUnits(); 
            this.renderHUD(activeUnit); 
            this.showWalkable(activeUnit);
            this.checkAutoSkip();
        }
        else if (this.state === 'TARGET' && clickedCell.dom.classList.contains('targetable')) {
            const targetUnit = this.getUnitAt(x, y);
            if (targetUnit) { 
                this.turnFlags.attacked = true; 
                this.executeSkill(activeUnit, targetUnit, this.selectedSkill); 
            } 
            else { 
                this.state = 'IDLE'; 
                this.showWalkable(activeUnit); 
            }
        }
    },

    executeSkill: function(caster, target, skill) {
        this.state = 'ANIMATING';
        this.clearHighlights();
        caster.ap -= skill.cost;
        
        this.log(`[${skill.name}] focado em ${target.name}!`, caster.isPlayer ? 'player' : 'enemy');

        const casterDOM = document.getElementById(`unit-${caster.id}`);
        const targetDOM = document.getElementById(`unit-${target.id}`);

        if (casterDOM) {
            const deltaX = (target.x - caster.x) * 50; 
            const deltaY = (target.y - caster.y) * 50;
            casterDOM.style.transform = `translate(${deltaX}%, ${deltaY}%)`;
            setTimeout(() => { casterDOM.style.transform = ''; }, 400); 
        }

        setTimeout(() => {
            let rawDmg = (caster.atk * skill.pwr) - target.def;
            if (rawDmg < 1) rawDmg = 1;
            const finalDmg = Math.floor(rawDmg);

            target.hp -= finalDmg;
            if (target.hp < 0) target.hp = 0;

            if (targetDOM) {
                targetDOM.classList.add('vfx-hit');
                setTimeout(() => targetDOM.classList.remove('vfx-hit'), 500);
            }

            this.showDamagePopup(target.x, target.y, finalDmg);
            this.log(`${target.name} sofreu ${finalDmg} DANO.`, 'system');
            this.renderUnits();
            
            if (target.hp <= 0) { this.log(`⚠️ ${target.name} neutralizado.`, 'system'); }

            setTimeout(() => {
                this.renderHUD(caster);
                if (caster.isPlayer) { 
                    this.state = 'IDLE'; 
                    this.showWalkable(caster); 
                    this.checkAutoSkip();
                } else { 
                    this.nextTurn(); 
                }
            }, 800);

        }, 300); 
    },

    showDamagePopup: function(x, y, dmg) {
        const cell = this.cells.find(c => c.x === x && c.y === y).dom;
        if(!cell) return;
        const popup = document.createElement('div');
        popup.className = 'dmg-popup';
        popup.innerText = `-${dmg}`;
        cell.appendChild(popup);
        setTimeout(() => popup.remove(), 1200);
    },

    endGame: function(isVictory) {
        this.state = 'END';
        this.clearAutoSkip();
        const screen = document.getElementById('end-screen');
        const title = document.getElementById('v-title');
        
        if (isVictory) {
            title.innerText = "VITÓRIA"; title.style.color = "#4ade80"; title.style.textShadow = "0 0 30px #10b981";
            this.log("Área estabilizada. Retornando...", "success");
        } else {
            title.innerText = "DERROTA"; title.style.color = "#ef4444"; title.style.textShadow = "0 0 30px #991b1b";
            this.log("Sinal perdido. Esquadrão aniquilado.", "error");
        }
        if(screen) { screen.style.opacity = '1'; screen.style.pointerEvents = 'auto'; }
    }
};

function bootCampanha() {
    if (!window.FUSIONS) window.FUSIONS = {}; 

    if (isGuestMode || offlineMode) {
        window.GAME_STATE = JSON.parse(localStorage.getItem('gatoPescadorSave_visitante')) || JSON.parse(localStorage.getItem('gatoPescadorSave')) || {};
        window.TacticsEngine.init();
        return;
    }

    let initFired = false;
    const fallbackTimer = setTimeout(() => {
        if(!initFired) {
            initFired = true;
            window.GAME_STATE = JSON.parse(localStorage.getItem('gatoPescadorSave_visitante')) || JSON.parse(localStorage.getItem('gatoPescadorSave')) || {};
            window.TacticsEngine.init();
        }
    }, 3000);

    onAuthStateChanged(auth, (user) => {
        if(initFired) return;
        initFired = true;
        clearTimeout(fallbackTimer);

        if (user) {
            get(child(ref(db), `users/${user.uid}`)).then((snapshot) => {
                if (snapshot.exists()) { window.GAME_STATE = snapshot.val(); } 
                else { window.GAME_STATE = JSON.parse(localStorage.getItem('gatoPescadorSave_' + user.uid)) || {}; }
                window.TacticsEngine.init();
            }).catch(() => {
                window.GAME_STATE = JSON.parse(localStorage.getItem('gatoPescadorSave_' + user.uid)) || {};
                window.TacticsEngine.init();
            });
        } else { 
            window.GAME_STATE = JSON.parse(localStorage.getItem('gatoPescadorSave_visitante')) || JSON.parse(localStorage.getItem('gatoPescadorSave')) || {}; 
            window.TacticsEngine.init(); 
        }
    });
}
bootCampanha();