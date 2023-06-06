document.getElementById("error").innerHTML = "Loading....";

import { WORDS } from "./words.js";

var NUMBER_OF_GUESSES = 10; // EDIT THIS NUMBER TO CHANGE THE AMOUNT OF GUESSES YOU HAVE
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

function changeNumOfGuesses() {
    document.getElementById("error").innerHTML = "Loading....";
    var input = document.getElementById("numOfGuessesType").value;
    if (input <= 0 || input === "") {
        input = 1;
    }
    NUMBER_OF_GUESSES = input;
    guessesRemaining = input;
    currentGuess = [];
    nextLetter = 0;
    rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
    document.getElementById("game-board").innerHTML = "";
    initBoard();
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = 'rgba(0, 0, 0, 50%)';
        elem.style.color = 'lightgrey'
    }
    document.getElementById("error").innerHTML = "";
}

document.querySelector('#numOfGuessesType').addEventListener("change", () => changeNumOfGuesses());

document.querySelector('#restart').addEventListener("click", () => restart());

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

initBoard();

function insertLetter (pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let box = row.children[nextLetter]
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'rgb(175, 175, 0)' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            if (color === 'black') {
                elem.style.color = 'rgba(255, 255, 255, 10%)'
            }
            if (color === 'rgb(175, 175, 0)') {
                elem.style.color = 'black'
            }
            if (color === 'green') {
                elem.style.color = 'lightgrey'
            }
            break
        }
    }
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters!")
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }

    
    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if (letterPosition === -1) {
            letterColor = 'black'
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green'
            } else {
                letterColor = 'rgb(175, 175, 0)'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 0 * i
        setTimeout(()=> {
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over!")
        guessesRemaining = 0
        if (document.getElementById("autoRestart").checked) {
            autoRestart();
        }
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${rightGuessString}"`)
        }
    }
}

document.getElementById("error").innerHTML = ""

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

var cancel = false;

function autoRestart() {
    var timeleft = 2;
    var temp = timeleft + 1;
    document.getElementById("countdown").innerHTML = "Auto-Restarting in " + temp;
    document.getElementById("cancel").hidden = false;
    var timer = setInterval(function() {
        if (cancel) {
            clearInterval(timer);
            cancel = false;
        } else {
            if (timeleft <= 0) {
                clearInterval(timer);
                document.getElementById("countdown").innerHTML = "";
                document.getElementById("cancel").hidden = true;
                restart();
            } else {
                document.getElementById("countdown").innerHTML = "Auto-Restarting in " + timeleft;
            }
            timeleft -= 1;
        }
    }, 1000);
}

function cancelAutoRestart() {
    cancel = true;
    document.getElementById("countdown").innerHTML = "";
    document.getElementById("cancel").hidden = true;
}

document.querySelector('#cancel').addEventListener("click", () => cancelAutoRestart());

function restart() {
    if (guessesRemaining === NUMBER_OF_GUESSES) {
        toastr.error("You must have at least 1 completed guess to restart.")
        return;
    }
    document.getElementById("error").innerHTML = "Loading....";
    var input = document.getElementById("numOfGuessesType").value;
    if (input <= 0 || input === "") {
        input = 1;
    }
    NUMBER_OF_GUESSES = input;
    guessesRemaining = input;
    currentGuess = [];
    nextLetter = 0;
    rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
    document.getElementById("game-board").innerHTML = "";
    initBoard();
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = 'rgba(0, 0, 0, 50%)';
        elem.style.color = 'lightgrey'
    }
    document.getElementById("error").innerHTML = "";
}
