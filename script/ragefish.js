/* ==========================================================================
   RAGEBAIT FISH V4 - Tutor Inteligente + Persistência do Sushi Mode
   ========================================================================== */

const RAGE_FISH_STATE = {
    tipsGiven: 0,
    maxTipsBeforeSushi: 5,
    isCustomMode: false,
    customMessages: [],
    currentIndex: 0,
    currentScreen: 'main',
    
    tips: {
        main: [
            "Dica: Para pescar um peixe, você precisa jogar a isca na água. Óbvio, não?",
            "Dica: Se a linha não descer, é porque você não tem vara equipada.",
            "Dica: Peixes Divinos são mais raros que peixes Comuns. Genial, não?",
            "Dica: Iscas caras dão lucros muito maiores. É matemática básica.",
            "Dica: Você sabia que a água é molhada? O gato sabe."
        ],
        forge: [
            "A Forja! Clique em uma planta à esquerda para ver os ingredientes.",
            "Se o material estiver vermelho, significa que você é pobre e precisa comprar na Loja.",
            "Lembre-se: Construir a vara NÃO equipa a vara. Use a Mesa de Trabalho ali em cima!",
            "Faltam moedas? Volte a pescar, preguiçoso!"
        ],
        workbench: [
            "Aqui na Mesa, ARRASTE os itens da direita para os espaços pontilhados na esquerda!",
            "Você pode combinar varas de Madeira com Chumbadas que dão bônus para Madeira!",
            "Se a isca acabar, o gato volta a pescar apenas lixo."
        ],
        shop: [
            "Gaste seus Cat Coins aqui. Dinheiro não traz felicidade, mas traz varas de Titânio.",
            "Materiais Brutos servem apenas para a Forja. Não tente pescar usando um pedaço de Plástico.",
            "Algumas iscas raras garantem peixes gigantes de 67cm."
        ]
    }
};

// ==========================================
// 1. INJEÇÃO DE CSS
// ==========================================
const fishStyles = document.createElement('style');
fishStyles.innerHTML = `
    #rage-fish-container {
        position: fixed; bottom: 20px; right: 20px; z-index: 99999;
        display: flex; flex-direction: column; align-items: flex-end; pointer-events: none;
    }
    #rage-fish-img {
        width: 80px; height: 80px; cursor: pointer; pointer-events: auto;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation: floatRage 3s ease-in-out infinite;
    }
    #rage-fish-img:hover { transform: scale(1.15) rotate(-5deg); }

    #rage-fish-bubble {
        background: white; color: #333; padding: 15px; border-radius: 12px 12px 0 12px;
        font-family: 'Poppins', sans-serif; font-size: 0.85rem; font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2); max-width: 250px; margin-bottom: 15px; margin-right: 20px;
        opacity: 0; transform: translateY(10px); transition: opacity 0.3s, transform 0.3s;
        border: 2px solid #e67e22; pointer-events: auto;
    }
    #rage-fish-bubble::after {
        content: ''; position: absolute; bottom: -10px; right: -2px;
        border-width: 10px 10px 0 0; border-style: solid; border-color: #e67e22 transparent transparent transparent;
    }
    @keyframes floatRage { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
`;
document.head.appendChild(fishStyles);

// ==========================================
// 2. CONSTRUÇÃO DA INTERFACE
// ==========================================
const fishContainer = document.createElement('div');
fishContainer.id = 'rage-fish-container';
const fishBubble = document.createElement('div');
fishBubble.id = 'rage-fish-bubble';
const fishImg = document.createElement('img');
fishImg.id = 'rage-fish-img';
fishImg.src = '/img/DicaFish.png'; 
fishImg.onerror = () => { fishImg.src = 'https://placehold.co/80x80?text=🐟'; };

fishContainer.appendChild(fishBubble);
fishContainer.appendChild(fishImg);
document.body.appendChild(fishContainer);

