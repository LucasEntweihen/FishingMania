// ==========================================================================
// 1. VERIFICAÇÃO DE MODO CONVIDADO E FIREBASE
// ==========================================================================
const urlParams = new URLSearchParams(window.location.search);
const isGuestMode = urlParams.get('guest') === 'true';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHz1W47O5kTiEPw7OjEjSXD0eH_ICtfDA",
    authDomain: "fishingmania-6dced.firebaseapp.com",
    databaseURL: "https://fishingmania-6dced-default-rtdb.firebaseio.com",
    projectId: "fishingmania-6dced",
    storageBucket: "fishingmania-6dced.firebasestorage.app",
    messagingSenderId: "761476396898",
    appId: "1:761476396898:web:2b81f955acbf622a4c9e3b",
    measurementId: "G-Q96SDKRJ1D"
};

let app, auth, db;
let currentUser = null;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
} catch (error) {
    console.error("Erro ao inicializar Firebase. Jogo rodando localmente.", error);
}

// ==========================================================================
// 2. ESTADO DO JOGO E DADOS GLOBAIS (AS LISTAS COMPLETAS)
// ==========================================================================
window.GAME_STATE = {
    coins: 0,
    currentRodIndex: 0,
    isFishing: false,
    rods: [],
    ownedRods: [0], // 0 é a vara inicial (Galho Seco)
    ownedSinkers: ['chumbo'],
    currentSinker: 'chumbo',
    baitInventory: {},
    currentBait: null,
    loadedImages: {},
    collection: {},
    collection67: {},
    isDay: true,
    materials: {} // Inventário de materiais para o Crafting
};

window.MATERIALS = [
    { id: 'madeira', name: 'Madeira / Graveto', price: 50, icon: '🪵' },
    { id: 'fio', name: 'Fio de Nylon', price: 100, icon: '🧵' },
    { id: 'plastico', name: 'Plástico', price: 500, icon: '🧪' },
    { id: 'kevlar', name: 'Fio de Kevlar', price: 1200, icon: '🕸️' },
    { id: 'fibra', name: 'Fibra de Vidro', price: 2000, icon: '🧶' },
    { id: 'ouro', name: 'Ouro Pirata', price: 5000, icon: '🪙' },
    { id: 'metal', name: 'Sucata de Metal', price: 8000, icon: '⚙️' },
    { id: 'titânio', name: 'Liga de Titânio', price: 25000, icon: '🔩' },
    { id: 'perola', name: 'Pérola Abissal', price: 45000, icon: '🦪' },
    { id: 'carbono', name: 'Carbono', price: 80000, icon: '🔋' },
    { id: 'meteorito', name: 'Fragmento de Meteoro', price: 200000, icon: '☄️' },
    { id: 'cristal', name: 'Cristal Místico', price: 500000, icon: '🔮' },
    { id: 'materia_escura', name: 'Matéria Escura', price: 1500000, icon: '🌌' },
    { id: 'essencia', name: 'Essência Divina', price: 5000000, icon: '✨' },
    { id: 'poeira_cosmica', name: 'Poeira Cósmica', price: 15000000, icon: '💫' }
];

window.ROD_TEMPLATES = [
    { name: "Galho Seco", type: "madeira", price: 0, speed: 1.0, luck: 1.0 },
    { name: "Vara de Bambu", type: "madeira", price: 250, speed: 1.1, luck: 1.15 },
    { name: "Bambu Reforçado", type: "madeira", price: 800, speed: 1.25, luck: 1.3 },
    { name: "Caniço de Salgueiro", type: "madeira", price: 2000, speed: 1.35, luck: 1.45 },
    { name: "Vara de Plástico", type: "fibra", price: 5000, speed: 1.5, luck: 1.6 },
    { name: "Fibra de Vidro", type: "fibra", price: 12000, speed: 1.7, luck: 1.85 },
    { name: "Fibra Premium", type: "fibra", price: 25000, speed: 2.0, luck: 2.1 },
    { name: "Polímero Flexível", type: "fibra", price: 50000, speed: 2.3, luck: 2.4 },
    { name: "Alumínio Leve", type: "metal", price: 95000, speed: 2.6, luck: 2.7 },
    { name: "Aço Inoxidável", type: "metal", price: 180000, speed: 3.0, luck: 3.2 },
    { name: "Liga de Titânio", type: "metal", price: 350000, speed: 3.5, luck: 3.8 },
    { name: "Vara de Grafeno", type: "metal", price: 700000, speed: 4.0, luck: 4.5 },
    { name: "Carbono Básico", type: "carbono", price: 1200000, speed: 4.5, luck: 5.0 },
    { name: "Vara Eletrônica", type: "carbono", price: 2500000, speed: 5.2, luck: 6.0 },
    { name: "Fibra de Nanotubos", type: "carbono", price: 5000000, speed: 6.0, luck: 7.5 },
    { name: "Protótipo Militar", type: "carbono", price: 10000000, speed: 7.5, luck: 9.0 },
    { name: "Vara Oceânica", type: "mistico", price: 25000000, speed: 9.0, luck: 12.0 },
    { name: "Arpão Antigo", type: "mistico", price: 50000000, speed: 11.0, luck: 16.0 },
    { name: "Tridente de Netuno", type: "mistico", price: 120000000, speed: 14.0, luck: 22.0 },
    { name: "Vara Galáctica", type: "divino", price: 300000000, speed: 18.0, luck: 35.0 },
    { name: "Vara Quântica", type: "divino", price: 750000000, speed: 25.0, luck: 55.0 },
    { name: "A Vara do Criador", type: "divino", price: 2000000000, speed: 40.0, luck: 100.0 }
];
// Gera os IDs dinamicamente baseados no índice do template
window.GAME_STATE.rods = window.ROD_TEMPLATES.map((tpl, index) => ({ id: index, ...tpl }));

