from flask import Flask, request, jsonify
#run proxy server on windows

app = Flask(__name__)

#countries = [
#    {"id": 1, "name": "Thailand", "capital": "Bangkok", "area": 513120},
#    {"id": 2, "name": "Australia", "capital": "Canberra", "area": 7617930},
#    {"id": 3, "name": "Egypt", "capital": "Cairo", "area": 1010408}
#]

#itemList = [
#    {"id": 1,  "category": "Obst/Gemüse",        "type": "Banane",       "custom": "1",      "status": "other", "rank": "",  "update": ""},
#    {"id": 2,  "category": "Obst/Gemüse",        "type": "Kiwi",         "custom": "",       "status": "other", "rank": "",  "update": ""},
#    {"id": 3,  "category": "Obst/Gemüse",        "type": "Gurke",        "custom": "",       "status": "open",  "rank": "",  "update": ""},
#    {"id": 4,  "category": "Obst/Gemüse",        "type": "Tomate",       "custom": "200g",   "status": "open",  "rank": "",  "update": ""},
#    {"id": 5,  "category": "Obst/Gemüse",        "type": "Aubergine",    "custom": "",       "status": "other", "rank": "",  "update": ""},
#    {"id": 6,  "category": "Backwaren",          "type": "Brot",         "custom": "6",      "status": "other", "rank": "",  "update": ""},
#    {"id": 7,  "category": "Backwaren",          "type": "Kekse",        "custom": "",       "status": "open",  "rank": "",  "update": ""},
#    {"id": 8,  "category": "Backwaren",          "type": "Brötchen",     "custom": "",       "status": "other", "rank": "",  "update": ""},
#    {"id": 9,  "category": "Molkereiprodukte",   "type": "Käse",         "custom": "",       "status": "other", "rank": "",  "update": ""},
#    {"id": 10, "category": "Molkereiprodukte",   "type": "Frischkäse",   "custom": "",       "status": "other", "rank": "0", "update": ""},
#    {"id": 11, "category": "Molkereiprodukte",   "type": "Frischmilch",  "custom": "",       "status": "other", "rank": "",  "update": ""},
#    {"id": 0,  "category": "Molkereiprodukte",   "type": "Butter",       "custom": "11",     "status": "other", "rank": "",  "update": ""}
#]


itemList = [
    {"id": 1,  "category": "Obst/Gemüse",        "type": "Banane",       "custom": "1",      "status": "other", "rank": "",  "update": "0000000000000", "changed": 0},
    {"id": 2,  "category": "Obst/Gemüse",        "type": "Kiwi",         "custom": "",       "status": "other", "rank": "",  "update": "0000000000000", "changed": 0},
    {"id": 3,  "category": "Obst/Gemüse",        "type": "Gurke",        "custom": "",       "status": "open",  "rank": "",  "update": "0000000000000", "changed": 0},
    {"id": 4,  "category": "Obst/Gemüse",        "type": "Tomate",       "custom": "200g",   "status": "open",  "rank": "",  "update": "0000000000000", "changed": 0},
    {"id": 5,  "category": "Obst/Gemüse",        "type": "Aubergine",    "custom": "",       "status": "other", "rank": "",  "update": "0000000000000", "changed": 0},
    {"id": 6,  "category": "Backwaren",          "type": "Brot",         "custom": "6",      "status": "other", "rank": "",  "update": "0000000000000", "changed": 0},
    {"id": 7,  "category": "Backwaren",          "type": "Kekse",        "custom": "",       "status": "open",  "rank": "",  "update": "0000000000000", "changed": 0},
    {"id": 8,  "category": "Backwaren",          "type": "Brötchen",     "custom": "",       "status": "other", "rank": "",  "update": "0000000000000", "changed": 0},
    {"id": 9,  "category": "Molkereiprodukte",   "type": "Käse",         "custom": "",       "status": "other", "rank": "",  "update": "0000000000000", "changed": 0},
    {"id": 10, "category": "Molkereiprodukte",   "type": "Frischkäse",   "custom": "",       "status": "other", "rank": "0", "update": "0000000000000", "changed": 0},
    {"id": 11, "category": "Molkereiprodukte",   "type": "Frischmilch",  "custom": "",       "status": "other", "rank": "",  "update": "0000000000000", "changed": 0},
    {"id": 0,  "category": "Molkereiprodukte",   "type": "Butter",       "custom": "11",     "status": "other", "rank": "",  "update": "0000000000000", "changed": 0}
]


#def _find_next_id():
#    return max(country["id"] for country in countries) + 1


#@app.get("/countries")
#def get_countries():
#    return jsonify(countries)

@app.get("/fresh_list")
def get_items():
    return jsonify(itemList)


#@app.post("/post_full_list")
#def post_full_list():

#def add_country():
#    if request.is_json:
#        country = request.get_json()
#        country["id"] = _find_next_id()
#        countries.append(country)
#        return country, 201
#    return {"error": "Request must be JSON"}, 415

if __name__ == "__main__":
    app.run(debug=True)