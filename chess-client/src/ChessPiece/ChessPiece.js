import * as React from "react"
import { Images } from "./images";
class ChessPiece extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            color: props.color,
            position: props.position,
            image: Images[props.type + props.color],
            x: null,
            y: null,
            alive: true
        }
    }

    render() {
        return(<div className="chessPiece">
            <img src={this.state.image} alt={this.state.type} />
        </div>)
    }
}

export default ChessPiece;