// ==========================================================================
// 1. IMPORTAÇÕES E SETUP DO FIREBASE E ADMINISTRAÇÃO DE SEGURANÇA
// ==========================================================================
const urlParams = new URLSearchParams(window.location.search);
const isGuestMode = urlParams.get('guest') === 'true';
const isOfflineTestAdm = urlParams.get('test') === 'adm';

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
let offlineMode = false;

// O SEU UID DE DEUS ABSOLUTO
const MEU_UID_DE_DEUS = 'WvffNHmkdCWQ5IPMnbh0SPP9XkY2';
window.isAdminUser = false;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
} catch (error) {
    console.warn("⚠️ Firebase bloqueado ou offline. Entrando em Modo Local Automático.");
    offlineMode = true;
}

window.checkIsAdmin = function() {
    if (isOfflineTestAdm) return true;
    if (currentUser && currentUser.uid === MEU_UID_DE_DEUS) return true;
    return window.isAdminUser === true;
};

// 🛡️ ROTINA ANTI-CHEAT
window.validateGearSecurity = function() {
    if (!window.checkIsAdmin() && window.GAME_STATE) {
        if (window.GAME_STATE.ownedRods) {
            window.GAME_STATE.ownedRods = window.GAME_STATE.ownedRods.filter(id => id !== 9999);
        }
        if (window.GAME_STATE.ownedHooks) {
            window.GAME_STATE.ownedHooks = window.GAME_STATE.ownedHooks.filter(id => id !== 'anzol_adm_supremo');
        }
        if (window.GAME_STATE.currentRodIndex === 9999) {
            window.GAME_STATE.currentRodIndex = 0;
        }
        if (window.GAME_STATE.currentHook === 'anzol_adm_supremo') {
            window.GAME_STATE.currentHook = 'anzol_padrao';
        }
        window.GAME_STATE.hookCustomTarget = null;
    }
};

// 👑 INJEÇÃO DE EQUIPAMENTO EXCLUSIVO ADM
window.injectAdminGear = function() {
    if (!window.checkIsAdmin() || !window.GAME_STATE) return;

    const admRodId = 9999;
    const admHookId = 'anzol_adm_supremo';

    if (window.ROD_TEMPLATES && !window.ROD_TEMPLATES.find(r => r.id === admRodId)) {
        const admRod = { id: admRodId, name: "👑 Vara do Administrador", type: "divino", price: 0, speed: 999.0, luck: 9999999, lore: "⚙️ Função: Controle do Servidor. ✨ Diferencial: Exclusiva para os Desenvolvedores." };
        window.ROD_TEMPLATES.push(admRod);
        if (window.GAME_STATE.rods && !window.GAME_STATE.rods.find(r => r.id === admRodId)) {
            window.GAME_STATE.rods.push(admRod);
        }
    }
    if (!window.GAME_STATE.ownedRods.includes(admRodId)) window.GAME_STATE.ownedRods.push(admRodId);

    if (window.HOOKS && !window.HOOKS.find(h => h.id === admHookId)) {
        window.HOOKS.push({ id: admHookId, name: '👑 Anzol do Administrador', color: '#ef4444', target: 'bestial', power: 0.99, lore: "⚙️ Função: Impor as regras. ✨ Diferencial: Bypassa o RNG do jogo." });
    }
    if (!window.GAME_STATE.ownedHooks.includes(admHookId)) window.GAME_STATE.ownedHooks.push(admHookId);
};

async function carregarBancoDeDadosEIniciar() {
    if (window.CRAFTING_DB && window.KNIVES && window.RARITIES && window.HOOKS) {
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
        window.HOOKS = DB.HOOKS;

        window.CRAFTING_DB = { materials: DB.MATERIALS, recipes: DB.CRAFTING_RECIPES };

        iniciarMotorDoJogo();
    } catch (erro) {
        console.error("Falha ao carregar o banco de dados. Tentando prosseguir com JS local.", erro);
    }
}

function injectScriptStyles() {
    if (document.getElementById('modern-script-styles')) return;
    const style = document.createElement('style');
    style.id = 'modern-script-styles';
    style.innerHTML = `
        .modern-collection-card {
            background: rgba(15, 23, 42, 0.8) !important; border: 1px solid rgba(255,255,255,0.05) !important;
            border-radius: 16px !important; box-shadow: 0 4px 6px rgba(0,0,0,0.3), inset 0 2px 10px rgba(0,0,0,0.5) !important;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important; position: relative; overflow: hidden;
            display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px;
            text-align: center; min-height: 140px;
        }
        .modern-collection-card.unlocked:hover {
            transform: translateY(-6px) scale(1.03) !important; box-shadow: 0 15px 25px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.1) !important; z-index: 10;
        }
        .modern-collection-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--card-color, #444); }
        
        @keyframes lootDropEnter { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; } 70% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
        
        .modern-loot-popup {
            position: fixed; top: 50%; left: 50%; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 2px solid var(--loot-color, #fff); border-radius: 20px; padding: 30px; text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 0 40px var(--loot-glow, rgba(255,255,255,0.1));
            animation: lootDropEnter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; z-index: 999999; pointer-events: none; min-width: 250px;
        }

        .rotten-fish { filter: drop-shadow(0 15px 20px rgba(0,0,0,0.8)) hue-rotate(260deg) saturate(3) contrast(1.3) brightness(0.6) sepia(0.5) !important; }
    `;
    document.head.appendChild(style);
}

