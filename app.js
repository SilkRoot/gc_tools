//Select DOM
const decrypt = document.querySelector("#decrypt");
const encrypt = document.querySelector("#encrypt");
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const mappingTables = document.querySelector("#mappingTables");
const additionalControls = document.querySelector("#additionalControls");
const title = document.querySelector("#title");
const cipher = document.querySelector("#cipher");
const description = document.querySelector("#description");

//Event Listeners
decrypt.addEventListener("click", decryptText);
encrypt.addEventListener("click", encryptText);
cipher.addEventListener("change", updateCipher);

//Global Variables
let ciphertype = "";
let n = -1;
let alphabets = [];

//Cipher Alphabets
const alphabetBWW = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z", "Ä", "Ö", "Ü", "ß", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const alphabetUppercase = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
const alphabetLowercase = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const alphabetROT47 = ["!","\"",",","#","$","%","&","'","(",")","*","+",",","-",".","/",
  "0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@",
  "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
  "[","\\","]","^","_","`",
  "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}","~"];
const alphabetNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const alphabetMorse = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", ".-.-", "---.", "..--", "...--..", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", "-----"];
const descriptionBWW = "A-Z,ÄÖÜ,a-z,äöüß werden in die entsprechenden Buchstabenwerte übersetzt. Zahlen behalten ihren Wert. Das genaue Mapping für alle Buchstaben ist unten in der Mappingtabelle zu finden. Zusätzlich wird die Summe und die Quersumme der Summe berechnet und angezeigt. Alle anderen Zeichen werden als '_' dargestellt und in der Gesamtsumme nicht berücksichtigt. Das ganze geht natürlich auch rückwärts außer für die Zahlen.";
const descriptionROT5 = "Die Zahlen 0-9 werden um 5 Positionen zyklisch verschoben, d.h. aus '0' wird '5', aus '6' wird '1', usw. Alle anderen Zeichen bleiben unverändert. Die Umwandlung funktioniert in beide Richtungen.";
const descriptionROT13 = "Die Buchstaben A-Z,a-z werden um 13 Positionen verschoben, d.h. aus 'a' wird 'n', aus 'b' wird 'o', usw. Alle anderen Zeichen bleiben unverändert. Als Erweiterung kann man die Verschiebung/Rotation über den Slider vorgeben. Die Umwandlung funktioniert in beide Richtungen.";
const descriptionROT47 = "Alle ASCII Zeichen mit dem Wert 33 bis 126 werden um 47 Positionen verschoben, alle anderen Zeichen bleiben unverändert.";
const descriptionMorse = "Der Morsecode (auch Morsealphabet oder Morsezeichen genannt) ist ein gebräuchlicher Code zur telegrafischen Übermittlung von Buchstaben, Ziffern und weiterer Zeichen. Die Angabe ist mit \".\" für \"kurz\" bzw. \"-\" für \"lang\" zu machen. Die einzelnen Zeichen sind mit einem \ oder Leerzeichen zu trennen";

//Initially build-Up the Page
updateCipher();
setTitle();
setMappingTable();

//Functions
function encryptText(e) {
  //Prevent natural behaviour
  e.preventDefault();
  if (ciphertype == "ROT5" || ciphertype == "ROT13" || ciphertype == "ROT47") {
    input.value = transformROT13(output.value, -1).join("");
  }
  if (ciphertype == "Buchstabenwortwert") {
    input.value = transformBWW(output.value, -1).join("");
  }
  if (ciphertype == "Morsen") {
    input.value = transformMorse(output.value, -1).join(" ");
  }
}

function decryptText(e) {
  //Prevent natural behaviour
  e.preventDefault();
  if (ciphertype == "ROT5" || ciphertype == "ROT13" || ciphertype == "ROT47") {
    output.value = transformROT13(input.value, 1).join("");
  }
  if (ciphertype == "Buchstabenwortwert") {
    outputText = transformBWW(input.value, 1);
    sumBWW = computeSum(outputText)
    output.value = outputText.join(" ") + " Σ " + sumBWW + " QS: " + computeQS(sumBWW);
  }
  if (ciphertype == "Morsen") {
    output.value = transformMorse(input.value, 1).join(" ");
  }
}

