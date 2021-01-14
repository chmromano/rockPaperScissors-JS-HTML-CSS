//Function that contains everything needed to run the game
const rockPaperScissors = () => {

    //Variables that set inital game state
    let pScore = 0;
    let cScore = 0;
    let gameHistory = [];
    let rowWins = 3;
    let winsToWin = 10;

    //Global variables that refer to HTML objects used in multiple functions
    const winner = document.querySelector(".winner");
    const match = document.querySelector(".match");
    const endScreen = document.querySelector(".endScreen");
    const settingsPage = document.querySelector(".settingsPage");
    const playerScore = document.querySelector(".player-score p");
    const computerScore = document.querySelector(".computer-score p");
    const playerHand = document.querySelector(".player-hand");
    const computerHand = document.querySelector(".computer-hand");

    //Hides intro and shows the match window when pressing "Let's play!" button
    const startGame = () => {
        const introScreen = document.querySelector(".intro");
        const playButton = document.querySelector(".intro button");
        playButton.addEventListener("click", () => {
            introScreen.classList.add("fadeOut");
            match.classList.add("fadeIn");
        });
    }

    //Hides match window and show settings page when settings button is pressed
    const openSettings = () => {
        const settingsButton = document.querySelector(".openSettings");
        settingsButton.addEventListener("click", () => {
            match.classList.remove("fadeIn");
            settingsPage.classList.add("fadeIn");
        });
    }

    //Function used to either apply chosen settings or close the settings page without applying anything 
    const settingsChoice = () => {

        //Functions to:
        // -Hide settings page and show match
        // -Reset input and warning fields after 0.5s (so it doesn't look to sudden to user)
        //Both get used two times within the settingsChoice() function
        const fadeOutSettings = () => {
            settingsPage.classList.remove("fadeIn");
            match.classList.add("fadeIn");
        }
        const resetFields = () => {
            warning.textContent = "";
            document.querySelector(".rowWins").value = "";
            document.querySelector(".winsToWin").value = "";
        }

        //Creates object used in closeButton event and runs function on button click event
        const closeButton = document.querySelector(".closeSettings");
        closeButton.addEventListener("click", () => {
            //Show/hide page and reset fields functions
            fadeOutSettings();
            setTimeout(resetFields, 500);
        });

        //Creates objects used in the applyButton event
        const applyButton = document.querySelector(".applySettings");
        const warning = document.querySelector(".warning");
        //Runs function on button click event
        applyButton.addEventListener("click", () => {
            //HTML objects needed in the function
            const winsTotal = document.querySelector(".winsTotal");
            const winsInRow = document.querySelector(".winsInRow");
            //Puts the values from settings's input fields into number variables
            rowWinsInput = Number(document.querySelector(".rowWins").value);
            winsToWinInput = Number(document.querySelector(".winsToWin").value);
            //Checks if input values are positive integers, if not warns the user
            if ((!(Number.isInteger(rowWinsInput) && Number.isInteger(winsToWinInput))) || (rowWinsInput <= 0 || winsToWinInput <= 0)) {
                warning.textContent = "Inputs must be positive integers";
            //There must be a minimum of 2 for wins in a row, otherwise it would make it little sense
            } else if (rowWinsInput < 2) {
                warning.textContent = "Wins in a row must be at least 2";
            //Wins in a row must be smaller number than wins to win, otherwise it would make little sense
            } else if (rowWinsInput >= winsToWinInput) {
                warning.textContent = "Wins to win must be larger than wins in a row";
            //If the input is valid the following executes
            } else {
                //Valid inputs are saved as global variables to be used in other functions
                winsToWin = winsToWinInput;
                rowWins = rowWinsInput;
                //Displays settings chosen by user in the game window
                winsTotal.textContent = winsToWin;
                winsInRow.textContent = rowWins;
                //Resets game
                resetGame();
                //Show/hide page and reset fields functions
                fadeOutSettings();
                setTimeout(resetFields, 500);
            }
        });
    }

    //Simple function that disables buttons
    const disableButtons = () => {
        document.querySelector(".rock").disabled = true;
        document.querySelector(".paper").disabled = true;
        document.querySelector(".scissors").disabled = true;
        document.querySelector(".openSettings").disabled = true;
    }

    //Simple functiont that enables buttons
    const enableButtons = () => {
        document.querySelector(".rock").disabled = false;
        document.querySelector(".paper").disabled = false;
        document.querySelector(".scissors").disabled = false;
        document.querySelector(".openSettings").disabled = false;
    }

    //Function disables buttons, and after 2s reactivates them
    //Prevents user from pressing buttons while game animation runs
    const disableWhilePlaying = () => {
        disableButtons();
        setTimeout(() => {
            enableButtons();
        }, 2000);   
    }

    //Function to display game over screen after 2s, giving user time to
    //see result. Prevents user from pressing buttons before game over screen appears.
    const gameOver = () => {
        disableButtons();
        setTimeout(() => {
            match.classList.remove("fadeIn");
            endScreen.classList.add("fadeIn");
            enableButtons();
        }, 2000);
    }

    //Function that generates computer choice and sets player choice
    const playMatch = () => {
        //Needed objects
        const options = document.querySelectorAll(".options button");
        const hands = document.querySelectorAll(".hands img");
        const computerOptions = ["rock", "paper", "scissors"];
        //For each option button a function runs on click
        for (const option of options) {
            option.addEventListener("click", () => {
                //On player click all buttons are disabled for 2s
                disableWhilePlaying();
                //Computer choice is generated by generating a random number from 0 to 2
                //The randomly generated number is used to pick a value from the computerOptions array
                const computerChoice = computerOptions[Math.floor(Math.random() * 3)];

                //Player and computer images set to rock for animation
                playerHand.src = "./assets/rock.png";
                computerHand.src = "./assets/rock.png";
                //Animation runs for 2s
                playerHand.style.animation = "shakePlayer 2s ease";
                computerHand.style.animation = "shakeComputer 2s ease";

                //After 2s compareHands() is called to evaluate winner/loser using player and computer choices as variables
                setTimeout(() => {
                    compareHands(option.textContent, computerChoice);
                    //Player and computer icons are set to player and computer choice
                    playerHand.src = `./assets/${option.textContent}.png`;
                    computerHand.src = `./assets/${computerChoice}.png`;
                }, 2000);
                
            });
        }

        //Resets animation on animationend for both images so animation can be run again
        for (const hand of hands) {
            hand.addEventListener("animationend", () => {
                hand.style.animation = "";
            });
        }
    }

    //Updates scores and checks win conditions (if "wins in a row" and "wins needed to win" are reached at the same time
    //"wins needed to win" takes priority)
    const updateGame = () => {
        //Create needed HTML object
        const gameWinner = document.querySelector(".endScreen h2");
        //Update player and computer scores
        playerScore.textContent = pScore;
        computerScore.textContent = cScore;
        //Check win condition "wins needed to win"
        if (pScore == winsToWin) {
            //Display game over screen with win message
            gameOver();
            gameWinner.textContent = "You have won the game!";
        } else if (cScore == winsToWin) {
            //Display game over screen with loss message
            gameOver();
            gameWinner.textContent = "You have lost the game!";
        }

        //Counter used to check "wins in a row" condition
        resultCounter = 0;
        //Create an array "rowWins" long (default 3, can be set by user in settings) by slicing gameHistory
        let lastHistory = gameHistory.slice(0, rowWins);
        //For each item in lastHistory evaluate
        for (const result of lastHistory) {
            //If it's a win add 1 to resultCounter
            if (result == "win") {
                resultCounter++;
            //If it's a loss subtract 1 to resultCounter
            } else if (result == "loss") {
                resultCounter--;
            }
        }

        //By the program's logic if resultCounter equals rowWins there is a win by "wins in a row"
        if (resultCounter == rowWins && pScore < winsToWin) {
            //Display game over screen with custom win message
            gameOver();
            gameWinner.textContent = "You have won the game (" + rowWins + " wins in a row)!";
        //For losses in a row resultCounter is negative and equals -(rowWins)
        } else if (resultCounter == -(rowWins) && cScore < winsToWin) {
            //Display game over screen with custom loss message
            gameOver();
            gameWinner.textContent = "You have lost the game (" + rowWins + " losses in a row)!";
        }
    }

    //Function to copmare hands and evaluate the winnner/loser/a tie
    const compareHands = (playerChoice, computerChoice) => {
        //If it is a tie unshifts tie to gameHistory array and displays "It is a tie!"
        if (playerChoice === computerChoice) {
            winner.textContent = "It is a tie!";
            gameHistory.unshift("tie");
        //Else if player chose rock
        } else if (playerChoice === "rock") {
            //If computer chose scissors display "You won!", add 1 to player score,
            //unshift win to gameHistory, and run updateGame function
            if (computerChoice === "scissors") {
                winner.textContent = "You won!";
                pScore++;
                gameHistory.unshift("win");
                updateGame();
            //Else (since rock is excluded because it would equal playerChoice) display "You lost!",
            //add 1 to computer score, unshift loss to gameHistory, and run updateGame function
            } else {
                winner.textContent = "You lost!";
                cScore++;
                gameHistory.unshift("loss");
                updateGame();
            }
        //Else if player chose paper
        } else if (playerChoice === "paper") {
            //If computer chose scissors display "You lost!", add 1 to computer score,
            //unshift loss to gameHistory, and run updateGame function
            if (computerChoice === "scissors") {
                winner.textContent = "You lost!";
                cScore++;
                gameHistory.unshift("loss");
                updateGame();
            //Else (since paper is excluded because it would equal playerChoice) display "You won!",
            //add 1 to player score, unshift win to gameHistory, and run updateGame function
            } else {
                winner.textContent = "You won";
                pScore++;
                gameHistory.unshift("win");
                updateGame();
            }
        //Else if player chose scissors
        } else if (playerChoice === "scissors") {
            //If computer chose rock display "You lost!", add 1 to computer score,
            //unshift loss to gameHistory, and run updateGame function
            if (computerChoice === "rock") {
                winner.textContent = "You lost!";
                cScore++;
                gameHistory.unshift("loss");
                updateGame();
            //Else (since scissors is excluded because it would equal playerChoice) display "You won!",
            //add 1 to player score, unshift win to gameHistory, and run updateGame function
            } else {
                winner.textContent = "You won!";
                pScore++;
                gameHistory.unshift("win");
                updateGame();
            }
        }
    }

    //Function to restart game from game over screen
    const restartGame = () => {
        //Creates needed HTML object
        const restartButton = document.querySelector(".endScreen button");
        //Run function on button click
        restartButton.addEventListener("click", () => {
            //Resets game
            resetGame();
            //Hide game over screen and show match screen
            endScreen.classList.remove("fadeIn");
            match.classList.add("fadeIn");
        });
    }

    //Resets all scores, history, text and icons to initial state
    const resetGame = () => {
        cScore = 0;
        pScore = 0;
        gameHistory = [];
        playerHand.src = "./assets/rock.png";
        computerHand.src = "./assets/rock.png";
        winner.textContent = "Choose an option";
        playerScore.textContent = 0;
        computerScore.textContent = 0;
    }

    //Run functions needed by game (ones with events on button click)
    openSettings();
    settingsChoice();
    startGame();
    playMatch();
    restartGame();
}

//Run whole game
rockPaperScissors();