# ECOCITY — PROTÓTIPO PIXEL ART 2D (GÊMEO DIGITAL)

Módulo autônomo e interativo em Pixel Art 2D para simulação de cenários de resiliência urbana, emergências climáticas e gestão de crises no Rio de Janeiro.

---

## 1. Tecnologias Utilizadas
- **HTML5 Canvas & Rendering 2D:** Motor gráfico customizado para animação de sprites em tempo real.
- **CSS3 & Flexbox:** Estilização responsiva e design system adaptado para TV e controle mobile.
- **JavaScript (ES6+):** Lógica de simulação de cenários, motor de física simplificada, partículas de chuva/fumaça e sincronização via WebSockets.

## 2. Dependências Necessárias
- Navegador web moderno (Google Chrome, Microsoft Edge, Firefox ou Safari).
- Node.js (opcional, caso deseje executar via servidor local integrado na raiz do projeto).

## 3. Como Instalar as Dependências
Não são necessárias instalações complexas de bibliotecas externas para o protótipo. O projeto opera puramente no lado do cliente (Client-Side Canvas) com suporte a conexões de controle remoto.

Caso utilize o servidor geral da plataforma na raiz:
```bash
npm install
```

## 4. Como Iniciar o Projeto
Você pode iniciar o protótipo de duas maneiras:

### Método A: Servidor Local Geral da Plataforma
Na raiz do repositório, execute:
```bash
node server.js
```
Abra no navegador:
- **Tela Principal (TV / Monitor):** `http://localhost:3000/prototipos/pixel-art-2d/index.html`
- **Controle Remoto (Celular):** `http://localhost:3000/prototipos/pixel-art-2d/controle.html`

### Método B: Abertura Direta (Standalone)
Basta dar um duplo clique no arquivo `prototipos/pixel-art-2d/index.html` para abri-lo diretamente no navegador.

## 5. Endereço Local no Navegador
- `http://localhost:3000/prototipos/pixel-art-2d/index.html`

## 6. Como Encerrar o Servidor Local
Caso esteja rodando via terminal Node.js (`node server.js`), pressione:
- **`Ctrl + C`** no terminal.

## 7. Solução de Problemas Comuns (Troubleshooting)
- **Imagens ou texturas não carregam (Erro 404):** Certifique-se de que está acessando via servidor local (`http://localhost:3000/...`) em vez do protocolo `file://`, pois alguns navegadores bloqueiam requisições de assets locais (CORS).
- **Tela preta ao iniciar:** Verifique o Console do Desenvolvedor (`F12`) para confirmar se todos os scripts em `Cliente/`, `Cenários/` e `Interface/` foram carregados corretamente.

## 8. Armazenamento de Imagens e Sprites
- **Imagens e Fundos de Referência:** Armazenados na subpasta `Recursos visuais/` (`cidade-referencia-base.jpg`, `alerta-referencia.png`).
- **Sprites e Atlas:** Gerenciados através da pasta `Sprites/` e `Cliente/game-engine.js`.
