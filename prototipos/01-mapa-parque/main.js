/**
 * Dados de Informações dos Elementos do Parque
 * Como fotos reais não puderam ser carregadas das referências, utilizamos placeholders,
 * mas a estrutura está pronta para URLs de imagens reais.
 */
const parkData = {
    'entrada-principal': {
        title: 'Entrada Principal',
        category: 'Infraestrutura',
        categoryClass: 'cat-infra',
        description: 'Acesso principal ao Parque Realengo Susana Naspolini, projetado para receber os visitantes de forma acessível e acolhedora.',
        curiosity: 'O parque homenageia a jornalista Susana Naspolini, conhecida por seu jornalismo comunitário carismático no Rio de Janeiro.'
    },
    'entrada-secundaria': {
        title: 'Entrada Secundária',
        category: 'Infraestrutura',
        categoryClass: 'cat-infra',
        description: 'Acesso alternativo integrado às ruas adjacentes do bairro, facilitando a mobilidade dos moradores locais.',
        curiosity: 'Projetada para diluir o fluxo de entrada em dias de grandes eventos no parque.'
    },
    'bosque': {
        title: 'Bosque e Jardins',
        category: 'Natureza',
        categoryClass: 'cat-natureza',
        description: 'Extensas áreas verdes arborizadas que oferecem sombra, melhoria no microclima local e espaço para descanso na grama.',
        curiosity: 'O projeto paisagístico (ecomimesis) focou no plantio de espécies nativas da Mata Atlântica para atrair a fauna local.'
    },
    'espelho-agua': {
        title: "Espelho d'Água",
        category: 'Água',
        categoryClass: 'cat-agua',
        description: 'Elementos aquáticos decorativos que refrescam o ambiente e trazem um aspecto cênico e contemplativo ao parque.',
        curiosity: 'Ajudam a reduzir a temperatura do ar no entorno, combatendo ilhas de calor comuns na região de Realengo.'
    },
    'area-aquatica': {
        title: 'Área Aquática / Fontes',
        category: 'Água',
        categoryClass: 'cat-agua',
        description: 'Espaço interativo com jatos de água projetado especialmente para a recreação infantil nos dias quentes de verão carioca.',
        curiosity: 'A água utilizada nesses sistemas interativos passa por processos contínuos de filtragem e reuso sustentável.'
    },
    'campo-futebol': {
        title: 'Campo de Futebol',
        category: 'Esporte',
        categoryClass: 'cat-esporte',
        description: 'Campo de grama sintética de alta qualidade para partidas amadoras e projetos sociais de esporte.',
        curiosity: 'Equipado com iluminação LED para permitir jogos noturnos em segurança.'
    },
    'quadras': {
        title: 'Quadras Poliesportivas',
        category: 'Esporte',
        categoryClass: 'cat-esporte',
        description: 'Espaços demarcados para a prática de basquete, vôlei, futsal e handebol, abertos à comunidade.',
        curiosity: 'As cores vibrantes do piso não são apenas estéticas; elas ajudam a refletir a luz solar, diminuindo o aquecimento da superfície.'
    },
    'skatepark': {
        title: 'Skatepark',
        category: 'Esporte',
        categoryClass: 'cat-esporte',
        description: 'Pista de skate com obstáculos, rampas e bowls projetada tanto para iniciantes quanto para skatistas experientes.',
        curiosity: 'Desenhada com consultoria de praticantes locais para garantir o fluxo ideal (flow) das manobras.'
    },
    'playground': {
        title: 'Playground Infantil',
        category: 'Lazer',
        categoryClass: 'cat-lazer',
        description: 'Área segura com piso emborrachado e brinquedos modernos que estimulam a coordenação motora e a criatividade das crianças.',
        curiosity: 'O piso especial amortece quedas e é permeável, evitando poças após as chuvas.'
    },
    'churrasqueiras': {
        title: 'Quiosques e Churrasqueiras',
        category: 'Lazer',
        categoryClass: 'cat-lazer',
        description: 'Estruturas cobertas com mesas e grelhas, ideais para piqueniques e confraternizações familiares aos finais de semana.',
        curiosity: 'Estrategicamente posicionadas longe das áreas esportivas para proporcionar um ambiente mais calmo e familiar.'
    },
    'nave-conhecimento': {
        title: 'Nave do Conhecimento',
        category: 'Cultura & Educação',
        categoryClass: 'cat-cultura',
        description: 'Equipamento público de inclusão digital que oferece cursos de tecnologia, acesso à internet e atividades inovadoras para os jovens.',
        curiosity: 'A arquitetura futurista da Nave se destaca na paisagem, sendo um marco visual do investimento em educação no local.'
    },
    'anfiteatro': {
        title: 'Anfiteatro',
        category: 'Cultura & Educação',
        categoryClass: 'cat-cultura',
        description: 'Espaço ao ar livre em formato de arquibancada para apresentações teatrais, musicais e reuniões comunitárias.',
        curiosity: 'Sua forma semicircular aproveita a acústica natural, permitindo que a voz do palco seja projetada até os últimos degraus.'
    },
    'passarelas': {
        title: 'Passarelas Elevadas',
        category: 'Infraestrutura',
        categoryClass: 'cat-infra',
        description: 'Caminhos suspensos que conectam as torres, oferecendo uma vista panorâmica incrível de todo o parque.',
        curiosity: 'Permitem que os visitantes caminhem na altura da copa das árvores, uma experiência única de imersão na natureza.'
    },
    'torres': {
        title: 'Torres Metálicas',
        category: 'Infraestrutura',
        categoryClass: 'cat-infra',
        description: 'Cinco grandes estruturas verticais que servem como mirantes e pontos de referência visual no parque.',
        curiosity: 'Além da função de mirante, as torres são parte essencial da identidade arquitetônica do projeto original do parque.'
    },
    'caminhos': {
        title: 'Caminhos e Acessos',
        category: 'Infraestrutura',
        categoryClass: 'cat-infra',
        description: 'Rede de circulação pavimentada que conecta todos os equipamentos do parque, garantindo acessibilidade universal (cadeirantes, carrinhos de bebê).',
        curiosity: 'O traçado sinuoso foi desenhado para convidar o pedestre a desacelerar e passear contemplando a paisagem.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mapWrapper = document.getElementById('map-wrapper');
    const mapContainer = document.querySelector('.map-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mapElements = document.querySelectorAll('.map-element');
    const infoPanel = document.getElementById('info-panel');
    const closeInfoBtn = document.getElementById('close-info');

    // Zoom & Pan State
    let scale = 1;
    let isDragging = false;
    let startX, startY;
    let translateX = 0;
    let translateY = 0;
    const ZOOM_SPEED = 0.1;
    const MAX_ZOOM = 4;
    const MIN_ZOOM = 0.5;

    // --- ZOOM E PAN LÓGICA ---

    function applyTransform() {
        mapWrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // Botões de Zoom
    document.getElementById('zoom-in').addEventListener('click', () => {
        scale = Math.min(scale + ZOOM_SPEED + 0.1, MAX_ZOOM);
        applyTransform();
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        scale = Math.max(scale - ZOOM_SPEED - 0.1, MIN_ZOOM);
        applyTransform();
    });

    document.getElementById('zoom-reset').addEventListener('click', () => {
        scale = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
    });

    // Zoom via Mouse Wheel
    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM_SPEED : ZOOM_SPEED;
        scale = Math.min(Math.max(scale + delta, MIN_ZOOM), MAX_ZOOM);
        applyTransform();
    }, { passive: false });

    // Pan via Mouse Drag
    mapContainer.addEventListener('mousedown', (e) => {
        // Ignora cliques nos controles
        if (e.target.closest('.map-controls') || e.target.closest('.map-element')) return;

        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        mapContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        applyTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        mapContainer.style.cursor = 'grab';
    });

    // --- FILTROS ---

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            // Dim/Highlight map elements
            mapElements.forEach(el => {
                if (category === 'all' || el.getAttribute('data-category') === category) {
                    el.classList.remove('dimmed');
                } else {
                    el.classList.add('dimmed');
                }
            });

            // Close info panel when filtering
            closeInfo();
        });
    });

    // --- INTERAÇÃO COM ELEMENTOS DO MAPA ---

    function closeInfo() {
        infoPanel.classList.add('hidden');
        mapElements.forEach(el => el.classList.remove('active'));
    }

    closeInfoBtn.addEventListener('click', closeInfo);

    mapElements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation(); // Previne drag acidental

            // Highlight selected element
            mapElements.forEach(elem => elem.classList.remove('active'));
            el.classList.add('active');

            const id = el.getAttribute('data-id');
            const data = parkData[id];

            if (data) {
                // Populate info panel
                document.getElementById('info-title').textContent = data.title;

                const catBadge = document.getElementById('info-category');
                catBadge.textContent = data.category;

                document.getElementById('info-description').textContent = data.description;
                document.getElementById('info-curiosity-text').textContent = data.curiosity;

                // Handle Image Placeholder vs Real Image
                // In a real scenario, data.imageUrl would exist
                const imgEl = document.getElementById('info-image');
                const placeholderEl = document.getElementById('info-image-placeholder');

                if (data.imageUrl) {
                    imgEl.src = data.imageUrl;
                    imgEl.classList.remove('hidden');
                    placeholderEl.classList.add('hidden');
                } else {
                    imgEl.src = '';
                    imgEl.classList.add('hidden');
                    placeholderEl.classList.remove('hidden');
                }

                // Show panel
                infoPanel.classList.remove('hidden');
            }
        });
    });
});
