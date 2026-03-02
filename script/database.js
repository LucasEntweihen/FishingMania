/* ==========================================================================
   BANCO DE DADOS DO JOGO (ITENS, VARAS, ISCAS, PEIXES E SUCATAS)
   ========================================================================== */

window.CRAFTING_DB = {
    materials: [
        // --- MATERIAIS DE FORJA GERAIS ---
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
        { id: 'poeira_cosmica', name: 'Poeira Cósmica', price: 15000000, icon: '💫' },

        // --- MATERIAIS DE BOOSTS (Comprados na Loja, usados na 3ª Esfera) ---
        { id: 'boost_sorte', name: 'Soro da Sorte (Boost)', price: 15000, icon: '🍀' },
        { id: 'boost_lucro', name: 'Pó de Midas (Boost)', price: 15000, icon: '🌟' },

        // --- EXTRATOS DE ISCAS (Vêm exclusivamente do Lixo Pescado) ---
        { id: 'restos_comida', name: 'Restos de Comida', price: 0, icon: '🍎' },
        { id: 'inseto_morto', name: 'Inseto Esmagado', price: 0, icon: '🪲' },
        { id: 'geleia_estranha', name: 'Geleia Estranha', price: 0, icon: '🦠' },
        { id: 'biomassa_brilhante', name: 'Biomassa Brilhante', price: 0, icon: '💠' },
        { id: 'energia_condensada', name: 'Energia Condensada', price: 0, icon: '⚡' },
        { id: 'po_magico', name: 'Pó Estelar Úmido', price: 0, icon: '✨' },
        { id: 'escama_dragao', name: 'Escama Petrificada', price: 0, icon: '🐉' },
        { id: 'essencia_sombria', name: 'Essência do Abismo', price: 0, icon: '🌑' },
        { id: 'lagrima_sereia', name: 'Lágrima de Sereia', price: 0, icon: '💧' },
        { id: 'fogo_fatuo', name: 'Fogo Fátuo Submerso', price: 0, icon: '🔥' }
    ],
    recipes: {
        rods: {
            1: { name: "Vara de Bambu", req: { madeira: 2, fio: 1 } },
            2: { name: "Bambu Reforçado", req: { madeira: 5, fio: 3 } },
            3: { name: "Caniço de Salgueiro", req: { madeira: 10, fio: 5 } },
            4: { name: "Vara de Plástico", req: { plastico: 3, fio: 2 } },
            5: { name: "Fibra de Vidro", req: { fibra: 2, plastico: 2, fio: 3 } },
            6: { name: "Fibra Premium", req: { fibra: 5, plastico: 4, kevlar: 1 } },
            7: { name: "Polímero Flexível", req: { fibra: 10, plastico: 10, kevlar: 3 } },
            8: { name: "Alumínio Leve", req: { metal: 3, fio: 5, ouro: 1 } },
            9: { name: "Aço Inoxidável", req: { metal: 8, plastico: 2, ouro: 2 } },
            10: { name: "Liga de Titânio", req: { titânio: 4, metal: 5, ouro: 5 } },
            11: { name: "Vara de Grafeno", req: { titânio: 8, metal: 10, perola: 1 } },
            12: { name: "Carbono Básico", req: { carbono: 2, plastico: 5, perola: 3 } },
            13: { name: "Vara Eletrônica", req: { carbono: 4, metal: 10, perola: 5 } },
            14: { name: "Fibra de Nanotubos", req: { carbono: 8, fibra: 15, meteorito: 1 } },
            15: { name: "Protótipo Militar", req: { carbono: 15, titânio: 15, meteorito: 3 } },
            16: { name: "Vara Oceânica", req: { cristal: 3, titânio: 5, perola: 10 } },
            17: { name: "Arpão Antigo", req: { cristal: 8, madeira: 50, ouro: 20 } },
            18: { name: "Tridente de Netuno", req: { cristal: 15, titânio: 20, materia_escura: 1 } },
            19: { name: "Vara Galáctica", req: { essencia: 1, cristal: 20, materia_escura: 3 } },
            20: { name: "Vara Quântica", req: { essencia: 3, carbono: 50, materia_escura: 10 } },
            21: { name: "A Vara do Criador", req: { essencia: 10, cristal: 50, poeira_cosmica: 3 } }
        },
        sinkers: {
            'pedra_rio': { name: "Pedra de Rio", req: { fio: 1 } },
            'casca_noz': { name: "Casca Leve", req: { madeira: 2, fio: 1 } },
            'disco_plastico': { name: "Disco Plano", req: { plastico: 2 } },
            'bobina_fibra': { name: "Bobina Estabilizada", req: { fibra: 2, plastico: 1, kevlar: 1 } },
            'ferro_velho': { name: "Peso de Sucata", req: { metal: 2 } },
            'anilha_aco': { name: "Anilha de Academia", req: { metal: 5, ouro: 1 } },
            'magneto': { name: "Imã Industrial", req: { metal: 8, kevlar: 2 } },
            'peso_tungstenio': { name: "Esfera Pesada", req: { titânio: 2, metal: 5 } },
            'pepita_luxo': { name: "Pepita Polida", req: { titânio: 5, ouro: 10 } },
            'nucleo_carbono': { name: "Peso de Fibra", req: { carbono: 2, fibra: 3, kevlar: 5 } },
            'bateria_ion': { name: "Célula de Energia", req: { carbono: 5, metal: 10, perola: 2 } },
            'prisma_oceano': { name: "Prisma de Coral", req: { cristal: 2, plastico: 5, perola: 5 } },
            'reliquia_abismo': { name: "Artefato Antigo", req: { cristal: 5, titânio: 5, meteorito: 2 } },
            'fragmento_estelar': { name: "Fragmento de Cometa", req: { cristal: 10, meteorito: 5 } },
            'antimateria_v2': { name: "Peso de Antimatéria", req: { essencia: 1, carbono: 20, materia_escura: 2 } },
            'divindade_ouro': { name: "Ídolo Dourado", req: { essencia: 3, ouro: 50, cristal: 5 } },
            'buraco_negro': { name: "Mini Buraco Negro", req: { essencia: 5, titânio: 30, materia_escura: 5 } },
            'paradoxo': { name: "Peso Atemporal", req: { essencia: 8, cristal: 30, poeira_cosmica: 1 } },
            'vazio_absoluto': { name: "Esfera do Nada", req: { essencia: 15, carbono: 100, poeira_cosmica: 5 } }
        },
        knives: {
            'faca_cozinha': { name: "Faca de Cozinha", req: { madeira: 2, metal: 2 } },
            'faca_acougueiro': { name: "Faca de Açougueiro", req: { madeira: 3, metal: 5 } },
            'faca_chef': { name: "Faca de Chef Aprendiz", req: { madeira: 5, metal: 12 } },
            'cutelo_ferro': { name: "Cutelo de Ferro", req: { madeira: 10, metal: 25 } },
            'faca_ouro': { name: "Faca Banhada a Ouro", req: { madeira: 15, ouro: 5 } },
            'faca_pirata': { name: "Faca do Pirata", req: { madeira: 20, ouro: 15 } },
            'faca_titanio': { name: "Faca de Titânio", req: { madeira: 30, titânio: 5 } },
            'cutelo_titanio': { name: "Cutelo Maciço", req: { madeira: 40, titânio: 15, metal: 50 } },
            'faca_meteorito': { name: "Faca Meteorítica", req: { madeira: 60, meteorito: 3 } },
            'lamina_cometa': { name: "Lâmina do Cometa", req: { madeira: 80, meteorito: 10, titânio: 20 } },
            'faca_cristal': { name: "Faca de Cristal Bruto", req: { madeira: 120, cristal: 3 } },
            'lamina_mistica': { name: "Lâmina Mística", req: { madeira: 150, cristal: 10 } },
            'faca_sombria': { name: "Faca Sombria", req: { madeira: 200, materia_escura: 3 } },
            'cutelo_vazio': { name: "Cutelo do Vazio", req: { madeira: 250, materia_escura: 8, meteorito: 25 } },
            'faca_essencia': { name: "Faca de Essência Pura", req: { madeira: 350, essencia: 2 } },
            'lamina_divina': { name: "Lâmina Divina", req: { madeira: 500, essencia: 5 } },
            'faca_estelar': { name: "Faca Estelar", req: { madeira: 800, poeira_cosmica: 2 } },
            'faca_neutrons': { name: "Faca de Nêutrons", req: { madeira: 1200, poeira_cosmica: 5 } },
            'lamina_infinito': { name: "Lâmina do Infinito", req: { madeira: 2500, poeira_cosmica: 15 } },
            'faca_criador': { name: "A Faca do Criador", req: { madeira: 5000, poeira_cosmica: 30, essencia: 20 } }
        }
    }
};

