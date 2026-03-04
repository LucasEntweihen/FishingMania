/* ==========================================================================
   SISTEMA DE CLIMA E EVENTOS MÍSTICOS (INTEGRAÇÃO COM RITUAIS)
   ========================================================================== */

   window.currentEventID = null;
   window.eventLuckMult = 0;
   window.eventValueMult = 1;
   window.eventCastTimeMult = 1;
   window.eventBgSpeedMult = 1;
   
   let activeEventTimer = null; // Previne conflitos e bugs ao usar Orbes
   
   const GAME_EVENTS = {
       'tempestade': {
           id: 'tempestade', name: 'Tempestade Noturna', icon: '⛈️', color: '#3b82f6',
           desc: 'Águas agitadas! Peixes profundos sobem. A linha cai mais devagar.',
           duration: 120000, luckMult: 1.5, valueMult: 1, castTimeMult: 1.5, bgSpeedMult: 3.0,
           startMsg: "O céu escureceu e os ventos uivam! Uma Tempestade aproxima-se!",
           effectCSS: 'background: rgba(15, 23, 42, 0.6); mix-blend-mode: multiply;'
       },
       'ouro': {
           id: 'ouro', name: 'Maré Dourada', icon: '✨', color: '#fbbf24',
           desc: 'O plâncton dourado reflete a luz! Todos os peixes capturados valem o DOBRO.',
           duration: 90000, luckMult: 0, valueMult: 2.0, castTimeMult: 1, bgSpeedMult: 1.0,
           startMsg: "As águas estão a brilhar intensamente! A Maré Dourada começou!",
           effectCSS: 'background: rgba(251, 191, 36, 0.15); mix-blend-mode: overlay;'
       },
       'frenesi': {
           id: 'frenesi', name: 'Frenesi Alimentar', icon: '🦈', color: '#ef4444',
           desc: 'Os peixes estão desesperados por comida! Velocidade da linha 3x mais rápida.',
           duration: 60000, luckMult: -0.2, valueMult: 1, castTimeMult: 0.33, bgSpeedMult: 4.0,
           startMsg: "A água está a ferver com barbatanas! Frenesi Alimentar detetado!",
           effectCSS: 'background: rgba(239, 68, 68, 0.15); mix-blend-mode: color-burn;'
       },
       'misticismo': {
           id: 'misticismo', name: 'Nevoeiro Místico', icon: '🔮', color: '#a855f7',
           desc: 'Entidades esquecidas acordam. Bónus ABSURDO de Raros, Divinos e Aurudos!',
           duration: 100000, luckMult: 6.0, valueMult: 1.5, castTimeMult: 0.8, bgSpeedMult: 0.5,
           startMsg: "Um nevoeiro roxo e espesso cobre o Cais... As lendas despertaram.",
           effectCSS: 'background: rgba(168, 85, 247, 0.2); backdrop-filter: blur(4px);'
       },
       'mar_bestas': {
           id: 'mar_bestas', name: 'Mar das Bestas', icon: '🐙', color: '#7f1d1d',
           desc: 'As lendas sombrias emergem. Reduz comuns, chance brutal de Bestiais!',
           duration: 180000, luckMult: 10.0, valueMult: 3.0, castTimeMult: 2.0, bgSpeedMult: 0.2,
           startMsg: "O oceano ruge e o fundo treme... O Mar das Bestas começou!",
           effectCSS: 'background: rgba(127, 29, 29, 0.4); mix-blend-mode: multiply; filter: contrast(1.2);'
       }
   };
   
   function createEventUI() {
       const topBar = document.querySelector('.left-group');
       if (!topBar) return;
       
       const badge = document.createElement('div');
       badge.id = 'event-indicator';
       badge.className = 'badge hidden';
       badge.style.cssText = 'transition: all 0.5s; cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.5); border: 2px solid white; box-shadow: 0 0 10px rgba(255,255,255,0.4); margin-left: 10px; border-radius: 25px; font-family: "Poppins", sans-serif; font-weight: bold;';
       
       badge.addEventListener('click', () => {
           if (window.currentEventID && GAME_EVENTS[window.currentEventID]) {
               const ev = GAME_EVENTS[window.currentEventID];
               if(window.showToast) window.showToast(ev.name, ev.desc, "info");
           }
       });
       topBar.appendChild(badge);
   
       const overlay = document.createElement('div');
       overlay.id = 'event-overlay-fx';
       overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; opacity: 0; transition: opacity 3s ease-in-out; pointer-events: none;';
       
       const uiLayer = document.getElementById('ui-layer');
       if (uiLayer) document.getElementById('game-container').insertBefore(overlay, uiLayer);
       else document.body.appendChild(overlay);
   }
   
   function triggerRandomEvent() {
       if (window.currentEventID) return; 
   
       const eventKeys = Object.keys(GAME_EVENTS);
       let randomKey = eventKeys[Math.floor(Math.random() * eventKeys.length)];
       
       // O Mar das Bestas só tem 15% de chance de acontecer naturalmente. 
       // Em 85% das vezes, o jogo "muda de ideias" e joga um evento normal.
       if (randomKey === 'mar_bestas' && Math.random() > 0.15) { 
           const normalEvents = eventKeys.filter(k => k !== 'mar_bestas');
           randomKey = normalEvents[Math.floor(Math.random() * normalEvents.length)];
       }
   
       startEvent(randomKey);
   }
   
   function startEvent(eventID) {
       const ev = GAME_EVENTS[eventID];
       if (!ev) return;
   
       // Se já estiver a decorrer um evento (ou um Orbe foi ativado em cima de outro), limpa tudo primeiro!
       if (window.currentEventID) {
           endEvent(true); 
       }
   
       window.currentEventID = ev.id;
       window.eventLuckMult = ev.luckMult;
       window.eventValueMult = ev.valueMult;
       window.eventCastTimeMult = ev.castTimeMult;
       window.eventBgSpeedMult = ev.bgSpeedMult;
   
       const badge = document.getElementById('event-indicator');
       if (badge) {
           badge.innerHTML = `${ev.icon} ${ev.name}`;
           badge.style.background = ev.color;
           badge.classList.remove('hidden');
       }
   
       const overlay = document.getElementById('event-overlay-fx');
       if (overlay) {
           overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; opacity: 1; transition: opacity 3s ease-in-out; pointer-events: none; ${ev.effectCSS}`;
       }
   
       if(window.showToast) window.showToast("⚠️ Alerta Climático", ev.startMsg, "warning");
       
       // O Timer é gravado numa variável para não criar "fantasmas"
       activeEventTimer = setTimeout(() => { 
           endEvent(false); 
       }, ev.duration);
   }
   
   function endEvent(silent = false) {
       if (!window.currentEventID) return;
       
       // Se a função foi chamada, o timer é destruído para evitar cortes abruptos no futuro
       if (activeEventTimer) {
           clearTimeout(activeEventTimer);
           activeEventTimer = null;
       }
   
       const ev = GAME_EVENTS[window.currentEventID];
       
       window.currentEventID = null; 
       window.eventLuckMult = 0; 
       window.eventValueMult = 1; 
       window.eventCastTimeMult = 1; 
       window.eventBgSpeedMult = 1;
   
       const badge = document.getElementById('event-indicator');
       if (badge) badge.classList.add('hidden');
   
       const overlay = document.getElementById('event-overlay-fx');
       if (overlay) overlay.style.opacity = '0';
   
       if(!silent && window.showToast) {
           window.showToast("Clima Normalizado", `O evento ${ev.name} chegou ao fim. As águas acalmaram.`, "info");
       }
   }
   
   document.addEventListener('DOMContentLoaded', () => {
       createEventUI();
       
       // A cada 2 minutos tenta spawnar um evento natural (25% de chance)
       setInterval(() => {
           if (!window.currentEventID && Math.random() < 0.25) {
               triggerRandomEvent();
           }
       }, 120000); 
   
       // Expõe as funções globalmente para o `rituals.js` poder ativá-las via Orbes
       window.forceEvent = startEvent;
       window.stopEvent = () => endEvent(false);
   });