/* ==========================================================================
   BANCO DE DADOS DO JOGO (ECONOMIA BALANCEADA E PROGRESSÃO JUSTA)
   ========================================================================== */

   window.CRAFTING_DB = {
    materials: [
        { id: 'madeira', name: 'Madeira / Graveto', price: 10, icon: '🪵', lore: "⚙️ Função: Base de forja inicial. ✨ Diferencial: Flutua surpreendentemente bem." },
        { id: 'fio', name: 'Fio de Nylon', price: 20, icon: '🧵', lore: "⚙️ Função: Amarração básica. ✨ Diferencial: Quase invisível na água." },
        { id: 'plastico', name: 'Plástico', price: 60, icon: '🧪', lore: "⚙️ Função: Criação de ligas leves. ✨ Diferencial: Não se decompõe nunca." },
        { id: 'kevlar', name: 'Fio de Kevlar', price: 150, icon: '🕸️', lore: "⚙️ Função: Linhas de alta tensão. ✨ Diferencial: Para balas e mordidas de tubarão." },
        { id: 'fibra', name: 'Fibra de Vidro', price: 300, icon: '🧶', lore: "⚙️ Função: Hastes médias. ✨ Diferencial: Enverga até o limite sem estalar." },
        { id: 'metal', name: 'Sucata de Metal', price: 600, icon: '⚙️', lore: "⚙️ Função: Pesos e Lâminas pesadas. ✨ Diferencial: Densidade bruta e letal." },
        { id: 'ouro', name: 'Ouro Pirata', price: 1200, icon: '🪙', lore: "⚙️ Função: Valorização e Sinergia. ✨ Diferencial: Brilha mesmo no breu abissal." },
        { id: 'titânio', name: 'Liga de Titânio', price: 3500, icon: '🔩', lore: "⚙️ Função: Equipamento tático. ✨ Diferencial: Indestrutível e imune a salinidade." },
        { id: 'perola', name: 'Pérola Abissal', price: 8000, icon: '🦪', lore: "⚙️ Função: Canalizador místico. ✨ Diferencial: Pulsa com o bater do coração." },
        { id: 'carbono', name: 'Carbono', price: 18000, icon: '🔋', lore: "⚙️ Função: Nanotecnologia pesqueira. ✨ Diferencial: Mais duro que diamante." },
        { id: 'meteorito', name: 'Fragmento de Meteoro', price: 40000, icon: '☄️', lore: "⚙️ Função: Lâminas de ruptura. ✨ Diferencial: Irradia uma aura morna de 300°C." },
        { id: 'tecido_magico', name: 'Tecido Mágico', price: 85000, icon: '📜', lore: "⚙️ Função: Amarração de realidades. ✨ Diferencial: Não possui peso físico." },
        { id: 'cristal', name: 'Cristal Místico', price: 150000, icon: '🔮', lore: "⚙️ Função: Forja Oceânica e Divina. ✨ Diferencial: Permite ver o futuro." },
        { id: 'escama_leviata', name: 'Escama de Leviatã', price: 350000, icon: '🧜‍♂️', lore: "⚙️ Função: Sinergias abissais. ✨ Diferencial: Vibra quando o perigo se aproxima." },
        { id: 'materia_escura', name: 'Matéria Escura', price: 800000, icon: '🌌', lore: "⚙️ Função: Buracos negros portáteis. ✨ Diferencial: Engole a luz ao seu redor." },
        { id: 'nucleo_estrela', name: 'Núcleo Estelar', price: 2000000, icon: '🌟', lore: "⚙️ Função: Forja Celestial. ✨ Diferencial: Um minúsculo sol em suas mãos." },
        { id: 'essencia', name: 'Essência Divina', price: 5000000, icon: '✨', lore: "⚙️ Função: Ascensão de equipamentos. ✨ Diferencial: Cura as feridas." },
        { id: 'fragmento_tempo', name: 'Fragmento Temporal', price: 12000000, icon: '⏳', lore: "⚙️ Função: Manipulação cronológica. ✨ Diferencial: Ele cai para cima." },
        { id: 'poeira_cosmica', name: 'Poeira Cósmica', price: 30000000, icon: '💫', lore: "⚙️ Função: O fim e o princípio. ✨ Diferencial: Contém o eco do Big Bang." },
        { id: 'tecido_realidade', name: 'Tecido da Realidade', price: 75000000, icon: '💠', lore: "⚙️ Função: Quebra de regras. ✨ Diferencial: Altera a própria memória." }
    ],
    recipes: {
        rods: {
            1: { name: "Vara de Bambu", req: { madeira: 5, fio: 2 }, reqFishes: { comum: 2 } },
            2: { name: "Bambu Reforçado", req: { madeira: 15, fio: 5 }, reqFishes: { comum: 8 } },
            3: { name: "Caniço de Salgueiro", req: { madeira: 30, fio: 10 }, reqFishes: { comum: 20, raro: 1 } },
            4: { name: "Vara de Plástico", req: { plastico: 10, fio: 20 }, reqFishes: { comum: 35, raro: 5 } },
            5: { name: "Fibra de Vidro", req: { fibra: 5, plastico: 15, fio: 25 }, reqFishes: { raro: 12, epico: 1 } },
            6: { name: "Fibra Premium", req: { fibra: 15, plastico: 30, kevlar: 10 }, reqFishes: { raro: 25, epico: 4 } },
            7: { name: "Polímero Flexível", req: { fibra: 35, plastico: 50, kevlar: 25 }, reqFishes: { raro: 50, epico: 10 } },
            8: { name: "Alumínio Leve", req: { metal: 15, fio: 80, ouro: 5 }, reqFishes: { epico: 20, lendario: 1 } },
            9: { name: "Aço Inoxidável", req: { metal: 40, plastico: 50, ouro: 15 }, reqFishes: { epico: 45, lendario: 4 } },
            10: { name: "Liga de Titânio", req: { titânio: 15, metal: 80, ouro: 30 }, reqFishes: { epico: 80, lendario: 10 } },
            11: { name: "Vara de Grafeno", req: { titânio: 40, metal: 150, perola: 8 }, reqFishes: { lendario: 25, mitico: 1 } },
            12: { name: "Carbono Básico", req: { carbono: 15, plastico: 100, perola: 20 }, reqFishes: { lendario: 50, mitico: 4 } },
            13: { name: "Vara Eletrônica", req: { carbono: 40, metal: 200, perola: 40 }, reqFishes: { lendario: 100, mitico: 10 } },
            14: { name: "Fibra de Nanotubos", req: { carbono: 80, fibra: 250, meteorito: 8 }, reqFishes: { mitico: 25, secreto: 1 } },
            15: { name: "Protótipo Militar", req: { carbono: 150, titânio: 100, meteorito: 25 }, reqFishes: { mitico: 60, secreto: 4 } },
            16: { name: "Vara Oceânica", req: { cristal: 15, titânio: 200, perola: 100 }, reqFishes: { mitico: 120, secreto: 10 } },
            17: { name: "Arpão Antigo", req: { cristal: 40, madeira: 500, ouro: 150 }, reqFishes: { secreto: 25, divino: 1 } },
            18: { name: "Tridente de Netuno", req: { cristal: 100, titânio: 400, materia_escura: 8 }, reqFishes: { secreto: 60, divino: 3 } },
            19: { name: "Vara Galáctica", req: { essencia: 8, cristal: 200, materia_escura: 25 }, reqFishes: { secreto: 120, divino: 8 } },
            20: { name: "Vara Quântica", req: { essencia: 25, carbono: 600, materia_escura: 60 }, reqFishes: { divino: 25, aurudo: 1 } },
            21: { name: "A Vara do Criador", req: { essencia: 80, cristal: 800, poeira_cosmica: 15 }, reqFishes: { divino: 60, aurudo: 3 } },
            22: { name: "Vara do Tempo", req: { poeira_cosmica: 50, fragmento_tempo: 20 }, reqFishes: { divino: 120, aurudo: 8 } },
            23: { name: "Cetro Celestial", req: { essencia: 200, nucleo_estrela: 80 }, reqFishes: { aurudo: 20, bestial: 1 } },
            24: { name: "Teia do Destino", req: { tecido_magico: 150, fragmento_tempo: 80 }, reqFishes: { aurudo: 40, vandalo: 1 } },
            25: { name: "Singularidade", req: { nucleo_estrela: 200, tecido_realidade: 25 }, reqFishes: { bestial: 3, vandalo: 3 } },
            26: { name: "Pescadora de Realidades", req: { fragmento_tempo: 300, tecido_realidade: 100 }, reqFishes: { bestial: 8, vandalo: 8 } }
        },
        sinkers: {
            'pedra_rio': { name: "Pedra de Rio", req: { fio: 2 }, reqFishes: { comum: 1 } },
            'casca_noz': { name: "Casca Leve", req: { madeira: 8, fio: 4 }, reqFishes: { comum: 6 } },
            'disco_plastico': { name: "Disco Plano", req: { plastico: 8 }, reqFishes: { comum: 15, raro: 1 } },
            'bobina_fibra': { name: "Bobina Estabilizada", req: { fibra: 5, plastico: 5, kevlar: 2 }, reqFishes: { raro: 6 } },
            'ferro_velho': { name: "Peso de Sucata", req: { metal: 8 }, reqFishes: { raro: 15 } },
            'anilha_aco': { name: "Anilha de Academia", req: { metal: 25, ouro: 4 }, reqFishes: { epico: 4 } },
            'magneto': { name: "Imã Industrial", req: { metal: 50, kevlar: 15 }, reqFishes: { epico: 15 } },
            'peso_tungstenio': { name: "Esfera Pesada", req: { titânio: 15, metal: 40 }, reqFishes: { lendario: 4 } },
            'pepita_luxo': { name: "Pepita Polida", req: { titânio: 35, ouro: 80 }, reqFishes: { lendario: 12 } },
            'nucleo_carbono': { name: "Peso de Fibra", req: { carbono: 15, fibra: 40, kevlar: 30 }, reqFishes: { mitico: 4 } },
            'bateria_ion': { name: "Célula de Energia", req: { carbono: 35, metal: 100, perola: 15 }, reqFishes: { mitico: 12 } },
            'prisma_oceano': { name: "Prisma de Coral", req: { cristal: 15, plastico: 80, perola: 40 }, reqFishes: { secreto: 4 } },
            'reliquia_abismo': { name: "Artefato Antigo", req: { cristal: 40, titânio: 80, meteorito: 15 }, reqFishes: { secreto: 12 } },
            'fragmento_estelar': { name: "Fragmento de Cometa", req: { cristal: 80, meteorito: 35 }, reqFishes: { divino: 4 } },
            'antimateria_v2': { name: "Peso de Antimatéria", req: { essencia: 8, carbono: 150, materia_escura: 15 }, reqFishes: { divino: 12 } },
            'divindade_ouro': { name: "Ídolo Dourado", req: { essencia: 20, ouro: 250, cristal: 50 }, reqFishes: { aurudo: 4 } },
            'buraco_negro': { name: "Mini Buraco Negro", req: { essencia: 40, titânio: 200, materia_escura: 40 }, reqFishes: { aurudo: 12 } },
            'paradoxo': { name: "Peso Atemporal", req: { essencia: 80, cristal: 200, poeira_cosmica: 10 }, reqFishes: { bestial: 1 } },
            'vazio_absoluto': { name: "Esfera do Nada", req: { essencia: 150, carbono: 500, poeira_cosmica: 30 }, reqFishes: { vandalo: 1 } },
            'estrela_morta': { name: "Estrela Anã Branca", req: { materia_escura: 150, nucleo_estrela: 40 }, reqFishes: { bestial: 2 } },
            'ancora_tempo': { name: "Âncora Temporal", req: { poeira_cosmica: 100, fragmento_tempo: 40 }, reqFishes: { vandalo: 2 } },
            'buraco_minhoca': { name: "Buraco de Minhoca", req: { essencia: 250, tecido_realidade: 20 }, reqFishes: { bestial: 3, vandalo: 3 } },
            'colapso_gravitacional': { name: "Colapso Gravitacional", req: { nucleo_estrela: 200, fragmento_tempo: 80 }, reqFishes: { bestial: 5, vandalo: 5 } },
            'peso_multiverso': { name: "Esfera do Multiverso", req: { tecido_realidade: 150, fragmento_tempo: 250 }, reqFishes: { bestial: 8, vandalo: 8 } }
        },
        knives: {
            'faca_cozinha': { name: "Faca de Cozinha", req: { madeira: 8, fio: 5 }, reqFishes: { comum: 5 } },
            'faca_acougueiro': { name: "Faca de Açougueiro", req: { madeira: 20, plastico: 10 }, reqFishes: { comum: 20 } },
            'faca_chef': { name: "Faca de Chef Aprendiz", req: { madeira: 40, metal: 10 }, reqFishes: { raro: 6 } },
            'cutelo_ferro': { name: "Cutelo de Ferro", req: { madeira: 80, metal: 35 }, reqFishes: { raro: 18 } },
            'faca_ouro': { name: "Faca Banhada a Ouro", req: { madeira: 120, ouro: 25 }, reqFishes: { epico: 6 } },
            'faca_pirata': { name: "Faca do Pirata", req: { madeira: 200, ouro: 80 }, reqFishes: { epico: 20 } },
            'faca_titanio': { name: "Faca de Titânio", req: { madeira: 300, titânio: 25 }, reqFishes: { lendario: 6 } },
            'cutelo_titanio': { name: "Cutelo Maciço", req: { madeira: 400, titânio: 80, metal: 150 }, reqFishes: { lendario: 18 } },
            'faca_meteorito': { name: "Faca Meteorítica", req: { madeira: 600, meteorito: 20 }, reqFishes: { mitico: 6 } },
            'lamina_cometa': { name: "Lâmina do Cometa", req: { madeira: 900, meteorito: 60, titânio: 150 }, reqFishes: { mitico: 18 } },
            'faca_cristal': { name: "Faca de Cristal Bruto", req: { madeira: 1400, cristal: 25 }, reqFishes: { secreto: 6 } },
            'lamina_mistica': { name: "Lâmina Mística", req: { madeira: 2000, cristal: 80 }, reqFishes: { secreto: 18 } },
            'faca_sombria': { name: "Faca Sombria", req: { madeira: 2800, materia_escura: 25 }, reqFishes: { divino: 6 } },
            'cutelo_vazio': { name: "Cutelo do Vazio", req: { madeira: 4000, materia_escura: 80, meteorito: 250 }, reqFishes: { divino: 18 } },
            'faca_essencia': { name: "Faca de Essência Pura", req: { madeira: 6000, essencia: 15 }, reqFishes: { aurudo: 3 } },
            'lamina_divina': { name: "Lâmina Divina", req: { madeira: 8500, essencia: 40 }, reqFishes: { aurudo: 10 } },
            'faca_estelar': { name: "Faca Estelar", req: { madeira: 12000, poeira_cosmica: 15 }, reqFishes: { bestial: 1 } },
            'faca_neutrons': { name: "Faca de Nêutrons", req: { madeira: 20000, poeira_cosmica: 40 }, reqFishes: { vandalo: 1 } },
            'lamina_infinito': { name: "Lâmina do Infinito", req: { madeira: 32000, poeira_cosmica: 120 }, reqFishes: { bestial: 2, vandalo: 2 } },
            'faca_criador': { name: "A Faca do Criador", req: { madeira: 60000, poeira_cosmica: 250, essencia: 200 }, reqFishes: { bestial: 5, vandalo: 5 } }
        },
        hooks: {
            'anzol_sucata': { name: "Anzol Magnético", req: { metal: 20, plastico: 40 }, reqFishes: { comum: 10 } },
            'anzol_comum': { name: "Anzol Rústico", req: { madeira: 100, fio: 80 }, reqFishes: { raro: 8 } },
            'anzol_raro': { name: "Anzol de Cobre", req: { fibra: 180, kevlar: 100 }, reqFishes: { epico: 6 } },
            'anzol_epico': { name: "Anzol de Ametista", req: { ouro: 250, titânio: 150 }, reqFishes: { lendario: 6 } },
            'anzol_lendario': { name: "Anzol de Ouro Puro", req: { perola: 400, carbono: 250 }, reqFishes: { mitico: 6 } },
            'anzol_mitico': { name: "Anzol de Sangue", req: { meteorito: 500, tecido_magico: 200 }, reqFishes: { secreto: 6 } },
            'anzol_secreto': { name: "Anzol Sombrio", req: { cristal: 800, escama_leviata: 300 }, reqFishes: { divino: 6 } },
            'anzol_divino': { name: "Anzol Celestial", req: { materia_escura: 1200, nucleo_estrela: 600, essencia: 200 }, reqFishes: { aurudo: 4 } },
            'anzol_aurudo': { name: "Anzol do Fim", req: { fragmento_tempo: 1800, poeira_cosmica: 1200, tecido_realidade: 400 }, reqFishes: { bestial: 2, vandalo: 2 } }
        }
    }
};

