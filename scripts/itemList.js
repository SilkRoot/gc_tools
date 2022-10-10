class ItemList {
    itemList = [];

    constructor(){
        console.log("new itemList was created");
    }

    getList() {
        return this.itemList;
    }

    setList(itemList){
        this.itemList = itemList;
    }

    getDataFromServer(url){
        console.log("start loading data from server");
        //let url = "/api/fresh_list"
        fetch(url)
            .then((response) => response.json())
                .then((data) => writeToLocalStorage(data))
                    .then(() => {
                        console.log("finished getting all data from server");
                    })
                .catch((error) => console.log(error))
            .catch((error) => console.log(error));
    }

    writeToLocalStorage(data){
        if (localStorage.getItem("localItemStorage") !== null) {
            //"found local storage. Filling this into itemList"
            this.itemList = JSON.parse(localStorage.getItem("localItemStorage"));
        }
        return new Promise((resolve, reject) => {
            data.forEach(newItem => {
                //"iterating over all items to push to items"
                if (this.itemList[newItem.id] === undefined) {
                    //"the following item " + newItem + " does not exist in local itemList and is added ad position " + newItem.id
                    this.itemList[newItem.id] = newItem;
                } else {
                    //"item exsists locally, comparing dates"
                    if (this.itemList[newItem.id].update < newItem.update){
                        this.itemList[newItem.id] = newItem;
                    }
                }         
            })
            localStorage.setItem("localItemStorage", JSON.stringify(this.itemList));
            resolve(
                console.log("recieved data was compared and written to the local storage")
            );
            reject("something went wrong while comparing or writing to the local storage")
        });
    }
}

export {ItemList};