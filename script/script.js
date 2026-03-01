// ==========================================================================
// 1. IMPORTAÇÕES E SETUP DO FIREBASE
// ==========================================================================
const urlParams = new URLSearchParams(window.location.search);
const isGuestMode = urlParams.get('guest') === 'true';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHz1W47O5kTiEPw7OjEjSXD0eH_ICtfDA",
    authDomain: "fishingmania-6dced.firebaseapp.com",
    databaseURL: "https://fishingmania-6dced-default-rtdb.firebaseio.com",
    projectId: "fishingmania-6dced",
    storageBucket: "fishingmania-6dced.firebasestorage.app",
    messagingSenderId: "761476396898",
    appId: "1:761476396898:web:2b81f955acbf622a4c9e3b",
    measurementId: "G-Q96SDKRJ1D"
};

let app, auth, db, currentUser = null;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
} catch (error) {
    console.error("Erro ao inicializar Firebase. Jogo rodando localmente.", error);
}

// ==========================================================================
// 2. CARREGAMENTO INTELIGENTE E INÍCIO DO JOGO
// ==========================================================================
async function carregarBancoDeDadosEIniciar() {
    if (window.CRAFTING_DB && window.KNIVES && window.RARITIES) {
        iniciarMotorDoJogo();
        return;
    }

    try {
        const response = await fetch('/json/database.json');
        if (!response.ok) throw new Error("Erro ao carregar o database.json");
        const DB = await response.json();

        window.MATERIALS = DB.MATERIALS;
        window.KNIVES = DB.KNIVES;
        window.BAITS = DB.BAITS;
        window.RARITIES = DB.RARITIES;
        window.ROD_TEMPLATES = DB.ROD_TEMPLATES;
        window.SINKERS = DB.SINKERS;
        window.SUCATAS = DB.SUCATAS;

        window.CRAFTING_DB = {
            materials: DB.MATERIALS,
            recipes: DB.CRAFTING_RECIPES
        };

        iniciarMotorDoJogo();
    } catch (erro) {
        console.error("Falha fatal ao carregar o banco de dados:", erro);
        alert("⚠️ Erro Crítico: O Banco de Dados do jogo não foi encontrado.");
    }
}