window.MATERIALS = window.CRAFTING_DB.materials;

window.HOOKS = [
    { id: 'anzol_padrao', name: 'Anzol Padrão', color: '#bdc3c7', target: 'padrao', power: 0, lore: "⚙️ Função: Pescar o que vier. ✨ Diferencial: Nenhum." },
    { id: 'anzol_sucata', name: 'Anzol Magnético', color: '#7f8c8d', target: 'sucata', power: 0.50, lore: "⚙️ Função: Focar no Lixo (+50%). ✨ Diferencial: Atrai detritos pesados do fundo." },
    { id: 'anzol_comum', name: 'Anzol Rústico', color: '#95a5a6', target: 'comum', power: 0.50, lore: "⚙️ Função: Focar em Comuns (+50%). ✨ Diferencial: Discreto e entediante, os peixes ignoram." },
    { id: 'anzol_raro', name: 'Anzol de Cobre', color: '#2ecc71', target: 'raro', power: 0.30, lore: "⚙️ Função: Focar em Raros (+30%). ✨ Diferencial: Oxida em tons de verde vibrante na água salgada." },
    { id: 'anzol_epico', name: 'Anzol de Ametista', color: '#9b59b6', target: 'epico', power: 0.20, lore: "⚙️ Função: Focar em Épicos (+20%). ✨ Diferencial: Reflete um raio ultravioleta que hipnotiza." },
    { id: 'anzol_lendario', name: 'Anzol de Ouro Puro', color: '#f1c40f', target: 'lendario', power: 0.10, lore: "⚙️ Função: Focar em Lendários (+10%). ✨ Diferencial: É tão pesado que quebra o maxilar do peixe." },
    { id: 'anzol_mitico', name: 'Anzol de Sangue', color: '#e74c3c', target: 'mitico', power: 0.05, lore: "⚙️ Função: Focar em Míticos (+5%). ✨ Diferencial: Uma coloração carmesim que nunca desbota." },
    { id: 'anzol_secreto', name: 'Anzol Sombrio', color: '#2c3e50', target: 'secreto', power: 0.02, lore: "⚙️ Função: Focar em Secretos (+2%). ✨ Diferencial: Totalmente invisível na escuridão." },
    { id: 'anzol_divino', name: 'Anzol Celestial', color: '#f39c12', target: 'divino', power: 0.005, lore: "⚙️ Função: Focar em Divinos (+0.5%). ✨ Diferencial: Brilha como uma estrela cadente no breu." },
    { id: 'anzol_aurudo', name: 'Anzol do Fim', color: '#ffd700', target: 'aurudo', power: 0.001, lore: "⚙️ Função: Focar em Aurudos (+0.1%). ✨ Diferencial: Distorce a realidade, enganando entidades." }
];

