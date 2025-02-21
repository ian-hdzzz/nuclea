const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const dashboard = document.getElementById('dashboard');
    const loginContainer = document.getElementById('login-container');
    const errorMessage = document.getElementById('error-message');

    // Credenciales válidas
    const validUser = 'NEXO@gmail.com';
    const validPassword = 'CreandoElMañana';

    // Manejar el evento de envío del formulario
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === validUser && password === validPassword) {
            // Desvanecer login y mostrar dashboard
            loginContainer.style.opacity = 0;
            setTimeout(() => {
                loginContainer.style.display = 'none';

                // Mostrar el dashboard con transición
                dashboard.classList.remove('hidden');
                dashboard.classList.add('visible');
            }, 1000); // Tiempo de transición
        } else {
            // Muestra el mensaje de error
            errorMessage.style.display = 'block';
        }
    });
});
