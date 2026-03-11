/* ==========================================================================
   BANCO DE DADOS DO JOGO (ITENS, VARAS, ISCAS, PEIXES, SUCATAS E ANZÓIS)
   ========================================================================== */

   window.CRAFTING_DB = {
    materials: [
        { id: 'madeira', name: 'Madeira / Graveto', price: 100, icon: '🪵', lore: "⚙️ Função: Base de forja inicial. ✨ Diferencial: Flutua surpreendentemente bem." },
        { id: 'fio', name: 'Fio de Nylon', price: 250, icon: '🧵', lore: "⚙️ Função: Amarração básica. ✨ Diferencial: Quase invisível na água." },
        { id: 'plastico', name: 'Plástico', price: 1000, icon: '🧪', lore: "⚙️ Função: Criação de ligas leves. ✨ Diferencial: Não se decompõe nunca." },
        { id: 'kevlar', name: 'Fio de Kevlar', price: 2500, icon: '🕸️', lore: "⚙️ Função: Linhas de alta tensão. ✨ Diferencial: Para balas e mordidas de tubarão." },
        { id: 'fibra', name: 'Fibra de Vidro', price: 5000, icon: '🧶', lore: "⚙️ Função: Hastes médias. ✨ Diferencial: Enverga até o limite sem estalar." },
        { id: 'ouro', name: 'Ouro Pirata', price: 12000, icon: '🪙', lore: "⚙️ Função: Valorização e Sinergia. ✨ Diferencial: Brilha mesmo no breu abissal." },
        { id: 'metal', name: 'Sucata de Metal', price: 20000, icon: '⚙️', lore: "⚙️ Função: Pesos e Lâminas pesadas. ✨ Diferencial: Densidade bruta e letal." },
        { id: 'titânio', name: 'Liga de Titânio', price: 60000, icon: '🔩', lore: "⚙️ Função: Equipamento tático. ✨ Diferencial: Indestrutível e imune a salinidade." },
        { id: 'perola', name: 'Pérola Abissal', price: 120000, icon: '🦪', lore: "⚙️ Função: Canalizador místico. ✨ Diferencial: Pulsa com o bater do coração." },
        { id: 'carbono', name: 'Carbono', price: 250000, icon: '🔋', lore: "⚙️ Função: Nanotecnologia pesqueira. ✨ Diferencial: Mais duro que diamante." },
        { id: 'meteorito', name: 'Fragmento de Meteoro', price: 600000, icon: '☄️', lore: "⚙️ Função: Lâminas de ruptura. ✨ Diferencial: Irradia uma aura de 300°C." },
        { id: 'tecido_magico', name: 'Tecido Mágico', price: 1000000, icon: '📜', lore: "⚙️ Função: Amarração de realidades. ✨ Diferencial: Não possui peso físico." },
        { id: 'cristal', name: 'Cristal Místico', price: 1800000, icon: '🔮', lore: "⚙️ Função: Forja Oceânica e Divina. ✨ Diferencial: Permite ver o futuro." },
        { id: 'escama_leviata', name: 'Escama de Leviatã', price: 3000000, icon: '🧜‍♂️', lore: "⚙️ Função: Sinergias abissais. ✨ Diferencial: Vibra com o perigo." },
        { id: 'materia_escura', name: 'Matéria Escura', price: 6000000, icon: '🌌', lore: "⚙️ Função: Buracos negros portáteis. ✨ Diferencial: Engole a luz." },
        { id: 'nucleo_estrela', name: 'Núcleo Estelar', price: 12000000, icon: '🌟', lore: "⚙️ Função: Forja Celestial. ✨ Diferencial: Um minúsculo sol em suas mãos." },
        { id: 'essencia', name: 'Essência Divina', price: 25000000, icon: '✨', lore: "⚙️ Função: Ascensão de equipamentos. ✨ Diferencial: Cura as feridas." },
        { id: 'fragmento_tempo', name: 'Fragmento Temporal', price: 50000000, icon: '⏳', lore: "⚙️ Função: Manipulação cronológica. ✨ Diferencial: Cai para cima." },
        { id: 'poeira_cosmica', name: 'Poeira Cósmica', price: 100000000, icon: '💫', lore: "⚙️ Função: O fim e o princípio. ✨ Diferencial: Eco do Big Bang." },
        { id: 'tecido_realidade', name: 'Tecido da Realidade', price: 250000000, icon: '💠', lore: "⚙️ Função: Quebra de regras. ✨ Diferencial: Altera a própria memória." }
    ],
    recipes: {
        rods: {
            1: { name: "Vara de Bambu", req: { madeira: 15, fio: 5 }, reqFishes: { comum: 5 } },
            2: { name: "Bambu Reforçado", req: { madeira: 45, fio: 20 }, reqFishes: { comum: 25 } },
            3: { name: "Caniço de Salgueiro", req: { madeira: 100, fio: 40 }, reqFishes: { comum: 60, raro: 5 } },
            4: { name: "Vara de Plástico", req: { plastico: 35, fio: 80 }, reqFishes: { comum: 120, raro: 15 } },
            5: { name: "Fibra de Vidro", req: { fibra: 25, plastico: 40, fio: 100 }, reqFishes: { raro: 30, epico: 2 } },
            6: { name: "Fibra Premium", req: { fibra: 60, plastico: 80, kevlar: 20 }, reqFishes: { raro: 60, epico: 8 } },
            7: { name: "Polímero Flexível", req: { fibra: 120, plastico: 150, kevlar: 50 }, reqFishes: { raro: 100, epico: 20 } },
            8: { name: "Alumínio Leve", req: { metal: 40, fio: 200, ouro: 15 }, reqFishes: { epico: 40, lendario: 2 } },
            9: { name: "Aço Inoxidável", req: { metal: 100, plastico: 80, ouro: 40 }, reqFishes: { epico: 80, lendario: 8 } },
            10: { name: "Liga de Titânio", req: { titânio: 45, metal: 150, ouro: 80 }, reqFishes: { epico: 150, lendario: 20 } },
            11: { name: "Vara de Grafeno", req: { titânio: 100, metal: 250, perola: 15 }, reqFishes: { lendario: 40, mitico: 2 } },
            12: { name: "Carbono Básico", req: { carbono: 30, plastico: 150, perola: 40 }, reqFishes: { lendario: 80, mitico: 6 } },
            13: { name: "Vara Eletrônica", req: { carbono: 80, metal: 300, perola: 80 }, reqFishes: { lendario: 150, mitico: 15 } },
            14: { name: "Fibra de Nanotubos", req: { carbono: 150, fibra: 400, meteorito: 15 }, reqFishes: { mitico: 40, secreto: 2 } },
            15: { name: "Protótipo Militar", req: { carbono: 300, titânio: 200, meteorito: 40 }, reqFishes: { mitico: 80, secreto: 6 } },
            16: { name: "Vara Oceânica", req: { cristal: 40, titânio: 300, perola: 150 }, reqFishes: { mitico: 150, secreto: 15 } },
            17: { name: "Arpão Antigo", req: { cristal: 100, madeira: 1000, ouro: 300 }, reqFishes: { secreto: 40, divino: 1 } },
            18: { name: "Tridente de Netuno", req: { cristal: 250, titânio: 500, materia_escura: 15 }, reqFishes: { secreto: 80, divino: 3 } },
            19: { name: "Vara Galáctica", req: { essencia: 15, cristal: 400, materia_escura: 40 }, reqFishes: { secreto: 150, divino: 8 } },
            20: { name: "Vara Quântica", req: { essencia: 40, carbono: 1000, materia_escura: 100 }, reqFishes: { divino: 30, aurudo: 1 } },
            21: { name: "A Vara do Criador", req: { essencia: 120, cristal: 1200, poeira_cosmica: 35 }, reqFishes: { divino: 80, aurudo: 3 } },
            22: { name: "Vara do Tempo", req: { poeira_cosmica: 100, fragmento_tempo: 60 }, reqFishes: { divino: 150, aurudo: 8 } },
            23: { name: "Cetro Celestial", req: { essencia: 300, nucleo_estrela: 150 }, reqFishes: { aurudo: 25, bestial: 1 } },
            24: { name: "Teia do Destino", req: { tecido_magico: 250, fragmento_tempo: 120 }, reqFishes: { aurudo: 50, vandalo: 1 } },
            25: { name: "Singularidade", req: { nucleo_estrela: 300, tecido_realidade: 60 }, reqFishes: { bestial: 3, vandalo: 3 } },
            26: { name: "Pescadora de Realidades", req: { fragmento_tempo: 500, tecido_realidade: 180 }, reqFishes: { bestial: 10, vandalo: 10 } }
        },
        sinkers: {
            'pedra_rio': { name: "Pedra de Rio", req: { fio: 5 }, reqFishes: { comum: 2 } },
            'casca_noz': { name: "Casca Leve", req: { madeira: 20, fio: 10 }, reqFishes: { comum: 15 } },
            'disco_plastico': { name: "Disco Plano", req: { plastico: 25 }, reqFishes: { comum: 40 } },
            'bobina_fibra': { name: "Bobina Estabilizada", req: { fibra: 25, plastico: 15, kevlar: 10 }, reqFishes: { raro: 10 } },
            'ferro_velho': { name: "Peso de Sucata", req: { metal: 30 }, reqFishes: { raro: 30 } },
            'anilha_aco': { name: "Anilha de Academia", req: { metal: 80, ouro: 15 }, reqFishes: { epico: 5 } },
            'magneto': { name: "Imã Industrial", req: { metal: 150, kevlar: 40 }, reqFishes: { epico: 25 } },
            'peso_tungstenio': { name: "Esfera Pesada", req: { titânio: 40, metal: 100 }, reqFishes: { lendario: 5 } },
            'pepita_luxo': { name: "Pepita Polida", req: { titânio: 80, ouro: 200 }, reqFishes: { lendario: 15 } },
            'nucleo_carbono': { name: "Peso de Fibra", req: { carbono: 40, fibra: 100, kevlar: 80 }, reqFishes: { mitico: 5 } },
            'bateria_ion': { name: "Célula de Energia", req: { carbono: 80, metal: 200, perola: 30 }, reqFishes: { mitico: 15 } },
            'prisma_oceano': { name: "Prisma de Coral", req: { cristal: 30, plastico: 150, perola: 80 }, reqFishes: { secreto: 5 } },
            'reliquia_abismo': { name: "Artefato Antigo", req: { cristal: 80, titânio: 150, meteorito: 40 }, reqFishes: { secreto: 15 } },
            'fragmento_estelar': { name: "Fragmento de Cometa", req: { cristal: 150, meteorito: 80 }, reqFishes: { divino: 5 } },
            'antimateria_v2': { name: "Peso de Antimatéria", req: { essencia: 15, carbono: 300, materia_escura: 30 }, reqFishes: { divino: 15 } },
            'divindade_ouro': { name: "Ídolo Dourado", req: { essencia: 40, ouro: 500, cristal: 100 }, reqFishes: { aurudo: 5 } },
            'buraco_negro': { name: "Mini Buraco Negro", req: { essencia: 80, titânio: 400, materia_escura: 80 }, reqFishes: { aurudo: 15 } },
            'paradoxo': { name: "Peso Atemporal", req: { essencia: 120, cristal: 400, poeira_cosmica: 20 }, reqFishes: { bestial: 1 } },
            'vazio_absoluto': { name: "Esfera do Nada", req: { essencia: 200, carbono: 1000, poeira_cosmica: 60 }, reqFishes: { vandalo: 1 } },
            'estrela_morta': { name: "Estrela Anã Branca", req: { materia_escura: 300, nucleo_estrela: 80 }, reqFishes: { bestial: 2 } },
            'ancora_tempo': { name: "Âncora Temporal", req: { poeira_cosmica: 200, fragmento_tempo: 80 }, reqFishes: { vandalo: 2 } },
            'buraco_minhoca': { name: "Buraco de Minhoca", req: { essencia: 400, tecido_realidade: 40 }, reqFishes: { bestial: 3, vandalo: 3 } },
            'colapso_gravitacional': { name: "Colapso Gravitacional", req: { nucleo_estrela: 400, fragmento_tempo: 150 }, reqFishes: { bestial: 5, vandalo: 5 } },
            'peso_multiverso': { name: "Esfera do Multiverso", req: { tecido_realidade: 250, fragmento_tempo: 400 }, reqFishes: { bestial: 8, vandalo: 8 } }
        },
        knives: {
            'faca_cozinha': { name: "Faca de Cozinha", req: { madeira: 20, metal: 10 }, reqFishes: { comum: 10 } },
            'faca_acougueiro': { name: "Faca de Açougueiro", req: { madeira: 40, metal: 35 }, reqFishes: { comum: 40 } },
            'faca_chef': { name: "Faca de Chef Aprendiz", req: { madeira: 80, metal: 100 }, reqFishes: { raro: 10 } },
            'cutelo_ferro': { name: "Cutelo de Ferro", req: { madeira: 150, metal: 200 }, reqFishes: { raro: 30 } },
            'faca_ouro': { name: "Faca Banhada a Ouro", req: { madeira: 200, ouro: 80 }, reqFishes: { epico: 10 } },
            'faca_pirata': { name: "Faca do Pirata", req: { madeira: 300, ouro: 200 }, reqFishes: { epico: 30 } },
            'faca_titanio': { name: "Faca de Titânio", req: { madeira: 450, titânio: 80 }, reqFishes: { lendario: 10 } },
            'cutelo_titanio': { name: "Cutelo Maciço", req: { madeira: 600, titânio: 200, metal: 400 }, reqFishes: { lendario: 25 } },
            'faca_meteorito': { name: "Faca Meteorítica", req: { madeira: 800, meteorito: 50 }, reqFishes: { mitico: 10 } },
            'lamina_cometa': { name: "Lâmina do Cometa", req: { madeira: 1200, meteorito: 120, titânio: 300 }, reqFishes: { mitico: 25 } },
            'faca_cristal': { name: "Faca de Cristal Bruto", req: { madeira: 1800, cristal: 50 }, reqFishes: { secreto: 10 } },
            'lamina_mistica': { name: "Lâmina Mística", req: { madeira: 2500, cristal: 150 }, reqFishes: { secreto: 25 } },
            'faca_sombria': { name: "Faca Sombria", req: { madeira: 3500, materia_escura: 60 }, reqFishes: { divino: 10 } },
            'cutelo_vazio': { name: "Cutelo do Vazio", req: { madeira: 5000, materia_escura: 150, meteorito: 400 }, reqFishes: { divino: 25 } },
            'faca_essencia': { name: "Faca de Essência Pura", req: { madeira: 7000, essencia: 40 }, reqFishes: { aurudo: 5 } },
            'lamina_divina': { name: "Lâmina Divina", req: { madeira: 10000, essencia: 100 }, reqFishes: { aurudo: 15 } },
            'faca_estelar': { name: "Faca Estelar", req: { madeira: 15000, poeira_cosmica: 40 }, reqFishes: { bestial: 1 } },
            'faca_neutrons': { name: "Faca de Nêutrons", req: { madeira: 25000, poeira_cosmica: 100 }, reqFishes: { vandalo: 1 } },
            'lamina_infinito': { name: "Lâmina do Infinito", req: { madeira: 40000, poeira_cosmica: 250 }, reqFishes: { bestial: 3, vandalo: 3 } },
            'faca_criador': { name: "A Faca do Criador", req: { madeira: 80000, poeira_cosmica: 500, essencia: 400 }, reqFishes: { bestial: 8, vandalo: 8 } }
        },
        hooks: {
            'anzol_sucata': { name: "Anzol Magnético", req: { metal: 250, plastico: 500 }, reqFishes: { comum: 20 } },
            'anzol_comum': { name: "Anzol Rústico", req: { madeira: 1500, fio: 1000 }, reqFishes: { raro: 15 } },
            'anzol_raro': { name: "Anzol de Cobre", req: { fibra: 2500, kevlar: 1500 }, reqFishes: { epico: 10 } },
            'anzol_epico': { name: "Anzol de Ametista", req: { ouro: 5000, titânio: 3000 }, reqFishes: { lendario: 10 } },
            'anzol_lendario': { name: "Anzol de Ouro Puro", req: { perola: 8000, carbono: 5000 }, reqFishes: { mitico: 10 } },
            'anzol_mitico': { name: "Anzol de Sangue", req: { meteorito: 12000, tecido_magico: 4000 }, reqFishes: { secreto: 10 } },
            'anzol_secreto': { name: "Anzol Sombrio", req: { cristal: 18000, escama_leviata: 8000 }, reqFishes: { divino: 10 } },
            'anzol_divino': { name: "Anzol Celestial", req: { materia_escura: 25000, nucleo_estrela: 12000, essencia: 5000 }, reqFishes: { aurudo: 5 } },
            'anzol_aurudo': { name: "Anzol do Fim", req: { fragmento_tempo: 35000, poeira_cosmica: 25000, tecido_realidade: 10000 }, reqFishes: { bestial: 2, vandalo: 2 } }
        }
    }
};

