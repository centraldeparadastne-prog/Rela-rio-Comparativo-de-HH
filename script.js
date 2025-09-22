document.addEventListener("DOMContentLoaded", function() {
    // --- Configurações do Relatório (Versão 3 - Simplificada e Corrigida) ---
    // Usando a URL de "view" diretamente, que é o método correto para "Publicar na Web".
    const embedUrl = "https://app.powerbi.com/view?r=eyJrIjoiMWViMDBkYTktNDA1MC00YzIxLWJkY2QtNTBiN2U2NDM4NGU3IiwidCI6IjNjYzQ2MDVjLWJlY2ItNGZhOC1iMmVjLTlhY2E2YzBmMjE5YSJ9";
    const targetPageName = "Print";

    // --- Elementos do DOM ---
    const reportContainer = document.getElementById("reportContainer" );
    const downloadButton = document.getElementById("downloadButton");

    // --- Configuração para embutir o relatório ---
    const models = window['powerbi-client'].models;
    const config = {
        type: 'report',
        // Para "Publicar na Web", o tokenType é Embed. Não precisamos de accessToken.
        tokenType: models.TokenType.Embed,
        embedUrl: embedUrl,
        settings: {
            panes: {
                filters: {
                    visible: false
                },
                // Garante que a navegação entre páginas do Power BI esteja visível na parte inferior.
                pageNavigation: {
                    visible: true,
                    position: models.PageNavigationPosition.Bottom
                }
            }
        }
    };

    // --- Embutir o relatório no contêiner ---
    const report = powerbi.embed(reportContainer, config);

    // --- Lógica para o botão de Download ---

    // 1. Ouvir o evento 'pageChanged'
    report.on('pageChanged', function(event) {
        const page = event.detail.newPage;
        console.log("Página alterada para:", page.displayName); // Log para depuração

        if (page.displayName === targetPageName) {
            downloadButton.style.display = 'flex';
        } else {
            downloadButton.style.display = 'none';
        }
    });

    // 2. Evento de clique no botão de download
    downloadButton.addEventListener('click', function() {
        console.log("Iniciando captura de tela...");
        
        // Seleciona o iframe dentro do reportContainer para a captura
        const reportIframe = reportContainer.querySelector('iframe');

        if (!reportIframe) {
            alert("Erro: O iframe do relatório não foi encontrado para a captura.");
            return;
        }

        html2canvas(reportIframe, {
            useCORS: true,
            allowTaint: true,
            logging: true // Ativa logs do html2canvas para ajudar a depurar
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'captura-relatorio.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(error => {
            console.error("Erro ao usar html2canvas:", error);
            alert("Ocorreu um erro ao tentar gerar a imagem. Verifique o console para mais detalhes.");
        });
    });

    // 3. Garante que o estado inicial do botão está correto após o relatório carregar
    report.on('rendered', async function() {
        try {
            // Verifica se o relatório realmente carregou antes de tentar obter a página
            if (report.iframe) {
                const pages = await report.getPages();
                if (pages.length > 0) {
                    const activePage = pages.find(p => p.isActive);
                    if (activePage && activePage.displayName === targetPageName) {
                        downloadButton.style.display = 'flex';
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao obter página ativa na renderização:", error);
        }
    });

    // 4. Adiciona um listener para erros de embed
    report.off("error"); // Limpa listeners de erro anteriores
    report.on("error", function(event) {
        console.error("Erro ao embutir o relatório do Power BI:", event.detail);
        alert("Não foi possível carregar o relatório do Power BI. Verifique se o link de publicação está correto e ativo.");
    });
});


