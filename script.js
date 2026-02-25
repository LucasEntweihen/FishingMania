/* ==========================================
   1. CONFIGURAÇÕES E ESTADO
   ========================================== */
   const GAME_STATE = {
    coins: 0,
    currentRodIndex: 0,
    isFishing: false,
    rods: [], 
    ownedRods: [0],
    
    // SISTEMA DE CHUMBADAS (SINKERS)
    ownedSinkers: ['chumbo'], // IDs das chumbadas
    currentSinker: 'chumbo',

    // SISTEMA DE ISCAS (BAITS)
    baitInventory: {}, // Ex: { 'minhoca': 5 }
    currentBait: null, // ID da isca equipada ou null

    loadedImages: {},
    collection: {},     // Peixes normais
    collection67: {},   // Peixes 67cm
    isDay: true
};

/* ==========================================
   2. DADOS DO JOGO
   ========================================== */

// --- CHUMBADAS ---
const SINKERS = [
    { id: 'chumbo', name: 'Chumbo Padrão', price: 0, desc: 'Padrão.', stats: {} },
    { id: 'ceramica', name: 'Cerâmica Veloz', price: 5000, desc: '+Velocidade', stats: { speed: 1.5 } },
    { id: 'magnetica', name: 'Magneto da Sorte', price: 20000, desc: '+Sorte', stats: { luck: 1.5 } },
    { id: 'ouro', name: 'Pepita de Ouro', price: 50000, desc: '+Lucro', stats: { value: 1.5 } },
    { id: 'ancestral', name: 'Pedra Ancestral', price: 100000, desc: '+Chance 67cm', stats: { chance67: 0.05 } }
];

// --- ISCAS (Pacotes de 5) ---
const BAITS = [
    { id: 'minhoca', icon: '🐛', name: 'Minhoca', price: 50, qty: 5, desc: 'Sorte Leve', stats: { luck: 1.2 } },
    { id: 'camarao', icon: '🦐', name: 'Camarão', price: 200, qty: 5, desc: 'Sorte Alta', stats: { luck: 2.0 } },
    { id: 'estrela', icon: '⭐', name: 'Pó Estelar', price: 500, qty: 5, desc: '+Chance 67', stats: { chance67: 0.03 } },
    { id: 'diamante', icon: '💎', name: 'Isca Rica', price: 1000, qty: 5, desc: 'Lucro Alto', stats: { value: 3.0 } }
];

// --- PEIXES ---
const RARITIES = {
    COMUM: { 
        id: 'comum', prob: 0.50, mult: 1, style: 'text-comum', border: 'border-comum', name: 'Comum',
        variations: [
            { name: 'Peixe Genérico', image: 'img/Genericfish001.webp', time: 'all' },
            { name: 'Bombardilo', image: 'img/bombardilo crocarilho.webp', time: 'day' }
        ]
    },
    RARO: { 
        id: 'raro', prob: 0.25, mult: 3, style: 'text-raro', border: 'border-raro', name: 'Raro',
        variations: [
            { name: 'Peixe Estranho', image: 'img/UnderWaterAhhFish.png', time: 'night' },
            { name: 'Meu çélebro', image: 'img/tarlalareo fish.jpg', time: 'all' }
        ]
    },
    EPICO: { 
        id: 'epico', prob: 0.15, mult: 8, style: 'text-epico', border: 'border-epico', name: 'Épico',
        variations: [
            { name: 'Mahi-Mahi', image: 'img/Mahi-Mahifish square.webp', time: 'all' },
            { name: 'Peixe Otário', image: 'img/peixe otario.png', time: 'day' }
        ]
    },
    LENDARIO: { 
        id: 'lendario', prob: 0.07, mult: 20, style: 'text-lendario', border: 'border-lendario', name: 'Lendário',
        variations: [ { name: 'Peixe Motosserra', image: 'img/Chainsawfish.webp', time: 'night' } ]
    },
    MITICO: { 
        id: 'mitico', prob: 0.025, mult: 50, style: 'text-mitico', border: 'border-mitico', name: 'Mítico',
        variations: [
            { name: 'Jogo do Peixe Retardo', image: 'img/GameofRetardedfish.png', time: 'night' },
            { name: 'Peixe Câncer', image: 'img/peixe cancer.png', time: 'all' },
            { name: 'Meus filhos ', image: 'img/cardume dos meus filhos.png', time: 'all' }
        ]
    },
    SECRETO: { 
        id: 'secreto', prob: 0.004, mult: 150, style: 'text-secreto', border: 'border-secreto', name: 'Secreto',
        variations: [ { name: 'Peixe Retardado', image: 'img/Retardedfish.png', time: 'all' } ]
    },
    DIVINO: { 
        id: 'divino', prob: 0.001, mult: 500, style: 'text-divino', border: 'border-divino', name: 'Divino',
        variations: [ { name: 'Quase Arco-íris', image: 'img/Semi-rainbowfish.jpg', time: 'day' },
            { name: 'Só mais um pouco', image: 'img/meus porrinhas.png', time: 'night' }
         ]
    }
};

