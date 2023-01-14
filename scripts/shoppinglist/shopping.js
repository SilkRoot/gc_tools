import {
    ItemList
} from "./itemList.mjs"

//selectors
let openItems;
let recentItems;
let otherItems;
let itemElements;
let addItemButton;
let itemInput;
let listbox = document.querySelector("#listbox");


//global variables
let holdStart = null;
let holdStop = null;
const getUrl = "http://192.168.178.21/api/get_list";
const postFullUrl = "/api/post_full_list";
const postUpdateUrl = "/api/post_items";
const storageName = "localItemStorage";
let itemList = new ItemList(storageName, getUrl, postFullUrl, postUpdateUrl);


//events
document.addEventListener("DOMContentLoaded", initialLoadPage());


//functions
function initialLoadPage() {
    //console.log("fillItemList function triggered");
    itemList.getDataFromServer()
        .then(() => {
            console.log("start drawing ui");
            createBasicHTMLStructure();
            reloadAllItems();
        });
}

function addNewItemFromInput(e) {
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

function moveItem(e) {
    let item = itemList.getItemByType(e.target.firstChild.innerText);
    item.update = new Date().valueOf();
    item.changed = "1";
    if (item.status === "open") {
        itemList.increaseRecentRank();
        item.status = "recent";
        item.rank = "0";
        itemList.updateItem(item);
    } else if (item.status === "recent") {
        item.status = "open";
        const oldRank = item.rank;
        item.rank = "";
        itemList.updateItem(item);
        itemList.decreaseRecentRank(oldRank);
    } else if (item.status === "other") {
        item.status = "open";
        itemList.updateItem(item);
    }

    //update itemList with changed item
    reloadAllItems();
    itemList.sendItemsToServer();

    //set empty catgories to display none
    const usedCategories = document.querySelectorAll(".usedCategory");
    for (let i = 0; i < usedCategories.length; i++) {
        const itemBox = usedCategories[i].children[1];
        if (!itemBox.firstChild) {
            usedCategories[i].classList.remove("usedCategory");
            usedCategories[i].classList.add("unusedCategory");
        }
    }
}

function openCustomInfoUI(e) {
    let item = itemList.getItemByType(e.target.firstChild.innerText);
    console.log("start editing description of following item: ");
    console.log(item);

    //remove content to create ui for 
    while (listbox.firstChild) {
        listbox.removeChild(listbox.firstChild);
    }

    //background
    const backgroundContainer = document.createElement("div");
    backgroundContainer.classList.add("backgroundContainer");


    //button to save
    const buttonCustomInfoInput = document.createElement("div");
    buttonCustomInfoInput.innerHTML = "Fertig";
    buttonCustomInfoInput.setAttribute("id", "buttonCustomInfoInput");
    buttonCustomInfoInput.addEventListener("click", closeCustomInfoUI);

    //title
    const titleSection = document.createElement("div");
    titleSection.setAttribute("id", "itemheadline");
    const title = document.createElement("h1");
    title.setAttribute("id", "title");
    title.innerHTML = item.type;
    titleSection.appendChild(title);
    titleSection.appendChild(buttonCustomInfoInput);

    backgroundContainer.appendChild(titleSection);

    //input for custom
    const additionalInfoInput = document.createElement("input");
    additionalInfoInput.setAttribute("placeholder", "Menge, Beschreibung...");
    additionalInfoInput.type = "text";
    let inputText = item.custom;
    additionalInfoInput.value = inputText;
    additionalInfoInput.setAttribute("id", "additionalInfoInput");
    backgroundContainer.appendChild(additionalInfoInput);

    //chooser for category
    const selectCategory = document.createElement("select");
    selectCategory.setAttribute("id", "categoryChooser");
    selectCategory.classList.add("dropDown");
    for (let i = 0; i < itemList.categoryList.length; i++) {
        const newOption = document.createElement("option");
        newOption.textContent = itemList.categoryList[i];
        newOption.value = itemList.categoryList[i];
        selectCategory.appendChild(newOption);
    }
    selectCategory.value = item.category;
    backgroundContainer.appendChild(selectCategory);

    //add all with background to listbox
    listbox.appendChild(backgroundContainer);
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
    if (newCategory !== item.category || additionalInputText !== item.custom) {
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

function reloadAllItems() {
    //remove all items
    const allItemBoxes = document.querySelectorAll(".itemBox")
    allItemBoxes.forEach(itemBox => {
        while (itemBox.firstChild) {
            itemBox.removeChild(itemBox.firstChild);
        };
    });

    //draw all items
    itemList.getList().forEach(item => {
        if (item.type !== "dummy") {
            if (item.status === "open") {
                addItemToOpenOrOther(item, openItems);
            } else if (item.status === "recent") {
                recentItems.firstChild.appendChild(generateItemDiv(item));
            }
            addItemToOpenOrOther(item, otherItems);
        }
    });
}

function addItemToOpenOrOther(item, statusElement) {
    //select category div
    let categoryElement;
    for (let i = 0; i < statusElement.children.length; i++) {
        if (statusElement.children[i].classList.contains(
                "Cat_" + itemList.categoryList.indexOf(item.category)
            )) {
            categoryElement = statusElement.children[i];
        }
    }

    //make unused category visible / used
    if (categoryElement.classList.contains("unusedCategory")) {
        categoryElement.classList.remove("unusedCategory");
        categoryElement.classList.add("usedCategory")
    }

    //select child with class .itemBox
    const itemBox = categoryElement.querySelector('.itemBox');
    itemBox.appendChild(generateItemDiv(item));
}

function generateItemDiv(item) {
    //create button
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    if (item.status === "open") {
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
    itemDiv.addEventListener("touchstart", onMouseDown); //added for mobile
    itemDiv.addEventListener("touchend", onMouseUp); //added for mobile

    //add additional info
    const additionalInfo = document.createElement("div");
    additionalInfo.innerText = item.custom;
    additionalInfo.classList.add("additionalInfo");
    itemDiv.appendChild(additionalInfo);

    return (itemDiv);
}

function createBasicHTMLStructure() {
    // remove all existing elements on main area / listbox
    while (listbox.firstChild) {
        listbox.removeChild(listbox.firstChild);
    }

    // define title
    /*const titleSection = document.createElement("section");
    titleSection.setAttribute("id", "titleSection");
    titleSection.innerHTML = "<h1 id='title'>Einkaufsliste</h1>";
    listbox.appendChild(titleSection);*/

    // define input for new item
    const controls = document.createElement("div");
    controls.setAttribute("id", "controls");
    controls.innerHTML = "<input type='text' id='itemInput' placeholder='ich brauche...'></input>    <button id='addItemButton' type='submit'>      <i class='fa-solid fa-plus'></i>    </button>"
    listbox.appendChild(controls);

    // define divs for all three status of items
    const states = {
        openItems: "aktuelle Items",
        recentItems: "zuletzt eingekauft",
        otherItems: "Alle Artikel"
    };

    for (const [stateKey, stateValue] of Object.entries(states)) {
        if (stateKey !== "openItems") {
            const headline = document.createElement("h3");
            headline.classList.add("groupHeadline");
            headline.innerHTML = stateValue;
            listbox.appendChild(headline)
        }

        const itemsContainer = document.createElement("div");
        itemsContainer.setAttribute("id", stateKey);
        listbox.appendChild(itemsContainer);

        //add categories to each status
        if (stateKey !== "recentItems") {
            itemList.categoryList.forEach(function (value, index) {
                //basic container
                const categoryElement = document.createElement("div");
                categoryElement.classList.add("Cat_" + index);
                categoryElement.classList.add("itemCategory");
                categoryElement.classList.add("unusedCategory");

                //headline container with onclick
                const categoryHeadlineContainer = document.createElement("div");
                categoryHeadlineContainer.classList.add("categoryHeadlineContainer");
                categoryHeadlineContainer.addEventListener("click", collapse);

                //rotation arrow
                const openIndicator = document.createElement("img");
                openIndicator.src = "../../images/arrow_white_down.svg";
                openIndicator.classList.add("open");
                openIndicator.classList.add("openIndicator");
                categoryHeadlineContainer.appendChild(openIndicator);

                //headline
                const categoryHeadline = document.createElement("h4");
                categoryHeadline.innerText = value;
                categoryHeadlineContainer.appendChild(categoryHeadline);

                //box for all squared items
                const itemBox = document.createElement("div");
                itemBox.classList.add("itemBox");
                itemBox.classList.add("Cat_" + index + "_itemBox");

                //append all
                categoryElement.appendChild(categoryHeadlineContainer);
                categoryElement.appendChild(itemBox);
                itemsContainer.appendChild(categoryElement);
            });
        } else if (stateKey === "recentItems") {
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

function collapse() {
    var deg = 0;
    if (this.firstChild.classList.contains("open")) {
        deg = -90;
        this.nextSibling.style.opacity = 0;
        this.firstChild.classList.remove("open");
        this.firstChild.classList.add("closed");
        delay(200).then(() => {
            //this.nextSibling.style.display = "none";
            this.nextSibling.style.height = 0;
        });
    } else {
        deg = 0;
        this.nextSibling.style.opacity = 1;
        this.firstChild.classList.remove("closed");
        this.firstChild.classList.add("open");
        //this.nextSibling.style.display = "flex";
        //this.nextSibling.style.height = null;
        this.nextSibling.style.height = this.nextSibling.scrollHeight + "px";
    }
    this.firstChild.style.webkitTransform = "rotate(" + deg + "deg)";
    this.firstChild.style.mozTransform = "rotate(" + deg + "deg)";
    this.firstChild.style.transform = "rotate(" + deg + "deg)";
    console.log(this.nextSibling);
}

//used to delay any process or give it some time
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}