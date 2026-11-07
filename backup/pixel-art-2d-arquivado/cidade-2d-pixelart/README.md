# CIDADE 2D EM PIXEL ART — RIO DE JANEIRO (PROJETEC 2026)
**Módulo Exclusivo Antigravity**

Uma recriação panorâmica viva, detalhada e autêntica de uma cidade carioca (com identidade marcante da Zona Oeste e do subúrbio do Rio) em Pixel Art nativo de alta resolução.

---

## 1. Identidade Carioca & Elementos Urbanos Criados

- **Arquitetura Típica:**
  - **Boteco do Realengo:** Toldo listrado verde e branco, estufa de salgados iluminada (coxinhas e pastéis), engradados amarelos de cerveja empilhados na calçada, azulejos verdes de botequim e mesas externas.
  - **Padaria "Pão Quente":** Vitrine de pão francês, floreiras e toldo curvo vinho e dourado.
  - **Clínica da Família (SMS-RJ / Prefeitura do Rio):** Fachada oficial branca e azul marinho, rampa de acessibilidade com corrimão amarelo, janelas com persianas e ambulância do SAMU 192 na baía.
  - **Casas Brasileiras e Sobrados de Laje:** Alvenaria de tijolo aparente sem reboco, varal com roupas (incluindo camiseta do Flamengo e bermuda jeans), caixa d'água azul de polietileno (Fortlev) no topo, portões de grade de ferro e samambaias penduradas.
  - **Abrigos de Ônibus Oficiais da PCRJ:** Cobertura arqueada azul, placa com itinerários reais de Realengo (391, 745, 926) e painel informativo.
  - **Rede Elétrica e Postes:** Postes de concreto circulares, transformadores com aletas de resfriamento, cruzetas de alta tensão, emaranhado realista de fios catenários e lixeiras laranjas clássicas da Comlurb.
  - **Vegetação Urbana:** Amendoeiras frondosas com folhas avermelhadas, Flamboyants floridos em vermelho vivo e Palmeiras Imperiais esguias.

- **Planos de Fundo Parallax:**
  - **Céu Dinâmico:** Ciclo completo (Amanhecer, Dia Ensolarado, Entardecer Dourado, Noite Estrelada).
  - **Montanhas da Zona Oeste:** Silhuetas do Maciço da Pedra Branca e da Serra do Gericinó com névoa atmosférica.
  - **O Morro / Favela Carioca:** Encosta com vegetação nativa da Mata Atlântica e centenas de casinhas sobrepostas com lajes, caixas d'água azuis, antenas espinha de peixe e pipas no céu com rabiolas ondulantes.

- **Veículos Dinâmicos:**
  - Ônibus Urbano Carioca (letreiro digital LED "REALENGO VIA BANGU", passageiros visíveis e escapamento).
  - Táxi Amarelinho do Rio de Janeiro (com a clássica faixa azul horizontal).
  - Fiat Uno da Firma com Escada de alumínio no teto.
  - Motoboy de aplicativo com mochila térmica vermelha (estilo iFood).
  - Viatura da Polícia Militar (PMERJ) com giroflex estroboscópico azul e vermelho.

- **Pedestres e Vida Urbana (Ciclos de Caminhada):**
  - Gari da Comlurb com o icônico uniforme laranja fluorescente e vassoura de piaçava.
  - Morador carioca de bermuda estampada e chinelo de dedo passeando com o vira-lata caramelo.
  - Estudante com a camisa branca e a faixa azul marinho da rede municipal do Rio.
  - Enfermeira de jaleco branco saindo da Clínica da Família.
  - Moradores com guarda-chuva no modo tempestade.

---

## 2. As 5 Simulações e Ocorrências Urbanas (Exigência 4 do Prompt)

O cenário foi projetado para simulações progressivas com alterações no próprio ambiente:

1. **☀️ Rotina (Cidade Viva):** Comércio aberto, circulação fluida de pedestres e veículos, céu limpo.
2. **🌧️ Inundação & Temporal:** Chuva densa de 280+ partículas, relâmpagos procedurais, bueiros da Rio-Águas transbordando, nível da água subindo progressivamente no asfalto com reflexos e marolas, veículos com pisca-alerta ligado e pedestres com guarda-chuva.
3. **🚨 Emergência Urbana & Interdição:** Sirenes policiais via Web Audio API, viatura policial avançando em alta velocidade, pedestres correndo e via interditada.
4. **⚡ Blecaute Elétrico:** Curto-circuito com faíscas azuis no transformador do poste, postes de luz e janelas apagando em cascata, e apenas faróis de carros e luzes de emergência iluminando a escuridão.
5. **🔥 Onda de Calor Extrema (42°C):** Distorção senoidal de calor atmosférico (*heat haze*) sobre o asfalto, sol escaldante no zênite e tom âmbar da Zona Oeste.

---

## 3. Como Executar

### Opção 1: Direto pelo Navegador (Sem servidor)
Dê **dois cliques** no arquivo:
```
cidade-2d-pixelart/index.html
```

### Opção 2: Pelo Servidor Node.js do Projeto
1. No terminal:
   ```bash
   node server.js
   ```
2. No navegador, acesse:
   👉 **`http://localhost:3000/cidade2d`** *(ou `http://localhost:3000/pixelart`)*

---

## 4. Atalhos de Teclado (Para Apresentação na Televisão / Stand)

| Tecla | Função |
| :---: | :--- |
| **`[1]`** | Ativar Modo Rotina / Normal |
| **`[2]`** | Ativar Modo Temporal & Inundação |
| **`[3]`** | Ativar Modo Emergência & Interdição |
| **`[4]`** | Ativar Modo Blecaute no Transformador |
| **`[5]`** | Ativar Modo Onda de Calor Extrema (42°C) |
| **`[C]`** | Alternar Câmera Auto-Tour (Passeio Contínuo de TV) |
| **`[M]`** | Ligar/Desligar Áudio Ambiental Sintetizado |
| **`[H]`** | Ocultar/Exibir Painel HUD para exibição limpa em tela cheia |
| **`[A] / [D]`** ou **`[←] / [→]`** | Navegar manualmente pela cidade |
| **Arrastar com Mouse/Touch** | Rolagem livre pelo panorama de 3840px |
