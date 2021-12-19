class ChessGame():

    board = {}

    def __init__(self, movesList = []):
        self.board = self.constructBoard(movesList)
        
    def constructBoard(movesList):