const fishModal = document.createElement('div');
fishModal.id = 'fish-modal';
fishModal.className = 'modal hidden';
fishModal.style.zIndex = '999999';
fishModal.innerHTML = `
    <div class="modal-content" style="max-width: 450px;">
        <div class="modal-header" style="background:#e67e22">
            <h2>💬 Ensinar o Peixe</h2>
            <button id="close-fish-modal" class="close-btn">&times;</button>
        </div>
        <div style="padding: 20px;">
            <p style="font-size:0.9rem; color:#555; margin-bottom: 10px; font-weight: bold;">Adicione frases para o peixe dizer em sequência:</p>
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <input type="text" id="fish-new-msg" placeholder="Digite uma frase..." style="flex:1; padding:10px; border-radius:8px; border:1px solid #ccc; font-family:'Poppins', sans-serif;">
                <button id="fish-add-msg" style="padding:10px 15px; background:#2ecc71; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-family:'Fredoka', sans-serif;">Adicionar</button>
            </div>
            <div id="fish-msg-list"><p style="text-align:center; color:#999; margin-top:20px;">Nenhuma frase adicionada.</p></div>
        </div>
    </div>
`;
document.body.appendChild(fishModal);

document.getElementById('close-fish-modal').onclick = () => fishModal.classList.add('hidden');
document.getElementById('fish-add-msg').onclick = () => {
    const txt = document.getElementById('fish-new-msg').value.trim();
    if (txt) { RAGE_FISH_STATE.customMessages.push(txt); document.getElementById('fish-new-msg').value = ''; renderCustomMessages(); }
};

window.deleteFishMsg = function(index) {
    RAGE_FISH_STATE.customMessages.splice(index, 1);
    if (RAGE_FISH_STATE.currentIndex >= RAGE_FISH_STATE.customMessages.length) RAGE_FISH_STATE.currentIndex = 0;
    renderCustomMessages();
};

function renderCustomMessages() {
    const listMsg = document.getElementById('fish-msg-list');
    listMsg.innerHTML = '';
    if (RAGE_FISH_STATE.customMessages.length === 0) { listMsg.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">O peixe está sem palavras...</p>'; return; }
    
    RAGE_FISH_STATE.customMessages.forEach((msg, idx) => {
        const item = document.createElement('div');
        item.style.cssText = "display:flex; justify-content:space-between; margin-bottom:8px; background:#f1f1f1; padding:8px; border-radius:5px;";
        item.innerHTML = `<span style="flex:1; word-break: break-word; font-size:0.85rem;">${idx + 1}. "${msg}"</span><button onclick="window.deleteFishMsg(${idx})" style="background:#e74c3c; color:white; border:none; border-radius:4px; cursor:pointer; padding:2px 8px;">X</button>`;
        listMsg.appendChild(item);
    });
}

// ==========================================
// 3. SISTEMA GLOBAL E DESTRAVE
// ==========================================
let bubbleTimeout;
window.showBubble = function(message, duration = 5000) {
    fishBubble.innerHTML = message;
    fishBubble.style.opacity = 1; fishBubble.style.transform = 'translateY(0)';
    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => { fishBubble.style.opacity = 0; fishBubble.style.transform = 'translateY(10px)'; }, duration);
};

// O Segredo: Função Global de Liberar Sushi com a opção "silenciosa" (para quando o jogo recarregar)
window.unlockSushiFeature = function(silent = false) {
    if (!silent) {
        window.showBubble("Ok, ok! Pare de me clicar. Desbloqueando modo Sushi...<br><br>Ah, e agora eu estou no oceano. Tente me pescar!", 6000);
    }
    
    // Cria o botão se ele ainda não existir na tela
    if (!document.getElementById('sushi-btn')) {
        const sushiBtn = document.createElement('button');
        sushiBtn.id = 'sushi-btn';
        sushiBtn.innerText = '🍣 FAZER SUSHI';
        sushiBtn.onclick = () => { 
            if (window.SushiMode) window.SushiMode.open(); 
            else alert("Erro: O Modo Sushi não foi carregado corretamente.");
        };
        document.getElementById('ui-layer').appendChild(sushiBtn);
    }
    
    RAGE_FISH_STATE.isCustomMode = true;

    // Injeta o Peixe Secreto
    if (window.RARITIES && window.GAME_STATE) {
        const secretFish = { name: 'Tutor Irritante', image: '/img/DicaFish.png', time: 'all' };
        const alreadyExists = window.RARITIES.SECRETO.variations.find(f => f.name === secretFish.name);
        if (!alreadyExists) {
            window.RARITIES.SECRETO.variations.push(secretFish);
            const img = new Image(); img.src = secretFish.image;
            window.GAME_STATE.loadedImages[secretFish.image] = img;
        }
    }
};

// ==========================================
// 4. MONITORAMENTO E SALVAMENTO AUTOMÁTICO DO SUSHI
// ==========================================