function preloadImages() {
    Object.values(RARITIES).forEach(rarity => {
        rarity.variations.forEach(fish => {
            const img = new Image(); img.src = fish.image; GAME_STATE.loadedImages[fish.image] = img;
        });
    });
    ['img/image_0.png', 'img/image_1.png', 'img/image_2.png'].forEach(src => {
        const img = new Image(); img.src = src;
    });
}
preloadImages();

function generateRods() {
    const names = [
        "Galho Seco", "Vara de Plástico", "Vara de Bambu", "Bambu Reforçado",
        "Fibra de Vidro", "Fibra Premium", "Alumínio Leve", "Alumínio Aeronáutico",
        "Carbono Básico", "Carbono Pro", "Grafite Flex", "Grafite Titânio",
        "Vara Oceânica", "Mestre dos Mares", "Caçadora de Mitos", "Arpão Antigo",
        "Tridente de Netuno", "Vara Galáctica", "Vara Quântica", "A Vara do Criador"
    ];
    return names.map((name, index) => {
        const price = index === 0 ? 0 : Math.floor(100 * Math.pow(1.6, index));
        return { id: index, name: name, price: price, speed: 1 + (index * 0.4), luck: 1 + (index * 0.25) };
    });
}
GAME_STATE.rods = generateRods();

/* ==========================================
   3. SELETORES DOM
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

// Modais e Botões
const elShopModal = document.getElementById('shop-modal');
const elCollectionModal = document.getElementById('collection-modal');
const elCollection67Modal = document.getElementById('collection-67-modal'); // NOVO
const elOpenShopBtn = document.getElementById('open-shop-btn');
const elOpenCollectionBtn = document.getElementById('open-collection-btn');
const elOpen67Btn = document.getElementById('open-67-btn'); // NOVO
const elCloseShopBtn = document.getElementById('close-shop-btn');
const elCloseCollectionBtn = document.getElementById('close-collection-btn');
const elClose67Btn = document.getElementById('close-67-btn'); // NOVO

const elShopContainer = document.getElementById('shop-container'); // Unificado
const elCollectionGrid = document.getElementById('collection-grid');
const elCollection67Grid = document.getElementById('collection-67-grid');
const elCollectionProgress = document.getElementById('collection-progress');
const elCollection67Progress = document.getElementById('collection-67-progress');

/* ==========================================
   4. CICLO DIA E NOITE
   ========================================== */
const CYCLE_DURATION = 45000; 
let timeInterval;
function startTimeCycle() {
    setDayMode();
    timeInterval = setInterval(() => {
        GAME_STATE.isDay = !GAME_STATE.isDay;
        if(GAME_STATE.isDay) setDayMode(); else setNightMode();
    }, CYCLE_DURATION);
}
function setDayMode() {
    elGameContainer.classList.remove('night-mode'); elGameContainer.classList.add('day-mode');
    elTimeIndicator.innerText = "☀️ Dia";
}
function setNightMode() {
    elGameContainer.classList.remove('day-mode'); elGameContainer.classList.add('night-mode');
    elTimeIndicator.innerText = "🌙 Noite";
}
startTimeCycle();