window.MATERIALS = window.CRAFTING_DB.materials;

window.SUCATAS = [
    { id: 'lata_velha', name: 'Lata Enferrujada', image: '/img/sucata/lata.png', coinPenalty: 0, matReward: 'restos_comida', matQty: 1 },
    { id: 'bota_furada', name: 'Bota Furada', image: '/img/sucata/bota.png', coinPenalty: 0, matReward: 'inseto_morto', matQty: 1 },
    { id: 'garrafa_pet', name: 'Garrafa PET', image: '/img/sucata/garrafa.webp', coinPenalty: 0, matReward: 'geleia_estranha', matQty: 1 },
    { id: 'pneu_careca', name: 'Pneu Careca', image: '/img/sucata/pneu.webp', coinPenalty: 1, matReward: 'biomassa_brilhante', matQty: 1 },
    { id: 'oculos_quebrado', name: 'Óculos Quebrado', image: '/img/sucata/oculos.png', coinPenalty: 2, matReward: 'energia_condensada', matQty: 1 },
    { id: 'lixo_toxico', name: 'Barril Tóxico', image: '/img/sucata/lixo_toxico.png', coinPenalty: 3, matReward: 'po_magico', matQty: 1 },
    { id: 'celular_quebrado', name: 'Celular Molhado', image: '/img/sucata/celular.png', coinPenalty: 5, matReward: 'escama_dragao', matQty: 1 },
    { id: 'placa_mae', name: 'Placa Mãe Frita', image: '/img/sucata/placa.png', coinPenalty: 10, matReward: 'essencia_sombria', matQty: 1 },
    { id: 'reator_pifado', name: 'Mini Reator', image: '/img/sucata/reator.png', coinPenalty: 100, matReward: 'lagrima_sereia', matQty: 1 },
    { id: 'uranio_vazado', name: 'Urânio Empobrecido', image: '/img/sucata/uranio.png', coinPenalty: 1000, matReward: 'fogo_fatuo', matQty: 1 }
];

