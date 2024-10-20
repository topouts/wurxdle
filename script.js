document.getElementById("error").innerHTML = "Loading....";
let version = "v3.1.0";
//document.getElementById("title").innerText = "Pharmacy WuRxdle 2024";

toastr.options = {
    progressBar: true,
    preventDuplicates: true,
    timeOut: 2000, // Time in milliseconds for which the notification should appear
};

import { WORDS } from "./words.js";
import { SIXLETTERWORDS } from "./6-letter-words.js";
import { SEVENLETTERWORDS } from "./7-letter.words.js";
import { EIGHTLETTERWORDS } from "./8-letter-words.js";
import { THREELETTERWORDS } from "./3-letter-words.js";
import { FOURLETTERWORDS } from "./4-letter-words.js";
import { NINELETTERWORDS } from "./9-letter-words.js";
import { TENLETTERWORDS } from "./10-letter-words.js";
import { ELEVENLETTERWORDS } from "./11-letter-words.js";
import { TWELVELETTERWORDS } from "./12-letter-words.js";
import { THIRTEENLETTERWORDS } from "./13-letter-words.js";
import { FOURTEENLETTERWORDS } from "./14-letter-words.js";
import { FIFTEENLETTERWORDS } from "./15-letter-words.js";
import { SIXTEENLETTERWORDS } from "./16-letter-words.js";
import { PHARMWORDS } from "./10-letter-pharm.js";

var restartInQueue = false;
var onCooldown = false;
var wordLength = 10;
var NUMBER_OF_GUESSES = 9; // EDIT THIS NUMBER TO CHANGE THE AMOUNT OF GUESSES YOU HAVE
let guessesRemaining = NUMBER_OF_GUESSES;
var kept = guessesRemaining;
let currentGuess = [];
let lettersToBeFound = [];
let nextLetter = 0;
var rightGuessString = "strawberry"
//var rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
lettersToBeFound = Array.from(rightGuessString);
let indexesToBeFound = [];
for (let o = 0; o < wordLength; o++) {
    indexesToBeFound.push(o);
}
var greenColor = "#008000";
var yellowColor = "#afaf00";
var greyColor = "#000000";
var guessingRowLetterColor = "#00ffff";
var guessingRowColor = "#be0000";
var invalidColor = "#ff0000";
var totalMinutesLeft = 0;
var totalSecondsLeft = 1;
var cancel2 = false;
var timeToGuessMinutes = 0;
var timeToGuessSeconds = 1;
var fixTimeToGuessMinutes = timeToGuessMinutes;
var fixTimeToGuessSeconds = timeToGuessSeconds;
var cancel3 = false;
var mainTimerRunning = false;
var guessTimerRunning = false;
var hideMainTimer = true;
var timerExpiredColor = "#ff0000";
var timerWarningColor = "#ffff00";
var inactiveTimerColor = "#777777";
var greenTimeBonus = 40;
var yellowTimeBonus = 10;
var greyTimePenalty = 5;
var timeChange = 0;
var allowReset = true;
var entireGuessTimeChange = 0;
var timeChangePositiveColor = "#00ff00";
var noTimeChangeColor = "#ffe135";
var timeChangeNegativeColor = "#ff0000";
var isSquare = true;
var isGuessCheckInProgress = false;
var bg = "#be0000";

document.getElementById('acknowledge-button').onclick = function() {
    document.getElementById('popup').style.display = 'none';
};

