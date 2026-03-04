/* ==========================================================================
   TUTOR FISH (RAGE FISH) - SISTEMA DE TUTORIAL E FRASES PERSONALIZADAS
   ========================================================================== */

// 1. DICIONÁRIO GLOBAL DOS TUTORIAIS BÁSICOS
window.TUTOR_TIPS = {
    'main': [
        "🎣 Bem-vindo ao Cais! Pressione ESPAÇO ou clique no botão para pescar.",
        "⏰ Peixes diferentes aparecem de Dia e de Noite. Fique de olho no relógio superior!",
        "✨ Eventos Climáticos mudam as regras do jogo. A Tempestade traz monstros, a Maré Dourada traz riquezas!",
        "💰 Faltam moedas? Pesque! Cada peixe tem o seu valor de mercado. Venda os repetidos no Restaurante."
    ],
    'shop-modal': [
        "🛒 Bem-vindo ao Bazar Marítimo! Compre Matérias-Primas e Catalisadores aqui.",
        "📦 Use os botões 1x, 10x e 100x na base de cada item para comprar grandes quantidades rapidamente.",
        "💸 Se o botão estiver escuro, significa que não tem moedas suficientes para a transação."
    ],
    'craft-modal': [
        "🔥 A Grande Forja! Onde as lendas são construídas.",
        "📜 Clique num Diagrama à esquerda. Se tiver os materiais necessários, a fornalha acende e o botão é libertado!",
        "⚠️ Lembre-se: Forjar um item NÃO o equipa. Você deve ir à Mesa Tática (⚙️) para o usar."
    ],
    'bait-forge-modal': [
        "🧪 Bem-vindo ao Reator Genético! Aqui você fabrica Iscas.",
        "♻️ As Iscas exigem Extratos de Lixo. Vá pescar sucata no mar para reciclá-las!",
        "⚡ Quer iscas absurdas? Clique num Catalisador (Boost) do inventário inferior para injetá-lo nos tubos do reator!"
    ],
    'workbench-modal': [
        "⚙️ A Mesa Tática! O coração do seu equipamento.",
        "🖱️ Clique, SEGURE E ARRASTE os itens da mochila para as caixas de loadout ativas à esquerda.",
        "🪝 Um Anzol Divino numa Vara de Madeira não faz milagres. Mantenha o seu equipamento equilibrado!"
    ],
    'collection-modal': [
        "📖 O Seu Aquário Principal! Aqui fica o registo de todos os peixes que já capturou.",
        "🔍 Clique num peixe para ver os seus hábitos, clima favorito e quantas vezes já o pescou."
    ],
    'collection-67-modal': [
        "🏆 O Aquário dos 67cm! O salão VIP da pesca.",
        "📏 Somente peixes que atingiram o tamanho máximo (67cm) entram aqui. Use o Soro Gigante nas iscas!"
    ],
    'collection-scrap-modal': [
        "🗑️ O Museu do Lixo. Os humanos sujam, nós lucramos.",
        "📦 Cada pedaço de sucata pescado concede-lhe um Extrato Químico vital para o Laboratório de Iscas."
    ],
    'sushi-modal': [
        "🍣 A Cozinha do Mestre! Filete peixes em dinheiro e materiais.",
        "🔪 Tática: Arraste a lâmina APENAS pelos pontos vitais vermelhos para não arruinar a carne!",
        "🤢 Cuidado... peixes raros dão grandes recompensas, mas evite fatiar peixes com tons verdes e doentes (podres)."
    ]
};

// Carrega as frases personalizadas guardadas
window.TUTOR_CUSTOM_TIPS = JSON.parse(localStorage.getItem('rageFishCustomTips')) || [];

const TUTOR_STATE = {
    clicks: 0,
    clicksToUnlockSushi: 7, 
    isTalking: false,
    lastContext: '',
    hideTimeout: null,
    mainTipIndex: 0 // Controla a sequência do tutorial básico na tela principal
};

