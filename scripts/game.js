const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let questionCounter = 0;
let availableQuestions = [];
let correctAnswers = 0;
let timer;
const TOTAL_TIME = 30;
let timeLeft = TOTAL_TIME;

const questions = [
    {
        question: "O que significa a sigla COP no contexto climático?",
        options: ["Congresso Oficial dos Países", "Conselho Operacional de Políticas", "Conferência das Partes", "Comissão de Organização Planetária"],
        correct: 3
    },
    {
        question: "A primeira COP aconteceu em que ano?",
        options: ["1992", "1994", "1995", "2000"],
        correct: 3
    },
    {
        question: "Qual cidade sediará a COP 30 em 2025?",
        options: ["Manaus", "Brasília", "Nova York", "Belém"],
        correct: 4
    },
    {
        question: "Quantos países participam atualmente da COP?",
        options: ["Mais de 90", "Cerca de 100", "Mais de 196", "150"],
        correct: 3
    },
    {
        question: "Qual é o principal tema discutido nas conferências da COP?",
        options: ["Desenvolvimento urbano", "Mudanças climáticas", "Economia digital", "Tecnologia espacial"],
        correct: 2
    }
];

const MAX_QUESTIONS = questions.length;

startGame = () => {
    questionCounter = 0;
    correctAnswers = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', MAX_QUESTIONS);
        localStorage.setItem('correctAnswers', correctAnswers);
        return window.location.assign('../pages/end.html');
    }
    questionCounter++;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    if (question) {
        question.innerText = currentQuestion.question;
    }

    choices.forEach((choice, index) => {
        if (choice) {
            choice.innerText = currentQuestion.options[index];
        }
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
    resetTimer();
};

choices.forEach((choice, index) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = index + 1;

        const classToApply =
            selectedAnswer == currentQuestion.correct ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            showConfetti();
            correctAnswers++;
        } else {
            shakeScreen();
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 2000);
    });
});

resetTimer = () => {
    clearInterval(timer);
    timeLeft = TOTAL_TIME;
    progressBarFull.style.width = '100%';

    timer = setInterval(() => {
        timeLeft--;
        const progressWidth = (timeLeft / TOTAL_TIME) * 100;
        progressBarFull.style.width = `${progressWidth}%`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            acceptingAnswers = false;
            shakeScreen();
            setTimeout(() => {
                getNewQuestion();
            }, 1000);
        }
    }, 1000);
};

const showConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
};

const shakeScreen = () => {
    game.classList.add('shake');
    setTimeout(() => {
        game.classList.remove('shake');
    }, 500);
};

startGame();