window.MATERIALS = window.CRAFTING_DB.materials;

// MANTENHA O RESTANTE DO ARQUIVO INTACTO (HOOKS, ROD_TEMPLATES, SINKERS, KNIVES, BAITS, RARITIES E SUCATAS)

window.HOOKS = [
    { id: 'anzol_padrao', name: 'Anzol Padrão', color: '#bdc3c7', target: 'padrao', power: 0, lore: "⚙️ Função: Pescar o que vier. ✨ Diferencial: Nenhum. 📖 Origem: Veio agarrado à sua primeira vara." },
    { id: 'anzol_sucata', name: 'Anzol Magnético', color: '#7f8c8d', target: 'sucata', power: 0.50, lore: "⚙️ Função: Focar no Lixo (+50%). ✨ Diferencial: Atrai detritos pesados do fundo. 📖 Origem: Feito de ímãs de neodímio arrancados de satélites." },
    { id: 'anzol_comum', name: 'Anzol Rústico', color: '#95a5a6', target: 'comum', power: 0.50, lore: "⚙️ Função: Focar em Comuns (+50%). ✨ Diferencial: Discreto e entediante, os peixes ignoram. 📖 Origem: Produção em massa nas fábricas do cais." },
    { id: 'anzol_raro', name: 'Anzol de Cobre', color: '#2ecc71', target: 'raro', power: 0.30, lore: "⚙️ Função: Focar em Raros (+30%). ✨ Diferencial: Oxida em tons de verde vibrante na água salgada. 📖 Origem: Moldado a partir de antigos fios elétricos." },
    { id: 'anzol_epico', name: 'Anzol de Ametista', color: '#9b59b6', target: 'epico', power: 0.20, lore: "⚙️ Função: Focar em Épicos (+20%). ✨ Diferencial: Reflete um raio ultravioleta que hipnotiza. 📖 Origem: Esculpido a partir das joias de uma coroa afundada." },
    { id: 'anzol_lendario', name: 'Anzol de Ouro Puro', color: '#f1c40f', target: 'lendario', power: 0.10, lore: "⚙️ Função: Focar em Lendários (+10%). ✨ Diferencial: É tão pesado que quebra o maxilar do peixe na fisgada. 📖 Origem: Ouro derretido de dentes de piratas amaldiçoados." },
    { id: 'anzol_mitico', name: 'Anzol de Sangue', color: '#e74c3c', target: 'mitico', power: 0.05, lore: "⚙️ Função: Focar em Míticos (+5%). ✨ Diferencial: Uma coloração carmesim que nunca desbota na água. 📖 Origem: Forjado nas veias de magma de um vulcão ativo." },
    { id: 'anzol_secreto', name: 'Anzol Sombrio', color: '#2c3e50', target: 'secreto', power: 0.02, lore: "⚙️ Função: Focar em Secretos (+2%). ✨ Diferencial: Totalmente invisível na escuridão. 📖 Origem: Matéria escura condensada que suga a luz ao seu redor." },
    { id: 'anzol_divino', name: 'Anzol Celestial', color: '#f39c12', target: 'divino', power: 0.005, lore: "⚙️ Função: Focar em Divinos (+0.5%). ✨ Diferencial: Brilha como uma estrela cadente no breu abissal. 📖 Origem: A ponta quebrada da lança de um deus esquecido." },
    { id: 'anzol_aurudo', name: 'Anzol do Fim', color: '#ffd700', target: 'aurudo', power: 0.001, lore: "⚙️ Função: Focar em Aurudos (+0.1%). ✨ Diferencial: Distorce a realidade, enganando as entidades cósmicas. 📖 Origem: O centro exato do universo dobrado no formato de um gancho." }
];