window.SINKERS = [
    { id: 'chumbo', name: 'Chumbo Padrão', price: 0, desc: 'Padrão.', stats: {} },
    { id: 'pedra_rio', name: 'Pedra de Rio', price: 1200, desc: '+15% Vel.', stats: { speed: 1.15 } },
    { id: 'casca_noz', name: 'Casca Leve', price: 3500, desc: 'Sinergia (Madeira): Sorte x1.3', stats: { luck: 1.1 }, synergy: { type: 'madeira', luck: 1.3, desc: "Sorte x1.3" } },
    { id: 'disco_plastico', name: 'Disco Plano', price: 8000, desc: '+30% Vel.', stats: { speed: 1.3 } },
    { id: 'bobina_fibra', name: 'Bobina Estabilizada', price: 18000, desc: 'Sinergia (Fibra): Vel x1.6', stats: { luck: 1.2 }, synergy: { type: 'fibra', speed: 1.6, desc: "Vel x1.6" } },
    { id: 'ferro_velho', name: 'Peso de Sucata', price: 40000, desc: 'Lucro x1.4', stats: { value: 1.4 } },
    { id: 'anilha_aco', name: 'Anilha de Academia', price: 85000, desc: '+80% Vel.', stats: { speed: 1.8 } },
    { id: 'magneto', name: 'Imã Industrial', price: 160000, desc: 'Sinergia (Metal): Lucro x2.2', stats: { luck: 1.4 }, synergy: { type: 'metal', value: 2.2, desc: "Lucro x2.2" } },
    { id: 'peso_tungstenio', name: 'Esfera Pesada', price: 320000, desc: 'Velocidade x2.2', stats: { speed: 2.2 } },
    { id: 'pepita_luxo', name: 'Pepita Polida', price: 700000, desc: 'Lucro x2.5', stats: { value: 2.5 } },
    { id: 'nucleo_carbono', name: 'Peso de Fibra', price: 1500000, desc: 'Sinergia (Carbono): +7% 67cm', stats: { speed: 1.5 }, synergy: { type: 'carbono', chance67: 0.07, desc: "+7% chance 67cm" } },
    { id: 'bateria_ion', name: 'Célula de Energia', price: 4000000, desc: 'Vel x3.0', stats: { speed: 3.0 } },
    { id: 'prisma_oceano', name: 'Prisma de Coral', price: 10000000, desc: 'Sorte x2.5', stats: { luck: 2.5 } },
    { id: 'reliquia_abismo', name: 'Artefato Antigo', price: 25000000, desc: 'Sinergia (Místico): Sorte x3.5', stats: { value: 2.0 }, synergy: { type: 'mistico', luck: 3.5, desc: "Sorte x3.5" } },
    { id: 'fragmento_estelar', name: 'Fragmento de Cometa', price: 60000000, desc: '+15% Chance 67cm', stats: { chance67: 0.15 } },
    { id: 'antimateria_v2', name: 'Peso de Antimatéria', price: 150000000, desc: 'Vel x5.0 | Lucro x3', stats: { speed: 5.0, value: 3.0 } },
    { id: 'divindade_ouro', name: 'Ídolo Dourado', price: 400000000, desc: 'Sinergia (Divino): Lucro x10', stats: { luck: 4.0 }, synergy: { type: 'divino', value: 10.0, desc: "Lucro x10" } },
    { id: 'buraco_negro', name: 'Mini Buraco Negro', price: 1000000000, desc: 'Vel x10, Sorte x10', stats: { speed: 10.0, luck: 10.0, chance67: 0.35 } },
    { id: 'paradoxo', name: 'Peso Atemporal', price: 2500000000, desc: 'Ignora o tempo (+20% 67cm)', stats: { speed: 15.0, chance67: 0.20 } },
    { id: 'vazio_absoluto', name: 'Esfera do Nada', price: 5000000000, desc: 'O fim de tudo', stats: { speed: 20.0, luck: 25.0, value: 15.0, chance67: 0.50 } }
];

