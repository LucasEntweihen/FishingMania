/* ==========================================================================
   BANCO DE DADOS DE QUIMERAS E MOTOR DE FUSÃO GENÉTICA
   ========================================================================== */

// 1. O ARSENAL DE HABILIDADES DO JOGO
window.SKILLS = {
    'mordida_padrao': { id: 'mordida_padrao', name: 'Mordida Básica', icon: '🦷', type: 'ATK', cost: 1, rng: 1, pwr: 1.0, desc: 'Dano físico simples contra um alvo adjacente.' },
    'jato_agua': { id: 'jato_agua', name: 'Jato Pressurizado', icon: '💦', type: 'MAG', cost: 2, rng: 3, pwr: 1.2, desc: 'Dispara água à distância. Ignora 20% da DEF.' },
    'escudo_bolha': { id: 'escudo_bolha', name: 'Escudo de Bolha', icon: '🫧', type: 'BUFF', cost: 2, rng: 0, pwr: 0, desc: 'Aumenta a DEF própria em 50% por 2 turnos.' },
    'investida': { id: 'investida', name: 'Investida Brutal', icon: '💨', type: 'ATK', cost: 2, rng: 1, pwr: 1.5, desc: 'Avança com o corpo. Empurra o inimigo 1 célula para trás.' },
    'canto_sereia': { id: 'canto_sereia', name: 'Canto Curativo', icon: '🎵', type: 'HEAL', cost: 3, rng: 2, pwr: 0, desc: 'Restaura 30% do HP de um aliado próximo.' },
    'explosao_kamikaze': { id: 'explosao_kamikaze', name: 'Detonação', icon: '💥', type: 'MAG', cost: 3, rng: 2, pwr: 2.5, desc: 'Dano em área absurdo, mas o usuário perde 50% do HP atual.' },
    'olhar_abissal': { id: 'olhar_abissal', name: 'Olhar Abissal', icon: '👁️', type: 'DEBUFF', cost: 2, rng: 4, pwr: 0, desc: 'Aterroriza o alvo, reduzindo seu ATK e SPD em 30%.' },
    'espinho_venenoso': { id: 'espinho_venenoso', name: 'Disparo Tóxico', icon: '☠️', type: 'MAG', cost: 2, rng: 3, pwr: 0.8, desc: 'Dano leve que aplica status de Envenenamento (Dano por turno).' },
    'nadadeira_navalha': { id: 'nadadeira_navalha', name: 'Corte Navalha', icon: '🔪', type: 'ATK', cost: 2, rng: 1, pwr: 1.8, desc: 'Corte físico crítico. Maior chance de acerto crítico.' },
    'amor_de_peixe': { id: 'amor_de_peixe', name: 'Poder da Amizade', icon: '💖', type: 'BUFF', cost: 3, rng: 3, pwr: 0, desc: 'Aumenta o ATK de todos os aliados ao redor em 20%.' }
};

// 2. OS PEIXES HÍBRIDOS CATALOGADOS (Fórmulas Fixas)
window.FUSIONS = {
    "Peixe Genérico+Peixe Otário": {
        id: "hibrido_generico_otario",
        name: "Otário Genérico",
        image: "/img/peixe/fusion/otario_generico.png", 
        desc: "Um peixe que não faz a menor ideia do que está fazendo no campo de batalha.",
        tactical_stats: { HP: 80, AP: 2, MP: 3, ATK: 15, DEF: 10, SPD: 5, RNG: 1 },
        available_skills: ['mordida_padrao', 'jato_agua', 'escudo_bolha', 'investida', 'espinho_venenoso']
    },
    "Bombardilo+Cruel kidfish": {
        id: "hibrido_kid_bomba",
        name: "Kid Bomba",
        image: "/img/peixe/fusion/kid_bomba.png",
        desc: "Pequeno, zangado e altamente explosivo. Excelente unidade de cerco.",
        tactical_stats: { HP: 60, AP: 2, MP: 4, ATK: 35, DEF: 5, SPD: 8, RNG: 2 },
        available_skills: ['mordida_padrao', 'explosao_kamikaze', 'investida', 'espinho_venenoso', 'olhar_abissal']
    },
    "Meio Peixe+Peixe Estranho": {
        id: "hibrido_meio_estranho",
        name: "Aberraçao Abissal",
        image: "/img/peixe/fusion/meio_estranho.png",
        desc: "Fica vivo mesmo depois de perder metade do HP. Causa repulsa nos inimigos.",
        tactical_stats: { HP: 150, AP: 1, MP: 2, ATK: 20, DEF: 25, SPD: 2, RNG: 1 },
        available_skills: ['mordida_padrao', 'olhar_abissal', 'escudo_bolha', 'canto_sereia', 'nadadeira_navalha']
    },
    "Peixes Fófos Juntos <3+Peixes Fófos Juntos <3": {
        id: "hibrido_fofos_filhote",
        name: "Cardume Herdeiro",
        image: "/img/peixe/fusion/fofos_filhote.png",
        desc: "O fruto do amor marítimo. Luta com o poder da amizade (e dentes muito afiados).",
        tactical_stats: { HP: 100, AP: 3, MP: 5, ATK: 25, DEF: 15, SPD: 10, RNG: 1 },
        available_skills: ['amor_de_peixe', 'mordida_padrao', 'jato_agua', 'canto_sereia', 'escudo_bolha']
    },
    // NOVO LENDÁRIO CATALOGADO
    "Big Eye Bocaccete+Meu Almoço Delicioso": {
        id: "hibrido_food_eye",
        name: "Bocaccete Delicioso",
        image: "/img/peixe/fusion/food-eye-bocaccete.png",
        desc: "Uma refeição incrivelmente suculenta que fica te encarando enquanto você tenta comer. Aterrorizante.",
        tactical_stats: { HP: 220, AP: 3, MP: 4, ATK: 45, DEF: 35, SPD: 12, RNG: 2 },
        available_skills: ['mordida_padrao', 'olhar_abissal', 'canto_sereia', 'amor_de_peixe', 'jato_agua']
    }
};

