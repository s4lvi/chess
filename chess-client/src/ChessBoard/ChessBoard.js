import * as React from "react"
import ChessPiece from "../ChessPiece/ChessPiece";
class ChessBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: {'a':{'1':<ChessPiece type="rook" color="white" position='a1' />,'2':<ChessPiece type="pawn" color="white" position='a1' />,'3':null,'4':null,'5':null,'6':null,'7':null,'8':null},
            'b':{'1':<ChessPiece type="knight" color="white" position='a1' />,'2':<ChessPiece type="pawn" color="white" position='a1' />,'3':null,'4':null,'5':null,'6':null,'7':null,'8':null},
            'c':{'1':<ChessPiece type="bishop" color="white" position='a1' />,'2':<ChessPiece type="pawn" color="white" position='a1' />,'3':null,'4':null,'5':null,'6':null,'7':null,'8':null},
            'd':{'1':<ChessPiece type="king" color="white" position='a1' />,'2':<ChessPiece type="pawn" color="white" position='a1' />,'3':null,'4':null,'5':null,'6':null,'7':null,'8':null},
            'e':{'1':<ChessPiece type="queen" color="white" position='a1' />,'2':<ChessPiece type="pawn" color="white" position='a1' />,'3':null,'4':null,'5':null,'6':null,'7':null,'8':null},
            'f':{'1':<ChessPiece type="bishop" color="white" position='a1' />,'2':<ChessPiece type="pawn" color="white" position='a1' />,'3':null,'4':null,'5':null,'6':null,'7':null,'8':null},
            'g':{'1':<ChessPiece type="knight" color="white" position='a1' />,'2':<ChessPiece type="pawn" color="white" position='a1' />,'3':null,'4':null,'5':null,'6':null,'7':null,'8':null},
            'h':{'1':<ChessPiece type="rook" color="white" position='a1' />,'2':<ChessPiece type="pawn" color="white" position='a1' />,'3':null,'4':null,'5':null,'6':null,'7':null,'8':null}
            }
        }
    }

    render() {
        return(
            <div>
                <table className="chessBoard">
                    <tr className="chessRow">
                        <td className="squareWhite" id="0">{this.state.board['a']['8']}</td>
                        <td className="squareBlack" id="1">{this.state.board['b']['8']}</td>
                        <td className="squareWhite" id="2">{this.state.board['c']['8']}</td>
                        <td className="squareBlack" id="3">{this.state.board['d']['8']}</td>
                        <td className="squareWhite" id="4">{this.state.board['e']['8']}</td>
                        <td className="squareBlack" id="5">{this.state.board['f']['8']}</td>
                        <td className="squareWhite" id="6">{this.state.board['g']['8']}</td>
                        <td className="squareBlack" id="7">{this.state.board['h']['8']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareBlack" id="8">{this.state.board['a']['7']}</td>
                        <td className="squareWhite" id="9">{this.state.board['b']['7']}</td>
                        <td className="squareBlack" id="10">{this.state.board['c']['7']}</td>
                        <td className="squareWhite" id="11">{this.state.board['d']['7']}</td>
                        <td className="squareBlack" id="12">{this.state.board['e']['7']}</td>
                        <td className="squareWhite" id="13">{this.state.board['f']['7']}</td>
                        <td className="squareBlack" id="14">{this.state.board['g']['7']}</td>
                        <td className="squareWhite" id="15">{this.state.board['h']['7']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareWhite" id="16">{this.state.board['a']['6']}</td>
                        <td className="squareBlack" id="17">{this.state.board['b']['6']}</td>
                        <td className="squareWhite" id="18">{this.state.board['c']['6']}</td>
                        <td className="squareBlack" id="19">{this.state.board['d']['6']}</td>
                        <td className="squareWhite" id="20">{this.state.board['e']['6']}</td>
                        <td className="squareBlack" id="21">{this.state.board['f']['6']}</td>
                        <td className="squareWhite" id="22">{this.state.board['g']['6']}</td>
                        <td className="squareBlack" id="23">{this.state.board['h']['6']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareBlack" id="24">{this.state.board['a']['5']}</td>
                        <td className="squareWhite" id="25">{this.state.board['b']['5']}</td>
                        <td className="squareBlack" id="26">{this.state.board['c']['5']}</td>
                        <td className="squareWhite" id="27">{this.state.board['d']['5']}</td>
                        <td className="squareBlack" id="28">{this.state.board['e']['5']}</td>
                        <td className="squareWhite" id="29">{this.state.board['f']['5']}</td>
                        <td className="squareBlack" id="30">{this.state.board['g']['5']}</td>
                        <td className="squareWhite" id="31">{this.state.board['h']['5']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareWhite" id="32">{this.state.board['a']['4']}</td>
                        <td className="squareBlack" id="33">{this.state.board['b']['4']}</td>
                        <td className="squareWhite" id="34">{this.state.board['c']['4']}</td>
                        <td className="squareBlack" id="35">{this.state.board['d']['4']}</td>
                        <td className="squareWhite" id="36">{this.state.board['e']['4']}</td>
                        <td className="squareBlack" id="37">{this.state.board['f']['4']}</td>
                        <td className="squareWhite" id="38">{this.state.board['g']['4']}</td>
                        <td className="squareBlack" id="39">{this.state.board['h']['4']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareBlack" id="40">{this.state.board['a']['3']}</td>
                        <td className="squareWhite" id="41">{this.state.board['b']['3']}</td>
                        <td className="squareBlack" id="42">{this.state.board['c']['3']}</td>
                        <td className="squareWhite" id="43">{this.state.board['d']['3']}</td>
                        <td className="squareBlack" id="44">{this.state.board['e']['3']}</td>
                        <td className="squareWhite" id="45">{this.state.board['f']['3']}</td>
                        <td className="squareBlack" id="46">{this.state.board['g']['3']}</td>
                        <td className="squareWhite" id="47">{this.state.board['h']['3']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareWhite" id="48">{this.state.board['a']['2']}</td>
                        <td className="squareBlack" id="49">{this.state.board['b']['2']}</td>
                        <td className="squareWhite" id="50">{this.state.board['c']['2']}</td>
                        <td className="squareBlack" id="51">{this.state.board['d']['2']}</td>
                        <td className="squareWhite" id="52">{this.state.board['e']['2']}</td>
                        <td className="squareBlack" id="53">{this.state.board['f']['2']}</td>
                        <td className="squareWhite" id="54">{this.state.board['g']['2']}</td>
                        <td className="squareBlack" id="55">{this.state.board['h']['2']}</td>
                    </tr>
                    <tr className="chessRow">
                        <td className="squareBlack" id="56">{this.state.board['a']['1']}</td>
                        <td className="squareWhite" id="57">{this.state.board['b']['1']}</td>
                        <td className="squareBlack" id="58">{this.state.board['c']['1']}</td>
                        <td className="squareWhite" id="59">{this.state.board['d']['1']}</td>
                        <td className="squareBlack" id="60">{this.state.board['e']['1']}</td>
                        <td className="squareWhite" id="61">{this.state.board['f']['1']}</td>
                        <td className="squareBlack" id="62">{this.state.board['g']['1']}</td>
                        <td className="squareWhite" id="63">{this.state.board['h']['1']}</td>
                    </tr>
                </table>
            </div>
        )
    }
}

export default ChessBoard;