window.BAITS = [
    { id: 'pao', icon: '🍞', name: 'Miolo de Pão', price: 150, qty: 10, desc: 'Sorte x1.1', stats: { luck: 1.1 } },
    { id: 'minhoca', icon: '🐛', name: 'Minhoca', price: 450, qty: 5, desc: 'Sorte x1.3', stats: { luck: 1.3 } },
    { id: 'grilo', icon: '🦗', name: 'Grilo Falante', price: 1200, qty: 5, desc: 'Sorte x1.6', stats: { luck: 1.6 } },
    { id: 'queijo', icon: '🧀', name: 'Queijo Fedido', price: 2500, qty: 5, desc: 'Lucro x1.5', stats: { value: 1.5 } },
    { id: 'camarao', icon: '🦐', name: 'Camarão', price: 6000, qty: 5, desc: 'Sorte x2.0', stats: { luck: 2.0 } },
    { id: 'vagalume', icon: '✨', name: 'Vagalume', price: 15000, qty: 5, desc: 'Sorte x2 | +2% 67cm', stats: { luck: 2.0, chance67: 0.02 } },
    { id: 'isca_metal', icon: '🪝', name: 'Isca de Metal', price: 35000, qty: 5, desc: 'Lucro x3.0', stats: { value: 3.0 } },
    { id: 'lula', icon: '🦑', name: 'Lula Gigante', price: 80000, qty: 5, desc: 'Sorte x3.5', stats: { luck: 3.5 } },
    { id: 'sushi', icon: '🍣', name: 'Sushi Premium', price: 200000, qty: 5, desc: 'Sorte x3 | Lucro x3', stats: { luck: 3.0, value: 3.0 } },
    { id: 'cometa', icon: '☄️', name: 'Pó de Cometa', price: 650000, qty: 3, desc: '+10% Chance 67cm', stats: { chance67: 0.10 } },
    { id: 'hamburguer', icon: '🍔', name: 'Podrão dos Mares', price: 1500000, qty: 5, desc: 'Lucro Extremo (x6.0)', stats: { value: 6.0 } },
    { id: 'queijo_azul', icon: '🧀', name: 'Gorgonzola Galáctico', price: 1500000, qty: 5, desc: 'Lucro x8.0', stats: { value: 8.0 } },
    { id: 'radioativa', icon: '☢️', name: 'Isca Mutante', price: 4500000, qty: 3, desc: 'Atrai Anomalias (Sorte x8)', stats: { luck: 8.0 } },
    { id: 'lula_neon', icon: '🦑', name: 'Lula de Neon', price: 5000000, qty: 3, desc: 'Atrai Miticos (Sorte x12)', stats: { luck: 12.0 } },
    { id: 'kraken', icon: '👁️', name: 'Olho do Kraken', price: 12000000, qty: 3, desc: 'Garante Gigantes (+20% 67cm)', stats: { chance67: 0.20 } },
    { id: 'essencia_deus', icon: '🍷', name: 'Néctar Divino', price: 20000000, qty: 2, desc: 'Sorte x30 | +25% 67cm', stats: { luck: 30.0, chance67: 0.25 } },
    { id: 'vazio', icon: '🌌', name: 'Essência do Vazio', price: 35000000, qty: 2, desc: 'Sorte Divina (x25.0)', stats: { luck: 25.0 } },
    { id: 'sol', icon: '☀️', name: 'Fragmento Solar', price: 80000000, qty: 2, desc: 'Astro-Rei (+40% 67cm)', stats: { chance67: 0.40 } },
    { id: 'supernova', icon: '💥', name: 'Isca Supernova', price: 100000000, qty: 1, desc: 'Lucro x50 | +40% 67cm', stats: { value: 50.0, chance67: 0.40 } },
    { id: 'definitiva', icon: '👑', name: 'Isca Matadora de Deuses', price: 250000000, qty: 1, desc: 'Poder Máximo.', stats: { luck: 50.0, value: 30.0, chance67: 0.60 } },
    { id: 'alma_gato', icon: '🐈', name: 'Nona Alma', price: 500000000, qty: 1, desc: 'O impossível acontece.', stats: { luck: 100.0, value: 100.0, chance67: 0.70 } }
];

