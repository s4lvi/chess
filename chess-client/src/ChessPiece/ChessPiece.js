import * as React from "react"
import img from '../images/pawnB.png'
class ChessPiece extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            position: props.position,
            x: null,
            y: null,
            alive: true
        }
    }

    render() {
        return(<div className="chessPiece">
            <img src={img} alt="chess piece" />
        </div>)
    }
}

export default ChessPiece;