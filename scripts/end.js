const thankName = document.getElementById('thank-name');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const correctAnswers = localStorage.getItem('correctAnswers');
const userData = JSON.parse(localStorage.getItem('userData'));

const name = userData.fullname.split(' ')[0].charAt(0).toUpperCase() +
  userData.fullname.split(' ')[0].slice(1).toLowerCase();

thankName.innerText = `${name}, obrigado por jogar!`;

document.addEventListener("DOMContentLoaded", async () => {
  const correct = parseInt(correctAnswers, 10);
  const total = parseInt(mostRecentScore, 10);
  const tentativas = userData.tentativas || 0;

  // Enviar para o banco (sem revalidar limite)
  const save = await fetch('/api/save-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: userData.fullname,
      matr: userData.employee_id,
      empresa: userData.company,
      cargo: userData.job_title,
      tel: userData.phone,
      acertos: correct
    })
  });

  const saveResult = await save.json();

  if (!saveResult.success) {
    finalScore.innerText = "❌ Erro ao salvar seus dados. Tente novamente mais tarde.";
    return;
  }

  let feedbackMsg = "";
  if (correct >= 4) {
    feedbackMsg = "🎉 Parabéns!\n\nVocê mandou muito bem no quiz! 👏\nIsso mostra que você está ligado nos temas da COP 30. Continue assim! 🌎💚";
  } else if (correct >= 3 && tentativas >= 1) {
    feedbackMsg = "🚨 Fique ligado!\n\nAcompanhe os próximos vídeos, participe dos quizzes e compartilhe o que aprendeu. O conhecimento é o primeiro passo para a ação! 🌍✨";
  } else {
    feedbackMsg = "💡 Quase lá!\n\nVocê respondeu algumas perguntas, mas ainda dá pra melhorar! Que tal assistir novamente ao vídeo e tentar o quiz mais uma vez?";
  }

  finalScore.innerText = `Você acertou ${correct} de ${total} questões!\n\n${feedbackMsg}`;

  // Botão de retorno
  const restartBtn = document.createElement("button");
  restartBtn.innerText = "Voltar à Página Inicial";
  restartBtn.className = "btn";
  restartBtn.style.marginTop = "30px";
  restartBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  document.getElementById("end").appendChild(restartBtn);
});