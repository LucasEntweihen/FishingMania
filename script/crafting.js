/* ==========================================================================
   SISTEMA DE CRAFTING, LOJA E FORJA - UI/UX ULTRA MODERNA (CORRIGIDO)
   ========================================================================== */

   function safeGet(id) { return document.getElementById(id); }

   window.SHOP_MULTIPLIER = 1; 
   
   // INJEÇÃO DE ESTILOS MODERNOS EXCLUSIVOS DO JAVASCRIPT
   function injectModernCraftingStyles() {
       if (document.getElementById('modern-crafting-styles')) return;
       const style = document.createElement('style');
       style.id = 'modern-crafting-styles';
       style.innerHTML = `
           @keyframes floatItem {
               0%, 100% { transform: translateY(0); }
               50% { transform: translateY(-6px); }
           }
           @keyframes magmaPulse {
               0% { filter: drop-shadow(0 0 10px rgba(234, 88, 12, 0.5)); }
               50% { filter: drop-shadow(0 0 25px rgba(234, 88, 12, 0.9)); }
               100% { filter: drop-shadow(0 0 10px rgba(234, 88, 12, 0.5)); }
           }
   
           .modern-shop-card {
               background: rgba(30, 41, 59, 0.7) !important;
               backdrop-filter: blur(12px) !important;
               border-radius: 16px !important;
               transition: all 0.3s ease !important;
               border-top: 1px solid rgba(255,255,255,0.1) !important;
               border-left: 1px solid rgba(255,255,255,0.05) !important;
           }
           .modern-shop-card:hover {
               transform: translateY(-6px) scale(1.02) !important;
               z-index: 10;
               background: rgba(30, 41, 59, 0.9) !important;
           }
           
           .modern-btn {
               background: rgba(255,255,255,0.05);
               backdrop-filter: blur(5px);
               border-radius: 8px;
               color: #fff;
               font-family: 'Poppins', sans-serif;
               font-weight: 600;
               transition: 0.2s;
               cursor: pointer;
           }
           .modern-btn:hover:not(:disabled) {
               background: rgba(255,255,255,0.15);
               transform: translateY(-2px);
           }
   
           .forge-diagram-card {
               background: rgba(15, 23, 42, 0.6);
               border-left: 3px solid transparent;
               transition: 0.2s ease;
           }
           .forge-diagram-card:hover {
               background: rgba(30, 41, 59, 0.9);
               padding-left: 20px !important;
           }
       `;
       document.head.appendChild(style);
   }
   
   // INICIALIZADOR
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
   
   // ==========================================
   // 1. LOJA (MERCADO NEGRO)
   // ==========================================
   function getRarityColor(price) {
       if (price <= 5000) return '#94a3b8'; 
       if (price <= 80000) return '#34d399'; 
       if (price <= 850000) return '#38bdf8'; 
       if (price <= 5000000) return '#c084fc'; 
       if (price <= 20000000) return '#fbbf24'; 
       return '#fb7185'; 
   }
   
   window.setShopMultiplier = function(val) {
       window.SHOP_MULTIPLIER = val;
       window.renderShop();
   }
   
   window.buyMaterial = function(id, basePrice, qty) {
       const totalCost = basePrice * qty;
       if (window.GAME_STATE && window.GAME_STATE.coins >= totalCost) {
           window.GAME_STATE.coins -= totalCost;
           if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
           window.GAME_STATE.materials[id] = (window.GAME_STATE.materials[id] || 0) + qty;
           
           if (safeGet('cat-coins')) safeGet('cat-coins').innerText = window.GAME_STATE.coins.toLocaleString();
           const shopCoinDisplay = document.getElementById('shop-live-coins');
           if (shopCoinDisplay) shopCoinDisplay.innerText = `🪙 ${window.GAME_STATE.coins.toLocaleString()}`;
           
           window.renderShop(); 
           if(typeof window.saveGame === "function") window.saveGame();
       } else {
           if(window.showToast) window.showToast("Fundos Insuficientes", `Faltam moedas para comprar esta quantidade.`, "error");
       }
   };
   
   window.renderShop = function() {
       const container = safeGet('shop-container');
       if (!container) return;
   
       let savedScrollTop = 0;
       const scrollArea = document.getElementById('shop-scroll-area');
       if (scrollArea) savedScrollTop = scrollArea.scrollTop;
   
       const modalContent = container.closest('.modal-content');
       if (modalContent) {
           modalContent.style.padding = '0';
           modalContent.style.background = 'transparent';
           modalContent.style.border = 'none';
           modalContent.style.boxShadow = 'none';
           const oldHeader = modalContent.querySelector('.modal-header');
           if (oldHeader) oldHeader.style.display = 'none';
       }
   
       const state = window.GAME_STATE || { materials: {}, coins: 0 };
       
       let html = `
           <div style="background: radial-gradient(circle at top right, #0f172a, #020617); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.1); width: 100%;">
               
               <div style="background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); position: sticky; top: 0; z-index: 50;">
                   <div>
                       <h2 style="margin: 0; color: #f8fafc; font-family: 'Fredoka', sans-serif; font-size: 2rem; letter-spacing: 1px; display: flex; align-items: center; gap: 10px;">
                           <span style="background: -webkit-linear-gradient(45deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Mercado Negro</span>
                       </h2>
                       <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 0.9rem; font-family: 'Poppins', sans-serif;">Troque as suas moedas por recursos vitais.</p>
                   </div>
                   <div style="display: flex; align-items: center; gap: 20px;">
                       <div id="shop-live-coins" style="background: rgba(0,0,0,0.5); padding: 10px 25px; border-radius: 30px; border: 1px solid rgba(251, 191, 36, 0.3); color: #f8fafc; font-weight: 800; font-size: 1.4rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); font-family: 'Poppins', sans-serif;">
                           <span style="color:#fbbf24">🪙</span> ${state.coins.toLocaleString()}
                       </div>
                       <button onclick="document.getElementById('shop-modal').classList.add('hidden')" style="background: rgba(239, 68, 68, 0.1); color: #f8fafc; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 50%; width: 45px; height: 45px; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='rgba(239, 68, 68, 0.8)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'; this.style.transform='scale(1)'">✕</button>
                   </div>
               </div>
   
               <div class="custom-scrollbar" style="padding: 30px; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=') repeat; overflow-y: auto; max-height: 65vh; scroll-behavior: auto;" id="shop-scroll-area">
       `;
   
       const buildCard = (item, isBoost) => {
           const count = (state.materials && state.materials[item.id]) ? state.materials[item.id] : 0;
           const color = isBoost ? '#fb923c' : getRarityColor(item.price);
           
           const canBuy1 = state.coins >= item.price;
           const canBuy10 = state.coins >= (item.price * 10);
           const canBuy100 = state.coins >= (item.price * 100);
   
           const btnStyle = (canBuy) => `flex:1; padding: 10px 0; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; background: ${canBuy ? `linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05))` : 'rgba(0,0,0,0.3)'}; color: ${canBuy ? '#fff' : '#64748b'}; font-weight: 700; font-family: 'Poppins', sans-serif; cursor: ${canBuy ? 'pointer' : 'not-allowed'}; transition: 0.2s; font-size: 0.8rem;`;
           const loreHtml = item.lore ? `<div style="font-size:0.7rem; color:#94a3b8; margin: 10px 0; padding: 10px; line-height: 1.4; background: rgba(0,0,0,0.4); border-radius: 8px; border-left: 3px solid ${color}; text-align: left; word-wrap: break-word;">${item.lore}</div>` : '';
   
           return `
               <div class="modern-shop-card" style="box-shadow: 0 10px 30px -10px ${color}33;">
                   <div style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); color: #f8fafc; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; font-family: 'Poppins', sans-serif; border: 1px solid ${color}66; backdrop-filter: blur(4px);">
                       📦 Estoque: ${count}
                   </div>
                   <div style="padding: 30px 20px 20px 20px; text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: start; align-items: center; background: radial-gradient(circle at top, ${color}11, transparent 70%);">
                       <div style="font-size: 4rem; margin-bottom: 15px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5)); animation: floatItem 6s ease-in-out infinite;">${item.icon}</div>
                       <div style="color: #f8fafc; font-family: 'Fredoka', sans-serif; font-size: 1.2rem; font-weight: 600; line-height: 1.2; margin-bottom: 5px;">${item.name}</div>
                       ${isBoost ? `<div style="color: ${color}; font-size: 0.8rem; font-family: 'Poppins', sans-serif; margin-bottom: 5px; font-weight: bold; background: ${color}22; padding: 2px 10px; border-radius: 10px;">${item.desc}</div>` : ''}
                       ${loreHtml}
                       <div style="color: #fbbf24; font-weight: 800; font-size: 1.1rem; font-family: 'Poppins', sans-serif; margin-top: auto; padding-top: 15px;">
                           🪙 ${item.price.toLocaleString()}
                       </div>
                   </div>
                   <div style="padding: 15px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05);">
                       <div style="display: flex; gap: 8px; width: 100%;">
                           <button class="modern-btn" onclick="${canBuy1 ? `window.buyMaterial('${item.id}', ${item.price}, 1)` : ''}" style="${btnStyle(canBuy1)}">1x</button>
                           <button class="modern-btn" onclick="${canBuy10 ? `window.buyMaterial('${item.id}', ${item.price}, 10)` : ''}" style="${btnStyle(canBuy10)}">10x</button>
                           <button class="modern-btn" onclick="${canBuy100 ? `window.buyMaterial('${item.id}', ${item.price}, 100)` : ''}" style="${btnStyle(canBuy100)}">100x</button>
                       </div>
                   </div>
               </div>
           `;
       };
   
       html += `
           <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
               <h3 style="margin: 0; color: #e2e8f0; font-family: 'Fredoka', sans-serif; font-size: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">💎 Matérias-Primas</h3>
               <div style="height: 1px; flex: 1; background: linear-gradient(90deg, rgba(255,255,255,0.2), transparent);"></div>
           </div>
           <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 25px; margin-bottom: 50px; align-items: start;">
       `;
       if(window.MATERIALS) window.MATERIALS.forEach(mat => { if (mat.price > 0) html += buildCard(mat, false); });
       html += `</div>`; 
   
       html += `
           <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
               <h3 style="margin: 0; color: #e2e8f0; font-family: 'Fredoka', sans-serif; font-size: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">⚡ Catalisadores de Laboratório</h3>
               <div style="height: 1px; flex: 1; background: linear-gradient(90deg, rgba(255,255,255,0.2), transparent);"></div>
           </div>
           <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 25px; align-items: start;">
       `;
       if(window.BOOSTS) window.BOOSTS.forEach(bst => { html += buildCard(bst, true); });
       html += `</div></div></div>`; 
       
       container.innerHTML = html;
   
       const newScrollArea = document.getElementById('shop-scroll-area');
       if (newScrollArea) newScrollArea.scrollTop = savedScrollTop;
   };
   
   // ==========================================
   // 2. A GRANDE FORJA (MAGMA SINTÉTICO)
   // ==========================================
   function renderRecipeList() {
       const list = safeGet('recipe-list');
       if (!list || !window.CRAFTING_DB) return;
       
       let savedScroll = list.scrollTop;
   
       list.innerHTML = `
           <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; align-items: start; padding-right: 10px;">
               <div id="col-rods" style="display: flex; flex-direction: column; gap: 10px;">
                   <div style="background: rgba(15, 23, 42, 0.9); border-bottom: 2px solid #6366f1; padding: 12px; border-radius: 12px 12px 0 0; position: sticky; top: -25px; z-index: 5; backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                       <h3 style="font-size: 1.1rem; color: #a5b4fc; text-align: center; margin: 0; font-family:'Fredoka'; letter-spacing: 1px;">🎣 Varas</h3>
                   </div>
               </div>
               <div id="col-sinkers" style="display: flex; flex-direction: column; gap: 10px;">
                   <div style="background: rgba(15, 23, 42, 0.9); border-bottom: 2px solid #f59e0b; padding: 12px; border-radius: 12px 12px 0 0; position: sticky; top: -25px; z-index: 5; backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                       <h3 style="font-size: 1.1rem; color: #fcd34d; text-align: center; margin: 0; font-family:'Fredoka'; letter-spacing: 1px;">🪨 Pesos</h3>
                   </div>
               </div>
               <div id="col-hooks" style="display: flex; flex-direction: column; gap: 10px;">
                   <div style="background: rgba(15, 23, 42, 0.9); border-bottom: 2px solid #14b8a6; padding: 12px; border-radius: 12px 12px 0 0; position: sticky; top: -25px; z-index: 5; backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                       <h3 style="font-size: 1.1rem; color: #5eead4; text-align: center; margin: 0; font-family:'Fredoka'; letter-spacing: 1px;">🪝 Anzóis</h3>
                   </div>
               </div>
               <div id="col-knives" style="display: flex; flex-direction: column; gap: 10px;">
                   <div style="background: rgba(15, 23, 42, 0.9); border-bottom: 2px solid #ef4444; padding: 12px; border-radius: 12px 12px 0 0; position: sticky; top: -25px; z-index: 5; backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                       <h3 style="font-size: 1.1rem; color: #fca5a5; text-align: center; margin: 0; font-family:'Fredoka'; letter-spacing: 1px;">🔪 Facas</h3>
                   </div>
               </div>
           </div>
       `;
   
       const colRods = safeGet('col-rods'); 
       const colSinkers = safeGet('col-sinkers'); 
       const colHooks = safeGet('col-hooks'); 
       const colKnives = safeGet('col-knives');
       
       const createCard = (type, id, item, isOwned) => {
           const div = document.createElement('div');
           const borderColor = isOwned ? 'rgba(52, 211, 153, 0.5)' : 'rgba(255,255,255,0.05)';
           const bgColor = isOwned ? 'rgba(52, 211, 153, 0.05)' : 'rgba(0,0,0,0.4)';
           
           div.className = "forge-diagram-card";
           div.style = `padding: 12px; border: 1px solid ${borderColor}; border-radius: 10px; cursor: pointer; background: ${bgColor}; font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; min-height: 60px; backdrop-filter: blur(5px);`;
           
           div.onmouseover = () => { div.style.borderColor = isOwned ? '#34d399' : '#fb923c'; div.style.background = isOwned ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 146, 60, 0.1)'; div.style.transform = 'translateY(-2px)'; };
           div.onmouseout = () => { div.style.borderColor = borderColor; div.style.background = bgColor; div.style.transform = 'translateY(0)'; };
   
           div.innerHTML = `
               <span style="font-weight: 600; color: ${isOwned ? '#34d399' : '#e2e8f0'}; font-size: 0.85rem; line-height: 1.3; padding-right: 5px; width: 85%; word-wrap: break-word;">${item.name}</span>
               <span style="font-size: 1.2rem; filter: drop-shadow(0 0 8px ${isOwned ? '#34d399' : 'transparent'}); width: 15%; text-align: right;">${isOwned ? '✨' : '🔒'}</span>
           `;
           div.addEventListener('click', () => renderCraftingArea(type, id, item)); 
           return div;
       };
   
       if (window.GAME_STATE && window.GAME_STATE.ownedHooks === undefined) window.GAME_STATE.ownedHooks = ['anzol_padrao'];
   
       if (window.GAME_STATE) {
           Object.keys(window.CRAFTING_DB.recipes.rods).forEach(id => { colRods.appendChild(createCard('rod', id, window.CRAFTING_DB.recipes.rods[id], window.GAME_STATE.ownedRods && window.GAME_STATE.ownedRods.includes(parseInt(id)))); });
           Object.keys(window.CRAFTING_DB.recipes.sinkers).forEach(id => { colSinkers.appendChild(createCard('sinker', id, window.CRAFTING_DB.recipes.sinkers[id], window.GAME_STATE.ownedSinkers && window.GAME_STATE.ownedSinkers.includes(id))); });
           Object.keys(window.CRAFTING_DB.recipes.hooks).forEach(id => { colHooks.appendChild(createCard('hook', id, window.CRAFTING_DB.recipes.hooks[id], window.GAME_STATE.ownedHooks && window.GAME_STATE.ownedHooks.includes(id))); });
           Object.keys(window.CRAFTING_DB.recipes.knives).forEach(id => { colKnives.appendChild(createCard('knife', id, window.CRAFTING_DB.recipes.knives[id], window.GAME_STATE.ownedKnives && window.GAME_STATE.ownedKnives.includes(id))); });
       }
   
       list.scrollTop = savedScroll;
   }
   
   window.doCraftItem = function(type, id) {
       if (!window.CRAFTING_DB) return;
       let recipeCategory = type === 'rod' ? 'rods' : (type === 'sinker' ? 'sinkers' : (type === 'hook' ? 'hooks' : 'knives'));
       const recipe = window.CRAFTING_DB.recipes[recipeCategory][id];
       if (!recipe) return;
   
       if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
       Object.keys(recipe.req).forEach(matId => { window.GAME_STATE.materials[matId] -= recipe.req[matId]; });
   
       if (type === 'rod') { if (!window.GAME_STATE.ownedRods) window.GAME_STATE.ownedRods = []; window.GAME_STATE.ownedRods.push(parseInt(id)); } 
       else if (type === 'sinker') { if (!window.GAME_STATE.ownedSinkers) window.GAME_STATE.ownedSinkers = []; window.GAME_STATE.ownedSinkers.push(id); } 
       else if (type === 'hook') { if (!window.GAME_STATE.ownedHooks) window.GAME_STATE.ownedHooks = []; window.GAME_STATE.ownedHooks.push(id); }
       else if (type === 'knife') { if (!window.GAME_STATE.ownedKnives) window.GAME_STATE.ownedKnives = []; window.GAME_STATE.ownedKnives.push(id); }
   
       if (typeof window.saveGame === "function") window.saveGame();
       if(window.showToast) window.showToast("Item Forjado!", `Diagrama processado. Vá à aba de Montagem para equipar.`, "success");
       
       renderRecipeList(); renderCraftingArea(type, id, recipe);
   };
   
   function renderCraftingArea(type, id, recipe) {
       const area = safeGet('crafting-area'); if (!area) return;
       let canCraft = true; let reqHtml = '';
   
       let loreText = "Esquema sem registos. Forja por sua conta e risco.";
       if (type === 'rod') { const obj = window.ROD_TEMPLATES.find(r => r.name === recipe.name); if (obj && obj.lore) loreText = obj.lore; } 
       else if (type === 'sinker') { const obj = window.SINKERS.find(s => s.id === id); if (obj && obj.lore) loreText = obj.lore; } 
       else if (type === 'hook') { const obj = window.HOOKS.find(h => h.id === id); if (obj && obj.lore) loreText = obj.lore; }
       else if (type === 'knife') { const obj = window.KNIVES.find(k => k.id === id); if (obj && obj.lore) loreText = obj.lore; }
   
       Object.keys(recipe.req).forEach(matId => {
           const needed = recipe.req[matId]; 
           const have = (window.GAME_STATE.materials && window.GAME_STATE.materials[matId]) || 0; 
           const matData = window.MATERIALS ? window.MATERIALS.find(m => m.id === matId) : null;
           if (have < needed) canCraft = false;
           
           reqHtml += `
               <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.4); padding: 12px 15px; border-radius: 10px; border-left: 4px solid ${have >= needed ? '#34d399' : '#ef4444'}; margin-bottom: 8px; width: 100%; font-family: 'Poppins', sans-serif;">
                   <span style="color: #e2e8f0; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;"><span style="font-size: 1.2rem;">${matData ? matData.icon : '📦'}</span> ${matData ? matData.name : matId}</span>
                   <span style="font-weight: 700; font-size: 1rem; color: ${have >= needed ? '#34d399' : '#ef4444'}; background: rgba(0,0,0,0.5); padding: 4px 10px; border-radius: 6px;">${have} / ${needed}</span>
               </div>
           `;
       });
   
       const isOwned = type === 'rod' ? (window.GAME_STATE.ownedRods && window.GAME_STATE.ownedRods.includes(parseInt(id))) 
           : type === 'sinker' ? (window.GAME_STATE.ownedSinkers && window.GAME_STATE.ownedSinkers.includes(id)) 
           : type === 'hook' ? (window.GAME_STATE.ownedHooks && window.GAME_STATE.ownedHooks.includes(id)) 
           : (window.GAME_STATE.ownedKnives && window.GAME_STATE.ownedKnives.includes(id));
   
       const btnStyleReady = "margin-top: 20px; width: 100%; padding: 15px; font-size: 1.1rem; font-family: 'Fredoka', sans-serif; font-weight: 700; background: linear-gradient(135deg, #ea580c, #c2410c); color: white; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 10px 20px -5px rgba(234, 88, 12, 0.5), inset 0 2px 4px rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 2px; transition: all 0.2s;";
       const btnStyleDisabled = "margin-top: 20px; width: 100%; padding: 15px; font-size: 1.1rem; font-family: 'Fredoka', sans-serif; font-weight: 700; background: #1e293b; color: #475569; border: 1px solid #334155; border-radius: 12px; cursor: not-allowed; text-transform: uppercase; letter-spacing: 2px;";
   
       area.innerHTML = `
           <div style="font-size: 4rem; margin-bottom: 10px; animation: ${isOwned ? 'none' : (canCraft ? 'magmaPulse 3s infinite' : 'none')}; filter: drop-shadow(0 0 10px ${isOwned ? '#34d399' : (canCraft ? '#ea580c' : 'transparent')});">${isOwned ? '✨' : (canCraft ? '🔥' : '❄️')}</div>
           <h2 style="color: #f8fafc; margin: 0 0 5px 0; font-family: 'Fredoka', sans-serif; text-align: center; font-size: 1.6rem; word-wrap: break-word;">${recipe.name}</h2>
           <div style="color: #fb923c; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; font-weight: 700;">Diagrama Analisado</div>
           
           <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.05); padding: 12px; margin-bottom: 20px; font-size: 0.8rem; color: #94a3b8; line-height: 1.5; text-align: left; border-radius: 12px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); width: 100%; font-family: 'Poppins', sans-serif;">
               ${loreText}
           </div>
   
           <div style="width: 100%; display: flex; flex-direction: column; gap: 5px;">
               ${reqHtml}
           </div>
   
           ${isOwned 
               ? `<div style="margin-top: 25px; font-weight: 700; color: #34d399; font-family: 'Poppins', sans-serif; text-align: center; font-size: 1rem; background: rgba(52, 211, 153, 0.1); padding: 15px; border-radius: 12px; border: 1px solid rgba(52, 211, 153, 0.3); width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px;"><span style="font-size:1.2rem;">✔️</span> Diagrama Concluído</div>` 
               : `<button onclick="window.doCraftItem('${type}', '${id}')" ${!canCraft ? 'disabled' : ''} style="${canCraft ? btnStyleReady : btnStyleDisabled}" onmouseover="${canCraft ? "this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 25px -5px rgba(234, 88, 12, 0.6), inset 0 2px 4px rgba(255,255,255,0.4)'" : ""}" onmouseout="${canCraft ? "this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 20px -5px rgba(234, 88, 12, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)'" : ""}" onmousedown="${canCraft ? "this.style.transform='translateY(2px)'; this.style.boxShadow='none'" : ""}" onmouseup="${canCraft ? "this.style.transform='translateY(-2px)'" : ""}">
                   ${canCraft ? '⚒️ Bater o Martelo' : 'Recursos Insuficientes'}
                  </button>`
           }
       `;
   }
   
   // ==========================================
   // 3. LABORATÓRIO QUÍMICO (MOSTRANDO MATERIAIS)
   // ==========================================
   let activeBaitRecipe = null;
   let activeBoosts = []; 
   
   function renderBaitLabList() {
       if (window.GAME_STATE && !window.GAME_STATE.baitBoosts) window.GAME_STATE.baitBoosts = {};
   
       const list = safeGet('bait-recipe-list');
       if (!list || !window.BAITS) return;
       
       let savedScroll = list.scrollTop;
   
       list.innerHTML = `
           <div style="background: rgba(15, 23, 42, 0.8); padding: 15px; border-radius: 12px; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #22c55e;">
               <h3 style="font-size: 1.1rem; color: #4ade80; margin: 0; font-family:'Fredoka'; text-transform:uppercase; letter-spacing:1px;">🧬 Fórmulas</h3>
           </div>
       `;
       
       window.BAITS.forEach(bait => {
           if (!bait.req) return; 
           const count = (window.GAME_STATE && window.GAME_STATE.baitInventory[bait.id]) ? window.GAME_STATE.baitInventory[bait.id] : 0;
           const isActive = activeBaitRecipe && activeBaitRecipe.id === bait.id;
           
           const div = document.createElement('div');
           div.style = `padding: 12px; border: 1px solid ${isActive ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255,255,255,0.05)'}; border-radius: 12px; margin-bottom: 10px; cursor: pointer; background: ${isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0,0,0,0.2)'}; box-shadow: ${isActive ? '0 0 15px rgba(34, 197, 94, 0.1)' : 'none'}; font-family: 'Poppins', sans-serif; transition: all 0.2s; position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: center;`;
           
           div.onmouseover = () => { if(!isActive) div.style.background = 'rgba(255,255,255,0.05)'; };
           div.onmouseout = () => { if(!isActive) div.style.background = 'rgba(0,0,0,0.2)'; };
   
           if (isActive) div.innerHTML += `<div style="position:absolute; top:0; left:0; width:4px; height:100%; background:#22c55e; box-shadow: 0 0 10px #22c55e;"></div>`;
           
           div.innerHTML += `
               <strong style="font-size:0.9rem; color: ${isActive ? '#f8fafc' : '#cbd5e1'}; font-weight: 600; display: flex; align-items: center; gap: 8px;"><span style="font-size: 1.2rem;">${bait.icon}</span> ${bait.name}</strong>
               <span style="background: rgba(0,0,0,0.5); color: #94a3b8; padding: 2px 8px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.1);">x${count}</span>
           `;
           div.addEventListener('click', () => { activeBaitRecipe = bait; renderBaitLabList(); renderBaitLabArea(); });
           list.appendChild(div);
       });
       
       list.scrollTop = savedScroll;
       renderBaitInventory(); 
   }
   
   window.addBoost = function(id) {
       const state = window.GAME_STATE || { materials: {} };
       const totalOwned = state.materials[id] || 0;
       const currentlyInTubes = activeBoosts.filter(b => b === id).length;
   
       if (totalOwned <= currentlyInTubes) {
           if(window.showToast) window.showToast("Estoque Vazio", "Necessita de comprar mais deste catalisador.", "warning");
           return;
       }
   
       if (activeBoosts.length < 2) {
           activeBoosts.push(id);
           renderBaitLabList();
           renderBaitLabArea();
       } else {
           if(window.showToast) window.showToast("Sobrecarga", "Os dois tubos de injeção já estão cheios.", "warning");
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
       
       const tubeStyle = (color, isEmpty) => `min-width: 70px; min-height: 70px; padding: 8px; border-radius: 12px; border: 1px solid ${isEmpty ? 'rgba(255,255,255,0.1)' : color}; background: ${isEmpty ? 'rgba(0,0,0,0.3)' : `rgba(0,0,0,0.6)`}; box-shadow: ${isEmpty ? 'inset 0 4px 10px rgba(0,0,0,0.5)' : `inset 0 0 15px ${color}33`}; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: 0.3s;`;
   
       if (!activeBaitRecipe) {
           safeGet('bait-content-1').innerHTML = '<div style="font-size: 1.5rem; opacity: 0.2; filter: grayscale(1);">🧪</div>';
           safeGet('bait-content-2').innerHTML = '<div style="font-size: 1.5rem; opacity: 0.2; filter: grayscale(1);">🧪</div>';
           safeGet('bait-content-3').innerHTML = '<div style="font-size: 0.8rem; color:#64748b; font-weight:600;">Vazio</div>';
           safeGet('bait-content-4').innerHTML = '<div style="font-size: 0.8rem; color:#64748b; font-weight:600;">Vazio</div>';
           
           safeGet('bait-slot-1').style.cssText = tubeStyle('#fff', true);
           safeGet('bait-slot-2').style.cssText = tubeStyle('#fff', true);
           safeGet('bait-slot-3').style.cssText = tubeStyle('#fff', true) + 'cursor:not-allowed;';
           safeGet('bait-slot-4').style.cssText = tubeStyle('#fff', true) + 'cursor:not-allowed;';
   
           resultArea.innerHTML = `
               <div style="color:#64748b; font-family:'Poppins', sans-serif; text-align: center; padding: 30px;">
                   <div style="font-size: 2.5rem; margin-bottom: 10px; opacity: 0.5;">🔬</div>
                   <div style="font-size: 0.9rem;">Aguardando seleção de diagrama genético.</div>
               </div>
           `;
           return;
       }
   
       let canCraft = true;
       const reqKeys = Object.keys(activeBaitRecipe.req);
       const req1 = reqKeys[0];
       const req2 = reqKeys[1]; 
       
       const updateSlot = (slotNum, reqId) => {
           const slotEl = safeGet(`bait-slot-${slotNum}`);
           const content = safeGet(`bait-content-${slotNum}`);
           
           if (!reqId) { 
               slotEl.style.cssText = tubeStyle('#fff', true);
               content.innerHTML = '<div style="font-size: 1.5rem; opacity: 0.2;">🧪</div>'; 
               return; 
           }
           
           const needed = activeBaitRecipe.req[reqId];
           const state = window.GAME_STATE || { materials: {} };
           const have = state.materials[reqId] || 0;
           const matData = window.MATERIALS ? window.MATERIALS.find(m => m.id === reqId) : null;
           if (have < needed) canCraft = false;
           
           const color = have >= needed ? '#34d399' : '#ef4444';
           slotEl.style.cssText = tubeStyle(color, false);
           
           content.innerHTML = `
               <div style="font-size:1.8rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); margin-bottom: 4px;">${matData ? matData.icon : '📦'}</div>
               <div style="font-size:0.75rem; font-weight:800; color:${color}; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 6px;">${have}/${needed}</div>
           `;
       };
       
       updateSlot(1, req1);
       updateSlot(2, req2);
   
       for (let i = 0; i < 2; i++) {
           const slotEl = safeGet(`bait-slot-${i + 3}`);
           const content = safeGet(`bait-content-${i + 3}`);
           
           if (activeBoosts[i]) {
               const boostData = window.BOOSTS.find(b => b.id === activeBoosts[i]);
               slotEl.style.cssText = tubeStyle('#f59e0b', false) + 'cursor:pointer;';
               slotEl.onmouseover = () => { slotEl.style.background = 'rgba(245, 158, 11, 0.1)'; };
               slotEl.onmouseout = () => { slotEl.style.background = 'rgba(0,0,0,0.6)'; };
               
               content.innerHTML = `
                   <div style="font-size:1.8rem; filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.8)); margin-bottom: 4px; animation: floatItem 3s ease-in-out infinite;">${boostData.icon}</div>
                   <div style="font-size:0.65rem; font-weight:800; color:#fcd34d; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 6px; text-transform: uppercase;">Ativo</div>
               `;
           } else {
               slotEl.style.cssText = tubeStyle('#fff', true) + 'cursor:pointer;';
               slotEl.onmouseover = () => { slotEl.style.background = 'rgba(255,255,255,0.05)'; };
               slotEl.onmouseout = () => { slotEl.style.background = 'rgba(0,0,0,0.3)'; };
               
               content.innerHTML = `<div style="font-size:0.8rem; color:#64748b; font-weight: 600;">Vazio</div>`;
           }
       }
       
       const state = window.GAME_STATE || { baitBoosts: {} };
       let currentBaitBoostLvl = state.baitBoosts[activeBaitRecipe.id] || { luck: 0, value: 0, chance67: 0, speed: 0 };
       if (currentBaitBoostLvl.speed === undefined) currentBaitBoostLvl.speed = 0;
       
       let addedLuck = 0, addedValue = 0, addedChance67 = 0, addedSpeed = 0;
       
       activeBoosts.forEach(bId => {
           const bData = window.BOOSTS.find(b => b.id === bId);
           if(bData) {
               if (bData.stat === 'luck') addedLuck += bData.val;
               if (bData.stat === 'value') addedValue += bData.val;
               if (bData.stat === 'chance67') addedChance67 += bData.val;
               if (bData.stat === 'speed') addedSpeed += bData.val;
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
               text += ` <span style="color:#4ade80; font-weight:900;">(+${aText})</span>`;
           }
           return text;
       };
   
       const baitLore = activeBaitRecipe.lore || "Síntese não classificada.";
   
       resultArea.innerHTML = `
           <div style="width: 100%;">
               <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                   <div style="font-size:1.4rem; font-weight:800; color: #f8fafc; display: flex; align-items: center; gap: 10px;">
                       <span style="font-size: 1.8rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${activeBaitRecipe.icon}</span> 
                       ${activeBaitRecipe.name}
                   </div>
                   <div style="background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.4); color: #4ade80; font-weight: 800; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem;">
                       Rendimento: x${activeBaitRecipe.qty}
                   </div>
               </div>
               
               <div style="background: rgba(15, 23, 42, 0.8); border-left: 3px solid #3b82f6; padding: 12px; border-radius: 0 10px 10px 0; font-size: 0.8rem; color: #cbd5e1; line-height: 1.4; font-family: 'Poppins', sans-serif; margin-bottom: 15px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);">
                   <strong style="color: #60a5fa; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px; display: block; margin-bottom: 4px;">Efeito da Biologia:</strong>
                   <span style="color: white;">${activeBaitRecipe.desc}</span><br><br>
                   <strong style="color: #60a5fa; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px; display: block; margin-bottom: 4px;">Arquivo Genético:</strong>
                   ${baitLore}
               </div>
   
               <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); padding: 12px; border-radius: 10px; margin-bottom: 15px;">
                   <strong style="color: #fcd34d; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px; display: block; margin-bottom: 8px; display: flex; align-items: center; gap: 5px;"><span style="font-size:1rem;">⚡</span> Mutação Constante</strong>
                   <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; font-family: 'Poppins', sans-serif; color: #cbd5e1;">
                       <div style="background: rgba(0,0,0,0.4); padding: 6px 10px; border-radius: 6px;">🍀 Sorte: <strong style="color:white;">${formatBoost(currentBaitBoostLvl.luck, addedLuck, false, false)}</strong></div>
                       <div style="background: rgba(0,0,0,0.4); padding: 6px 10px; border-radius: 6px;">💎 Lucro: <strong style="color:white;">${formatBoost(currentBaitBoostLvl.value, addedValue, true, false)}</strong></div>
                       <div style="background: rgba(0,0,0,0.4); padding: 6px 10px; border-radius: 6px;">📏 67cm: <strong style="color:white;">${formatBoost(currentBaitBoostLvl.chance67, addedChance67, false, true)}</strong></div>
                       <div style="background: rgba(0,0,0,0.4); padding: 6px 10px; border-radius: 6px;">🚀 Vel.: <strong style="color:white;">${formatBoost(currentBaitBoostLvl.speed, addedSpeed, true, false)}</strong></div>
                   </div>
               </div>
   
               <button id="btn-craft-bait" style="width: 100%; padding: 15px; font-size: 1rem; font-family: 'Fredoka', sans-serif; font-weight: 700; background: ${canCraft ? 'linear-gradient(135deg, #10b981, #059669)' : '#1e293b'}; color: ${canCraft ? 'white' : '#475569'}; border: ${canCraft ? 'none' : '1px solid #334155'}; border-radius: 10px; cursor: ${canCraft ? 'pointer' : 'not-allowed'}; box-shadow: ${canCraft ? '0 8px 15px -5px rgba(16, 185, 129, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)' : 'none'}; text-transform: uppercase; letter-spacing: 1px; transition: all 0.2s;">
                   ${canCraft ? '🧪 Iniciar Sequência' : 'Biomassa Insuficiente'}
               </button>
           </div>
       `;
       
       if (canCraft) {
           const btn = safeGet('btn-craft-bait');
           btn.addEventListener('click', () => {
               Object.keys(activeBaitRecipe.req).forEach(matId => { window.GAME_STATE.materials[matId] -= activeBaitRecipe.req[matId]; });
               
               if (!window.GAME_STATE.baitBoosts[activeBaitRecipe.id]) {
                   window.GAME_STATE.baitBoosts[activeBaitRecipe.id] = { luck: 0, value: 0, chance67: 0, speed: 0 };
               }
               activeBoosts.forEach(bId => {
                   window.GAME_STATE.materials[bId] -= 1;
                   const bData = window.BOOSTS.find(b => b.id === bId);
                   if (window.GAME_STATE.baitBoosts[activeBaitRecipe.id][bData.stat] === undefined) {
                       window.GAME_STATE.baitBoosts[activeBaitRecipe.id][bData.stat] = 0;
                   }
                   window.GAME_STATE.baitBoosts[activeBaitRecipe.id][bData.stat] += bData.val;
               });
   
               window.GAME_STATE.baitInventory[activeBaitRecipe.id] = (window.GAME_STATE.baitInventory[activeBaitRecipe.id] || 0) + activeBaitRecipe.qty;
               
               if(typeof window.saveGame === "function") window.saveGame();
               if(window.showToast) window.showToast("Síntese Concluída", `O Reator processou x${activeBaitRecipe.qty} ${activeBaitRecipe.name} com sucesso.`, "success");
               
               activeBoosts = []; 
               renderBaitLabList();
               renderBaitLabArea(); 
           });
           
           btn.addEventListener('mousedown', function() { this.style.transform = 'translateY(2px)'; this.style.boxShadow = 'none'; });
           btn.addEventListener('mouseup', function() { this.style.transform = 'translateY(0)'; this.style.boxShadow = '0 10px 20px -5px rgba(16, 185, 129, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)'; });
       }
   }
   
   function renderBaitInventory() {
       const inv = safeGet('bait-mat-inventory');
       if (!inv || !window.MATERIALS) return;
       
       // FIX: Renderiza corretamente os extratos do lixo
       let html = `
           <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 15px;">
               <h4 style="margin:0; color:#f8fafc; font-family:'Fredoka'; font-size:1.1rem;">📦 Armazém de Extratos</h4>
               <span style="font-size:0.7rem; color:#64748b; font-weight:600; background: rgba(0,0,0,0.5); padding: 4px 10px; border-radius: 20px;">Recicle lixo no mar.</span>
           </div>
           <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(85px, 1fr)); gap: 12px; margin-bottom: 25px;">
       `;
       
       let hasMats = false;
       const state = window.GAME_STATE || { materials: {} };
       window.MATERIALS.forEach(mat => {
           if (mat.price === 0) {
               const count = state.materials[mat.id] || 0;
               if (count > 0) {
                   hasMats = true;
                   html += `
                       <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 12px 8px; text-align: center; position: relative;">
                           <div style="position: absolute; top: -5px; right: -5px; background: #3b82f6; color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.65rem; font-weight: bold; border: 1px solid rgba(255,255,255,0.1);">x${count}</div>
                           <div style="font-size:2rem; margin-bottom:6px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${mat.icon}</div>
                           <div style="font-size:0.65rem; font-weight:600; line-height:1.2; color:#cbd5e1;">${mat.name}</div>
                       </div>
                   `;
               }
           }
       });
       if (!hasMats) html += `<div style="grid-column: 1/-1; color:#64748b; font-size:0.85rem; text-align: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px;">O armazém está vazio. Pesque sucatas.</div>`;
       html += '</div>';
   
       html += `
           <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid rgba(245, 158, 11, 0.3); padding-bottom: 12px; margin-bottom: 15px;">
               <h4 style="margin:0; color:#fcd34d; font-family:'Fredoka'; font-size:1.1rem;">⚡ Catalisadores</h4>
               <span style="font-size:0.7rem; color:#b45309; font-weight:600; background: rgba(245, 158, 11, 0.1); padding: 4px 10px; border-radius: 20px;">Clique para carregar.</span>
           </div>
           <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px;">
       `;
       
       let hasBoosts = false;
       window.BOOSTS.forEach(bst => {
           const count = state.materials[bst.id] || 0;
           const usedCount = activeBoosts.filter(b => b === bst.id).length;
           const available = count - usedCount;
   
           if (count > 0) {
               hasBoosts = true;
               html += `
                   <div onclick="window.addBoost('${bst.id}')" style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 12px 8px; text-align: center; position: relative; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='rgba(245, 158, 11, 0.15)'; this.style.transform='translateY(-3px)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.05)'; this.style.transform='translateY(0)'">
                       <div style="position: absolute; top: -5px; right: -5px; background: #f59e0b; color: #111; padding: 2px 6px; border-radius: 8px; font-size: 0.65rem; font-weight: 800; border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 2px 5px rgba(0,0,0,0.5);">D: ${available}</div>
                       <div style="font-size:2rem; margin-bottom:6px; filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.6));">${bst.icon}</div>
                       <div style="font-size:0.65rem; font-weight:700; line-height:1.2; color:#fcd34d;">${bst.name}</div>
                   </div>
               `;
           }
       });
       if (!hasBoosts) html += `<div style="grid-column: 1/-1; color:#64748b; font-size:0.85rem; text-align: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px;">Nenhum catalisador comprado.</div>`;
       html += '</div>';
   
       inv.innerHTML = html;
   }
   
   // ==========================================
   // 4. MESA DE MONTAGEM (NOVO DRAG & DROP + DBLCLICK)
   // ==========================================
   function renderWorkbench(tab) {
       const grid = safeGet('workbench-grid'); 
       if(!grid) return; grid.innerHTML = ''; let isEmpty = true;
   
       const createEquipCard = (id, item, isEq, type) => {
           isEmpty = false;
           const color = isEq ? '#3b82f6' : '#475569';
           const bg = isEq ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.6)';
           
           const div = document.createElement('div'); 
           div.className = `draggable-item`; 
           // A propriedade draggable permite agarrar o item no PC
           div.draggable = true; 
           div.dataset.type = type; 
           div.dataset.id = id; 
           div.style = `background: ${bg}; border: 1px solid ${color}; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: grab; transition: 0.2s; position: relative; overflow: hidden; min-height: 90px; user-select: none;`;
           
           div.onmouseover = () => { div.style.transform = 'translateY(-3px)'; div.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)'; if(!isEq) div.style.borderColor = '#94a3b8'; };
           div.onmouseout = () => { div.style.transform = 'translateY(0)'; div.style.boxShadow = 'none'; div.style.borderColor = color; };
   
           let iconHTML = '';
           if (type === 'rod') iconHTML = `<div style="font-size:2.2rem; margin-bottom:8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); pointer-events: none;">🎣</div>`;
           else if (type === 'sinker') iconHTML = `<div style="font-size:2.2rem; margin-bottom:8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); pointer-events: none;">🪨</div>`;
           else if (type === 'hook') iconHTML = `<div style="font-size:2.2rem; margin-bottom:8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); color:${item.color || '#fff'}; pointer-events: none;">🪝</div>`;
           else if (type === 'knife') iconHTML = `<div style="font-size:2.2rem; margin-bottom:8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); pointer-events: none;">🔪</div>`;
           else if (type === 'bait') {
               const count = window.GAME_STATE.baitInventory[id] || 0;
               iconHTML = `<div style="position: absolute; top: 4px; right: 4px; background: #3b82f6; color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.6rem; font-weight: bold; pointer-events: none;">x${count}</div><div style="font-size:2.2rem; margin-bottom:8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); pointer-events: none;">${item.icon}</div>`;
           }
   
           let equippedBadge = '';
           if (isEq) {
               equippedBadge = `<div style="position: absolute; top: 0; left: 0; width: 100%; background: #3b82f6; color: #fff; font-size: 0.55rem; font-weight: 800; padding: 2px 0; text-transform: uppercase; letter-spacing: 1px; text-align: center; pointer-events: none;">Ativo</div>`;
           }
   
           div.innerHTML = `
               ${equippedBadge}
               <div style="margin-top: ${isEq ? '12px' : '0'}; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; pointer-events: none;">
                   ${iconHTML}
                   <div style="font-weight:700; font-size:0.75rem; color:${isEq ? '#f8fafc' : '#cbd5e1'}; font-family:'Poppins', sans-serif; line-height: 1.2; word-wrap: break-word;">${item.name || 'Desconhecido'}</div>
               </div>
           `; 
           
           // EVENTOS DE DRAG NATIVOS
           div.addEventListener('dragstart', handleDragStart); 
           
           // NOVO: SUPORTE PARA CLIQUE DUPLO (Equipa instantaneamente sem precisar arrastar)
           div.addEventListener('dblclick', () => {
               if (!isEq) equipItem(type, id);
           });
   
           grid.appendChild(div); 
       };
   
       grid.style.display = 'grid';
       grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(110px, 1fr))';
       grid.style.gap = '12px';
       grid.style.padding = '20px';
       grid.style.alignContent = 'start';
   
       if (tab === 'rod') {
           if(window.GAME_STATE.ownedRods) window.GAME_STATE.ownedRods.forEach(id => { 
               const item = window.GAME_STATE.rods ? window.GAME_STATE.rods.find(r => r.id === parseInt(id)) : null; 
               if(item) createEquipCard(item.id, item, window.GAME_STATE.currentRodIndex === item.id, 'rod'); 
           });
       } else if (tab === 'sink') {
           if(window.GAME_STATE.ownedSinkers) window.GAME_STATE.ownedSinkers.forEach(id => { const item = window.SINKERS ? window.SINKERS.find(s => s.id === id) : null; if(item) createEquipCard(id, item, window.GAME_STATE.currentSinker === item.id, 'sinker'); });
       } else if (tab === 'hook') {
           if(window.GAME_STATE.ownedHooks) window.GAME_STATE.ownedHooks.forEach(id => { const item = window.HOOKS ? window.HOOKS.find(h => h.id === id) : null; if(item) createEquipCard(id, item, window.GAME_STATE.currentHook === item.id, 'hook'); });
       } else if (tab === 'knife') {
           if(window.GAME_STATE.ownedKnives) window.GAME_STATE.ownedKnives.forEach(id => { const item = window.KNIVES ? window.KNIVES.find(k => k.id === id) : null; if(item) createEquipCard(id, item, window.GAME_STATE.currentKnife === item.id, 'knife'); });
       } else if (tab === 'bait') {
           if(window.GAME_STATE.baitInventory) Object.keys(window.GAME_STATE.baitInventory).forEach(id => { const item = window.BAITS ? window.BAITS.find(b => b.id === id) : null; if(item && window.GAME_STATE.baitInventory[id] > 0) createEquipCard(id, item, window.GAME_STATE.currentBait === item.id, 'bait'); });
       }
   
       if (isEmpty) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #475569; font-family: Poppins; margin-top: 40px; font-size: 1rem;">O arsenal está vazio nesta categoria.</div>';
   }
   
   function updateWorkbenchSlots() {
       const rod = (window.GAME_STATE.rods || []).find(r => r.id === window.GAME_STATE.currentRodIndex) || (window.GAME_STATE.rods ? window.GAME_STATE.rods[0] : {name: 'Nenhuma'});
       safeGet('wb-rod-content').innerHTML = `<span style="color:#f8fafc; font-weight:700;">${rod.name}</span>`;
   
       const sinker = (window.SINKERS || []).find(s => s.id === window.GAME_STATE.currentSinker) || {name: 'Padrão'};
       safeGet('wb-sinker-content').innerHTML = `<span style="color:#f8fafc; font-weight:700;">${sinker.name}</span>`;
   
       const hookId = window.GAME_STATE.currentHook || 'anzol_padrao';
       const hookData = (window.HOOKS || []).find(h => h.id === hookId) || {name: 'Anzol Padrão', color: '#cbd5e1'};
       safeGet('wb-hook-content').innerHTML = `<span style="color:${hookData.color}; font-weight:800; text-shadow: 0 0 10px ${hookData.color}66;">${hookData.name}</span>`;
   
       const knife = (window.KNIVES || []).find(k => k.id === window.GAME_STATE.currentKnife) || {name: 'Nenhuma'};
       safeGet('wb-knife-content').innerHTML = `<span style="color:#f8fafc; font-weight:700;">${knife.name}</span>`;
   
       const baitDisplay = safeGet('wb-bait-content');
       if (window.GAME_STATE.currentBait && window.BAITS) {
           const bait = window.BAITS.find(b => b.id === window.GAME_STATE.currentBait);
           if(bait) baitDisplay.innerHTML = `<span style="color:#4ade80; font-weight:800;">${bait.icon} ${bait.name}</span>`;
       } else {
           if(baitDisplay) baitDisplay.innerHTML = "<span style='color:#64748b;'>Vazio</span>";
       }
   
       document.querySelectorAll('.wb-tab-btn').forEach(btn => {
           btn.style.background = btn.classList.contains('active') ? '#3b82f6' : '#1e293b';
           btn.style.color = btn.classList.contains('active') ? '#fff' : '#94a3b8';
           btn.style.border = 'none';
           btn.style.padding = '10px 20px';
           btn.style.borderRadius = '8px 8px 0 0';
           btn.style.fontFamily = "'Poppins', sans-serif";
           btn.style.fontWeight = '700';
           btn.style.cursor = 'pointer';
           btn.style.transition = '0.2s';
       });
   }
   
   // LÓGICA DE EQUIPAR O ITEM (Usada pelo Drag e pelo Duplo Clique)
   function equipItem(type, id) {
       if (type === 'rod') window.GAME_STATE.currentRodIndex = parseInt(id);
       if (type === 'sinker') window.GAME_STATE.currentSinker = id;
       if (type === 'hook') window.GAME_STATE.currentHook = id;
       if (type === 'knife') window.GAME_STATE.currentKnife = id;
       if (type === 'bait') window.GAME_STATE.currentBait = id;
       
       updateWorkbenchSlots();
       renderWorkbench(type); // O "tab" é igual ao tipo de item
   
       if(typeof window.updateUI === "function") window.updateUI(); 
       if(typeof window.saveGame === "function") window.saveGame();
       if(window.showToast) window.showToast("Equipamento Vinculado", "A sua configuração tática foi atualizada.", "success");
   }
   
   let draggedItem = null;
   
   function handleDragStart(e) { 
       draggedItem = { type: e.currentTarget.dataset.type, id: e.currentTarget.dataset.id }; 
       e.dataTransfer.setData('text/plain', ''); 
       e.currentTarget.style.opacity = '0.4'; 
   }
   
   // FIX: A query agora pesquisa exatamente pela classe .dropzone (independente do nome do div no HTML)
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