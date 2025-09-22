// Aguarda o carregamento completo da janela, incluindo todos os scripts.
window.onload = function() {
    // DEIXE ESTA LINHA COMO ESTÁ POR ENQUANTO. VAMOS AJUSTAR DEPOIS.
    const targetPageName = "Print"; 

    const reportIframe = document.getElementById('reportIframe');
    const downloadButton = document.getElementById('downloadButton');

    if (!reportIframe || !downloadButton) {
        console.error("Elemento essencial (iframe ou botão) não encontrado.");
        return;
    }

    const report = powerbi.get(reportIframe);

    if (!report) {
        console.error("Não foi possível obter o controle do relatório do Power BI.");
        return;
    }

    const checkActivePage = async (page) => {
        // Se a função for chamada sem um objeto 'page', busca a página ativa.
        let currentPage = page;
        if (!currentPage) {
            try {
                const pages = await report.getPages();
                currentPage = pages.find(p => p.isActive);
            } catch (error) {
                console.error("Erro ao buscar páginas:", error);
                return; // Sai da função se não conseguir buscar as páginas
            }
        }

        if (currentPage) {
            // !!! PONTO DE DEBURAÇÃO !!!
            // Este alerta vai mostrar o nome exato da página atual.
            alert("Você está na página: '" + currentPage.displayName + "'");

            if (currentPage.displayName === targetPageName) {
                downloadButton.style.display = 'flex';
            } else {
                downloadButton.style.display = 'none';
            }
        }
    };

    // --- Event Listeners ---

    // Quando o relatório terminar de renderizar, chama a função para a página inicial.
    report.on('rendered', () => checkActivePage());

    // Quando o usuário mudar de página, o objeto 'page' é passado pelo evento.
    report.on('pageChanged', (event) => checkActivePage(event.detail.newPage));

    // Ação de clique no botão de download (sem alterações)
    downloadButton.addEventListener('click', function() {
        console.log("Botão de download clicado.");
        if (window.html2canvas) {
            html2canvas(reportIframe, {
                logging: true,
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'captura-relatorio.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(error => {
                console.error("Erro na captura com html2canvas:", error);
                alert("Ocorreu um erro ao gerar a imagem.");
            });
        } else {
            alert("A biblioteca de captura de tela não foi carregada.");
        }
    });

    report.on("error", function(event) {
        console.error("Power BI Error:", event.detail);
    });
};

