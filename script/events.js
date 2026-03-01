/* ==========================================================================
   SISTEMA DE EVENTOS E BIOMAS V2 (LEVE E OTIMIZADO)
   ========================================================================== */

const EVENT_CONFIG = {
    checkInterval: 60000, // Tenta puxar um evento a cada 1 minuto
    chance: 0.35,         // 35% de chance de rolar um evento
    duration: 75000       // Duração do evento: 1 minuto e 15 segundos
};

let currentEvent = null;
window.currentEventID = null; // Variável global para o script.js ler o evento atual

// 1. Criação da Película de Clima (Leve, sem filtros que travam o PC)
const overlay = document.createElement('div');
overlay.id = "event-overlay";
overlay.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:2; transition: background 2.5s ease, opacity 2.5s ease; opacity: 0;";
document.getElementById('game-container').appendChild(overlay);

// 2. Criação do Alerta de Tela (Toast Moderno)
const eventAlert = document.createElement('div');
eventAlert.id = "event-toast";
eventAlert.style.cssText = "position:fixed; top:90px; left:50%; transform:translateX(-50%) translateY(-20px); padding:10px 25px; border-radius:20px; color:white; font-weight:800; z-index:1000; font-family:'Fredoka', sans-serif; pointer-events:none; transition:all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity:0; text-shadow:0 2px 4px rgba(0,0,0,0.5); font-size:1.1rem; text-align:center; box-shadow:0 10px 20px rgba(0,0,0,0.2);";
document.body.appendChild(eventAlert);

function showEventMessage(title, subtitle, bgColor) {
    eventAlert.style.background = bgColor;
    eventAlert.innerHTML = `<div style="font-size:1.4rem; margin-bottom:2px;">${title}</div><div style="font-size:0.85rem; font-weight:500; opacity:0.95;">${subtitle}</div>`;
    eventAlert.style.opacity = '1';
    eventAlert.style.transform = 'translateX(-50%) translateY(0)';
    
    // Esconde o aviso depois de 6 segundos
    setTimeout(() => {
        eventAlert.style.opacity = '0';
        eventAlert.style.transform = 'translateX(-50%) translateY(-20px)';
    }, 6000);
}

// 3. Catálogo de Eventos
const EVENTS = {
    frenesi: {
        id: "frenesi",
        start: () => {
            window.eventCastTimeMult = 0.4;  // Linha desce absurdamente rápido
            window.eventBgSpeedMult = 2.0;   // Peixes de fundo mais rápidos
            overlay.style.background = "radial-gradient(circle, rgba(255,255,255,0) 40%, rgba(41, 128, 185, 0.3) 100%)"; // Azul bebê suave
            overlay.style.opacity = '1';
            showEventMessage("🐟 Frenesi Alimentar!", "Os peixes estão agitados. A linha desce super rápido!", "linear-gradient(135deg, #2980b9, #6dd5ed)");
        }
    },
    ouro: {
        id: "ouro",
        start: () => {
            window.eventValueMult = 3.0;     // Lucro x3
            window.eventLuckMult = 10;       // Equivalente a +1000 de Sorte Extra
            overlay.style.background = "radial-gradient(circle, rgba(255,255,255,0) 30%, rgba(241, 196, 15, 0.25) 100%)"; // Dourado suave nas bordas
            overlay.style.opacity = '1';
            showEventMessage("✨ Maré Dourada!", "As águas brilham. O lucro de venda de qualquer peixe foi triplicado!", "linear-gradient(135deg, #f39c12, #f1c40f)");
        }
    },
    tempestade: {
        id: "tempestade",
        start: () => {
            window.eventLuckMult = 50;       // Equivalente a +5000 de Sorte
            window.eventCastTimeMult = 1.3;  // Água pesada, linha demora um pouco mais
            overlay.style.background = "linear-gradient(to bottom, rgba(44, 62, 80, 0.4) 0%, rgba(0,0,0,0.3) 100%)"; // Escurecimento suave do céu ao fundo
            overlay.style.opacity = '1';
            showEventMessage("⛈️ Tempestade Sombria!", "O clima fechou. O mar revolto atrai aberrações e lendas das profundezas.", "linear-gradient(135deg, #34495e, #2c3e50)");
        }
    },
    misticismo: {
        id: "misticismo",
        start: () => {
            window.eventLuckMult = 150;      // Equivalente a +15000 de Sorte
            window.eventBgSpeedMult = 0.5;   // Peixes nadam bem devagarzinho
            overlay.style.background = "radial-gradient(circle, rgba(255,255,255,0) 20%, rgba(155, 89, 182, 0.25) 100%)"; // Roxo místico
            overlay.style.opacity = '1';
            showEventMessage("🌌 Brisa Mística!", "Uma aura mágica paira no ar. As lendas despertaram...", "linear-gradient(135deg, #8e44ad, #9b59b6)");
        }
    }
};

function clearEvent() {
    if (!currentEvent) return;
    
    // Reseta todos os modificadores
    window.eventLuckMult = null;
    window.eventCastTimeMult = null;
    window.eventValueMult = null;
    window.eventBgSpeedMult = null;
    window.currentEventID = null;
    
    // Desvanece a película visual
    overlay.style.opacity = '0';
    
    // Volta a plaquinha de tempo para Dia/Noite
    const ti = document.getElementById('time-indicator');
    if (ti) ti.innerText = window.GAME_STATE && window.GAME_STATE.isDay ? "☀️ Dia" : "🌙 Noite";
    
    currentEvent = null;
}

function processEvents() {
    if (currentEvent) return; 

    if (Math.random() < EVENT_CONFIG.chance) {
        const keys = Object.keys(EVENTS);
        const eventKey = keys[Math.floor(Math.random() * keys.length)];
        
        const event = EVENTS[eventKey];
        currentEvent = eventKey;
        window.currentEventID = event.id; // Marca globalmente o evento ativo
        
        event.start();

        // Altera a plaquinha de tempo superior
        const ti = document.getElementById('time-indicator');
        if (ti) {
            let emoji = "✨";
            if(eventKey==='frenesi') emoji="🐟";
            if(eventKey==='tempestade') emoji="⛈️";
            if(eventKey==='misticismo') emoji="🌌";
            ti.innerText = `${emoji} Evento Ativo`;
        }

        // Agenda o fim do evento
        setTimeout(clearEvent, EVENT_CONFIG.duration);
    }
}

// Inicia os loops
setInterval(processEvents, EVENT_CONFIG.checkInterval);
setTimeout(processEvents, 15000); // Força uma tentativa de evento 15 segundos após abrir o jogo