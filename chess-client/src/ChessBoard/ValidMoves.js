import cloneDeep from 'lodash/cloneDeep';

export function validateMove(piece, from, to, board, withCheck = true) {
    switch (piece[1]) {
        case 'rook':
            if (isRookMove(from, to, board, piece[0])) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece[0])
                }
                return true;
            }
            return false
        case 'pawn':
            if (isPawnMove(from, to, board, piece[0])) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece[0])
                }
                return true;
            }
            return false
        case 'night':
            if (isKnightMove(from, to, board, piece[0])) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece[0])
                }
                return true;
            }
            return false
        case 'bishop':
            if (isBishopMove(from, to, board, piece[0])) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece[0])
                }
                return true;
            }
            return false
        case 'queen':
            if (isQueenMove(from, to, board, piece[0])) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece[0])
                }
                return true;
            }
            return false
        case 'king':
            if (isKingMove(from, to, board, piece[0])) {
                if (withCheck) {
                    let nextBoard = generateBoard(piece, from, to, board);
                    return !isKingCheck(nextBoard, piece[0])
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
                if (!(board[i][j][1] in dict[board[i][j][0]])) {
                    dict[board[i][j][0]][board[i][j][1]] = [];
                }
                dict[board[i][j][0]][board[i][j][1]].push([i,j])
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
    return (board[to[0]][to[1]] === null || board[to[0]][to[1]][0] !== color)
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
    if (from[0] !== to[0]) { // if making a capture move
        // check diagonals if enemy is in square
        let diagRight = [getCol(from[0], 1, 1),getRow(from[1], dir, 1)]
        let diagLeft = [getCol(from[0], -1, 1),getRow(from[1], dir, 1)]
        if (diagRight[0] === to[0] && diagRight[1] === to[1] 
            && board[diagRight[0]][diagRight[1]] !== null && board[diagRight[0]][diagRight[1]][0] !== color) return true
        if (diagLeft[0] === to[0] && diagLeft[1] === to[1] 
            && board[diagLeft[0]][diagLeft[1]] !== null && board[diagLeft[0]][diagLeft[1]][0] !== color) return true
        // check en-passant capture
        if ((from[1] === '5' && color === "white") || (from[1] === '4' && color === "black")) { // if the piece is starting in the right row
            let diagRight = [getCol(from[0], 1, 1),getRow(from[1], dir, 1)]
            let diagLeft = [getCol(from[0], -1, 1),getRow(from[1], dir, 1)]
            let right = [getCol(from[0], 1, 1),from[1]]
            let left = [getCol(from[0], -1, 1),from[1]]
            if (diagRight[0] === to[0] && diagRight[1] === to[1] && board[diagRight[0]][diagRight[1]] === null // check moving to diagonal and its empty
                && board[right[0]][right[1]] !== null && board[right[0]][right[1]][0] !== color // check theres a piece to that side and its not your piece
                && board[right[0]][right[1]][1] === 'pawn' && board[right[0]][right[1]][3] === true) return true // check that piece is a pawn and it has made a jump
            if (diagLeft[0] === to[0] && diagLeft[1] === to[1] && board[diagLeft[0]][diagLeft[1]] === null 
                && board[left[0]][left[1]] !== null && board[left[0]][left[1]][0] !== color
                && board[left[0]][left[1]][1] === 'pawn' && board[left[0]][left[1]][3] === true) return true
        }
    }
    
    return false;
}
function isKnightMove(from, to, board, color) {
    let move = []
    let piece = null
    move = [getCol(from[0],1,1),getRow(from[1],1,2)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece[0] !== color)) return true 
    }
    move = [getCol(from[0],1,1),getRow(from[1],-1,2)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece[0] !== color)) return true 
    }
    move = [getCol(from[0],-1,1),getRow(from[1],1,2)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece[0] !== color)) return true 
    }
    move = [getCol(from[0],-1,1),getRow(from[1],-1,2)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece[0] !== color)) return true 
    }
    move = [getCol(from[0],1,2),getRow(from[1],1,1)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece[0] !== color)) return true 
    }
    move = [getCol(from[0],1,2),getRow(from[1],-1,1)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece[0] !== color)) return true 
    }
    move = [getCol(from[0],-1,2),getRow(from[1],1,1)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece[0] !== color)) return true 
    }
    move = [getCol(from[0],-1,2),getRow(from[1],-1,1)]
    if (equal(move,move)) {
        piece = board[move[0]][move[1]]
        if (equal(move, to) && (piece === null || piece[0] !== color)) return true 
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

    // castling 
    if ((from[1] === to[1]) && ((to[0] === getCol(from[0],-1,2)) || (to[0] === getCol(from[0],1,2)))) {
        console.log("attempting castling")
        // check if king has moved
        if (board[from[0]][from[1]][3]) {
            console.log("king already moved")
            return false
        }
        // check if rook has moved
        var row = color === 'white' ? '1' : '8'
        console.log("row ", row);
        if ((to[0] === getCol(from[0],-1,2))) { // left rook
            console.log("left rook")
            if (board['a'][row][3]) {
                console.log("rook already moved")
                return false
            }
            var rookFrom = ['a',row]
            var rookTo = [getCol(from[0],-1,1), row]
            if (!isRookMove(rookFrom, rookTo, board, color)) { // check if theres pieces in between
                console.log("rook blocked")
                return false;
            }
        } else { // right rook
            console.log("right rook")
            if (board['h'][row][3]) {
                console.log("rook already moved")
                return false
            }
            var rookFrom = ['h',row]
            var rookTo = [getCol(from[0],1,1), row]
            if (!isRookMove(rookFrom, rookTo, board, color)) { // check if theres pieces in between
                console.log("rook blocked")
                return false;
            }
        }
        // check if king is in check
        if (isKingCheck(board, color)) {
            console.log("king in check")
            return false;
        }
        console.log("good castle")
        return true;
    }
    // normal moves
    for (let i = 1; i < 2; i++) {
        if (isMove([getCol(from[0],dir[0],i), getRow(from[1],dir[1],i)], to, board, color)) {
            return isEmptyOrEnemy(to, board, color);
        }
        if (!isEmpty([getCol(from[0],dir[0],i), getRow(from[1],dir[1],i)], board)) return false;
    }
    return false;
}

