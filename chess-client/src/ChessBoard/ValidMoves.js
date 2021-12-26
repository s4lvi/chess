export function validateMove(piece, from, to, board) {
    switch (piece.props.type) {
        case 'rook':
            return isRookMove(from, to, board, piece.props.color);
        case 'pawn':
            return isPawnMove(from, to, board, piece.props.color);
        case 'night':
            return isKnightMove(from, to, board, piece.props.color);
        case 'bishop':
            return isBishopMove(from, to, board, piece.props.color);
        case 'queen':
            return isQueenMove(from, to, board, piece.props.color);
        case 'king':
            return isKingMove(from, to, board, piece.props.color);
    }
}

function getCol(start, dir, count) {
    let alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let startIndex = alpha.indexOf(start);
    if (((startIndex + (dir*count)) > 0) && ((startIndex + (dir*count)) < 8)) {
        return alpha[(startIndex + (dir*count))];
    } else {
        return false
    }
}
function getRow(start, dir, count) {
    let alpha = ['1', '2', '3', '4', '5', '6', '7', '8'];
    let startIndex = alpha.indexOf(start);
    if (((startIndex + (dir*count)) > 0) && ((startIndex + (dir*count)) < 8)) {
        return alpha[(startIndex + (dir*count))];
    } else {
        return false
    }
}

function isRookMove(from, to, board, color) {
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
    return false;
}
function isBishopMove(from, to, board, color) {
    return false;
}
function isQueenMove(from, to, board, color) {
    return false;
}
function isKingMove(from, to, board, color) {
    return false;
}