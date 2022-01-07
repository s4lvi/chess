import * as React from "react"
import {ChessPiece, getImageForPiece} from "../ChessPiece/ChessPiece";
import {validateMove} from "./ValidMoves";
import cloneDeep from 'lodash/cloneDeep';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import Stack from '@mui/material/Stack';
import SocketClient from "../SocketClient/SocketClient";

class ChessBoard extends React.Component {
    constructor(props) {
        super(props);
        let board = this.packageBoard({'a':{'1':<ChessPiece type="rook" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="rook" color="black" />},
        'b':{'1':<ChessPiece type="night" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="night" color="black" />},
        'c':{'1':<ChessPiece type="bishop" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="bishop" color="black" />},
        'd':{'1':<ChessPiece type="king" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="king" color="black" />},
        'e':{'1':<ChessPiece type="queen" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="queen" color="black" />},
        'f':{'1':<ChessPiece type="bishop" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="bishop" color="black" />},
        'g':{'1':<ChessPiece type="night" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="night" color="black" />},
        'h':{'1':<ChessPiece type="rook" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="rook" color="black" />}
        });
        let playerId = "player-"+Math.floor(Math.random() * 9999);
        this.state = {
            board: board,
            matchId: props.matchId ? props.matchId : "",
            player: props.color ? props.color : 'white',
            turn: props.turn ? props.turn : playerId,
            playerId: props.playerId ? props.playerId : playerId,
            opponentId: props.opponentId ? props.opponentId : null,
            firstClick:null,
            secondClick:null,
            showMoves:false,
            showHint:false,
            moves: [],
            dead: props.dead ? props.dead : [[],[]],
            connected: false
        }
        this.cancelClicks = this.cancelClicks.bind(this);
        this.click = this.click.bind(this);
        this.pieceMove = this.pieceMove.bind(this);
        this.client = null;
        this.handleMessage = this.handleMessage.bind(this);
        this.connect = this.connect.bind(this);
    }

    connect() {
        this.client = new SocketClient(this.state.playerId, this.handleMessage)
        this.setState({connected: true})
    }

    join() {
        let message = {
            "action":"joinMatch",
            "message":{
                "player":this.state.playerId
            }
        }
        if (this.state.matchId !== "") {
            message["message"]["matchId"] = this.state.matchId;
        }
        console.log("joining with ", message)
        this.client.client.send(JSON.stringify(message))
    }

    sendMove(board) {
        let message = {
            "action": "sendMove",
            "message": {
                "matchId":this.state.matchId, 
                "board":JSON.stringify(this.state.board),
                "player":this.state.playerId,
                "dead":this.state.dead}
        }
        this.client.client.send(JSON.stringify(message))
    }

    handleMessage(m) {
        let data = JSON.parse(m.data);
        if (data["newMatchId"] !== null) {
            this.setState({matchId:data.newMatchId});
        }
        if (data["players"]) {
            let playerIndex = this.state.playerId === data["players"][0] ? 0 : 1;
            let opponentIndex = playerIndex === 1 ? 0 : 1;
            let playerColor = playerIndex === 1 ? "black" : "white"
            let boardParsed = JSON.parse(data["board"])
            this.setState({matchId:data["matchId"],opponentId:data["players"][opponentIndex],board:boardParsed,dead:data["dead"],turn:data["turn"],player:playerColor});
        }
    }

    generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    packageBoard(board) {
        let newboard = {};
        for (let i of Object.keys(board)) {
            newboard[i] = {}
            for (let j of Object.keys(board[i])) {
                if (board[i][j] !== null) {
                    newboard[i][j] = [board[i][j].props.color, board[i][j].props.type, false]
                } else {
                    newboard[i][j] = null;
                }
            }
        }
        return newboard;
    }

    unpackageBoard(board) {
        let newboard = {...board};
        for (let i of Object.keys(board)) {
            newboard[i] = {...board[i]}
            for (let j of Object.keys(board[i])) {
                if (board[i][j] !== null) {
                    newboard[i][j] = <ChessPiece type={board[i][j][1]} color={board[i][j][0]} selected={board[i][j][2]} />
                } else {
                    newboard[i][j] = null;
                }
            }
        }
        return newboard;
    }

    click(position) {
        if (this.state.firstClick !== null) {
            let newBoard = this.state.board;
            let pieceRef = newBoard[this.state.firstClick[0]][this.state.firstClick[1]];
            let piece = [pieceRef[0],pieceRef[1],false]
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
                newBoard[from[0]][from[1]] = null;
                newBoard[to[0]][to[1]] = null;
                this.setState({board: newBoard}, ()=>{
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
        let blackDead = this.state.dead[0].map(d => {return <img src={getImageForPiece(d,'white')} width='12px' alt={d}/>})
        let whiteDead = this.state.dead[1].map(d => {return <img src={getImageForPiece(d,'black')} width='12px' alt={d}/>})
        const bannerText = this.state.opponentId ? this.state.playerId + " vs " + this.state.opponentId : this.state.playerId + "'s open match"

        return(
            <div>
            <Stack spacing={2} direction="row">
                <TextField id="standard-basic" label="display name" value={this.state.playerId ? this.state.playerId : ""} onChange={(e) => this.setState({playerId: e.target.value})} variant="standard" />
                { this.state.connected === false &&
                    <Button sx={{backgroundColor: "#423121"}} variant="contained" onClick={() => this.connect()} >Connect</Button>
                }
                <TextField id="standard-basic" label="match id" value={this.state.matchId ? this.state.matchId : ""} onChange={(e) => this.setState({matchId: e.target.value})} variant="standard" />
                <Button sx={{backgroundColor: "#423121"}} variant="contained" onClick={() => this.join()} >Join</Button>
            </Stack>
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
            </div>
        )
    }
}

export default ChessBoard;