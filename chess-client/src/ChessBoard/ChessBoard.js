import * as React from "react"
import ChessPiece from "../ChessPiece/ChessPiece";
import {validateMove} from "./ValidMoves";
class ChessBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board:  {'a':{'1':<ChessPiece type="rook" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="rook" color="black" />},
            'b':{'1':<ChessPiece type="night" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="night" color="black" />},
            'c':{'1':<ChessPiece type="bishop" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="bishop" color="black" />},
            'd':{'1':<ChessPiece type="king" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="king" color="black" />},
            'e':{'1':<ChessPiece type="queen" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="queen" color="black" />},
            'f':{'1':<ChessPiece type="bishop" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="bishop" color="black" />},
            'g':{'1':<ChessPiece type="night" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="night" color="black" />},
            'h':{'1':<ChessPiece type="rook" color="white" />,'2':<ChessPiece type="pawn" color="white" />,'3':null,'4':null,'5':null,'6':null,'7':<ChessPiece type="pawn" color="black" />,'8':<ChessPiece type="rook" color="black" />}
            },
            player:'white',
            firstClick:null,
            secondClick:null,
            showMoves:false,
            showHint:false
        }

        this.cancelClicks = this.cancelClicks.bind(this);
        this.click = this.click.bind(this);
        this.pieceMove = this.pieceMove.bind(this);
    }

    click(position) {
        if (this.state.firstClick !== null) {
            let newBoard = this.state.board;
            let pieceRef = newBoard[this.state.firstClick[0]][this.state.firstClick[1]];
            let piece = <ChessPiece type={pieceRef.props.type} color={pieceRef.props.color} selected="false" />
            newBoard[this.state.firstClick[0]][this.state.firstClick[1]] = null;
            this.setState({board: newBoard}, () => {
                newBoard[this.state.firstClick[0]][this.state.firstClick[1]] = piece;
                this.setState({secondClick: position, board: newBoard}, () => {
                    this.pieceMove(this.state.firstClick, this.state.secondClick);
                });
            });

        } else {
            let newBoard = this.state.board;
            let pieceRef = newBoard[position[0]][position[1]];
            if (pieceRef !== null && pieceRef.props.color === this.state.player) {
                let piece = <ChessPiece type={pieceRef.props.type} color={pieceRef.props.color} selected="true" />
                newBoard[position[0]][position[1]] = null;
                this.setState({firstClick: position, board: newBoard}, () => {
                    newBoard[position[0]][position[1]] = piece;
                    this.setState({board: newBoard});
                });
            } 
        }
    }

    cancelClicks() {
        console.log('canceling')
        let newBoard = this.state.board;
        this.setState({board: newBoard, firstClick: null, secondClick: null});
        this.forceUpdate();
    }

    pieceMove(from, to) {
        let newBoard = this.state.board;
        let piece1Ref = newBoard[from[0]][from[1]]
        if (piece1Ref !== null 
            && !(from[0] === to[0] && from[1] === to[1]) 
            && piece1Ref.props.color === this.state.player
            && validateMove(piece1Ref, from, to, this.state.board)) {
            let piece1 = <ChessPiece type={piece1Ref.props.type} color={piece1Ref.props.color} />
            let piece2 = newBoard[to[0]][to[1]]
            if (piece2 === null || piece1.props.color !== piece2.props.color){
                newBoard[from[0]][from[1]] = null;
                newBoard[to[0]][to[1]] = null;
                this.setState({board: newBoard}, ()=>{
                    newBoard[to[0]][to[1]] = piece1;
                    this.setState({board: newBoard})
                });
            }
        }
        this.cancelClicks();
    }

    xyToId(x,y){
        let row = 8 - parseInt(y);
        let col = x.charCodeAt(0) - 97
        return (row * 8) + col;
    }

    highlightSquare(x,y) {
        let id = this.xyToId(x,y);
    }

    render() {
        const board = this.state.board;
        return(
                <table className="chessBoard">
                    <tbody>
                    <tr className="chessRow">
                        <td className="squareWhite" id="0" onClick={(e)=>this.click(['a','8'])}>{board['a']['8']}</td>
                        <td className="squareBlack" id="1" onClick={(e)=>this.click(['b','8'])}>{board['b']['8']}</td>
                        <td className="squareWhite" id="2" onClick={(e)=>this.click(['c','8'])}>{board['c']['8']}</td>
                        <td className="squareBlack" id="3" onClick={(e)=>this.click(['d','8'])}>{board['d']['8']}</td>
                        <td className="squareWhite" id="4" onClick={(e)=>this.click(['e','8'])}>{board['e']['8']}</td>
                        <td className="squareBlack" id="5" onClick={(e)=>this.click(['f','8'])}>{board['f']['8']}</td>
                        <td className="squareWhite" id="6" onClick={(e)=>this.click(['g','8'])}>{board['g']['8']}</td>
                        <td className="squareBlack" id="7" onClick={(e)=>this.click(['h','8'])}>{board['h']['8']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareBlack" id="8" onClick={(e)=>this.click(['a','7'])}>{board['a']['7']}</td>
                        <td className="squareWhite" id="9" onClick={(e)=>this.click(['b','7'])}>{board['b']['7']}</td>
                        <td className="squareBlack" id="10" onClick={(e)=>this.click(['c','7'])}>{board['c']['7']}</td>
                        <td className="squareWhite" id="11" onClick={(e)=>this.click(['d','7'])}>{board['d']['7']}</td>
                        <td className="squareBlack" id="12" onClick={(e)=>this.click(['e','7'])}>{board['e']['7']}</td>
                        <td className="squareWhite" id="13" onClick={(e)=>this.click(['f','7'])}>{board['f']['7']}</td>
                        <td className="squareBlack" id="14" onClick={(e)=>this.click(['g','7'])}>{board['g']['7']}</td>
                        <td className="squareWhite" id="15" onClick={(e)=>this.click(['h','7'])}>{board['h']['7']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareWhite" id="16" onClick={(e)=>this.click(['a','6'])}>{board['a']['6']}</td>
                        <td className="squareBlack" id="17" onClick={(e)=>this.click(['b','6'])}>{board['b']['6']}</td>
                        <td className="squareWhite" id="18" onClick={(e)=>this.click(['c','6'])}>{board['c']['6']}</td>
                        <td className="squareBlack" id="19" onClick={(e)=>this.click(['d','6'])}>{board['d']['6']}</td>
                        <td className="squareWhite" id="20" onClick={(e)=>this.click(['e','6'])}>{board['e']['6']}</td>
                        <td className="squareBlack" id="21" onClick={(e)=>this.click(['f','6'])}>{board['f']['6']}</td>
                        <td className="squareWhite" id="22" onClick={(e)=>this.click(['g','6'])}>{board['g']['6']}</td>
                        <td className="squareBlack" id="23" onClick={(e)=>this.click(['h','6'])}>{board['h']['6']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareBlack" id="24" onClick={(e)=>this.click(['a','5'])}>{board['a']['5']}</td>
                        <td className="squareWhite" id="25" onClick={(e)=>this.click(['b','5'])}>{board['b']['5']}</td>
                        <td className="squareBlack" id="26" onClick={(e)=>this.click(['c','5'])}>{board['c']['5']}</td>
                        <td className="squareWhite" id="27" onClick={(e)=>this.click(['d','5'])}>{board['d']['5']}</td>
                        <td className="squareBlack" id="28" onClick={(e)=>this.click(['e','5'])}>{board['e']['5']}</td>
                        <td className="squareWhite" id="29" onClick={(e)=>this.click(['f','5'])}>{board['f']['5']}</td>
                        <td className="squareBlack" id="30" onClick={(e)=>this.click(['g','5'])}>{board['g']['5']}</td>
                        <td className="squareWhite" id="31" onClick={(e)=>this.click(['h','5'])}>{board['h']['5']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareWhite" id="32" onClick={(e)=>this.click(['a','4'])}>{board['a']['4']}</td>
                        <td className="squareBlack" id="33" onClick={(e)=>this.click(['b','4'])}>{board['b']['4']}</td>
                        <td className="squareWhite" id="34" onClick={(e)=>this.click(['c','4'])}>{board['c']['4']}</td>
                        <td className="squareBlack" id="35" onClick={(e)=>this.click(['d','4'])}>{board['d']['4']}</td>
                        <td className="squareWhite" id="36" onClick={(e)=>this.click(['e','4'])}>{board['e']['4']}</td>
                        <td className="squareBlack" id="37" onClick={(e)=>this.click(['f','4'])}>{board['f']['4']}</td>
                        <td className="squareWhite" id="38" onClick={(e)=>this.click(['g','4'])}>{board['g']['4']}</td>
                        <td className="squareBlack" id="39" onClick={(e)=>this.click(['h','4'])}>{board['h']['4']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareBlack" id="40" onClick={(e)=>this.click(['a','3'])}>{board['a']['3']}</td>
                        <td className="squareWhite" id="41" onClick={(e)=>this.click(['b','3'])}>{board['b']['3']}</td>
                        <td className="squareBlack" id="42" onClick={(e)=>this.click(['c','3'])}>{board['c']['3']}</td>
                        <td className="squareWhite" id="43" onClick={(e)=>this.click(['d','3'])}>{board['d']['3']}</td>
                        <td className="squareBlack" id="44" onClick={(e)=>this.click(['e','3'])}>{board['e']['3']}</td>
                        <td className="squareWhite" id="45" onClick={(e)=>this.click(['f','3'])}>{board['f']['3']}</td>
                        <td className="squareBlack" id="46" onClick={(e)=>this.click(['g','3'])}>{board['g']['3']}</td>
                        <td className="squareWhite" id="47" onClick={(e)=>this.click(['h','3'])}>{board['h']['3']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareWhite" id="48" onClick={(e)=>this.click(['a','2'])}>{board['a']['2']}</td>
                        <td className="squareBlack" id="49" onClick={(e)=>this.click(['b','2'])}>{board['b']['2']}</td>
                        <td className="squareWhite" id="50" onClick={(e)=>this.click(['c','2'])}>{board['c']['2']}</td>
                        <td className="squareBlack" id="51" onClick={(e)=>this.click(['d','2'])}>{board['d']['2']}</td>
                        <td className="squareWhite" id="52" onClick={(e)=>this.click(['e','2'])}>{board['e']['2']}</td>
                        <td className="squareBlack" id="53" onClick={(e)=>this.click(['f','2'])}>{board['f']['2']}</td>
                        <td className="squareWhite" id="54" onClick={(e)=>this.click(['g','2'])}>{board['g']['2']}</td>
                        <td className="squareBlack" id="55" onClick={(e)=>this.click(['h','2'])}>{board['h']['2']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareBlack" id="56" onClick={(e)=>this.click(['a','1'])}>{board['a']['1']}</td>
                        <td className="squareWhite" id="57" onClick={(e)=>this.click(['b','1'])}>{board['b']['1']}</td>
                        <td className="squareBlack" id="58" onClick={(e)=>this.click(['c','1'])}>{board['c']['1']}</td>
                        <td className="squareWhite" id="59" onClick={(e)=>this.click(['d','1'])}>{board['d']['1']}</td>
                        <td className="squareBlack" id="60" onClick={(e)=>this.click(['e','1'])}>{board['e']['1']}</td>
                        <td className="squareWhite" id="61" onClick={(e)=>this.click(['f','1'])}>{board['f']['1']}</td>
                        <td className="squareBlack" id="62" onClick={(e)=>this.click(['g','1'])}>{board['g']['1']}</td>
                        <td className="squareWhite" id="63" onClick={(e)=>this.click(['h','1'])}>{board['h']['1']}</td>
                    </tr>
                    </tbody>
                </table>
        )
    }
}

export default ChessBoard;