// ==========================================================================
// 3. MOTOR PRINCIPAL DO JOGO
// ==========================================================================
function iniciarMotorDoJogo() {

    window.GAME_STATE = {
        coins: 0,
        currentRodIndex: 0,
        isFishing: false,
        rods: [],
        ownedRods: [0],
        ownedSinkers: ['chumbo'],
        currentSinker: 'chumbo',
        ownedKnives: ['faca_cozinha'],
        currentKnife: 'faca_cozinha',
        baitInventory: {},
        currentBait: null,
        loadedImages: {},
        collection: {},
        collection67: {},
        scrapCollection: {}, // NOVA COLEÇÃO DO MUSEU DO LIXO
        isDay: true,
        materials: {},
        sushiUnlocked: false 
    };

    if (window.ROD_TEMPLATES) {
        window.GAME_STATE.rods = window.ROD_TEMPLATES.map((tpl, index) => ({ id: index, ...tpl }));
    }

    function preloadImages() {
        if (!window.RARITIES) return;
        Object.values(window.RARITIES).forEach(rarity => {
            rarity.variations.forEach(fish => {
                const img = new Image();
                window.GAME_STATE.loadedImages[fish.image] = img;
                img.onload = () => {
                    if (fish.image.toLowerCase().endsWith('.gif')) {
                        setTimeout(() => {
                            try {
                                if (!img.naturalWidth) return; 
                                const offCanvas = document.createElement('canvas');
                                offCanvas.width = img.naturalWidth;
                                offCanvas.height = img.naturalHeight;
                                const oCtx = offCanvas.getContext('2d');
                                oCtx.drawImage(img, 0, 0);
                                window.GAME_STATE.loadedImages[fish.image] = offCanvas;
                            } catch (e) {}
                        }, 300);
                    }
                };
                img.src = fish.image; 
            });
        });
        ['/img/asset/67comum.jpg', '/img/asset/67raro.jpg', '/img/asset/67muitoraro.webp'].forEach(src => {
            const img = new Image(); img.src = src;
        });
    }
    preloadImages();

    function safeGet(id) { return document.getElementById(id); }

    window.updateUI = function() {
        if(safeGet('cat-coins')) safeGet('cat-coins').innerText = window.GAME_STATE.coins.toLocaleString();
        
        const rod = window.GAME_STATE.rods.find(r => r.id === window.GAME_STATE.currentRodIndex) || window.GAME_STATE.rods[0];
        if(safeGet('current-rod-display')) safeGet('current-rod-display').innerText = `Vara: ${rod ? rod.name : 'Nenhuma'}`;
        
        const catVisual = safeGet('cat-fisherman');
        if (catVisual) {
            const rodVisual = catVisual.querySelector('.rod-visual');
            if (rodVisual) rodVisual.className = `rod-visual dropzone rod-tier-${rod ? rod.id : 0}`;
        }

        const sinker = (window.SINKERS || []).find(s => s.id === window.GAME_STATE.currentSinker) || (window.SINKERS ? window.SINKERS[0] : {name: 'Padrão'});
        if(safeGet('sinker-slot')) safeGet('sinker-slot').innerText = `🪨 ${sinker.name}`;
        if(safeGet('equipped-sinker-visual')) safeGet('equipped-sinker-visual').style.display = (sinker.id && sinker.id !== 'chumbo') ? 'block' : 'none';

        const baitDisplay = safeGet('bait-slot');
        const baitVis = safeGet('bait-visual');
        if (window.GAME_STATE.currentBait && window.BAITS) {
            const bait = window.BAITS.find(b => b.id === window.GAME_STATE.currentBait);
            if (bait && baitDisplay && baitVis) {
                baitDisplay.innerText = `${bait.icon} ${bait.name} (x${window.GAME_STATE.baitInventory[bait.id] || 0})`;
                baitVis.innerText = bait.icon;
            }
        } else {
            if(baitDisplay) baitDisplay.innerText = "🪝 Sem Isca";
            if(baitVis) baitVis.innerText = "";
        }

        const sushiBtn = safeGet('sushi-btn');
        if (sushiBtn) {
            if (window.GAME_STATE.sushiUnlocked) {
                sushiBtn.classList.remove('locked');
            } else {
                sushiBtn.classList.add('locked');
            }
        }
    };

    window.saveGame = function() {
        if (isGuestMode) {
            if(safeGet('save-status')) safeGet('save-status').innerText = "🚫 Convidado";
            return; 
        }
        const playerSave = {
            coins: window.GAME_STATE.coins,
            currentRodIndex: window.GAME_STATE.currentRodIndex,
            ownedRods: window.GAME_STATE.ownedRods,
            ownedSinkers: window.GAME_STATE.ownedSinkers,
            currentSinker: window.GAME_STATE.currentSinker,
            ownedKnives: window.GAME_STATE.ownedKnives,
            currentKnife: window.GAME_STATE.currentKnife,
            baitInventory: window.GAME_STATE.baitInventory,
            currentBait: window.GAME_STATE.currentBait,
            collection: window.GAME_STATE.collection,
            collection67: window.GAME_STATE.collection67,
            scrapCollection: window.GAME_STATE.scrapCollection, // Salvando Museu do Lixo
            materials: window.GAME_STATE.materials,
            sushiUnlocked: window.GAME_STATE.sushiUnlocked
        };
        if (currentUser && db) {
            localStorage.setItem('gatoPescadorSave_' + currentUser.uid, JSON.stringify(playerSave));
            set(ref(db, 'users/' + currentUser.uid), playerSave)
                .then(() => { if(safeGet('save-status')) safeGet('save-status').innerText = "☁️ Salvo"; })
                .catch((e) => console.error("Erro ao salvar:", e));
        } else {
            localStorage.setItem('gatoPescadorSave_visitante', JSON.stringify(playerSave));
            if(safeGet('save-status')) safeGet('save-status').innerText = "✅ Salvo Local";
        }
    };

    function loadGame() {
        if (isGuestMode) {
            if(safeGet('save-status')) safeGet('save-status').innerText = "🚫 Modo Convidado";
            window.updateUI();
            return; 
        }

        if (!currentUser || !db) {
            let localData = localStorage.getItem('gatoPescadorSave_visitante') || localStorage.getItem('gatoPescadorSave');
            if (localData) {
                try {
                    Object.assign(window.GAME_STATE, JSON.parse(localData));
                    if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
                    if (!window.GAME_STATE.scrapCollection) window.GAME_STATE.scrapCollection = {};
                    if (window.GAME_STATE.sushiUnlocked === undefined) window.GAME_STATE.sushiUnlocked = false;
                    if (!window.GAME_STATE.ownedRods || window.GAME_STATE.ownedRods.length === 0) window.GAME_STATE.ownedRods = [0];
                    if (!window.GAME_STATE.ownedKnives || window.GAME_STATE.ownedKnives.length === 0) {
                        window.GAME_STATE.ownedKnives = ['faca_cozinha']; window.GAME_STATE.currentKnife = 'faca_cozinha';
                    }
                    if(safeGet('save-status')) safeGet('save-status').innerText = "👤 Visitante";
                } catch (e) { console.error("Save corrompido"); }
            }
            window.updateUI();
            return;
        }

        if(safeGet('save-status')) safeGet('save-status').innerText = "🔄 Nuvem...";
        
        get(child(ref(db), `users/${currentUser.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                Object.assign(window.GAME_STATE, snapshot.val());
                window.GAME_STATE.isFishing = false;
                if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
                if (!window.GAME_STATE.scrapCollection) window.GAME_STATE.scrapCollection = {};
                if (window.GAME_STATE.sushiUnlocked === undefined) window.GAME_STATE.sushiUnlocked = false;
                if (!window.GAME_STATE.ownedRods || window.GAME_STATE.ownedRods.length === 0) window.GAME_STATE.ownedRods = [0];
                if (!window.GAME_STATE.ownedKnives || window.GAME_STATE.ownedKnives.length === 0) {
                    window.GAME_STATE.ownedKnives = ['faca_cozinha']; window.GAME_STATE.currentKnife = 'faca_cozinha';
                }
                localStorage.setItem('gatoPescadorSave_' + currentUser.uid, JSON.stringify(window.GAME_STATE));
                if(safeGet('save-status')) safeGet('save-status').innerText = "☁️ Conectado";
            } else {
                let localBackup = localStorage.getItem('gatoPescadorSave_' + currentUser.uid) || localStorage.getItem('gatoPescadorSave');
                if (localBackup) { try { Object.assign(window.GAME_STATE, JSON.parse(localBackup)); } catch(e){} }
                window.saveGame();
            }
            if (window.ROD_TEMPLATES) window.GAME_STATE.rods = window.ROD_TEMPLATES.map((tpl, index) => ({ id: index, ...tpl }));
            window.updateUI();
        }).catch((e) => {
            console.error(e);
            if(safeGet('save-status')) safeGet('save-status').innerText = "❌ Offline";
            window.updateUI();
        });
    }

    if(auth) { onAuthStateChanged(auth, (user) => { currentUser = user; if(!isGuestMode) loadGame(); }); }
    setInterval(window.saveGame, 30000);

    // ==========================================================================
    // 5. NOVA FÓRMULA DE PESCA (SORTE ADITIVA + SUCATAS + BOOSTS NAS ISCAS)
    // ==========================================================================
    window.calculateCatch = function(rod, sinker) {
        const bait = window.GAME_STATE.currentBait ? window.BAITS.find(b => b.id === window.GAME_STATE.currentBait) : null;
        let luckFactor = rod ? rod.luck : 1;
        let valueMult = 1;
        let chance67 = 0.0005;

        // Adiciona os atributos dos Pesos
        if (sinker.stats && sinker.stats.luck) luckFactor += sinker.stats.luck;
        if (sinker.stats && sinker.stats.value) valueMult *= sinker.stats.value;
        if (sinker.stats && sinker.stats.chance67) chance67 += sinker.stats.chance67;
        
        if (sinker.synergy && rod && sinker.synergy.type === rod.type) {
            if (sinker.synergy.luck) luckFactor += sinker.synergy.luck;
            if (sinker.synergy.value) valueMult *= sinker.synergy.value;
            if (sinker.synergy.chance67) chance67 += sinker.synergy.chance67;
        }

        // Adiciona os atributos das Iscas + OS BOOSTS PERMANENTES DAQUELA ISCA ESPECÍFICA!
        if (bait) {
            let luckBoostLvl = window.GAME_STATE.baitBoosts && window.GAME_STATE.baitBoosts[bait.id] ? window.GAME_STATE.baitBoosts[bait.id].luck || 0 : 0;
            let valBoostLvl = window.GAME_STATE.baitBoosts && window.GAME_STATE.baitBoosts[bait.id] ? window.GAME_STATE.baitBoosts[bait.id].value || 0 : 0;

            if (bait.stats.luck) luckFactor += bait.stats.luck + (luckBoostLvl * 50); // Cada Boost dá +50
            if (bait.stats.value) valueMult *= bait.stats.value + (valBoostLvl * 0.2); // Cada Boost soma +0.2 ao multiplicador
            if (bait.stats.chance67) chance67 += bait.stats.chance67;
        }

        if (window.eventLuckMult) luckFactor += (window.eventLuckMult * 100); 

        const rand = Math.random();

        // 1. Chance de pescar Sucata (Lixo)
        let sucataChance = 0.15 - (luckFactor / 100000);
        if (sucataChance < 0.05) sucataChance = 0.05; // Mínimo de 5% de chance de vir sucata

        if (rand < sucataChance && window.SUCATAS) {
            const randomSucata = window.SUCATAS[Math.floor(Math.random() * window.SUCATAS.length)];
            return { type: 'sucata', data: randomSucata };
        }

        // 2. Rolagem de Peixes Raros (Sorte Aditiva)
        let fishRoll = Math.random() - (luckFactor / 50000); 
        
        let caughtRarity = window.RARITIES.COMUM;
        if (fishRoll < window.RARITIES.AURUDO.prob) caughtRarity = window.RARITIES.AURUDO;
        else if (fishRoll < window.RARITIES.DIVINO.prob) caughtRarity = window.RARITIES.DIVINO;
        else if (fishRoll < window.RARITIES.SECRETO.prob) caughtRarity = window.RARITIES.SECRETO;
        else if (fishRoll < window.RARITIES.MITICO.prob) caughtRarity = window.RARITIES.MITICO;
        else if (fishRoll < window.RARITIES.LENDARIO.prob) caughtRarity = window.RARITIES.LENDARIO;
        else if (fishRoll < window.RARITIES.EPICO.prob) caughtRarity = window.RARITIES.EPICO;
        else if (fishRoll < window.RARITIES.RARO.prob) caughtRarity = window.RARITIES.RARO;

        const validVariations = caughtRarity.variations.filter(v => {
            const timeMatch = v.time === 'all' || (window.GAME_STATE.isDay && v.time === 'day') || (!window.GAME_STATE.isDay && v.time === 'night');
            let eventMatch = true;
            if (v.events && v.events.length > 0) {
                if (v.events.includes('all')) {
                    eventMatch = window.currentEventID !== null && window.currentEventID !== undefined;
                } else {
                    eventMatch = window.currentEventID && v.events.includes(window.currentEventID);
                }
            }
            return timeMatch && eventMatch;
        });

        let specificFish = validVariations.length > 0 ? validVariations[Math.floor(Math.random() * validVariations.length)] : window.RARITIES.COMUM.variations[0];
        if (validVariations.length === 0) caughtRarity = window.RARITIES.COMUM;

        const sizeBase = 10 + (Object.keys(window.RARITIES).indexOf(caughtRarity.id.toUpperCase()) * 15);
        let finalSize = sizeBase + Math.floor(Math.random() * 60);
        if (Math.random() < chance67) finalSize = 67;

        let finalValue = Math.floor(finalSize * caughtRarity.mult * valueMult);
        if (window.eventValueMult) finalValue = Math.floor(finalValue * window.eventValueMult);

        return { type: 'fish', rarity: caughtRarity, variation: specificFish, size: finalSize, value: finalValue };
    }

    window.castLine = function() {
        if (window.GAME_STATE.isFishing) return;

        if (window.GAME_STATE.currentBait) {
            if (window.GAME_STATE.baitInventory[window.GAME_STATE.currentBait] > 0) {
                window.GAME_STATE.baitInventory[window.GAME_STATE.currentBait]--;
                if (window.GAME_STATE.baitInventory[window.GAME_STATE.currentBait] <= 0) window.GAME_STATE.currentBait = null;
            } else { window.GAME_STATE.currentBait = null; }
        }
        window.updateUI();
        window.GAME_STATE.isFishing = true;
        
        const rod = window.GAME_STATE.rods.find(r => r.id === window.GAME_STATE.currentRodIndex) || window.GAME_STATE.rods[0];
        const sinker = window.SINKERS.find(s => s.id === window.GAME_STATE.currentSinker) || window.SINKERS[0];
        
        const btn = safeGet('cast-btn');
        if(btn){ btn.disabled = true; btn.innerText = "Descendo..."; }
        
        const catIdle = safeGet('cat-fisherman');
        if(catIdle) catIdle.classList.replace('cat-idle', 'cat-fishing');
        
        const fishImg = safeGet('hooked-fish-img');
        if(fishImg) fishImg.style.display = 'none';

        let targetDepth = Math.max(150, Math.floor((window.innerHeight - 150) * (0.3 + ((rod.id + 1) / 20 * 0.7))));
        let speedMult = rod.speed;
        if (sinker.stats && sinker.stats.speed) speedMult *= sinker.stats.speed;
        if (sinker.synergy && rod && sinker.synergy.type === rod.type && sinker.synergy.speed) speedMult *= sinker.synergy.speed;

        const travelTime = (Math.max(400, 2000 - (rod.id * 80)) / (speedMult || 1)) * (window.eventCastTimeMult || 1);
        const line = safeGet('line-container');
        if(line) { line.style.transition = `height ${travelTime}ms ease-in`; line.style.height = `${targetDepth}px`; }

        setTimeout(() => {
            if(btn) btn.innerText = "Fisgou!";
            
            const catchResult = window.calculateCatch(rod, sinker);
            
            if(fishImg){ 
                fishImg.src = catchResult.type === 'sucata' ? catchResult.data.image : catchResult.variation.image; 
                fishImg.style.display = 'block'; 
            }
            
            const reelTime = travelTime * 0.8;
            if(line) { line.style.transition = `height ${reelTime}ms ease-out`; line.style.height = `0px`; }

            setTimeout(() => {
                const div = document.createElement('div');
                div.className = `catch-popup`;

                // SISTEMA DE SUCATA (Sem cobrar moedas, vai pro Museu)
                if (catchResult.type === 'sucata') {
                    const scrap = catchResult.data;
                    
                    // Adiciona na coleção
                    window.GAME_STATE.scrapCollection[scrap.id] = (window.GAME_STATE.scrapCollection[scrap.id] || 0) + 1;
                    
                    // Ganha o material
                    window.GAME_STATE.materials[scrap.matReward] = (window.GAME_STATE.materials[scrap.matReward] || 0) + scrap.matQty;
                    
                    div.classList.add('border-comum'); 
                    div.innerHTML = `
                        <div class="fish-visual-container">
                            <img src="${scrap.image}" class="popup-fish-img" style="filter: grayscale(0.5) sepia(0.5) contrast(0.8);" onerror="this.src='https://placehold.co/80x80?text=🗑️'">
                        </div>
                        <div class="popup-name" style="color: #7f8c8d;">${scrap.name}</div>
                        <div class="popup-rarity-text" style="color: #e74c3c;">LIXO FISGADO!</div>
                        <div class="popup-info-line" style="color:#2ecc71; font-weight:bold; margin-top:5px;">♻️ Lixo Reciclado!</div>
                        <div class="popup-value" style="color:#2ecc71; font-size:0.85rem;">📦 +${scrap.matQty} Material de Isca</div>
                    `;
                } 
                else {
                    const fish = catchResult;
                    window.GAME_STATE.coins += fish.value;
                    let sealImage = null;

                    if (fish.size === 67) {
                        window.GAME_STATE.collection67[fish.variation.name] = (window.GAME_STATE.collection67[fish.variation.name] || 0) + 1;
                        sealImage = (fish.rarity.id === 'comum' || fish.rarity.id === 'raro') ? '/img/asset/67comum.jpg' : (fish.rarity.id === 'epico' || fish.rarity.id === 'lendario') ? '/img/asset/67raro.jpg' : '/img/asset/67muitoraro.webp';
                    } else {
                        window.GAME_STATE.collection[fish.variation.name] = (window.GAME_STATE.collection[fish.variation.name] || 0) + 1;
                    }

                    div.classList.add(fish.rarity.border);
                    let timeIcon = fish.variation.time === 'day' ? '☀️ Dia' : (fish.variation.time === 'night' ? '🌙 Noite' : '🌗 Ambos');

                    div.innerHTML = `
                        <div class="fish-visual-container">
                            <img src="${fish.variation.image}" class="${sealImage ? 'popup-fish-img fish-flash' : 'popup-fish-img'}">
                            ${sealImage ? `<img src="${sealImage}" class="popup-seal">` : ''}
                        </div>
                        <div class="popup-name">${fish.variation.name}</div>
                        <div class="popup-rarity-text ${fish.rarity.style}">${fish.rarity.name}</div>
                        <div class="popup-info-line">📏 ${fish.size}cm</div>
                        <div class="popup-info-line" style="font-size: 0.75rem;">🕒 ${timeIcon}</div>
                        <div class="popup-value">+${fish.value} 🪙</div>
                    `;
                }

                window.updateUI(); 
                window.saveGame();
                document.body.appendChild(div);
                
                setTimeout(() => { div.style.transition = "opacity 0.5s"; div.style.opacity = "0"; setTimeout(() => div.remove(), 500); }, 2500);

                if(fishImg) fishImg.style.display = 'none';
                window.GAME_STATE.isFishing = false;
                if(btn) { btn.disabled = false; btn.innerText = "Pescar (Espaço)"; }
                if(catIdle) catIdle.classList.replace('cat-fishing', 'cat-idle');

            }, reelTime);
        }, travelTime + 1000);
    }

    // ==========================================================================
    // 6. EVENTOS DE BOTÕES E ATALHOS GERAIS
    // ==========================================================================
    document.addEventListener('keydown', (e) => { 
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.code === 'Space') { 
            e.preventDefault(); 
            if (e.repeat) return;
            if (!window.GAME_STATE.isFishing) window.castLine(); 
        } 
    });

    safeGet('cast-btn')?.addEventListener('click', () => window.castLine());
    
    safeGet('exit-game-btn')?.addEventListener('click', () => {
        const targetUrl = '../index.html'; 
        if (isGuestMode) { window.location.href = targetUrl; } else { 
            const btn = safeGet('exit-game-btn');
            if(btn) { btn.innerText = "Salvando..."; btn.disabled = true; }
            window.saveGame(); setTimeout(() => window.location.href = targetUrl, 800); 
        }
    });

    safeGet('open-collection-btn')?.addEventListener('click', () => { safeGet('collection-modal')?.classList.remove('hidden'); window.renderCollection(); });
    safeGet('close-collection-btn')?.addEventListener('click', () => safeGet('collection-modal')?.classList.add('hidden'));
    safeGet('open-67-btn')?.addEventListener('click', () => { safeGet('collection-67-modal')?.classList.remove('hidden'); window.renderCollection67(); });
    safeGet('close-67-btn')?.addEventListener('click', () => safeGet('collection-67-modal')?.classList.add('hidden'));

    safeGet('sushi-btn')?.addEventListener('click', () => {
        if (!window.GAME_STATE.sushiUnlocked) {
            if(window.customAlert) window.customAlert("🔒 Restaurante Fechado!\n\nVocê precisa irritar o Peixe Tutor (clicando nele várias vezes) para ele te dar a chave da Bancada de Sushi!", false);
            return;
        }
        if (window.SushiMode) window.SushiMode.open();
    });

    // ==========================================================================
    // 7. SISTEMA DE APRECIAÇÃO DE PEIXES E ENCICLOPÉDIA
    // ==========================================================================
    window.showFishDetail = function(fish, rarity, count, is67) {
        const existing = document.getElementById('fish-detail-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'fish-detail-overlay';
        overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 999999; opacity: 0; transition: opacity 0.3s ease; backdrop-filter: blur(5px);`;

        let seal = '';
        if (is67) {
            const s = (rarity.id==='comum'||rarity.id==='raro')?'/img/asset/67comum.jpg':(rarity.id==='epico'||rarity.id==='lendario')?'/img/asset/67raro.jpg':'/img/asset/67muitoraro.webp'; 
            seal = `<img src="${s}" style="position:absolute; bottom:-10px; right:-10px; width:90px; height:90px; object-fit:contain; transform:rotate(15deg); filter:drop-shadow(2px 4px 6px rgba(0,0,0,0.6));">`;
        }

        const colors = { 'comum': '#bdc3c7', 'raro': '#2ecc71', 'epico': '#9b59b6', 'lendario': '#f39c12', 'mitico': '#e74c3c', 'secreto': '#2c3e50', 'divino': '#f1c40f', 'aurudo': '#ffd700' };
        const borderColor = colors[rarity.id] || '#ffffff';

        let eventsText = "Qualquer Clima";
        if (fish.events && fish.events.length > 0) {
            if (fish.events.includes("all")) {
                eventsText = "Durante Eventos";
            } else {
                eventsText = fish.events.map(e => e.toUpperCase()).join(", ");
            }
        }

        const box = document.createElement('div');
        box.style.cssText = `position: relative; background: radial-gradient(circle at center, #2c3e50 0%, #1a252f 100%); padding: 40px; border-radius: 20px; text-align: center; max-width: 600px; width: 90%; box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${borderColor}66; transform: scale(0.8); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 4px solid ${borderColor};`;
        box.innerHTML = `
            <button id="close-detail-btn" style="position:absolute; top:15px; right:20px; background:none; border:none; color:white; font-size:2.5rem; cursor:pointer; opacity:0.7; transition:0.2s;">&times;</button>
            <div style="position:relative; display:inline-block; margin-bottom:20px;">
                <img src="${fish.image}" style="max-width:350px; max-height:350px; object-fit:contain; filter:drop-shadow(0 10px 15px rgba(0,0,0,0.6)); animation: floatBigFish 4s ease-in-out infinite;">
                ${seal}
            </div>
            <h2 style="color:white; font-family:'Fredoka', sans-serif; font-size:2.5rem; margin:0; text-shadow:0 2px 4px rgba(0,0,0,0.8); line-height: 1.2;">${fish.name}</h2>
            <div style="font-size:1.3rem; font-weight:bold; margin-bottom:20px; margin-top:5px; text-transform:uppercase; letter-spacing: 2px;" class="${rarity.style}">${rarity.name}</div>
            
            <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:15px; color:#ccc; font-size:0.9rem; font-family:'Poppins', sans-serif;">
                <div style="background:rgba(0,0,0,0.4); padding:10px 15px; border-radius:12px; border: 1px solid rgba(255,255,255,0.1);">📊 Pescados: <b style="color:white;">${count}</b></div>
                <div style="background:rgba(0,0,0,0.4); padding:10px 15px; border-radius:12px; border: 1px solid rgba(255,255,255,0.1);">🕒 Hábito: <b style="color:white;">${fish.time === 'day' ? '☀️ Dia' : (fish.time === 'night' ? '🌙 Noite' : '🌗 Ambos')}</b></div>
                <div style="background:rgba(0,0,0,0.4); padding:10px 15px; border-radius:12px; border: 1px solid rgba(255,255,255,0.1);">🌪️ Aparição: <b style="color:#e67e22;">${eventsText}</b></div>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        if (!document.getElementById('float-big-fish-style')) {
            const style = document.createElement('style');
            style.id = 'float-big-fish-style';
            style.innerHTML = `@keyframes floatBigFish { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }`;
            document.head.appendChild(style);
        }
        requestAnimationFrame(() => { overlay.style.opacity = '1'; box.style.transform = 'scale(1)'; });

        const closeDetail = () => { overlay.style.opacity = '0'; box.style.transform = 'scale(0.8)'; setTimeout(() => overlay.remove(), 300); };
        document.getElementById('close-detail-btn').addEventListener('click', closeDetail);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDetail(); });
    };

    window.renderCollection = function() {
        if (!window.RARITIES) return;
        const grid = safeGet('collection-grid'); if(!grid) return; grid.innerHTML = ''; let t=0, u=0;
        Object.values(window.RARITIES).forEach(r => { r.variations.forEach(f => { t++; const c = window.GAME_STATE.collection[f.name] || 0; if(c>0) u++; createCard(grid, f, r, c, false); }); });
        if(safeGet('collection-progress')) safeGet('collection-progress').innerText = `(${u}/${t})`;
    };

    window.renderCollection67 = function() {
        if (!window.RARITIES) return;
        const grid = safeGet('collection-67-grid'); if(!grid) return; grid.innerHTML = ''; let t=0, u=0;
        Object.values(window.RARITIES).forEach(r => { r.variations.forEach(f => { t++; const c = window.GAME_STATE.collection67[f.name] || 0; if(c>0) u++; createCard(grid, f, r, c, true); }); });
        if(safeGet('collection-67-progress')) safeGet('collection-67-progress').innerText = `(${u}/${t})`;
    };

    function createCard(container, fish, rarity, count, is67) {
        const isUnlocked = count > 0; 
        const div = document.createElement('div'); div.className = `collection-card ${isUnlocked ? 'unlocked' : 'locked'} ${is67 ? 'special-67' : ''}`;
        let seal = ''; 
        if(is67 && isUnlocked) { 
            const s = (rarity.id==='comum'||rarity.id==='raro')?'/img/asset/67comum.jpg':(rarity.id==='epico'||rarity.id==='lendario')?'/img/asset/67raro.jpg':'/img/asset/67muitoraro.webp'; 
            seal = `<img src="${s}" class="collection-seal">`; 
        }
        div.innerHTML = `
            ${isUnlocked ? `<div class="count-badge">x${count}</div>` : ''}
            <div style="position: absolute; top: 2px; left: 5px; font-size: 0.7rem;">${fish.time === 'day' ? '☀️' : (fish.time === 'night' ? '🌙' : '')}</div>
            <img src="${fish.image}" class="collection-img">
            ${seal}
            <div style="font-size: 0.75rem; font-weight: bold; color: ${isUnlocked ? '#333' : '#999'}">${fish.name}</div>
            <div style="font-size: 0.65rem; color: ${isUnlocked ? 'green' : '#ccc'}">${rarity.name}</div>
        `;
        if (isUnlocked) { div.style.cursor = 'pointer'; div.addEventListener('click', () => window.showFishDetail(fish, rarity, count, is67)); div.onmouseover = () => { div.style.transform = 'scale(1.05)'; }; div.onmouseout = () => { div.style.transform = 'scale(1)'; }; }
        container.appendChild(div);
    }

    // ==========================================================================
    // 8. ANIMAÇÃO DE FUNDO DO OCEANO
    // ==========================================================================
    const canvas = safeGet('bg-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const fishes = [];

    function resizeCanvas() { if(canvas){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }
    window.addEventListener('resize', resizeCanvas); resizeCanvas();

    class SwimmingFish {
        constructor() { this.reset(true); }
        reset(initial = false) {
            const rands = Math.random(); let r = window.RARITIES ? window.RARITIES.COMUM : null;
            if (!r) return;
            if(rands < 0.005) r = window.RARITIES.AURUDO; else if(rands < 0.005) r = window.RARITIES.DIVINO; else if(rands < 0.01) r = window.RARITIES.SECRETO; else if(rands < 0.03) r = window.RARITIES.MITICO; else if(rands < 0.08) r = window.RARITIES.LENDARIO; else if(rands < 0.20) r = window.RARITIES.EPICO; else if(rands < 0.40) r = window.RARITIES.RARO;
            const valid = r.variations.filter(v => v.time === 'all' || (window.GAME_STATE.isDay && v.time === 'day') || (!window.GAME_STATE.isDay && v.time === 'night'));
            this.specificImage = (valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : r.variations[0]).image;
            this.depth = Math.random(); this.direction = Math.random() > 0.5 ? 1 : -1;
            this.y = canvas ? Math.random() * (canvas.height - 200) + 200 : 300;
            this.width = (40 + Math.min(60, r.mult * 0.8)) * (0.4 + (this.depth * 0.6));
            this.x = initial && canvas ? Math.random() * canvas.width : (this.direction === 1 ? -300 : (canvas ? canvas.width + 300 : 2000));
            this.speed = (0.5 + (this.depth * 1.5)) * this.direction; this.opacity = 0.1 + (this.depth * 0.4);
        }
        update() { 
            this.x += (this.speed * (window.eventBgSpeedMult || 1)); 
            if (canvas && ((this.direction === 1 && this.x > canvas.width + 300) || (this.direction === -1 && this.x < -300))) this.reset(); 
        }
        draw() {
            if(!ctx) return; 
            const renderable = window.GAME_STATE.loadedImages[this.specificImage];
            if (!renderable) return;
            const w = renderable.naturalWidth || renderable.width; const h_orig = renderable.naturalHeight || renderable.height;
            if (!w || w === 0) return;
            const h = this.width * (h_orig / w);
            ctx.save(); ctx.globalAlpha = this.opacity; ctx.translate(this.x, this.y);
            if (this.direction === -1) ctx.scale(-1, 1);
            ctx.drawImage(renderable, -this.width / 2, -h / 2, this.width, h); ctx.restore();
        }
    }

    for (let i = 0; i < 25; i++) { fishes.push(new SwimmingFish()); }

    function animateBg() { 
        if(ctx && canvas) { ctx.clearRect(0, 0, canvas.width, canvas.height); fishes.forEach(f => { f.update(); f.draw(); }); } 
        requestAnimationFrame(animateBg); 
    }
    setInterval(() => { 
        window.GAME_STATE.isDay = !window.GAME_STATE.isDay; 
        const gc = safeGet('game-container'); if(gc) gc.className = window.GAME_STATE.isDay ? 'day-mode' : 'night-mode'; 
        const ti = safeGet('time-indicator'); if(ti) ti.innerText = window.GAME_STATE.isDay ? "☀️ Dia" : "🌙 Noite"; 
    }, 45000);
    setTimeout(() => { window.updateUI(); if(canvas) animateBg(); }, 500);

    // ==========================================================================
    // 9. MODO SUSHI V2 (EFEITOS VISUAIS E PEIXE PODRE)
    // ==========================================================================
    window.SushiMode = {
        pendingSushi: null, 

        init: function() {
            if (document.getElementById('sushi-modal')) return;

            const style = document.createElement('style');
            style.innerHTML = `
                #sushi-btn.locked {
                    background: #7f8c8d !important;
                    color: #bdc3c7 !important;
                    border-color: #95a5a6 !important;
                    cursor: not-allowed !important;
                    transform: none !important;
                    box-shadow: none !important;
                    filter: grayscale(100%);
                }
                #sushi-modal .modal-content { background: #fffaf0; border: 4px solid #c0392b; background-image: radial-gradient(#fcdcd3 1px, transparent 1px); background-size: 20px 20px; }
                #sushi-modal .modal-header { background: linear-gradient(to right, #c0392b, #e74c3c); border-bottom: 3px solid #922b21; }
                .sushi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 15px; padding: 20px; max-height: 60vh; overflow-y: auto; }
                .sushi-card { background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 15px 10px; text-align: center; transition: 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.05); position: relative; }
                .sushi-card:hover { border-color: #c0392b; transform: translateY(-3px); box-shadow: 0 8px 15px rgba(192,57,43,0.2); }
                .sushi-btn-cut { background: #c0392b; color: white; border: none; padding: 8px 15px; border-radius: 20px; font-weight: bold; cursor: pointer; margin-top: 10px; font-family: 'Fredoka', sans-serif; transition: 0.2s; width: 100%; box-shadow: 0 4px 0 #922b21; text-transform: uppercase; letter-spacing: 1px;}
                .sushi-btn-cut:hover { background: #e74c3c; transform: translateY(2px); box-shadow: 0 2px 0 #922b21; }
                .sushi-btn-cut:active { transform: translateY(4px); box-shadow: none; }
                .sushi-reward-preview { font-size: 0.75rem; color: #7f8c8d; margin-top: 8px; font-weight: bold; line-height: 1.3;}
            `;
            document.head.appendChild(style);

            const modal = document.createElement('div');
            modal.id = 'sushi-modal';
            modal.className = 'modal hidden';
            modal.style.zIndex = '99999'; 
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 850px; width: 95%;">
                    <div class="modal-header">
                        <h2 style="margin: 0; color: white; font-family: 'Fredoka', sans-serif;">🍣 Restaurante de Sushi</h2>
                        <button onclick="document.getElementById('sushi-modal').classList.add('hidden')" class="close-btn">&times;</button>
                    </div>
                    <div style="padding: 15px; text-align: center; background: white; border-bottom: 2px dashed #ccc;">
                        <h3 id="sushi-knife-title" style="margin:0; color:#c0392b; font-family:'Fredoka', sans-serif;">Faca Equipada: Nenhuma</h3>
                        <p style="margin:5px 0 0 0; color:#555; font-size:0.9rem;">O Chef transforma peixes em uma injeção gigante de moedas e materiais. Melhore sua faca na Forja para ganhar multiplicadores absurdos!</p>
                    </div>
                    <div id="sushi-grid" class="sushi-grid"></div>
                </div>
            `;
            document.body.appendChild(modal);

            const miniModal = document.createElement('div');
            miniModal.id = 'sushi-minigame-modal';
            miniModal.className = 'modal hidden';
            miniModal.style.zIndex = '999999'; 
            miniModal.innerHTML = `
                <div class="modal-content" style="max-width: 500px; background: #2c3e50; border: 4px solid #e74c3c;">
                    <button onclick="document.getElementById('sushi-minigame-modal').classList.add('hidden'); document.getElementById('sushi-modal').classList.remove('hidden'); window.SushiMode.pendingSushi = null;" class="close-btn" style="position:absolute; top:10px; right:15px;">&times;</button>
                    <h2 style="color: white; font-family: 'Fredoka'; text-align: center; margin-bottom: 5px;">🔪 Filete o Peixe!</h2>
                    <p style="color: #ccc; text-align: center; margin-bottom: 20px; font-size: 0.9rem;">Passe a faca 4 vezes sobre a imagem.</p>
                    
                    <div id="sushi-cut-area" style="position: relative; width: 300px; height: 300px; margin: 0 auto; border: 2px dashed #7f8c8d; border-radius: 10px; background: rgba(255,255,255,0.05); cursor: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><text y=%2224%22 font-size=%2224%22>🔪</text></svg>') 0 24, crosshair;">
                        <img id="sushi-cut-img" src="" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5)); transition: transform 0.1s;">
                        <canvas id="sushi-cut-canvas" width="300" height="300" style="position: absolute; top:0; left:0; z-index: 10;"></canvas>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <span id="sushi-cut-counter" style="color: #e74c3c; font-size: 1.5rem; font-weight: bold; font-family: 'Fredoka';">Cortes: 0 / 4</span>
                    </div>
                </div>
            `;
            document.body.appendChild(miniModal);

            this.setupCanvas();
        },

        open: function() {
            this.renderGrid();
            const sm = document.getElementById('sushi-modal');
            if(sm) sm.classList.remove('hidden');
        },

        getLootTable: function(rarityId) {
            const tables = {
                'comum': { coins: 50, mats: ['madeira', 'fio'], matQty: 1 },
                'raro': { coins: 250, mats: ['plastico', 'kevlar'], matQty: 1 },
                'epico': { coins: 1000, mats: ['fibra', 'ouro'], matQty: 2 },
                'lendario': { coins: 4000, mats: ['metal', 'titânio'], matQty: 2 },
                'mitico': { coins: 15000, mats: ['perola', 'carbono'], matQty: 3 },
                'secreto': { coins: 60000, mats: ['meteorito', 'cristal'], matQty: 3 },
                'divino': { coins: 300000, mats: ['materia_escura', 'essencia'], matQty: 4 },
                'aurudo': { coins: 10000000, mats: ['poeira_cosmica'], matQty: 5 }
            };
            return tables[rarityId] || tables['comum'];
        },

        renderGrid: function() {
            const grid = document.getElementById('sushi-grid');
            if(!grid || !window.KNIVES) return;
            grid.innerHTML = '';
            let hasFish = false;

            const currentKnifeId = window.GAME_STATE.currentKnife || 'faca_cozinha';
            const knifeData = window.KNIVES.find(k => k.id === currentKnifeId) || window.KNIVES[0];
            const multiplier = knifeData.mult;
            const dropsMats = knifeData.dropsMats;

            document.getElementById('sushi-knife-title').innerText = `🔪 Faca Equipada: ${knifeData.name} (Saque x${multiplier})`;

            const addFishCards = (collection, is67) => {
                Object.keys(collection).forEach(fishName => {
                    const count = collection[fishName];
                    if (count > 0) {
                        hasFish = true;
                        
                        let foundRarity = null;
                        let foundFish = null;
                        Object.values(window.RARITIES).forEach(r => {
                            const f = r.variations.find(v => v.name === fishName);
                            if (f) { foundRarity = r; foundFish = f; }
                        });
                        if (!foundFish) return;

                        const lootPreview = this.getLootTable(foundRarity.id);
                        let expectedCoins = Math.floor(lootPreview.coins * multiplier);
                        let expectedMats = Math.floor(lootPreview.matQty * multiplier);
                        
                        if (is67) {
                            expectedCoins *= 3;
                            expectedMats *= 2;
                        }
                        
                        let matPreviewText = dropsMats 
                            ? `<br>📦 +${expectedMats} Mat. Tier ${foundRarity.name}` 
                            : `<br><span style="color:#e74c3c; font-size:0.65rem;">(Faca não extrai materiais)</span>`;

                        const div = document.createElement('div');
                        div.className = 'sushi-card';
                        
                        const safeFishName = fishName.replace(/'/g, "\\'").replace(/"/g, '&quot;');

                        div.innerHTML = `
                            <div style="position: absolute; top: -5px; right: -5px; background: #333; color: white; border-radius: 12px; padding: 2px 8px; font-size: 0.8rem; font-weight: bold; border: 2px solid white; z-index: 5;">Estoque: ${count}</div>
                            <img src="${foundFish.image}" style="width: 70px; height: 70px; object-fit: contain; margin-bottom: 5px; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.2));">
                            <div style="font-size: 0.9rem; font-weight: bold; color: #333; line-height: 1.1; height: 32px; overflow: hidden; display: flex; align-items: center; justify-content: center;">${fishName} ${is67 ? '🏆' : ''}</div>
                            <div class="${foundRarity.style}" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 800; margin-bottom: 5px;">${foundRarity.name}</div>
                            
                            <div class="sushi-reward-preview">
                                <span style="color:#e67e22;">💰 +${expectedCoins.toLocaleString()}</span>${matPreviewText}
                            </div>

                            <button class="sushi-btn-cut" onclick="window.SushiMode.startMinigame('${safeFishName}', ${is67}, '${foundRarity.id}', '${foundFish.image}')">🔪 FILETAR</button>
                        `;
                        grid.appendChild(div);
                    }
                });
            };

            if (window.GAME_STATE && window.RARITIES) { 
                addFishCards(window.GAME_STATE.collection, false); 
                addFishCards(window.GAME_STATE.collection67, true); 
            }
            if (!hasFish) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 50px; font-size: 1.3rem; font-family: Fredoka, sans-serif;">Você não tem nenhum peixe na sua coleção. Volte a pescar!</div>';
        },

        setupCanvas: function() {
            const canvas = document.getElementById('sushi-cut-canvas');
            const ctx = canvas.getContext('2d');
            let isDragging = false;
            let startX = 0, startY = 0;
            let cuts = 0;

            const startCut = (e) => {
                isDragging = true;
                const rect = canvas.getBoundingClientRect();
                startX = (e.clientX || e.touches[0].clientX) - rect.left;
                startY = (e.clientY || e.touches[0].clientY) - rect.top;
            };

            const endCut = (e) => {
                if (!isDragging) return;
                isDragging = false;
                const rect = canvas.getBoundingClientRect();
                const endX = (e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : 0)) - rect.left;
                const endY = (e.clientY || (e.changedTouches ? e.changedTouches[0].clientY : 0)) - rect.top;

                const dist = Math.hypot(endX - startX, endY - startY);
                if (dist > 40) {
                    ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY);
                    ctx.strokeStyle = "rgba(231, 76, 60, 0.9)"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY);
                    ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();

                    for(let i=0; i<3; i++){
                        ctx.beginPath();
                        ctx.arc(endX + (Math.random()*40-20), endY + (Math.random()*40-20), Math.random()*8+2, 0, Math.PI*2);
                        ctx.fillStyle = "rgba(231, 76, 60, 0.6)";
                        ctx.fill();
                    }

                    cuts++;
                    document.getElementById('sushi-cut-counter').innerText = `Cortes: ${cuts} / 4`;
                    document.getElementById('sushi-cut-img').style.transform = `scale(${1 + (cuts * 0.05)})`;

                    if (cuts >= 4) {
                        setTimeout(() => { window.SushiMode.finishMinigame(); }, 300);
                    }
                }
            };

            canvas.addEventListener('mousedown', startCut);
            canvas.addEventListener('mouseup', endCut);
            canvas.addEventListener('mouseleave', () => { isDragging = false; });
            canvas.addEventListener('touchstart', startCut, {passive: true});
            canvas.addEventListener('touchend', endCut, {passive: true});

            this.resetCanvas = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cuts = 0;
                document.getElementById('sushi-cut-counter').innerText = `Cortes: 0 / 4`;
                document.getElementById('sushi-cut-img').style.transform = `scale(1)`;
            };
        },

        startMinigame: function(fishName, is67, rarityId, imageSrc) {
            this.pendingSushi = { fishName, is67, rarityId };
            document.getElementById('sushi-modal').classList.add('hidden'); 
            this.resetCanvas();
            document.getElementById('sushi-cut-img').src = imageSrc;
            document.getElementById('sushi-minigame-modal').classList.remove('hidden'); 
        },

        finishMinigame: function() {
            document.getElementById('sushi-minigame-modal').classList.add('hidden');
            
            if (!this.pendingSushi) return;
            const { fishName, is67, rarityId } = this.pendingSushi;
            this.pendingSushi = null;

            const collectionTarget = is67 ? window.GAME_STATE.collection67 : window.GAME_STATE.collection;
            if (!collectionTarget[fishName] || collectionTarget[fishName] <= 0) return;

            collectionTarget[fishName]--;

            const isRotten = Math.random() < 0.15;

            if (isRotten) {
                window.GAME_STATE.materials['geleia_estranha'] = (window.GAME_STATE.materials['geleia_estranha'] || 0) + 1;
                
                if(window.updateUI) window.updateUI();
                if(window.saveGame) window.saveGame();

                if(window.customAlert) {
                    window.customAlert(`🤢 ECA!\n\nO ${fishName} que você filetou estava totalmente PODRE por dentro!\n\nVocê perdeu a refeição, mas extraiu:\n🦠 +1 Geleia Estranha`, false);
                }
            } else {
                const currentKnifeId = window.GAME_STATE.currentKnife || 'faca_cozinha';
                const knifeData = window.KNIVES.find(k => k.id === currentKnifeId) || window.KNIVES[0];
                const multiplier = knifeData.mult;
                const dropsMats = knifeData.dropsMats;

                const loot = this.getLootTable(rarityId);
                
                let coinReward = Math.floor(loot.coins * multiplier);
                let matRewardQty = Math.floor(loot.matQty * multiplier);
                
                if (is67) { coinReward *= 3; matRewardQty *= 2; }

                const matRewardId = loot.mats[Math.floor(Math.random() * loot.mats.length)]; 

                window.GAME_STATE.coins += coinReward;
                
                let rewardMessage = `🪙 +${coinReward.toLocaleString()} Cat Coins`;

                if (dropsMats) {
                    window.GAME_STATE.materials[matRewardId] = (window.GAME_STATE.materials[matRewardId] || 0) + matRewardQty;
                    let matIcon = '📦'; let matName = matRewardId;
                    if (window.CRAFTING_DB && window.CRAFTING_DB.materials) {
                        const matInfo = window.CRAFTING_DB.materials.find(m => m.id === matRewardId);
                        if (matInfo) { matIcon = matInfo.icon; matName = matInfo.name; }
                    }
                    rewardMessage += `\n${matIcon} +${matRewardQty.toLocaleString()} ${matName}`;
                } else {
                    rewardMessage += `\n❌ Sem materiais (Faca muito fraca)`;
                }

                if(window.updateUI) window.updateUI();
                if(window.saveGame) window.saveGame();

                if(window.customAlert) {
                    window.customAlert(`🔪 Perfeito!\n\nVocê filetou o ${fishName}!\n\nRecompensas (Faca x${multiplier}):\n${rewardMessage}`, true);
                }
            }

            this.renderGrid();
            document.getElementById('sushi-modal').classList.remove('hidden'); 
        }
    };

    window.SushiMode.init();
}

carregarBancoDeDadosEIniciar();