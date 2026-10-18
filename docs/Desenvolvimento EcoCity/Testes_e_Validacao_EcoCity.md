# Testes e Validação do EcoCity

Esse documento é pra registrar o que a gente testou na prática, os pepinos que encontramos e o que realmente resolvemos na introdução e na performance do EcoCity.

## 1. O Problema da Introdução (Vídeo engasgando)
A dor de cabeça mais recente foi a reprodução da introdução cinematográfica na primeira página. A regra era clara: a pessoa não pode pular o vídeo (`fundo.mp4`) de jeito nenhum.
Na primeira vez que o site abria com o cache vazio, o vídeo dava umas engasgadas graves lá pro meio, mas depois que carregava a segunda vez ficava tudo fluido.

### Diagnóstico Realizado
Para investigar, rodamos o comando no terminal com o pacote ffmpeg/ffprobe em cima do arquivo `fundo.mp4` para ver se era culpa de algum limite de FPS artificial ou problema no arquivo. O que descobrimos:
- O `fundo.mp4` é um vídeo grande, com quase 8.0MB, e um *bitrate* bem alto (cerca de 6.5 Mbps), gravado exatamente em constantes 24 quadros por segundo. Ou seja, o arquivo estava perfeito e o vídeo não tinha culpa.
- A causa dos engasgos foram duas:
  1. **Buffer Underrun (Falta de dados):** O site mandava o vídeo tocar com `autoPlay` no milissegundo zero. Como o arquivo era grande, o navegador tocava os primeiros segundos e depois congelava a imagem pra forçar o download do restante do vídeo.
  2. **Bloqueio de CPU:** Ao mesmo tempo que o vídeo estava tocando, o site tava tentando compilar os shaders e os prédios gigantes do *React Three Fiber* na placa de vídeo, pelo fundo da tela (mesmo escondido). Isso sequestrava o processador e "matava" a taxa de quadros do vídeo por uns milissegundos.

### Soluções Testadas e Validadas
- **Espera Ativa (`onCanPlayThrough`):** Removemos o `autoPlay`. Agora a gente monitora o carregamento. O vídeo só recebe o comando `.play()` quando o navegador confirmar que descarregou o suficiente pra tocar até o fim sem pausar. Se for cache vazio, ele mostra o primeiro quadro do vídeo com um loading super sutil. Testamos simulando conexões lentas (através de testes Playwright e *timeouts* locais), e o vídeo finalmente tocou contínuo da primeira à última cena.
- **Isolamento de Carregamento 3D:** Mudamos o código no `page.tsx` para garantir que o componente 3D (`<Scene />`) não exista de forma alguma durante os 10 segundos iniciais de introdução. Apenas quando o vídeo acaba é que a CPU é liberada pra renderizar a cidade. Os testes visuais comprovaram que essa mudança removeu 100% da travada do meio do vídeo.

## 2. Bloqueio da Introdução
Fizemos simulações no navegador testando cliques de mouse, toques (touchscreen) e teclado para tentar furar o vídeo.
- Usamos CSS (`pointer-events: none`) misturado com um *overlay* de bloqueio que "suga" todos os cliques com botão direito (`onContextMenu`) e arrastos (`onTouchStart`). Também tiramos a barra de rolagem usando `overflow: hidden` na tag body.
- Resultado: **Validado.** É impossível ignorar o vídeo. O botão "ENTRAR NO PROTÓTIPO" só spawna milissegundos após o final natural do vídeo, com uma transição de 1.5s feita no *Framer Motion*.

## 3. Otimização para 120Hz
O requisito era não limitar artificialmente o site a 60 FPS, pra que TVs de alta performance na feira de tecnologia consigam exibir animações a 120Hz.

- **Ações tomadas:** Adicionamos camadas estritas no CSS (`transform: translateZ(0)` e `will-change: opacity, transform`). Isso avisa pro navegador que quem deve lidar com a troca dos quadros de vídeo e das transições do React é a Placa de Vídeo (GPU), e não a thread principal do JavaScript.
- **Limitação dos nossos testes:** No ambiente de desenvolvimento (nossa "sandbox"), eu não tenho acesso a uma TV de 120Hz física ou um monitor com essa taxa pra gravar a tela e comprovar o pico de frames. Contudo, analisando as métricas, confirmamos que a trava que impedia a taxa de se soltar não existe mais. Pela arquitetura, o Three.js vai tentar desenhar os *frames* na velocidade nativa do aparelho conectado.
- É estritamente necessário testar isso no local com a TV conectada.

## 4. Resumo Geral de Testes
✅ **Carregamento de `fundo.mp4` autêntico:** Confirmado.
✅ **Bloqueio de usuário:** Confirmado.
✅ **Resolução do Engasgo na 1ª Execução:** Confirmado (testado isolando a montagem 3D e implementando buffering).
⚠️ **Desempenho Real em 120Hz:** Pronto no código, mas requer teste físico num display compatível.