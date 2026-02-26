/* ==========================================
   1. CONFIGURAÇÕES E ESTADO
   ========================================== */
const GAME_STATE = {
    coins: 0,
    currentRodIndex: 0,
    isFishing: false,
    rods: [],
    ownedRods: [0],
    ownedSinkers: ['chumbo'],
    currentSinker: 'chumbo',
    baitInventory: {},
    currentBait: null,
    loadedImages: {}, // Guarda as imagens carregadas
    collection: {},
    collection67: {},
    isDay: true
};

/* ==========================================
   2. DADOS DO JOGO
   ========================================== */
// --- CHUMBADAS (Equipamentos Permanentes) ---
const SINKERS = [
    // --- TIER 1: Básico (Foco em progressão inicial de velocidade) ---
    { id: 'chumbo', name: 'Chumbo Padrão', price: 0, desc: 'Padrão. Faz o trabalho.', stats: {} },
    { id: 'pedra_lisa', name: 'Pedra de Rio', price: 500, desc: '+15% Velocidade', stats: { speed: 1.15 } },
    { id: 'ferro', name: 'Peso de Ferro', price: 1500, desc: '+30% Velocidade', stats: { speed: 1.30 } },
    { id: 'ceramica', name: 'Cerâmica Veloz', price: 5000, desc: '+50% Velocidade', stats: { speed: 1.5 } },

    // --- TIER 2: Especializados (Focados em utilidade única) ---
    { id: 'bronze', name: 'Sino de Bronze', price: 12000, desc: 'Som atrai peixes (+20% Sorte)', stats: { luck: 1.2 } },
    { id: 'magnetica', name: 'Magneto da Sorte', price: 25000, desc: '+50% Sorte', stats: { luck: 1.5 } },
    { id: 'tungstenio', name: 'Gota de Tungstênio', price: 45000, desc: 'Ultra pesado (Velocidade x2.0)', stats: { speed: 2.0 } },
    { id: 'ouro', name: 'Pepita de Ouro', price: 75000, desc: 'Atrai riqueza (+50% Lucro)', stats: { value: 1.5 } },

    // --- TIER 3: Híbridos (Início do Late Game) ---
    { id: 'ancestral', name: 'Pedra Ancestral', price: 150000, desc: '+5% Chance 67cm', stats: { chance67: 0.05 } },
    { id: 'sonar', name: 'Sonar Subaquático', price: 250000, desc: 'Vel x2.0 | Sorte x1.5', stats: { speed: 2.0, luck: 1.5 } },
    { id: 'platina', name: 'Lingote de Platina', price: 400000, desc: 'Lucro x2.5', stats: { value: 2.5 } },
    { id: 'rubi', name: 'Rubi das Profundezas', price: 750000, desc: '+10% Chance 67cm | Lucro x1.5', stats: { chance67: 0.10, value: 1.5 } },

    // --- TIER 4: Míticos (Para quem quer quebrar o jogo) ---
    { id: 'atlantida', name: 'Relíquia de Atlântida', price: 1500000, desc: 'Tecnologia perdida (Sorte x3.5)', stats: { luck: 3.5 } },
    { id: 'meteorito', name: 'Fragmento de Meteoro', price: 3000000, desc: 'Velocidade x3.5 | +15% 67cm', stats: { speed: 3.5, chance67: 0.15 } },
    { id: 'antimateria', name: 'Gota de Antimatéria', price: 7500000, desc: 'Velocidade x5.0 | Lucro x3.0', stats: { speed: 5.0, value: 3.0 } },

    // --- TIER 5: Divinos (Objetivos Finais) ---
    { id: 'coracao_mar', name: 'Coração do Oceano', price: 20000000, desc: 'Sorte x6.0 | +25% 67cm', stats: { luck: 6.0, chance67: 0.25 } },
    { id: 'buraco_negro', name: 'Mini Buraco Negro', price: 50000000, desc: 'Suga tudo! (Vel x10, Sorte x10, Lucro x10)', stats: { speed: 10.0, luck: 10.0, value: 10.0, chance67: 0.40 } }
];

