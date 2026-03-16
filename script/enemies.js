// ==========================================================================
// BANCO DE DADOS DE INIMIGOS E INTELIGÊNCIA ARTIFICIAL TÁTICA
// ==========================================================================

window.ENEMY_DATABASE = [
    { 
        id: 'crab', name: 'Caranguejo Couraça', image: '/img/enemys/crab.png', fallback: 'https://placehold.co/80x80/1e293b/10b981?text=Tank', 
        hp: 180, atk: 18, def: 25, spd: 2, mp: 2, ap: 2, 
        skills: ['investida'], ai: 'tank' 
    },
    { 
        id: 'kraken', name: 'Filhote Abissal', image: '/img/enemys/kraken.png', fallback: 'https://placehold.co/80x80/1e293b/ef4444?text=Agressivo', 
        hp: 90, atk: 35, def: 5, spd: 6, mp: 4, ap: 3, 
        skills: ['mordida_padrao', 'frenesi_predador'], ai: 'aggressive' 
    },
    { 
        id: 'worm', name: 'Verme Tóxico', image: '/img/enemys/worm.png', fallback: 'https://placehold.co/80x80/1e293b/a855f7?text=Sniper', 
        hp: 110, atk: 22, def: 10, spd: 4, mp: 3, ap: 2, 
        skills: ['espinho_venenoso'], ai: 'sniper' 
    }
];

window.EnemyAI = {
    
    // Ponto de entrada da IA
    execute: function(enemy, engine) {
        // Delay inicial de 800ms para dar tempo ao jogador de ler de quem é o turno
        setTimeout(() => this.decideAction(enemy, engine), 800);
    },

    decideAction: function(enemy, engine) {
        // Validação de segurança
        if (enemy.hp <= 0) { engine.nextTurn(); return; }

        let players = engine.units.filter(u => u.isPlayer && u.hp > 0);
        if (players.length === 0) { engine.nextTurn(); return; }

        // Encontra o alvo mais próximo utilizando Distância de Manhattan
        let closest = null; 
        let minDist = 999;
        
        players.forEach(p => {
            let d = engine.getDist(enemy.x, enemy.y, p.x, p.y);
            if (d < minDist) { minDist = d; closest = p; }
        });

        let personality = enemy.ai || 'aggressive';
        let skillId = enemy.skills[0]; // Carrega a habilidade primária
        let skill = window.SKILLS ? window.SKILLS[skillId] : { name:'Ataque', rng: 1, cost: 2, pwr: 1 };

        // ====================================================================
        // LÓGICA DE SNIPER (Ataca de Longe, Mantém Distância)
        // ====================================================================
        if (personality === 'sniper') {
            // Se já está no alcance e tem AP, atira!
            if (minDist <= skill.rng && minDist > 1 && enemy.ap >= skill.cost && !engine.turnFlags.attacked) {
                engine.turnFlags.attacked = true;
                engine.executeSkill(enemy, closest, skill); 
                return;
            }
            
            // Se precisa reposicionar-se
            if (enemy.mp > 0 && !engine.turnFlags.moved) {
                let bestCell = this.findBestSniperCell(enemy, closest.x, closest.y, skill.rng, engine);
                if (bestCell) {
                    this.executeMovement(enemy, bestCell.x, bestCell.y, engine);
                    return;
                }
            }
        } 
        
        // ====================================================================
        // LÓGICA AGRESSIVA / TANK (Avança implacavelmente contra o alvo)
        // ====================================================================
        else {
            // Se está colado ao alvo, morde!
            if (minDist <= skill.rng && enemy.ap >= skill.cost && !engine.turnFlags.attacked) {
                engine.turnFlags.attacked = true;
                engine.executeSkill(enemy, closest, skill); 
                return;
            }
            
            // Se precisa andar para encurtar a distância
            if (enemy.mp > 0 && !engine.turnFlags.moved) {
                let bestCell = this.findCellTowards(enemy, closest, engine);
                if (bestCell) {
                    this.executeMovement(enemy, bestCell.x, bestCell.y, engine);
                    return;
                }
            }
        }

        // Se não pode andar nem atacar, finaliza o turno
        engine.log(`${enemy.name} finaliza a sua postura tática.`, 'system');
        setTimeout(() => engine.nextTurn(), 800);
    },

    // Função auxiliar para executar o movimento e ativar a animação CSS (is-moving)
    executeMovement: function(enemy, newX, newY, engine) {
        // Dispara a classe de animação suave sem tocar no "transform" inline
        const unitDOM = document.getElementById(`unit-${enemy.id}`);
        if(unitDOM) {
            unitDOM.classList.add('is-moving');
            setTimeout(() => unitDOM.classList.remove('is-moving'), 500);
        }
        
        enemy.x = newX; 
        enemy.y = newY; 
        enemy.mp -= 1; 
        engine.turnFlags.moved = true;
        
        engine.log(`${enemy.name} avança pelo campo.`, 'enemy');
        engine.renderUnits();
        
        // Avalia novamente a ação (para atacar após andar)
        setTimeout(() => this.decideAction(enemy, engine), 600);
    },

    // Acha a célula vizinha que diminui a distância absoluta para o alvo
    findCellTowards: function(enemy, target, engine) {
        let options = [
            {x: enemy.x+1, y: enemy.y}, 
            {x: enemy.x-1, y: enemy.y}, 
            {x: enemy.x, y: enemy.y+1}, 
            {x: enemy.x, y: enemy.y-1}
        ];
        
        let best = null; 
        let bestDist = 999;
        
        for(let o of options) {
            // Verifica limites do tabuleiro
            if(o.x >= 0 && o.x < engine.gridSize && o.y >= 0 && o.y < engine.gridSize) {
                // Verifica se a célula está vazia
                if(!engine.getUnitAt(o.x, o.y)) {
                    let d = engine.getDist(o.x, o.y, target.x, target.y);
                    if(d < bestDist) { 
                        bestDist = d; 
                        best = o; 
                    }
                }
            }
        }
        return best;
    },

    // Acha a célula que tenta manter a distância exata do alcance da arma (Kiting)
    findBestSniperCell: function(enemy, tx, ty, idealRange, engine) {
        let options = [
            {x: enemy.x+1, y: enemy.y}, 
            {x: enemy.x-1, y: enemy.y}, 
            {x: enemy.x, y: enemy.y+1}, 
            {x: enemy.x, y: enemy.y-1}
        ];
        
        let currentDist = engine.getDist(enemy.x, enemy.y, tx, ty);
        let best = null; 
        let bestDiff = Math.abs(currentDist - idealRange);

        for(let o of options) {
            if(o.x >= 0 && o.x < engine.gridSize && o.y >= 0 && o.y < engine.gridSize) {
                if(!engine.getUnitAt(o.x, o.y)) {
                    let d = engine.getDist(o.x, o.y, tx, ty);
                    let diff = Math.abs(d - idealRange);
                    if(diff < bestDiff) { 
                        bestDiff = diff; 
                        best = o; 
                    }
                }
            }
        }
        return best;
    }
};