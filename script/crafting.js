/* ==========================================================================
   CRAFTING V3 - LABORATÓRIO DE ISCAS COM BOOSTS, FORJA E MUSEU
   ========================================================================== */

window.customAlert = function(message, isSuccess = false) {
    const existing = document.getElementById('custom-alert-box');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'custom-alert-box';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;
        z-index: 9999999; opacity: 0; transition: opacity 0.3s ease;
    `;

    const box = document.createElement('div');
    const bgColor = isSuccess ? '#27ae60' : '#e74c3c'; 
    box.style.cssText = `
        background: white; padding: 25px 30px; border-radius: 15px;
        text-align: center; max-width: 400px; width: 90%;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: 'Poppins', sans-serif;
        transform: scale(0.8); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border-top: 6px solid ${bgColor};
    `;

    box.innerHTML = `
        <h3 style="margin-top: 0; color: #333; font-family: 'Fredoka', sans-serif; font-size: 1.5rem;">
            ${isSuccess ? '✅ Sucesso!' : '⚠️ Atenção!'}
        </h3>
        <p style="color: #555; font-size: 1rem; margin-bottom: 25px; line-height: 1.4;">
            ${message.replace(/\n/g, '<br>')}
        </p>
        <button id="custom-alert-btn" style="
            background: ${bgColor}; color: white; border: none; padding: 12px 30px;
            font-family: 'Fredoka', sans-serif; font-size: 1.1rem; border-radius: 20px;
            cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Entendido
        </button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        box.style.transform = 'scale(1)';
    });

    const closeAlert = () => {
        overlay.style.opacity = '0';
        box.style.transform = 'scale(0.8)';
        setTimeout(() => overlay.remove(), 300);
    };

    document.getElementById('custom-alert-btn').addEventListener('click', closeAlert);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAlert(); });
};

let ACTIVE_BLUEPRINT = { type: null, id: null };

function fixGameState() {
    if (!window.GAME_STATE) window.GAME_STATE = {};
    if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
    if (!window.GAME_STATE.ownedRods) window.GAME_STATE.ownedRods = [0];
    if (!window.GAME_STATE.ownedSinkers) window.GAME_STATE.ownedSinkers = ['chumbo'];
    if (!window.GAME_STATE.ownedKnives) window.GAME_STATE.ownedKnives = ['faca_cozinha'];
    if (!window.GAME_STATE.baitInventory) window.GAME_STATE.baitInventory = {};
    if (!window.GAME_STATE.scrapCollection) window.GAME_STATE.scrapCollection = {};
    if (!window.GAME_STATE.baitBoosts) window.GAME_STATE.baitBoosts = {}; // Registro de melhorias de isca
    window.GAME_STATE.ownedRods = window.GAME_STATE.ownedRods.map(Number);
}