// --- ISCAS (De Iniciante a Nível Deus) ---
const BAITS = [
    // --- INICIANTES (Foco em economia e volume) ---
    { id: 'pao', icon: '🍞', name: 'Miolo de Pão', price: 20, qty: 10, desc: 'Sorte Mínima', stats: { luck: 1.05 } },
    { id: 'minhoca', icon: '🐛', name: 'Minhoca', price: 50, qty: 5, desc: 'Sorte Leve', stats: { luck: 1.2 } },
    { id: 'grilo', icon: '🦗', name: 'Grilo Falante', price: 100, qty: 5, desc: 'Sorte Média', stats: { luck: 1.5 } },
    { id: 'queijo', icon: '🧀', name: 'Queijo Fedido', price: 150, qty: 5, desc: 'Lucro Leve', stats: { value: 1.5 } },
    { id: 'camarao', icon: '🦐', name: 'Camarão', price: 200, qty: 5, desc: 'Sorte Alta', stats: { luck: 2.0 } },
    { id: 'vagalume', icon: '✨', name: 'Vagalume', price: 350, qty: 5, desc: 'Sorte x1.5 | +1% 67cm', stats: { luck: 1.5, chance67: 0.01 } },
    { id: 'estrela', icon: '⭐', name: 'Pó Estelar', price: 500, qty: 5, desc: '+Chance 67', stats: { chance67: 0.03 } },

    // --- INTERMEDIÁRIAS (Melhor custo-benefício) ---
    { id: 'isca_metal', icon: '🪝', name: 'Isca de Metal', price: 800, qty: 5, desc: 'Lucro x2.0', stats: { value: 2.0 } },
    { id: 'diamante', icon: '💎', name: 'Isca Rica', price: 1000, qty: 5, desc: 'Lucro Alto', stats: { value: 3.0 } },
    { id: 'lula', icon: '🦑', name: 'Lula Gigante', price: 1500, qty: 5, desc: 'Sorte Extrema', stats: { luck: 4.0 } },
    { id: 'sushi', icon: '🍣', name: 'Sushi Premium', price: 2500, qty: 5, desc: 'Sorte x2.5 | Lucro x2.5', stats: { luck: 2.5, value: 2.5 } },
    { id: 'cometa', icon: '☄️', name: 'Pó de Cometa', price: 4000, qty: 3, desc: '+8% Chance 67cm', stats: { chance67: 0.08 } },

    // --- AVANÇADAS (Caras e com quantidades menores) ---
    { id: 'hamburguer', icon: '🍔', name: 'Podrão dos Mares', price: 75000, qty: 5, desc: 'Lucro Extremo (x5.0)', stats: { value: 5.0 } },
    { id: 'radioativa', icon: '☢️', name: 'Isca Mutante', price: 150000, qty: 3, desc: 'Atrai Anomalias (Sorte x8)', stats: { luck: 8.0 } },
    { id: 'kraken', icon: '👁️', name: 'Olho do Kraken', price: 300000, qty: 3, desc: 'Garante Gigantes (+15% 67cm)', stats: { chance67: 0.15 } },
    { id: 'moeda_ouro', icon: '🪙', name: 'Moeda Amaldiçoada', price: 500000, qty: 3, desc: 'Lucro Absurdo (x10.0)', stats: { value: 10.0 } },

    // --- LENDÁRIAS E DIVINAS (End-game money sinks) ---
    { id: 'vazio', icon: '🌌', name: 'Essência do Vazio', price: 1000000, qty: 2, desc: 'Sorte Divina (x20.0)', stats: { luck: 20.0 } },
    { id: 'sol', icon: '☀️', name: 'Fragmento Solar', price: 2500000, qty: 2, desc: 'Astro-Rei (+30% 67cm)', stats: { chance67: 0.30 } },
    { id: 'definitiva', icon: '👑', name: 'A Isca Definitiva', price: 10000000, qty: 1, desc: 'O poder de um Deus na ponta da linha.', stats: { luck: 35.0, value: 20.0, chance67: 0.50 } }
];

