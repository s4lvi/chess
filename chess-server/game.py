class ChessGame:

    board = {}
    invalidState = False

    def __init__(self, movesList = []):
        self.board = self.constructBoard(movesList)
        
    def constructBoard(self, movesList):

        for m in movesList:
            newBoard = self.playGame(m)
            if (newBoard == "INVALID"):
                self.board = newBoard
            else:
                self.invalidState = True

    def getGameState(self):
        if (self.invalidState):
            return "INVALID"
        else:
            return self.board
    
    def playGame(self, move, player):
        unit = move[0]
        column = move[1]
        row = move[2]

    def getValidMoves(self, piece):
        return 
