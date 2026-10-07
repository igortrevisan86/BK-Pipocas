/* ==========================================================================
   BK PIPOCAS GOURMET - REGRA DE NEGÓCIO E LÓGICA DO CARRINHO (JAVASCRIPT)
   ========================================================================== */

// 1. DADOS DE CONFIGURAÇÃO DO CARDÁPIO
const WHATSAPP_NUMBER = "5511981958786";

const tamanhos = [
    {
        id: "350ml",
        nome: "350 ml",
        preco: 18.00,
        icone: "🍿",
        descricao: "Pote P (Individual)"
    },
    {
        id: "500ml",
        nome: "500 ml",
        preco: 25.00,
        icone: "🍿🍿",
        descricao: "Pote M (Ideal para compartilhar)"
    },
    {
        id: "1litro",
        nome: "1 litro",
        preco: 40.00,
        icone: "🪣",
        descricao: "Pote G (Para a galera!)"
    }
];

const sabores = [
    { id: "ninho", nome: "Ninho", icone: "🥛" },
    { id: "nutella", nome: "Nutella", icone: "🍫" },
    { id: "ovomaltine", nome: "Ovomaltine", icone: "✨" },
    { id: "kinder", nome: "Kinder Bueno", icone: "🌰" },
    { id: "morango", nome: "Morango", icone: "🍓" },
];

const adicionais = [
    { id: "calda_nutella", nome: "Calda de Nutella", preco: 3.00, icone: "🍯" },
    { id: "leite_po", nome: "Leite Ninho Extra", preco: 2.00, icone: "🥛" },
    { id: "confete", nome: "Confetes", preco: 2.00, icone: "🎊" }
];

// 2. ESTADO DA APLICAÇÃO (SELEÇÃO ATUAL E CARRINHO)
let tamanhoSelecionado = null; // Guardará o objeto do tamanho escolhido
let saboresSelecionados = [];  // Guardará os nomes dos sabores escolhidos (máx 2)
let adicionaisSelecionados = []; // Objetos de adicionais
let carrinho = JSON.parse(localStorage.getItem("bk_pipocas_cart")) || [];

// 3. REFERÊNCIAS DO DOM
const tamanhosGrid = document.getElementById("tamanhos-grid");
const saboresGrid = document.getElementById("sabores-grid");
const adicionaisGrid = document.getElementById("adicionais-grid");
const saboresContador = document.getElementById("sabores-contador");
const observacoesInput = document.getElementById("observacoes");

const resumoTamanho = document.getElementById("resumo-tamanho");
const resumoSabores = document.getElementById("resumo-sabores");
const rowAdicionais = document.getElementById("row-adicionais");
const resumoAdicionais = document.getElementById("resumo-adicionais");
const resumoPreco = document.getElementById("resumo-preco");
const addToCartBtn = document.getElementById("add-to-cart-btn");

const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartBody = document.getElementById("cart-body");
const cartTotalPrice = document.getElementById("cart-total-price");
const whatsappBtn = document.getElementById("whatsapp-btn");
const toast = document.getElementById("toast");

// 4. INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
    renderizarTamanhos();
    renderizarSabores();
    renderizarAdicionais();
    atualizarResumoPote();
    atualizarCarrinho();
    configurarEventos();
});

// 5. RENDEREIZAÇÃO DOS CARDS
function renderizarTamanhos() {
    tamanhosGrid.innerHTML = "";
    tamanhos.forEach(tamanho => {
        const card = document.createElement("div");
        card.className = "card-option";
        card.dataset.id = tamanho.id;
        card.innerHTML = `
            <div class="card-icon">${tamanho.icone}</div>
            <div class="card-title">${tamanho.nome}</div>
            <div class="card-price">R$ ${tamanho.preco.toFixed(2).replace(".", ",")}</div>
        `;
        card.addEventListener("click", () => selecionarTamanho(tamanho));
        tamanhosGrid.appendChild(card);
    });
}

