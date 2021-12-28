import cloneDeep from 'lodash/cloneDeep';

export function validateMove(piece, from, to, board, withCheck = true) {
    switch (piece.props.type) {
        case 'rook':
            if (isRookMove(from, to, board, piece.props.color)) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece.props.color)
                }
                return true;
            }
            return false
        case 'pawn':
            if (isPawnMove(from, to, board, piece.props.color)) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece.props.color)
                }
                return true;
            }
            return false
        case 'night':
            if (isKnightMove(from, to, board, piece.props.color)) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece.props.color)
                }
                return true;
            }
            return false
        case 'bishop':
            if (isBishopMove(from, to, board, piece.props.color)) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece.props.color)
                }
                return true;
            }
            return false
        case 'queen':
            if (isQueenMove(from, to, board, piece.props.color)) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece.props.color)
                }
                return true;
            }
            return false
        case 'king':
            if (isKingMove(from, to, board, piece.props.color)) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece.props.color)
                }
                return true;
            }
            return false
        default:
            return false;
    }
}

function generatePieceDict(board) {
    let dict = {'white':{},'black':{}}
    for (let i of Object.keys(board)) {
        for (let j of Object.keys(board[i])) {
            if (board[i][j] !== null) {
                if (!(board[i][j].props.type in dict[board[i][j].props.color])) {
                    dict[board[i][j].props.color][board[i][j].props.type] = [];
                }
                dict[board[i][j].props.color][board[i][j].props.type].push([i,j])
            }
        }
    }
    return dict;
}

function generateBoard(piece, from, to, board) {
    let newBoard = cloneDeep(board);
    newBoard[from[0]][from[1]] = null;
    newBoard[to[0]][to[1]] = piece;
    return newBoard;
}

function getCol(start, dir, count) {
    let alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let startIndex = alpha.indexOf(start);
    if (((startIndex + (dir*count)) >= 0) && ((startIndex + (dir*count)) < 8)) {
        return alpha[(startIndex + (dir*count))];
    } else {
        return false
    }
}
function getRow(start, dir, count) {
    let alpha = ['1', '2', '3', '4', '5', '6', '7', '8'];
    let startIndex = alpha.indexOf(start);
    if (((startIndex + (dir*count)) >= 0) && ((startIndex + (dir*count)) < 8)) {
        return alpha[(startIndex + (dir*count))];
    } else {
        return false
    }
}

function equal(from, to) {
    if (from[0] !== false && from[1] !== false && to[0] !== false && to[1] !== false) {
        return (from[0] === to[0] && from[1] === to[1])
    } 
    return false
}

function isMove(move, to, board, color) {
    // returns true if the destination is the same as 'to'
    return (equal(move,move) && equal(move,to))
}
function isEmptyOrEnemy(to, board, color) {
    // returns true if the space is empty or an enemy
    return (board[to[0]][to[1]] === null || board[to[0]][to[1]].props.color !== color)
}
function isEmpty(to, board) {
    return (equal(to, to) && board[to[0]][to[1]] === null)
}
function dirFromTo(from, to) {
    return [to[0] === from[0] ? 0 : to[0] > from[0] ? 1 : -1, to[1] === from[1] ? 0 : to[1] > from[1] ? 1 : -1]
}

