import pymongo
from datetime import datetime

class MongoService():

    client = None
    db = None

    def __init__(self):
        self.client = pymongo.MongoClient("mongodb+srv://salvi:jordan2021@scratch-cluster.vjufu.mongodb.net/salvi-chess?retryWrites=true&w=majority")
        self.db = client["salvi-chess"]
        self.matchCollection = self.db.matches

    def postMove(self, match_id, move, player):
        move = {
            "match_id": match_id,
            "player": player,
            "move": move,
            "timestamp": datetime.now()
        }
        return self.matchCollection.insert_one(move).inserted_id

    def getMoves(self, match_id):
        return self.matchCollection.find({"match_id": match_id})