window.KNIVES = [
    { id: 'faca_cozinha', name: 'Faca de Cozinha', mult: 1.0, desc: 'Saque x1 (S/ Material)', dropsMats: false },
    { id: 'faca_acougueiro', name: 'Faca de Açougueiro', mult: 1.2, desc: 'Saque x1.2 (S/ Material)', dropsMats: false },
    { id: 'faca_chef', name: 'Faca de Chef Aprendiz', mult: 1.5, desc: 'Saque x1.5 (S/ Material)', dropsMats: false },
    { id: 'cutelo_ferro', name: 'Cutelo de Ferro', mult: 2.0, desc: 'Saque x2 (S/ Material)', dropsMats: false },
    { id: 'faca_ouro', name: 'Faca Banhada a Ouro', mult: 3.0, desc: 'Saque x3 (S/ Material)', dropsMats: false },
    { id: 'faca_pirata', name: 'Faca do Pirata', mult: 4.0, desc: 'Saque x4', dropsMats: true },
    { id: 'faca_titanio', name: 'Faca de Titânio', mult: 6.0, desc: 'Saque x6', dropsMats: true },
    { id: 'cutelo_titanio', name: 'Cutelo Maciço', mult: 8.0, desc: 'Saque x8', dropsMats: true },
    { id: 'faca_meteorito', name: 'Faca Meteorítica', mult: 12.0, desc: 'Saque x12', dropsMats: true },
    { id: 'lamina_cometa', name: 'Lâmina do Cometa', mult: 15.0, desc: 'Saque x15', dropsMats: true },
    { id: 'faca_cristal', name: 'Faca de Cristal Bruto', mult: 20.0, desc: 'Saque x20', dropsMats: true },
    { id: 'lamina_mistica', name: 'Lâmina Mística', mult: 30.0, desc: 'Saque x30', dropsMats: true },
    { id: 'faca_sombria', name: 'Faca Sombria', mult: 50.0, desc: 'Saque x50', dropsMats: true },
    { id: 'cutelo_vazio', name: 'Cutelo do Vazio', mult: 80.0, desc: 'Saque x80', dropsMats: true },
    { id: 'faca_essencia', name: 'Faca de Essência Pura', mult: 100.0, desc: 'Saque x100', dropsMats: true },
    { id: 'lamina_divina', name: 'Lâmina Divina', mult: 120.0, desc: 'Saque x120', dropsMats: true },
    { id: 'faca_estelar', name: 'Faca Estelar', mult: 150.0, desc: 'Saque x150', dropsMats: true },
    { id: 'faca_neutrons', name: 'Faca de Nêutrons', mult: 300.0, desc: 'Saque x300', dropsMats: true },
    { id: 'lamina_infinito', name: 'Lâmina do Infinito', mult: 500.0, desc: 'Saque x500', dropsMats: true },
    { id: 'faca_criador', name: 'A Faca do Criador', mult: 1000.0, desc: 'Saque x1000', dropsMats: true }
];

