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
let alphabetBWW = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z", "Ä", "Ö", "Ü", "ß", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let alphabetUppercase = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
let alphabetLowercase = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
let alphabetROT47 = ["!","\"",",","#","$","%","&","'","(",")","*","+",",","-",".","/",
  "0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@",
  "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
  "[","\\","]","^","_","`",
  "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}","~"];
let descriptionBWW = "Hilfe: A-Z,ÄÖÜ,a-z,äöüß werden in die entsprechenden Buchstabenwerte (a=1,b=2,...,ä=27,ö=28,ü=29,ß=30) übersetzt und der Wortwert (Summe) berechnet. Alle anderen Zeichen werden als '_' dargestellt und in der Gesamtsumme nicht berücksichtigt. Das ganze geht natürlich auch rückwärts. Die Zuordnung kann wahlweise umgekehrt werden (a=26,b=25,...,z=1). Umlaute haben bei dieser Wandlung keine Entsprechung. Wenn 'Summe pro Zeile' ausgewählt wird, wird je Zeile im Feld 'Text' die Summe der Buchstabenwerte berechnet."
let descriptionROT13 = "Die Buchstaben A-Z,a-z werden um 13 Positionen verschoben, d.h. aus 'a' wird 'n', aus 'b' wird 'o', usw. Alle anderen Zeichen bleiben unverändert. Als Erweiterung kann man die Verschiebung/Rotation vorgeben. Dabei hat die Rotation um den Wert 0 eine Sonderstellung: Sie erzeugt alle möglichen Rotationen von 1 bis 25. Die Umwandlung funktioniert in beide Richtungen.";
let descriptionROT47 = "Alle ASCII Zeichen mit dem Wert 33 bis 126 werden um 47 Positionen verschoben, alle anderen Zeichen bleiben unverändert."


//Initially build-Up the Page
updateCipher();
setTitle();
setMappingTable();

//Functions
function encryptText(e) {
  //Prevent natural behaviour
  e.preventDefault();
  if (ciphertype == "ROT13") {
    output.value = transformROT13(input.value, 1).join("");
  }
  if (ciphertype == "ROT47") {
    output.value = transformROT13(input.value, 1).join("");
  }
  if (ciphertype == "Buchstabenwortwert") {
    outputText = transformBWW(input.value, 1);
    sumBWW = computeSum(outputText);
    outputText =
      outputText.join(" ") + " Σ " + sumBWW + " QS: " + computeQS(sumBWW);
    output.value = outputText;
  }
}

function decryptText(e) {
  //Prevent natural behaviour
  e.preventDefault();
  if (ciphertype == "ROT13") {
    input.value = transformROT13(output.value, -1).join("");
  }
  if (ciphertype == "ROT47") {
    input.value = transformROT13(output.value, -1).join("");
  }
  if (ciphertype == "Buchstabenwortwert") {
    input.value = transformBWW(output.value, -1).join(" ");
  }
}

