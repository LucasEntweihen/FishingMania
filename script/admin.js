/* ==========================================================================
   PAINEL DE MESTRE (GOD MODE) — BLINDADO E AUTÓNOMO
   Visível APENAS para usuários cujo uid está validado como ADM no Firebase.
   Toda mutação é persistida via window.saveGame() (Dual-Layer: LS + RTDB).
   ========================================================================== */

   (function () {

    // -------------------------------------------------------------------------
    // 1. ITENS EXCLUSIVOS ADM (IDs canônicos — espelhados no script.js)
    // -------------------------------------------------------------------------
    const ADM_ROD_ID   = 9999;
    const ADM_HOOK_ID  = 'anzol_adm_supremo';

    // Definição da Vara Exclusiva ADM — injetada em ROD_TEMPLATES em runtime
    const ADM_ROD_DEF = {
        id:    ADM_ROD_ID,
        name:  '👑 Vara do Administrador',
        type:  'divino',
        price: 0,
        speed: 999.0,
        luck:  9999999,
        lore:  '⚙️ Controle do Servidor. ✨ Exclusiva para Desenvolvedores.'
    };

    // Definição do Anzol Exclusivo ADM — injetado em HOOKS em runtime
    // power: 0.90 = 90% de chance ao usar o sintonizador de raridade
    const ADM_HOOK_DEF = {
        id:     ADM_HOOK_ID,
        name:   '👑 Anzol do Administrador',
        color:  '#ef4444',
        target: 'bestial',
        power:  0.90,
        lore:   '⚙️ Sintoniza qualquer raridade com 90% de eficácia. Não está na loja.'
    };

    // -------------------------------------------------------------------------
    // 2. CONSTRUTOR DO MODAL (lazy — só monta quando aberto pela 1ª vez)
    // -------------------------------------------------------------------------
    function buildAdminModal() {
        if (document.getElementById('admin-modal')) return document.getElementById('admin-modal');

        const style = document.createElement('style');
        style.innerHTML = `
            #admin-modal {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.92); z-index: 99999999;
                display: none; justify-content: center; align-items: center;
                backdrop-filter: blur(18px); font-family: 'Poppins', sans-serif;
            }
            #admin-modal.active { display: flex; animation: admFadeIn 0.3s ease; }
            @keyframes admFadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }

            .admin-content {
                background: #09090b; width: 95%; max-width: 860px;
                border: 2px solid #ef4444; border-radius: 20px; padding: 30px;
                box-shadow: 0 0 60px rgba(239,68,68,0.35), inset 0 0 40px rgba(0,0,0,0.6);
                max-height: 88vh; overflow-y: auto;
            }
            .admin-header {
                display: flex; justify-content: space-between; align-items: center;
                border-bottom: 2px solid #3f3f46; padding-bottom: 15px; margin-bottom: 20px;
            }
            .admin-header h2 {
                color: #ef4444; font-family: 'Fredoka', sans-serif; margin: 0;
                font-size: 2rem; text-shadow: 0 0 12px rgba(239,68,68,0.6);
            }
            .admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            @media(max-width:600px) { .admin-grid { grid-template-columns: 1fr; } }
            .admin-box {
                background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px;
            }
            .admin-box h3 { color: #fca5a5; font-family: 'Fredoka', sans-serif; margin-top: 0; margin-bottom: 15px; }
            .admin-btn {
                display: block; width: 100%; background: #27272a; color: #f8fafc;
                border: 1px solid #ef4444; border-radius: 8px; padding: 10px 14px;
                margin-bottom: 10px; font-weight: 700; cursor: pointer;
                transition: background 0.2s, transform 0.15s; font-family: 'Poppins', sans-serif;
                font-size: 0.88rem; text-align: left;
            }
            .admin-btn:last-child { margin-bottom: 0; }
            .admin-btn:hover { background: #ef4444; color: #fff; transform: scale(1.02); }
            .admin-btn.blue  { border-color: #3b82f6; } .admin-btn.blue:hover  { background: #3b82f6; }
            .admin-btn.gold  { border-color: #fbbf24; } .admin-btn.gold:hover  { background: #fbbf24; color: #000; }
            .admin-btn.green { border-color: #10b981; } .admin-btn.green:hover { background: #10b981; }
            .admin-btn.purple{ border-color: #a855f7; } .admin-btn.purple:hover{ background: #a855f7; }
            .admin-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
        `;
        document.head.appendChild(style);

        const modal = document.createElement('div');
        modal.id = 'admin-modal';
        modal.innerHTML = `
            <div class="admin-content custom-scrollbar">
                <div class="admin-header">
                    <h2>👑 Painel do Mestre</h2>
                    <button id="close-admin-btn"
                        style="background:none;border:none;color:#fff;font-size:2.2rem;cursor:pointer;line-height:1;"
                    >&times;</button>
                </div>

                <div class="admin-grid">

                    <!-- COLUNA A: MODO DEUS (ação única, tudo de uma vez) -->
                    <div class="admin-box" style="grid-column: 1 / -1; border-color: #fbbf24;">
                        <h3 style="color:#fbbf24;">⚡ Modo Deus — Ativação Completa</h3>
                        <button class="admin-btn gold" id="adm-btn-god-mode">
                            ⚡ ATIVAR MODO DEUS COMPLETO
                            <span style="font-size:0.75rem;opacity:0.7;display:block;margin-top:2px;">
                                Peixes · Sucatas · Equipamentos · Iscas · Moedas · Orbes · Materiais · Catalisadores · Itens Exclusivos
                            </span>
                        </button>
                    </div>

                    <!-- COLUNA 1: Economia -->
                    <div class="admin-box">
                        <h3>💰 Economia</h3>
                        <button class="admin-btn gold" id="adm-btn-coins-10b">🪙 + 10 Bilhões de Moedas</button>
                        <button class="admin-btn gold" id="adm-btn-coins-1m">🪙 + 1 Milhão de Moedas</button>
                    </div>

                    <!-- COLUNA 2: Arsenal -->
                    <div class="admin-box">
                        <h3>⚔️ Arsenal</h3>
                        <button class="admin-btn green" id="adm-btn-unlock-arsenal">🔓 Desbloquear Todo o Arsenal</button>
                        <button class="admin-btn green" id="adm-btn-unlock-baits">🪱 Desbloquear Todas as Iscas</button>
                        <button class="admin-btn green" id="adm-btn-unlock-sushi">🍣 Desbloquear Sushi</button>
                    </div>

                    <!-- COLUNA 1: Estoque -->
                    <div class="admin-box">
                        <h3>📦 Estoque</h3>
                        <button class="admin-btn blue" id="adm-btn-materials">🧱 + 200 de Cada Material</button>
                        <button class="admin-btn blue" id="adm-btn-catalysts">⚗️ + 200 de Cada Catalisador</button>
                        <button class="admin-btn blue" id="adm-btn-orbs">🔮 + 5 de Cada Orbe</button>
                        <button class="admin-btn blue" id="adm-btn-scrap">🗑️ + 50 de Cada Sucata</button>
                    </div>

                    <!-- COLUNA 2: Aquário -->
                    <div class="admin-box">
                        <h3>🐟 Aquário</h3>
                        <button class="admin-btn blue" id="adm-btn-fish-normal">🐠 + 50 de Cada Peixe (Normal)</button>
                        <button class="admin-btn blue" id="adm-btn-fish-67">🏆 + 50 de Cada Peixe (67cm)</button>
                    </div>

                    <!-- COLUNA 1: Itens Exclusivos -->
                    <div class="admin-box" style="border-color: #ef4444;">
                        <h3 style="color:#ef4444;">🔴 Itens Exclusivos ADM</h3>
                        <button class="admin-btn" id="adm-btn-adm-rod">👑 Injetar Vara do Administrador</button>
                        <button class="admin-btn" id="adm-btn-adm-hook">👑 Injetar Anzol do Administrador</button>
                    </div>

                    <!-- COLUNA 2: Controle Climático -->
                    <div class="admin-box">
                        <h3>🌪️ Controle Climático</h3>
                        <button class="admin-btn"        id="adm-evt-tempestade">⛈️ Forçar: Tempestade</button>
                        <button class="admin-btn gold"   id="adm-evt-ouro">✨ Forçar: Maré Dourada</button>
                        <button class="admin-btn"        id="adm-evt-frenesi">🦈 Forçar: Frenesi</button>
                        <button class="admin-btn purple" id="adm-evt-misticismo">🔮 Forçar: Nevoeiro Místico</button>
                        <button class="admin-btn green"  id="adm-evt-abismo">🗑️ Forçar: Abismo Vândalo</button>
                        <button class="admin-btn"        id="adm-evt-bestas">🐙 Forçar: Mar das Bestas</button>
                        <button class="admin-btn green"  id="adm-evt-stop">☀️ Parar Evento Atual</button>
                    </div>

                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // --- Fechar ---
        modal.querySelector('#close-admin-btn').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        // --- Bind: Modo Deus completo ---
        modal.querySelector('#adm-btn-god-mode').addEventListener('click', async () => {
            const btn = modal.querySelector('#adm-btn-god-mode');
            btn.disabled = true; btn.textContent = '⏳ Executando...';
            await window.adminGodModeComplete();
            btn.disabled = false; btn.innerHTML = '⚡ ATIVAR MODO DEUS COMPLETO';
        });

        // --- Bind: Economia ---
        modal.querySelector('#adm-btn-coins-10b').addEventListener('click', () => window.adminAddCoins(10_000_000_000));
        modal.querySelector('#adm-btn-coins-1m').addEventListener('click',  () => window.adminAddCoins(1_000_000));

        // --- Bind: Arsenal ---
        modal.querySelector('#adm-btn-unlock-arsenal').addEventListener('click', () => window.adminUnlockArsenal());
        modal.querySelector('#adm-btn-unlock-baits').addEventListener('click',   () => window.adminAddAllIscas(99));
        modal.querySelector('#adm-btn-unlock-sushi').addEventListener('click',   () => window.adminUnlockFeatures());

        // --- Bind: Estoque ---
        modal.querySelector('#adm-btn-materials').addEventListener('click',  () => window.adminAddAllMaterials(200));
        modal.querySelector('#adm-btn-catalysts').addEventListener('click',  () => window.adminAddAllCatalysts(200));
        modal.querySelector('#adm-btn-orbs').addEventListener('click',       () => window.adminAddAllOrbs(5));
        modal.querySelector('#adm-btn-scrap').addEventListener('click',      () => window.adminAddAllScrap(50));

        // --- Bind: Aquário ---
        modal.querySelector('#adm-btn-fish-normal').addEventListener('click', () => window.adminAddAllFishes(50, false));
        modal.querySelector('#adm-btn-fish-67').addEventListener('click',     () => window.adminAddAllFishes(50, true));

        // --- Bind: Exclusivos ---
        modal.querySelector('#adm-btn-adm-rod').addEventListener('click',  () => window.adminInjectAdmRod());
        modal.querySelector('#adm-btn-adm-hook').addEventListener('click', () => window.adminInjectAdmHook());

        // --- Bind: Eventos ---
        modal.querySelector('#adm-evt-tempestade').addEventListener('click',  () => _forceEvt('tempestade'));
        modal.querySelector('#adm-evt-ouro').addEventListener('click',         () => _forceEvt('ouro'));
        modal.querySelector('#adm-evt-frenesi').addEventListener('click',      () => _forceEvt('frenesi'));
        modal.querySelector('#adm-evt-misticismo').addEventListener('click',   () => _forceEvt('misticismo'));
        modal.querySelector('#adm-evt-abismo').addEventListener('click',       () => _forceEvt('abismo_lixo'));
        modal.querySelector('#adm-evt-bestas').addEventListener('click',       () => _forceEvt('mar_bestas'));
        modal.querySelector('#adm-evt-stop').addEventListener('click',         () => { if (window.stopEvent) window.stopEvent(); modal.classList.remove('active'); });

        return modal;
    }

    function _forceEvt(id) {
        if (window.forceEvent) window.forceEvent(id);
        const modal = document.getElementById('admin-modal');
        if (modal) modal.classList.remove('active');
    }

    // -------------------------------------------------------------------------
    // 3. BOTÃO FLUTUANTE — só injetado após validação
    // -------------------------------------------------------------------------
    function forceAdminButton() {
        if (document.getElementById('btn-modo-deus')) return;

        const btn = document.createElement('button');
        btn.id = 'btn-modo-deus';
        btn.innerHTML = '👑 ADM';
        btn.style.cssText = `
            position: fixed; bottom: 22px; right: 22px; z-index: 9999999;
            background: linear-gradient(135deg, #ef4444, #7f1d1d); color: white;
            border: 2px solid #fca5a5; padding: 11px 22px; border-radius: 12px;
            font-family: 'Fredoka', sans-serif; font-size: 1.15rem; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.5px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.7), 0 0 14px rgba(239,68,68,0.55);
            cursor: pointer; transition: all 0.25s cubic-bezier(0.25,0.8,0.25,1);
            display: flex; align-items: center; gap: 6px;
        `;
        btn.onmouseover = () => { btn.style.transform = 'scale(1.1) translateY(-4px)'; };
        btn.onmouseout  = () => { btn.style.transform = 'scale(1) translateY(0)'; };
        btn.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            const modal = buildAdminModal();
            modal.classList.toggle('active');
        };
        document.body.appendChild(btn);
    }

    // -------------------------------------------------------------------------
    // 4. LISTENERS DE VERIFICAÇÃO
    // -------------------------------------------------------------------------

    // Sinal primário: emitido por script.js após onAuthStateChanged confirmar o uid
    window.addEventListener('admin-verified', () => {
        forceAdminButton();
    });

    // Fallback: admin.js pode carregar depois do sinal — verifica o flag já setado
    if (typeof window.checkIsAdmin === 'function' && window.checkIsAdmin()) {
        forceAdminButton();
    }

    // Atalho de teclado secreto: Shift + M
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.shiftKey && (e.key === 'm' || e.key === 'M')) {
            if (typeof window.checkIsAdmin === 'function' && window.checkIsAdmin()) {
                e.preventDefault(); e.stopPropagation();
                const modal = buildAdminModal();
                modal.classList.toggle('active');
            }
        }
    });

})();

/* ==========================================================================
   FUNÇÕES DE MUTAÇÃO — TODAS PERSISTEM NO FIREBASE VIA saveGame()
   ========================================================================== */

// ---------------------------------------------------------------------------
// MODO DEUS COMPLETO — executa tudo de uma vez
// ---------------------------------------------------------------------------
window.adminGodModeComplete = async function () {
    if (!window.checkIsAdmin() || !window.GAME_STATE) return;

    // 1. Moedas
    window.GAME_STATE.coins = (window.GAME_STATE.coins || 0) + 10_000_000_000;

    // 2. Sushi
    window.GAME_STATE.sushiUnlocked = true;

    // 3. Peixes normais e 67
    if (window.RARITIES) {
        if (!window.GAME_STATE.collection)   window.GAME_STATE.collection   = {};
        if (!window.GAME_STATE.collection67) window.GAME_STATE.collection67 = {};
        Object.values(window.RARITIES).forEach(rarity => {
            rarity.variations.forEach(fish => {
                window.GAME_STATE.collection[fish.name]   = (window.GAME_STATE.collection[fish.name]   || 0) + 50;
                window.GAME_STATE.collection67[fish.name] = (window.GAME_STATE.collection67[fish.name] || 0) + 50;
            });
        });
    }

    // 4. Sucatas
    if (window.SUCATAS) {
        if (!window.GAME_STATE.scrapCollection) window.GAME_STATE.scrapCollection = {};
        window.SUCATAS.forEach(scrap => {
            window.GAME_STATE.scrapCollection[scrap.id] = (window.GAME_STATE.scrapCollection[scrap.id] || 0) + 50;
        });
    }

    // 5. Equipamentos completos (varas, pesos, anzóis, facas)
    if (window.ROD_TEMPLATES) window.GAME_STATE.ownedRods   = window.ROD_TEMPLATES.map(r => r.id);
    if (window.SINKERS)        window.GAME_STATE.ownedSinkers = window.SINKERS.map(s => s.id);
    if (window.HOOKS)          window.GAME_STATE.ownedHooks   = window.HOOKS.map(h => h.id);
    if (window.KNIVES)         window.GAME_STATE.ownedKnives  = window.KNIVES.map(k => k.id);

    // 6. Iscas completas
    if (window.BAITS) {
        if (!window.GAME_STATE.baitInventory) window.GAME_STATE.baitInventory = {};
        window.BAITS.forEach(b => {
            window.GAME_STATE.baitInventory[b.id] = (window.GAME_STATE.baitInventory[b.id] || 0) + 50;
        });
    }

    // 7. Orbes (5 de cada)
    if (!window.GAME_STATE.orbs) window.GAME_STATE.orbs = {};
    ['ritual_tempestade','ritual_ouro','ritual_frenesi','ritual_misticismo','ritual_abismo','ritual_bestas'].forEach(id => {
        window.GAME_STATE.orbs[id] = (window.GAME_STATE.orbs[id] || 0) + 5;
    });

    // 8. Materiais (200 de cada — todos com price > 0)
    if (window.MATERIALS) {
        if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
        window.MATERIALS.forEach(mat => {
            if (mat.price > 0) {
                window.GAME_STATE.materials[mat.id] = (window.GAME_STATE.materials[mat.id] || 0) + 200;
            }
        });
    }

    // 9. Catalisadores (200 de cada) — buscados na categoria "boost" do MATERIALS
    _injectCatalysts(200);

    // 10. Itens exclusivos ADM
    _injectAdmRodToState();
    _injectAdmHookToState();

    // Persiste tudo de uma vez
    if (typeof window.updateUI  === 'function') window.updateUI();
    if (typeof window.saveGame  === 'function') await window.saveGame();
    if (window.showToast) window.showToast('⚡ Modo Deus Ativado', 'Todos os recursos foram injetados e salvos na nuvem!', 'success');
};

// ---------------------------------------------------------------------------
// Moedas
// ---------------------------------------------------------------------------
window.adminAddCoins = async function (amount) {
    if (!window.checkIsAdmin() || !window.GAME_STATE) return;
    window.GAME_STATE.coins = (window.GAME_STATE.coins || 0) + amount;
    if (typeof window.updateUI  === 'function') window.updateUI();
    if (typeof window.saveGame  === 'function') await window.saveGame();
    if (window.showToast) window.showToast('Deus da Riqueza', `+ ${amount.toLocaleString()} moedas adicionadas.`, 'success');
};

// ---------------------------------------------------------------------------
// Sushi
// ---------------------------------------------------------------------------
window.adminUnlockFeatures = async function () {
    if (!window.checkIsAdmin() || !window.GAME_STATE) return;
    window.GAME_STATE.sushiUnlocked = true;
    if (typeof window.updateUI  === 'function') window.updateUI();
    if (typeof window.saveGame  === 'function') await window.saveGame();
    if (window.showToast) window.showToast('Features Livres', 'Restaurante desbloqueado para a conta!', 'success');
};

// ---------------------------------------------------------------------------
// Arsenal (varas, pesos, anzóis, facas) — SEM os itens exclusivos ADM;
// eles são injetados separadamente para não aparecerem na loja.
// ---------------------------------------------------------------------------
window.adminUnlockArsenal = async function () {
    if (!window.checkIsAdmin() || !window.GAME_STATE) return;

    if (window.ROD_TEMPLATES) window.GAME_STATE.ownedRods   = window.ROD_TEMPLATES.map(r => r.id).filter(id => id !== 9999);
    if (window.SINKERS)        window.GAME_STATE.ownedSinkers = window.SINKERS.map(s => s.id);
    if (window.HOOKS)          window.GAME_STATE.ownedHooks   = window.HOOKS.map(h => h.id).filter(id => id !== 'anzol_adm_supremo');
    if (window.KNIVES)         window.GAME_STATE.ownedKnives  = window.KNIVES.map(k => k.id);

    if (typeof window.updateUI === 'function') window.updateUI();
    if (typeof window.saveGame === 'function') await window.saveGame();
    if (window.showToast) window.showToast('Arsenal Completo', 'Varas, facas, anzóis e pesos liberados!', 'success');
};

// ---------------------------------------------------------------------------
// Iscas
// ---------------------------------------------------------------------------
window.adminAddAllIscas = async function (qty) {
    if (!window.checkIsAdmin() || !window.GAME_STATE || !window.BAITS) return;
    if (!window.GAME_STATE.baitInventory) window.GAME_STATE.baitInventory = {};
    window.BAITS.forEach(b => {
        window.GAME_STATE.baitInventory[b.id] = (window.GAME_STATE.baitInventory[b.id] || 0) + qty;
    });
    if (typeof window.saveGame  === 'function') await window.saveGame();
    if (typeof window.updateUI  === 'function') window.updateUI();
    if (window.showToast) window.showToast('Mestre das Iscas', `+${qty} de todas as Iscas!`, 'success');
};

// ---------------------------------------------------------------------------
// Materiais (apenas os "price > 0" — categoria principal)
// ---------------------------------------------------------------------------
window.adminAddAllMaterials = async function (qty) {
    if (!window.checkIsAdmin() || !window.GAME_STATE || !window.MATERIALS) return;
    if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
    window.MATERIALS.forEach(mat => {
        if (mat.price > 0) {
            window.GAME_STATE.materials[mat.id] = (window.GAME_STATE.materials[mat.id] || 0) + qty;
        }
    });
    if (typeof window.saveGame === 'function') await window.saveGame();
    if (typeof window.renderShop === 'function') window.renderShop();
    if (window.showToast) window.showToast('Estoque Cheio', `+${qty} de todas as Matérias-Primas!`, 'success');
};

// ---------------------------------------------------------------------------
// Catalisadores — items de categoria "boost" dentro de MATERIALS
// (identificados pelo campo category === 'boost', ou prefixo 'boost_' no id,
//  ou campo isCatalyst === true; dependente da estrutura do database.json)
// ---------------------------------------------------------------------------
function _injectCatalysts(qty) {
    if (!window.GAME_STATE || !window.MATERIALS) return;
    if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
    window.MATERIALS.forEach(mat => {
        const isCatalyst = (mat.category === 'boost') || (mat.isCatalyst === true) || (typeof mat.id === 'string' && mat.id.startsWith('boost_'));
        if (isCatalyst) {
            window.GAME_STATE.materials[mat.id] = (window.GAME_STATE.materials[mat.id] || 0) + qty;
        }
    });
}

window.adminAddAllCatalysts = async function (qty) {
    if (!window.checkIsAdmin() || !window.GAME_STATE) return;
    _injectCatalysts(qty);
    if (typeof window.saveGame === 'function') await window.saveGame();
    if (typeof window.renderBaitInventory === 'function') window.renderBaitInventory();
    if (window.showToast) window.showToast('Química Pura', `+${qty} de todos os Catalisadores!`, 'success');
};

// ---------------------------------------------------------------------------
// Sucatas
// ---------------------------------------------------------------------------
window.adminAddAllScrap = async function (qty) {
    if (!window.checkIsAdmin() || !window.GAME_STATE || !window.SUCATAS) return;
    if (!window.GAME_STATE.scrapCollection) window.GAME_STATE.scrapCollection = {};
    window.SUCATAS.forEach(scrap => {
        window.GAME_STATE.scrapCollection[scrap.id] = (window.GAME_STATE.scrapCollection[scrap.id] || 0) + qty;
    });
    if (typeof window.saveGame === 'function') await window.saveGame();
    if (typeof window.renderScrapCollection === 'function') window.renderScrapCollection();
    if (window.showToast) window.showToast('Lixeiro Mestre', `+${qty} de cada Sucata injetada na conta!`, 'success');
};

// ---------------------------------------------------------------------------
// Peixes
// ---------------------------------------------------------------------------
window.adminAddAllFishes = async function (qty, is67) {
    if (!window.checkIsAdmin() || !window.GAME_STATE || !window.RARITIES) return;
    const col = is67 ? 'collection67' : 'collection';
    if (!window.GAME_STATE[col]) window.GAME_STATE[col] = {};
    Object.values(window.RARITIES).forEach(rarity => {
        rarity.variations.forEach(fish => {
            window.GAME_STATE[col][fish.name] = (window.GAME_STATE[col][fish.name] || 0) + qty;
        });
    });
    if (typeof window.saveGame === 'function') await window.saveGame();
    if (is67  && typeof window.renderCollection67 === 'function') window.renderCollection67();
    if (!is67 && typeof window.renderCollection   === 'function') window.renderCollection();
    if (window.showToast) window.showToast('Oceanógrafo', `+${qty} de todos os ${is67 ? 'Troféus 67cm' : 'Peixes'} salvos na nuvem!`, 'success');
};

// ---------------------------------------------------------------------------
// Orbes
// ---------------------------------------------------------------------------
window.adminAddAllOrbs = async function (qty) {
    if (!window.checkIsAdmin() || !window.GAME_STATE) return;
    if (!window.GAME_STATE.orbs) window.GAME_STATE.orbs = {};
    ['ritual_tempestade','ritual_ouro','ritual_frenesi','ritual_misticismo','ritual_abismo','ritual_bestas'].forEach(id => {
        window.GAME_STATE.orbs[id] = (window.GAME_STATE.orbs[id] || 0) + qty;
    });
    if (typeof window.saveGame === 'function') await window.saveGame();
    if (typeof window.renderOrbs === 'function') window.renderOrbs();
    if (window.showToast) window.showToast('Magia Suprema', `+${qty} de todos os Orbes injetados no save!`, 'success');
};

// ---------------------------------------------------------------------------
// Injeção individual: Vara ADM exclusiva
// ---------------------------------------------------------------------------
function _injectAdmRodToState() {
    if (!window.GAME_STATE) return;
    const ADM_ROD_ID = 9999;
    const admRodDef  = { id: ADM_ROD_ID, name: '👑 Vara do Administrador', type: 'divino', price: 0, speed: 999.0, luck: 9999999, lore: '⚙️ Exclusiva para Desenvolvedores.' };

    // Garante que a definição existe nos templates (para o motor funcionar)
    if (window.ROD_TEMPLATES && !window.ROD_TEMPLATES.find(r => r.id === ADM_ROD_ID)) {
        window.ROD_TEMPLATES.push(admRodDef);
    }
    // Garante que está na lista de rods do GAME_STATE
    if (window.GAME_STATE.rods && !window.GAME_STATE.rods.find(r => r.id === ADM_ROD_ID)) {
        window.GAME_STATE.rods.push(admRodDef);
    }
    // Marca como possuída
    if (!window.GAME_STATE.ownedRods) window.GAME_STATE.ownedRods = [0];
    if (!window.GAME_STATE.ownedRods.includes(ADM_ROD_ID)) window.GAME_STATE.ownedRods.push(ADM_ROD_ID);
}

function _injectAdmHookToState() {
    if (!window.GAME_STATE) return;
    const ADM_HOOK_ID  = 'anzol_adm_supremo';
    const admHookDef   = { id: ADM_HOOK_ID, name: '👑 Anzol do Administrador', color: '#ef4444', target: 'bestial', power: 0.90, lore: '⚙️ 90% de eficácia. Exclusivo.' };

    // Garante definição em HOOKS
    if (window.HOOKS && !window.HOOKS.find(h => h.id === ADM_HOOK_ID)) {
        window.HOOKS.push(admHookDef);
    }
    // Marca como possuído
    if (!window.GAME_STATE.ownedHooks) window.GAME_STATE.ownedHooks = ['anzol_padrao'];
    if (!window.GAME_STATE.ownedHooks.includes(ADM_HOOK_ID)) window.GAME_STATE.ownedHooks.push(ADM_HOOK_ID);
}

window.adminInjectAdmRod = async function () {
    if (!window.checkIsAdmin() || !window.GAME_STATE) return;
    _injectAdmRodToState();
    if (typeof window.updateUI  === 'function') window.updateUI();
    if (typeof window.saveGame  === 'function') await window.saveGame();
    if (window.showToast) window.showToast('👑 Vara do ADM', 'Vara exclusiva injetada e salva na nuvem!', 'success');
};

window.adminInjectAdmHook = async function () {
    if (!window.checkIsAdmin() || !window.GAME_STATE) return;
    _injectAdmHookToState();
    if (typeof window.updateUI  === 'function') window.updateUI();
    if (typeof window.saveGame  === 'function') await window.saveGame();
    if (window.showToast) window.showToast('👑 Anzol do ADM', 'Anzol exclusivo (90% de sintonização) injetado e salvo na nuvem!', 'success');
};

// ---------------------------------------------------------------------------
// Eventos (sem mutação de save — apenas disparo no motor)
// ---------------------------------------------------------------------------
window.adminForceEvent = function (eventId) {
    if (!window.checkIsAdmin()) return;
    if (window.forceEvent) {
        window.forceEvent(eventId);
        const modal = document.getElementById('admin-modal');
        if (modal) modal.classList.remove('active');
    }
};

window.adminStopEvent = function () {
    if (!window.checkIsAdmin()) return;
    if (window.stopEvent) {
        window.stopEvent();
        const modal = document.getElementById('admin-modal');
        if (modal) modal.classList.remove('active');
    }
};