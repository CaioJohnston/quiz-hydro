const thankName = document.getElementById('thank-name');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const correctAnswers = localStorage.getItem('correctAnswers');
const userData = JSON.parse(localStorage.getItem('userData'));

const name = userData.fullname.split(' ')[0].charAt(0).toUpperCase() +
  userData.fullname.split(' ')[0].slice(1).toLowerCase();

finalScore.innerText = `Você acertou ${correctAnswers} de ${mostRecentScore} questões!`;
thankName.innerText = `${name}, obrigado por jogar!`;

document.addEventListener("DOMContentLoaded", async () => {
  const check = await fetch('/api/check-limit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matr: userData.employee_id })
  });

  const checkResult = await check.json();

  if (!checkResult.permitido) {
    alert("Você já jogou 2 vezes nesta semana. Volte na próxima semana.");
    return;
  }

  const save = await fetch('/api/save-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: userData.fullname,
      matr: userData.employee_id,
      empresa: userData.company,
      cargo: userData.job_title,
      tel: userData.phone,
      acertos: parseInt(correctAnswers, 10)
    })
  });

  const saveResult = await save.json();

  if (!saveResult.success) {
    alert("Erro ao salvar seus dados. Tente novamente mais tarde.");
  } else {
    console.log("Resultado salvo com sucesso.");
  }
});