function isRookMove(from, to, board, color) {
    let dir = dirFromTo(from, to);
    if (dir[0] === 0 || dir[1] === 0) {
        for (let i = 1; i < 9; i++) {
            if (isMove([getCol(from[0],dir[0],i), getRow(from[1],dir[1],i)], to, board, color)) {
                return isEmptyOrEnemy(to, board, color);
            }
            if (!isEmpty([getCol(from[0],dir[0],i), getRow(from[1],dir[1],i)], board)) return false;
        }
    }
    return false;
}
function isPawnMove(from, to, board, color) {
    let dir = color === 'white' ? 1 : -1;
    // check if 1 forward movement, and no piece is in the square
    let piece = board[getCol(from[0], dir, 0)][getRow(from[1], dir, 1)]
    if (((getCol(from[0], dir, 0) === to[0]) && (getRow(from[1], dir, 1) === to[1])) 
        && piece === null) return true;
    // if pawn is in starting movement, check 2 forward movement
    if ((color === 'white' && from[1] === '2') || (color === 'black' && from[1] === '7')) {
        let piece1 = board[getCol(from[0], dir, 0)][getRow(from[1], dir, 1)]
        let piece2 = board[getCol(from[0], dir, 0)][getRow(from[1], dir, 2)]
        if (((getCol(from[0], dir, 0) === to[0]) && (getRow(from[1], dir, 2) === to[1])) 
            && piece1 === null && piece2 === null) return true;
    }
    // check diagonals if enemy is in square
    let diagRight = [getCol(from[0], 1, 1),getRow(from[1], dir, 1)]
    let diagLeft = [getCol(from[0], -1, 1),getRow(from[1], dir, 1)]
    if (diagRight[0] === to[0] && diagRight[1] === to[1] 
        && board[diagRight[0]][diagRight[1]] !== null && board[diagRight[0]][diagRight[1]].props.color !== color) return true
    if (diagLeft[0] === to[0] && diagLeft[1] === to[1] 
        && board[diagLeft[0]][diagLeft[1]] !== null && board[diagLeft[0]][diagLeft[1]].props.color !== color) return true
    return false;
}
function isKnightMove(from, to, board, color) {
    let move = []
    let piece = null
    move = [getCol(from[0],1,1),getRow(from[1],1,2)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece.props.color !== color)) return true 
    }
    move = [getCol(from[0],1,1),getRow(from[1],-1,2)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece.props.color !== color)) return true 
    }
    move = [getCol(from[0],-1,1),getRow(from[1],1,2)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece.props.color !== color)) return true 
    }
    move = [getCol(from[0],-1,1),getRow(from[1],-1,2)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece.props.color !== color)) return true 
    }
    move = [getCol(from[0],1,2),getRow(from[1],1,1)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece.props.color !== color)) return true 
    }
    move = [getCol(from[0],1,2),getRow(from[1],-1,1)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece.props.color !== color)) return true 
    }
    move = [getCol(from[0],-1,2),getRow(from[1],1,1)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece.props.color !== color)) return true 
    }
    move = [getCol(from[0],-1,2),getRow(from[1],-1,1)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece.props.color !== color)) return true 
    }
    return false;
}
function isBishopMove(from, to, board, color) {
    let dir = dirFromTo(from, to);
    if (dir[0] !== 0 && dir[1] !== 0){
        for (let i = 1; i < 9; i++) {
            if (isMove([getCol(from[0],dir[0],i), getRow(from[1],dir[1],i)], to, board, color)) {
                return isEmptyOrEnemy(to, board, color);
            }
            if (!isEmpty([getCol(from[0],dir[0],i), getRow(from[1],dir[1],i)], board)) return false;
        }
    } 
    return false;
}

function isQueenMove(from, to, board, color) {
    let dir = dirFromTo(from, to);
    for (let i = 1; i < 9; i++) {
        if (isMove([getCol(from[0],dir[0],i), getRow(from[1],dir[1],i)], to, board, color)) {
            return isEmptyOrEnemy(to, board, color);
        }
        if (!isEmpty([getCol(from[0],dir[0],i), getRow(from[1],dir[1],i)], board)) return false;
    }
    return false;
}
function isKingMove(from, to, board, color) {
    let dir = dirFromTo(from, to);
    for (let i = 1; i < 2; i++) {
        if (isMove([getCol(from[0],dir[0],i), getRow(from[1],dir[1],i)], to, board, color)) {
            return isEmptyOrEnemy(to, board, color);
        }
        if (!isEmpty([getCol(from[0],dir[0],i), getRow(from[1],dir[1],i)], board)) return false;
    }
    return false;
}

function isKingCheck(board, color) {
    let pieces = generatePieceDict(board);
    if (color === 'white') {
        for (let k of Object.keys(pieces['black'])) {
            for (let p of pieces['black'][k]) {
                if (validateMove(board[p[0]][p[1]], p, pieces['white']['king'][0], board, false)) {
                    return true;
                }
            }
        }
    }
    else {
        for (let k of Object.keys(pieces['white'])) {
            console.log(pieces['white'][k])
            for (let p of pieces['white'][k]) {
                if (validateMove(board[p[0]][p[1]], p, pieces['black']['king'][0], board, false)) return true;
            }
        }
    }
    return false;
}