/* ==========================================
   RAGEBAIT FISH - O Peixe Tutor Irritante
   ========================================== */

   const RAGE_FISH_STATE = {
    tipsGiven: 0,
    maxTipsBeforeSushi: 5,
    isCustomMode: false,
    customMessages: [], // Lista de mensagens do jogador
    currentIndex: 0,    // Qual mensagem ele está falando agora
    tips: [
        "Dica: Para pescar um peixe, você precisa jogar a isca na água!",
        "Dica: Se a linha não descer, é porque você não clicou em PESCAR.",
        "Dica: Peixes Divinos são mais raros que peixes Comuns. Genial, não?",
        "Dica: Iscas caras custam mais moedas do que iscas baratas.",
        "Dica: O ciclo de dia e noite muda a cada 45 segundos. Uau!",
        "Dica: Se você fechar o jogo como convidado, você perde tudo. Hahaha!",
        "Dica: Você sabia que a água é molhada? O gato sabe."
    ]
};

// --- CSS DINÂMICO PARA O PEIXE, BOTÃO E MODAL ---
const styleRage = document.createElement('style');
styleRage.innerHTML = `
    #rage-fish-container {
        position: fixed; bottom: 20px; right: 20px; z-index: 1000;
        display: flex; flex-direction: column; align-items: center;
        cursor: pointer; transition: transform 0.2s ease;
    }
    #rage-fish-container:hover { transform: scale(1.1); }
    #rage-fish-img { width: 80px; height: auto; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)); animation: floatRage 3s ease-in-out infinite; }

    #rage-fish-bubble {
        position: absolute; bottom: 100px; right: 10px; background: white;
        border: 2px solid #333; border-radius: 15px; padding: 10px;
        font-family: 'Fredoka', sans-serif; font-size: 0.9rem; color: #333;
        width: 180px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
    }
    #rage-fish-bubble::after { content: ''; position: absolute; bottom: -10px; right: 30px; border-width: 10px 10px 0; border-style: solid; border-color: #333 transparent transparent transparent; display: block; width: 0; }
    #rage-fish-bubble::before { content: ''; position: absolute; bottom: -7px; right: 31px; border-width: 8px 8px 0; border-style: solid; border-color: white transparent transparent transparent; display: block; width: 0; z-index: 1; }

    /* Botão de Sushi Horizontal e Reto */
    #sushi-btn {
        position: fixed;
        top: 85px; 
        left: 30px; 
        background: linear-gradient(to right, #ff4757, #c0392b); 
        color: white; border: 2px solid #fff; padding: 8px 20px; border-radius: 8px;
        font-family: 'Fredoka', sans-serif; font-weight: bold; font-size: 1rem;
        cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 20;
        animation: popInStraight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        transition: transform 0.2s;
    }
    #sushi-btn:hover { transform: scale(1.05); }

    @keyframes popInStraight {
        0% { transform: scale(0); opacity: 0; } 
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes floatRage { 
        0%, 100% { transform: translateY(0); } 
        50% { transform: translateY(-10px); } 
    }

    /* Tela (Modal) de Mensagens do Peixe */
    #fish-msg-list { max-height: 180px; overflow-y: auto; margin-top: 15px; text-align: left; }
    .fish-msg-item { display: flex; justify-content: space-between; background: #f9f9f9; padding: 8px 12px; margin-bottom: 8px; border-radius: 8px; align-items: center; border: 1px solid #eee; font-size: 0.9rem; color: #333;}
    .fish-msg-item button { background: #ff5252; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 5px 10px; font-weight: bold; }
    .fish-msg-item button:hover { background: #d32f2f; }
`;
document.head.appendChild(styleRage);

// --- CONSTRUÇÃO DOS ELEMENTOS DO PEIXE ---
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

