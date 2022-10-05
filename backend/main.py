from flask import Flask, request, jsonify
#run proxy server on windows

app = Flask(__name__)

#countries = [
#    {"id": 1, "name": "Thailand", "capital": "Bangkok", "area": 513120},
#    {"id": 2, "name": "Australia", "capital": "Canberra", "area": 7617930},
#    {"id": 3, "name": "Egypt", "capital": "Cairo", "area": 1010408}
#]

itemList = [
    {"group": "Obst/Gemüse",        "type": "Banane",       "customText": "1",      "status": "other", "recentIndex": "",  "updatedDate": ""},
    {"group": "Obst/Gemüse",        "type": "Kiwi",         "customText": "",       "status": "other", "recentIndex": "",  "updatedDate": ""},
    {"group": "Obst/Gemüse",        "type": "Gurke",        "customText": "",       "status": "open",  "recentIndex": "",  "updatedDate": ""},
    {"group": "Obst/Gemüse",        "type": "Tomate",       "customText": "200g",   "status": "open",  "recentIndex": "",  "updatedDate": ""},
    {"group": "Obst/Gemüse",        "type": "Aubergine",    "customText": "",       "status": "other", "recentIndex": "",  "updatedDate": ""},
    {"group": "Backwaren",          "type": "Brot",         "customText": "6",      "status": "other", "recentIndex": "",  "updatedDate": ""},
    {"group": "Backwaren",          "type": "Kekse",        "customText": "",       "status": "open",  "recentIndex": "",  "updatedDate": ""},
    {"group": "Backwaren",          "type": "Brötchen",     "customText": "",       "status": "other", "recentIndex": "",  "updatedDate": ""},
    {"group": "Molkereiprodukte",   "type": "Käse",         "customText": "",       "status": "other", "recentIndex": "",  "updatedDate": ""},
    {"group": "Molkereiprodukte",   "type": "Frischkäse",   "customText": "",       "status": "other", "recentIndex": "0", "updatedDate": ""},
    {"group": "Molkereiprodukte",   "type": "Frischmilch",  "customText": "",       "status": "other", "recentIndex": "",  "updatedDate": ""},
    {"group": "Molkereiprodukte",   "type": "Butter",       "customText": "11",     "status": "other", "recentIndex": "",  "updatedDate": ""}
]


#def _find_next_id():
#    return max(country["id"] for country in countries) + 1


#@app.get("/countries")
#def get_countries():
#    return jsonify(countries)

@app.get("/fresh_list")
def get_items():
    return jsonify(itemList)


@app.post("/post_full_list")
def post_full_list():

#def add_country():
#    if request.is_json:
#        country = request.get_json()
#        country["id"] = _find_next_id()
#        countries.append(country)
#        return country, 201
#    return {"error": "Request must be JSON"}, 415

if __name__ == "__main__":
    app.run(debug=True)