const RARITIES = {
    COMUM: {
        id: 'comum', prob: 0.50, mult: 1, style: 'text-comum', border: 'border-comum', name: 'Comum', variations: [
            { name: 'Peixe Genérico', image: 'img/Genericfish001.webp', time: 'all' },
            { name: 'Bombardilo', image: 'img/bombardilo crocarilho.webp', time: 'day' },
            { name: 'Ah, peixe legal', image: 'img/PeixeLegal.avif', time: 'all' },
            { name: 'Cruel kidfish', image: 'img/KidFish.png', time: 'night' }
        ]
    },
    RARO: {
        id: 'raro', prob: 0.25, mult: 3, style: 'text-raro', border: 'border-raro', name: 'Raro', variations: [
            { name: 'Peixe Estranho', image: 'img/UnderWaterAhhFish.png', time: 'night' },
            { name: 'Meu çélebro', image: 'img/tarlalareo fish.png', time: 'all' },
            { name: 'PUTAPEIXE', image: 'img/PUTARALHOFISH, porra.png', time: 'all' }
        ]
    },
    EPICO: {
        id: 'epico', prob: 0.15, mult: 8, style: 'text-epico', border: 'border-epico', name: 'Épico', variations: [
            { name: 'Mahi-Mahi', image: 'img/Mahi-Mahifish square.webp', time: 'all' },
            { name: 'Peixe Otário', image: 'img/PeixeOtario.png', time: 'day' }]
    },
    LENDARIO: {
        id: 'lendario', prob: 0.07, mult: 20, style: 'text-lendario', border: 'border-lendario', name: 'Lendário', variations: [
            { name: 'Peixe Motosserra', image: 'img/Chainsawfish.webp', time: 'night' },
            { name: 'Peixe Demônio negro', image: 'img/DemonicAHHfish (1).png', time: 'night' }
        ]
    },
    MITICO: {
        id: 'mitico', prob: 0.025, mult: 50, style: 'text-mitico', border: 'border-mitico', name: 'Mítico', variations: [
            { name: 'Jogo do Peixe Retardo', image: 'img/GameofRetardedfish.png', time: 'night' },
            { name: 'Peixe Câncer', image: 'img/PeixeCancer.png', time: 'all' },
            { name: 'Meus filhos ', image: 'img/cardume dos meus filhos.png', time: 'all' }]
    },
    SECRETO: {
        id: 'secreto', prob: 0.004, mult: 150, style: 'text-secreto', border: 'border-secreto', name: 'Secreto', variations: [
            { name: 'Peixe Retardado', image: 'img/Retardedfish.png', time: 'all' }]
    },
    DIVINO: {
        id: 'divino', prob: 0.001, mult: 500, style: 'text-divino', border: 'border-divino', name: 'Divino', variations: [
            { name: 'Quase Arco-íris', image: 'img/Semi-rainbowfish.png', time: 'day' },
            { name: 'Só mais um pouco', image: 'img/meus porrinhas.png', time: 'night' },
            { name: 'SHIGERU?', image: 'img/ShigeruFish.png', time: 'all' },
            { name: 'SHIGERU DO ORGULHO???', image: 'img/PrideShigeruFish.png', time: 'night' }
        ]
    }
};

// PRÉ-CARREGAMENTO DAS IMAGENS
function preloadImages() {
    Object.values(RARITIES).forEach(rarity => {
        rarity.variations.forEach(fish => {
            const img = new Image();
            img.src = fish.image;
            GAME_STATE.loadedImages[fish.image] = img;
        });
    });
    ['img/67comum.jpg', 'img/67raro.jpg', 'img/67muitoraro.webp'].forEach(src => {
        const img = new Image();
        img.src = src;
    });
}
preloadImages();

// GERAÇÃO DAS VARAS
function generateRods() {
    const names = ["Galho Seco", "Vara de Plástico", "Vara de Bambu", "Bambu Reforçado", "Fibra de Vidro", "Fibra Premium", "Alumínio Leve", "Alumínio Aeronáutico", "Carbono Básico", "Carbono Pro", "Grafite Flex", "Grafite Titânio", "Vara Oceânica", "Mestre dos Mares", "Caçadora de Mitos", "Arpão Antigo", "Tridente de Netuno", "Vara Galáctica", "Vara Quântica", "A Vara do Criador"];
    return names.map((name, index) => {
        const price = index === 0 ? 0 : Math.floor(100 * Math.pow(1.6, index));
        return { id: index, name: name, price: price, speed: 1 + (index * 0.4), luck: 1 + (index * 0.25) };
    });
}
GAME_STATE.rods = generateRods();

/* ==========================================
   3. SELETORES DOM & SALVAMENTO
   ========================================== */
const elCoins = document.getElementById('cat-coins');
const elCastBtn = document.getElementById('cast-btn');
const elCat = document.getElementById('cat-fisherman');
const elLineContainer = document.getElementById('line-container');
const elHookedFishImg = document.getElementById('hooked-fish-img');
const elRodDisplay = document.getElementById('current-rod-display');
const elRodVisual = document.querySelector('.rod-visual');
const elGameContainer = document.getElementById('game-container');
const elTimeIndicator = document.getElementById('time-indicator');
const elBaitVisual = document.getElementById('bait-visual');
const elSinkerSlot = document.getElementById('sinker-slot');
const elBaitSlot = document.getElementById('bait-slot');
const elSaveStatus = document.getElementById('save-status');