// ==========================================================================
// 1. A LOJA (Apenas Materiais Base e Boosts)
// ==========================================================================
window.ShopV2 = {
    render: function() {
        fixGameState();
        const container = document.getElementById('shop-container');
        if (!container || !window.MATERIALS) return;

        let html = '<div class="shop-section-title">🧱 Materiais e Boosts</div>';
        window.MATERIALS.forEach(mat => {
            if (mat.price === 0) return; // Não vende itens de sucata

            const count = window.GAME_STATE.materials[mat.id] || 0;
            const badge = count > 0 ? `<div class="stack-count">x${count}</div>` : '';
            const ownedClass = count > 0 ? 'owned' : '';
            
            // Destaque visual se for Boost
            const isBoost = mat.id.startsWith('boost_');
            const bgStyle = isBoost ? 'background: #fff3e0; border-color: #f39c12;' : '';

            html += `
                <div class="gear-card ${ownedClass}" style="transition:transform 0.2s; ${bgStyle}">
                    ${badge}
                    <div style="font-size:2rem">${mat.icon}</div>
                    <div style="font-weight:bold; font-size:0.9rem;">${mat.name}</div>
                    <div style="font-weight:bold;font-size:0.8rem;color:#e67e22; margin-top:5px;">💰 ${mat.price.toLocaleString()}</div>
                    
                    <div style="display:flex; gap:5px; margin-top:10px; justify-content:center;">
                        <button onclick="window.ShopV2.buyMaterial('${mat.id}', ${mat.price}, 1)" style="flex:1; padding:5px 0; background:#3498db; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; font-size:0.75rem; transition:0.2s;" onmouseover="this.style.background='#2980b9'" onmouseout="this.style.background='#3498db'">x1</button>
                        <button onclick="window.ShopV2.buyMaterial('${mat.id}', ${mat.price}, 10)" style="flex:1; padding:5px 0; background:#3498db; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; font-size:0.75rem; transition:0.2s;" onmouseover="this.style.background='#2980b9'" onmouseout="this.style.background='#3498db'">x10</button>
                        <button onclick="window.ShopV2.buyMaterial('${mat.id}', ${mat.price}, 100)" style="flex:1; padding:5px 0; background:#3498db; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; font-size:0.75rem; transition:0.2s;" onmouseover="this.style.background='#2980b9'" onmouseout="this.style.background='#3498db'">x100</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    buyMaterial: function(matId, basePrice, quantityMultiplier = 1) {
        fixGameState();
        const totalCost = basePrice * quantityMultiplier;
        if (window.GAME_STATE.coins >= totalCost) { 
            window.GAME_STATE.coins -= totalCost; 
            window.GAME_STATE.materials[matId] = (window.GAME_STATE.materials[matId] || 0) + quantityMultiplier; 
            this.finishPurchase(); 
        } else { 
            window.customAlert(`Você precisa de ${totalCost.toLocaleString()} Cat Coins para comprar ${quantityMultiplier} unidades!`, false); 
        }
    },

    finishPurchase: function() {
        if (document.getElementById('cat-coins')) document.getElementById('cat-coins').innerText = window.GAME_STATE.coins.toLocaleString();
        if (typeof window.saveGame === "function") window.saveGame();
        this.render(); 
    }
};

// ==========================================================================
// 2. FORJA DE EQUIPAMENTOS (Sem iscas)
// ==========================================================================
window.ForgeV2 = {
    renderLists: function() {
        fixGameState();
        const listContainer = document.getElementById('recipe-list');
        if (!listContainer || !window.CRAFTING_DB) return;

        let html = '<div style="display: flex; gap: 4px;">';
        
        // Varas
        html += '<div style="flex: 1;">';
        html += '<h3 style="font-size: 0.85rem; color: #555; text-align: center; margin-top: 0; margin-bottom: 8px;">🎣 Varas</h3>';
        Object.keys(window.CRAFTING_DB.recipes.rods).forEach(id => {
            const recipe = window.CRAFTING_DB.recipes.rods[id];
            const isOwned = window.GAME_STATE.ownedRods.includes(Number(id));
            const bg = isOwned ? '#d4efdf' : '#fff';
            html += `<div style="padding: 6px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 5px; cursor: pointer; background: ${bg}; font-family: 'Poppins', sans-serif; font-size: 0.7rem; transition: background 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" onclick="window.ForgeV2.selectBlueprint('rod', '${id}')"><strong>${recipe.name}</strong> ${isOwned ? '✅' : ''}</div>`;
        });
        html += '</div>';

        // Pesos
        html += '<div style="flex: 1; border-left: 1px solid #eee; padding-left: 4px;">';
        html += '<h3 style="font-size: 0.85rem; color: #555; text-align: center; margin-top: 0; margin-bottom: 8px;">🪨 Pesos</h3>';
        Object.keys(window.CRAFTING_DB.recipes.sinkers).forEach(id => {
            const recipe = window.CRAFTING_DB.recipes.sinkers[id];
            const isOwned = window.GAME_STATE.ownedSinkers.includes(id);
            const bg = isOwned ? '#d4efdf' : '#fff';
            html += `<div style="padding: 6px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 5px; cursor: pointer; background: ${bg}; font-family: 'Poppins', sans-serif; font-size: 0.7rem; transition: background 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" onclick="window.ForgeV2.selectBlueprint('sinker', '${id}')"><strong>${recipe.name}</strong> ${isOwned ? '✅' : ''}</div>`;
        });
        html += '</div>';

        // Facas
        html += '<div style="flex: 1; border-left: 1px solid #eee; padding-left: 4px;">';
        html += '<h3 style="font-size: 0.85rem; color: #555; text-align: center; margin-top: 0; margin-bottom: 8px;">🔪 Facas</h3>';
        Object.keys(window.CRAFTING_DB.recipes.knives).forEach(id => {
            const recipe = window.CRAFTING_DB.recipes.knives[id];
            const isOwned = window.GAME_STATE.ownedKnives.includes(id);
            const bg = isOwned ? '#d4efdf' : '#fff';
            html += `<div style="padding: 6px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 5px; cursor: pointer; background: ${bg}; font-family: 'Poppins', sans-serif; font-size: 0.7rem; transition: background 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" onclick="window.ForgeV2.selectBlueprint('knife', '${id}')"><strong>${recipe.name}</strong> ${isOwned ? '✅' : ''}</div>`;
        });
        html += '</div>';

        html += '</div>';

        listContainer.innerHTML = html;
        document.getElementById('crafting-area').innerHTML = '<div style="text-align:center; color:#999; margin-top: 50px;">Selecione uma planta à esquerda.</div>';
    },

    selectBlueprint: function(type, id) {
        fixGameState();
        ACTIVE_BLUEPRINT = { type, id };
        
        const area = document.getElementById('crafting-area');
        let recipe;
        if (type === 'rod') recipe = window.CRAFTING_DB.recipes.rods[id];
        else if (type === 'sinker') recipe = window.CRAFTING_DB.recipes.sinkers[id];
        else if (type === 'knife') recipe = window.CRAFTING_DB.recipes.knives[id];

        let canCraft = true;
        let reqHtml = '';

        Object.keys(recipe.req).forEach(matId => {
            const needed = recipe.req[matId];
            const have = window.GAME_STATE.materials[matId] || 0;
            const matData = window.MATERIALS.find(m => m.id === matId);
            const hasEnough = have >= needed;
            
            if (!hasEnough) canCraft = false;
            
            const color = hasEnough ? '#2ecc71' : '#e74c3c';
            reqHtml += `<div style="display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 10px; border-radius: 8px; border: 1px solid ${color}; margin-bottom: 10px; width: 100%; font-family: 'Poppins', sans-serif;"><span>${matData ? matData.icon : '📦'} ${matData ? matData.name : matId}</span><span style="font-weight: bold; color: ${color}">${have} / ${needed}</span></div>`;
        });

        let isOwned = false;
        if (type === 'rod') isOwned = window.GAME_STATE.ownedRods.includes(Number(id));
        else if (type === 'sinker') isOwned = window.GAME_STATE.ownedSinkers.includes(id);
        else if (type === 'knife') isOwned = window.GAME_STATE.ownedKnives.includes(id);

        let buttonHtml = '';
        if (isOwned) {
            buttonHtml = `<div style="margin-top: 20px; font-weight: bold; color: #27ae60; font-family: 'Poppins', sans-serif;">✅ Você já possui este item!</div>`;
        } else {
            const btnColor = canCraft ? '#8e44ad' : '#e74c3c';
            const btnText = canCraft ? '🔨 FORJAR ITEM' : '❌ FALTAM MATERIAIS';
            buttonHtml = `<button onclick="window.ForgeV2.craftItem()" style="margin-top: 20px; padding: 12px 30px; font-size: 1.2rem; font-family: 'Fredoka', sans-serif; font-weight: bold; background: ${btnColor}; color: white; border: none; border-radius: 20px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">${btnText}</button>`;
        }

        area.innerHTML = `<h2 style="color: #8e44ad; margin-bottom: 5px; font-family: 'Fredoka', sans-serif; text-align:center;">Planta: ${recipe.name}</h2><div style="width: 100%; max-width: 300px; margin-top:20px;">${reqHtml}</div>${buttonHtml}`;
    },

    craftItem: function() {
        fixGameState();
        const type = ACTIVE_BLUEPRINT.type;
        const id = ACTIVE_BLUEPRINT.id;
        if (!type || !id) return;

        let recipe;
        if (type === 'rod') recipe = window.CRAFTING_DB.recipes.rods[id];
        else if (type === 'sinker') recipe = window.CRAFTING_DB.recipes.sinkers[id];
        else if (type === 'knife') recipe = window.CRAFTING_DB.recipes.knives[id];
        
        let canCraft = true;
        Object.keys(recipe.req).forEach(matId => { if ((window.GAME_STATE.materials[matId] || 0) < recipe.req[matId]) canCraft = false; });

        if (!canCraft) { window.customAlert("Faltam materiais!\nVá comprar os itens em falta.", false); return; }

        Object.keys(recipe.req).forEach(matId => { window.GAME_STATE.materials[matId] -= recipe.req[matId]; });

        if (type === 'rod') window.GAME_STATE.ownedRods.push(Number(id));
        else if (type === 'sinker') window.GAME_STATE.ownedSinkers.push(id);
        else if (type === 'knife') window.GAME_STATE.ownedKnives.push(id);

        if(typeof window.saveGame === "function") window.saveGame();
        
        window.customAlert(`Você forjou com sucesso:\n${recipe.name}!\n\nAbra a Mesa de Trabalho para equipar.`, true);
        
        this.renderLists();
        this.selectBlueprint(type, id);
    }
};

// ==========================================================================
// 3. LABORATÓRIO DE ISCAS (MISTURADOR QUÍMICO COM BOOSTS)
// ==========================================================================
window.BaitLab = {
    slot1: null,
    slot2: null,
    slot3: null, // SLOT DO BOOST EXCLUSIVO
    
    renderLists: function() {
        fixGameState();
        const listContainer = document.getElementById('bait-recipe-list');
        if (!listContainer || !window.BAITS) return;

        let html = '<h3 style="font-size: 0.9rem; color: #27ae60; text-align: center; margin-top: 0; margin-bottom: 15px;">Guia de Receitas</h3>';
        window.BAITS.forEach(bait => {
            // Conta quantas iscas o player já fez e os níveis de boost
            const invCount = window.GAME_STATE.baitInventory[bait.id] || 0;
            const boostData = window.GAME_STATE.baitBoosts[bait.id] || {luck:0, value:0};
            let boostText = '';
            if (boostData.luck > 0) boostText += `🍀 Lvl ${boostData.luck} `;
            if (boostData.value > 0) boostText += `🌟 Lvl ${boostData.value}`;

            html += `
                <div style="padding: 8px; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 8px; cursor: pointer; background: #fff; font-family: 'Poppins', sans-serif; transition: background 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" onclick="window.BaitLab.showRecipe('${bait.id}')">
                    <div style="font-weight:bold; font-size: 0.8rem; color: #2c3e50;">${bait.icon} ${bait.name}</div>
                    <div style="font-size:0.65rem; color:#7f8c8d; margin-top:2px;">Estoque: ${invCount}x | ${boostText}</div>
                </div>
            `;
        });
        listContainer.innerHTML = html;
    },

    showRecipe: function(baitId) {
        const bait = window.BAITS.find(b => b.id === baitId);
        const reqKeys = Object.keys(bait.req);
        const resultArea = document.getElementById('bait-craft-result');
        
        const mat1 = window.MATERIALS.find(m => m.id === reqKeys[0]);
        const mat2 = window.MATERIALS.find(m => m.id === reqKeys[1]);

        resultArea.innerHTML = `
            <div style="color:#27ae60; font-weight:bold; font-size:1.1rem; font-family:'Fredoka', sans-serif; margin-bottom:5px;">📖 ${bait.icon} ${bait.name}</div>
            <div style="font-size:0.8rem; color:#555;">Arraste os extratos para os tubos:</div>
            <div style="display:flex; justify-content:center; gap:15px; margin-top:10px;">
                <div style="background:#f0fdf4; padding:5px 10px; border-radius:8px; font-size:0.8rem; border:1px solid #2ecc71;">${mat1.icon} ${bait.req[reqKeys[0]]}x ${mat1.name}</div>
                <div style="background:#f0fdf4; padding:5px 10px; border-radius:8px; font-size:0.8rem; border:1px solid #2ecc71;">${mat2.icon} ${bait.req[reqKeys[1]]}x ${mat2.name}</div>
            </div>
            <div style="font-size:0.7rem; color:#e67e22; margin-top:10px;">(Dica: Arraste um Soro na 3ª esfera para um Upgrade Permanente!)</div>
        `;
    },

    renderInventory: function() {
        fixGameState();
        const inv = document.getElementById('bait-mat-inventory');
        if (!inv || !window.MATERIALS) return;
        
        let html = '<div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; align-items:flex-start;">';
        window.MATERIALS.forEach(mat => {
            const count = window.GAME_STATE.materials[mat.id] || 0;
            // Exibe extratos de isca E os novos Boosts no mesmo inventário
            if (count > 0 && (mat.price === 0 || mat.id.startsWith('boost_'))) {
                const droptype = mat.id.startsWith('boost_') ? 'boost-mat' : 'bait-mat';
                const bgStyle = mat.id.startsWith('boost_') ? 'background: #fff3e0; border-color: #f39c12;' : '';
                
                html += `
                <div class="gear-card draggable-item" draggable="true" ondragstart="window.BaitLab.startDrag(event, '${mat.id}', '${droptype}')" style="width: 75px; padding:6px 2px; ${bgStyle}">
                    <div class="stack-count">x${count}</div>
                    <div style="font-size:1.6rem">${mat.icon}</div>
                    <div style="font-size:0.55rem; font-weight:bold; color:#333; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${mat.name}">${mat.name}</div>
                </div>`;
            }
        });
        html += '</div>';
        
        inv.innerHTML = html === '<div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; align-items:flex-start;"></div>' 
            ? '<div style="text-align:center; color:#999; margin-top:20px; font-family:Poppins; font-size:0.85rem;">Seu estoque está vazio.<br>Vá pescar Lixos para obter extratos ou compre Boosts na Loja!</div>' 
            : html;
    },
    
    startDrag: function(e, matId, type) {
        window.DRAGGED_BAIT_MAT = { id: matId, type: type };
        e.dataTransfer.setData('text/plain', matId);
    },
    
    handleDrop: function(e, slotNum) {
        e.preventDefault();
        const zone = document.getElementById(`bait-slot-${slotNum}`);
        if(zone) zone.classList.remove('drag-over');

        if (window.DRAGGED_BAIT_MAT) {
            // Regra: Tubo 1 e 2 só aceitam extratos (bait-mat)
            if ((slotNum === 1 || slotNum === 2) && window.DRAGGED_BAIT_MAT.type === 'bait-mat') {
                if (slotNum === 1) this.slot1 = window.DRAGGED_BAIT_MAT.id;
                if (slotNum === 2) this.slot2 = window.DRAGGED_BAIT_MAT.id;
            }
            // Regra: Esfera 3 só aceita Boosts (boost-mat)
            else if (slotNum === 3 && window.DRAGGED_BAIT_MAT.type === 'boost-mat') {
                this.slot3 = window.DRAGGED_BAIT_MAT.id;
            }
            this.updateUI();
        }
        window.DRAGGED_BAIT_MAT = null;
    },
    
    removeSlot: function(slotNum) {
        if (slotNum === 1) this.slot1 = null;
        if (slotNum === 2) this.slot2 = null;
        if (slotNum === 3) this.slot3 = null;
        this.updateUI();
    },
    
    updateUI: function() {
        this.renderInventory();
        this.renderLists();
        
        const updateSlot = (num, matId) => {
            const content = document.getElementById(`bait-content-${num}`);
            if (!content) return;
            if (matId) {
                const mat = window.MATERIALS.find(m => m.id === matId);
                content.innerHTML = `<div style="font-size:2.5rem; cursor:pointer; filter:drop-shadow(0 4px 4px rgba(0,0,0,0.2));" onclick="window.BaitLab.removeSlot(${num})" title="Clique para remover">${mat.icon}</div><div style="font-size:0.6rem; font-weight:bold; color:#2c3e50; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%;">${mat.name}</div>`;
            } else {
                content.innerHTML = `<div style="font-size:1.2rem; color:#ccc;">Vazio</div>`;
            }
        };

        updateSlot(1, this.slot1);
        updateSlot(2, this.slot2);
        updateSlot(3, this.slot3);

        this.checkRecipe();
    },
    
    checkRecipe: function() {
        const resultArea = document.getElementById('bait-craft-result');
        if (!resultArea) return;

        if (!this.slot1 || !this.slot2) {
            return; // Se falta material, deixa o texto padrão da receita que o jogador clicou (ou vazio)
        }

        if (this.slot1 === this.slot2) {
            resultArea.innerHTML = `<div style="color:#e74c3c; margin-top: 20px; font-weight:bold; font-family:'Poppins', sans-serif;">❌ Reação nula. Os compostos devem ser diferentes!</div>`;
            return;
        }

        const validBait = window.BAITS.find(b => {
            const reqKeys = Object.keys(b.req);
            return reqKeys.length === 2 && reqKeys.includes(this.slot1) && reqKeys.includes(this.slot2);
        });

        if (validBait) {
            const req1 = validBait.req[this.slot1];
            const req2 = validBait.req[this.slot2];
            const have1 = window.GAME_STATE.materials[this.slot1] || 0;
            const have2 = window.GAME_STATE.materials[this.slot2] || 0;
            const haveBoost = this.slot3 ? (window.GAME_STATE.materials[this.slot3] || 0) : 0;
            
            const canCraft = (have1 >= req1) && (have2 >= req2) && (!this.slot3 || haveBoost >= 1);
            const btnColor = canCraft ? '#27ae60' : '#7f8c8d';

            let boostMsg = "";
            if (this.slot3 === 'boost_sorte') boostMsg = "<div style='color:#e67e22; font-weight:bold; font-size:0.8rem; margin-bottom:10px;'>🍀 Boost Conectado: +50 Sorte Base Permanente!</div>";
            if (this.slot3 === 'boost_lucro') boostMsg = "<div style='color:#f1c40f; font-weight:bold; font-size:0.8rem; margin-bottom:10px;'>🌟 Boost Conectado: +0.2x Lucro Permanente!</div>";

            resultArea.innerHTML = `
                <h3 style="margin:0; color:#27ae60; font-family:'Fredoka', sans-serif; font-size:1.5rem;">${validBait.icon} ${validBait.name}</h3>
                <div style="font-size:0.8rem; color:#555; margin-bottom:5px; font-weight:bold;">${validBait.desc} <span style="color:#e67e22;">(Rende: ${validBait.qty}x)</span></div>
                ${boostMsg}
                <div style="display:flex; justify-content:center; gap:20px; font-size:0.75rem; margin-bottom:15px; font-weight:bold;">
                    <div style="color:${have1 >= req1 ? '#27ae60' : '#e74c3c'}">Req: ${req1} (Tem: ${have1})</div>
                    <div style="color:${have2 >= req2 ? '#27ae60' : '#e74c3c'}">Req: ${req2} (Tem: ${have2})</div>
                </div>
                
                <button ${!canCraft ? 'disabled' : ''} onclick="window.BaitLab.craft('${validBait.id}')" style="background:${btnColor}; color:white; border:none; padding:10px 20px; border-radius:20px; font-weight:bold; font-size:1rem; font-family:'Fredoka', sans-serif; cursor:${canCraft?'pointer':'not-allowed'}; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                    ${canCraft ? '🧪 SINTETIZAR ISCA' : '❌ MATERIAIS INSUFICIENTES'}
                </button>
            `;
        } else {
            resultArea.innerHTML = `<div style="color:#e74c3c; margin-top: 30px; font-weight:bold; font-size:1.1rem; font-family:'Fredoka', sans-serif;">💥 Falha Química!<br><span style="font-size:0.8rem; color:#777;">Combinação desconhecida. Tente misturar outros extratos.</span></div>`;
        }
    },
    
    craft: function(baitId) {
        const bait = window.BAITS.find(b => b.id === baitId);
        if (!bait) return;

        // Deduz materiais normais
        Object.keys(bait.req).forEach(matId => {
            window.GAME_STATE.materials[matId] -= bait.req[matId];
        });

        // Deduz e aplica o Boost na árvore de Upgrades Permanentes
        let extraMsg = "";
        if (this.slot3) {
            window.GAME_STATE.materials[this.slot3] -= 1;
            
            if (!window.GAME_STATE.baitBoosts) window.GAME_STATE.baitBoosts = {};
            if (!window.GAME_STATE.baitBoosts[baitId]) window.GAME_STATE.baitBoosts[baitId] = { luck: 0, value: 0 };
            
            if (this.slot3 === 'boost_sorte') {
                window.GAME_STATE.baitBoosts[baitId].luck += 1;
                extraMsg = `\n🌟 Isca Aprimorada Permanentemente: +50 Sorte Base!`;
            } else if (this.slot3 === 'boost_lucro') {
                window.GAME_STATE.baitBoosts[baitId].value += 1;
                extraMsg = `\n🌟 Isca Aprimorada Permanentemente: +0.2x Lucro Base!`;
            }
            this.slot3 = null; // Limpa a esfera após usar o boost
        }

        window.GAME_STATE.baitInventory[baitId] = (window.GAME_STATE.baitInventory[baitId] || 0) + bait.qty;

        if(window.saveGame) window.saveGame();
        
        window.customAlert(`🧪 Sucesso Químico!\n\nA reação gerou ${bait.qty}x [${bait.name}]!${extraMsg}\n\nAbra a Mesa de Trabalho para usar.`, true);
        
        this.updateUI();
    }
};

// ==========================================================================
// 4. MUSEU DO LIXO (CATÁLOGO DE SUCATAS)
// ==========================================================================
window.ScrapCatalog = {
    render: function() {
        fixGameState();
        const grid = document.getElementById('scrap-grid');
        if (!grid || !window.SUCATAS) return;
        grid.innerHTML = '';
        
        let unlocked = 0;
        
        window.SUCATAS.forEach(scrap => {
            const count = window.GAME_STATE.scrapCollection[scrap.id] || 0;
            const isUnlocked = count > 0;
            if (isUnlocked) unlocked++;

            const matInfo = window.MATERIALS.find(m => m.id === scrap.matReward);
            const matDisplay = matInfo ? `${matInfo.icon} ${matInfo.name}` : scrap.matReward;

            const div = document.createElement('div');
            div.className = `collection-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            div.innerHTML = `
                ${isUnlocked ? `<div class="count-badge" style="background:#7f8c8d;">x${count}</div>` : ''}
                <img src="${scrap.image}" class="collection-img" style="${isUnlocked ? 'filter: drop-shadow(0 4px 4px rgba(0,0,0,0.2));' : ''}" onerror="this.src='https://placehold.co/80x80?text=🗑️'">
                <div style="font-size: 0.8rem; font-weight: bold; color: ${isUnlocked ? '#333' : '#999'}">${scrap.name}</div>
                <div style="font-size: 0.65rem; color: #27ae60; font-weight:bold; margin-top:5px; line-height:1.2;">♻️ Gera:<br>${matDisplay}</div>
            `;
            grid.appendChild(div);
        });
        
        const progress = document.getElementById('scrap-progress');
        if (progress) progress.innerText = `(${unlocked}/${window.SUCATAS.length})`;
    }
};

