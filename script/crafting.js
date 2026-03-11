/* ==========================================================================
   SISTEMA DE CRAFTING, LOJA E MESA DE MONTAGEM (TELA CHEIA, POPUP TÁTICO E BLINDADO)
   ========================================================================== */

   function safeGet(id) { return document.getElementById(id); }

   window.SHOP_MULTIPLIER = 1; 
   
   function injectModernCraftingStyles() {
       if (document.getElementById('modern-crafting-styles')) return;
       const style = document.createElement('style');
       style.id = 'modern-crafting-styles';
       style.innerHTML = `
           @keyframes floatItem { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
           @keyframes glowPulsing { 0% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); } 50% { box-shadow: 0 0 35px rgba(16, 185, 129, 0.9); } 100% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); } }
           @keyframes popupEnter { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
           
           .modern-shop-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border-radius: 16px; transition: all 0.3s ease; border-top: 1px solid rgba(255,255,255,0.1); border-left: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; }
           .modern-shop-card:hover { transform: translateY(-6px) scale(1.02); z-index: 10; background: rgba(30, 41, 59, 0.9); box-shadow: 0 15px 30px rgba(0,0,0,0.5) !important; }
           .modern-btn { background: rgba(255,255,255,0.05); backdrop-filter: blur(5px); border-radius: 8px; color: #fff; font-family: 'Poppins', sans-serif; font-weight: 600; transition: 0.2s; cursor: pointer; flex: 1; padding: 10px 0; border: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
           .modern-btn:hover:not(:disabled) { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
           
           .forge-diagram-card { background: rgba(15, 23, 42, 0.6); border-left: 3px solid transparent; transition: 0.2s ease; padding: 12px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; min-height: 60px; font-family: 'Poppins', sans-serif; }
           .forge-diagram-card:hover { background: rgba(30, 41, 59, 0.9); padding-left: 20px; }
           .forge-diagram-card.locked { background: rgba(0, 0, 0, 0.6); opacity: 0.5; filter: grayscale(1); cursor: not-allowed; }
           .forge-diagram-card.locked:hover { padding-left: 12px; background: rgba(0, 0, 0, 0.6); }
   
           /* MESA TÁTICA */
           .wb-item-card {
               background: linear-gradient(145deg, #1e293b, #0f172a); border: 1px solid #334155; border-radius: 12px;
               padding: 10px 5px; display: flex; flex-direction: column; align-items: center; justify-content: center;
               cursor: grab; position: relative; transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
               box-shadow: inset 0 2px 10px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.2); user-select: none; aspect-ratio: 1 / 1; overflow: hidden;
           }
           .wb-item-card:active { cursor: grabbing; transform: scale(0.95); }
           .wb-item-card:hover { border-color: #38bdf8; box-shadow: 0 8px 20px rgba(56, 189, 248, 0.25), inset 0 2px 10px rgba(255,255,255,0.05); background: linear-gradient(145deg, #1e293b, #172554); }
           .wb-item-card.equipped { border-color: #10b981; background: linear-gradient(145deg, rgba(16, 185, 129, 0.2), #0f172a); box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.2); }
           
           .wb-badge-equipped { position: absolute; top: -1px; right: -1px; background: #10b981; color: white; font-size: 0.55rem; font-weight: 900; padding: 2px 6px; border-bottom-left-radius: 8px; border-top-right-radius: 11px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: -2px 2px 5px rgba(0,0,0,0.3); z-index: 5; }
           
           .wb-slot-container { background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.9)) !important; border: 2px dashed rgba(148, 163, 184, 0.3) !important; border-radius: 12px !important; padding: 12px !important; margin-bottom: 10px !important; transition: all 0.3s ease !important; box-shadow: inset 0 4px 15px rgba(0,0,0,0.4) !important; }
           .wb-slot-container.drag-over { border-color: #3b82f6 !important; background: rgba(59, 130, 246, 0.15) !important; transform: scale(1.02) !important; box-shadow: 0 0 20px rgba(59, 130, 246, 0.4) !important; }
   
           /* LABORATÓRIO E POPUP */
           .bait-recipe-card { background: rgba(0,0,0,0.6); border: 2px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; cursor: pointer; transition: 0.2s; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); text-align: center; }
           .bait-recipe-card:hover { background: rgba(16, 185, 129, 0.15); border-color: #10b981; transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.5); }
           
           .comp-slot-tactical { position: relative; width: 140px; height: 140px; background: rgba(0,0,0,0.6); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 16px; border: 2px dashed rgba(255,255,255,0.2); transition: 0.2s; cursor: pointer; box-shadow: inset 0 5px 15px rgba(0,0,0,0.5); }
           .comp-slot-tactical:hover { border-color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.1); }
           .comp-slot-tactical.filled { border: 2px solid #f59e0b; background: rgba(245, 158, 11, 0.15); border-style: solid; box-shadow: 0 0 20px rgba(245, 158, 11, 0.2), inset 0 0 15px rgba(245, 158, 11, 0.2); }
   
           .boost-inventory-card { min-width: 150px; height: 160px; background: rgba(30,41,59,0.95); border: 2px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; text-align: center; cursor: pointer; position: relative; transition: 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
           .boost-inventory-card:hover { border-color: #fcd34d; transform: translateY(-5px); box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3); background: rgba(30,41,59,1); }
           
           .progress-bar-container { width: 100%; height: 10px; background: rgba(0,0,0,0.6); border-radius: 10px; overflow: hidden; margin-top: 10px; border: 1px solid rgba(255,255,255,0.05); }
           .progress-bar-fill { height: 100%; border-radius: 10px; transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
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
               { id: 'boost_size', name: 'Soro Gigante', price: 450000, icon: '📏', desc: 'Lendas (+2%)', stat: 'chance67', val: 0.02 },
               { id: 'boost_speed', name: 'Motor de Dobra', price: 600000, icon: '🚀', desc: 'Veloc. (+0.5x)', stat: 'speed', val: 0.5 },
               { id: 'boost_size_2', name: 'Soro Leviatã', price: 1000000, icon: '🐉', desc: 'Lendas (+5%)', stat: 'chance67', val: 0.05 },
               { id: 'boost_luck_3', name: 'Bênção Divina', price: 2500000, icon: '🌟', desc: 'Sorte (+1000)', stat: 'luck', val: 1000 }
           ];
       }
   
       safeGet('open-shop-btn')?.addEventListener('click', () => { safeGet('shop-modal')?.classList.remove('hidden'); window.renderShop(); });
       safeGet('close-shop-btn')?.addEventListener('click', () => safeGet('shop-modal')?.classList.add('hidden'));
   
       safeGet('open-craft-btn')?.addEventListener('click', () => { safeGet('craft-modal')?.classList.remove('hidden'); renderRecipeList(); });
       safeGet('close-craft-btn')?.addEventListener('click', () => safeGet('craft-modal')?.classList.add('hidden'));
   
       safeGet('open-bait-forge-btn')?.addEventListener('click', () => { 
           const modal = safeGet('bait-forge-modal');
           modal.classList.remove('hidden'); 
           
           // Zera o padding do modal para a imagem de fundo poder colar nas bordas
           const modalContent = modal.querySelector('.modal-content');
           if(modalContent) { 
               modalContent.style.maxWidth = '1600px'; 
               modalContent.style.width = '95vw'; 
               modalContent.style.height = '90vh';
               modalContent.style.padding = '0';
               modalContent.style.overflow = 'hidden';
               modalContent.style.border = '2px solid #10b981';
               modalContent.style.background = '#0f172a';
           }
           
           renderBaitLabList(); 
       });
   
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
   // LOJA (MERCADO NEGRO) - BLINDADA CONTRA PULO (SCROLL JUMP FIX)
   // ==========================================================================
   window.buyMaterial = function(id, basePrice, qty) {
       const totalCost = basePrice * qty;
       if (window.GAME_STATE && window.GAME_STATE.coins >= totalCost) {
           window.GAME_STATE.coins -= totalCost;
           if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
           window.GAME_STATE.materials[id] = (window.GAME_STATE.materials[id] || 0) + qty;
           
           window.renderShop(); 
           if(typeof window.saveGame === "function") window.saveGame();
       } else {
           if(window.showToast) window.showToast("Fundos Insuficientes", `Faltam moedas para comprar esta quantidade.`, "error");
       }
   };
   
   window.renderShop = function() {
       const container = safeGet('shop-container'); if (!container) return;
       const state = window.GAME_STATE || { materials: {}, coins: 0 };
       
       let header = safeGet('shop-header-stable');
       let scrollArea = safeGet('shop-scroll-area');
   
       if (!header || !scrollArea) {
           container.style.display = 'flex'; container.style.flexDirection = 'column'; container.style.height = '75vh';
           container.innerHTML = `
               <div id="shop-header-stable" style="background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); z-index: 50;">
                   <div><h2 style="margin: 0; color: #f8fafc; font-family: 'Fredoka', sans-serif; font-size: 2.2rem; letter-spacing: 1px;">Mercado Negro</h2></div>
                   <div style="display: flex; align-items: center; gap: 20px;">
                       <div id="shop-live-coins" style="background: rgba(0,0,0,0.6); padding: 12px 30px; border-radius: 30px; border: 1px solid rgba(251, 191, 36, 0.3); color: #f8fafc; font-weight: 900; font-size: 1.6rem; font-family: 'Poppins', sans-serif; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);"></div>
                       <button onclick="document.getElementById('shop-modal').classList.add('hidden')" style="background: none; border: none; color: #94a3b8; font-size: 2.8rem; cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'">&times;</button>
                   </div>
               </div>
               <div id="shop-scroll-area" class="custom-scrollbar" style="padding: 30px; background: url('/img/asset/bg-dark-pattern.png') repeat, #0f172a; overflow-y: auto; flex: 1; box-sizing: border-box;"></div>
           `;
           scrollArea = safeGet('shop-scroll-area');
       }
   
       safeGet('shop-live-coins').innerHTML = `<span style="color:#fbbf24">🪙</span> ${state.coins.toLocaleString()}`;
       let currentScroll = scrollArea.scrollTop;
   
       const buildCard = (item, isBoost) => {
           const count = (state.materials && state.materials[item.id]) ? state.materials[item.id] : 0;
           const color = isBoost ? '#fb923c' : getRarityColor(item.price);
           const canBuy1 = state.coins >= item.price;
           const canBuy10 = state.coins >= (item.price * 10);
           const canBuy100 = state.coins >= (item.price * 100);
   
           return `
               <div class="modern-shop-card" style="box-shadow: 0 10px 30px -10px ${color}33;">
                   <div style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.8); color: #f8fafc; padding: 6px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 900; font-family: 'Poppins', sans-serif; border: 1px solid ${color}66;">📦 ${count}</div>
                   <div style="padding: 35px 20px 20px 20px; text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; background: radial-gradient(circle at top, ${color}15, transparent 70%);">
                       <div style="font-size: 4rem; margin-bottom: 20px; animation: floatItem 6s ease-in-out infinite; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.8));">${item.icon}</div>
                       <div style="color: #f8fafc; font-family: 'Fredoka', sans-serif; font-size: 1.3rem; font-weight: 700; margin-bottom: 8px;">${item.name}</div>
                       ${isBoost ? `<div style="color: ${color}; font-size: 0.9rem; font-family: 'Poppins', sans-serif; margin-bottom: 10px; font-weight: bold; background: ${color}22; padding: 4px 12px; border-radius: 10px; border: 1px solid ${color}44;">${item.desc}</div>` : ''}
                       <div style="color: #fbbf24; font-weight: 900; font-size: 1.3rem; font-family: 'Poppins', sans-serif; margin-top: auto; padding-top: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">🪙 ${item.price.toLocaleString()}</div>
                   </div>
                   <div style="padding: 20px; background: rgba(0,0,0,0.4); border-top: 1px solid rgba(255,255,255,0.05);">
                       <div style="display: flex; gap: 10px; width: 100%;">
                           <button class="modern-btn" onclick="${canBuy1 ? `window.buyMaterial('${item.id}', ${item.price}, 1)` : ''}" style="background: ${canBuy1 ? `rgba(255,255,255,0.1)` : 'rgba(0,0,0,0.3)'}; color: ${canBuy1 ? '#fff' : '#64748b'};">1x</button>
                           <button class="modern-btn" onclick="${canBuy10 ? `window.buyMaterial('${item.id}', ${item.price}, 10)` : ''}" style="background: ${canBuy10 ? `rgba(255,255,255,0.1)` : 'rgba(0,0,0,0.3)'}; color: ${canBuy10 ? '#fff' : '#64748b'};">10x</button>
                           <button class="modern-btn" onclick="${canBuy100 ? `window.buyMaterial('${item.id}', ${item.price}, 100)` : ''}" style="background: ${canBuy100 ? `rgba(255,255,255,0.1)` : 'rgba(0,0,0,0.3)'}; color: ${canBuy100 ? '#fff' : '#64748b'};">100x</button>
                       </div>
                   </div>
               </div>
           `;
       };
   
       let gridHtml = `<div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;"><h3 style="margin: 0; color: #e2e8f0; font-family: 'Fredoka', sans-serif; font-size: 1.8rem; text-transform: uppercase;">💎 Matérias-Primas</h3><div style="height: 2px; flex: 1; background: linear-gradient(90deg, rgba(255,255,255,0.2), transparent);"></div></div>`;
       gridHtml += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 25px; margin-bottom: 60px;">`;
       if(window.MATERIALS) window.MATERIALS.forEach(mat => { if (mat.price > 0) gridHtml += buildCard(mat, false); });
       gridHtml += `</div>`; 
   
       gridHtml += `<div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;"><h3 style="margin: 0; color: #e2e8f0; font-family: 'Fredoka', sans-serif; font-size: 1.8rem; text-transform: uppercase;">⚡ Catalisadores de Laboratório</h3><div style="height: 2px; flex: 1; background: linear-gradient(90deg, rgba(255,255,255,0.2), transparent);"></div></div>`;
       gridHtml += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 25px;">`;
       if(window.BOOSTS) window.BOOSTS.forEach(bst => { gridHtml += buildCard(bst, true); });
       gridHtml += `</div>`; 
       
       scrollArea.innerHTML = gridHtml;
       scrollArea.scrollTop = currentScroll;
   };
   
   // ==========================================================================
   // GRANDE FORJA
   // ==========================================================================
   function isPrereqMet(type, id) {
       if (!window.GAME_STATE || !window.CRAFTING_DB) return false;
       let cat = type === 'rod' ? 'rods' : (type === 'sinker' ? 'sinkers' : (type === 'hook' ? 'hooks' : 'knives'));
       const keys = Object.keys(window.CRAFTING_DB.recipes[cat]);
       const idx = keys.indexOf(id.toString());
       if (idx <= 0) return true; 
       const prevId = keys[idx - 1];
       
       if (type === 'rod') return window.GAME_STATE.ownedRods.includes(parseInt(prevId));
       if (type === 'sinker') return window.GAME_STATE.ownedSinkers.includes(prevId);
       if (type === 'hook') return window.GAME_STATE.ownedHooks.includes(prevId);
       if (type === 'knife') return window.GAME_STATE.ownedKnives.includes(prevId);
       return false;
   }
   
   function getFishCountByRarity(rarityId) {
       if (!window.GAME_STATE || !window.GAME_STATE.collection) return 0;
       let count = 0;
       const rarityData = window.RARITIES[rarityId.toUpperCase()];
       if (rarityData) { rarityData.variations.forEach(v => { count += (window.GAME_STATE.collection[v.name] || 0); }); }
       return count;
   }
   
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
           const prereqMet = isPrereqMet(type, id);
           let borderColor = isOwned ? 'rgba(52, 211, 153, 0.5)' : (prereqMet ? 'rgba(255,255,255,0.2)' : 'rgba(255,0,0,0.1)');
           let bgColor = isOwned ? 'rgba(52, 211, 153, 0.05)' : (prereqMet ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.8)');
           let icon = isOwned ? '✨' : (prereqMet ? '🔨' : '🔒');
           let textColor = isOwned ? '#34d399' : (prereqMet ? '#e2e8f0' : '#475569');
   
           div.className = `forge-diagram-card ${!prereqMet && !isOwned ? 'locked' : ''}`; 
           div.style.border = `1px solid ${borderColor}`; 
           div.style.background = bgColor;
           div.innerHTML = `<span style="font-weight: 600; color: ${textColor}; font-size: 0.85rem; width: 85%;">${item.name}</span><span style="font-size: 1.2rem;">${icon}</span>`;
           
           if (prereqMet || isOwned) { div.addEventListener('click', () => renderCraftingArea(type, id, item)); } 
           else { div.addEventListener('click', () => { if(window.showToast) window.showToast("Trancado!", "Forje o equipamento anterior na árvore.", "warning"); renderCraftingArea(type, id, item); }); }
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
       if (!isPrereqMet(type, id)) { if(window.showToast) window.showToast("Erro na Forja", "Equipamento anterior necessário.", "error"); return; }
   
       let recipeCategory = type === 'rod' ? 'rods' : (type === 'sinker' ? 'sinkers' : (type === 'hook' ? 'hooks' : 'knives'));
       const recipe = window.CRAFTING_DB.recipes[recipeCategory][id];
       
       let isAlreadyOwned = false;
       if (type === 'rod') isAlreadyOwned = window.GAME_STATE.ownedRods.includes(parseInt(id));
       else if (type === 'sinker') isAlreadyOwned = window.GAME_STATE.ownedSinkers.includes(id);
       else if (type === 'hook') isAlreadyOwned = window.GAME_STATE.ownedHooks.includes(id);
       else if (type === 'knife') isAlreadyOwned = window.GAME_STATE.ownedKnives.includes(id);
   
       if (isAlreadyOwned) { if(window.showToast) window.showToast("Atenção", "Você já possui este equipamento.", "warning"); return; }
   
       if (recipe.reqFishes) {
           for (let rarityId of Object.keys(recipe.reqFishes)) {
               if (getFishCountByRarity(rarityId) < recipe.reqFishes[rarityId]) {
                   if(window.showToast) window.showToast("Erro na Forja", "Você não pescou peixes suficientes para liberar este projeto.", "error"); return;
               }
           }
       }
   
       Object.keys(recipe.req).forEach(matId => { window.GAME_STATE.materials[matId] -= recipe.req[matId]; });
       if (type === 'rod') window.GAME_STATE.ownedRods.push(parseInt(id));  
       else if (type === 'sinker') window.GAME_STATE.ownedSinkers.push(id);  
       else if (type === 'hook') window.GAME_STATE.ownedHooks.push(id); 
       else if (type === 'knife') window.GAME_STATE.ownedKnives.push(id); 
   
       if (typeof window.saveGame === "function") window.saveGame();
       if(window.showToast) window.showToast("Item Forjado!", `Diagrama concluído com sucesso.`, "success");
       renderRecipeList(); renderCraftingArea(type, id, recipe);
   };
   
   function renderCraftingArea(type, id, recipe) {
       const area = safeGet('crafting-area'); if (!area) return;
       let canCraft = true; let reqHtml = '';
       const prereqMet = isPrereqMet(type, id);
   
       Object.keys(recipe.req).forEach(matId => {
           const needed = recipe.req[matId]; const have = (window.GAME_STATE.materials && window.GAME_STATE.materials[matId]) || 0; 
           const matData = window.MATERIALS ? window.MATERIALS.find(m => m.id === matId) : null;
           if (have < needed) canCraft = false;
           reqHtml += `
               <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.4); padding: 12px; border-radius: 10px; border-left: 4px solid ${have >= needed ? '#34d399' : '#ef4444'}; margin-bottom: 8px; width: 100%; filter: ${!prereqMet ? 'grayscale(1) opacity(0.5)' : 'none'};">
                   <span style="color: #e2e8f0; font-size: 0.9rem;">${matData ? matData.icon : '📦'} ${matData ? matData.name : matId}</span>
                   <span style="font-weight: 700; color: ${have >= needed ? '#34d399' : '#ef4444'};">${have} / ${needed}</span>
               </div>
           `;
       });
   
       if (recipe.reqFishes) {
           Object.keys(recipe.reqFishes).forEach(rarityId => {
               const needed = recipe.reqFishes[rarityId];
               const have = getFishCountByRarity(rarityId);
               const rarityData = window.RARITIES ? window.RARITIES[rarityId.toUpperCase()] : null;
               if (have < needed) canCraft = false;
               reqHtml += `
                   <div style="display: flex; justify-content: space-between; background: rgba(30, 58, 138, 0.4); padding: 12px; border-radius: 10px; border-left: 4px solid ${have >= needed ? '#38bdf8' : '#ef4444'}; margin-bottom: 8px; width: 100%; filter: ${!prereqMet ? 'grayscale(1) opacity(0.5)' : 'none'};">
                       <span style="color: #e2e8f0; font-size: 0.9rem;">🐟 Capturas: ${rarityData ? rarityData.name : rarityId}</span>
                       <span style="font-weight: 700; color: ${have >= needed ? '#38bdf8' : '#ef4444'};">${have} / ${needed}</span>
                   </div>
               `;
           });
       }
   
       const isOwned = type === 'rod' ? (window.GAME_STATE.ownedRods && window.GAME_STATE.ownedRods.includes(parseInt(id))) 
           : type === 'sinker' ? (window.GAME_STATE.ownedSinkers && window.GAME_STATE.ownedSinkers.includes(id)) 
           : type === 'hook' ? (window.GAME_STATE.ownedHooks && window.GAME_STATE.ownedHooks.includes(id)) 
           : (window.GAME_STATE.ownedKnives && window.GAME_STATE.ownedKnives.includes(id));
   
       let actionHtml = '';
       if (isOwned) {
           actionHtml = `<div style="margin-top: 25px; color: #34d399; font-weight: bold; background: rgba(52, 211, 153, 0.1); padding: 15px; border-radius: 12px; border: 1px solid rgba(52, 211, 153, 0.3); text-align: center; width: 100%;">✔️ Posse Única Garantida</div>`;
       } else if (!prereqMet) {
           actionHtml = `
               <div style="margin-top: 20px; text-align: center; color: #ef4444; font-size: 0.85rem; font-family: 'Poppins'; padding: 10px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.3);">⚠️ Você precisa forjar o equipamento da camada anterior primeiro!</div>
               <button disabled style="margin-top: 10px; width: 100%; padding: 15px; font-weight: bold; border-radius: 12px; cursor: not-allowed; background: #1e293b; color: #475569; border: none;">Bloqueado na Árvore</button>
           `;
       } else {
           actionHtml = `<button onclick="window.doCraftItem('${type}', '${id}')" ${!canCraft ? 'disabled' : ''} style="margin-top: 20px; width: 100%; padding: 15px; font-weight: bold; border-radius: 12px; cursor: ${canCraft ? 'pointer' : 'not-allowed'}; background: ${canCraft ? '#ea580c' : '#1e293b'}; color: ${canCraft ? 'white' : '#475569'}; border: none;">${canCraft ? '⚒️ Bater o Martelo' : 'Requisitos Insuficientes'}</button>`;
       }
   
       area.innerHTML = `
           <div style="font-size: 4rem; margin-bottom: 10px;">${isOwned ? '✨' : (!prereqMet ? '🔒' : (canCraft ? '🔥' : '❄️'))}</div>
           <h2 style="color: ${prereqMet || isOwned ? '#f8fafc' : '#64748b'}; font-family: 'Fredoka'; text-align: center; margin-bottom: 20px;">${recipe.name}</h2>
           <div style="width: 100%; display: flex; flex-direction: column; gap: 5px;">${reqHtml}</div>
           ${actionHtml}
       `;
   }
   
   // ==========================================================================
   // LABORATÓRIO GENÉTICO (TELA CHEIA COM FUNDO CUSTOMIZADO E POPUP)
   // ==========================================================================
   let activeBaitRecipe = null;
   let activeBoosts = []; 
   
   // Renderiza a Vitrine Principal
   function renderBaitLabList() {
       if (window.GAME_STATE && !window.GAME_STATE.baitBoosts) window.GAME_STATE.baitBoosts = {};
       const mainContainer = safeGet('bait-recipe-list'); 
       if (!mainContainer || !window.BAITS) return;
       
       // Zera o interior completamente
       mainContainer.innerHTML = '';
       
       // Div de Fundo (Wallpaper) cobrindo tudo
       let html = `
           <div style="position: relative; width: 100%; height: 100%; background: url('/img/asset/lab.jpg') center/cover no-repeat;">
               
               <div class="custom-scrollbar" style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(2, 6, 23, 0.85); overflow-y: auto; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column;">
                   
                   <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 2px solid rgba(16, 185, 129, 0.4); padding-bottom: 20px;">
                       <div>
                           <h2 style="margin: 0; color: #4ade80; font-family: 'Fredoka', sans-serif; font-size: 3rem; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 4px 10px rgba(0,0,0,0.8);">🧬 Laboratório Genético</h2>
                           <p style="color: #94a3b8; font-family: 'Poppins'; font-size: 1.1rem; margin: 5px 0 0 0;">Selecione uma fórmula do banco de dados para iniciar o reator.</p>
                       </div>
                       <button onclick="document.getElementById('bait-forge-modal').classList.add('hidden')" style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; width: 60px; height: 60px; border-radius: 16px; font-size: 2.5rem; cursor: pointer; transition: 0.2s; display:flex; align-items:center; justify-content:center;" onmouseover="this.style.background='#ef4444'; this.style.color='#fff'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'; this.style.color='#ef4444'">&times;</button>
                   </div>
   
                   <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; padding-bottom: 50px;">
       `;
   
       window.BAITS.filter(b => b.req).forEach(bait => {
           const count = (window.GAME_STATE && window.GAME_STATE.baitInventory[bait.id]) ? window.GAME_STATE.baitInventory[bait.id] : 0;
           html += `
               <div class="bait-recipe-card" onclick="window.openBaitPopup('${bait.id}')">
                   <div style="font-size: 6rem; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.8)); margin-bottom: 15px; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${bait.icon}</div>
                   <div style="color: #f8fafc; font-weight: 700; font-size: 1.6rem; font-family:'Fredoka'; margin-bottom: 5px;">${bait.name}</div>
                   <div style="color: #94a3b8; font-size: 1.1rem; font-family:'Poppins';">Em Estoque: <b style="color:#4ade80; font-size:1.4rem;">${count}</b></div>
                   <button style="margin-top: 25px; width: 100%; padding: 15px; background: rgba(16, 185, 129, 0.15); color: #4ade80; border: 2px solid #10b981; border-radius: 12px; font-weight: 900; font-size: 1.1rem; cursor: pointer; font-family: 'Poppins'; text-transform: uppercase; letter-spacing: 1px; transition: 0.2s;" onmouseover="this.style.background='#10b981'; this.style.color='#fff'; this.style.boxShadow='0 0 15px rgba(16,185,129,0.5)'" onmouseout="this.style.background='rgba(16, 185, 129, 0.15)'; this.style.color='#4ade80'; this.style.boxShadow='none'">Sequenciar</button>
               </div>
           `;
       });
   
       html += `</div></div></div>`;
       mainContainer.innerHTML = html;
   }
   
   // Abre o Popup de Síntese
   window.openBaitPopup = function(id) {
       activeBaitRecipe = window.BAITS.find(b => b.id === id);
       activeBoosts = [];
       
       let overlay = document.getElementById('bait-popup-overlay');
       if (!overlay) {
           overlay = document.createElement('div');
           overlay.id = 'bait-popup-overlay';
           overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2, 6, 23, 0.85); z-index: 9999999; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(15px); opacity: 0; transition: opacity 0.3s ease; padding: 20px; box-sizing: border-box;';
           
           // Fechar ao clicar fora da caixa do reator
           overlay.addEventListener('mousedown', (e) => {
               if (e.target === overlay) window.closeBaitPopup();
           });
           document.body.appendChild(overlay);
       }
       
       overlay.classList.remove('hidden');
       requestAnimationFrame(() => overlay.style.opacity = '1');
       window.renderBaitPopupContent();
   };
   
   window.closeBaitPopup = function() {
       let overlay = document.getElementById('bait-popup-overlay');
       if (overlay) {
           overlay.style.opacity = '0';
           setTimeout(() => { overlay.classList.add('hidden'); }, 300);
       }
       renderBaitLabList(); // Atualiza os números na vitrine ao fechar
   };
   
   window.addBoost = function(id) {
       const state = window.GAME_STATE || { materials: {} };
       if ((state.materials[id] || 0) <= activeBoosts.filter(b => b === id).length) return;
       if (activeBoosts.length < 2) { 
           activeBoosts.push(id); 
           window.renderBaitPopupContent(); 
       }
   };
   
   window.removeBoost = function(index) {
       if (index < activeBoosts.length) { 
           activeBoosts.splice(index, 1); 
           window.renderBaitPopupContent(); 
       }
   };
   
   // Renderiza o Reator (O conteúdo do Popup)
   window.renderBaitPopupContent = function() {
       let overlay = document.getElementById('bait-popup-overlay');
       if (!overlay || !activeBaitRecipe) return;
   
       let reqKeys = Object.keys(activeBaitRecipe.req);
       let canCraft = true;
       
       let reqHtml = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">`;
       reqKeys.forEach(reqId => {
           const have = (window.GAME_STATE.materials && window.GAME_STATE.materials[reqId]) || 0;
           const needed = activeBaitRecipe.req[reqId];
           const progress = Math.min(100, (have / needed) * 100);
           if (have < needed) canCraft = false;
           
           const matData = window.MATERIALS ? window.MATERIALS.find(m => m.id === reqId) : null;
           reqHtml += `
               <div style="background: rgba(0,0,0,0.5); padding: 15px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);">
                   <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                       <span style="color: #e2e8f0; font-size: 1rem; font-weight:600; font-family:'Poppins';">${matData ? matData.icon : '📦'} ${matData ? matData.name : reqId}</span>
                       <span style="font-weight: 900; color: ${have >= needed ? '#34d399' : '#ef4444'}; font-size: 1.1rem; font-family:'Fredoka';">${have}/${needed}</span>
                   </div>
                   <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${progress}%; background: ${have >= needed ? '#10b981' : '#dc2626'}; box-shadow: 0 0 10px ${have >= needed ? '#10b981' : '#dc2626'};"></div></div>
               </div>
           `;
       });
       reqHtml += `</div>`;
   
       const catalysts = window.BOOSTS.filter(b => b.stat === 'luck' || b.stat === 'chance67');
       const sensors = window.BOOSTS.filter(b => b.stat === 'value' || b.stat === 'speed');
   
       const renderMutationRow = (title, icon, type, itemsList, slotText) => {
           const activeOfType = activeBoosts.filter(bId => {
               const bData = window.BOOSTS.find(b => b.id === bId);
               return type === 'catalyst' ? (bData.stat === 'luck' || bData.stat === 'chance67') : (bData.stat === 'value' || bData.stat === 'speed');
           });
   
           let slotsHtml = `<div style="display: flex; gap: 15px; margin-top: 10px;">`;
           for(let i=0; i<2; i++) {
               if (activeOfType[i]) {
                   const bData = window.BOOSTS.find(b => b.id === activeOfType[i]);
                   const boostIndex = activeBoosts.indexOf(activeOfType[i]);
                   slotsHtml += `
                       <div class="comp-slot-tactical filled" onclick="window.removeBoost(${boostIndex})" title="Clique para remover">
                           <span style="font-size:3rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));">${bData.icon}</span>
                           <div style="position:absolute; top:-8px; right:-8px; background:#ef4444; color:white; border-radius:50%; width:32px; height:32px; font-size:1.4rem; font-weight:bold; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 5px rgba(0,0,0,0.5); border: 2px solid #fff;">&times;</div>
                       </div>`;
               } else {
                   slotsHtml += `<div class="comp-slot-tactical"><span style="color:#64748b; font-size:1.1rem; text-align:center; font-family:'Poppins'; font-weight:700; line-height:1.2;">${slotText}</span></div>`;
               }
           }
           slotsHtml += `</div>`;
   
           let invHtml = `<div class="custom-scrollbar" style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; width: 100%;">`;
           let hasOfType = false;
           itemsList.forEach(bst => {
               const count = (window.GAME_STATE.materials && window.GAME_STATE.materials[bst.id]) || 0;
               const available = count - activeBoosts.filter(b => b === bst.id).length;
               if (count > 0) {
                   hasOfType = true;
                   invHtml += `
                       <div onclick="window.addBoost('${bst.id}')" class="boost-inventory-card">
                           <div style="position: absolute; top: -8px; left: -8px; background: ${available > 0 ? '#3b82f6' : '#1e293b'}; color: white; padding: 4px 12px; border-radius: 8px; font-size: 1rem; font-weight: 900; border: 2px solid rgba(255,255,255,0.2); box-shadow: 0 4px 6px rgba(0,0,0,0.5);">${available}</div>
                           <div style="font-size:3rem; margin-bottom: 10px; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));">${bst.icon}</div>
                           <div style="font-size:0.9rem; color:#f8fafc; font-family:'Poppins'; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width: 100%; font-weight:700;">${bst.name}</div>
                           <div style="font-size:0.8rem; color:#fcd34d; font-family:'Fredoka'; font-weight:bold; text-transform:uppercase; letter-spacing:1px; margin-top:6px;">${bst.desc}</div>
                       </div>
                   `;
               }
           });
           invHtml += `</div>`;
           if (!hasOfType) invHtml = `<div style="color:#94a3b8; font-size:1.2rem; text-align:center; padding:30px; background: rgba(0,0,0,0.4); border-radius: 12px; width:100%; border: 1px dashed rgba(255,255,255,0.1); font-family:'Poppins'; font-weight:600;">Nenhum componente em estoque.<br><span style="color:#fbbf24; font-size:1rem;">Adquira no Mercado Negro.</span></div>`;
   
           return `
               <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 25px; display: flex; gap: 30px; align-items: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.3); flex-wrap: wrap;">
                   <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                       <div style="font-size:1.5rem; color:#cbd5e1; font-weight:700; font-family:'Fredoka'; text-transform:uppercase; text-align:center; letter-spacing:1px; margin-bottom: 10px;">${icon} ${title}</div>
                       ${slotsHtml}
                   </div>
                   <div style="flex:1; border-left: 2px solid rgba(255,255,255,0.05); padding-left: 30px; min-width: 300px;">
                       <div style="color:#94a3b8; font-size:1.2rem; font-family:'Poppins'; font-weight:600; margin-bottom:15px;">Estoque Disponível para Injeção:</div>
                       ${invHtml}
                   </div>
               </div>
           `;
       };
   
       let contentHtml = `
           <div style="background: #0f172a; border: 2px solid #10b981; border-radius: 20px; width: 100%; max-width: 1000px; max-height: 95vh; display: flex; flex-direction: column; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.9), inset 0 0 30px rgba(16,185,129,0.1);" onclick="event.stopPropagation()">
               
               <div style="background: rgba(0,0,0,0.4); padding: 30px 40px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; border-top-left-radius: 18px; border-top-right-radius: 18px;">
                   <div style="display: flex; align-items: center; gap: 30px;">
                       <div style="font-size: 5.5rem; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.6)); animation: floatItem 4s ease-in-out infinite;">${activeBaitRecipe.icon}</div>
                       <div>
                           <h2 style="margin: 0; color: #f8fafc; font-family:'Fredoka'; font-size:3rem; text-shadow: 0 4px 8px rgba(0,0,0,0.8);">${activeBaitRecipe.name}</h2>
                           <div style="color: #4ade80; font-size: 1.3rem; font-weight:900; font-family:'Poppins'; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px;">PRODUZ: x${activeBaitRecipe.qty} iscas</div>
                       </div>
                   </div>
                   <button onclick="window.closeBaitPopup()" style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; width: 60px; height: 60px; border-radius: 16px; font-size: 3rem; cursor: pointer; transition: 0.2s; display:flex; align-items:center; justify-content:center;" onmouseover="this.style.background='#ef4444'; this.style.color='#fff'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'; this.style.color='#ef4444'">&times;</button>
               </div>
   
               <div class="custom-scrollbar" style="padding: 40px; display: flex; flex-direction: column; gap: 35px; overflow-y: auto;">
                   
                   <div>
                       <h4 style="margin:0 0 20px 0; color:#e2e8f0; font-size:1.5rem; font-family:'Fredoka'; text-transform:uppercase; letter-spacing:1px; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 10px;">📦 BIOMASSA EXIGIDA</h4>
                       ${reqHtml}
                   </div>
   
                   ${renderMutationRow('Mutações Primárias', '🍀', 'catalyst', catalysts, 'SLOT DE<br>SORTE')}
                   ${renderMutationRow('Mutações Secundárias', '💎', 'sensor', sensors, 'SLOT DE<br>VALOR')}
   
                   <button id="btn-craft-bait" class="modern-btn" style="padding: 30px; font-size: 1.8rem; border: none; background: ${canCraft ? 'linear-gradient(135deg, #10b981, #059669)' : '#1e293b'}; color: ${canCraft ? 'white' : '#64748b'}; cursor: ${canCraft ? 'pointer' : 'not-allowed'}; font-weight: 900; font-family:'Fredoka'; border-radius: 16px; letter-spacing: 2px; animation: ${canCraft ? 'glowPulsing 2.5s infinite' : 'none'}; box-shadow: ${canCraft ? '0 10px 30px rgba(16, 185, 129, 0.4)' : 'none'}; transition: all 0.3s ease;">
                       ${canCraft ? '🧪 INICIAR SÍNTESE GENÉTICA' : '⚠️ BIOMASSA INSUFICIENTE'}
                   </button>
               </div>
           </div>
       `;
       
       overlay.innerHTML = contentHtml;
   
       if (canCraft) {
           safeGet('btn-craft-bait').addEventListener('click', () => {
               let reqKeys = Object.keys(activeBaitRecipe.req);
               reqKeys.forEach(matId => window.GAME_STATE.materials[matId] -= activeBaitRecipe.req[matId]);
               
               if (!window.GAME_STATE.baitBoosts[activeBaitRecipe.id]) {
                   window.GAME_STATE.baitBoosts[activeBaitRecipe.id] = { luck: 0, value: 0, chance67: 0, speed: 0 };
               }
               
               activeBoosts.forEach(bId => {
                   window.GAME_STATE.materials[bId] -= 1;
                   const bData = window.BOOSTS.find(b => b.id === bId);
                   window.GAME_STATE.baitBoosts[activeBaitRecipe.id][bData.stat] = (window.GAME_STATE.baitBoosts[activeBaitRecipe.id][bData.stat] || 0) + bData.val;
               });
               
               window.GAME_STATE.baitInventory[activeBaitRecipe.id] = (window.GAME_STATE.baitInventory[activeBaitRecipe.id] || 0) + activeBaitRecipe.qty;
               
               if(window.saveGame) window.saveGame();
               if(window.showToast) window.showToast("Síntese Concluída", `O Reator processou x${activeBaitRecipe.qty} ${activeBaitRecipe.name} com sucesso!`, "success");
               
               activeBoosts = []; 
               window.renderBaitPopupContent(); // Redesenha o popup instantaneamente
               if(window.updateUI) window.updateUI();
           });
       }
   };
   
   // ==========================================================================
   // MESA TÁTICA E INVENTÁRIO (DRAG & DROP)
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
           div.className = `wb-item-card draggable-item ${isEq ? 'equipped' : ''}`; 
           div.draggable = true; div.dataset.type = type; div.dataset.id = id; 
           
           let icon = item.icon || icons[type];
           let tooltipText = `${item.name}\n`;
           if (item.lore) tooltipText += `${item.lore}\n`;
           if (type === 'bait' && window.GAME_STATE.baitBoosts && window.GAME_STATE.baitBoosts[id]) {
               const b = window.GAME_STATE.baitBoosts[id];
               tooltipText += `\n[Mutações Genéticas Ativas]`;
               if (b.luck) tooltipText += `\n🍀 Sorte: +${b.luck}`;
               if (b.value) tooltipText += `\n💎 Lucro: +${(b.value*100).toFixed(0)}%`;
               if (b.chance67) tooltipText += `\n🐉 Lendas: +${(b.chance67*100).toFixed(0)}%`;
               if (b.speed) tooltipText += `\n🚀 Velocidade: +${(b.speed*100).toFixed(0)}%`;
           }
           div.title = tooltipText;
   
           div.innerHTML = `
               ${isEq ? `<div class="wb-badge-equipped">ON</div>` : ''}
               <div style="font-size: 1.6rem; margin-bottom: 2px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); pointer-events: none;">${icon}</div>
               <div style="font-weight:bold; font-size:0.65rem; color:#f8fafc; font-family:'Poppins'; text-align:center; line-height:1.1; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; width:100%; pointer-events: none;">${item.name}</div>
               ${type === 'bait' ? `<div style="position:absolute; bottom:4px; right:6px; color:#4ade80; font-size:0.6rem; font-weight:bold; pointer-events: none;">x${window.GAME_STATE.baitInventory[id]}</div>` : ''}
           `; 
           
           div.addEventListener('dragstart', handleDragStart); 
           div.addEventListener('dragend', handleDragEnd); 
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
       safeGet('wb-rod-content').innerHTML = `<span style="color: #60a5fa; font-weight: bold;">${rod.name}</span>`;
   
       const sinker = (window.SINKERS || []).find(s => s.id === window.GAME_STATE.currentSinker) || {name: 'Padrão'};
       safeGet('wb-sinker-content').innerHTML = `<span style="color: #fcd34d; font-weight: bold;">${sinker.name}</span>`;
   
       const hookId = window.GAME_STATE.currentHook || 'anzol_padrao';
       const hookData = (window.HOOKS || []).find(h => h.id === hookId) || {name: 'Anzol Padrão', color: '#cbd5e1'};
       safeGet('wb-hook-content').innerHTML = `<span style="color:${hookData.color}; font-weight: bold; text-shadow: 0 0 10px ${hookData.color}88;">${hookData.name}</span>`;
   
       const knife = (window.KNIVES || []).find(k => k.id === window.GAME_STATE.currentKnife) || {name: 'Nenhuma'};
       safeGet('wb-knife-content').innerHTML = `<span style="color: #fca5a5; font-weight: bold;">${knife.name}</span>`;
   
       const baitDisplay = safeGet('wb-bait-content');
       if (window.GAME_STATE.currentBait && window.BAITS) {
           const bait = window.BAITS.find(b => b.id === window.GAME_STATE.currentBait);
           const boosts = window.GAME_STATE.baitBoosts ? window.GAME_STATE.baitBoosts[bait.id] : null;
           let bText = '';
           if (boosts) {
               if (boosts.luck) bText += `<span style="color:#fbbf24">🍀+${boosts.luck}</span> `;
               if (boosts.chance67) bText += `<span style="color:#ef4444">🐉+${(boosts.chance67*100).toFixed(0)}%</span> `;
           }
           if(bait) {
               baitDisplay.innerHTML = `
                   <div style="display:flex; flex-direction:column; align-items:center; line-height: 1.2;">
                       <span style="color:#4ade80; text-shadow: 0 0 10px rgba(74,222,128,0.5); font-weight:bold; font-size:0.9rem;">${bait.icon} ${bait.name}</span>
                       <span style="font-size:0.55rem; color:#94a3b8; text-align:center; margin-top:2px;">${bText || 'Genética Base'}</span>
                   </div>`;
           }
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
       e.dataTransfer.effectAllowed = 'move';
       e.dataTransfer.setData('text/plain', e.currentTarget.dataset.id); 
       setTimeout(() => { e.target.style.opacity = '0.4'; }, 0); 
   }
   
   function handleDragEnd(e) {
       e.target.style.opacity = '1';
       document.querySelectorAll('.dropzone').forEach(z => z.classList.remove('drag-over'));
       draggedItem = null;
   }
   
   document.addEventListener('DOMContentLoaded', () => {
       const dropzones = document.querySelectorAll('.dropzone');
       dropzones.forEach(zone => {
           zone.addEventListener('dragover', (e) => { 
               e.preventDefault(); 
               e.dataTransfer.dropEffect = 'move';
               if (draggedItem && draggedItem.type === zone.dataset.droptype) { zone.classList.add('drag-over'); } 
           });
           zone.addEventListener('dragleave', () => { zone.classList.remove('drag-over'); });
           zone.addEventListener('drop', (e) => {
               e.preventDefault(); 
               zone.classList.remove('drag-over');
               if (draggedItem && draggedItem.type === zone.dataset.droptype) { equipItem(draggedItem.type, draggedItem.id); }
           });
       });
   });