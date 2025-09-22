// Aguarda o DOM estar pronto para garantir que o botão e o iframe existam.
document.addEventListener("DOMContentLoaded", function() {
    const downloadButton = document.getElementById('downloadButton');
    const reportIframe = document.getElementById('reportIframe');

    // Se os elementos não existirem, não faz nada.
    if (!downloadButton || !reportIframe) {
        console.error("Botão ou Iframe não encontrado.");
        return;
    }

    // Adiciona o evento de clique ao botão.
    downloadButton.addEventListener('click', function() {
        // Verifica se a biblioteca html2canvas foi carregada.
        if (window.html2canvas) {
            html2canvas(reportIframe, {
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'captura-relatorio.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(error => {
                console.error("Erro na captura:", error);
                alert("Ocorreu um erro ao gerar a imagem.");
            });
        } else {
            alert("Erro: A biblioteca de captura de tela não foi carregada.");
        }
    });
});




