// Aguarda o carregamento completo da janela, incluindo todos os scripts.
window.onload = function() {
    const targetPageName = "Print";

    const reportIframe = document.getElementById('reportIframe');
    const downloadButton = document.getElementById('downloadButton');

    // Verifica se os elementos essenciais existem
    if (!reportIframe || !downloadButton) {
        console.error("Elemento essencial (iframe ou botão) não encontrado.");
        return;
    }

    // Inicializa o controle do Power BI sobre o iframe existente
    const report = powerbi.get(reportIframe);

    // Se o relatório não for inicializado corretamente, ele não pode ser controlado.
    // Isso pode acontecer se o iframe não carregar.
    if (!report) {
        console.error("Não foi possível obter o controle do relatório do Power BI. O iframe carregou corretamente?");
        return;
    }

    // Função para verificar a página ativa e atualizar o botão
    const checkActivePage = async () => {
        try {
            const pages = await report.getPages();
            if (pages) {
                const activePage = pages.find(p => p.isActive);
                if (activePage && activePage.displayName === targetPageName) {
                    downloadButton.style.display = 'flex';
                } else {
                    downloadButton.style.display = 'none';
                }
            }
        } catch (error) {
            console.error("Erro ao verificar a página ativa:", error);
            // Se houver erro (ex: o relatório ainda não carregou), esconde o botão por segurança.
            downloadButton.style.display = 'none';
        }
    };

    // --- Event Listeners ---

    // 1. Quando o relatório terminar de renderizar, verifique a página.
    report.on('rendered', checkActivePage);

    // 2. Quando o usuário mudar de página, verifique novamente.
    report.on('pageChanged', checkActivePage);

    // 3. Ação de clique no botão de download
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

    // 4. Tratamento de erros do Power BI
    report.on("error", function(event) {
        console.error("Power BI Error:", event.detail);
    });
};