window.ROD_TEMPLATES = [
    { name: "Galho Seco", type: "madeira", price: 0, speed: 1.0, luck: 0, lore: "⚙️ Função: Nenhuma. ✨ Diferencial: Parte no meio se o peixe espirrar. 📖 Origem: Caiu de uma árvore podre direto nas suas patas." },
    { name: "Vara de Bambu", type: "madeira", price: 250, speed: 1.1, luck: 40, lore: "⚙️ Função: Pesca de base. ✨ Diferencial: Verde e orgulhosa. 📖 Origem: Colhida por monges do Monte Miau, cheira a chá verde." },
    { name: "Bambu Reforçado", type: "madeira", price: 800, speed: 1.25, luck: 120, lore: "⚙️ Função: Pesca costeira. ✨ Diferencial: Fita adesiva segurando as pontas. 📖 Origem: Uma versão que um gato engenheiro consertou." },
    { name: "Caniço de Salgueiro", type: "madeira", price: 2000, speed: 1.35, luck: 250, lore: "⚙️ Função: Linha firme. ✨ Diferencial: Enverga poeticamente ao vento. 📖 Origem: Dizem que chora quando um peixe foge." },
    { name: "Vara de Plástico", type: "fibra", price: 5000, speed: 1.5, luck: 500, lore: "⚙️ Função: Alta durabilidade. ✨ Diferencial: Nunca apodrece. 📖 Origem: Feita inteiramente de garrafas PET recicladas do oceano." },
    { name: "Fibra de Vidro", type: "fibra", price: 12000, speed: 1.7, luck: 900, lore: "⚙️ Função: Desempenho equilibrado. ✨ Diferencial: Dá choques estáticos no utilizador. 📖 Origem: Criada num laboratório clandestino de felinos." },
    { name: "Fibra Premium", type: "fibra", price: 25000, speed: 2.0, luck: 1500, lore: "⚙️ Função: Domínio das ondas. ✨ Diferencial: Leve como uma pluma. 📖 Origem: O padrão de ouro das competições de pesca do Cais." },
    { name: "Polímero Flexível", type: "fibra", price: 50000, speed: 2.3, luck: 2200, lore: "⚙️ Função: Luta contra Gigantes. ✨ Diferencial: Transparente sob a luz. 📖 Origem: Um material que tenta imitar a água para enganar os peixes." },
    { name: "Alumínio Leve", type: "metal", price: 95000, speed: 2.6, luck: 3000, lore: "⚙️ Função: Resistência marítima. ✨ Diferencial: Reflete o sol, cegando rivais. 📖 Origem: Canos de exaustão de motos tunadas." },
    { name: "Aço Inoxidável", type: "metal", price: 180000, speed: 3.0, luck: 4500, lore: "⚙️ Função: Águas profundas. ✨ Diferencial: Pesada, mas indestrutível. 📖 Origem: Feita a partir das grades de uma prisão de segurança máxima." },
    { name: "Liga de Titânio", type: "metal", price: 350000, speed: 3.5, luck: 6000, lore: "⚙️ Função: Pesca tática. ✨ Diferencial: Não detectada em radares. 📖 Origem: Restos de um caça stealth que caiu no oceano pacífico." },
    { name: "Vara de Grafeno", type: "metal", price: 700000, speed: 4.0, luck: 8000, lore: "⚙️ Função: Pesca atômica. ✨ Diferencial: Fina como um fio de cabelo. 📖 Origem: O prêmio Nobel de física roubado por um gato curioso." },
    { name: "Carbono Básico", type: "carbono", price: 1200000, speed: 4.5, luck: 10500, lore: "⚙️ Função: Alta performance. ✨ Diferencial: Absorve o impacto dos peixes Lendas. 📖 Origem: Tecnologia espacial rebaixada para pescar sardinhas." },
    { name: "Vara Eletrônica", type: "carbono", price: 2500000, speed: 5.2, luck: 13000, lore: "⚙️ Função: Mira laser. ✨ Diferencial: Faz um barulho de bipe irritante. 📖 Origem: Vara cibernética com inteligência artificial básica (que te odeia)." },
    { name: "Fibra de Nanotubos", type: "carbono", price: 5000000, speed: 6.0, luck: 16000, lore: "⚙️ Função: Suporta toneladas. ✨ Diferencial: Estrutura celular inquebrável. 📖 Origem: Feita do mesmo material que os elevadores espaciais." },
    { name: "Protótipo Militar", type: "carbono", price: 10000000, speed: 7.5, luck: 20000, lore: "⚙️ Função: Extração à força. ✨ Diferencial: Contém pequenos mísseis integrados. 📖 Origem: Projeto cancelado pela marinha, arrematado no mercado negro." },
    { name: "Vara Oceânica", type: "mistico", price: 25000000, speed: 9.0, luck: 25000, lore: "⚙️ Função: Comando das marés. ✨ Diferencial: Feita de água solidificada. 📖 Origem: Abençoada pelas sereias das fossas abissais." },
    { name: "Arpão Antigo", type: "mistico", price: 50000000, speed: 11.0, luck: 30000, lore: "⚙️ Função: Caça a mitos. ✨ Diferencial: Tem vontade própria. 📖 Origem: A mesma arma que supostamente feriu Moby Dick." },
    { name: "Tridente de Netuno", type: "mistico", price: 120000000, speed: 14.0, luck: 38000, lore: "⚙️ Função: Realeza marítima. ✨ Diferencial: Os peixes têm medo de olhar para ela. 📖 Origem: Roubada das ruínas da própria Atlântida." },
    { name: "Vara Galáctica", type: "divino", price: 300000000, speed: 18.0, luck: 48000, lore: "⚙️ Função: Pesca nas estrelas. ✨ Diferencial: O anzol viaja pelo vácuo. 📖 Origem: Uma constelação que foi achatada em formato de vara." },
    { name: "Vara Quântica", type: "divino", price: 750000000, speed: 25.0, luck: 60000, lore: "⚙️ Função: Probabilidades de Schrödinger. ✨ Diferencial: O peixe está na linha e não está ao mesmo tempo. 📖 Origem: Forjada num colisor de hádrons." },
    { name: "A Vara do Criador", type: "divino", price: 2000000000, speed: 40.0, luck: 80000, lore: "⚙️ Função: O Absoluto. ✨ Diferencial: Reescreve o código-fonte do mar. 📖 Origem: A primeira ferramenta usada para criar o próprio Gato Pescador." },
    { name: "Vara do Tempo", type: "mistico", price: 5000000000, speed: 50.0, luck: 120000, lore: "⚙️ Função: Pesca no passado. ✨ Diferencial: Puxa o peixe antes dele morder. 📖 Origem: O ponteiro das horas do relógio do fim do mundo." },
    { name: "Cetro Celestial", type: "divino", price: 12000000000, speed: 65.0, luck: 180000, lore: "⚙️ Função: Imposição divina. ✨ Diferencial: Os peixes pulam para fora da água voluntariamente em respeito. 📖 Origem: A bengala de um ser celestial aposentado." },
    { name: "Teia do Destino", type: "mistico", price: 25000000000, speed: 85.0, luck: 250000, lore: "⚙️ Função: O fim inescapável. ✨ Diferencial: Ninguém escapa. 📖 Origem: Fios roubados das Moiras enquanto elas dormiam." },
    { name: "Vara da Singularidade", type: "divino", price: 60000000000, speed: 110.0, luck: 400000, lore: "⚙️ Função: Fim da matéria. ✨ Diferencial: Curva o espaço e suga os Divinos. 📖 Origem: Um mini buraco negro contido em uma gaiola de vidro estelar." },
    { name: "Pescadora de Realidades", type: "divino", price: 150000000000, speed: 160.0, luck: 800000, lore: "⚙️ Função: Multiverso. ✨ Diferencial: Pesca peixes de jogos diferentes. 📖 Origem: A fronteira final. Forjada além das barreiras da quarta parede." }
];

