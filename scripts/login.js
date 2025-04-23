document.addEventListener('DOMContentLoaded', function () {
  const checkMatriculaDiv = document.getElementById('check-matricula');
  const loginDiv = document.getElementById('login');
  const homeDiv = document.getElementById('home');

  const btnNewUser = document.getElementById('btn-new-user');
  const btnBack = document.getElementById('btn-back');

  const checkEmployeeId = document.getElementById('check-employee-id');
  const employeeId = document.getElementById('employee_id');
  const checkError = document.getElementById('check-error');
  const checkLoading = document.getElementById('check-loading');
  const loginError = document.getElementById('login-error');
  const phoneInput = document.getElementById('phone');
  const textInputs = document.querySelectorAll('input[type="text"]');
  const isLoginVisible = !loginDiv.classList.contains('hidden');

  function adjustLogoPosition(isLoginVisible) {
    const logoContainer = document.getElementById('logo-container');
    const logoFooter = document.getElementById('logo-footer');

    if (isLoginVisible) {
      logoContainer.style.display = 'none';

      logoFooter.style.display = 'flex';
    } else {
      logoContainer.style.display = 'flex';
      logoContainer.style.position = 'absolute';
      logoContainer.style.top = '100px';

      logoFooter.style.display = 'none';
    }
  }

  function capitalizeWords(text) {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  textInputs.forEach(input => {
    input.addEventListener('input', function (e) {
      const cursorPosition = e.target.selectionStart;
      const originalValue = e.target.value;
      const capitalizedValue = capitalizeWords(originalValue);

      if (originalValue.length === capitalizedValue.length) {
        e.target.value = capitalizedValue;
        e.target.setSelectionRange(cursorPosition, cursorPosition);
      }
    });

    input.addEventListener('blur', function (e) {
      e.target.value = capitalizeWords(e.target.value);
    });
  });

  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let value = e.target.value;
      value = value.replace(/\D/g, '');

      if (value.length <= 10) {
        if (value.length > 2) {
          value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        }
        if (value.length > 9) {
          value = `${value.substring(0, 9)}-${value.substring(9)}`;
        }
      } else {
        value = `(${value.substring(0, 2)}) ${value.substring(2, 3)}${value.substring(3)}`;
        if (value.length > 13) {
          value = `${value.substring(0, 10)}-${value.substring(10, 14)}`;
        }
      }

      e.target.value = value;
      phoneInput.setAttribute('pattern', '\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}');
    });
  }

  checkEmployeeId.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      verificarMatricula();
    }
  });

  checkEmployeeId.addEventListener('blur', function () {
    const matricula = checkEmployeeId.value.trim();
    if (matricula) {
      verificarMatricula();
    }
  });

  async function verificarMatricula() {
    const matricula = checkEmployeeId.value.trim();

    if (!matricula) {
      checkError.innerText = 'Por favor, digite sua matrícula';
      checkError.classList.remove('hidden');
      return;
    }

    checkError.classList.add('hidden');
    checkLoading.classList.remove('hidden');

    try {
      const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isLocalhost) {
        setTimeout(() => {
          checkLoading.classList.add('hidden');
          checkError.innerText = 'Matrícula não encontrada. Crie um novo cadastro.';
          checkError.classList.remove('hidden');
        }, 1000);
      } else {
        const response = await fetch('/api/check-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matricula })
        });

        const data = await response.json();
        checkLoading.classList.add('hidden');

        if (data.exists) {
          const limitResponse = await fetch('/api/check-limit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              matr: matricula,
              empresa: data.user.empresa
            })
          });

          const limitData = await limitResponse.json();

          if (limitData.permitido) {
            localStorage.setItem('userData', JSON.stringify(data.user));
            checkMatriculaDiv.classList.add('hidden');
            homeDiv.classList.remove('hidden');
          } else {
            checkError.innerText = 'Você já jogou 2 vezes nesta semana.';
            checkError.classList.remove('hidden');
          }
        } else {
          checkError.innerText = 'Matrícula não encontrada. Crie um novo cadastro.';
          checkError.classList.remove('hidden');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar matrícula:', error);
      checkLoading.classList.add('hidden');
      checkError.innerText = 'Erro ao verificar matrícula. Tente novamente.';
      checkError.classList.remove('hidden');
    }
  }

  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (loginForm) {
        loginForm.reset();
        loginError.classList.add('hidden');
      }

      if (checkError) checkError.classList.add('hidden');
      if (checkLoading) checkLoading.classList.add('hidden');

      loginDiv.classList.add('hidden');
      checkMatriculaDiv.classList.remove('hidden');
      adjustLogoPosition(false);

      if (checkEmployeeId) checkEmployeeId.focus();
    });
  }

  btnNewUser.addEventListener('click', function () {
    const matricula = checkEmployeeId.value.trim();

    if (matricula) {
      employeeId.value = matricula;
    }

    checkMatriculaDiv.classList.add('hidden');
    loginDiv.classList.remove('hidden');
    adjustLogoPosition(true);

    setTimeout(() => {
      document.getElementById('employee_id').focus();
    }, 100);
  });

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const fullname = document.getElementById('fullname').value.trim();
      const employee_id = document.getElementById('employee_id').value.trim();
      const company = document.getElementById('company').value.trim();
      const job_title = document.getElementById('job_title').value.trim();
      const phoneValue = phoneInput.value.trim();

      if (!fullname || !employee_id || !company || !job_title || !phoneValue) {
        loginError.innerText = 'Por favor, preencha todos os campos corretamente.';
        loginError.classList.remove('hidden');
        return;
      }

      try {
        const response = await fetch('/api/check-limit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matr: employee_id,
            empresa: company
          })
        });

        const data = await response.json();
        const permitido = data.permitido;
        const tentativas = data.tentativas || 0;

        if (!permitido) {
          loginError.innerText = 'Você já jogou o quiz 2 vezes nesta semana.';
          loginError.classList.remove('hidden');
          return;
        }

        const userData = {
          fullname,
          employee_id,
          company,
          job_title,
          phone: phoneValue,
          tentativas
        };

        localStorage.setItem('userData', JSON.stringify(userData));;

        loginDiv.classList.add('hidden');
        homeDiv.classList.remove('hidden');
      } catch (error) {
        console.error('Erro:', error);
        loginError.innerText = 'Ocorreu um erro. Tente novamente.';
        loginError.classList.remove('hidden');
      }
    });
  }
});