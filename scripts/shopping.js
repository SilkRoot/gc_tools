import {ItemList} from "./itemList.mjs"

//selectors
let openItems;
let recentItems;
let otherItems;
let itemElements;
let addItemButton;
let itemInput;
let overlay = document.querySelector("#overlay");


//global variables
let holdStart = null;
let holdStop = null;
const getUrl = "/api/get_list";
const postFullUrl = "/api/post_full_list";
const postUpdateUrl = "/api/post_items";
const storageName = "localItemStorage";
let itemList = new ItemList(storageName, getUrl, postFullUrl, postUpdateUrl);


//events
document.addEventListener("DOMContentLoaded", initialLoadPage());


//functions
function initialLoadPage(){
    //console.log("fillItemList function triggered");
    itemList.getDataFromServer()
        .then(() => {
            console.log("start drawing ui");
            createBasicHTMLStructure();
            reloadAllItems();
        });
}

function addNewItemFromInput(e){
    console.log("funtion addNewItemFromInput called");
    //Prevent natural behaviour
    e.preventDefault();

    if (itemInput.value != "") {
        const item = {
            id: itemList.getMaxId() + 1,
            category: "Eigene Items",
            type: itemInput.value,
            custom: "",
            status: "open",
            rank: "",
            update: new Date().valueOf(),
            changed: "1"
        };
        itemList.addItem(item);
        reloadAllItems();
    } else {
        console.log("tried to add empty item. Doing nothing");
    }
}

function moveItem(e){
    let item = itemList.getItemByType(e.target.firstChild.innerText);
    item.update = new Date().valueOf();
    item.changed = "1";
    if (item.status === "open"){
        itemList.increaseRecentRank();
        item.status = "recent";
        item.rank = "0";
        itemList.updateItem(item);
    } else if (item.status === "recent"){
        item.status = "open";
        const oldRank = item.rank;
        item.rank = "";
        itemList.updateItem(item);
        itemList.decreaseRecentRank(oldRank);
    } else if (item.status === "other"){
        item.status = "open";
        itemList.updateItem(item);
    }   
    
    //update itemList with changed item
    reloadAllItems();
    itemList.sendItemsToServer();

    //set empty catgories to display none
    const usedCategories = document.querySelectorAll(".usedCategory");
    for (let i = 0; i < usedCategories.length; i++){
        const itemBox = usedCategories[i].children[1];
        if (!itemBox.firstChild){
            usedCategories[i].classList.remove("usedCategory");
            usedCategories[i].classList.add("unusedCategory");
        }
    }
}

function openCustomInfoUI(e){
    let item = itemList.getItemByType(e.target.firstChild.innerText);
    console.log("start editing description of following item: ");
    console.log(item);

    //remove content to create ui for 
    while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild);
    }

    //button to save
    const buttonCustomInfoInput = document.createElement("button");
    buttonCustomInfoInput.innerHTML = "<i class='fa-sharp fa-solid fa-circle-xmark'></i>";
    buttonCustomInfoInput.setAttribute("id", "buttonCustomInfoInput");
    buttonCustomInfoInput.addEventListener("click", closeCustomInfoUI);

    //title
    const titleSection = document.createElement("section");
    titleSection.setAttribute("id", "titleSection");
    const title = document.createElement("h1");
    title.setAttribute("id", "title");
    title.innerHTML = item.type;
    titleSection.appendChild(title);
    titleSection.appendChild(buttonCustomInfoInput);

    overlay.appendChild(titleSection);

    //input for custom
    const additionalInfoInput = document.createElement("input");
    additionalInfoInput.type = "text";
    let inputText = item.custom;
    if (inputText === "") {
        inputText = "Menge, Beschreibung...";
    }
    additionalInfoInput.value = inputText;
    additionalInfoInput.setAttribute("id", "additionalInfoInput");
    overlay.appendChild(additionalInfoInput);

    //chooser for category
    const selectCategory = document.createElement("select");
    selectCategory.setAttribute("id", "categoryChooser");
    selectCategory.classList.add("dropDown");
    for(let i=0; i<itemList.categoryList.length; i++){
        const newOption = document.createElement("option");
        newOption.textContent = itemList.categoryList[i];
        newOption.value = itemList.categoryList[i];
        selectCategory.appendChild(newOption);
    }
    selectCategory.value = item.category;
    overlay.appendChild(selectCategory);
}

function closeCustomInfoUI() {
    let item = itemList.getItemByType(document.getElementById("title").innerHTML);

    //custom
    let additionalInputText = document.getElementById("additionalInfoInput").value;
    if (additionalInputText === "Menge, Beschreibung...") {
        additionalInputText = ""
    }

    //category
    const dropDown = document.getElementById("categoryChooser");
    const newCategory = dropDown.options[dropDown.selectedIndex].value;

    //check for changes and update
    if (newCategory !== item.category || additionalInputText !== item.custom ){
        item.custom = additionalInputText;
        item.category = newCategory;
        item.update = new Date().valueOf();
        item.changed = "1";
        itemList.updateItem(item);
        itemList.sendItemsToServer();
    }

    //reload normal shopping list
    createBasicHTMLStructure();
    reloadAllItems();
}

