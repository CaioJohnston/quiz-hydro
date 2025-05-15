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
        question: "Qual é a importância da participação das lideranças comunitárias na Iniciativa Barcarena Sustentável?",
        options: ["Elas ajudam na comunicação com a mídia", "Elas indicam prioridades para os investimentos sociais", "Elas substituem a gestão da Hydro na região", "Elas substituem a gestão da Hydro na região"],
        correct: 2
    },
    {
        question: "Quais organizações não-governamentais atuam junto com a Hydro no Programa Corredor?",
        options: ["IPAM, IMAZON e CEIA", "WWF, Greenpeace e Imazon", "CEIA, SOS Mata Atlântica e IPAM", "IMAZON, PNUMA e IBAMA"],
        correct: 1
    },
    {
        question: "Qual é a intenção da Hydro e Albras para a COP 30?",
        options: ["Promover seus produtos", "Apresentar suas iniciativas para um futuro sustentável e socialmente justo", "Apresentar suas iniciativas para um futuro sustentável e socialmente justo", "Firmar novos contratos comerciais"],
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
