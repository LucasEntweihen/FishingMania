# FishingMania
## Jogo 
https://fishingmania.vercel.app/

---

<br>

<div align="center">
  <h2>🎣 Bem-vindo ao Abismo: A Verdadeira Aventura Oceânica 🌊</h2>
  <p><b>FishingMania (Gato Pescador)</b> não é apenas um simples jogo de pescar. É um RPG Idle/Incremental de progressão profunda, gestão de economia de mercado negro, engenharia genética e magia negra. Assuma o papel do felino mais ambicioso dos sete mares e desbrave os mistérios escondidos na Fossa das Marianas.</p>
</div>

<br>

## ✨ Características Principais

* **☁️ Sistema Climático Dinâmico:** O mundo é vivo. O ciclo de Dia e Noite altera o comportamento dos peixes, enquanto Eventos Climáticos Massivos (como *Tempestades Noturnas* e *Frenesis Alimentares*) ocorrem espontaneamente, mudando completamente as regras da física, velocidade e economia do jogo.
* **⚒️ Hub de Forja Tática:** Colete Matérias-Primas raras para forjar mais de 100 variações de equipamentos, incluindo Varas de Nanotubos de Carbono, Chumbadas de Buracos Negros e Facas feitas de poeira cósmica.
* **🧬 Laboratório Genético (Crafting de Iscas):** Transforme o lixo pescado no oceano em Extratos Biológicos. Cruze-os com Catalisadores Puros para criar Iscas Mutantes com bônus de Sorte e tamanho absurdos.
* **🍣 Minijogo de Filetagem (Sushi):** Não venda apenas os seus peixes! Use as suas facas num minijogo tático de corte. Acerte os Pontos Vitais dinâmicos para multiplicar os lucros, mas cuidado com peixes com aspecto doentio (podres)!
* **🔮 Rituais Ocultos (End-Game):** O derradeiro sacrifício. Destrua peixes de raridade Divina e milhares de materiais num altar para tentar criar *Orbes de Poder* e forçar a chegada do temido **Mar das Bestas**. Cuidado: a taxa de falha é esmagadora.
* **☁️ Cloud Save via Firebase:** Autenticação completa e salvamento na nuvem para não perder o seu império pesqueiro, com suporte a modo "Visitante" para jogo local.

---

## 🐟 A Hierarquia das Profundezas

Os peixes no FishingMania são classificados num rigoroso sistema de RNG (Gerador de Números Aleatórios). Além da raridade, qualquer peixe tem uma chance de atingir o tamanho máximo de troféu: **Os lendários 67cm**.

* ⬜ **Comum:** Peixes burrinhos do dia a dia.
* 🟩 **Raro:** Exigem um pouco mais de dedicação e iscas básicas.
* 🟪 **Épico:** Trazem bons lucros ao restaurante de sushi.
* 🟨 **Lendário:** Monstros imensos que habitam as profundezas.
* 🟥 **Mítico:** Criaturas de contos de pescador.
* ⬛ **Secreto:** Seres que desafiam a compreensão humana.
* 🟧 **Divino:** Deuses caídos dos oceanos antigos.
* 🟨✨ **Aurudo:** A lenda dourada. Probabilidade quase nula.
* 🩸🐙 **Bestial:** Os leviatãs do fim do mundo. Só aparecem durante o apocalíptico evento *Mar das Bestas*.

---

## 🛠️ O Arsenal (Mesa de Montagem)

Cada peça de equipamento importa e tem sinergias secretas. O seu *Loadout* dita o que você pesca e como pesca.

1. **🎣 Varas:** Determinam a velocidade base em que a linha desce e a sorte bruta.
2. **🪨 Pesos (Chumbadas):** Afetam a hidrodinâmica e aplicam bônus multiplicativos e sinergias (Ex: Um peso de Metal numa Vara de Metal gera bônus ocultos).
3. **🪝 Anzóis:** Esqueça iscas comuns. Anzóis especiais forçam o jogo a procurar raridades específicas, ignorando peixes menores (se a sua sorte permitir).
4. **🔪 Facas:** Usadas estritamente na *Cozinha do Mestre*. Facas melhores multiplicam as moedas do Sushi e permitem extrair materiais raros da carne do peixe.
5. **🪱 Iscas:** Sintetizadas no laboratório. Têm vida útil (cargas) e podem garantir desde bônus de lucro até chances garantidas de encontrar peixes de 67cm.

---

## 🌪️ Clima e Orbes de Evento

Fique de olho nos céus. O clima muda a cada dois minutos, trazendo oportunidades ou caos.

* ⛈️ **Tempestade Noturna:** Atrasa a sua linha, mas traz monstros à superfície.
* ✨ **Maré Dourada:** Tudo o que pescar vale o dobro.
* 🦈 **Frenesi Alimentar:** A linha viaja a uma velocidade absurda. Prepare os reflexos!
* 🔮 **Nevoeiro Místico:** Ignora limites de raridade. Divinos e Aurudos surgem do nada.
* 🐙 **Mar das Bestas (End-Game):** Escuridão e silêncio. Reduz severamente a chance de comuns e libera a raridade **Bestial**. Quase impossível de acontecer naturalmente; geralmente requer um sacrifício ritualístico para invocar o *Orbe do Fim*.

---

## 💻 Tecnologias e Arquitetura

O FishingMania foi desenvolvido como um projeto robusto de Front-End moderno, utilizando tecnologias nativas otimizadas para rodar em qualquer navegador sem quedas de frames, mesmo com centenas de elementos na tela.

* **HTML5 & CSS3:** Design moderno utilizando *Glassmorphism*, *Neumorphism*, variáveis CSS dinâmicas e layouts em Grid/Flexbox responsivos.
* **Vanilla JavaScript (ES6+):** Lógica complexa de estado de jogo (`GAME_STATE`), manipulação do DOM em tempo real, Drag & Drop nativo para a mesa de montagem, e renderização de Canvas (animação do fundo oceânico e sistema de colisão do minijogo de cortes).
* **Firebase (Auth & Realtime Database):** Autenticação robusta (Google e Email/Senha) e persistência de dados em nuvem para sincronização cross-device.
* **Vercel:** Hospedagem contínua e distribuição global (CDN).

---

## 🎮 Como Jogar

1. Pressione **ESPAÇO** ou clique em `PESCAR` para lançar a linha.
2. Acumule **Cat Coins 🪙** e Peixes.
3. Se pescar lixo, celebre! O lixo é transformado em extratos vitais na Galeria.
4. Compre Matérias-Primas no **Mercado Negro**.
5. Processe Peixes repetidos no **Fazer Sushi** traçando cortes precisos sobre os alvos vermelhos para maximizar o retorno.
6. Construa novos equipamentos na **Grande Forja**.
7. Combine tudo na **Mesa Tática** e prepare-se para caçar os deuses do mar!

---

> *"A pesca nunca mais será a mesma. Há coisas no fundo deste mar que não deveriam ser perturbadas... Mas os lucros são bons demais para ignorar."* **Desenvolvido e Idealizado por [Lucas Guerriero](https://github.com/LucasEntweihen).**