window.ROD_TEMPLATES = [
    { name: "Galho Seco", type: "madeira", price: 0, speed: 1.0, luck: 0, lore: "⚙️ Função: Nenhuma. ✨ Diferencial: Parte no meio se o peixe espirrar." },
    { name: "Vara de Bambu", type: "madeira", price: 100, speed: 1.1, luck: 40, lore: "⚙️ Função: Pesca de base. ✨ Diferencial: Verde e orgulhosa." },
    { name: "Bambu Reforçado", type: "madeira", price: 300, speed: 1.25, luck: 120, lore: "⚙️ Função: Pesca costeira. ✨ Diferencial: Fita adesiva segurando as pontas." },
    { name: "Caniço de Salgueiro", type: "madeira", price: 800, speed: 1.35, luck: 250, lore: "⚙️ Função: Linha firme. ✨ Diferencial: Enverga poeticamente ao vento." },
    { name: "Vara de Plástico", type: "fibra", price: 2000, speed: 1.5, luck: 500, lore: "⚙️ Função: Alta durabilidade. ✨ Diferencial: Nunca apodrece." },
    { name: "Fibra de Vidro", type: "fibra", price: 5000, speed: 1.7, luck: 900, lore: "⚙️ Função: Desempenho equilibrado. ✨ Diferencial: Dá choques estáticos no utilizador." },
    { name: "Fibra Premium", type: "fibra", price: 12000, speed: 2.0, luck: 1500, lore: "⚙️ Função: Domínio das ondas. ✨ Diferencial: Leve como uma pluma." },
    { name: "Polímero Flexível", type: "fibra", price: 25000, speed: 2.3, luck: 2200, lore: "⚙️ Função: Luta contra Gigantes. ✨ Diferencial: Transparente sob a luz." },
    { name: "Alumínio Leve", type: "metal", price: 50000, speed: 2.6, luck: 3000, lore: "⚙️ Função: Resistência marítima. ✨ Diferencial: Reflete o sol, cegando rivais." },
    { name: "Aço Inoxidável", type: "metal", price: 90000, speed: 3.0, luck: 4500, lore: "⚙️ Função: Águas profundas. ✨ Diferencial: Pesada, mas indestrutível." },
    { name: "Liga de Titânio", type: "metal", price: 180000, speed: 3.5, luck: 6000, lore: "⚙️ Função: Pesca tática. ✨ Diferencial: Não detectada em radares." },
    { name: "Vara de Grafeno", type: "metal", price: 350000, speed: 4.0, luck: 8000, lore: "⚙️ Função: Pesca atômica. ✨ Diferencial: Fina como um fio de cabelo." },
    { name: "Carbono Básico", type: "carbono", price: 700000, speed: 4.5, luck: 10500, lore: "⚙️ Função: Alta performance. ✨ Diferencial: Absorve o impacto dos peixes Lendas." },
    { name: "Vara Eletrônica", type: "carbono", price: 1500000, speed: 5.2, luck: 13000, lore: "⚙️ Função: Mira laser. ✨ Diferencial: Faz um barulho de bipe irritante." },
    { name: "Fibra de Nanotubos", type: "carbono", price: 3000000, speed: 6.0, luck: 16000, lore: "⚙️ Função: Suporta toneladas. ✨ Diferencial: Estrutura celular inquebrável." },
    { name: "Protótipo Militar", type: "carbono", price: 6000000, speed: 7.5, luck: 20000, lore: "⚙️ Função: Extração à força. ✨ Diferencial: Contém pequenos mísseis integrados." },
    { name: "Vara Oceânica", type: "mistico", price: 15000000, speed: 9.0, luck: 25000, lore: "⚙️ Função: Comando das marés. ✨ Diferencial: Feita de água solidificada." },
    { name: "Arpão Antigo", type: "mistico", price: 35000000, speed: 11.0, luck: 30000, lore: "⚙️ Função: Caça a mitos. ✨ Diferencial: Tem vontade própria." },
    { name: "Tridente de Netuno", type: "mistico", price: 80000000, speed: 14.0, luck: 38000, lore: "⚙️ Função: Realeza marítima. ✨ Diferencial: Os peixes têm medo de olhar para ela." },
    { name: "Vara Galáctica", type: "divino", price: 180000000, speed: 18.0, luck: 48000, lore: "⚙️ Função: Pesca nas estrelas. ✨ Diferencial: O anzol viaja pelo vácuo." },
    { name: "Vara Quântica", type: "divino", price: 400000000, speed: 25.0, luck: 60000, lore: "⚙️ Função: Probabilidades de Schrödinger. ✨ Diferencial: O peixe está na linha e não está ao mesmo tempo." },
    { name: "A Vara do Criador", type: "divino", price: 1000000000, speed: 40.0, luck: 80000, lore: "⚙️ Função: O Absoluto. ✨ Diferencial: Reescreve o código-fonte do mar." },
    { name: "Vara do Tempo", type: "mistico", price: 2500000000, speed: 50.0, luck: 120000, lore: "⚙️ Função: Pesca no passado. ✨ Diferencial: Puxa o peixe antes dele morder." },
    { name: "Cetro Celestial", type: "divino", price: 6000000000, speed: 65.0, luck: 180000, lore: "⚙️ Função: Imposição divina. ✨ Diferencial: Os peixes pulam para fora da água em respeito." },
    { name: "Teia do Destino", type: "mistico", price: 15000000000, speed: 85.0, luck: 250000, lore: "⚙️ Função: O fim inescapável. ✨ Diferencial: Ninguém escapa." },
    { name: "Vara da Singularidade", type: "divino", price: 40000000000, speed: 110.0, luck: 400000, lore: "⚙️ Função: Fim da matéria. ✨ Diferencial: Curva o espaço e suga os Divinos." },
    { name: "Pescadora de Realidades", type: "divino", price: 100000000000, speed: 160.0, luck: 800000, lore: "⚙️ Função: Multiverso. ✨ Diferencial: Pesca peixes de jogos diferentes." }
];

