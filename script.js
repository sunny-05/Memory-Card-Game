const allIcons = ["🍎", "🍌", "🍇", "🍒", "🍉", "🥑", "🍍", "🍓", "🥝", "🍋", "🍆", "🌽"];
let cardsArray, firstCard, secondCard;
let lockBoard = false, moves = 0, time = 0, timerInterval, matchedPairs = 0;

const gameBoard = document.getElementById("gameBoard");
const movesCounter = document.getElementById("moves");
const timeCounter = document.getElementById("time");
const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficulty");
const winPopup = document.getElementById("winPopup");
const winStats = document.getElementById("winStats");
const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");

// Difficulty settings
const difficultySettings = {
    easy: { cols: 4, pairs: 6 },
    medium: { cols: 4, pairs: 8 },
    hard: { cols: 5, pairs: 10 }
};

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Start game
function startGame() {
    const difficulty = difficultySelect.value;
    const { cols, pairs } = difficultySettings[difficulty];

    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gameBoard.innerHTML = "";
    moves = 0; time = 0; matchedPairs = 0;
    movesCounter.textContent = moves;
    timeCounter.textContent = time;
    clearInterval(timerInterval);

    // Pick icons based on difficulty
    cardsArray = allIcons.slice(0, pairs);
    cardsArray = [...cardsArray, ...cardsArray];
    shuffle(cardsArray);

    cardsArray.forEach(icon => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="front">${icon}</div>
            <div class="back">?</div>
        `;
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });

    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        timeCounter.textContent = time;
    }, 1000);
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    flipSound.play();
    this.classList.add("flip");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesCounter.textContent = moves;

    checkMatch();
}

function checkMatch() {
    const isMatch = firstCard.querySelector(".front").textContent ===
                    secondCard.querySelector(".front").textContent;

    if (isMatch) {
        matchSound.play();
        disableCards();
        matchedPairs++;
        const difficulty = difficultySelect.value;
        if (matchedPairs === difficultySettings[difficulty].pairs) {
            clearInterval(timerInterval);
            setTimeout(showWinPopup, 500);
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function showWinPopup() {
    winStats.textContent = `You won in ${moves} moves and ${time} seconds!`;
    winPopup.style.display = "flex";
}

function restartGame() {
    winPopup.style.display = "none";
    startGame();
}

restartBtn.addEventListener("click", restartGame);
difficultySelect.addEventListener("change", restartGame);

startGame();
