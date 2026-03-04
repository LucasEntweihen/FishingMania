/* ==========================================================================
   SISTEMA DE CLIMA E EVENTOS MÍSTICOS (O MOTOR DO MUNDO)
   ========================================================================== */

// Variáveis Globais que o script.js lê
window.currentEventID = null;
window.eventLuckMult = 0;
window.eventValueMult = 1;
window.eventCastTimeMult = 1;
window.eventBgSpeedMult = 1;

// O Catálogo de Eventos do Jogo
const GAME_EVENTS = {
    'tempestade': {
        id: 'tempestade',
        name: 'Tempestade Noturna',
        icon: '⛈️',
        color: '#2c3e50',
        desc: 'Águas muito agitadas! Peixes das profundezas sobem à superfície. (Tempo de pesca mais lento, mas atrai Lendas)',
        duration: 120000, // Duração: 2 minutos
        luckMult: 1.5,    // +150% Sorte
        valueMult: 1,
        castTimeMult: 1.5, // Linha desce 50% mais devagar por causa da correnteza
        bgSpeedMult: 3.0,  // Peixes do fundo nadam muito rápido
        startMsg: "O céu escureceu e os ventos uivam! Uma Tempestade aproxima-se!",
        effectCSS: 'background: rgba(44, 62, 80, 0.4); mix-blend-mode: multiply;'
    },
    'ouro': {
        id: 'ouro',
        name: 'Maré Dourada',
        icon: '✨',
        color: '#f1c40f',
        desc: 'O plâncton dourado reflete a luz! Todos os peixes capturados valem o DOBRO.',
        duration: 90000, // Duração: 1.5 minutos
        luckMult: 0,
        valueMult: 2.0,   // Tudo vale 2x mais moedas
        castTimeMult: 1,
        bgSpeedMult: 1.0,
        startMsg: "As águas estão a brilhar intensamente! A Maré Dourada começou!",
        effectCSS: 'background: rgba(241, 196, 15, 0.15); mix-blend-mode: overlay;'
    },
    'frenesi': {
        id: 'frenesi',
        name: 'Frenesi Alimentar',
        icon: '🦈',
        color: '#e74c3c',
        desc: 'Os peixes estão desesperados por comida! A velocidade da sua linha é 3x mais rápida.',
        duration: 60000, // Duração: 1 minuto
        luckMult: -0.2,  // Pequena penalidade de sorte (vêm muitos comuns juntos)
        valueMult: 1,
        castTimeMult: 0.33, // Linha cai 3x mais rápido
        bgSpeedMult: 4.0,
        startMsg: "A água está a ferver com barbatanas! Frenesi Alimentar detetado!",
        effectCSS: 'background: rgba(231, 76, 60, 0.1); mix-blend-mode: color-burn;'
    },
    'misticismo': {
        id: 'misticismo',
        name: 'Nevoeiro Místico',
        icon: '🔮',
        color: '#8e44ad',
        desc: 'Entidades esquecidas acordam. Bônus ABSURDO de Raros, Divinos e Aurudos!',
        duration: 100000, // Duração: 1m 40s
        luckMult: 6.0,    // +600% Sorte (Ignora limites)
        valueMult: 1.5,   // +50% Valor
        castTimeMult: 0.8,
        bgSpeedMult: 0.5, // Fundo fica assustadoramente devagar
        startMsg: "Um nevoeiro roxo e espesso cobre o Cais... As lendas despertaram.",
        effectCSS: 'background: rgba(142, 68, 173, 0.2); backdrop-filter: blur(3px);'
    }
};

