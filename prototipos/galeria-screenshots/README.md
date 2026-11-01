# Galeria Automática de Screenshots

Esta central visual permite acompanhar o desenvolvimento dos protótipos através de screenshots reais, capturados automaticamente pelo Playwright.

## Como Visualizar

Acesse o arquivo `index.html` nesta mesma pasta.
Você pode abrir o arquivo diretamente no navegador ou usar um servidor local simples (recomendado para carregar o arquivo de timestamp local `last-update.json`).

## Como Atualizar as Imagens

Se você fez alterações nos protótipos (por exemplo, no Mapa do Parque) e deseja atualizar a galeria com imagens frescas, siga os passos abaixo:

1. Certifique-se de estar na raiz do repositório no seu terminal.
2. Certifique-se de que as dependências do Playwright estão instaladas no ambiente:
   ```bash
   npm install -D playwright
   ```
3. Execute o script de captura:
   ```bash
   node prototipos/galeria-screenshots/capture.mjs
   ```

### O que o script faz?
- Ele inicia um servidor local automático temporário para o protótipo.
- Abre um navegador invisível (Headless).
- Espera a renderização completa.
- Simula interações (como cliques em filtros e no SVG).
- Tira fotos na resolução Desktop (1440x900) e Mobile (390x844).
- Salva os arquivos PNG na pasta correta `screenshots/mapa-parque/`.
- Salva o horário atual em `last-update.json`.
- Encerra o servidor.

## Projetos Pendentes
As seções do "Painel Ambiental" e do "Simulador de Drenagem" já estão estruturadas no HTML da galeria, mas aparecem como "Em Desenvolvimento". O script `capture.mjs` está preparado para ignorar pastas não encontradas, evitando erros. Quando esses projetos existirem, bastará atualizar o script `capture.mjs` para apontar para eles e tirar os screenshots.