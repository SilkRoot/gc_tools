//selectors
const openItems = document.querySelector("#openItems");
const recentItems = document.querySelector("#recentItems");
const otherItems = document.querySelector("#otherItems");
const itemElements = document.querySelectorAll(".item");
const addItemButton = document.querySelector("#addItemButton");
const itemIntput = document.querySelector("#itemInput");

//events
document.addEventListener("DOMContentLoaded", loadAllTodos);
addItemButton.addEventListener("click", addToOpenItems);

//itemlist
var items = [
    ["Obst/Gemüse", "Banane", "1", "other", ""],
    ["Obst/Gemüse", "Kiwi", "2", "other", ""],
    ["Obst/Gemüse", "Gurke", "3", "open", ""],
    ["Obst/Gemüse", "Tomate", "4", "open", ""],
    ["Obst/Gemüse", "Aubergine", "5", "other", ""],
    ["Backwaren", "Brot", "6", "other", ""],
    ["Backwaren", "Kekse", "7", "open", ""],
    ["Backwaren", "Brötchen", "8", "other", ""],
    ["Molkereiprodukte", "Käse", "9", "other", ""],
    ["Molkereiprodukte", "Frischkäse", "0", "recent", "0"],
    ["Molkereiprodukte", "Frischmilch", "ß", "other", ""],
    ["Molkereiprodukte", "Butter", "11", "other", ""]
]

//functions
function moveItem(e){
    const clickedItem = e.target.innerText;
    const clickedItemIndex = getIndexOfItem(clickedItem);
    const clickedItemStatus = items[clickedItemIndex][3];
    getHtmlElement(clickedItem);
    if (clickedItemStatus === "open"){
        updateRecentItems();
        items[clickedItemIndex][3] = "recent";
        items[clickedItemIndex][4] = "0";
        e.target.remove();
        addItemToDOM(clickedItem, recentItems);
    } else if (clickedItemStatus === "recent"){
        rank = items[clickedItemIndex][4];
        items[clickedItemIndex][4] = "";
        items[clickedItemIndex][3] = "open";
        decreaseRecentRank(rank);
        e.target.remove();
        addItemToDOM(clickedItem, openItems);
    } else if (clickedItemStatus === "other"){
        items[clickedItemIndex][3] = "open";
        e.target.remove();
        addItemToDOM(clickedItem, openItems);
    }
    //update local storage
    localStorage.setItem("localItemStorage", JSON.stringify(items));
}

function decreaseRecentRank(rank){
    items.forEach(function(value, index, array) {
        if(value[3] === "recent"){
            console.log(value[4]);
            if (parseInt(value[4]) > rank){
                items[index][4] = parseInt(items[index][4]) - 1;
            } 
        }
    })
}

function updateRecentItems(){
    items.forEach(function(value, index, array) {
        if(value[3] === "recent"){
            console.log(value[4]);
            if (parseInt(value[4]) > 4){
                console.log("recent exceeded 6 elements");
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

function addItemToDOM(item, targetElement){
    const itemDiv = document.createElement("button");
    itemDiv.classList.add("item");
    itemDiv.innerText = item;
    itemDiv.addEventListener("click", moveItem);
    targetElement.appendChild(itemDiv);
}

function loadAllTodos(){
    let localItemStorage;
    if (localStorage.getItem("localItemStorage") === null) {
        localStorage.setItem("localItemStorage", JSON.stringify(items));
    } else {
        items = JSON.parse(localStorage.getItem("localItemStorage"));
    }   
    items.forEach(element => {
        if (element[3] === "open"){
            addItemToDOM(element[1], openItems);
        }
        if (element[3] === "recent"){
            addItemToDOM(element[1], recentItems);
        }
        if (element[3] === "other"){
            addItemToDOM(element[1], otherItems);
        }
    });
}
