const thankName = document.getElementById('thank-name');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const correctAnswers = localStorage.getItem('correctAnswers');
const userData = JSON.parse(localStorage.getItem('userData'));

const firstName = userData.fullname.split(' ')[0].charAt(0).toUpperCase() +
  userData.fullname.split(' ')[0].slice(1).toLowerCase();

thankName.innerText = `${firstName}, obrigado por jogar!`;

document.addEventListener("DOMContentLoaded", async () => {
  const correct = parseInt(correctAnswers, 10);
  const total = parseInt(mostRecentScore, 10);

  try {
    // Salvando o resultado aqui
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

    // Verifica quantas vezes jogou 
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
    const jogosTotal = limitData.jogos || 0;

    const tentativasAnteriores = jogosTotal - 1;

    console.log(`Total de jogos: ${jogosTotal}, Tentativas anteriores: ${tentativasAnteriores}`);

    let feedbackMsg = "";

    if (correct >= 4) {
      feedbackMsg = "🎉 Parabéns!\n\nVocê mandou muito bem no quiz! 👏\nIsso mostra que você está ligado nos temas da COP 30. Continue assim! 🌎💚";
      console.log(tentativasAnteriores);
    } else if (correct <= 3 && tentativasAnteriores >= 1) {
      console.log(tentativasAnteriores);
      feedbackMsg = "🚨 Fique ligado!\n\nAcompanhe os próximos vídeos, participe dos quizzes e compartilhe o que aprendeu. O conhecimento é o primeiro passo para a ação! 🌍✨";
    } else {
      feedbackMsg = "💡 Quase lá!\n\nVocê respondeu algumas perguntas, mas ainda dá pra melhorar! Que tal assistir novamente ao vídeo e tentar o quiz mais uma vez?";
    }

    finalScore.innerText = `Você acertou ${correct} de ${total} questões!\n\n${feedbackMsg}`;

  } catch (error) {
    console.error("Erro:", error);
    finalScore.innerText = `Você acertou ${correct} de ${total} questões!\n\n💡 Obrigado por participar do nosso quiz!`;
  }

  const restartBtn = document.createElement("button");
  restartBtn.innerText = "Voltar à Página Inicial";
  restartBtn.className = "btn";
  restartBtn.style.marginTop = "30px";

  restartBtn.style.padding = "1rem 1.5rem";
  restartBtn.style.fontSize = "1.4rem";

  const applyMediaQueries = () => {
    if (window.innerWidth <= 768) {
      restartBtn.style.width = "100%";
      restartBtn.style.fontSize = "1.4rem";
      restartBtn.style.padding = "0.8rem";
    } else {
      restartBtn.style.width = "auto";
      restartBtn.style.fontSize = "1.4rem";
      restartBtn.style.padding = "1rem 1.5rem";
    }
  };

  // Apply media queries immediately and on resize
  applyMediaQueries();
  window.addEventListener('resize', applyMediaQueries);

  restartBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  document.getElementById("end").appendChild(restartBtn);
});