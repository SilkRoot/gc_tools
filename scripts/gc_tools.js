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
const descriptionInput = document.querySelector("#descriptionInput");
const descriptionOutput = document.querySelector("#descriptionOutput");

//Event Listeners
decrypt.addEventListener("click", decryptText);
encrypt.addEventListener("click", encryptText);
cipher.addEventListener("change", updateCipher);
nav_icon.addEventListener("click", openCloseNav);

//Global Variables
let ciphertype = "";
let n = -1;
let alphabets = [];

//BWW Alphabets and description
const alphabetBWW = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z", "Ä", "Ö", "Ü", "ß", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const alphabetUppercase = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
const alphabetLowercase = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const descriptionBWW = "A-Z,ÄÖÜ,a-z,äöüß werden in die entsprechenden Buchstabenwerte übersetzt. Zahlen behalten ihren Wert. Das genaue Mapping für alle Buchstaben ist unten in der Mappingtabelle zu finden. Zusätzlich wird die Summe und die Quersumme der Summe berechnet und angezeigt. Alle anderen Zeichen werden als '_' dargestellt und in der Gesamtsumme nicht berücksichtigt. Das ganze geht natürlich auch rückwärts außer für die Zahlen.";

//Initially build-Up the Page
updateCipher();
setTitle();
setMappingTable();


//Functions
function encryptText(e) {
  //Prevent natural behaviour
  e.preventDefault();
  if (ciphertype == "rot5" || ciphertype == "rot13" || ciphertype == "rot47") {
    input.value = transform(output.value, -1).join("");
  }
  if (ciphertype == "bww") {
    input.value = transformBWW(output.value, -1).join("");
  }
  if (ciphertype == "morse") {
    input.value = transformMorse(output.value, -1).join(" ");
  }
  if (ciphertype == "rome") {
    input.value = transformRome(output.value, -1);
  }
  if (ciphertype == "skytale") {
    input.value = transformSkytale(output.value, -1);
  }
}

function decryptText(e) {
  //Prevent natural behaviour
  e.preventDefault();
  if (ciphertype == "rot5" || ciphertype == "rot13" || ciphertype == "rot47") {
    output.value = transformROT(input.value, 1).join("");
  }
  if (ciphertype == "bww") {
    outputText = transformBWW(input.value, 1);
    sumBWW = computeSum(outputText)
    output.value = outputText.join(" ") + " Σ " + sumBWW + " QS: " + computeQS(sumBWW);
  }
  if (ciphertype == "morse") {
    output.value = transformMorse(input.value, 1).join(" ");
  }
  if (ciphertype == "scrabble") {
    outputText = transformScrabble(input.value);
    sumBWW = computeSum(outputText)
    output.value = outputText.join(" ") + " Σ " + sumBWW + " QS: " + computeQS(sumBWW);
  }
  if (ciphertype == "rome") {
    output.value = transformRome(input.value, 1);
  }
  if (ciphertype == "skytale") {
    output.value = transformSkytale(input.value, 1);
  }
}
 