const elShopModal = document.getElementById('shop-modal');
const elCollectionModal = document.getElementById('collection-modal');
const elCollection67Modal = document.getElementById('collection-67-modal');
const elOpenShopBtn = document.getElementById('open-shop-btn');
const elOpenCollectionBtn = document.getElementById('open-collection-btn');
const elOpen67Btn = document.getElementById('open-67-btn');
const elCloseShopBtn = document.getElementById('close-shop-btn');
const elCloseCollectionBtn = document.getElementById('close-collection-btn');
const elClose67Btn = document.getElementById('close-67-btn');
const elExitBtn = document.getElementById('exit-game-btn');
const elShopContainer = document.getElementById('shop-container');
const elCollectionGrid = document.getElementById('collection-grid');
const elCollection67Grid = document.getElementById('collection-67-grid');
const elCollectionProgress = document.getElementById('collection-progress');
const elCollection67Progress = document.getElementById('collection-67-progress');

// --- SISTEMA DE SALVAMENTO BLINDADO ---
function updateSaveStatus(msg) { if (elSaveStatus) elSaveStatus.innerText = msg; }

function saveGame() {
    // Salva estritamente os DADOS DO JOGADOR, ignorando imagens e referências do sistema.
    const playerSave = {
        coins: GAME_STATE.coins,
        currentRodIndex: GAME_STATE.currentRodIndex,
        ownedRods: GAME_STATE.ownedRods,
        ownedSinkers: GAME_STATE.ownedSinkers,
        currentSinker: GAME_STATE.currentSinker,
        baitInventory: GAME_STATE.baitInventory,
        currentBait: GAME_STATE.currentBait,
        collection: GAME_STATE.collection,
        collection67: GAME_STATE.collection67
    };
    localStorage.setItem('gatoPescadorSave', JSON.stringify(playerSave));
    updateSaveStatus("✅ Salvo Localmente");
}

function loadGame() {
    const localData = localStorage.getItem('gatoPescadorSave');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            // Injeta apenas os valores salvos no estado do jogo
            GAME_STATE.coins = parsed.coins || 0;
            GAME_STATE.currentRodIndex = parsed.currentRodIndex || 0;
            GAME_STATE.ownedRods = parsed.ownedRods || [0];
            GAME_STATE.ownedSinkers = parsed.ownedSinkers || ['chumbo'];
            GAME_STATE.currentSinker = parsed.currentSinker || 'chumbo';
            GAME_STATE.baitInventory = parsed.baitInventory || {};
            GAME_STATE.currentBait = parsed.currentBait || null;
            GAME_STATE.collection = parsed.collection || {};
            GAME_STATE.collection67 = parsed.collection67 || {};
            updateSaveStatus("👤 Jogo Carregado");
        } catch (e) {
            console.error("Save corrompido", e);
            updateSaveStatus("Erro ao Carregar");
        }
    } else {
        updateSaveStatus("Novo Jogo");
    }
    updateUI();
}

loadGame();
setInterval(saveGame, 30000);

elExitBtn.onclick = () => {
    elExitBtn.innerText = "Salvando...";
    elExitBtn.disabled = true;
    saveGame();
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
};

/* ==========================================
   4. CICLO DIA E NOITE
   ========================================== */
const CYCLE_DURATION = 45000;
let timeInterval;
function startTimeCycle() {
    setDayMode();
    timeInterval = setInterval(() => {
        GAME_STATE.isDay = !GAME_STATE.isDay;
        if (GAME_STATE.isDay) setDayMode(); else setNightMode();
    }, CYCLE_DURATION);
}
function setDayMode() { elGameContainer.classList.remove('night-mode'); elGameContainer.classList.add('day-mode'); elTimeIndicator.innerText = "☀️ Dia"; }
function setNightMode() { elGameContainer.classList.remove('day-mode'); elGameContainer.classList.add('night-mode'); elTimeIndicator.innerText = "🌙 Noite"; }
startTimeCycle();

/* ==========================================
   5. SISTEMA DE PESCA E MODIFICADORES
   ========================================== */