window.RARITIES = {
    COMUM: { id: 'comum', prob: 0.50, mult: 1, style: 'text-comum', border: 'border-comum', name: 'Comum', variations: [
        { name: 'Peixe Genérico', image: '/img/peixe/Genericfish001.webp', time: 'all' },
        { name: 'Bombardilo', image: '/img/peixe/bombardilo crocarilho.webp', time: 'day' },
        { name: 'Ah, peixe legal', image: '/img/peixe/PeixeLegal.avif', time: 'all' },
        { name: 'Cruel kidfish', image: '/img/peixe/KidFish.png', time: 'night' },
        { name: 'Pexudo', image: '/img/peixe/peixebala.png', time: 'all' }
    ]},
    RARO: { id: 'raro', prob: 0.25, mult: 3, style: 'text-raro', border: 'border-raro', name: 'Raro', variations: [
        { name: 'Peixe Estranho', image: '/img/peixe/UnderWaterAhhFish.png', time: 'night' },
        { name: 'Meu çélebro', image: '/img/peixe/tarlalareo fish.png', time: 'all' },
        { name: 'PUTAPEIXE', image: '/img/peixe/PUTARALHOFISH, porra.png', time: 'all' },
        { name: 'Peixe Burrinho', image: '/img/peixe/dumbAssFish.png', time: 'all' }
    ]},
    EPICO: { id: 'epico', prob: 0.15, mult: 8, style: 'text-epico', border: 'border-epico', name: 'Épico', variations: [
        { name: 'Mahi-Mahi', image: '/img/peixe/Mahi-Mahifish square.webp', time: 'all' },
        { name: 'Peixe Otário', image: '/img/peixe/PeixeOtario.png', time: 'day' },
        { name: 'Peixe Lhapaço', image: '/img/peixe/peixe-palhaco.png', time: 'all' },
        { name: 'Carlos a Cardume', image: '/img/peixe/Carlosacardume.png', time: 'day' }, // <--- PONTO REMOVIDO!
        { name: 'Betíssimo', image: '/img/peixe/betaMaximo.webp', time: 'all' }
    ]},
    LENDARIO: { id: 'lendario', prob: 0.07, mult: 20, style: 'text-lendario', border: 'border-lendario', name: 'Lendário', variations: [
        { name: 'Peixe Motosserra', image: '/img/peixe/Chainsawfish.webp', time: 'night' },
        { name: 'Peixe Demônio negro', image: '/img/peixe/DemonicAHHfish (1).png', time: 'night' },
        { name: 'Peixe Entulhado', image: '/img/peixe/EntulhoFish.png', time: 'day' }
    ]},
    MITICO: { id: 'mitico', prob: 0.025, mult: 50, style: 'text-mitico', border: 'border-mitico', name: 'Mítico', variations: [
        { name: 'Jogo do Peixe Retardo', image: '/img/peixe/GameofRetardedfish.png', time: 'night' },
        { name: 'Peixe Câncer', image: '/img/peixe/PeixeCancer.png', time: 'all' },
        { name: 'Meus filhos ', image: '/img/peixe/cardume dos meus filhos.png', time: 'all' },
        { name: 'Peixe das Águas Reais', image: '/img/peixe/aquoso.webp', time: 'day' }
    ]},
    SECRETO: { id: 'secreto', prob: 0.004, mult: 150, style: 'text-secreto', border: 'border-secreto', name: 'Secreto', variations: [
        { name: 'Peixe Retardado', image: '/img/peixe/Retardedfish.png', time: 'all' },
        { name: 'Meu Almoço Delicioso', image: '/img/peixe/receitas-de-peixes-destaque.png', time: 'day' }
    ]},
    DIVINO: { id: 'divino', prob: 0.001, mult: 500, style: 'text-divino', border: 'border-divino', name: 'Divino', variations: [
        { name: 'Quase Arco-íris', image: '/img/peixe/Semi-rainbowfish.png', time: 'day' },
        { name: 'Só mais um pouco', image: '/img/peixe/meus porrinhas.png', time: 'night' },
        { name: 'Ex rei dos mares (fraco)', image: '/img/peixe/CARALHOFODAA.png', time: 'night' }
    ]},
    AURUDO: { id: 'aurudo', prob: 0.0001, mult: 5000, style: 'text-auraMAX', border: 'border-auraMAX', name: 'Aurudo', variations: [
        { name: 'SHIGERU?', image: '/img/peixe/ShigeruFish.png', time: 'all' },
        { name: 'SHIGERU DO ORGULHO???', image: '/img/peixe/PrideShigeruFish.png', time: 'night' }
    ]}
};

// PRÉ-CARREGAMENTO DAS IMAGENS PARA O CANVAS
function preloadImages() {
    Object.values(window.RARITIES).forEach(rarity => {
        rarity.variations.forEach(fish => {
            const img = new Image();
            img.src = fish.image;
            window.GAME_STATE.loadedImages[fish.image] = img;
        });
    });
    ['/img/asset/67comum.jpg', '/img/asset/67raro.jpg', '/img/asset/67muitoraro.webp'].forEach(src => {
        const img = new Image();
        img.src = src;
    });
}
preloadImages();

// ==========================================================================
// 3. FERRAMENTAS DE UI E SALVAMENTO SEGURO
// ==========================================================================
function safeGet(id) {
    return document.getElementById(id);
}

window.updateUI = function() {
    if(safeGet('cat-coins')) safeGet('cat-coins').innerText = window.GAME_STATE.coins.toLocaleString();
    
    // Atualiza a Vara Visual
    const rod = window.GAME_STATE.rods.find(r => r.id === window.GAME_STATE.currentRodIndex) || window.GAME_STATE.rods[0];
    if(safeGet('current-rod-display')) safeGet('current-rod-display').innerText = `Vara: ${rod.name}`;
    
    const catVisual = safeGet('cat-fisherman');
    if (catVisual) {
        const rodVisual = catVisual.querySelector('.rod-visual');
        if (rodVisual) rodVisual.className = `rod-visual dropzone rod-tier-${rod.id}`;
    }

    // Atualiza o Sinker Visual
    const sinker = window.SINKERS.find(s => s.id === window.GAME_STATE.currentSinker) || window.SINKERS[0];
    if(safeGet('sinker-slot')) safeGet('sinker-slot').innerText = `🪨 ${sinker.name}`;
    if(safeGet('equipped-sinker-visual')) {
        safeGet('equipped-sinker-visual').style.display = (sinker.id !== 'chumbo') ? 'block' : 'none';
    }

    // Atualiza a Isca Visual
    const baitDisplay = safeGet('bait-slot');
    const baitVis = safeGet('bait-visual');
    if (window.GAME_STATE.currentBait) {
        const bait = window.BAITS.find(b => b.id === window.GAME_STATE.currentBait);
        if (bait && baitDisplay && baitVis) {
            baitDisplay.innerText = `${bait.icon} ${bait.name} (x${window.GAME_STATE.baitInventory[bait.id] || 0})`;
            baitVis.innerText = bait.icon;
        }
    } else {
        if(baitDisplay) baitDisplay.innerText = "🪝 Sem Isca";
        if(baitVis) baitVis.innerText = "";
    }
}

