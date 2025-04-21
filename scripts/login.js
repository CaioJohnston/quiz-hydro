const form = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const employee_id = document.getElementById("employee_id").value.trim();
  const company = document.getElementById("company").value.trim();
  const job_title = document.getElementById("job_title").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!fullname || !employee_id || !company || !job_title || !phone) {
    loginError.innerText = "Por favor, preencha todos os campos corretamente.";
    loginError.classList.remove("hidden");
    return;
  }

  // Verifica se já jogou 2 vezes na semana
  const response = await fetch("/api/check-limit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      matr: employee_id,
      empresa: company
    })
  });  

  const data = await response.json();

  if (!data.permitido) {
    loginError.innerText = "Você já jogou o quiz 2 vezes nesta semana.";
    loginError.classList.remove("hidden");
    return;
  }

  // Armazenar os dados localmente (dá uma atenção aqui Carlos)
  const userData = {
    fullname,
    employee_id,
    company,
    job_title,
    phone
  };

  localStorage.setItem("userData", JSON.stringify(userData));

  // Redireciona para a página do quiz
  window.location.href = "./pages/game.html";
});