function calculateCatch() {
    const rod = GAME_STATE.rods[GAME_STATE.currentRodIndex] || GAME_STATE.rods[0];
    const sinker = SINKERS.find(s => s.id === GAME_STATE.currentSinker) || SINKERS[0];
    const bait = GAME_STATE.currentBait ? BAITS.find(b => b.id === GAME_STATE.currentBait) : null;

    let luckFactor = rod.luck;
    if (sinker.stats.luck) luckFactor *= sinker.stats.luck;
    if (bait && bait.stats.luck) luckFactor *= bait.stats.luck;

    const rand = Math.random();
    let caughtRarity = RARITIES.COMUM;

    if (rand < RARITIES.DIVINO.prob * luckFactor) caughtRarity = RARITIES.DIVINO;
    else if (rand < RARITIES.SECRETO.prob * luckFactor) caughtRarity = RARITIES.SECRETO;
    else if (rand < RARITIES.MITICO.prob * luckFactor) caughtRarity = RARITIES.MITICO;
    else if (rand < RARITIES.LENDARIO.prob * luckFactor) caughtRarity = RARITIES.LENDARIO;
    else if (rand < RARITIES.EPICO.prob * luckFactor) caughtRarity = RARITIES.EPICO;
    else if (rand < RARITIES.RARO.prob * luckFactor) caughtRarity = RARITIES.RARO;

    const validVariations = caughtRarity.variations.filter(v =>
        v.time === 'all' || (GAME_STATE.isDay && v.time === 'day') || (!GAME_STATE.isDay && v.time === 'night')
    );

    let specificFish = validVariations.length > 0 ? validVariations[Math.floor(Math.random() * validVariations.length)] : RARITIES.COMUM.variations[0];
    if (validVariations.length === 0) caughtRarity = RARITIES.COMUM;

    let chance67 = 0.0005;
    if (sinker.stats.chance67) chance67 += sinker.stats.chance67;
    if (bait && bait.stats.chance67) chance67 += bait.stats.chance67;

    const sizeBase = 10 + (Object.keys(RARITIES).indexOf(caughtRarity.id.toUpperCase()) * 15);
    const sizeRand = Math.floor(Math.random() * 60);
    let finalSize = sizeBase + sizeRand;

    if (Math.random() < chance67) finalSize = 67;

    let value = Math.floor(finalSize * caughtRarity.mult);
    if (sinker.stats.value) value = Math.floor(value * sinker.stats.value);
    if (bait && bait.stats.value) value = Math.floor(value * bait.stats.value);

    return { rarity: caughtRarity, variation: specificFish, size: finalSize, value: value };
}

function castLine() {
    if (GAME_STATE.isFishing) return;

    if (GAME_STATE.currentBait) {
        if (GAME_STATE.baitInventory[GAME_STATE.currentBait] > 0) {
            GAME_STATE.baitInventory[GAME_STATE.currentBait]--;
            if (GAME_STATE.baitInventory[GAME_STATE.currentBait] <= 0) GAME_STATE.currentBait = null;
        } else { GAME_STATE.currentBait = null; }
    }
    updateUI();

    GAME_STATE.isFishing = true;
    const rod = GAME_STATE.rods[GAME_STATE.currentRodIndex] || GAME_STATE.rods[0];
    const sinker = SINKERS.find(s => s.id === GAME_STATE.currentSinker) || SINKERS[0];

    elCastBtn.disabled = true; elCastBtn.innerText = "Descendo...";
    elCat.classList.remove('cat-idle'); elCat.classList.add('cat-fishing');
    elHookedFishImg.style.display = 'none';

    const maxScreenDepth = window.innerHeight - 150;
    const rodDepthRatio = 0.3 + ((rod.id + 1) / 20 * 0.7);
    let targetDepth = Math.floor(maxScreenDepth * rodDepthRatio);
    if (targetDepth < 150) targetDepth = 150;

    let speedMult = rod.speed;
    if (sinker.stats.speed) speedMult *= sinker.stats.speed;

    const travelTime = Math.max(400, 2000 - (rod.id * 80)) / (speedMult || 1);

    elLineContainer.style.transition = `height ${travelTime}ms ease-in`;
    elLineContainer.style.height = `${targetDepth}px`;

    setTimeout(() => {
        elCastBtn.innerText = "Fisgou!";
        hookFishAndReel(travelTime);
    }, travelTime + 1000);
}

function hookFishAndReel(travelTime) {
    const fish = calculateCatch();
    elHookedFishImg.src = fish.variation.image;
    elHookedFishImg.style.display = 'block';

    const reelTime = travelTime * 0.8;
    elLineContainer.style.transition = `height ${reelTime}ms ease-out`;
    elLineContainer.style.height = `0px`;

    setTimeout(() => { finishFishing(fish); }, reelTime);
}

function finishFishing(fish) {
    GAME_STATE.coins += fish.value;
    const fishName = fish.variation.name;
    let sealImage = null;

    if (fish.size === 67) {
        if (!GAME_STATE.collection67[fishName]) GAME_STATE.collection67[fishName] = 0;
        GAME_STATE.collection67[fishName]++;

        const rid = fish.rarity.id;
        if (rid === 'comum' || rid === 'raro') sealImage = 'img/67comum.jpg';
        else if (rid === 'epico' || rid === 'lendario') sealImage = 'img/67raro.jpg';
        else sealImage = 'img/67muitoraro.webp';
    } else {
        if (!GAME_STATE.collection[fishName]) GAME_STATE.collection[fishName] = 0;
        GAME_STATE.collection[fishName]++;
    }

    updateUI();
    showPopup(fish, sealImage);
    saveGame();

    elHookedFishImg.style.display = 'none';
    GAME_STATE.isFishing = false;
    elCastBtn.disabled = false;
    elCastBtn.innerText = "Pescar (Espaço)";
    elCat.classList.remove('cat-fishing');
    elCat.classList.add('cat-idle');
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !GAME_STATE.isFishing) { e.preventDefault(); castLine(); }
});

