/* ==========================================================================
   RAGEBAIT FISH - O Peixe Tutor Irritante (Integrado ao RPG)
   ========================================================================== */

const RAGE_FISH_STATE = {
    tipsGiven: 0,
    maxTipsBeforeSushi: 5,
    isCustomMode: false,
    customMessages: [], // Lista de mensagens do jogador
    currentIndex: 0,    // Qual mensagem ele está falando agora
    tips: [
        "Dica: Compre materiais na Loja e use a Forja para criar seus equipamentos.",
        "Dica: A Mochila é só para OLHAR! Use a Mesa de Trabalho (dentro da Forja) para equipar as coisas.",
        "Dica: Na Mesa de Trabalho, você precisa ARRASTAR os itens para os quadrados pontilhados!",
        "Dica: Para pescar um peixe, você precisa jogar a isca na água. Óbvio, não?",
        "Dica: Se a linha não descer, é porque você não tem vara equipada ou não clicou em PESCAR.",
        "Dica: Peixes Divinos são mais raros que peixes Comuns. Genial, não?",
        "Dica: Iscas caras dão lucros muito maiores. É matemática básica.",
        "Dica: Você sabia que a água é molhada? O gato sabe."
    ]
};

// ==========================================
// 1. CONSTRUÇÃO DOS ELEMENTOS DO PEIXE
// ==========================================
const fishContainer = document.createElement('div');
fishContainer.id = 'rage-fish-container';

const fishImg = document.createElement('img');
fishImg.id = 'rage-fish-img';
fishImg.src = '/img/DicaFish.png'; 
fishImg.onerror = () => { fishImg.src = 'https://placehold.co/80x80?text=🐟'; };

const fishBubble = document.createElement('div');
fishBubble.id = 'rage-fish-bubble';

fishContainer.appendChild(fishBubble);
fishContainer.appendChild(fishImg);
document.body.appendChild(fishContainer);

// ==========================================
// 2. CONSTRUÇÃO DA TELA (MODAL) DE MENSAGENS
// ==========================================
const fishModal = document.createElement('div');
fishModal.id = 'fish-modal';
fishModal.className = 'modal hidden';
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
                <button id="fish-add-msg" style="padding:10px 15px; background:#2ecc71; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-family:'Fredoka', sans-serif; transition: 0.2s;">Adicionar</button>
            </div>
            <div id="fish-msg-list">
                <p style="text-align:center; color:#999; margin-top:20px;">Nenhuma frase adicionada.</p>
            </div>
        </div>
    </div>