function renderizarSabores() {
    saboresGrid.innerHTML = "";
    sabores.forEach(sabor => {
        const card = document.createElement("div");
        card.className = "card-option";
        card.dataset.nome = sabor.nome;
        card.innerHTML = `
            <div class="card-icon">${sabor.icone}</div>
            <div class="card-title">${sabor.nome}</div>
        `;
        card.addEventListener("click", () => selecionarSabor(sabor.nome));
        saboresGrid.appendChild(card);
    });
}

function renderizarAdicionais() {
    adicionaisGrid.innerHTML = "";
    adicionais.forEach(adicional => {
        const card = document.createElement("div");
        card.className = "card-option";
        card.dataset.id = adicional.id;
        card.innerHTML = `
            <div class="card-icon">${adicional.icone}</div>
            <div class="card-title">${adicional.nome}</div>
            <div class="card-price">+ R$ ${adicional.preco.toFixed(2).replace(".", ",")}</div>
        `;
        card.addEventListener("click", () => selecionarAdicional(adicional));
        adicionaisGrid.appendChild(card);
    });
}

// 6. SELEÇÃO DO TAMANHO E SABORES
function selecionarTamanho(tamanho) {
    tamanhoSelecionado = tamanho;

    // Atualiza destaque nos cards
    const cards = tamanhosGrid.querySelectorAll(".card-option");
    cards.forEach(card => {
        if (card.dataset.id === tamanho.id) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });

    atualizarResumoPote();
}

function selecionarSabor(nomeSabor) {
    const index = saboresSelecionados.indexOf(nomeSabor);

    if (index > -1) {
        // Se já estava selecionado, remove
        saboresSelecionados.splice(index, 1);
    } else {
        // Se tentar escolher mais de 2 sabores
        if (saboresSelecionados.length >= 2) {
            mostrarToast("Você pode escolher no máximo 2 sabores por pote. 🍿");
            return;
        }
        saboresSelecionados.push(nomeSabor);
    }

    // Atualiza destaque visual dos cards de sabores
    const cards = saboresGrid.querySelectorAll(".card-option");
    cards.forEach(card => {
        if (saboresSelecionados.includes(card.dataset.nome)) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });

    // Atualiza o contador de sabores (0/2, 1/2, 2/2)
    saboresContador.textContent = `Sabores escolhidos: ${saboresSelecionados.length}/2`;

    atualizarResumoPote();
}

function selecionarAdicional(adicional) {
    const index = adicionaisSelecionados.findIndex(item => item.id === adicional.id);

    if (index > -1) {
        // Remove se já selecionado
        adicionaisSelecionados.splice(index, 1);
    } else {
        adicionaisSelecionados.push(adicional);
    }

    // Atualiza destaque
    const cards = adicionaisGrid.querySelectorAll(".card-option");
    cards.forEach(card => {
        const estaSelecionado = adicionaisSelecionados.some(item => item.id === card.dataset.id);
        if (estaSelecionado) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });

    atualizarResumoPote();
}

// 7. ATUALIZAR O RESUMO DO POTE
function atualizarResumoPote() {
    // Atualiza Texto do Tamanho
    if (tamanhoSelecionado) {
        resumoTamanho.textContent = tamanhoSelecionado.nome;
        resumoTamanho.classList.remove("placeholder");
    } else {
        resumoTamanho.textContent = "Selecione um tamanho";
        resumoTamanho.classList.add("placeholder");
    }

    // Atualiza Texto dos Sabores
    if (saboresSelecionados.length > 0) {
        resumoSabores.textContent = saboresSelecionados.join(" + ");
        resumoSabores.classList.remove("placeholder");
    } else {
        resumoSabores.textContent = "Selecione pelo menos 1 sabor";
        resumoSabores.classList.add("placeholder");
    }

    // Atualiza Texto dos Adicionais
    if (adicionaisSelecionados.length > 0) {
        rowAdicionais.style.display = "flex";
        resumoAdicionais.textContent = adicionaisSelecionados.map(a => a.nome).join(", ");
    } else {
        rowAdicionais.style.display = "none";
        resumoAdicionais.textContent = "Nenhum";
    }

    // Atualiza Preço e Habilita/Desabilita Botão
    let precoTotal = 0;
    if (tamanhoSelecionado) {
        precoTotal += tamanhoSelecionado.preco;
    }
    adicionaisSelecionados.forEach(a => {
        precoTotal += a.preco;
    });

    if (tamanhoSelecionado) {
        resumoPreco.textContent = `R$ ${precoTotal.toFixed(2).replace(".", ",")}`;
    } else {
        resumoPreco.textContent = "R$ 0,00";
    }

    // O botão só habilita se tiver Tamanho E pelo menos 1 sabor selecionado
    if (tamanhoSelecionado && saboresSelecionados.length > 0) {
        addToCartBtn.disabled = false;
    } else {
        addToCartBtn.disabled = true;
    }
}