window.SINKERS = [
    { id: 'chumbo', name: 'Chumbo Padrão', price: 0, lore: "⚙️ Função: Afundar a isca... às vezes. ✨ Diferencial: Sem brilho, sem glória. 📖 Origem: Um calhau aleatório que um gato lambeu e usou como peso.", stats: {} },
    { id: 'pedra_rio', name: 'Pedra de Rio', price: 1200, lore: "⚙️ Função: Velocidade modesta. ✨ Diferencial: Bem polida pelas águas. 📖 Origem: Apanhada na margem do riacho da vila.", stats: { speed: 1.15, luck: 20 } },
    { id: 'casca_noz', name: 'Casca Leve', price: 3500, lore: "⚙️ Função: Sinergia fluída. ✨ Diferencial: Flutua um pouco, ajudando na linha. 📖 Origem: Restos de um esquilo guloso.", stats: { luck: 40 }, synergy: { type: 'madeira', luck: 80, desc: "Sorte +80" } },
    { id: 'disco_plastico', name: 'Disco Plano', price: 8000, lore: "⚙️ Função: Corte hidrodinâmico. ✨ Diferencial: Desce cortando a água sem resistência. 📖 Origem: Uma tampa de Tupperware esquecida.", stats: { speed: 1.3, luck: 100 } },
    { id: 'bobina_fibra', name: 'Bobina Estabilizada', price: 18000, lore: "⚙️ Função: Estabilização de linha. ✨ Diferencial: Impede que a isca gire à toa. 📖 Origem: Componente de uma máquina de costura industrial.", stats: { luck: 250 }, synergy: { type: 'fibra', speed: 1.6, desc: "Vel x1.6" } },
    { id: 'ferro_velho', name: 'Peso de Sucata', price: 40000, lore: "⚙️ Função: Aumentar lucros brutos. ✨ Diferencial: Solta óleo que atrai peixes gulosos. 📖 Origem: Pedaço de um motor de trator velho.", stats: { value: 1.4, luck: 400 } },
    { id: 'anilha_aco', name: 'Anilha de Academia', price: 85000, lore: "⚙️ Função: Queda livre. ✨ Diferencial: Pesada, brutal, direta. 📖 Origem: Roubada de um halterofilista no Cais Sul.", stats: { speed: 1.8, luck: 750 } },
    { id: 'magneto', name: 'Imã Industrial', price: 160000, lore: "⚙️ Função: Sinergia de Metal profunda. ✨ Diferencial: Puxa minerais das profundezas. 📖 Origem: Parte de um guindaste de ferro-velho.", stats: { luck: 1200 }, synergy: { type: 'metal', value: 2.2, desc: "Lucro x2.2" } },
    { id: 'peso_tungstenio', name: 'Esfera Pesada', price: 320000, lore: "⚙️ Função: Perfuração aquática. ✨ Diferencial: O metal mais denso do mercado. 📖 Origem: Usado na ponta de ogivas perfurantes anti-bunker.", stats: { speed: 2.2, luck: 2000 } },
    { id: 'pepita_luxo', name: 'Pepita Polida', price: 700000, lore: "⚙️ Função: Ostentação pura. ✨ Diferencial: O brilho atrai ricaços (lucro x2.5). 📖 Origem: Escavada nas minas de ouro do Oeste.", stats: { value: 2.5, luck: 3500 } },
    { id: 'nucleo_carbono', name: 'Peso de Fibra', price: 1500000, lore: "⚙️ Função: Sinergia de carbono extremo. ✨ Diferencial: Atrair gigantes sutilmente. 📖 Origem: O núcleo do coração de um motor de super-carro.", stats: { speed: 1.5, luck: 5000 }, synergy: { type: 'carbono', chance67: 0.07, desc: "+7% chance 67cm" } },
    { id: 'bateria_ion', name: 'Célula de Energia', price: 4000000, lore: "⚙️ Função: Choque de velocidade. ✨ Diferencial: Eletrifica a água, descendo como um raio. 📖 Origem: Fonte de energia de uma arma laser desativada.", stats: { speed: 3.0, luck: 7500 } },
    { id: 'prisma_oceano', name: 'Prisma de Coral', price: 10000000, lore: "⚙️ Função: Sorte monumental. ✨ Diferencial: Refrata a luz em 7 cores mágicas. 📖 Origem: Cristalizado nas fossas de coral de sereias anciãs.", stats: { luck: 10000 } },
    { id: 'reliquia_abismo', name: 'Artefato Antigo', price: 25000000, lore: "⚙️ Função: Sinergia Mística. ✨ Diferencial: Sussurra línguas mortas sob a água. 📖 Origem: Exumada do túmulo de uma civilização submarina extinta.", stats: { value: 2.0, luck: 12000 }, synergy: { type: 'mistico', luck: 8000, desc: "Sorte +8000" } },
    { id: 'fragmento_estelar', name: 'Fragmento de Cometa', price: 60000000, lore: "⚙️ Função: Atração de Gigantes (67cm). ✨ Diferencial: Continua pegando fogo dentro da água. 📖 Origem: Despencou do céu e evaporou um lago inteiro.", stats: { chance67: 0.15, luck: 18000 } },
    { id: 'antimateria_v2', name: 'Peso de Antimatéria', price: 150000000, lore: "⚙️ Função: Quebra as regras da física. ✨ Diferencial: Não afunda, a água que sobe à sua volta. 📖 Origem: Uma gota de anti-energia estabilizada à força.", stats: { speed: 5.0, value: 3.0, luck: 25000 } },
    { id: 'divindade_ouro', name: 'Ídolo Dourado', price: 400000000, lore: "⚙️ Função: Multiplicador profano. ✨ Diferencial: Exige respeito dos reis dos mares. 📖 Origem: Estátua profanada de um templo de felinos dourados.", stats: { luck: 35000 }, synergy: { type: 'divino', value: 10.0, desc: "Lucro x10" } },
    { id: 'buraco_negro', name: 'Mini Buraco Negro', price: 1000000000, lore: "⚙️ Função: Sucção abissal. ✨ Diferencial: Dobra a luz. A linha parece desaparecer nele. 📖 Origem: Um vácuo engarrafado.", stats: { speed: 10.0, luck: 50000, chance67: 0.35 } },
    { id: 'paradoxo', name: 'Peso Atemporal', price: 2500000000, lore: "⚙️ Função: Imune ao tempo. ✨ Diferencial: Ele afunda antes de você jogar. 📖 Origem: Algo que sempre existiu e nunca foi criado.", stats: { speed: 15.0, chance67: 0.20, luck: 70000 } },
    { id: 'vazio_absoluto', name: 'Esfera do Nada', price: 5000000000, lore: "⚙️ Função: Destruição. ✨ Diferencial: O zero absoluto encapsulado. 📖 Origem: O que restou do universo passado.", stats: { speed: 20.0, luck: 100000, value: 15.0, chance67: 0.50 } },
    { id: 'estrela_morta', name: 'Estrela Anã Branca', price: 12000000000, lore: "⚙️ Função: Peso astronômico. ✨ Diferencial: Uma colher de chá pesa 15 toneladas. 📖 Origem: O cadáver de um sistema estelar distante.", stats: { speed: 25.0, luck: 150000, chance67: 0.55 } },
    { id: 'ancora_tempo', name: 'Âncora Temporal', price: 25000000000, lore: "⚙️ Função: Imobiliza as Lendas. ✨ Diferencial: Prende o peixe numa teia de tempo. 📖 Origem: Forjada no núcleo de um relógio quebrado.", stats: { speed: 30.0, luck: 250000, chance67: 0.60 } },
    { id: 'buraco_minhoca', name: 'Buraco de Minhoca', price: 50000000000, lore: "⚙️ Função: Atalho subespacial. ✨ Diferencial: A linha entra por um portal e sai no fundo do oceano. 📖 Origem: Dobra teórica do cosmos.", stats: { speed: 35.0, luck: 400000, value: 20.0, chance67: 0.65 } },
    { id: 'colapso_gravitacional', name: 'Colapso Gravitacional', price: 100000000000, lore: "⚙️ Função: Aniquilação total. ✨ Diferencial: A própria água foge de medo. 📖 Origem: A morte de três galáxias fundidas em metal.", stats: { speed: 45.0, luck: 600000, value: 25.0, chance67: 0.70 } },
    { id: 'peso_multiverso', name: 'Esfera do Multiverso', price: 250000000000, lore: "⚙️ Função: Omni-presença. ✨ Diferencial: Puxa peixes que nem sequer existiam na sua linha do tempo. 📖 Origem: Criada pelo erro de um Deus descuidado.", stats: { speed: 60.0, luck: 1000000, value: 40.0, chance67: 0.80 } }
];

