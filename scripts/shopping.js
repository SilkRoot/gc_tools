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
    ["Obst/Gemüse", "Kiwi", "", "other", "", ""],
    ["Obst/Gemüse", "Gurke", "", "open", "", ""],
    ["Obst/Gemüse", "Tomate", "200g", "open", "", ""],
    ["Obst/Gemüse", "Aubergine", "", "other", "", ""],
    ["Backwaren", "Brot", "6", "other", "", ""],
    ["Backwaren", "Kekse", "", "open", "", ""],
    ["Backwaren", "Brötchen", "", "other", "", ""],
    ["Molkereiprodukte", "Käse", "", "other", "", ""],
    ["Molkereiprodukte", "Frischkäse", "", "recent", "0", ""],
    ["Molkereiprodukte", "Frischmilch", "", "other", "", ""],
    ["Molkereiprodukte", "Butter", "11", "other", "", ""]
];

const categories = ["Obst/Gemüse", "Backwaren", "Molkereiprodukte", "Fleisch/Fisch", "Zutaten/Gewürze", "Fertig-/Tiefkühlprodukte", "Süßwaren", "Haushalt", "Baumarkt/Garten", "Eigene Items"];

//functions
function moveItem(e) {
    const clickedItem = e.target.firstChild.innerText;
    const clickedItemIndex = getIndexOfItem(clickedItem);
    const clickedItemStatus = items[clickedItemIndex][3];
    items[clickedItemIndex][5] = new Date();
    if (clickedItemStatus === "open") {
        updateRecentItems();
        items[clickedItemIndex][3] = "recent";
        items[clickedItemIndex][4] = "0";
    } else if (clickedItemStatus === "recent") {
        rank = items[clickedItemIndex][4];
        items[clickedItemIndex][4] = "";
        items[clickedItemIndex][3] = "open";
        decreaseRecentRank(rank);
    } else if (clickedItemStatus === "other") {
        items[clickedItemIndex][3] = "open";
    }
    //update local storage
    localStorage.setItem("localItemStorage", JSON.stringify(items));
    createListView();
}

function decreaseRecentRank(rank) {
    items.forEach(function (value, index, array) {
        if (value[3] === "recent") {
            if (parseInt(value[4]) > rank) {
                items[index][4] = parseInt(items[index][4]) - 1;
            }
        }
    })
}

function updateRecentItems() {
    items.forEach(function (value, index, array) {
        if (value[3] === "recent") {
            if (parseInt(value[4]) > 4) {
                items[index][4] = "";
                items[index][3] = "other";
            } else {
                items[index][4] = parseInt(items[index][4]) + 1;
            }
        }
    })
}

function getIndexOfItem(item) {
    let itemIndex = -1;
    items.forEach(function (value, index, array) {
        if (value[1] === item) {
            itemIndex = index
        }
    })
    return (itemIndex);
}

function addToOpenItems(e) {
    //Prevent natural behaviour
    e.preventDefault();
    if (itemInput.value != "") {
        addItemToDOM(itemIntput.value, openItems);
        itemIntput.value = "";
    } else {
        console.log("tried to add empty item. Doing nothing");
    }
}

function addItemToOpen(itemID) {
    //get all informations about item from items array
    const itemCategory = items[itemID][0];

    //check if category exists
    let allExistingCategories = openItems.children;
    let categoryElement;
    let addCategory = true;
    //check if category exists, if so put in categoryElement
    if (allExistingCategories.length != 0){
        for (let i = 0; i < allExistingCategories.length; i++){
            if (allExistingCategories[i].classList.contains("Cat_" + categories.indexOf(itemCategory))){
                categoryElement = allExistingCategories[i];
                addCategory = false;
            }
        }
    } 
    //create category because it does not exist and add to openItems
    if (addCategory === true){
        categoryElement = document.createElement("div");
        categoryElement.classList.add("Cat_" + categories.indexOf(itemCategory));
        categoryElement.classList.add("itemCategory");
        
        const categoryHeadline = document.createElement("h4");
        categoryHeadline.innerText = itemCategory;
        categoryElement.appendChild(categoryHeadline);

        const itemBox = document.createElement("div");
        itemBox.classList.add("itemBox");
        categoryElement.appendChild(itemBox);

        openItems.appendChild(categoryElement);
    }

    const itemDiv = generateItemDiv(itemID);

    //add item to itembox where all items are containted to separate from headline of category
    itemBox = categoryElement.querySelector(".itemBox");
    itemBox.appendChild(itemDiv);
}

function addItemToRecent(itemID){
    const itemDiv = generateItemDiv(itemID);

    //add itemDiv to group recent
    recentItems.appendChild(itemDiv);
}

function addItemToOther(itemID){
    //get all informations about item from items array
    const itemCategory = items[itemID][0];

    let categoryElement;

    //get right category
    let allExistingCategories = otherItems.children;
    for (let i = 0; i < allExistingCategories.length; i++){
        if (allExistingCategories[i].classList.contains("Cat_" + categories.indexOf(itemCategory))){
            categoryElement = allExistingCategories[i];
        }
    }

    const itemDiv = generateItemDiv(itemID);

    //add item to itembox where all items are containted to separate from headline of category
    itemBox = categoryElement.querySelector(".itemBox");
    itemBox.appendChild(itemDiv);
}