window.SINKERS = [
    { id: 'chumbo', name: 'Chumbo Padrão', price: 0, lore: "⚙️ Função: Afundar a isca... às vezes. ✨ Diferencial: Sem brilho, sem glória.", stats: {} },
    { id: 'pedra_rio', name: 'Pedra de Rio', price: 500, lore: "⚙️ Função: Velocidade modesta. ✨ Diferencial: Bem polida pelas águas.", stats: { speed: 1.15, luck: 20 } },
    { id: 'casca_noz', name: 'Casca Leve', price: 1500, lore: "⚙️ Função: Sinergia fluída. ✨ Diferencial: Flutua um pouco, ajudando na linha.", stats: { luck: 40 }, synergy: { type: 'madeira', luck: 80, desc: "Sorte +80" } },
    { id: 'disco_plastico', name: 'Disco Plano', price: 4000, lore: "⚙️ Função: Corte hidrodinâmico. ✨ Diferencial: Desce cortando a água sem resistência.", stats: { speed: 1.3, luck: 100 } },
    { id: 'bobina_fibra', name: 'Bobina Estabilizada', price: 9000, lore: "⚙️ Função: Estabilização de linha. ✨ Diferencial: Impede que a isca gire à toa.", stats: { luck: 250 }, synergy: { type: 'fibra', speed: 1.6, desc: "Vel x1.6" } },
    { id: 'ferro_velho', name: 'Peso de Sucata', price: 20000, lore: "⚙️ Função: Aumentar lucros brutos. ✨ Diferencial: Solta óleo que atrai peixes gulosos.", stats: { value: 1.4, luck: 400 } },
    { id: 'anilha_aco', name: 'Anilha de Academia', price: 45000, lore: "⚙️ Função: Queda livre. ✨ Diferencial: Pesada, brutal, direta.", stats: { speed: 1.8, luck: 750 } },
    { id: 'magneto', name: 'Imã Industrial', price: 90000, lore: "⚙️ Função: Sinergia de Metal profunda. ✨ Diferencial: Puxa minerais das profundezas.", stats: { luck: 1200 }, synergy: { type: 'metal', value: 2.2, desc: "Lucro x2.2" } },
    { id: 'peso_tungstenio', name: 'Esfera Pesada', price: 180000, lore: "⚙️ Função: Perfuração aquática. ✨ Diferencial: O metal mais denso do mercado.", stats: { speed: 2.2, luck: 2000 } },
    { id: 'pepita_luxo', name: 'Pepita Polida', price: 400000, lore: "⚙️ Função: Ostentação pura. ✨ Diferencial: O brilho atrai ricaços (lucro x2.5).", stats: { value: 2.5, luck: 3500 } },
    { id: 'nucleo_carbono', name: 'Peso de Fibra', price: 800000, lore: "⚙️ Função: Sinergia de carbono extremo. ✨ Diferencial: Atrair gigantes sutilmente.", stats: { speed: 1.5, luck: 5000 }, synergy: { type: 'carbono', chance67: 0.07, desc: "+7% chance 67cm" } },
    { id: 'bateria_ion', name: 'Célula de Energia', price: 2000000, lore: "⚙️ Função: Choque de velocidade. ✨ Diferencial: Eletrifica a água, descendo como um raio.", stats: { speed: 3.0, luck: 7500 } },
    { id: 'prisma_oceano', name: 'Prisma de Coral', price: 5000000, lore: "⚙️ Função: Sorte monumental. ✨ Diferencial: Refrata a luz em 7 cores mágicas.", stats: { luck: 10000 } },
    { id: 'reliquia_abismo', name: 'Artefato Antigo', price: 12000000, lore: "⚙️ Função: Sinergia Mística. ✨ Diferencial: Sussurra línguas mortas sob a água.", stats: { value: 2.0, luck: 12000 }, synergy: { type: 'mistico', luck: 8000, desc: "Sorte +8000" } },
    { id: 'fragmento_estelar', name: 'Fragmento de Cometa', price: 30000000, lore: "⚙️ Função: Atração de Gigantes (67cm). ✨ Diferencial: Continua pegando fogo dentro da água.", stats: { chance67: 0.15, luck: 18000 } },
    { id: 'antimateria_v2', name: 'Peso de Antimatéria', price: 80000000, lore: "⚙️ Função: Quebra as regras da física. ✨ Diferencial: Não afunda, a água que sobe à sua volta.", stats: { speed: 5.0, value: 3.0, luck: 25000 } },
    { id: 'divindade_ouro', name: 'Ídolo Dourado', price: 200000000, lore: "⚙️ Função: Multiplicador profano. ✨ Diferencial: Exige respeito dos reis dos mares.", stats: { luck: 35000 }, synergy: { type: 'divino', value: 10.0, desc: "Lucro x10" } },
    { id: 'buraco_negro', name: 'Mini Buraco Negro', price: 500000000, lore: "⚙️ Função: Sucção abissal. ✨ Diferencial: Dobra a luz. A linha parece desaparecer nele.", stats: { speed: 10.0, luck: 50000, chance67: 0.35 } },
    { id: 'paradoxo', name: 'Peso Atemporal', price: 1200000000, lore: "⚙️ Função: Imune ao tempo. ✨ Diferencial: Ele afunda antes de você jogar.", stats: { speed: 15.0, chance67: 0.20, luck: 70000 } },
    { id: 'vazio_absoluto', name: 'Esfera do Nada', price: 3000000000, lore: "⚙️ Função: Destruição. ✨ Diferencial: O zero absoluto encapsulado.", stats: { speed: 20.0, luck: 100000, value: 15.0, chance67: 0.50 } },
    { id: 'estrela_morta', name: 'Estrela Anã Branca', price: 7000000000, lore: "⚙️ Função: Peso astronômico. ✨ Diferencial: Uma colher de chá pesa 15 toneladas.", stats: { speed: 25.0, luck: 150000, chance67: 0.55 } },
    { id: 'ancora_tempo', name: 'Âncora Temporal', price: 15000000000, lore: "⚙️ Função: Imobiliza as Lendas. ✨ Diferencial: Prende o peixe numa teia de tempo.", stats: { speed: 30.0, luck: 250000, chance67: 0.60 } },
    { id: 'buraco_minhoca', name: 'Buraco de Minhoca', price: 30000000000, lore: "⚙️ Função: Atalho subespacial. ✨ Diferencial: A linha entra por um portal e sai no fundo.", stats: { speed: 35.0, luck: 400000, value: 20.0, chance67: 0.65 } },
    { id: 'colapso_gravitacional', name: 'Colapso Gravitacional', price: 60000000000, lore: "⚙️ Função: Aniquilação total. ✨ Diferencial: A própria água foge de medo.", stats: { speed: 45.0, luck: 600000, value: 25.0, chance67: 0.70 } },
    { id: 'peso_multiverso', name: 'Esfera do Multiverso', price: 150000000000, lore: "⚙️ Função: Omni-presença. ✨ Diferencial: Puxa peixes de outra dimensão.", stats: { speed: 60.0, luck: 1000000, value: 40.0, chance67: 0.80 } }
];

