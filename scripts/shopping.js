//selectors
let openItems;
let recentItems;
let otherItems;
let itemElements;
let addItemButton;
let itemIntput;
let overlay = document.querySelector("#overlay");

//events
document.addEventListener("DOMContentLoaded", createListView);

//global variables
var holdStart = null;
var holdStop = null;

//itemlist
//Kategorie, Item, CustomText, Status, RankRecent, DatumUpdate
var items = [
    ["Obst/Gemüse", "Banane", "1", "other", "", ""],
    ["Obst/Gemüse", "Kiwi", "2", "other", "", ""],
    ["Obst/Gemüse", "Gurke", "3", "open", "", ""],
    ["Obst/Gemüse", "Tomate", "4", "open", "", ""],
    ["Obst/Gemüse", "Aubergine", "5", "other", "", ""],
    ["Backwaren", "Brot", "6", "other", "", ""],
    ["Backwaren", "Kekse", "7", "open", "", ""],
    ["Backwaren", "Brötchen", "8", "other", "", ""],
    ["Molkereiprodukte", "Käse", "9", "other", "", ""],
    ["Molkereiprodukte", "Frischkäse", "0", "recent", "0", ""],
    ["Molkereiprodukte", "Frischmilch", "ß", "other", "", ""],
    ["Molkereiprodukte", "Butter", "11", "other", "", ""]
]

//functions
function moveItem(e){
    const clickedItem = e.target.firstChild.innerText;
    const clickedItemIndex = getIndexOfItem(clickedItem);
    const clickedItemStatus = items[clickedItemIndex][3];
    getHtmlElement(clickedItem);
    items[clickedItemIndex][5] = new Date();
    if (clickedItemStatus === "open"){
        updateRecentItems();
        items[clickedItemIndex][3] = "recent";
        items[clickedItemIndex][4] = "0";
        e.target.remove();
        addItemToDOM(clickedItem, items[clickedItemIndex][2], recentItems);
    } else if (clickedItemStatus === "recent"){
        rank = items[clickedItemIndex][4];
        items[clickedItemIndex][4] = "";
        items[clickedItemIndex][3] = "open";
        decreaseRecentRank(rank);
        e.target.remove();
        addItemToDOM(clickedItem, items[clickedItemIndex][2], openItems);
    } else if (clickedItemStatus === "other"){
        items[clickedItemIndex][3] = "open";
        e.target.remove();
        addItemToDOM(clickedItem, items[clickedItemIndex][2], openItems);
    }
    //update local storage
    localStorage.setItem("localItemStorage", JSON.stringify(items));
}

function decreaseRecentRank(rank){
    items.forEach(function(value, index, array) {
        if(value[3] === "recent"){
            if (parseInt(value[4]) > rank){
                items[index][4] = parseInt(items[index][4]) - 1;
            } 
        }
    })
}

function updateRecentItems(){
    items.forEach(function(value, index, array) {
        if(value[3] === "recent"){
            if (parseInt(value[4]) > 4){
                items[index][4] = "";
                items[index][3] = "other";
                getHtmlElement(value[1]).remove();
                addItemToDOM(value[1], otherItems);
            } else {
                items[index][4] = parseInt(items[index][4]) + 1;
            }
        }
    })
}

function getHtmlElement(item){
    for (const element of document.querySelectorAll('.item')) {
        if (element.innerText.includes(item)) {
            return(element);
        }
    }
}

function getIndexOfItem(item){
    let itemIndex = -1;
    items.forEach(function(value, index, array) {
       if(value[1] === item){
        itemIndex = index
       }
    })
    return(itemIndex);
}

function addToOpenItems(e){
    //Prevent natural behaviour
    e.preventDefault();
    if (itemInput.value != ""){
        addItemToDOM(itemIntput.value, openItems);
        itemIntput.value = "";
    } else {
        console.log("tried to add empty item. Doing nothing");
    }
}

function addItemToDOM(item, description, targetElement){
    const itemDiv = document.createElement("button");
    itemDiv.classList.add("item");

    const itemText = document.createElement("div");
    itemText.classList.add("itemText");
    itemText.innerText = item;
    itemDiv.appendChild(itemText);

    itemDiv.addEventListener("mousedown", onMouseDown);
    itemDiv.addEventListener("mouseup", onMouseUp);

    const additionalInfo = document.createElement("div");
    additionalInfo.innerText = description;
    additionalInfo.classList.add("additionalInfo");
    itemDiv.appendChild(additionalInfo);
    
    targetElement.appendChild(itemDiv);
}

