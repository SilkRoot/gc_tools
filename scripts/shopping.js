import {ItemList} from "./itemList.mjs"

//selectors
let openItems;
let recentItems;
let otherItems;
let itemElements;
let addItemButton;
let itemIntput;
let overlay = document.querySelector("#overlay");


//global variables
const categories = ["Obst/Gemüse", "Backwaren", "Molkereiprodukte", "Fleisch/Fisch", "Zutaten/Gewürze", "Fertig-/Tiefkühlprodukte", "Süßwaren", "Haushalt", "Baumarkt/Garten", "Eigene Items"];
let holdStart = null;
let holdStop = null;
const url = "/api/fresh_list";
const storageName = "localItemStorage";
//let itemList = []; //id, category, type, custom, status, rank, update, changed
let itemList = new ItemList(storageName);


//events
document.addEventListener("DOMContentLoaded", fillItemList());


// const utcStr = new Date();
// console.log(utcStr.valueOf());

//functions
function fillItemList(){
    console.log("fillItemList function triggered");
    itemList.getDataFromServer(url);
}


