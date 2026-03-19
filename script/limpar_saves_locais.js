// ═══════════════════════════════════════════════════════════════════
// UTILITÁRIO DE LIMPEZA: SAVES LOCAIS DO GATO PESCADOR
// ═══════════════════════════════════════════════════════════════════
// 
// COMO USAR:
// 1. Abra o DevTools (F12) no navegador
// 2. Vá na aba "Console"
// 3. Cole este código completo e pressione ENTER
// 4. Verifique a lista de chaves removidas no console
//
// ═══════════════════════════════════════════════════════════════════

(function() {
    console.log('🧹 Iniciando limpeza de saves locais do Gato Pescador...\n');
    
    let removedCount = 0;
    const removedKeys = [];
    
    // Varrer TODAS as chaves do localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        
        // Detectar qualquer chave relacionada ao jogo
        if (key && (
            key.startsWith('gatoPescadorSave_') ||
            key.startsWith('fishingMania') ||
            key.includes('gatoPescador')
        )) {
            const value = localStorage.getItem(key);
            const size = new Blob([value]).size;
            
            localStorage.removeItem(key);
            removedKeys.push({
                chave: key,
                tamanho: `${(size / 1024).toFixed(2)} KB`
            });
            removedCount++;
        }
    }
    
    // Relatório final
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`✅ LIMPEZA CONCLUÍDA`);
    console.log(`═══════════════════════════════════════════════════════════`);
    console.log(`📊 Total de chaves removidas: ${removedCount}`);
    
    if (removedCount > 0) {
        console.log('\n📋 Detalhes das chaves removidas:\n');
        console.table(removedKeys);
        
        const totalSize = removedKeys.reduce((sum, item) => {
            return sum + parseFloat(item.tamanho);
        }, 0);
        console.log(`\n💾 Espaço liberado: ${totalSize.toFixed(2)} KB`);
    } else {
        console.log('\n✨ Nenhum save local encontrado. O localStorage já está limpo!');
    }
    
    console.log('\n═══════════════════════════════════════════════════════════\n');
    console.log('🔄 Recarregue a página (F5) para confirmar a limpeza.');
    
})();