/* ==========================================
   6. UI, LOJA E AQUÁRIOS
   ========================================== */
function showPopup(fish, sealImage) {
    const div = document.createElement('div');
    div.className = `catch-popup ${fish.rarity.border}`;

    const imgClass = sealImage ? 'popup-fish-img fish-flash' : 'popup-fish-img';
    let sealHtml = sealImage ? `<img src="${sealImage}" class="popup-seal" alt="Selo">` : '';

    let timeIcon = '🌗 Ambos';
    if (fish.variation.time === 'day') timeIcon = '☀️ Dia';
    else if (fish.variation.time === 'night') timeIcon = '🌙 Noite';

    div.innerHTML = `
        <div class="fish-visual-container">
            <img src="${fish.variation.image}" class="${imgClass}" alt="${fish.variation.name}">
            ${sealHtml}
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
        setTimeout(() => { if (div.parentNode) div.parentNode.removeChild(div); }, 500);
    }, 2500);
}

function updateUI() {
    elCoins.innerText = GAME_STATE.coins.toLocaleString();
    const currentRod = GAME_STATE.rods[GAME_STATE.currentRodIndex] || GAME_STATE.rods[0];
    elRodDisplay.innerText = `Vara: ${currentRod.name}`;
    elRodVisual.className = 'rod-visual';
    elRodVisual.classList.add(`rod-tier-${currentRod.id}`);

    const sinker = SINKERS.find(s => s.id === GAME_STATE.currentSinker) || SINKERS[0];
    elSinkerSlot.innerText = `🪨 ${sinker.name}`;

    if (GAME_STATE.currentBait) {
        const bait = BAITS.find(b => b.id === GAME_STATE.currentBait);
        if (bait) {
            const qty = GAME_STATE.baitInventory[bait.id] || 0;
            elBaitSlot.innerText = `${bait.icon} ${bait.name} (x${qty})`;
            elBaitVisual.innerText = bait.icon;
        }
    } else {
        elBaitSlot.innerText = "🪝 Sem Isca";
        elBaitVisual.innerText = "";
    }

    if (!elShopModal.classList.contains('hidden')) renderShop();
    if (!elCollectionModal.classList.contains('hidden')) renderCollection();
    if (!elCollection67Modal.classList.contains('hidden')) renderCollection67();
}

// Interações Botões Menu
elOpenShopBtn.onclick = () => { elShopModal.classList.remove('hidden'); renderShop(); };
elCloseShopBtn.onclick = () => elShopModal.classList.add('hidden');
elOpenCollectionBtn.onclick = () => { elCollectionModal.classList.remove('hidden'); renderCollection(); };
elCloseCollectionBtn.onclick = () => elCollectionModal.classList.add('hidden');
elOpen67Btn.onclick = () => { elCollection67Modal.classList.remove('hidden'); renderCollection67(); };
elClose67Btn.onclick = () => elCollection67Modal.classList.add('hidden');

function buyRod(index) {
    const item = GAME_STATE.rods[index];
    if (GAME_STATE.ownedRods.includes(index)) { GAME_STATE.currentRodIndex = index; }
    else if (GAME_STATE.coins >= item.price) {
        GAME_STATE.coins -= item.price;
        GAME_STATE.ownedRods.push(index);
        GAME_STATE.currentRodIndex = index;
    }
    updateUI(); saveGame();
}

function buySinker(id) {
    const item = SINKERS.find(s => s.id === id);
    if (GAME_STATE.ownedSinkers.includes(id)) { GAME_STATE.currentSinker = id; }
    else if (GAME_STATE.coins >= item.price) {
        GAME_STATE.coins -= item.price;
        GAME_STATE.ownedSinkers.push(id);
        GAME_STATE.currentSinker = id;
    }
    updateUI(); saveGame();
}

function buyBait(id) {
    const item = BAITS.find(b => b.id === id);
    if (GAME_STATE.coins >= item.price) {
        GAME_STATE.coins -= item.price;
        if (!GAME_STATE.baitInventory[id]) GAME_STATE.baitInventory[id] = 0;
        GAME_STATE.baitInventory[id] += item.qty;
        if (!GAME_STATE.currentBait) GAME_STATE.currentBait = id;
    }
    updateUI(); saveGame();
}

function equipBait(id) {
    if (GAME_STATE.baitInventory[id] > 0) { GAME_STATE.currentBait = id; updateUI(); }
}

function renderShop() {
    elShopContainer.innerHTML = '';

    const titleRods = document.createElement('div'); titleRods.className = 'shop-section-title'; titleRods.innerText = "🎣 Varas"; elShopContainer.appendChild(titleRods);
    GAME_STATE.rods.forEach(rod => {
        const div = document.createElement('div'); const isOwned = GAME_STATE.ownedRods.includes(rod.id); const isEquipped = GAME_STATE.currentRodIndex === rod.id;
        const statusClass = isOwned ? (isEquipped ? 'equipped' : 'owned') : ''; const btnText = isOwned ? (isEquipped ? "Equipado" : "Equipar") : `💰 ${rod.price}`;
        div.className = `rod-card ${statusClass}`; div.innerHTML = `<div>${rod.name}</div><div class="rod-tier-${rod.id}" style="height:4px;width:80%;margin:2px auto;"></div><div style="font-size:0.7rem;color:#666">Sorte +${Math.round((rod.luck - 1) * 100)}%</div><div style="font-weight:bold;font-size:0.8rem;color:${isOwned ? '#2ecc71' : '#e67e22'}">${btnText}</div>`;
        div.onclick = () => buyRod(rod.id); elShopContainer.appendChild(div);
    });

    const titleSinkers = document.createElement('div'); titleSinkers.className = 'shop-section-title'; titleSinkers.innerText = "🪨 Chumbadas"; elShopContainer.appendChild(titleSinkers);
    SINKERS.forEach(sinker => {
        const div = document.createElement('div'); const isOwned = GAME_STATE.ownedSinkers.includes(sinker.id); const isEquipped = GAME_STATE.currentSinker === sinker.id;
        const statusClass = isOwned ? (isEquipped ? 'equipped' : 'owned') : ''; const btnText = isOwned ? (isEquipped ? "Equipado" : "Equipar") : `💰 ${sinker.price}`;
        div.className = `gear-card ${statusClass}`; div.innerHTML = `<div>${sinker.name}</div><div style="font-size:0.7rem;color:#555">${sinker.desc}</div><div style="font-weight:bold;font-size:0.8rem;color:${isOwned ? '#2ecc71' : '#e67e22'}">${btnText}</div>`;
        div.onclick = () => buySinker(sinker.id); elShopContainer.appendChild(div);
    });

    const titleBaits = document.createElement('div'); titleBaits.className = 'shop-section-title'; titleBaits.innerText = "🪝 Iscas (Consumíveis)"; elShopContainer.appendChild(titleBaits);
    BAITS.forEach(bait => {
        const div = document.createElement('div'); const count = GAME_STATE.baitInventory[bait.id] || 0; const isEquipped = GAME_STATE.currentBait === bait.id;
        const statusClass = isEquipped ? 'equipped' : (count > 0 ? 'owned' : '');
        div.className = `gear-card ${statusClass}`; div.innerHTML = `${count > 0 ? `<div class="stack-count">x${count}</div>` : ''}<div style="font-size:1.5rem">${bait.icon}</div><div>${bait.name}</div><div style="font-size:0.7rem;color:#555">${bait.desc}</div><div style="font-weight:bold;font-size:0.8rem;color:#e67e22">💰 ${bait.price} (x${bait.qty})</div>`;
        div.onclick = () => { if (count > 0 && !isEquipped) equipBait(bait.id); else buyBait(bait.id); }; elShopContainer.appendChild(div);
    });
}

function renderCollection() {
    elCollectionGrid.innerHTML = ''; let total = 0; let unlocked = 0;
    Object.values(RARITIES).forEach(rarity => { rarity.variations.forEach(fish => { total++; const count = GAME_STATE.collection[fish.name] || 0; if (count > 0) unlocked++; createCard(elCollectionGrid, fish, rarity, count, false); }); });
    elCollectionProgress.innerText = `(${unlocked}/${total})`;
}
function renderCollection67() {
    elCollection67Grid.innerHTML = ''; let total = 0; let unlocked = 0;
    Object.values(RARITIES).forEach(rarity => { rarity.variations.forEach(fish => { total++; const count = GAME_STATE.collection67[fish.name] || 0; if (count > 0) unlocked++; createCard(elCollection67Grid, fish, rarity, count, true); }); });
    elCollection67Progress.innerText = `(${unlocked}/${total})`;
}

function createCard(container, fish, rarity, count, is67) {
    const isUnlocked = count > 0; let cardClass = `collection-card ${isUnlocked ? 'unlocked' : 'locked'}`; if (is67) cardClass += ' special-67';
    let sealHtml = '';
    if (is67 && isUnlocked) {
        const rid = rarity.id; let s = 'img/67comum.jpg'; if (rid === 'epico' || rid === 'lendario') s = 'img/67raro.jpg'; else if (rid === 'mitico' || rid === 'secreto' || rid === 'divino') s = 'img/67muitoraro.webp'; sealHtml = `<img src="${s}" class="collection-seal">`;
    }
    const div = document.createElement('div'); div.className = cardClass; let timeIcon = fish.time === 'day' ? '☀️' : (fish.time === 'night' ? '🌙' : '');
    div.innerHTML = `${isUnlocked ? `<div class="count-badge">x${count}</div>` : ''}<div style="position: absolute; top: 2px; left: 5px; font-size: 0.7rem;">${timeIcon}</div><img src="${fish.image}" class="collection-img" onerror="this.src='https://placehold.co/50x50?text=?'">${sealHtml}<div style="font-size: 0.75rem; font-weight: bold; color: ${isUnlocked ? '#333' : '#999'}">${fish.name}</div><div style="font-size: 0.65rem; color: ${isUnlocked ? 'green' : '#ccc'}">${rarity.name}</div>`;
    container.appendChild(div);
}

/* ==========================================
   7. BACKGROUND ANIMADO (CORRIGIDO)
   ========================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const fishes = [];

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function pickRandomFishForBg() {
    const rand = Math.random(); let r = RARITIES.COMUM;

    // Deixa o fundo mais realista, peixes raros aparecem menos
    if (rand < 0.005) r = RARITIES.DIVINO;
    else if (rand < 0.01) r = RARITIES.SECRETO;
    else if (rand < 0.03) r = RARITIES.MITICO;
    else if (rand < 0.08) r = RARITIES.LENDARIO;
    else if (rand < 0.20) r = RARITIES.EPICO;
    else if (rand < 0.40) r = RARITIES.RARO;

    const valid = r.variations.filter(v => v.time === 'all' || (GAME_STATE.isDay && v.time === 'day') || (!GAME_STATE.isDay && v.time === 'night'));
    const variation = valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : r.variations[0];
    return { rarity: r, variation: variation };
}

class SwimmingFish {
    constructor() { this.reset(true); }

    reset(initial = false) {
        const picked = pickRandomFishForBg();
        this.specificImage = picked.variation.image;

        // 0 = fundo, 1 = frente
        this.depth = Math.random();
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.y = Math.random() * (canvas.height - 200) + 200;

        // LIMITA O TAMANHO MÁXIMO para não ficarem gigantes e sumirem bizarramente
        let sizeBonus = Math.min(60, picked.rarity.mult * 0.8);
        this.width = (40 + sizeBonus) * (0.4 + (this.depth * 0.6));

        // Define uma margem de segurança baseada na largura para eles não sumirem na tela
        let safeBoundary = this.width + 100;
        this.x = initial ? Math.random() * canvas.width : (this.direction === 1 ? -safeBoundary : canvas.width + safeBoundary);

        this.speed = (0.5 + (this.depth * 1.5)) * this.direction;
        this.opacity = 0.1 + (this.depth * 0.4);
    }

    update() {
        this.x += this.speed;
        let safeBoundary = this.width + 100;

        // Verifica se passou BEM além da borda da tela antes de resetar
        if ((this.direction === 1 && this.x > canvas.width + safeBoundary) ||
            (this.direction === -1 && this.x < -safeBoundary)) {
            this.reset();
        }
    }

    draw() {
        const img = GAME_STATE.loadedImages[this.specificImage];

        // SEGURANÇA: Se a imagem não existe ou não carregou ainda, não tente desenhar, senão o código morre.
        if (!img || !img.complete || img.naturalWidth === 0) return;

        // Calcula a altura mantendo a proporção exata do peixe, para não o esmagar!
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const finalHeight = this.width * aspectRatio;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);

        if (this.direction === -1) ctx.scale(-1, 1);

        ctx.drawImage(img, -this.width / 2, -finalHeight / 2, this.width, finalHeight);
        ctx.restore();
    }
}

// Cria 25 peixes simultâneos
for (let i = 0; i < 25; i++) { fishes.push(new SwimmingFish()); }

function animateBg() {
    try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fishes.forEach(f => {
            f.update();
            f.draw();
        });
    } catch (e) {
        console.warn("Erro no canvas de fundo:", e);
    }
    requestAnimationFrame(animateBg);
}

elCastBtn.addEventListener('click', castLine);
animateBg();