// --- CONSTRUÇÃO DA TELA (MODAL) DE MENSAGENS ---
const fishModal = document.createElement('div');
fishModal.id = 'fish-modal';
fishModal.className = 'modal hidden';
fishModal.innerHTML = `
    <div class="modal-content">
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
            <div id="fish-msg-list">
                <p style="text-align:center; color:#999; margin-top:20px;">Nenhuma frase adicionada.</p>
            </div>
        </div>
    </div>
`;
document.body.appendChild(fishModal);

// Lógica do Modal
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

window.deleteFishMsg = (index) => {
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
            <button onclick="deleteFishMsg(${idx})">X</button>
        `;
        listMsg.appendChild(item);
    });
}

// --- LÓGICA DO BALÃO E SEQUÊNCIA ---
let bubbleTimeout;

function showBubble(message, duration = 4000) {
    fishBubble.innerText = message;
    fishBubble.style.opacity = 1;
    
    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
        fishBubble.style.opacity = 0;
    }, duration);
}

function giveRandomTip() {
    if (RAGE_FISH_STATE.isCustomMode) {
        if (RAGE_FISH_STATE.customMessages.length > 0) {
            showBubble(RAGE_FISH_STATE.customMessages[RAGE_FISH_STATE.currentIndex]);
            RAGE_FISH_STATE.currentIndex++;
            if (RAGE_FISH_STATE.currentIndex >= RAGE_FISH_STATE.customMessages.length) {
                RAGE_FISH_STATE.currentIndex = 0;
            }
        } else {
            showBubble("Clique em mim para configurar o que eu devo falar!");
        }
        return;
    }

    const randomTip = RAGE_FISH_STATE.tips[Math.floor(Math.random() * RAGE_FISH_STATE.tips.length)];
    showBubble(randomTip);
    
    RAGE_FISH_STATE.tipsGiven++;

    if (RAGE_FISH_STATE.tipsGiven === RAGE_FISH_STATE.maxTipsBeforeSushi && !document.getElementById('sushi-btn')) {
        unlockSushiFeature();
    }
}

// --- DESBLOQUEIO DA FEATURE "SUSHI" E DO PEIXE PESCÁVEL ---
function unlockSushiFeature() {
    showBubble("Ok, ok! Pare de me clicar. Desbloqueando modo Sushi...\nAh, e agora eu estou no oceano. Tente me pescar!", 6000);
    
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

    // 2. O TRUQUE DE HACKER: INJETA O PEIXE NO JOGO ORIGINAL SEM TOCAR NO SCRIPT.JS
    if (typeof RARITIES !== 'undefined' && typeof GAME_STATE !== 'undefined') {
        const secretFish = { 
            name: 'Tutor Irritante', // Nome novo para a coleção
            image: '/img/DicaFish.png', 
            time: 'all' 
        };
        
        // Verifica se já não o adicionámos antes nesta sessão
        const alreadyExists = RARITIES.SECRETO.variations.find(f => f.name === secretFish.name);
        
        if (!alreadyExists) {
            // Empurra ele para a categoria "SECRETO" do seu script.js original
            RARITIES.SECRETO.variations.push(secretFish);
            
            // Garante que a imagem está forçada na memória do jogo para não bugar o canvas
            const img = new Image();
            img.src = secretFish.image;
            GAME_STATE.loadedImages[secretFish.image] = img;
            
            console.log("🐟 Tutor injetado nas águas como peixe Secreto!");
        }
    }
}

// --- INTERAÇÕES DO JOGADOR ---
fishContainer.addEventListener('click', () => {
    if (RAGE_FISH_STATE.isCustomMode) {
        fishModal.classList.remove('hidden');
        renderCustomMessages();
    } else {
        giveRandomTip();
    }
});

// Loop automático a cada 10 segundos
setInterval(() => {
    if (fishBubble.style.opacity === "0" || fishBubble.style.opacity === "") {
        giveRandomTip();
    }
}, 10000);

// Fala a primeira dica após 3 segundos
setTimeout(giveRandomTip, 3000);