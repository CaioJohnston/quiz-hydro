document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginDiv = document.getElementById('login');
    const homeDiv = document.getElementById('home');
    const loginError = document.getElementById('login-error');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullname = document.getElementById('fullname').value.trim();
            const employee_id = document.getElementById('employee_id').value.trim();
            const company = document.getElementById('company').value.trim();
            const job_title = document.getElementById('job_title').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (fullname && employee_id && company && job_title && phone) {
                const userData = {
                    fullname,
                    employee_id,
                    company,
                    job_title,
                    phone,
                    timestamp: new Date().toISOString()
                };

                localStorage.setItem('userData', JSON.stringify(userData));

                loginDiv.classList.add('hidden');
                homeDiv.classList.remove('hidden');
            } else {
                loginError.classList.remove('hidden');
            }
        });
    } else {
        console.error('Formulário de login não encontrado!');
    }

});