function applyColorConfig() {
    document.body.style.backgroundColor = bg;//document.getElementById("BackgroundColor").value;
    document.body.style.color = "#ffffff";
    for (const elem of document.getElementsByClassName("letter-box")) {
        elem.style.borderColor ="#a9a9a9";
    }
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor ="#0c0c0c";
        elem.style.color ="#d3d3d3";
    }
    for (const elem of document.getElementsByClassName("button")) {
        elem.style.backgroundColor ="#000000";
    }
    for (const elem of document.getElementsByClassName("input")) {
        elem.style.backgroundColor ="#000000";
        elem.style.color ="#ffffff";
        elem.style.borderColor ="#d3d3d3";
    }
    greenColor = "#008000";
    yellowColor = "#afaf00";
    greyColor = "#000000";
    //document.getElementById("h2title").style.color = "#00ffc8";
    invalidColor ="#ff0000";
    guessingRowColor ="#141432"
    guessingRowLetterColor ="#00ffff";
    //document.getElementById("happyEaster").style.color = document.getElementById("easterEgg").value;
}

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";

        for (let j = 0; j < wordLength; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function hasCookie(cookieName) {
    // Get all cookies as a string
    const cookies = document.cookie;

    // Create a regex pattern to find the specific cookie
    const pattern = new RegExp('(^|; )' + cookieName + '=([^;]*)');

    // Check if the cookie exists
    return pattern.test(cookies);
}

if (hasCookie('userId')) {
    console.log('Cookie exists!');
} else {
  //Send them to login
    console.log('Cookie does not exist.');
    //window.location.replace("http://wurxdle.com/login.html");
    window.location.replace("http://localhost:8081/login.html");
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


initBoard();//changewordlength calls this anyway so it may be redundant

let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining];
row.style.backgroundColor = guessingRowColor;

applyColorConfig();


function insertLetter (pressedKey) {

    if (nextLetter === wordLength || pressedKey === "F1" || pressedKey === "F2" || pressedKey === "F3" || pressedKey === "F4" || pressedKey === "F5" || pressedKey === "F6" || pressedKey === "F7" || pressedKey === "F8" || pressedKey === "F9" || pressedKey === "F10" || pressedKey === "F11" || pressedKey === "F12") {
        return
    }
    pressedKey = pressedKey.toLowerCase();

    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining];
    let box = row.children[nextLetter];
    if (true) {
        animateCSS(box, "pulse", '0.3s');
    }
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    box.style.color = guessingRowLetterColor;
    box.style.borderColor = guessingRowLetterColor;
    nextLetter += 1;
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    box.style.borderColor ="#a9a9a9";
    currentGuess.pop();
    nextLetter -= 1;
    if (true) {
        animateCSS(box, "fadeIn", '0.3s');
    }
}

function RGBtoHEX(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            var rgbOld = elem.style.backgroundColor;
            if (rgbOld === "") {
                var oldColor = greyColor;
            } else {
                var toSend = rgbOld.replaceAll(" ", "");
                toSend = toSend.replaceAll("(", "");
                toSend = toSend.replaceAll(")", "");
                toSend = toSend.replaceAll("r", "");
                toSend = toSend.replaceAll("g", "");
                toSend = toSend.replaceAll("b", "");
                const newArrayfour = toSend.split(",");
                var oldColor = RGBtoHEX(Number(newArrayfour[0]), Number(newArrayfour[1]), Number(newArrayfour[2]));
            }
            if (oldColor === greenColor) {
                if (true) {
                    animateCSS(elem, "bounce", '1.0s');
                }
                return;
            }

            if (oldColor === yellowColor && color !== greenColor) {
                if (true) {
                    animateCSS(elem, "headShake", '1.0s');
                }
                return;
            }

            if (oldColor === greyColor && color === greyColor) {
                animateCSS(elem, "heartBeat", '1.0s');
            } else {
                animateCSS(elem, "fadeIn", '0.3s');
            }

            elem.style.backgroundColor = color;

            if (color === greyColor) {
                elem.style.color = 'rgba(255, 255, 255, 10%)';
            }
            if (color === yellowColor) {
                elem.style.color = greyColor;
            }
            if (color === greenColor) {
                elem.style.color = 'lightgrey';
            }
            break
        }
    }
}