// ==========================================================================
// 5. MOCHILA E MESA DE TRABALHO
// ==========================================================================
window.BackpackV2 = {
    render: function(tab) {
        fixGameState();
        const grid = document.getElementById('backpack-grid');
        if(!grid) return; 
        
        let html = '';
        
        if (tab === 'mat') {
            window.MATERIALS.forEach(mat => { 
                const count = window.GAME_STATE.materials[mat.id] || 0; 
                if (count > 0) html += `<div class="gear-card"><div class="stack-count">x${count}</div><div style="font-size:2rem">${mat.icon}</div><div style="font-size:0.8rem; font-weight:bold; margin-top:5px;">${mat.name}</div></div>`;
            });
        } else if (tab === 'rod') {
            window.GAME_STATE.ownedRods.forEach(id => {
                const rod = (window.GAME_STATE.rods || []).find(r => r.id === id);
                if(rod) html += `<div class="rod-card"><div>${rod.name}</div><div style="font-size:0.6rem; color:#8e44ad; font-weight:bold; text-transform:uppercase;">${rod.type}</div></div>`;
            });
        } else if (tab === 'sink') {
            window.GAME_STATE.ownedSinkers.forEach(id => {
                const sink = (window.SINKERS || []).find(s => s.id === id);
                if(sink) html += `<div class="gear-card"><div style="font-weight:bold; font-size:0.9rem;">${sink.name}</div><div style="font-size:0.7rem;color:#555">${sink.desc}</div></div>`;
            });
        } else if (tab === 'knife') {
            window.GAME_STATE.ownedKnives.forEach(id => {
                const knife = (window.KNIVES || []).find(k => k.id === id);
                if(knife) html += `<div class="gear-card"><div style="font-weight:bold; font-size:0.9rem;">${knife.name}</div><div style="font-size:0.7rem;color:#e74c3c">${knife.desc}</div></div>`;
            });
        } else if (tab === 'bait') {
            Object.keys(window.GAME_STATE.baitInventory).forEach(id => {
                const count = window.GAME_STATE.baitInventory[id]; 
                const bait = (window.BAITS || []).find(b => b.id === id);
                if(count > 0 && bait) html += `<div class="gear-card"><div class="stack-count">x${count}</div><div style="font-size:1.5rem">${bait.icon}</div><div style="font-weight:bold; font-size:0.8rem;">${bait.name}</div></div>`;
            });
        }
        
        grid.innerHTML = html || '<div style="grid-column: 1/-1; text-align: center; color: #999;">Inventário Vazio.</div>';
    }
};