/* ==========================================
   5. SISTEMA DE PESCA E MODIFICADORES
   ========================================== */
function calculateCatch() {
    const rod = GAME_STATE.rods[GAME_STATE.currentRodIndex];
    
    // Recupera objetos da Chumbada e Isca
    const sinker = SINKERS.find(s => s.id === GAME_STATE.currentSinker);
    const bait = GAME_STATE.currentBait ? BAITS.find(b => b.id === GAME_STATE.currentBait) : null;

    // --- CÁLCULO DE SORTE ---
    // Base da vara * Mult Chumbada * Mult Isca
    let luckFactor = rod.luck;
    if (sinker.stats.luck) luckFactor *= sinker.stats.luck;
    if (bait && bait.stats.luck) luckFactor *= bait.stats.luck;
    
    // --- LÓGICA DE RARIDADE ---
    const rand = Math.random();
    let caughtRarity = RARITIES.COMUM;
    
    if (rand < RARITIES.DIVINO.prob * luckFactor) caughtRarity = RARITIES.DIVINO;
    else if (rand < RARITIES.SECRETO.prob * luckFactor) caughtRarity = RARITIES.SECRETO;
    else if (rand < RARITIES.MITICO.prob * luckFactor) caughtRarity = RARITIES.MITICO;
    else if (rand < RARITIES.LENDARIO.prob * luckFactor) caughtRarity = RARITIES.LENDARIO;
    else if (rand < RARITIES.EPICO.prob * luckFactor) caughtRarity = RARITIES.EPICO;
    else if (rand < RARITIES.RARO.prob * luckFactor) caughtRarity = RARITIES.RARO;

    // --- FILTRO DE HORÁRIO ---
    const validVariations = caughtRarity.variations.filter(v => 
        v.time === 'all' || (GAME_STATE.isDay && v.time === 'day') || (!GAME_STATE.isDay && v.time === 'night')
    );

    let specificFish;
    if (validVariations.length > 0) {
        specificFish = validVariations[Math.floor(Math.random() * validVariations.length)];
    } else {
        caughtRarity = RARITIES.COMUM;
        specificFish = RARITIES.COMUM.variations[0];
    }

    // --- CÁLCULO DE TAMANHO (CHANCE 67) ---
    // Base muito baixa (0.05%)
    let chance67 = 0.0005; 
    if (sinker.stats.chance67) chance67 += sinker.stats.chance67;
    if (bait && bait.stats.chance67) chance67 += bait.stats.chance67;

    const sizeBase = 10 + (Object.keys(RARITIES).indexOf(caughtRarity.id.toUpperCase()) * 15);
    const sizeRand = Math.floor(Math.random() * 60);
    let finalSize = sizeBase + sizeRand;
    
    if(Math.random() < chance67) finalSize = 67;

    // --- CÁLCULO DE VALOR (LUCRO) ---
    let value = Math.floor(finalSize * caughtRarity.mult);
    if (sinker.stats.value) value = Math.floor(value * sinker.stats.value);
    if (bait && bait.stats.value) value = Math.floor(value * bait.stats.value);

    return { rarity: caughtRarity, variation: specificFish, size: finalSize, value: value };
}

