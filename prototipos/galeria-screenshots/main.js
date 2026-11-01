document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica do Modal de Imagem (Zoom)
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const captionText = document.getElementById("caption");
    const closeBtn = document.getElementsByClassName("close")[0];

    // Pega todas as imagens com a classe 'zoomable'
    const images = document.querySelectorAll('.zoomable');

    images.forEach(img => {
        img.addEventListener('click', function() {
            // Only open modal if the image actually loaded (not the placeholder)
            if (this.src.includes('via.placeholder.com')) return;

            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
        });
    });

    // Fechar modal no botão X
    closeBtn.onclick = function() {
        closeModal();
    }

    // Fechar modal clicando fora da imagem
    modal.onclick = function(e) {
        if (e.target !== modalImg) {
            closeModal();
        }
    }

    // Fechar modal com a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.style.display === "block") {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    // 2. Lógica para buscar a data da última atualização
    // Como a galeria não usa servidor, tentamos fazer um fetch num JSON local.
    // Isso vai funcionar se a pessoa abrir via Live Server ou http-server.
    // Se abrir o arquivo diretamente no navegador (file://), pode dar erro de CORS.
    const lastUpdateSpan = document.getElementById('last-update-time');

    fetch('last-update.json')
        .then(response => {
            if (!response.ok) throw new Error('File not found');
            return response.json();
        })
        .then(data => {
            const date = new Date(data.timestamp);
            lastUpdateSpan.textContent = date.toLocaleString('pt-BR');
        })
        .catch(err => {
            console.log('Não foi possível carregar a data localmente:', err);
            lastUpdateSpan.textContent = 'Data indisponível (abra via servidor local para ver)';
        });
});