// 3. O MOTOR CIENTÍFICO DE MUTAÇÃO (Gera Quimeras do zero)
window.FusionManager = {
    sanitizeStr: function(str) {
        if (!str) return "desconhecido";
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/peixe /g, "").replace(/[^a-z0-9]/g, '');
    },

    processFusion: function(slotA, slotB) {
        if (!slotA || !slotB) return null;
        const key = [slotA.name, slotB.name].sort().join('+');

        // Se tiver uma receita pronta e desenhada à mão, usa ela!
        if (window.FUSIONS && window.FUSIONS[key]) {
            return window.FUSIONS[key];
        }

        // ========================================================
        // GERAÇÃO PROCEDURAL SE A RECEITA NÃO EXISTIR
        // ========================================================
        const prefixos = ["Quimera", "Mutante", "Híbrido", "Aberraçao", "Cobaia", "Espécime"];
        const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
        
        // Isola os nomes sem quebrar em peixes longos
        const nomeA = slotA.name.replace(/Peixe /i, "").split(' ')[0] || "Alfa";
        const nomeB = slotB.name.replace(/Peixe /i, "").split(' ').pop() || "Ômega";
        
        const safeA = this.sanitizeStr(nomeA);
        const safeB = this.sanitizeStr(nomeB);
        
        // Caminho Dinâmico: /img/peixe/fusion/mutante_bombardilo_generico.png
        const imagePath = `/img/peixe/fusion/mutante_${safeA}_${safeB}.png`;

        // Sorteia Habilidades
        const allSkillsKeys = Object.keys(window.SKILLS || {});
        const randomSkills = [];
        if (allSkillsKeys.length > 0) {
            while(randomSkills.length < 4 && randomSkills.length < allSkillsKeys.length) {
                const sk = allSkillsKeys[Math.floor(Math.random() * allSkillsKeys.length)];
                if(!randomSkills.includes(sk)) randomSkills.push(sk);
            }
        }

        // Status
        const geradoHP = Math.floor(Math.random() * 80) + 40;
        const geradoATK = Math.floor(Math.random() * 25) + 15;
        const geradoDEF = Math.floor(Math.random() * 20) + 5;
        const geradoSPD = Math.floor(Math.random() * 8) + 3;

        return {
            id: "custom_" + Date.now() + "_" + Math.floor(Math.random()*10000),
            name: `${prefixo} ${nomeA}-${nomeB}`,
            image: imagePath,
            fallbackImage: slotA.data ? slotA.data.image : 'https://placehold.co/80x80?text=?',
            desc: `DNA não catalogado resultante do cruzamento de ${slotA.name} e ${slotB.name}. Anomalia genética detectada.`,
            tactical_stats: { 
                HP: geradoHP, 
                AP: Math.floor(Math.random() * 2) + 2, 
                MP: Math.floor(Math.random() * 3) + 2, 
                ATK: geradoATK, 
                DEF: geradoDEF, 
                SPD: geradoSPD, 
                RNG: Math.floor(Math.random() * 2) + 1 
            },
            available_skills: randomSkills,
            isCustom: true // Tag de identificação para o Radar
        };
    }
};