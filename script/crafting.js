/* ==========================================================================
   SISTEMA DE CRAFTING: FORJA EM 3 COLUNAS, LABORATÓRIO E MONTAGEM
   ========================================================================== */

   function safeGet(id) { return document.getElementById(id); }

   if (!window.BOOSTS) {
       window.BOOSTS = [
           { id: 'boost_luck', name: 'Essência de Sorte', price: 75000, icon: '🍀', desc: 'Sorte Permanente (+50)', stat: 'luck', val: 50 },
           { id: 'boost_value', name: 'Extrato de Ouro', price: 150000, icon: '💎', desc: 'Lucro Permanente (+0.2x)', stat: 'value', val: 0.2 },
           { id: 'boost_size', name: 'Soro Gigante', price: 450000, icon: '📏', desc: 'Chance de 67cm (+2%)', stat: 'chance67', val: 0.02 }
       ];
   }
   
   document.addEventListener('DOMContentLoaded', () => {
       safeGet('open-shop-btn')?.addEventListener('click', () => { safeGet('shop-modal')?.classList.remove('hidden'); window.renderShop(); });
       safeGet('close-shop-btn')?.addEventListener('click', () => safeGet('shop-modal')?.classList.add('hidden'));
   
       safeGet('open-craft-btn')?.addEventListener('click', () => { safeGet('craft-modal')?.classList.remove('hidden'); renderRecipeList(); });
       safeGet('close-craft-btn')?.addEventListener('click', () => safeGet('craft-modal')?.classList.add('hidden'));
   
       safeGet('open-bait-forge-btn')?.addEventListener('click', () => { safeGet('bait-forge-modal')?.classList.remove('hidden'); renderBaitLabList(); });
       safeGet('close-bait-forge-btn')?.addEventListener('click', () => safeGet('bait-forge-modal')?.classList.add('hidden'));
   
       safeGet('open-workbench-btn')?.addEventListener('click', () => {
           safeGet('craft-modal')?.classList.add('hidden');
           safeGet('workbench-modal')?.classList.remove('hidden');
           renderWorkbench('rod');
           updateWorkbenchSlots();
           document.querySelectorAll('.wb-tab-btn').forEach(b => b.classList.remove('active'));
           document.querySelector('.wb-tab-btn[data-tab="rod"]')?.classList.add('active');
       });
       safeGet('close-workbench-btn')?.addEventListener('click', () => safeGet('workbench-modal')?.classList.add('hidden'));
   
       document.querySelectorAll('.wb-tab-btn').forEach(btn => {
           btn.addEventListener('click', (e) => { 
               document.querySelectorAll('.wb-tab-btn').forEach(b => b.classList.remove('active')); 
               e.target.classList.add('active'); 
               renderWorkbench(e.target.dataset.tab); 
           });
       });
   });
   
   window.buyMaterial = function(id, price) {
       if (window.GAME_STATE.coins >= price) {
           window.GAME_STATE.coins -= price;
           window.GAME_STATE.materials[id] = (window.GAME_STATE.materials[id] || 0) + 1;
           if (safeGet('cat-coins')) safeGet('cat-coins').innerText = window.GAME_STATE.coins.toLocaleString();
           window.renderShop();
           if(typeof window.saveGame === "function") window.saveGame();
       }
   };
   
   window.renderShop = function() {
       const container = safeGet('shop-container');
       if (!container) return;
       container.innerHTML = '';
   
       const addTitle = (text, color = '#555') => { 
           const div = document.createElement('div'); div.className = 'shop-section-title'; div.innerHTML = `<span style="color: ${color};">${text}</span>`; container.appendChild(div); 
       };
   
       addTitle("🧱 Materiais Brutos");
       if(window.MATERIALS) {
           window.MATERIALS.forEach(mat => {
               if (mat.price > 0) {
                   const count = window.GAME_STATE.materials[mat.id] || 0;
                   const div = document.createElement('div'); div.className = `gear-card ${count > 0 ? 'owned' : ''}`;
                   div.innerHTML = `${count > 0 ? `<div class="stack-count">x${count}</div>` : ''}<div style="font-size:2rem">${mat.icon}</div><div style="font-weight:bold; font-size:0.9rem;">${mat.name}</div><div style="font-weight:bold;font-size:0.8rem;color:#e67e22; margin-top:5px;">💰 ${mat.price.toLocaleString()}</div>`;
                   div.addEventListener('click', () => window.buyMaterial(mat.id, mat.price)); container.appendChild(div);
               }
           });
       }
   
       addTitle("🚀 Boosts Químicos (Laboratório)", "#2ecc71");
       if(window.BOOSTS) {
           window.BOOSTS.forEach(bst => {
               const count = window.GAME_STATE.materials[bst.id] || 0;
               const div = document.createElement('div'); div.className = `gear-card ${count > 0 ? 'owned' : ''}`;
               div.style.borderColor = '#2ecc71';
               div.innerHTML = `${count > 0 ? `<div class="stack-count" style="background:#27ae60;">x${count}</div>` : ''}<div style="font-size:1.5rem">${bst.icon}</div><div style="font-weight:bold; font-size:0.8rem;">${bst.name}</div><div style="font-size:0.65rem;color:#555">${bst.desc}</div><div style="font-weight:bold;font-size:0.8rem;color:#e67e22; margin-top:5px;">💰 ${bst.price.toLocaleString()}</div>`;
               div.addEventListener('click', () => window.buyMaterial(bst.id, bst.price)); container.appendChild(div);
           });
       }
   };
   
   function renderRecipeList() {
       const list = safeGet('recipe-list');
       if (!list || !window.CRAFTING_DB) return;
       
       list.innerHTML = `
           <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; height: 100%;">
               <div id="col-rods"><h3 style="font-size: 1.1rem; color: #8e44ad; text-align: center; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #8e44ad; padding-bottom: 5px;">🎣 Varas</h3></div>
               <div id="col-sinkers"><h3 style="font-size: 1.1rem; color: #d35400; text-align: center; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #d35400; padding-bottom: 5px;">🪨 Chumbadas</h3></div>
               <div id="col-knives"><h3 style="font-size: 1.1rem; color: #c0392b; text-align: center; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #c0392b; padding-bottom: 5px;">🔪 Facas</h3></div>
           </div>
       `;
   
       const colRods = safeGet('col-rods'); const colSinkers = safeGet('col-sinkers'); const colKnives = safeGet('col-knives');
       const createCard = (type, id, item, isOwned) => {
           const div = document.createElement('div');
           div.style = `padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 8px; cursor: pointer; background: ${isOwned ? '#d4efdf' : 'white'}; font-family: 'Poppins', sans-serif; font-size: 0.8rem; transition: background 0.2s; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);`;
           div.innerHTML = `<span><strong>${item.name}</strong></span> <span>${isOwned ? '✅' : ''}</span>`;
           div.addEventListener('click', () => renderCraftingArea(type, id, item)); return div;
       };
   
       Object.keys(window.CRAFTING_DB.recipes.rods).forEach(id => { colRods.appendChild(createCard('rod', id, window.CRAFTING_DB.recipes.rods[id], window.GAME_STATE.ownedRods && window.GAME_STATE.ownedRods.includes(parseInt(id)))); });
       Object.keys(window.CRAFTING_DB.recipes.sinkers).forEach(id => { colSinkers.appendChild(createCard('sinker', id, window.CRAFTING_DB.recipes.sinkers[id], window.GAME_STATE.ownedSinkers && window.GAME_STATE.ownedSinkers.includes(id))); });
       Object.keys(window.CRAFTING_DB.recipes.knives).forEach(id => { colKnives.appendChild(createCard('knife', id, window.CRAFTING_DB.recipes.knives[id], window.GAME_STATE.ownedKnives && window.GAME_STATE.ownedKnives.includes(id))); });
   }
   
   window.doCraftItem = function(type, id) {
       if (!window.CRAFTING_DB) return;
       let recipeCategory = type === 'rod' ? 'rods' : (type === 'sinker' ? 'sinkers' : 'knives');
       const recipe = window.CRAFTING_DB.recipes[recipeCategory][id];
       if (!recipe) return;
   
       Object.keys(recipe.req).forEach(matId => { window.GAME_STATE.materials[matId] -= recipe.req[matId]; });
   
       if (type === 'rod') { if (!window.GAME_STATE.ownedRods) window.GAME_STATE.ownedRods = []; window.GAME_STATE.ownedRods.push(parseInt(id)); } 
       else if (type === 'sinker') { if (!window.GAME_STATE.ownedSinkers) window.GAME_STATE.ownedSinkers = []; window.GAME_STATE.ownedSinkers.push(id); } 
       else if (type === 'knife') { if (!window.GAME_STATE.ownedKnives) window.GAME_STATE.ownedKnives = []; window.GAME_STATE.ownedKnives.push(id); }
   
       if (typeof window.saveGame === "function") window.saveGame();
       if (typeof window.showBubble === "function") window.showBubble(`Sucesso! ${recipe.name} forjado. Equipe na Montagem!`, 4000);
       renderRecipeList(); renderCraftingArea(type, id, recipe);
   };
   
   function renderCraftingArea(type, id, recipe) {
       const area = safeGet('crafting-area'); if (!area) return;
       let canCraft = true; let reqHtml = '';
   
       Object.keys(recipe.req).forEach(matId => {
           const needed = recipe.req[matId]; const have = window.GAME_STATE.materials[matId] || 0; 
           const matData = window.MATERIALS ? window.MATERIALS.find(m => m.id === matId) : null;
           if (have < needed) canCraft = false;
           reqHtml += `<div style="display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 10px; border-radius: 8px; border: 1px solid ${have >= needed ? '#2ecc71' : '#e74c3c'}; margin-bottom: 10px; width: 100%; font-family: 'Poppins', sans-serif;"><span>${matData ? matData.icon : '📦'} ${matData ? matData.name : matId}</span><span style="font-weight: bold; color: ${have >= needed ? '#2ecc71' : '#e74c3c'}">${have} / ${needed}</span></div>`;
       });
   
       const isOwned = type === 'rod' ? (window.GAME_STATE.ownedRods && window.GAME_STATE.ownedRods.includes(parseInt(id))) : type === 'sinker' ? (window.GAME_STATE.ownedSinkers && window.GAME_STATE.ownedSinkers.includes(id)) : (window.GAME_STATE.ownedKnives && window.GAME_STATE.ownedKnives.includes(id));
   
       area.innerHTML = `
           <h2 style="color: #8e44ad; margin-bottom: 20px; font-family: 'Fredoka', sans-serif; text-align: center;">${recipe.name}</h2>
           <div style="width: 100%; max-width: 300px;">${reqHtml}</div>
           ${isOwned ? `<div style="margin-top: 20px; font-weight: bold; color: #27ae60; font-family: 'Poppins', sans-serif; text-align: center;">✅ Você já possui este item!</div>` 
           : `<button onclick="window.doCraftItem('${type}', '${id}')" ${!canCraft ? 'disabled' : ''} style="margin-top: 20px; padding: 12px 30px; font-size: 1.2rem; font-family: 'Fredoka', sans-serif; font-weight: bold; background: ${canCraft ? '#8e44ad' : '#ccc'}; color: white; border: none; border-radius: 20px; cursor: ${canCraft ? 'pointer' : 'not-allowed'}; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: transform 0.2s;">${canCraft ? '🔨 FORJAR' : 'Faltam Materiais'}</button>`}
       `;
   }
   
   // ==========================================
   // 5. LABORATÓRIO QUÍMICO 200% (DARK THEME)
   // ==========================================
   let activeBaitRecipe = null;
   let activeBoosts = []; 
   
   function renderBaitLabList() {
       if (!window.GAME_STATE.baitBoosts) window.GAME_STATE.baitBoosts = {};
   
       const list = safeGet('bait-recipe-list');
       if (!list || !window.BAITS) return;
       list.innerHTML = '<h3 style="font-size: 1.2rem; color: #1e8449; text-align: center; margin-bottom: 15px; font-family:\'Fredoka\'; text-transform:uppercase; letter-spacing:1px;">Fórmulas</h3>';
       
       window.BAITS.forEach(bait => {
           if (!bait.req) return; 
           const count = window.GAME_STATE.baitInventory[bait.id] || 0;
           const isActive = activeBaitRecipe && activeBaitRecipe.id === bait.id;
           
           const div = document.createElement('div');
           div.style = `padding: 12px 15px; border: 2px solid ${isActive ? '#2ecc71' : '#e0e0e0'}; border-radius: 12px; margin-bottom: 10px; cursor: pointer; background: ${isActive ? '#f0fdf4' : 'white'}; box-shadow: ${isActive ? '0 4px 15px rgba(46,204,113,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'}; font-family: 'Poppins', sans-serif; transition: all 0.2s; position: relative; overflow: hidden;`;
           if (isActive) div.innerHTML += `<div style="position:absolute; top:0; left:0; width:6px; height:100%; background:#2ecc71;"></div>`;
           
           div.innerHTML += `
               <div style="display:flex; justify-content:space-between; align-items:center;">
                   <strong style="font-size:1.05rem; color:#2c3e50;">${bait.icon} ${bait.name}</strong>
                   <span style="background:#333; color:white; padding:2px 8px; border-radius:10px; font-size:0.7rem; font-weight:bold;">x${count}</span>
               </div>
           `;
           div.addEventListener('click', () => { activeBaitRecipe = bait; renderBaitLabList(); renderBaitLabArea(); });
           list.appendChild(div);
       });
       
       renderBaitInventory(); 
   }
   
   window.addBoost = function(id) {
       const totalOwned = window.GAME_STATE.materials[id] || 0;
       const currentlyInTubes = activeBoosts.filter(b => b === id).length;
   
       if (totalOwned <= currentlyInTubes) {
           if(typeof window.showBubble === "function") window.showBubble("Você não tem mais deste boost! Compre na loja.", 3000);
           return;
       }
   
       if (activeBoosts.length < 2) {
           activeBoosts.push(id);
           renderBaitLabList();
           renderBaitLabArea();
       } else {
           if(typeof window.showBubble === "function") window.showBubble("Reator no limite! Clique num catalisador laranja para remover.", 3000);
       }
   }
   
   window.removeBoost = function(index) {
       if (index < activeBoosts.length) {
           activeBoosts.splice(index, 1);
           renderBaitLabList();
           renderBaitLabArea();
       }
   }
   
   function renderBaitLabArea() {
       const resultArea = safeGet('bait-craft-result');
       
       if (!activeBaitRecipe) {
           safeGet('bait-content-1').innerHTML = '<div style="font-size: 1.8rem; opacity: 0.3;">🧪</div>';
           safeGet('bait-content-2').innerHTML = '<div style="font-size: 1.8rem; opacity: 0.3;">🧪</div>';
           safeGet('bait-content-3').innerHTML = '<div style="font-size: 1rem; color:#f39c12; opacity:0.5; margin-top:10px;">Vazio</div>';
           safeGet('bait-content-4').innerHTML = '<div style="font-size: 1rem; color:#f39c12; opacity:0.5; margin-top:10px;">Vazio</div>';
           resultArea.innerHTML = `<div style="color:#7f8c8d; font-family:'Poppins', sans-serif;">Aguardando inserção de fórmula química à esquerda...</div>`;
           return;
       }
   
       let canCraft = true;
       const reqKeys = Object.keys(activeBaitRecipe.req);
       const req1 = reqKeys[0];
       const req2 = reqKeys[1]; 
       
       const updateSlot = (slotNum, reqId) => {
           const content = safeGet(`bait-content-${slotNum}`);
           if (!reqId) { content.innerHTML = '🧪'; return; }
           const needed = activeBaitRecipe.req[reqId];
           const have = window.GAME_STATE.materials[reqId] || 0;
           const matData = window.MATERIALS ? window.MATERIALS.find(m => m.id === reqId) : null;
           if (have < needed) canCraft = false;
           // Textos brancos/verdes para brilhar no fundo escuro
           content.innerHTML = `<div style="font-size:1.8rem; filter: drop-shadow(0 0 5px rgba(255,255,255,0.5));">${matData ? matData.icon : '📦'}</div><div style="font-size:0.8rem; font-weight:bold; color:${have>=needed ? '#2ecc71' : '#e74c3c'}; margin-top:5px; text-shadow: 0 0 5px #000;">${have} / ${needed}</div>`;
       };
       
       updateSlot(1, req1);
       updateSlot(2, req2);
   
       for (let i = 0; i < 2; i++) {
           const content = safeGet(`bait-content-${i + 3}`);
           if (activeBoosts[i]) {
               const boostData = window.BOOSTS.find(b => b.id === activeBoosts[i]);
               content.innerHTML = `<div style="font-size:1.8rem; filter: drop-shadow(0 0 5px rgba(243,156,18,0.8));">${boostData.icon}</div><div style="font-size:0.75rem; font-weight:bold; color:#f1c40f; margin-top:5px; text-shadow: 0 0 5px #000;">Injetado!</div>`;
           } else {
               content.innerHTML = `<div style="font-size:0.8rem; color:#f39c12; opacity:0.5; margin-top:10px;">Vazio</div>`;
           }
       }
       
       let currentBaitBoostLvl = window.GAME_STATE.baitBoosts[activeBaitRecipe.id] || { luck: 0, value: 0, chance67: 0 };
       let addedLuck = 0, addedValue = 0, addedChance67 = 0;
       
       activeBoosts.forEach(bId => {
           const bData = window.BOOSTS.find(b => b.id === bId);
           if(bData) {
               if (bData.stat === 'luck') addedLuck += bData.val;
               if (bData.stat === 'value') addedValue += bData.val;
               if (bData.stat === 'chance67') addedChance67 += bData.val;
           }
       });
   
       const formatBoost = (current, added, isMult, isPerc) => {
           let text = current;
           if (isMult) text = current.toFixed(1) + 'x';
           if (isPerc) text = (current * 100).toFixed(0) + '%';
           if (added > 0) {
               let aText = added;
               if (isMult) aText = added.toFixed(1) + 'x';
               if (isPerc) aText = (added * 100).toFixed(0) + '%';
               text += ` <span style="color:#2ecc71; font-weight:900; text-shadow:0 0 5px rgba(46,204,113,0.5);">(+${aText})</span>`;
           }
           return text;
       };
   
       resultArea.innerHTML = `
           <div style="font-size:1.4rem; font-weight:900; margin-bottom:5px; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.3);">${activeBaitRecipe.icon} ${activeBaitRecipe.name} <span style="color:#2ecc71;">(x${activeBaitRecipe.qty})</span></div>
           <div style="font-size:0.85rem; color: #bdc3c7; margin-bottom:10px;">Efeito Base: <span style="color:white;">${activeBaitRecipe.desc}</span></div>
           <div style="font-size:0.8rem; background:rgba(243,156,18,0.15); padding:8px 15px; border-radius:8px; border:1px solid #f39c12; color: #f39c12; margin-bottom:15px; font-weight:bold; display:inline-block; box-shadow: inset 0 0 10px rgba(243,156,18,0.1);">
               <span style="color:#fff;">⚡ Upgrades Aplicados:</span> Sorte ${formatBoost(currentBaitBoostLvl.luck, addedLuck, false, false)} | Lucro ${formatBoost(currentBaitBoostLvl.value, addedValue, true, false)} | 67cm ${formatBoost(currentBaitBoostLvl.chance67, addedChance67, false, true)}
           </div>
           <button id="btn-craft-bait" style="padding: 12px 35px; font-size: 1.1rem; font-family: 'Fredoka', sans-serif; font-weight: bold; background: ${canCraft ? 'linear-gradient(to bottom, #2ecc71, #27ae60)' : '#7f8c8d'}; color: white; border: none; border-radius: 25px; cursor: ${canCraft ? 'pointer' : 'not-allowed'}; box-shadow: 0 5px 15px ${canCraft ? 'rgba(46,204,113,0.4)' : 'rgba(0,0,0,0.2)'}; text-transform: uppercase; letter-spacing: 1px; transition: all 0.2s;">
               ${canCraft ? '⚗️ Iniciar Síntese' : 'Faltam Extratos Base'}
           </button>
       `;
       
       if (canCraft) {
           const btn = safeGet('btn-craft-bait');
           btn.addEventListener('click', () => {
               Object.keys(activeBaitRecipe.req).forEach(matId => { window.GAME_STATE.materials[matId] -= activeBaitRecipe.req[matId]; });
               
               if (!window.GAME_STATE.baitBoosts[activeBaitRecipe.id]) {
                   window.GAME_STATE.baitBoosts[activeBaitRecipe.id] = { luck: 0, value: 0, chance67: 0 };
               }
               activeBoosts.forEach(bId => {
                   window.GAME_STATE.materials[bId] -= 1;
                   const bData = window.BOOSTS.find(b => b.id === bId);
                   window.GAME_STATE.baitBoosts[activeBaitRecipe.id][bData.stat] += bData.val;
               });
   
               window.GAME_STATE.baitInventory[activeBaitRecipe.id] = (window.GAME_STATE.baitInventory[activeBaitRecipe.id] || 0) + activeBaitRecipe.qty;
               
               if(typeof window.saveGame === "function") window.saveGame();
               if(typeof window.showBubble === "function") window.showBubble(`Química Pura! ${activeBaitRecipe.qty}x ${activeBaitRecipe.name} sintetizadas!`, 4000);
               
               activeBoosts = []; 
               renderBaitLabList();
               renderBaitLabArea(); 
           });
           
           btn.addEventListener('mousedown', function() { this.style.transform = 'translateY(4px)'; this.style.boxShadow = 'none'; });
           btn.addEventListener('mouseup', function() { this.style.transform = 'translateY(0)'; this.style.boxShadow = '0 5px 15px rgba(46,204,113,0.4)'; });
       }
   }
   
   function renderBaitInventory() {
       const inv = safeGet('bait-mat-inventory');
       if (!inv || !window.MATERIALS) return;
       
       // Seção de Extratos
       let html = '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #bdc3c7; padding-bottom: 10px; margin-bottom: 15px;"><h4 style="margin:0; color:#2c3e50; font-family:\'Fredoka\'; font-size:1.2rem;">📦 Depósito de Extratos</h4><span style="font-size:0.8rem; color:#7f8c8d; font-weight:bold;">Recicle lixo para obter mais.</span></div>';
       html += '<div class="shop-grid" style="padding:0; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); margin-bottom: 30px;">';
       
       let hasMats = false;
       window.MATERIALS.forEach(mat => {
           if (mat.price === 0) {
               const count = window.GAME_STATE.materials[mat.id] || 0;
               if (count > 0) {
                   hasMats = true;
                   html += `<div class="gear-card" style="cursor:default; border-color:#ccc; background:white; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><div class="stack-count" style="background:#34495e;">x${count}</div><div style="font-size:2rem; margin-bottom:5px;">${mat.icon}</div><div style="font-size:0.75rem; font-weight:bold; line-height:1.1; color:#333;">${mat.name}</div></div>`;
               }
           }
       });
       if (!hasMats) html += `<div style="grid-column: 1/-1; color:#999; font-size:0.9rem;">Nenhum extrato disponível. Vá pescar sucata!</div>`;
       html += '</div>';
   
       // Seção de Boosts
       html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #f39c12; padding-bottom: 10px; margin-bottom: 15px;"><h4 style="margin:0; color:#d35400; font-family:\'Fredoka\'; font-size:1.2rem;">⚡ Catalisadores</h4><span style="font-size:0.8rem; color:#e67e22; font-weight:bold;">Clique para injetar no reator.</span></div>';
       html += '<div class="shop-grid" style="padding:0; grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));">';
       
       let hasBoosts = false;
       window.BOOSTS.forEach(bst => {
           const count = window.GAME_STATE.materials[bst.id] || 0;
           const usedCount = activeBoosts.filter(b => b === bst.id).length;
           const available = count - usedCount;
   
           if (count > 0) {
               hasBoosts = true;
               html += `<div class="gear-card" onclick="window.addBoost('${bst.id}')" style="border: 2px solid #f39c12; background: #fffdf7; cursor:pointer; transition:0.2s; box-shadow: 0 4px 10px rgba(243,156,18,0.1);"><div class="stack-count" style="background:#d35400; font-size:0.8rem; padding: 2px 8px;">Disponível: ${available}</div><div style="font-size:2rem; margin-bottom:5px; filter:drop-shadow(0 2px 2px rgba(243,156,18,0.4));">${bst.icon}</div><div style="font-size:0.75rem; font-weight:bold; line-height:1.1; color:#d35400;">${bst.name}</div></div>`;
           }
       });
       if (!hasBoosts) html += `<div style="grid-column: 1/-1; color:#999; font-size:0.9rem;">Nenhum catalisador. Compre na Loja de Materiais.</div>`;
       html += '</div>';
   
       inv.innerHTML = html;
   }
   
   // ==========================================
   // 6. MESA DE TRABALHO E DRAG & DROP
   // ==========================================
   function renderWorkbench(tab) {
       const grid = safeGet('workbench-grid'); 
       if(!grid) return; grid.innerHTML = ''; let isEmpty = true;
   
       if (tab === 'rod') {
           if(window.GAME_STATE.ownedRods) {
               window.GAME_STATE.ownedRods.forEach(id => {
                   const rod = window.GAME_STATE.rods ? window.GAME_STATE.rods.find(r => r.id === id) : null;
                   if(rod) { 
                       isEmpty = false;
                       const isEq = window.GAME_STATE.currentRodIndex === rod.id;
                       const div = document.createElement('div'); 
                       div.className = `rod-card draggable-item ${isEq ? 'equipped' : ''}`; 
                       div.draggable = true; div.dataset.type = 'rod'; div.dataset.id = rod.id; 
                       div.innerHTML = `<div>${rod.name}</div><div class="rod-tier-${rod.id}" style="height:4px;width:80%;margin:4px auto;"></div><div style="font-size:0.6rem; color:#8e44ad; font-weight:bold; margin-top:5px;">🖱️ Arraste p/ o Slot</div>`; 
                       div.addEventListener('dragstart', handleDragStart); grid.appendChild(div); 
                   }
               });
           }
       } 
       else if (tab === 'sink') {
           if(window.GAME_STATE.ownedSinkers) {
               window.GAME_STATE.ownedSinkers.forEach(id => {
                   const sink = window.SINKERS ? window.SINKERS.find(s => s.id === id) : null;
                   if(sink) { 
                       isEmpty = false;
                       const isEq = window.GAME_STATE.currentSinker === sink.id;
                       const div = document.createElement('div'); 
                       div.className = `gear-card draggable-item ${isEq ? 'equipped' : ''}`; 
                       div.draggable = true; div.dataset.type = 'sinker'; div.dataset.id = sink.id; 
                       div.innerHTML = `<div style="font-weight:bold; font-size:0.9rem;">${sink.name}</div><div style="font-size:0.6rem; color:#d35400; font-weight:bold; margin-top:8px;">🖱️ Arraste p/ o Slot</div>`; 
                       div.addEventListener('dragstart', handleDragStart); grid.appendChild(div); 
                   }
               });
           }
       } 
       else if (tab === 'knife') {
           if(window.GAME_STATE.ownedKnives) {
               window.GAME_STATE.ownedKnives.forEach(id => {
                   const knife = window.KNIVES ? window.KNIVES.find(k => k.id === id) : null;
                   if(knife) { 
                       isEmpty = false;
                       const isEq = window.GAME_STATE.currentKnife === knife.id;
                       const div = document.createElement('div'); 
                       div.className = `gear-card draggable-item ${isEq ? 'equipped' : ''}`; 
                       div.draggable = true; div.dataset.type = 'knife'; div.dataset.id = knife.id; 
                       div.innerHTML = `<div style="font-weight:bold; font-size:0.9rem;">${knife.name}</div><div style="font-size:0.6rem; color:#c0392b; font-weight:bold; margin-top:8px;">🖱️ Arraste p/ o Slot</div>`; 
                       div.addEventListener('dragstart', handleDragStart); grid.appendChild(div); 
                   }
               });
           }
       } 
       else if (tab === 'bait') {
           if(window.GAME_STATE.baitInventory) {
               Object.keys(window.GAME_STATE.baitInventory).forEach(id => {
                   const count = window.GAME_STATE.baitInventory[id]; 
                   const bait = window.BAITS ? window.BAITS.find(b => b.id === id) : null;
                   if(count > 0 && bait) { 
                       isEmpty = false;
                       const isEq = window.GAME_STATE.currentBait === bait.id;
                       const div = document.createElement('div'); 
                       div.className = `gear-card draggable-item ${isEq ? 'equipped' : ''}`; 
                       div.draggable = true; div.dataset.type = 'bait'; div.dataset.id = bait.id; 
                       div.innerHTML = `<div class="stack-count">x${count}</div><div style="font-size:1.5rem">${bait.icon}</div><div style="font-weight:bold; font-size:0.8rem;">${bait.name}</div><div style="font-size:0.6rem; color:#27ae60; font-weight:bold; margin-top:5px;">🖱️ Arraste p/ o Slot</div>`; 
                       div.addEventListener('dragstart', handleDragStart); grid.appendChild(div); 
                   }
               });
           }
       }
   
       if (isEmpty) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; font-family: Poppins; margin-top: 40px;">Você não tem itens nesta categoria.</div>';
   }
   
   function updateWorkbenchSlots() {
       const rod = (window.GAME_STATE.rods || []).find(r => r.id === window.GAME_STATE.currentRodIndex) || (window.GAME_STATE.rods ? window.GAME_STATE.rods[0] : {name: 'Nenhuma'});
       safeGet('wb-rod-content').innerHTML = `<span style="color:#8e44ad">${rod.name}</span>`;
   
       const sinker = (window.SINKERS || []).find(s => s.id === window.GAME_STATE.currentSinker) || {name: 'Padrão'};
       safeGet('wb-sinker-content').innerHTML = `<span style="color:#d35400">${sinker.name}</span>`;
   
       const knife = (window.KNIVES || []).find(k => k.id === window.GAME_STATE.currentKnife) || {name: 'Nenhuma'};
       safeGet('wb-knife-content').innerHTML = `<span style="color:#c0392b">${knife.name}</span>`;
   
       const baitDisplay = safeGet('wb-bait-content');
       if (window.GAME_STATE.currentBait && window.BAITS) {
           const bait = window.BAITS.find(b => b.id === window.GAME_STATE.currentBait);
           if(bait) baitDisplay.innerHTML = `<span style="color:#27ae60">${bait.icon} ${bait.name}</span>`;
       } else {
           if(baitDisplay) baitDisplay.innerText = "Nenhuma Isca";
       }
   }
   
   let draggedItem = null;
   
   function handleDragStart(e) { 
       draggedItem = { type: e.currentTarget.dataset.type, id: e.currentTarget.dataset.id }; 
       e.dataTransfer.setData('text/plain', ''); 
   }
   
   document.addEventListener('DOMContentLoaded', () => {
       const dropzones = document.querySelectorAll('.equip-slot.dropzone');
   
       dropzones.forEach(zone => {
           zone.addEventListener('dragover', (e) => { 
               e.preventDefault(); 
               if (draggedItem && draggedItem.type === zone.dataset.droptype) {
                   zone.classList.add('drag-over'); 
               } 
           });
   
           zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
   
           zone.addEventListener('drop', (e) => {
               e.preventDefault(); 
               zone.classList.remove('drag-over');
               
               if (draggedItem && draggedItem.type === zone.dataset.droptype) {
                   if (draggedItem.type === 'rod') window.GAME_STATE.currentRodIndex = parseInt(draggedItem.id);
                   if (draggedItem.type === 'sinker') window.GAME_STATE.currentSinker = draggedItem.id;
                   if (draggedItem.type === 'knife') window.GAME_STATE.currentKnife = draggedItem.id;
                   if (draggedItem.type === 'bait') window.GAME_STATE.currentBait = draggedItem.id;
                   
                   updateWorkbenchSlots();
                   renderWorkbench(draggedItem.type);
   
                   if(typeof window.updateUI === "function") window.updateUI(); 
                   if(typeof window.saveGame === "function") window.saveGame();
               }
               draggedItem = null;
           });
       });
   });