function updateCipher() {
  ciphertype = cipher.options[cipher.selectedIndex].text;
  //remove additional controls
  while (additionalControls.firstChild) {
    additionalControls.removeChild(additionalControls.firstChild);
  }

  if (ciphertype == "ROT13") {
    alphabets = [alphabetUppercase, alphabetLowercase];
    n = 13;
    addAdditionalControls();
    description.innerHTML = descriptionROT13;
    //encrypt.style.visibility = "visible";
  }
  if (ciphertype == "ROT47") {
    alphabets = [alphabetROT47];
    description.innerHTML = descriptionROT47;
    //encrypt.style.visibility = "visible";
  }
  if (ciphertype == "Buchstabenwortwert") {
    alphabets = [alphabetBWW];
    description.innerHTML = descriptionBWW;
    //encrypt.style.visibility = "hidden";
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
  //console.log("current n " + n);
  outputText = [];
  for (let alphabet of alphabets) {
    for (let element of inputText) {
      index = alphabet.indexOf(element);
      let targetLetterIndex = -1;
      if (index != -1) {
        alphaLen = alphabet.length;
        if (index + n >= alphaLen && direction === 1) {
          //console.log("index + n >= alphabet.length && direction === 1");
          //console.log("index: " + index + " n: " + n + " alpha.len: " + alphaLen)
          targetLetterIndex = index + n - alphaLen;
          //console.log("targetLetterIndex: " + targetLetterIndex)
        } else if (index - n < 0 && direction === -1) {
          //console.log("index - n < 0 && direction === -1")
          targetLetterIndex = alphaLen - index - n;
        } else {
          //console.log("else")
          targetLetterIndex = index + n * direction;
        }
        //console.log("letter " + element + " with index " + index + " -> "
        //  + alphabet[targetLetterIndex] + " with index " + targetLetterIndex
        //  + " by n=" + n + " and alphabeth length of " + alphaLen);
        outputText.push(alphabet[targetLetterIndex]);
      } else {
        //console.log("index is -1")
      }
    }
  }
  //console.log("result: " + outputText);
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
  n = document.querySelector("#rotNumberSlider").value;
  //console.log("current slider position is: " + n);
  setTitle();
  setMappingTable();
}

function setMappingTable(){
  while (mappingTables.firstChild) {
    mappingTables.removeChild(mappingTables.firstChild);
  }
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
      if (ciphertype == "ROT13") {
        transformedLetter = transformROT13(element, 1);
      }
      if (ciphertype == "ROT47") {
        transformedLetter = transformROT13(element, 1);;
      }
      if (ciphertype == "Buchstabenwortwert") {
        transformedLetter = transformBWW(element, 1);
      }
      letterBoxBottom.appendChild(document.createTextNode(transformedLetter));
      letterBoxCol.appendChild(letterBoxBottom);

      
      newMappingTable.appendChild(letterBoxCol);
    }
    mappingTables.appendChild(newMappingTable);
  }
}
/*function setMappingTable() {
  while (mappingTable.firstChild) {
    mappingTable.removeChild(mappingTable.firstChild);
  }
  for (let alphabet of alphabets) {
    const newTable = document.createElement("table");
    newTable.classList.add("mappingTable");
    const firstRow = document.createElement("tr");
    for (let element of alphabet) {
      const cell = document.createElement("td");
      cell.appendChild(document.createTextNode(element));
      firstRow.appendChild(cell);
    }
    const secondRow = document.createElement("tr");
    for (let element of alphabet) {
      const cell = document.createElement("td");
      if (ciphertype == "ROT13") {
        transformedLetter = transformROT13(element, 1);
      }
      if (ciphertype == "ROT47") {
        transformedLetter = transformROT13(element, 1);
      }
      if (ciphertype == "Buchstabenwortwert") {
        transformedLetter = transformBWW(element, 1);
      }
      //console.log(element + "->" + transformedLetter)
      cell.appendChild(document.createTextNode(transformedLetter));
      secondRow.appendChild(cell);
    }
    /*secondRow.forEach(function(alphabet){
      const cell = document.createElement("td");
      cell.appendChild(document.createTextNode(transform(alphabets, element)));
      secondRow.appendChild(cell);
    });
    newTable.appendChild(firstRow);
    newTable.appendChild(secondRow);
    mappingTable.appendChild(newTable);
  }
}*/

function setTitle() {
  if (ciphertype == "ROT13") {
    title.innerHTML = "ROT" + n;
  } else if (ciphertype == "ROT47"){
    title.innerHTML = "ROT47";
  } else if (ciphertype == "Buchstabenwortwert") {
    title.innerHTML = "Buchstabenwortwert";
  } else {
    title.innerHTML = "unknown";
  }
}

function addAdditionalControls() {
  //Update the shift by change of the slider
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "1";
  slider.max = "26";
  slider.value = "13";
  slider.setAttribute("id", "rotNumberSlider");
  slider.addEventListener("input", updateRotNumber);
  additionalControls.appendChild(slider);
}
