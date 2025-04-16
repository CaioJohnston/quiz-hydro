const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const correctAnswers = localStorage.getItem('correctAnswers');
const progressBarFull = document.getElementById('progressBarFull');

finalScore.innerText = `Você acertou ${correctAnswers} de ${mostRecentScore} questões!`;

const redirectAfterTimeout = () => {
    let timeLeft = 5;
    const interval = 1000;
    const totalTime = 5;

    progressBarFull.style.width = '100%';

    const timer = setInterval(() => {
        timeLeft -= interval / 1000;
        progressBarFull.style.width = `${(timeLeft / totalTime) * 100}%`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            window.location.assign('/');
        }
    }, interval);
};

redirectAfterTimeout();
