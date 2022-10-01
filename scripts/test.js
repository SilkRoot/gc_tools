let url = "/api/fresh_list"
/*let headers = new Headers();
headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5000/countries');

async function getCountries() {
    let url = "http:/localhost/api/countries"
    try{
        let res = await fetch(url)
        console.log(res);
        return await res.json();
    } catch (error){
        console.log(error);
    }
}
 
async function renderCountries(){
    let countries = await getCountries();
    console.log(countries);
}

renderCountries();*/
//console.log("getdata");
/*fetch(url, {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-cache'
    })
    .then(response => response.text())
    .then(data => console.log(data));
*/

async function fetchText() {
    let response = await fetch(url/*, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
        }*/
    );
    
    console.log("Status: " + response.status); // 200
    console.log("Statustext: " + response.statusText); // OK
    if (response.status === 200) {
        let data = await response.text();
        // handle data
        console.log(data);
    } else {
        console.log("response Code was not 200");
        console.log(response.error);
    }
}
fetchText();
console.log("getdata finished now");

/*

fetch(url, {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-cache',
    headers: {
        'Access-Control-Allow-Origin': 'http://localhost/api'
    }
    })
.then(res => res.json())
.then(out =>
  console.log('Checkout this JSON! ', out))
.catch(err => { throw err });
*/