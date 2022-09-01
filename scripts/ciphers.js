const alphabetROT47 = ["!", "\"", ",", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "[", "\\", "]", "^", "_", "`",
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"
];
const alphabetNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const alphabetScrabble = ["1", "3", "4", "1", "1", "4", "2", "2", "1", "6", "4", "2", "3", "1", "2", "4", "10", "1", "1", "1", "1", "6", "3", "8", "10", "3", "6", "8", "6"];
const alphabetMorse = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", ".-.-", "---.", "..--", "...--..", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", "-----"];
const alphabetRome = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "L", "C", "D", "M"];
const alphabetRomeClear = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "50", "100", "500", "1000"];

const descriptionROT5 = "Die Zahlen 0-9 werden um 5 Positionen zyklisch verschoben, d.h. aus '0' wird '5', aus '6' wird '1', usw. Alle anderen Zeichen bleiben unverändert. Die Umwandlung funktioniert in beide Richtungen.";
const descriptionROT13 = "Die Buchstaben A-Z,a-z werden um 13 Positionen verschoben, d.h. aus 'a' wird 'n', aus 'b' wird 'o', usw. Alle anderen Zeichen bleiben unverändert. Als Erweiterung kann man die Verschiebung/Rotation über den Slider vorgeben. Die Umwandlung funktioniert in beide Richtungen.";
const descriptionROT47 = "Alle ASCII Zeichen mit dem Wert 33 bis 126 werden um 47 Positionen verschoben, alle anderen Zeichen bleiben unverändert.";
const descriptionMorse = "Der Morsecode (auch Morsealphabet oder Morsezeichen genannt) ist ein gebräuchlicher Code zur telegrafischen Übermittlung von Buchstaben, Ziffern und weiterer Zeichen. Die Angabe ist mit \".\" für \"kurz\" bzw. \"-\" für \"lang\" zu machen. Die einzelnen Zeichen sind mit einem \ oder Leerzeichen zu trennen";
const descriptionScrabble = "A-Z,a-z und die Umlaute werden in die entsprechenden Scrabble-Buchstabenwerte (a=1,b=3,...) übersetzt und die Summe berechnet. Alle anderen Zeichen werden als '_' dargestellt. Da die Scrabble Werte nicht eindeutig sind, funktioniert die Umwandlung nur in eine Richtung.";
const descriptionRome = "Römische Zahlen können in die Arabischen Zahlen konvertiert werden. Das geht in beide Richtungen. Links stehen die römischen Ziffern, rechts die arabischen";
const descriptionSkytale = "Die Skytale (altgriechisch σκυτάλη skytálē, „Stock“, „Stab“) ist das älteste bekannte militärische Verschlüsselungsverfahren. Von den Spartanern wurden bereits vor mehr als 2500 Jahren geheime Botschaften nicht im Klartext übermittelt. Zur Verschlüsselung diente ein (Holz-)Stab mit einem bestimmten Durchmesser (Skytale). Die Skytale gehört zu den kryptographischen Transpositionsverfahren."

//functions
function computeQS(input) {
  qs = 0;
  for (let element of input.toString().split("")) {
    qs = qs + parseInt(element);
  }
  return qs;
}

function computeSum(base) {
  let sumBWW = 0;
  for (let element of base) {
    if (typeof element === "number") {
      sumBWW = sumBWW + element;
    }
  }
  return sumBWW;
}

function transformScrabble(inputText) {
  outputText = [];
  for (let element of inputText) {
    index = alphabetBWW.indexOf(String(element).toUpperCase());
    if (index >= alphabetScrabble.length) {
      //outputText.push("_");
    } else {
      outputText.push(Number(alphabetScrabble[index]));
    }
  }
  return outputText;
}

function transformRome(inputText, direction) {
  outputText = [];
  transformedList = [];
  toSumUp = [];
  let i = 0;
  inputLength = inputText.length;
  if (direction == 1) {
    while (i < inputLength) {
      if (alphabetRome.includes(inputText[i])) {
        let checkFurther;
        if (inputLength - i - 1 > 3) {
          checkFurther = 3;
        } else {
          checkFurther = inputLength - i - 1;
        }
        checkFurtherLoop:
          for (let j = checkFurther; j >= 0; j--) {
            let checkIt = [];
            for (let k = 0; k <= j; k++) {
              checkIt.push(inputText[i + k]);
            }
            if (alphabetRome.includes(checkIt.join(""))) {
              transformedList.push(Number(alphabetRomeClear[alphabetRome.indexOf(checkIt.join(""))]));
              i = i + j;
              break checkFurtherLoop;
            }
          }
      } else {
        outputText = "Keine valide römische Zahl";
        return outputText;
      }
      i++;
    }
    i = 1;
    while (i <= transformedList.length) {
      if (i != transformedList.length) {
        if (transformedList[i - 1] < transformedList[i]) {
          subtracted = transformedList[i] - transformedList[i - 1];
          toSumUp.push(subtracted);
          i++;
        } else {
          toSumUp.push(transformedList[i - 1]);
        }
      } else if (i === transformedList.length) {
        if (i === 1) {
          toSumUp.push(transformedList[i - 1]);
        } else {
          if (transformedList[i - 2] >= transformedList[i - 1]) {
            toSumUp.push(transformedList[i - 1]);
          } else {
            toSumUp.push(transformedList[i - 1] - transformedList[i - 2]);
          }
        }
      }
      i++;
    }
    outputText = computeSum(toSumUp);
  }
  if (direction == -1) {
    outputText = "not implemented yet";
  }
  return outputText;
}