// 8. ADICIONAR AO CARRINHO
function adicionarAoCarrinho() {
    if (!tamanhoSelecionado || saboresSelecionados.length === 0) {
        mostrarToast("Selecione o tamanho e ao menos 1 sabor antes de adicionar! 🍿");
        return;
    }

    // Ordenar sabores e adicionais para garantir comparação correta do mesmo item
    const saboresOrdenados = [...saboresSelecionados].sort();
    const adicionaisOrdenados = [...adicionaisSelecionados].map(a => a.nome).sort();
    const observacao = observacoesInput.value.trim();

    // Calcula preco total unitario
    let precoTotalUnitario = tamanhoSelecionado.preco;
    adicionaisSelecionados.forEach(a => precoTotalUnitario += a.preco);

    // Procura se já existe um item EXATAMENTE igual (tamanho, sabores, adicionais e obs)
    const itemExistenteIndex = carrinho.findIndex(item => {
        const mesmosSabores = item.sabores.length === saboresOrdenados.length &&
            item.sabores.every((val, index) => val === saboresOrdenados[index]);
        const mesmosAdicionais = item.adicionais && item.adicionais.length === adicionaisOrdenados.length &&
            item.adicionais.every((val, index) => val === adicionaisOrdenados[index]);
        const mesmaObs = (item.observacao || "") === observacao;

        return item.tamanho === tamanhoSelecionado.nome && mesmosSabores && mesmosAdicionais && mesmaObs;
    });

    if (itemExistenteIndex > -1) {
        carrinho[itemExistenteIndex].quantidade += 1;
    } else {
        carrinho.push({
            tamanho: tamanhoSelecionado.nome,
            sabores: saboresOrdenados,
            adicionais: adicionaisOrdenados,
            observacao: observacao,
            quantidade: 1,
            preco: precoTotalUnitario
        });
    }

    salvarEAtualizarCarrinho();
    mostrarToast("✅ Produto adicionado ao carrinho!");

    // Limpa a seleção para o cliente poder montar outro pote facilmente
    resetarSelecaoPote();
}

function resetarSelecaoPote() {
    tamanhoSelecionado = null;
    saboresSelecionados = [];
    adicionaisSelecionados = [];
    observacoesInput.value = "";

    const todosCards = document.querySelectorAll(".card-option");
    todosCards.forEach(card => card.classList.remove("selected"));

    saboresContador.textContent = "Sabores escolhidos: 0/2";
    atualizarResumoPote();
}

// 9. GERENCIAMENTO DO CARRINHO (AUMENTAR, DIMINUIR, REMOVER, SALVAR)
function aumentarQuantidade(index) {
    carrinho[index].quantidade += 1;
    salvarEAtualizarCarrinho();
}

function diminuirQuantidade(index) {
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade -= 1;
    } else {
        removerDoCarrinho(index);
        return;
    }
    salvarEAtualizarCarrinho();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    salvarEAtualizarCarrinho();
    mostrarToast("Produto removido do carrinho.");
}

function salvarEAtualizarCarrinho() {
    localStorage.setItem("bk_pipocas_cart", JSON.stringify(carrinho));
    atualizarCarrinho();
}

function calcularTotal() {
    return carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
}