function castLine() {
    if (GAME_STATE.isFishing) return;
    
    // Verifica e consome isca
    if (GAME_STATE.currentBait) {
        if (GAME_STATE.baitInventory[GAME_STATE.currentBait] > 0) {
            GAME_STATE.baitInventory[GAME_STATE.currentBait]--;
            // Se acabar, desequipa
            if (GAME_STATE.baitInventory[GAME_STATE.currentBait] <= 0) {
                GAME_STATE.currentBait = null;
            }
        } else {
            GAME_STATE.currentBait = null;
        }
    }
    updateUI(); // Atualiza contadores de isca

    GAME_STATE.isFishing = true;
    const rod = GAME_STATE.rods[GAME_STATE.currentRodIndex];
    const sinker = SINKERS.find(s => s.id === GAME_STATE.currentSinker);

    elCastBtn.disabled = true; elCastBtn.innerText = "Descendo...";
    elCat.classList.remove('cat-idle'); elCat.classList.add('cat-fishing');
    elHookedFishImg.style.display = 'none';

    const maxScreenDepth = window.innerHeight - 150; 
    const rodDepthRatio = 0.3 + ((rod.id + 1) / 20 * 0.7);
    let targetDepth = Math.floor(maxScreenDepth * rodDepthRatio);
    if(targetDepth < 150) targetDepth = 150;
    
    // Velocidade afetada pela vara e pela chumbada
    let speedMult = rod.speed;
    if (sinker.stats.speed) speedMult *= sinker.stats.speed;

    const travelTime = Math.max(400, 2000 - (rod.id * 80)) / (sinker.stats.speed || 1);
    
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

    setTimeout(() => {
        finishFishing(fish);
    }, reelTime);
}

function finishFishing(fish) {
    GAME_STATE.coins += fish.value;
    const fishName = fish.variation.name;
    let sealImage = null;

    if (fish.size === 67) {
        // --- AQUÁRIO 67 ---
        if (!GAME_STATE.collection67[fishName]) GAME_STATE.collection67[fishName] = 0;
        GAME_STATE.collection67[fishName]++;
        
        const rid = fish.rarity.id;
        if (rid === 'comum' || rid === 'raro') sealImage = 'img/67comum.jpg';
        else if (rid === 'epico' || rid === 'lendario') sealImage = 'img/67raro.jpg';
        else sealImage = 'img/67muitoraro.webp';
    } else {
        // --- AQUÁRIO NORMAL ---
        if (!GAME_STATE.collection[fishName]) GAME_STATE.collection[fishName] = 0;
        GAME_STATE.collection[fishName]++;
    }
    
    updateUI();
    showPopup(fish, sealImage);
    
    elHookedFishImg.style.display = 'none';
    GAME_STATE.isFishing = false;
    elCastBtn.disabled = false;
    elCastBtn.innerText = "Pescar (Espaço)";
    elCat.classList.remove('cat-fishing');
    elCat.classList.add('cat-idle');
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); castLine(); }
});

/* ==========================================
   6. UI, LOJA E AQUÁRIOS
   ========================================== */
function showPopup(fish, sealImage) {
    const div = document.createElement('div');
    div.className = `catch-popup ${fish.rarity.border}`;
    const imgClass = sealImage ? 'fish-img fish-flash' : 'fish-img';
    let sealHtml = sealImage ? `<img src="${sealImage}" class="popup-seal">` : '';

    div.innerHTML = `
        <div class="fish-visual-container">
            <img src="${fish.variation.image}" class="${imgClass}">
            ${sealHtml}
        </div>
        <div class="rarity-label ${fish.rarity.style}">${fish.variation.name}</div>
        <div style="font-size: 0.9rem; color: #555;">${fish.size}cm</div>
        <div style="font-size: 1.2rem; color: #f39c12; font-weight: bold;">+${fish.value} 🪙</div>
    `;
    document.body.appendChild(div);
    setTimeout(() => {
        div.style.transition = "opacity 0.5s"; div.style.opacity = "0";
        setTimeout(() => div.remove(), 500);
    }, 2500);
}

