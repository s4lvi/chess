import pymongo
from datetime import datetime

class MongoService:

    client = None
    db = None

    def __init__(self):
        self.client = pymongo.MongoClient("mongodb+srv://salvi:jordan2021@scratch-cluster.vjufu.mongodb.net/salvi-chess?retryWrites=true&w=majority")
        self.db = client["salvi-chess"]
        self.matchCollection = self.db.matches
        self.matchMetaCollection = self.db.matchMetas

    def postMove(self, match_id, move, player):
        move = {
            "match_id": match_id,
            "players": player,
            "move": move,
            "timestamp": datetime.now()
        }
        return self.matchCollection.insert_one(move).inserted_id
    
    def startMatch(self, player1, player1type, player2, player2type):
        meta = {
            "players": {
                "player1": {
                    "name": player1,
                    "type": player1type
                },
                "player2": {
                    "name": player2,
                    "type": player2type
                },
                "lastPlayer": player2
            },
            "start": datetime.now(),
            "lastMove": datetime.now(),
            "winner": "NONE",
            "numTurns": 0
        }
        return self.matchMetaCollection.insert_one(meta).inserted_id

    def getMatchMoves(self, match_id):
        return self.matchCollection.find({"match_id": match_id})

    def getPlayers(self, match_id):
        return self.matchMetasCollection.find({"_id": match_id}).players