// Constrói a UI para o jogador ver que evento está a ocorrer
function createEventUI() {
    const topBar = document.querySelector('.left-group');
    if (!topBar) return;
    
    // Crachá do Evento (Fica invisível até um evento começar)
    const badge = document.createElement('div');
    badge.id = 'event-indicator';
    badge.className = 'badge hidden';
    badge.style.cssText = 'transition: all 0.5s; cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.5); border: 2px solid white; box-shadow: 0 0 10px rgba(255,255,255,0.4); margin-left: 10px;';
    
    // Se clicar no crachá, abre um Toast a explicar o evento
    badge.addEventListener('click', () => {
        if (window.currentEventID && GAME_EVENTS[window.currentEventID]) {
            const ev = GAME_EVENTS[window.currentEventID];
            if(window.showToast) window.showToast(ev.name, ev.desc, "info");
        }
    });

    topBar.appendChild(badge);

    // Filtro visual para a tela (Chuva, Nevoeiro, etc)
    const overlay = document.createElement('div');
    overlay.id = 'event-overlay-fx';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; opacity: 0; transition: opacity 3s ease-in-out; pointer-events: none;';
    
    // Insere o overlay atrás dos modais, mas à frente do mar
    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) {
        document.getElementById('game-container').insertBefore(overlay, uiLayer);
    } else {
        document.body.appendChild(overlay);
    }
}

// Lança um evento aleatório
function triggerRandomEvent() {
    if (window.currentEventID) return; // Não sobrepõe eventos

    const eventKeys = Object.keys(GAME_EVENTS);
    const randomKey = eventKeys[Math.floor(Math.random() * eventKeys.length)];
    startEvent(randomKey);
}

// Inicia um evento específico
function startEvent(eventID) {
    const ev = GAME_EVENTS[eventID];
    if (!ev) return;

    window.currentEventID = ev.id;
    window.eventLuckMult = ev.luckMult;
    window.eventValueMult = ev.valueMult;
    window.eventCastTimeMult = ev.castTimeMult;
    window.eventBgSpeedMult = ev.bgSpeedMult;

    // Atualiza a Interface Superior
    const badge = document.getElementById('event-indicator');
    if (badge) {
        badge.innerHTML = `${ev.icon} ${ev.name}`;
        badge.style.background = ev.color;
        badge.classList.remove('hidden');
    }

    // Aplica o Efeito Visual no Ecrã Inteiro
    const overlay = document.getElementById('event-overlay-fx');
    if (overlay) {
        overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; opacity: 1; transition: opacity 3s ease-in-out; pointer-events: none; ${ev.effectCSS}`;
    }

    // Dispara a Notificação Épica!
    if(window.showToast) window.showToast("⚠️ Alerta Climático", ev.startMsg, "warning");

    // Agenda o fim do evento
    setTimeout(() => {
        endEvent();
    }, ev.duration);
}

// Finaliza o evento atual
function endEvent() {
    if (!window.currentEventID) return;
    const ev = GAME_EVENTS[window.currentEventID];
    
    // Reseta as variáveis para o script.js
    window.currentEventID = null;
    window.eventLuckMult = 0;
    window.eventValueMult = 1;
    window.eventCastTimeMult = 1;
    window.eventBgSpeedMult = 1;

    // Esconde a Interface
    const badge = document.getElementById('event-indicator');
    if (badge) badge.classList.add('hidden');

    // Desvanece o Efeito Visual
    const overlay = document.getElementById('event-overlay-fx');
    if (overlay) overlay.style.opacity = '0';

    // Notifica que o clima acalmou
    if(window.showToast) window.showToast("Clima Normalizado", `O evento ${ev.name} chegou ao fim. As marés acalmaram.`, "info");
}

// ==========================================
// INICIALIZAÇÃO E LOOP DE TEMPO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    createEventUI();
    
    // O Loop Principal: A cada 2 minutos (120000ms), há 25% de chance de um evento natural acontecer
    setInterval(() => {
        if (!window.currentEventID && Math.random() < 0.25) {
            triggerRandomEvent();
        }
    }, 120000); 

    // --- CÓDIGOS DE ADMINISTRAÇÃO (TESTE RÁPIDO) ---
    // Você pode abrir o "Inspecionar Elemento > Console" e digitar:
    // forceEvent('ouro')
    // stopEvent()
    window.forceEvent = startEvent;
    window.stopEvent = endEvent;
});