import pymongo

client = pymongo.MongoClient("mongodb+srv://salvi:fortran90!@scratch-cluster.vjufu.mongodb.net/salvi-chess?retryWrites=true&w=majority")
db = client["salvi-chess"]
print(db)
matches = db.matches
test = {
    "match_id": "test",
    "player": "player0",
    "move": "ka3",
    "timestamp": "testTime"
}
id = matches.insert_one(test).inserted_id
print(id)

class MongoService():

    def __init__(self):