function generateItemDiv(itemID){
    //get all informations about item from items array
    const itemName = items[itemID][1];
    const itemAdditionalInfo = items[itemID][2];
    const itemGroup = items[itemID][3];

    //create button
    const itemDiv = document.createElement("button");
    itemDiv.classList.add("item");
    if (itemGroup === "open"){
        itemDiv.classList.add("openStatus");
    }
    //add name
    const itemText = document.createElement("div");
    itemText.classList.add("itemText");
    itemText.innerText = itemName;
    itemDiv.appendChild(itemText);
    //add listeners
    itemDiv.addEventListener("mousedown", onMouseDown);
    itemDiv.addEventListener("mouseup", onMouseUp);
    //add additional info
    const additionalInfo = document.createElement("div");
    additionalInfo.innerText = itemAdditionalInfo;
    additionalInfo.classList.add("additionalInfo");
    itemDiv.appendChild(additionalInfo);

    return(itemDiv);
}

function addAllCategoriesToOther(){
    categories.forEach(function (value, index) {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("itemCategory");
        categoryElement.classList.add("Cat_" + index);
        
        const categoryHeadline = document.createElement("h4");
        categoryHeadline.innerText = value;
        categoryElement.appendChild(categoryHeadline);

        const itemBox = document.createElement("div");
        itemBox.classList.add("itemBox");
        categoryElement.appendChild(itemBox);

        otherItems.appendChild(categoryElement);
    })
}

function onMouseDown() {
    holdStart = new Date();
}

function onMouseUp(e) {
    holdStop = new Date();
    let difference = holdStop - holdStart;
    if (difference > 350) {
        addDescription(e);
    } else {
        moveItem(e);
    }
}

function addDescription(e) {
    const clickedItem = e.target.firstChild.innerText;
    const clickedItemIndex = getIndexOfItem(clickedItem);
    const clickedItemStatus = items[clickedItemIndex][3];

    while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild);
    }

    const buttonCloseAdditionalInfoInput = document.createElement("button");
    buttonCloseAdditionalInfoInput.innerHTML = "<i class='fa-sharp fa-solid fa-circle-xmark'></i>";
    buttonCloseAdditionalInfoInput.setAttribute("id", "buttonCloseAdditionalInfoInput");
    buttonCloseAdditionalInfoInput.addEventListener("click", closeAdditionalInfo);

    const titleSection = document.createElement("section");
    titleSection.classList.add("titleSection")
    const title = document.createElement("h1");
    title.setAttribute("id", "title");
    title.innerHTML = clickedItem;
    titleSection.appendChild(title);
    titleSection.appendChild(buttonCloseAdditionalInfoInput);

    overlay.appendChild(titleSection);

    const additionalInfoInput = document.createElement("input");
    additionalInfoInput.type = "text";
    let inputText = items[clickedItemIndex][2];
    if (inputText === "") {
        inputText = "Menge, Beschreibung...";
    }
    additionalInfoInput.value = inputText;
    additionalInfoInput.setAttribute("id", "additionalInfoInput");
    overlay.appendChild(additionalInfoInput);

    const selectCategory = document.createElement("select");
    selectCategory.classList.add("dropDown");
    for(let i=0; i<categories.length; i++){
        const newOption = document.createElement("option");
        newOption.textContent = categories[i];
        newOption.value = categories[i];
        selectCategory.appendChild(newOption);
    }
    selectCategory.value = items[clickedItemIndex][0];
    overlay.appendChild(selectCategory);
}

function closeAdditionalInfo() {
    let updatedItemIndex = getIndexOfItem(document.getElementById("title").innerHTML);
    let additionalInputText = document.getElementById("additionalInfoInput").value;
    if (additionalInputText === "Menge, Beschreibung...") {
        additionalInputText = ""
    }
    items[updatedItemIndex][2] = additionalInputText;
    //update local storage
    localStorage.setItem("localItemStorage", JSON.stringify(items));

    /*document.getElementById("buttonCloseAdditionalInfoInput").remove();
    document.getElementById("additionalInfoInput").remove();
    document.getElementById("title").remove();*/
    createListView();
}

function createListView() {
    while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild);
    }
    const titleSection = document.createElement("section");
    titleSection.innerHTML = "<h1 id='title'>Einkaufsliste</h1>";
    overlay.appendChild(titleSection);

    const controls = document.createElement("div");
    controls.setAttribute("id", "controls");
    controls.innerHTML = "<input type='text' id='itemInput'></input>    <button id='addItemButton' type='submit'>      <i class='fas fa-plus-square'></i>    </button>"
    overlay.appendChild(controls);

    const openItemsContainer = document.createElement("div");
    openItemsContainer.setAttribute("id", "openItems");
    overlay.appendChild(openItemsContainer);

    const zuletztHeadline = document.createElement("h3");
    zuletztHeadline.classList.add("groupHeadline");
    zuletztHeadline.innerHTML = "zuletzt eingekauft";
    overlay.appendChild(zuletztHeadline);

    const recentItemsContainer = document.createElement("div");
    recentItemsContainer.setAttribute("id", "recentItems");
    overlay.appendChild(recentItemsContainer);

    const weitereHeadline = document.createElement("h3");
    weitereHeadline.classList.add("groupHeadline");
    weitereHeadline.innerHTML = "Alles";
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
    addAllCategoriesToOther();

    //add all Items to UI
    items.forEach(function (value, index) {
        if (items[index][3] === "open"){
            addItemToOpen(index);
        }
        if (items[index][3] === "recent"){
            addItemToRecent(index);
        }
    });
    items.forEach(function (value, index) {
        addItemToOther(index);
    });
}

function updateFromLocalStroage() {
    if (localStorage.getItem("localItemStorage") === null) {
        localStorage.setItem("localItemStorage", JSON.stringify(items));
    } else {
        items = JSON.parse(localStorage.getItem("localItemStorage"));
    }
}