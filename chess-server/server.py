from flask import Flask
from .mongoService import MongoService
from .game import ChessGame

app = Flask(__name__)

MONGO_URI = ""

mongoService = MongoService()


@app.route("/")
def index():
    return "test"

@app.route("/move")
def makeMove(match_id, move, player):
    # get moves list
    pastMoves = mongoService.getMoves(match_id)
    # build current game state
    game = ChessGame(pastMoves)
    # update with new move
    isValid = game.playGame(move, player)
    if (not isValid):
        return "error invalid state" # make http response
    # update database
    id = mongoService.postMove(match_id, move, player)
    # validate mongo post
    # push move notification to players, with updated board state
    return 

def postMoveNotification(match_id, board):
    # get players from match_id
    # post board
    return 0 