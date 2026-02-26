/* ==========================================
   SISTEMA DE EVENTOS DINÂMICOS - GATO PESCADOR
   ========================================== */

   const EVENT_CONFIG = {
    checkInterval: 60000, // Tenta rodar um evento a cada 1 minuto
    chance: 0.3,          // 30% de chance de iniciar um evento quando houver a checagem
    duration: 60000       // Duração padrão: 1 minuto
};

let currentEvent = null;
let originalStats = {}; // Guarda os multiplicadores originais para restaurar depois

// Elemento visual para avisar o jogador
const eventAlert = document.createElement('div');
eventAlert.id = "event-toast";
document.body.appendChild(eventAlert);

// CSS dinâmico para o alerta e efeitos visuais
const style = document.createElement('style');
style.innerHTML = `
    #event-toast {
        position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
        padding: 10px 25px; border-radius: 30px; color: white; font-weight: bold;
        z-index: 1000; font-family: 'Fredoka', sans-serif; pointer-events: none;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity: 0;
    }
    #event-toast.active { opacity: 1; top: 100px; }
    .event-outback { background: #d35400; border: 2px solid #e67e22; box-shadow: 0 0 20px #d35400; }
    .event-awaken { background: #8e44ad; border: 2px solid #9b59b6; box-shadow: 0 0 20px #8e44ad; }
    .event-inverno { background: #2980b9; border: 2px solid #3498db; box-shadow: 0 0 20px #2980b9; }
    
    /* Efeito de Inverno no Canvas e Mar */
    .winter-overlay { filter: brightness(1.3) saturate(0.8); transition: filter 2s; }
`;
document.head.appendChild(style);

function showEventMessage(text, className) {
    eventAlert.innerText = text;
    eventAlert.className = 'active ' + className;
    setTimeout(() => { eventAlert.classList.remove('active'); }, 5000);
}

const EVENTS = {
    outback: {
        name: "🏜️ Evento Outback!",
        class: "event-outback",
        start: () => {
            // Reduz probabilidade de peixes (atua na sorte)
            window.eventLuckMult = 0.5;
            showEventMessage("O mar está seco... (Peixes -50%)", "event-outback");
        },
        end: () => { window.eventLuckMult = 1; }
    },
    awaken: {
        name: "🌑 Evento Awaken!",
        class: "event-awaken",
        start: () => {
            // Aumenta probabilidade de peixes
            window.eventLuckMult = 1.5;
            showEventMessage("As feras acordaram! (Peixes +50%)", "event-awaken");
        },
        end: () => { window.eventLuckMult = 1; }
    },
    inverno: {
        name: "❄️ Inverno Rigoroso!",
        class: "event-inverno",
        start: () => {
            document.getElementById('game-container').classList.add('winter-overlay');
            window.eventSpeedMult = 2.5; // Peixes no fundo mais rápidos
            showEventMessage("Mar gelado e visível! (Peixes mais rápidos)", "event-inverno");
        },
        end: () => {
            document.getElementById('game-container').classList.remove('winter-overlay');
            window.eventSpeedMult = 1;
        }
    }
};

function processEvents() {
    if (currentEvent) return; // Não inicia um evento se já houver um rolando

    if (Math.random() < EVENT_CONFIG.chance) {
        const keys = Object.keys(EVENTS);
        currentEvent = keys[Math.floor(Math.random() * keys.size)]; // Erro aqui, corrigindo para length
        const eventKey = keys[Math.floor(Math.random() * keys.length)];
        
        const event = EVENTS[eventKey];
        currentEvent = eventKey;
        event.start();

        setTimeout(() => {
            event.end();
            currentEvent = null;
            console.log("Evento finalizado.");
        }, EVENT_CONFIG.duration);
    }
}

// Inicia o monitor de eventos
setInterval(processEvents, EVENT_CONFIG.checkInterval);

/* CONECTANDO COM O SCRIPT PRINCIPAL SEM ALTERÁ-LO
   Usamos o objeto window para que as variáveis sejam lidas pelo script.js
*/
window.eventLuckMult = 1;
window.eventSpeedMult = 1;

// Sobrescrevemos suavemente a função de sorte se o script principal permitir, 
// ou injetamos nos cálculos globais se você usar as variáveis window.eventLuckMult no futuro.