function updateUI() {
    elCoins.innerText = GAME_STATE.coins.toLocaleString();
    const currentRod = GAME_STATE.rods[GAME_STATE.currentRodIndex];
    elRodDisplay.innerText = `Vara: ${currentRod.name}`;
    elRodVisual.className = 'rod-visual'; 
    elRodVisual.classList.add(`rod-tier-${currentRod.id}`);

    // Atualiza Slots de Equipamento
    const sinker = SINKERS.find(s => s.id === GAME_STATE.currentSinker);
    elSinkerSlot.innerText = `🪨 ${sinker.name}`;
    
    if (GAME_STATE.currentBait) {
        const bait = BAITS.find(b => b.id === GAME_STATE.currentBait);
        const qty = GAME_STATE.baitInventory[bait.id];
        elBaitSlot.innerText = `${bait.icon} ${bait.name} (x${qty})`;
        elBaitVisual.innerText = bait.icon;
    } else {
        elBaitSlot.innerText = "🪝 Sem Isca";
        elBaitVisual.innerText = "";
    }
    
    if (!elShopModal.classList.contains('hidden')) renderShop();
    if (!elCollectionModal.classList.contains('hidden')) renderCollection();
    if (!elCollection67Modal.classList.contains('hidden')) renderCollection67();
}

// --- LOJA UNIFICADA ---
elOpenShopBtn.onclick = () => { elShopModal.classList.remove('hidden'); renderShop(); };
elCloseShopBtn.onclick = () => elShopModal.classList.add('hidden');

function buyRod(index) {
    const item = GAME_STATE.rods[index];
    if (GAME_STATE.ownedRods.includes(index)) {
        GAME_STATE.currentRodIndex = index;
    } else if (GAME_STATE.coins >= item.price) {
        GAME_STATE.coins -= item.price;
        GAME_STATE.ownedRods.push(index);
        GAME_STATE.currentRodIndex = index;
    }
    updateUI();
}

function buySinker(id) {
    const item = SINKERS.find(s => s.id === id);
    if (GAME_STATE.ownedSinkers.includes(id)) {
        GAME_STATE.currentSinker = id;
    } else if (GAME_STATE.coins >= item.price) {
        GAME_STATE.coins -= item.price;
        GAME_STATE.ownedSinkers.push(id);
        GAME_STATE.currentSinker = id;
    }
    updateUI();
}

function buyBait(id) {
    const item = BAITS.find(b => b.id === id);
    // Compra de pacote (consumível)
    if (GAME_STATE.coins >= item.price) {
        GAME_STATE.coins -= item.price;
        if (!GAME_STATE.baitInventory[id]) GAME_STATE.baitInventory[id] = 0;
        GAME_STATE.baitInventory[id] += item.qty;
        // Auto-equipar se não tiver nada
        if (!GAME_STATE.currentBait) GAME_STATE.currentBait = id;
    }
    updateUI();
}

function equipBait(id) {
    if (GAME_STATE.baitInventory[id] > 0) {
        GAME_STATE.currentBait = id;
        updateUI();
    }
}

