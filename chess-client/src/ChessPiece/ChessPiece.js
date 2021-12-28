import * as React from "react"
import { Images } from "./images";
export class ChessPiece extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            color: props.color,
            image: Images[props.type + props.color],
            x: null,
            y: null,
            alive: true,
            selected: props.selected ? props.selected : false
        }
    }

    render() {
        return(<div className={this.state.selected ? "chessPieceActive" : ""}>
            <img src={this.state.image} alt={this.state.type} />
        </div>)
    }
}

export function getImageForPiece(type, color) {
    return Images[type + color];
}
