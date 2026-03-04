/* ==========================================================================
   TUTOR FISH (RAGE FISH) - SISTEMA REINVENTADO DE TUTORIAL DINÂMICO
   ========================================================================== */

   const TUTOR_STATE = {
    clicks: 0,
    clicksToUnlockSushi: 7, 
    isTalking: false,
    lastContext: '',
    hideTimeout: null
};

// O Dicionário de Sabedoria do Peixe (Textos limpos e didáticos)
const TUTOR_TIPS = {
    main: [
        "🎣 Bem-vindo ao Cais! Pressione ESPAÇO ou clique no botão para pescar.",
        "⏰ Peixes diferentes aparecem de Dia e de Noite. Fique de olho no relógio superior!",
        "✨ Eventos Climáticos mudam as regras do jogo. A Tempestade traz monstros, a Maré Dourada traz riquezas!",
        "💰 Faltam moedas? Pesque! Cada peixe tem o seu valor de mercado."
    ],
    'shop-modal': [
        "🛒 Bem-vindo ao Bazar Marítimo! Compre Matérias-Primas e Catalisadores aqui.",
        "📦 Use os botões 1x, 10x e 100x na base de cada item para comprar grandes quantidades rapidamente.",
        "💸 Se o botão estiver escuro, significa que você não tem moedas suficientes."
    ],
    'craft-modal': [
        "🔥 A Grande Forja! Onde as lendas são construídas.",
        "📜 Clique num Diagrama à esquerda. Se tiver os materiais necessários, a fornalha acende e o botão é libertado!",
        "⚠️ Lembre-se: Forjar um item NÃO o equipa. Você deve ir à Mesa de Montagem (⚙️) para usá-lo."
    ],
    'bait-forge-modal': [
        "🧪 Bem-vindo ao Reator de Síntese! Aqui você fabrica Iscas.",
        "♻️ As Iscas exigem Extratos de Lixo. Vá pescar sucata no mar para reciclá-las!",
        "⚡ Quer iscas absurdas? Clique num Catalisador (Boost) do inventário inferior para injetá-lo nos tubos do reator!"
    ],
    'workbench-modal': [
        "⚙️ A Mesa de Montagem! O coração do seu equipamento.",
        "🖱️ Clique, SEGURE E ARRASTE os itens da aba da direita para as caixas correspondentes à esquerda.",
        "🪝 Um Anzol Divino numa Vara de Madeira não faz milagres. Mantenha o seu equipamento equilibrado!"
    ],
    'collection-modal': [
        "📖 O Seu Aquário Principal! Aqui fica o registo de todos os peixes que já capturou.",
        "🔍 Clique num peixe desbloqueado (colorido) para abrir a sua ficha e ver os hábitos e raridade."
    ],
    'collection-67-modal': [
        "🏆 O Aquário dos 67cm! O salão VIP da pesca.",
        "📏 Somente peixes que atingiram o tamanho máximo e perfeito entram aqui. Use Boosts de tamanho nas suas iscas!"
    ],
    'collection-scrap-modal': [
        "🗑️ O Museu do Lixo. Os humanos sujam, nós lucramos.",
        "📦 Cada pedaço de sucata pescado concede-lhe um Extrato Químico vital para o Laboratório de Iscas."
    ],
    'sushi-modal': [
        "🍣 O Restaurante de Sushi! Transforme peixes que estão a sobrar em dinheiro e materiais.",
        "🔪 Clique em FILETAR e arraste o rato/dedo 4 vezes rapidamente sobre a imagem do peixe.",
        "🤢 Cuidado... peixes raros dão grandes recompensas, mas às vezes podem estar podres por dentro!"
    ]
};

