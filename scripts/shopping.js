import {ItemList} from "./itemList.js"

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
//let itemList = []; //id, category, type, custom, status, rank, update, changed
itemList = new ItemList()


//events
document.addEventListener("DOMContentLoaded", fillItemList());


// const utcStr = new Date();
// console.log(utcStr.valueOf());

//functions
function fillItemList(){
    itemList.getDataFromServer();
}


/*function getDataFromServer(){
    console.log("start loading data from server");
    let url = "/api/fresh_list"
    fetch(url)
        .then((response) => response.json())
            .then((data) => writeToLocalStorage(data))
                .then(() => {
                    console.log("start rendering the view and writing back the changed data");
                })
            .catch((error) => console.log(error))
        .catch((error) => console.log(error));
}

function writeToLocalStorage(data){
    if (localStorage.getItem("localItemStorage") !== null) {
        //"found local storage. Filling this into itemList"
        itemList = JSON.parse(localStorage.getItem("localItemStorage"));
    }
    return new Promise((resolve, reject) => {
        data.forEach(newItem => {
            //"iterating over all items to push to items"
            if (itemList[newItem.id] === undefined) {
                //"the following item " + newItem + " does not exist in local itemList and is added ad position " + newItem.id
                itemList[newItem.id] = newItem;
            } else {
                //"item exsists locally, comparing dates"
                if (itemList[newItem.id].update < newItem.update){
                    itemList[newItem.id] = newItem;
                }
            }         
        })
        localStorage.setItem("localItemStorage", JSON.stringify(itemList));
        resolve(
            console.log("recieved data was compared and written to the local storage")
        );
        reject("something went wrong while comparing or writing to the local storage")
    });
}
*/

