/* ==========================================================================
   SISTEMA DE CRAFTING, LOJA E MESA DE MONTAGEM
   ========================================================================== */

   function safeGet(id) { return document.getElementById(id); }

   window.SHOP_MULTIPLIER = 1; 
   
   function injectModernCraftingStyles() {
       if (document.getElementById('modern-crafting-styles')) return;
       const style = document.createElement('style');
       style.id = 'modern-crafting-styles';
       style.innerHTML = `
           @keyframes floatItem { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
           
           .modern-shop-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border-radius: 16px; transition: all 0.3s ease; border-top: 1px solid rgba(255,255,255,0.1); border-left: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; }
           .modern-shop-card:hover { transform: translateY(-6px) scale(1.02); z-index: 10; background: rgba(30, 41, 59, 0.9); }
           .modern-btn { background: rgba(255,255,255,0.05); backdrop-filter: blur(5px); border-radius: 8px; color: #fff; font-family: 'Poppins', sans-serif; font-weight: 600; transition: 0.2s; cursor: pointer; flex: 1; padding: 10px 0; border: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; }
           .modern-btn:hover:not(:disabled) { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
           
           .forge-diagram-card { background: rgba(15, 23, 42, 0.6); border-left: 3px solid transparent; transition: 0.2s ease; padding: 12px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; min-height: 60px; font-family: 'Poppins', sans-serif; }
           .forge-diagram-card:hover { background: rgba(30, 41, 59, 0.9); padding-left: 20px; }
   
           /* ESTILOS DO INVENTÁRIO (QUADRADINHOS RPG) */
           .wb-item-card {
               background: linear-gradient(145deg, #1e293b, #0f172a);
               border: 1px solid #334155;
               border-radius: 12px;
               padding: 10px 5px;
               display: flex; flex-direction: column; align-items: center; justify-content: center;
               cursor: pointer; position: relative; transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
               box-shadow: inset 0 2px 10px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.2);
               user-select: none; aspect-ratio: 1 / 1; overflow: hidden;
           }
           .wb-item-card:hover {
               transform: translateY(-4px); border-color: #38bdf8;
               box-shadow: 0 8px 20px rgba(56, 189, 248, 0.25), inset 0 2px 10px rgba(255,255,255,0.05);
               background: linear-gradient(145deg, #1e293b, #172554);
           }
           .wb-item-card.equipped {
               border-color: #10b981; background: linear-gradient(145deg, rgba(16, 185, 129, 0.2), #0f172a);
               box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.2);
           }
           .wb-badge-equipped {
               position: absolute; top: -1px; right: -1px; background: #10b981; color: white;
               font-size: 0.55rem; font-weight: 900; padding: 2px 6px; 
               border-bottom-left-radius: 8px; border-top-right-radius: 11px;
               text-transform: uppercase; letter-spacing: 0.5px; box-shadow: -2px 2px 5px rgba(0,0,0,0.3); z-index: 5;
           }
           
           .wb-slot-container {
               background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.9)) !important;
               border: 2px dashed rgba(148, 163, 184, 0.3) !important; border-radius: 12px !important;
               padding: 12px !important; margin-bottom: 10px !important; transition: all 0.3s ease !important;
               box-shadow: inset 0 4px 15px rgba(0,0,0,0.4) !important;
           }
           .wb-slot-container.drag-over {
               border-color: #3b82f6 !important; background: rgba(59, 130, 246, 0.15) !important; transform: scale(1.02) !important;
           }
       `;
       document.head.appendChild(style);
   }
   
   document.addEventListener('DOMContentLoaded', () => {
       injectModernCraftingStyles();
   
       if (!window.BOOSTS || window.BOOSTS.length <= 3) {
           window.BOOSTS = [
               { id: 'boost_luck', name: 'Essência de Sorte', price: 75000, icon: '🍀', desc: 'Sorte (+50)', stat: 'luck', val: 50 },
               { id: 'boost_value', name: 'Extrato de Ouro', price: 150000, icon: '💎', desc: 'Lucro (+0.2x)', stat: 'value', val: 0.2 },
               { id: 'boost_luck_2', name: 'Trevo Mutante', price: 300000, icon: '☢️', desc: 'Sorte (+200)', stat: 'luck', val: 200 },
               { id: 'boost_value_2', name: 'Barra de Ouro Puro', price: 400000, icon: '🏆', desc: 'Lucro (+0.5x)', stat: 'value', val: 0.5 },
               { id: 'boost_size', name: 'Soro Gigante', price: 450000, icon: '📏', desc: 'Chance 67cm (+2%)', stat: 'chance67', val: 0.02 },
               { id: 'boost_speed', name: 'Motor de Dobra', price: 600000, icon: '🚀', desc: 'Velocidade (+0.5x)', stat: 'speed', val: 0.5 },
               { id: 'boost_size_2', name: 'Soro Leviatã', price: 1000000, icon: '🐉', desc: 'Chance 67cm (+5%)', stat: 'chance67', val: 0.05 },
               { id: 'boost_luck_3', name: 'Bênção Divina', price: 2500000, icon: '🌟', desc: 'Sorte (+1000)', stat: 'luck', val: 1000 }
           ];
       }
   
       safeGet('open-shop-btn')?.addEventListener('click', () => { safeGet('shop-modal')?.classList.remove('hidden'); window.renderShop(); });
       safeGet('close-shop-btn')?.addEventListener('click', () => safeGet('shop-modal')?.classList.add('hidden'));
   
       safeGet('open-craft-btn')?.addEventListener('click', () => { safeGet('craft-modal')?.classList.remove('hidden'); renderRecipeList(); });
       safeGet('close-craft-btn')?.addEventListener('click', () => safeGet('craft-modal')?.classList.add('hidden'));
   
       safeGet('open-bait-forge-btn')?.addEventListener('click', () => { safeGet('bait-forge-modal')?.classList.remove('hidden'); renderBaitLabList(); });
       safeGet('close-bait-forge-btn')?.addEventListener('click', () => safeGet('bait-forge-modal')?.classList.add('hidden'));
   
       safeGet('open-workbench-btn')?.addEventListener('click', () => {
           safeGet('craft-modal')?.classList.add('hidden');
           safeGet('workbench-modal')?.classList.remove('hidden');
           document.querySelectorAll('.wb-tab-btn').forEach(b => b.classList.remove('active'));
           document.querySelector('.wb-tab-btn[data-tab="rod"]').classList.add('active');
           renderWorkbench('rod'); updateWorkbenchSlots();
       });
       safeGet('close-workbench-btn')?.addEventListener('click', () => safeGet('workbench-modal')?.classList.add('hidden'));
   
       document.querySelectorAll('.wb-tab-btn').forEach(btn => {
           btn.addEventListener('click', (e) => { 
               document.querySelectorAll('.wb-tab-btn').forEach(b => b.classList.remove('active')); 
               e.target.classList.add('active'); renderWorkbench(e.target.dataset.tab); 
           });
       });
   });
   
   function getRarityColor(price) {
       if (price <= 5000) return '#94a3b8'; if (price <= 80000) return '#34d399'; 
       if (price <= 850000) return '#38bdf8'; if (price <= 5000000) return '#c084fc'; 
       if (price <= 20000000) return '#fbbf24'; return '#fb7185'; 
   }
   
   // ==========================================================================
   // LOJA (MERCADO NEGRO) - COM BOTÃO DE FECHAR
   // ==========================================================================
   window.buyMaterial = function(id, basePrice, qty) {
       const totalCost = basePrice * qty;
       if (window.GAME_STATE && window.GAME_STATE.coins >= totalCost) {
           window.GAME_STATE.coins -= totalCost;
           if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
           window.GAME_STATE.materials[id] = (window.GAME_STATE.materials[id] || 0) + qty;
           if (safeGet('cat-coins')) safeGet('cat-coins').innerText = window.GAME_STATE.coins.toLocaleString();
           window.renderShop(); 
           if(typeof window.saveGame === "function") window.saveGame();
       } else {
           if(window.showToast) window.showToast("Fundos Insuficientes", `Faltam moedas para comprar esta quantidade.`, "error");
       }
   };
   
   window.renderShop = function() {
       const container = safeGet('shop-container'); if (!container) return;
       const state = window.GAME_STATE || { materials: {}, coins: 0 };
       
       // NOTA: O Botão de fechar (X) foi adicionado à direita do contador de moedas!
       let html = `
           <div style="background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); position: sticky; top: 0; z-index: 50;">
               <div>
                   <h2 style="margin: 0; color: #f8fafc; font-family: 'Fredoka', sans-serif; font-size: 2rem; letter-spacing: 1px; display: flex; align-items: center; gap: 10px;">
                       <span style="background: -webkit-linear-gradient(45deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Mercado Negro</span>
                   </h2>
               </div>
               <div style="display: flex; align-items: center; gap: 20px;">
                   <div id="shop-live-coins" style="background: rgba(0,0,0,0.5); padding: 10px 25px; border-radius: 30px; border: 1px solid rgba(251, 191, 36, 0.3); color: #f8fafc; font-weight: 800; font-size: 1.4rem; font-family: 'Poppins', sans-serif;">
                       <span style="color:#fbbf24">🪙</span> ${state.coins.toLocaleString()}
                   </div>
                   <button onclick="document.getElementById('shop-modal').classList.add('hidden')" style="background: none; border: none; color: #94a3b8; font-size: 2.5rem; cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'">&times;</button>
               </div>
           </div>
           <div class="custom-scrollbar" style="padding: 30px; background: url('/img/asset/bg-dark-pattern.png') repeat, #0f172a; overflow-y: auto; max-height: 65vh;">
       `;
   
       const buildCard = (item, isBoost) => {
           const count = (state.materials && state.materials[item.id]) ? state.materials[item.id] : 0;
           const color = isBoost ? '#fb923c' : getRarityColor(item.price);
           const canBuy1 = state.coins >= item.price;
           const canBuy10 = state.coins >= (item.price * 10);
           const canBuy100 = state.coins >= (item.price * 100);
   
           return `
               <div class="modern-shop-card" style="box-shadow: 0 10px 30px -10px ${color}33;">
                   <div style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); color: #f8fafc; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; font-family: 'Poppins', sans-serif; border: 1px solid ${color}66;">📦 Estoque: ${count}</div>
                   <div style="padding: 30px 20px 20px 20px; text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; background: radial-gradient(circle at top, ${color}15, transparent 70%);">
                       <div style="font-size: 3.5rem; margin-bottom: 15px; animation: floatItem 6s ease-in-out infinite;">${item.icon}</div>
                       <div style="color: #f8fafc; font-family: 'Fredoka', sans-serif; font-size: 1.1rem; font-weight: 600; margin-bottom: 5px;">${item.name}</div>
                       ${isBoost ? `<div style="color: ${color}; font-size: 0.8rem; font-family: 'Poppins', sans-serif; margin-bottom: 5px; font-weight: bold; background: ${color}22; padding: 2px 10px; border-radius: 10px;">${item.desc}</div>` : ''}
                       <div style="color: #fbbf24; font-weight: 800; font-size: 1.1rem; font-family: 'Poppins', sans-serif; margin-top: auto; padding-top: 15px;">🪙 ${item.price.toLocaleString()}</div>
                   </div>
                   <div style="padding: 15px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05);">
                       <div style="display: flex; gap: 8px; width: 100%;">
                           <button class="modern-btn" onclick="${canBuy1 ? `window.buyMaterial('${item.id}', ${item.price}, 1)` : ''}" style="background: ${canBuy1 ? `rgba(255,255,255,0.1)` : 'rgba(0,0,0,0.3)'}; color: ${canBuy1 ? '#fff' : '#64748b'};">1x</button>
                           <button class="modern-btn" onclick="${canBuy10 ? `window.buyMaterial('${item.id}', ${item.price}, 10)` : ''}" style="background: ${canBuy10 ? `rgba(255,255,255,0.1)` : 'rgba(0,0,0,0.3)'}; color: ${canBuy10 ? '#fff' : '#64748b'};">10x</button>
                           <button class="modern-btn" onclick="${canBuy100 ? `window.buyMaterial('${item.id}', ${item.price}, 100)` : ''}" style="background: ${canBuy100 ? `rgba(255,255,255,0.1)` : 'rgba(0,0,0,0.3)'}; color: ${canBuy100 ? '#fff' : '#64748b'};">100x</button>
                       </div>
                   </div>
               </div>
           `;
       };
   
       html += `<div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;"><h3 style="margin: 0; color: #e2e8f0; font-family: 'Fredoka', sans-serif; font-size: 1.5rem;">💎 Matérias-Primas</h3><div style="height: 1px; flex: 1; background: linear-gradient(90deg, rgba(255,255,255,0.2), transparent);"></div></div>`;
       html += `<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 50px;">`;
       if(window.MATERIALS) window.MATERIALS.forEach(mat => { if (mat.price > 0) html += buildCard(mat, false); });
       html += `</div>`; 
   
       html += `<div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;"><h3 style="margin: 0; color: #e2e8f0; font-family: 'Fredoka', sans-serif; font-size: 1.5rem;">⚡ Catalisadores de Laboratório</h3><div style="height: 1px; flex: 1; background: linear-gradient(90deg, rgba(255,255,255,0.2), transparent);"></div></div>`;
       html += `<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">`;
       if(window.BOOSTS) window.BOOSTS.forEach(bst => { html += buildCard(bst, true); });
       html += `</div></div>`; 
       
       container.innerHTML = html;
   };
   
   // ==========================================================================
   // GRANDE FORJA
   // ==========================================================================
   function renderRecipeList() {
       const list = safeGet('recipe-list'); if (!list || !window.CRAFTING_DB) return;
       
       if (window.GAME_STATE) {
           if(window.GAME_STATE.ownedRods) window.GAME_STATE.ownedRods = [...new Set(window.GAME_STATE.ownedRods)];
           if(window.GAME_STATE.ownedSinkers) window.GAME_STATE.ownedSinkers = [...new Set(window.GAME_STATE.ownedSinkers)];
           if(window.GAME_STATE.ownedHooks) window.GAME_STATE.ownedHooks = [...new Set(window.GAME_STATE.ownedHooks)];
           if(window.GAME_STATE.ownedKnives) window.GAME_STATE.ownedKnives = [...new Set(window.GAME_STATE.ownedKnives)];
       }
   
       list.innerHTML = `
           <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
               <div id="col-rods" style="display: flex; flex-direction: column; gap: 10px;"><div style="background: rgba(15, 23, 42, 0.9); border-bottom: 2px solid #6366f1; padding: 12px; border-radius: 12px; text-align: center; color: #a5b4fc; font-weight: bold;">🎣 Varas</div></div>
               <div id="col-sinkers" style="display: flex; flex-direction: column; gap: 10px;"><div style="background: rgba(15, 23, 42, 0.9); border-bottom: 2px solid #f59e0b; padding: 12px; border-radius: 12px; text-align: center; color: #fcd34d; font-weight: bold;">🪨 Pesos</div></div>
               <div id="col-hooks" style="display: flex; flex-direction: column; gap: 10px;"><div style="background: rgba(15, 23, 42, 0.9); border-bottom: 2px solid #14b8a6; padding: 12px; border-radius: 12px; text-align: center; color: #5eead4; font-weight: bold;">🪝 Anzóis</div></div>
               <div id="col-knives" style="display: flex; flex-direction: column; gap: 10px;"><div style="background: rgba(15, 23, 42, 0.9); border-bottom: 2px solid #ef4444; padding: 12px; border-radius: 12px; text-align: center; color: #fca5a5; font-weight: bold;">🔪 Facas</div></div>
           </div>
       `;
   
       const createCard = (type, id, item, isOwned) => {
           const div = document.createElement('div');
           const borderColor = isOwned ? 'rgba(52, 211, 153, 0.5)' : 'rgba(255,255,255,0.05)';
           const bgColor = isOwned ? 'rgba(52, 211, 153, 0.05)' : 'rgba(0,0,0,0.4)';
           div.className = "forge-diagram-card"; div.style.border = `1px solid ${borderColor}`; div.style.background = bgColor;
           div.innerHTML = `<span style="font-weight: 600; color: ${isOwned ? '#34d399' : '#e2e8f0'}; font-size: 0.85rem; width: 85%;">${item.name}</span><span style="font-size: 1.2rem;">${isOwned ? '✨' : '🔒'}</span>`;
           div.addEventListener('click', () => renderCraftingArea(type, id, item)); 
           return div;
       };
   
       if (window.GAME_STATE) {
           Object.keys(window.CRAFTING_DB.recipes.rods).forEach(id => { safeGet('col-rods').appendChild(createCard('rod', id, window.CRAFTING_DB.recipes.rods[id], window.GAME_STATE.ownedRods.includes(parseInt(id)))); });
           Object.keys(window.CRAFTING_DB.recipes.sinkers).forEach(id => { safeGet('col-sinkers').appendChild(createCard('sinker', id, window.CRAFTING_DB.recipes.sinkers[id], window.GAME_STATE.ownedSinkers.includes(id))); });
           Object.keys(window.CRAFTING_DB.recipes.hooks).forEach(id => { safeGet('col-hooks').appendChild(createCard('hook', id, window.CRAFTING_DB.recipes.hooks[id], window.GAME_STATE.ownedHooks.includes(id))); });
           Object.keys(window.CRAFTING_DB.recipes.knives).forEach(id => { safeGet('col-knives').appendChild(createCard('knife', id, window.CRAFTING_DB.recipes.knives[id], window.GAME_STATE.ownedKnives.includes(id))); });
       }
   }
   
   window.doCraftItem = function(type, id) {
       if (!window.CRAFTING_DB) return;
       let recipeCategory = type === 'rod' ? 'rods' : (type === 'sinker' ? 'sinkers' : (type === 'hook' ? 'hooks' : 'knives'));
       const recipe = window.CRAFTING_DB.recipes[recipeCategory][id];
       
       let isAlreadyOwned = false;
       if (type === 'rod') isAlreadyOwned = window.GAME_STATE.ownedRods.includes(parseInt(id));
       else if (type === 'sinker') isAlreadyOwned = window.GAME_STATE.ownedSinkers.includes(id);
       else if (type === 'hook') isAlreadyOwned = window.GAME_STATE.ownedHooks.includes(id);
       else if (type === 'knife') isAlreadyOwned = window.GAME_STATE.ownedKnives.includes(id);
   
       if (isAlreadyOwned) {
           if(window.showToast) window.showToast("Atenção", "Você já possui este equipamento.", "warning");
           return;
       }
   
       Object.keys(recipe.req).forEach(matId => { window.GAME_STATE.materials[matId] -= recipe.req[matId]; });
   
       if (type === 'rod') { window.GAME_STATE.ownedRods.push(parseInt(id)); } 
       else if (type === 'sinker') { window.GAME_STATE.ownedSinkers.push(id); } 
       else if (type === 'hook') { window.GAME_STATE.ownedHooks.push(id); }
       else if (type === 'knife') { window.GAME_STATE.ownedKnives.push(id); }
   
       if (typeof window.saveGame === "function") window.saveGame();
       if(window.showToast) window.showToast("Item Forjado!", `Diagrama concluído com sucesso.`, "success");
       renderRecipeList(); renderCraftingArea(type, id, recipe);
   };
   
   function renderCraftingArea(type, id, recipe) {
       const area = safeGet('crafting-area'); if (!area) return;
       let canCraft = true; let reqHtml = '';
   
       Object.keys(recipe.req).forEach(matId => {
           const needed = recipe.req[matId]; const have = (window.GAME_STATE.materials && window.GAME_STATE.materials[matId]) || 0; 
           const matData = window.MATERIALS ? window.MATERIALS.find(m => m.id === matId) : null;
           if (have < needed) canCraft = false;
           reqHtml += `
               <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.4); padding: 12px; border-radius: 10px; border-left: 4px solid ${have >= needed ? '#34d399' : '#ef4444'}; margin-bottom: 8px; width: 100%;">
                   <span style="color: #e2e8f0; font-size: 0.9rem;">${matData ? matData.icon : '📦'} ${matData ? matData.name : matId}</span>
                   <span style="font-weight: 700; color: ${have >= needed ? '#34d399' : '#ef4444'};">${have} / ${needed}</span>
               </div>
           `;
       });
   
       const isOwned = type === 'rod' ? (window.GAME_STATE.ownedRods && window.GAME_STATE.ownedRods.includes(parseInt(id))) 
           : type === 'sinker' ? (window.GAME_STATE.ownedSinkers && window.GAME_STATE.ownedSinkers.includes(id)) 
           : type === 'hook' ? (window.GAME_STATE.ownedHooks && window.GAME_STATE.ownedHooks.includes(id)) 
           : (window.GAME_STATE.ownedKnives && window.GAME_STATE.ownedKnives.includes(id));
   
       area.innerHTML = `
           <div style="font-size: 4rem; margin-bottom: 10px;">${isOwned ? '✨' : (canCraft ? '🔥' : '❄️')}</div>
           <h2 style="color: #f8fafc; font-family: 'Fredoka'; text-align: center; margin-bottom: 20px;">${recipe.name}</h2>
           <div style="width: 100%; display: flex; flex-direction: column; gap: 5px;">${reqHtml}</div>
           ${isOwned 
               ? `<div style="margin-top: 25px; color: #34d399; font-weight: bold; background: rgba(52, 211, 153, 0.1); padding: 15px; border-radius: 12px; border: 1px solid rgba(52, 211, 153, 0.3); text-align: center; width: 100%;">✔️ Posse Única Garantida</div>` 
               : `<button onclick="window.doCraftItem('${type}', '${id}')" ${!canCraft ? 'disabled' : ''} style="margin-top: 20px; width: 100%; padding: 15px; font-weight: bold; border-radius: 12px; cursor: ${canCraft ? 'pointer' : 'not-allowed'}; background: ${canCraft ? '#ea580c' : '#1e293b'}; color: ${canCraft ? 'white' : '#475569'}; border: none;">${canCraft ? '⚒️ Bater o Martelo' : 'Recursos Insuficientes'}</button>`
           }
       `;
   }
   
   // ==========================================================================
   // LABORATÓRIO GENÉTICO
   // ==========================================================================
   let activeBaitRecipe = null;
   let activeBoosts = []; 
   function renderBaitLabList() {
       if (window.GAME_STATE && !window.GAME_STATE.baitBoosts) window.GAME_STATE.baitBoosts = {};
       const list = safeGet('bait-recipe-list'); if (!list || !window.BAITS) return;
       list.innerHTML = `<div style="background: rgba(15, 23, 42, 0.8); padding: 15px; border-radius: 12px; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #22c55e;"><h3 style="font-size: 1.1rem; color: #4ade80; margin: 0; font-family:'Fredoka'; text-transform:uppercase;">🧬 Fórmulas</h3></div>`;
       window.BAITS.forEach(bait => {
           if (!bait.req) return; 
           const count = (window.GAME_STATE && window.GAME_STATE.baitInventory[bait.id]) ? window.GAME_STATE.baitInventory[bait.id] : 0;
           const isActive = activeBaitRecipe && activeBaitRecipe.id === bait.id;
           const div = document.createElement('div');
           div.style = `padding: 12px; border: 1px solid ${isActive ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255,255,255,0.05)'}; border-radius: 12px; margin-bottom: 10px; cursor: pointer; background: ${isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0,0,0,0.2)'}; display: flex; justify-content: space-between; align-items: center; color: white; font-family: 'Poppins';`;
           div.innerHTML += `<strong>${bait.icon} ${bait.name}</strong> <span style="background: rgba(0,0,0,0.5); padding: 2px 8px; border-radius: 20px; font-size: 0.7rem;">x${count}</span>`;
           div.addEventListener('click', () => { activeBaitRecipe = bait; renderBaitLabList(); renderBaitLabArea(); });
           list.appendChild(div);
       });
       renderBaitInventory(); 
   }
   
   window.addBoost = function(id) {
       const state = window.GAME_STATE || { materials: {} };
       if ((state.materials[id] || 0) <= activeBoosts.filter(b => b === id).length) return;
       if (activeBoosts.length < 2) { activeBoosts.push(id); renderBaitLabList(); renderBaitLabArea(); }
   }
   window.removeBoost = function(index) {
       if (index < activeBoosts.length) { activeBoosts.splice(index, 1); renderBaitLabList(); renderBaitLabArea(); }
   }
   
   function renderBaitLabArea() {
       const resultArea = safeGet('bait-craft-result');
       if (!activeBaitRecipe) { resultArea.innerHTML = `<div style="text-align: center; color: #64748b; padding: 30px;">Selecione um diagrama genético.</div>`; return; }
   
       let canCraft = true; const reqKeys = Object.keys(activeBaitRecipe.req);
       for (let i=1; i<=2; i++) {
           const reqId = reqKeys[i-1];
           const have = (window.GAME_STATE.materials && window.GAME_STATE.materials[reqId]) || 0;
           if (reqId && have < activeBaitRecipe.req[reqId]) canCraft = false;
       }
   
       resultArea.innerHTML = `<button id="btn-craft-bait" style="width: 100%; padding: 15px; font-size: 1rem; font-weight: bold; background: ${canCraft ? '#10b981' : '#1e293b'}; color: white; border: none; border-radius: 10px; cursor: ${canCraft ? 'pointer' : 'not-allowed'};">${canCraft ? '🧪 Iniciar Sequência' : 'Biomassa Insuficiente'}</button>`;
       
       if (canCraft) {
           safeGet('btn-craft-bait').addEventListener('click', () => {
               reqKeys.forEach(matId => window.GAME_STATE.materials[matId] -= activeBaitRecipe.req[matId]);
               if (!window.GAME_STATE.baitBoosts[activeBaitRecipe.id]) window.GAME_STATE.baitBoosts[activeBaitRecipe.id] = { luck: 0, value: 0, chance67: 0, speed: 0 };
               activeBoosts.forEach(bId => {
                   window.GAME_STATE.materials[bId] -= 1;
                   const bData = window.BOOSTS.find(b => b.id === bId);
                   window.GAME_STATE.baitBoosts[activeBaitRecipe.id][bData.stat] = (window.GAME_STATE.baitBoosts[activeBaitRecipe.id][bData.stat] || 0) + bData.val;
               });
               window.GAME_STATE.baitInventory[activeBaitRecipe.id] = (window.GAME_STATE.baitInventory[activeBaitRecipe.id] || 0) + activeBaitRecipe.qty;
               if(window.saveGame) window.saveGame();
               if(window.showToast) window.showToast("Síntese Concluída", `O Reator processou x${activeBaitRecipe.qty} iscas com sucesso.`, "success");
               activeBoosts = []; renderBaitLabList(); renderBaitLabArea(); 
           });
       }
   }
   
   function renderBaitInventory() {
       const inv = safeGet('bait-mat-inventory'); if (!inv || !window.BOOSTS) return;
       let html = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px;">`;
       window.BOOSTS.forEach(bst => {
           const count = (window.GAME_STATE.materials && window.GAME_STATE.materials[bst.id]) || 0;
           const available = count - activeBoosts.filter(b => b === bst.id).length;
           if (count > 0) {
               html += `<div onclick="window.addBoost('${bst.id}')" style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 12px 8px; text-align: center; cursor: pointer; position: relative;">
                   <div style="position: absolute; top: -5px; right: -5px; background: #f59e0b; color: #111; padding: 2px 6px; border-radius: 8px; font-size: 0.65rem; font-weight: bold;">D: ${available}</div>
                   <div style="font-size:2rem; margin-bottom:6px;">${bst.icon}</div>
                   <div style="font-size:0.65rem; color:#fcd34d;">${bst.name}</div>
               </div>`;
           }
       });
       inv.innerHTML = html + '</div>';
   }
   
   // ==========================================================================
   // MESA TÁTICA E INVENTÁRIO
   // ==========================================================================
   function renderWorkbench(tab) {
       const grid = safeGet('workbench-grid'); if(!grid) return; grid.innerHTML = ''; 
   
       if(window.GAME_STATE) {
           if(window.GAME_STATE.ownedRods) window.GAME_STATE.ownedRods = [...new Set(window.GAME_STATE.ownedRods)];
           if(window.GAME_STATE.ownedSinkers) window.GAME_STATE.ownedSinkers = [...new Set(window.GAME_STATE.ownedSinkers)];
           if(window.GAME_STATE.ownedHooks) window.GAME_STATE.ownedHooks = [...new Set(window.GAME_STATE.ownedHooks)];
           if(window.GAME_STATE.ownedKnives) window.GAME_STATE.ownedKnives = [...new Set(window.GAME_STATE.ownedKnives)];
       }
   
       const icons = { 'rod': '🎣', 'sinker': '🪨', 'hook': '🪝', 'knife': '🔪', 'bait': '🪱' };
   
       const createEquipCard = (id, item, isEq, type) => {
           const div = document.createElement('div'); 
           div.className = `wb-item-card draggable-item custom-scrollbar ${isEq ? 'equipped' : ''}`; 
           div.draggable = true; div.dataset.type = type; div.dataset.id = id; 
           
           let icon = item.icon || icons[type];
           
           div.innerHTML = `
               ${isEq ? `<div class="wb-badge-equipped">ON</div>` : ''}
               <div style="font-size: 1.6rem; margin-bottom: 2px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${icon}</div>
               <div style="font-weight:bold; font-size:0.65rem; color:#f8fafc; font-family:'Poppins'; text-align:center; line-height:1.1; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; width:100%;">${item.name}</div>
               ${type === 'bait' ? `<div style="position:absolute; bottom:4px; right:6px; color:#4ade80; font-size:0.6rem; font-weight:bold;">x${window.GAME_STATE.baitInventory[id]}</div>` : ''}
           `; 
           
           div.addEventListener('dragstart', handleDragStart); 
           div.addEventListener('dblclick', () => { if (!isEq) equipItem(type, id); });
           grid.appendChild(div); 
       };
   
       grid.classList.add('custom-scrollbar');
       grid.style.display = 'grid'; 
       grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(85px, 1fr))'; 
       grid.style.gap = '10px'; 
       grid.style.padding = '15px';
       grid.style.alignContent = 'start'; 
   
       if (tab === 'rod') { if(window.GAME_STATE.ownedRods) window.GAME_STATE.ownedRods.forEach(id => { const item = window.GAME_STATE.rods ? window.GAME_STATE.rods.find(r => r.id === parseInt(id)) : null; if(item) createEquipCard(item.id, item, window.GAME_STATE.currentRodIndex === item.id, 'rod'); }); } 
       else if (tab === 'sink') { if(window.GAME_STATE.ownedSinkers) window.GAME_STATE.ownedSinkers.forEach(id => { const item = window.SINKERS ? window.SINKERS.find(s => s.id === id) : null; if(item) createEquipCard(id, item, window.GAME_STATE.currentSinker === item.id, 'sinker'); }); } 
       else if (tab === 'hook') { if(window.GAME_STATE.ownedHooks) window.GAME_STATE.ownedHooks.forEach(id => { const item = window.HOOKS ? window.HOOKS.find(h => h.id === id) : null; if(item) createEquipCard(id, item, window.GAME_STATE.currentHook === item.id, 'hook'); }); } 
       else if (tab === 'knife') { if(window.GAME_STATE.ownedKnives) window.GAME_STATE.ownedKnives.forEach(id => { const item = window.KNIVES ? window.KNIVES.find(k => k.id === id) : null; if(item) createEquipCard(id, item, window.GAME_STATE.currentKnife === item.id, 'knife'); }); } 
       else if (tab === 'bait') { if(window.GAME_STATE.baitInventory) Object.keys(window.GAME_STATE.baitInventory).forEach(id => { const item = window.BAITS ? window.BAITS.find(b => b.id === id) : null; if(item && window.GAME_STATE.baitInventory[id] > 0) createEquipCard(id, item, window.GAME_STATE.currentBait === item.id, 'bait'); }); }
   }
   
   function updateWorkbenchSlots() {
       const rod = (window.GAME_STATE.rods || []).find(r => r.id === window.GAME_STATE.currentRodIndex) || (window.GAME_STATE.rods ? window.GAME_STATE.rods[0] : {name: 'Nenhuma'});
       safeGet('wb-rod-content').innerHTML = `<span style="color: #60a5fa;">${rod.name}</span>`;
   
       const sinker = (window.SINKERS || []).find(s => s.id === window.GAME_STATE.currentSinker) || {name: 'Padrão'};
       safeGet('wb-sinker-content').innerHTML = `<span style="color: #fcd34d;">${sinker.name}</span>`;
   
       const hookId = window.GAME_STATE.currentHook || 'anzol_padrao';
       const hookData = (window.HOOKS || []).find(h => h.id === hookId) || {name: 'Anzol Padrão', color: '#cbd5e1'};
       safeGet('wb-hook-content').innerHTML = `<span style="color:${hookData.color}; text-shadow: 0 0 10px ${hookData.color}88;">${hookData.name}</span>`;
   
       const knife = (window.KNIVES || []).find(k => k.id === window.GAME_STATE.currentKnife) || {name: 'Nenhuma'};
       safeGet('wb-knife-content').innerHTML = `<span style="color: #fca5a5;">${knife.name}</span>`;
   
       const baitDisplay = safeGet('wb-bait-content');
       if (window.GAME_STATE.currentBait && window.BAITS) {
           const bait = window.BAITS.find(b => b.id === window.GAME_STATE.currentBait);
           if(bait) baitDisplay.innerHTML = `<span style="color:#4ade80; text-shadow: 0 0 10px rgba(74,222,128,0.5);">${bait.name}</span>`;
       } else { baitDisplay.innerHTML = "<span style='color:#64748b;'>Vazio</span>"; }
   }
   
   function equipItem(type, id) {
       if (type === 'rod') window.GAME_STATE.currentRodIndex = parseInt(id);
       if (type === 'sinker') window.GAME_STATE.currentSinker = id;
       if (type === 'hook') window.GAME_STATE.currentHook = id;
       if (type === 'knife') window.GAME_STATE.currentKnife = id;
       if (type === 'bait') window.GAME_STATE.currentBait = id;
       
       updateWorkbenchSlots(); 
       const tabMap = { 'rod': 'rod', 'sinker': 'sink', 'hook': 'hook', 'knife': 'knife', 'bait': 'bait' };
       renderWorkbench(tabMap[type]);
       
       if(typeof window.updateUI === "function") window.updateUI(); 
       if(typeof window.saveGame === "function") window.saveGame();
   }
   
   let draggedItem = null;
   function handleDragStart(e) { 
       draggedItem = { type: e.currentTarget.dataset.type, id: e.currentTarget.dataset.id }; 
       e.dataTransfer.setData('text/plain', ''); 
       e.currentTarget.style.opacity = '0.4'; 
   }
   
   document.addEventListener('DOMContentLoaded', () => {
       const dropzones = document.querySelectorAll('.dropzone');
   
       dropzones.forEach(zone => {
           zone.addEventListener('dragover', (e) => { 
               e.preventDefault(); 
               if (draggedItem && draggedItem.type === zone.dataset.droptype) {
                   zone.classList.add('drag-over');
               } 
           });
   
           zone.addEventListener('dragleave', () => {
               zone.classList.remove('drag-over');
           });
   
           document.addEventListener('dragend', (e) => {
               if(e.target && e.target.style) e.target.style.opacity = '1';
               dropzones.forEach(z => z.classList.remove('drag-over'));
           });
   
           zone.addEventListener('drop', (e) => {
               e.preventDefault(); 
               zone.classList.remove('drag-over');
               
               if (draggedItem && draggedItem.type === zone.dataset.droptype) {
                   equipItem(draggedItem.type, draggedItem.id);
               }
               draggedItem = null;
           });
       });
   });