function checkGuess() {

    isGuessCheckInProgress = true;

    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let guessString = '';
    let rightGuess = Array.from(rightGuessString);

    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString === rightGuessString) {
        cancel2 = true;
        hideMainTimer = false;
        cancel3 = true;
    }

    if (guessString.length != wordLength) {
        toastr.error("Invalid guess:\nNot enough letters!");
        row.style.backgroundColor = invalidColor;
        setTimeout(() => {
            row.style.backgroundColor = guessingRowColor;
        }, 750)
        return;
    }
    //TODO we could remove these references, and add our custom dictionary
    if (!PHARMWORDS.includes(guessString) && !WORDS.includes(guessString) && !SIXLETTERWORDS.includes(guessString) && !SEVENLETTERWORDS.includes(guessString) && !EIGHTLETTERWORDS.includes(guessString) && !THREELETTERWORDS.includes(guessString) && !FOURLETTERWORDS.includes(guessString) && !NINELETTERWORDS.includes(guessString) && !TENLETTERWORDS.includes(guessString) && !ELEVENLETTERWORDS.includes(guessString) && !TWELVELETTERWORDS.includes(guessString) && !THIRTEENLETTERWORDS.includes(guessString) && !FOURTEENLETTERWORDS.includes(guessString) && !FIFTEENLETTERWORDS.includes(guessString) && !SIXTEENLETTERWORDS.includes(guessString)) {
        toastr.error("Invalid guess:\nWord not in list!");
        row.style.backgroundColor = invalidColor;
        setTimeout(() => {
            row.style.backgroundColor = guessingRowColor;
        }, 750)
        return;
    }

    timeToGuessMinutes = fixTimeToGuessMinutes;
    timeToGuessSeconds = fixTimeToGuessSeconds;
    var timeToGuessSecondsDisplay = timeToGuessSeconds;
    var timeToGuessMinutesDisplay = timeToGuessMinutes;
    if (timeToGuessSeconds < 10) {
        timeToGuessSecondsDisplay = "0" + timeToGuessSeconds;
    } else {
        timeToGuessSecondsDisplay = timeToGuessSeconds;
    }
    if (timeToGuessMinutes < 10) {
        timeToGuessMinutesDisplay = "0" + timeToGuessMinutes;
    } else {
        timeToGuessMinutesDisplay = timeToGuessMinutes;
    }

    let yellowsLeft = rightGuess;
    entireGuessTimeChange = 0;

    for (let i = 0; i < wordLength; i++) {
        let letterColor = '';
        let box = row.children[i];
        let letter = currentGuess[i];

        // let letterPosition = rightGuess.indexOf(currentGuess[i]);
        let letterCount = (rightGuessString.match(new RegExp(currentGuess[i], "g")) || []).length;
        let currentGuessedLetterCount = (guessString.match(new RegExp(currentGuess[i], "g")) || []).length;
        if (letterCount === 0) {
            letterColor = greyColor;
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = greenColor;
                if (lettersToBeFound.includes(currentGuess[i]) && indexesToBeFound.includes(i) && mainTimerRunning) {
                    timeChange += Number(greenTimeBonus);
                }
                let newArray = [];
                let removeone = true;
                for (let j = 0; j < lettersToBeFound.length; j++) {
                    if (lettersToBeFound[j] !== currentGuess[i]) {
                        newArray.push(lettersToBeFound[j]);
                    } else {
                        if (removeone === true && indexesToBeFound.includes(i)) {
                            removeone = false;
                        } else {
                            newArray.push(lettersToBeFound[j]);
                        }
                    }
                }
                lettersToBeFound = newArray;
                let newArrayzero = [];
                for (let m = 0; m < indexesToBeFound.length; m++) {
                    if (indexesToBeFound[m] !== i) {
                        newArrayzero.push(indexesToBeFound[m]);
                    }
                }
                indexesToBeFound = newArrayzero;
                let newArraytwo = [];
                let removetwo = true;
                for (let l = 0; l < yellowsLeft.length; l++) {
                    if (yellowsLeft[l] !== currentGuess[i]) {
                        newArraytwo.push(yellowsLeft[l]);
                    } else {
                        if (removetwo === true) {
                            removetwo = false;
                        } else {
                            newArraytwo.push(yellowsLeft[l]);
                        }
                    }
                }
                yellowsLeft = newArraytwo;
            } else {
                if (!yellowsLeft.includes(currentGuess[i])) {
                    letterColor = greyColor;
                } else {
                    letterColor = yellowColor;
                    var existCount = 0;
                    if (currentGuessedLetterCount > 1 && currentGuessedLetterCount > letterCount) {
                        for (let p = i; p - 1 <= wordLength - i; p++) {
                            let temp = i + p - 2;
                            if (temp > 0) {
                                if (currentGuess[temp] == rightGuess[temp] && currentGuess[temp] == currentGuess[i]) {
                                    existCount += 1;
                                }
                            }
                        }
                        if (existCount >= letterCount) {
                            letterColor = greyColor;
                        }
                    }
                    let newArraythree = [];
                    let removethree = true;
                    for (let k = 0; k < yellowsLeft.length; k++) {
                        if (yellowsLeft[k] !== currentGuess[i]) {
                            newArraythree.push(yellowsLeft[k]);
                        } else {
                            if (removethree === true) {
                                removethree = false;
                            } else {
                                newArraythree.push(yellowsLeft[k]);
                            }
                        }
                    }
                    yellowsLeft = newArraythree;
                }
            }
        }



        if (mainTimerRunning) {
            if (letterColor === yellowColor) {
                timeChange += Number(yellowTimeBonus);
            }
            if (letterColor === greyColor) {
                timeChange -= Number(greyTimePenalty);
            }

            allowReset = false;
            totalSecondsLeft += timeChange;
            entireGuessTimeChange += timeChange;
            timeChange = 0;

            if (totalSecondsLeft > 59) {
                while (totalSecondsLeft > 59) {
                    totalMinutesLeft += 1;
                    totalSecondsLeft -= 60;
                }
            }
            if (totalSecondsLeft < 0 && totalMinutesLeft > 0) {
                while (totalSecondsLeft < 0 && totalMinutesLeft > 0) {
                    totalSecondsLeft += 60;
                    totalMinutesLeft -= 1;
                }
            }
            if (totalSecondsLeft <= 0 && totalMinutesLeft <= 0) {
                totalSecondsLeft = 1;
                totalMinutesLeft = 0;
            }
            allowReset = true;
        }


        if (true) {
            var temp = 150 * i;
        } else {
            var temp = 0;
        }
        let delay = temp;
        setTimeout(() => {
            if (true) {
                animateCSS(box, 'backInDown', '0.6s')
            }
            box.style.backgroundColor = letterColor;
            box.style.borderColor = 'white';
            box.style.color = 'white';
            shadeKeyBoard(letter, letterColor);
        }, delay)
    }

    if (mainTimerRunning) {
        var a = document.getElementById("change");
        if (entireGuessTimeChange > 0) {
            a.style.color = timeChangePositiveColor;
            a.innerHTML = "+" + entireGuessTimeChange + "s";
        }
        if (entireGuessTimeChange === 0) {
            a.style.color = noTimeChangeColor;
            a.innerHTML = "0";
        }
        if (entireGuessTimeChange < 0) {
            a.style.color = timeChangeNegativeColor;
            a.innerHTML = entireGuessTimeChange + "s";
        }
        if (guessString === rightGuessString) {
            a.innerHTML = "";
        }
    }

    if (guessString === rightGuessString) {
        postDb();
        //toastr.success("Your entry has been recorded","You guessed right!", {"timeOut": 10000});
        kept = guessesRemaining;
        row.style.backgroundColor = 'rgba(0, 0, 0, 10%)';
        guessesRemaining = 0;
        if (true) {
            onCooldown = true;
            correctGuessBounce();
        }

        setTimeout(() => {
            isGuessCheckInProgress = false;
        }, 200)
        return;
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        row.style.backgroundColor = 'rgba(0, 0, 0, 10%)';
        if (guessesRemaining > 0) {
            let temp = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining];
            temp.style.backgroundColor = guessingRowColor;
        }

        if (guessesRemaining <= 0) {
            toastr.error("You've run out of guesses! Game over!");
            //toastr.info(`The right word was: "${rightGuessString}"`);
        }
    }
    setTimeout(() => {
        isGuessCheckInProgress = false;
    }, 200)
}

