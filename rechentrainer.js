// ======================================================
// RECHENTRAINER CLI (Node.js)
// Start:
// node rechentrainer.js easy 10
// node rechentrainer.js medium 20
// node rechentrainer.js hard 30
//
// Erweiterungen enthalten:
// ✓ Schwierigkeitsgrade
// ✓ Mehr Rechenarten
// ✓ Division ohne Kommazahlen
// ✓ Begrenzte Rundenzahl
// ✓ Highscore speichern
// ======================================================

const readline = require("readline");
const fs = require("fs");

// ------------------------------------------------------
// Programmeinstellungen
// ------------------------------------------------------

const difficulty = process.argv[2] || "easy";
const maxRounds = Number(process.argv[3]) || 0;
const highscoreFile = "highscore.txt";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let score = 0;
let currentRound = 0;
let correctAnswer = 0;

// ------------------------------------------------------
// Hilfsfunktionen
// ------------------------------------------------------

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMaxNumber() {
  if (difficulty === "easy") return 10;
  if (difficulty === "medium") return 50;
  if (difficulty === "hard") return 100;

  console.log("Unbekannte Schwierigkeit. Nutze easy.");
  return 10;
}

// ------------------------------------------------------
// Highscore
// ------------------------------------------------------

function readHighscore() {
  if (!fs.existsSync(highscoreFile)) {
    return 0;
  }

  const content = fs.readFileSync(highscoreFile, "utf8");
  return Number(content) || 0;
}

function saveHighscoreIfNeeded() {
  const highscore = readHighscore();

  if (score > highscore) {
    fs.writeFileSync(highscoreFile, String(score));
    console.log(`🏆 Neuer Highscore: ${score}`);
  } else {
    console.log(`Aktueller Highscore: ${highscore}`);
  }
}

// ------------------------------------------------------
// Aufgaben erstellen
// ------------------------------------------------------

function createDivisionTask() {
  const result = getRandomNumber(1, 10);
  const divisor = getRandomNumber(1, 10);
  const dividend = result * divisor;

  correctAnswer = result;

  return `${dividend} / ${divisor}`;
}

function createTask() {
  const maxNumber = getMaxNumber();

  const number1 = getRandomNumber(1, maxNumber);
  const number2 = getRandomNumber(1, maxNumber);

  const operators = ["+", "-", "*", "/"];
  const operator = operators[
    getRandomNumber(0, operators.length - 1)
  ];

  switch (operator) {
    case "+":
      correctAnswer = number1 + number2;
      return `${number1} + ${number2}`;

    case "-":
      correctAnswer = number1 - number2;
      return `${number1} - ${number2}`;

    case "*":
      correctAnswer = number1 * number2;
      return `${number1} * ${number2}`;

    case "/":
      return createDivisionTask();
  }
}

// ------------------------------------------------------
// Spielsteuerung
// ------------------------------------------------------

function finishTraining() {
  console.log("\n========================");
  console.log("Training beendet");
  console.log(`Punkte: ${score}`);
  console.log("========================");

  saveHighscoreIfNeeded();
  rl.close();
}

function askTask() {
  if (maxRounds > 0 && currentRound >= maxRounds) {
    finishTraining();
    return;
  }

  currentRound++;

  const task = createTask();

  rl.question(
    `\nAufgabe ${currentRound}: ${task} = `,
    (input) => {

      if (input.toLowerCase() === "exit") {
        finishTraining();
        return;
      }

      const userAnswer = Number(input);

      if (Number.isNaN(userAnswer)) {
        console.log("Bitte eine gültige Zahl eingeben.");
        currentRound--;
        askTask();
        return;
      }

      if (userAnswer === correctAnswer) {
        score++;
        console.log("✅ Richtig!");
      } else {
        console.log(
          `❌ Falsch. Richtige Antwort: ${correctAnswer}`
        );
      }

      console.log(`Punkte: ${score}`);

      askTask();
    }
  );
}

// ------------------------------------------------------
// Programmstart
// ------------------------------------------------------

console.log("================================");
console.log("      RECHENTRAINER CLI");
console.log("================================");
console.log(`Schwierigkeit: ${difficulty}`);
console.log(`Highscore: ${readHighscore()}`);

if (maxRounds > 0) {
  console.log(`Aufgaben: ${maxRounds}`);
} else {
  console.log("Aufgaben: Unbegrenzt");
}

console.log("Zum Beenden: exit");

askTask();

/*
=========================================================
ERWEITERUNG 1: ZEITLIMIT PRO AUFGABE
=========================================================

Idee:
Der Benutzer hat z.B. nur 10 Sekunden Zeit.

Benötigt:
- setTimeout()
- Timer zurücksetzen
- Automatische Wertung bei Zeitablauf

Beispiel:

let timer;

function startTimer() {
  timer = setTimeout(() => {
    console.log("Zeit abgelaufen!");
    askTask();
  }, 10000);
}

Komplexität:
Mittel
Weil Timer gestoppt und neu gestartet werden müssen.
*/

/*
=========================================================
ERWEITERUNG 2: AUFGABEN-HISTORIE
=========================================================

Idee:
Alle Aufgaben speichern.

const history = [];

history.push({
  task: "5 + 3",
  answer: 8,
  userAnswer: 7,
  correct: false
});

Am Ende:

console.table(history);

Komplexität:
Mittel
Weil Objekte und Arrays verwendet werden.
*/

/*
=========================================================
ERWEITERUNG 3: LEVELSYSTEM
=========================================================

Idee:
Alle 5 Punkte steigt das Level.

Beispiel:

let level = 1;

if (score % 5 === 0) {
  level++;
}

Dadurch werden Aufgaben automatisch schwerer.

Komplexität:
Einfach bis Mittel
*/

/*
=========================================================
ERWEITERUNG 4: KATEGORIEN
=========================================================

Mögliche Modi:

- plus
- minus
- mal
- division
- gemischt

Aufruf:

node rechentrainer.js plus

Dafür müsste createTask()
den Operator anhand eines Modus auswählen.

Komplexität:
Mittel
*/

/*
=========================================================
ERWEITERUNG 5: BESTENLISTE
=========================================================

Aktuell gibt es nur einen Highscore.

Stattdessen:

[
  { name: "Anna", score: 15 },
  { name: "Max", score: 12 },
  { name: "Tom", score: 10 }
]

Speicherung in:

highscores.json

Benötigt:
- JSON.parse()
- JSON.stringify()
- Sortierung

Komplexität:
Fortgeschritten
*/

/*
=========================================================
ERWEITERUNG 6: FARBIGE AUSGABEN
=========================================================

Paket:

npm install chalk

Beispiel:

const chalk = require("chalk");

console.log(chalk.green("Richtig"));
console.log(chalk.red("Falsch"));

Komplexität:
Einfach
*/

/*
=========================================================
ERWEITERUNG 7: MULTIPLAYER
=========================================================

Spieler eingeben:

Name:
Sandro

Name:
Max

Abwechselnd Aufgaben lösen.

Punkte werden getrennt gezählt.

Komplexität:
Fortgeschritten
Weil mehrere Spielerzustände verwaltet werden müssen.
*/
