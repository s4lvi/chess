from flask import Flask
from .mongo_service import MongoService
from .game import ChessGame

app = Flask(__name__)

MONGO_URI = ""

service = MongoService()
game = ChessGame()

@app.route("/")
def index():
    return "test"

@app.route("/move")
def make_move(match_id, player, move):
    # get moves list
    pastMoves = service.getMoves(match_id)
    return 