window.KNIVES = [
    { id: 'faca_cozinha', name: 'Faca de Cozinha', mult: 1.0, lore: "⚙️ Função: Cortes básicos (x1). ✨ Diferencial: Cega e sem fio. Não extrai materiais.", dropsMats: false },
    { id: 'faca_acougueiro', name: 'Faca de Açougueiro', mult: 1.2, lore: "⚙️ Função: Pancadas brutas. ✨ Diferencial: Espessa e intimidadora.", dropsMats: false },
    { id: 'faca_chef', name: 'Faca de Chef Aprendiz', mult: 1.5, lore: "⚙️ Função: Precisão modesta. ✨ Diferencial: O punho cheira a alho.", dropsMats: false },
    { id: 'cutelo_ferro', name: 'Cutelo de Ferro', mult: 2.0, lore: "⚙️ Função: Quebra ossos. ✨ Diferencial: Extremamente pesada, corte falho.", dropsMats: false },
    { id: 'faca_ouro', name: 'Faca Banhada a Ouro', mult: 3.0, lore: "⚙️ Função: Luxo e ostentação. ✨ Diferencial: Totalmente inútil para combate.", dropsMats: false },
    { id: 'faca_pirata', name: 'Faca do Pirata', mult: 4.0, lore: "⚙️ Função: Saques gloriosos (+ Materiais). ✨ Diferencial: Denteada para rasgar.", dropsMats: true },
    { id: 'faca_titanio', name: 'Faca de Titânio', mult: 6.0, lore: "⚙️ Função: Incisão microscópica. ✨ Diferencial: Mais leve que a água.", dropsMats: true },
    { id: 'cutelo_titanio', name: 'Cutelo Maciço', mult: 8.0, lore: "⚙️ Função: Divisão limpa. ✨ Diferencial: Corta uma âncora ao meio sem amassar.", dropsMats: true },
    { id: 'faca_meteorito', name: 'Faca Meteorítica', mult: 12.0, lore: "⚙️ Função: Fritar ao cortar. ✨ Diferencial: O fio queima a carne estancando o sangue.", dropsMats: true },
    { id: 'lamina_cometa', name: 'Lâmina do Cometa', mult: 15.0, lore: "⚙️ Função: Separação celestial. ✨ Diferencial: Deixa um rastro de gelo estelar.", dropsMats: true },
    { id: 'faca_cristal', name: 'Faca de Cristal Bruto', mult: 20.0, lore: "⚙️ Função: Cortes mágicos. ✨ Diferencial: Transparente, você só vê o sangue nela.", dropsMats: true },
    { id: 'lamina_mistica', name: 'Lâmina Mística', mult: 30.0, lore: "⚙️ Função: Multiplicador abissal. ✨ Diferencial: Sussurra feitiços de corte.", dropsMats: true },
    { id: 'faca_sombria', name: 'Faca Sombria', mult: 50.0, lore: "⚙️ Função: Corta a alma do peixe. ✨ Diferencial: A luz não reflete nela.", dropsMats: true },
    { id: 'cutelo_vazio', name: 'Cutelo do Vazio', mult: 80.0, lore: "⚙️ Função: Separa as moléculas em zero. ✨ Diferencial: Deleta a parte que toca.", dropsMats: true },
    { id: 'faca_essencia', name: 'Faca de Essência Pura', mult: 100.0, lore: "⚙️ Função: Filetar Lendas. ✨ Diferencial: Brilha intensamente com pura vida.", dropsMats: true },
    { id: 'lamina_divina', name: 'Lâmina Divina', mult: 120.0, lore: "⚙️ Função: Multiplicador x120. ✨ Diferencial: Só os puros de coração podem erguê-la.", dropsMats: true },
    { id: 'faca_estelar', name: 'Faca Estelar', mult: 150.0, lore: "⚙️ Função: Cortes astronômicos. ✨ Diferencial: Contém uma galáxia minúscula no cabo.", dropsMats: true },
    { id: 'faca_neutrons', name: 'Faca de Nêutrons', mult: 300.0, lore: "⚙️ Função: Desintegração lucrativa. ✨ Diferencial: Pesa o mesmo que a lua.", dropsMats: true },
    { id: 'lamina_infinito', name: 'Lâmina do Infinito', mult: 500.0, lore: "⚙️ Função: Saques sem limites. ✨ Diferencial: Arestas infinitamente afiadas.", dropsMats: true },
    { id: 'faca_criador', name: 'A Faca do Criador', mult: 1000.0, lore: "⚙️ Função: A Edição Definitiva (x1000). ✨ Diferencial: Ao usá-la, o código do jogo vacila.", dropsMats: true }
];