function atualizarCarrinho() {
    // Atualiza a badge do contador de itens totais no header
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    cartCount.textContent = totalItens;

    // Se o carrinho estiver vazio
    if (carrinho.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🍿</div>
                <p>Seu carrinho está vazio</p>
                <button class="btn btn-primary" onclick="fecharCarrinho()">Voltar ao cardápio</button>
            </div>
        `;
        cartTotalPrice.textContent = "R$ 0,00";
        whatsappBtn.style.display = "none";
        return;
    }

    // Se houver itens no carrinho
    whatsappBtn.style.display = "flex";
    cartBody.innerHTML = "";

    carrinho.forEach((item, index) => {
        const itemSubtotal = item.preco * item.quantidade;
        let adicionaisHtml = '';
        if (item.adicionais && item.adicionais.length > 0) {
            adicionaisHtml = `<div class="cart-item-sabores">Adicionais: ${item.adicionais.join(", ")}</div>`;
        }
        let obsHtml = '';
        if (item.observacao) {
            obsHtml = `<div class="cart-item-sabores" style="font-style: italic;">Obs: ${item.observacao}</div>`;
        }

        const cartItemEl = document.createElement("div");
        cartItemEl.className = "cart-item";
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">🍿 Pote ${item.tamanho}</div>
                <div class="cart-item-sabores">Sabores: ${item.sabores.join(" + ")}</div>
                ${adicionaisHtml}
                ${obsHtml}
                <div class="cart-item-price">R$ ${itemSubtotal.toFixed(2).replace(".", ",")}</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="diminuirQuantidade(${index})">-</button>
                <span class="qty-number">${item.quantidade}</span>
                <button class="qty-btn" onclick="aumentarQuantidade(${index})">+</button>
                <button class="remove-btn" onclick="removerDoCarrinho(${index})" title="Remover item">&times;</button>
            </div>
        `;
        cartBody.appendChild(cartItemEl);
    });

    const total = calcularTotal();
    cartTotalPrice.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

// 10. INTEGRAÇÃO COM WHATSAPP
function gerarMensagemWhatsApp() {
    let mensagem = "*Olá! Gostaria de fazer um pedido na BK Pipocas Gourmet*\n\n*ITENS DO PEDIDO:*\n----------------------------------------\n";

    carrinho.forEach((item, index) => {
        const itemSubtotal = item.preco * item.quantidade;
        mensagem += `*${index + 1}. Pote ${item.tamanho}* (${item.quantidade}x)\n`;
        mensagem += `   • Sabores: ${item.sabores.join(" + ")}\n`;
        if (item.adicionais && item.adicionais.length > 0) {
            mensagem += `   • Adicionais: ${item.adicionais.join(", ")}\n`;
        }
        if (item.observacao) {
            mensagem += `   • Obs: ${item.observacao}\n`;
        }
        mensagem += `   • Subtotal: R$ ${itemSubtotal.toFixed(2).replace(".", ",")}\n\n`;
    });

    const total = calcularTotal();
    mensagem += `----------------------------------------\n`;
    mensagem += `*VALOR TOTAL: R$ ${total.toFixed(2).replace(".", ",")}*\n\n`;
    mensagem += "Aguardo a confirmação do pedido! Obrigado(a).";

    return mensagem;
}

function enviarParaWhatsApp() {
    if (carrinho.length === 0) return;

    const mensagemFormatada = gerarMensagemWhatsApp();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagemFormatada)}`;
    window.open(url, "_blank");
}

// 11. MODAL E TOAST AUXILIARES
function abrirCarrinho() {
    cartModal.classList.add("active");
    cartModal.setAttribute("aria-hidden", "false");
}

function fecharCarrinho() {
    cartModal.classList.remove("active");
    cartModal.setAttribute("aria-hidden", "true");
}

function mostrarToast(mensagem) {
    toast.textContent = mensagem;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function configurarEventos() {
    addToCartBtn.addEventListener("click", adicionarAoCarrinho);
    cartBtn.addEventListener("click", abrirCarrinho);
    closeCartBtn.addEventListener("click", fecharCarrinho);
    whatsappBtn.addEventListener("click", enviarParaWhatsApp);

    // Fechar modal ao clicar fora da caixa do conteúdo
    cartModal.addEventListener("click", (e) => {
        if (e.target === cartModal) {
            fecharCarrinho();
        }
    });
}
