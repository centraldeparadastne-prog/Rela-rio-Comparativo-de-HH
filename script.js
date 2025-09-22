document.addEventListener("DOMContentLoaded", function() {
    // --- Configurações ---
    const baseUrl = "https://app.powerbi.com/view?r=eyJrIjoiMWViMDBkYTktNDA1MC00YzIxLWJkY2QtNTBiN2U2NDM4NGU3IiwidCI6IjNjYzQ2MDVjLWJlY2ItNGZhOC1iMmVjLTlhY2E2YzBmMjE5YSJ9";
    const printPageId = "0a22b9e9f0966a5ee76d"; // O ID INTERNO que você forneceu!

    // --- Elementos ---
    const reportContainer = document.getElementById('reportContainer' );
    const downloadButton = document.getElementById('downloadButton');

    // --- Lógica Principal ---
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');

    let embedUrl;

    // Se a URL do navegador tiver "?page=print", monte a URL do Power BI para a página específica
    if (pageParam === 'print') {
        embedUrl = `${baseUrl}&pageName=${printPageId}`;
        downloadButton.style.display = 'flex'; // Mostra o botão imediatamente
    } else {
        // Caso contrário, use a URL base (página inicial do relatório)
        embedUrl = baseUrl;
        downloadButton.style.display = 'none'; // Garante que o botão esteja oculto
    }

    // --- Configuração e Carregamento do Power BI ---
    const models = window['powerbi-client'].models;
    const config = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        embedUrl: embedUrl,
        settings: {
            panes: {
                filters: { visible: false },
                pageNavigation: { visible: true, position: models.PageNavigationPosition.Bottom }
            }
        }
    };

    // Carrega o relatório
    const report = powerbi.embed(reportContainer, config);

    // --- Ação de Download ---
    downloadButton.addEventListener('click', function() {
        const reportIframe = reportContainer.querySelector('iframe');
        if (reportIframe && window.html2canvas) {
            html2canvas(reportIframe, { useCORS: true, allowTaint: true, logging: true })
                .then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'captura-relatorio.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                })
                .catch(error => {
                    console.error("Erro na captura:", error);
                    alert("Ocorreu um erro ao gerar a imagem.");
                });
        }
    });
});