function renderShop() {
    elShopContainer.innerHTML = '';

    // SEÇÃO 1: VARAS
    const titleRods = document.createElement('div'); titleRods.className = 'shop-section-title'; titleRods.innerText = "🎣 Varas";
    elShopContainer.appendChild(titleRods);
    
    GAME_STATE.rods.forEach(rod => {
        const div = document.createElement('div');
        const isOwned = GAME_STATE.ownedRods.includes(rod.id);
        const isEquipped = GAME_STATE.currentRodIndex === rod.id;
        const statusClass = isOwned ? (isEquipped ? 'equipped' : 'owned') : '';
        const btnText = isOwned ? (isEquipped ? "Equipado" : "Equipar") : `💰 ${rod.price}`;
        div.className = `rod-card ${statusClass}`;
        div.innerHTML = `<div>${rod.name}</div><div class="rod-tier-${rod.id}" style="height:4px;width:80%;margin:2px auto;"></div><div style="font-size:0.7rem;color:#666">Sorte +${Math.round((rod.luck-1)*100)}%</div><div style="font-weight:bold;font-size:0.8rem;color:${isOwned?'#2ecc71':'#e67e22'}">${btnText}</div>`;
        div.onclick = () => buyRod(rod.id);
        elShopContainer.appendChild(div);
    });

    // SEÇÃO 2: CHUMBADAS
    const titleSinkers = document.createElement('div'); titleSinkers.className = 'shop-section-title'; titleSinkers.innerText = "🪨 Chumbadas";
    elShopContainer.appendChild(titleSinkers);

    SINKERS.forEach(sinker => {
        const div = document.createElement('div');
        const isOwned = GAME_STATE.ownedSinkers.includes(sinker.id);
        const isEquipped = GAME_STATE.currentSinker === sinker.id;
        const statusClass = isOwned ? (isEquipped ? 'equipped' : 'owned') : '';
        const btnText = isOwned ? (isEquipped ? "Equipado" : "Equipar") : `💰 ${sinker.price}`;
        div.className = `gear-card ${statusClass}`;
        div.innerHTML = `<div>${sinker.name}</div><div style="font-size:0.7rem;color:#555">${sinker.desc}</div><div style="font-weight:bold;font-size:0.8rem;color:${isOwned?'#2ecc71':'#e67e22'}">${btnText}</div>`;
        div.onclick = () => buySinker(sinker.id);
        elShopContainer.appendChild(div);
    });

    // SEÇÃO 3: ISCAS
    const titleBaits = document.createElement('div'); titleBaits.className = 'shop-section-title'; titleBaits.innerText = "🪝 Iscas (Consumíveis)";
    elShopContainer.appendChild(titleBaits);

    BAITS.forEach(bait => {
        const div = document.createElement('div');
        const count = GAME_STATE.baitInventory[bait.id] || 0;
        const isEquipped = GAME_STATE.currentBait === bait.id;
        const statusClass = isEquipped ? 'equipped' : (count > 0 ? 'owned' : '');
        div.className = `gear-card ${statusClass}`;
        div.innerHTML = `
            ${count > 0 ? `<div class="stack-count">x${count}</div>` : ''}
            <div style="font-size:1.5rem">${bait.icon}</div>
            <div>${bait.name}</div>
            <div style="font-size:0.7rem;color:#555">${bait.desc}</div>
            <div style="font-weight:bold;font-size:0.8rem;color:#e67e22">💰 ${bait.price} (x${bait.qty})</div>
        `;
        div.onclick = () => {
            if (count > 0 && !isEquipped) equipBait(bait.id);
            else buyBait(bait.id);
        };
        elShopContainer.appendChild(div);
    });
}

// --- AQUÁRIOS ---
elOpenCollectionBtn.onclick = () => { elCollectionModal.classList.remove('hidden'); renderCollection(); };
elCloseCollectionBtn.onclick = () => elCollectionModal.classList.add('hidden');

elOpen67Btn.onclick = () => { elCollection67Modal.classList.remove('hidden'); renderCollection67(); };
elClose67Btn.onclick = () => elCollection67Modal.classList.add('hidden');

// Renderiza Aquário Normal
function renderCollection() {
    elCollectionGrid.innerHTML = '';
    let total = 0; let unlocked = 0;
    Object.values(RARITIES).forEach(rarity => {
        rarity.variations.forEach(fish => {
            total++;
            const count = GAME_STATE.collection[fish.name] || 0;
            if(count > 0) unlocked++;
            createCard(elCollectionGrid, fish, rarity, count, false);
        });
    });
    elCollectionProgress.innerText = `(${unlocked}/${total})`;
}

// Renderiza Aquário 67 (EXCLUSIVO)
function renderCollection67() {
    elCollection67Grid.innerHTML = '';
    let total = 0; let unlocked = 0;
    Object.values(RARITIES).forEach(rarity => {
        rarity.variations.forEach(fish => {
            total++;
            const count = GAME_STATE.collection67[fish.name] || 0;
            if(count > 0) unlocked++;
            createCard(elCollection67Grid, fish, rarity, count, true);
        });
    });
    elCollection67Progress.innerText = `(${unlocked}/${total})`;
}

