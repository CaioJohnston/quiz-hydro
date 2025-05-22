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
        question: "Qual foi uma das principais mudanças feitas na refinaria Alunorte?",
        options: ["Adoção de energia nuclear", "Troca de carvão por madeira", "Substituição de óleo combustível por gás natural", "Substituição de gás natural por diesel"],
        correct: 3
    },
    {
        question: "Qual tecnologia é utilizada em Mineração Paragominas para reabilitação ambiental?",
        options: ["Injeção de cimento nas áreas mineradas", "Tailing Dry Backfill", "Reservatórios de lodo", "Compostagem acelerada"],
        correct: 2
    },
    {
        question: "Qual certificação a Albras recebeu pelo compromisso com a gestão de emissões?",
        options: ["ISO 14001", "Selo Verde Internacional", "Selo Ouro do GHG Protocol", "Certificado Carbono Neutro Global"],
        correct: 3
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