function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function fireWorks() {
    var nthChild = 1;
    for (const elem of document.getElementsByClassName("firework")) {
        if (nthChild !== 3) {
            elem.hidden = false;
            elem.style.animation = "firework 2.5s infinite";
            await delay(400);
        }
        nthChild += 1;
    }
    setTimeout(() => {
        hideFireWorks();
    }, 3499)
}

async function hideFireWorks() {
    var nthChild = 1;
    for (const elem of document.getElementsByClassName("firework")) {
        if (nthChild !== 3) {
            elem.hidden = true;
            elem.style.animation = "none";
            await delay(400);
        }
        nthChild += 1;
    }
}

async function postDb() {
  //TODO: Database entry go here
  //Capture the Stopwatch, num of guesses, and UserId
  //Post it to the DB

  let uid = getCookie("userId");
  let g = (NUMBER_OF_GUESSES - guessesRemaining) + 1;
  const currentDate = new Date();
  const options = {
    timeZone: 'America/Denver', // Change to desired time zone
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Set to true for 12-hour format
    };
  const dateString = currentDate.toLocaleString('en-US', options);


  const data = {
  id: uid,
  name: '',
  guesses: g,
  time: dateString
  };

  const response = await fetch('http://localhost:5000/add_entry', {
      method: 'POST', // Specify the request method
      headers: {
          'Content-Type': 'application/json' // Specify the content type
      },
      body: JSON.stringify(data) // Convert the data object to a JSON string
  })
  if (response){
    toastr.success("Your entry has been recorded","You guessed right!", {"timeOut": 10000});
  }
}

async function correctGuessBounce() {
    await delay((200 * wordLength) - (wordLength * 3));
    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - kept];
    for (let i = 0; i < wordLength; i++) {
        let box = row.children[i];
        await delay(100);
        animateCSS(box, 'bounce', '1.0s');
    }

    onCooldown = false;
    await delay(1000);
    fireWorks();
}

document.getElementById("error").innerHTML = "";

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        if (guessesRemaining > 0) {
            checkGuess();
        }
        return;
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return;
    } else {
        insertLetter(pressedKey);
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;

    if (!target.classList.contains("keyboard-button")) {
        return;
    }
    let key = target.textContent;

    if (key === "Del") {
        key = "Backspace";
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}));
})

var cancel = false;


const animateCSS = (element, animation, time, prefix = 'animate__') => new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', time);

    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});