window.WorkbenchV2 = {
    render: function(tab) {
        fixGameState();
        const grid = document.getElementById('workbench-grid');
        if(!grid) return; 

        let html = '';
        
        if (tab === 'rod') {
            window.GAME_STATE.ownedRods.forEach(id => {
                const rod = window.GAME_STATE.rods.find(r => r.id === id);
                if(rod) {
                    const isEq = window.GAME_STATE.currentRodIndex === rod.id ? 'equipped' : '';
                    html += `<div class="rod-card draggable-item ${isEq}" draggable="true" ondragstart="window.WorkbenchV2.startDrag(event, 'rod', '${rod.id}')"><div>${rod.name}</div><div style="font-size:0.6rem; color:#8e44ad; font-weight:bold; margin-top:5px;">🖱️ Arraste p/ o Slot</div></div>`;
                }
            });
        } 
        else if (tab === 'sink') {
            window.GAME_STATE.ownedSinkers.forEach(id => {
                const sink = window.SINKERS.find(s => s.id === id);
                if(sink) {
                    const isEq = window.GAME_STATE.currentSinker === sink.id ? 'equipped' : '';
                    html += `<div class="gear-card draggable-item ${isEq}" draggable="true" ondragstart="window.WorkbenchV2.startDrag(event, 'sinker', '${sink.id}')"><div style="font-weight:bold; font-size:0.9rem;">${sink.name}</div><div style="font-size:0.6rem; color:#d35400; font-weight:bold; margin-top:8px;">🖱️ Arraste p/ o Slot</div></div>`;
                }
            });
        } 
        else if (tab === 'knife') {
            window.GAME_STATE.ownedKnives.forEach(id => {
                const knife = window.KNIVES.find(k => k.id === id);
                if(knife) {
                    const isEq = window.GAME_STATE.currentKnife === knife.id ? 'equipped' : '';
                    html += `<div class="gear-card draggable-item ${isEq}" draggable="true" ondragstart="window.WorkbenchV2.startDrag(event, 'knife', '${knife.id}')"><div style="font-weight:bold; font-size:0.9rem;">${knife.name}</div><div style="font-size:0.7rem; color:#e74c3c;">${knife.desc}</div><div style="font-size:0.6rem; color:#c0392b; font-weight:bold; margin-top:8px;">🖱️ Arraste p/ o Slot</div></div>`;
                }
            });
        }
        else if (tab === 'bait') {
            Object.keys(window.GAME_STATE.baitInventory).forEach(id => {
                const count = window.GAME_STATE.baitInventory[id]; 
                const bait = window.BAITS.find(b => b.id === id);
                if(count > 0 && bait) {
                    const isEq = window.GAME_STATE.currentBait === bait.id ? 'equipped' : '';
                    html += `<div class="gear-card draggable-item ${isEq}" draggable="true" ondragstart="window.WorkbenchV2.startDrag(event, 'bait', '${bait.id}')"><div class="stack-count">x${count}</div><div style="font-size:1.5rem">${bait.icon}</div><div style="font-weight:bold; font-size:0.8rem;">${bait.name}</div><div style="font-size:0.6rem; color:#27ae60; font-weight:bold; margin-top:5px;">🖱️ Arraste p/ o Slot</div></div>`;
                }
            });
        }

        grid.innerHTML = html || '<div style="grid-column: 1/-1; text-align: center; color: #999;">Vá forjar ou pescar mais itens.</div>';
    },

    updateSlotsUI: function() {
        const rod = (window.GAME_STATE.rods || []).find(r => r.id === window.GAME_STATE.currentRodIndex);
        if(document.getElementById('wb-rod-content') && rod) document.getElementById('wb-rod-content').innerHTML = `<span style="color:#8e44ad">${rod.name}</span>`;

        const sinker = (window.SINKERS || []).find(s => s.id === window.GAME_STATE.currentSinker);
        if(document.getElementById('wb-sinker-content') && sinker) document.getElementById('wb-sinker-content').innerHTML = `<span style="color:#d35400">${sinker.name}</span>`;

        const knife = (window.KNIVES || []).find(k => k.id === window.GAME_STATE.currentKnife);
        if(document.getElementById('wb-knife-content') && knife) document.getElementById('wb-knife-content').innerHTML = `<span style="color:#e74c3c">${knife.name}</span>`;

        const baitDisplay = document.getElementById('wb-bait-content');
        if (baitDisplay) {
            if (window.GAME_STATE.currentBait) {
                const bait = (window.BAITS || []).find(b => b.id === window.GAME_STATE.currentBait);
                baitDisplay.innerHTML = bait ? `<span style="color:#27ae60">${bait.icon} ${bait.name}</span>` : "Nenhuma Isca";
            } else {
                baitDisplay.innerText = "Nenhuma Isca";
            }
        }
    },

    startDrag: function(e, type, id) {
        window.DRAGGED_ITEM = { type, id };
        e.dataTransfer.setData('text/plain', '');
    },

    handleDrop: function(e, zoneElement) {
        e.preventDefault();
        zoneElement.classList.remove('drag-over');
        
        if (window.DRAGGED_ITEM && window.DRAGGED_ITEM.type === zoneElement.dataset.droptype) {
            if (window.DRAGGED_ITEM.type === 'rod') window.GAME_STATE.currentRodIndex = Number(window.DRAGGED_ITEM.id);
            if (window.DRAGGED_ITEM.type === 'sinker') window.GAME_STATE.currentSinker = window.DRAGGED_ITEM.id;
            if (window.DRAGGED_ITEM.type === 'knife') window.GAME_STATE.currentKnife = window.DRAGGED_ITEM.id;
            if (window.DRAGGED_ITEM.type === 'bait') window.GAME_STATE.currentBait = window.DRAGGED_ITEM.id;
            
            this.updateSlotsUI();
            this.render(window.DRAGGED_ITEM.type);
            
            if(typeof window.updateUI === "function") window.updateUI(); 
            if(typeof window.saveGame === "function") window.saveGame();
        }
        window.DRAGGED_ITEM = null;
    }
};