window.ROD_TEMPLATES = [
    { name: "Galho Seco", type: "madeira", price: 0, speed: 1.0, luck: 0 },
    { name: "Vara de Bambu", type: "madeira", price: 250, speed: 1.1, luck: 5 },
    { name: "Bambu Reforçado", type: "madeira", price: 800, speed: 1.25, luck: 15 },
    { name: "Caniço de Salgueiro", type: "madeira", price: 2000, speed: 1.35, luck: 30 },
    { name: "Vara de Plástico", type: "fibra", price: 5000, speed: 1.5, luck: 60 },
    { name: "Fibra de Vidro", type: "fibra", price: 12000, speed: 1.7, luck: 100 },
    { name: "Fibra Premium", type: "fibra", price: 25000, speed: 2.0, luck: 150 },
    { name: "Polímero Flexível", type: "fibra", price: 50000, speed: 2.3, luck: 220 },
    { name: "Alumínio Leve", type: "metal", price: 95000, speed: 2.6, luck: 300 },
    { name: "Aço Inoxidável", type: "metal", price: 180000, speed: 3.0, luck: 450 },
    { name: "Liga de Titânio", type: "metal", price: 350000, speed: 3.5, luck: 600 },
    { name: "Vara de Grafeno", type: "metal", price: 700000, speed: 4.0, luck: 850 },
    { name: "Carbono Básico", type: "carbono", price: 1200000, speed: 4.5, luck: 1200 },
    { name: "Vara Eletrônica", type: "carbono", price: 2500000, speed: 5.2, luck: 1600 },
    { name: "Fibra de Nanotubos", type: "carbono", price: 5000000, speed: 6.0, luck: 2200 },
    { name: "Protótipo Militar", type: "carbono", price: 10000000, speed: 7.5, luck: 3000 },
    { name: "Vara Oceânica", type: "mistico", price: 25000000, speed: 9.0, luck: 4000 },
    { name: "Arpão Antigo", type: "mistico", price: 50000000, speed: 11.0, luck: 5500 },
    { name: "Tridente de Netuno", type: "mistico", price: 120000000, speed: 14.0, luck: 7500 },
    { name: "Vara Galáctica", type: "divino", price: 300000000, speed: 18.0, luck: 10000 },
    { name: "Vara Quântica", type: "divino", price: 750000000, speed: 25.0, luck: 15000 },
    { name: "A Vara do Criador", type: "divino", price: 2000000000, speed: 40.0, luck: 25000 }
];

