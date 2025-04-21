const thankName = document.getElementById('thank-name');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const correctAnswers = localStorage.getItem('correctAnswers');
const userData = JSON.parse(localStorage.getItem('userData'));
const name = userData.fullname.split(' ')[0].charAt(0).toUpperCase() + userData.fullname.split(' ')[0].slice(1).toLowerCase();

finalScore.innerText = `Você acertou ${correctAnswers} de ${mostRecentScore} questões!`;
thankName.innerText = `${name}, obrigado por jogar!`;