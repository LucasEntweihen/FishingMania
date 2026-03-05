/* ==========================================================================
   PAINEL DE MESTRE (GOD MODE / ADMIN CHEATS) - MÓDULO FIREBASE
   Ativação: Pressione Shift + M
   ========================================================================== */

   import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
   import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
   
   function initAdminPanel() {
       if (document.getElementById('admin-modal')) return;
   
       const style = document.createElement('style');
       style.innerHTML = `
           #admin-modal {
               position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
               background: rgba(0, 0, 0, 0.9); z-index: 99999999;
               display: none; justify-content: center; align-items: center;
               backdrop-filter: blur(15px); font-family: 'Poppins', sans-serif;
           }
           #admin-modal.active { display: flex; animation: fadeIn 0.3s ease; }
           .admin-content {
               background: #09090b; width: 95%; max-width: 800px;
               border: 2px solid #ef4444; border-radius: 20px; padding: 30px;
               box-shadow: 0 0 50px rgba(239, 68, 68, 0.3); max-height: 85vh; overflow-y: auto;
           }
           .admin-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3f3f46; padding-bottom: 15px; margin-bottom: 20px; }
           .admin-header h2 { color: #ef4444; font-family: 'Fredoka'; margin: 0; font-size: 2rem; text-shadow: 0 0 10px rgba(239,68,68,0.5); }
           .admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
           .admin-box { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; }
           .admin-box h3 { color: #fca5a5; font-family: 'Fredoka'; margin-top: 0; margin-bottom: 15px; }
           .admin-btn {
               display: block; width: 100%; background: #27272a; color: #f8fafc; border: 1px solid #ef4444; border-radius: 8px; padding: 10px; margin-bottom: 10px; font-weight: bold; cursor: pointer; transition: 0.2s; font-family: 'Poppins';
           }
           .admin-btn:hover { background: #ef4444; color: white; transform: scale(1.02); }
           .admin-btn.blue { border-color: #3b82f6; } .admin-btn.blue:hover { background: #3b82f6; }
           .admin-btn.gold { border-color: #fbbf24; } .admin-btn.gold:hover { background: #fbbf24; color: #000; }
           .admin-btn.green { border-color: #10b981; } .admin-btn.green:hover { background: #10b981; }
       `;
       document.head.appendChild(style);
   
       const modal = document.createElement('div');
       modal.id = 'admin-modal';
       modal.innerHTML = `
           <div class="admin-content custom-scrollbar">
               <div class="admin-header">
                   <h2>👑 Painel do Mestre (Dev)</h2>
                   <button id="close-admin-btn" style="background:none; border:none; color:white; font-size:2rem; cursor:pointer;">&times;</button>
               </div>
               <div class="admin-grid">
                   <div class="admin-box">
                       <h3>💰 Economia Divina</h3>
                       <button class="admin-btn gold" onclick="window.adminAddCoins(1000000)">+ 1.000.000 Cat Coins</button>
                       <button class="admin-btn gold" onclick="window.adminAddCoins(1000000000)">+ 1 Bilhão (Infinito)</button>
                       <button class="admin-btn green" onclick="window.adminUnlockFeatures()">Desbloquear Sushi/Features</button>
                   </div>
                   <div class="admin-box">
                       <h3>📦 Estoque Absoluto</h3>
                       <button class="admin-btn" onclick="window.adminAddAllMaterials(1000)">+ 1.000 de TODOS os Materiais</button>
                       <button class="admin-btn" onclick="window.adminAddAllBoosts(500)">+ 500 de TODOS os Catalisadores</button>
                       <button class="admin-btn" onclick="window.adminAddAllScrap(100)">+ 100 de CADA Sucata (Lixo)</button>
                   </div>
                   <div class="admin-box">
                       <h3>🐟 Aquário Mestre</h3>
                       <button class="admin-btn blue" onclick="window.adminAddAllFishes(10, false)">+ 10 de CADA Peixe (Normal)</button>
                       <button class="admin-btn blue" onclick="window.adminAddAllFishes(5, true)">+ 5 de CADA Peixe (Troféu 67cm)</button>
                       <button class="admin-btn blue" onclick="window.adminAddAllOrbs(10)">+ 10 Orbes de Cada Ritual</button>
                   </div>
                   <div class="admin-box">
                       <h3>🌪️ Controle Climático</h3>
                       <button class="admin-btn" onclick="window.adminForceEvent('tempestade')">Forçar: Tempestade ⛈️</button>
                       <button class="admin-btn gold" onclick="window.adminForceEvent('ouro')">Forçar: Maré Dourada ✨</button>
                       <button class="admin-btn" onclick="window.adminForceEvent('frenesi')">Forçar: Frenesi 🦈</button>
                       <button class="admin-btn" style="border-color:#a855f7;" onmouseover="this.style.background='#a855f7'" onmouseout="this.style.background='#27272a'" onclick="window.adminForceEvent('misticismo')">Forçar: Nevoeiro Místico 🔮</button>
                       <button class="admin-btn" style="border-color:#10b981;" onmouseover="this.style.background='#10b981'" onmouseout="this.style.background='#27272a'" onclick="window.adminForceEvent('abismo_lixo')">Forçar: Abismo (Vândalo) 🗑️</button>
                       <button class="admin-btn" style="border-color:#7f1d1d;" onmouseover="this.style.background='#7f1d1d'" onmouseout="this.style.background='#27272a'" onclick="window.adminForceEvent('mar_bestas')">Forçar: Mar das Bestas 🐙</button>
                       <button class="admin-btn green" onclick="window.adminStopEvent()">☀️ Parar Evento Atual</button>
                   </div>
               </div>
           </div>
       `;
       document.body.appendChild(modal);
   
       document.getElementById('close-admin-btn').addEventListener('click', () => {
           modal.classList.remove('active');
       });
   }
   
   // DECLARAÇÃO GLOBAL DE FUNÇÕES (Para os botões do HTML conseguirem chamar)
   window.adminAddCoins = function(amount) { if(!window.GAME_STATE) return; window.GAME_STATE.coins += amount; window.updateUI(); window.saveGame(); if(window.showToast) window.showToast("Deus da Riqueza", `+ ${amount.toLocaleString()} moedas adicionadas.`, "success"); }
   window.adminUnlockFeatures = function() { if(!window.GAME_STATE) return; window.GAME_STATE.sushiUnlocked = true; window.updateUI(); window.saveGame(); if(window.showToast) window.showToast("Features Livres", `Restaurante e funcionalidades desbloqueadas!`, "success"); }
   window.adminAddAllMaterials = function(qty) { if(!window.GAME_STATE || !window.MATERIALS) return; if(!window.GAME_STATE.materials) window.GAME_STATE.materials = {}; window.MATERIALS.forEach(mat => { if(mat.price > 0) window.GAME_STATE.materials[mat.id] = (window.GAME_STATE.materials[mat.id] || 0) + qty; }); window.saveGame(); if(window.renderShop) window.renderShop(); if(window.showToast) window.showToast("Estoque Cheio", `+${qty} de todas as matérias primas!`, "success"); }
   window.adminAddAllBoosts = function(qty) { if(!window.GAME_STATE || !window.BOOSTS) return; if(!window.GAME_STATE.materials) window.GAME_STATE.materials = {}; window.BOOSTS.forEach(bst => { window.GAME_STATE.materials[bst.id] = (window.GAME_STATE.materials[bst.id] || 0) + qty; }); window.saveGame(); if(window.renderBaitInventory) window.renderBaitInventory(); if(window.showToast) window.showToast("Química Pura", `+${qty} de todos os Catalisadores!`, "success"); }
   window.adminAddAllScrap = function(qty) { if(!window.GAME_STATE || !window.SUCATAS) return; if(!window.GAME_STATE.scrapCollection) window.GAME_STATE.scrapCollection = {}; if(!window.GAME_STATE.materials) window.GAME_STATE.materials = {}; window.SUCATAS.forEach(scrap => { window.GAME_STATE.scrapCollection[scrap.id] = (window.GAME_STATE.scrapCollection[scrap.id] || 0) + qty; window.GAME_STATE.materials[scrap.matReward] = (window.GAME_STATE.materials[scrap.matReward] || 0) + qty; }); window.saveGame(); if(window.renderScrapCollection) window.renderScrapCollection(); if(window.showToast) window.showToast("Lixeiro Mestre", `Sucatas e extratos injetados!`, "success"); }
   window.adminAddAllFishes = function(qty, is67) { if(!window.GAME_STATE || !window.RARITIES) return; const targetCollection = is67 ? 'collection67' : 'collection'; if(!window.GAME_STATE[targetCollection]) window.GAME_STATE[targetCollection] = {}; Object.values(window.RARITIES).forEach(rarity => { rarity.variations.forEach(fish => { window.GAME_STATE[targetCollection][fish.name] = (window.GAME_STATE[targetCollection][fish.name] || 0) + qty; }); }); window.saveGame(); if(is67 && window.renderCollection67) window.renderCollection67(); if(!is67 && window.renderCollection) window.renderCollection(); if(window.showToast) window.showToast("Oceanógrafo", `+${qty} de todos os peixes adicionados!`, "success"); }
   window.adminAddAllOrbs = function(qty) { if(!window.GAME_STATE) return; if(!window.GAME_STATE.orbs) window.GAME_STATE.orbs = {}; const ritualIds = ['ritual_tempestade', 'ritual_ouro', 'ritual_frenesi', 'ritual_misticismo', 'ritual_abismo', 'ritual_bestas']; ritualIds.forEach(id => { window.GAME_STATE.orbs[id] = (window.GAME_STATE.orbs[id] || 0) + qty; }); window.saveGame(); if(typeof window.renderOrbs === 'function') window.renderOrbs(); if(window.showToast) window.showToast("Magia Negra", `+${qty} de todos os Orbes!`, "success"); }
   window.adminForceEvent = function(eventId) { if(window.forceEvent) { window.forceEvent(eventId); document.getElementById('admin-modal').classList.remove('active'); } }
   window.adminStopEvent = function() { if(window.stopEvent) { window.stopEvent(); document.getElementById('admin-modal').classList.remove('active'); } }
   
   // GATILHO E SEGURANÇA
   function verifyAdminAndOpen() {
       try {
           const auth = getAuth();
           const user = auth.currentUser;
   
           if (!user) {
               if (window.showToast) window.showToast("Acesso Negado", "Você precisa estar conectado à nuvem para ter permissões.", "error");
               return;
           }
   
           const db = getDatabase();
           get(child(ref(db), `admins/${user.uid}`)).then((snapshot) => {
               if (snapshot.exists() && snapshot.val() === true) {
                   initAdminPanel();
                   const modal = document.getElementById('admin-modal');
                   if (modal) {
                       if (modal.classList.contains('active')) modal.classList.remove('active');
                       else modal.classList.add('active');
                   }
               } else {
                   if (window.showToast) window.showToast("Acesso Negado", "Apenas o Mestre do Abismo pode invocar este painel.", "error");
               }
           }).catch((error) => {
               console.error("Erro de segurança:", error);
           });
       } catch(e) {
           console.error("Erro ao verificar Admin:", e);
       }
   }
   
   document.addEventListener('keydown', (e) => {
       if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
       if (e.shiftKey && (e.key === 'm' || e.key === 'M')) {
           e.preventDefault();
           verifyAdminAndOpen();
       }
   });