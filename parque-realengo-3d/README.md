# Parque Realengo Jornalista Susana Naspolini — Digital Twin 3D

Reconstrução 3D de alta fidelidade do **Parque Realengo Jornalista Susana Naspolini** (Realengo, Zona Oeste do Rio de Janeiro), desenvolvida **diretamente em código**:
React + TypeScript + Vite + Three.js + React Three Fiber + Drei, com física PBR, navegação por grafos (Dijkstra) e simulação de microclima. Sem Blender e sem modelos externos pesados.

---

## 🏛️ Dados Reais e Referências Autênticas

A versão atual foi completamente calibrada com dados cadastrais e projetos executivos reais:

1. **Perímetro Real Georreferenciado (OSM Way 681694032):**
   - 25 vértices cadastrais levantados no OpenStreetMap cobrindo exatamente **78.129 m²** de área real.
   - Origem georreferenciada: `lat: -22.8825085, lon: -43.4330630`.
   - 3 acessos calibrados sobre o contorno:
     * **E1 (Norte):** Rua Prof. Carlos Wenceslau
     * **E2 (Sul):** Praça do Mercado / Rua Marechal Modestino / Rua Bernardo de Vasconcelos
     * **E3 (Oeste):** IFRJ / Rua General Sezefredo

2. **As 5 Super-Torres e Microclima (Ecomimesis / Prefeitura do Rio):**
   - Alturas oficiais: **17m, 26m, 47m, 26m e 17m**.
   - 236 bicos aspersores de água atomizada gerando microclimatização suave que reduz a sensação térmica em até 5 °C.
   - Passarelas elevadas panorâmicas com inclinações acessíveis strictly **≤ 8,0%** (todas testadas e verificadas).

3. **Praça do Mercado (Messina | Rivas, Ayako e Helena Meirelles):**
   - Edificação com marquise linear em "L", 11 módulos de lojas comerciais, esplanada em pedra portuguesa e bancos.

4. **Nave do Conhecimento:**
   - Pavilhão tecnológico comunitário de ~830 m² com cobertura inclinada, brises de proteção solar e laboratórios maker.

5. **Infraestrutura de Esportes e Lazer:**
   - **Skatepark:** dois bowls interconectados de transição contínua com coping tubular, quarter-pipe, spine e área de street.
   - **Campo Society:** grama sintética padrão FIFA, alambrado e 4 torres de iluminação LED.
   - **Complexo Poliesportivo:** 2 quadras poliesportivas com marcações oficiais (futsal e basquete com tabelas de vidro e aros com rede) + 2 quadras de areia para vôlei de praia e futevôlei com rede e antenas.
   - **Área Infantil:** playground emborrachado com balanços, escorregadores, domo geodésico e **Splash Pad** (área molhada interativa com jatos d'água verticais).
   - **Espaço Convivência:** 3 quiosques cobertos com churrasqueiras, pias e mesas de madeira de reflorestamento.
   - **Anfiteatro Susana Naspolini:** concha acústica e arquibancadas em semicírculo para eventos e cinema ao ar livre.

6. **Bioma Mata Atlântica e Paisagismo Nativo:**
   - 6 arquétipos de árvores nativas: Ipê-Amarelo (*Handroanthus chrysotrichus*), Ipê-Roxo (*Handroanthus heptaphyllus*), Pau-Brasil (*Paubrasilia echinata*), Jacarandá-Mimoso (*Jacaranda mimosifolia*), Oiti (*Licania tomentosa*) e Palmeira Imperial (*Roystonea oleracea*).
   - Arbustos tropicais: Clúsias, Helicônias floridas e Guaimbês.
   - Mais de 550 árvores e 680 arbustos posicionados proceduralmente com respeitabilidade a distâncias mínimas e zonas de exclusão.

---

## ⚡ Comandos e Verificações

```bash
# Servidor de desenvolvimento
npm run dev

# Compilar para produção (Vite + TypeScript)
npm run build

# Executar a bateria de 314 verificações automatizadas
npm run verify

# Atualizar inventário de referências
npm run inventory

# Gerar mapa vetorial 2D
npm run plan
```

### Resumo dos Testes de Integridade (`npm run verify`):
- **314 de 314 verificações passam (100% de sucesso)**
- Perímetro cadastral: 78.129 m²
- 25 pegadas de equipamentos dentro do parque e sem nenhuma sobreposição
- Alturas das torres: {17, 17, 26, 26, 47} m e 236 bicos aspersores
- Inclinação de todas as rampas e passarelas acessíveis (≤ 8,0%)
- Grafo de navegação (Dijkstra): 93 nós, 97 arestas, zero cruzamentos com obstáculos
- Zero NaNs em todas as malhas geradas proceduralmente

---

## 🎮 Integração com o Projeto V.I.D.A.

O gêmeo digital 3D pode ser acessado diretamente através da rota `/parque3d` no servidor do stand (`server.js`).
