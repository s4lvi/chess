import * as React from "react"
const rookImg = require('../images/rookW.png');

class TopBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="TopBar">
                <img src={rookImg} alt="pawn" width="32px" /><p>Salvi's Chess</p>
            </div>
        )
    }
}

export default TopBar;