window.SINKERS = [
    { id: 'chumbo', name: 'Chumbo Padrão', price: 0, desc: 'Padrão.', stats: {} },
    { id: 'pedra_rio', name: 'Pedra de Rio', price: 1200, desc: '+15% Vel.', stats: { speed: 1.15 } },
    { id: 'casca_noz', name: 'Casca Leve', price: 3500, desc: 'Sinergia (Madeira): Sorte +10', stats: { luck: 5 }, synergy: { type: 'madeira', luck: 10, desc: "Sorte +10" } },
    { id: 'disco_plastico', name: 'Disco Plano', price: 8000, desc: '+30% Vel.', stats: { speed: 1.3 } },
    { id: 'bobina_fibra', name: 'Bobina Estabilizada', price: 18000, desc: 'Sinergia (Fibra): Vel x1.6', stats: { luck: 20 }, synergy: { type: 'fibra', speed: 1.6, desc: "Vel x1.6" } },
    { id: 'ferro_velho', name: 'Peso de Sucata', price: 40000, desc: 'Lucro x1.4', stats: { value: 1.4 } },
    { id: 'anilha_aco', name: 'Anilha de Academia', price: 85000, desc: '+80% Vel.', stats: { speed: 1.8 } },
    { id: 'magneto', name: 'Imã Industrial', price: 160000, desc: 'Sinergia (Metal): Lucro x2.2', stats: { luck: 50 }, synergy: { type: 'metal', value: 2.2, desc: "Lucro x2.2" } },
    { id: 'peso_tungstenio', name: 'Esfera Pesada', price: 320000, desc: 'Velocidade x2.2', stats: { speed: 2.2 } },
    { id: 'pepita_luxo', name: 'Pepita Polida', price: 700000, desc: 'Lucro x2.5', stats: { value: 2.5 } },
    { id: 'nucleo_carbono', name: 'Peso de Fibra', price: 1500000, desc: 'Sinergia (Carbono): +7% 67cm', stats: { speed: 1.5 }, synergy: { type: 'carbono', chance67: 0.07, desc: "+7% chance 67cm" } },
    { id: 'bateria_ion', name: 'Célula de Energia', price: 4000000, desc: 'Vel x3.0', stats: { speed: 3.0 } },
    { id: 'prisma_oceano', name: 'Prisma de Coral', price: 10000000, desc: 'Sorte +500', stats: { luck: 500 } },
    { id: 'reliquia_abismo', name: 'Artefato Antigo', price: 25000000, desc: 'Sinergia (Místico): Sorte +1200', stats: { value: 2.0 }, synergy: { type: 'mistico', luck: 1200, desc: "Sorte +1200" } },
    { id: 'fragmento_estelar', name: 'Fragmento de Cometa', price: 60000000, desc: '+15% Chance 67cm', stats: { chance67: 0.15 } },
    { id: 'antimateria_v2', name: 'Peso de Antimatéria', price: 150000000, desc: 'Vel x5.0 | Lucro x3', stats: { speed: 5.0, value: 3.0 } },
    { id: 'divindade_ouro', name: 'Ídolo Dourado', price: 400000000, desc: 'Sinergia (Divino): Lucro x10', stats: { luck: 3000 }, synergy: { type: 'divino', value: 10.0, desc: "Lucro x10" } },
    { id: 'buraco_negro', name: 'Mini Buraco Negro', price: 1000000000, desc: 'Vel x10, Sorte +5000', stats: { speed: 10.0, luck: 5000, chance67: 0.35 } },
    { id: 'paradoxo', name: 'Peso Atemporal', price: 2500000000, desc: 'Ignora o tempo (+20% 67cm)', stats: { speed: 15.0, chance67: 0.20 } },
    { id: 'vazio_absoluto', name: 'Esfera do Nada', price: 5000000000, desc: 'O fim de tudo', stats: { speed: 20.0, luck: 12000, value: 15.0, chance67: 0.50 } }
];