// O Sistema injeta o próprio peixe no HTML para garantir 0 bugs
function injectTutorFish() {
    if (document.getElementById('tutor-fish-container')) return;

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes tutorFloat {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes tutorSwim {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-20px); }
        }
        #tutor-fish-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999998;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            pointer-events: none; /* Ignora cliques no container invisível */
        }
        #tutor-fish-bubble {
            background: white;
            color: #2c3e50;
            padding: 15px 25px;
            border-radius: 18px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            font-weight: 700;
            line-height: 1.4;
            max-width: 320px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            border: 4px solid #3498db;
            margin-bottom: 20px;
            opacity: 0;
            transform: scale(0.8) translateY(20px);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            pointer-events: auto; /* Permite clicar no balão */
            cursor: pointer;
        }
        #tutor-fish-bubble::after {
            content: '';
            position: absolute;
            bottom: -15px;
            right: 50px;
            border-width: 15px 15px 0 0;
            border-style: solid;
            border-color: #3498db transparent transparent transparent;
            display: block;
            width: 0;
        }
        #tutor-fish-img {
            width: 140px;
            height: 140px;
            object-fit: contain;
            cursor: pointer;
            pointer-events: auto;
            filter: drop-shadow(0 15px 15px rgba(0,0,0,0.5));
            animation: tutorFloat 3.5s ease-in-out infinite, tutorSwim 10s ease-in-out infinite;
            transition: transform 0.2s, filter 0.2s;
            will-change: transform;
        }
        #tutor-fish-img:hover {
            transform: scale(1.1) !important;
            filter: drop-shadow(0 20px 25px rgba(52, 152, 219, 0.6));
        }
        #tutor-fish-img:active {
            transform: scale(0.9) !important;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'tutor-fish-container';

    const bubble = document.createElement('div');
    bubble.id = 'tutor-fish-bubble';
    bubble.innerHTML = "E aí, novato? Clique em mim para receber dicas!";
    bubble.addEventListener('click', () => { bubble.style.opacity = '0'; });

    const img = document.createElement('img');
    img.id = 'tutor-fish-img';
    img.src = '/img/DicaFish.png'; // A imagem original do seu projeto
    img.onerror = () => { img.src = 'https://placehold.co/140x140/transparent/3498db?text=🐟'; };

    img.addEventListener('click', handleTutorClick);

    container.appendChild(bubble);
    container.appendChild(img);
    document.body.appendChild(container);

    // Dispara a primeira dica sozinho para mostrar que o peixe está vivo
    setTimeout(() => triggerTip(), 2500);
    
    // Inicia a Inteligência de Contexto (sabe onde o jogador está)
    setupContextObserver();
}

function getCurrentContext() {
    const modals = ['shop-modal', 'craft-modal', 'bait-forge-modal', 'workbench-modal', 'collection-modal', 'collection-67-modal', 'collection-scrap-modal', 'sushi-modal'];
    
    for (let m of modals) {
        const el = document.getElementById(m);
        if (el && !el.classList.contains('hidden')) {
            return m;
        }
    }
    return 'main';
}

function handleTutorClick() {
    TUTOR_STATE.clicks++;
    
    // O Desbloqueio Clássico do Sushi
    if (window.GAME_STATE && !window.GAME_STATE.sushiUnlocked) {
        if (TUTOR_STATE.clicks === TUTOR_STATE.clicksToUnlockSushi - 2) {
            showBubbleForce("Ei! Pare de me cutucar, está-me a irritar!", "warning");
            return;
        }
        if (TUTOR_STATE.clicks === TUTOR_STATE.clicksToUnlockSushi - 1) {
            showBubbleForce("Eu avisei! Último aviso antes de... ah, que se dane.", "error");
            return;
        }
        if (TUTOR_STATE.clicks >= TUTOR_STATE.clicksToUnlockSushi) {
            window.GAME_STATE.sushiUnlocked = true;
            if (typeof window.saveGame === "function") window.saveGame();
            if (typeof window.updateUI === "function") window.updateUI();
            
            showBubbleForce("🎉 VOCÊ VENCEU-ME! Toma a chave do Restaurante de Sushi. Vá fatiar uns peixes no botão acima!", "success");
            if(window.showToast) window.showToast("Restaurante Aberto!", "A função FAZER SUSHI foi desbloqueada permanentemente.", "success");
            return;
        }
    }

    // Se já passou a fase de desbloqueio, dá dicas normais ao clicar
    triggerTip();
}

function triggerTip() {
    const context = getCurrentContext();
    const tipsArray = TUTOR_TIPS[context] || TUTOR_TIPS.main;
    const randomTip = tipsArray[Math.floor(Math.random() * tipsArray.length)];
    
    showBubbleForce(randomTip, "info");
}

function showBubbleForce(text, type = "info") {
    const bubble = document.getElementById('tutor-fish-bubble');
    if (!bubble) return;

    let borderColor = '#3498db';
    let textColor = '#2c3e50';

    if (type === 'warning') { borderColor = '#f39c12'; textColor = '#b9770e'; }
    if (type === 'error') { borderColor = '#e74c3c'; textColor = '#922b21'; }
    if (type === 'success') { borderColor = '#2ecc71'; textColor = '#1d8348'; }

    bubble.style.borderColor = borderColor;
    bubble.style.color = textColor;
    bubble.innerHTML = text;
    bubble.style.opacity = '1';
    bubble.style.transform = 'scale(1) translateY(0)';

    clearTimeout(TUTOR_STATE.hideTimeout);
    TUTOR_STATE.hideTimeout = setTimeout(() => {
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0.8) translateY(20px)';
    }, 7000); // 7 segundos é o tempo perfeito de leitura
}

function setupContextObserver() {
    // Monitora a cada 0.6 segundos se o jogador mudou de aba
    setInterval(() => {
        const current = getCurrentContext();
        if (current !== TUTOR_STATE.lastContext) {
            TUTOR_STATE.lastContext = current;
            
            // Dá uma dica automática sempre que abre uma aba nova
            if (current !== 'main') {
                setTimeout(() => triggerTip(), 600);
            }
        }
    }, 600);
}

// Inicializador à Prova de Falhas
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectTutorFish);
} else {
    injectTutorFish();
}