/* ==========================================================================
   CRAFTING V2 - RECONSTRUÍDO DO ZERO (ARQUITETURA BLINDADA) + COMPRAS EM LOTE
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

window.CRAFTING_DB = {
    materials: [
        { id: 'madeira', name: 'Madeira / Graveto', price: 50, icon: '🪵' },
        { id: 'fio', name: 'Fio de Nylon', price: 100, icon: '🧵' },
        { id: 'plastico', name: 'Plástico', price: 500, icon: '🧪' },
        { id: 'kevlar', name: 'Fio de Kevlar', price: 1200, icon: '🕸️' },
        { id: 'fibra', name: 'Fibra de Vidro', price: 2000, icon: '🧶' },
        { id: 'ouro', name: 'Ouro Pirata', price: 5000, icon: '🪙' },
        { id: 'metal', name: 'Sucata de Metal', price: 8000, icon: '⚙️' },
        { id: 'titânio', name: 'Liga de Titânio', price: 25000, icon: '🔩' },
        { id: 'perola', name: 'Pérola Abissal', price: 45000, icon: '🦪' },
        { id: 'carbono', name: 'Carbono', price: 80000, icon: '🔋' },
        { id: 'meteorito', name: 'Fragmento de Meteoro', price: 200000, icon: '☄️' },
        { id: 'cristal', name: 'Cristal Místico', price: 500000, icon: '🔮' },
        { id: 'materia_escura', name: 'Matéria Escura', price: 1500000, icon: '🌌' },
        { id: 'essencia', name: 'Essência Divina', price: 5000000, icon: '✨' },
        { id: 'poeira_cosmica', name: 'Poeira Cósmica', price: 15000000, icon: '💫' }
    ],
    recipes: {
        rods: {
            1: { name: "Vara de Bambu", req: { madeira: 2, fio: 1 } },
            2: { name: "Bambu Reforçado", req: { madeira: 5, fio: 3 } },
            3: { name: "Caniço de Salgueiro", req: { madeira: 10, fio: 5 } },
            4: { name: "Vara de Plástico", req: { plastico: 3, fio: 2 } },
            5: { name: "Fibra de Vidro", req: { fibra: 2, plastico: 2, fio: 3 } },
            6: { name: "Fibra Premium", req: { fibra: 5, plastico: 4, kevlar: 1 } },
            7: { name: "Polímero Flexível", req: { fibra: 10, plastico: 10, kevlar: 3 } },
            8: { name: "Alumínio Leve", req: { metal: 3, fio: 5, ouro: 1 } },
            9: { name: "Aço Inoxidável", req: { metal: 8, plastico: 2, ouro: 2 } },
            10: { name: "Liga de Titânio", req: { titânio: 4, metal: 5, ouro: 5 } },
            11: { name: "Vara de Grafeno", req: { titânio: 8, metal: 10, perola: 1 } },
            12: { name: "Carbono Básico", req: { carbono: 2, plastico: 5, perola: 3 } },
            13: { name: "Vara Eletrônica", req: { carbono: 4, metal: 10, perola: 5 } },
            14: { name: "Fibra de Nanotubos", req: { carbono: 8, fibra: 15, meteorito: 1 } },
            15: { name: "Protótipo Militar", req: { carbono: 15, titânio: 15, meteorito: 3 } },
            16: { name: "Vara Oceânica", req: { cristal: 3, titânio: 5, perola: 10 } },
            17: { name: "Arpão Antigo", req: { cristal: 8, madeira: 50, ouro: 20 } },
            18: { name: "Tridente de Netuno", req: { cristal: 15, titânio: 20, materia_escura: 1 } },
            19: { name: "Vara Galáctica", req: { essencia: 1, cristal: 20, materia_escura: 3 } },
            20: { name: "Vara Quântica", req: { essencia: 3, carbono: 50, materia_escura: 10 } },
            21: { name: "A Vara do Criador", req: { essencia: 10, cristal: 50, poeira_cosmica: 3 } }
        },
        sinkers: {
            'pedra_rio': { name: "Pedra de Rio", req: { fio: 1 } },
            'casca_noz': { name: "Casca Leve", req: { madeira: 2, fio: 1 } },
            'disco_plastico': { name: "Disco Plano", req: { plastico: 2 } },
            'bobina_fibra': { name: "Bobina Estabilizada", req: { fibra: 2, plastico: 1, kevlar: 1 } },
            'ferro_velho': { name: "Peso de Sucata", req: { metal: 2 } },
            'anilha_aco': { name: "Anilha de Academia", req: { metal: 5, ouro: 1 } },
            'magneto': { name: "Imã Industrial", req: { metal: 8, kevlar: 2 } },
            'peso_tungstenio': { name: "Esfera Pesada", req: { titânio: 2, metal: 5 } },
            'pepita_luxo': { name: "Pepita Polida", req: { titânio: 5, ouro: 10 } },
            'nucleo_carbono': { name: "Peso de Fibra", req: { carbono: 2, fibra: 3, kevlar: 5 } },
            'bateria_ion': { name: "Célula de Energia", req: { carbono: 5, metal: 10, perola: 2 } },
            'prisma_oceano': { name: "Prisma de Coral", req: { cristal: 2, plastico: 5, perola: 5 } },
            'reliquia_abismo': { name: "Artefato Antigo", req: { cristal: 5, titânio: 5, meteorito: 2 } },
            'fragmento_estelar': { name: "Fragmento de Cometa", req: { cristal: 10, meteorito: 5 } },
            'antimateria_v2': { name: "Peso de Antimatéria", req: { essencia: 1, carbono: 20, materia_escura: 2 } },
            'divindade_ouro': { name: "Ídolo Dourado", req: { essencia: 3, ouro: 50, cristal: 5 } },
            'buraco_negro': { name: "Mini Buraco Negro", req: { essencia: 5, titânio: 30, materia_escura: 5 } },
            'paradoxo': { name: "Peso Atemporal", req: { essencia: 8, cristal: 30, poeira_cosmica: 1 } },
            'vazio_absoluto': { name: "Esfera do Nada", req: { essencia: 15, carbono: 100, poeira_cosmica: 5 } }
        },
        knives: {
            'faca_cozinha': { name: "Faca de Cozinha", req: { madeira: 2, metal: 2 } },
            'faca_acougueiro': { name: "Faca de Açougueiro", req: { madeira: 3, metal: 5 } },
            'faca_chef': { name: "Faca de Chef Aprendiz", req: { madeira: 5, metal: 12 } },
            'cutelo_ferro': { name: "Cutelo de Ferro", req: { madeira: 10, metal: 25 } },
            'faca_ouro': { name: "Faca Banhada a Ouro", req: { madeira: 15, ouro: 5 } },
            'faca_pirata': { name: "Faca do Pirata", req: { madeira: 20, ouro: 15 } },
            'faca_titanio': { name: "Faca de Titânio", req: { madeira: 30, titânio: 5 } },
            'cutelo_titanio': { name: "Cutelo Maciço", req: { madeira: 40, titânio: 15, metal: 50 } },
            'faca_meteorito': { name: "Faca Meteorítica", req: { madeira: 60, meteorito: 3 } },
            'lamina_cometa': { name: "Lâmina do Cometa", req: { madeira: 80, meteorito: 10, titânio: 20 } },
            'faca_cristal': { name: "Faca de Cristal Bruto", req: { madeira: 120, cristal: 3 } },
            'lamina_mistica': { name: "Lâmina Mística", req: { madeira: 150, cristal: 10 } },
            'faca_sombria': { name: "Faca Sombria", req: { madeira: 200, materia_escura: 3 } },
            'cutelo_vazio': { name: "Cutelo do Vazio", req: { madeira: 250, materia_escura: 8, meteorito: 25 } },
            'faca_essencia': { name: "Faca de Essência Pura", req: { madeira: 350, essencia: 2 } },
            'lamina_divina': { name: "Lâmina Divina", req: { madeira: 500, essencia: 5 } },
            'faca_estelar': { name: "Faca Estelar", req: { madeira: 800, poeira_cosmica: 2 } },
            'faca_neutrons': { name: "Faca de Nêutrons", req: { madeira: 1200, poeira_cosmica: 5 } },
            'lamina_infinito': { name: "Lâmina do Infinito", req: { madeira: 2500, poeira_cosmica: 15 } },
            'faca_criador': { name: "A Faca do Criador", req: { madeira: 5000, poeira_cosmica: 30, essencia: 20 } }
        }
    }
};

window.MATERIALS = window.CRAFTING_DB.materials;
let ACTIVE_BLUEPRINT = { type: null, id: null };

function fixGameState() {
    if (!window.GAME_STATE) window.GAME_STATE = {};
    if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
    if (!window.GAME_STATE.ownedRods) window.GAME_STATE.ownedRods = [0];
    if (!window.GAME_STATE.ownedSinkers) window.GAME_STATE.ownedSinkers = ['chumbo'];
    if (!window.GAME_STATE.ownedKnives) window.GAME_STATE.ownedKnives = ['faca_cozinha'];
    if (!window.GAME_STATE.baitInventory) window.GAME_STATE.baitInventory = {};
    window.GAME_STATE.ownedRods = window.GAME_STATE.ownedRods.map(Number);
}

window.ShopV2 = {
    render: function() {
        fixGameState();
        const container = document.getElementById('shop-container');
        if (!container) return;

        let html = '<div class="shop-section-title">🧱 Materiais Brutos</div>';
        window.CRAFTING_DB.materials.forEach(mat => {
            const count = window.GAME_STATE.materials[mat.id] || 0;
            const badge = count > 0 ? `<div class="stack-count">x${count}</div>` : '';
            const ownedClass = count > 0 ? 'owned' : '';
            
            // Botões de Compra Múltipla Adicionados
            html += `
                <div class="gear-card ${ownedClass}" style="transition:transform 0.2s;">
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

        html += '<div class="shop-section-title">🪝 Iscas Prontas</div>';
        if (window.BAITS) {
            window.BAITS.forEach(b => {
                const count = window.GAME_STATE.baitInventory[b.id] || 0;
                const badge = count > 0 ? `<div class="stack-count">x${count}</div>` : '';
                const ownedClass = count > 0 ? 'owned' : '';
                
                html += `
                    <div class="gear-card ${ownedClass}" style="transition:transform 0.2s;">
                        ${badge}
                        <div style="font-size:1.5rem">${b.icon}</div>
                        <div>${b.name}</div>
                        <div style="font-size:0.7rem;color:#555">${b.desc}</div>
                        <div style="font-weight:bold;font-size:0.8rem;color:#e67e22; margin-top:5px;">💰 ${b.price.toLocaleString()} (x${b.qty})</div>
                        
                        <div style="display:flex; gap:5px; margin-top:10px; justify-content:center;">
                            <button onclick="window.ShopV2.buyBait('${b.id}', ${b.price}, ${b.qty}, 1)" style="flex:1; padding:5px 0; background:#9b59b6; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; font-size:0.75rem; transition:0.2s;" onmouseover="this.style.background='#8e44ad'" onmouseout="this.style.background='#9b59b6'">x1</button>
                            <button onclick="window.ShopV2.buyBait('${b.id}', ${b.price}, ${b.qty}, 10)" style="flex:1; padding:5px 0; background:#9b59b6; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; font-size:0.75rem; transition:0.2s;" onmouseover="this.style.background='#8e44ad'" onmouseout="this.style.background='#9b59b6'">x10</button>
                        </div>
                    </div>
                `;
            });
        }
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

    buyBait: function(baitId, basePrice, qtyPerPack, quantityMultiplier = 1) {
        fixGameState();
        const totalCost = basePrice * quantityMultiplier;
        const totalQty = qtyPerPack * quantityMultiplier;
        if (window.GAME_STATE.coins >= totalCost) { 
            window.GAME_STATE.coins -= totalCost; 
            window.GAME_STATE.baitInventory[baitId] = (window.GAME_STATE.baitInventory[baitId] || 0) + totalQty; 
            this.finishPurchase(); 
        } else { 
            window.customAlert(`Você precisa de ${totalCost.toLocaleString()} Cat Coins para comprar ${quantityMultiplier} pacotes desta isca.`, false); 
        }
    },

    finishPurchase: function() {
        if (document.getElementById('cat-coins')) document.getElementById('cat-coins').innerText = window.GAME_STATE.coins.toLocaleString();
        if (typeof window.saveGame === "function") window.saveGame();
        this.render(); 
    }
};

window.ForgeV2 = {
    renderLists: function() {
        fixGameState();
        const listContainer = document.getElementById('recipe-list');
        if (!listContainer) return;

        let html = '<div style="display: flex; gap: 8px;">';
        
        // COLUNA 1: VARAS
        html += '<div style="flex: 1; padding-right: 4px;">';
        html += '<h3 style="font-size: 0.9rem; color: #555; text-align: center; margin-top: 0; margin-bottom: 10px;">🎣 Varas</h3>';
        Object.keys(window.CRAFTING_DB.recipes.rods).forEach(id => {
            const recipe = window.CRAFTING_DB.recipes.rods[id];
            const isOwned = window.GAME_STATE.ownedRods.includes(Number(id));
            const bg = isOwned ? '#d4efdf' : '#fff';
            html += `<div style="padding: 6px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 5px; cursor: pointer; background: ${bg}; font-family: 'Poppins', sans-serif; font-size: 0.75rem; transition: background 0.2s;" onclick="window.ForgeV2.selectBlueprint('rod', '${id}')"><strong>${recipe.name}</strong> ${isOwned ? '✅' : ''}</div>`;
        });
        html += '</div>';

        // COLUNA 2: CHUMBADAS
        html += '<div style="flex: 1; padding: 0 4px; border-left: 1px solid #eee; border-right: 1px solid #eee;">';
        html += '<h3 style="font-size: 0.9rem; color: #555; text-align: center; margin-top: 0; margin-bottom: 10px;">🪨 Pesos</h3>';
        Object.keys(window.CRAFTING_DB.recipes.sinkers).forEach(id => {
            const recipe = window.CRAFTING_DB.recipes.sinkers[id];
            const isOwned = window.GAME_STATE.ownedSinkers.includes(id);
            const bg = isOwned ? '#d4efdf' : '#fff';
            html += `<div style="padding: 6px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 5px; cursor: pointer; background: ${bg}; font-family: 'Poppins', sans-serif; font-size: 0.75rem; transition: background 0.2s;" onclick="window.ForgeV2.selectBlueprint('sinker', '${id}')"><strong>${recipe.name}</strong> ${isOwned ? '✅' : ''}</div>`;
        });
        html += '</div>';

        // COLUNA 3: FACAS
        html += '<div style="flex: 1; padding-left: 4px;">';
        html += '<h3 style="font-size: 0.9rem; color: #555; text-align: center; margin-top: 0; margin-bottom: 10px;">🔪 Facas</h3>';
        Object.keys(window.CRAFTING_DB.recipes.knives).forEach(id => {
            const recipe = window.CRAFTING_DB.recipes.knives[id];
            const isOwned = window.GAME_STATE.ownedKnives.includes(id);
            const bg = isOwned ? '#d4efdf' : '#fff';
            html += `<div style="padding: 6px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 5px; cursor: pointer; background: ${bg}; font-family: 'Poppins', sans-serif; font-size: 0.75rem; transition: background 0.2s;" onclick="window.ForgeV2.selectBlueprint('knife', '${id}')"><strong>${recipe.name}</strong> ${isOwned ? '✅' : ''}</div>`;
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
            const matData = window.CRAFTING_DB.materials.find(m => m.id === matId);
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

        area.innerHTML = `<h2 style="color: #8e44ad; margin-bottom: 20px; font-family: 'Fredoka', sans-serif; text-align:center;">Planta: ${recipe.name}</h2><div style="width: 100%; max-width: 300px;">${reqHtml}</div>${buttonHtml}`;
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

        if (!canCraft) { window.customAlert("Faltam materiais!\nVerifique na Loja e compre os itens que estão em vermelho na planta.", false); return; }

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

window.BackpackV2 = {
    render: function(tab) {
        fixGameState();
        const grid = document.getElementById('backpack-grid');
        if(!grid) return; 
        
        let html = '';
        
        if (tab === 'mat') {
            window.CRAFTING_DB.materials.forEach(mat => { 
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

        grid.innerHTML = html || '<div style="grid-column: 1/-1; text-align: center; color: #999;">Vá forjar ou comprar itens.</div>';
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
    bindModal('open-backpack-btn', 'close-backpack-btn', 'backpack-modal', () => window.BackpackV2.render('mat'));
    
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
        if (e.target.classList.contains('bp-tab-btn')) {
            document.querySelectorAll('.bp-tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            window.BackpackV2.render(e.target.dataset.tab);
        }
    });

    document.querySelectorAll('.equip-slot.dropzone').forEach(zone => {
        zone.addEventListener('dragover', (e) => { 
            e.preventDefault(); 
            if (window.DRAGGED_ITEM && window.DRAGGED_ITEM.type === zone.dataset.droptype) zone.classList.add('drag-over'); 
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => window.WorkbenchV2.handleDrop(e, zone));
    });

});