window.BAITS = [
    { id: 'pao', icon: '🍞', name: 'Miolo de Pão', qty: 10, desc: 'Sorte +5', stats: { luck: 5 }, req: { restos_comida: 2, fio: 1 }, lore: "⚙️ Função: Pega os burros. ✨ Diferencial: Esfarela logo." },
    { id: 'minhoca', icon: '🐛', name: 'Minhoca', qty: 5, desc: 'Sorte +15', stats: { luck: 15 }, req: { restos_comida: 3, inseto_morto: 1 }, lore: "⚙️ Função: Um clássico. ✨ Diferencial: Mexe-se na água de forma tentadora." },
    { id: 'grilo', icon: '🦗', name: 'Grilo Falante', qty: 5, desc: 'Sorte +30', stats: { luck: 30 }, req: { inseto_morto: 3, plastico: 1 }, lore: "⚙️ Função: Atrair Raros. ✨ Diferencial: Faz barulho debaixo d'água." },
    { id: 'queijo', icon: '🧀', name: 'Queijo Fedido', qty: 5, desc: 'Lucro x1.5', stats: { value: 1.5 }, req: { restos_comida: 5, geleia_estranha: 1 }, lore: "⚙️ Função: Dinheiro fácil. ✨ Diferencial: Um cheiro que enjoa demônios e atrai ouro." },
    { id: 'camarao', icon: '🦐', name: 'Camarão', qty: 5, desc: 'Sorte +80', stats: { luck: 80 }, req: { inseto_morto: 5, geleia_estranha: 2 }, lore: "⚙️ Função: Isca Premium. ✨ Diferencial: Sabor doce de crustáceo." },
    { id: 'vagalume', icon: '✨', name: 'Vagalume', qty: 5, desc: 'Sorte +150 | +2% 67cm', stats: { luck: 150, chance67: 0.02 }, req: { inseto_morto: 10, biomassa_brilhante: 1 }, lore: "⚙️ Função: Chamar atenção à noite. ✨ Diferencial: Pisca como uma balada de neon." },
    { id: 'isca_metal', icon: '🪝', name: 'Isca de Metal', qty: 5, desc: 'Lucro x3.0', stats: { value: 3.0 }, req: { geleia_estranha: 5, metal: 2 }, lore: "⚙️ Função: Falsidade brilhante. ✨ Diferencial: Reflete o sol, os peixes adoram." },
    { id: 'lula', icon: '🦑', name: 'Lula Gigante', qty: 5, desc: 'Sorte +300', stats: { luck: 300 }, req: { biomassa_brilhante: 3, energia_condensada: 1 }, lore: "⚙️ Função: Pesca Épica. ✨ Diferencial: Solta uma tinta preta deliciosa." },
    { id: 'sushi', icon: '🍣', name: 'Sushi Premium', qty: 5, desc: 'Sorte +450 | Lucro x3', stats: { luck: 450, value: 3.0 }, req: { biomassa_brilhante: 5, po_magico: 1 }, lore: "⚙️ Função: Requinte e sorte. ✨ Diferencial: Canibalismo sutil." },
    { id: 'cometa', icon: '☄️', name: 'Pó de Cometa', qty: 3, desc: '+10% Chance 67cm', stats: { chance67: 0.10 }, req: { energia_condensada: 3, meteorito: 1 }, lore: "⚙️ Função: Pesca de Gigantes. ✨ Diferencial: Deixa a água fervendo e atrai colossos." },
    { id: 'hamburguer', icon: '🍔', name: 'Podrão dos Mares', qty: 5, desc: 'Lucro Extremo (x6.0)', stats: { value: 6.0 }, req: { geleia_estranha: 10, escama_dragao: 1 }, lore: "⚙️ Função: Riqueza instantânea. ✨ Diferencial: Obesidade aquática." },
    { id: 'queijo_azul', icon: '🧀', name: 'Gorgonzola Galáctico', qty: 5, desc: 'Lucro x8.0', stats: { value: 8.0 }, req: { energia_condensada: 5, essencia_sombria: 1 }, lore: "⚙️ Função: O odor atrai o Ouro. ✨ Diferencial: Cresce mofo azul espacial." },
    { id: 'radioativa', icon: '☢️', name: 'Isca Mutante', qty: 3, desc: 'Sorte +1200', stats: { luck: 1200 }, req: { biomassa_brilhante: 10, lagrima_sereia: 1 }, lore: "⚙️ Função: Evoca as aberrações. ✨ Diferencial: Brilha em tons de verde doentio." },
    { id: 'lula_neon', icon: '🦑', name: 'Lula de Neon', qty: 3, desc: 'Sorte +2500', stats: { luck: 2500 }, req: { energia_condensada: 8, perola: 2 }, lore: "⚙️ Função: Atrai no breu. ✨ Diferencial: Pega fogo quando agitada." },
    { id: 'kraken', icon: '👁️', name: 'Olho do Kraken', qty: 3, desc: 'Garante Gigantes (+20%)', stats: { chance67: 0.20 }, req: { energia_condensada: 12, fogo_fatuo: 1 }, lore: "⚙️ Função: Dominar titãs. ✨ Diferencial: Ele pisca para ti de vez em quando." },
    { id: 'essencia_deus', icon: '🍷', name: 'Néctar Divino', qty: 2, desc: 'Sorte +6000', stats: { luck: 6000, chance67: 0.25 }, req: { po_magico: 5, essencia: 1 }, lore: "⚙️ Função: Chamar a nobreza marinha. ✨ Diferencial: Embriaga os deuses." },
    { id: 'vazio', icon: '🌌', name: 'Essência do Vazio', qty: 2, desc: 'Sorte +10000', stats: { luck: 10000 }, req: { essencia_sombria: 5, materia_escura: 2 }, lore: "⚙️ Função: Atrair demónios e mitos. ✨ Diferencial: Gela o oceano ao seu redor." },
    { id: 'sol', icon: '☀️', name: 'Fragmento Solar', qty: 2, desc: 'Astro-Rei (+40%)', stats: { chance67: 0.40 }, req: { fogo_fatuo: 5, cristal: 5 }, lore: "⚙️ Função: Despertar de colossos. ✨ Diferencial: Ferve a água numa raio de 3 metros." },
    { id: 'supernova', icon: '💥', name: 'Isca Supernova', qty: 1, desc: 'Lucro x50', stats: { value: 50.0, chance67: 0.40 }, req: { energia_condensada: 50, materia_escura: 5 }, lore: "⚙️ Função: Fazer você o ser mais rico vivo. ✨ Diferencial: Explode no fundo, espalhando poeira de ouro." },
    { id: 'definitiva', icon: '👑', name: 'Matadora de Deuses', qty: 1, desc: 'Poder Máximo.', stats: { luck: 25000, value: 30.0, chance67: 0.60 }, req: { fogo_fatuo: 20, essencia: 5 }, lore: "⚙️ Função: Invocar os Aurudos. ✨ Diferencial: Ela pulsa com um batimento cardíaco assustador." },
    { id: 'alma_gato', icon: '🐈', name: 'Nona Alma', qty: 1, desc: 'O impossível.', stats: { luck: 50000, value: 100.0, chance67: 0.70 }, req: { lagrima_sereia: 50, poeira_cosmica: 2 }, lore: "⚙️ Função: O Desfecho Final. ✨ Diferencial: Exige sacrifício. Não há erro." }
];