// ==========================================================================
// 6. EVENT LISTENERS E MODAIS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    const bindModal = (openBtnId, closeBtnId, modalId, onOpenFunc) => {
        const openBtn = document.getElementById(openBtnId);
        const closeBtn = document.getElementById(closeBtnId);
        const modal = document.getElementById(modalId);
        if(openBtn && modal) openBtn.addEventListener('click', () => { modal.classList.remove('hidden'); if(onOpenFunc) onOpenFunc(); });
        if(closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    };

    bindModal('open-shop-btn', 'close-shop-btn', 'shop-modal', () => window.ShopV2.render());
    bindModal('open-craft-btn', 'close-craft-btn', 'craft-modal', () => window.ForgeV2.renderLists());
    bindModal('open-scrap-btn', 'close-scrap-btn', 'scrap-modal', () => window.ScrapCatalog.render());
    
    // Laboratório de Iscas
    bindModal('open-bait-forge-btn', 'close-bait-forge-btn', 'bait-forge-modal', () => {
        window.BaitLab.slot1 = null;
        window.BaitLab.slot2 = null;
        window.BaitLab.slot3 = null;
        window.BaitLab.updateUI();
    });

    const wbOpenBtn = document.getElementById('open-workbench-btn');
    if(wbOpenBtn) {
        wbOpenBtn.addEventListener('click', () => {
            document.getElementById('craft-modal')?.classList.add('hidden');
            document.getElementById('workbench-modal')?.classList.remove('hidden');
            window.WorkbenchV2.updateSlotsUI();
            window.WorkbenchV2.render('rod');
            document.querySelectorAll('.wb-tab-btn').forEach(b => b.classList.remove('active'));
            const firstTab = document.querySelector('.wb-tab-btn[data-tab="rod"]');
            if (firstTab) firstTab.classList.add('active');
        });
    }
    const wbCloseBtn = document.getElementById('close-workbench-btn');
    if(wbCloseBtn) wbCloseBtn.addEventListener('click', () => document.getElementById('workbench-modal')?.classList.add('hidden'));

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('wb-tab-btn')) {
            document.querySelectorAll('.wb-tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            window.WorkbenchV2.render(e.target.dataset.tab);
        }
    });

    // Drag & Drop
    document.querySelectorAll('.dropzone').forEach(zone => {
        zone.addEventListener('dragover', (e) => { 
            e.preventDefault(); 
            // Permite drag da mesa de trabalho normal
            if (window.DRAGGED_ITEM && window.DRAGGED_ITEM.type === zone.dataset.droptype) {
                zone.classList.add('drag-over'); 
            }
            // Permite drag do laboratório de iscas (Ingredientes ou Boost)
            if (window.DRAGGED_BAIT_MAT && window.DRAGGED_BAIT_MAT.type === zone.dataset.droptype) {
                zone.classList.add('drag-over');
            }
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
            if (zone.dataset.droptype === 'bait-mat' || zone.dataset.droptype === 'boost-mat') {
                const slotNum = zone.id === 'bait-slot-1' ? 1 : (zone.id === 'bait-slot-2' ? 2 : 3);
                window.BaitLab.handleDrop(e, slotNum);
            } else {
                window.WorkbenchV2.handleDrop(e, zone);
            }
        });
    });

});