window.KNIVES = [
    { id: 'faca_cozinha', name: 'Faca de Cozinha', mult: 1.0, lore: "⚙️ Função: Cortes básicos (x1). ✨ Diferencial: Cega e sem fio. Não extrai materiais. 📖 Origem: Achada na gaveta esquecida da Vovó Gata.", dropsMats: false },
    { id: 'faca_acougueiro', name: 'Faca de Açougueiro', mult: 1.2, lore: "⚙️ Função: Pancadas brutas. ✨ Diferencial: Espessa e intimidadora. 📖 Origem: Roubada de um talho no mercado de peixe local.", dropsMats: false },
    { id: 'faca_chef', name: 'Faca de Chef Aprendiz', mult: 1.5, lore: "⚙️ Função: Precisão modesta. ✨ Diferencial: O punho cheira a alho. 📖 Origem: Pertenceu a um cozinheiro de segunda classe que desistiu.", dropsMats: false },
    { id: 'cutelo_ferro', name: 'Cutelo de Ferro', mult: 2.0, lore: "⚙️ Função: Quebra ossos. ✨ Diferencial: Extremamente pesada, corte falho. 📖 Origem: Forjada por um ferreiro aprendiz vesgo.", dropsMats: false },
    { id: 'faca_ouro', name: 'Faca Banhada a Ouro', mult: 3.0, lore: "⚙️ Função: Luxo e ostentação. ✨ Diferencial: Totalmente inútil para combate. 📖 Origem: Roubada do faqueiro da realeza felina.", dropsMats: false },
    { id: 'faca_pirata', name: 'Faca do Pirata', mult: 4.0, lore: "⚙️ Função: Saques gloriosos (+ Materiais). ✨ Diferencial: Denteada para rasgar. 📖 Origem: Usada para motins a bordo de galeões fantasmas.", dropsMats: true },
    { id: 'faca_titanio', name: 'Faca de Titânio', mult: 6.0, lore: "⚙️ Função: Incisão microscópica. ✨ Diferencial: Mais leve que a água. 📖 Origem: Lâmina cirúrgica de um antigo navio-hospital.", dropsMats: true },
    { id: 'cutelo_titanio', name: 'Cutelo Maciço', mult: 8.0, lore: "⚙️ Função: Divisão limpa. ✨ Diferencial: Corta uma âncora ao meio sem amassar. 📖 Origem: Arma usada na guerra contra os Caranguejos Reais.", dropsMats: true },
    { id: 'faca_meteorito', name: 'Faca Meteorítica', mult: 12.0, lore: "⚙️ Função: Fritar ao cortar. ✨ Diferencial: O fio queima a carne estancando o sangue. 📖 Origem: Ferreiros anciões bateram nela enquanto ela caía do céu.", dropsMats: true },
    { id: 'lamina_cometa', name: 'Lâmina do Cometa', mult: 15.0, lore: "⚙️ Função: Separação celestial. ✨ Diferencial: Deixa um rastro de gelo estelar. 📖 Origem: Pedaço afiado da cauda de Halley.", dropsMats: true },
    { id: 'faca_cristal', name: 'Faca de Cristal Bruto', mult: 20.0, lore: "⚙️ Função: Cortes mágicos. ✨ Diferencial: Transparente, você só vê o sangue nela. 📖 Origem: Esculpida pelos Monges do Cume Nevado.", dropsMats: true },
    { id: 'lamina_mistica', name: 'Lâmina Mística', mult: 30.0, lore: "⚙️ Função: Multiplicador abissal. ✨ Diferencial: Sussurra feitiços de corte para a carne do peixe. 📖 Origem: Abençoada no Templo Submerso.", dropsMats: true },
    { id: 'faca_sombria', name: 'Faca Sombria', mult: 50.0, lore: "⚙️ Função: Corta a alma do peixe. ✨ Diferencial: A luz não reflete nela. 📖 Origem: Usada em sacrifícios para apaziguar o Leviatã.", dropsMats: true },
    { id: 'cutelo_vazio', name: 'Cutelo do Vazio', mult: 80.0, lore: "⚙️ Função: Separa as moléculas em zero. ✨ Diferencial: Deleta do universo a parte que toca. 📖 Origem: Arrancada das garras de uma anomalia espacial.", dropsMats: true },
    { id: 'faca_essencia', name: 'Faca de Essência Pura', mult: 100.0, lore: "⚙️ Função: Filetar Lendas. ✨ Diferencial: Brilha intensamente com pura vida. 📖 Origem: Um presente do próprio Avatar Gato.", dropsMats: true },
    { id: 'lamina_divina', name: 'Lâmina Divina', mult: 120.0, lore: "⚙️ Função: Multiplicador x120. ✨ Diferencial: Só os puros de coração podem erguê-la. 📖 Origem: Forjada pelas três Moiras no núcleo do Sol.", dropsMats: true },
    { id: 'faca_estelar', name: 'Faca Estelar', mult: 150.0, lore: "⚙️ Função: Cortes astronômicos. ✨ Diferencial: Contém uma galáxia minúscula no cabo. 📖 Origem: A arma usada para fatiar as nebulosas.", dropsMats: true },
    { id: 'faca_neutrons', name: 'Faca de Nêutrons', mult: 300.0, lore: "⚙️ Função: Desintegração lucrativa. ✨ Diferencial: Pesa o mesmo que a lua, mas você a sente leve. 📖 Origem: Estrela morta lapidada.", dropsMats: true },
    { id: 'lamina_infinito', name: 'Lâmina do Infinito', mult: 500.0, lore: "⚙️ Função: Saques sem limites. ✨ Diferencial: Possui arestas infinitamente afiadas na geometria fractal. 📖 Origem: O último artefato cósmico catalogado.", dropsMats: true },
    { id: 'faca_criador', name: 'A Faca do Criador', mult: 1000.0, lore: "⚙️ Função: A Edição Definitiva (x1000). ✨ Diferencial: Ao usá-la, o código do jogo vacila. 📖 Origem: Segurada pelo Programador Primordial.", dropsMats: true }
];

