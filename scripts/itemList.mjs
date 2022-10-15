class ItemList {
    itemList = [];
    storageName = "defaultStorageName";
    categoryList = [];
    getUrl = "";
    postUrl = "";
    //item structure
    //id, category, type, custom, status, rank, update, changed

    constructor(storageName, getUrl, postUrl){
        this.storageName = storageName;
        this.getUrl = getUrl;
        this.postUrl = postUrl;
        //console.log("new itemList was created with a storage name of: " + this.storageName);
    }

    getList() {
        return this.itemList;
    }

    setList(itemList){
        this.itemList = itemList;
    }

    getMaxId(){
        let maxId = 0;
        this.itemList.forEach(item => {
            if (item.id > maxId){
                maxId = item.id;
            }
        })
        return maxId;
    }

    getItemByType(type) {
        let searchedItem;
        this.itemList.forEach(item => {
            if (item.type === type){
                searchedItem = item;
            }
        })
        return searchedItem;
    }

    updateItem(item){
        //console.log("updating list with following item: ");
        //console.log(item);
        for (let i = 0; i < this.itemList.length; i++){
            if (item.id === this.itemList[i].id){
                this.itemList[i] = item;
            }
        }
        localStorage.setItem(this.storageName, JSON.stringify(this.itemList));
    }

    addItem(item){
        this.itemList.push(item);
        localStorage.setItem(this.storageName, JSON.stringify(this.itemList));
        this.sendDataToServer();
    }

    increaseRecentRank(){
        this.itemList.forEach(item => {
            if (item.status === "recent") {
                if (parseInt(item.rank) > 5) {
                    item.rank = "";
                    item.status = "other";
                } else {
                    console.log("increasing rank of item " + item.type);
                    item.rank = parseInt(item.rank) + 1;
                }
            }
        })
        //console.log(this.itemList);
        localStorage.setItem(this.storageName, JSON.stringify(this.itemList));
    }

    decreaseRecentRank(rank) {
        //console.log("reducing all ranks above: " + rank);
        this.itemList.forEach(item => {
            if (item.status === "recent") {
                if (parseInt(item.rank) > rank) {
                    console.log("decreasing rank of item " + item.type);
                    item.rank = parseInt(item.rank) - 1;
                }
            }
        })
        //console.log(this.itemList);
        localStorage.setItem(this.storageName, JSON.stringify(this.itemList));
    }

    getDataFromServer(){
        //console.log("start loading data from server");
        return new Promise((resolve, reject) => {
            fetch(this.getUrl)
                .then((response) => response.json())
                    .then((data) => this.writeToLocalStorage(data))
                        .then(() => {
                            resolve(
                                //console.log("finished getting all data from server")
                            );
                            reject("something went wrong");
                        })
                    .catch((error) => console.log(error))
                .catch((error) => console.log(error));
        });
    }

    writeToLocalStorage(data){
        if (localStorage.getItem(this.storageName) !== null) {
            //"found local storage. Filling this into itemList"
            this.itemList = JSON.parse(localStorage.getItem(this.storageName));
        }
        //empty list to refill
        this.categoryList = [];

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
                //extract categories
                if (newItem.type === "dummy"){
                    this.categoryList.push(newItem.category);
                }
            })

            //console.log("writing everything to following storage: " + this.storageName);
            localStorage.setItem(this.storageName, JSON.stringify(this.itemList));

            //resolve promise
            resolve(
                //console.log("recieved data was compared and written to the local storage")
            );
            reject("something went wrong while comparing or writing to the local storage")
        });
    }

    sendDataToServer(){
       /* fetch(this.postUrl, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.itemList)
        })
            .then((resoponse) => {
                console.log(resoponse);
            })
            .catch((error) => {
                console.log("data was not sent successfully:" + error);
            })*/
    }
}

export {ItemList};