function injectTutorFish() {
    if (document.getElementById('tutor-fish-container')) return;

    // ESTILOS DO PEIXE
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes tutorFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }
        
        #tutor-fish-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999998;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            pointer-events: none; 
        }

        #tutor-animator {
            animation: tutorFloat 4s ease-in-out infinite; 
            pointer-events: auto; 
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
            pointer-events: auto; 
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
            filter: drop-shadow(0 15px 15px rgba(0,0,0,0.5));
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease;
            will-change: transform;
        }

        #tutor-fish-img:hover {
            transform: scale(1.15) rotate(-5deg);
            filter: drop-shadow(0 25px 25px rgba(52, 152, 219, 0.8));
        }

        #tutor-fish-img:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);

    // INJEÇÃO DA TELA DE APRENDIZADO (MODAL DE TEXTO)
    const teachingModal = `
        <div id="fish-teaching-modal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(2, 6, 23, 0.85); z-index:9999999; justify-content:center; align-items:center; backdrop-filter:blur(10px);">
            <div style="background:#0f172a; padding:30px; border-radius:20px; border:2px solid #38bdf8; width:90%; max-width:450px; text-align:center; box-shadow:0 25px 50px rgba(0,0,0,0.8);">
                <h2 style="color:#f8fafc; margin-top:0; font-family:'Fredoka'; font-size: 1.8rem;">🧠 Ensinar o Peixe</h2>
                <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:20px; font-family:'Poppins';">Escreva uma nova frase. O peixe dirá isto apenas quando você estiver relaxado no Cais principal!</p>
                <textarea id="fish-new-phrase" rows="3" style="width:100%; padding:15px; border-radius:12px; border:1px solid #334155; background:#1e293b; color:#f8fafc; font-family:'Poppins'; font-size:0.9rem; resize:none; outline:none; box-sizing: border-box;" placeholder="Ex: O Mestre Lucas é a maior lenda dos sete mares!"></textarea>
                <div style="display:flex; gap:15px; margin-top:25px;">
                    <button id="fish-save-phrase" style="flex:1; padding:12px; background:linear-gradient(135deg, #10b981, #059669); color:white; border:none; border-radius:10px; font-weight:700; font-family:'Poppins'; cursor:pointer; font-size:1rem; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3); transition:0.2s;">Ensinar</button>
                    <button id="fish-close-modal" style="flex:1; padding:12px; background:#1e293b; color:#94a3b8; border:1px solid #334155; border-radius:10px; font-weight:700; font-family:'Poppins'; cursor:pointer; font-size:1rem; transition:0.2s;">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', teachingModal);

    // EVENTOS DA TELA DE APRENDIZADO
    document.getElementById('fish-save-phrase').addEventListener('click', () => {
        const text = document.getElementById('fish-new-phrase').value.trim();
        if(text) {
            window.TUTOR_CUSTOM_TIPS.push(text);
            localStorage.setItem('rageFishCustomTips', JSON.stringify(window.TUTOR_CUSTOM_TIPS));
            document.getElementById('fish-new-phrase').value = '';
            document.getElementById('fish-teaching-modal').style.display = 'none';
            showBubbleForce("Boa! Guardei essa no meu pequeno cérebro aquático.", "success");
        }
    });

    document.getElementById('fish-close-modal').addEventListener('click', () => {
        document.getElementById('fish-teaching-modal').style.display = 'none';
        document.getElementById('fish-new-phrase').value = '';
    });

    // INJEÇÃO DO PRÓPRIO PEIXE
    const container = document.createElement('div');
    container.id = 'tutor-fish-container';

    const bubble = document.createElement('div');
    bubble.id = 'tutor-fish-bubble';

    const animator = document.createElement('div');
    animator.id = 'tutor-animator';

    const img = document.createElement('img');
    img.id = 'tutor-fish-img';
    img.src = '/img/DicaFish.png';
    img.onerror = () => { img.src = 'https://placehold.co/140x140/transparent/3498db?text=🐟'; };

    img.addEventListener('click', handleTutorClick);

    animator.appendChild(img);
    container.appendChild(bubble);
    container.appendChild(animator);
    document.body.appendChild(container);

    setTimeout(() => triggerTip(), 2500);
    setupContextObserver();
}

function getCurrentContext() {
    const modals = ['shop-modal', 'craft-modal', 'bait-forge-modal', 'workbench-modal', 'collection-modal', 'collection-67-modal', 'collection-scrap-modal', 'sushi-modal'];
    for (let m of modals) {
        const el = document.getElementById(m);
        if (el && !el.classList.contains('hidden')) return m;
    }
    return 'main';
}

function handleTutorClick() {
    TUTOR_STATE.clicks++;
    
    // O Desbloqueio Clássico do Sushi
    if (window.GAME_STATE && !window.GAME_STATE.sushiUnlocked) {
        if (TUTOR_STATE.clicks === TUTOR_STATE.clicksToUnlockSushi - 2) {
            showBubbleForce("Ei! Pare de me cutucar, está a irritar-me!", "warning");
            return;
        }
        if (TUTOR_STATE.clicks === TUTOR_STATE.clicksToUnlockSushi - 1) {
            showBubbleForce("Eu avisei! Último aviso antes de... ah, que se lixe.", "error");
            return;
        }
        if (TUTOR_STATE.clicks >= TUTOR_STATE.clicksToUnlockSushi) {
            window.GAME_STATE.sushiUnlocked = true;
            if (typeof window.saveGame === "function") window.saveGame();
            if (typeof window.updateUI === "function") window.updateUI();
            
            showBubbleForce("🎉 VOCÊ VENCEU! Toma a chave do Restaurante de Sushi. Vá fatiar uns peixes no botão acima!", "success");
            if(window.showToast) window.showToast("Restaurante Aberto!", "A função FAZER SUSHI foi desbloqueada permanentemente.", "success");
            return;
        }
    }

    triggerTip();
}

function triggerTip() {
    const context = getCurrentContext();
    let text = "";

    // LÓGICA MESTRA: TELA PRINCIPAL VS MODAIS ESPECÍFICOS
    if (context === 'main') {
        const defaultTips = window.TUTOR_TIPS['main'];
        
        // Ele garante que diz os tutoriais básicos em ordem primeiro
        if (TUTOR_STATE.mainTipIndex < defaultTips.length) {
            text = defaultTips[TUTOR_STATE.mainTipIndex];
            TUTOR_STATE.mainTipIndex++;
        } else {
            // Após ensinar o básico, ele mistura as dicas com as FRASES PERSONALIZADAS DO JOGADOR
            const fullPool = [...defaultTips, ...window.TUTOR_CUSTOM_TIPS];
            text = fullPool[Math.floor(Math.random() * fullPool.length)];
        }
    } else {
        // SE ESTIVER NUMA ABA (Loja, Forja, Sushi...), FALA APENAS OS TUTORIAIS TÉCNICOS
        const tipsArray = window.TUTOR_TIPS[context] || window.TUTOR_TIPS['main'];
        text = tipsArray[Math.floor(Math.random() * tipsArray.length)];
    }
    
    showBubbleForce(text, "info");
}

function showBubbleForce(text, type = "info") {
    const bubble = document.getElementById('tutor-fish-bubble');
    if (!bubble) return;

    let borderColor = '#3498db';
    let textColor = '#2c3e50';
    let editButtonHTML = '';

    if (type === 'warning') { borderColor = '#f39c12'; textColor = '#b9770e'; }
    if (type === 'error') { borderColor = '#e74c3c'; textColor = '#922b21'; }
    if (type === 'success') { borderColor = '#2ecc71'; textColor = '#1d8348'; }

    // O botão de "Adicionar Fala" só aparece na tela principal e se o peixe não estiver chateado
    if (getCurrentContext() === 'main' && type === 'info') {
        editButtonHTML = `
            <div id="btn-teach-fish" style="margin-top: 12px; font-size: 0.75rem; color: #38bdf8; font-weight: 800; cursor: pointer; border-top: 1px dashed rgba(0,0,0,0.1); padding-top: 8px; text-transform: uppercase; transition: 0.2s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#38bdf8'">
                ✏️ Ensinar nova frase
            </div>
        `;
    }

    bubble.style.borderColor = borderColor;
    bubble.style.color = textColor;
    bubble.innerHTML = `<div>${text}</div>${editButtonHTML}`;
    
    bubble.style.opacity = '1';
    bubble.style.transform = 'scale(1) translateY(0)';

    // Ativa o botão de adicionar fala se ele existir
    if (editButtonHTML) {
        document.getElementById('btn-teach-fish').addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o balão suma
            document.getElementById('fish-teaching-modal').style.display = 'flex';
            
            // Oculta o balão de fala enquanto a pessoa escreve
            bubble.style.opacity = '0';
            bubble.style.transform = 'scale(0.8) translateY(20px)';
        });
    }

    // Clique no balão fê-lo desaparecer
    bubble.onclick = function(e) {
        if (e.target.id !== 'btn-teach-fish') {
            bubble.style.opacity = '0';
            bubble.style.transform = 'scale(0.8) translateY(20px)';
        }
    };

    // Timer para o balão desaparecer sozinho
    clearTimeout(TUTOR_STATE.hideTimeout);
    TUTOR_STATE.hideTimeout = setTimeout(() => {
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0.8) translateY(20px)';
    }, 7000); 
}

function setupContextObserver() {
    setInterval(() => {
        const current = getCurrentContext();
        if (current !== TUTOR_STATE.lastContext) {
            TUTOR_STATE.lastContext = current;
            if (current !== 'main') {
                setTimeout(() => triggerTip(), 600);
            }
        }
    }, 600);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectTutorFish);
} else {
    injectTutorFish();
}