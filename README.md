# ECOCITY — PARQUE REALENGO 3D (PROJETO V.I.D.A.)

**Feira de Ciências • Projetec 2026**  
**Repositório Oficial:** [https://github.com/Bonato2010/Projetec-2026-](https://github.com/Bonato2010/Projetec-2026-)  
**Branch Ativa:** `develop`  

---

## 🌿 Sobre o Projeto

O **EcoCity (Projeto V.I.D.A.)** é um ecossistema tecnológico e pedagógico desenvolvido para a Feira de Ciências, tendo como estudo de caso central o **Parque Urbano de Realengo Jornalista Susana Naspolini** (Rio de Janeiro - RJ). O projeto integra sustentabilidade urbana, arquitetura bioclimática, simulações tridimensionais de alta fidelidade e gamificação educativa.

---

## 🚀 Arquitetura e Estrutura do Repositório

O repositório está organizado em módulos independentes e sinérgicos:

```text
Projetec-2026-/
├── apps / site / prototipos # Aplicações web, site institucional e 4 protótipos
├── parque-realengo-3d       # Gêmeo Digital 3D (React Three Fiber + Three.js)
├── docs                     # Documentação completa de arquitetura, protótipos e relatórios
├── screenshots              # Galeria visual e evidências de todas as telas
├── api & scripts            # Automações, scripts de sincronização e endpoints serverless
└── vercel.json              # Configuração de publicação oficial na Vercel
```

---

## 🎮 Aplicações e Protótipos Disponíveis

1. **Plataforma Web & Central Multitela (`site/`)**
   - Portal institucional e aplicativo de stand (TV + Mobile via WebSocket).
   - [Documentação do Site](docs/site/README.md)
2. **Módulo Quiz Gamificado (`site/js/quiz-engine.js`)**
   - Quiz pedagógico com radar de competências, ranking global e histórico.
   - [Documentação do Quiz](docs/quiz/README.md)
3. **Protótipo 01 — EcoCity 3D / Parque Realengo (`parque-realengo-3d/`)**
   - Gêmeo digital 3D com as 5 super-torres bioclimáticas, bacia de retenção PBR, complexo esportivo e missões.
4. **Protótipo 02 — Mapa Interativo 2D (`prototipos/01-mapa-parque/`)**
   - Sistema GIS e trilhas ecológicas.
5. **Protótipo 03 — Painel Ambiental (`prototipos/02-painel-ambiental/`)**
   - Monitoramento de microclima e comparativo antes/depois.
6. **Protótipo 04 — Simulador de Drenagem (`prototipos/03-simulador-drenagem/`)**
   - Simulação hidrológica de tempestades e retenção pluvial.

---

## 📚 Documentação e Relatórios

- [🗺️ Mapa do Projeto (Arquitetura)](docs/arquitetura/MAPA_DO_PROJETO.md)
- [📋 Catálogo de Protótipos](docs/prototipos/CATALOGO_DE_PROTOTIPOS.md)
- [📊 Relatório de Reorganização Completa](docs/relatorios/RELATORIO_REORGANIZACAO_COMPLETA.md)

---

## 🛠️ Como Executar o Projeto Localmente

### 1. Executar o Site e Central Multitela
```bash
npm start
# ou node server.js
```
Acesse `http://localhost:3000` (TV Stand) e `http://localhost:3000/controle` (Mobile).

### 2. Executar o Gêmeo Digital 3D (Desenvolvimento)
```bash
cd parque-realengo-3d
npm install
npm run dev
```

### 3. Compilar para Produção (Build)
```bash
npm run build
```
*(Constrói o protótipo 3D e sincroniza automaticamente com `site/parque3d/`)*

---

## 📄 Licença e Autoria
Desenvolvido pela **Equipe V.I.D.A.** para o **Projetec 2026**.
