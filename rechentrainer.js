// Einfacher Rechentrainer mit Node.js
// Start: node rechentrainer.js

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let punkte = 0;
let runde = 0;
let richtigeAntwort = 0;

function zufallszahl(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function neueAufgabe() {
  let zahl1 = zufallszahl(1, 10);
  let zahl2 = zufallszahl(1, 10);
  let rechenart = zufallszahl(1, 4);

  let aufgabe = "";

 switch (rechenart){
   case 1:
     richtigeAntwort = zahl1 + zahl2;
     aufgabe = zahl1 + " + " + zahl2;
     break;

   case 2:
     richtigeAntwort = zahl1 - zahl2;
     aufgabe = zahl1 + " + " + zahl2;
     break;

   case 3:
     richtigeAntwort = zahl1 * zahl2;
     aufgabe = zahl1 + " * " + zahl2;
     break;

   case 4:
     richtigeAntwort = zahl1 / zahl2;
     aufgabe = zahl1 + " / " + zahl2;
 }

  return aufgabe;
}

function frageStellen() {
  runde++;

  let aufgabe = neueAufgabe();

  rl.question("Aufgabe " + runde + ": " + aufgabe + " = ", function(eingabe) {
    if (eingabe === "exit") {
      spielBeenden();
      return;
    }

    let antwort = Number(eingabe);

    if (antwort === richtigeAntwort) {
      punkte++;
      console.log("Richtig!");
    } else {
      console.log("Falsch. Die richtige Antwort ist: " + richtigeAntwort);
    }

    console.log("Punkte: " + punkte);
    console.log("");

    frageStellen();
  });
}

function spielBeenden() {
  console.log("");
  console.log("Spiel beendet.");
  console.log("Deine Punkte: " + punkte);

  rl.close();
}

console.log("RECHENTRAINER");
console.log("Gib exit ein, um zu beenden.");
console.log("");

frageStellen();