function createCard(container, fish, rarity, count, is67) {
    const isUnlocked = count > 0;
    let cardClass = `collection-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    if (is67) cardClass += ' special-67';
    
    let sealHtml = '';
    if (is67 && isUnlocked) {
        const rid = rarity.id;
        let s = 'img/image_0.png';
        if (rid === 'epico' || rid === 'lendario') s = 'img/image_1.png';
        else if (rid === 'mitico' || rid === 'secreto' || rid === 'divino') s = 'img/image_2.png';
        sealHtml = `<img src="${s}" class="collection-seal">`;
    }

    const div = document.createElement('div');
    div.className = cardClass;
    let timeIcon = fish.time === 'day' ? '☀️' : (fish.time === 'night' ? '🌙' : '');
    
    div.innerHTML = `
        ${isUnlocked ? `<div class="count-badge">x${count}</div>` : ''}
        <div style="position: absolute; top: 2px; left: 5px; font-size: 0.7rem;">${timeIcon}</div>
        <img src="${fish.image}" class="collection-img" onerror="this.src='https://placehold.co/50x50?text=?'">
        ${sealHtml}
        <div style="font-size: 0.75rem; font-weight: bold; color: ${isUnlocked ? '#333' : '#999'}">${fish.name}</div>
        <div style="font-size: 0.65rem; color: ${isUnlocked ? 'green' : '#ccc'}">${rarity.name}</div>
    `;
    container.appendChild(div);
}

/* ==========================================
   7. BACKGROUND ANIMADO
   ========================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const fishes = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function pickRandomFishForBg() {
    const rand = Math.random();
    let r = RARITIES.COMUM;
    if (rand < RARITIES.DIVINO.prob) r = RARITIES.DIVINO;
    else if (rand < RARITIES.SECRETO.prob) r = RARITIES.SECRETO;
    else if (rand < RARITIES.MITICO.prob) r = RARITIES.MITICO;
    else if (rand < RARITIES.LENDARIO.prob) r = RARITIES.LENDARIO;
    else if (rand < RARITIES.EPICO.prob) r = RARITIES.EPICO;
    else if (rand < RARITIES.RARO.prob) r = RARITIES.RARO;
    
    const valid = r.variations.filter(v => v.time === 'all' || (GAME_STATE.isDay && v.time === 'day') || (!GAME_STATE.isDay && v.time === 'night'));
    const variation = valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : r.variations[0];
    return { rarity: r, variation: variation };
}

class SwimmingFish {
    constructor() { this.reset(true); }
    reset(initial = false) {
        const picked = pickRandomFishForBg();
        this.specificImage = picked.variation.image;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.y = Math.random() * (canvas.height - 200) + 200;
        this.x = initial ? Math.random() * canvas.width : (this.direction === 1 ? -150 : canvas.width + 150);
        this.speed = (Math.random() * 1.5 + 0.5) * this.direction;
        this.width = Math.min(40 + (picked.rarity.mult * 1.5), 100);
        this.height = this.width;
        this.opacity = Math.random() * 0.2 + 0.15;
    }
    update() {
        this.x += this.speed;
        if ((this.direction === 1 && this.x > canvas.width + 150) || (this.direction === -1 && this.x < -150)) this.reset();
    }
    draw() {
        const img = GAME_STATE.loadedImages[this.specificImage];
        if (!img) return;
        ctx.save(); ctx.globalAlpha = this.opacity; ctx.translate(this.x, this.y);
        if (this.direction === -1) ctx.scale(-1, 1);
        ctx.drawImage(img, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }
}
for(let i=0; i<40; i++) fishes.push(new SwimmingFish());
function animateBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fishes.forEach(f => { f.update(); f.draw(); });
    requestAnimationFrame(animateBg);
}

elCastBtn.addEventListener('click', castLine);
updateUI();
animateBg();