window.RARITIES = {
    COMUM: { id: 'comum', prob: 0.35, mult: 1, style: 'text-comum', border: 'border-comum', name: 'Comum', variations: [
        { name: 'Peixe Genérico', image: '/img/peixe/Genericfish001.webp', time: 'all', events: ["all"], compat: 'amigavel' },
        { name: 'Bombardilo', image: '/img/peixe/bombardilo crocarilho.webp', time: 'day', events: ["all"], compat: 'agressivo' },
        { name: 'Ah, peixe legal', image: '/img/peixe/PeixeLegal.avif', time: 'day', events: ["all"], compat: 'amigavel' },
        { name: 'Cruel kidfish', image: '/img/peixe/KidFish.png', time: 'night', events: ["all"], compat: 'agressivo' },
        { name: 'Pexudo', image: '/img/peixe/peixebala.png', time: 'all', events: ["all"], compat: 'agressivo' },
        { name: 'Ah, peixe legal..?', image: '/img/peixe/lolidasaguas.png', time: 'night', events: ["all"], compat: 'amigavel' },
        { name: 'Peixe Feinho', image: '/img/peixe/PeixinhoFeio.webp', time: 'night', events: ["tempestade"], compat: 'infertil' } // Infértil
    ]},
    RARO: { id: 'raro', prob: 0.30, mult: 3, style: 'text-raro', border: 'border-raro', name: 'Raro', variations: [
        { name: 'Peixe Estranho', image: '/img/peixe/UnderWaterAhhFish.png', time: 'night', events: ["all"], compat: 'monstruoso' },
        { name: 'Meu çélebro', image: '/img/peixe/tarlalareo fish.png', time: 'all', events: ["all"], compat: 'infertil' }, // Infértil
        { name: 'Cubic Boccacete', image: '/img/peixe/hyt.png', time: 'day', events: ["all"], compat: 'agressivo' },
        { name: 'PUTAPEIXE', image: '/img/peixe/PUTARALHOFISH, porra.png', time: 'all', events: ["all"], compat: 'agressivo' },
        { name: 'Peixe Burrinho', image: '/img/peixe/dumbAssFish.png', time: 'all', events: ["all"], compat: 'amigavel' },
        { name: 'Meio Peixe', image: '/img/peixe/meio-epixe.png', time: 'night', events: ["all"], compat: 'monstruoso' }
    ]},
    EPICO: { id: 'epico', prob: 0.15, mult: 8, style: 'text-epico', border: 'border-epico', name: 'Épico', variations: [
        { name: 'Mahi-Mahi', image: '/img/peixe/Mahi-Mahifish square.webp', time: 'all', events: ["all"], compat: 'amigavel' },
        { name: 'Peixe Otário', image: '/img/peixe/PeixeOtario.png', time: 'day', events: ["all"], compat: 'amigavel' },
        { name: 'Peixe Lhapaço', image: '/img/peixe/peixe-palhaco.png', time: 'all', events: ["all"], compat: 'amigavel' },
        { name: 'Cardume Carloso', image: '/img/peixe/Carlosacardume.png', time: 'day', events: ["all"], compat: 'agressivo' },
        { name: 'Peixe Olho Pentagonal', image: '/img/peixe/betaMaximo.webp', time: 'all', events: ["all"], compat: 'monstruoso' },
        { name: 'Lanternudo', image: '/img/peixe/angler-cliparte.png', time: 'night', events: ["all"], compat: 'amigavel' }
    ]},
    LENDARIO: { id: 'lendario', prob: 0.08, mult: 20, style: 'text-lendario', border: 'border-lendario', name: 'Lendário', variations: [
        { name: 'Peixe Motosserra', image: '/img/peixe/Chainsawfish.webp', time: 'night', events: ["all"], compat: 'agressivo' },
        { name: 'Big Eye Bocaccete', image: '/img/peixe/hytal.png', time: 'day', events: ["all"], compat: 'amigavel' },
        { name: 'Peixe Demônio negro', image: '/img/peixe/DemonicAHHfish (1).png', time: 'night', events: ["tempestade"], compat: 'monstruoso' },
        { name: 'Peixe Entulhado', image: '/img/peixe/EntulhoFish.png', time: 'day', events: ["all"], compat: 'infertil' }, // Infértil
        { name: 'Peixes Fófos Juntos <3', image: '/img/peixe/vcsestaoempublicomaisrespeito.png', time: 'all', events: ["tempestade", "frenesi", "misticismo"], compat: 'auto_suficiente' } // Único!
    ]},
    MITICO: { id: 'mitico', prob: 0.03, mult: 50, style: 'text-mitico', border: 'border-mitico', name: 'Mítico', variations: [
        { name: 'Jogo do Peixe Retardo', image: '/img/peixe/GameofRetardedfish.png', time: 'night', events: ["ouro", "frenesi", "misticismo"], compat: 'monstruoso' },
        { name: 'Peixe Dor Cabeçaa', image: '/img/peixe/PeixeCancer.png', time: 'all', events: ["all"], compat: 'monstruoso' },
        { name: 'Cardume Fecundador', image: '/img/peixe/cardume dos meus filhos.png', time: 'all', events: ["all"], compat: 'amigavel' },
        { name: 'Peixe das Águas Reais', image: '/img/peixe/aquoso.webp', time: 'day', events: ["ouro", "misticismo"], compat: 'amigavel' },
        { name: 'Darwin?!?!', image: '/img/peixe/darwin.png', time: 'all', events: ["all"], compat: 'amigavel' },
        { name: 'Baleia Gorda', image: '/img/peixe/baleia.webp', time: 'day', events: ["all"], compat: 'monstruoso' }
    ]},
    SECRETO: { id: 'secreto', prob: 0.005, mult: 150, style: 'text-secreto', border: 'border-secreto', name: 'Secreto', variations: [
        { name: 'Peixe Retardado', image: '/img/peixe/Retardedfish.png', time: 'all', events: ["all"], compat: 'infertil' }, // Infértil
        { name: 'Meu Almoço Delicioso', image: '/img/peixe/receitas-de-peixes-destaque.png', time: 'day', events: ["ouro", "misticismo"], compat: 'amigavel' },
        { name: 'Pai Solteiro', image: '/img/peixe/pai-solteiro.png', time: 'all', events: ["all"], compat: 'amigavel' },
        { name: 'QUE CARA LEGAL!', image: '/img/peixe/coolASSfish.png', time: 'all', events: ["all"], compat: 'amigavel' },
        { name: 'Alien Fish REF!!!', image: '/img/peixe/alien_ref_fish.png', time: 'night', events: ["ouro", "frenesi", "misticismo"], compat: 'monstruoso' }
    ]},
    DIVINO: { id: 'divino', prob: 0.001, mult: 500, style: 'text-divino', border: 'border-divino', name: 'Divino', variations: [
        { name: 'Quase Arco-íris', image: '/img/peixe/Semi-rainbowfish.png', time: 'day', events: ["misticismo"], compat: 'amigavel' },
        { name: 'Golfizza Pescado', image: '/img/peixe/golfizza.png', time: 'night', events: ["all"], compat: 'monstruoso' },
        { name: 'Peixe molhado', image: '/img/peixe/meus porrinhas.png', time: 'night', events: ["all"], compat: 'amigavel' },
        { name: 'Ex rei dos mares (fraco)', image: '/img/peixe/CARALHOFODAA.png', time: 'night', events: ["tempestade", "mar_bestas"], compat: 'agressivo' },
        { name: 'Salmão de lama', image: '/img/peixe/salmao_argila.png', time: 'night', events: ["ouro", "misticismo"], compat: 'amigavel' }
    ]},
    AURUDO: { id: 'aurudo', prob: 0.00005, mult: 5000, style: 'text-auraMAX', border: 'border-auraMAX', name: 'Aurudo', variations: [
        { name: 'Aurudo Diliça', image: '/img/peixe/triolho.webp', time: 'all', events: ["all"], compat: 'monstruoso' },
        { name: 'Abueno Pasaber', image: '/img/peixe/abuenopasaber.png', time: 'all', events: ["all"], compat: 'monstruoso' }
    ]},
    VANDALO: { id: 'vandalo', prob: 0.000005, mult: 20000, style: 'text-vandalo', border: 'border-vandalo', name: 'Vândalo', variations: [
        { name: 'Tralha-Umbrella', image: '/img/peixe/VANDALOS/enjinFISH.png', time: 'all', events: ["abismo_lixo"], compat: 'agressivo' },
        { name: 'Luvas das Guelras', image: '/img/peixe/VANDALOS/rudoFISH.png', time: 'all', events: ["abismo_lixo"], compat: 'agressivo' },
        { name: 'Peixe Microfone', image: '/img/peixe/VANDALOS/mymoFISH.png', time: 'all', events: ["abismo_lixo"], compat: 'amigavel' },
        { name: 'Beta Enjaquetado', image: '/img/peixe/VANDALOS/zodylFISH.png', time: 'all', events: ["abismo_lixo"], compat: 'agressivo' }
    ]},
    BESTIAL: { id: 'bestial', prob: 0.000001, mult: 15000, style: 'text-bestial', border: 'border-bestial', name: 'Bestial', variations: [
        { name: 'O Leviatã Primordial', image: '/img/peixe/LENDAS/esmGA BOLAS.png', time: 'all', events: ["mar_bestas"], compat: 'monstruoso' },
        { name: 'Vaca Marinha', image: '/img/peixe/LENDAS/vaca.png', time: 'all', events: ["mar_bestas"], compat: 'monstruoso' },
        { name: 'Jörmungandr', image: '/img/peixe/LENDAS/melbil.aw.png', time: 'all', events: ["mar_bestas"], compat: 'monstruoso' },
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