function iniciarMotorDoJogo() {
    injectScriptStyles();

    // ── BLINDAGEM ANTI-RESET ─────────────────────────────────────────────────
    // NUNCA sobrescrever o GAME_STATE com zeros incondicionalmente.
    // Se já existir um estado em memória (ex: outra página passou dados via
    // window), preservá-lo. Caso contrário, criar apenas o esqueleto mínimo.
    // O carregamento real dos dados vem de loadGame() logo abaixo.
    // Usar Object.assign para preencher APENAS campos ausentes, nunca apagar.
    const _defaults = {
        coins: 0, currentRodIndex: 0, isFishing: false, rods: [],
        ownedRods: [0], ownedSinkers: ['chumbo'], currentSinker: 'chumbo',
        ownedHooks: ['anzol_padrao'], currentHook: 'anzol_padrao',
        hookCustomTarget: null, ownedKnives: ['faca_cozinha'],
        currentKnife: 'faca_cozinha', baitInventory: {}, currentBait: null,
        loadedImages: {}, collection: {}, collection67: {}, scrapCollection: {},
        isDay: true, materials: {}, sushiUnlocked: false
    };
    // Preserva qualquer GAME_STATE já existente; preenche só o que falta
    if (!window.GAME_STATE || Object.keys(window.GAME_STATE).length === 0) {
        window.GAME_STATE = { ..._defaults };
    } else {
        for (const key in _defaults) {
            if (window.GAME_STATE[key] === undefined) {
                window.GAME_STATE[key] = _defaults[key];
            }
        }
    }
    // ────────────────────────────────────────────────────────────────────────

    if (window.ROD_TEMPLATES) { window.GAME_STATE.rods = window.ROD_TEMPLATES.map((tpl, index) => ({ id: index, ...tpl })); }

    window.showToast = function(title, message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div'); container.id = 'toast-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        let bgColor = 'linear-gradient(135deg, #1e293b, #0f172a)'; let icon = 'ℹ️'; let borderColor = 'rgba(255,255,255,0.1)';
        if (type === 'success') { bgColor = 'linear-gradient(135deg, #065f46, #022c22)'; icon = '✅'; borderColor = '#10b981'; }
        if (type === 'error') { bgColor = 'linear-gradient(135deg, #991b1b, #450a0a)'; icon = '❌'; borderColor = '#ef4444'; }
        if (type === 'warning') { bgColor = 'linear-gradient(135deg, #92400e, #451a03)'; icon = '⚠️'; borderColor = '#f59e0b'; }

        toast.style.cssText = `
            background: ${bgColor}; color: #f8fafc; padding: 15px 20px; border-radius: 12px; font-family: 'Poppins', sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 15px; transform: translateX(120%); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); max-width: 320px; border: 1px solid ${borderColor}; pointer-events: auto; position: relative; overflow: hidden; cursor: pointer; will-change: transform;
        `;
        const formattedMsg = message.replace(/\n/g, '<br>');
        toast.innerHTML = `
            <div style="font-size: 2rem; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));">${icon}</div>
            <div style="display: flex; flex-direction: column;">
                ${title ? `<strong style="font-family:'Fredoka'; font-size:1.1rem; margin-bottom:2px; letter-spacing:0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">${title}</strong>` : ''}
                <span style="font-size: 0.85rem; line-height: 1.3; color: #cbd5e1;">${formattedMsg}</span>
            </div>
            <div class="toast-progress" style="position:absolute; bottom:0; left:0; height:3px; background:${borderColor}; width:100%; transition: width 4.5s linear; box-shadow: 0 0 5px ${borderColor};"></div>
        `;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
            setTimeout(() => { const pb = toast.querySelector('.toast-progress'); if(pb) pb.style.width = '0%'; }, 50);
        });

        const removeToast = () => { toast.style.transform = 'translateX(120%)'; toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); };
        toast.addEventListener('click', removeToast); setTimeout(removeToast, 4500);
    };

    window.customAlert = function(msg, isSuccess) {
        let parts = msg.split('\n\n'); let title = isSuccess ? "Sucesso!" : "Atenção!"; let body = msg;
        if (parts.length > 1) { title = parts[0]; body = parts.slice(1).join('<br><br>'); }
        window.showToast(title, body, isSuccess ? 'success' : 'error');
    };

    // =========================================================
    // SEGURANÇA CONTRA CORRUPÇÃO DO FIREBASE (ENCODE/DECODE)
    // =========================================================
    function encK(k) { return String(k).replace(/\./g, '‹d›').replace(/#/g, '‹h›').replace(/\$/g, '‹s›').replace(/\[/g, '‹l›').replace(/\]/g, '‹r›').replace(/\//g, '‹sl›'); }
    function decK(k) { return String(k).replace(/‹d›/g, '.').replace(/‹h›/g, '#').replace(/‹s›/g, '$').replace(/‹l›/g, '[').replace(/‹r›/g, ']').replace(/‹sl›/g, '/'); }
    
    function safeDict(dict) {
        let res = {};
        if(dict) for(let k in dict) res[encK(k)] = dict[k];
        return res;
    }
    function loadDict(dict) {
        let res = {};
        if(dict) for(let k in dict) res[decK(k)] = dict[k];
        return res;
    }

    window.saveGame = async function() {
        if (isGuestMode) { 
            if(safeGet('save-status')) safeGet('save-status').innerText = "🚫 Convidado"; 
            return; 
        }

        // Race-condition guard: Firebase Auth pode ainda não ter resolvido o user.
        // Aguarda até 3s (30 tentativas × 100ms) antes de desistir e salvar local.
        if (!offlineMode && !currentUser && db) {
            await new Promise(resolve => {
                let attempts = 0;
                const poll = setInterval(() => {
                    attempts++;
                    if (currentUser || attempts >= 30) { clearInterval(poll); resolve(); }
                }, 100);
            });
        }
        
        let safeInstances = window.GAME_STATE.hybridInstances || [];
        if (!Array.isArray(safeInstances)) safeInstances = Object.values(safeInstances);

        const playerSave = { 
            coins: window.GAME_STATE.coins || 0, currentRodIndex: window.GAME_STATE.currentRodIndex || 0, ownedRods: window.GAME_STATE.ownedRods || [0], ownedSinkers: window.GAME_STATE.ownedSinkers || ['chumbo'], currentSinker: window.GAME_STATE.currentSinker || 'chumbo', ownedHooks: window.GAME_STATE.ownedHooks || ['anzol_padrao'], currentHook: window.GAME_STATE.currentHook || 'anzol_padrao', hookCustomTarget: window.GAME_STATE.hookCustomTarget || null, ownedKnives: window.GAME_STATE.ownedKnives || ['faca_cozinha'], currentKnife: window.GAME_STATE.currentKnife || 'faca_cozinha', currentBait: window.GAME_STATE.currentBait || null, sushiUnlocked: window.GAME_STATE.sushiUnlocked || false,
            tacticalSquad: window.GAME_STATE.tacticalSquad || [null, null, null, null, null],
            hybridInstances: safeInstances,
            
            collection: safeDict(window.GAME_STATE.collection), 
            collection67: safeDict(window.GAME_STATE.collection67), 
            scrapCollection: safeDict(window.GAME_STATE.scrapCollection), 
            materials: safeDict(window.GAME_STATE.materials), 
            orbs: safeDict(window.GAME_STATE.orbs),
            baitInventory: safeDict(window.GAME_STATE.baitInventory),
            customFusions: safeDict(window.GAME_STATE.customFusions)
        };
        
        if (!offlineMode && currentUser && db) {
            localStorage.setItem('gatoPescadorSave_' + currentUser.uid, JSON.stringify(playerSave));
            try {
                await set(ref(db, 'users/' + currentUser.uid), playerSave);
                if(safeGet('save-status')) safeGet('save-status').innerText = "☁️ Salvo"; 
            } catch (e) {
                console.error("Erro Crítico ao salvar no Firebase:", e);
                if(safeGet('save-status')) safeGet('save-status').innerText = "❌ Erro Nuvem";
            }
        } else {
            localStorage.setItem('gatoPescadorSave_visitante', JSON.stringify(playerSave));
            if(safeGet('save-status')) safeGet('save-status').innerText = "✅ Salvo Local";
        }
    };

    function initHookTargetModal() {
        if (!window.checkIsAdmin()) return;
        if (document.getElementById('hook-target-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'hook-target-modal';
        modal.className = 'modal hidden';
        modal.style.zIndex = '9999999';

        let buttonsHtml = '';
        const colors = { 'comum': '#94a3b8', 'raro': '#34d399', 'epico': '#c084fc', 'lendario': '#fbbf24', 'mitico': '#ef4444', 'secreto': '#334155', 'divino': '#f59e0b', 'aurudo': '#fef08a', 'vandalo': '#10b981', 'bestial': '#7f1d1d' };

        buttonsHtml += `<button onclick="window.setHookTarget('padrao')" style="background: rgba(255,255,255,0.1); border: 1px solid #fff; color: #fff; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; margin: 5px; flex: 1 1 40%; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">Padrão (Desligado)</button>`;
        buttonsHtml += `<button onclick="window.setHookTarget('sucata')" style="background: rgba(100,116,139,0.1); border: 1px solid #64748b; color: #94a3b8; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; margin: 5px; flex: 1 1 40%; transition: 0.2s;" onmouseover="this.style.background='rgba(100,116,139,0.3)'" onmouseout="this.style.background='rgba(100,116,139,0.1)'">🗑️ Lixo / Sucata</button>`;

        if (window.RARITIES) {
            Object.values(window.RARITIES).forEach(r => {
                const color = colors[r.id] || '#fff';
                buttonsHtml += `<button onclick="window.setHookTarget('${r.id}')" style="background: ${color}15; border: 1px solid ${color}66; color: ${color}; padding: 12px 10px; border-radius: 8px; cursor: pointer; font-weight: 800; margin: 5px; flex: 1 1 30%; transition: 0.2s; text-transform: uppercase;" onmouseover="this.style.background='${color}44'" onmouseout="this.style.background='${color}15'">${r.name}</button>`;
            });
        }

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 550px; background: #0f172a; border: 2px solid #38bdf8; box-shadow: 0 0 30px rgba(56, 189, 248, 0.4); padding: 0; border-radius: 16px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #0369a1, #1e3a8a); padding: 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #38bdf8;">
                    <h2 style="margin: 0; color: #f8fafc; font-family: 'Fredoka', sans-serif; font-size: 1.8rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">🎯 Sintonizador de Anzol</h2>
                    <button onclick="document.getElementById('hook-target-modal').classList.add('hidden')" style="background: none; border: none; color: #bae6fd; font-size: 2.5rem; cursor: pointer; line-height: 1;">&times;</button>
                </div>
                <div style="padding: 25px; text-align: center; background: url('/img/asset/bg-dark-pattern.png') repeat, #020617;">
                    <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 25px; font-family: 'Poppins'; line-height: 1.4;">Selecione qual raridade este anzol deve focar em atrair.<br><b>A eficácia depende do Poder base do Anzol equipado.</b></p>
                    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 5px;">
                        ${buttonsHtml}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.setHookTarget = async function(targetId) {
        if (!window.checkIsAdmin() || !window.GAME_STATE) return;
        window.GAME_STATE.hookCustomTarget = targetId;
        window.updateUI();
        await window.saveGame();
        document.getElementById('hook-target-modal').classList.add('hidden');
        window.showToast("Anzol Sintonizado!", `O seu anzol agora está focado em atrair a raridade: ${targetId.toUpperCase()}`, "success");
    };

    function processLoadedData(data) {
        Object.assign(window.GAME_STATE, data);
        window.GAME_STATE.isFishing = false;
        window.GAME_STATE._loadComplete = true; // flag de segurança para o auto-save
        
        window.GAME_STATE.collection = loadDict(data.collection);
        window.GAME_STATE.collection67 = loadDict(data.collection67);
        window.GAME_STATE.materials = loadDict(data.materials);
        window.GAME_STATE.scrapCollection = loadDict(data.scrapCollection);
        window.GAME_STATE.baitInventory = loadDict(data.baitInventory);
        window.GAME_STATE.orbs = loadDict(data.orbs);
        window.GAME_STATE.customFusions = loadDict(data.customFusions);

        if (window.GAME_STATE.sushiUnlocked === undefined) window.GAME_STATE.sushiUnlocked = false;
        if (!window.GAME_STATE.ownedRods || window.GAME_STATE.ownedRods.length === 0) window.GAME_STATE.ownedRods = [0];
        if (!window.GAME_STATE.ownedHooks) { window.GAME_STATE.ownedHooks = ['anzol_padrao']; window.GAME_STATE.currentHook = 'anzol_padrao'; }
        if (!window.GAME_STATE.ownedKnives || window.GAME_STATE.ownedKnives.length === 0) { window.GAME_STATE.ownedKnives = ['faca_cozinha']; window.GAME_STATE.currentKnife = 'faca_cozinha'; }
        
        window.validateGearSecurity(); 
        if (window.checkIsAdmin()) { window.injectAdminGear(); }
    }

    function loadGame() {
        if (isGuestMode) { if(safeGet('save-status')) safeGet('save-status').innerText = "🚫 Modo Convidado"; window.updateUI(); _startAutoSave(); return; }

        if (!currentUser || !db || offlineMode) {
            let localData = localStorage.getItem('gatoPescadorSave_visitante') || localStorage.getItem('gatoPescadorSave');
            if (localData) {
                try {
                    processLoadedData(JSON.parse(localData));
                    if(safeGet('save-status')) safeGet('save-status').innerText = "👤 Local / Visitante";
                } catch (e) { console.error("Save corrompido"); }
            }
            window.updateUI(); _startAutoSave(); return;
        }

        if(safeGet('save-status')) safeGet('save-status').innerText = "🔄 Nuvem...";
        
        get(child(ref(db), `users/${currentUser.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                // Dado real encontrado na nuvem — carrega normalmente
                processLoadedData(snapshot.val());
                localStorage.setItem('gatoPescadorSave_' + currentUser.uid, JSON.stringify(snapshot.val()));
                if(safeGet('save-status')) safeGet('save-status').innerText = "☁️ Conectado";
            } else {
                // Nó da nuvem não existe: tenta localStorage como fonte de verdade.
                // ── BLINDAGEM VETOR 2: NUNCA chamar saveGame() aqui. ──────────────
                // Se salvarmos agora com GAME_STATE vazio/zerado, apagaremos dados
                // reais que possam existir de sessões anteriores ou outras páginas.
                // Apenas carregamos o backup local sem persistir na nuvem ainda.
                let localBackup = localStorage.getItem('gatoPescadorSave_' + currentUser.uid) 
                               || localStorage.getItem('gatoPescadorSave');
                if (localBackup) {
                    try { processLoadedData(JSON.parse(localBackup)); } catch(e) { console.error("Backup local corrompido", e); }
                }
                // Salvar na nuvem SOMENTE se tiver dados reais para salvar
                if (window.GAME_STATE && (window.GAME_STATE.coins > 0 || 
                    (window.GAME_STATE.ownedRods && window.GAME_STATE.ownedRods.length > 1) ||
                    Object.keys(window.GAME_STATE.collection || {}).length > 0)) {
                    window.saveGame();
                }
                // ─────────────────────────────────────────────────────────────────
            }
            if (window.ROD_TEMPLATES) window.GAME_STATE.rods = window.ROD_TEMPLATES.map((tpl, index) => ({ id: index, ...tpl }));
            window.updateUI();
            _startAutoSave(); // ← auto-save só começa APÓS o load completar
        }).catch((e) => {
            console.error(e);
            if(safeGet('save-status')) safeGet('save-status').innerText = "❌ Offline";
            // Fallback offline: carrega o último localStorage
            let localData = localStorage.getItem('gatoPescadorSave_' + (currentUser ? currentUser.uid : 'visitante'))
                         || localStorage.getItem('gatoPescadorSave');
            if (localData) { try { processLoadedData(JSON.parse(localData)); } catch(e2){} }
            window.updateUI();
            _startAutoSave();
        });
    }

    // ── AUTO-SAVE CONTROLADO ────────────────────────────────────────────────
    // setInterval só é registrado UMA VEZ, após o load completar.
    // Isso evita que o timer dispare com GAME_STATE vazio durante o handshake.
    let _autoSaveStarted = false;
    function _startAutoSave() {
        if (_autoSaveStarted) return;
        _autoSaveStarted = true;
        setInterval(() => {
            // Guarda de segurança: nunca salvar um estado claramente zerado
            if (!window.GAME_STATE || window.GAME_STATE._loadComplete !== true) return;
            window.saveGame();
        }, 30000);
    }

    // 🔥 O CORAÇÃO DA NOVA SEGURANÇA E DO SINAL DO ADMIN
    if (!offlineMode && auth) { 
        onAuthStateChanged(auth, async (user) => { 
            currentUser = user; 
            if(!isGuestMode) {
                // Se for o seu UID cravado no código
                if (user && user.uid === MEU_UID_DE_DEUS) {
                    window.isAdminUser = true;
                    // EMITE O SINAL VERDE PARA O ADMIN.JS CONSTRUIR O BOTÃO
                    window.dispatchEvent(new Event('admin-verified'));
                } else {
                    window.isAdminUser = false;
                }
                loadGame(); 
            }
        }); 
    } else {
        if(!isGuestMode) loadGame();
    }
    
    // setInterval movido para _startAutoSave() dentro de loadGame() — ver acima

    function preloadImages() {
        if (window.RARITIES) {
            Object.values(window.RARITIES).forEach(rarity => {
                rarity.variations.forEach(fish => { const img = new Image(); img.src = fish.image; window.GAME_STATE.loadedImages[fish.image] = img; });
            });
        }
        if (window.SUCATAS) {
            window.SUCATAS.forEach(scrap => { const img = new Image(); img.src = scrap.image; window.GAME_STATE.loadedImages[scrap.image] = img; });
        }
        ['/img/asset/67comum.jpeg', '/img/asset/67raro.png', '/img/asset/67muitoraro.webp'].forEach(src => { const img = new Image(); img.src = src; });
    }
    preloadImages();

    function safeGet(id) { return document.getElementById(id); }

    window.updateUI = function() {
        if(safeGet('cat-coins')) safeGet('cat-coins').innerText = window.GAME_STATE.coins.toLocaleString();
        
        let safeRodId = window.GAME_STATE.currentRodIndex;
        if (!window.checkIsAdmin() && safeRodId === 9999) safeRodId = 0; 
        const rod = window.GAME_STATE.rods.find(r => r.id === safeRodId) || window.GAME_STATE.rods[0];
        
        if(safeGet('current-rod-display')) safeGet('current-rod-display').innerText = `Vara: ${rod ? rod.name : 'Nenhuma'}`;
        
        const catVisual = safeGet('cat-fisherman');
        if (catVisual) { const rodVisual = catVisual.querySelector('.rod-visual'); if (rodVisual) rodVisual.className = `rod-visual dropzone rod-tier-${rod ? rod.id : 0}`; }

        const sinker = (window.SINKERS || []).find(s => s.id === window.GAME_STATE.currentSinker) || (window.SINKERS ? window.SINKERS[0] : {name: 'Padrão'});
        if(safeGet('sinker-slot')) safeGet('sinker-slot').innerText = `🪨 ${sinker.name}`;
        if(safeGet('equipped-sinker-visual')) safeGet('equipped-sinker-visual').style.display = (sinker.id && sinker.id !== 'chumbo') ? 'block' : 'none';

        let safeHookId = window.GAME_STATE.currentHook || 'anzol_padrao';
        if (!window.checkIsAdmin() && safeHookId === 'anzol_adm_supremo') safeHookId = 'anzol_padrao'; 
        
        const hookData = (window.HOOKS || []).find(h => h.id === safeHookId) || {name: 'Anzol Padrão', color: '#bdc3c7'};
        
        if(safeGet('hook-display-slot')) {
            if (window.checkIsAdmin()) {
                let activeTarget = window.GAME_STATE.hookCustomTarget || hookData.target || 'padrao';
                let targetLabel = activeTarget === 'padrao' ? 'Qualquer' : (activeTarget === 'sucata' ? 'Lixo' : activeTarget.toUpperCase());

                safeGet('hook-display-slot').innerHTML = `
                    <span style="color:${hookData.color}; font-weight:bold; text-shadow: 0 0 10px ${hookData.color}88; pointer-events: none;">🪝 ${hookData.name}</span>
                    <div style="font-size: 0.65rem; color:#94a3b8; margin-top:2px; pointer-events: none;">🎯 Alvo: <span style="color:#f8fafc;">${targetLabel}</span></div>
                `;
                safeGet('hook-display-slot').style.cursor = 'pointer';
                safeGet('hook-display-slot').onclick = () => {
                    initHookTargetModal(); 
                    const modal = document.getElementById('hook-target-modal');
                    if (modal) modal.classList.remove('hidden');
                };
            } else {
                safeGet('hook-display-slot').innerHTML = `<span style="color:${hookData.color}; font-weight:bold; text-shadow: 0 0 10px ${hookData.color}88;">🪝 ${hookData.name}</span>`;
                safeGet('hook-display-slot').style.cursor = 'default';
                safeGet('hook-display-slot').onclick = null;
            }
        }

        const hookVisual = safeGet('hook');
        if (hookVisual) { hookVisual.style.color = hookData.color; hookVisual.style.textShadow = `0 0 15px ${hookData.color}, 0 2px 4px rgba(0,0,0,0.8)`; }

        const baitDisplay = safeGet('bait-slot'); const baitVis = safeGet('bait-visual');
        if (window.GAME_STATE.currentBait && window.BAITS) {
            const bait = window.BAITS.find(b => b.id === window.GAME_STATE.currentBait);
            if (bait && baitDisplay && baitVis) { baitDisplay.innerText = `${bait.icon} ${bait.name} (x${window.GAME_STATE.baitInventory[bait.id] || 0})`; baitVis.innerText = bait.icon; }
        } else {
            if(baitDisplay) baitDisplay.innerText = "🪝 Sem Isca"; if(baitVis) baitVis.innerText = "";
        }

        const sushiBtn = safeGet('sushi-btn');
        if (sushiBtn) { if (window.GAME_STATE.sushiUnlocked) { sushiBtn.classList.remove('locked'); } else { sushiBtn.classList.add('locked'); } }
    };

    window.calculateCatch = function(rod, sinker, activeBaitId) {
        let safeRodId = window.GAME_STATE.currentRodIndex;
        let safeHookId = window.GAME_STATE.currentHook;
        
        if (!window.checkIsAdmin()) {
            if (safeRodId === 9999) safeRodId = 0;
            if (safeHookId === 'anzol_adm_supremo') safeHookId = 'anzol_padrao';
        }

        const activeRod = window.GAME_STATE.rods.find(r => r.id === safeRodId) || window.GAME_STATE.rods[0];
        const bait = activeBaitId ? window.BAITS.find(b => b.id === activeBaitId) : null;
        const hook = window.HOOKS ? window.HOOKS.find(h => h.id === safeHookId) : null;

        let luckFactor = activeRod && activeRod.luck ? activeRod.luck : 1;
        let valueMult = 1;
        let chance67 = 0.0005;

        if (sinker && sinker.stats && sinker.stats.luck) luckFactor += sinker.stats.luck;
        if (sinker && sinker.stats && sinker.stats.value) valueMult *= sinker.stats.value;
        if (sinker && sinker.stats && sinker.stats.chance67) chance67 += sinker.stats.chance67;
        
        if (sinker && sinker.synergy && activeRod && sinker.synergy.type === activeRod.type) {
            if (sinker.synergy.luck) luckFactor += sinker.synergy.luck;
            if (sinker.synergy.value) valueMult *= sinker.synergy.value;
            if (sinker.synergy.chance67) chance67 += sinker.synergy.chance67;
        }

        if (bait) {
            let luckBoostLvl = window.GAME_STATE.baitBoosts && window.GAME_STATE.baitBoosts[bait.id] ? window.GAME_STATE.baitBoosts[bait.id].luck || 0 : 0;
            let valBoostLvl = window.GAME_STATE.baitBoosts && window.GAME_STATE.baitBoosts[bait.id] ? window.GAME_STATE.baitBoosts[bait.id].value || 0 : 0;

            if (bait.stats.luck) luckFactor += bait.stats.luck + (luckBoostLvl * 50); 
            if (bait.stats.value) valueMult *= bait.stats.value + (valBoostLvl * 0.2); 
            if (bait.stats.chance67) chance67 += bait.stats.chance67;
        }

        if (window.eventLuckMult) luckFactor += (window.eventLuckMult * 100); 

        let activeTarget = 'padrao';
        if (window.checkIsAdmin() && window.GAME_STATE.hookCustomTarget) {
            activeTarget = window.GAME_STATE.hookCustomTarget;
        } else if (hook && hook.target) {
            activeTarget = hook.target;
        }

        let sucataChance = 0.15 - (luckFactor / 100000);
        if (window.currentEventID === 'abismo_lixo') sucataChance += 0.60;
        if (sucataChance < 0.05) sucataChance = 0.05; 

        if (activeTarget === 'sucata') sucataChance += (hook ? hook.power : 0);

        const rand = Math.random();
        if (rand < sucataChance && window.SUCATAS && window.SUCATAS.length > 0) {
            const randomSucata = window.SUCATAS[Math.floor(Math.random() * window.SUCATAS.length)];
            return { type: 'sucata', data: randomSucata };
        }

        let caughtRarity = window.RARITIES.COMUM;
        let bypassedByHook = false;

        if (hook && activeTarget !== 'sucata' && activeTarget !== 'padrao') {
            const hookRoll = Math.random();
            if (hookRoll < hook.power) {
                const targetKey = activeTarget.toUpperCase();
                if (window.RARITIES[targetKey]) {
                    caughtRarity = window.RARITIES[targetKey];
                    bypassedByHook = true;
                }
            }
        }

        if (!bypassedByHook) {
            let fishRoll = Math.random() - (luckFactor / 25000); 

            if (window.currentEventID === 'mar_bestas') fishRoll -= 0.15; 
            if (window.currentEventID === 'abismo_lixo') fishRoll -= 0.10; 

            if (window.currentEventID === 'mar_bestas' && fishRoll < window.RARITIES.BESTIAL.prob) caughtRarity = window.RARITIES.BESTIAL;
            else if (window.currentEventID === 'abismo_lixo' && fishRoll < window.RARITIES.VANDALO.prob) caughtRarity = window.RARITIES.VANDALO;
            else if (fishRoll < window.RARITIES.AURUDO.prob) caughtRarity = window.RARITIES.AURUDO;
            else if (fishRoll < window.RARITIES.DIVINO.prob) caughtRarity = window.RARITIES.DIVINO;
            else if (fishRoll < window.RARITIES.SECRETO.prob) caughtRarity = window.RARITIES.SECRETO;
            else if (fishRoll < window.RARITIES.MITICO.prob) caughtRarity = window.RARITIES.MITICO;
            else if (fishRoll < window.RARITIES.LENDARIO.prob) caughtRarity = window.RARITIES.LENDARIO;
            else if (fishRoll < window.RARITIES.EPICO.prob) caughtRarity = window.RARITIES.EPICO;
            else if (fishRoll < window.RARITIES.RARO.prob) caughtRarity = window.RARITIES.RARO;
        }

        const rodTier = activeRod ? activeRod.id : 0;
        let maxRarityIndex = 0; 

        if (rodTier >= 2) maxRarityIndex = 1; 
        if (rodTier >= 4) maxRarityIndex = 2; 
        if (rodTier >= 7) maxRarityIndex = 3; 
        if (rodTier >= 10) maxRarityIndex = 4; 
        if (rodTier >= 13) maxRarityIndex = 5; 
        if (rodTier >= 16) maxRarityIndex = 6; 
        if (rodTier >= 19) maxRarityIndex = 7; 
        if (rodTier >= 22 || rodTier === 9999) maxRarityIndex = 9; 

        const rarityOrder = ['comum', 'raro', 'epico', 'lendario', 'mitico', 'secreto', 'divino', 'aurudo', 'vandalo', 'bestial'];
        let currentRarityIndex = rarityOrder.indexOf(caughtRarity.id);

        if (currentRarityIndex > maxRarityIndex) {
            caughtRarity = window.RARITIES[rarityOrder[maxRarityIndex].toUpperCase()];
        }

        const getValidFishes = (rarityObj) => {
            return rarityObj.variations.filter(v => {
                const timeMatch = (!v.time || v.time === 'all') || 
                                  (window.GAME_STATE.isDay && v.time === 'day') || 
                                  (!window.GAME_STATE.isDay && v.time === 'night');
                
                let eventMatch = false;
                const currentEvt = window.currentEventID;
                
                if (!v.events || v.events.length === 0 || v.events.includes('all')) {
                    eventMatch = true; 
                } else if (currentEvt && v.events.includes(currentEvt)) {
                    eventMatch = true; 
                } else if (!currentEvt && v.events.includes('none')) {
                    eventMatch = true;
                }
                return timeMatch && eventMatch;
            });
        };

        let validVariations = getValidFishes(caughtRarity);
        if (validVariations.length === 0) {
            caughtRarity = window.RARITIES.COMUM;
            validVariations = getValidFishes(caughtRarity);
        }

        for (let i = validVariations.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [validVariations[i], validVariations[j]] = [validVariations[j], validVariations[i]];
        }

        let specificFish = validVariations.length > 0 ? validVariations[0] : window.RARITIES.COMUM.variations[0];

        let finalSize;
        if (caughtRarity.id === 'bestial') {
            finalSize = 800 + Math.floor(Math.random() * 1700); 
        } else {
            const sizeBase = 10 + (Object.keys(window.RARITIES).indexOf(caughtRarity.id.toUpperCase()) * 15);
            finalSize = sizeBase + Math.floor(Math.random() * 60);
            if (finalSize === 67) finalSize = 66; 
            if (Math.random() < chance67) finalSize = 67; 
        }

        let finalValue = Math.floor(finalSize * caughtRarity.mult * valueMult);
        if (window.eventValueMult) finalValue = Math.floor(finalValue * window.eventValueMult);

        return { type: 'fish', rarity: caughtRarity, variation: specificFish, size: finalSize, value: finalValue };
    }

    window.castLine = function() {
        if (window.GAME_STATE.isFishing) return;

        const activeBaitId = window.GAME_STATE.currentBait;

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

        let targetDepth = Math.max(150, Math.floor((window.innerHeight - 150) * (0.3 + (((rod.id || 0) + 1) / 20 * 0.7))));
        let speedMult = rod && rod.speed ? rod.speed : 1;
        if (sinker.stats && sinker.stats.speed) speedMult *= sinker.stats.speed;
        if (sinker.synergy && rod && sinker.synergy.type === rod.type && sinker.synergy.speed) speedMult *= sinker.synergy.speed;
        
        if (activeBaitId && window.GAME_STATE.baitBoosts && window.GAME_STATE.baitBoosts[activeBaitId]) {
            speedMult += window.GAME_STATE.baitBoosts[activeBaitId].speed || 0;
        }

        const travelTime = (Math.max(400, 2000 - ((rod.id || 0) * 80)) / (speedMult || 1)) * (window.eventCastTimeMult || 1);
        const line = safeGet('line-container');
        if(line) { line.style.transition = `height ${travelTime}ms ease-in`; line.style.height = `${targetDepth}px`; }

        setTimeout(() => {
            if(btn) btn.innerText = "Fisgou!";
            
            let catchResult;
            let reelTime = travelTime * 0.8;

            try {
                catchResult = window.calculateCatch(rod, sinker, activeBaitId);
                
                if(fishImg){ 
                    fishImg.onerror = () => { fishImg.src = 'https://placehold.co/80x80?text=🐟'; };
                    fishImg.src = catchResult.type === 'sucata' ? catchResult.data.image : catchResult.variation.image; 
                    
                    if (catchResult.type === 'fish' && catchResult.rarity.id === 'bestial') {
                        fishImg.style.transform = 'scale(3) translateY(10px)';
                        fishImg.style.filter = 'drop-shadow(0 0 20px #7f1d1d)';
                        fishImg.style.zIndex = '100'; 
                    } else if (catchResult.type === 'fish' && catchResult.rarity.id === 'vandalo') {
                        fishImg.style.transform = 'scale(1.5)';
                        fishImg.style.filter = 'drop-shadow(0 0 15px #10b981)';
                        fishImg.style.zIndex = '10'; 
                    } else {
                        fishImg.style.transform = 'scale(1)';
                        fishImg.style.filter = 'none';
                        fishImg.style.zIndex = '1';
                    }
                    fishImg.style.display = 'block'; 
                }
                if(line) { line.style.transition = `height ${reelTime}ms ease-out`; line.style.height = `0px`; }

            } catch (errCalc) {
                console.error("ERRO CRÍTICO NA PESCA", errCalc);
                if(fishImg) fishImg.style.display = 'none';
                if(line) { line.style.transition = 'none'; line.style.height = '0px'; }
                window.GAME_STATE.isFishing = false;
                if(btn) { btn.disabled = false; btn.innerText = "PESCAR (ESPAÇO)"; }
                if(catIdle) catIdle.classList.replace('cat-fishing', 'cat-idle');
                return; 
            }

            setTimeout(() => {
                try {
                    const colors = { 'comum': '#94a3b8', 'raro': '#34d399', 'epico': '#c084fc', 'lendario': '#fbbf24', 'mitico': '#ef4444', 'secreto': '#334155', 'divino': '#f59e0b', 'aurudo': '#fef08a', 'vandalo': '#10b981', 'bestial': '#7f1d1d' };
                    const div = document.createElement('div');
                    div.className = `modern-loot-popup`;

                    if (catchResult.type === 'sucata') {
                        const scrap = catchResult.data;
                        if (!window.GAME_STATE.scrapCollection) window.GAME_STATE.scrapCollection = {};
                        window.GAME_STATE.scrapCollection[scrap.id] = (window.GAME_STATE.scrapCollection[scrap.id] || 0) + 1;
                        window.GAME_STATE.materials[scrap.matReward] = (window.GAME_STATE.materials[scrap.matReward] || 0) + scrap.matQty;
                        
                        div.style.setProperty('--loot-color', '#64748b');
                        div.style.setProperty('--loot-glow', 'rgba(100, 116, 139, 0.4)');
                        
                        div.innerHTML = `
                            <div style="margin-bottom: 15px; animation: floatItem 3s ease-in-out infinite;">
                                <img src="${scrap.image}" style="width: 120px; height: 120px; object-fit: contain; filter: grayscale(0.5) sepia(0.5) contrast(0.8) drop-shadow(0 10px 15px rgba(0,0,0,0.5)); will-change: transform; transform: translateZ(0);" onerror="this.src='https://placehold.co/80x80?text=🗑️'">
                            </div>
                            <div style="color: #cbd5e1; font-family:'Fredoka', sans-serif; font-size: 1.5rem; margin-bottom: 5px; font-weight: bold;">${scrap.name}</div>
                            <div style="color: #ef4444; font-family:'Poppins', sans-serif; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 15px;">Lixo Fisgado</div>
                            <div style="background: rgba(0,0,0,0.5); padding: 8px 20px; border-radius: 20px; color:#34d399; font-weight:800; font-family: 'Poppins', sans-serif; display: inline-block; border: 1px solid rgba(52, 211, 153, 0.3);">♻️ +${scrap.matQty} Extrato Extraído</div>
                        `;
                    } 
                    else {
                        const fish = catchResult;
                        window.GAME_STATE.coins += (fish.value || 0);
                        let sealImage = null;

                        if (fish.size === 67) {
                            if (!window.GAME_STATE.collection67) window.GAME_STATE.collection67 = {};
                            window.GAME_STATE.collection67[fish.variation.name] = (window.GAME_STATE.collection67[fish.variation.name] || 0) + 1;
                            
                            if(fish.rarity.id === 'bestial' || fish.rarity.id === 'vandalo') sealImage = '/img/asset/67muitoraro.webp';
                            else sealImage = (fish.rarity.id === 'comum' || fish.rarity.id === 'raro') ? '/img/asset/67comum.jpeg' : (fish.rarity.id === 'epico' || fish.rarity.id === 'lendario') ? '/img/asset/67raro.png' : '/img/asset/67muitoraro.webp';
                        } else {
                            if (!window.GAME_STATE.collection) window.GAME_STATE.collection = {};
                            window.GAME_STATE.collection[fish.variation.name] = (window.GAME_STATE.collection[fish.variation.name] || 0) + 1;
                        }

                        const color = colors[fish.rarity.id] || '#fff';
                        div.style.setProperty('--loot-color', color);
                        div.style.setProperty('--loot-glow', `${color}66`);
                        let timeIcon = fish.variation.time === 'day' ? '☀️ Dia' : (fish.variation.time === 'night' ? '🌙 Noite' : '🌗 Ambos');

                        let imgSize = fish.rarity.id === 'bestial' ? '260px' : '140px';
                        let filterDrop = fish.rarity.id === 'bestial' ? 'drop-shadow(0 25px 40px rgba(127,29,29,0.9))' : (fish.rarity.id === 'vandalo' ? 'drop-shadow(0 15px 20px rgba(16,185,129,0.8))' : 'drop-shadow(0 15px 20px rgba(0,0,0,0.6))');

                        div.innerHTML = `
                            <div style="position:relative; display:inline-block; margin-bottom:15px; animation: floatItem 3s ease-in-out infinite; will-change: transform; transform: translateZ(0);">
                                <img src="${fish.variation.image}" style="width: ${imgSize}; height: ${imgSize}; object-fit: contain; filter: ${filterDrop}; will-change: transform; transform: translateZ(0);" onerror="this.src='https://placehold.co/80x80?text=🐟'">
                                ${sealImage ? `<img src="${sealImage}" style="position: absolute; bottom:-10px; right:-10px; width:50px; height:50px; object-fit:contain; filter:drop-shadow(2px 4px 6px rgba(0,0,0,0.6)); transform: rotate(15deg);">` : ''}
                            </div>
                            <div style="color: #f8fafc; font-family:'Fredoka', sans-serif; font-size: 1.8rem; margin-bottom: 5px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${fish.variation.name}</div>
                            <div style="color: ${color}; font-family:'Poppins', sans-serif; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 15px; text-shadow: 0 0 10px ${color}88;">${fish.rarity ? fish.rarity.name : 'Desconhecido'}</div>
                            
                            <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 15px;">
                                <div style="background: rgba(0,0,0,0.6); padding: 5px 15px; border-radius: 8px; color: #cbd5e1; font-size: 0.8rem; font-family: 'Poppins', sans-serif; border: 1px solid rgba(255,255,255,0.1);">📏 ${fish.size}cm</div>
                                <div style="background: rgba(0,0,0,0.6); padding: 5px 15px; border-radius: 8px; color: #cbd5e1; font-size: 0.8rem; font-family: 'Poppins', sans-serif; border: 1px solid rgba(255,255,255,0.1);">${timeIcon}</div>
                            </div>

                            <div style="background: rgba(241, 196, 15, 0.1); padding: 8px 20px; border-radius: 20px; color:#fcd34d; font-weight:900; font-size: 1.2rem; font-family: 'Poppins', sans-serif; display: inline-block; border: 1px solid rgba(241, 196, 15, 0.4); box-shadow: 0 0 15px rgba(241, 196, 15, 0.2);">🪙 +${fish.value.toLocaleString()}</div>
                        `;
                    }

                    document.body.appendChild(div);
                    setTimeout(() => { div.style.transition = "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)"; div.style.opacity = "0"; div.style.transform = "translate(-50%, -50%) scale(0.8)"; setTimeout(() => div.remove(), 400); }, 3000);
                } catch(e) {
                    console.error("Erro CRÍTICO no Popup da Interface!", e);
                } finally {
                    if(fishImg) fishImg.style.display = 'none';
                    window.GAME_STATE.isFishing = false;
                    if(btn) { btn.disabled = false; btn.innerText = "PESCAR (ESPAÇO)"; }
                    if(catIdle) catIdle.classList.replace('cat-fishing', 'cat-idle');
                    window.updateUI(); window.saveGame();
                }
            }, reelTime);
        }, travelTime + 1000);
    }

    document.addEventListener('keydown', (e) => { 
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.code === 'Space') { 
            e.preventDefault(); 
            if (e.repeat) return;

            // Admin-modal usa .active (não .hidden) — checar correto
            const admPanel = document.getElementById('admin-modal');
            if (admPanel && admPanel.classList.contains('active')) return;

            // Bloqueia se qualquer .modal estiver aberto (ausência de .hidden = visível)
            const openModal = document.querySelector('.modal:not(.hidden)');
            if (openModal) return;

            if (!window.GAME_STATE.isFishing) window.castLine(); 
        } 
    });

    safeGet('open-collection-btn')?.addEventListener('click', () => { safeGet('collection-modal')?.classList.remove('hidden'); window.renderCollection(); });
    safeGet('close-collection-btn')?.addEventListener('click', () => safeGet('collection-modal')?.classList.add('hidden'));
    
    safeGet('open-67-btn')?.addEventListener('click', () => { safeGet('collection-67-modal')?.classList.remove('hidden'); window.renderCollection67(); });
    safeGet('close-67-btn')?.addEventListener('click', () => safeGet('collection-67-modal')?.classList.add('hidden'));

    safeGet('open-scrap-btn')?.addEventListener('click', () => { safeGet('collection-scrap-modal')?.classList.remove('hidden'); window.renderScrapCollection(); });
    safeGet('close-scrap-btn')?.addEventListener('click', () => safeGet('collection-scrap-modal')?.classList.add('hidden'));

    safeGet('sushi-btn')?.addEventListener('click', () => {
        if (!window.GAME_STATE.sushiUnlocked) {
            window.showToast("Restaurante Fechado!", "A porta está trancada. A chave deve estar escondida em algum lugar...", "warning");
            return;
        }
        if (window.SushiMode) window.SushiMode.open();
    });

    window.showFishDetail = function(fish, rarity, count, is67) {
        const existing = document.getElementById('fish-detail-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'fish-detail-overlay';
        overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(2, 6, 23, 0.85); display: flex; align-items: center; justify-content: center; z-index: 999999; opacity: 0; transition: opacity 0.4s ease; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);`;

        let seal = '';
        if (is67) {
            const s = (rarity.id==='bestial' || rarity.id==='vandalo') ? '/img/asset/67muitoraro.webp' : (rarity.id==='comum'||rarity.id==='raro')?'/img/asset/67comum.jpeg':(rarity.id==='epico'||rarity.id==='lendario')?'/img/asset/67raro.png':'/img/asset/67muitoraro.webp'; 
            seal = `<img src="${s}" style="position:absolute; bottom:-20px; right:-20px; width:110px; height:110px; object-fit:contain; transform:rotate(15deg); filter:drop-shadow(2px 8px 10px rgba(0,0,0,0.8));">`;
        }

        const colors = { 'comum': '#94a3b8', 'raro': '#34d399', 'epico': '#c084fc', 'lendario': '#fbbf24', 'mitico': '#ef4444', 'secreto': '#334155', 'divino': '#f59e0b', 'aurudo': '#fef08a', 'vandalo': '#10b981', 'bestial': '#7f1d1d' };
        const borderColor = colors[rarity.id] || '#ffffff';

        let eventsText = "Qualquer Clima";
        if (fish.events && fish.events.length > 0) {
            if (fish.events.includes("all")) { eventsText = "Durante Eventos"; } 
            else if (fish.events.includes("none")) { eventsText = "Clima Normal"; }
            else { eventsText = fish.events.map(e => e.toUpperCase()).join(", "); }
        }

        const box = document.createElement('div');
        box.style.cssText = `position: relative; background: radial-gradient(circle at top right, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95)); padding: 50px 40px; border-radius: 24px; text-align: center; max-width: 650px; width: 90%; box-shadow: 0 30px 60px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 40px ${borderColor}22; transform: scale(0.95) translateY(20px); transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-top: 2px solid ${borderColor};`;
        
        let imgDisplayWidth = rarity.id === 'bestial' ? '450px' : '380px';
        let filterEff = rarity.id === 'bestial' ? 'drop-shadow(0 0 40px rgba(127,29,29,0.8))' : (rarity.id === 'vandalo' ? 'drop-shadow(0 0 20px rgba(16,185,129,0.8))' : 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))');

        box.innerHTML = `
            <button id="close-detail-btn" style="position:absolute; top:20px; right:25px; background:none; border:none; color: rgba(255,255,255,0.4); font-size:2.5rem; cursor:pointer; transition:0.2s; padding:0; line-height:1;">&times;</button>
            
            <div style="position:relative; display:inline-block; margin-bottom:30px; animation: floatItem 4s ease-in-out infinite; will-change: transform; transform: translateZ(0);">
                <img src="${fish.image}" style="max-width:${imgDisplayWidth}; max-height:${imgDisplayWidth}; object-fit:contain; filter:${filterEff};">
                ${seal}
            </div>
            
            <h2 style="color:#f8fafc; font-family:'Fredoka', sans-serif; font-size:3rem; margin:0; text-shadow:0 4px 10px rgba(0,0,0,0.8); line-height: 1.1;">${fish.name}</h2>
            <div style="font-size:1.1rem; font-weight:800; margin-bottom:30px; margin-top:8px; text-transform:uppercase; letter-spacing: 4px; color: ${borderColor}; text-shadow: 0 0 15px ${borderColor}66;">${rarity.name}</div>
            
            <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:15px; color:#cbd5e1; font-size:0.9rem; font-family:'Poppins', sans-serif;">
                <div style="background:rgba(0,0,0,0.6); padding:12px 20px; border-radius:12px; border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">📊 Pescados: <b style="color:white; font-size: 1.1rem; margin-left: 5px;">${count}</b></div>
                <div style="background:rgba(0,0,0,0.6); padding:12px 20px; border-radius:12px; border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">🕒 Hábito: <b style="color:white; font-size: 1.1rem; margin-left: 5px;">${fish.time === 'day' ? '☀️ Dia' : (fish.time === 'night' ? '🌙 Noite' : '🌗 Ambos')}</b></div>
                <div style="background:rgba(0,0,0,0.6); padding:12px 20px; border-radius:12px; border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">🌪️ Clima: <b style="color:#38bdf8; font-size: 1.1rem; margin-left: 5px;">${eventsText}</b></div>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        const closeBtn = document.getElementById('close-detail-btn');
        closeBtn.onmouseover = () => { closeBtn.style.color = '#fff'; closeBtn.style.transform = 'scale(1.2)'; };
        closeBtn.onmouseout = () => { closeBtn.style.color = 'rgba(255,255,255,0.4)'; closeBtn.style.transform = 'scale(1)'; };

        requestAnimationFrame(() => { overlay.style.opacity = '1'; box.style.transform = 'scale(1) translateY(0)'; });
        const closeDetail = () => { overlay.style.opacity = '0'; box.style.transform = 'scale(0.95) translateY(20px)'; setTimeout(() => overlay.remove(), 400); };
        closeBtn.addEventListener('click', closeDetail);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDetail(); });
    };

    function getCollectionColor(rarityId) {
        const colors = { 'comum': '#94a3b8', 'raro': '#34d399', 'epico': '#c084fc', 'lendario': '#fbbf24', 'mitico': '#ef4444', 'secreto': '#334155', 'divino': '#f59e0b', 'aurudo': '#fef08a', 'vandalo': '#10b981', 'bestial': '#7f1d1d' };
        return colors[rarityId] || '#fff';
    }

    window.renderCollection = function() {
        if (!window.RARITIES) return;
        const grid = safeGet('collection-grid'); if(!grid) return; 
        grid.innerHTML = ''; let t=0, u=0;
        const fragment = document.createDocumentFragment();

        Object.values(window.RARITIES).forEach(r => { 
            r.variations.forEach(f => { t++; const c = window.GAME_STATE.collection[f.name] || 0; if(c>0) u++; createCard(fragment, f, r, c, false); }); 
        });
        
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; padding: 20px; background: url("/img/asset/bg-dark-pattern.png") repeat, #020617; align-items: stretch; max-height: 65vh; overflow-y: auto;';
        grid.appendChild(fragment);
        if(safeGet('collection-progress')) safeGet('collection-progress').innerText = `(${u}/${t})`;
    };

    window.renderCollection67 = function() {
        if (!window.RARITIES) return;
        const grid = safeGet('collection-67-grid'); if(!grid) return; 
        grid.innerHTML = ''; let t=0, u=0;
        const fragment = document.createDocumentFragment();

        Object.values(window.RARITIES).forEach(r => { 
            r.variations.forEach(f => { t++; const c = window.GAME_STATE.collection67[f.name] || 0; if(c>0) u++; createCard(fragment, f, r, c, true); }); 
        });

        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; padding: 20px; background: url("/img/asset/bg-dark-pattern.png") repeat, #020617; align-items: stretch; max-height: 65vh; overflow-y: auto;';
        grid.appendChild(fragment);
        if(safeGet('collection-67-progress')) safeGet('collection-67-progress').innerText = `(${u}/${t})`;
    };

    window.renderScrapCollection = function() {
        if (!window.SUCATAS) return;
        const grid = safeGet('collection-scrap-grid'); if(!grid) return; 
        grid.innerHTML = ''; let t=0, u=0;
        const fragment = document.createDocumentFragment();
        
        window.SUCATAS.forEach(scrap => { 
            t++; const count = window.GAME_STATE.scrapCollection[scrap.id] || 0; if(count > 0) u++; 
            const isUnlocked = count > 0; 
            const div = document.createElement('div'); 
            div.className = `modern-collection-card ${isUnlocked ? 'unlocked' : ''}`;
            div.style.setProperty('--card-color', '#64748b');
            
            div.innerHTML = `
                ${isUnlocked ? `<div style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.8); color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.7rem; font-weight: bold; border: 1px solid rgba(255,255,255,0.2);">x${count}</div>` : ''}
                <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                    <img src="${scrap.image}" loading="lazy" style="width: 70px; height: 70px; object-fit: contain; margin: 10px opacity: ${isUnlocked ? '1' : '0.2'}; filter: grayscale(0.5) sepia(0.5);">
                    <div style="font-size: 0.8rem; font-weight: 700; color: ${isUnlocked ? '#f8fafc' : '#475569'}; font-family: 'Poppins', sans-serif; line-height: 1.2; margin-bottom: 5px; word-wrap: break-word; width: 100%;">${scrap.name}</div>
                    <div style="font-size: 0.65rem; color: ${isUnlocked ? '#ef4444' : '#334155'}; font-weight: 800; text-transform: uppercase;">Lixo</div>
                </div>
            `;
            fragment.appendChild(div);
        });

        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; padding: 20px; background: url("/img/asset/bg-dark-pattern.png") repeat, #020617; align-items: stretch; max-height: 65vh; overflow-y: auto;';
        grid.appendChild(fragment);
        if(safeGet('collection-scrap-progress')) safeGet('collection-scrap-progress').innerText = `(${u}/${t})`;
    };

    function createCard(container, fish, rarity, count, is67) {
        const isUnlocked = count > 0; 
        const div = document.createElement('div'); 
        div.className = `modern-collection-card ${isUnlocked ? 'unlocked' : ''} ${is67 ? 'special-67' : ''}`;
        
        const cardColor = getCollectionColor(rarity.id);
        div.style.setProperty('--card-color', cardColor);

        let seal = ''; 
        if(is67 && isUnlocked) { 
            const s = (rarity.id==='bestial' || rarity.id==='vandalo') ? '/img/asset/67muitoraro.webp' : (rarity.id==='comum'||rarity.id==='raro')?'/img/asset/67comum.jpeg':(rarity.id==='epico'||rarity.id==='lendario')?'/img/asset/67raro.png':'/img/asset/67muitoraro.webp'; 
            seal = `<img src="${s}" loading="lazy" style="position: absolute; bottom: 35px; right: 5px; width: 35px; height: 35px; transform: rotate(15deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">`; 
        }

        let timeIcon = fish.time === 'day' ? '☀️' : (fish.time === 'night' ? '🌙' : '🌗');

        div.innerHTML = `
            ${isUnlocked ? `<div style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.8); color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.7rem; font-weight: bold; border: 1px solid ${cardColor}66;">x${count}</div>` : ''}
            <div style="position: absolute; top: 5px; left: 5px; font-size: 1rem; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8)); background: rgba(0,0,0,0.5); padding: 2px 5px; border-radius: 50%;">${timeIcon}</div>
            
            <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; margin-top: 15px;">
                <img src="${fish.image}" loading="lazy" style="width: 80px; height: 80px; object-fit: contain; margin: 0 auto 10px auto; opacity: ${isUnlocked ? '1' : '0.1'}; filter: drop-shadow(0 5px 8px rgba(0,0,0,0.6));">
                ${seal}
                <div style="font-size: 0.8rem; font-weight: 700; color: ${isUnlocked ? '#f8fafc' : '#475569'}; font-family: 'Poppins', sans-serif; line-height: 1.2; margin-bottom: 5px; word-wrap: break-word; width: 100%;">${fish.name}</div>
                <div style="font-size: 0.65rem; color: ${isUnlocked ? cardColor : '#334155'}; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">${rarity.name}</div>
            </div>
        `;
        if (isUnlocked) { 
            div.style.cursor = 'pointer'; 
            div.addEventListener('click', () => window.showFishDetail(fish, rarity, count, is67)); 
        }
        container.appendChild(div);
    }

    const canvas = safeGet('bg-canvas');
    const ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null; 
    const fishes = [];

    function resizeCanvas() { if(canvas){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }
    window.addEventListener('resize', resizeCanvas); resizeCanvas();

    class SwimmingFish {
        constructor() { this.reset(true); }
        reset(initial = false) {
            const rands = Math.random(); let r = window.RARITIES ? window.RARITIES.COMUM : null;
            if (!r) return;
            
            if (window.currentEventID === 'mar_bestas' && rands < 0.15) {
                r = window.RARITIES.BESTIAL;
            }
            else if (window.currentEventID === 'abismo_lixo' && rands < 0.15) {
                r = window.RARITIES.VANDALO;
            }
            else if(rands < 0.005) r = window.RARITIES.AURUDO; 
            else if(rands < 0.005) r = window.RARITIES.DIVINO; 
            else if(rands < 0.01) r = window.RARITIES.SECRETO; 
            else if(rands < 0.03) r = window.RARITIES.MITICO; 
            else if(rands < 0.08) r = window.RARITIES.LENDARIO; 
            else if(rands < 0.20) r = window.RARITIES.EPICO; 
            else if(rands < 0.40) r = window.RARITIES.RARO;
            
            const valid = r.variations.filter(v => v.time === 'all' || (window.GAME_STATE.isDay && v.time === 'day') || (!window.GAME_STATE.isDay && v.time === 'night'));
            if (valid.length === 0) return; 
            this.specificImage = valid[Math.floor(Math.random() * valid.length)].image;
            this.depth = Math.random(); this.direction = Math.random() > 0.5 ? 1 : -1;
            this.y = canvas ? Math.random() * (canvas.height - 200) + 200 : 300;
            
            let baseWidth = r.id === 'bestial' ? 500 : (40 + Math.min(60, r.mult * 0.8));
            this.width = baseWidth * (0.4 + (this.depth * 0.6));
            
            this.x = initial && canvas ? Math.random() * canvas.width : (this.direction === 1 ? -this.width-100 : (canvas ? canvas.width + this.width+100 : 2000));
            this.speed = (0.5 + (this.depth * 1.5)) * this.direction; 
            this.opacity = r.id === 'bestial' ? (0.4 + (this.depth * 0.4)) : (0.1 + (this.depth * 0.4));
        }
        update() { 
            this.x += (this.speed * (window.eventBgSpeedMult || 1)); 
            if (canvas && ((this.direction === 1 && this.x > canvas.width + this.width + 100) || (this.direction === -1 && this.x < -this.width - 100))) this.reset(); 
        }
        draw() {
            if(!ctx || !this.specificImage) return; 
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

    class DustParticle {
        constructor() { this.reset(true); }
        reset(initial) {
            this.x = canvas ? Math.random() * canvas.width : Math.random() * 2000;
            this.y = initial && canvas ? Math.random() * canvas.height : (canvas ? canvas.height + 10 : 1000);
            this.size = Math.random() * 4 + 1;
            this.speedY = -(Math.random() * 0.8 + 0.2);
            this.speedX = (Math.random() - 0.5) * 1.0;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < -20) this.reset(false);
        }
        draw() {
            if (!ctx) return;
            ctx.fillStyle = `rgba(160, 150, 140, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class DriftingTrash {
        constructor() { this.reset(true); }
        reset(initial) {
            if(!window.SUCATAS || window.SUCATAS.length === 0) return;
            this.imageSrc = window.SUCATAS[Math.floor(Math.random() * window.SUCATAS.length)].image;
            this.size = Math.random() * 80 + 40;
            this.x = initial && canvas ? Math.random() * canvas.width : -this.size - 50;
            this.y = canvas ? Math.random() * (canvas.height - 100) + 100 : Math.random() * 1000;
            this.speedX = Math.random() * 0.8 + 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.01;
            this.depth = Math.random(); 
            this.opacity = 0.05 + (this.depth * 0.25);
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotSpeed;
            if (canvas && this.x > canvas.width + this.size) {
                this.x = -this.size - 50;
                this.y = Math.random() * canvas.height;
            }
        }
        draw() {
            if (!ctx || !this.imageSrc) return;
            const img = window.GAME_STATE.loadedImages[this.imageSrc];
            if (!img) return;
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.filter = 'grayscale(0.9) sepia(0.6) hue-rotate(-20deg) brightness(0.4)';
            ctx.drawImage(img, -this.size/2, -this.size/2, this.size, this.size);
            ctx.restore();
        }
    }

    for (let i = 0; i < 10; i++) { fishes.push(new SwimmingFish()); }
    const dustParticles = Array.from({length: 120}, () => new DustParticle());
    const bgTrash = Array.from({length: 15}, () => new DriftingTrash());

    function animateBg() { 
        if(ctx && canvas && !document.hidden) { 
            if (window.currentEventID === 'abismo_lixo') {
                ctx.fillStyle = '#1c1515';
            } else {
                ctx.fillStyle = window.GAME_STATE.isDay ? '#0288D1' : '#0f172a'; 
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height); 

            if (window.currentEventID === 'abismo_lixo') {
                bgTrash.forEach(t => { t.update(); t.draw(); });
                dustParticles.forEach(d => { d.update(); d.draw(); });
            }
            fishes.forEach(f => { f.update(); f.draw(); }); 
        } 
        requestAnimationFrame(animateBg); 
    }
    
    setInterval(() => { 
        window.GAME_STATE.isDay = !window.GAME_STATE.isDay; 
        const gc = safeGet('game-container'); if(gc) gc.className = window.GAME_STATE.isDay ? 'day-mode' : 'night-mode'; 
        const ti = safeGet('time-indicator'); if(ti) ti.innerText = window.GAME_STATE.isDay ? "☀️ Dia" : "🌙 Noite"; 
    }, 45000);
    setTimeout(() => { window.updateUI(); if(canvas) animateBg(); }, 500);

    window.SushiMode = {
        pendingSushi: null, 
        targets: [],
        cuts: [],
        maxCuts: 4,
        isRotten: false,

        init: function() {
            if (document.getElementById('sushi-modal')) return;

            const style = document.createElement('style');
            style.innerHTML = `
                #sushi-modal .modal-content { background: #111827; border: none; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); border-radius: 20px; overflow: hidden; padding: 0; }
                
                .sushi-board-bg {
                    background: linear-gradient(90deg, #1f1107 0%, #3e2211 50%, #1f1107 100%);
                    background-image: repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 21px);
                    box-shadow: inset 0 20px 30px rgba(0,0,0,0.8);
                }

                .sushi-card-modern {
                    background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 15px 10px; text-align: center; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.5); position: relative; display: flex; flex-direction: column; justify-content: space-between;
                }
                .sushi-card-modern:hover { border-color: #ef4444; transform: translateY(-4px); box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2); }
                .sushi-btn-cut { background: #dc2626; color: white; border: none; padding: 10px 15px; border-radius: 8px; font-weight: 700; cursor: pointer; margin-top: 10px; font-family: 'Poppins', sans-serif; transition: 0.2s; width: 100%; text-transform: uppercase; letter-spacing: 1px;}
                .sushi-btn-cut:hover { background: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
                .sushi-btn-cut:active { transform: translateY(2px); box-shadow: none; }
                .sushi-reward-preview { font-size: 0.75rem; color: #94a3b8; margin-top: 10px; font-weight: 600; line-height: 1.4; background: rgba(0,0,0,0.4); padding: 5px; border-radius: 6px;}
            `;
            document.head.appendChild(style);

            const modal = document.createElement('div');
            modal.id = 'sushi-modal';
            modal.className = 'modal hidden';
            modal.style.zIndex = '99999'; 
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 900px; width: 95%;">
                    <div style="background: rgba(0,0,0,0.8); padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #dc2626;">
                        <div>
                            <h2 style="margin: 0; color: #f8fafc; font-family: 'Fredoka', sans-serif; font-size: 1.8rem; display: flex; align-items: center; gap: 10px;">🍣 Cozinha do Mestre</h2>
                            <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 0.85rem; font-family: 'Poppins', sans-serif;">Fatie os peixes. Cuidado com carne estragada e procure os pontos vitais!</p>
                        </div>
                        <button onclick="document.getElementById('sushi-modal').classList.add('hidden')" style="background: none; border: none; color: #64748b; font-size: 2rem; cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#64748b'">&times;</button>
                    </div>
                    
                    <div style="padding: 15px 30px; background: #0f172a; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                        <h3 id="sushi-knife-title" style="margin:0; color:#ef4444; font-family:'Fredoka', sans-serif; font-size: 1.2rem;">🔪 Faca: Nenhuma</h3>
                        <span style="color: #64748b; font-size: 0.8rem; font-family: 'Poppins', sans-serif;">Melhore a faca na Forja para aumentar os saques.</span>
                    </div>

                    <div id="sushi-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; padding: 30px; max-height: 60vh; overflow-y: auto;" class="sushi-board-bg custom-scrollbar"></div>
                </div>
            `;
            document.body.appendChild(modal);

            const miniModal = document.createElement('div');
            miniModal.id = 'sushi-minigame-modal';
            miniModal.className = 'modal hidden';
            miniModal.style.zIndex = '999999'; 
            miniModal.innerHTML = `
                <div class="modal-content sushi-board-bg" style="max-width: 500px; border: 4px solid #78350f; box-shadow: 0 0 50px rgba(0,0,0,0.9); border-radius: 12px; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 10px;">
                        <h2 style="color: #f8fafc; font-family: 'Fredoka'; margin: 0; font-size: 1.5rem;">🔪 Filetagem Tática</h2>
                        <button onclick="document.getElementById('sushi-minigame-modal').classList.add('hidden'); document.getElementById('sushi-modal').classList.remove('hidden'); window.SushiMode.pendingSushi = null;" style="background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;">&times;</button>
                    </div>
                    
                    <p style="color: #cbd5e1; text-align: center; margin-bottom: 20px; font-size: 0.9rem; font-family: 'Poppins', sans-serif;">Corte passando a faca pelos <strong style="color:#ef4444;">Pontos Vitais (Alvos)</strong>.</p>
                    
                    <div id="sushi-cut-area" style="position: relative; width: 300px; height: 300px; margin: 0 auto; border-radius: 8px; cursor: crosshair;">
                        <img id="sushi-cut-img" src="" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none; filter: drop-shadow(0 20px 20px rgba(0,0,0,0.8)); transition: transform 0.1s;">
                        <canvas id="sushi-cut-canvas" width="300" height="300" style="position: absolute; top:0; left:0; z-index: 10;"></canvas>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <span id="sushi-cut-counter" style="background: rgba(0,0,0,0.6); padding: 10px 20px; border-radius: 20px; color: #ef4444; font-size: 1.5rem; font-weight: 800; font-family: 'Poppins', sans-serif; border: 1px solid rgba(239, 68, 68, 0.3);">0 / 4 Cortes</span>
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
                'aurudo': { coins: 10000000, mats: ['poeira_cosmica'], matQty: 5 },
                'vandalo': { coins: 25000000, mats: ['tecido_magico', 'uranio_vazado'], matQty: 8 },
                'bestial': { coins: 50000000, mats: ['tecido_realidade'], matQty: 10 } 
            };
            return tables[rarityId] || tables['comum'];
        },

        renderGrid: function() {
            const grid = document.getElementById('sushi-grid');
            if(!grid || !window.KNIVES) return;
            grid.innerHTML = '';
            
            const fragment = document.createDocumentFragment();
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
                        let foundRarity = null, foundFish = null;
                        Object.values(window.RARITIES).forEach(r => {
                            const f = r.variations.find(v => v.name === fishName);
                            if (f) { foundRarity = r; foundFish = f; }
                        });
                        if (!foundFish) return;

                        const lootPreview = this.getLootTable(foundRarity.id);
                        let expectedCoins = Math.floor(lootPreview.coins * multiplier);
                        let expectedMats = Math.floor(lootPreview.matQty * multiplier);
                        if (is67) { expectedCoins *= 3; expectedMats *= 2; }
                        
                        let matPreviewText = dropsMats ? `<div style="color:#34d399; margin-top:3px;">📦 +${expectedMats} Mat. Tier ${foundRarity.name}</div>` : `<div style="color:#ef4444; margin-top:3px;">❌ Faca cega (Sem Mats)</div>`;
                        const div = document.createElement('div');
                        div.className = 'sushi-card-modern';
                        const safeFishName = fishName.replace(/'/g, "\\'").replace(/"/g, '&quot;');

                        div.innerHTML = `
                            <div style="position: absolute; top: -5px; right: -5px; background: #0f172a; color: #f8fafc; border-radius: 8px; padding: 2px 8px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 2px 5px rgba(0,0,0,0.5);">Estoque: ${count}</div>
                            <img src="${foundFish.image}" loading="lazy" style="width: 70px; height: 70px; object-fit: contain; margin: 10px auto; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.6));">
                            
                            <div style="font-size: 0.9rem; font-weight: 700; color: #f8fafc; line-height: 1.2; height: 35px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif;">${fishName} ${is67 ? '🏆' : ''}</div>
                            
                            <div class="sushi-reward-preview">
                                <span style="color:#fbbf24;">🪙 +${expectedCoins.toLocaleString()}</span>
                                ${matPreviewText}
                            </div>
                            
                            <button class="sushi-btn-cut" onclick="window.SushiMode.startMinigame('${safeFishName}', ${is67}, '${foundRarity.id}', '${foundFish.image}')">Filetar</button>
                        `;
                        fragment.appendChild(div);
                    }
                });
            };

            if (window.GAME_STATE && window.RARITIES) { addFishCards(window.GAME_STATE.collection, false); addFishCards(window.GAME_STATE.collection67, true); }
            
            if (hasFish) { grid.appendChild(fragment); } 
            else { grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 50px; font-size: 1.2rem; font-family: Poppins, sans-serif; background: rgba(0,0,0,0.4); border-radius: 12px;">A despensa está vazia. Volte a pescar para abastecer o restaurante!</div>'; }
        },

        distPointToSegment: function(px, py, x1, y1, x2, y2) {
            const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
            if (l2 === 0) return Math.hypot(px - x1, py - y1);
            let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
            t = Math.max(0, Math.min(1, t));
            return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
        },

        drawCanvas: function(ctx, canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.targets.forEach(t => {
                if (!t.hit) {
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, 20, 0, Math.PI*2);
                    ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, 6, 0, Math.PI*2);
                    ctx.fillStyle = '#ef4444';
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, 15, 0, Math.PI*2);
                    ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(t.x - 5, t.y); ctx.lineTo(t.x + 5, t.y);
                    ctx.moveTo(t.x, t.y - 5); ctx.lineTo(t.x, t.y + 5);
                    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
                }
            });

            this.cuts.forEach(cut => {
                ctx.beginPath(); ctx.moveTo(cut.x1, cut.y1); ctx.lineTo(cut.x2, cut.y2);
                ctx.strokeStyle = "rgba(239, 68, 68, 0.8)"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cut.x1, cut.y1); ctx.lineTo(cut.x2, cut.y2);
                ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();
            });
        },

        setupCanvas: function() {
            const canvas = document.getElementById('sushi-cut-canvas');
            const ctx = canvas.getContext('2d');
            let isDragging = false;
            let startX = 0, startY = 0;

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
                if (dist > 30) {
                    
                    this.targets.forEach(t => {
                        if (!t.hit) {
                            const hitDist = this.distPointToSegment(t.x, t.y, startX, startY, endX, endY);
                            if (hitDist < 25) { 
                                t.hit = true;
                            }
                        }
                    });

                    this.cuts.push({x1: startX, y1: startY, x2: endX, y2: endY});
                    this.drawCanvas(ctx, canvas);

                    document.getElementById('sushi-cut-counter').innerText = `${this.cuts.length} / ${this.maxCuts} Cortes`;
                    document.getElementById('sushi-cut-img').style.transform = `scale(${1 + (this.cuts.length * 0.05)})`;

                    if (this.cuts.length >= this.maxCuts) { 
                        setTimeout(() => { window.SushiMode.finishMinigame(); }, 400); 
                    }
                }
            };

            canvas.addEventListener('mousedown', startCut);
            canvas.addEventListener('mouseup', endCut);
            canvas.addEventListener('mouseleave', () => { isDragging = false; });
            canvas.addEventListener('touchstart', startCut, {passive: true});
            canvas.addEventListener('touchend', endCut, {passive: true});

            this.resetCanvas = () => {
                this.cuts = [];
                this.targets = [];
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                document.getElementById('sushi-cut-counter').innerText = `0 / ${this.maxCuts} Cortes`;
                document.getElementById('sushi-cut-img').style.transform = `scale(1)`;
            };
        },

        startMinigame: function(fishName, is67, rarityId, imageSrc) {
            this.pendingSushi = { fishName, is67, rarityId };
            document.getElementById('sushi-modal').classList.add('hidden'); 
            this.resetCanvas();
            
            this.isRotten = Math.random() < 0.15;
            
            const imgEl = document.getElementById('sushi-cut-img');
            imgEl.src = imageSrc;
            
            if (this.isRotten) {
                imgEl.classList.add('rotten-fish');
                window.showToast("Alerta Biológico", "Este peixe tem uma cor estranha. Cuidado, pode estar podre!", "warning");
            } else {
                imgEl.classList.remove('rotten-fish');
            }

            for(let i=0; i<3; i++) {
                this.targets.push({
                    x: 60 + Math.random() * 180,
                    y: 60 + Math.random() * 180,
                    hit: false
                });
            }

            const canvas = document.getElementById('sushi-cut-canvas');
            this.drawCanvas(canvas.getContext('2d'), canvas);

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

            const hits = this.targets.filter(t => t.hit).length;
            const requiredHits = 2; 

            if (hits < requiredHits) {
                window.GAME_STATE.materials['restos_comida'] = (window.GAME_STATE.materials['restos_comida'] || 0) + 1;
                if(window.updateUI) window.updateUI(); if(window.saveGame) window.saveGame();
                if(window.showToast) window.showToast("Corte Arruinado!", `Você falhou os pontos vitais e destruiu a carne.\nExtraído: 📦 +1 Restos de Comida`, "error");
            } 
            else if (this.isRotten) {
                window.GAME_STATE.materials['geleia_estranha'] = (window.GAME_STATE.materials['geleia_estranha'] || 0) + 1;
                if(window.updateUI) window.updateUI(); if(window.saveGame) window.saveGame();
                if(window.showToast) window.showToast("Peixe Podre!", `Você fez um bom corte, mas o peixe estava doente.\nIsolado: 🦠 +1 Geleia Estranha`, "warning");
            } 
            else {
                const currentKnifeId = window.GAME_STATE.currentKnife || 'faca_cozinha';
                const knifeData = window.KNIVES.find(k => k.id === currentKnifeId) || window.KNIVES[0];
                let multiplier = knifeData.mult;
                
                if (hits === 3) multiplier *= 1.5;

                const dropsMats = knifeData.dropsMats;
                const loot = this.getLootTable(rarityId);
                
                let coinReward = Math.floor(loot.coins * multiplier);
                let matRewardQty = Math.floor(loot.matQty * multiplier);
                
                if (is67) { coinReward *= 3; matRewardQty *= 2; }
                const matRewardId = loot.mats[Math.floor(Math.random() * loot.mats.length)]; 

                window.GAME_STATE.coins += coinReward;
                let rewardMessage = `🪙 +${coinReward.toLocaleString()} Moedas`;

                if (dropsMats) {
                    window.GAME_STATE.materials[matRewardId] = (window.GAME_STATE.materials[matRewardId] || 0) + matRewardQty;
                    let matIcon = '📦'; let matName = matRewardId;
                    if (window.CRAFTING_DB && window.CRAFTING_DB.materials) {
                        const matInfo = window.CRAFTING_DB.materials.find(m => m.id === matRewardId);
                        if (matInfo) { matIcon = matInfo.icon; matName = matInfo.name; }
                    }
                    rewardMessage += `\n${matIcon} +${matRewardQty.toLocaleString()} ${matName}`;
                } else { rewardMessage += `\n❌ Faca fraca (Sem materiais)`; }

                if (hits === 3) rewardMessage = `⭐ CORTE PERFEITO! BÓNUS x1.5!\n` + rewardMessage;

                if(window.updateUI) window.updateUI(); if(window.saveGame) window.saveGame();
                if(window.showToast) window.showToast("Prato Concluído!", `O ${fishName} rendeu:\n\n${rewardMessage}`, "success");
            }

            this.renderGrid();
            document.getElementById('sushi-modal').classList.remove('hidden'); 
        }
    };
    
    window.SushiMode.init();
}
carregarBancoDeDadosEIniciar();