window.saveGame = function() {
    if (isGuestMode) {
        if(safeGet('save-status')) safeGet('save-status').innerText = "🚫 Convidado";
        return; 
    }

    const playerSave = {
        coins: window.GAME_STATE.coins,
        currentRodIndex: window.GAME_STATE.currentRodIndex,
        ownedRods: window.GAME_STATE.ownedRods,
        ownedSinkers: window.GAME_STATE.ownedSinkers,
        currentSinker: window.GAME_STATE.currentSinker,
        baitInventory: window.GAME_STATE.baitInventory,
        currentBait: window.GAME_STATE.currentBait,
        collection: window.GAME_STATE.collection,
        collection67: window.GAME_STATE.collection67,
        materials: window.GAME_STATE.materials // SALVA OS MATERIAIS
    };

    if (currentUser && db) {
        localStorage.setItem('gatoPescadorSave_' + currentUser.uid, JSON.stringify(playerSave));
        set(ref(db, 'users/' + currentUser.uid), playerSave)
            .then(() => { if(safeGet('save-status')) safeGet('save-status').innerText = "☁️ Salvo"; })
            .catch((e) => console.error("Erro ao salvar:", e));
    } else {
        localStorage.setItem('gatoPescadorSave_visitante', JSON.stringify(playerSave));
        if(safeGet('save-status')) safeGet('save-status').innerText = "✅ Salvo Local";
    }
}

