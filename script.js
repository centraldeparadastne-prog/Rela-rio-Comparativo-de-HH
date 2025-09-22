document.addEventListener("DOMContentLoaded", function() {
    // --- Configurações Corrigidas do Relatório ---
    // A URL que você forneceu: "https://app.powerbi.com/view?r=eyJrIjoiMWViMDBkYTktNDA1MC00YzIxLWJkY2QtNTBiN2U2NDM4NGU3IiwidCI6IjNjYzQ2MDVjLWJlY2ItNGZhOC1iMmVjLTlhY2E2YzBmMjE5YSJ9"
    // A API JavaScript funciona melhor com o ID do relatório e o ID do grupo (workspace ) separados.
    // Essas informações estão codificadas na URL acima.
    
    const embedUrl = "https://app.powerbi.com/reportEmbed"; // URL base correta para a API
    const reportId = "1eb00da9-4050-4c21-bdcd-50b7e64384e7"; // Extraído da sua URL
    const groupId = "3cc4605c-becb-4fa8-b2ec-9aca6c0f219a"; // Extraído da sua URL
    const targetPageName = "Print";

    // --- Elementos do DOM ---
    const reportContainer = document.getElementById("reportContainer" );
    const downloadButton = document.getElementById("downloadButton");

    // --- Configuração para embutir o relatório ---
    const models = window['powerbi-client'].models;
    const config = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        embedUrl: embedUrl,
        id: reportId,
        groupId: groupId,
        permissions: models.Permissions.All, // Permissões para interagir
        settings: {
            panes: {
                filters: { visible: false },
                pageNavigation: { visible: true, position: models.PageNavigationPosition.Bottom }
            }
        }
    };

    // --- Embutir o relatório ---
    const report = powerbi.embed(reportContainer, config);

    // --- Lógica do Botão (mesma lógica de antes, mas agora deve funcionar) ---
    report.on('pageChanged', function(event) {
        const page = event.detail.newPage;
        if (page.displayName === targetPageName) {
            downloadButton.style.display = 'flex';
        } else {
            downloadButton.style.display = 'none';
        }
    });

    downloadButton.addEventListener('click', function() {
        html2canvas(document.querySelector("#reportContainer iframe"), { // Captura diretamente o iframe
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'captura-relatorio.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(error => {
            console.error("Erro ao capturar a tela:", error);
            alert("Ocorreu um erro ao tentar gerar a imagem.");
        });
    });

    report.on('rendered', async function() {
        try {
            const activePage = await report.getActivePage();
            if (activePage.displayName === targetPageName) {
                downloadButton.style.display = 'flex';
            }
        } catch (error) {
            console.error("Erro ao verificar página ativa:", error);
        }
    });
});

