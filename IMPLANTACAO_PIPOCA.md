# Plano de Implantação - BK Pipocas Gourmet (Cardápio Digital)

Este documento contém o planejamento completo, cronograma por fases e checklist de progresso para o desenvolvimento, homologação e publicação do site **BK Pipocas Gourmet**.

---

## Visão Geral do Projeto
- **Objetivo**: Criar um cardápio digital web responsivo e moderno para a **BK Pipocas Gourmet**, permitindo que clientes montem potes personalizados (tamanhos + até 2 sabores) e enviem o pedido formatado diretamente para o WhatsApp da loja.
- **Tecnologias**: HTML5, CSS3 (Design System com variáveis, Dark/Light responsive, Micro-animações), JavaScript ES6+ (Sem frameworks pesados para garantir alta velocidade e performance em celulares).
- **Regra de estilo**: não usar emojis em nenhum arquivo do projeto (HTML, JS, CSS e documentação) - eles causam problemas de renderização/encoding no site e nas mensagens do WhatsApp.

---

## Quadro de Fases & Checklist

### Fase 1: Fundação & Identidade Visual (Concluída)
- [x] Definição das fontes corporativas (Outfit & Playfair Display via Google Fonts)
- [x] Criação do Design System CSS (`style.css` com tokens HSL, gradientes e sombras)
- [x] Estrutura semântica HTML (`index.html` com Meta Tags de SEO e Viewport Mobile)
- [x] Banner principal responsivo e Header com logo animado

### Fase 2: Construtor de Potes (Regra de Negócio Central) (Concluída)
- [x] Cadastro dos tamanhos: 350ml (R$ 18,00), 500ml (R$ 25,00) e 1L (R$ 40,00)
- [x] Cadastro dos sabores artesanais: Ninho, Nutella, Ovomaltine, Kinder Bueno
- [x] Lógica de seleção interativa de Tamanho (Card Selection)
- [x] Lógica de seleção de até 2 Sabores com trava de segurança em 2/2 e feedback visual
- [x] Card fixo/dinâmico de Resumo do Pote com cálculo instantâneo de valor

### Fase 3: Carrinho de Compras & Persistência (Concluída)
- [x] Sistema de adição do pote montado ao Carrinho
- [x] Agrupamento inteligente de itens repetidos (mesmo tamanho e sabores)
- [x] Persistência de dados local via `localStorage` (o cliente não perde o carrinho se fechar a página)
- [x] Modal interativo do Carrinho com alteração de quantidade (`+` e `-`) e exclusão de itens
- [x] Contador dinâmico (Badge) no Header

### Fase 4: Integração com WhatsApp (Concluída)
- [x] Formatador automático da mensagem com quebra de linhas e sub-totais
- [x] Correção de codificação UTF-8 (substituição de símbolos/emojis que corrompiam a mensagem por marcações limpas em Markdown `*`, `•` e `-`)
- [x] Botão com link direto para `https://wa.me/{numero}`
- [x] Testes de envio de pedido via celular e desktop

### Fase 5: Expansão de Sabores & Adicionais Extra (Concluída)
- [x] Adicionar novos sabores artesanais (Leite Ninho com Morango, Caramelo Salgado, Churros, Ouro Branco)
- [x] Permitir a escolha de **Adicionais Extra** no Pote (Ex: Calda extra de Nutella +R$ 3,00, Cobertura de Leite em Pó +R$ 2,00)
- [x] Campo de observações por pote (Ex: "Pouca calda", "Para presente")

### Fase 6: Experiência de Checkout & Taxa de Entrega (Concluída)
- [x] Formulário de identificação do cliente no Modal (Nome, Endereço de entrega / Retirada)
- [x] Seletor de forma de pagamento (PIX, Cartão, Dinheiro com troco)
- [x] Cálculo/Opção de taxa de entrega no resumo do WhatsApp (subtotal + taxa + total)
- [x] Modal com área de rolagem única (`.modal-scroll`) para que o formulário de entrega não corte o botão do WhatsApp

### Fase 7: Publicação, GitHub & Hospedagem (Em andamento)
- [x] Repositório criado e código enviado para o GitHub: [https://github.com/igortrevisan86/BK-Pipocas](https://github.com/igortrevisan86/BK-Pipocas)
- [ ] Ativação do GitHub Pages para hospedar o site gratuitamente em `https://igortrevisan86.github.io/BK-Pipocas/`
- [x] Otimização de imagens e ícones (Favicon personalizado da pipoca em `favicon.svg`)
- [ ] Configuração do número real do WhatsApp da loja em `script.js`
- [ ] Testes de usabilidade e performance (Google Lighthouse 90+)

---

## Como Testar Localmente

Para rodar o site em sua máquina e fazer testes:

1. **Inicie o servidor (Modo Fácil)**:
   - Dê um duplo clique no arquivo `inicie_servidor.bat` localizado na pasta do projeto.
   - Ele iniciará o servidor e abrirá o navegador automaticamente em `http://localhost:3000`.

2. **Fluxo de Teste Sugerido**:
   1. Escolha o tamanho do pote (ex: 500 ml - R$ 25,00).
   2. Escolha até 2 sabores (ex: Ninho + Nutella).
   3. Escolha adicionais e digite observações se desejar.
   4. Clique em **"Adicionar ao carrinho"**.
   5. Abra o carrinho no canto superior direito.
   6. Selecione Retirada ou Entrega (Motoboy), escolha o bairro e confira a taxa.
   7. Altere as quantidades e teste o envio pelo WhatsApp.

---

## Fluxo de Publicação (importante)

- **Nunca** fazer commit/envio para o GitHub sem autorização expressa do dono do projeto.
- Enquanto não houver autorização, as alterações ficam apenas locais e são validadas em `http://localhost:3000`.

---

> *Este documento será mantido atualizado a cada avanço no projeto diretamente nesta pasta.*