window.BAITS = [
    { id: 'pao', icon: '🍞', name: 'Miolo de Pão', qty: 10, desc: 'Sorte +5', stats: { luck: 5 }, req: { restos_comida: 2, fio: 1 }, lore: "⚙️ Função: Pega os burros. ✨ Diferencial: Esfarela logo. 📖 Origem: Resto do lanche." },
    { id: 'minhoca', icon: '🐛', name: 'Minhoca', qty: 5, desc: 'Sorte +15', stats: { luck: 15 }, req: { restos_comida: 3, inseto_morto: 1 }, lore: "⚙️ Função: Um clássico. ✨ Diferencial: Mexe-se na água de forma tentadora. 📖 Origem: Cavada do quintal." },
    { id: 'grilo', icon: '🦗', name: 'Grilo Falante', qty: 5, desc: 'Sorte +30', stats: { luck: 30 }, req: { inseto_morto: 3, plastico: 1 }, lore: "⚙️ Função: Atrair Raros. ✨ Diferencial: Faz barulho debaixo d'água. 📖 Origem: Vivia dando conselhos a um boneco de madeira." },
    { id: 'queijo', icon: '🧀', name: 'Queijo Fedido', qty: 5, desc: 'Lucro x1.5', stats: { value: 1.5 }, req: { restos_comida: 5, geleia_estranha: 1 }, lore: "⚙️ Função: Dinheiro fácil. ✨ Diferencial: Um cheiro que enjoa demônios e atrai ouro. 📖 Origem: Estava esquecido há 5 anos numa geladeira." },
    { id: 'camarao', icon: '🦐', name: 'Camarão', qty: 5, desc: 'Sorte +80', stats: { luck: 80 }, req: { inseto_morto: 5, geleia_estranha: 2 }, lore: "⚙️ Função: Isca Premium. ✨ Diferencial: Sabor doce de crustáceo. 📖 Origem: Roubado do mercado do Cais." },
    { id: 'vagalume', icon: '✨', name: 'Vagalume', qty: 5, desc: 'Sorte +150 | +2% 67cm', stats: { luck: 150, chance67: 0.02 }, req: { inseto_morto: 10, biomassa_brilhante: 1 }, lore: "⚙️ Função: Chamar atenção à noite. ✨ Diferencial: Pisca como uma balada de neon. 📖 Origem: Capturado numa floresta enfeitiçada." },
    { id: 'isca_metal', icon: '🪝', name: 'Isca de Metal', qty: 5, desc: 'Lucro x3.0', stats: { value: 3.0 }, req: { geleia_estranha: 5, metal: 2 }, lore: "⚙️ Função: Falsidade brilhante. ✨ Diferencial: Reflete o sol, os peixes adoram. 📖 Origem: Molde artificial feito à máquina." },
    { id: 'lula', icon: '🦑', name: 'Lula Gigante', qty: 5, desc: 'Sorte +300', stats: { luck: 300 }, req: { biomassa_brilhante: 3, energia_condensada: 1 }, lore: "⚙️ Função: Pesca Épica. ✨ Diferencial: Solta uma tinta preta deliciosa. 📖 Origem: Filhotes arrancados dos braços do Kraken." },
    { id: 'sushi', icon: '🍣', name: 'Sushi Premium', qty: 5, desc: 'Sorte +450 | Lucro x3', stats: { luck: 450, value: 3.0 }, req: { biomassa_brilhante: 5, po_magico: 1 }, lore: "⚙️ Função: Requinte e sorte. ✨ Diferencial: Canibalismo sutil. 📖 Origem: Feito de restos de pescarias lendárias antigas." },
    { id: 'cometa', icon: '☄️', name: 'Pó de Cometa', qty: 3, desc: '+10% Chance 67cm', stats: { chance67: 0.10 }, req: { energia_condensada: 3, meteorito: 1 }, lore: "⚙️ Função: Pesca de Gigantes. ✨ Diferencial: Deixa a água fervendo e atrai colossos. 📖 Origem: Pó mágico varrido das caudas de asteróides." },
    { id: 'hamburguer', icon: '🍔', name: 'Podrão dos Mares', qty: 5, desc: 'Lucro Extremo (x6.0)', stats: { value: 6.0 }, req: { geleia_estranha: 10, escama_dragao: 1 }, lore: "⚙️ Função: Riqueza instantânea. ✨ Diferencial: Obesidade aquática. 📖 Origem: Criado na esquina mais suja do cais. Inacreditável." },
    { id: 'queijo_azul', icon: '🧀', name: 'Gorgonzola Galáctico', qty: 5, desc: 'Lucro x8.0', stats: { value: 8.0 }, req: { energia_condensada: 5, essencia_sombria: 1 }, lore: "⚙️ Função: O odor atrai o Ouro. ✨ Diferencial: Cresce mofo azul espacial. 📖 Origem: Maturado em microgravidade na lua de Netuno." },
    { id: 'radioativa', icon: '☢️', name: 'Isca Mutante', qty: 3, desc: 'Sorte +1200', stats: { luck: 1200 }, req: { biomassa_brilhante: 10, lagrima_sereia: 1 }, lore: "⚙️ Função: Evoca as aberrações. ✨ Diferencial: Brilha em tons de verde doentio. 📖 Origem: Sobreviveu ao vazamento do reator 4." },
    { id: 'lula_neon', icon: '🦑', name: 'Lula de Neon', qty: 3, desc: 'Sorte +2500', stats: { luck: 2500 }, req: { energia_condensada: 8, perola: 2 }, lore: "⚙️ Função: Atrai no breu. ✨ Diferencial: Pega fogo quando agitada. 📖 Origem: Abençoada pelas marés ácidas e corais brilhantes." },
    { id: 'kraken', icon: '👁️', name: 'Olho do Kraken', qty: 3, desc: 'Garante Gigantes (+20%)', stats: { chance67: 0.20 }, req: { energia_condensada: 12, fogo_fatuo: 1 }, lore: "⚙️ Função: Dominar titãs. ✨ Diferencial: Ele pisca para ti de vez em quando. 📖 Origem: Arrancado a frio da criatura mítica." },
    { id: 'essencia_deus', icon: '🍷', name: 'Néctar Divino', qty: 2, desc: 'Sorte +6000', stats: { luck: 6000, chance67: 0.25 }, req: { po_magico: 5, essencia: 1 }, lore: "⚙️ Função: Chamar a nobreza marinha. ✨ Diferencial: Embriaga os deuses. 📖 Origem: Destilado de nuvens doces do paraíso dos gatos." },
    { id: 'vazio', icon: '🌌', name: 'Essência do Vazio', qty: 2, desc: 'Sorte +10000', stats: { luck: 10000 }, req: { essencia_sombria: 5, materia_escura: 2 }, lore: "⚙️ Função: Atrair demónios e mitos. ✨ Diferencial: Gela o oceano ao seu redor. 📖 Origem: O que resta quando tudo mais desaparece." },
    { id: 'sol', icon: '☀️', name: 'Fragmento Solar', qty: 2, desc: 'Astro-Rei (+40%)', stats: { chance67: 0.40 }, req: { fogo_fatuo: 5, cristal: 5 }, lore: "⚙️ Função: Despertar de colossos. ✨ Diferencial: Ferve a água numa raio de 3 metros. 📖 Origem: Uma farpa roubada da coroa solar." },
    { id: 'supernova', icon: '💥', name: 'Isca Supernova', qty: 1, desc: 'Lucro x50', stats: { value: 50.0, chance67: 0.40 }, req: { energia_condensada: 50, materia_escura: 5 }, lore: "⚙️ Função: Fazer você o ser mais rico vivo. ✨ Diferencial: Explode no fundo, espalhando poeira de ouro. 📖 Origem: Fim cataclísmico e condensado." },
    { id: 'definitiva', icon: '👑', name: 'Matadora de Deuses', qty: 1, desc: 'Poder Máximo.', stats: { luck: 25000, value: 30.0, chance67: 0.60 }, req: { fogo_fatuo: 20, essencia: 5 }, lore: "⚙️ Função: Invocar os Aurudos. ✨ Diferencial: Ela pulsa com um batimento cardíaco assustador. 📖 Origem: A isca preferida dos Senhores do Universo." },
    { id: 'alma_gato', icon: '🐈', name: 'Nona Alma', qty: 1, desc: 'O impossível.', stats: { luck: 50000, value: 100.0, chance67: 0.70 }, req: { lagrima_sereia: 50, poeira_cosmica: 2 }, lore: "⚙️ Função: O Desfecho Final. ✨ Diferencial: Exige sacrifício. Não há erro. 📖 Origem: A essência final da alma do próprio Gato Pescador." }
];