window.BAITS = [
    { id: 'pao', icon: '🍞', name: 'Miolo de Pão', qty: 10, desc: 'Sorte +5', stats: { luck: 5 }, req: { restos_comida: 2, fio: 1 } },
    { id: 'minhoca', icon: '🐛', name: 'Minhoca', qty: 5, desc: 'Sorte +15', stats: { luck: 15 }, req: { restos_comida: 3, inseto_morto: 1 } },
    { id: 'grilo', icon: '🦗', name: 'Grilo Falante', qty: 5, desc: 'Sorte +30', stats: { luck: 30 }, req: { inseto_morto: 3, plastico: 1 } },
    { id: 'queijo', icon: '🧀', name: 'Queijo Fedido', qty: 5, desc: 'Lucro x1.5', stats: { value: 1.5 }, req: { restos_comida: 5, geleia_estranha: 1 } },
    { id: 'camarao', icon: '🦐', name: 'Camarão', qty: 5, desc: 'Sorte +80', stats: { luck: 80 }, req: { inseto_morto: 5, geleia_estranha: 2 } },
    { id: 'vagalume', icon: '✨', name: 'Vagalume', qty: 5, desc: 'Sorte +150 | +2% 67cm', stats: { luck: 150, chance67: 0.02 }, req: { inseto_morto: 10, biomassa_brilhante: 1 } },
    { id: 'isca_metal', icon: '🪝', name: 'Isca de Metal', qty: 5, desc: 'Lucro x3.0', stats: { value: 3.0 }, req: { geleia_estranha: 5, metal: 2 } },
    { id: 'lula', icon: '🦑', name: 'Lula Gigante', qty: 5, desc: 'Sorte +300', stats: { luck: 300 }, req: { biomassa_brilhante: 3, energia_condensada: 1 } },
    { id: 'sushi', icon: '🍣', name: 'Sushi Premium', qty: 5, desc: 'Sorte +450 | Lucro x3', stats: { luck: 450, value: 3.0 }, req: { biomassa_brilhante: 5, po_magico: 1 } },
    { id: 'cometa', icon: '☄️', name: 'Pó de Cometa', qty: 3, desc: '+10% Chance 67cm', stats: { chance67: 0.10 }, req: { energia_condensada: 3, meteorito: 1 } },
    { id: 'hamburguer', icon: '🍔', name: 'Podrão dos Mares', qty: 5, desc: 'Lucro Extremo (x6.0)', stats: { value: 6.0 }, req: { geleia_estranha: 10, escama_dragao: 1 } },
    { id: 'queijo_azul', icon: '🧀', name: 'Gorgonzola Galáctico', qty: 5, desc: 'Lucro x8.0', stats: { value: 8.0 }, req: { energia_condensada: 5, essencia_sombria: 1 } },
    { id: 'radioativa', icon: '☢️', name: 'Isca Mutante', qty: 3, desc: 'Sorte +1200', stats: { luck: 1200 }, req: { biomassa_brilhante: 10, lagrima_sereia: 1 } },
    { id: 'lula_neon', icon: '🦑', name: 'Lula de Neon', qty: 3, desc: 'Sorte +2500', stats: { luck: 2500 }, req: { energia_condensada: 8, perola: 2 } },
    { id: 'kraken', icon: '👁️', name: 'Olho do Kraken', qty: 3, desc: 'Garante Gigantes (+20%)', stats: { chance67: 0.20 }, req: { energia_condensada: 12, fogo_fatuo: 1 } },
    { id: 'essencia_deus', icon: '🍷', name: 'Néctar Divino', qty: 2, desc: 'Sorte +6000', stats: { luck: 6000, chance67: 0.25 }, req: { po_magico: 5, essencia: 1 } },
    { id: 'vazio', icon: '🌌', name: 'Essência do Vazio', qty: 2, desc: 'Sorte +10000', stats: { luck: 10000 }, req: { essencia_sombria: 5, materia_escura: 2 } },
    { id: 'sol', icon: '☀️', name: 'Fragmento Solar', qty: 2, desc: 'Astro-Rei (+40%)', stats: { chance67: 0.40 }, req: { fogo_fatuo: 5, cristal: 5 } },
    { id: 'supernova', icon: '💥', name: 'Isca Supernova', qty: 1, desc: 'Lucro x50', stats: { value: 50.0, chance67: 0.40 }, req: { energia_condensada: 50, materia_escura: 5 } },
    { id: 'definitiva', icon: '👑', name: 'Matadora de Deuses', qty: 1, desc: 'Poder Máximo.', stats: { luck: 25000, value: 30.0, chance67: 0.60 }, req: { fogo_fatuo: 20, essencia: 5 } },
    { id: 'alma_gato', icon: '🐈', name: 'Nona Alma', qty: 1, desc: 'O impossível.', stats: { luck: 50000, value: 100.0, chance67: 0.70 }, req: { lagrima_sereia: 50, poeira_cosmica: 2 } }
];

