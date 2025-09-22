document.addEventListener("DOMContentLoaded", function() {
    // --- Configurações do Relatório ---
    const embedUrl = "https://app.powerbi.com/view?r=eyJrIjoiMWViMDBkYTktNDA1MC00YzIxLWJkY2QtNTBiN2U2NDM4NGU3IiwidCI6IjNjYzQ2MDVjLWJlY2ItNGZhOC1iMmVjLTlhY2E2YzBmMjE5YSJ9";
    const targetPageName = "Print"; // O nome da página que ativa o botão

    // --- Elementos do DOM ---
    const reportContainer = document.getElementById("reportContainer" );
    const downloadButton = document.getElementById("downloadButton");

    // --- Configuração para embutir o relatório ---
    const models = window['powerbi-client'].models;
    const config = {
        type: 'report',
        tokenType: models.TokenType.Embed, // Para relatórios "Publicar na Web"
        accessToken: undefined, // Não é necessário para "Publicar na Web"
        embedUrl: embedUrl,
        settings: {
            panes: {
                filters: {
                    expanded: false,
                    visible: false
                },
                pageNavigation: {
                    visible: true // Mantém a navegação de páginas visível
                }
            }
        }
    };

    // --- Embutir o relatório no contêiner ---
    const report = powerbi.embed(reportContainer, config);

    // --- Lógica para o botão de Download ---

    // 1. Ouvir o evento 'pageChanged' para saber quando o usuário muda de página
    report.on('pageChanged', function(event) {
        const page = event.detail.newPage;
        console.log("Página alterada para:", page.displayName); // Log para depuração

        if (page.displayName === targetPageName) {
            downloadButton.style.display = 'flex'; // Mostra o botão
        } else {
            downloadButton.style.display = 'none'; // Esconde o botão
        }
    });

    // 2. Adicionar o evento de clique ao botão de download
    downloadButton.addEventListener('click', function() {
        console.log("Botão de download clicado. Capturando a tela...");
        
        // Usa a biblioteca html2canvas para "printar" a área do relatório
        html2canvas(reportContainer, {
            useCORS: true, // Necessário para capturar conteúdo de outro domínio (Power BI)
            allowTaint: true,
            onclone: (document) => {
                // Garante que o iframe do Power BI seja renderizado corretamente na captura
                const iframe = document.querySelector('iframe');
                if (iframe) {
                    iframe.style.height = '100%';
                    iframe.style.width = '100%';
                }
            }
        }).then(canvas => {
            // Cria um link temporário para iniciar o download da imagem
            const link = document.createElement('a');
            link.download = 'relatorio-comparativo-hh.png';
            link.href = canvas.toDataURL('image/png');
            link.click(); // Simula o clique no link para baixar a imagem
        }).catch(error => {
            console.error("Erro ao capturar a tela:", error);
            alert("Ocorreu um erro ao tentar gerar a imagem. Tente novamente.");
        });
    });

    // 3. Garante que o estado inicial do botão está correto após o relatório carregar
    report.on('rendered', async function() {
        try {
            const activePage = await report.getActivePage();
            console.log("Relatório renderizado. Página ativa:", activePage.displayName);
            if (activePage.displayName === targetPageName) {
                downloadButton.style.display = 'flex';
            } else {
                downloadButton.style.display = 'none';
            }
        } catch (error) {
            console.error("Erro ao obter a página ativa na renderização:", error);
        }
    });
});
