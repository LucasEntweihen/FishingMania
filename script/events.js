/* ==========================================
   SISTEMA DE EVENTOS E BIOMAS - GATO PESCADOR
   ========================================== */

   const EVENT_CONFIG = {
    checkInterval: 60000, // Checa a cada 1 minuto
    chance: 0.35,         // 35% de chance de rolar um evento
    duration: 60000       // Duração: 1 minuto
};

let currentEvent = null;

// Elemento visual para avisar o jogador (Toast Grande)
const eventAlert = document.createElement('div');
eventAlert.id = "event-toast";
document.body.appendChild(eventAlert);

// CSS dinâmico para os biomas e alertas
const style = document.createElement('style');
style.innerHTML = `
    #event-toast {
        position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
        padding: 12px 30px; border-radius: 30px; color: white; font-weight: 800;
        z-index: 1000; font-family: 'Fredoka', sans-serif; pointer-events: none;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity: 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5); font-size: 1.1rem; text-align: center;
    }
    #event-toast.active { opacity: 1; top: 100px; }
    
    /* Cores dos Toasts */
    .toast-seca { background: #d35400; border: 2px solid #e67e22; box-shadow: 0 0 20px #d35400; }
    .toast-abissal { background: #4a235a; border: 2px solid #8e44ad; box-shadow: 0 0 20px #8e44ad; }
    .toast-inverno { background: #154360; border: 2px solid #2980b9; box-shadow: 0 0 20px #2980b9; }
    .toast-ouro { background: #f39c12; border: 2px solid #f1c40f; box-shadow: 0 0 25px #f1c40f; color: #5c3a00 !important; }
    .toast-tempestade { background: #2c3e50; border: 2px solid #7f8c8d; box-shadow: 0 0 20px #2c3e50; }

    /* Filtros Visuais no Container do Jogo (Biomas) */
    .biome-seca { filter: sepia(0.8) hue-rotate(-15deg) brightness(0.9); transition: filter 2s; }
    .biome-abissal { filter: hue-rotate(250deg) saturate(1.5) brightness(0.7) contrast(1.2); transition: filter 3s; }
    .biome-inverno { filter: hue-rotate(180deg) saturate(0.5) brightness(1.2); transition: filter 2s; }
    .biome-ouro { filter: sepia(0.5) hue-rotate(10deg) brightness(1.1) saturate(1.5); transition: filter 2s; }
    .biome-tempestade { filter: grayscale(0.6) brightness(0.6) contrast(1.3); transition: filter 1s; }
`;
document.head.appendChild(style);

function showEventMessage(title, desc, className) {
    eventAlert.innerHTML = `${title}<br><span style="font-size: 0.8rem; font-weight: 600; opacity: 0.9;">${desc}</span>`;
    eventAlert.className = 'active ' + className;
    setTimeout(() => { eventAlert.classList.remove('active'); }, 6000);
}

// --- CRIANDO O NOVO INDICADOR DE CLIMA ---
let weatherBadge = null;

function setupWeatherBadge() {
    const timeIndicator = document.getElementById('time-indicator');
    // Só cria se o indicador de tempo já existir e a placa de clima ainda não
    if (timeIndicator && !document.getElementById('weather-indicator')) {
        weatherBadge = document.createElement('div');
        weatherBadge.id = 'weather-indicator';
        weatherBadge.className = 'time-badge badge'; // Herda o mesmo visual do botão de "Dia"
        weatherBadge.style.transition = 'all 0.5s ease';
        
        // Insere a nova placa exatamante DEPOIS do botão de Dia/Noite
        timeIndicator.parentNode.insertBefore(weatherBadge, timeIndicator.nextSibling);
        
        updateWeatherUI('🌊 Normal', 'rgba(0,0,0,0.3)', 'rgba(255,255,255,0.3)');
    }
}

// Garante que a placa seja gerada assim que o HTML carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupWeatherBadge);
} else {
    setupWeatherBadge();
}

function updateWeatherUI(text, bgColor, borderColor) {
    if (!weatherBadge) return;
    weatherBadge.innerText = text;
    weatherBadge.style.background = bgColor;
    weatherBadge.style.borderColor = borderColor;
}