function getMoves(type, location, board, color) {
    switch (type) {
        case 'rook':
            return getRookMoves(location, board, color);
        case 'pawn':
            return getPawnMoves(location, board, color);
        case 'night':
            return getKnightMoves(location, board, color);
        case 'bishop':
            return getBishopMoves(location, board, color);
        case 'queen':
            return getQueenMoves(location, board, color);
        case 'king':
            return getKingMoves(location, board, color);
        default:
            return [];
    }
}

function getRookMoves(location, board, color) {
    var moves = [];
    for (let d = -1; d < 2; d + 2) {
        for (let i = 1; i < 9; i++) {
            var col = getCol(location[0],d,i);
            var row = getRow(location[1],0,i);
            if (isMove(location, [col, row], board, color)) {
                if (isEmptyOrEnemy([col, row], board, color)) {
                    moves.push([col, row]);
                } else {
                    continue;
                }
            }
        }
    }
    for (let d = -1; d < 2; d + 2) {
        for (let i = 1; i < 9; i++) {
            var col = getCol(location[0],0,i);
            var row = getRow(location[1],d,i);
            if (isMove(location, [col, row], board, color)) {
                if (isEmptyOrEnemy([col, row], board, color)) {
                    moves.push([col, row]);
                } else {
                    continue;
                }
            }
        }
    }
    return moves;
}

function getPawnMoves(location, board, color) {
    return [];
}

function getKnightMoves(location, board, color) {
    return [];
}

function getBishopMoves(location, board, color) {
    var moves = [];
    for (let d1 = -1; d1 < 2; d1 + 2) {
        for (let d2 = -1; d2 < 2; d2 + 2) {
            for (let i = 1; i < 9; i++) {
                var col = getCol(location[0],d1,i);
                var row = getRow(location[1],d2,i);
                if (isMove(location, [col, row], board, color)) {
                    if (isEmptyOrEnemy([col, row], board, color)) {
                        moves.push([col, row]);
                    } else {
                        continue;
                    }
                }
            }
        }
    }
    return moves;
}

function getQueenMoves(location, board, color) {
    return [];
}

function getKingMoves(location, board, color) {
    return [];
}

export function isKingCheck(board, color) {
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
            for (let p of pieces['white'][k]) {
                if (validateMove(board[p[0]][p[1]], p, pieces['black']['king'][0], board, false)) return true;
            }
        }
    }
    return false;
}


export function isCheckmate(board, color) {
    let pieces = generatePieceDict(board);
    for (let k of Object.keys(pieces[color])) {
        for (let p of pieces[color][k]) { // for every piece
            for (let m of getMoves(k, p)) { // try every possible move
                if (validateMove(board[p[0]][p[1]], p, m, board, false)) {
                    return false; // if the move is valid, it means that move has removed the check and the game is not over
                }
            }
        }
    }
    return true;
}