`;
document.body.appendChild(fishModal);

// Lógica do Modal do Peixe
const btnCloseModal = document.getElementById('close-fish-modal');
const btnAddMsg = document.getElementById('fish-add-msg');
const inputMsg = document.getElementById('fish-new-msg');
const listMsg = document.getElementById('fish-msg-list');

btnCloseModal.onclick = () => fishModal.classList.add('hidden');

btnAddMsg.onclick = () => {
    const txt = inputMsg.value.trim();
    if (txt) {
        RAGE_FISH_STATE.customMessages.push(txt);
        inputMsg.value = '';
        renderCustomMessages();
    }
};

window.deleteFishMsg = function(index) {
    RAGE_FISH_STATE.customMessages.splice(index, 1);
    if (RAGE_FISH_STATE.currentIndex >= RAGE_FISH_STATE.customMessages.length) {
        RAGE_FISH_STATE.currentIndex = 0;
    }
    renderCustomMessages();
};

function renderCustomMessages() {
    listMsg.innerHTML = '';
    if (RAGE_FISH_STATE.customMessages.length === 0) {
        listMsg.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">O peixe está sem palavras...</p>';
        return;
    }
    
    RAGE_FISH_STATE.customMessages.forEach((msg, idx) => {
        const item = document.createElement('div');
        item.className = 'fish-msg-item';
        item.innerHTML = `
            <span style="flex:1; word-break: break-word;">${idx + 1}. "${msg}"</span>
            <button onclick="window.deleteFishMsg(${idx})">X</button>
        `;
        listMsg.appendChild(item);
    });
}

// ==========================================
// 3. LÓGICA DO BALÃO DE FALA (TORNADA GLOBAL)
// ==========================================
let bubbleTimeout;

// Exposta globalmente para que o crafting.js possa usá-la!
window.showBubble = function(message, duration = 4000) {
    fishBubble.innerText = message;
    fishBubble.style.opacity = 1;
    
    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
        fishBubble.style.opacity = 0;
    }, duration);
};

function giveRandomTip() {
    // Se o jogador ativou o modo customizado (via botão de sushi)
    if (RAGE_FISH_STATE.isCustomMode) {
        if (RAGE_FISH_STATE.customMessages.length > 0) {
            window.showBubble(RAGE_FISH_STATE.customMessages[RAGE_FISH_STATE.currentIndex]);
            RAGE_FISH_STATE.currentIndex++;
            if (RAGE_FISH_STATE.currentIndex >= RAGE_FISH_STATE.customMessages.length) {
                RAGE_FISH_STATE.currentIndex = 0;
            }
        } else {
            window.showBubble("Clique em mim para configurar o que eu devo falar!");
        }
        return;
    }

    // Modo Padrão: Dicas aleatórias
    const randomTip = RAGE_FISH_STATE.tips[Math.floor(Math.random() * RAGE_FISH_STATE.tips.length)];
    window.showBubble(randomTip);
    
    RAGE_FISH_STATE.tipsGiven++;

    // Desbloqueia o Sushi após X dicas
    if (RAGE_FISH_STATE.tipsGiven === RAGE_FISH_STATE.maxTipsBeforeSushi && !document.getElementById('sushi-btn')) {
        unlockSushiFeature();
    }
}

// ==========================================
// 4. DESBLOQUEIO DA FEATURE "SUSHI"
// ==========================================
function unlockSushiFeature() {
    window.showBubble("Ok, ok! Pare de me clicar. Desbloqueando modo Sushi...\nAh, e agora eu estou no oceano. Tente me pescar!", 6000);
    
    // 1. Cria o botão de Sushi
    const sushiBtn = document.createElement('button');
    sushiBtn.id = 'sushi-btn';
    sushiBtn.innerText = '🍣 FAZER SUSHI';
    sushiBtn.onclick = () => {
        alert("A máquina de Sushi ainda está sendo construída!");
    };
    document.getElementById('ui-layer').appendChild(sushiBtn);
    
    // Transforma o peixe no modo Customizável
    RAGE_FISH_STATE.isCustomMode = true;

    // 2. INJETA O PEIXE NO JOGO PARA SER PESCADO (Interação com script.js)
    if (window.RARITIES && window.GAME_STATE) {
        const secretFish = { 
            name: 'Tutor Irritante', 
            image: '/img/DicaFish.png', 
            time: 'all' 
        };
        
        // Verifica se já não o adicionámos antes nesta sessão
        const alreadyExists = window.RARITIES.SECRETO.variations.find(f => f.name === secretFish.name);
        
        if (!alreadyExists) {
            // Empurra ele para a categoria "SECRETO" global
            window.RARITIES.SECRETO.variations.push(secretFish);
            
            // Garante que a imagem está forçada na memória do jogo para o canvas
            const img = new Image();
            img.src = secretFish.image;
            window.GAME_STATE.loadedImages[secretFish.image] = img;
            
            console.log("🐟 Tutor injetado nas águas como peixe Secreto!");
        }
    }
}

// ==========================================
// 5. INTERAÇÕES E LOOPS
// ==========================================
fishContainer.addEventListener('click', () => {
    if (RAGE_FISH_STATE.isCustomMode) {
        fishModal.classList.remove('hidden');
        renderCustomMessages();
    } else {
        giveRandomTip();
    }
});

// O peixe fala sozinho a cada 15 segundos se estiver calado
setInterval(() => {
    if (fishBubble.style.opacity === "0" || fishBubble.style.opacity === "") {
        giveRandomTip();
    }
}, 15000);

// Fala a primeira dica após 3 segundos do jogo abrir
setTimeout(giveRandomTip, 3000);