function updateCipher() {
  ciphertype = cipher.options[cipher.selectedIndex].text;
  //remove additional controls
  while (additionalControls.firstChild) {
    additionalControls.removeChild(additionalControls.firstChild);
  }
  if (ciphertype == "ROT5") {
    alphabets = [alphabetNumbers];
    n = 5;
    addAdditionalControls();
    description.innerHTML = descriptionROT5;
  }
  if (ciphertype == "ROT13") {
    alphabets = [alphabetUppercase, alphabetLowercase];
    n = 13;
    addAdditionalControls();
    description.innerHTML = descriptionROT13;
  }
  if (ciphertype == "ROT47") {
    alphabets = [alphabetROT47];
    description.innerHTML = descriptionROT47;
  }
  if (ciphertype == "Buchstabenwortwert") {
    alphabets = [alphabetBWW];
    description.innerHTML = descriptionBWW;
  }
  if (ciphertype == "Morsen") {
    alphabets = [alphabetMorse];
    description.innerHTML = descriptionMorse;
  }
  setTitle();
  setMappingTable();
}

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

function transformROT13(inputText, direction) {
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
  if (direction == 1){
    inputTextSplitted = inputText.split(/[\s/]/);
    for (let element of inputTextSplitted) {
      if (alphabets[0].includes(element)){
        index = alphabetMorse.indexOf(element);
        outputText.push(alphabetBWW[index]);
      } else {
        outputText.push("_");
      }
    }
  }
  if (direction == -1){
    inputTextSplitted = inputText.split("");
    for (let element of inputTextSplitted) {
      if (alphabetBWW.includes(String(element).toUpperCase())){
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

function transformBWW(inputText, direction) {
  outputText = [];
  if (direction == 1) {
    for (let element of inputText) {
      if (isNaN(element)) {
        let toConvert = String(element);
        if (toConvert === "ß") {
          index = alphabets[0].indexOf(toConvert);
          index = index + 1;
        } else if (toConvert === " ") {
          index = " ";
        } else {
          index = alphabets[0].indexOf(String(element).toUpperCase());
          index = index + 1;
        }
      } else {
        index = element;
      }
      outputText.push(index);
    }
  }
  if (direction == -1) {
    inputTextSplitted = inputText.split(" ");
    for (let element of inputTextSplitted) {
      outputText.push(alphabets[0][element - 1]);
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

function setMappingTable(){
  while (mappingTables.firstChild) {
    mappingTables.removeChild(mappingTables.firstChild);
  }
  let headlineMapping = document.createElement("h3");
  headlineMapping.appendChild(document.createTextNode("Mapping-Tables"));
  mappingTables.appendChild(headlineMapping);

  for (let alphabet of alphabets) {
    const newMappingTable = document.createElement("div");
    newMappingTable.classList.add("mappingTable");
    for (let element of alphabet){
      const letterBoxCol = document.createElement("div");
      letterBoxCol.classList.add("letterBoxCol");
      //Top
      const letterBoxTop = document.createElement("p");
      letterBoxTop.appendChild(document.createTextNode(element));
      letterBoxCol.appendChild(letterBoxTop);
      //Bottom
      const letterBoxBottom = document.createElement("p");
      let transformedLetter = "";
      if (ciphertype == "ROT5" ||  ciphertype == "ROT13" || ciphertype == "ROT47" ) {
        transformedLetter = transformROT13(element, 1);
      }
      if (ciphertype == "Buchstabenwortwert") {
        transformedLetter = transformBWW(element, 1);
      }
      if (ciphertype == "Morsen") {
        transformedLetter = transformMorse(element, 1);
      }
      letterBoxBottom.appendChild(document.createTextNode(transformedLetter));
      letterBoxCol.appendChild(letterBoxBottom);
      
      newMappingTable.appendChild(letterBoxCol);
    }
    mappingTables.appendChild(newMappingTable);
  }
}

function setTitle() {
  if (ciphertype == "ROT5" || ciphertype == "ROT13") {
    title.innerHTML = "ROT" + n;
  } else if (ciphertype == "ROT47"){
    title.innerHTML = "ROT47";
  } else if (ciphertype == "Buchstabenwortwert") {
    title.innerHTML = "Buchstabenwortwert";
  } else if (ciphertype == "Morsen") {
    title.innerHTML = "Morse-Code";
  } else {
    title.innerHTML = "unknown";
  }
}

function addAdditionalControls() {
  //Update the shift by change of the slider
  const slider = document.createElement("input");
  if (ciphertype == "ROT5") {
    slider.min = "0";
    slider.max = "9";
    slider.value = "5";
  }
  if (ciphertype == "ROT13") {
    slider.min = "1";
    slider.max = "26";
    slider.value = "13";
  }
  slider.type = "range";
  slider.setAttribute("id", "rotNumberSlider");
  slider.addEventListener("input", updateRotNumber);
  additionalControls.appendChild(slider);
}