window.RARITIES = {
    COMUM: { id: 'comum', prob: 0.35, mult: 1, style: 'text-comum', border: 'border-comum', name: 'Comum', variations: [
        { name: 'Peixe Genérico', image: '/img/peixe/Genericfish001.webp', time: 'all', events: ["all"] },
        { name: 'Bombardilo', image: '/img/peixe/bombardilo crocarilho.webp', time: 'day', events: ["all"] },
        { name: 'Ah, peixe legal', image: '/img/peixe/PeixeLegal.avif', time: 'day', events: ["all"] },
        { name: 'Cruel kidfish', image: '/img/peixe/KidFish.png', time: 'night', events: ["all"] },
        { name: 'Pexudo', image: '/img/peixe/peixebala.png', time: 'all', events: ["all"] },
        { name: 'Ah, peixe legal..?', image: '/img/peixe/lolidasaguas.png', time: 'night', events: ["all"] },
        { name: 'Peixe Feinho', image: '/img/peixe/PeixinhoFeio.webp', time: 'night', events: ["tempestade"] }
    ]},
    RARO: { id: 'raro', prob: 0.30, mult: 3, style: 'text-raro', border: 'border-raro', name: 'Raro', variations: [
        { name: 'Peixe Estranho', image: '/img/peixe/UnderWaterAhhFish.png', time: 'night', events: ["all"] },
        { name: 'Meu çélebro', image: '/img/peixe/tarlalareo fish.png', time: 'all', events: ["all"] },
        { name: 'Cubic Boccacete', image: '/img/peixe/hyt.png', time: 'day', events: ["all"] },
        { name: 'PUTAPEIXE', image: '/img/peixe/PUTARALHOFISH, porra.png', time: 'all', events: ["all"] },
        { name: 'Peixe Burrinho', image: '/img/peixe/dumbAssFish.png', time: 'all', events: ["all"] },
        { name: 'Meio Peixe', image: '/img/peixe/meio-epixe.png', time: 'night', events: ["all"] }
    ]},
    EPICO: { id: 'epico', prob: 0.15, mult: 8, style: 'text-epico', border: 'border-epico', name: 'Épico', variations: [
        { name: 'Mahi-Mahi', image: '/img/peixe/Mahi-Mahifish square.webp', time: 'all', events: ["all"] },
        { name: 'Peixe Otário', image: '/img/peixe/PeixeOtario.png', time: 'day', events: ["all"] },
        { name: 'Peixe Lhapaço', image: '/img/peixe/peixe-palhaco.png', time: 'all', events: ["all"] },
        { name: 'Cardume Carloso', image: '/img/peixe/Carlosacardume.png', time: 'day', events: ["all"] },
        { name: 'Peixe Olho Pentagonal', image: '/img/peixe/betaMaximo.webp', time: 'all', events: ["all"] },
        { name: 'Lanterna Gay', image: '/img/peixe/angler-cliparte.png', time: 'night', events: ["all"] }
    ]},
    LENDARIO: { id: 'lendario', prob: 0.08, mult: 20, style: 'text-lendario', border: 'border-lendario', name: 'Lendário', variations: [
        { name: 'Peixe Motosserra', image: '/img/peixe/Chainsawfish.webp', time: 'night', events: ["all"] },
        { name: 'Big Eye Bocaccete', image: '/img/peixe/hytal.png', time: 'day', events: ["all"] },
        { name: 'Peixe Demônio negro', image: '/img/peixe/DemonicAHHfish (1).png', time: 'night', events: ["tempestade"] },
        { name: 'Peixe Entulhado', image: '/img/peixe/EntulhoFish.png', time: 'day', events: ["all"] },
        { name: 'Peixes Fófos Juntos <3', image: '/img/peixe/vcsestaoempublicomaisrespeito.png', time: 'all', events: ["tempestade", "frenesi", "misticismo"] } 
    ]},
    MITICO: { id: 'mitico', prob: 0.03, mult: 50, style: 'text-mitico', border: 'border-mitico', name: 'Mítico', variations: [
        { name: 'Jogo do Peixe Retardo', image: '/img/peixe/GameofRetardedfish.png', time: 'night', events: ["ouro", "frenesi", "misticismo"] },
        { name: 'Peixe Dor Cabeçaa', image: '/img/peixe/PeixeCancer.png', time: 'all', events: ["all"] },
        { name: 'Cardume Fecundador', image: '/img/peixe/cardume dos meus filhos.png', time: 'all', events: ["all"] },
        { name: 'Peixe das Águas Reais', image: '/img/peixe/aquoso.webp', time: 'day', events: ["ouro", "misticismo"] },
        { name: 'Darwin?!?!', image: '/img/peixe/darwin.png', time: 'all', events: ["all"] },
        { name: 'Baleia Gorda', image: '/img/peixe/baleia.webp', time: 'day', events: ["all"] }
    ]},
    SECRETO: { id: 'secreto', prob: 0.005, mult: 150, style: 'text-secreto', border: 'border-secreto', name: 'Secreto', variations: [
        { name: 'Peixe Retardado', image: '/img/peixe/Retardedfish.png', time: 'all', events: ["all"] },
        { name: 'Meu Almoço Delicioso', image: '/img/peixe/receitas-de-peixes-destaque.png', time: 'day', events: ["ouro", "misticismo"] },
        { name: 'Pai Solteiro', image: '/img/peixe/pai-solteiro.png', time: 'all', events: ["all"] },
        { name: 'QUE CARA LEGAL!', image: '/img/peixe/coolASSfish.png', time: 'all', events: ["all"] },
        { name: 'Alien Fish REF!!!', image: '/img/peixe/alien_ref_fish.png', time: 'night', events: ["ouro", "frenesi", "misticismo"] }
    ]},
    DIVINO: { id: 'divino', prob: 0.001, mult: 500, style: 'text-divino', border: 'border-divino', name: 'Divino', variations: [
        { name: 'Quase Arco-íris', image: '/img/peixe/Semi-rainbowfish.png', time: 'day', events: ["misticismo"] },
        { name: 'Golfizza Pescado', image: '/img/peixe/golfizza.png', time: 'night', events: ["all"] },
        { name: 'Peixe molhado', image: '/img/peixe/meus porrinhas.png', time: 'night', events: ["all"] },
        { name: 'Ex rei dos mares (fraco)', image: '/img/peixe/CARALHOFODAA.png', time: 'night', events: ["tempestade", "mar_bestas"] },
        { name: 'Salmão de lama', image: '/img/peixe/salmao_argila.png', time: 'night', events: ["ouro", "misticismo"] }
    ]},
    AURUDO: { id: 'aurudo', prob: 0.00005, mult: 5000, style: 'text-auraMAX', border: 'border-auraMAX', name: 'Aurudo', variations: [
        { name: 'Aurudo Diliça', image: '/img/peixe/triolho.webp', time: 'all', events: ["all"] },
        { name: 'Abueno Pasaber', image: '/img/peixe/abuenopasaber.png', time: 'all', events: ["all"] }
    ]},
    VANDALO: { id: 'vandalo', prob: 0.000005, mult: 20000, style: 'text-vandalo', border: 'border-vandalo', name: 'Vândalo', variations: [
        { name: 'Tralha-Umbrella', image: '/img/peixe/VANDALOS/enjinFISH.png', time: 'all', events: ["abismo_lixo"] },
        { name: 'Luvas das Guelras', image: '/img/peixe/VANDALOS/rudoFISH.png', time: 'all', events: ["abismo_lixo"] },
        { name: 'Peixe Microfone', image: '/img/peixe/VANDALOS/mymoFISH.png', time: 'all', events: ["abismo_lixo"] },
        { name: 'Beta Enjaquetado', image: '/img/peixe/VANDALOS/zodylFISH.png', time: 'all', events: ["abismo_lixo"] }
    ]},
    BESTIAL: { id: 'bestial', prob: 0.000001, mult: 15000, style: 'text-bestial', border: 'border-bestial', name: 'Bestial', variations: [
        { name: 'O Leviatã Primordial', image: '/img/peixe/LENDAS/esmGA BOLAS.png', time: 'all', events: ["mar_bestas"] },
        { name: 'Vaca Marinha', image: '/img/peixe/LENDAS/vaca.png', time: 'all', events: ["mar_bestas"] },
        { name: 'Jörmungandr', image: '/img/peixe/LENDAS/melbil.aw.png', time: 'all', events: ["mar_bestas"] },
    ]}
};

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