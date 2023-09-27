const url = 'http://localhost:3000/highscore';

async function getHighscore(){
      const response = await fetch(url);
      const highscore = await response.json();
      console.log(highscore);
      const highscoreElement = document.createElement("h3");
      highscoreElement.innerText = "Highscore";
      highscoreDisplay.appendChild(highscoreElement);
      for (let i = 0; i < 5; i++){
        const p = document.createElement("p");
        p.innerText = highscore[i].name + ": " + highscore[i].score;
        highscoreDisplay.appendChild(p);
      }
}
  
async function postHighscore(){
  //Datan vi vill posta
  const bodyContent = {
    name: playerName,
    score: playerScore,
  };
  
  //Header-objektet
  const header = {
  //Egenskapsnamnet Content-type behöver citattecken eftersom det innehåller ett bindestreck.
      "Content-type": "application/json; charset=UTF-8"
  }
  
  const options = {
    method: "POST", //Metoden som ska användas
    body: JSON.stringify(bodyContent), //Gör om datan till json
    headers: header //Header-objektet
  };

    const response = await fetch(url,options);
    const msg = await response.json();
    console.log(msg);
    
    let message;
    if (msg.status) {
      message = "Grattis! Du fick highscore!";
    } else {
      message = "Inget highscore! Bättre lycka nästa gång.";
    }
    endResultDisplay.innerText = message;

    getHighscore();
}








// spelet börjar här

let playerName = "";
let playerScore = 0;
let computerScore = 0;
let gameStarted = false;

const playerNameInput = document.querySelector("#input");
const submitBtn = document.querySelector("#submitBtn");
const resetBtn = document.querySelector("#resetBtn");
const choices = document.querySelectorAll(".choice-btn");

const playerScoreDisplay = document.getElementById("playerScore");
const computerChoiceDisplay = document.getElementById("computerChoice");
const playerChoiceDisplay = document.getElementById("playerChoice");
const resultDisplay = document.getElementById("result");
const endResultDisplay = document.getElementById("endResult");
const playerNameDisplay = document.getElementById("playerName");
const highscoreDisplay = document.querySelector(".highscore-div");

submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (playerNameInput.value === "") {
    playerNameDisplay.innerText = "Anonym";
    playerName = "Anonym";
  } else {
    playerNameDisplay.innerText = playerNameInput.value;
    playerName = playerNameInput.value;
  }
  resetGame();
});

choices.forEach(function (choice) {
  choice.addEventListener("click", function () {
    if (!gameStarted) return;

    const playerChoice = this.id;
    const computerChoice = getRandomChoice();
    const result = playRound(playerChoice, computerChoice);
    updateScore(result);
    updateDisplays(playerChoice, computerChoice, result);

    if (computerScore === 1) {
      endGame();
    }
  });
});

resetBtn.addEventListener("click", resetGame);

function playRound(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return "Lika";
  } else if (
    (playerChoice === "Sten" && computerChoice === "Sax") ||
    (playerChoice === "Påse" && computerChoice === "Sten") ||
    (playerChoice === "Sax" && computerChoice === "Påse")
  ) {
    return "Spelare";
  } else {
    return "Datorn";
  }
}

function getRandomChoice() {
  const options = ["Sten", "Påse", "Sax"];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

function updateScore(result) {
  if (result === "Spelare") {
    playerScore++;
  } else if (result === "Datorn") {
    computerScore++;
  }
}

function updateDisplays(playerChoice, computerChoice, result) {
  playerScoreDisplay.textContent = "Spelarens poäng: " + playerScore;
  playerChoiceDisplay.textContent = "Spelarens val: " + playerChoice;
  computerChoiceDisplay.textContent = "Datorns val: " + computerChoice;
  resultDisplay.textContent = getMessage(result);
}

function getMessage(result) {
  if (result === "Spelare") {
    return "Du vann!";
  } else if (result === "Datorn") {
    return "Game over!";
  } else {
    return "Det blev Lika";
  }
}

function endGame() {
  gameStarted = false;
  postHighscore();
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  gameStarted = true;
  playerScoreDisplay.textContent = "";
  computerChoiceDisplay.textContent = "";
  playerChoiceDisplay.textContent = "";
  resultDisplay.textContent = "";
  endResultDisplay.textContent = "";
  highscoreDisplay.textContent = "";
}






  