function transformROT(inputText, direction) {
  //Decrypts or encrypts inputText based on the alphabets in the given direction
  outputText = [];
  for (let alphabet of alphabets) {
    for (let element of inputText) {
      index = alphabet.indexOf(element);
      let targetLetterIndex = -1;
      if (index != -1) {
        alphaLen = alphabet.length;
        if (index + n >= alphaLen && direction === 1) {
          targetLetterIndex = index + n - alphaLen;
        } else if (index - n < 0 && direction === -1) {
          targetLetterIndex = alphaLen - index - n;
        } else {
          targetLetterIndex = index + n * direction;
        }
        outputText.push(alphabet[targetLetterIndex]);
      }
    }
  }
  return outputText;
}

function transformMorse(inputText, direction) {
  outputText = [];
  if (direction == 1) {
    inputTextSplitted = inputText.split(/[\s/]/);
    for (let element of inputTextSplitted) {
      if (alphabetMorse.includes(element)) {
        index = alphabetMorse.indexOf(element);
        outputText.push(alphabetBWW[index]);
      } else {
        outputText.push("_");
      }
    }
  }
  if (direction == -1) {
    inputTextSplitted = inputText.split("");
    for (let element of inputTextSplitted) {
      if (alphabetBWW.includes(String(element).toUpperCase())) {
        index = alphabetBWW.indexOf(String(element).toUpperCase());
        outputText.push(alphabetMorse[index]);
      } else {
        outputText.push("_");
      }
      outputText.push(" ");
    }
  }
  return outputText;
}

function transformSkytale(inputText, direction) {
  outputText = [];
  let inputLength = inputText.length;
  //console.log(Math.ceil(inputLength/n));
  n = 3
  //for (let i = 0; i < Math.ceil(inputLength/n); i++){
  if (direction == -1) {
    for (let i = 0; i < n; i++) {
      let j = i;
      //console.log("i: " + i)
      //while (j < inputLength){
      while (j < inputLength) {
        //console.log("j:" + j + " adding: " + inputText[j]);
        outputText.push(inputText[j])
        //console.log(outputText);
        j = j + n;
        //console.log("j is " + j)
      }
    }
  }
  /*if (direction = 1){
    let extraRuns = inputLength%n;
    let jumpWidth = Math.floor(inputLength/n);
    outerLoop:
    for (let i = 0; i <= jumpWidth; i++){
      let j = i;
      console.log("reset j")
      while (j < inputLength){
        outputText.push(inputText[j])
        console.log("j is: " + j + " jumpWidth " + jumpWidth + " extraRuns " + extraRuns + " letter: " + inputText[j]);
        if (i == jumpWidth && extraRuns > 0){
          console.log("last run")
          j = j + Number(jumpWidth) + 1;
          extraRuns--;
        } 
        if (i < n){
          console.log("normal run")
          j = j + Number(jumpWidth) + 1 ;
        }
        if (extraRuns == 0) {
          break outerLoop;
        }
        console.log("updated: j is: " + j + " jumpWidth " + jumpWidth + " extraRuns " + extraRuns);
      }
       
    }
  }*/
  if (direction == 1) {
    let jumpWidth = Math.ceil(inputLength / n);
    for (let i = 0; i < Math.ceil(inputLength / n); i++) {
      let j = 0;
      let index = 0;
      while (j < n) {
        index = i + j * jumpWidth;
        console.log("inpLen:" + inputLength + " i:" + i + " j:" + j + " jumpWi:" + jumpWidth + " index: " + index + " MaxOuterLoop: " + Math.ceil(inputLength / n));
        if (index < inputLength) {
          outputText.push(inputText[index]);
        }
        j++;
      }
      console.log(outputText);
    }
  }
  return outputText;
}

function updateRotNumber() {
  //Update the shift by change of the slider
  n = Number(document.querySelector("#rotNumberSlider").value);
  setTitle();
  setMappingTable();
}