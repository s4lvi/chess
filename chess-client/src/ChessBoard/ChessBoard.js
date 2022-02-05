import * as React from "react"
import {ChessPiece, getImageForPiece} from "../ChessPiece/ChessPiece";
import {validateMove, isKingCheck, isCheckmate} from "./ValidMoves";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SocketClient from "../SocketClient/SocketClient";

class ChessBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: props.board,
            matchId: props.matchId,
            player: props.playerColor,
            turn: props.turn,
            playerId: props.playerId,
            opponentId: props.opponentId ? props.opponentId : null,
            firstClick:null,
            secondClick:null,
            showMoves:false,
            showHint:false,
            moves: [],
            dead: props.dead,
            connected: false,
            notify: props.notify
        }
        this.cancelClicks = this.cancelClicks.bind(this);
        this.click = this.click.bind(this);
        this.pieceMove = this.pieceMove.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({matchId:nextProps.matchId,opponentId:nextProps.opponentId,board:nextProps.board,
            dead:nextProps.dead,turn:nextProps.turn,player:nextProps.playerColor,notify:nextProps.notify}, () => {
                let isKingCheck = isKingCheck(nextProps.board, this.state.player);
                let notify = isKingCheck ? this.state.player + "'s king is in check" : null;
                console.log(notify);
                if (isKingCheck) {
                    let isCheckmate = isCheckmate(nextProps.board, this.state.player);
                    if (isCheckmate) {
                        notify = "Checkmate! Player " + this.state.player === 'white' ? 'black' : 'white' + " wins.";
                    }
                }
                this.setState({notify:notify});
            })
    }
                       
    sendMove(board) {
        let message = {
            "action": "sendMove",
            "message": {
                "matchId":this.state.matchId, 
                "board":JSON.stringify(this.state.board),
                "player":this.state.playerId,
                "dead":this.state.dead,
                "notify":this.state.notify}
        }
        this.props.sendMove(message)
    }

    click(position) {
        if (this.state.firstClick !== null) {
            let newBoard = this.state.board;
            let pieceRef = newBoard[this.state.firstClick[0]][this.state.firstClick[1]];
            let piece = [pieceRef[0],pieceRef[1],false,pieceRef[3]]
            this.setState({board: newBoard}, () => {
                newBoard[this.state.firstClick[0]][this.state.firstClick[1]] = piece;
                this.setState({secondClick: position, board: newBoard}, () => {
                    this.pieceMove(this.state.firstClick, this.state.secondClick);
                });
            });

        } else {
            let newBoard = this.state.board;
            let pieceRef = newBoard[position[0]][position[1]];
            if (pieceRef !== null && pieceRef[0] === this.state.player) {
                pieceRef[2] = true
                let piece = pieceRef
                newBoard[position[0]][position[1]] = null;
                this.setState({firstClick: position, board: newBoard}, () => {
                    newBoard[position[0]][position[1]] = piece;
                    this.setState({board: newBoard});
                });
            } 
        }
    }

    cancelClicks() {
        let newBoard = this.state.board;
        this.setState({board: newBoard, firstClick: null, secondClick: null});
    }

    pieceMove(from, to) {
        if (this.state.turn === this.state.playerId) {
            let newBoard = this.state.board;
            let piece1Ref = newBoard[from[0]][from[1]]
            if (piece1Ref !== null 
                && !(from[0] === to[0] && from[1] === to[1]) 
                && piece1Ref[0] === this.state.player
                && validateMove(piece1Ref, from, to, this.state.board)) {
                let piece1 = piece1Ref
                let piece2 = newBoard[to[0]][to[1]]
                if (piece2 !== null) {
                    let newDead = this.state.dead;
                    if (piece2[0] === 'white') {
                        newDead[0].push(piece2[1])
                    } else {
                        newDead[1].push(piece2[1])
                    }
                    this.setState({dead:newDead});
                }
                if (piece1[1] === 'pawn' && (to[1] === "1" || to[1] === "8")) { // pawn promotion
                    piece1[1] = 'queen';
                }
                if (piece1[1] === 'pawn' && ((from[1] === "2" && to[1] === "4") || (from[1] === "7" && to[1] === "5"))) { // pawn first move jump
                    piece1[3] = true;
                }
                if (piece1[1] === 'pawn' && ((from[1] === '4') || (from[1] === '5')) && from[0] !== to[0] && newBoard[to[0]][to[1]] === null) { // en passant
                    newBoard[to[0]][from[1]] = null;
                }
                var rookRef = null;
                var castlingFlag = false;
                console.log(piece1,piece1[1] === 'king',!piece1[3]);
                if ((piece1[1] === 'king') && (!piece1[3])) { // set king moved flag true (for castling)
                    piece1[3] = true;
                    console.log(to[0])
                    if (to[0] === 'c' || to[0] === 'g') {
                        console.log('castling')
                        castlingFlag = true;
                        var rookFrom = [to[0] === 'c' ? 'a' : 'h',piece1[0] === 'white' ? '1' : '8']
                        var rookTo = [to[0] === 'c' ? 'd' : 'f',piece1[0] === 'white' ? '1' : '8']
                        console.log("rook from ", rookFrom)
                        console.log("rook to ", rookTo)
                        rookRef = newBoard[rookFrom[0]][rookFrom[1]]
                        newBoard[rookFrom[0]][rookFrom[1]] = null;
                        newBoard[rookTo[0]][rookTo[1]] = null;
                    }
                }
                newBoard[from[0]][from[1]] = null;
                newBoard[to[0]][to[1]] = null;
                this.setState({board: newBoard}, ()=>{
                    if (castlingFlag) { // move rook for castling
                        console.log('moving rook')
                        var rookTo = [to[0] === 'c' ? 'd' : 'f',piece1[0] === 'white' ? '1' : '8']
                        newBoard[rookTo[0]][rookTo[1]] = rookRef;
                    }
                    newBoard[to[0]][to[1]] = piece1;
                    let move = [this.state.player,piece1Ref[1],to[0],to[1]]  
                    let moves = this.state.moves;
                    moves.push(move);
                    this.setState({board: newBoard, 
                                    moves: moves}, () => this.sendMove(newBoard))
                });
            }
            this.cancelClicks();
        }
    }

    xyToId(x,y){
        let row = 8 - parseInt(y);
        let col = x.charCodeAt(0) - 97
        return (row * 8) + col;
    }

    highlightSquare(x,y) {
        let id = this.xyToId(x,y);
        return id;
    }

    getDead(color) {
        return this.state.dead[color];
    }

    getPiece(c, r) {
        let board = this.state.board;
        if (board[c][r] !== null) {
            return <ChessPiece key={Math.floor(Math.random() * 9999)} type={board[c][r][1]} color={board[c][r][0]} selected={board[c][r][2]} />
        } else 
            return null
    }

    render() {
        let blackDead = this.state.dead[0].map(d => {return <img className="deadPiece" src={getImageForPiece(d,'white')} alt={d}/>})
        let whiteDead = this.state.dead[1].map(d => {return <img className="deadPiece" src={getImageForPiece(d,'black')} alt={d}/>})
        let bannerText = this.state.opponentId ? this.state.playerId + " vs " + this.state.opponentId : this.state.playerId + "'s open match"
        if (this.state.notify) {
            bannerText = bannerText + " | " + this.state.notify;
        }
        return(
            
            <Card sx={{backgroundColor: "#f8f1e3"}} variant="outlined">
                <CardContent>
                <table className="chessBoard">
                <tbody>
                <tr className="infoRow">
                    <td colSpan="8">{bannerText}</td>
                </tr>
                <tr className="infoRow">
                    <td colSpan="3">{whiteDead}</td>
                    <td colSpan="2">{this.state.winner ? this.state.winner+" wins!" : this.state.turn+"'s turn"}</td>
                    <td colSpan="3">{blackDead}</td>
                </tr>
                <tr className="chessRow">
                    <td className="squareWhite" id="0" onClick={(e)=>this.click(['a','8'])}>{this.getPiece('a','8')}</td>
                    <td className="squareBlack" id="1" onClick={(e)=>this.click(['b','8'])}>{this.getPiece('b','8')}</td>
                    <td className="squareWhite" id="2" onClick={(e)=>this.click(['c','8'])}>{this.getPiece('c','8')}</td>
                    <td className="squareBlack" id="3" onClick={(e)=>this.click(['d','8'])}>{this.getPiece('d','8')}</td>
                    <td className="squareWhite" id="4" onClick={(e)=>this.click(['e','8'])}>{this.getPiece('e','8')}</td>
                    <td className="squareBlack" id="5" onClick={(e)=>this.click(['f','8'])}>{this.getPiece('f','8')}</td>
                    <td className="squareWhite" id="6" onClick={(e)=>this.click(['g','8'])}>{this.getPiece('g','8')}</td>
                    <td className="squareBlack" id="7" onClick={(e)=>this.click(['h','8'])}>{this.getPiece('h','8')}</td>
                </tr>
                <tr className="chessRow">
                    <td className="squareBlack" id="8" onClick={(e)=>this.click(['a','7'])}>{this.getPiece('a','7')}</td>
                    <td className="squareWhite" id="9" onClick={(e)=>this.click(['b','7'])}>{this.getPiece('b','7')}</td>
                    <td className="squareBlack" id="10" onClick={(e)=>this.click(['c','7'])}>{this.getPiece('c','7')}</td>
                    <td className="squareWhite" id="11" onClick={(e)=>this.click(['d','7'])}>{this.getPiece('d','7')}</td>
                    <td className="squareBlack" id="12" onClick={(e)=>this.click(['e','7'])}>{this.getPiece('e','7')}</td>
                    <td className="squareWhite" id="13" onClick={(e)=>this.click(['f','7'])}>{this.getPiece('f','7')}</td>
                    <td className="squareBlack" id="14" onClick={(e)=>this.click(['g','7'])}>{this.getPiece('g','7')}</td>
                    <td className="squareWhite" id="15" onClick={(e)=>this.click(['h','7'])}>{this.getPiece('h','7')}</td>
                </tr>
                <tr className="chessRow">
                    <td className="squareWhite" id="16" onClick={(e)=>this.click(['a','6'])}>{this.getPiece('a','6')}</td>
                    <td className="squareBlack" id="17" onClick={(e)=>this.click(['b','6'])}>{this.getPiece('b','6')}</td>
                    <td className="squareWhite" id="18" onClick={(e)=>this.click(['c','6'])}>{this.getPiece('c','6')}</td>
                    <td className="squareBlack" id="19" onClick={(e)=>this.click(['d','6'])}>{this.getPiece('d','6')}</td>
                    <td className="squareWhite" id="20" onClick={(e)=>this.click(['e','6'])}>{this.getPiece('e','6')}</td>
                    <td className="squareBlack" id="21" onClick={(e)=>this.click(['f','6'])}>{this.getPiece('f','6')}</td>
                    <td className="squareWhite" id="22" onClick={(e)=>this.click(['g','6'])}>{this.getPiece('g','6')}</td>
                    <td className="squareBlack" id="23" onClick={(e)=>this.click(['h','6'])}>{this.getPiece('h','6')}</td>
                </tr>
                <tr className="chessRow">
                    <td className="squareBlack" id="24" onClick={(e)=>this.click(['a','5'])}>{this.getPiece('a','5')}</td>
                    <td className="squareWhite" id="25" onClick={(e)=>this.click(['b','5'])}>{this.getPiece('b','5')}</td>
                    <td className="squareBlack" id="26" onClick={(e)=>this.click(['c','5'])}>{this.getPiece('c','5')}</td>
                    <td className="squareWhite" id="27" onClick={(e)=>this.click(['d','5'])}>{this.getPiece('d','5')}</td>
                    <td className="squareBlack" id="28" onClick={(e)=>this.click(['e','5'])}>{this.getPiece('e','5')}</td>
                    <td className="squareWhite" id="29" onClick={(e)=>this.click(['f','5'])}>{this.getPiece('f','5')}</td>
                    <td className="squareBlack" id="30" onClick={(e)=>this.click(['g','5'])}>{this.getPiece('g','5')}</td>
                    <td className="squareWhite" id="31" onClick={(e)=>this.click(['h','5'])}>{this.getPiece('h','5')}</td>
                </tr>
                <tr className="chessRow">
                    <td className="squareWhite" id="32" onClick={(e)=>this.click(['a','4'])}>{this.getPiece('a','4')}</td>
                    <td className="squareBlack" id="33" onClick={(e)=>this.click(['b','4'])}>{this.getPiece('b','4')}</td>
                    <td className="squareWhite" id="34" onClick={(e)=>this.click(['c','4'])}>{this.getPiece('c','4')}</td>
                    <td className="squareBlack" id="35" onClick={(e)=>this.click(['d','4'])}>{this.getPiece('d','4')}</td>
                    <td className="squareWhite" id="36" onClick={(e)=>this.click(['e','4'])}>{this.getPiece('e','4')}</td>
                    <td className="squareBlack" id="37" onClick={(e)=>this.click(['f','4'])}>{this.getPiece('f','4')}</td>
                    <td className="squareWhite" id="38" onClick={(e)=>this.click(['g','4'])}>{this.getPiece('g','4')}</td>
                    <td className="squareBlack" id="39" onClick={(e)=>this.click(['h','4'])}>{this.getPiece('h','4')}</td>
                </tr>
                <tr className="chessRow">
                    <td className="squareBlack" id="40" onClick={(e)=>this.click(['a','3'])}>{this.getPiece('a','3')}</td>
                    <td className="squareWhite" id="41" onClick={(e)=>this.click(['b','3'])}>{this.getPiece('b','3')}</td>
                    <td className="squareBlack" id="42" onClick={(e)=>this.click(['c','3'])}>{this.getPiece('c','3')}</td>
                    <td className="squareWhite" id="43" onClick={(e)=>this.click(['d','3'])}>{this.getPiece('d','3')}</td>
                    <td className="squareBlack" id="44" onClick={(e)=>this.click(['e','3'])}>{this.getPiece('e','3')}</td>
                    <td className="squareWhite" id="45" onClick={(e)=>this.click(['f','3'])}>{this.getPiece('f','3')}</td>
                    <td className="squareBlack" id="46" onClick={(e)=>this.click(['g','3'])}>{this.getPiece('g','3')}</td>
                    <td className="squareWhite" id="47" onClick={(e)=>this.click(['h','3'])}>{this.getPiece('h','3')}</td>
                </tr>
                <tr className="chessRow">
                    <td className="squareWhite" id="48" onClick={(e)=>this.click(['a','2'])}>{this.getPiece('a','2')}</td>
                    <td className="squareBlack" id="49" onClick={(e)=>this.click(['b','2'])}>{this.getPiece('b','2')}</td>
                    <td className="squareWhite" id="50" onClick={(e)=>this.click(['c','2'])}>{this.getPiece('c','2')}</td>
                    <td className="squareBlack" id="51" onClick={(e)=>this.click(['d','2'])}>{this.getPiece('d','2')}</td>
                    <td className="squareWhite" id="52" onClick={(e)=>this.click(['e','2'])}>{this.getPiece('e','2')}</td>
                    <td className="squareBlack" id="53" onClick={(e)=>this.click(['f','2'])}>{this.getPiece('f','2')}</td>
                    <td className="squareWhite" id="54" onClick={(e)=>this.click(['g','2'])}>{this.getPiece('g','2')}</td>
                    <td className="squareBlack" id="55" onClick={(e)=>this.click(['h','2'])}>{this.getPiece('h','2')}</td>
                </tr>
                <tr className="chessRow">
                    <td className="squareBlack" id="56" onClick={(e)=>this.click(['a','1'])}>{this.getPiece('a','1')}</td>
                    <td className="squareWhite" id="57" onClick={(e)=>this.click(['b','1'])}>{this.getPiece('b','1')}</td>
                    <td className="squareBlack" id="58" onClick={(e)=>this.click(['c','1'])}>{this.getPiece('c','1')}</td>
                    <td className="squareWhite" id="59" onClick={(e)=>this.click(['d','1'])}>{this.getPiece('d','1')}</td>
                    <td className="squareBlack" id="60" onClick={(e)=>this.click(['e','1'])}>{this.getPiece('e','1')}</td>
                    <td className="squareWhite" id="61" onClick={(e)=>this.click(['f','1'])}>{this.getPiece('f','1')}</td>
                    <td className="squareBlack" id="62" onClick={(e)=>this.click(['g','1'])}>{this.getPiece('g','1')}</td>
                    <td className="squareWhite" id="63" onClick={(e)=>this.click(['h','1'])}>{this.getPiece('h','1')}</td>
                </tr>
                </tbody>
            </table>
            </CardContent>
        </Card>
        )
    }
}

export default ChessBoard;