// --- RESET E CONTROLE DE STATUS ---
function resetEventStats() {
    window.eventLuckMult = 1;      
    window.eventCastTimeMult = 1;  
    window.eventValueMult = 1;     
    window.eventBgSpeedMult = 1;   
    
    // Devolve o visual do jogo para Dia ou Noite puramente
    const gc = document.getElementById('game-container');
    const timeIndicator = document.getElementById('time-indicator');
    if (gc && timeIndicator) {
        // Verifica se no texto do indicador tem a palavra "Dia"
        const isDay = timeIndicator.innerText.includes('Dia');
        gc.className = isDay ? 'day-mode' : 'night-mode';
    }
    
    // Atualiza a placa de clima para Normal
    updateWeatherUI('🌊 Normal', 'rgba(0,0,0,0.3)', 'rgba(255,255,255,0.3)');
}

// INICIALIZAÇÃO SEGURA
setTimeout(resetEventStats, 500);

// --- OS EVENTOS ---
const EVENTS = {
    seca: {
        id: "seca",
        start: () => {
            document.getElementById('game-container').classList.add('biome-seca');
            window.eventLuckMult = 0.5;      
            window.eventCastTimeMult = 0.5;  
            window.eventValueMult = 0.7;     
            showEventMessage("🏜️ Seca Escaldante!", "Água rasa. Pesca rápida, mas lucros e sorte caem.", "toast-seca");
            updateWeatherUI('🏜️ Seca', 'rgba(211, 84, 0, 0.8)', '#e67e22');
        }
    },
    abissal: {
        id: "abissal",
        start: () => {
            document.getElementById('game-container').classList.add('biome-abissal');
            window.eventLuckMult = 3.0;      
            window.eventCastTimeMult = 2.0;  
            window.eventValueMult = 2.0;     
            window.eventBgSpeedMult = 0.3;   
            showEventMessage("🌑 Despertar Abissal!", "Monstros à solta. Pesca lenta, mas sorte e lucro extremos!", "toast-abissal");
            updateWeatherUI('🌑 Abissal', 'rgba(61, 35, 90, 0.8)', '#8e44ad');
        }
    },
    inverno: {
        id: "inverno",
        start: () => {
            document.getElementById('game-container').classList.add('biome-inverno');
            window.eventLuckMult = 1.0;      
            window.eventCastTimeMult = 1.5;  
            window.eventValueMult = 1.5;     
            window.eventBgSpeedMult = 2.0;   
            showEventMessage("❄️ Inverno Rigoroso!", "Água congelando. A linha desce devagar, mas os peixes são mais gordos!", "toast-inverno");
            updateWeatherUI('❄️ Inverno', 'rgba(21, 67, 96, 0.8)', '#2980b9');
        }
    },
    ouro: {
        id: "ouro",
        start: () => {
            document.getElementById('game-container').classList.add('biome-ouro');
            window.eventLuckMult = 1.2;      
            window.eventCastTimeMult = 0.8;  
            window.eventValueMult = 4.0;     
            window.eventBgSpeedMult = 1.5;   
            showEventMessage("✨ Maré Dourada!", "Cardume rico detectado! Lucros multiplicados por 4!", "toast-ouro");
            updateWeatherUI('✨ Ouro', 'rgba(243, 156, 18, 0.8)', '#f1c40f');
        }
    },
    tempestade: {
        id: "tempestade",
        start: () => {
            document.getElementById('game-container').classList.add('biome-tempestade');
            window.eventLuckMult = 1.5;      
            window.eventCastTimeMult = 0.6;  
            window.eventValueMult = 1.2;     
            window.eventBgSpeedMult = 3.0;   
            showEventMessage("⛈️ Tempestade em Alto Mar!", "Correnteza forte! Os peixes fisgam mais rápido.", "toast-tempestade");
            updateWeatherUI('⛈️ Tempestade', 'rgba(44, 62, 80, 0.8)', '#7f8c8d');
        }
    }
};

function processEvents() {
    if (currentEvent) return; 

    if (Math.random() < EVENT_CONFIG.chance) {
        const keys = Object.keys(EVENTS);
        const eventKey = keys[Math.floor(Math.random() * keys.length)];
        
        const event = EVENTS[eventKey];
        currentEvent = eventKey;
        
        event.start();

        setTimeout(() => {
            resetEventStats(); // Remove buffs, placa volta ao normal e visuais resetam
            currentEvent = null;
            console.log("Bioma normalizado.");
        }, EVENT_CONFIG.duration);
    }
}

// Roda o monitor de biomas
setInterval(processEvents, EVENT_CONFIG.checkInterval);