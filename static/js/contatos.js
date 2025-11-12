document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('botao-enviar');
    const popup = document.getElementById('popup-sucesso');

    button.addEventListener('click', (event) => {
        event.preventDefault(); // impede o envio real do formulário

        // Exibe o pop-up
        popup.style.display = 'flex';

        // Após 3 segundos, redireciona para a página inicial
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    });
});
