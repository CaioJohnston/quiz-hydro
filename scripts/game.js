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

const questions = [
    {
        question: "O que cada empregado da Hydro e da Albras é chamado a ser?",
        options: ["Supervisor ambiental", "Guardião das metas", "Guardião das marcas", "Fiscal de sustentabilidade"],
        correct: 3
    },
    {
        question: "Qual é a atuação da Hydro e da Albras durante a COP 30, que será realizada no Pará?",
        options: ["Aumentar a produção de alumínio", "Reduzir o número de funcionários", "Mostrar o impacto positivo de seus projetos sociais e de descarbonização", "Promover eventos culturais para turistas"],
        correct: 3
    },
    {
        question: "Onde devem ser buscadas informações confiáveis sobre a Hydro?",
        options: ["Redes sociais externas", "Canais internos e externos oficiais da Hydro", "Grupos de WhatsApp", "Jornais locais"],
        correct: 2
    },
    {
        question: "O que a empresa quer evitar na comunicação?",
        options: ["Uso de expressões que não condizem com a realidade", "Uso de termos técnicos demais", "Falar sobre sustentabilidade", "Mencionar a Amazônia"],
        correct: 1
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

    // Adiciona fade-out antes de carregar nova pergunta
    game.classList.add('fade-out');

    setTimeout(() => {
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

        // Atualiza contador textual
        const progressText = document.getElementById('progressText');
        if (progressText) {
            progressText.innerText = `Pergunta ${questionCounter} de ${MAX_QUESTIONS}`;
        }

        availableQuestions.splice(questionIndex, 1);
        acceptingAnswers = true

        // Aplica fade-in após nova pergunta
        game.classList.remove('fade-out');
        game.classList.add('fade-in');

        setTimeout(() => {
            game.classList.remove('fade-in');
        }, 500);
    }, 500); // tempo para fade-out
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
