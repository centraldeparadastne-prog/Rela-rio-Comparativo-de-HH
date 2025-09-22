document.addEventListener("DOMContentLoaded", function() {
    const reportContainer = document.getElementById('reportContainer');
    const debugText = document.getElementById('debug-text');

    // Função para escrever no nosso "terminal" de diagnóstico
    function log(message) {
        console.log(message); // Mantém no console do navegador também
        debugText.textContent += message + '\n';
    }

    log("Script iniciado. Configurando o relatório...");

    const embedUrl = "https://app.powerbi.com/view?r=eyJrIjoiMWViMDBkYTktNDA1MC00YzIxLWJkY2QtNTBiN2U2NDM4NGU3IiwidCI6IjNjYzQ2MDVjLWJlY2ItNGZhOC1iMmVjLTlhY2E2YzBmMjE5YSJ9";

    const models = window['powerbi-client'].models;
    const config = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        embedUrl: embedUrl,
        settings: {
            panes: {
                pageNavigation: { visible: true, position: models.PageNavigationPosition.Bottom }
            }
        }
    };

    // Carrega o relatório
    const report = powerbi.embed(reportContainer, config );

    // Adiciona um listener para o evento 'error'
    report.on("error", function(event) {
        log("--- ERRO NO POWER BI ---");
        log(JSON.stringify(event.detail, null, 2));
    });

    // Adiciona um listener para o evento 'rendered' (quando o relatório termina de carregar)
    report.on("rendered", async function() {
        log("Relatório 'rendered' (carregado). Tentando obter a lista de páginas...");

        try {
            // A função getPages() é a chave. Ela retorna um array com todas as páginas.
            const pages = await report.getPages();

            if (pages && pages.length > 0) {
                log("--- SUCESSO! PÁGINAS ENCONTRADAS ---");
                
                // Itera sobre cada página encontrada e imprime suas propriedades
                pages.forEach(page => {
                    log("-------------------------");
                    log(`Nome de Exibição: ${page.displayName}`);
                    log(`ID Interno (name): ${page.name}`); // Este é o ID que usamos com &pageName=
                });

                log("-------------------------");
                log("\nInstrução: Copie o 'ID Interno (name)' da página que você deseja ('Print') e me envie.");

            } else {
                log("--- AVISO: Nenhuma página foi retornada pela API. ---");
            }
        } catch (error) {
            log("--- ERRO ao tentar executar report.getPages() ---");
            log(error.toString());
        }
    });
});



