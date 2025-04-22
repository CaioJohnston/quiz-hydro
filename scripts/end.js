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
  let tentativas = 0;

  // Consultar tentativas anteriores
  const check = await fetch('/api/check-limit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      matr: userData.employee_id,
      empresa: userData.company
    })
  });

  const checkResult = await check.json();

  if (!checkResult || !checkResult.permitido) {
    finalScore.innerText = "⚠️ Você já jogou 2 vezes nesta semana. Volte na próxima semana.";
    return;
  }

  tentativas = checkResult.jogos_da_semana?.length || 0;

  // Envia para o banco
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

  // Exibe mensagem final personalizada
  let feedbackMsg = "";
  if (correct >= 4) {
    feedbackMsg = "🎉 Parabéns!\n\nVocê mandou muito bem no quiz! 👏\nIsso mostra que você está ligado nos temas da COP 30. Continue assim! 🌎💚";
  } else if (correct >= 2) {
    feedbackMsg = "💡 Quase lá!\n\nVocê respondeu algumas perguntas, mas ainda dá pra melhorar! Que tal assistir novamente ao vídeo e tentar o quiz mais uma vez?";
  } else {
    feedbackMsg = (tentativas + 1 >= 2)
      ? "🚨 Fique ligado!\n\nAcompanhe os próximos vídeos, participe dos quizzes e compartilhe o que aprendeu. O conhecimento é o primeiro passo para a ação! 🌍✨"
      : "💡 Quase lá!\n\nVocê respondeu poucas perguntas corretamente. Tente novamente!";
  }

  finalScore.innerText = `Você acertou ${correct} de ${total} questões!\n\n${feedbackMsg}`;
});

// Botão para voltar ao início
const restartBtn = document.createElement("button");
restartBtn.innerText = "Voltar ao Início";
restartBtn.className = "btn";
restartBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});
document.getElementById("end").appendChild(restartBtn);