window.RARITIES = {
    COMUM: { id: 'comum', prob: 0.50, mult: 1, style: 'text-comum', border: 'border-comum', name: 'Comum', variations: [
        { name: 'Peixe Genérico', image: '/img/peixe/Genericfish001.webp', time: 'all', events: ["all"] },
        { name: 'Bombardilo', image: '/img/peixe/bombardilo crocarilho.webp', time: 'day', events: ["all"] },
        { name: 'Ah, peixe legal', image: '/img/peixe/PeixeLegal.avif', time: 'day', events: ["all"] },
        { name: 'Cruel kidfish', image: '/img/peixe/KidFish.png', time: 'night', events: ["all"] },
        { name: 'Pexudo', image: '/img/peixe/peixebala.png', time: 'all', events: ["all"] },
        { name: 'Ah, peixe legal..?', image: '/img/peixe/lolidasaguas.png', time: 'night', events: ["all"] }
    ]},
    RARO: { id: 'raro', prob: 0.20, mult: 3, style: 'text-raro', border: 'border-raro', name: 'Raro', variations: [
        { name: 'Peixe Estranho', image: '/img/peixe/UnderWaterAhhFish.png', time: 'night', events: ["all"] },
        { name: 'Meu çélebro', image: '/img/peixe/tarlalareo fish.png', time: 'all', events: ["all"] },
        { name: 'Cubic Boccacete', image: '/img/peixe/hyt.gif', time: 'day', events: ["all"] },
        { name: 'PUTAPEIXE', image: '/img/peixe/PUTARALHOFISH, porra.png', time: 'all', events: ["all"] },
        { name: 'Peixe Burrinho', image: '/img/peixe/dumbAssFish.png', time: 'all', events: ["all"] },
        { name: 'Meio Peixe', image: '/img/peixe/meio-epixe.gif', time: 'night', events: ["all"] }
    ]},
    EPICO: { id: 'epico', prob: 0.10, mult: 8, style: 'text-epico', border: 'border-epico', name: 'Épico', variations: [
        { name: 'Mahi-Mahi', image: '/img/peixe/Mahi-Mahifish square.webp', time: 'all', events: ["all"] },
        { name: 'Peixe Otário', image: '/img/peixe/PeixeOtario.png', time: 'day', events: ["all"] },
        { name: 'Peixe Lhapaço', image: '/img/peixe/peixe-palhaco.png', time: 'all', events: ["all"] },
        { name: 'Carlos a Cardume', image: '/img/peixe/Carlosacardume.png', time: 'day', events: ["all"] },
        { name: 'Betíssimo', image: '/img/peixe/betaMaximo.webp', time: 'all', events: ["all"] },
        { name: 'Lanterna Gay', image: '/img/peixe/angler-cliparte.png', time: 'night', events: ["all"] }
    ]},
    LENDARIO: { id: 'lendario', prob: 0.05, mult: 20, style: 'text-lendario', border: 'border-lendario', name: 'Lendário', variations: [
        { name: 'Peixe Motosserra', image: '/img/peixe/Chainsawfish.webp', time: 'night', events: ["all"] },
        { name: 'Grande Olho', image: '/img/peixe/hytal.gif', time: 'day', events: ["all"] },
        { name: 'Peixe Demônio negro', image: '/img/peixe/DemonicAHHfish (1).png', time: 'night', events: ["tempestade"] },
        { name: 'Peixe Entulhado', image: '/img/peixe/EntulhoFish.png', time: 'day', events: ["all"] },
        { name: 'Tenham respeito!', image: '/img/peixe/vcsestaoempublicomaisrespeito.gif', time: 'all', events: ["tempestade", "frenesi", "misticismo"] }    ]},
    MITICO: { id: 'mitico', prob: 0.020, mult: 50, style: 'text-mitico', border: 'border-mitico', name: 'Mítico', variations: [
        { name: 'Jogo do Peixe Retardo', image: '/img/peixe/GameofRetardedfish.png', time: 'night', events: ["ouro", "frenesi", "misticismo"] },
        { name: 'Peixe Câncer', image: '/img/peixe/PeixeCancer.png', time: 'all', events: ["all"] },
        { name: 'Meus filhos ', image: '/img/peixe/cardume dos meus filhos.png', time: 'all', events: ["all"] },
        { name: 'Peixe das Águas Reais', image: '/img/peixe/aquoso.webp', time: 'day', events: ["ouro", "misticismo"] },
        { name: 'Darwin?!?!', image: '/img/peixe/darwin.gif', time: 'all', events: ["all"] },
        { name: 'Baleia Gorda', image: '/img/peixe/baleia.webp', time: 'day', events: ["all"] }
    ]},
    SECRETO: { id: 'secreto', prob: 0.002, mult: 150, style: 'text-secreto', border: 'border-secreto', name: 'Secreto', variations: [
        { name: 'Peixe Retardado', image: '/img/peixe/Retardedfish.png', time: 'all', events: ["all"] },
        { name: 'Meu Almoço Delicioso', image: '/img/peixe/receitas-de-peixes-destaque.png', time: 'day', events: ["ouro", "misticismo"] },
        { name: 'Pai Solteiro', image: '/img/peixe/pai-solteiro.gif', time: 'all', events: ["all"] },
        { name: 'QUE CARA LEGAL!', image: '/img/peixe/coolASSfish.gif', time: 'all', events: ["all"] },
        { name: 'Alien Fish REF!!!', image: '/img/peixe/alien_ref_fish.png', time: 'night', events: ["ouro", "frenesi", "misticismo"] }
    ]},
    DIVINO: { id: 'divino', prob: 0.0005, mult: 500, style: 'text-divino', border: 'border-divino', name: 'Divino', variations: [
        { name: 'Quase Arco-íris', image: '/img/peixe/Semi-rainbowfish.png', time: 'day', events: ["mistiscismo"] },
        { name: 'Golfizza Pescado', image: '/img/peixe/golfizza.gif', time: 'night', events: ["all"] },
        { name: 'Só mais um pouco', image: '/img/peixe/meus porrinhas.png', time: 'night', events: ["all"] },
        { name: 'Ex rei dos mares (fraco)', image: '/img/peixe/CARALHOFODAA.png', time: 'night', events: ["tempestade"] },
        { name: 'Salmão de lama', image: '/img/peixe/salmao_argila.gif', time: 'night', events: ["ouro", "mistiscismo"] }
    ]},
    AURUDO: { id: 'aurudo', prob: 0.000001, mult: 50, style: 'text-auraMAX', border: 'border-auraMAX', name: 'Aurudo', variations: [
        { name: 'Triolho Diliça', image: '/img/peixe/triolho.webp', time: 'all', events: ["all"] },
        { name: 'Abueno Pasaber', image: '/img/peixe/abuenopasaber.png', time: 'all', events: ["all"] }
    ]}
};