// Como o script principal carrega coisas da nuvem devagar, usamos um verificador para checar se você JÁ TINHA o sushi desbloqueado:
const checkSaveInterval = setInterval(() => {
    if (window.GAME_STATE && typeof window.GAME_STATE.sushiUnlocked !== 'undefined') {
        if (window.GAME_STATE.sushiUnlocked) {
            window.unlockSushiFeature(true); // silent unlock
        }
        clearInterval(checkSaveInterval); // Para de verificar depois que carregar
    }
}, 1000);


// Dicas contextuais dos menus
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('open-craft-btn')?.addEventListener('click', () => {
        RAGE_FISH_STATE.currentScreen = 'forge';
        if (!RAGE_FISH_STATE.isCustomMode) window.showBubble("🔥 <b>Forja Ativada!</b><br><br>Selecione uma planta à esquerda.<br><br>⚠️ MUITO IMPORTANTE: Quando terminar de criar, clique no botão amarelo <b>'⚙️ Mesa de Trabalho'</b> ali em cima para EQUIPAR o item!", 8000);
    });
    document.getElementById('close-craft-btn')?.addEventListener('click', () => { RAGE_FISH_STATE.currentScreen = 'main'; });

    document.getElementById('open-workbench-btn')?.addEventListener('click', () => {
        RAGE_FISH_STATE.currentScreen = 'workbench';
        if (!RAGE_FISH_STATE.isCustomMode) window.showBubble("⚙️ <b>Mesa de Trabalho!</b><br><br>Clique, segure e <b>ARRASTE</b> os itens das listas na direita para os quadrados escuros na esquerda.", 7000);
    });
    document.getElementById('close-workbench-btn')?.addEventListener('click', () => { RAGE_FISH_STATE.currentScreen = 'main'; });

    document.getElementById('open-shop-btn')?.addEventListener('click', () => {
        RAGE_FISH_STATE.currentScreen = 'shop';
        if (!RAGE_FISH_STATE.isCustomMode) window.showBubble("🛒 <b>Loja!</b><br>Compre materiais brutos aqui para levá-los até a Forja depois.", 5000);
    });
    document.getElementById('close-shop-btn')?.addEventListener('click', () => { RAGE_FISH_STATE.currentScreen = 'main'; });
});

function giveRandomTip() {
    if (RAGE_FISH_STATE.isCustomMode) {
        if (RAGE_FISH_STATE.customMessages.length > 0) {
            window.showBubble(RAGE_FISH_STATE.customMessages[RAGE_FISH_STATE.currentIndex]);
            RAGE_FISH_STATE.currentIndex++;
            if (RAGE_FISH_STATE.currentIndex >= RAGE_FISH_STATE.customMessages.length) RAGE_FISH_STATE.currentIndex = 0;
        } else {
            window.showBubble("Clique em mim para configurar o que eu devo falar!");
        }
        return;
    }

    const contextTips = RAGE_FISH_STATE.tips[RAGE_FISH_STATE.currentScreen] || RAGE_FISH_STATE.tips.main;
    window.showBubble(contextTips[Math.floor(Math.random() * contextTips.length)]);
    
    // CONTAGEM PARA LIBERAR O SUSHI PELA PRIMEIRA VEZ
    if (RAGE_FISH_STATE.currentScreen === 'main' && !window.GAME_STATE.sushiUnlocked) {
        RAGE_FISH_STATE.tipsGiven++;
        if (RAGE_FISH_STATE.tipsGiven >= RAGE_FISH_STATE.maxTipsBeforeSushi) {
            // SALVA NO JOGO QUE O SUSHI FOI LIBERADO PARA SEMPRE
            window.GAME_STATE.sushiUnlocked = true;
            if (typeof window.saveGame === "function") window.saveGame();
            window.unlockSushiFeature(false);
        }
    }
}

fishImg.addEventListener('click', () => {
    if (RAGE_FISH_STATE.isCustomMode) {
        fishModal.classList.remove('hidden'); renderCustomMessages();
    } else {
        giveRandomTip();
    }
});

setInterval(() => { if (fishBubble.style.opacity === "0" || fishBubble.style.opacity === "") giveRandomTip(); }, 18000);
setTimeout(() => window.showBubble("E aí, pronto para pescar? Espaço para jogar a linha!", 5000), 3000);