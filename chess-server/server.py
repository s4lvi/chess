from flask import Flask
import requests
from .mongoService import MongoService
from .aiService import AIService
from .game import ChessGame

app = Flask(__name__)

MONGO_URI = ""

mongoService = MongoService()
aiService = AIService()

@app.route("/")
def index():
    return "test"

@app.route("/move")
def makeMove(match_id, move, player):
    match_players = mongoService.getPlayers(match_id)
    # validate player is playing correct match and it is their turn
    if (player in [match_players.player1.name, match_players.player2.name] and match_players.lastPlayer != player):
        # get moves list
        pastMoves = mongoService.getMatchMoves(match_id)
        # build current game state
        game = ChessGame(pastMoves)
        # update with new move
        isValid = game.playGame(move, player)
        if (not isValid):
            return "error invalid state" # make http response
        # update database
        id = mongoService.postMove(match_id, move, player)
        # validate mongo post
    else:
        return "wrong match!"
    return 

@app.route("/stream")
def stream(match_id):
    def eventStream():
        while True:
            yield 'data: {}\n\n'.format(ChessGame(mongoService.getMatchMoves))
    return requests.Response(eventStream(), mimetype="text/event-stream")