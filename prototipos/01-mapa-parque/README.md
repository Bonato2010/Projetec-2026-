# Mapa Interativo - Parque Realengo Susana Naspolini

Este projeto consiste em um protótipo de mapa interativo ilustrado do Parque Realengo Jornalista Susana Naspolini, localizado no Rio de Janeiro.

O objetivo é fornecer uma visão espacial interativa das instalações do parque (como quadras, bosque, nave do conhecimento, torres, etc) utilizando SVG, HTML, CSS e JavaScript sem dependências externas.

## Como Executar

Por ser um projeto puramente front-end estático (Vanilla JS, HTML e CSS), você pode executá-lo facilmente de duas formas:

### 1. Abertura direta (File Protocol)
Basta abrir o arquivo `index.html` diretamente em qualquer navegador moderno (Chrome, Firefox, Safari, Edge).
No seu terminal:
```bash
open index.html # no mac
xdg-open index.html # no linux
start index.html # no windows
```

### 2. Servidor Local (Recomendado)
Para evitar problemas de CORS com SVGs ou futuras requisições locais (como carregamento de fontes e imagens externas no futuro), recomenda-se rodar um servidor HTTP simples na pasta do projeto:

Com Python (versão 3+):
```bash
python3 -m http.server 3000
```
E acesse `http://localhost:3000` no seu navegador.

Com Node.js (via npx):
```bash
npx serve
```

## Como Usar a Interatividade

1. **Navegação (Pan e Zoom)**
   - **Zoom:** Utilize a roda do mouse (scroll) sobre o mapa, ou clique nos botões `+` e `-` localizados no canto inferior direito. O botão `⟲` restaura a visão original.
   - **Pan (Mover):** Clique e arraste o mapa com o botão esquerdo do mouse para explorar diferentes áreas.

2. **Filtros por Categoria**
   - Na barra lateral esquerda (ou no topo em dispositivos móveis), clique nos botões de filtro (Esportes, Lazer, Natureza, etc).
   - O mapa destacará apenas os elementos correspondentes à categoria selecionada, diminuindo a opacidade do restante.

3. **Visualização de Informações**
   - Clique em qualquer elemento colorido/ativo no mapa (torres, quadras, bosque, churrasqueiras, entradas, etc).
   - Um painel de informações se abrirá na barra lateral detalhando o local selecionado, sua categoria, descrição e uma curiosidade, além de um espaço preparado para exibição de fotografias reais.

## Arquitetura do Código
- `index.html`: Estrutura do layout da página, botões, barras laterais, painel de informações, e a definição do mapa interativo incorporado usando a tag `<svg>`.
- `styles.css`: Definições visuais, paleta de cores (Verde, tons naturais, azul), transições suaves e design responsivo, com adaptação do layout para dispositivos móveis.
- `main.js`: Lógica do pan/zoom do SVG, controle de estado dos filtros, gerenciamento da base de dados estática (JSON local) das localidades, e a interatividade dos cliques e exibição de informações.

## Observação Importante
Conforme requisitado no escopo, na falta de plantas arquitetônicas suficientemente detalhadas e levantamento planialtimétrico oficial acessível das referências originais, **o desenho do parque é uma representação ilustrativa aproximada**. Os equipamentos estão localizados baseados em referências visuais gerais do conceito arquitetônico divulgado na mídia (Ecomimesis). Um aviso fixo alerta o usuário sobre este caráter ilustrativo na interface principal.
