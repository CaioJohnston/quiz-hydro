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

  try {
    // Verificar quantas vezes o usuário jogou esta semana
    const checkLimitResponse = await fetch('/api/check-limit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matr: userData.employee_id,
        empresa: userData.company
      })
    });

    if (!checkLimitResponse.ok) {
      throw new Error(`Erro na API: ${checkLimitResponse.status}`);
    }

    const limitData = await checkLimitResponse.json();
    const tentativas = limitData.jogos || 0;

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

    if (!save.ok) {
      throw new Error(`Erro ao salvar: ${save.status}`);
    }

    const saveResult = await save.json();

    if (!saveResult.success) {
      finalScore.innerText = "❌ Erro ao salvar seus dados. Tente novamente mais tarde.";
      return;
    }

    // Determina a mensagem com base no desempenho e no número de tentativas
    let feedbackMsg = "";
    if (correct >= 4 && tentativas == 0) {
      feedbackMsg = "🎉 Parabéns!\n\nVocê mandou muito bem no quiz! 👏\nIsso mostra que você está ligado nos temas da COP 30. Continue assim! 🌎💚";
      console.log(tentativas)
    } else if (correct >= 3 && tentativas >= 1) {
      feedbackMsg = "🚨 Fique ligado!\n\nAcompanhe os próximos vídeos, participe dos quizzes e compartilhe o que aprendeu. O conhecimento é o primeiro passo para a ação! 🌍✨";
      console.log(tentativas)
    } else {
      feedbackMsg = "💡 Quase lá!\n\nVocê respondeu algumas perguntas, mas ainda dá pra melhorar! Que tal assistir novamente ao vídeo e tentar o quiz mais uma vez?";
    }

    finalScore.innerText = `Você acertou ${correct} de ${total} questões!\n\n${feedbackMsg}`;

  } catch (error) {
    console.error("Erro:", error);
    // Mesmo com erro, mostramos algum feedback básico
    finalScore.innerText = `Você acertou ${correct} de ${total} questões!\n\n💡 Obrigado por participar do nosso quiz!`;
  }

  // Botão de retorno (sempre mostra, mesmo com erro)
  const restartBtn = document.createElement("button");
  restartBtn.innerText = "Voltar à Página Inicial";
  restartBtn.className = "btn";
  restartBtn.style.marginTop = "30px";
  restartBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  document.getElementById("end").appendChild(restartBtn);
});