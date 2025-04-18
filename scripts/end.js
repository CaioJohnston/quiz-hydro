const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const correctAnswers = localStorage.getItem('correctAnswers');

finalScore.innerText = `Você acertou ${correctAnswers} de ${mostRecentScore} questões!`;