function reloadAllItems(){
    //remove all items
    const allItemBoxes = document.querySelectorAll(".itemBox")
    allItemBoxes.forEach(itemBox => {
        while (itemBox.firstChild) {
            itemBox.removeChild(itemBox.firstChild);
        };
    });

    //draw all items
    itemList.getList().forEach(item => {
        if (item.type !== "dummy"){
            if (item.status === "open"){
                addItemToOpenOrOther(item, openItems);
            } else if  (item.status === "recent") {
                recentItems.firstChild.appendChild(generateItemDiv(item));
            }
            addItemToOpenOrOther(item, otherItems);
        }
    });
}

function addItemToOpenOrOther(item, statusElement){
    //select category div
    let categoryElement;
    for (let i = 0; i < statusElement.children.length; i++){
        if (statusElement.children[i].classList.contains(
                "Cat_" + itemList.categoryList.indexOf(item.category)
            )){
            categoryElement = statusElement.children[i];
        }
    }

    //make unused category visible / used
    if (categoryElement.classList.contains("unusedCategory")){
        categoryElement.classList.remove("unusedCategory");
        categoryElement.classList.add("usedCategory")
    }

    //select child with class .itemBox
    const itemBox = categoryElement.querySelector('.itemBox');
    itemBox.appendChild(generateItemDiv(item));
}

function generateItemDiv(item){
    //create button
    const itemDiv = document.createElement("button");
    itemDiv.classList.add("item");
    if (item.status === "open"){
        itemDiv.classList.add("openStatus");
    }

    //add name
    const itemText = document.createElement("div");
    itemText.classList.add("itemText");
    itemText.innerText = item.type;
    itemDiv.appendChild(itemText);

    //add listeners
    itemDiv.addEventListener("mousedown", onMouseDown);
    itemDiv.addEventListener("mouseup", onMouseUp);

    //add additional info
    const additionalInfo = document.createElement("div");
    additionalInfo.innerText = item.custom;
    additionalInfo.classList.add("additionalInfo");
    itemDiv.appendChild(additionalInfo);

    return(itemDiv);
}

function createBasicHTMLStructure() {
    // remove all existing elements on main area / overlay
    while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild);
    }

    // define title
    const titleSection = document.createElement("section");
    titleSection.setAttribute("id", "titleSection");
    titleSection.innerHTML = "<h1 id='title'>Einkaufsliste</h1>";
    overlay.appendChild(titleSection);

    // define input for new item
    const controls = document.createElement("div");
    controls.setAttribute("id", "controls");
    controls.innerHTML = "<input type='text' id='itemInput'></input>    <button id='addItemButton' type='submit'>      <i class='fas fa-plus-square'></i>    </button>"
    overlay.appendChild(controls);

    // define divs for all three status of items
    const states = {
        openItems: "aktuelle Items",
        recentItems: "zuletzt eingekauft",
        otherItems: "Alle Artikel"
    };

    for (const [stateKey, stateValue] of Object.entries(states)){
        if(stateKey !== "openItems"){
            const headline = document.createElement("h3");
            headline.classList.add("groupHeadline");
            headline.innerHTML = stateValue;
            overlay.appendChild(headline)
        }

        const itemsContainer = document.createElement("div");
        itemsContainer.setAttribute("id", stateKey);
        overlay.appendChild(itemsContainer);
        
        //add categories to each status
        if (stateKey !== "recentItems"){
            itemList.categoryList.forEach(function (value, index) {
                const categoryElement = document.createElement("div");
                categoryElement.classList.add("Cat_" + index);
                categoryElement.classList.add("itemCategory");
                categoryElement.classList.add("unusedCategory");
        
                const categoryHeadline = document.createElement("h4");
                categoryHeadline.innerText = value;
                categoryElement.appendChild(categoryHeadline);
        
                const itemBox = document.createElement("div");
                itemBox.classList.add("itemBox");
                categoryElement.appendChild(itemBox);

                itemsContainer.appendChild(categoryElement);
            });
        } else if (stateKey === "recentItems"){
            const itemBox = document.createElement("div");
            itemBox.classList.add("itemBox");
            itemsContainer.appendChild(itemBox);
        }
    }

    //update selectors after all items were removed
    openItems = document.querySelector("#openItems");
    recentItems = document.querySelector("#recentItems");
    otherItems = document.querySelector("#otherItems");
    //itemElements = document.querySelectorAll(".item");
    addItemButton = document.querySelector("#addItemButton");
    itemInput = document.querySelector("#itemInput");

    addItemButton.addEventListener("click", addNewItemFromInput);
}

function onMouseDown() {
    holdStart = new Date();
}

function onMouseUp(e) {
    holdStop = new Date();
    let difference = holdStop - holdStart;
    if (difference > 350) {
        openCustomInfoUI(e);
    } else {
        moveItem(e);
    }
}

