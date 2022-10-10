class ItemList {
    itemList = [];
    storageName = "defaultStorageName";

    constructor(storageName){
        this.storageName = storageName;
        console.log("new itemList was created with a storage name of: " + this.storageName);
    }

    getList() {
        return this.itemList;
    }

    setList(itemList){
        this.itemList = itemList;
    }

    getDataFromServer(url){
        //console.log("start loading data from server");
        //let url = "/api/fresh_list"
        fetch(url)
            .then((response) => response.json())
                .then((data) => this.writeToLocalStorage(data))
                    .then(() => {
                        console.log("finished getting all data from server");
                    })
                .catch((error) => console.log(error))
            .catch((error) => console.log(error));
    }

    writeToLocalStorage(data){
        if (localStorage.getItem(this.storageName) !== null) {
            //"found local storage. Filling this into itemList"
            this.itemList = JSON.parse(localStorage.getItem(this.storageName));
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
            //console.log("writing everything to following storage: " + this.storageName);
            localStorage.setItem(this.storageName, JSON.stringify(this.itemList));
            resolve(
                console.log("recieved data was compared and written to the local storage")
            );
            reject("something went wrong while comparing or writing to the local storage")
        });
    }
}

export {ItemList};