function onMouseDown(){
    holdStart = new Date();
}

function onMouseUp(e){
    holdStop = new Date();
    let difference = holdStop - holdStart;
    if (difference > 350){
        addDescription(e);
    } else {
        moveItem(e);
    }
}

function addDescription(e){
    const clickedItem = e.target.firstChild.innerText;
    const clickedItemIndex = getIndexOfItem(clickedItem);
    const clickedItemStatus = items[clickedItemIndex][3];

    while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild);
    }

    const titleSection = document.createElement("section");
    const title = document.createElement("h1");
    title.setAttribute("id", "title");
    title.innerHTML = clickedItem;
    titleSection.appendChild(title);
    overlay.appendChild(titleSection); 
    
    const additionalInfoInput = document.createElement("input");
    additionalInfoInput.type = "text";
    additionalInfoInput.value = items[clickedItemIndex][2]
    additionalInfoInput.setAttribute("id", "additionalInfoInput");

    const buttonCloseAdditionalInfoInput = document.createElement("button");
    buttonCloseAdditionalInfoInput.innerText = "Close";
    buttonCloseAdditionalInfoInput.setAttribute("id", "buttonCloseAdditionalInfoInput");
    buttonCloseAdditionalInfoInput.addEventListener("click", closeAdditionalInfo);

    overlay.appendChild(additionalInfoInput);
    overlay.appendChild(buttonCloseAdditionalInfoInput);
}

function closeAdditionalInfo(){
    let updatedItemIndex = getIndexOfItem(document.getElementById("title").innerHTML);
    items[updatedItemIndex][2] = document.getElementById("additionalInfoInput").value;
    //update local storage
    localStorage.setItem("localItemStorage", JSON.stringify(items));

    document.getElementById("buttonCloseAdditionalInfoInput").remove();
    document.getElementById("additionalInfoInput").remove();
    document.getElementById("title").remove();
    createListView();
}

function createListView(){
    const titleSection = document.createElement("section");
    titleSection.innerHTML = "<h1 id='title'>Einkaufsliste</h1>";
    overlay.appendChild(titleSection);
    
    const controls = document.createElement("div");
    controls.setAttribute("id", "controls");
    controls.innerHTML = "<input type='text' id='itemInput'></input>    <button id='addItemButton' type='submit'>      <i class='fas fa-plus-square'></i>    </button>"
    overlay.appendChild(controls);

    const aktuellHeadline = document.createElement("h3");
    aktuellHeadline.innerHTML = "Aktuell";
    overlay.appendChild(aktuellHeadline);

    const openItemsContainer = document.createElement("div");
    openItemsContainer.setAttribute("id", "openItems");
    overlay.appendChild(openItemsContainer);

    const zuletztHeadline = document.createElement("h3");
    zuletztHeadline.innerHTML = "zuletzt Eingekaufte Items";
    overlay.appendChild(zuletztHeadline);

    const recentItemsContainer = document.createElement("div");
    recentItemsContainer.setAttribute("id", "recentItems");
    overlay.appendChild(recentItemsContainer);

    const weitereHeadline = document.createElement("h3");
    weitereHeadline.innerHTML = "Weitere Items";
    overlay.appendChild(weitereHeadline);

    const otherItemsContainer = document.createElement("div");
    otherItemsContainer.setAttribute("id", "otherItems");
    overlay.appendChild(otherItemsContainer);

    //update selectors after all items were removed
    openItems = document.querySelector("#openItems");
    recentItems = document.querySelector("#recentItems");
    otherItems = document.querySelector("#otherItems");
    itemElements = document.querySelectorAll(".item");
    addItemButton = document.querySelector("#addItemButton");
    itemIntput = document.querySelector("#itemInput");

    addItemButton.addEventListener("click", addToOpenItems);

    updateFromLocalStroage();
  
    //add all Items to UI
    items.forEach(element => {
        if (element[3] === "open"){
            addItemToDOM(element[1], element[2], openItems);
        }
        if (element[3] === "recent"){
            addItemToDOM(element[1], element[2], recentItems);
        }
        if (element[3] === "other"){
            addItemToDOM(element[1], "", otherItems);
        }
    });
}

function updateFromLocalStroage(){
    if (localStorage.getItem("localItemStorage") === null) {
        localStorage.setItem("localItemStorage", JSON.stringify(items));
    } else {
        items = JSON.parse(localStorage.getItem("localItemStorage"));
    } 
}