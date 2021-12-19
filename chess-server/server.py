from flask import Flask

app = Flask(__name__)

MONGO_URI = ""

@app.route("/")
def index():
    return "test"

@app.route("/move")
def make_move(match_id, player, move):
    # get moves list
    pastMoves = MongoService.getMoves(matchId)
    return 