// 🚀 Importações do Firebase (Versão Modular v9+)
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Inicializa a Autenticação (O FirebaseApp deve ser iniciado num script de configuração anterior)
const auth = getAuth();

// Variáveis de estado
let contaJogadorAtual = null;
let meusGrimorios = [];

// ==========================================
// INICIALIZAÇÃO E ESCUTA DO FIREBASE
// ==========================================

// Escuta o Firebase: Verifica quem é o jogador assim que o script é carregado
onAuthStateChanged(auth, (user) => {
    if (user) {
        contaJogadorAtual = user.uid; // Paga o ID único oficial do jogador do Firebase
        console.log("Jogador reconhecido pelas runas: ", contaJogadorAtual);
        renderizarGrimorios();
    } else {
        contaJogadorAtual = null;
        window.mostrarToast("Atenção: A magia só funciona para jogadores logados!", "error");
    }
});

// ==========================================
// RENDERIZAÇÃO DOS CARTÕES (Grelha de Estudo)
// ==========================================
function renderizarGrimorios() {
    const grid = document.getElementById("notebookGrid");
    if (!grid) return;

    // 🚀 CORREÇÃO: Injetamos o botão "Novo" via JS para garantir que o clique funciona sempre
    grid.innerHTML = `
        <div class="notebook-card create-new" id="btnAbrirModal">
            <div class="plus-icon">✨</div>
            <h3>Novo Grimório</h3>
            <p>Consagrar novos pergaminhos</p>
        </div>
    `;

    // Adiciona o evento de clique ao botão recém-criado
    document.getElementById("btnAbrirModal").onclick = window.abrirModalNovoGrimorio;

    // Renderiza os grimórios presentes na memória
    meusGrimorios.forEach(grimorio => {
        const card = document.createElement("div");
        card.className = "notebook-card";
        card.onclick = () => abrirGrimorio(grimorio.id, grimorio.nome);
        
        card.innerHTML = `
            <h3>📖 ${grimorio.nome}</h3>
            <p>Criado em: ${grimorio.data}</p>
            <p style="font-size: 0.8rem; margin-top: 5px; color: #aaa;">${grimorio.quant} pergaminho(s)</p>
            <p style="margin-top: 15px; font-size: 0.85rem; color: #b388eb; font-weight: bold;">Consultar Ancião ➔</p>
        `;
        grid.appendChild(card);
    });
}

function abrirGrimorio(id, nome) {
    if (!contaJogadorAtual) {
        window.mostrarToast("Erro místico: Jogador não identificado.", "error");
        return;
    }

    window.mostrarToast("Abrindo a conexão com a mente do Ancião...", "info");
    setTimeout(() => {
        // Envia o nome, o ID do grimorio e o UID do Firebase para o Chat
        window.location.href = `tenda_chat.html?nome=${encodeURIComponent(nome)}&id=${id}&user=${contaJogadorAtual}`;
    }, 800);
}

// ==========================================
// FUNÇÕES GLOBAIS (Expostas para o HTML)
// ==========================================
window.abrirModalNovoGrimorio = function() {
    if (!contaJogadorAtual) {
        window.mostrarToast("Você precisa estar logado para criar grimórios!", "error");
        return;
    }
    const modal = document.getElementById("uploadModal");
    if (modal) modal.classList.remove("hidden");
};

window.fecharModal = function() {
    const modal = document.getElementById("uploadModal");
    if (modal) modal.classList.add("hidden");
    
    document.getElementById("nomeGrimorio").value = "";
    document.getElementById("arquivoPdf").value = "";
    document.getElementById("listaArquivos").innerHTML = "";
    const btn = document.getElementById("btnConjurar");
    btn.disabled = false;
    btn.innerText = "Conjurar Magia";
};

window.mostrarToast = function(mensagem, tipo = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    let icone = tipo === 'success' ? '✅' : (tipo === 'error' ? '❌' : 'ℹ️');
    toast.innerHTML = `<span>${icone}</span> <div>${mensagem}</div>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400); 
    }, 4000);
};

// ==========================================
// COMUNICAÇÃO COM O PYTHON (Múltiplos PDFs)
// ==========================================
window.enviarParaPython = async function() {
    if (!contaJogadorAtual) {
        window.mostrarToast("Sessão expirada. Faça login novamente.", "error");
        return;
    }

    const nome = document.getElementById("nomeGrimorio").value.trim();
    const inputArquivo = document.getElementById("arquivoPdf");
    const btnConjurar = document.getElementById("btnConjurar");

    if (!nome || inputArquivo.files.length === 0) {
        window.mostrarToast("Dê um nome e anexe pelo menos um PDF!", "error");
        return;
    }

    btnConjurar.disabled = true;
    btnConjurar.innerText = "A Conjurar... ⏳";
    window.mostrarToast(`A enviar ${inputArquivo.files.length} pergaminho(s)...`, "info");

    const idGrimorioGerado = "grimorio_" + Date.now();
    const formData = new FormData();
    
    formData.append("nome", nome);
    formData.append("user_id", contaJogadorAtual); // UID do Firebase
    formData.append("grimorio_id", idGrimorioGerado);
    
    // Loop para enviar múltiplos ficheiros para o backend
    for (let i = 0; i < inputArquivo.files.length; i++) {
        formData.append("files", inputArquivo.files[i]); 
    }

    try {
        const resposta = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            window.mostrarToast(dados.mensagem, "success");
            meusGrimorios.push({ 
                id: idGrimorioGerado, 
                nome: nome, 
                data: new Date().toLocaleDateString(),
                quant: inputArquivo.files.length 
            });
            window.fecharModal();
            renderizarGrimorios();
        } else {
            window.mostrarToast("Erro: " + dados.detail, "error");
            btnConjurar.disabled = false;
            btnConjurar.innerText = "Conjurar Magia";
        }
    } catch (erro) {
        window.mostrarToast("O servidor do Ancião (Python) está offline!", "error");
        btnConjurar.disabled = false;
        btnConjurar.innerText = "Conjurar Magia";
    }
};

// ==========================================
// GESTÃO DE FICHEIROS (Drag & Drop)
// ==========================================
function configurarDropZone() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('arquivoPdf');

    if (!dropZone || !fileInput) return;

    fileInput.addEventListener('change', atualizarListaArquivos);

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            atualizarListaArquivos();
        }
    });
}

function atualizarListaArquivos() {
    const files = document.getElementById('arquivoPdf').files;
    const list = document.getElementById('listaArquivos');
    if (!list) return;
    
    list.innerHTML = '';
    Array.from(files).forEach(file => {
        const li = document.createElement('li');
        li.innerHTML = `📄 ${file.name} <span style="margin-left:auto; color:#888; font-size:0.7rem;">(${(file.size/1024/1024).toFixed(2)} MB)</span>`;
        list.appendChild(li);
    });
}

// Inicializa a zona de ficheiros no carregamento do script
configurarDropZone();