function updateCipher() {
  ciphertype = cipher.options[cipher.selectedIndex].value;
  //remove additional controls
  while (additionalControls.firstChild) {
    additionalControls.removeChild(additionalControls.firstChild);
  }

  if (ciphertype == "rot5") {
    alphabets = [alphabetNumbers];
    n = 5;
    description.innerHTML = descriptionROT5;
  }
  if (ciphertype == "rot13") {
    alphabets = [alphabetUppercase, alphabetLowercase];
    n = 13;
    description.innerHTML = descriptionROT13;
  }
  if (ciphertype == "rot47") {
    alphabets = [alphabetROT47];
    description.innerHTML = descriptionROT47;
  }
  if (ciphertype == "bww") {
    alphabets = [alphabetBWW];
    description.innerHTML = descriptionBWW;
  }
  if (ciphertype == "morse") {
    alphabets = [alphabetMorse];
    description.innerHTML = descriptionMorse;
  }
  if (ciphertype == "scrabble") {
    alphabets = [alphabetScrabble];
    description.innerHTML = descriptionScrabble;
  }
  if (ciphertype == "rome") {
    alphabets = [alphabetRome];
    description.innerHTML = descriptionRome;
  }
  if (ciphertype == "rome") {
    alphabets = [alphabetRome];
    description.innerHTML = descriptionRome;
  }
  if (ciphertype == "skytale") {
    description.innerHTML = descriptionSkytale;
  }
  setTitle();
  setMappingTable();
  addAdditionalControls();
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

function setTitle() {
  if (ciphertype == "rot5" || ciphertype == "rot13") {
    title.innerHTML = "ROT" + n;
  } else if (ciphertype == "rot47"){
    title.innerHTML = "ROT47";
  } else if (ciphertype == "bww") {
    title.innerHTML = "Buchstabenwortwert";
  } else if (ciphertype == "morse") {
    title.innerHTML = "Morse-Code";
  } else if (ciphertype == "scrabble") {
    title.innerHTML = "Scrabble-Code";
  } else if (ciphertype == "rome") {
    title.innerHTML = "Römische Zahl";
  } else if (ciphertype == "skytale") {
      title.innerHTML = "Skytale Transposition: " + n;
  } else {
    title.innerHTML = "unknown";
  }
}

function addAdditionalControls() {
  //Update the shift by change of the slider
  if (ciphertype == "rot5" || ciphertype == "rot13" || ciphertype == "skytale"){
    const slider = document.createElement("input");
    if (ciphertype == "rot5") {
      slider.min = "0";
      slider.max = "9";
      slider.value = "5";
    }
    if (ciphertype == "rot13") {
      slider.min = "1";
      slider.max = "26";
      slider.value = "13";
    }
    if (ciphertype == "skytale") {
      slider.min = "0";
      slider.max = "25";
      slider.value = "50";
    }

    slider.type = "range";
    slider.setAttribute("id", "rotNumberSlider");
    slider.addEventListener("input", updateRotNumber);
    additionalControls.appendChild(slider);
  }

  //add input and output description
  if (ciphertype == "rome"){
    descriptionInput.textContent  = "Römische Zahl";
    descriptionOutput.textContent  = "Arabische Zahl";
  } else {
    descriptionInput.textContent  = "";
    descriptionOutput.textContent  = "";
  }

  //
  if (ciphertype == "scrabble" || ciphertype == "rome"){
    encrypt.style.visibility='hidden'; 
  } else {
    encrypt.style.visibility='visible' 
  }
}

function setMappingTable(){
  while (mappingTables.firstChild) {
    mappingTables.removeChild(mappingTables.firstChild);
  }
  if (ciphertype == "rot5" || ciphertype == "rot13" || ciphertype == "rot47" || ciphertype == "bww" || ciphertype == "morse" || ciphertype == "rome" || ciphertype == "scrabble"){
    let headlineMapping = document.createElement("h3");
    if (alphabets.length > 1){
      headlineMapping.appendChild(document.createTextNode("Mapping-Tables"));
    } else {
      headlineMapping.appendChild(document.createTextNode("Mapping-Table"));
    }
    mappingTables.appendChild(headlineMapping);

    for (let alphabet of alphabets) {
      const newMappingTable = document.createElement("div");
      newMappingTable.classList.add("mappingTable");
      i = 0;
      for (let element of alphabet){
        const letterBoxCol = document.createElement("div");
        letterBoxCol.classList.add("letterBoxCol");
        //Top
        const letterBoxTop = document.createElement("p");
        if (ciphertype == "scrabble"){
          letterBoxTop.appendChild(document.createTextNode(alphabetBWW[i]));
        } else {
          letterBoxTop.appendChild(document.createTextNode(element));
        }
        letterBoxCol.appendChild(letterBoxTop);
        //Bottom
        const letterBoxBottom = document.createElement("p");
        let transformedLetter = "";
        if (ciphertype == "rot5" ||  ciphertype == "rot13" || ciphertype == "rot47" ) {
          transformedLetter = transformROT(element, 1);
        }
        if (ciphertype == "bww") {
          transformedLetter = transformBWW(element, 1);
        }
        if (ciphertype == "morse") {
          transformedLetter = transformMorse(element, 1);
        }
        if (ciphertype == "scrabble") {
          transformedLetter = element;
        }
        if (ciphertype == "rome") {
          transformedLetter = alphabetRomeClear[i];
        }
        letterBoxBottom.appendChild(document.createTextNode(transformedLetter));
        letterBoxCol.appendChild(letterBoxBottom);
        
        newMappingTable.appendChild(letterBoxCol);
        i++;
      }
      mappingTables.appendChild(newMappingTable);
    }
  }
}