function loadGame() {
    if (isGuestMode) {
        if(safeGet('save-status')) safeGet('save-status').innerText = "🚫 Modo Convidado";
        window.updateUI();
        return; 
    }

    if (!currentUser || !db) {
        let localData = localStorage.getItem('gatoPescadorSave_visitante') || localStorage.getItem('gatoPescadorSave');
        if (localData) {
            try {
                Object.assign(window.GAME_STATE, JSON.parse(localData));
                
                // PROTEÇÃO: Cria a chave "materials" se o jogador for antigo
                if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
                // PROTEÇÃO: Garante que a primeira vara sempre exista
                if (!window.GAME_STATE.ownedRods || window.GAME_STATE.ownedRods.length === 0) window.GAME_STATE.ownedRods = [0];

                if(safeGet('save-status')) safeGet('save-status').innerText = "👤 Visitante";
            } catch (e) { console.error("Save corrompido"); }
        }
        window.updateUI();
        return;
    }

    if(safeGet('save-status')) safeGet('save-status').innerText = "🔄 Nuvem...";
    
    get(child(ref(db), `users/${currentUser.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            Object.assign(window.GAME_STATE, snapshot.val());
            window.GAME_STATE.isFishing = false;
            
            // PROTEÇÃO: Cria a chave "materials" se o jogador for antigo
            if (!window.GAME_STATE.materials) window.GAME_STATE.materials = {};
            // PROTEÇÃO: Garante que a primeira vara sempre exista
            if (!window.GAME_STATE.ownedRods || window.GAME_STATE.ownedRods.length === 0) window.GAME_STATE.ownedRods = [0];

            localStorage.setItem('gatoPescadorSave_' + currentUser.uid, JSON.stringify(window.GAME_STATE));
            if(safeGet('save-status')) safeGet('save-status').innerText = "☁️ Conectado";
        } else {
            let localBackup = localStorage.getItem('gatoPescadorSave_' + currentUser.uid) || localStorage.getItem('gatoPescadorSave');
            if (localBackup) { try { Object.assign(window.GAME_STATE, JSON.parse(localBackup)); } catch(e){} }
            window.saveGame();
        }
        // Garante que as varas estão mapeadas de acordo com as novas atualizações de código
        window.GAME_STATE.rods = window.ROD_TEMPLATES.map((tpl, index) => ({ id: index, ...tpl }));
        window.updateUI();
    }).catch((e) => {
        console.error(e);
        if(safeGet('save-status')) safeGet('save-status').innerText = "❌ Offline";
        window.updateUI();
    });
}

if(auth) {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if(!isGuestMode) loadGame();
    });
}

setInterval(window.saveGame, 30000);

// ==========================================================================
// 4. LÓGICA DE PESCA E CÁLCULO
// ==========================================================================
window.calculateCatch = function(rod, sinker) {
    const bait = window.GAME_STATE.currentBait ? window.BAITS.find(b => b.id === window.GAME_STATE.currentBait) : null;
    let luckFactor = rod.luck;
    let valueMult = 1;
    let chance67 = 0.0005;

    // Sinker Stats & Sinergia
    if (sinker.stats.luck) luckFactor *= sinker.stats.luck;
    if (sinker.stats.value) valueMult *= sinker.stats.value;
    if (sinker.stats.chance67) chance67 += sinker.stats.chance67;

    if (sinker.synergy && sinker.synergy.type === rod.type) {
        if (sinker.synergy.luck) luckFactor *= sinker.synergy.luck;
        if (sinker.synergy.value) valueMult *= sinker.synergy.value;
        if (sinker.synergy.chance67) chance67 += sinker.synergy.chance67;
    }

    // Bait Stats
    if (bait) {
        if (bait.stats.luck) luckFactor *= bait.stats.luck;
        if (bait.stats.value) valueMult *= bait.stats.value;
        if (bait.stats.chance67) chance67 += bait.stats.chance67;
    }

    // Modificador de Eventos (events.js)
    if (window.eventLuckMult) luckFactor *= window.eventLuckMult;

    const rand = Math.random();
    let caughtRarity = window.RARITIES.COMUM;

    if (rand < window.RARITIES.AURUDO.prob * luckFactor) caughtRarity = window.RARITIES.AURUDO;
    else if (rand < window.RARITIES.DIVINO.prob * luckFactor) caughtRarity = window.RARITIES.DIVINO;
    else if (rand < window.RARITIES.SECRETO.prob * luckFactor) caughtRarity = window.RARITIES.SECRETO;
    else if (rand < window.RARITIES.MITICO.prob * luckFactor) caughtRarity = window.RARITIES.MITICO;
    else if (rand < window.RARITIES.LENDARIO.prob * luckFactor) caughtRarity = window.RARITIES.LENDARIO;
    else if (rand < window.RARITIES.EPICO.prob * luckFactor) caughtRarity = window.RARITIES.EPICO;
    else if (rand < window.RARITIES.RARO.prob * luckFactor) caughtRarity = window.RARITIES.RARO;

    const validVariations = caughtRarity.variations.filter(v => 
        v.time === 'all' || 
        (window.GAME_STATE.isDay && v.time === 'day') || 
        (!window.GAME_STATE.isDay && v.time === 'night')
    );

    let specificFish = validVariations.length > 0 ? validVariations[Math.floor(Math.random() * validVariations.length)] : window.RARITIES.COMUM.variations[0];
    if (validVariations.length === 0) caughtRarity = window.RARITIES.COMUM;

    const sizeBase = 10 + (Object.keys(window.RARITIES).indexOf(caughtRarity.id.toUpperCase()) * 15);
    let finalSize = sizeBase + Math.floor(Math.random() * 60);
    if (Math.random() < chance67) finalSize = 67;

    let finalValue = Math.floor(finalSize * caughtRarity.mult * valueMult);
    if (window.eventValueMult) finalValue = Math.floor(finalValue * window.eventValueMult);

    return { rarity: caughtRarity, variation: specificFish, size: finalSize, value: finalValue };
}

window.castLine = function() {
    if (window.GAME_STATE.isFishing) return;

    // Consumo de Isca
    if (window.GAME_STATE.currentBait) {
        if (window.GAME_STATE.baitInventory[window.GAME_STATE.currentBait] > 0) {
            window.GAME_STATE.baitInventory[window.GAME_STATE.currentBait]--;
            if (window.GAME_STATE.baitInventory[window.GAME_STATE.currentBait] <= 0) window.GAME_STATE.currentBait = null;
        } else {
            window.GAME_STATE.currentBait = null;
        }
    }
    window.updateUI();

    window.GAME_STATE.isFishing = true;
    
    const rod = window.GAME_STATE.rods.find(r => r.id === window.GAME_STATE.currentRodIndex) || window.GAME_STATE.rods[0];
    const sinker = window.SINKERS.find(s => s.id === window.GAME_STATE.currentSinker) || window.SINKERS[0];
    
    const btn = safeGet('cast-btn');
    if(btn){ btn.disabled = true; btn.innerText = "Descendo..."; }
    
    const catIdle = safeGet('cat-fisherman');
    if(catIdle) catIdle.classList.replace('cat-idle', 'cat-fishing');
    
    const fishImg = safeGet('hooked-fish-img');
    if(fishImg) fishImg.style.display = 'none';

    let targetDepth = Math.max(150, Math.floor((window.innerHeight - 150) * (0.3 + ((rod.id + 1) / 20 * 0.7))));

    let speedMult = rod.speed;
    if (sinker.stats.speed) speedMult *= sinker.stats.speed;
    if (sinker.synergy && sinker.synergy.type === rod.type && sinker.synergy.speed) speedMult *= sinker.synergy.speed;

    const travelTime = (Math.max(400, 2000 - (rod.id * 80)) / (speedMult || 1)) * (window.eventCastTimeMult || 1);

    const line = safeGet('line-container');
    if(line) { 
        line.style.transition = `height ${travelTime}ms ease-in`; 
        line.style.height = `${targetDepth}px`; 
    }

    setTimeout(() => {
        if(btn) btn.innerText = "Fisgou!";
        
        const fish = window.calculateCatch(rod, sinker);
        if(fishImg){ fishImg.src = fish.variation.image; fishImg.style.display = 'block'; }
        
        const reelTime = travelTime * 0.8;
        if(line) { 
            line.style.transition = `height ${reelTime}ms ease-out`; 
            line.style.height = `0px`; 
        }

        setTimeout(() => {
            window.GAME_STATE.coins += fish.value;
            let sealImage = null;

            if (fish.size === 67) {
                window.GAME_STATE.collection67[fish.variation.name] = (window.GAME_STATE.collection67[fish.variation.name] || 0) + 1;
                sealImage = (fish.rarity.id === 'comum' || fish.rarity.id === 'raro') ? '/img/asset/67comum.jpg' : (fish.rarity.id === 'epico' || fish.rarity.id === 'lendario') ? '/img/asset/67raro.jpg' : '/img/asset/67muitoraro.webp';
            } else {
                window.GAME_STATE.collection[fish.variation.name] = (window.GAME_STATE.collection[fish.variation.name] || 0) + 1;
            }

            window.updateUI(); 
            window.saveGame();
            
            // Cria o Popup Dinâmico
            const div = document.createElement('div');
            div.className = `catch-popup ${fish.rarity.border}`;
            let timeIcon = fish.variation.time === 'day' ? '☀️ Dia' : (fish.variation.time === 'night' ? '🌙 Noite' : '🌗 Ambos');

            div.innerHTML = `
                <div class="fish-visual-container">
                    <img src="${fish.variation.image}" class="${sealImage ? 'popup-fish-img fish-flash' : 'popup-fish-img'}">
                    ${sealImage ? `<img src="${sealImage}" class="popup-seal">` : ''}
                </div>
                <div class="popup-name">${fish.variation.name}</div>
                <div class="popup-rarity-text ${fish.rarity.style}">${fish.rarity.name}</div>
                <div class="popup-info-line">📏 ${fish.size}cm</div>
                <div class="popup-info-line" style="font-size: 0.75rem;">🕒 ${timeIcon}</div>
                <div class="popup-value">+${fish.value} 🪙</div>
            `;
            document.body.appendChild(div);
            
            setTimeout(() => { 
                div.style.transition = "opacity 0.5s"; 
                div.style.opacity = "0"; 
                setTimeout(() => div.remove(), 500); 
            }, 2500);

            if(fishImg) fishImg.style.display = 'none';
            window.GAME_STATE.isFishing = false;
            
            if(btn) { btn.disabled = false; btn.innerText = "Pescar (Espaço)"; }
            const catFishing = safeGet('cat-fisherman');
            if(catFishing) catFishing.classList.replace('cat-fishing', 'cat-idle');

        }, reelTime);
    }, travelTime + 1000);
}

// ==========================================================================
// 5. EVENT LISTENERS E CONTROLE DE MENUS
// ==========================================================================
document.addEventListener('keydown', (e) => { 
    if (e.code === 'Space') { 
        e.preventDefault(); // Evita que a página role para baixo
        
        // A MÁGICA ESTÁ AQUI: Se a tecla estiver sendo segurada, não faz nada!
        if (e.repeat) return; 

        // Só tenta pescar se o gato já não estiver pescando
        if (!window.GAME_STATE.isFishing) {
            window.castLine(); 
        }
    } 
});

// Vinculando de forma segura
document.addEventListener('DOMContentLoaded', () => {
    safeGet('cast-btn')?.addEventListener('click', () => window.castLine());

    safeGet('exit-game-btn')?.addEventListener('click', () => {
        const targetUrl = '../index.html'; 
        if (isGuestMode) { 
            window.location.href = targetUrl; 
        } else { 
            const btn = safeGet('exit-game-btn');
            if(btn) { btn.innerText = "Salvando..."; btn.disabled = true; }
            window.saveGame(); 
            setTimeout(() => window.location.href = targetUrl, 800); 
        }
    });

    // Ligar Botões das Coleções
    safeGet('open-collection-btn')?.addEventListener('click', () => { 
        safeGet('collection-modal')?.classList.remove('hidden'); 
        window.renderCollection(); 
    });
    safeGet('close-collection-btn')?.addEventListener('click', () => {
        safeGet('collection-modal')?.classList.add('hidden');
    });

    safeGet('open-67-btn')?.addEventListener('click', () => { 
        safeGet('collection-67-modal')?.classList.remove('hidden'); 
        window.renderCollection67(); 
    });
    safeGet('close-67-btn')?.addEventListener('click', () => {
        safeGet('collection-67-modal')?.classList.add('hidden');
    });
});

// Expondo a renderização da coleção para os botões do HTML chamarem
window.renderCollection = function() {
    const grid = safeGet('collection-grid'); 
    if(!grid) return; 
    grid.innerHTML = ''; 
    let t=0, u=0;
    
    Object.values(window.RARITIES).forEach(r => {
        r.variations.forEach(f => { 
            t++; 
            const c = window.GAME_STATE.collection[f.name] || 0; 
            if(c>0) u++; 
            createCard(grid, f, r, c, false); 
        });
    });
    if(safeGet('collection-progress')) safeGet('collection-progress').innerText = `(${u}/${t})`;
};

window.renderCollection67 = function() {
    const grid = safeGet('collection-67-grid'); 
    if(!grid) return; 
    grid.innerHTML = ''; 
    let t=0, u=0;
    
    Object.values(window.RARITIES).forEach(r => {
        r.variations.forEach(f => { 
            t++; 
            const c = window.GAME_STATE.collection67[f.name] || 0; 
            if(c>0) u++; 
            createCard(grid, f, r, c, true); 
        });
    });
    if(safeGet('collection-67-progress')) safeGet('collection-67-progress').innerText = `(${u}/${t})`;
};

function createCard(container, fish, rarity, count, is67) {
    const isUnlocked = count > 0; 
    const div = document.createElement('div'); 
    div.className = `collection-card ${isUnlocked ? 'unlocked' : 'locked'} ${is67 ? 'special-67' : ''}`;
    
    let seal = ''; 
    if(is67 && isUnlocked) { 
        const s = (rarity.id==='comum'||rarity.id==='raro')?'/img/asset/67comum.jpg':(rarity.id==='epico'||rarity.id==='lendario')?'/img/asset/67raro.jpg':'/img/asset/67muitoraro.webp'; 
        seal = `<img src="${s}" class="collection-seal">`; 
    }
    
    let icon = fish.time === 'day' ? '☀️' : (fish.time === 'night' ? '🌙' : '');
    
    div.innerHTML = `
        ${isUnlocked ? `<div class="count-badge">x${count}</div>` : ''}
        <div style="position: absolute; top: 2px; left: 5px; font-size: 0.7rem;">${icon}</div>
        <img src="${fish.image}" class="collection-img">
        ${seal}
        <div style="font-size: 0.75rem; font-weight: bold; color: ${isUnlocked ? '#333' : '#999'}">${fish.name}</div>
        <div style="font-size: 0.65rem; color: ${isUnlocked ? 'green' : '#ccc'}">${rarity.name}</div>
    `;
    container.appendChild(div);
}

// ==========================================================================
// 6. BACKGROUND ANIMADO E CICLO DO TEMPO
// ==========================================================================
const canvas = safeGet('bg-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const fishes = [];

function resizeCanvas() { 
    if(canvas){ 
        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight; 
    } 
}
window.addEventListener('resize', resizeCanvas); 
resizeCanvas();

class SwimmingFish {
    constructor() { this.reset(true); }
    reset(initial = false) {
        const rands = Math.random(); 
        let r = window.RARITIES.COMUM;
        
        if(rands < 0.005) r = window.RARITIES.AURUDO; 
        else if(rands < 0.005) r = window.RARITIES.DIVINO; 
        else if(rands < 0.01) r = window.RARITIES.SECRETO; 
        else if(rands < 0.03) r = window.RARITIES.MITICO; 
        else if(rands < 0.08) r = window.RARITIES.LENDARIO; 
        else if(rands < 0.20) r = window.RARITIES.EPICO; 
        else if(rands < 0.40) r = window.RARITIES.RARO;
        
        const valid = r.variations.filter(v => v.time === 'all' || (window.GAME_STATE.isDay && v.time === 'day') || (!window.GAME_STATE.isDay && v.time === 'night'));
        this.specificImage = (valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : r.variations[0]).image;
        
        this.depth = Math.random(); 
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.y = canvas ? Math.random() * (canvas.height - 200) + 200 : 300;
        this.width = (40 + Math.min(60, r.mult * 0.8)) * (0.4 + (this.depth * 0.6));
        this.x = initial && canvas ? Math.random() * canvas.width : (this.direction === 1 ? -300 : (canvas ? canvas.width + 300 : 2000));
        this.speed = (0.5 + (this.depth * 1.5)) * this.direction; 
        this.opacity = 0.1 + (this.depth * 0.4);
    }
    update() { 
        this.x += (this.speed * (window.eventBgSpeedMult || 1)); 
        if (canvas && ((this.direction === 1 && this.x > canvas.width + 300) || (this.direction === -1 && this.x < -300))) {
            this.reset(); 
        }
    }
    draw() {
        if(!ctx) return; 
        const img = window.GAME_STATE.loadedImages[this.specificImage];
        if (!img || !img.complete || img.naturalWidth === 0) return;
        
        const h = this.width * (img.naturalHeight / img.naturalWidth);
        ctx.save(); 
        ctx.globalAlpha = this.opacity; 
        ctx.translate(this.x, this.y);
        if (this.direction === -1) ctx.scale(-1, 1);
        ctx.drawImage(img, -this.width / 2, -h / 2, this.width, h); 
        ctx.restore();
    }
}

for (let i = 0; i < 25; i++) { fishes.push(new SwimmingFish()); }

function animateBg() { 
    if(ctx && canvas) { 
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        fishes.forEach(f => { f.update(); f.draw(); }); 
    } 
    requestAnimationFrame(animateBg); 
}

setInterval(() => { 
    window.GAME_STATE.isDay = !window.GAME_STATE.isDay; 
    const gc = safeGet('game-container');
    if(gc) gc.className = window.GAME_STATE.isDay ? 'day-mode' : 'night-mode'; 
    const ti = safeGet('time-indicator');
    if(ti) ti.innerText = window.GAME_STATE.isDay ? "☀️ Dia" : "🌙 Noite"; 
}, 45000);

setTimeout(() => { 
    window.updateUI(); 
    if(canvas) animateBg(); 
}, 500);